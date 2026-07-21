from PIL import Image
import os

folder = r"c:\Users\Cupid\Downloads\Study-space\Reference\Nuke_image"
files = ["image249.png", "image250.png", "image251.png", "image252.png"]

# Open images
images = [Image.open(os.path.join(folder, f)) for f in files]

# Standard 1080p cover size
target_w, target_h = 1920, 1080
quad_w, quad_h = target_w // 2, target_h // 2

# Resize images
resized_images = [img.resize((quad_w, quad_h), Image.Resampling.LANCZOS) for img in images]

# Create a new blank image
combined = Image.new('RGB', (target_w, target_h))

# Paste images into a 2x2 grid
combined.paste(resized_images[0], (0, 0))
combined.paste(resized_images[1], (quad_w, 0))
combined.paste(resized_images[2], (0, quad_h))
combined.paste(resized_images[3], (quad_w, quad_h))

output_path = os.path.join(folder, "video_cover.png")
combined.save(output_path)
print(f"Success! Saved to {output_path}")
