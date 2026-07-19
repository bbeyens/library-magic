#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "pillow>=10.0.0",
# ]
# ///
"""
Generate images using Google's Gemini image API.

Usage:
    uv run generate_image.py --prompt "your image description" --filename "output.png" [--resolution 1K|2K|4K] [--api-key KEY]
    uv run generate_image.py probe   # prints GEMINI_API_KEY=SET|MISSING and exits
"""

import argparse
import os
import sys
from pathlib import Path


def get_api_key(provided_key: str | None) -> str | None:
    """Get API key from argument first, then environment."""
    if provided_key:
        return provided_key
    return os.environ.get("GEMINI_API_KEY")


def cmd_probe() -> None:
    """Print the SET|MISSING credential contract line used by skip rules and audits."""
    status = "SET" if os.environ.get("GEMINI_API_KEY") else "MISSING"
    print(f"GEMINI_API_KEY={status}")


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "probe":
        cmd_probe()
        return

    parser = argparse.ArgumentParser(
        description="Generate images using Google's Gemini image API"
    )
    parser.add_argument(
        "--prompt", "-p",
        required=True,
        help="Image description/prompt"
    )
    parser.add_argument(
        "--filename", "-f",
        required=True,
        help="Output filename (e.g., sunset-mountains.png)"
    )
    parser.add_argument(
        "--input-image", "-i",
        dest="input_images",
        action="append",
        help="Optional reference image path; repeat for multiple references"
    )
    parser.add_argument(
        "--resolution", "-r",
        choices=["1K", "2K", "4K"],
        default=None,
        help="Output resolution: 1K, 2K (default for generation), or 4K; "
             "when editing, defaults to match the input image size"
    )
    parser.add_argument(
        "--api-key", "-k",
        help="Gemini API key (overrides GEMINI_API_KEY env var)"
    )

    args = parser.parse_args()

    # Get API key
    api_key = get_api_key(args.api_key)
    if not api_key:
        print("Error: No API key provided.", file=sys.stderr)
        print("Please either:", file=sys.stderr)
        print("  1. Provide --api-key argument", file=sys.stderr)
        print("  2. Set GEMINI_API_KEY environment variable", file=sys.stderr)
        sys.exit(1)

    # Import here after checking API key to avoid slow import on error
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    # Initialise client
    client = genai.Client(api_key=api_key)

    # Set up output path
    output_path = Path(args.filename)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Load input image if provided
    input_images = []
    output_resolution = args.resolution
    max_input_dim = 0
    for input_path in args.input_images or []:
        try:
            input_image = PILImage.open(input_path)
            input_image.load()
            input_images.append(input_image)
            width, height = input_image.size
            max_input_dim = max(max_input_dim, width, height)
            print(f"Loaded input image: {input_path} ({width}x{height})")
        except Exception as e:
            print(f"Error loading input image {input_path}: {e}", file=sys.stderr)
            sys.exit(1)

    # Auto-detect from the largest reference when the user does not force size.
    if input_images and output_resolution is None:
        if max_input_dim >= 3000:
            output_resolution = "4K"
        elif max_input_dim >= 1500:
            output_resolution = "2K"
        else:
            output_resolution = "1K"
        print(
            f"Auto-detected resolution: {output_resolution} "
            f"(largest input edge {max_input_dim}px)"
        )
    if output_resolution is None:
        output_resolution = "2K"  # production reference default per SKILL.md

    # Build contents (image first if editing, prompt only if generating)
    if input_images:
        contents = [*input_images, args.prompt]
        print(
            f"Generating from {len(input_images)} reference image(s) "
            f"with resolution {output_resolution}..."
        )
    else:
        contents = args.prompt
        print(f"Generating image with resolution {output_resolution}...")

    try:
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(
                    image_size=output_resolution
                )
            )
        )

        # Process response and convert to PNG. Gemini can return a valid
        # response with no parts (for example after a safety or provider
        # finish); surface that reason instead of throwing on None.
        image_saved = False
        parts = response.parts or []
        if not parts:
            prompt_feedback = getattr(response, "prompt_feedback", None)
            candidates = getattr(response, "candidates", None)
            print(
                "Error: Gemini returned no response parts. "
                f"prompt_feedback={prompt_feedback!r} candidates={candidates!r}",
                file=sys.stderr,
            )
        for part in parts:
            if part.text is not None:
                print(f"Model response: {part.text}")
            elif part.inline_data is not None:
                # Convert inline data to PIL Image and save as PNG
                from io import BytesIO

                # inline_data.data is already bytes, not base64
                image_data = part.inline_data.data
                if isinstance(image_data, str):
                    # If it's a string, it might be base64
                    import base64
                    image_data = base64.b64decode(image_data)

                image = PILImage.open(BytesIO(image_data))

                suffix = output_path.suffix.lower()
                if suffix in {".jpg", ".jpeg"}:
                    # JPEG has no alpha channel: flatten onto white
                    if image.mode in ("RGBA", "LA", "P"):
                        rgba = image.convert("RGBA")
                        flat = PILImage.new("RGB", rgba.size, (255, 255, 255))
                        flat.paste(rgba, mask=rgba.split()[3])
                        flat.save(str(output_path), "JPEG", quality=92)
                    else:
                        image.convert("RGB").save(str(output_path), "JPEG", quality=92)
                else:
                    # PNG supports alpha: preserve it (logos/icons/UI/decals need transparency)
                    if image.mode not in ("RGB", "RGBA"):
                        has_alpha = "A" in image.mode or (
                            image.mode == "P" and "transparency" in image.info
                        )
                        image = image.convert("RGBA" if has_alpha else "RGB")
                    image.save(str(output_path), "PNG")
                    if image.mode == "RGBA":
                        print("Alpha channel preserved (RGBA PNG).")
                image_saved = True

        if image_saved:
            full_path = output_path.resolve()
            print(f"\nImage saved: {full_path}")
        else:
            print("Error: No image was generated in the response.", file=sys.stderr)
            sys.exit(1)

    except Exception as e:
        print(f"Error generating image: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
