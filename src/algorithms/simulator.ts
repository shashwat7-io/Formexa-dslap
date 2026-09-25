import type { ExerciseId } from '../types/exercise';
import type { Landmark, PoseLandmarks } from '../types/pose';
import { POSE_LANDMARKS } from './poseAnalysis';

export type SimulationPreset =
  | 'PERFECT'
  | 'ELBOW_DRIFT'
  | 'KNEE_VALGUS'
  | 'SPINAL_FLEXION'
  | 'TORSO_SWING';

/**
 * Procedural generator for 33 MediaPipe pose landmarks simulating human movement.
 */
export class PoseSimulator {
  private startTime: number = Date.now();
  private exerciseId: ExerciseId = 'bicep_curl';
  private preset: SimulationPreset = 'PERFECT';

  constructor(exerciseId: ExerciseId = 'bicep_curl') {
    this.exerciseId = exerciseId;
  }

  public setExercise(exerciseId: ExerciseId) {
    this.exerciseId = exerciseId;
  }

  public setPreset(preset: SimulationPreset) {
    this.preset = preset;
  }

  public generateFrame(): PoseLandmarks {
    const elapsed = (Date.now() - this.startTime) / 1000;
    // 3.5-second rep cycle phase (sinusoidal 0 to 1 to 0)
    const cycle = (Math.sin(elapsed * (Math.PI * 2 / 3.5)) + 1) / 2;

    const landmarks: PoseLandmarks = new Array(33).fill(0).map(() => ({
      x: 0.5,
      y: 0.5,
      z: 0,
      visibility: 0.95
    }));

    // Standard standing base landmarks
    const head: Landmark = { x: 0.5, y: 0.15, z: 0, visibility: 0.99 };
    const lShoulder: Landmark = { x: 0.4, y: 0.28, z: 0, visibility: 0.98 };
    const rShoulder: Landmark = { x: 0.6, y: 0.28, z: 0, visibility: 0.98 };

    const lHip: Landmark = { x: 0.42, y: 0.52, z: 0, visibility: 0.98 };
    const rHip: Landmark = { x: 0.58, y: 0.52, z: 0, visibility: 0.98 };

    let lElbow: Landmark = { x: 0.38, y: 0.42, z: 0, visibility: 0.95 };
    let rElbow: Landmark = { x: 0.62, y: 0.42, z: 0, visibility: 0.95 };
    let lWrist: Landmark = { x: 0.38, y: 0.56, z: 0, visibility: 0.95 };
    let rWrist: Landmark = { x: 0.62, y: 0.56, z: 0, visibility: 0.95 };

    let lKnee: Landmark = { x: 0.42, y: 0.7, z: 0, visibility: 0.95 };
    let rKnee: Landmark = { x: 0.58, y: 0.7, z: 0, visibility: 0.95 };
    let lAnkle: Landmark = { x: 0.42, y: 0.88, z: 0, visibility: 0.95 };
    let rAnkle: Landmark = { x: 0.58, y: 0.88, z: 0, visibility: 0.95 };

    // Apply specific preset faults
    if (this.preset === 'ELBOW_DRIFT') {
      lElbow.y -= cycle * 0.12; // Elbow drifts forward/upward
      rElbow.y -= cycle * 0.12;
      lElbow.x -= cycle * 0.08;
      rElbow.x += cycle * 0.08;
    }

    if (this.preset === 'KNEE_VALGUS') {
      lKnee.x += cycle * 0.09; // Knees collapse inward towards center
      rKnee.x -= cycle * 0.09;
    }

    if (this.preset === 'SPINAL_FLEXION') {
      head.y += cycle * 0.22; // Excessive forward rounding
      lShoulder.y += cycle * 0.2;
      rShoulder.y += cycle * 0.2;
      lHip.x += cycle * 0.05;
    }

    if (this.preset === 'TORSO_SWING') {
      head.x += Math.sin(elapsed * 4) * 0.08; // Excessive sway
      lShoulder.x += Math.sin(elapsed * 4) * 0.08;
      rShoulder.x += Math.sin(elapsed * 4) * 0.08;
    }

    switch (this.exerciseId) {
      case 'bicep_curl':
        lWrist.y = 0.56 - cycle * 0.26;
        rWrist.y = 0.56 - cycle * 0.26;
        lWrist.x = 0.38 - cycle * 0.03;
        rWrist.x = 0.62 + cycle * 0.03;
        break;

      case 'squat':
        const drop = cycle * 0.16;
        head.y += drop;
        lShoulder.y += drop;
        rShoulder.y += drop;
        lHip.y += drop * 1.1;
        rHip.y += drop * 1.1;
        if (this.preset !== 'KNEE_VALGUS') {
          lKnee.x = 0.42 - cycle * 0.05;
          rKnee.x = 0.58 + cycle * 0.05;
        }
        lKnee.y = 0.7 + drop * 0.5;
        rKnee.y = 0.7 + drop * 0.5;
        break;

      case 'push_up':
        head.y = 0.4 + cycle * 0.1;
        head.x = 0.2;
        lShoulder.x = 0.35;
        rShoulder.x = 0.35;
        lShoulder.y = 0.42 + cycle * 0.12;
        rShoulder.y = 0.42 + cycle * 0.12;
        lElbow.x = 0.35;
        rElbow.x = 0.35;
        lElbow.y = 0.55 + cycle * 0.05;
        rElbow.y = 0.55 + cycle * 0.05;
        lWrist.x = 0.35;
        rWrist.x = 0.35;
        lWrist.y = 0.65;
        rWrist.y = 0.65;
        lHip.x = 0.6;
        rHip.x = 0.6;
        lHip.y = 0.45;
        rHip.y = 0.45;
        lAnkle.x = 0.85;
        rAnkle.x = 0.85;
        lAnkle.y = 0.48;
        rAnkle.y = 0.48;
        break;

      case 'shoulder_press':
        lElbow.y = 0.38 - cycle * 0.15;
        rElbow.y = 0.38 - cycle * 0.15;
        lWrist.y = 0.3 - cycle * 0.22;
        rWrist.y = 0.3 - cycle * 0.22;
        break;

      case 'lateral_raise':
        lElbow.x = 0.38 - cycle * 0.18;
        rElbow.x = 0.62 + cycle * 0.18;
        lElbow.y = 0.42 - cycle * 0.14;
        rElbow.y = 0.42 - cycle * 0.14;
        lWrist.x = 0.38 - cycle * 0.26;
        rWrist.x = 0.62 + cycle * 0.26;
        lWrist.y = 0.56 - cycle * 0.28;
        rWrist.y = 0.56 - cycle * 0.28;
        break;

      case 'lunge':
        lKnee.y = 0.72 + cycle * 0.08;
        rKnee.y = 0.72 + cycle * 0.14;
        lAnkle.x = 0.36;
        rAnkle.x = 0.64;
        break;

      case 'deadlift':
        const hinge = cycle * 0.18;
        head.y = 0.15 + hinge * 0.8;
        head.x = 0.5 + hinge * 0.1;
        lShoulder.y = 0.28 + hinge * 0.7;
        rShoulder.y = 0.28 + hinge * 0.7;
        lWrist.y = 0.56 + hinge * 0.6;
        rWrist.y = 0.56 + hinge * 0.6;
        break;

      default:
        lWrist.y = 0.56 - cycle * 0.2;
        rWrist.y = 0.56 - cycle * 0.2;
        break;
    }

    landmarks[POSE_LANDMARKS.NOSE] = head;
    landmarks[POSE_LANDMARKS.LEFT_SHOULDER] = lShoulder;
    landmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = rShoulder;
    landmarks[POSE_LANDMARKS.LEFT_ELBOW] = lElbow;
    landmarks[POSE_LANDMARKS.RIGHT_ELBOW] = rElbow;
    landmarks[POSE_LANDMARKS.LEFT_WRIST] = lWrist;
    landmarks[POSE_LANDMARKS.RIGHT_WRIST] = rWrist;
    landmarks[POSE_LANDMARKS.LEFT_HIP] = lHip;
    landmarks[POSE_LANDMARKS.RIGHT_HIP] = rHip;
    landmarks[POSE_LANDMARKS.LEFT_KNEE] = lKnee;
    landmarks[POSE_LANDMARKS.RIGHT_KNEE] = rKnee;
    landmarks[POSE_LANDMARKS.LEFT_ANKLE] = lAnkle;
    landmarks[POSE_LANDMARKS.RIGHT_ANKLE] = rAnkle;

    return landmarks;
  }
}
