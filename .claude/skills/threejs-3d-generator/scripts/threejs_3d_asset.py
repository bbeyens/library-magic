#!/usr/bin/env python3
"""Tripo client for model generation, texturing, stylization, and conversion."""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
from pathlib import Path
import sys
import time
from typing import Any
from urllib import error, parse, request

BASE_URL = "https://api.tripo3d.ai/v2/openapi"
FINAL_STATUSES = {"success", "failed", "banned", "expired", "cancelled", "unknown"}
DOWNLOAD_KEYS = (
    "pbr_model",
    "model",
    "base_model",
    "rendered_image",
    "generated_image",
)
MULTIVIEW_OUTPUT_KEYS = ("generate_multiview_image", "edit_multiview_image")
P1_MODEL_VERSION = "P1-20260311"

class TripoError(RuntimeError):
    pass


def eprint(*parts: object) -> None:
    print(*parts, file=sys.stderr)


def api_key_from(args: argparse.Namespace) -> str:
    key = args.api_key or os.environ.get("TRIPO_API_KEY")
    if not key:
        raise TripoError("Missing API key. Set TRIPO_API_KEY or pass --api-key.")
    return key


def json_request(api_key: str, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    url = f"{BASE_URL}{path}"
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = request.Request(url, data=body, method=method)
    req.add_header("Authorization", f"Bearer {api_key}")
    if payload is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
    except error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        raise TripoError(f"HTTP {exc.code} {exc.reason}: {raw}") from exc
    except error.URLError as exc:
        raise TripoError(f"Request failed: {exc.reason}") from exc
    data = json.loads(raw)
    if data.get("code") != 0:
        raise TripoError(json.dumps(data, indent=2))
    return data


def multipart_upload(api_key: str, file_path: Path) -> str:
    if not file_path.exists():
        raise TripoError(f"Image not found: {file_path}")
    if file_path.stat().st_size > 20 * 1024 * 1024:
        raise TripoError("Tripo upload limit is 20MB.")
    mime = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    ext = file_path.suffix.lower().lstrip(".")
    if ext == "jpg":
        ext = "jpeg"
    if ext not in {"png", "jpeg", "webp"}:
        raise TripoError("Direct image upload accepts png, jpeg/jpg, or webp.")

    boundary = f"tripo-boundary-{int(time.time() * 1000)}"
    content = file_path.read_bytes()
    parts = [
        f"--{boundary}\r\n".encode(),
        (
            f'Content-Disposition: form-data; name="file"; filename="{file_path.name}"\r\n'
            f"Content-Type: {mime}\r\n\r\n"
        ).encode(),
        content,
        f"\r\n--{boundary}--\r\n".encode(),
    ]
    body = b"".join(parts)
    req = request.Request(f"{BASE_URL}/upload/sts", data=body, method="POST")
    req.add_header("Authorization", f"Bearer {api_key}")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    req.add_header("Content-Length", str(len(body)))
    try:
        with request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8")
    except error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        raise TripoError(f"Upload failed: HTTP {exc.code} {exc.reason}: {raw}") from exc
    data = json.loads(raw)
    if data.get("code") != 0:
        raise TripoError(json.dumps(data, indent=2))
    token = data.get("data", {}).get("image_token")
    if not token:
        raise TripoError(f"Upload response did not include image_token: {raw}")
    return token


def image_file_object(api_key: str, source: str) -> dict[str, Any]:
    """Build the documented Tripo image reference object for a URL or local file."""
    parsed_path = parse.urlparse(source).path if source.startswith(("http://", "https://")) else source
    ext = Path(parsed_path).suffix.lower().lstrip(".")
    if ext == "jpg":
        ext = "jpeg"
    image_type = ext if ext in {"png", "jpeg", "webp"} else "image"
    if source.startswith(("http://", "https://")):
        return {"type": image_type, "url": source}
    token = multipart_upload(api_key, Path(source))
    return {"type": image_type, "file_token": token}


def submit_task(api_key: str, payload: dict[str, Any]) -> str:
    data = json_request(api_key, "POST", "/task", payload)
    task_id = data.get("data", {}).get("task_id")
    if not task_id:
        raise TripoError(f"Task response did not include task_id: {data}")
    print(task_id)
    return task_id


def get_task(api_key: str, task_id: str) -> dict[str, Any]:
    return json_request(api_key, "GET", f"/task/{task_id}")["data"]


def wait_for_task(api_key: str, task_id: str, interval: int, timeout: int) -> dict[str, Any]:
    start = time.monotonic()
    while True:
        data = get_task(api_key, task_id)
        status = data.get("status", "unknown")
        progress = data.get("progress", 0)
        eprint(f"{task_id}: {status} {progress}%")
        if status in FINAL_STATUSES:
            return data
        if time.monotonic() - start > timeout:
            raise TripoError(f"Timed out waiting for task {task_id}")
        time.sleep(interval)


def extension_for(key: str, url: str, content_type: str | None = None) -> str:
    path = parse.urlparse(url).path
    ext = Path(path).suffix
    if ext:
        return ext
    if content_type:
        guessed = mimetypes.guess_extension(content_type.split(";")[0].strip())
        if guessed:
            return guessed
    if "image" in key:
        return ".png"
    return ".glb"


def download_url(url: str, out_dir: Path, filename_base: str, key: str) -> Path:
    req = request.Request(url, method="GET")
    with request.urlopen(req, timeout=300) as resp:
        content = resp.read()
        content_type = resp.headers.get("Content-Type")
    ext = extension_for(key, url, content_type)
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"{filename_base}-{key}{ext}"
    path.write_bytes(content)
    return path


def download_outputs(task: dict[str, Any], out_dir: Path) -> list[Path]:
    task_id = task["task_id"]
    output = task.get("output") or {}
    paths: list[Path] = []
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / f"{task_id}.json").write_text(json.dumps(task, indent=2), encoding="utf-8")
    for key in DOWNLOAD_KEYS:
        url = output.get(key)
        if isinstance(url, str) and url.startswith("http"):
            path = download_url(url, out_dir, task_id, key)
            paths.append(path)
            print(path)
    for output_key in MULTIVIEW_OUTPUT_KEYS:
        multiview = output.get(output_key)
        if isinstance(multiview, dict):
            for key, url in multiview.items():
                if isinstance(url, str) and url.startswith("http"):
                    path = download_url(url, out_dir, task_id, key)
                    paths.append(path)
                    print(path)
    if not paths:
        eprint("No downloadable output URLs found.")
    return paths


def add_common_model_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--model-version", default="v3.1-20260211")
    parser.add_argument("--negative-prompt")
    parser.add_argument("--model-seed", type=int)
    parser.add_argument("--image-seed", type=int)
    parser.add_argument("--texture-seed", type=int)
    parser.add_argument("--texture-quality", choices=["standard", "detailed", "extreme"])
    parser.add_argument("--geometry-quality", choices=["standard", "detailed"])
    parser.add_argument("--face-limit", type=int)
    parser.add_argument("--no-texture", action="store_true")
    parser.add_argument("--no-pbr", action="store_true")
    parser.add_argument("--smart-low-poly", action="store_true")
    parser.add_argument("--quad", action="store_true")
    parser.add_argument("--auto-size", action="store_true")
    parser.add_argument("--compress", choices=["geometry", "meshopt"])
    parser.add_argument("--generate-parts", action="store_true")
    parser.add_argument("--no-export-uv", action="store_true")


def apply_common_model_args(args: argparse.Namespace, payload: dict[str, Any]) -> None:
    if args.model_version == P1_MODEL_VERSION:
        unsupported = {
            "negative_prompt": args.negative_prompt,
            "image_seed": args.image_seed,
            "texture_quality": args.texture_quality,
            "geometry_quality": args.geometry_quality,
            "smart_low_poly": args.smart_low_poly,
            "quad": args.quad,
            "auto_size": args.auto_size,
            "compress": args.compress,
            "generate_parts": args.generate_parts,
        }
        invalid = [key for key, value in unsupported.items() if value]
        if invalid:
            raise TripoError(
                f"{P1_MODEL_VERSION} does not support: {', '.join(invalid)}. "
                "Use face_limit plus texture/pbr/export_uv controls only."
            )
    mapping = {
        "negative_prompt": args.negative_prompt,
        "model_seed": args.model_seed,
        "image_seed": args.image_seed,
        "texture_seed": args.texture_seed,
        "texture_quality": args.texture_quality,
        "geometry_quality": args.geometry_quality,
        "face_limit": args.face_limit,
        "smart_low_poly": True if args.smart_low_poly else None,
        "quad": True if args.quad else None,
        "auto_size": True if args.auto_size else None,
        "compress": args.compress,
        "generate_parts": True if args.generate_parts else None,
    }
    for key, value in mapping.items():
        if value is not None:
            payload[key] = value
    if args.no_texture:
        payload["texture"] = False
    if args.no_pbr:
        payload["pbr"] = False
    if args.no_export_uv:
        payload["export_uv"] = False


def maybe_wait_and_download(api_key: str, task_id: str, args: argparse.Namespace) -> dict[str, Any] | None:
    if not args.wait:
        return None
    task = wait_for_task(api_key, task_id, args.interval, args.timeout)
    print(json.dumps(task, indent=2))
    if task.get("status") != "success":
        raise TripoError(f"Task {task_id} ended as {task.get('status')}")
    if args.download:
        download_outputs(task, Path(args.out_dir))
    return task


def cmd_text(args: argparse.Namespace) -> None:
    api_key = api_key_from(args)
    payload: dict[str, Any] = {
        "type": "text_to_model",
        "prompt": args.prompt,
        "model_version": args.model_version,
    }
    apply_common_model_args(args, payload)
    task_id = submit_task(api_key, payload)
    maybe_wait_and_download(api_key, task_id, args)


def cmd_image(args: argparse.Namespace) -> None:
    api_key = api_key_from(args)
    file_obj = image_file_object(api_key, args.image)
    payload: dict[str, Any] = {
        "type": "image_to_model",
        "file": file_obj,
        "model_version": args.model_version,
    }
    if args.enable_image_autofix:
        payload["enable_image_autofix"] = True
    if args.texture_alignment:
        payload["texture_alignment"] = args.texture_alignment
    if args.orientation:
        payload["orientation"] = args.orientation
    apply_common_model_args(args, payload)
    task_id = submit_task(api_key, payload)
    maybe_wait_and_download(api_key, task_id, args)


def cmd_generate_multiview(args: argparse.Namespace) -> None:
    api_key = api_key_from(args)
    payload = {
        "type": "generate_multiview_image",
        "file": image_file_object(api_key, args.image),
    }
    task_id = submit_task(api_key, payload)
    maybe_wait_and_download(api_key, task_id, args)


def parse_multiview_edits(values: list[str]) -> list[dict[str, str]]:
    allowed = {"front", "left", "back", "right"}
    edits: list[dict[str, str]] = []
    seen: set[str] = set()
    for value in values:
        view, separator, prompt = value.partition("=")
        view = view.strip().lower()
        prompt = prompt.strip()
        if not separator or view not in allowed or not prompt:
            raise TripoError(
                "--edit must use VIEW=PROMPT where VIEW is front, left, back, or right"
            )
        if view in seen:
            raise TripoError(f"duplicate multiview edit for {view}")
        seen.add(view)
        edits.append({"view": view, "prompt": prompt})
    return edits


def cmd_edit_multiview(args: argparse.Namespace) -> None:
    api_key = api_key_from(args)
    payload = {
        "type": "edit_multiview_image",
        "original_task_id": args.original_task_id,
        "prompts": parse_multiview_edits(args.edit),
    }
    task_id = submit_task(api_key, payload)
    maybe_wait_and_download(api_key, task_id, args)


def cmd_multiview(args: argparse.Namespace) -> None:
    api_key = api_key_from(args)
    supplied_views = [args.front, args.left, args.back, args.right]
    if args.original_task_id and any(supplied_views):
        raise TripoError("--original-task-id is mutually exclusive with explicit view files")
    if not args.original_task_id:
        if not args.front:
            raise TripoError("--front is mandatory when passing explicit multiview files")
        if sum(bool(value) for value in supplied_views) < 2:
            raise TripoError("Tripo multiview generation requires at least two supplied views")

    payload: dict[str, Any] = {
        "type": "multiview_to_model",
        "model_version": args.model_version,
    }
    if args.original_task_id:
        payload["original_task_id"] = args.original_task_id
    else:
        payload["files"] = [
            image_file_object(api_key, source) if source else {}
            for source in supplied_views
        ]
    if args.texture_alignment:
        payload["texture_alignment"] = args.texture_alignment
    if args.orientation:
        payload["orientation"] = args.orientation
    apply_common_model_args(args, payload)
    task_id = submit_task(api_key, payload)
    maybe_wait_and_download(api_key, task_id, args)


def cmd_status(args: argparse.Namespace) -> None:
    api_key = api_key_from(args)
    print(json.dumps(get_task(api_key, args.task_id), indent=2))


def cmd_download(args: argparse.Namespace) -> None:
    api_key = api_key_from(args)
    task = get_task(api_key, args.task_id)
    if task.get("status") != "success":
        raise TripoError(f"Task is {task.get('status')}; download URLs are available after success.")
    download_outputs(task, Path(args.out_dir))


def normalized_post_type(value: str) -> str:
    aliases = {
        "convert_model": "conversion",
        "conversion": "conversion",
        "lowpoly": "highpoly_to_lowpoly",
    }
    return aliases.get(value, value)


def cmd_postprocess(args: argparse.Namespace) -> None:
    task_type = normalized_post_type(args.type)
    allowed_types = {"texture_model", "conversion", "highpoly_to_lowpoly", "stylize_model"}
    if task_type not in allowed_types:
        raise TripoError(
            f"Unsupported postprocess type {task_type!r}. "
            f"Allowed: {', '.join(sorted(allowed_types))}"
        )
    api_key = api_key_from(args)
    payload: dict[str, Any] = {
        "type": task_type,
        "original_model_task_id": args.original_task_id,
    }
    default_versions = {
        "texture_model": "v3.0-20250812",
        "highpoly_to_lowpoly": "P-v2.0-20251225",
    }
    model_version = args.model_version or default_versions.get(task_type)
    if model_version:
        payload["model_version"] = model_version
    if task_type == "texture_model":
        if not args.texture_prompt:
            raise TripoError("--texture-prompt is required for texture_model")
        payload["texture_prompt"] = {"text": args.texture_prompt}
        if args.texture_quality:
            payload["texture_quality"] = args.texture_quality
    elif task_type == "conversion":
        if not args.format:
            raise TripoError("--format is required for conversion")
        payload["format"] = args.format
        for key in ("face_limit", "texture_size", "flatten_bottom_threshold"):
            value = getattr(args, key)
            if value is not None:
                payload[key] = value
        if args.quad:
            payload["quad"] = True
        if args.force_symmetry:
            payload["force_symmetry"] = True
        if args.flatten_bottom:
            payload["flatten_bottom"] = True
    elif task_type == "highpoly_to_lowpoly":
        if args.face_limit:
            payload["face_limit"] = args.face_limit
    elif task_type == "stylize_model":
        if not args.style:
            raise TripoError("--style is required for stylize_model")
        payload["style"] = args.style
        if args.block_size:
            payload["block_size"] = args.block_size

    task_id = submit_task(api_key, payload)
    maybe_wait_and_download(api_key, task_id, args)



def cmd_probe(args: argparse.Namespace) -> None:
    """Print the SET|MISSING credential contract line used by skip rules and audits."""
    status = "SET" if os.environ.get("TRIPO_API_KEY") else "MISSING"
    print(f"TRIPO_API_KEY={status}")


def add_shared_runtime_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--api-key")
    parser.add_argument("--wait", action="store_true")
    parser.add_argument("--download", action="store_true")
    parser.add_argument("--out-dir", default="tripo-output")
    parser.add_argument("--interval", type=int, default=8)
    parser.add_argument("--timeout", type=int, default=600)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Tripo OpenAPI 3D asset helper")
    sub = parser.add_subparsers(dest="command", required=True)

    probe = sub.add_parser("probe", help="print TRIPO_API_KEY=SET|MISSING")
    probe.set_defaults(func=cmd_probe)

    text = sub.add_parser("text", help="submit text_to_model")
    text.add_argument("--prompt", required=True)
    add_common_model_args(text)
    add_shared_runtime_args(text)
    text.set_defaults(func=cmd_text)

    image = sub.add_parser("image", help="submit image_to_model from local path or URL")
    image.add_argument("--image", required=True)
    image.add_argument("--enable-image-autofix", action="store_true")
    image.add_argument("--texture-alignment", choices=["original_image", "geometry"])
    image.add_argument("--orientation", choices=["default", "align_image"])
    add_common_model_args(image)
    add_shared_runtime_args(image)
    image.set_defaults(func=cmd_image)

    generate_multiview = sub.add_parser(
        "generate-multiview",
        help="derive front/left/back/right images from one clean source image",
    )
    generate_multiview.add_argument("--image", required=True)
    add_shared_runtime_args(generate_multiview)
    generate_multiview.set_defaults(func=cmd_generate_multiview)

    edit_multiview = sub.add_parser(
        "edit-multiview",
        help="edit one or more views from a generate-multiview task",
    )
    edit_multiview.add_argument("--original-task-id", required=True)
    edit_multiview.add_argument(
        "--edit",
        action="append",
        required=True,
        metavar="VIEW=PROMPT",
    )
    add_shared_runtime_args(edit_multiview)
    edit_multiview.set_defaults(func=cmd_edit_multiview)

    multiview = sub.add_parser(
        "multiview",
        help="submit multiview_to_model from a reviewed task ID or explicit views",
    )
    multiview.add_argument("--original-task-id")
    multiview.add_argument("--front")
    multiview.add_argument("--left")
    multiview.add_argument("--back")
    multiview.add_argument("--right")
    multiview.add_argument("--texture-alignment", choices=["original_image", "geometry"])
    multiview.add_argument("--orientation", choices=["default", "align_image"])
    add_common_model_args(multiview)
    add_shared_runtime_args(multiview)
    multiview.set_defaults(func=cmd_multiview)

    status = sub.add_parser("status", help="get task status")
    status.add_argument("task_id")
    status.add_argument("--api-key")
    status.set_defaults(func=cmd_status)

    download = sub.add_parser("download", help="download successful task outputs")
    download.add_argument("task_id")
    download.add_argument("--api-key")
    download.add_argument("--out-dir", default="tripo-output")
    download.set_defaults(func=cmd_download)

    post = sub.add_parser("postprocess", help="submit Tripo postprocess task")
    post.add_argument("--type", required=True)
    post.add_argument("--original-task-id", required=True)
    post.add_argument("--model-version")
    post.add_argument("--texture-prompt")
    post.add_argument("--texture-quality", choices=["standard", "detailed", "extreme"])
    post.add_argument("--format", choices=["GLTF", "USDZ", "FBX", "OBJ", "STL", "3MF"])
    post.add_argument("--face-limit", type=int)
    post.add_argument("--texture-size", type=int)
    post.add_argument("--quad", action="store_true")
    post.add_argument("--force-symmetry", action="store_true")
    post.add_argument("--flatten-bottom", action="store_true")
    post.add_argument("--flatten-bottom-threshold", type=float)
    post.add_argument("--style", choices=["lego", "voxel", "voronoi", "minecraft"])
    post.add_argument("--block-size", type=int)
    add_shared_runtime_args(post)
    post.set_defaults(func=cmd_postprocess)


    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
    except TripoError as exc:
        eprint(f"threejs_3d_asset.py: {exc}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
