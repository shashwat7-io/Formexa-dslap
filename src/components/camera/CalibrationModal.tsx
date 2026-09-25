import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Camera, Sun, UserCheck } from 'lucide-react';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCalibrationComplete: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  onCalibrationComplete
}) => {
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (isCalibrating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCalibrating(false);
            onCalibrationComplete();
            return 100;
          }
          return prev + 25;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isCalibrating, onCalibrationComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Camera Setup & Calibration</h2>
            <p className="text-xs text-slate-400">Ensure optimal pose tracking accuracy before exercise</p>
          </div>
        </div>

        {/* Setup Guidelines List */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <UserCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Full Body Visibility</h4>
              <p className="text-xs text-slate-400">Stand far enough back so head, shoulders, hips, knees and ankles are in frame.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <Camera className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Camera Angle</h4>
              <p className="text-xs text-slate-400">Position the webcam approximately at chest or waist height.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Adequate Lighting</h4>
              <p className="text-xs text-slate-400">Ensure good front lighting without harsh shadows or bright backlighting.</p>
            </div>
          </div>
        </div>

        {/* Calibration Progress Bar */}
        {isCalibrating && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs text-cyan-300 font-mono">
              <span>Scanning skeleton & joint confidence...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-all"
          >
            Skip Calibration
          </button>
          <button
            onClick={() => {
              setIsCalibrating(true);
              setProgress(0);
            }}
            disabled={isCalibrating}
            className="flex-1 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
          </button>
        </div>
      </div>
    </div>
  );
};
