import React from 'react';
import type { MuscleName } from '../../types/exercise';
import { MUSCLE_VISUAL_MAP } from '../../data/muscleMap';

interface MuscleHeatmapProps {
  engagements: Record<MuscleName, number>;
  primaryMuscles: MuscleName[];
  secondaryMuscles: MuscleName[];
}

export const MuscleHeatmap: React.FC<MuscleHeatmapProps> = ({
  primaryMuscles,
  secondaryMuscles
}) => {
  const getGlowColor = (muscle: MuscleName) => {
    if (primaryMuscles.includes(muscle)) {
      return { fill: '#ff2a6d', glow: 'rgba(255, 42, 109, 0.8)', border: '#ff2a6d' };
    }
    if (secondaryMuscles.includes(muscle)) {
      return { fill: '#00f6ff', glow: 'rgba(0, 246, 255, 0.7)', border: '#00f6ff' };
    }
    return { fill: '#334155', glow: 'transparent', border: '#475569' };
  };

  return (
    <div className="relative w-full h-[320px] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* SVG Body Silhouette + Muscle Markers */}
      <svg className="w-full h-full max-h-[300px]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {/* Head */}
        <ellipse cx="50" cy="12" rx="5" ry="6" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
        {/* Neck */}
        <rect x="48" y="18" width="4" height="4" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />

        {/* Torso Outline */}
        <path
          d="M 36,22 L 64,22 L 60,52 L 40,52 Z"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="0.8"
        />

        {/* Arms Outline */}
        <path d="M 36,22 L 28,42 L 25,55 L 29,56 L 33,44 L 38,28 Z" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
        <path d="M 64,22 L 72,42 L 75,55 L 71,56 L 67,44 L 62,28 Z" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />

        {/* Legs Outline */}
        <path d="M 40,52 L 38,76 L 40,94 L 46,94 L 47,76 L 49,52 Z" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
        <path d="M 60,52 L 62,76 L 60,94 L 54,94 L 53,76 L 51,52 Z" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />

        {/* Render Dynamic Muscle Heat Map Circles & Labels */}
        {(Object.keys(MUSCLE_VISUAL_MAP) as MuscleName[]).map((muscle) => {
          const visual = MUSCLE_VISUAL_MAP[muscle];
          const coords = visual.frontSvgCoords;
          const style = getGlowColor(muscle);

          const isPrimary = primaryMuscles.includes(muscle);
          const isSecondary = secondaryMuscles.includes(muscle);

          if (!isPrimary && !isSecondary) return null;

          return (
            <g key={muscle} className="transition-all duration-300">
              {/* Glowing Halo */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isPrimary ? 5 : 3.5}
                fill={style.fill}
                opacity={isPrimary ? 0.85 : 0.65}
                filter="drop-shadow(0px 0px 6px currentColor)"
                className={isPrimary ? 'animate-pulse' : ''}
              />
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isPrimary ? 2 : 1.5}
                fill="#ffffff"
              />
            </g>
          );
        })}
      </svg>

      {/* Legend Badge Overlay */}
      <div className="absolute bottom-3 left-3 flex items-center space-x-3 text-[10px] font-mono bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#ff2a6d]" />
          <span className="text-slate-300">Primary</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-[#00f6ff]" />
          <span className="text-slate-300">Secondary</span>
        </span>
      </div>
    </div>
  );
};
