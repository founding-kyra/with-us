from PIL import Image

mask_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask new.PNG"
img = Image.open(mask_path)
alpha = img.split()[-1]
bbox = alpha.getbbox()
print(f"Bounding box of mask non-transparent pixels: {bbox}")
print(f"Mask size: {img.size}")
