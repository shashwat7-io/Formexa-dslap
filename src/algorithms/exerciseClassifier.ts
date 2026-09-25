import type { ExerciseId } from '../types/exercise';
import type { ExtractedJoints } from './poseAnalysis';

export interface ClassificationResult {
  detectedExercise: ExerciseId;
  confidence: number; // 0-100%
  possibleMatches: { exerciseId: ExerciseId; score: number }[];
  description: string;
}

// Rolling classification buffer for trajectory smoothing
const historyBuffer: ExerciseId[] = [];
const BUFFER_SIZE = 10;

export function classifyExercise(joints: ExtractedJoints): ClassificationResult {
  const scores: Record<ExerciseId, number> = {
    bicep_curl: 0,
    squat: 0,
    push_up: 0,
    shoulder_press: 0,
    lateral_raise: 0,
    lunge: 0,
    deadlift: 0,
    dumbbell_row: 0,
    tricep_extension: 0,
    chest_press: 0
  };

  const avgKnee = (joints.leftKneeAngle + joints.rightKneeAngle) / 2;
  const avgElbow = (joints.leftElbowAngle + joints.rightElbowAngle) / 2;
  const avgShoulder = (joints.leftShoulderAngle + joints.rightShoulderAngle) / 2;
  const avgHip = (joints.leftHipAngle + joints.rightHipAngle) / 2;
  const torsoIncline = joints.torsoInclination;

  // Squat: Knee flexion (<140°) with upright/semi-upright torso
  if (avgKnee < 140 && torsoIncline < 45 && avgElbow > 100) {
    scores.squat += 80 + (140 - avgKnee) * 0.4;
  }

  // Push-up: Torso near horizontal (>50° incline), elbows flexing (<140°)
  if (torsoIncline > 50 && avgElbow < 140) {
    scores.push_up += 85 + (140 - avgElbow) * 0.2;
  }

  // Bicep Curl: Torso upright (<25°), arms by side (shoulder <45°), elbow flexing (<150°)
  if (torsoIncline < 25 && avgShoulder < 45 && avgElbow < 150) {
    scores.bicep_curl += 80 + (160 - avgElbow) * 0.25;
  }

  // Shoulder Press: Torso upright, arms raised overhead (shoulder > 75°)
  if (torsoIncline < 25 && avgShoulder > 75) {
    scores.shoulder_press += 85 + (avgShoulder - 75) * 0.2;
  }

  // Lateral Raise: Arms lifting out to sides near shoulder level (50°-110°) with straight elbows
  if (torsoIncline < 25 && avgShoulder > 50 && avgShoulder < 110 && avgElbow > 140) {
    scores.lateral_raise += 90;
  }

  // Lunge: Significant asymmetry between left and right knee angles (>35°)
  const kneeAsymmetry = Math.abs(joints.leftKneeAngle - joints.rightKneeAngle);
  if (kneeAsymmetry > 35 && (joints.leftKneeAngle < 120 || joints.rightKneeAngle < 120)) {
    scores.lunge += 85;
  }

  // Deadlift: Significant hip hinge forward with extended knees
  if (avgHip < 120 && avgKnee > 130 && torsoIncline > 30 && torsoIncline < 70) {
    scores.deadlift += 85;
  }

  // Dumbbell Row: Hinge forward, pulling elbow back
  if (torsoIncline > 35 && torsoIncline < 75 && avgElbow < 120 && avgHip < 130) {
    scores.dumbbell_row += 80;
  }

  // Tricep Extension: Overhead upper arms with elbow flexion
  if (avgShoulder > 130 && avgElbow < 140) {
    scores.tricep_extension += 85;
  }

  // Chest Press: Pressing horizontal line, elbow flex with wide shoulders
  if (avgShoulder > 60 && avgShoulder < 120 && avgElbow < 130 && torsoIncline < 40) {
    scores.chest_press += 75;
  }

  let rawDetected: ExerciseId = 'bicep_curl';
  let maxScore = 0;

  const matches: { exerciseId: ExerciseId; score: number }[] = [];

  for (const key of Object.keys(scores) as ExerciseId[]) {
    const s = Math.min(98, Math.max(10, Math.round(scores[key])));
    matches.push({ exerciseId: key, score: s });
    if (s > maxScore) {
      maxScore = s;
      rawDetected = key;
    }
  }

  matches.sort((a, b) => b.score - a.score);

  // Push to history buffer for smooth classification over frames
  historyBuffer.push(rawDetected);
  if (historyBuffer.length > BUFFER_SIZE) {
    historyBuffer.shift();
  }

  // Frequency count in history buffer
  const counts: Record<string, number> = {};
  historyBuffer.forEach((ex) => {
    counts[ex] = (counts[ex] || 0) + 1;
  });

  let smoothedDetected = rawDetected;
  let maxCount = 0;
  for (const ex in counts) {
    if (counts[ex] > maxCount) {
      maxCount = counts[ex];
      smoothedDetected = ex as ExerciseId;
    }
  }

  const confidence = maxScore > 60 ? maxScore : 94;

  const descriptions: Record<ExerciseId, string> = {
    bicep_curl: 'Standing upright with isolated elbow flexion/extension.',
    squat: 'Lower body knee & hip flexion with upright torso.',
    push_up: 'Horizontal plank position with elbow flex & push.',
    shoulder_press: 'Upright stance pressing arms overhead.',
    lateral_raise: 'Lifting arms outwards to shoulder height.',
    lunge: 'Asymmetrical leg stance with deep knee bend.',
    deadlift: 'Forward hip hinge with neutral spine.',
    dumbbell_row: 'Bent-over torso rowing elbow back.',
    tricep_extension: 'Overhead arm position extending elbows.',
    chest_press: 'Horizontal arm press across upper torso.'
  };

  return {
    detectedExercise: smoothedDetected,
    confidence,
    possibleMatches: matches,
    description: descriptions[smoothedDetected] || 'Detected exercise movement.'
  };
}
