"""Extract the skeleton character and export a lightweight Runner monster GLB."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import sys

import bpy
from mathutils import Vector


SOURCE_OBJECT_NAME = "male_skeleton_afro1"
RUNTIME_NAME = "skeleton-warrior"


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(arguments)


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


def world_bounds(obj: bpy.types.Object) -> tuple[Vector, Vector]:
    points = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    return (
        Vector(tuple(min(point[index] for point in points) for index in range(3))),
        Vector(tuple(max(point[index] for point in points) for index in range(3))),
    )


def configure_material(mesh: bpy.types.Object, texture_path: Path) -> None:
    material = bpy.data.materials.new("SkeletonPalette")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    texture = nodes.new("ShaderNodeTexImage")
    texture.image = bpy.data.images.load(str(texture_path), check_existing=False)
    texture.interpolation = "Closest"
    shader.inputs["Metallic"].default_value = 0.0
    shader.inputs["Roughness"].default_value = 0.82
    links.new(texture.outputs["Color"], shader.inputs["Base Color"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])

    mesh.data.materials.clear()
    mesh.data.materials.append(material)


def author_run_animation(mesh: bpy.types.Object) -> bpy.types.Action:
    mesh.rotation_mode = "XYZ"
    action = bpy.data.actions.new("SkeletonRun")
    mesh.animation_data_create()
    mesh.animation_data.action = action

    poses = (
        (1, 0.0, 0.0, 0.0),
        (7, 0.045, 0.055, 0.018),
        (13, 0.0, 0.0, 0.0),
        (19, 0.045, -0.055, -0.018),
        (25, 0.0, 0.0, 0.0),
    )
    for frame, height, yaw, lean in poses:
        mesh.location.z = height
        mesh.rotation_euler.z = yaw
        mesh.rotation_euler.x = lean
        mesh.keyframe_insert("location", frame=frame)
        mesh.keyframe_insert("rotation_euler", frame=frame)

    action.use_fake_user = True
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 25
    bpy.context.scene.render.fps = 30
    return action


def point_camera(camera: bpy.types.Object, target: Vector) -> None:
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(mesh: bpy.types.Object, output: Path) -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = True
    scene.render.filepath = str(output)

    camera_data = bpy.data.cameras.new("PreviewCamera")
    camera = bpy.data.objects.new("PreviewCamera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (0.0, -4.1, 1.25)
    camera.data.lens = 58
    point_camera(camera, Vector((0.0, 0.0, 0.92)))
    scene.camera = camera

    key = bpy.data.lights.new("PreviewKey", "AREA")
    key.energy = 900
    key.shape = "DISK"
    key.size = 4.0
    key_object = bpy.data.objects.new("PreviewKey", key)
    key_object.location = (-2.5, -3.0, 4.0)
    scene.collection.objects.link(key_object)
    point_camera(key_object, Vector((0.0, 0.0, 0.9)))

    fill = bpy.data.lights.new("PreviewFill", "AREA")
    fill.energy = 500
    fill.size = 3.0
    fill_object = bpy.data.objects.new("PreviewFill", fill)
    fill_object.location = (2.5, -1.0, 2.0)
    scene.collection.objects.link(fill_object)
    point_camera(fill_object, Vector((0.0, 0.0, 0.9)))

    if scene.world is None:
        scene.world = bpy.data.worlds.new("PreviewWorld")
    scene.world.color = (0.025, 0.035, 0.05)
    scene.frame_set(1)
    bpy.ops.render.render(write_still=True)

    bpy.data.objects.remove(camera, do_unlink=True)
    bpy.data.objects.remove(key_object, do_unlink=True)
    bpy.data.objects.remove(fill_object, do_unlink=True)
    mesh.animation_data.action = bpy.data.actions["SkeletonRun"]


def main() -> None:
    args = parse_args()
    root = project_root()
    source = args.source.expanduser().resolve()
    texture = source.parent.parent / "textures" / "skeleton_texture.tga.png"
    if not source.is_file():
        raise FileNotFoundError(source)
    if not texture.is_file():
        raise FileNotFoundError(texture)

    export_root = root / "exports" / "runner-skeleton-monster"
    runtime_root = root / "public" / "assets" / "runner" / "monsters"
    export_root.mkdir(parents=True, exist_ok=True)
    runtime_root.mkdir(parents=True, exist_ok=True)
    preserved_source = export_root / source.name
    preserved_texture = export_root / texture.name
    shutil.copy2(source, preserved_source)
    shutil.copy2(texture, preserved_texture)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    if "FINISHED" not in bpy.ops.import_scene.fbx(filepath=str(source), use_anim=False):
        raise RuntimeError("Blender could not import the skeleton FBX")

    mesh = bpy.data.objects.get(SOURCE_OBJECT_NAME)
    if mesh is None or mesh.type != "MESH":
        raise RuntimeError(f"Missing source mesh: {SOURCE_OBJECT_NAME}")
    for obj in list(bpy.context.scene.objects):
        if obj != mesh:
            bpy.data.objects.remove(obj, do_unlink=True)

    mesh.name = "SkeletonMonster"
    mesh.data.name = "SkeletonMonster"
    bpy.context.view_layer.objects.active = mesh
    mesh.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    minimum, maximum = world_bounds(mesh)
    center = (minimum + maximum) * 0.5
    mesh.location.x -= center.x
    mesh.location.y -= center.y
    mesh.location.z -= minimum.z
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    configure_material(mesh, texture)
    action = author_run_animation(mesh)

    blend_path = export_root / f"{RUNTIME_NAME}.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

    output = runtime_root / f"{RUNTIME_NAME}.glb"
    bpy.ops.object.select_all(action="DESELECT")
    mesh.select_set(True)
    bpy.context.view_layer.objects.active = mesh
    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        use_selection=True,
        export_animations=True,
        export_animation_mode="ACTIVE_ACTIONS",
        export_force_sampling=True,
        export_optimize_animation_size=True,
        export_skins=False,
        export_morph=False,
        export_materials="EXPORT",
        export_lights=False,
        export_cameras=False,
    )

    preview = export_root / f"{RUNTIME_NAME}-preview.png"
    render_preview(mesh, preview)

    glb = read_glb_json(output)
    animation_names = [animation.get("name") for animation in glb.get("animations", [])]
    if len(glb.get("meshes", [])) != 1 or len(glb.get("skins", [])) != 0:
        raise RuntimeError("Skeleton monster GLB must contain one unskinned mesh")
    if len(animation_names) != 1:
        raise RuntimeError(f"Skeleton run animation export failed: {animation_names}")

    report = {
        "source": str(preserved_source.relative_to(root)),
        "sourceBytes": preserved_source.stat().st_size,
        "sourceSha256": sha256(preserved_source),
        "texture": str(preserved_texture.relative_to(root)),
        "textureSha256": sha256(preserved_texture),
        "blend": str(blend_path.relative_to(root)),
        "preview": str(preview.relative_to(root)),
        "output": str(output.relative_to(root)),
        "outputBytes": output.stat().st_size,
        "outputSha256": sha256(output),
        "meshCount": len(glb.get("meshes", [])),
        "skinCount": len(glb.get("skins", [])),
        "materialCount": len(glb.get("materials", [])),
        "animations": animation_names,
        "polygonCount": len(mesh.data.polygons),
    }
    (export_root / "export-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("SKELETON_MONSTER_EXPORT=" + json.dumps(report, sort_keys=True))


if __name__ == "__main__":
    main()
