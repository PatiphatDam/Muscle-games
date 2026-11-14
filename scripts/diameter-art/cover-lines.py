"""Blueprint half of the Diameter hub cover: white line drawing of the whole-muscle render.

usage: python scripts/diameter-art/cover-lines.py
Reads src/muscle-games/games/diameter/art/muscle-grey.webp and writes cover-lines.webp next to it (same 3:2 frame and
camera as the other renders, so it lines up with muscle-full.webp on the cover).
"""
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ART = Path(__file__).resolve().parents[2] / 'src/muscle-games/games/diameter/art'

im = Image.open(ART / 'muscle-grey.webp').convert('RGBA').resize((1800, 1200), Image.LANCZOS)
alpha = im.getchannel('A')
grey = Image.composite(im.convert('L'), Image.new('L', im.size, 0), alpha)
# shading edges (folds, fibre lines) plus the outline, thickened a little and softened
inner = grey.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 28 else (0 if v < 14 else v * 3))
outline = alpha.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 60 else 0)
lines = ImageChops.lighter(inner, outline).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
out = Image.new('RGBA', im.size, (240, 246, 255, 0))
out.putalpha(lines)
out.resize((1350, 900), Image.LANCZOS).save(ART / 'cover-lines.webp', quality=82, method=6)
