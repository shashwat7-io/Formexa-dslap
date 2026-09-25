import React from 'react';
import type { ExerciseId } from '../../types/exercise';
import { EXERCISE_DEFINITIONS } from '../../data/exercises';
import { Dumbbell } from 'lucide-react';

interface ExerciseSelectorProps {
  selectedExercise: ExerciseId;
  onSelectExercise: (id: ExerciseId) => void;
  confidence: number;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  selectedExercise,
  onSelectExercise,
  confidence
}) => {
  const current = EXERCISE_DEFINITIONS[selectedExercise];

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-cyan-950/20 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-cyan-400 block tracking-wider">
              RECOGNIZED EXERCISE
            </span>
            <h3 className="text-xl font-black text-white font-sans uppercase">
              {current.name}
            </h3>
          </div>
        </div>

        {/* AI Recognition Confidence Badge */}
        <div className="bg-slate-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl font-mono text-right">
          <span className="text-[10px] text-slate-400 block">AI CONFIDENCE</span>
          <span className="text-sm font-bold text-emerald-400">{confidence}%</span>
        </div>
      </div>

      {/* Exercise Quick Dropdown Selector Fallback */}
      <div className="mt-3">
        <label className="text-[11px] font-mono text-slate-400 block mb-1">
          Select or Override Exercise:
        </label>
        <select
          value={selectedExercise}
          onChange={(e) => onSelectExercise(e.target.value as ExerciseId)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-cyan-300 focus:border-cyan-500 outline-none cursor-pointer"
        >
          {(Object.keys(EXERCISE_DEFINITIONS) as ExerciseId[]).map((id) => (
            <option key={id} value={id}>
              {EXERCISE_DEFINITIONS[id].name} ({EXERCISE_DEFINITIONS[id].category})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
