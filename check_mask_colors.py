from PIL import Image

mask_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask new.PNG"
img = Image.open(mask_path)
width, height = img.size

# Sample a pixel inside the mask
print(f"Center pixel: {img.getpixel((width//2, height//2))}")

# Are the RGB channels just white/black, or full color?
# Let's get the standard deviation of RGB in the opaque region
opaque_pixels = [p for p in img.getdata() if p[3] > 100]
print(f"Sample opaque pixel: {opaque_pixels[100] if len(opaque_pixels) > 100 else 'None'}")
print(f"Sample opaque pixel 2: {opaque_pixels[1000] if len(opaque_pixels) > 1000 else 'None'}")
print(f"Sample opaque pixel 3: {opaque_pixels[50000] if len(opaque_pixels) > 50000 else 'None'}")
