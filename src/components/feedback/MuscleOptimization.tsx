import React from 'react';
import type { TargetMuscleInfo } from '../../types/exercise';
import { Sparkles, ArrowRight, CheckSquare } from 'lucide-react';

interface MuscleOptimizationProps {
  primaryTarget: TargetMuscleInfo | null;
  suggestions: string[];
}

export const MuscleOptimization: React.FC<MuscleOptimizationProps> = ({
  primaryTarget,
  suggestions
}) => {
  if (!primaryTarget) return null;

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-5 shadow-xl shadow-purple-950/20 text-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-purple-300">
            TARGET MUSCLE OPTIMIZATION
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          MAX EFFECTIVE LOAD
        </span>
      </div>

      {/* Engagement Comparison Header */}
      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block font-sans">Current {primaryTarget.name} Load</span>
          <span className="text-xl font-mono font-black text-cyan-400">
            {primaryTarget.estimatedEngagement}%
          </span>
        </div>

        <ArrowRight className="w-5 h-5 text-purple-400" />

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-sans">Potential Target Load</span>
          <span className="text-xl font-mono font-black text-purple-400">
            {primaryTarget.potentialEngagement}%
          </span>
        </div>
      </div>

      {/* Actionable Suggestions */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 block mb-1">
          BIOMECHANICAL ADJUSTMENTS TO INCREASE TARGET LOADING:
        </span>
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-2 text-xs text-slate-300 bg-purple-950/20 border border-purple-500/20 p-2.5 rounded-lg"
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
