import cv2
import numpy as np

base_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal new .PNG"
mask_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask new.PNG"
out_path = "/Users/razalkizhakkekara/arocreativ/CGMWTDEC2025/nrmlss/public/peel-reveal/peel reveal mask aligned.PNG"

# Read images
base_img = cv2.imread(base_path)
mask_img = cv2.imread(mask_path, cv2.IMREAD_UNCHANGED)

base_gray = cv2.cvtColor(base_img, cv2.COLOR_BGR2GRAY)
mask_bgr = mask_img[:, :, :3]
mask_gray = cv2.cvtColor(mask_bgr, cv2.COLOR_BGR2GRAY)

# Find ORB keypoints and descriptors
orb = cv2.ORB_create(5000)
kp1, des1 = orb.detectAndCompute(mask_gray, None)
kp2, des2 = orb.detectAndCompute(base_gray, None)

# Match features
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches = bf.match(des1, des2)
matches = sorted(matches, key=lambda x: x.distance)

# Keep top matches
good_matches = matches[:50]

src_pts = np.float32([kp1[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
dst_pts = np.float32([kp2[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

# Find homography
M, mask_inliers = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

print("Homography Matrix:")
print(M)

# Warp mask image to base image dimensions
aligned_mask = cv2.warpPerspective(mask_img, M, (base_img.shape[1], base_img.shape[0]))

cv2.imwrite(out_path, aligned_mask)
print(f"Aligned mask saved to {out_path}")
