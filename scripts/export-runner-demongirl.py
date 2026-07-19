"""Clean and export the provided demon girl as the Runner's girl skin."""

from __future__ import annotations

import argparse
import hashlib
import heapq
import json
from pathlib import Path
import shutil
import sys

import bpy
import io_scene_fbx.import_fbx as blender_fbx_importer
from mathutils import Vector


MESH_RATIOS = {
    "Head": 0.06,
    "Body": 0.08,
    "Tail": 0.7,
    "Horns": 1.0,
    "Hair": 0.04,
    "Trench_coat": 0.025,
    "Hat": 0.5,
}


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


def import_fbx_without_lights(source: Path) -> None:
    original_light_reader = blender_fbx_importer.blen_read_light
    blender_fbx_importer.blen_read_light = lambda _template, _object, _settings: bpy.data.lights.new(
        name="IgnoredFBXLight",
        type="POINT",
    )
    try:
        result = bpy.ops.import_scene.fbx(filepath=str(source), use_anim=False, use_image_search=False)
    finally:
        blender_fbx_importer.blen_read_light = original_light_reader
    if "FINISHED" not in result:
        raise RuntimeError("Blender could not import the demon girl FBX")


def make_material(
    name: str,
    color: tuple[float, float, float, float],
    roughness: float = 0.82,
    emission_strength: float = 0.0,
) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    material.use_nodes = True
    shader = next(node for node in material.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    shader.inputs["Base Color"].default_value = color
    shader.inputs["Metallic"].default_value = 0.0
    shader.inputs["Roughness"].default_value = roughness
    if emission_strength > 0:
        shader.inputs["Emission Color"].default_value = color
        shader.inputs["Emission Strength"].default_value = emission_strength
    return material


def replace_materials(mesh: bpy.types.Object, replacements: dict[str, bpy.types.Material]) -> None:
    for index, slot in enumerate(mesh.material_slots):
        replacement = replacements.get(slot.material.name if slot.material else "")
        if replacement is not None:
            mesh.data.materials[index] = replacement


def world_bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    points = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    return (
        Vector(tuple(min(point[index] for point in points) for index in range(3))),
        Vector(tuple(max(point[index] for point in points) for index in range(3))),
    )


def anatomical_center_x(mesh: bpy.types.Object) -> float:
    eye_material_index = next(
        index for index, material in enumerate(mesh.data.materials) if material.name == "DemonEyes"
    )
    eye_vertices = {
        vertex
        for polygon in mesh.data.polygons
        if polygon.material_index == eye_material_index
        for vertex in polygon.vertices
    }
    if not eye_vertices:
        raise RuntimeError("Demongirl eyes are required to locate the anatomical center")
    return sum(mesh.data.vertices[index].co.x for index in eye_vertices) / len(eye_vertices)


def create_demongirl_rig(center_x: float) -> bpy.types.Object:
    armature_data = bpy.data.armatures.new("DemongirlRig")
    rig = bpy.data.objects.new("DemongirlRig", armature_data)
    bpy.context.scene.collection.objects.link(rig)
    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")

    specs = {
        "DemongirlRoot": ((center_x, 0.0, 0.0), (center_x, 0.0, 0.20), None),
        "DemongirlHips": ((center_x, 0.0, 0.86), (center_x, 0.0, 1.25), "DemongirlRoot"),
        "DemongirlSpine": ((center_x, 0.0, 1.16), (center_x, 0.0, 1.75), "DemongirlHips"),
        "DemongirlHead": ((center_x, 0.0, 1.70), (center_x, 0.0, 2.18), "DemongirlSpine"),
        "DemongirlLeg.L": ((center_x - 0.16, -0.04, 1.18), (center_x - 0.16, -0.04, 0.62), "DemongirlHips"),
        "DemongirlShin.L": ((center_x - 0.16, -0.04, 0.62), (center_x - 0.16, -0.04, 0.08), "DemongirlLeg.L"),
        "DemongirlLeg.R": ((center_x + 0.16, -0.04, 1.18), (center_x + 0.16, -0.04, 0.62), "DemongirlHips"),
        "DemongirlShin.R": ((center_x + 0.16, -0.04, 0.62), (center_x + 0.16, -0.04, 0.08), "DemongirlLeg.R"),
        "DemongirlTail.01": ((center_x, 0.18, 1.14), (center_x - 0.36, 0.31, 1.00), "DemongirlHips"),
        "DemongirlTail.02": ((center_x - 0.36, 0.31, 1.00), (center_x - 0.68, 0.24, 0.76), "DemongirlTail.01"),
        "DemongirlTail.03": ((center_x - 0.68, 0.24, 0.76), (center_x - 0.92, 0.03, 0.58), "DemongirlTail.02"),
        "DemongirlHair.L": ((center_x - 0.08, 0.10, 1.78), (center_x - 0.52, 0.30, 1.34), "DemongirlHead"),
        "DemongirlHairTip.L": ((center_x - 0.52, 0.30, 1.34), (center_x - 0.72, 0.20, 0.92), "DemongirlHair.L"),
        "DemongirlHair.R": ((center_x + 0.08, 0.10, 1.78), (center_x + 0.52, 0.30, 1.34), "DemongirlHead"),
        "DemongirlHairTip.R": ((center_x + 0.52, 0.30, 1.34), (center_x + 0.66, 0.22, 1.00), "DemongirlHair.R"),
        "DemongirlCoat.L": ((center_x - 0.20, 0.02, 1.20), (center_x - 0.28, 0.08, 0.45), "DemongirlHips"),
        "DemongirlCoat.R": ((center_x + 0.20, 0.02, 1.20), (center_x + 0.28, 0.08, 0.45), "DemongirlHips"),
    }
    edit_bones = {}
    for name, (head, tail, _parent) in specs.items():
        bone = armature_data.edit_bones.new(name)
        bone.head = head
        bone.tail = tail
        edit_bones[name] = bone
    for name, (_head, _tail, parent) in specs.items():
        if parent:
            edit_bones[name].parent = edit_bones[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    rig.show_in_front = True
    return rig


def mesh_components(mesh: bpy.types.Object) -> tuple[list[list[int]], list[list[int]]]:
    adjacency = [[] for _ in mesh.data.vertices]
    for edge in mesh.data.edges:
        left, right = edge.vertices
        adjacency[left].append(right)
        adjacency[right].append(left)
    components = []
    visited = set()
    for start in range(len(mesh.data.vertices)):
        if start in visited:
            continue
        stack = [start]
        visited.add(start)
        component = []
        while stack:
            vertex = stack.pop()
            component.append(vertex)
            for neighbor in adjacency[vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    stack.append(neighbor)
        components.append(component)
    return components, adjacency


def component_materials(mesh: bpy.types.Object) -> list[set[str]]:
    materials = [set() for _ in mesh.data.vertices]
    for polygon in mesh.data.polygons:
        material = mesh.data.materials[polygon.material_index]
        for vertex in polygon.vertices:
            materials[vertex].add(material.name)
    return materials


def smoothstep(edge0: float, edge1: float, value: float) -> float:
    if edge0 == edge1:
        return 0.0
    normalized = min(1.0, max(0.0, (value - edge0) / (edge1 - edge0)))
    return normalized * normalized * (3.0 - 2.0 * normalized)


def tail_distances(
    mesh: bpy.types.Object,
    component: list[int],
    adjacency: list[list[int]],
    center_x: float,
) -> dict[int, float]:
    component_set = set(component)
    base = min(
        component,
        key=lambda index: (
            mesh.data.vertices[index].co - Vector((center_x, 0.18, 1.14))
        ).length_squared,
    )
    distances = {base: 0.0}
    queue = [(0.0, base)]
    while queue:
        distance, vertex = heapq.heappop(queue)
        if distance > distances[vertex]:
            continue
        for neighbor in adjacency[vertex]:
            if neighbor not in component_set:
                continue
            next_distance = distance + (
                mesh.data.vertices[vertex].co - mesh.data.vertices[neighbor].co
            ).length
            if next_distance < distances.get(neighbor, float("inf")):
                distances[neighbor] = next_distance
                heapq.heappush(queue, (next_distance, neighbor))
    maximum = max(distances.values()) or 1.0
    return {vertex: distance / maximum for vertex, distance in distances.items()}


def assign_demongirl_weights(
    mesh: bpy.types.Object,
    rig: bpy.types.Object,
    center_x: float,
) -> dict[str, int]:
    for group in list(mesh.vertex_groups):
        mesh.vertex_groups.remove(group)
    groups = {bone.name: mesh.vertex_groups.new(name=bone.name) for bone in rig.data.bones}
    components, adjacency = mesh_components(mesh)
    vertex_materials = component_materials(mesh)
    counts = {name: 0 for name in groups}

    def add(vertex: int, weights: dict[str, float]) -> None:
        positive = {name: weight for name, weight in weights.items() if weight > 0.0001}
        total = sum(positive.values()) or 1.0
        for name, weight in positive.items():
            groups[name].add([vertex], weight / total, "REPLACE")
            counts[name] += 1

    for component in components:
        points = [mesh.data.vertices[index].co for index in component]
        minimum = Vector(tuple(min(point[axis] for point in points) for axis in range(3)))
        maximum = Vector(tuple(max(point[axis] for point in points) for axis in range(3)))
        width = maximum.x - minimum.x
        materials = set().union(*(vertex_materials[index] for index in component))
        is_leg = minimum.z <= 0.03 and maximum.z >= 1.15 and width < 0.5
        is_tail = minimum.z <= 0.05 and maximum.z < 1.4 and width > 1.4

        if is_leg:
            side = "L" if sum(point.x for point in points) / len(points) < center_x else "R"
            for vertex in component:
                z = mesh.data.vertices[vertex].co.z
                upper = smoothstep(0.50, 0.76, z)
                add(vertex, {f"DemongirlLeg.{side}": upper, f"DemongirlShin.{side}": 1.0 - upper})
            continue

        if is_tail:
            distances = tail_distances(mesh, component, adjacency, center_x)
            names = ["DemongirlTail.01", "DemongirlTail.02", "DemongirlTail.03"]
            for vertex in component:
                position = min(2.0, distances[vertex] * 3.0)
                index = min(2, int(position))
                fraction = position - index
                weights = {names[index]: 1.0 - fraction}
                if index < 2:
                    weights[names[index + 1]] = fraction
                add(vertex, weights)
            continue

        if "DemonHair" in materials:
            side = "L" if sum(point.x for point in points) / len(points) < center_x else "R"
            for vertex in component:
                z = mesh.data.vertices[vertex].co.z
                tip = 1.0 - smoothstep(1.02, 1.82, z)
                add(
                    vertex,
                    {
                        f"DemongirlHair.{side}": 0.72 * (1.0 - tip) + 0.18 * tip,
                        f"DemongirlHairTip.{side}": 0.82 * tip,
                        "DemongirlHead": 0.28 * (1.0 - tip),
                    },
                )
            continue

        if materials & {"DemonCoat", "DemonCoatAccent", "DemonCoatTrim"}:
            for vertex in component:
                point = mesh.data.vertices[vertex].co
                if point.z < 1.08:
                    side = "L" if point.x < center_x else "R"
                    add(vertex, {f"DemongirlCoat.{side}": 0.78, "DemongirlHips": 0.22})
                elif point.z < 1.55:
                    spine = smoothstep(1.08, 1.55, point.z)
                    add(vertex, {"DemongirlHips": 1.0 - spine, "DemongirlSpine": spine})
                else:
                    head = smoothstep(1.72, 1.96, point.z)
                    add(vertex, {"DemongirlSpine": 1.0 - head, "DemongirlHead": head})
            continue

        for vertex in component:
            point = mesh.data.vertices[vertex].co
            if point.z >= 1.68:
                add(vertex, {"DemongirlHead": 1.0})
            elif point.z >= 1.20:
                spine = smoothstep(1.20, 1.62, point.z)
                add(vertex, {"DemongirlHips": 1.0 - spine, "DemongirlSpine": spine})
            else:
                add(vertex, {"DemongirlHips": 1.0})

    modifier = mesh.modifiers.new(name="DemongirlRig", type="ARMATURE")
    modifier.object = rig
    mesh.parent = rig
    mesh.matrix_parent_inverse = rig.matrix_world.inverted()
    return counts


def key_pose(
    rig: bpy.types.Object,
    frame: int,
    transforms: dict[str, tuple[tuple[float, float, float], tuple[float, float, float]]],
) -> None:
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)
        location, rotation = transforms.get(bone.name, ((0.0, 0.0, 0.0), (0.0, 0.0, 0.0)))
        bone.location = location
        bone.rotation_euler = rotation
        bone.keyframe_insert("location", frame=frame)
        bone.keyframe_insert("rotation_euler", frame=frame)
        bone.keyframe_insert("scale", frame=frame)


def make_action(
    rig: bpy.types.Object,
    name: str,
    poses: tuple[tuple[int, dict[str, tuple[tuple[float, float, float], tuple[float, float, float]]]], ...],
) -> bpy.types.Action:
    action = bpy.data.actions.new(name)
    action.use_fake_user = True
    rig.animation_data_create()
    rig.animation_data.action = action
    for frame, transforms in poses:
        key_pose(rig, frame, transforms)
    return action


def blend_pose(
    start: dict[str, tuple[tuple[float, float, float], tuple[float, float, float]]],
    end: dict[str, tuple[tuple[float, float, float], tuple[float, float, float]]],
    amount: float,
) -> dict[str, tuple[tuple[float, float, float], tuple[float, float, float]]]:
    result = {}
    for name in set(start) | set(end):
        start_location, start_rotation = start.get(name, ((0.0, 0.0, 0.0), (0.0, 0.0, 0.0)))
        end_location, end_rotation = end.get(name, ((0.0, 0.0, 0.0), (0.0, 0.0, 0.0)))
        result[name] = (
            tuple(left + (right - left) * amount for left, right in zip(start_location, end_location)),
            tuple(left + (right - left) * amount for left, right in zip(start_rotation, end_rotation)),
        )
    return result


def author_animations(rig: bpy.types.Object) -> list[bpy.types.Action]:
    seated = {
        "DemongirlRoot": ((0.0, 0.10, -0.18), (0.0, 0.0, 0.0)),
        "DemongirlHips": ((0.0, 0.0, -0.10), (-0.12, 0.0, 0.0)),
        "DemongirlSpine": ((0.0, 0.0, 0.0), (0.15, 0.0, 0.0)),
        "DemongirlHead": ((0.0, 0.0, 0.0), (-0.08, 0.0, 0.0)),
        "DemongirlLeg.L": ((0.0, 0.0, 0.0), (-1.05, 0.0, -0.05)),
        "DemongirlShin.L": ((0.0, 0.0, 0.0), (1.20, 0.0, 0.0)),
        "DemongirlLeg.R": ((0.0, 0.0, 0.0), (-1.05, 0.0, 0.05)),
        "DemongirlShin.R": ((0.0, 0.0, 0.0), (1.20, 0.0, 0.0)),
        "DemongirlTail.01": ((0.0, 0.0, 0.0), (0.08, 0.02, -0.12)),
        "DemongirlTail.02": ((0.0, 0.0, 0.0), (0.0, 0.05, 0.16)),
        "DemongirlTail.03": ((0.0, 0.0, 0.0), (0.0, -0.04, 0.12)),
        "DemongirlHair.L": ((0.0, 0.0, 0.0), (0.025, -0.012, -0.035)),
        "DemongirlHairTip.L": ((0.0, 0.0, 0.0), (0.055, -0.018, -0.055)),
        "DemongirlHair.R": ((0.0, 0.0, 0.0), (0.025, 0.012, 0.035)),
        "DemongirlHairTip.R": ((0.0, 0.0, 0.0), (0.055, 0.018, 0.055)),
        "DemongirlCoat.L": ((0.0, 0.0, 0.0), (-0.10, 0.0, -0.05)),
        "DemongirlCoat.R": ((0.0, 0.0, 0.0), (-0.10, 0.0, 0.05)),
    }
    seated_breathe = {**seated}
    seated_breathe["DemongirlRoot"] = ((0.0, 0.10, -0.165), (0.0, 0.0, 0.0))
    seated_breathe["DemongirlSpine"] = ((0.0, 0.0, 0.0), (0.12, 0.0, 0.018))
    seated_breathe["DemongirlHead"] = ((0.0, 0.0, 0.0), (-0.06, 0.0, -0.018))
    seated_breathe["DemongirlTail.02"] = ((0.0, 0.0, 0.0), (0.0, 0.05, -0.12))
    seated_breathe["DemongirlHair.L"] = ((0.0, 0.0, 0.0), (0.075, 0.025, 0.055))
    seated_breathe["DemongirlHairTip.L"] = ((0.0, 0.0, 0.0), (0.145, 0.045, 0.105))
    seated_breathe["DemongirlHair.R"] = ((0.0, 0.0, 0.0), (0.060, -0.020, -0.050))
    seated_breathe["DemongirlHairTip.R"] = ((0.0, 0.0, 0.0), (0.125, -0.040, -0.095))

    stand_a = {
        "DemongirlSpine": ((0.0, 0.0, 0.0), (0.015, 0.0, -0.012)),
        "DemongirlHead": ((0.0, 0.0, 0.0), (-0.015, 0.0, 0.012)),
        "DemongirlTail.01": ((0.0, 0.0, 0.0), (0.0, 0.02, -0.10)),
        "DemongirlTail.02": ((0.0, 0.0, 0.0), (0.0, 0.0, 0.16)),
        "DemongirlTail.03": ((0.0, 0.0, 0.0), (0.0, 0.0, 0.10)),
        "DemongirlHair.L": ((0.0, 0.0, 0.0), (0.02, -0.01, -0.03)),
        "DemongirlHairTip.L": ((0.0, 0.0, 0.0), (0.05, -0.02, -0.06)),
        "DemongirlHair.R": ((0.0, 0.0, 0.0), (0.02, 0.01, 0.03)),
        "DemongirlHairTip.R": ((0.0, 0.0, 0.0), (0.05, 0.02, 0.06)),
    }
    stand_b = {
        "DemongirlRoot": ((0.0, 0.0, 0.018), (0.0, 0.0, 0.0)),
        "DemongirlSpine": ((0.0, 0.0, 0.0), (-0.01, 0.0, 0.012)),
        "DemongirlHead": ((0.0, 0.0, 0.0), (0.01, 0.0, -0.012)),
        "DemongirlTail.01": ((0.0, 0.0, 0.0), (0.0, -0.02, 0.10)),
        "DemongirlTail.02": ((0.0, 0.0, 0.0), (0.0, 0.0, -0.16)),
        "DemongirlTail.03": ((0.0, 0.0, 0.0), (0.0, 0.0, -0.10)),
        "DemongirlHair.L": ((0.0, 0.0, 0.0), (0.07, 0.02, 0.045)),
        "DemongirlHairTip.L": ((0.0, 0.0, 0.0), (0.13, 0.04, 0.09)),
        "DemongirlHair.R": ((0.0, 0.0, 0.0), (0.055, -0.02, -0.04)),
        "DemongirlHairTip.R": ((0.0, 0.0, 0.0), (0.115, -0.04, -0.08)),
    }

    run_contact_left = {
        "DemongirlRoot": ((0.0, 0.0, 0.01), (-0.08, 0.0, 0.0)),
        "DemongirlHips": ((0.0, 0.0, 0.0), (0.0, 0.0, 0.06)),
        "DemongirlSpine": ((0.0, 0.0, 0.0), (-0.10, 0.0, -0.045)),
        "DemongirlHead": ((0.0, 0.0, 0.0), (0.05, 0.0, 0.02)),
        "DemongirlLeg.L": ((0.0, 0.0, 0.0), (0.62, 0.0, 0.0)),
        "DemongirlShin.L": ((0.0, 0.0, 0.0), (0.16, 0.0, 0.0)),
        "DemongirlLeg.R": ((0.0, 0.0, 0.0), (-0.62, 0.0, 0.0)),
        "DemongirlShin.R": ((0.0, 0.0, 0.0), (0.82, 0.0, 0.0)),
        "DemongirlTail.01": ((0.0, 0.0, 0.0), (0.02, 0.0, -0.25)),
        "DemongirlTail.02": ((0.0, 0.0, 0.0), (0.0, 0.0, 0.30)),
        "DemongirlHair.L": ((0.0, 0.0, 0.0), (0.08, 0.0, -0.08)),
        "DemongirlHairTip.L": ((0.0, 0.0, 0.0), (0.18, 0.03, -0.16)),
        "DemongirlHair.R": ((0.0, 0.0, 0.0), (0.08, 0.0, -0.08)),
        "DemongirlHairTip.R": ((0.0, 0.0, 0.0), (0.16, -0.03, -0.14)),
        "DemongirlCoat.L": ((0.0, 0.0, 0.0), (0.10, 0.0, -0.08)),
        "DemongirlCoat.R": ((0.0, 0.0, 0.0), (0.10, 0.0, -0.08)),
    }
    run_contact_right = {
        **run_contact_left,
        "DemongirlHips": ((0.0, 0.0, 0.0), (0.0, 0.0, -0.06)),
        "DemongirlSpine": ((0.0, 0.0, 0.0), (-0.10, 0.0, 0.045)),
        "DemongirlHead": ((0.0, 0.0, 0.0), (0.05, 0.0, -0.02)),
        "DemongirlLeg.L": ((0.0, 0.0, 0.0), (-0.62, 0.0, 0.0)),
        "DemongirlShin.L": ((0.0, 0.0, 0.0), (0.82, 0.0, 0.0)),
        "DemongirlLeg.R": ((0.0, 0.0, 0.0), (0.62, 0.0, 0.0)),
        "DemongirlShin.R": ((0.0, 0.0, 0.0), (0.16, 0.0, 0.0)),
        "DemongirlTail.01": ((0.0, 0.0, 0.0), (0.02, 0.0, 0.25)),
        "DemongirlTail.02": ((0.0, 0.0, 0.0), (0.0, 0.0, -0.30)),
        "DemongirlHair.L": ((0.0, 0.0, 0.0), (0.08, 0.0, 0.08)),
        "DemongirlHairTip.L": ((0.0, 0.0, 0.0), (0.16, 0.03, 0.14)),
        "DemongirlHair.R": ((0.0, 0.0, 0.0), (0.08, 0.0, 0.08)),
        "DemongirlHairTip.R": ((0.0, 0.0, 0.0), (0.18, -0.03, 0.16)),
        "DemongirlCoat.L": ((0.0, 0.0, 0.0), (0.10, 0.0, 0.08)),
        "DemongirlCoat.R": ((0.0, 0.0, 0.0), (0.10, 0.0, 0.08)),
    }
    run_air = {
        **run_contact_left,
        "DemongirlRoot": ((0.0, 0.0, 0.07), (-0.06, 0.0, 0.0)),
        "DemongirlLeg.L": ((0.0, 0.0, 0.0), (0.10, 0.0, 0.0)),
        "DemongirlShin.L": ((0.0, 0.0, 0.0), (0.45, 0.0, 0.0)),
        "DemongirlLeg.R": ((0.0, 0.0, 0.0), (-0.10, 0.0, 0.0)),
        "DemongirlShin.R": ((0.0, 0.0, 0.0), (0.45, 0.0, 0.0)),
        "DemongirlHair.L": ((0.0, 0.0, 0.0), (0.12, 0.0, 0.0)),
        "DemongirlHairTip.L": ((0.0, 0.0, 0.0), (0.24, 0.04, 0.0)),
        "DemongirlHair.R": ((0.0, 0.0, 0.0), (0.11, 0.0, 0.0)),
        "DemongirlHairTip.R": ((0.0, 0.0, 0.0), (0.22, -0.04, 0.0)),
    }

    death_start = stand_a
    death_mid = {
        "DemongirlRoot": ((0.0, -0.02, 0.03), (-0.30, 0.0, 0.0)),
        "DemongirlSpine": ((0.0, 0.0, 0.0), (0.18, 0.0, 0.0)),
        "DemongirlHead": ((0.0, 0.0, 0.0), (-0.22, 0.0, 0.0)),
        "DemongirlLeg.L": ((0.0, 0.0, 0.0), (-0.20, 0.0, 0.0)),
        "DemongirlLeg.R": ((0.0, 0.0, 0.0), (0.20, 0.0, 0.0)),
        "DemongirlTail.01": ((0.0, 0.0, 0.0), (0.12, 0.0, -0.25)),
    }
    death_end = {
        "DemongirlRoot": ((0.0, -0.28, 0.10), (-1.48, 0.0, 0.0)),
        "DemongirlHips": ((0.0, 0.0, -0.04), (0.08, 0.0, 0.0)),
        "DemongirlSpine": ((0.0, 0.0, 0.0), (0.22, 0.0, 0.0)),
        "DemongirlHead": ((0.0, 0.0, 0.0), (-0.20, 0.0, 0.0)),
        "DemongirlLeg.L": ((0.0, 0.0, 0.0), (-0.45, 0.0, -0.08)),
        "DemongirlShin.L": ((0.0, 0.0, 0.0), (0.65, 0.0, 0.0)),
        "DemongirlLeg.R": ((0.0, 0.0, 0.0), (-0.35, 0.0, 0.08)),
        "DemongirlShin.R": ((0.0, 0.0, 0.0), (0.55, 0.0, 0.0)),
        "DemongirlTail.01": ((0.0, 0.0, 0.0), (0.20, 0.0, -0.34)),
        "DemongirlTail.02": ((0.0, 0.0, 0.0), (0.0, 0.0, 0.30)),
        "DemongirlHair.L": ((0.0, 0.0, 0.0), (0.25, 0.0, -0.10)),
        "DemongirlHairTip.L": ((0.0, 0.0, 0.0), (0.38, 0.04, -0.18)),
        "DemongirlHair.R": ((0.0, 0.0, 0.0), (0.25, 0.0, 0.10)),
        "DemongirlHairTip.R": ((0.0, 0.0, 0.0), (0.38, -0.04, 0.18)),
        "DemongirlCoat.L": ((0.0, 0.0, 0.0), (0.22, 0.0, -0.12)),
        "DemongirlCoat.R": ((0.0, 0.0, 0.0), (0.22, 0.0, 0.12)),
    }

    actions = [
        make_action(rig, "DemongirlIdle", ((1, seated), (30, seated_breathe), (60, seated))),
        make_action(rig, "DemongirlStand", ((1, stand_a), (20, stand_b), (40, stand_a))),
        make_action(
            rig,
            "DemongirlSitToStand",
            (
                (1, seated),
                (8, blend_pose(seated, stand_a, 0.25)),
                (15, blend_pose(seated, stand_a, 0.52)),
                (22, blend_pose(seated, stand_a, 0.78)),
                (29, stand_a),
            ),
        ),
        make_action(
            rig,
            "DemongirlRun",
            ((1, run_contact_left), (7, run_air), (13, run_contact_right), (19, run_air), (25, run_contact_left)),
        ),
        make_action(rig, "DemongirlDeath", ((1, death_start), (10, death_mid), (22, death_end), (34, death_end))),
    ]
    rig.animation_data.action = next(action for action in actions if action.name == "DemongirlRun")
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 60
    bpy.context.scene.render.fps = 30
    return actions


def point_camera(camera: bpy.types.Object, target: Vector) -> None:
    camera.rotation_euler = (target - camera.location).to_track_quat("-Z", "Y").to_euler()


def setup_preview_scene() -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = True
    if scene.world is None:
        scene.world = bpy.data.worlds.new("PreviewWorld")
    scene.world.color = (0.018, 0.022, 0.032)

    camera_data = bpy.data.cameras.new("PreviewCamera")
    camera = bpy.data.objects.new("PreviewCamera", camera_data)
    scene.collection.objects.link(camera)
    camera.location = (0.0, -5.0, 1.20)
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 3.30
    point_camera(camera, Vector((0.0, 0.0, 1.05)))
    scene.camera = camera

    for name, location, energy, size, color in (
        ("PreviewKey", (-2.8, -3.0, 4.2), 1000, 4.0, (1.0, 0.58, 0.48)),
        ("PreviewFill", (2.6, -1.0, 2.6), 700, 3.0, (0.48, 0.58, 1.0)),
    ):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.shape = "DISK"
        data.size = size
        data.color = color
        light = bpy.data.objects.new(name, data)
        light.location = location
        scene.collection.objects.link(light)
        point_camera(light, Vector((0.0, 0.0, 1.0)))

def apply_hair_lateral_pose(rig: bpy.types.Object, amount: float) -> None:
    if abs(amount) < 0.0001:
        return
    for root_name, tip_name, asymmetry in (
        ("DemongirlHair.L", "DemongirlHairTip.L", 1.0),
        ("DemongirlHair.R", "DemongirlHairTip.R", 0.92),
    ):
        root = rig.pose.bones[root_name]
        tip = rig.pose.bones[tip_name]
        root.rotation_euler.z += -amount * 0.16 * asymmetry
        root.rotation_euler.x += abs(amount) * 0.025
        tip.rotation_euler.z += -amount * 0.34 * asymmetry
        tip.rotation_euler.x += abs(amount) * 0.07


def render_preview(
    rig: bpy.types.Object,
    action_name: str,
    frame: int,
    output: Path,
    hair_lateral: float = 0.0,
) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    rig.animation_data.action = bpy.data.actions[action_name]
    bpy.context.scene.frame_set(frame)
    if abs(hair_lateral) >= 0.0001:
        rig.animation_data.action = None
    apply_hair_lateral_pose(rig, hair_lateral)
    bpy.context.view_layer.update()
    bpy.context.scene.render.filepath = str(output)
    bpy.ops.render.render(write_still=True)


def validate_runtime_export(output: Path) -> dict[str, object]:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    result = bpy.ops.import_scene.gltf(filepath=str(output), import_shading="NORMALS")
    if "FINISHED" not in result:
        raise RuntimeError("Blender could not reimport the animated Demongirl GLB")
    meshes = [
        obj for obj in bpy.context.scene.objects
        if obj.type == "MESH" and obj.name == "Demongirl"
    ]
    armatures = [
        obj for obj in bpy.context.scene.objects
        if obj.type == "ARMATURE" and obj.name == "DemongirlRig"
    ]
    actions = sorted(action.name for action in bpy.data.actions)
    if len(meshes) != 1 or len(armatures) != 1:
        raise RuntimeError(
            f"Demongirl reimport expected one mesh and one armature, got {len(meshes)} and {len(armatures)}"
        )
    armature = armatures[0]
    return {
        "reimported": True,
        "meshCount": len(meshes),
        "armatureCount": len(armatures),
        "boneCount": len(armature.data.bones),
        "animationCount": len(actions),
        "animations": actions,
        "materialCount": len(meshes[0].material_slots),
    }


def main() -> None:
    args = parse_args()
    root_path = project_root()
    source = args.source.expanduser().resolve()
    if not source.is_file():
        raise FileNotFoundError(source)

    export_root = root_path / "exports" / "runner-demongirl"
    runtime_root = root_path / "public" / "assets" / "runner" / "heroes"
    export_root.mkdir(parents=True, exist_ok=True)
    runtime_root.mkdir(parents=True, exist_ok=True)
    preserved_source = export_root / "demongirl-source.fbx"
    if source != preserved_source.resolve():
        shutil.copy2(source, preserved_source)

    bpy.ops.wm.read_factory_settings(use_empty=True)
    import_fbx_without_lights(source)

    meshes = []
    for name, ratio in MESH_RATIOS.items():
        mesh = bpy.data.objects.get(name)
        if mesh is None or mesh.type != "MESH":
            raise RuntimeError(f"Missing demon girl mesh: {name}")
        meshes.append(mesh)
        bpy.context.view_layer.objects.active = mesh
        mesh.select_set(True)
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        if ratio < 1:
            modifier = mesh.modifiers.new(name="RuntimeDecimate", type="DECIMATE")
            modifier.ratio = ratio
            modifier.use_collapse_triangulate = True
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        mesh.select_set(False)

    keep = set(meshes)
    for obj in list(bpy.context.scene.objects):
        if obj not in keep:
            bpy.data.objects.remove(obj, do_unlink=True)

    materials = {
        "skin": make_material("DemonSkin", (0.46, 0.075, 0.105, 1.0), 0.9),
        "eyes": make_material("DemonEyes", (1.0, 0.16, 0.035, 1.0), 0.45, 1.4),
        "hair": make_material("DemonHair", (0.075, 0.018, 0.12, 1.0), 0.75),
        "horns": make_material("DemonHorns", (0.035, 0.032, 0.045, 1.0), 0.88),
        "coat": make_material("DemonCoat", (0.025, 0.03, 0.045, 1.0), 0.86),
        "accent": make_material("DemonCoatAccent", (0.22, 0.022, 0.06, 1.0), 0.82),
        "trim": make_material("DemonCoatTrim", (0.48, 0.22, 0.035, 1.0), 0.62),
    }
    replace_materials(bpy.data.objects["Head"], {"Body": materials["skin"], "Eyes": materials["eyes"]})
    replace_materials(bpy.data.objects["Body"], {"Body": materials["skin"]})
    replace_materials(bpy.data.objects["Tail"], {"Body": materials["skin"]})
    replace_materials(bpy.data.objects["Horns"], {"Body": materials["horns"]})
    replace_materials(bpy.data.objects["Hair"], {"Hair": materials["hair"]})
    replace_materials(
        bpy.data.objects["Trench_coat"],
        {
            "Trench_coat": materials["coat"],
            "Trench_coat_2": materials["accent"],
            "Ext": materials["trim"],
        },
    )
    replace_materials(bpy.data.objects["Hat"], {"Trench_coat": materials["coat"]})

    minimum, maximum = world_bounds(meshes)
    center = (minimum + maximum) * 0.5
    for mesh in meshes:
        mesh.location.x -= center.x
        mesh.location.y -= center.y
        mesh.location.z -= minimum.z

    bpy.ops.object.select_all(action="DESELECT")
    for mesh in meshes:
        mesh.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    demon = bpy.context.view_layer.objects.active
    if demon is None or demon.type != "MESH":
        raise RuntimeError("Could not join the demon girl meshes")
    demon.name = "Demongirl"
    demon.data.name = "Demongirl"
    bpy.context.view_layer.objects.active = demon
    demon.select_set(True)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    bpy.ops.object.select_all(action="DESELECT")
    center_x = anatomical_center_x(demon)
    rig = create_demongirl_rig(center_x)
    weight_counts = assign_demongirl_weights(demon, rig, center_x)
    actions = author_animations(rig)

    setup_preview_scene()
    preview = runtime_root / "girl-preview.png"
    preview_root = export_root / "animation-previews"
    preview_specs = {
        "idle": ("DemongirlIdle", 30, 0.0),
        "stand": ("DemongirlStand", 20, 0.0),
        "sit-to-stand": ("DemongirlSitToStand", 15, 0.0),
        "run": ("DemongirlRun", 7, 0.0),
        "death": ("DemongirlDeath", 34, 0.0),
        "hair-idle": ("DemongirlIdle", 30, 0.0),
        "hair-left": ("DemongirlRun", 7, -1.0),
        "hair-right": ("DemongirlRun", 7, 1.0),
    }
    preview_paths = {}
    for slug, (action_name, frame, hair_lateral) in preview_specs.items():
        path = preview_root / f"demongirl-{slug}.png"
        render_preview(rig, action_name, frame, path, hair_lateral)
        preview_paths[slug] = path
    render_preview(rig, "DemongirlIdle", 30, preview)

    blend_path = export_root / "demongirl.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))

    bpy.ops.object.select_all(action="DESELECT")
    rig.select_set(True)
    demon.select_set(True)
    bpy.context.view_layer.objects.active = rig
    output = runtime_root / "girl.glb"
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
    expected_animations = sorted(action.name for action in actions)
    if len(glb.get("meshes", [])) != 1 or len(glb.get("skins", [])) != 1:
        raise RuntimeError("Demon girl runtime GLB must contain one skinned mesh")
    if animation_names != expected_animations:
        raise RuntimeError(f"Demon girl animation export failed: {animation_names}")
    if len(glb.get("materials", [])) != 7:
        raise RuntimeError("Demon girl rigging changed the seven runtime materials")

    polygon_count = len(demon.data.polygons)
    bone_count = len(rig.data.bones)
    action_channels = {
        animation["name"]: len(animation.get("channels", []))
        for animation in glb.get("animations", [])
    }
    validation = validate_runtime_export(output)
    if validation["animations"] != expected_animations:
        raise RuntimeError(f"Demon girl reimport animation mismatch: {validation['animations']}")

    report = {
        "source": str(preserved_source.relative_to(root_path)),
        "sourceBytes": preserved_source.stat().st_size,
        "sourceSha256": sha256(preserved_source),
        "blend": str(blend_path.relative_to(root_path)),
        "preview": str(preview.relative_to(root_path)),
        "animationPreviews": {
            slug: str(path.relative_to(root_path)) for slug, path in preview_paths.items()
        },
        "output": str(output.relative_to(root_path)),
        "outputBytes": output.stat().st_size,
        "outputSha256": sha256(output),
        "meshCount": len(glb.get("meshes", [])),
        "skinCount": len(glb.get("skins", [])),
        "materialCount": len(glb.get("materials", [])),
        "animations": animation_names,
        "animationChannels": action_channels,
        "boneCount": bone_count,
        "weightCounts": weight_counts,
        "polygonCount": polygon_count,
        "validation": validation,
    }
    (export_root / "export-report.json").write_text(json.dumps(report, indent=2) + "\n")
    print("DEMONGIRL_EXPORT=" + json.dumps(report, sort_keys=True))


if __name__ == "__main__":
    main()
