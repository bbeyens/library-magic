from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys
import zipfile

import bpy
from mathutils import Vector


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def clean_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def character_parts() -> tuple[bpy.types.Object, list[bpy.types.Object]]:
    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    if len(armatures) != 1:
        raise RuntimeError(f"Expected one Fox armature, found {len(armatures)}")
    armature = armatures[0]
    meshes = [
        obj
        for obj in bpy.context.scene.objects
        if obj.type == "MESH"
        and (
            obj.parent == armature
            or any(modifier.type == "ARMATURE" and modifier.object == armature for modifier in obj.modifiers)
        )
    ]
    if len(meshes) != 3:
        raise RuntimeError(f"Expected three rigged Fox mesh parts, found {len(meshes)}")
    return armature, meshes


def remove_non_character_objects(
    armature: bpy.types.Object, meshes: list[bpy.types.Object]
) -> None:
    keep = {armature, *meshes}
    for obj in list(bpy.context.scene.objects):
        if obj not in keep:
            bpy.data.objects.remove(obj, do_unlink=True)


def clear_animations() -> None:
    for obj in bpy.context.scene.objects:
        obj.animation_data_clear()
        if obj.type == "MESH" and obj.data.shape_keys:
            obj.data.shape_keys.animation_data_clear()
    for action in list(bpy.data.actions):
        bpy.data.actions.remove(action)


def join_meshes(meshes: list[bpy.types.Object]) -> bpy.types.Object:
    bpy.ops.object.select_all(action="DESELECT")
    for mesh in meshes:
        mesh.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    fox = bpy.context.view_layer.objects.active
    if fox is None or fox.type != "MESH":
        raise RuntimeError("Could not join Fox mesh parts")
    fox.name = "Fox"
    fox.data.name = "Fox"
    return fox


def bounds(meshes: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    bpy.context.view_layer.update()
    corners = [mesh.matrix_world @ Vector(corner) for mesh in meshes for corner in mesh.bound_box]
    minimum = Vector(tuple(min(corner[index] for corner in corners) for index in range(3)))
    maximum = Vector(tuple(max(corner[index] for corner in corners) for index in range(3)))
    return minimum, maximum


def ground_and_center(armature: bpy.types.Object, mesh: bpy.types.Object) -> tuple[Vector, Vector]:
    minimum, maximum = bounds([mesh])
    armature.location.x -= (minimum.x + maximum.x) * 0.5
    armature.location.y -= (minimum.y + maximum.y) * 0.5
    armature.location.z -= minimum.z
    bpy.context.view_layer.update()
    return bounds([mesh])


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(mesh: bpy.types.Object, minimum: Vector, maximum: Vector, output: Path) -> None:
    center = (minimum + maximum) * 0.5
    height = max(0.01, maximum.z - minimum.z)

    camera_data = bpy.data.cameras.new("ValidationCamera")
    camera = bpy.data.objects.new("ValidationCamera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = center + Vector((0, -height * 3.1, height * 0.18))
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = height * 1.15
    look_at(camera, center)
    bpy.context.scene.camera = camera

    for name, location, energy, size in (
        ("ValidationKey", center + Vector((-height * 1.6, -height * 2.0, height * 2.2)), 900.0, 4.0),
        ("ValidationFill", center + Vector((height * 1.8, -height * 0.7, height * 1.2)), 550.0, 3.0),
    ):
        light_data = bpy.data.lights.new(name, "AREA")
        light_data.energy = energy
        light_data.shape = "DISK"
        light_data.size = size
        light = bpy.data.objects.new(name, light_data)
        bpy.context.scene.collection.objects.link(light)
        light.location = location
        look_at(light, center)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 384
    scene.render.resolution_y = 384
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.render.filepath = str(output)
    scene.view_settings.look = "AgX - Medium High Contrast"
    bpy.ops.render.render(write_still=True)


def export_clean_fbx(source: Path, output: Path) -> dict[str, object]:
    clean_scene()
    result = bpy.ops.import_scene.fbx(filepath=str(source), use_anim=True)
    if "FINISHED" not in result:
        raise RuntimeError("Blender could not import the Fox source FBX")

    armature, meshes = character_parts()
    remove_non_character_objects(armature, meshes)
    armature.name = "Armature"
    armature.data.name = "Armature"
    armature.data.pose_position = "REST"
    clear_animations()
    fox = join_meshes(meshes)
    minimum, maximum = ground_and_center(armature, fox)

    bpy.ops.object.select_all(action="DESELECT")
    armature.select_set(True)
    fox.select_set(True)
    bpy.context.view_layer.objects.active = armature
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.fbx(
        filepath=str(output),
        use_selection=True,
        object_types={"ARMATURE", "MESH"},
        apply_unit_scale=True,
        apply_scale_options="FBX_SCALE_ALL",
        axis_forward="-Z",
        axis_up="Y",
        use_mesh_modifiers=True,
        add_leaf_bones=False,
        use_armature_deform_only=True,
        bake_anim=False,
        path_mode="COPY",
        embed_textures=True,
    )
    return {
        "sourceSha256": sha256(source),
        "vertexCount": len(fox.data.vertices),
        "polygonCount": len(fox.data.polygons),
        "boneCount": len(armature.data.bones),
        "materialCount": len(fox.material_slots),
        "dimensionsMeters": [round(maximum[index] - minimum[index], 4) for index in range(3)],
        "groundedMinZ": round(minimum.z, 4),
        "embeddedAnimationCount": 0,
    }


def validate_fbx(path: Path, preview: Path) -> dict[str, object]:
    clean_scene()
    result = bpy.ops.import_scene.fbx(filepath=str(path), use_anim=True)
    if "FINISHED" not in result:
        raise RuntimeError("Blender could not reimport fox-mixamo.fbx")

    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if len(armatures) != 1 or len(meshes) != 1:
        raise RuntimeError(f"Unexpected Fox contents: {len(armatures)} armature(s), {len(meshes)} mesh(es)")
    armature = armatures[0]
    fox = meshes[0]
    minimum, maximum = bounds([fox])
    action_count = len(bpy.data.actions)
    if action_count != 0:
        raise RuntimeError(f"Fox export contains {action_count} unwanted animation(s)")
    if len(armature.data.bones) != 33:
        raise RuntimeError(f"Fox export should keep 33 bones, found {len(armature.data.bones)}")
    if len(fox.material_slots) != 3:
        raise RuntimeError(f"Fox export should keep 3 materials, found {len(fox.material_slots)}")
    if abs(minimum.z) > 0.01:
        raise RuntimeError(f"Fox export is not grounded: min Z={minimum.z:.4f}")
    height = maximum.z - minimum.z
    width = maximum.x - minimum.x
    if width < height * 0.7:
        raise RuntimeError("Fox rest pose does not have enough arm separation for Mixamo")

    render_preview(fox, minimum, maximum, preview)
    return {
        "reimported": True,
        "meshCount": 1,
        "vertexCount": len(fox.data.vertices),
        "polygonCount": len(fox.data.polygons),
        "boneCount": len(armature.data.bones),
        "animationCount": action_count,
        "materialCount": len(fox.material_slots),
        "dimensionsMeters": [round(maximum[index] - minimum[index], 4) for index in range(3)],
        "groundedMinZ": round(minimum.z, 4),
        "previewRendered": preview.exists(),
    }


def main() -> None:
    root = project_root()
    output_root = (
        Path(sys.argv[sys.argv.index("--") + 1]).resolve()
        if "--" in sys.argv and len(sys.argv) > sys.argv.index("--") + 1
        else root / "exports" / "runner-mixamo" / "fox"
    )
    output_root.mkdir(parents=True, exist_ok=True)
    source = root / "exports" / "runner-fox" / "fox-source.fbx"
    runtime = root / "public" / "assets" / "runner" / "heroes" / "boy.glb"
    blend_source = root / "exports" / "runner-fox" / "fox.blend"
    protected = (source, runtime, blend_source)
    hashes_before = {str(path.relative_to(root)): sha256(path) for path in protected}

    fbx = output_root / "fox-mixamo.fbx"
    preview = output_root / "fox-mixamo-preview.png"
    export_data = export_clean_fbx(source, fbx)
    validation = validate_fbx(fbx, preview)

    readme = output_root / "README.txt"
    readme.write_text(
        "Fox - Runner / Mixamo\n\n"
        "Upload fox-mixamo.fbx directly to Mixamo. It preserves the original Mixamo skin and skeleton "
        "in a clean T-pose, with no animation clip. The orange, white and brown appearance uses three "
        "embedded FBX materials rather than external texture images.\n",
        encoding="utf-8",
    )

    hashes_after = {str(path.relative_to(root)): sha256(path) for path in protected}
    if hashes_before != hashes_after:
        raise RuntimeError("A protected Fox source or runtime asset changed during export")

    report = {
        "character": "fox",
        "format": "FBX Binary",
        "mixamoPurpose": "rigged T-pose character without animation clip",
        "source": str(source.relative_to(root)),
        "export": export_data,
        "validation": validation,
        "protectedAssetsUnchanged": True,
        "protectedSha256": hashes_after,
        "files": {
            fbx.name: {"bytes": fbx.stat().st_size, "sha256": sha256(fbx)},
            preview.name: {"bytes": preview.stat().st_size, "sha256": sha256(preview)},
        },
    }
    manifest = output_root / "manifest.json"
    manifest.write_text(json.dumps(report, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")

    zip_path = output_root.parent / "fox-mixamo.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for child in sorted(output_root.iterdir()):
            archive.write(child, arcname=f"fox-mixamo/{child.name}")

    report["zip"] = {
        "path": str(zip_path.relative_to(root)),
        "bytes": zip_path.stat().st_size,
        "sha256": sha256(zip_path),
    }
    manifest.write_text(json.dumps(report, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=True))


if __name__ == "__main__":
    main()
