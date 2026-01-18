from PIL import Image, ImageDraw
import math

def create_kodi_icon(size):
    # Create image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    bg_color = (21, 101, 192)  # Kodi blue
    play_color = (255, 255, 255)  # White
    
    # Draw rounded rectangle background
    margin = size // 16
    corner_radius = size // 8
    draw.rounded_rectangle(
        [(margin, margin), (size - margin, size - margin)],
        radius=corner_radius,
        fill=bg_color
    )
    
    # Draw play triangle
    triangle_size = size // 2.5
    center_x = size // 2 + size // 20  # Slight offset to right
    center_y = size // 2
    
    # Calculate triangle points
    height = triangle_size * math.sqrt(3) / 2
    points = [
        (center_x - height / 2, center_y - triangle_size / 2),  # Top left
        (center_x - height / 2, center_y + triangle_size / 2),  # Bottom left
        (center_x + height / 2, center_y)  # Right point
    ]
    
    draw.polygon(points, fill=play_color)
    
    return img

# Create icons in different sizes
sizes = [16, 48, 128]
for size in sizes:
    # Use LANCZOS resampling for high quality
    if size < 128:
        # Create at higher resolution and downsample for better quality
        high_res = create_kodi_icon(size * 4)
        icon = high_res.resize((size, size), Image.Resampling.LANCZOS)
    else:
        icon = create_kodi_icon(size)
    
    icon.save(f'public/icons/icon{size}.png', 'PNG', optimize=True)
    print(f"Created icon{size}.png")

print("All icons created successfully!")
