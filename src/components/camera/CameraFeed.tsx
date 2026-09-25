import React, { useEffect, useRef, useState } from 'react';
import type { PoseLandmarks } from '../../types/pose';
import { PoseOverlay } from './PoseOverlay';
import type { FormCheck, ExerciseId } from '../../types/exercise';
import { PoseSimulator, type SimulationPreset } from '../../algorithms/simulator';
import type { SessionStatus } from '../../algorithms/sessionStateManager';
import { EXERCISE_DEFINITIONS } from '../../data/exercises';
import {
  Camera,
  RefreshCw,
  ShieldCheck,
  PlayCircle,
  Video,
  AlertCircle,
  Pause,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface CameraFeedProps {
  onPoseDetected: (landmarks: PoseLandmarks, fps: number, confidence: number) => void;
  activeCorrections: FormCheck[];
  exerciseId: ExerciseId;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenCalibration: () => void;
  sessionStatus: SessionStatus;
  detectedExercise?: ExerciseId;
  aiConfidence?: number;
  onConfirmAutoExercise?: (exerciseId: ExerciseId) => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  onPoseDetected,
  activeCorrections,
  exerciseId,
  isDemoMode,
  onToggleDemoMode,
  onOpenCalibration,
  sessionStatus,
  detectedExercise,
  aiConfidence = 96,
  onConfirmAutoExercise
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentLandmarks, setCurrentLandmarks] = useState<PoseLandmarks | null>(null);
  const [fps, setFps] = useState<number>(30);
  const [activePreset, setActivePreset] = useState<SimulationPreset>('PERFECT');

  const simulatorRef = useRef<PoseSimulator>(new PoseSimulator(exerciseId));
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);

  useEffect(() => {
    simulatorRef.current.setExercise(exerciseId);
  }, [exerciseId]);

  useEffect(() => {
    simulatorRef.current.setPreset(activePreset);
  }, [activePreset]);

  // Handle Demo Mode / Procedural Simulation Loop
  useEffect(() => {
    if (isDemoMode) {
      let isMounted = true;

      const loop = () => {
        if (!isMounted) return;

        const lms = simulatorRef.current.generateFrame();
        setCurrentLandmarks(lms);

        // Calculate FPS
        const now = performance.now();
        frameCountRef.current++;
        if (now - lastTimeRef.current >= 1000) {
          setFps(Math.min(60, frameCountRef.current));
          frameCountRef.current = 0;
          lastTimeRef.current = now;
        }

        onPoseDetected(lms, 30, 96);
        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);

      return () => {
        isMounted = false;
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };
    }
  }, [isDemoMode, exerciseId, onPoseDetected]);

  // Request & Start Laptop Webcam Stream
  const startWebcam = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraPermission('granted');
      }
    } catch (err: any) {
      console.warn('Webcam permission error or denied:', err);
      setCameraPermission('denied');
      setCameraError(err.message || 'Camera permission denied. Click below to allow camera or use Demo Simulation.');
    }
  };

  useEffect(() => {
    if (!isDemoMode) {
      startWebcam();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isDemoMode]);

  const showAutoDetectBanner =
    detectedExercise &&
    detectedExercise !== exerciseId &&
    EXERCISE_DEFINITIONS[detectedExercise] &&
    onConfirmAutoExercise;

  return (
    <div className="relative w-full h-[480px] lg:h-[580px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-950/40 group">
      {/* ALWAYS RENDER VIDEO TAG */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transform -scale-x-100 ${
          !isDemoMode && cameraPermission === 'granted' ? 'block' : 'hidden'
        } ${sessionStatus.state === 'PAUSED' ? 'brightness-50 blur-[2px]' : ''}`}
        autoPlay
        playsInline
        muted
      />

      {/* Fallback Placeholder or Permission Prompt */}
      {(isDemoMode || cameraPermission !== 'granted') && (
        <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 flex flex-col items-center justify-center relative p-6 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#082f49_1px,transparent_1px),linear-gradient(to_bottom,#082f49_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          {!isDemoMode && cameraPermission !== 'granted' && (
            <div className="relative z-10 max-w-md bg-slate-900/90 border border-cyan-500/40 p-6 rounded-2xl shadow-2xl space-y-4 backdrop-blur-md">
              <div className="p-3.5 bg-cyan-500/20 rounded-2xl border border-cyan-500/40 w-fit mx-auto text-cyan-400">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Enable Laptop Camera Access</h3>
              <p className="text-xs text-slate-300">
                FitForm AI uses your camera feed to track your body landmarks in real-time locally in your browser.
              </p>
              {cameraError && (
                <div className="p-2.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{cameraError}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={startWebcam}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Turn On Camera</span>
                </button>
                <button
                  onClick={onToggleDemoMode}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all"
                >
                  Use Demo Mode
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas Skeleton Overlay */}
      <PoseOverlay
        landmarks={currentLandmarks}
        width={640}
        height={480}
        activeCorrections={activeCorrections}
        fps={fps}
        confidence={aiConfidence}
      />

      {/* Out of Frame PAUSED Glassmorphic Overlay with 2-Minute Discard Countdown */}
      {sessionStatus.state === 'PAUSED' && (
        <div className="absolute inset-0 z-30 bg-slate-950/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in">
          <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 animate-pulse">
            <Pause className="w-10 h-10" />
          </div>

          <div className="space-y-1 max-w-sm">
            <h3 className="text-xl font-black text-white uppercase tracking-wide">Workout Set Paused</h3>
            <p className="text-xs text-slate-300">
              You stepped out of camera view. Rep counting is frozen. Step back into frame to automatically resume.
            </p>
          </div>

          {/* Countdown Timer Badge */}
          <div className="bg-slate-900/90 border border-amber-500/30 px-5 py-3 rounded-2xl flex items-center space-x-3 shadow-xl">
            <Clock className="w-5 h-5 text-amber-400 animate-spin" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Set Discard Countdown</span>
              <span className="text-xl font-black font-mono text-amber-300">
                {sessionStatus.formattedRemainingTime || '02:00'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Out of Frame DISCARDED Overlay */}
      {sessionStatus.state === 'DISCARDED' && (
        <div className="absolute inset-0 z-30 bg-rose-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-full text-rose-400">
            <Trash2 className="w-10 h-10" />
          </div>

          <div className="space-y-1 max-w-sm">
            <h3 className="text-xl font-black text-white uppercase tracking-wide">Set Discarded</h3>
            <p className="text-xs text-rose-200">
              You were out of camera frame for over 2 minutes. Current set reps have been reset. Step into view to begin a fresh set.
            </p>
          </div>
        </div>
      )}

      {/* AI Auto-Guessed Exercise Detection Banner */}
      {showAutoDetectBanner && sessionStatus.state === 'ACTIVE' && (
        <div className="absolute top-16 left-4 right-4 z-20 bg-slate-900/95 border border-cyan-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center justify-between space-x-3 animate-bounce-short">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300 border border-cyan-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-cyan-400 font-mono font-bold block uppercase tracking-wider">
                AI Exercise Guess ({aiConfidence}%)
              </span>
              <span className="text-xs font-bold text-white">
                Detected: {EXERCISE_DEFINITIONS[detectedExercise!].name}
              </span>
            </div>
          </div>

          <button
            onClick={() => onConfirmAutoExercise(detectedExercise!)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold rounded-lg text-xs hover:from-cyan-400 hover:to-emerald-300 transition-all shadow-md flex items-center space-x-1 shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Switch to {EXERCISE_DEFINITIONS[detectedExercise!].name}</span>
          </button>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
        <button
          onClick={onOpenCalibration}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-cyan-300 rounded-lg border border-cyan-500/30 backdrop-blur-md transition-all shadow-md"
        >
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Calibrate Camera</span>
        </button>

        <button
          onClick={onToggleDemoMode}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border backdrop-blur-md transition-all shadow-md ${
            !isDemoMode
              ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-emerald-900/40'
              : 'bg-purple-600/80 hover:bg-purple-500 text-white border-purple-400/50'
          }`}
        >
          {isDemoMode ? (
            <>
              <Video className="w-3.5 h-3.5 text-emerald-300" />
              <span>Use Live Laptop Camera</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-300" />
              <span>Switch to Demo Simulation</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Simulation Preset Controls (Visible in Demo Mode) */}
      {isDemoMode && (
        <div className="absolute bottom-12 left-4 right-4 flex items-center space-x-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-purple-500/30 shadow-lg z-20 overflow-x-auto">
          <span className="text-[11px] font-mono font-bold text-purple-300 shrink-0 px-2 flex items-center space-x-1">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>TEST SIMULATION:</span>
          </span>

          <div className="flex space-x-1.5 text-xs">
            <button
              onClick={() => setActivePreset('PERFECT')}
              className={`px-2.5 py-1 rounded-lg border font-mono transition-all ${
                activePreset === 'PERFECT'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ✓ Perfect Form
            </button>

            <button
              onClick={() => setActivePreset('ELBOW_DRIFT')}
              className={`px-2.5 py-1 rounded-lg border font-mono transition-all ${
                activePreset === 'ELBOW_DRIFT'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚠️ Elbow Drift
            </button>

            <button
              onClick={() => setActivePreset('KNEE_VALGUS')}
              className={`px-2.5 py-1 rounded-lg border font-mono transition-all ${
                activePreset === 'KNEE_VALGUS'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚠️ Knee Valgus
            </button>

            <button
              onClick={() => setActivePreset('SPINAL_FLEXION')}
              className={`px-2.5 py-1 rounded-lg border font-mono transition-all ${
                activePreset === 'SPINAL_FLEXION'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚠️ Spinal Flexion
            </button>

            <button
              onClick={() => setActivePreset('TORSO_SWING')}
              className={`px-2.5 py-1 rounded-lg border font-mono transition-all ${
                activePreset === 'TORSO_SWING'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              ⚠️ Torso Swing
            </button>
          </div>
        </div>
      )}

      {/* Bottom Privacy & Framing Badge */}
      <div className="absolute bottom-3 left-4 flex items-center space-x-2 bg-slate-950/70 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-md text-[11px] text-slate-400 z-10">
        <Camera className="w-3.5 h-3.5 text-emerald-400" />
        <span>Your camera feed is processed 100% locally in your browser.</span>
      </div>
    </div>
  );
};
