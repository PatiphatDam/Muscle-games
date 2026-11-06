# usage: python to-webp.py <renders dir> <games/diameter/art dir> — PNG renders from drive.mjs to the game's WebP art
import os, sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
for f in sorted(os.listdir(src)):
    if not f.endswith('.png') or f in ('decoy-grey.png', 'decoy2-grey.png', 'decoy-full.png', 'decoy2-full.png'):
        continue
    name = f[:-4].replace('decoy2-', 'decoy-')
    Image.open(os.path.join(src, f)).convert('RGBA').save(os.path.join(dst, name + '.webp'), 'WEBP', quality=82, method=6, alpha_quality=90)
