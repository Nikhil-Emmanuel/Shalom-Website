"""
Prepares the home's logo for the web from MEDIA FILES/Shalom_Home_LOGO.png.

The supplied file is RGBA but fully opaque, sitting on a near-white background
that is not quite one colour (247-255 across the edges, with a faint vignette).
Dropped straight onto the site's cream canvas it would read as a white rectangle,
so the background has to actually be removed rather than assumed transparent.

Background removal is a flood fill from the four corners, NOT a "replace every
white pixel" pass. That distinction matters: the centre of the mark is a white
disc holding the gold S, and it is enclosed by the gold ring, so a flood fill
from outside cannot reach it. A global white-to-alpha replacement would punch a
hole straight through the middle of the logo.

Outputs:
  public/logo.png        trimmed, transparent — header, footer, structured data
  src/app/icon.png       512px favicon, cream background (see note below)
  src/app/apple-icon.png 180px home-screen icon, cream background

The icons keep a solid cream background on purpose. A transparent favicon
against a dark browser theme would leave the gold S floating on whatever colour
the browser chooses, and the mark stops reading.

Run: python scripts/prepare_logo.py
"""

import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "MEDIA FILES", "Shalom_Home_LOGO.png")
PUBLIC = os.path.join(ROOT, "public")
APP = os.path.join(ROOT, "src", "app")

CANVAS = (250, 248, 243)  # --color-canvas #faf8f3
TOLERANCE = 30


def strip_background(image: Image.Image) -> Image.Image:
    """Flood fill the outer background to transparent, from every corner."""
    rgb = image.convert("RGB")
    w, h = rgb.size

    # Fill with a colour that does not occur in the artwork, then map it to alpha 0.
    sentinel = (255, 0, 255)
    for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(rgb, corner, sentinel, thresh=TOLERANCE)

    out = image.convert("RGBA")
    pixels = out.load()
    marked = rgb.load()
    cleared = 0
    for y in range(h):
        for x in range(w):
            if marked[x, y] == sentinel:
                r, g, b, _ = pixels[x, y]
                pixels[x, y] = (r, g, b, 0)
                cleared += 1

    print(f"  background cleared: {cleared:,} px ({cleared / (w * h):.1%})")
    return out


def compress(image: Image.Image, path: str) -> None:
    """
    Quantise before saving. The mark is flat vector-style colour, so a 256-entry
    palette is visually indistinguishable from truecolour here while cutting the
    file by roughly 85% — 318kB to well under 50kB. That matters twice over: the
    footer loads it on every page, and search engines fetch /logo.png directly
    for the organisation's structured data, bypassing next/image entirely.

    FASTOCTREE is used because it is the one PIL quantiser that keeps the alpha
    channel; the default would flatten the transparency we just cut out.
    """
    quantised = image.quantize(
        colors=256, method=Image.FASTOCTREE, dither=Image.FLOYDSTEINBERG
    )
    quantised.save(path, optimize=True)
    print(f"  {os.path.relpath(path, ROOT).replace(os.sep, '/'):<24} "
          f"{image.width}x{image.height}  {os.path.getsize(path) // 1024}kB")


def on_canvas(logo: Image.Image, size: int, pad_ratio: float = 0.12) -> Image.Image:
    """Square icon: the mark centred on cream, with breathing room."""
    inner = int(size * (1 - pad_ratio * 2))
    scaled = logo.copy()
    scaled.thumbnail((inner, inner), Image.LANCZOS)

    canvas = Image.new("RGBA", (size, size), CANVAS + (255,))
    canvas.paste(
        scaled,
        ((size - scaled.width) // 2, (size - scaled.height) // 2),
        scaled,
    )
    return canvas


def main() -> None:
    original = Image.open(SRC)
    print(f"source: {original.size[0]}x{original.size[1]} {original.mode}")

    logo = strip_background(original)

    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    print(f"  trimmed to: {logo.width}x{logo.height}")

    os.makedirs(PUBLIC, exist_ok=True)

    # Comfortably above 2x the largest on-page use (56px in the footer) and
    # above the 112px minimum Google wants for an organisation logo.
    web = logo.copy()
    web.thumbnail((440, 440), Image.LANCZOS)
    compress(web, os.path.join(PUBLIC, "logo.png"))

    compress(on_canvas(logo, 512), os.path.join(APP, "icon.png"))
    compress(on_canvas(logo, 180), os.path.join(APP, "apple-icon.png"))


if __name__ == "__main__":
    main()
