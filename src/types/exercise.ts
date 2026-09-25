export type ExerciseId =
  | 'bicep_curl'
  | 'squat'
  | 'push_up'
  | 'shoulder_press'
  | 'lateral_raise'
  | 'lunge'
  | 'deadlift'
  | 'dumbbell_row'
  | 'tricep_extension'
  | 'chest_press';

export type MovementPhase = 'SETUP' | 'ECCENTRIC' | 'CONCENTRIC' | 'PEAK_HOLD' | 'COMPLETED';

export type MuscleName =
  | 'Chest'
  | 'Front Deltoid'
  | 'Side Deltoid'
  | 'Rear Deltoid'
  | 'Biceps'
  | 'Triceps'
  | 'Forearms'
  | 'Latissimus Dorsi'
  | 'Trapezius'
  | 'Core'
  | 'Glutes'
  | 'Quadriceps'
  | 'Hamstrings'
  | 'Calves';

export type EngagementLevel = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'MAXIMAL';

export interface TargetMuscleInfo {
  name: MuscleName;
  role: 'PRIMARY' | 'SECONDARY' | 'STABILIZER';
  estimatedEngagement: number; // 0-100%
  potentialEngagement: number; // 0-100%
  level: EngagementLevel;
  factors: {
    romScore: number;
    controlScore: number;
    jointStability: number;
    tempoScore: number;
    symmetryScore: number;
  };
}

export interface FormCheck {
  id: string;
  name: string;
  status: 'OPTIMAL' | 'WARNING' | 'FAULT';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  targetJoints?: number[];
}

export interface ExerciseDefinition {
  id: ExerciseId;
  name: string;
  category: 'Upper Body' | 'Lower Body' | 'Full Body' | 'Push' | 'Pull';
  primaryMuscles: MuscleName[];
  secondaryMuscles: MuscleName[];
  description: string;
  keyInstructions: string[];
  cameraPlacementHint: string;
}

export interface FormScoreBreakdown {
  overall: number; // 0-100
  posture: number;
  rangeOfMotion: number;
  stability: number;
  tempo: number;
  symmetry: number;
}

export interface RepetitionData {
  repNumber: number;
  score: number;
  phase: MovementPhase;
  concentricTime: number; // seconds
  eccentricTime: number; // seconds
  pauseTime: number; // seconds
  peakAngle: number; // degrees
  romCompleteness: number; // 0-100%
  formIssues: string[];
  timestamp: number;
}

export interface SafetyWarning {
  id: string;
  title: string;
  message: string;
  type: 'knee_valgus' | 'spinal_flexion' | 'extreme_angle' | 'asymmetry' | 'excessive_momentum';
  timestamp: number;
}
