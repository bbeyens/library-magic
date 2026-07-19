from pathlib import Path

import unreal


MONSTERS = {
    "beholder": "/Game/MonsterForSurvivalGame/Animation/Polyart/Beholder/Beholder_Run_ANIM",
    "cactus": "/Game/MonsterForSurvivalGame/Animation/Polyart/Cactus/Cactus_RunFWD_ANIM",
    "chest-monster": "/Game/MonsterForSurvivalGame/Animation/Polyart/ChestMonster/ChestMonster_Run_ANIM",
    "slime": "/Game/MonsterForSurvivalGame/Animation/Polyart/Slime/Slime_Run_ANIM",
    "turtle-shell": "/Game/MonsterForSurvivalGame/Animation/Polyart/TurtleShell/TurtleShell_Run_ANIM",
}

BASE_COLOR_TEXTURE = "/Game/MonsterForSurvivalGame/Texture/BasecolorDefault_TEX"


def export_runner_monsters() -> None:
    project_root = Path(__file__).resolve().parents[1]
    output_dir = project_root / "public" / "assets" / "runner" / "monsters"
    output_dir.mkdir(parents=True, exist_ok=True)

    options = unreal.GLTFExportOptions()
    options.export_preview_mesh = True
    options.export_vertex_skin_weights = True
    options.export_animation_sequences = True
    options.export_morph_targets = False
    options.texture_image_format = unreal.GLTFTextureImageFormat.PNG

    failed = []
    texture = unreal.EditorAssetLibrary.load_asset(BASE_COLOR_TEXTURE)
    if texture is None:
        failed.append(f"texture: missing {BASE_COLOR_TEXTURE}")
    else:
        texture_task = unreal.AssetExportTask()
        texture_task.object = texture
        texture_task.filename = str(output_dir / "monster-basecolor.png")
        texture_task.automated = True
        texture_task.prompt = False
        texture_task.replace_identical = True
        if not unreal.Exporter.run_asset_export_task(texture_task):
            failed.append("texture: export failed")

    for slug, asset_path in MONSTERS.items():
        animation = unreal.EditorAssetLibrary.load_asset(asset_path)
        if animation is None:
            failed.append(f"{slug}: missing {asset_path}")
            continue

        task = unreal.AssetExportTask()
        task.object = animation
        task.filename = str(output_dir / f"{slug}.glb")
        task.automated = True
        task.prompt = False
        task.replace_identical = True
        task.options = options

        if not unreal.Exporter.run_asset_export_task(task):
            failed.append(f"{slug}: export failed")
        else:
            unreal.log(f"Runner monster exported: {task.filename}")

    if failed:
        raise RuntimeError("Runner monster export failures: " + "; ".join(failed))


export_runner_monsters()
