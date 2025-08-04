// Path: src/types.ts
// This is the new, correct data structure.
export interface VisualFrame {
  original_filename: string;
  yolo_img_path: string;
  skel_on_img_path: string;
  skel_only_path: string;
}

export interface AnalysisResponse {
  csi_signal: number[];
  overall_activity: string;
  visual_frames: VisualFrame[];
}