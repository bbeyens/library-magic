"""Build the Runner fireball in Blender and export its editable source plus runtime GLB."""

from __future__ import annotations

import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "exports" / "runner" / "projectiles"
RUNTIME_DIR = ROOT / "public" / "assets" / "runner" / "projectiles"
BLEND_PATH = SOURCE_DIR / "fireball.blend"
GLB_PATH = RUNTIME_DIR / "fireball.glb"
PROOF_PATH = SOURCE_DIR / "fireball-proof.png"


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
        bpy.data.images,
        bpy.data.textures,
    ):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def emissive_material(
    name: str,
    color: tuple[float, float, float, float],
    strength: float,
    *,
    transparent: bool = False,
) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    material.use_nodes = True
    principled = material.node_tree.nodes.get("Principled BSDF")
    if principled is not None:
        principled.inputs["Base Color"].default_value = color
        emission_input = principled.inputs.get("Emission Color") or principled.inputs.get("Emission")
        if emission_input is not None:
            emission_input.default_value = color
        strength_input = principled.inputs.get("Emission Strength")
        if strength_input is not None:
            strength_input.default_value = strength
        alpha_input = principled.inputs.get("Alpha")
        if alpha_input is not None:
            alpha_input.default_value = color[3]
        principled.inputs["Metallic"].default_value = 0.0
        principled.inputs["Roughness"].default_value = 0.25
    if transparent:
        if hasattr(material, "surface_render_method"):
            material.surface_render_method = "DITHERED"
        material.use_backface_culling = False
    return material


def create_fireball() -> bpy.types.Object:
    core_material = emissive_material("RunnerBoltCore", (1.0, 0.94, 0.62, 1.0), 7.0)
    glow_material = emissive_material(
        "RunnerBoltGlow",
        (1.0, 0.48, 0.04, 0.28),
        4.5,
        transparent=True,
    )

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.105, location=(0.0, 0.0, 0.14))
    core = bpy.context.object
    core.name = "RunnerBoltCore"
    core.data.materials.append(core_material)

    pieces = [core]
    bpy.ops.mesh.primitive_cone_add(
        vertices=8,
        radius1=0.008,
        radius2=0.058,
        depth=0.82,
        end_fill_type="NGON",
        location=(0.0, 0.0, -0.34),
    )
    inner_trail = bpy.context.object
    inner_trail.name = "RunnerBoltCoreTrail"
    inner_trail.data.materials.append(core_material)
    pieces.append(inner_trail)

    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.17, location=(0.0, 0.0, 0.14))
    glow_head = bpy.context.object
    glow_head.name = "RunnerBoltGlowHead"
    glow_head.data.materials.append(glow_material)
    pieces.append(glow_head)

    bpy.ops.mesh.primitive_cone_add(
        vertices=8,
        radius1=0.012,
        radius2=0.12,
        depth=1.12,
        end_fill_type="NGON",
        location=(0.0, 0.0, -0.47),
    )
    glow_trail = bpy.context.object
    glow_trail.name = "RunnerBoltGlowTrail"
    glow_trail.data.materials.append(glow_material)
    pieces.append(glow_trail)

    bpy.ops.object.select_all(action="DESELECT")
    for piece in pieces:
        piece.select_set(True)
    bpy.context.view_layer.objects.active = core
    bpy.ops.object.join()
    fireball = bpy.context.object
    fireball.name = "RunnerLuminousBolt"
    fireball.data.name = "RunnerLuminousBoltMesh"
    fireball.location = (0.0, 0.0, 0.0)
    bpy.ops.object.shade_flat()
    fireball["runtime_job"] = "runner_projectile"
    fireball["forward_axis"] = "+Z"
    fireball["instance_budget"] = 128
    return fireball


def look_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def configure_proof_scene(fireball: bpy.types.Object) -> None:
    world = bpy.data.worlds.new("FireballProofWorld")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.006, 0.009, 0.025, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.18
    bpy.context.scene.world = world

    camera_data = bpy.data.cameras.new("FireballProofCamera")
    camera = bpy.data.objects.new("FireballProofCamera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = (1.45, 1.05, 1.45)
    camera_data.lens = 58
    look_at(camera, Vector((0.0, 0.0, -0.34)))
    bpy.context.scene.camera = camera

    light_data = bpy.data.lights.new("FireballProofKey", "AREA")
    light = bpy.data.objects.new("FireballProofKey", light_data)
    bpy.context.scene.collection.objects.link(light)
    light.location = (1.2, 1.7, 1.4)
    light_data.energy = 500
    light_data.color = (1.0, 0.88, 0.58)
    light_data.shape = "DISK"
    light_data.size = 3.0
    look_at(light, Vector((0.0, 0.0, -0.34)))

    fireball.rotation_euler.z = math.radians(12)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(PROOF_PATH)
    scene.render.film_transparent = False
    scene.view_settings.look = "AgX - Medium High Contrast"


def export_fireball(fireball: bpy.types.Object) -> None:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.render.render(write_still=True)

    fireball.rotation_euler = (0.0, 0.0, 0.0)
    bpy.ops.object.select_all(action="DESELECT")
    fireball.select_set(True)
    bpy.context.view_layer.objects.active = fireball
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_PATH),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
    )


def main() -> None:
    clear_scene()
    fireball = create_fireball()
    configure_proof_scene(fireball)
    export_fireball(fireball)
    triangles = sum(len(polygon.vertices) - 2 for polygon in fireball.data.polygons)
    print(
        f"RUNNER_FIREBALL_READY object={fireball.name} vertices={len(fireball.data.vertices)} "
        f"triangles={triangles} materials={len(fireball.data.materials)} glb={GLB_PATH}"
    )


if __name__ == "__main__":
    main()
