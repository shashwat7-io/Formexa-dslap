import React from 'react';
import type { FormScoreBreakdown } from '../../types/exercise';
import { ShieldCheck, Activity, Award, Scale, Clock } from 'lucide-react';

interface FormScoreCardProps {
  scoreBreakdown: FormScoreBreakdown;
}

export const FormScoreCard: React.FC<FormScoreCardProps> = ({ scoreBreakdown }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getMeterGradient = (score: number) => {
    if (score >= 85) return 'from-emerald-500 to-cyan-400';
    if (score >= 70) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-red-400';
  };

  const metrics = [
    { label: 'Posture', value: scoreBreakdown.posture, icon: ShieldCheck },
    { label: 'Range of Motion', value: scoreBreakdown.rangeOfMotion, icon: Activity },
    { label: 'Stability', value: scoreBreakdown.stability, icon: Award },
    { label: 'Tempo', value: scoreBreakdown.tempo, icon: Clock },
    { label: 'Symmetry', value: scoreBreakdown.symmetry, icon: Scale }
  ];

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-xl shadow-cyan-950/20 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs uppercase tracking-wider font-mono text-cyan-400">FORM QUALITY INDEX</h3>
          <p className="text-lg font-extrabold text-white">FORM SCORE</p>
        </div>

        {/* Big Overall Gauge */}
        <div
          className={`flex items-baseline space-x-1 px-4 py-2 rounded-2xl border font-mono font-black ${getScoreColor(
            scoreBreakdown.overall
          )}`}
        >
          <span className="text-3xl">{scoreBreakdown.overall}</span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>

      {/* Breakdown Progress Bars */}
      <div className="space-y-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{m.label}</span>
                </div>
                <span className="font-mono font-bold text-cyan-300">{m.value}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${getMeterGradient(
                    m.value
                  )} transition-all duration-300`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
