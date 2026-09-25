import React from 'react';
import type { MovementPhase } from '../../types/exercise';
import { Repeat, Zap, CheckCircle2, Award } from 'lucide-react';

interface RepCounterCardProps {
  reps: number;
  setNumber: number;
  currentPhase: MovementPhase;
  lastRepScore: number;
  targetReps?: number;
  onStartNextSet?: () => void;
}

export const RepCounterCard: React.FC<RepCounterCardProps> = ({
  reps,
  setNumber,
  currentPhase,
  lastRepScore,
  targetReps = 12,
  onStartNextSet
}) => {
  const isSetComplete = reps >= targetReps;
  const progressPercent = Math.min(100, Math.round((reps / targetReps) * 100));

  const getPhaseBadge = (phase: MovementPhase) => {
    if (isSetComplete) {
      return { label: 'SET COMPLETE 🎉', style: 'bg-emerald-500/30 text-emerald-300 border-emerald-400 font-bold' };
    }
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
    <div className={`backdrop-blur-xl border rounded-2xl p-5 shadow-xl transition-all text-white flex flex-col justify-between ${
      isSetComplete ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-cyan-950/80 border-emerald-500/60 shadow-emerald-950/40' : 'bg-slate-900/70 border-cyan-500/20 shadow-cyan-950/20'
    }`}>
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase font-mono font-bold px-2.5 py-1 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/30">
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

      {/* Main Counter Display */}
      <div className="my-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-black font-mono text-white tracking-tight leading-none">
              {reps}
            </span>
            <span className="text-2xl font-bold font-mono text-slate-400">
              / {targetReps}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">
              REPS
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-cyan-400">
            {progressPercent}%
          </span>
        </div>

        {/* 12-Rep Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 mt-3 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${
              isSetComplete
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-lg shadow-emerald-500/50'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 12-Rep Set Complete Banner / Reset Trigger */}
      {isSetComplete ? (
        <div className="mt-2 bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>SET COMPLETE! 12/12 REPS ACHIEVED</span>
          </div>
          {onStartNextSet && (
            <button
              onClick={onStartNextSet}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all"
            >
              Start Set {setNumber + 1}
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 font-mono">
          <span className="flex items-center space-x-1.5">
            <Repeat className="w-3.5 h-3.5 text-cyan-400" />
            <span>TARGET: {targetReps} STRICT REPS</span>
          </span>
          <span className="text-emerald-400 font-bold">{targetReps - reps} REMAINING</span>
        </div>
      )}
    </div>
  );
};
