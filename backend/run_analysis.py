import os
import sys
import json
import subprocess
from pathlib import Path
from ultralytics import YOLO

# === Inputs from command line ===
img_folder = sys.argv[1]
csi_file = sys.argv[2]  # You can use this later

# === Setup folders ===
os.makedirs("results", exist_ok=True)

# === Load YOLO model only once ===
model = YOLO("runs/detect/train/weights/best.pt")

# === Store results here ===
results = []

# === Loop through all images ===
for img_name in sorted(os.listdir(img_folder)):
    if not img_name.lower().endswith((".jpg", ".jpeg", ".png")):
        continue

    img_path = os.path.join(img_folder, img_name)
    output_json = os.path.join("results", f"{Path(img_name).stem}.json")

    # === Predict with YOLO
    prediction = model(img_path)[0]

    if len(prediction.boxes) > 0:
        cls_id = int(prediction.boxes.cls[0])
        activity = model.names[cls_id]
        confidence = round(float(prediction.boxes.conf[0]) * 100, 2)
    else:
        activity = "unknown"
        confidence = 0.0

    # === Call MediaPipe Skeleton script
    subprocess.run(["python", "skeleton_run.py", img_path])

    base_name = Path(img_name).stem
    result = {
        "image": img_name,
        "activity": activity,
        "confidence": confidence,
        "skeleton_on_image": f"skeleton_images/image_with_skeleton/processed_image_{base_name}.png",
        "skeleton_only": f"skeleton_images/opImg/processed_image_{base_name}.png"
    }

    # Save to individual .json file
    with open(output_json, "w") as f:
        json.dump(result, f)

    results.append(result)

# === Final combined file ===
with open("all_results.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"✅ Done. Analyzed {len(results)} images.")
