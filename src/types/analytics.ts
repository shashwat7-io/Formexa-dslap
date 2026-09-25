import type { ExerciseId, MuscleName } from './exercise';

export interface WorkoutSession {
  id: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  totalReps: number;
  totalSets: number;
  averageFormScore: number;
  bestExercise: {
    name: string;
    score: number;
  };
  improvementNeeded: {
    name: string;
    score: number;
  };
  exerciseBreakdown: {
    exerciseId: ExerciseId;
    name: string;
    reps: number;
    avgScore: number;
    avgConcentricTime: number;
    avgEccentricTime: number;
  }[];
  muscleEngagements: Record<MuscleName, number>;
  recommendations: string[];
}

export interface ChartDataPoint {
  repNumber: number;
  score: number;
  concentricTime: number;
  eccentricTime: number;
  romCompleteness: number;
  symmetry: number;
}
