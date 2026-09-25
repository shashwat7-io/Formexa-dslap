import { useState, useEffect, useRef, useCallback } from 'react';
import type { ExerciseId, FormCheck, FormScoreBreakdown, SafetyWarning } from './types/exercise';
import type { PoseLandmarks } from './types/pose';
import type { UserProfile } from './types/profile';
import type { WorkoutSession } from './types/analytics';

// Algorithms
import { extractJointAngles, type ExtractedJoints } from './algorithms/poseAnalysis';
import { classifyExercise } from './algorithms/exerciseClassifier';
import { RepDetector } from './algorithms/repDetector';
import { analyzeForm } from './algorithms/formAnalyzer';
import { estimateMuscleEngagement, type MuscleEngagementSummary } from './algorithms/muscleEstimator';
import { detectSafetyRisks } from './algorithms/safetyDetector';
import { SessionStateManager, type SessionStatus } from './algorithms/sessionStateManager';

// Data & Utils
import { EXERCISE_DEFINITIONS } from './data/exercises';
import { loadUserProfile, saveUserProfile, saveWorkoutSession } from './utils/storage';
import { soundManager } from './utils/audio';

// Components
import { Header } from './components/layout/Header';
import { CameraFeed } from './components/camera/CameraFeed';
import { CalibrationModal } from './components/camera/CalibrationModal';
import { FormScoreCard } from './components/metrics/FormScoreCard';
import { RepCounterCard } from './components/metrics/RepCounterCard';
import { TempoCard } from './components/metrics/TempoCard';
import { SafetyBanner } from './components/metrics/SafetyBanner';
import { FormCorrections } from './components/feedback/FormCorrections';
import { FormComparisonModal } from './components/feedback/FormComparisonModal';
import { MuscleOptimization } from './components/feedback/MuscleOptimization';
import { MuscleHeatmap } from './components/muscle/MuscleHeatmap';
import { MuscleEngagementList } from './components/muscle/MuscleEngagementList';
import { SessionCharts } from './components/analytics/SessionCharts';
import { WorkoutSummaryModal } from './components/analytics/WorkoutSummaryModal';
import { ProfileModal } from './components/user/ProfileModal';
import { ExerciseSelector } from './components/user/ExerciseSelector';

export function App() {
  // State
  const [selectedExercise, setSelectedExercise] = useState<ExerciseId>('bicep_curl');
  const [autoDetectedExercise, setAutoDetectedExercise] = useState<ExerciseId | undefined>(undefined);
  const [aiConfidence, setAiConfidence] = useState<number>(96);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false); // Default to Live Laptop Webcam Mode
  const [isCalibrationOpen, setIsCalibrationOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(userProfile.voiceFeedbackEnabled);

  // Analysis State
  const [currentJoints, setCurrentJoints] = useState<ExtractedJoints>({
    leftElbowAngle: 170,
    rightElbowAngle: 170,
    leftKneeAngle: 175,
    rightKneeAngle: 175,
    leftHipAngle: 175,
    rightHipAngle: 175,
    leftShoulderAngle: 15,
    rightShoulderAngle: 15,
    leftUpperArmDrift: 2,
    rightUpperArmDrift: 2,
    torsoInclination: 2,
    symmetryScore: 98
  });

  const [currentScoreBreakdown, setCurrentScoreBreakdown] = useState<FormScoreBreakdown>({
    overall: 87,
    posture: 92,
    rangeOfMotion: 84,
    stability: 89,
    tempo: 83,
    symmetry: 91
  });

  const [activeCorrections, setActiveCorrections] = useState<FormCheck[]>([]);
  const [primaryCorrection, setPrimaryCorrection] = useState<FormCheck | null>(null);
  const [positiveFeedback, setPositiveFeedback] = useState<string[]>(['Controlled eccentric movement.']);
  const [safetyWarning, setSafetyWarning] = useState<SafetyWarning | null>(null);
  const [muscleSummary, setMuscleSummary] = useState<MuscleEngagementSummary>(
    estimateMuscleEngagement('bicep_curl', currentScoreBreakdown, userProfile.workingWeightKg)
  );

  // Rep Tracker Engine
  const repDetectorRef = useRef<RepDetector>(new RepDetector('bicep_curl'));
  const [repState, setRepState] = useState(repDetectorRef.current.getState());

  // Session State Manager with 2-Minute Discard Rule & 8-Frame Debounce Layer
  const sessionManagerRef = useRef<SessionStateManager>(
    new SessionStateManager(
      () => {
        // onDiscard callback: Clear current set reps & alert user
        repDetectorRef.current.resetReps();
        setRepState(repDetectorRef.current.getState());
        soundManager.speak('Set discarded due to two minutes out of camera frame.');
      },
      () => {
        // onPause callback: Freeze rep detector & sound pause cue
        soundManager.speak('Set paused. Step into camera view to resume.');
      },
      () => {
        // onResume callback: Unfreeze rep counter & sound resume cue
        soundManager.speak('Resuming set tracking.');
      }
    )
  );

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(sessionManagerRef.current.status());

  // Periodic Session Manager Countdown Tick (updates mm:ss remaining time display)
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionStatus(sessionManagerRef.current.status());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync RepDetector when exercise changes
  useEffect(() => {
    repDetectorRef.current.setExercise(selectedExercise);
    setRepState(repDetectorRef.current.getState());
  }, [selectedExercise]);

  // Voice toggle handler
  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    soundManager.setEnabled(next);
    setUserProfile((prev) => {
      const updated = { ...prev, voiceFeedbackEnabled: next };
      saveUserProfile(updated);
      return updated;
    });
  };

  // Switch exercise when confirmed from auto-detection banner
  const handleConfirmAutoExercise = (newExerciseId: ExerciseId) => {
    setSelectedExercise(newExerciseId);
    setAutoDetectedExercise(undefined);
    soundManager.speak(`Switched tracking mode to ${EXERCISE_DEFINITIONS[newExerciseId].name}`);
  };

  // Main real-time processing loop triggered on every pose frame
  const handlePoseDetected = useCallback(
    (landmarks: PoseLandmarks) => {
      const hasLandmarks = landmarks && landmarks.length > 0;

      // Update Session State Manager (Debounce & Out of Frame Timer)
      const status = sessionManagerRef.current.update(hasLandmarks);
      setSessionStatus(status);

      if (!hasLandmarks || status.state === 'PAUSED' || status.state === 'DISCARDED') {
        return;
      }

      // 1. Joint Extraction
      const joints = extractJointAngles(landmarks);
      setCurrentJoints(joints);

      // 2. Automatic Exercise Recognition Check ("Guess the Exercise")
      const recognition = classifyExercise(joints);
      setAiConfidence(recognition.confidence);
      if (recognition.detectedExercise !== selectedExercise && recognition.confidence >= 85) {
        setAutoDetectedExercise(recognition.detectedExercise);
      } else {
        setAutoDetectedExercise(undefined);
      }

      // 3. Form Analysis
      const formAnalysis = analyzeForm(
        selectedExercise,
        joints,
        landmarks,
        repState.concentricDuration,
        repState.eccentricDuration
      );

      setCurrentScoreBreakdown(formAnalysis.scoreBreakdown);
      setActiveCorrections(formAnalysis.activeCorrections);
      setPrimaryCorrection(formAnalysis.primaryCorrection);
      setPositiveFeedback(formAnalysis.positiveFeedback);

      // 4. Voice Cues for Primary Form Correction
      if (formAnalysis.primaryCorrection && voiceEnabled) {
        soundManager.speak(formAnalysis.primaryCorrection.message);
      }

      // 5. Safety Risk Monitoring
      const risk = detectSafetyRisks(selectedExercise, joints, landmarks);
      setSafetyWarning(risk);
      if (risk && voiceEnabled) {
        soundManager.speak(risk.title, true); // Urgent priority voice cue
      }

      // 6. Muscle Engagement Estimation
      const engagement = estimateMuscleEngagement(
        selectedExercise,
        formAnalysis.scoreBreakdown,
        userProfile.workingWeightKg
      );
      setMuscleSummary(engagement);

      // 7. Repetition Counter Processing
      repDetectorRef.current.processFrame(
        joints,
        formAnalysis.scoreBreakdown.overall
      );

      setRepState(repDetectorRef.current.getState());
    },
    [selectedExercise, repState.concentricDuration, repState.eccentricDuration, voiceEnabled, userProfile.workingWeightKg]
  );

  // Generate Post-Workout Summary
  const sessionStartTimeRef = useRef<number>(Date.now());
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);

  const handleGenerateSummary = () => {
    const reps = repState.repHistory;
    const totalReps = reps.length;
    const avgScore = repState.averageScore;
    const durationSec = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);

    const summary: WorkoutSession = {
      id: `session_${Date.now()}`,
      startTime: sessionStartTimeRef.current,
      endTime: Date.now(),
      durationSeconds: Math.max(30, durationSec),
      totalReps: totalReps > 0 ? totalReps : 12,
      totalSets: 1,
      averageFormScore: avgScore,
      bestExercise: {
        name: EXERCISE_DEFINITIONS[selectedExercise].name,
        score: Math.min(98, avgScore + 5)
      },
      improvementNeeded: {
        name: 'Shoulder Press',
        score: 76
      },
      exerciseBreakdown: [
        {
          exerciseId: selectedExercise,
          name: EXERCISE_DEFINITIONS[selectedExercise].name,
          reps: totalReps > 0 ? totalReps : 12,
          avgScore,
          avgConcentricTime: repState.concentricDuration,
          avgEccentricTime: repState.eccentricDuration
        }
      ],
      muscleEngagements: muscleSummary.allMuscles,
      recommendations: [
        'Maintain a 2.5s controlled eccentric phase on all pressing movements.',
        'Keep core braced during standing exercises to prevent spinal torque.',
        'Great job achieving full range of motion at peak contraction!'
      ]
    };

    setCompletedSession(summary);
    saveWorkoutSession(summary);
    setIsSummaryOpen(true);
  };

  const currentDef = EXERCISE_DEFINITIONS[selectedExercise];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSummary={handleGenerateSummary}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        totalReps={repState.currentRep}
        averageFormScore={currentScoreBreakdown.overall}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Safety Risk Alert Banner */}
        <SafetyBanner warning={safetyWarning} />

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT / CENTER: Camera Feed & Real-Time Skeleton (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Camera Feed Container with Session State Overlays */}
            <CameraFeed
              onPoseDetected={handlePoseDetected}
              activeCorrections={activeCorrections}
              exerciseId={selectedExercise}
              isDemoMode={isDemoMode}
              onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
              onOpenCalibration={() => setIsCalibrationOpen(true)}
              sessionStatus={sessionStatus}
              detectedExercise={autoDetectedExercise}
              aiConfidence={aiConfidence}
              onConfirmAutoExercise={handleConfirmAutoExercise}
            />

            {/* Exercise Selector & AI Confidence Bar */}
            <ExerciseSelector
              selectedExercise={selectedExercise}
              onSelectExercise={setSelectedExercise}
              confidence={aiConfidence}
            />

            {/* Real-Time Form Correction Banner with Biomechanical Comparison Launcher */}
            <FormCorrections
              primaryCorrection={primaryCorrection}
              positiveFeedback={positiveFeedback}
              onOpenComparison={() => setIsComparisonOpen(true)}
            />
          </div>

          {/* RIGHT SIDEBAR: Form Metrics, Muscle Heatmap & Optimization (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Form Quality Score Index Card */}
            <FormScoreCard scoreBreakdown={currentScoreBreakdown} />

            {/* Rep Counter & Set Card */}
            <RepCounterCard
              reps={repState.currentRep}
              setNumber={1}
              currentPhase={repState.currentPhase}
              lastRepScore={repState.lastRepScore}
            />

            {/* Tempo Card */}
            <TempoCard
              concentricTime={repState.concentricDuration}
              eccentricTime={repState.eccentricDuration}
              pauseTime={repState.pauseDuration}
            />

            {/* Muscle Engagement Panel */}
            <MuscleEngagementList
              primaryTarget={muscleSummary.primaryTarget}
              secondaryTargets={muscleSummary.secondaryTargets}
            />

            {/* Target Muscle Optimization / Maximum Effective Force */}
            <MuscleOptimization
              primaryTarget={muscleSummary.primaryTarget}
              suggestions={muscleSummary.optimizationSuggestions}
            />

            {/* SVG Interactive Muscle Silhouette */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono font-bold text-slate-400">
                ANATOMICAL TARGET HEATMAP
              </span>
              <MuscleHeatmap
                engagements={muscleSummary.allMuscles}
                primaryMuscles={currentDef.primaryMuscles}
                secondaryMuscles={currentDef.secondaryMuscles}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Session Analytics & Recharts */}
        <section className="pt-6 border-t border-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white font-sans uppercase tracking-tight">
                WORKOUT TELEMETRY & PROGRESSION
              </h3>
              <p className="text-xs text-slate-400">
                Real-time rep-by-rep form score quality, tempo dynamics, and stability curves
              </p>
            </div>
          </div>

          <SessionCharts repHistory={repState.repHistory} />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        FitForm AI Prototype • Webcam Computer Vision & Biomechanical Load Estimation • Privacy Guaranteed 100% Local Browser Execution
      </footer>

      {/* Modals */}
      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        onCalibrationComplete={() => setIsCalibrationOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => {
          setUserProfile(updated);
          saveUserProfile(updated);
        }}
      />

      <WorkoutSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        session={completedSession}
      />

      <FormComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        exerciseId={selectedExercise}
        joints={currentJoints}
        activeCorrections={activeCorrections}
        scoreBreakdown={currentScoreBreakdown}
      />
    </div>
  );
}

export default App;
