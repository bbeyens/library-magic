from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
import sys
import zipfile

import bpy
from mathutils import Vector


HEROES = ("boy", "girl")


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


def imported_character() -> tuple[bpy.types.Object, list[bpy.types.Object]]:
    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    if len(armatures) != 1:
        raise RuntimeError(f"Expected one armature, found {len(armatures)}")

    armature = armatures[0]
    meshes = [
        obj
        for obj in bpy.context.scene.objects
        if obj.type == "MESH"
        and any(modifier.type == "ARMATURE" and modifier.object == armature for modifier in obj.modifiers)
    ]
    if not meshes:
        raise RuntimeError("No skinned character mesh found")
    return armature, meshes


def remove_non_character_objects(
    armature: bpy.types.Object, meshes: list[bpy.types.Object]
) -> None:
    keep = {armature, *meshes}
    for obj in list(bpy.context.scene.objects):
        if obj not in keep:
            bpy.data.objects.remove(obj, do_unlink=True)


def clear_animation_data() -> None:
    for obj in bpy.context.scene.objects:
        obj.animation_data_clear()
        if obj.type == "MESH" and obj.data.shape_keys:
            obj.data.shape_keys.animation_data_clear()
    for action in list(bpy.data.actions):
        bpy.data.actions.remove(action)


def assign_texture(meshes: list[bpy.types.Object], texture_path: Path, slug: str) -> None:
    image = bpy.data.images.load(str(texture_path), check_existing=True)
    image.name = "hero-basecolor.png"

    material = bpy.data.materials.new(f"{slug}-mixamo-material")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    principled = nodes.get("Principled BSDF")
    if principled is None:
        raise RuntimeError("Principled BSDF node missing")

    texture = nodes.new("ShaderNodeTexImage")
    texture.name = "Hero Base Color"
    texture.image = image
    texture.interpolation = "Closest"
    links.new(texture.outputs["Color"], principled.inputs["Base Color"])
    links.new(texture.outputs["Alpha"], principled.inputs["Alpha"])
    principled.inputs["Roughness"].default_value = 0.72

    for mesh in meshes:
        mesh.data.materials.clear()
        mesh.data.materials.append(material)


def character_bounds(meshes: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    bpy.context.view_layer.update()
    corners = [mesh.matrix_world @ Vector(corner) for mesh in meshes for corner in mesh.bound_box]
    minimum = Vector(tuple(min(corner[index] for corner in corners) for index in range(3)))
    maximum = Vector(tuple(max(corner[index] for corner in corners) for index in range(3)))
    return minimum, maximum


def export_fbx(slug: str, output_path: Path) -> dict[str, object]:
    root = project_root()
    source_dir = root / "public" / "assets" / "runner" / "heroes"
    source_path = source_dir / f"{slug}.glb"
    texture_path = source_dir / "hero-basecolor.png"

    clean_scene()
    bpy.ops.import_scene.gltf(filepath=str(source_path))
    armature, meshes = imported_character()
    remove_non_character_objects(armature, meshes)
    clear_animation_data()

    armature.name = "Armature"
    armature.data.name = "Armature"
    armature.data.pose_position = "REST"
    for index, mesh in enumerate(meshes):
        mesh.name = slug.capitalize() if len(meshes) == 1 else f"{slug.capitalize()}_{index + 1}"
        mesh.data.name = mesh.name
    assign_texture(meshes, texture_path, slug)

    minimum, maximum = character_bounds(meshes)
    if abs(minimum.z) > 0.01:
        raise RuntimeError(f"{slug} is not grounded before export: min Z={minimum.z:.4f}")

    bpy.ops.object.select_all(action="DESELECT")
    armature.select_set(True)
    for mesh in meshes:
        mesh.select_set(True)
    bpy.context.view_layer.objects.active = armature

    output_path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.fbx(
        filepath=str(output_path),
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
        "source": str(source_path.relative_to(root)),
        "sourceSha256": sha256(source_path),
        "meshCount": len(meshes),
        "vertexCount": sum(len(mesh.data.vertices) for mesh in meshes),
        "boneCount": len(armature.data.bones),
        "dimensionsMeters": [round(maximum[index] - minimum[index], 4) for index in range(3)],
        "groundedMinZ": round(minimum.z, 4),
        "embeddedAnimationCount": 0,
    }


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_validation_preview(
    meshes: list[bpy.types.Object], minimum: Vector, maximum: Vector, output_path: Path
) -> None:
    center = (minimum + maximum) * 0.5
    height = max(0.01, maximum.z - minimum.z)

    camera_data = bpy.data.cameras.new("ValidationCamera")
    camera = bpy.data.objects.new("ValidationCamera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = center + Vector((0, -height * 3.1, height * 0.2))
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
    scene.render.filepath = str(output_path)
    scene.view_settings.look = "AgX - Medium High Contrast"
    bpy.ops.render.render(write_still=True)


def validate_fbx(path: Path, preview_path: Path) -> dict[str, object]:
    clean_scene()
    result = bpy.ops.import_scene.fbx(filepath=str(path), use_anim=True)
    if "FINISHED" not in result:
        raise RuntimeError(f"Blender could not reimport {path.name}: {result}")

    armature, meshes = imported_character()
    minimum, maximum = character_bounds(meshes)
    action_count = len(bpy.data.actions)
    image_texture_count = sum(
        1
        for mesh in meshes
        for material_slot in mesh.material_slots
        if material_slot.material and material_slot.material.node_tree
        for node in material_slot.material.node_tree.nodes
        if node.type == "TEX_IMAGE" and node.image is not None
    )
    if action_count != 0:
        raise RuntimeError(f"{path.name} unexpectedly contains {action_count} animation action(s)")
    if len(meshes) != 1:
        raise RuntimeError(f"{path.name} should contain one skinned mesh, found {len(meshes)}")
    if len(armature.data.bones) < 20:
        raise RuntimeError(f"{path.name} armature is incomplete")
    if image_texture_count < 1:
        raise RuntimeError(f"{path.name} did not preserve its embedded texture")

    render_validation_preview(meshes, minimum, maximum, preview_path)

    return {
        "reimported": True,
        "meshCount": len(meshes),
        "vertexCount": sum(len(mesh.data.vertices) for mesh in meshes),
        "boneCount": len(armature.data.bones),
        "animationCount": action_count,
        "dimensionsMeters": [round(maximum[index] - minimum[index], 4) for index in range(3)],
        "materialCount": sum(len(mesh.material_slots) for mesh in meshes),
        "imageTextureCount": image_texture_count,
        "previewRendered": preview_path.exists(),
    }


def write_package(slug: str, output_root: Path, export_data: dict[str, object]) -> dict[str, object]:
    root = project_root()
    source_texture = root / "public" / "assets" / "runner" / "heroes" / "hero-basecolor.png"
    package_dir = output_root / slug
    fbx_path = package_dir / f"{slug}-mixamo.fbx"
    texture_path = package_dir / "hero-basecolor.png"
    preview_path = package_dir / f"{slug}-mixamo-preview.png"
    shutil.copy2(source_texture, texture_path)

    instructions = (
        f"{slug.capitalize()} - Runner / Mixamo\n"
        "\n"
        f"Upload {slug}-mixamo.fbx to Mixamo. The FBX keeps the original skin weights and skeleton, "
        "but contains no animation clip. If Mixamo asks for autorig markers, place chin, wrists, elbows, "
        "knees and groin on the visible character.\n"
        "\n"
        "The PNG is included as a fallback if the embedded texture is not displayed.\n"
    )
    (package_dir / "README.txt").write_text(instructions, encoding="utf-8")

    validation = validate_fbx(fbx_path, preview_path)
    manifest = {
        "character": slug,
        "format": "FBX Binary",
        "mixamoPurpose": "rigged character without animation clip",
        "export": export_data,
        "validation": validation,
        "files": {
            fbx_path.name: {"bytes": fbx_path.stat().st_size, "sha256": sha256(fbx_path)},
            texture_path.name: {"bytes": texture_path.stat().st_size, "sha256": sha256(texture_path)},
            preview_path.name: {"bytes": preview_path.stat().st_size, "sha256": sha256(preview_path)},
        },
    }
    (package_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=True) + "\n", encoding="utf-8"
    )

    zip_path = output_root / f"{slug}-mixamo.zip"
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for child in sorted(package_dir.iterdir()):
            archive.write(child, arcname=f"{slug}-mixamo/{child.name}")
    manifest["zip"] = {
        "path": str(zip_path.relative_to(root)),
        "bytes": zip_path.stat().st_size,
        "sha256": sha256(zip_path),
    }
    return manifest


def main() -> None:
    root = project_root()
    output_root = (
        Path(sys.argv[sys.argv.index("--") + 1]).resolve()
        if "--" in sys.argv and len(sys.argv) > sys.argv.index("--") + 1
        else root / "exports" / "runner-mixamo"
    )
    output_root.mkdir(parents=True, exist_ok=True)

    source_dir = root / "public" / "assets" / "runner" / "heroes"
    runtime_hashes_before = {
        path.name: sha256(path)
        for path in [source_dir / "boy.glb", source_dir / "girl.glb", source_dir / "hero-basecolor.png"]
    }

    results: list[dict[str, object]] = []
    for slug in HEROES:
        package_dir = output_root / slug
        package_dir.mkdir(parents=True, exist_ok=True)
        fbx_path = package_dir / f"{slug}-mixamo.fbx"
        export_data = export_fbx(slug, fbx_path)
        results.append(write_package(slug, output_root, export_data))

    runtime_hashes_after = {
        path.name: sha256(path)
        for path in [source_dir / "boy.glb", source_dir / "girl.glb", source_dir / "hero-basecolor.png"]
    }
    if runtime_hashes_before != runtime_hashes_after:
        raise RuntimeError("Runtime Runner assets changed during Mixamo export")

    report = {
        "characters": results,
        "characterCount": len(results),
        "expectedCharacterCount": len(HEROES),
        "runtimeAssetsUnchanged": True,
        "runtimeSha256": runtime_hashes_after,
    }
    report_path = output_root / "export-report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=True))


if __name__ == "__main__":
    main()
