# Path: backend/skeleton_run.py
import cv2
import mediapipe as mp
import argparse
import os

def generate_and_save_skeleton(image_path, skel_on_img_dir, skel_only_dir, processed_index):
    # ... (Your existing mediapipe setup code for drawing_utils, pose, etc.)
    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose

    image = cv2.imread(image_path)
    # ... (Your existing code to process the image with mediapipe)
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        image.flags.writeable = False
        results = pose.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        image.flags.writeable = True
        
        # --- THIS IS THE CRUCIAL FIX ---
        # Create the output directories if they don't exist
        os.makedirs(skel_on_img_dir, exist_ok=True)
        os.makedirs(skel_only_dir, exist_ok=True)

        # Draw the skeleton on the original image
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        output_path_on_img = os.path.join(skel_on_img_dir, f"processed_image_{processed_index}.png")
        cv2.imwrite(output_path_on_img, image)
        print(f"Saved skeleton on image to: {output_path_on_img}")

        # Create a blank image and draw only the skeleton
        blank_image = cv2.imread(image_path) # Read again to get a clean copy
        blank_image[:] = (0, 0, 0) # Make it black
        mp_drawing.draw_landmarks(blank_image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        output_path_only = os.path.join(skel_only_dir, f"processed_image_{processed_index}.png")
        cv2.imwrite(output_path_only, blank_image)
        print(f"Saved skeleton only to: {output_path_only}")
        # --------------------------------

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('image_path', type=str)
    parser.add_argument('skel_on_img_dir', type=str)
    parser.add_argument('skel_only_dir', type=str)
    parser.add_argument('processed_index', type=int)
    args = parser.parse_args()
    generate_and_save_skeleton(args.image_path, args.skel_on_img_dir, args.skel_only_dir, args.processed_index)