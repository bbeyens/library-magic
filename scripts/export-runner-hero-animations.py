from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import struct
import sys

import bpy


EXPECTED_BONES = (
    "root", "pelvis", "thigh_l", "calf_l", "foot_l", "ball_l", "spine_01",
    "spine_02", "spine_03", "neck_01", "head", "clavicle_l", "upperarm_l",
    "lowerarm_l", "hand_l", "index_01_l", "index_02_l", "index_03_l",
    "thumb_01_l", "thumb_02_l", "thumb_03_l", "weapon_l", "shoulderPadJoint_l",
    "CloakBone01", "CloakBone02", "CloakBone03", "BackpackBone", "clavicle_r",
    "upperarm_r", "lowerarm_r", "hand_r", "index_01_r", "index_02_r",
    "index_03_r", "thumb_01_r", "thumb_02_r", "thumb_03_r", "weapon_r",
    "shoulderPadJoint_r", "thigh_r", "calf_r", "foot_r", "ball_r",
)

SPECS = {
    "sit-to-stand": ("RunnerSitToStand", "sit-to-stand.glb"),
    "stand-to-sit": ("RunnerStandToSit", "stand-to-sit.glb"),
    "injured-run": ("RunnerInjuredRun", "injured-run.glb"),
    "standard-run": ("RunnerStandardRun", "standard-run.glb"),
    "fall-flat": ("RunnerFallFlat", "fall-flat.glb"),
}


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    for slug in SPECS:
        parser.add_argument(f"--{slug}-source", type=Path)
    separator = sys.argv.index("--") + 1 if "--" in sys.argv else len(sys.argv)
    return parser.parse_args(sys.argv[separator:])


def read_glb_json(path: Path) -> dict[str, object]:
    data = path.read_bytes()
    if data[:4] != b"glTF":
        raise RuntimeError(f"Invalid GLB header: {path}")
    json_length = struct.unpack_from("<I", data, 12)[0]
    return json.loads(data[20 : 20 + json_length].decode("utf-8").rstrip(" \t\r\n\0"))


def preserve_source(source: Path | None, canonical: Path) -> Path:
    canonical.parent.mkdir(parents=True, exist_ok=True)
    if source is None:
        if not canonical.exists():
            raise FileNotFoundError(f"Missing source animation: {canonical}")
        return canonical
    resolved = source.expanduser().resolve()
    if not resolved.exists():
        raise FileNotFoundError(f"Missing source animation: {resolved}")
    if resolved != canonical.resolve():
        shutil.copy2(resolved, canonical)
    return canonical


def export_animation(slug: str, source: Path, output: Path) -> dict[str, object]:
    clip_name, _ = SPECS[slug]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if "FINISHED" not in bpy.ops.import_scene.fbx(filepath=str(source), use_anim=True):
        raise RuntimeError(f"Blender could not import {source}")

    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    if len(armatures) != 1:
        raise RuntimeError(f"{source.name}: expected one armature, found {len(armatures)}")
    armature = armatures[0]
    bone_names = tuple(bone.name for bone in armature.data.bones)
    if bone_names != EXPECTED_BONES:
        raise RuntimeError(f"{source.name}: skeleton does not match the shipping Runner heroes")
    if not armature.animation_data or not armature.animation_data.action:
        raise RuntimeError(f"{source.name}: no active animation action")

    action = armature.animation_data.action
    action.name = clip_name
    armature.name = "Armature"
    armature.data.name = "Armature"
    for obj in list(bpy.context.scene.objects):
        if obj != armature:
            bpy.data.objects.remove(obj, do_unlink=True)

    bpy.ops.object.select_all(action="DESELECT")
    armature.select_set(True)
    bpy.context.view_layer.objects.active = armature
    bpy.context.scene.frame_start = int(action.frame_range[0])
    bpy.context.scene.frame_end = int(action.frame_range[1])
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        use_selection=True,
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_force_sampling=True,
        export_frame_range=True,
        export_optimize_animation_size=True,
        export_anim_single_armature=True,
        export_skins=False,
        export_morph=False,
        export_lights=False,
        export_cameras=False,
    )

    glb = read_glb_json(output)
    animations = glb.get("animations", [])
    if len(animations) != 1 or animations[0].get("name") != clip_name:
        raise RuntimeError(f"{output.name}: exported clip contract failed")
    if glb.get("meshes") or glb.get("skins"):
        raise RuntimeError(f"{output.name}: animation-only export contains geometry")

    return {
        "id": slug,
        "source": str(source.relative_to(project_root())),
        "sourceBytes": source.stat().st_size,
        "sourceSha256": sha256(source),
        "sourceFrames": [float(action.frame_range[0]), float(action.frame_range[1])],
        "boneCount": len(bone_names),
        "clip": clip_name,
        "output": str(output.relative_to(project_root())),
        "outputBytes": output.stat().st_size,
        "outputSha256": sha256(output),
        "channelCount": len(animations[0].get("channels", [])),
    }


def main() -> None:
    args = parse_args()
    root = project_root()
    intake_root = root / "exports" / "runner-mixamo" / "shared" / "animations"
    output_root = root / "public" / "assets" / "runner" / "heroes"
    assets = []
    for slug, (_, output_name) in SPECS.items():
        source = preserve_source(
            getattr(args, f"{slug.replace('-', '_')}_source"),
            intake_root / f"{slug}-source.fbx",
        )
        assets.append(export_animation(slug, source, output_root / output_name))

    report = {"pipeline": "runner-shared-animation-only-v1", "assets": assets}
    report_path = root / "exports" / "runner-mixamo" / "hero-animation-report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=True))


if __name__ == "__main__":
    main()
