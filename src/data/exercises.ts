import type { ExerciseDefinition, ExerciseId } from '../types/exercise';

export const EXERCISE_DEFINITIONS: Record<ExerciseId, ExerciseDefinition> = {
  bicep_curl: {
    id: 'bicep_curl',
    name: 'Bicep Curl',
    category: 'Upper Body',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms', 'Brachialis' as any],
    description: 'Isolation exercise targeting biceps brachii with elbow flexion.',
    keyInstructions: [
      'Keep upper arms stationary at your torso.',
      'Curl the weight while contracting your biceps.',
      'Squeeze at the top and lower under control.',
      'Avoid swinging your torso or using momentum.'
    ],
    cameraPlacementHint: 'Side or 45-degree angle profile view.'
  },
  squat: {
    id: 'squat',
    name: 'Squat',
    category: 'Lower Body',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core', 'Calves'],
    description: 'Compound lower-body exercise for quad, glute, and core strength.',
    keyInstructions: [
      'Keep feet shoulder-width apart.',
      'Hinge at hips and knees simultaneously.',
      'Lower hips until thighs are parallel to ground.',
      'Keep knees tracking in line with toes and torso chest up.'
    ],
    cameraPlacementHint: 'Front or 45-degree side view showing full body.'
  },
  push_up: {
    id: 'push_up',
    name: 'Push-up',
    category: 'Push',
    primaryMuscles: ['Chest', 'Triceps'],
    secondaryMuscles: ['Front Deltoid', 'Core'],
    description: 'Bodyweight pressing exercise for chest, shoulders, triceps and core plank stability.',
    keyInstructions: [
      'Maintain a rigid straight plank line from head to heels.',
      'Lower chest until elbows bend to 90 degrees.',
      'Keep neck neutral and press firmly back up.'
    ],
    cameraPlacementHint: 'Side view perpendicular to your body.'
  },
  shoulder_press: {
    id: 'shoulder_press',
    name: 'Shoulder Press',
    category: 'Push',
    primaryMuscles: ['Front Deltoid', 'Side Deltoid'],
    secondaryMuscles: ['Triceps', 'Trapezius'],
    description: 'Overhead compound pressing exercise targeting deltoids and upper body lockout.',
    keyInstructions: [
      'Press arms overhead until elbows lock out cleanly.',
      'Avoid arching your lower back excessively.',
      'Keep core brace engaged throughout press.'
    ],
    cameraPlacementHint: 'Front or 45-degree view.'
  },
  lateral_raise: {
    id: 'lateral_raise',
    name: 'Lateral Raise',
    category: 'Upper Body',
    primaryMuscles: ['Side Deltoid'],
    secondaryMuscles: ['Front Deltoid', 'Trapezius'],
    description: 'Isolation exercise targeting lateral deltoids for shoulder width.',
    keyInstructions: [
      'Raise arms laterally with slight bend in elbows.',
      'Lead with elbows, stopping at shoulder height.',
      'Do not shrug shoulders up toward ears.'
    ],
    cameraPlacementHint: 'Direct front view.'
  },
  lunge: {
    id: 'lunge',
    name: 'Lunge',
    category: 'Lower Body',
    primaryMuscles: ['Quadriceps', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Calves', 'Core'],
    description: 'Unilateral lower-body leg exercise testing balance, depth, and quad engagement.',
    keyInstructions: [
      'Step forward and lower rear knee toward ground.',
      'Keep front knee aligned vertically over front ankle.',
      'Maintain an upright torso and push through front heel.'
    ],
    cameraPlacementHint: 'Side view showing both leg movements.'
  },
  deadlift: {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'Full Body',
    primaryMuscles: ['Hamstrings', 'Glutes', 'Latissimus Dorsi'],
    secondaryMuscles: ['Core', 'Trapezius', 'Forearms'],
    description: 'Posterior chain hinge exercise for spinal extension and leg power.',
    keyInstructions: [
      'Hinge at hips with a flat, neutral spine.',
      'Keep weight close to shins throughout motion.',
      'Drive hips forward to stand tall without leaning back.'
    ],
    cameraPlacementHint: 'Side profile view to monitor spinal neutrality.'
  },
  dumbbell_row: {
    id: 'dumbbell_row',
    name: 'Dumbbell Row',
    category: 'Pull',
    primaryMuscles: ['Latissimus Dorsi', 'Rear Deltoid'],
    secondaryMuscles: ['Biceps', 'Trapezius', 'Core'],
    description: 'Horizontal pulling exercise for upper back density and lats.',
    keyInstructions: [
      'Hinge forward with flat back stable position.',
      'Pull elbow back towards hip pocket.',
      'Squeeze shoulder blade at peak contraction.'
    ],
    cameraPlacementHint: 'Side view facing torso profile.'
  },
  tricep_extension: {
    id: 'tricep_extension',
    name: 'Tricep Extension',
    category: 'Push',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms', 'Rear Deltoid'],
    description: 'Isolation exercise focusing on tricep long head extension.',
    keyInstructions: [
      'Keep upper arms stationary near head or torso.',
      'Extend forearms until arms are straight.',
      'Lower under control without flaring elbows.'
    ],
    cameraPlacementHint: 'Side or front view.'
  },
  chest_press: {
    id: 'chest_press',
    name: 'Chest Press',
    category: 'Push',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Deltoid', 'Triceps'],
    description: 'Horizontal pressing exercise for pectoral muscle development.',
    keyInstructions: [
      'Press handles or weight straight out over sternum.',
      'Keep shoulder blades pinched back.',
      'Lower with controlled 45-degree elbow path.'
    ],
    cameraPlacementHint: '45-degree or top-side view.'
  }
};
