import type { MuscleName } from '../types/exercise';

export interface MuscleVisualData {
  name: MuscleName;
  shortName: string;
  category: 'Upper Front' | 'Upper Back' | 'Core' | 'Lower Front' | 'Lower Back';
  description: string;
  frontSvgCoords: { x: number; y: number };
  backSvgCoords?: { x: number; y: number };
}

export const MUSCLE_VISUAL_MAP: Record<MuscleName, MuscleVisualData> = {
  Chest: {
    name: 'Chest',
    shortName: 'Pecs',
    category: 'Upper Front',
    description: 'Pectoralis major and minor responsible for horizontal pressing and arm adduction.',
    frontSvgCoords: { x: 50, y: 28 }
  },
  'Front Deltoid': {
    name: 'Front Deltoid',
    shortName: 'Ant. Delts',
    category: 'Upper Front',
    description: 'Anterior shoulder heads driving arm flexion and overhead movement.',
    frontSvgCoords: { x: 38, y: 23 }
  },
  'Side Deltoid': {
    name: 'Side Deltoid',
    shortName: 'Lat. Delts',
    category: 'Upper Front',
    description: 'Lateral shoulder heads creating shoulder width and arm abduction.',
    frontSvgCoords: { x: 34, y: 24 }
  },
  'Rear Deltoid': {
    name: 'Rear Deltoid',
    shortName: 'Post. Delts',
    category: 'Upper Back',
    description: 'Posterior shoulder head supporting horizontal rowing and shoulder extension.',
    frontSvgCoords: { x: 64, y: 24 }
  },
  Biceps: {
    name: 'Biceps',
    shortName: 'Biceps',
    category: 'Upper Front',
    description: 'Biceps brachii flexes the elbow and supinates the forearm.',
    frontSvgCoords: { x: 32, y: 34 }
  },
  Triceps: {
    name: 'Triceps',
    shortName: 'Triceps',
    category: 'Upper Back',
    description: 'Triceps brachii extends the elbow joint in pressing movements.',
    frontSvgCoords: { x: 68, y: 34 }
  },
  Forearms: {
    name: 'Forearms',
    shortName: 'Forearms',
    category: 'Upper Front',
    description: 'Flexors and extensors controlling grip strength and wrist stability.',
    frontSvgCoords: { x: 28, y: 44 }
  },
  'Latissimus Dorsi': {
    name: 'Latissimus Dorsi',
    shortName: 'Lats',
    category: 'Upper Back',
    description: 'Large back muscle pulling arms down and back.',
    frontSvgCoords: { x: 60, y: 36 }
  },
  Trapezius: {
    name: 'Trapezius',
    shortName: 'Traps',
    category: 'Upper Back',
    description: 'Upper back and neck muscle stabilizing shoulder blades and neck.',
    frontSvgCoords: { x: 50, y: 19 }
  },
  Core: {
    name: 'Core',
    shortName: 'Abs / Core',
    category: 'Core',
    description: 'Rectus abdominis, obliques, and transverse abdominis stabilizing spine.',
    frontSvgCoords: { x: 50, y: 42 }
  },
  Glutes: {
    name: 'Glutes',
    shortName: 'Glutes',
    category: 'Lower Back',
    description: 'Gluteus maximus driving hip extension and pelvis stability.',
    frontSvgCoords: { x: 50, y: 55 }
  },
  Quadriceps: {
    name: 'Quadriceps',
    shortName: 'Quads',
    category: 'Lower Front',
    description: 'Four-headed front thigh muscles extending the knees.',
    frontSvgCoords: { x: 44, y: 68 }
  },
  Hamstrings: {
    name: 'Hamstrings',
    shortName: 'Hammies',
    category: 'Lower Back',
    description: 'Posterior thigh muscles flex knees and extend hips.',
    frontSvgCoords: { x: 56, y: 72 }
  },
  Calves: {
    name: 'Calves',
    shortName: 'Calves',
    category: 'Lower Front',
    description: 'Gastrocnemius and soleus powering plantarflexion.',
    frontSvgCoords: { x: 45, y: 88 }
  }
};
