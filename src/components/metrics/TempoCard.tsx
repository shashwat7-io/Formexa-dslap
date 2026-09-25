import React from 'react';
import { Clock, ArrowUpRight, ArrowDownRight, PauseCircle } from 'lucide-react';

interface TempoCardProps {
  concentricTime: number;
  eccentricTime: number;
  pauseTime: number;
}

export const TempoCard: React.FC<TempoCardProps> = ({
  concentricTime,
  eccentricTime,
  pauseTime
}) => {
  const getTempoFeedback = () => {
    if (eccentricTime < 1.2) return 'Slow down the eccentric lowering phase for maximum growth.';
    if (concentricTime > 2.5) return 'Explode faster during the concentric lifting phase.';
    return 'Optimal tempo rhythm maintained!';
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 shadow-xl shadow-cyan-950/20 text-white">
      <div className="flex items-center space-x-2 mb-3">
        <Clock className="w-4 h-4 text-cyan-400" />
        <h4 className="text-xs uppercase tracking-wider font-mono text-cyan-400">TEMPO ANALYSIS</h4>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Concentric */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
          <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 mb-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-400" />
            <span>UP (CON)</span>
          </div>
          <span className="text-lg font-bold font-mono text-emerald-400">{concentricTime}s</span>
        </div>

        {/* Eccentric */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
          <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 mb-1">
            <ArrowDownRight className="w-3 h-3 text-cyan-400" />
            <span>DOWN (ECC)</span>
          </div>
          <span className="text-lg font-bold font-mono text-cyan-400">{eccentricTime}s</span>
        </div>

        {/* Pause */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
          <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-400 mb-1">
            <PauseCircle className="w-3 h-3 text-purple-400" />
            <span>PAUSE</span>
          </div>
          <span className="text-lg font-bold font-mono text-purple-400">{pauseTime}s</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 italic bg-slate-950/50 p-2 rounded-lg border border-slate-900">
        💡 {getTempoFeedback()}
      </p>
    </div>
  );
};
