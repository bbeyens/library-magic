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


def bounds(mesh: bpy.types.Object) -> tuple[Vector, Vector]:
    bpy.context.view_layer.update()
    corners = [mesh.matrix_world @ Vector(corner) for corner in mesh.bound_box]
    minimum = Vector(tuple(min(corner[index] for corner in corners) for index in range(3)))
    maximum = Vector(tuple(max(corner[index] for corner in corners) for index in range(3)))
    return minimum, maximum


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(mesh: bpy.types.Object, minimum: Vector, maximum: Vector, output: Path) -> None:
    center = (minimum + maximum) * 0.5
    height = max(0.01, maximum.z - minimum.z)

    camera_data = bpy.data.cameras.new("ValidationCamera")
    camera = bpy.data.objects.new("ValidationCamera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = center + Vector((0, -height * 3.0, height * 0.15))
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = height * 1.18
    look_at(camera, center)
    bpy.context.scene.camera = camera

    for name, location, energy, size, color in (
        ("ValidationKey", center + Vector((-height * 1.6, -height * 2.0, height * 2.2)), 1050.0, 4.0, (1.0, 0.58, 0.48)),
        ("ValidationFill", center + Vector((height * 1.8, -height * 0.7, height * 1.2)), 700.0, 3.0, (0.48, 0.58, 1.0)),
    ):
        light_data = bpy.data.lights.new(name, "AREA")
        light_data.energy = energy
        light_data.shape = "DISK"
        light_data.size = size
        light_data.color = color
        light = bpy.data.objects.new(name, light_data)
        bpy.context.scene.collection.objects.link(light)
        light.location = location
        look_at(light, center)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.render.filepath = str(output)
    scene.view_settings.look = "AgX - Medium High Contrast"
    bpy.ops.render.render(write_still=True)


def clear_animation_data() -> None:
    for obj in bpy.context.scene.objects:
        obj.animation_data_clear()
        if obj.type == "MESH" and obj.data.shape_keys:
            obj.data.shape_keys.animation_data_clear()
    for action in list(bpy.data.actions):
        bpy.data.actions.remove(action)


def prepare_mesh(blend_source: Path) -> bpy.types.Object:
    bpy.ops.wm.open_mainfile(filepath=str(blend_source))
    demon = bpy.data.objects.get("Demongirl")
    if demon is None or demon.type != "MESH":
        raise RuntimeError("Processed Demongirl mesh is missing")

    clear_animation_data()
    world_matrix = demon.matrix_world.copy()
    demon.parent = None
    demon.matrix_world = world_matrix
    for obj in list(bpy.context.scene.objects):
        if obj != demon:
            bpy.data.objects.remove(obj, do_unlink=True)

    bpy.ops.object.select_all(action="DESELECT")
    demon.select_set(True)
    bpy.context.view_layer.objects.active = demon
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    minimum, maximum = bounds(demon)
    demon.location.x -= (minimum.x + maximum.x) * 0.5
    demon.location.y -= (minimum.y + maximum.y) * 0.5
    demon.location.z -= minimum.z
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)
    return demon


def export_clean_fbx(blend_source: Path, output: Path) -> dict[str, object]:
    demon = prepare_mesh(blend_source)
    minimum, maximum = bounds(demon)
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.fbx(
        filepath=str(output),
        use_selection=True,
        object_types={"MESH"},
        apply_unit_scale=True,
        apply_scale_options="FBX_SCALE_ALL",
        axis_forward="-Z",
        axis_up="Y",
        use_mesh_modifiers=True,
        bake_anim=False,
        path_mode="COPY",
        embed_textures=True,
    )
    return {
        "sourceSha256": sha256(blend_source),
        "vertexCount": len(demon.data.vertices),
        "polygonCount": len(demon.data.polygons),
        "armatureCount": 0,
        "materialCount": len(demon.material_slots),
        "dimensionsMeters": [round(maximum[index] - minimum[index], 4) for index in range(3)],
        "groundedMinZ": round(minimum.z, 4),
        "embeddedAnimationCount": 0,
    }


def validate_fbx(path: Path, preview: Path) -> dict[str, object]:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    result = bpy.ops.import_scene.fbx(filepath=str(path), use_anim=True)
    if "FINISHED" not in result:
        raise RuntimeError("Blender could not reimport demongirl-mixamo.fbx")

    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    if len(meshes) != 1 or armatures:
        raise RuntimeError(f"Unexpected Demongirl contents: {len(meshes)} mesh(es), {len(armatures)} armature(s)")
    demon = meshes[0]
    minimum, maximum = bounds(demon)
    action_count = len(bpy.data.actions)
    if action_count != 0:
        raise RuntimeError(f"Demongirl export contains {action_count} unwanted animation(s)")
    if len(demon.material_slots) != 7:
        raise RuntimeError(f"Demongirl export should keep 7 materials, found {len(demon.material_slots)}")
    if abs(minimum.z) > 0.01:
        raise RuntimeError(f"Demongirl export is not grounded: min Z={minimum.z:.4f}")

    render_preview(demon, minimum, maximum, preview)
    return {
        "reimported": True,
        "meshCount": 1,
        "vertexCount": len(demon.data.vertices),
        "polygonCount": len(demon.data.polygons),
        "armatureCount": 0,
        "animationCount": action_count,
        "materialCount": len(demon.material_slots),
        "dimensionsMeters": [round(maximum[index] - minimum[index], 4) for index in range(3)],
        "groundedMinZ": round(minimum.z, 4),
        "previewRendered": preview.exists(),
        "mixamoAutorigWarning": "Source silhouette has no clearly separated exposed wrists or elbows.",
    }


def main() -> None:
    root = project_root()
    output_root = (
        Path(sys.argv[sys.argv.index("--") + 1]).resolve()
        if "--" in sys.argv and len(sys.argv) > sys.argv.index("--") + 1
        else root / "exports" / "runner-mixamo" / "demongirl"
    )
    output_root.mkdir(parents=True, exist_ok=True)

    source = root / "exports" / "runner-demongirl" / "demongirl-source.fbx"
    blend_source = root / "exports" / "runner-demongirl" / "demongirl.blend"
    runtime = root / "public" / "assets" / "runner" / "heroes" / "girl.glb"
    protected = (source, blend_source, runtime)
    hashes_before = {str(path.relative_to(root)): sha256(path) for path in protected}

    fbx = output_root / "demongirl-mixamo.fbx"
    preview = output_root / "demongirl-mixamo-preview.png"
    export_data = export_clean_fbx(blend_source, fbx)
    validation = validate_fbx(fbx, preview)

    readme = output_root / "README.txt"
    readme.write_text(
        "Demongirl - Runner / Mixamo\n\n"
        "Upload demongirl-mixamo.fbx to Mixamo. This is an unrigged static mesh with seven embedded "
        "materials and no animation clip, prepared for Mixamo's autorigger.\n\n"
        "Important: the original character silhouette does not expose clearly separated wrists or elbows. "
        "Mixamo may reject or misplace its arm markers. Fixing that requires changing the character geometry, "
        "which this faithful export deliberately does not do.\n",
        encoding="utf-8",
    )

    hashes_after = {str(path.relative_to(root)): sha256(path) for path in protected}
    if hashes_before != hashes_after:
        raise RuntimeError("A protected Demongirl source or runtime asset changed during export")

    report = {
        "character": "demongirl",
        "format": "FBX Binary",
        "mixamoPurpose": "unrigged static character for Mixamo autorig",
        "source": str(blend_source.relative_to(root)),
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

    zip_path = output_root.parent / "demongirl-mixamo.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for child in sorted(output_root.iterdir()):
            archive.write(child, arcname=f"demongirl-mixamo/{child.name}")
    report["zip"] = {
        "path": str(zip_path.relative_to(root)),
        "bytes": zip_path.stat().st_size,
        "sha256": sha256(zip_path),
    }
    manifest.write_text(json.dumps(report, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=True))


if __name__ == "__main__":
    main()
