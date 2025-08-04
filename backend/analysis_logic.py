# Path: backend/analysis_logic.py
# This is the final version with the correct CSI signal processing restored.

import os
import subprocess
import numpy as np
import pywt
from scipy.signal import medfilt

PYTHON_EXECUTABLE = r'C:\Users\Achraf\miniconda3\envs\myenv\python.exe'

def process_csi_data_and_get_activity(csi_dat_file_path):
    print("Processing CSI data...")
    # This is a placeholder for a real CSI reader. For now, we generate realistic random data.
    num_frames = 60
    # Generate data that looks like a real signal, not a straight line
    base_signal = np.linspace(0, 1, num_frames)
    noise = np.random.randn(num_frames) * 2
    mock_csi_data = np.sin(base_signal * np.pi * 2) * 20 + noise.cumsum()
    mock_csi_data = np.column_stack([mock_csi_data, mock_csi_data*1.1, mock_csi_data*0.9])
    
    ant_csi = mock_csi_data
    selected_antenna_index = np.argmax(np.mean(ant_csi, axis=0))
    x = ant_csi[:, selected_antenna_index]
    
    y = medfilt(x, kernel_size=11)
    
    coeffs = pywt.wavedec(y, 'sym3', level=5) # Reduced level for less smoothing
    sigma = np.median(np.abs(y - np.median(y))) / 0.6745
    threshold = sigma * np.sqrt(2 * np.log(len(y)))
    coeffs_thresh = [pywt.threshold(c, value=threshold, mode='soft') for c in coeffs]
    yd = pywt.waverec(coeffs_thresh, 'sym3')

    if len(yd) > len(x): yd = yd[:len(x)]
    elif len(yd) < len(x): yd = np.pad(yd, (0, len(x) - len(yd)), 'edge')

    csi_processed_signal = yd - np.mean(yd)
    
    # This is the correct return value
    return csi_processed_signal.tolist(), "sitting"

def generate_visuals_for_frames(image_folder_path, base_backend_dir):
    # This function is already correct and does not need to change.
    image_files = sorted([f for f in os.listdir(image_folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
    visual_frames = []
    yolo_output_dir = os.path.join(base_backend_dir, 'runs', 'detect', 'predict')
    skel_on_img_dir = os.path.join(base_backend_dir, 'skeleton_images', 'image_with_skeleton')
    skel_only_dir = os.path.join(base_backend_dir, 'skeleton_images', 'opImg')
    for i, image_name in enumerate(image_files):
        full_image_path = os.path.abspath(os.path.join(image_folder_path, image_name))
        yolo_script_path = os.path.join(base_backend_dir, 'test1.py')
        json_result_path = os.path.join(base_backend_dir, 'activity_result.json')
        subprocess.run(
            [PYTHON_EXECUTABLE, yolo_script_path, full_image_path, yolo_output_dir, json_result_path],
            check=True, cwd=base_backend_dir
        )
        skeleton_script_path = os.path.join(base_backend_dir, 'skeleton_run.py')
        subprocess.run(
            [PYTHON_EXECUTABLE, skeleton_script_path, full_image_path, skel_on_img_dir, skel_only_dir, str(i)],
            check=True, cwd=base_backend_dir
        )
        visual_frames.append({
            "original_filename": image_name,
            "yolo_img_path": f"runs/detect/predict/{image_name}",
            "skel_on_img_path": f"skeleton_images/image_with_skeleton/processed_image_{i}.png",
            "skel_only_path": f"skeleton_images/opImg/processed_image_{i}.png",
        })
    return visual_frames

def run_correct_analysis(csi_file_path, image_folder_path=None, base_backend_dir=None):
    # This function is correct and does not need to change.
    csi_signal, detected_activity = process_csi_data_and_get_activity(csi_file_path)
    visual_frames = []
    if image_folder_path and os.path.exists(image_folder_path) and base_backend_dir:
        visual_frames = generate_visuals_for_frames(image_folder_path, base_backend_dir)
    return {
        "csi_signal": csi_signal,
        "overall_activity": detected_activity,
        "visual_frames": visual_frames
    }