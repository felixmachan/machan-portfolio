#!/usr/bin/env python3
"""Add intrinsic width/height to every <img> and a 640px srcset variant for large rasters.

Needs macOS `sips` and `cwebp` (brew install webp). Safe to re-run: images that
already have dimensions or a srcset are left alone.

    python3 scripts/optimize_images.py
"""
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / "index.html", *sorted((ROOT / "projects").glob("*.html"))]
VARIANT_W = 640
MIN_W_FOR_VARIANT = 700

SIZES = {
    "doc-header__figure": "(max-width: 900px) 92vw, 560px",
    "case-banner": "(max-width: 720px) 92vw, 1280px",
    "project-card__media": "(max-width: 760px) 92vw, 600px",
}
DEFAULT_SIZES = "(max-width: 780px) 92vw, 600px"


def dims(path: Path):
    if path.suffix == ".svg":
        head = path.read_text()[:600]
        m = re.search(r'width="([\d.]+)"\s+height="([\d.]+)"', head) or re.search(
            r'viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"', head)
        return (round(float(m.group(1))), round(float(m.group(2)))) if m else None
    out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
                         capture_output=True, text=True).stdout
    w, h = re.findall(r"pixel(?:Width|Height): (\d+)", out)
    return int(w), int(h)


def make_variant(src: Path) -> Path:
    out = src.with_name(f"{src.stem}-{VARIANT_W}.webp")
    if out.exists():
        return out
    source = src
    if src.suffix in (".avif", ".heic"):
        tmp = Path(tempfile.mkdtemp()) / f"{src.stem}.png"
        subprocess.run(["sips", "-s", "format", "png", str(src), "--out", str(tmp)],
                       capture_output=True, check=True)
        source = tmp
    subprocess.run(["cwebp", "-quiet", "-q", "80", "-resize", str(VARIANT_W), "0",
                    str(source), "-o", str(out)], check=True)
    return out


def context_sizes(html: str, pos: int) -> str:
    before = html[max(0, pos - 800):pos]
    start = max(before.rfind("<figure"), before.rfind('<div class="project-card__media'))
    opener = before[start:start + 200] if start != -1 else ""
    for cls, sizes in SIZES.items():
        if cls in opener:
            return sizes
    return DEFAULT_SIZES


for page in PAGES:
    html = page.read_text()
    out, last = [], 0
    for m in re.finditer(r"<img\b[^>]*>", html):
        tag = m.group(0)
        src_m = re.search(r'\ssrc="([^"]+)"', tag)
        if not src_m or src_m.group(1).startswith(("http", "data:")):
            continue
        src = (page.parent / src_m.group(1).split("?")[0]).resolve()
        if not src.exists():
            continue
        new = tag
        size = dims(src)
        if size and not re.search(r"\swidth=", tag):
            new = new.replace("<img", f'<img width="{size[0]}" height="{size[1]}"', 1)
        if (size and src.suffix in (".webp", ".png", ".jpg", ".jpeg", ".avif")
                and size[0] > MIN_W_FOR_VARIANT and "srcset=" not in tag and "data-light" not in tag):
            variant = make_variant(src)
            rel_variant = src_m.group(1).rsplit("/", 1)[0] + "/" + variant.name
            sizes = context_sizes(html, m.start())
            new = new.replace(f'src="{src_m.group(1)}"',
                              f'src="{src_m.group(1)}" srcset="{rel_variant} {VARIANT_W}w, {src_m.group(1)} {size[0]}w" sizes="{sizes}"', 1)
        out.append(html[last:m.start()] + new)
        last = m.end()
    out.append(html[last:])
    page.write_text("".join(out))
    print(f"{page.relative_to(ROOT)}: done")
