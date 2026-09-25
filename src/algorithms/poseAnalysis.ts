import type { Landmark, PoseLandmarks, SkeletonBone } from '../types/pose';
import { calculateAngle, calculateVerticalAngle } from './geometry';

// MediaPipe Pose Landmark Indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32
};

export const SKELETON_CONNECTIONS: SkeletonBone[] = [
  { from: 11, to: 0, name: 'neck_left' },
  { from: 12, to: 0, name: 'neck_right' },
  { from: 11, to: 12, name: 'shoulder_girdle' },
  { from: 11, to: 13, name: 'left_upper_arm' },
  { from: 13, to: 15, name: 'left_forearm' },
  { from: 12, to: 14, name: 'right_upper_arm' },
  { from: 14, to: 16, name: 'right_forearm' },
  { from: 11, to: 23, name: 'left_torso' },
  { from: 12, to: 24, name: 'right_torso' },
  { from: 23, to: 24, name: 'hip_girdle' },
  { from: 23, to: 25, name: 'left_thigh' },
  { from: 25, to: 27, name: 'left_shin' },
  { from: 24, to: 26, name: 'right_thigh' },
  { from: 26, to: 28, name: 'right_shin' },
  { from: 27, to: 31, name: 'left_foot' },
  { from: 28, to: 32, name: 'right_foot' }
];

export interface ExtractedJoints {
  leftElbowAngle: number;
  rightElbowAngle: number;
  leftShoulderAngle: number;
  rightShoulderAngle: number;
  leftHipAngle: number;
  rightHipAngle: number;
  leftKneeAngle: number;
  rightKneeAngle: number;
  leftAnkleAngle: number;
  rightAnkleAngle: number;
  torsoInclination: number;
  leftUpperArmDrift: number;
  rightUpperArmDrift: number;
  symmetryScore: number;
}

export function extractJointAngles(landmarks: PoseLandmarks): ExtractedJoints {
  if (!landmarks || landmarks.length < 29) {
    return {
      leftElbowAngle: 180,
      rightElbowAngle: 180,
      leftShoulderAngle: 0,
      rightShoulderAngle: 0,
      leftHipAngle: 180,
      rightHipAngle: 180,
      leftKneeAngle: 180,
      rightKneeAngle: 180,
      leftAnkleAngle: 90,
      rightAnkleAngle: 90,
      torsoInclination: 0,
      leftUpperArmDrift: 0,
      rightUpperArmDrift: 0,
      symmetryScore: 100
    };
  }

  const lShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const lElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
  const rElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
  const lWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
  const rWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
  const lHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
  const lKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
  const rKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
  const lAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
  const rAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

  const leftElbowAngle = calculateAngle(lShoulder, lElbow, lWrist);
  const rightElbowAngle = calculateAngle(rShoulder, rElbow, rWrist);

  const leftShoulderAngle = calculateAngle(lHip, lShoulder, lElbow);
  const rightShoulderAngle = calculateAngle(rHip, rShoulder, rElbow);

  const leftHipAngle = calculateAngle(lShoulder, lHip, lKnee);
  const rightHipAngle = calculateAngle(rShoulder, rHip, rKnee);

  const leftKneeAngle = calculateAngle(lHip, lKnee, lAnkle);
  const rightKneeAngle = calculateAngle(rHip, rKnee, rAnkle);

  const leftAnkleAngle = calculateAngle(
    lKnee,
    lAnkle,
    landmarks[POSE_LANDMARKS.LEFT_FOOT_INDEX] || lAnkle
  );
  const rightAnkleAngle = calculateAngle(
    rKnee,
    rAnkle,
    landmarks[POSE_LANDMARKS.RIGHT_FOOT_INDEX] || rAnkle
  );

  const midShoulder: Landmark = {
    x: (lShoulder.x + rShoulder.x) / 2,
    y: (lShoulder.y + rShoulder.y) / 2
  };
  const midHip: Landmark = {
    x: (lHip.x + rHip.x) / 2,
    y: (lHip.y + rHip.y) / 2
  };
  const torsoInclination = calculateVerticalAngle(midHip, midShoulder);

  const leftUpperArmDrift = calculateVerticalAngle(lShoulder, lElbow);
  const rightUpperArmDrift = calculateVerticalAngle(rShoulder, rElbow);

  const elbowDiff = Math.abs(leftElbowAngle - rightElbowAngle);
  const kneeDiff = Math.abs(leftKneeAngle - rightKneeAngle);
  const hipDiff = Math.abs(leftHipAngle - rightHipAngle);

  const avgDiff = (elbowDiff + kneeDiff + hipDiff) / 3;
  const symmetryScore = Math.max(0, Math.min(100, Math.round(100 - avgDiff * 1.5)));

  return {
    leftElbowAngle,
    rightElbowAngle,
    leftShoulderAngle,
    rightShoulderAngle,
    leftHipAngle,
    rightHipAngle,
    leftKneeAngle,
    rightKneeAngle,
    leftAnkleAngle,
    rightAnkleAngle,
    torsoInclination,
    leftUpperArmDrift,
    rightUpperArmDrift,
    symmetryScore
  };
}
