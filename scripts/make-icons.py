#!/usr/bin/env python3
"""Genera le icone PNG della PWA senza dipendenze esterne."""
import struct
import zlib
from pathlib import Path

BG = (8, 12, 20)
NEON = (0, 255, 135)
DIM = (56, 189, 248)


def png(path: Path, size: int) -> None:
    w = h = size
    px = [[BG for _ in range(w)] for _ in range(h)]

    # sfondo con leggero bagliore centrale
    for y in range(h):
        for x in range(w):
            d = ((x - w / 2) ** 2 + (y - h / 2) ** 2) ** 0.5 / (w / 2)
            if d < 1:
                k = int(12 * (1 - d))
                px[y][x] = tuple(min(255, c + k) for c in BG)

    def dist_seg(px_, py_, x0, y0, x1, y1):
        dx, dy = x1 - x0, y1 - y0
        if dx == 0 and dy == 0:
            return ((px_ - x0) ** 2 + (py_ - y0) ** 2) ** 0.5
        t = max(0, min(1, ((px_ - x0) * dx + (py_ - y0) * dy) / (dx * dx + dy * dy)))
        return ((px_ - (x0 + t * dx)) ** 2 + (py_ - (y0 + t * dy)) ** 2) ** 0.5

    def line(x0, y0, x1, y1, width, color):
        x0, y0, x1, y1 = [int(v) for v in (x0, y0, x1, y1)]
        width = max(1, int(width))
        lo_x, hi_x = max(0, min(x0, x1) - width), min(w - 1, max(x0, x1) + width)
        lo_y, hi_y = max(0, min(y0, y1) - width), min(h - 1, max(y0, y1) + width)
        for y in range(lo_y, hi_y + 1):
            for x in range(lo_x, hi_x + 1):
                if dist_seg(x, y, x0, y0, x1, y1) <= width:
                    px[y][x] = color

    s = size
    # martelletto: manico + testa
    line(s * 0.30, s * 0.74, s * 0.58, s * 0.44, s * 0.035, NEON)
    line(s * 0.50, s * 0.24, s * 0.78, s * 0.50, s * 0.055, NEON)
    line(s * 0.44, s * 0.19, s * 0.62, s * 0.35, s * 0.030, DIM)
    # base del martelletto
    line(s * 0.32, s * 0.80, s * 0.72, s * 0.80, s * 0.018, DIM)

    raw = b''.join(b'\x00' + b''.join(bytes(c) for c in row) for row in px)

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack(
            '>I', zlib.crc32(tag + data) & 0xFFFFFFFF
        )

    out = b'\x89PNG\r\n\x1a\n'
    out += chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
    out += chunk(b'IDAT', zlib.compress(raw, 9))
    out += chunk(b'IEND', b'')
    path.write_bytes(out)
    print(f'{path}: {len(out)} byte')


root = Path(__file__).resolve().parents[1] / 'public' / 'icons'
root.mkdir(parents=True, exist_ok=True)
for size in (192, 512):
    png(root / f'icon-{size}.png', size)
png(root / 'apple-touch-icon.png', 180)
