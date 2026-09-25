import React from 'react';
import { Trophy, CheckCircle, AlertTriangle, X } from 'lucide-react';
import type { WorkoutSession } from '../../types/analytics';

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: WorkoutSession | null;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  isOpen,
  onClose,
  session
}) => {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono text-cyan-400 font-bold">SESSION COMPLETE</span>
            <h2 className="text-2xl font-black text-white tracking-tight">WORKOUT SUMMARY REPORT</h2>
          </div>
        </div>

        {/* Top Key Performance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-sans block">Total Reps</span>
            <span className="text-2xl font-black font-mono text-cyan-400">{session.totalReps}</span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-sans block">Avg Form Score</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{session.averageFormScore}%</span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-sans block">Duration</span>
            <span className="text-2xl font-black font-mono text-purple-400">
              {Math.round(session.durationSeconds / 60)}m
            </span>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-sans block">Exercises</span>
            <span className="text-2xl font-black font-mono text-amber-400">{session.totalSets}</span>
          </div>
        </div>

        {/* Best vs Needs Improvement Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] font-mono text-emerald-300 uppercase block">Best Exercise Form</span>
              <span className="text-base font-bold text-white">{session.bestExercise.name}</span>
              <span className="text-xs font-mono text-emerald-400 font-bold block">{session.bestExercise.score}% Form Score</span>
            </div>
          </div>

          <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <span className="text-[11px] font-mono text-amber-300 uppercase block">Needs Focus</span>
              <span className="text-base font-bold text-white">{session.improvementNeeded.name}</span>
              <span className="text-xs font-mono text-amber-400 font-bold block">{session.improvementNeeded.score}% Form Score</span>
            </div>
          </div>
        </div>

        {/* Target Muscle Loading Summary */}
        <div className="mb-6">
          <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 mb-3">
            ESTIMATED TARGET MUSCLE ENGAGEMENT SUMMARY
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(session.muscleEngagements).map(([muscle, score]) => (
              <div key={muscle} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">{muscle}</span>
                <span className="font-mono font-bold text-cyan-300">{score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="mb-6 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">ACTIONABLE AI RECOMMENDATIONS:</h4>
          {session.recommendations.map((rec, idx) => (
            <p key={idx} className="text-xs text-slate-400 flex items-start space-x-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{rec}</span>
            </p>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
