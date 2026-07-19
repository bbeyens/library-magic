"""Clean the provided fox FBX and export it as the Runner's boy skin."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import sys

import bpy


ACTION_NAMES = {
    "Armature|run": "FoxRun",
    "Armature|death": "FoxDeath",
    "Armature|idle": "FoxStand",
}
EXPECTED_RUNTIME_ACTIONS = {
    "FoxDeath",
    "FoxIdle",
    "FoxRun",
    "FoxSitToStand",
    "FoxStand",
    "FoxStrafeLeft",
    "FoxStrafeRight",
}


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_glb_json(path: Path) -> dict[str, object]:
    payload = path.read_bytes()
    if payload[:4] != b"glTF":
        raise RuntimeError(f"{path.name}: invalid GLB header")
    json_length = int.from_bytes(payload[12:16], "little")
    return json.loads(payload[20 : 20 + json_length].decode("utf-8").strip())


def animation_duration_seconds(glb: dict[str, object], animation: dict[str, object]) -> float:
    accessors = glb.get("accessors", [])
    return max(
        float(accessors[sampler["input"]]["max"][0])
        for sampler in animation.get("samplers", [])
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--run-source", type=Path)
    parser.add_argument("--idle-source", type=Path)
    parser.add_argument("--stand-up-source", type=Path)
    parser.add_argument("--left-strafe-source", type=Path)
    parser.add_argument("--right-strafe-source", type=Path)
    arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(arguments)


def matrix_delta(left, right) -> float:
    return max(
        abs(left[row][column] - right[row][column])
        for row in range(4)
        for column in range(4)
    )


def world_bone_location(armature, bone_name: str):
    pose_bone = armature.pose.bones.get(bone_name)
    if pose_bone is None:
        raise RuntimeError(f"Animation donor is missing {bone_name}")
    return (armature.matrix_world @ pose_bone.matrix).translation.copy()


def import_animation_donor(
    source: Path,
    runtime_name: str,
    original_bones: dict[str, object],
    label: str,
    *,
    require_loop: bool = True,
) -> tuple[object, dict[str, object]]:
    object_pointers_before = {obj.as_pointer() for obj in bpy.data.objects}
    action_pointers_before = {action.as_pointer() for action in bpy.data.actions}
    if "FINISHED" not in bpy.ops.import_scene.fbx(filepath=str(source), use_anim=True):
        raise RuntimeError(f"Blender could not import the fox {label} donor FBX")

    donor_objects = [
        obj for obj in bpy.data.objects if obj.as_pointer() not in object_pointers_before
    ]
    donor_armatures = [obj for obj in donor_objects if obj.type == "ARMATURE"]
    if len(donor_armatures) != 1:
        raise RuntimeError(f"Expected one {label} donor armature, found {len(donor_armatures)}")
    donor_armature = donor_armatures[0]
    donor_actions = [
        action for action in bpy.data.actions if action.as_pointer() not in action_pointers_before
    ]
    donor_action = (
        donor_armature.animation_data.action
        if donor_armature.animation_data is not None
        else None
    )
    if donor_action is None or donor_action not in donor_actions:
        if len(donor_actions) != 1:
            raise RuntimeError(f"Expected one {label} donor action, found {len(donor_actions)}")
        donor_action = donor_actions[0]

    donor_action_suffix = donor_action.name.split("|", 1)[-1]
    if donor_action_suffix != "mixamo.com|Layer0":
        raise RuntimeError(f"Unexpected fox {label} donor action: {donor_action.name}")
    donor_action_name = f"Armature|{donor_action_suffix}"

    donor_bones = {bone.name: bone for bone in donor_armature.data.bones}
    shared_bones = sorted(set(original_bones) & set(donor_bones))
    if set(original_bones) != set(donor_bones):
        raise RuntimeError(
            f"Fox {label} donor skeleton differs from the runtime fox skeleton: "
            f"fox-only={sorted(set(original_bones) - set(donor_bones))}, "
            f"donor-only={sorted(set(donor_bones) - set(original_bones))}"
        )
    max_bind_delta = max(
        matrix_delta(original_bones[name].matrix_local, donor_bones[name].matrix_local)
        for name in shared_bones
    )
    if max_bind_delta > 0.0001:
        raise RuntimeError(f"Fox {label} donor bind pose drift is too large: {max_bind_delta}")

    frame_start = int(round(donor_action.frame_range[0]))
    frame_end = int(round(donor_action.frame_range[1]))
    bpy.context.scene.frame_set(frame_start)
    start_armature_location = donor_armature.matrix_world.translation.copy()
    start_hips_location = world_bone_location(donor_armature, "mixamorig:Hips")
    bpy.context.scene.frame_set(frame_end)
    end_armature_location = donor_armature.matrix_world.translation.copy()
    end_hips_location = world_bone_location(donor_armature, "mixamorig:Hips")
    root_delta = max(
        (end_armature_location - start_armature_location).length,
        (end_hips_location - start_hips_location).length,
    )
    if require_loop and root_delta > 0.001:
        raise RuntimeError(f"Fox {label} donor is not an in-place loop: {root_delta}")

    donor_action.name = runtime_name
    donor_action.use_fake_user = True
    metadata = {
        "sourceAction": donor_action_name,
        "frameRange": [frame_start, frame_end],
        "boneCount": len(donor_bones),
        "sharedBoneCount": len(shared_bones),
        "maxBindDelta": max_bind_delta,
        "rootDelta": root_delta,
    }
    if require_loop:
        metadata["loopRootDelta"] = root_delta

    if donor_armature.animation_data is not None:
        donor_armature.animation_data_clear()
    for obj in donor_objects:
        bpy.data.objects.remove(obj, do_unlink=True)
    for action in donor_actions:
        if action != donor_action:
            bpy.data.actions.remove(action)
    bpy.ops.outliner.orphans_purge(do_recursive=True)
    return donor_action, metadata


def main() -> None:
    args = parse_args()
    root = project_root()
    source = args.source.expanduser().resolve()
    if not source.is_file():
        raise FileNotFoundError(source)

    export_root = root / "exports" / "runner-fox"
    runtime_root = root / "public" / "assets" / "runner" / "heroes"
    export_root.mkdir(parents=True, exist_ok=True)
    runtime_root.mkdir(parents=True, exist_ok=True)
    preserved_source = export_root / "fox-source.fbx"
    if source != preserved_source.resolve():
        shutil.copy2(source, preserved_source)

    preserved_run_source = export_root / "running-source.fbx"
    run_source = (
        args.run_source.expanduser().resolve()
        if args.run_source is not None
        else preserved_run_source.resolve()
    )
    if not run_source.is_file():
        raise FileNotFoundError(
            f"Fox run donor not found: {run_source}. Pass it with --run-source."
        )
    if run_source != preserved_run_source.resolve():
        shutil.copy2(run_source, preserved_run_source)
    run_source = preserved_run_source.resolve()

    preserved_idle_source = export_root / "sitting-idle-source.fbx"
    idle_source = (
        args.idle_source.expanduser().resolve()
        if args.idle_source is not None
        else preserved_idle_source.resolve()
    )
    if not idle_source.is_file():
        raise FileNotFoundError(
            f"Fox sitting idle donor not found: {idle_source}. Pass it with --idle-source."
        )
    if idle_source != preserved_idle_source.resolve():
        shutil.copy2(idle_source, preserved_idle_source)
    idle_source = preserved_idle_source.resolve()

    preserved_stand_up_source = export_root / "stand-up-source.fbx"
    stand_up_source = (
        args.stand_up_source.expanduser().resolve()
        if args.stand_up_source is not None
        else preserved_stand_up_source.resolve()
    )
    if not stand_up_source.is_file():
        raise FileNotFoundError(
            f"Fox stand-up donor not found: {stand_up_source}. Pass it with --stand-up-source."
        )
    if stand_up_source != preserved_stand_up_source.resolve():
        shutil.copy2(stand_up_source, preserved_stand_up_source)
    stand_up_source = preserved_stand_up_source.resolve()

    preserved_left_strafe_source = export_root / "left-strafe-source.fbx"
    left_strafe_source = (
        args.left_strafe_source.expanduser().resolve()
        if args.left_strafe_source is not None
        else preserved_left_strafe_source.resolve()
    )
    if not left_strafe_source.is_file():
        raise FileNotFoundError(
            f"Fox left-strafe donor not found: {left_strafe_source}. Pass it with --left-strafe-source."
        )
    if left_strafe_source != preserved_left_strafe_source.resolve():
        shutil.copy2(left_strafe_source, preserved_left_strafe_source)
    left_strafe_source = preserved_left_strafe_source.resolve()

    preserved_right_strafe_source = export_root / "right-strafe-source.fbx"
    right_strafe_source = (
        args.right_strafe_source.expanduser().resolve()
        if args.right_strafe_source is not None
        else preserved_right_strafe_source.resolve()
    )
    if not right_strafe_source.is_file():
        raise FileNotFoundError(
            f"Fox right-strafe donor not found: {right_strafe_source}. Pass it with --right-strafe-source."
        )
    if right_strafe_source != preserved_right_strafe_source.resolve():
        shutil.copy2(right_strafe_source, preserved_right_strafe_source)
    right_strafe_source = preserved_right_strafe_source.resolve()

    bpy.ops.wm.read_factory_settings(use_empty=True)
    if "FINISHED" not in bpy.ops.import_scene.fbx(filepath=str(source), use_anim=True):
        raise RuntimeError("Blender could not import the fox FBX")

    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    if len(armatures) != 1:
        raise RuntimeError(f"Expected one fox armature, found {len(armatures)}")
    armature = armatures[0]
    armature.name = "Armature"
    armature.data.name = "Armature"

    rigged_meshes = [
        obj
        for obj in bpy.context.scene.objects
        if obj.type == "MESH"
        and (
            obj.parent == armature
            or any(modifier.type == "ARMATURE" and modifier.object == armature for modifier in obj.modifiers)
        )
    ]
    if len(rigged_meshes) != 3:
        raise RuntimeError(f"Expected three rigged fox mesh parts, found {len(rigged_meshes)}")

    keep = {armature, *rigged_meshes}
    for obj in list(bpy.context.scene.objects):
        if obj not in keep:
            bpy.data.objects.remove(obj, do_unlink=True)

    bpy.ops.object.select_all(action="DESELECT")
    for mesh in rigged_meshes:
        mesh.select_set(True)
    bpy.context.view_layer.objects.active = rigged_meshes[0]
    bpy.ops.object.join()
    fox = bpy.context.view_layer.objects.active
    if fox is None or fox.type != "MESH":
        raise RuntimeError("Could not join the fox mesh parts")
    fox.name = "Fox"
    fox.data.name = "Fox"

    exported_actions = []
    original_run = None
    for action in list(bpy.data.actions):
        target_name = ACTION_NAMES.get(action.name)
        if target_name is None:
            bpy.data.actions.remove(action)
            continue
        if target_name == "FoxRun":
            original_run = action
            continue
        action.name = target_name
        action.use_fake_user = True
        exported_actions.append(action)
    if original_run is None or {action.name for action in exported_actions} != {"FoxDeath", "FoxStand"}:
        raise RuntimeError("Fox FBX is missing run, death, or idle animation")
    bpy.data.actions.remove(original_run)

    original_bones = {bone.name: bone for bone in armature.data.bones}
    run_action, run_replacement = import_animation_donor(
        run_source,
        "FoxRun",
        original_bones,
        "run",
    )
    idle_action, idle_replacement = import_animation_donor(
        idle_source,
        "FoxIdle",
        original_bones,
        "sitting idle",
    )
    stand_up_action, stand_up_replacement = import_animation_donor(
        stand_up_source,
        "FoxSitToStand",
        original_bones,
        "stand up",
        require_loop=False,
    )
    left_strafe_action, left_strafe_replacement = import_animation_donor(
        left_strafe_source,
        "FoxStrafeLeft",
        original_bones,
        "left strafe",
    )
    right_strafe_action, right_strafe_replacement = import_animation_donor(
        right_strafe_source,
        "FoxStrafeRight",
        original_bones,
        "right strafe",
    )
    exported_actions.extend(
        (run_action, idle_action, stand_up_action, left_strafe_action, right_strafe_action)
    )

    if armature.animation_data is None:
        armature.animation_data_create()
    armature.animation_data.action = run_action
    for action in list(bpy.data.actions):
        if action not in exported_actions:
            bpy.data.actions.remove(action)
    bpy.ops.outliner.orphans_purge(do_recursive=True)

    frame_starts = [action.frame_range[0] for action in exported_actions]
    frame_ends = [action.frame_range[1] for action in exported_actions]
    bpy.context.scene.frame_start = int(min(frame_starts))
    bpy.context.scene.frame_end = int(max(frame_ends))

    blend_path = export_root / "fox.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

    bpy.ops.object.select_all(action="DESELECT")
    fox.select_set(True)
    armature.select_set(True)
    bpy.context.view_layer.objects.active = armature
    output = runtime_root / "boy.glb"
    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        use_selection=True,
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_force_sampling=True,
        export_optimize_animation_size=True,
        export_anim_single_armature=True,
        export_skins=True,
        export_morph=False,
        export_materials="EXPORT",
        export_lights=False,
        export_cameras=False,
    )

    glb = read_glb_json(output)
    animation_names = sorted(animation.get("name") for animation in glb.get("animations", []))
    if len(glb.get("meshes", [])) != 1 or len(glb.get("skins", [])) != 1:
        raise RuntimeError("Fox runtime GLB must contain one mesh and one skin")
    if animation_names != sorted(EXPECTED_RUNTIME_ACTIONS):
        raise RuntimeError(f"Fox animation export failed: {animation_names}")
    if len(glb.get("materials", [])) != 3:
        raise RuntimeError("Fox animation replacement changed the three runtime materials")

    run_animation = next(
        animation for animation in glb.get("animations", []) if animation.get("name") == "FoxRun"
    )
    idle_animation = next(
        animation for animation in glb.get("animations", []) if animation.get("name") == "FoxIdle"
    )
    stand_up_animation = next(
        animation
        for animation in glb.get("animations", [])
        if animation.get("name") == "FoxSitToStand"
    )
    left_strafe_animation = next(
        animation
        for animation in glb.get("animations", [])
        if animation.get("name") == "FoxStrafeLeft"
    )
    right_strafe_animation = next(
        animation
        for animation in glb.get("animations", [])
        if animation.get("name") == "FoxStrafeRight"
    )

    report = {
        "source": str(preserved_source.relative_to(root)),
        "sourceBytes": preserved_source.stat().st_size,
        "sourceSha256": sha256(preserved_source),
        "runSource": str(preserved_run_source.relative_to(root)),
        "runSourceBytes": preserved_run_source.stat().st_size,
        "runSourceSha256": sha256(preserved_run_source),
        "runReplacement": {
            **run_replacement,
            "runtimeChannelCount": len(run_animation.get("channels", [])),
        },
        "idleSource": str(preserved_idle_source.relative_to(root)),
        "idleSourceBytes": preserved_idle_source.stat().st_size,
        "idleSourceSha256": sha256(preserved_idle_source),
        "idleReplacement": {
            **idle_replacement,
            "runtimeChannelCount": len(idle_animation.get("channels", [])),
        },
        "standUpSource": str(preserved_stand_up_source.relative_to(root)),
        "standUpSourceBytes": preserved_stand_up_source.stat().st_size,
        "standUpSourceSha256": sha256(preserved_stand_up_source),
        "standUpReplacement": {
            **stand_up_replacement,
            "runtimeChannelCount": len(stand_up_animation.get("channels", [])),
            "runtimeDurationSeconds": animation_duration_seconds(glb, stand_up_animation),
        },
        "leftStrafeSource": str(preserved_left_strafe_source.relative_to(root)),
        "leftStrafeSourceBytes": preserved_left_strafe_source.stat().st_size,
        "leftStrafeSourceSha256": sha256(preserved_left_strafe_source),
        "leftStrafeReplacement": {
            **left_strafe_replacement,
            "runtimeChannelCount": len(left_strafe_animation.get("channels", [])),
            "runtimeDurationSeconds": animation_duration_seconds(glb, left_strafe_animation),
        },
        "rightStrafeSource": str(preserved_right_strafe_source.relative_to(root)),
        "rightStrafeSourceBytes": preserved_right_strafe_source.stat().st_size,
        "rightStrafeSourceSha256": sha256(preserved_right_strafe_source),
        "rightStrafeReplacement": {
            **right_strafe_replacement,
            "runtimeChannelCount": len(right_strafe_animation.get("channels", [])),
            "runtimeDurationSeconds": animation_duration_seconds(glb, right_strafe_animation),
        },
        "blend": str(blend_path.relative_to(root)),
        "output": str(output.relative_to(root)),
        "outputBytes": output.stat().st_size,
        "outputSha256": sha256(output),
        "meshCount": len(glb.get("meshes", [])),
        "skinCount": len(glb.get("skins", [])),
        "materialCount": len(glb.get("materials", [])),
        "animations": animation_names,
        "boneCount": len(armature.data.bones),
        "polygonCount": len(fox.data.polygons),
    }
    (export_root / "export-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("FOX_EXPORT=" + json.dumps(report, sort_keys=True))


if __name__ == "__main__":
    main()
