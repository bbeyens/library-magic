from __future__ import annotations

import math
import random
from pathlib import Path

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = PROJECT_ROOT / "public" / "assets" / "runner" / "environment"
SEGMENT_LENGTH = 16.0
ROAD_WIDTH = 6.4


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def material(name: str, color: tuple[float, float, float, float]) -> bpy.types.Material:
    value = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    value.diffuse_color = color
    value.use_nodes = True
    principled = value.node_tree.nodes.get("Principled BSDF")
    if principled:
        principled.inputs["Base Color"].default_value = color
        principled.inputs["Roughness"].default_value = 0.92
        principled.inputs["Metallic"].default_value = 0.0
    return value


def assign_material(obj: bpy.types.Object, value: bpy.types.Material) -> None:
    obj.data.materials.append(value)


def add_box(
    name: str,
    location: tuple[float, float, float],
    scale: tuple[float, float, float],
    value: bpy.types.Material,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign_material(obj, value)
    return obj


def add_boulder(
    rng: random.Random,
    name: str,
    location: tuple[float, float, float],
    radius: float,
    value: bpy.types.Material,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler.z = rng.uniform(0, math.tau)
    obj.scale = (
        rng.uniform(0.82, 1.18),
        rng.uniform(0.78, 1.2),
        rng.uniform(0.78, 1.12),
    )
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    assign_material(obj, value)
    return obj


def add_cliff_column(
    rng: random.Random,
    name: str,
    side: int,
    y: float,
    height: float,
    cliff_materials: list[bpy.types.Material],
    grass_material: bpy.types.Material,
) -> bpy.types.Object:
    sides = 6
    center_x = side * rng.uniform(7.1, 7.8)
    base_radius = rng.uniform(2.5, 3.15)
    top_radius = base_radius * rng.uniform(0.7, 0.86)
    vertices: list[tuple[float, float, float]] = []
    for ring, z in ((0, 0.0), (1, height)):
        radius = base_radius if ring == 0 else top_radius
        for index in range(sides):
            angle = math.tau * index / sides + rng.uniform(-0.07, 0.07)
            local_radius = radius * rng.uniform(0.9, 1.08)
            vertices.append(
                (
                    center_x + math.cos(angle) * local_radius,
                    y + math.sin(angle) * local_radius,
                    z,
                )
            )

    faces: list[tuple[int, ...]] = []
    for index in range(sides):
        next_index = (index + 1) % sides
        faces.append((index, next_index, sides + next_index, sides + index))
    faces.append(tuple(range(sides - 1, -1, -1)))
    faces.append(tuple(range(sides, sides * 2)))

    mesh = bpy.data.meshes.new(f"{name}-mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    for value in cliff_materials:
        mesh.materials.append(value)
    mesh.materials.append(grass_material)
    for index, polygon in enumerate(mesh.polygons):
        if index == len(mesh.polygons) - 1:
            polygon.material_index = len(cliff_materials)
        elif index < sides:
            polygon.material_index = index % len(cliff_materials)
        else:
            polygon.material_index = 0
        polygon.use_smooth = False
    return obj


def add_trunk(
    name: str,
    location: tuple[float, float, float],
    radius: float,
    height: float,
    value: bpy.types.Material,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=5,
        radius=radius,
        depth=height,
        location=(location[0], location[1], location[2] + height / 2),
    )
    obj = bpy.context.object
    obj.name = name
    assign_material(obj, value)
    return obj


def add_pine(
    rng: random.Random,
    name: str,
    location: tuple[float, float, float],
    scale: float,
    trunk_material: bpy.types.Material,
    foliage_materials: list[bpy.types.Material],
) -> None:
    add_trunk(name + "-trunk", location, 0.18 * scale, 1.45 * scale, trunk_material)
    for index, (z, radius, height) in enumerate(((1.1, 1.15, 1.55), (1.85, 0.9, 1.35), (2.5, 0.62, 1.05))):
        bpy.ops.mesh.primitive_cone_add(
            vertices=7,
            radius1=radius * scale,
            radius2=0.04 * scale,
            depth=height * scale,
            location=(location[0], location[1], location[2] + z * scale),
        )
        crown = bpy.context.object
        crown.name = f"{name}-crown-{index}"
        crown.rotation_euler.z = rng.uniform(-0.15, 0.15)
        assign_material(crown, foliage_materials[index % len(foliage_materials)])


def add_round_tree(
    rng: random.Random,
    name: str,
    location: tuple[float, float, float],
    scale: float,
    trunk_material: bpy.types.Material,
    foliage_material: bpy.types.Material,
) -> None:
    add_trunk(name + "-trunk", location, 0.2 * scale, 1.6 * scale, trunk_material)
    add_boulder(
        rng,
        name + "-crown",
        (location[0], location[1], location[2] + 2.2 * scale),
        1.18 * scale,
        foliage_material,
    )


def parent_to_root(root: bpy.types.Object) -> None:
    for obj in list(bpy.context.scene.objects):
        if obj is not root and obj.parent is None:
            obj.parent = root


def build_segment(variant: int) -> None:
    clear_scene()
    rng = random.Random(7319 + variant * 101)

    path = material("Path_Ochre", (0.72, 0.35, 0.08, 1.0))
    path_edge = material("Path_Edge", (0.57, 0.25, 0.05, 1.0))
    grass = material("Grass", (0.31, 0.55, 0.10, 1.0))
    grass_light = material("Grass_Light", (0.46, 0.68, 0.13, 1.0))
    rock_values = [
        material("Rock_Light", (0.59, 0.58, 0.55, 1.0)),
        material("Rock_Mid", (0.43, 0.44, 0.44, 1.0)),
        material("Rock_Cool", (0.34, 0.37, 0.41, 1.0)),
    ]
    cliff_values = [
        material("Cliff_Light", (0.50, 0.49, 0.46, 1.0)),
        material("Cliff_Mid", (0.39, 0.41, 0.43, 1.0)),
        material("Cliff_Shadow", (0.29, 0.32, 0.36, 1.0)),
    ]
    trunk = material("Trunk", (0.28, 0.14, 0.045, 1.0))
    pine_values = [
        material("Pine_Dark", (0.16, 0.34, 0.07, 1.0)),
        material("Pine_Mid", (0.25, 0.46, 0.09, 1.0)),
        material("Pine_Light", (0.35, 0.56, 0.10, 1.0)),
    ]
    round_foliage = material("Round_Foliage", (0.38, 0.62, 0.08, 1.0))

    root = bpy.data.objects.new(f"RunnerCanyonSegment_{variant + 1}", None)
    bpy.context.collection.objects.link(root)

    add_box("Road", (0, 0, -0.10), (ROAD_WIDTH / 2, SEGMENT_LENGTH / 2, 0.10), path)
    add_box("RoadBase", (0, 0, -0.24), (ROAD_WIDTH / 2 + 0.18, SEGMENT_LENGTH / 2, 0.07), path_edge)
    for side in (-1, 1):
        add_box(
            f"GrassBank_{side}",
            (side * 5.9, 0, -0.13),
            (2.7, SEGMENT_LENGTH / 2, 0.13),
            grass if side < 0 else grass_light,
        )

    rock_y_positions = [-6.65, -4.35, -2.0, 0.35, 2.7, 5.05, 7.05]
    for side in (-1, 1):
        for index, base_y in enumerate(rock_y_positions):
            radius = rng.uniform(0.48, 0.74)
            x = side * rng.uniform(3.48, 3.72)
            y = base_y + rng.uniform(-0.25, 0.25)
            add_boulder(
                rng,
                f"BorderRock_{side}_{index}",
                (x, y, radius * 0.72),
                radius,
                rock_values[(index + variant + (1 if side > 0 else 0)) % len(rock_values)],
            )

    cliff_y_positions = [-5.5, 0.0, 5.5]
    for side in (-1, 1):
        for index, base_y in enumerate(cliff_y_positions):
            add_cliff_column(
                rng,
                f"Cliff_{side}_{index}",
                side,
                base_y + rng.uniform(-0.8, 0.8),
                rng.uniform(6.0, 9.2),
                cliff_values,
                grass_light if (index + variant) % 2 == 0 else grass,
            )

    tree_layouts = (
        [(-1, -3.7, -2.8, "pine"), (1, 4.5, 3.4, "round")],
        [(1, 4.6, -3.4, "pine"), (-1, -4.7, 3.0, "round")],
        [(-1, -4.5, -4.4, "round"), (1, 4.55, 1.8, "pine")],
    )
    for index, (side, x, y, kind) in enumerate(tree_layouts[variant]):
        safe_x = x if side > 0 else -abs(x)
        location = (safe_x, y, 0.0)
        tree_scale = rng.uniform(0.72, 0.95)
        if kind == "pine":
            add_pine(rng, f"Pine_{index}", location, tree_scale, trunk, pine_values)
        else:
            add_round_tree(rng, f"RoundTree_{index}", location, tree_scale, trunk, round_foliage)

    parent_to_root(root)

    for obj in bpy.context.scene.objects:
        if obj.type == "MESH":
            obj.select_set(True)
            obj.data.name = obj.name + "_Mesh"
            for polygon in obj.data.polygons:
                polygon.use_smooth = False

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"canyon-segment-{variant + 1}.glb"
    bpy.ops.export_scene.gltf(
        filepath=str(output_path),
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_animations=False,
    )
    print(f"Exported {output_path}")


def main() -> None:
    for variant in range(3):
        build_segment(variant)


main()
