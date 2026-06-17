from rembg import remove
from PIL import Image
import numpy as np

input_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal new .PNG"
output_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask aligned.PNG"

# Read image, remove EXIF by converting to numpy and back
img = Image.open(input_path).convert("RGB")
data = np.array(img)
img_clean = Image.fromarray(data)

output = remove(img_clean)
output.save(output_path)

print("Perfect background removal done via PIL Image.")
