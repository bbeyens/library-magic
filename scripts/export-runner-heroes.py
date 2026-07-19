from pathlib import Path

import unreal


HEROES = {
    "boy": "/Game/RPGHeroSquad/Mesh/Character/SK_TinyHeroPolyart",
    "girl": "/Game/RPGHeroSquad/Mesh/Character/SK_TinyHeroGirlPolyart",
}

RUN_ANIMATION = (
    "/Game/RPGHeroSquad/Animation/TinyHero/InPlace/Anim_MoveFWD_Normal_InPlace_TinyHero"
)
BASE_COLOR_TEXTURE = "/Game/RPGHeroSquad/Texture/TinyHero/T_BaseColor_TinyHero"


def export_runner_heroes() -> None:
    project_root = Path(__file__).resolve().parents[1]
    output_dir = project_root / "public" / "assets" / "runner" / "heroes"
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
        texture_task.filename = str(output_dir / "hero-basecolor.png")
        texture_task.automated = True
        texture_task.prompt = False
        texture_task.replace_identical = True
        if not unreal.Exporter.run_asset_export_task(texture_task):
            failed.append("texture: export failed")

    animation = unreal.EditorAssetLibrary.load_asset(RUN_ANIMATION)
    if animation is None:
        failed.append(f"animation: missing {RUN_ANIMATION}")
    else:
        for slug, mesh_path in HEROES.items():
            mesh = unreal.EditorAssetLibrary.load_asset(mesh_path)
            if mesh is None:
                failed.append(f"{slug}: missing {mesh_path}")
                continue

            animation.set_preview_skeletal_mesh(mesh)
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
                unreal.log(f"Runner hero exported: {task.filename}")

    if failed:
        raise RuntimeError("Runner hero export failures: " + "; ".join(failed))


export_runner_heroes()
