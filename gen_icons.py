"""Generate minimal PNG icons for PWA using only stdlib (no Pillow needed).
Creates simple checklist-themed icons at 192x192 and 512x512.
"""
import struct
import zlib
import os

def create_png(width, height, pixels):
    """Create a PNG file from raw RGBA pixel data."""
    def chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))

    raw = b''
    for y in range(height):
        raw += b'\x00'
        for x in range(width):
            idx = (y * width + x) * 4
            raw += bytes(pixels[idx:idx+4])

    idat = chunk(b'IDAT', zlib.compress(raw, 9))
    iend = chunk(b'IEND', b'')
    return header + ihdr + idat + iend


def draw_icon(size):
    """Draw a checklist icon: dark bg with a green checkmark circle."""
    pixels = [0] * (size * size * 4)
    cx, cy = size // 2, size // 2
    r_outer = int(size * 0.42)
    r_inner = int(size * 0.38)
    bg = (15, 23, 42, 255)
    ring = (34, 197, 94, 255)
    fill = (34, 197, 94, 40)

    for y in range(size):
        for x in range(size):
            idx = (y * size + x) * 4
            dx, dy = x - cx, y - cy
            dist_sq = dx*dx + dy*dy

            if dist_sq <= r_inner * r_inner:
                pixels[idx:idx+4] = fill
            elif dist_sq <= r_outer * r_outer:
                pixels[idx:idx+4] = ring
            else:
                pixels[idx:idx+4] = bg

    # Draw checkmark
    def draw_line(x0, y0, x1, y1, color, thickness):
        steps = max(abs(x1 - x0), abs(y1 - y0), 1) * 3
        for i in range(steps + 1):
            t = i / steps
            px = int(x0 + (x1 - x0) * t)
            py = int(y0 + (y1 - y0) * t)
            for dy in range(-thickness, thickness + 1):
                for dx in range(-thickness, thickness + 1):
                    if dx*dx + dy*dy <= thickness*thickness:
                        nx, ny = px + dx, py + dy
                        if 0 <= nx < size and 0 <= ny < size:
                            idx = (ny * size + nx) * 4
                            pixels[idx:idx+4] = color

    s = size / 512
    check_color = (255, 255, 255, 255)
    th = max(int(14 * s), 2)
    # Checkmark: two lines forming a V shape
    draw_line(int(170*s), int(260*s), int(225*s), int(320*s), check_color, th)
    draw_line(int(225*s), int(320*s), int(345*s), int(195*s), check_color, th)

    return pixels


def main():
    docs = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'docs')
    for size, name in [(192, 'icon-192.png'), (512, 'icon-512.png')]:
        pixels = draw_icon(size)
        png_data = create_png(size, size, pixels)
        path = os.path.join(docs, name)
        with open(path, 'wb') as f:
            f.write(png_data)
        print(f'  Created {name} ({len(png_data)} bytes)')

if __name__ == '__main__':
    main()
