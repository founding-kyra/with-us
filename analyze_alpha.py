from PIL import Image
from collections import Counter

mask_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask new.PNG"
img = Image.open(mask_path)
alpha = img.split()[-1]

# Get a histogram of the alpha values
counts = Counter(alpha.getdata())
print("Alpha value counts:")
for k in sorted(counts.keys()):
    if k == 0: continue
    print(f"Alpha {k}: {counts[k]} pixels")

