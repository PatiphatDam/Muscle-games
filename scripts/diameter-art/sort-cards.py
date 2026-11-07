# usage: python sort-cards.py <renders dir from sort.json> <games/diameter/art dir> <games/sort/art dir>
# Group Sort picture cards (4:3, 360x270) from the 3D renders: sort.json renders + the Diameter art.
import sys, os
from PIL import Image
S, ART, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
def load(p): return Image.open(p).convert('RGBA')
def card(im, name, pad=0.08):
    a = im.getchannel('A').point(lambda v: 255 if v > 20 else 0)
    x0, y0, x1, y1 = a.getbbox()
    w, h = x1 - x0, y1 - y0
    # grow to 4:3 around the model, with a margin
    W = max(w, h * 4 / 3) * (1 + 2 * pad); H = W * 3 / 4
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    box = (round(cx - W / 2), round(cy - H / 2), round(cx + W / 2), round(cy + H / 2))
    c = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), (0, 0, 0, 0))
    c.alpha_composite(im, (-box[0], -box[1]))
    c = c.resize((360, 270), Image.LANCZOS)
    c.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=84, method=6, alpha_quality=90)
    print(name, (w, h))
rot = lambda im, d: im.rotate(d, expand=True, resample=Image.BICUBIC)
card(rot(load(f'{S}/armall-full.png'), 55), 'skeletal')
card(rot(load(f'{S}/biceps-b.png'), 22), 'muscle')
for k in ['fascicle', 'fiber', 'sarcomere']: card(load(f'{ART}/{k}-full.webp'), k)
card(rot(load(f'{ART}/myofibril-full.webp'), 24), 'myofibril')
card(load(f'{S}/cardiac-full.png'), 'cardiac')
card(load(f'{S}/smooth-full.png'), 'smooth')
card(load(f'{S}/filaments-full.png'), 'filaments')
