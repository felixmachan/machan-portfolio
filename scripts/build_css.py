#!/usr/bin/env python3
"""Bundle fonts.css + style.css into minified CSS and inline it into every page.

Run after editing either stylesheet or adding a page:

    python3 scripts/build_css.py

Writes assets/css/style.min.css (kept for reference/external use) and replaces the
<style id="site-css"> block (or a legacy <link> to style.min.css) in each HTML page,
so the first paint needs no extra render-blocking request.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_DIR = ROOT / "assets" / "css"
PAGES = [ROOT / "index.html", *sorted((ROOT / "projects").glob("*.html"))]

src = (CSS_DIR / "fonts.css").read_text() + "\n" + (CSS_DIR / "style.css").read_text()

css = re.sub(r"/\*.*?\*/", "", src, flags=re.S)       # comments
css = re.sub(r"\s+", " ", css)                         # whitespace runs
css = re.sub(r"\s*([{};,>])\s*", r"\1", css)           # around punctuation
css = re.sub(r":\s+", ":", css)                        # after colons (keeps "a :hover" intact)
css = css.replace(";}", "}").strip()

(CSS_DIR / "style.min.css").write_text(css + "\n")

# Inlined copy: font URLs must be root-absolute because the base is the page, not the CSS file.
inline = css.replace("url(../fonts/", "url(/assets/fonts/")
block = f'<style id="site-css">{inline}</style>'
for page in PAGES:
    html = page.read_text()
    html, n = re.subn(r'<style id="site-css">.*?</style>', lambda _: block, html, flags=re.S)
    if not n:
        html, n = re.subn(r'<link rel="stylesheet" href="(?:\.\./)?assets/css/style\.min\.css[^"]*" />',
                          lambda _: block, html)
    page.write_text(html)
    print(f"{page.relative_to(ROOT)}: {'inlined' if n else 'NO CSS SLOT FOUND'}")

print(f"css: {len(src.encode()) // 1024} KiB -> {len(css.encode()) // 1024} KiB")
