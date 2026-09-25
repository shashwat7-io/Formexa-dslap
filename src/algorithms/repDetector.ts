import type { ExerciseId, MovementPhase, RepetitionData } from '../types/exercise';
import type { ExtractedJoints } from './poseAnalysis';

export interface RepTrackerState {
  currentRep: number;
  currentPhase: MovementPhase;
  concentricDuration: number;
  eccentricDuration: number;
  pauseDuration: number;
  repHistory: RepetitionData[];
  lastRepScore: number;
  averageScore: number;
}

export class RepDetector {
  private exerciseId: ExerciseId;
  private state: MovementPhase = 'SETUP';
  private repCount = 0;
  private repHistory: RepetitionData[] = [];
  
  private phaseStartTime = Date.now();
  private concentricTime = 0;
  private eccentricTime = 0;
  private pauseTime = 0;

  private minAngleObserved = 180;
  private maxAngleObserved = 0;

  constructor(exerciseId: ExerciseId) {
    this.exerciseId = exerciseId;
  }

  public setExercise(exerciseId: ExerciseId) {
    if (this.exerciseId !== exerciseId) {
      this.exerciseId = exerciseId;
      this.reset();
    }
  }

  public reset() {
    this.state = 'SETUP';
    this.repCount = 0;
    this.repHistory = [];
    this.phaseStartTime = Date.now();
    this.concentricTime = 0;
    this.eccentricTime = 0;
    this.pauseTime = 0;
    this.minAngleObserved = 180;
    this.maxAngleObserved = 0;
  }

  public resetReps() {
    this.reset();
  }

  public processFrame(joints: ExtractedJoints, formScore: number): boolean {
    const now = Date.now();
    const primaryAngle = this.getPrimaryTargetAngle(joints);

    this.minAngleObserved = Math.min(this.minAngleObserved, primaryAngle);
    this.maxAngleObserved = Math.max(this.maxAngleObserved, primaryAngle);

    const isFlexionPrimary = this.isFlexionConcentric();

    let repCompleted = false;

    switch (this.state) {
      case 'SETUP':
        if (this.isAtStartThreshold(primaryAngle)) {
          this.state = 'CONCENTRIC';
          this.phaseStartTime = now;
        }
        break;

      case 'CONCENTRIC':
        if (this.isAtPeakThreshold(primaryAngle)) {
          this.concentricTime = (now - this.phaseStartTime) / 1000;
          this.state = 'PEAK_HOLD';
          this.phaseStartTime = now;
        }
        break;

      case 'PEAK_HOLD':
        if (!this.isAtPeakThreshold(primaryAngle) || (now - this.phaseStartTime) > 300) {
          this.pauseTime = (now - this.phaseStartTime) / 1000;
          this.state = 'ECCENTRIC';
          this.phaseStartTime = now;
        }
        break;

      case 'ECCENTRIC':
        if (this.isAtStartThreshold(primaryAngle)) {
          this.eccentricTime = (now - this.phaseStartTime) / 1000;
          this.repCount += 1;

          const romSpan = Math.abs(this.maxAngleObserved - this.minAngleObserved);
          const romCompleteness = Math.min(100, Math.round((romSpan / this.getExpectedSpan()) * 100));

          const repData: RepetitionData = {
            repNumber: this.repCount,
            score: Math.max(50, Math.min(100, Math.round(formScore * 0.7 + romCompleteness * 0.3))),
            phase: 'COMPLETED',
            concentricTime: Math.max(0.5, Math.round(this.concentricTime * 10) / 10),
            eccentricTime: Math.max(0.5, Math.round(this.eccentricTime * 10) / 10),
            pauseTime: Math.round(this.pauseTime * 10) / 10,
            peakAngle: isFlexionPrimary ? this.minAngleObserved : this.maxAngleObserved,
            romCompleteness,
            formIssues: [],
            timestamp: now
          };

          this.repHistory.push(repData);
          repCompleted = true;

          this.state = 'CONCENTRIC';
          this.phaseStartTime = now;
          this.minAngleObserved = primaryAngle;
          this.maxAngleObserved = primaryAngle;
        }
        break;
    }

    return repCompleted;
  }

  public getState(): RepTrackerState {
    const avgScore =
      this.repHistory.length > 0
        ? Math.round(
            this.repHistory.reduce((acc, r) => acc + r.score, 0) / this.repHistory.length
          )
        : 88;

    return {
      currentRep: this.repCount,
      currentPhase: this.state === 'SETUP' ? 'CONCENTRIC' : this.state,
      concentricDuration: this.concentricTime || 1.2,
      eccentricDuration: this.eccentricTime || 2.4,
      pauseDuration: this.pauseTime || 0.4,
      repHistory: this.repHistory,
      lastRepScore: this.repHistory.length > 0 ? this.repHistory[this.repHistory.length - 1].score : 90,
      averageScore: avgScore
    };
  }

  private getPrimaryTargetAngle(joints: ExtractedJoints): number {
    switch (this.exerciseId) {
      case 'bicep_curl':
      case 'tricep_extension':
      case 'push_up':
        return (joints.leftElbowAngle + joints.rightElbowAngle) / 2;
      case 'squat':
      case 'lunge':
        return (joints.leftKneeAngle + joints.rightKneeAngle) / 2;
      case 'shoulder_press':
      case 'lateral_raise':
      case 'chest_press':
        return (joints.leftShoulderAngle + joints.rightShoulderAngle) / 2;
      case 'deadlift':
      case 'dumbbell_row':
        return (joints.leftHipAngle + joints.rightHipAngle) / 2;
      default:
        return 90;
    }
  }

  private isFlexionConcentric(): boolean {
    return ['bicep_curl', 'squat', 'push_up', 'lunge', 'deadlift', 'dumbbell_row'].includes(
      this.exerciseId
    );
  }

  private isAtStartThreshold(angle: number): boolean {
    switch (this.exerciseId) {
      case 'bicep_curl':
      case 'tricep_extension':
      case 'squat':
      case 'deadlift':
        return angle > 145;
      case 'push_up':
      case 'shoulder_press':
      case 'lateral_raise':
      case 'chest_press':
      case 'lunge':
      case 'dumbbell_row':
        return angle > 130;
      default:
        return angle > 140;
    }
  }

  private isAtPeakThreshold(angle: number): boolean {
    switch (this.exerciseId) {
      case 'bicep_curl':
        return angle < 65;
      case 'squat':
      case 'lunge':
        return angle < 95;
      case 'push_up':
        return angle < 90;
      case 'shoulder_press':
      case 'lateral_raise':
        return angle > 140;
      case 'deadlift':
      case 'dumbbell_row':
        return angle < 100;
      case 'tricep_extension':
        return angle > 155;
      case 'chest_press':
        return angle > 150;
      default:
        return angle < 75;
    }
  }

  private getExpectedSpan(): number {
    switch (this.exerciseId) {
      case 'bicep_curl':
        return 115;
      case 'squat':
        return 80;
      case 'push_up':
        return 75;
      default:
        return 80;
    }
  }
}
