export type FitnessGoal =
  | 'Muscle building'
  | 'Strength'
  | 'Fat loss'
  | 'General fitness'
  | 'Rehabilitation support';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Athlete';

export interface UserProfile {
  name: string;
  heightCm: number; // e.g. 175
  weightKg: number; // e.g. 70
  age: number;
  goal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  workingWeightKg: number; // default resistance load for calculation
  voiceFeedbackEnabled: boolean;
  soundAlertsEnabled: boolean;
}
