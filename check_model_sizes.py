from PIL import Image, ImageChops

base_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal new .PNG"
mask_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask new.PNG"

base = Image.open(base_path)
mask = Image.open(mask_path)

alpha = mask.split()[-1]
print(f"Mask model bbox: {alpha.getbbox()}")

# For base, let's find the bbox of non-white pixels
# Convert to grayscale
bgray = base.convert("L")
# Invert so background is dark, model is light
binv = ImageChops.invert(bgray)
# Binarize with threshold
b_thresh = binv.point(lambda p: 255 if p > 30 else 0)
print(f"Base model bbox: {b_thresh.getbbox()}")

