#!/usr/bin/env python3
"""Render 1200x630 Open Graph cards for every page with headless Chromium.

    CHROME=/path/to/chrome python3 scripts/build_og.py

Cards are written to assets/img/og/<slug>.jpg (needs ffmpeg for PNG -> JPG).
"""
import os
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "img" / "og"
CHROME = os.environ.get("CHROME", "google-chrome")

# slug, drawing no, domain, title, subtitle, visual, visual mode
#   cover: fill the frame (crops) · diagram: wide frame, contain · fit: frame hugs the whole image
CARDS = [
    ("index", "FM-PF-2026", "Portfolio · Rev D", "Felix Machán",
     "Mechatronics engineer building real systems — mechanical, electrical, software.",
     "img/felix-headshot.webp", "fit"),
    ("cheerlify", "FM-SW-004", "Software · Product", "Cheerlify",
     "Live race tracking with voice cheers that play at the kilometre they were meant for.",
     "img/cheerlify/cover.webp", "cover"),
    ("vanoor", "FM-SW-005", "Software · Product", "Vanoor",
     "Apple Watch-first running: offline GPX routes, structured workouts, race pacing.",
     "img/vanoor/cover.webp", "cover"),
    ("network", "FM-NW-001", "Infrastructure", "Home Server & Network",
     "A Proxmox home server hosting production workloads with zero open ports.",
     "img/network/topology-light.svg", "diagram"),
    ("distance-sensor", "FM-EE-002", "Electrical", "Zigbee ToF Distance Sensor",
     "Battery-powered ESP32-H2 sensor on a custom two-revision KiCad PCB.",
     "img/distancesensor/floorplan-light.svg", "diagram"),
    ("buttonbox", "FM-EE-001", "Electrical", "Sim Racing Button Box",
     "RP2040 USB HID controller: 12 buttons, 4 encoders and 64 LEDs on one PCB.",
     "img/buttonbox/floorplan-light.svg", "diagram"),
    ("custom-sim-racing-pedals", "FM-ME-001", "Mechanical", "Sim Racing Pedals — ME1",
     "A CNC-machined pedal set engineered end to end, from CAD to control electronics.",
     "img/pedals/pedals.avif", "fit"),
    ("talppont", "FM-SW-002", "Software", "Talppont Website",
     "A calm, fast website for a massage parlour in Vác.",
     "img/talppont/talppont-welcome.jpg", "fit"),
]

TEMPLATE = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Archivo;src:url('{fonts}/archivo-normal-400-800-latin.woff2') format('woff2');font-weight:400 800;font-stretch:100% 116%}}
@font-face{{font-family:Archivo;src:url('{fonts}/archivo-normal-400-800-latin-ext.woff2') format('woff2');font-weight:400 800;font-stretch:100% 116%;unicode-range:U+0100-02BA,U+1E00-1EFF}}
@font-face{{font-family:Plex;src:url('{fonts}/ibm-plex-mono-normal-500-latin.woff2') format('woff2');font-weight:500}}
*{{margin:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{background:#f3f3ef;background-image:linear-gradient(rgba(27,29,33,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,29,33,.05) 1px,transparent 1px);background-size:48px 48px;font-family:Archivo,sans-serif;color:#1b1d21;position:relative}}
.sheet{{position:absolute;inset:28px;border:1.5px solid #383b40}}
.mono{{font-family:Plex,monospace;text-transform:uppercase;letter-spacing:.14em;font-size:15px}}
.left{{position:absolute;left:64px;top:64px;width:{lw}px}}
.eyebrow{{color:#b05c1e;display:flex;gap:14px;align-items:center}}
.eyebrow:before{{content:"";width:34px;height:1.5px;background:#b05c1e}}
h1{{font-size:{size}px;line-height:.95;font-weight:800;font-stretch:112%;text-transform:uppercase;margin:26px 0 24px;letter-spacing:-.01em}}
p{{font-size:{ps}px;line-height:1.4;color:#43474d}}
.visual{{position:absolute;right:64px;top:{vt}px;width:{vw}px;height:{vh}px;border:1.5px solid #383b40;background:#fbfbf9;padding:10px;overflow:hidden}}
.visual img{{width:100%;height:100%;object-fit:{fit};display:block}}
.tb{{position:absolute;left:28px;right:28px;bottom:28px;height:62px;border-top:1.5px solid #383b40;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;background:#fbfbf9}}
.tb div{{border-right:1px solid #d9d8d0;padding:10px 16px}}
.tb div:last-child{{border-right:0}}
.tb small{{display:block;font-family:Plex,monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#6a6e74}}
.tb b{{font-family:Plex,monospace;font-weight:500;font-size:16px;letter-spacing:.06em}}
.mark{{position:absolute;width:22px;height:22px;border-color:#383b40;border-style:solid}}
</style></head><body>
<div class="sheet"></div>
<div class="left"><div class="mono eyebrow">{dwg} · {domain}</div><h1>{title}</h1><p>{subtitle}</p></div>
<div class="visual"><img src="{visual}"></div>
<div class="tb"><div><small>Drawn by</small><b>Felix Machán</b></div><div><small>DWG no</small><b>{dwg}</b></div><div><small>Web</small><b>felixmachan.hu</b></div><div><small>Rev</small><b style="color:#b05c1e">2026</b></div></div>
</body></html>"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp())
    assets = (ROOT / "assets").as_uri()
    for slug, dwg, domain, title, subtitle, visual, mode in CARDS:
        wide = mode == "diagram"
        vw, vh, vt = (640 if wide else 460), 440, 64
        if mode == "fit":  # size the frame to the image so nothing is cropped or letterboxed
            out = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(ROOT / "assets" / visual)],
                                 capture_output=True, text=True).stdout
            iw, ih = map(int, re.findall(r"pixel(?:Width|Height): (\d+)", out))
            k = min(580 / iw, 440 / ih)
            vw, vh = round(iw * k) + 20, round(ih * k) + 20
            vt = 64 + (460 - vh) // 2
        lw = 1200 - 128 - vw - 40
        if wide:
            size = 52 if len(title) <= 14 else 42 if len(title) <= 24 else 38
        else:
            size = 76 if len(title) <= 14 else 60 if len(title) <= 24 else 52
        html = TEMPLATE.format(fonts=f"{assets}/fonts", dwg=dwg, domain=domain, title=title,
                               subtitle=subtitle, visual=f"{assets}/{visual}", size=size,
                               vw=vw, lw=lw, ps=21 if wide else 25,
                               vh=vh, vt=vt, fit="cover" if mode == "cover" else "contain")
        page = tmp / f"{slug}.html"
        page.write_text(html)
        png = tmp / f"{slug}.png"
        subprocess.run([CHROME, "--headless=new", "--no-sandbox", "--hide-scrollbars",
                        "--force-device-scale-factor=1", "--window-size=1200,630",
                        "--virtual-time-budget=3000", f"--screenshot={png}", page.as_uri()],
                       check=True, capture_output=True)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(png), "-q:v", "3",
                        str(OUT / f"{slug}.jpg")], check=True)
        print("og:", slug)


if __name__ == "__main__":
    main()
