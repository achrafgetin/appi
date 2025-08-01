import numpy as np
import os
import cv2
import sys
import mediapipe as mp

def extract_skeleton_from_image(image_path):
    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose

    # Load image
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Init MediaPipe Pose
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        results = pose.process(image_rgb)

        if results.pose_landmarks:
            skeleton = []
            for landmark in results.pose_landmarks.landmark:
                skeleton.append(landmark.x)
                skeleton.append(landmark.y)
                skeleton.append(landmark.z if landmark.z else 0)

            # Extract name (without extension)
            filename = os.path.splitext(os.path.basename(image_path))[0]

            # Prepare output folders
            out_dir1 = os.path.join("skeleton_images", "image_with_skeleton")
            out_dir2 = os.path.join("skeleton_images", "opImg")
            os.makedirs(out_dir1, exist_ok=True)
            os.makedirs(out_dir2, exist_ok=True)

            # Save image with skeleton drawn on original
            image_with_skeleton_path = os.path.join(out_dir1, f"processed_image_{filename}.png")
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            cv2.imwrite(image_with_skeleton_path, image)

            # Save image with only the skeleton
            opImg = np.ones_like(image) * 255  # white background
            mp_drawing.draw_landmarks(
                opImg,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2)
            )
            skeleton_image_path = os.path.join(out_dir2, f"processed_image_{filename}.png")
            cv2.imwrite(skeleton_image_path, opImg)

            return np.array(skeleton), image_with_skeleton_path, skeleton_image_path

    return None, None, None

# Script usage
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python skeleton_run.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    skeleton_data, image_with_skeleton_path, skeleton_image_path = extract_skeleton_from_image(image_path)
    
    if skeleton_data is not None:
        print(f"Skeleton extracted and saved to:\n - {image_with_skeleton_path}\n - {skeleton_image_path}")
    else:
        print("No skeleton detected.")
