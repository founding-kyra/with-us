from PIL import Image

mask_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask new.PNG"
img = Image.open(mask_path)
alpha = img.split()[-1]
extrema = alpha.getextrema()
print(f"Alpha extrema: {extrema}")

width, height = img.size
# Sample some pixels in the middle
print(f"Center pixel: {img.getpixel((width//2, height//2))}")
print(f"Mid-left pixel: {img.getpixel((width//4, height//2))}")
print(f"Mid-right pixel: {img.getpixel((3*width//4, height//2))}")

# Check how many pixels have alpha > 0
non_transparent = sum(1 for p in alpha.getdata() if p > 0)
total = width * height
print(f"Non-transparent pixels: {non_transparent} out of {total} ({non_transparent/total*100:.2f}%)")

# Check if there are any pixels that are white and opaque
white_opaque = sum(1 for p in img.getdata() if p[0] > 240 and p[1] > 240 and p[2] > 240 and p[3] > 0)
print(f"White opaque pixels: {white_opaque}")
