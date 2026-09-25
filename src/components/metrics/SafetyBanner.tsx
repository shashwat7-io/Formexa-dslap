import React from 'react';
import type { SafetyWarning } from '../../types/exercise';
import { AlertTriangle, Info } from 'lucide-react';
import { SYSTEM_LEGAL_NOTICE } from '../../algorithms/muscleEstimator';

interface SafetyBannerProps {
  warning: SafetyWarning | null;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ warning }) => {
  if (!warning) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Biomechanical Safety Monitor: Active</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">{SYSTEM_LEGAL_NOTICE}</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-rose-950/90 to-red-900/80 border-2 border-rose-500/60 rounded-2xl p-4 text-white shadow-2xl shadow-rose-950/50 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-rose-200 tracking-wide font-mono uppercase">
            {warning.title}
          </h4>
          <p className="text-xs text-rose-100 font-medium mt-1 leading-relaxed">
            {warning.message}
          </p>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-rose-500/30 text-[10px] text-rose-300 font-mono">
            <span className="flex items-center space-x-1">
              <Info className="w-3 h-3 text-rose-400" />
              <span>CONSIDER REDUCING WEIGHT AND CORRECTING FORM</span>
            </span>
            <span>{SYSTEM_LEGAL_NOTICE}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
