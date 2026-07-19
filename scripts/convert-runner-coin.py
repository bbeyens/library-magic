import os

import bpy
from mathutils import Vector


SOURCE = "/Users/zbeyens/Downloads/files-5/coin.fbx"
OUTPUT = "/Users/zbeyens/Documents/Library magic/public/assets/runner/effects/coin.glb"


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=SOURCE)

coin = bpy.data.objects.get("Coin.tris")
if coin is None or coin.type != "MESH":
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    coin = max(meshes, key=lambda obj: len(obj.data.polygons), default=None)
if coin is None:
    raise RuntimeError("No coin mesh found in the source FBX")

bpy.context.view_layer.objects.active = coin
coin.select_set(True)
for modifier in list(coin.modifiers):
    bpy.ops.object.modifier_apply(modifier=modifier.name)

world_matrix = coin.matrix_world.copy()
coin.parent = None
coin.matrix_world = world_matrix

for obj in list(bpy.context.scene.objects):
    if obj != coin:
        bpy.data.objects.remove(obj, do_unlink=True)

coin.name = "RunnerCoin"
coin.rotation_mode = "XYZ"
coin.rotation_euler[2] += 1.5707963267948966
bpy.context.view_layer.objects.active = coin
coin.select_set(True)
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

corners = [coin.matrix_world @ Vector(corner) for corner in coin.bound_box]
center = sum(corners, Vector()) / len(corners)
coin.location -= center
max_dimension = max(coin.dimensions)
coin.scale *= 1.0 / max_dimension
bpy.ops.object.transform_apply(location=True, rotation=False, scale=True)

material = bpy.data.materials.new("RunnerCoinGold")
material.diffuse_color = (1.0, 0.47, 0.035, 1.0)
material.use_nodes = True
principled = material.node_tree.nodes.get("Principled BSDF")
principled.inputs["Base Color"].default_value = (1.0, 0.21, 0.015, 1.0)
principled.inputs["Metallic"].default_value = 0.55
principled.inputs["Roughness"].default_value = 0.32
coin.data.materials.clear()
coin.data.materials.append(material)

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=OUTPUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
)
print(f"Exported {OUTPUT}")
