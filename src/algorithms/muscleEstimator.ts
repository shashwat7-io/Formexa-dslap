import type { ExerciseId, MuscleName, TargetMuscleInfo, FormScoreBreakdown } from '../types/exercise';
import { EXERCISE_DEFINITIONS } from '../data/exercises';

export const ENGAGEMENT_DISCLAIMER =
  'Muscle engagement is estimated from pose, movement and biomechanics. Webcam analysis does not directly measure muscle force.';

export const SYSTEM_LEGAL_NOTICE =
  'This system provides fitness-form guidance and is not medical advice.';

export interface MuscleEngagementSummary {
  primaryTarget: TargetMuscleInfo | null;
  secondaryTargets: TargetMuscleInfo[];
  allMuscles: Record<MuscleName, number>;
  optimizationPotential: number; // Potential target muscle loading %
  optimizationSuggestions: string[];
}

export function estimateMuscleEngagement(
  exerciseId: ExerciseId,
  scoreBreakdown: FormScoreBreakdown,
  _resistanceKg: number = 10
): MuscleEngagementSummary {
  const definition = EXERCISE_DEFINITIONS[exerciseId];
  const primaryMuscles = definition.primaryMuscles;
  const secondaryMuscles = definition.secondaryMuscles;

  const baseRom = scoreBreakdown.rangeOfMotion;
  const baseControl = scoreBreakdown.stability;
  const baseTempo = scoreBreakdown.tempo;
  const basePosture = scoreBreakdown.posture;

  // Base raw biomechanical loading formula
  const currentTargetScore = Math.round(
    baseRom * 0.35 + baseControl * 0.3 + basePosture * 0.2 + baseTempo * 0.15
  );

  const potentialTargetScore = Math.min(
    98,
    Math.round(currentTargetScore + (100 - currentTargetScore) * 0.65)
  );

  const allMuscles: Record<MuscleName, number> = {
    Chest: 5,
    'Front Deltoid': 5,
    'Side Deltoid': 5,
    'Rear Deltoid': 5,
    Biceps: 5,
    Triceps: 5,
    Forearms: 5,
    'Latissimus Dorsi': 5,
    Trapezius: 5,
    Core: 15,
    Glutes: 5,
    Quadriceps: 5,
    Hamstrings: 5,
    Calves: 5
  };

  for (const m of primaryMuscles) {
    allMuscles[m] = currentTargetScore;
  }

  for (const m of secondaryMuscles) {
    allMuscles[m] = Math.round(currentTargetScore * 0.68);
  }

  const primaryTarget: TargetMuscleInfo | null = primaryMuscles.length > 0
    ? {
        name: primaryMuscles[0],
        role: 'PRIMARY',
        estimatedEngagement: currentTargetScore,
        potentialEngagement: potentialTargetScore,
        level: currentTargetScore > 80 ? 'HIGH' : currentTargetScore > 60 ? 'MODERATE' : 'LOW',
        factors: {
          romScore: Math.round(baseRom * 0.25),
          controlScore: Math.round(baseControl * 0.25),
          jointStability: Math.round(basePosture * 0.25),
          tempoScore: Math.round(baseTempo * 0.15),
          symmetryScore: Math.round(scoreBreakdown.symmetry * 0.1)
        }
      }
    : null;

  const secondaryTargets: TargetMuscleInfo[] = secondaryMuscles.map((m) => {
    const score = Math.round(currentTargetScore * 0.68);
    return {
      name: m,
      role: 'SECONDARY',
      estimatedEngagement: score,
      potentialEngagement: Math.round(potentialTargetScore * 0.7),
      level: score > 70 ? 'HIGH' : score > 45 ? 'MODERATE' : 'LOW',
      factors: {
        romScore: Math.round(baseRom * 0.2),
        controlScore: Math.round(baseControl * 0.2),
        jointStability: Math.round(basePosture * 0.2),
        tempoScore: Math.round(baseTempo * 0.1),
        symmetryScore: Math.round(scoreBreakdown.symmetry * 0.1)
      }
    };
  });

  const suggestions: string[] = [];
  if (baseControl < 85) {
    suggestions.push('Reduce joint momentum to isolate target muscle fibers.');
  }
  if (baseRom < 85) {
    suggestions.push('Achieve full controlled range of motion at peak contraction.');
  }
  if (baseTempo < 85) {
    suggestions.push('Slow down the eccentric phase (2.5s lowering) to increase time under tension.');
  }
  if (basePosture < 85) {
    suggestions.push('Stabilize your spine and core to prevent leverage dissipation.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Form is near optimal! Maintain current control and focus on muscle mind connection.');
  }

  return {
    primaryTarget,
    secondaryTargets,
    allMuscles,
    optimizationPotential: potentialTargetScore,
    optimizationSuggestions: suggestions
  };
}
