import React from 'react';
import type { TargetMuscleInfo } from '../../types/exercise';
import { ENGAGEMENT_DISCLAIMER } from '../../algorithms/muscleEstimator';
import { Activity, Info } from 'lucide-react';

interface MuscleEngagementListProps {
  primaryTarget: TargetMuscleInfo | null;
  secondaryTargets: TargetMuscleInfo[];
}

export const MuscleEngagementList: React.FC<MuscleEngagementListProps> = ({
  primaryTarget,
  secondaryTargets
}) => {
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'MODERATE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-cyan-950/20 text-white space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs uppercase font-mono font-bold tracking-wider text-cyan-400">
            MUSCLE ENGAGEMENT PANEL
          </h3>
        </div>
        <span className="text-xs font-mono font-bold text-slate-300">ESTIMATED LOAD</span>
      </div>

      {/* Primary Muscle Load */}
      {primaryTarget && (
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-cyan-500/30">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded">
                PRIMARY TARGET
              </span>
              <span className="text-sm font-bold text-white">{primaryTarget.name}</span>
            </div>

            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getLevelBadge(primaryTarget.level)}`}>
              {primaryTarget.level}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mt-2 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 transition-all duration-300"
              style={{ width: `${primaryTarget.estimatedEngagement}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-1">
            <span>Estimated Engagement</span>
            <span className="text-cyan-300 font-bold">{primaryTarget.estimatedEngagement}%</span>
          </div>
        </div>
      )}

      {/* Secondary Muscles List */}
      {secondaryTargets.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-mono text-slate-400 block">SECONDARY SYNERGISTS</span>
          {secondaryTargets.map((sec) => (
            <div key={sec.name} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">{sec.name}</span>
              <div className="flex items-center space-x-3 font-mono">
                <span className={`px-2 py-0.5 rounded text-[10px] border ${getLevelBadge(sec.level)}`}>
                  {sec.level}
                </span>
                <span className="text-cyan-400 font-bold">{sec.estimatedEngagement}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MANDATORY LEGAL & BIOMECHANICAL DISCLAIMER */}
      <div className="bg-slate-950/90 border border-amber-500/30 p-3 rounded-xl flex items-start space-x-2 text-[11px] text-amber-200/90 leading-relaxed font-sans">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold font-mono uppercase text-amber-300 block text-[10px] mb-0.5">
            ESTIMATED ENGAGEMENT DISCLAIMER
          </span>
          <span>{ENGAGEMENT_DISCLAIMER}</span>
        </div>
      </div>
    </div>
  );
};
