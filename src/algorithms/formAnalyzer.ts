import type { ExerciseId, FormCheck, FormScoreBreakdown } from '../types/exercise';
import type { ExtractedJoints } from './poseAnalysis';
import { POSE_LANDMARKS } from './poseAnalysis';
import type { PoseLandmarks } from '../types/pose';

export interface FormAnalysisOutput {
  scoreBreakdown: FormScoreBreakdown;
  activeCorrections: FormCheck[];
  primaryCorrection: FormCheck | null;
  positiveFeedback: string[];
}

export function analyzeForm(
  exerciseId: ExerciseId,
  joints: ExtractedJoints,
  landmarks: PoseLandmarks,
  _concentricTime: number,
  eccentricTime: number
): FormAnalysisOutput {
  const checks: FormCheck[] = [];
  const positive: string[] = [];

  let posture = 100;
  let rangeOfMotion = 100;
  let stability = 100;
  let tempo = 100;
  let symmetry = joints.symmetryScore;

  const avgElbow = (joints.leftElbowAngle + joints.rightElbowAngle) / 2;
  const avgKnee = (joints.leftKneeAngle + joints.rightKneeAngle) / 2;
  const avgHip = (joints.leftHipAngle + joints.rightHipAngle) / 2;
  const upperArmDrift = (joints.leftUpperArmDrift + joints.rightUpperArmDrift) / 2;

  // Strict Symmetry Check
  if (joints.symmetryScore < 85) {
    checks.push({
      id: 'asymmetry',
      name: 'Asymmetry',
      status: 'WARNING',
      message: 'STRICT FAULT: Left/Right asymmetry detected (>15% variance). Balance load.',
      severity: 'medium'
    });
  }

  // Strict Tempo Check
  if (eccentricTime > 0 && eccentricTime < 1.8) {
    tempo -= 20;
    checks.push({
      id: 'fast_eccentric',
      name: 'Fast Eccentric',
      status: 'WARNING',
      message: 'STRICT TEMPO: Control lowering phase (maintain 2.0s - 3.0s eccentric).',
      severity: 'low'
    });
  } else if (eccentricTime >= 2.0) {
    positive.push('Controlled eccentric tempo.');
  }

  // STRICT EXERCISE SPECIFIC RULES & TIGHT TOLERANCES
  switch (exerciseId) {
    case 'bicep_curl':
      // Strict Arm Drift: Limit 8.0 cm
      if (upperArmDrift > 8.0) {
        stability -= 35;
        checks.push({
          id: 'elbow_drift',
          name: 'Elbow Drift',
          status: 'FAULT',
          message: `STRICT FAULT: Upper arm drift detected. Pin elbows to ribcage (Limit: 8.0cm).`,
          severity: 'high',
          targetJoints: [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.RIGHT_ELBOW]
        });
      } else {
        positive.push('Strict elbow isolation maintained.');
      }

      // Strict Torso Swing: Limit 6.0 degrees
      if (joints.torsoInclination > 6.0) {
        posture -= 25;
        checks.push({
          id: 'torso_swing',
          name: 'Torso Momentum',
          status: 'FAULT',
          message: `STRICT FAULT: Torso swing detected (${Math.round(joints.torsoInclination)}°). Keep spine vertical (Limit: 6.0°).`,
          severity: 'high',
          targetJoints: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP]
        });
      }

      // Strict ROM Peak Flexion: Limit < 45 degrees
      if (avgElbow > 50) {
        rangeOfMotion -= 20;
        checks.push({
          id: 'bicep_rom',
          name: 'Peak Flexion',
          status: 'WARNING',
          message: 'STRICT ROM: Achieve full peak bicep contraction (<45° elbow flexion).',
          severity: 'low'
        });
      }
      break;

    case 'squat':
      // Strict Depth: Limit <= 90 degrees (Parallel or below)
      if (avgKnee > 90) {
        rangeOfMotion -= 30;
        checks.push({
          id: 'squat_depth',
          name: 'Squat Depth',
          status: 'FAULT',
          message: `STRICT FAULT: Incomplete depth (${Math.round(avgKnee)}°). Thighs must reach parallel (<=90°).`,
          severity: 'high',
          targetJoints: [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE]
        });
      } else {
        positive.push('Strict parallel squat depth achieved.');
      }

      // Strict Knee Tracking / Valgus Collapse
      const lKneeX = landmarks[POSE_LANDMARKS.LEFT_KNEE]?.x || 0;
      const lAnkleX = landmarks[POSE_LANDMARKS.LEFT_ANKLE]?.x || 0;
      if (Math.abs(lKneeX - lAnkleX) > 0.03) {
        stability -= 35;
        checks.push({
          id: 'knee_valgus',
          name: 'Knee Valgus',
          status: 'FAULT',
          message: 'STRICT SAFETY FAULT: Knees caving inward. Drive knees outwards over middle toes.',
          severity: 'high',
          targetJoints: [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE]
        });
      }

      // Strict Torso Incline: Limit < 25 degrees
      if (joints.torsoInclination > 25.0) {
        posture -= 25;
        checks.push({
          id: 'squat_torso',
          name: 'Forward Lean',
          status: 'WARNING',
          message: 'STRICT POSTURE: Excessive forward chest lean. Keep chest up.',
          severity: 'medium'
        });
      }
      break;

    case 'push_up':
      // Strict Plank Line: Limit 170 - 180 degrees
      if (avgHip < 168 || avgHip > 185) {
        posture -= 35;
        checks.push({
          id: 'pushup_hip_sag',
          name: 'Rigid Plank Spine',
          status: 'FAULT',
          message: 'STRICT FAULT: Spine misaligned. Maintain rigid 180° plank line from shoulders to ankles.',
          severity: 'high',
          targetJoints: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP]
        });
      }
      break;
  }

  const overall = Math.max(
    40,
    Math.round((posture * 0.35 + rangeOfMotion * 0.25 + stability * 0.25 + tempo * 0.15))
  );

  const scoreBreakdown: FormScoreBreakdown = {
    overall,
    posture,
    rangeOfMotion,
    stability,
    tempo,
    symmetry
  };

  const primaryCorrection = checks.length > 0 ? checks[0] : null;

  return {
    scoreBreakdown,
    activeCorrections: checks,
    primaryCorrection,
    positiveFeedback: positive
  };
}
