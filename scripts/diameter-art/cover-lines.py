"""Blueprint half of the Diameter hub cover: the whole-muscle render as a technical line drawing.

usage: python scripts/diameter-art/cover-lines.py
Reads the whole-muscle renders in src/muscle-games/games/diameter/art and writes cover-lines.webp next to them (same 3:2
frame and camera as the other renders, so it lines up with muscle-full.webp on the cover). The drawing is: a clean
outline of the arm and of each part (biceps, triceps, bones, epimysium), faint fibre lines inside, and a light tint.
"""
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ART = Path(__file__).resolve().parents[2] / 'src/muscle-games/games/diameter/art'
SIZE = (1800, 1200)  # drawn at 2x, saved at 1.5x


def solid(name):
    """Where the render is opaque, as a clean black/white mask."""
    a = Image.open(ART / f'{name}.webp').convert('RGBA').resize(SIZE, Image.LANCZOS).getchannel('A')
    return a.point(lambda v: 255 if v > 100 else 0).filter(ImageFilter.MedianFilter(5))


def outline(mask):
    return mask.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v else 0).filter(ImageFilter.MaxFilter(3))


whole = solid('muscle-grey')
lines = outline(whole)
for part in ('biceps', 'triceps', 'bone', 'epimysium'):
    lines = ImageChops.lighter(lines, outline(solid(f'muscle-{part}')))
lines = lines.filter(ImageFilter.GaussianBlur(0.7))

# faint fibre lines: the strongest shading edges of the grey render, kept away from the outline
grey_img = Image.open(ART / 'muscle-grey.webp').convert('RGBA').resize(SIZE, Image.LANCZOS)
grey = Image.composite(grey_img.convert('L'), Image.new('L', SIZE, 0), whole).filter(ImageFilter.GaussianBlur(1.2))
detail = grey.filter(ImageFilter.FIND_EDGES).point(lambda v: 110 if v > 9 else 0)
detail = ImageChops.multiply(detail, whole.filter(ImageFilter.MinFilter(9))).filter(ImageFilter.GaussianBlur(0.5))

tint = whole.point(lambda v: 20 if v else 0)
out = Image.new('RGBA', SIZE, (240, 246, 255, 0))
out.putalpha(ImageChops.lighter(ImageChops.lighter(lines, detail), tint))
out.resize((1350, 900), Image.LANCZOS).save(ART / 'cover-lines.webp', quality=82, method=6)
