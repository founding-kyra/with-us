from PIL import Image

# Open the base image
img = Image.open("/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal new .PNG").convert("RGBA")
datas = img.getdata()

new_data = []
# Background is around (220, 220, 220) to (230, 230, 230)
# Let's make everything lighter than (210, 210, 210) transparent
for item in datas:
    # item is (R, G, B, A)
    if item[0] > 200 and item[1] > 200 and item[2] > 200:
        # Check if it's very close to grey (not a colored bright highlight)
        diff = max(abs(item[0]-item[1]), abs(item[1]-item[2]), abs(item[0]-item[2]))
        if diff < 15:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    else:
        new_data.append(item)

img.putdata(new_data)
img.save("/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask aligned.PNG", "PNG")
