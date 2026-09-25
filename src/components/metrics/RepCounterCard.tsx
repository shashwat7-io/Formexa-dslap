import React from 'react';
import type { MovementPhase } from '../../types/exercise';
import { Repeat, Zap } from 'lucide-react';

interface RepCounterCardProps {
  reps: number;
  setNumber: number;
  currentPhase: MovementPhase;
  lastRepScore: number;
}

export const RepCounterCard: React.FC<RepCounterCardProps> = ({
  reps,
  setNumber,
  currentPhase,
  lastRepScore
}) => {
  const getPhaseBadge = (phase: MovementPhase) => {
    switch (phase) {
      case 'CONCENTRIC':
        return { label: 'CONCENTRIC ↑', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' };
      case 'ECCENTRIC':
        return { label: 'ECCENTRIC ↓', style: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' };
      case 'PEAK_HOLD':
        return { label: 'PEAK HOLD ⚡', style: 'bg-purple-500/20 text-purple-300 border-purple-500/50' };
      default:
        return { label: 'READY', style: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  const badge = getPhaseBadge(currentPhase);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-cyan-950/20 text-white flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase font-mono px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/30">
            SET {setNumber}
          </span>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${badge.style}`}>
            {badge.label}
          </span>
        </div>

        {lastRepScore > 0 && (
          <div className="flex items-center space-x-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
            <Zap className="w-3 h-3" />
            <span>LAST REP: {lastRepScore}%</span>
          </div>
        )}
      </div>

      <div className="my-4 flex items-baseline space-x-3">
        <span className="text-6xl font-black font-mono text-white tracking-tight leading-none">
          {reps}
        </span>
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          COMPLETED REPS
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
        <span className="flex items-center space-x-1.5">
          <Repeat className="w-3.5 h-3.5 text-cyan-400" />
          <span>MIN ROM THRESHOLD</span>
        </span>
        <span className="text-emerald-400 font-bold">VALIDATED ✓</span>
      </div>
    </div>
  );
};
