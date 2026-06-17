import os
import re

def replace_extensions(folder):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith('.js') or file.endswith('.jsx') or file.endswith('.css'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                new_content = re.sub(r'\.(png|jpg|jpeg)\b', '.webp', content, flags=re.IGNORECASE)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

replace_extensions('/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/src')
print("Done updating extensions!")
