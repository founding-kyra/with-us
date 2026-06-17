from PIL import Image

mask_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask new.PNG"
img = Image.open(mask_path)
alpha = img.split()[-1]

# Create an image where alpha is represented as grayscale (white=opaque, black=transparent)
alpha.save("/Users/razalkizhakkekara/.gemini/antigravity-ide/brain/c78953c2-082d-4424-b4dd-9e8edb2c1277/scratch/mask_preview.png")
