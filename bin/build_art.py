"""Convert the Midjourney PNG sets in ../Images into web-sized WebP files.

Each set has four stylistic variants (suffix _0.._3). For every variant this
writes two files into static-site/art/:
    <name>-<v>-800.webp   long side 800 px  (plates, small slots)
    <name>-<v>-1600.webp  long side 1600 px, or native size if smaller

Run from the repository root:
    python3 bin/build_art.py
"""

from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parents[2] / "Images"
OUT = Path(__file__).resolve().parents[1] / "static-site" / "art"

# set id -> (short name, crop box or None)
SETS = {
    "86150370": ("moire", None),
    "2f2d702d": ("streamlines", None),  # "n = 7" label painted out below
    "287491d0": ("domain-walls", (16, 16, 1248, 928)),  # painted frame
    "1e52f029": ("rhombi", (0, 0, 1024, 964)),  # artefact along the bottom of _3
    "450fc0a7": ("orbitals", None),
    "50561f59": ("network", None),
    "8df82f73": ("layers", (28, 4, 1284, 908)),  # border rules at both sides
    "ad4fdd97": ("springs", None),
    "cac766ca": ("lattice", None),
    "e11a174d": ("defects", (0, 0, 1184, 975)),  # tick marks along the bottom of _3
    "ed7bafa2": ("hexagrams", (0, 0, 744, 752)),  # left panel of the diptych
    "f4d3418d": ("staging", (22, 23, 1166, 298)),  # top strip of three, inside its frame
    "f7272318": ("net", None),
}


def paint_out_label(im):
    """Cover the "n = 7" label (top left) with the background colour of each row.

    The top chain rises through the label's rows further right, so a crop
    would clip it. The background just right of the label is plain.
    """
    px = im.load()
    for y in range(80):
        sample = [px[x, y] for x in range(230, 246)]
        fill = tuple(sum(c[i] for c in sample) // len(sample) for i in range(3))
        for x in range(230):
            px[x, y] = fill
    return im


def resized(im, long_side):
    scale = min(1.0, long_side / max(im.size))
    if scale == 1.0:
        return im
    return im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for set_id, (name, box) in SETS.items():
        for v in range(4):
            [path] = SRC.glob(f"*_{set_id}-*_{v}.png")
            im = Image.open(path).convert("RGB")
            if box:
                im = im.crop(box)
            if name == "streamlines":
                im = paint_out_label(im)
            for size in (800, 1600):
                dest = OUT / f"{name}-{v}-{size}.webp"
                resized(im, size).save(dest, "WEBP", quality=80, method=6)
        print(f"{name:13s} {im.width}x{im.height}")


if __name__ == "__main__":
    main()
