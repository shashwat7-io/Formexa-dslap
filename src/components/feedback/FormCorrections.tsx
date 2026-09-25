import React from 'react';
import type { FormCheck } from '../../types/exercise';
import { AlertCircle, CheckCircle2, ShieldAlert, Split } from 'lucide-react';

interface FormCorrectionsProps {
  primaryCorrection: FormCheck | null;
  positiveFeedback: string[];
  onOpenComparison?: () => void;
}

export const FormCorrections: React.FC<FormCorrectionsProps> = ({
  primaryCorrection,
  positiveFeedback,
  onOpenComparison
}) => {
  if (primaryCorrection) {
    const isFault = primaryCorrection.status === 'FAULT';
    return (
      <div
        className={`p-4 rounded-2xl border backdrop-blur-xl shadow-xl transition-all ${
          isFault
            ? 'bg-rose-950/80 border-rose-500/50 text-rose-100 shadow-rose-950/40'
            : 'bg-amber-950/80 border-amber-500/50 text-amber-100 shadow-amber-950/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-xl border shrink-0 ${
                isFault
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}
            >
              {isFault ? <ShieldAlert className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-mono font-bold tracking-wider">
                  ⚠️ FORM CORRECTION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                  {primaryCorrection.name}
                </span>
              </div>
              <p className="text-sm font-extrabold mt-1 leading-snug">{primaryCorrection.message}</p>
            </div>
          </div>

          {onOpenComparison && (
            <button
              onClick={onOpenComparison}
              className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 shrink-0"
            >
              <Split className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compare Current vs Correct Form</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-2xl text-emerald-100 shadow-xl shadow-emerald-950/40 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-emerald-400">
              ✓ GREAT FORM
            </span>
          </div>
          <p className="text-sm font-extrabold text-white mt-1">
            {positiveFeedback.length > 0
              ? positiveFeedback[0]
              : 'Technique is clean. Maintain steady breathing and posture.'}
          </p>
        </div>
      </div>

      {onOpenComparison && (
        <button
          onClick={onOpenComparison}
          className="px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 shrink-0"
        >
          <Split className="w-3.5 h-3.5 text-cyan-400" />
          <span>Compare Current vs Correct Form</span>
        </button>
      )}
    </div>
  );
};
