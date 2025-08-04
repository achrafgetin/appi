# Path: backend/app.py
# This is the final, correct version based on your file structure.

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import shutil
from analysis_logic import run_correct_analysis

app = Flask(__name__)
CORS(app)

# --- CORRECTED STATIC FILE SERVING ---
# The server now correctly looks for these folders inside the 'backend' directory.
# There is no '..' needed.

@app.route('/uploads/images/<path:filename>')
def serve_uploaded_image(filename):
    return send_from_directory('uploads/images', filename)

@app.route('/generated/yolo/<path:filename>')
def serve_yolo_image(filename):
    return send_from_directory('runs/detect/predict', filename)

@app.route('/generated/skel_on_img/<path:filename>')
def serve_skel_on_image(filename):
    return send_from_directory('skeleton_images/image_with_skeleton', filename)

@app.route('/generated/skel_only/<path:filename>')
def serve_skel_only_image(filename):
    return send_from_directory('skeleton_images/opImg', filename)

@app.route('/analyze', methods=['POST'])
def analyze_files_endpoint():
    # --- CORRECTED CLEANUP AND FILE HANDLING ---
    # All paths are now relative to the 'backend' folder where this script runs.
    
    if os.path.exists('runs'): 
        shutil.rmtree('runs')
    if os.path.exists('skeleton_images'): 
        shutil.rmtree('skeleton_images')
    
    os.makedirs('skeleton_images/image_with_skeleton', exist_ok=True)
    os.makedirs('skeleton_images/opImg', exist_ok=True)
    
    upload_folder = 'uploads'
    if not os.path.exists(upload_folder): 
        os.makedirs(upload_folder)
    
    csi_file = request.files['csi_file']
    csi_path = os.path.join(upload_folder, os.path.basename(csi_file.filename))
    csi_file.save(csi_path)
    
    image_files = request.files.getlist('images')
    image_upload_path = None
    if image_files:
        image_upload_path = os.path.join(upload_folder, 'images')
        if os.path.exists(image_upload_path): shutil.rmtree(image_upload_path)
        os.makedirs(image_upload_path)
        for img in image_files:
            img.save(os.path.join(image_upload_path, os.path.basename(img.filename)))
    
    # --- SYNTAX FIX IS HERE ---
    try: # The colon was missing
        # os.getcwd() correctly gives the path to the 'backend' folder.
        results = run_correct_analysis(csi_path, image_upload_path, os.getcwd())
        return jsonify(results)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)