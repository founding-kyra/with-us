import os
from PIL import Image

folder = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal"
for file in os.listdir(folder):
    if file.endswith('.webp'):
        full_path = os.path.join(folder, file)
        new_path = os.path.splitext(full_path)[0] + '.PNG'
        try:
            img = Image.open(full_path)
            img.save(new_path, 'PNG')
            print(f"Restored {new_path}")
        except Exception as e:
            print(f"Failed to restore {file}: {e}")

