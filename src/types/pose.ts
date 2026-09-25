export interface Landmark {
  x: number; // Normalized 0-1
  y: number; // Normalized 0-1
  z?: number;
  visibility?: number;
}

export type PoseLandmarks = Landmark[];

export interface JointAngle {
  name: string;
  angle: number; // degrees
  landmarks: [number, number, number]; // [first, joint, third]
}

export interface SkeletonBone {
  from: number;
  to: number;
  name: string;
}

export interface PoseFrame {
  landmarks: PoseLandmarks;
  confidence: number;
  timestamp: number;
}

export interface CameraCalibrationState {
  isFullyVisible: boolean;
  lightingQuality: 'poor' | 'fair' | 'good' | 'optimal';
  poseConfidence: number;
  distanceStatus: 'too_close' | 'too_far' | 'optimal';
  isReady: boolean;
  messages: string[];
}
