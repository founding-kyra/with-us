import os
from PIL import Image

def convert_to_webp(folder):
    for root, dirs, files in os.walk(folder):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.png', '.jpg', '.jpeg']:
                full_path = os.path.join(root, file)
                new_path = os.path.splitext(full_path)[0] + '.webp'
                
                # Skip if webp already exists
                if os.path.exists(new_path):
                    continue
                    
                try:
                    img = Image.open(full_path)
                    # Convert RGBA to RGB for JPEG, but webp supports RGBA
                    img.save(new_path, 'webp', quality=85)
                    print(f"Converted {file} to {os.path.basename(new_path)}")
                    
                    # Optional: delete original to save space and force codebase updates
                    os.remove(full_path)
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")

convert_to_webp('/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public')
print("Done converting!")
