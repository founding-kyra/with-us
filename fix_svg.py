import xml.etree.ElementTree as ET

svg_path = '/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/logo/logo-with-us-icon-champagne.svg'

with open(svg_path, 'r') as f:
    content = f.read()

# Replace viewBox
content = content.replace('viewBox="0 0 1000 1000"', 'viewBox="190 430 670 340"')

with open(svg_path, 'w') as f:
    f.write(content)
