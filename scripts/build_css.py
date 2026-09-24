#!/usr/bin/env python3
"""Bundle fonts.css + style.css into a minified style.min.css.

Run after editing either stylesheet:  python3 scripts/build_css.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "assets" / "css"
src = (ROOT / "fonts.css").read_text() + "\n" + (ROOT / "style.css").read_text()

css = re.sub(r"/\*.*?\*/", "", src, flags=re.S)       # comments
css = re.sub(r"\s+", " ", css)                         # whitespace runs
css = re.sub(r"\s*([{};,>])\s*", r"\1", css)           # around punctuation
css = re.sub(r":\s+", ":", css)                        # after colons (keeps "a :hover" intact)
css = css.replace(";}", "}").strip()

(ROOT / "style.min.css").write_text(css + "\n")
print(f"style.min.css: {len(src.encode()) // 1024} KiB -> {len(css.encode()) // 1024} KiB")
