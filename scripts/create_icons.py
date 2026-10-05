"""Creates the extension icons in public/icons/ (needs Pillow: pip install pillow).

The icon matches the logo in the popup and settings page: the Lucide "tv" glyph with a
play triangle, drawn in the dark foreground color on a Kodi blue rounded square.
"""

from PIL import Image, ImageDraw

PRIMARY = (23, 179, 232)  # --color-primary
PRIMARY_DARK = (14, 150, 199)  # bottom of the subtle gradient
FOREGROUND = (4, 19, 26)  # --color-primary-foreground

SUPERSAMPLE = 8


def gradient_square(size, margin, radius):
    """Kodi blue rounded square with a light top-to-bottom gradient."""
    gradient = Image.new('RGBA', (size, size))
    draw = ImageDraw.Draw(gradient)
    for y in range(size):
        t = y / (size - 1)
        color = tuple(round(a + (b - a) * t) for a, b in zip(PRIMARY, PRIMARY_DARK))
        draw.line([(0, y), (size, y)], fill=color + (255,))

    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [(margin, margin), (size - 1 - margin, size - 1 - margin)], radius=radius, fill=255
    )
    icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    icon.paste(gradient, (0, 0), mask)
    return icon


def create_icon(size, detailed):
    s = size * SUPERSAMPLE
    margin = round(s * 0.0625)
    icon = gradient_square(s, margin, radius=round(s * 0.22))
    draw = ImageDraw.Draw(icon)

    if not detailed:
        # At 16 px the TV outline turns into mush, so the toolbar icon is just the play triangle.
        cx, cy, h = s * 0.54, s * 0.5, s * 0.5
        w = h * 0.87
        draw.polygon([(cx - w / 2, cy - h / 2), (cx - w / 2, cy + h / 2), (cx + w / 2, cy)], fill=FOREGROUND)
        return icon.resize((size, size), Image.Resampling.LANCZOS)

    # Lucide "tv" on a 24 unit grid, scaled into the inner area of the square.
    glyph = s * 0.62
    unit = glyph / 24
    ox, oy = (s - glyph) / 2, (s - glyph) / 2 + unit * 0.4

    def p(x, y):
        return (ox + x * unit, oy + y * unit)

    stroke = round(unit * 2.2)
    draw.rounded_rectangle([p(2, 7), p(22, 22)], radius=round(unit * 2.4), outline=FOREGROUND, width=stroke)
    draw.line([p(7, 2), p(12, 7), p(17, 2)], fill=FOREGROUND, width=stroke, joint='curve')
    for x, y in (p(7, 2), p(17, 2)):
        r = stroke / 2
        draw.ellipse([(x - r, y - r), (x + r, y + r)], fill=FOREGROUND)

    # Play triangle centered in the screen.
    cx, cy, h = 12.5, 14.5, 7.2
    w = h * 0.87
    draw.polygon([p(cx - w / 2, cy - h / 2), p(cx - w / 2, cy + h / 2), p(cx + w / 2, cy)], fill=FOREGROUND)

    return icon.resize((size, size), Image.Resampling.LANCZOS)


for size in (16, 32, 48, 128):
    create_icon(size, detailed=size >= 32).save(f'public/icons/icon{size}.png', 'PNG', optimize=True)
    print(f'Created icon{size}.png')
