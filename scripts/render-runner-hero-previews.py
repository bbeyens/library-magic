from pathlib import Path
import sys

import bpy
from mathutils import Vector


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_preview(slug: str, asset_dir: Path) -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(asset_dir / f"{slug}.glb"))

    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if not meshes:
        raise RuntimeError(f"No mesh found in {slug}.glb")

    if slug == "girl":
        image = bpy.data.images.load(str(asset_dir / "hero-basecolor.png"), check_existing=True)
        material = bpy.data.materials.new(f"runner-{slug}-preview")
        material.use_nodes = True
        nodes = material.node_tree.nodes
        links = material.node_tree.links
        principled = nodes.get("Principled BSDF")
        texture = nodes.new("ShaderNodeTexImage")
        texture.image = image
        texture.interpolation = "Closest"
        links.new(texture.outputs["Color"], principled.inputs["Base Color"])
        links.new(texture.outputs["Alpha"], principled.inputs["Alpha"])
        principled.inputs["Roughness"].default_value = 0.72
        for mesh in meshes:
            mesh.data.materials.clear()
            mesh.data.materials.append(material)

    corners = [obj.matrix_world @ Vector(corner) for obj in meshes for corner in obj.bound_box]
    minimum = Vector((min(v.x for v in corners), min(v.y for v in corners), min(v.z for v in corners)))
    maximum = Vector((max(v.x for v in corners), max(v.y for v in corners), max(v.z for v in corners)))
    center = (minimum + maximum) * 0.5
    height = max(0.01, maximum.z - minimum.z)

    camera_data = bpy.data.cameras.new("Camera")
    camera = bpy.data.objects.new("Camera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = center + Vector((0, -height * 3.1, height * 0.28))
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = height * 1.18
    look_at(camera, center + Vector((0, 0, height * 0.03)))
    bpy.context.scene.camera = camera

    for name, location, energy, size in (
        ("Key", center + Vector((-height * 1.6, -height * 2.0, height * 2.2)), 900.0, 4.0),
        ("Fill", center + Vector((height * 1.8, -height * 0.7, height * 1.2)), 550.0, 3.0),
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
    scene.render.resolution_x = 256
    scene.render.resolution_y = 256
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = True
    scene.render.filepath = str(asset_dir / f"{slug}-preview.png")
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    bpy.ops.render.render(write_still=True)


arguments = sys.argv[sys.argv.index("--") + 1 :]
asset_directory = Path(arguments[0]).resolve()
for hero_slug in ("boy", "girl"):
    render_preview(hero_slug, asset_directory)
