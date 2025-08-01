from flask_cors import CORS
import os, shutil, subprocess, json
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS
UPLOAD_FOLDER = 'uploads'

@app.route('/skeleton_images/<path:filename>')
def serve_skeleton_images(filename):
    return send_from_directory('skeleton_images', filename)

@app.route('/analyze', methods=['POST'])
def analyze():
    # Prepare folders
    image_dir = os.path.join(UPLOAD_FOLDER, 'images')
    csi_dir = os.path.join(UPLOAD_FOLDER, 'csi')
    shutil.rmtree(image_dir, ignore_errors=True)
    shutil.rmtree(csi_dir, ignore_errors=True)
    os.makedirs(image_dir)
    os.makedirs(csi_dir, exist_ok=True)

    # Save uploaded files
    for file in request.files.getlist("images"):
        filename = os.path.basename(file.filename)  # Get only "0.jpg"
        file.save(os.path.join(image_dir, filename))
    if 'csi' in request.files:
        csi_file = request.files['csi']
        csi_path = os.path.join(csi_dir, csi_file.filename)
        csi_file.save(csi_path)

    # Run your MATLAB or Python script
    subprocess.run(["python", "run_analysis.py", image_dir, csi_path])

    # Load prediction result
    with open("all_results.json", "r") as f:
        results = json.load(f)
    return jsonify(results)



if __name__ == '__main__':
    app.run(debug=True)
