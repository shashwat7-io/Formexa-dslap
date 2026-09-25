import React from 'react';
import { Shield, Volume2, VolumeX, User, BarChart2, CheckCircle, Activity } from 'lucide-react';
import type { UserProfile } from '../../types/profile';

interface HeaderProps {
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenSummary: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  totalReps: number;
  averageFormScore: number;
  isWorkoutActive?: boolean;
  onToggleWorkout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenProfile,
  onOpenSummary,
  voiceEnabled,
  onToggleVoice,
  totalReps,
  averageFormScore,
  isWorkoutActive = true,
  onToggleWorkout
}) => {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xl shadow-cyan-950/30">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-tr from-cyan-500 to-emerald-400 rounded-xl shadow-lg shadow-cyan-500/30 text-slate-950">
          <Shield className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black tracking-tight text-white font-sans uppercase">
              FORMEXA - <span className="text-cyan-400 font-mono">dslap</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
              v2.4 PRO
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Real-Time Posture & Biomechanical Form Analyzer
          </p>
        </div>
      </div>

      {/* Quick Live Stats Pill */}
      <div className="hidden md:flex items-center space-x-6 bg-slate-900/60 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Total Reps:</span>
          <span className="text-white font-bold">{totalReps}</span>
        </div>
        <div className="h-3 w-px bg-slate-800" />
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Avg Form Score:</span>
          <span className="text-emerald-400 font-bold">{averageFormScore}%</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 font-mono text-xs">
        {/* Workout Start/Off Button */}
        {onToggleWorkout && (
          <button
            onClick={onToggleWorkout}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg flex items-center space-x-2 border ${
              isWorkoutActive
                ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-300 shadow-emerald-500/30 animate-bounce'
            }`}
          >
            <span>{isWorkoutActive ? '⏹ STOP WORKOUT' : '▶ START WORKOUT'}</span>
          </button>
        )}

        {/* Voice Feedback Toggle */}
        <button
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Mute AI Voice Feedback' : 'Enable AI Voice Feedback'}
          className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
            voiceEnabled
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* User Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl text-xs font-medium transition-all"
        >
          <User className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline font-mono">{userProfile.name}</span>
        </button>

        {/* Finish & View Workout Summary */}
        <button
          onClick={onOpenSummary}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
        >
          <BarChart2 className="w-4 h-4 stroke-[2.5]" />
          <span>Session Report</span>
        </button>
      </div>
    </header>
  );
};
