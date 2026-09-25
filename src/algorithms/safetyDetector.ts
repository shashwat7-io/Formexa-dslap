import type { ExerciseId, SafetyWarning } from '../types/exercise';
import type { ExtractedJoints } from './poseAnalysis';
import { POSE_LANDMARKS } from './poseAnalysis';
import type { PoseLandmarks } from '../types/pose';

export function detectSafetyRisks(
  exerciseId: ExerciseId,
  joints: ExtractedJoints,
  landmarks: PoseLandmarks
): SafetyWarning | null {
  const now = Date.now();

  if (['deadlift', 'squat', 'dumbbell_row'].includes(exerciseId) && joints.torsoInclination > 55) {
    return {
      id: `spinal_${now}`,
      title: '⚠️ SAFETY WARNING: SPINAL FLEXION',
      message: 'Excessive forward back rounding detected. Keep your spine neutral to protect lumbar discs. Consider reducing weight.',
      type: 'spinal_flexion',
      timestamp: now
    };
  }

  if (['squat', 'lunge'].includes(exerciseId)) {
    const lKneeX = landmarks[POSE_LANDMARKS.LEFT_KNEE]?.x || 0;
    const lAnkleX = landmarks[POSE_LANDMARKS.LEFT_ANKLE]?.x || 0;
    const rKneeX = landmarks[POSE_LANDMARKS.RIGHT_KNEE]?.x || 0;
    const rAnkleX = landmarks[POSE_LANDMARKS.RIGHT_ANKLE]?.x || 0;

    if (Math.abs(lKneeX - lAnkleX) > 0.09 || Math.abs(rKneeX - rAnkleX) > 0.09) {
      return {
        id: `valgus_${now}`,
        title: '⚠️ SAFETY WARNING: KNEE VALGUS',
        message: 'Knees collapsing inward. Drive knees outward over toes to protect ACL/MCL ligaments.',
        type: 'knee_valgus',
        timestamp: now
      };
    }
  }

  if (joints.symmetryScore < 60) {
    return {
      id: `asymmetry_${now}`,
      title: '⚠️ SAFETY WARNING: SEVERE ASYMMETRY',
      message: 'Significant left/right load imbalance detected (>25%). Equalize stance and arm motion.',
      type: 'asymmetry',
      timestamp: now
    };
  }

  if (joints.leftElbowAngle > 188 || joints.rightElbowAngle > 188) {
    return {
      id: `hyperext_${now}`,
      title: '⚠️ SAFETY WARNING: ELBOW HYPEREXTENSION',
      message: 'Avoid locking out elbows into extreme hyperextension under heavy load.',
      type: 'extreme_angle',
      timestamp: now
    };
  }

  return null;
}
