# Path: backend/test1.py
import argparse
import os
import json
from ultralytics import YOLO
import cv2 # Import opencv

def predict_and_save(image_path, output_dir, result_file_path):
    model_path = 'best.pt'
    model = YOLO(model_path)
    
    # Run prediction, but don't save automatically
    results = model.predict(source=image_path, save=False, imgsz=640, conf=0.5)

    # Get the image with bounding boxes drawn on it
    annotated_image = results[0].plot() 
    
    # --- THIS IS THE CRUCIAL FIX ---
    # Create the output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Construct the full output path for the image
    output_image_name = os.path.basename(image_path)
    output_image_path = os.path.join(output_dir, output_image_name)
    
    # Save the annotated image to the specified path
    cv2.imwrite(output_image_path, annotated_image)
    print(f"Saved YOLO prediction to: {output_image_path}")
    # --------------------------------

    # Save the JSON results
    names = model.names
    detected_activities = [names[int(c)] for r in results for c in r.boxes.cls]
    output_data = {"activities": detected_activities}
    with open(result_file_path, "w") as f:
        json.dump(output_data, f)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('image_path', type=str, help='Path to the input image')
    parser.add_argument('output_dir', type=str, help='Directory to save the output image')
    parser.add_argument('result_file_path', type=str, help='Path to save the JSON result file')
    args = parser.parse_args()
    predict_and_save(args.image_path, args.output_dir, args.result_file_path)