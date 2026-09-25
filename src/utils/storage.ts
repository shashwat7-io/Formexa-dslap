import type { UserProfile } from '../types/profile';
import type { WorkoutSession } from '../types/analytics';

const PROFILE_KEY = 'fitform_user_profile';
const WORKOUTS_KEY = 'fitform_workout_history';

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  heightCm: 178,
  weightKg: 75,
  age: 26,
  goal: 'Muscle building',
  experienceLevel: 'Intermediate',
  workingWeightKg: 12,
  voiceFeedbackEnabled: true,
  soundAlertsEnabled: true
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function loadWorkoutHistory(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(WORKOUTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load workout history from localStorage', e);
  }
  return [];
}

export function saveWorkoutSession(session: WorkoutSession): void {
  try {
    const history = loadWorkoutHistory();
    history.unshift(session);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(history.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save workout session to localStorage', e);
  }
}
