import React from 'react';
import type { ExerciseId, FormCheck, FormScoreBreakdown } from '../../types/exercise';
import type { ExtractedJoints } from '../../algorithms/poseAnalysis';
import { EXERCISE_DEFINITIONS } from '../../data/exercises';
import { X, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, Activity } from 'lucide-react';

interface FormComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: ExerciseId;
  joints: ExtractedJoints;
  activeCorrections: FormCheck[];
  scoreBreakdown: FormScoreBreakdown;
}

export const FormComparisonModal: React.FC<FormComparisonModalProps> = ({
  isOpen,
  onClose,
  exerciseId,
  joints,
  activeCorrections,
  scoreBreakdown
}) => {
  if (!isOpen) return null;

  const exercise = EXERCISE_DEFINITIONS[exerciseId];
  const avgElbow = Math.round((joints.leftElbowAngle + joints.rightElbowAngle) / 2);
  const avgKnee = Math.round((joints.leftKneeAngle + joints.rightKneeAngle) / 2);
  const avgHip = Math.round((joints.leftHipAngle + joints.rightHipAngle) / 2);
  const torsoInclination = Math.round(joints.torsoInclination);

  // Biomechanical Angle Comparisons based on Exercise
  const getComparisonData = () => {
    switch (exerciseId) {
      case 'bicep_curl':
        return {
          currentElbow: `${avgElbow}°`,
          idealElbow: '35° - 45°',
          currentUpperArmDrift: `${Math.round((joints.leftUpperArmDrift + joints.rightUpperArmDrift) / 2)}cm`,
          idealUpperArmDrift: '< 5cm (Pinned to ribs)',
          currentTorso: `${torsoInclination}°`,
          idealTorso: '0° - 8° (Vertical)',
          primaryFlaw: activeCorrections.find((c) => c.id === 'elbow_drift')
            ? 'Elbows drifting forward & using momentum'
            : activeCorrections.find((c) => c.id === 'torso_swing')
            ? 'Excessive backward torso swing'
            : 'Slight incomplete peak contraction',
          anatomyImpact:
            'Forward elbow drift shifts load from the bicep brachii to the anterior deltoids and lower back, decreasing bicep peak activation by up to 40%.',
          corrections: [
            'Tuck elbows firmly against your torso throughout the entire movement.',
            'Maintain a strong core brace and avoid leaning back as weight rises.',
            'Squeeze biceps at the top for 1 full second before lowering slowly.'
          ]
        };

      case 'squat':
        return {
          currentElbow: 'N/A',
          idealElbow: 'N/A',
          currentKnee: `${avgKnee}°`,
          idealKnee: '80° - 90° (Parallel to ground)',
          currentTorso: `${torsoInclination}°`,
          idealTorso: '< 30° forward incline',
          primaryFlaw: activeCorrections.find((c) => c.id === 'knee_valgus')
            ? 'Knees caving inward (Valgus collapse)'
            : activeCorrections.find((c) => c.id === 'squat_depth')
            ? 'Incomplete depth (Half squat)'
            : 'Excessive forward chest lean',
          anatomyImpact:
            'Knee valgus increases lateral shear stress on the ACL and patellofemoral joint. Shallow depth prevents full gluteus maximus engagement.',
          corrections: [
            'Push knees outward inline with your middle toes during descent.',
            'Descend until hip crease is parallel with or slightly below knee tops.',
            'Keep chest up and drive through your heels when ascending.'
          ]
        };

      case 'push_up':
        return {
          currentElbow: `${avgElbow}°`,
          idealElbow: '90° (Chest touches floor)',
          currentHip: `${avgHip}°`,
          idealHip: '170° - 180° (Plank line)',
          currentTorso: `${torsoInclination}°`,
          idealTorso: '0° (Horizontal plank)',
          primaryFlaw: activeCorrections.find((c) => c.id === 'pushup_hip_sag')
            ? 'Hips sagging towards the floor'
            : 'Elbows flaring 90° outwards',
          anatomyImpact:
            'Sagging hips strain the lumbar vertebrae. Flaring elbows to 90° subjects shoulder rotators to impaction.',
          corrections: [
            'Squeeze glutes and brace abdominal wall to lock spine straight.',
            'Angle elbows back at 45 degrees relative to torso.',
            'Lower chest all the way down until elbows reach 90 degrees.'
          ]
        };

      default:
        return {
          currentElbow: `${avgElbow}°`,
          idealElbow: 'Optimal joint range',
          currentTorso: `${torsoInclination}°`,
          idealTorso: 'Upright neutral spine',
          primaryFlaw: 'Minor postural variance',
          anatomyImpact: 'Maintain steady tempo and joint control to maximize target muscle recruitment.',
          corrections: [
            'Focus on smooth concentric and eccentric motion.',
            'Keep spine aligned neutral throughout the movement.',
            'Breathe out on exertion and maintain core tension.'
          ]
        };
    };
  };

  const comp = getComparisonData();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-4xl w-full p-6 text-white shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">Biomechanical Form Comparison</h2>
                <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-mono font-semibold">
                  {exercise.name}
                </span>
              </div>
              <p className="text-xs text-slate-400">Side-by-side analysis of your current pose vs gold-standard anatomical target</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Score Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-mono">OVERALL SCORE</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">{scoreBreakdown.overall}%</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-mono">POSTURE</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">{scoreBreakdown.posture}%</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-mono">RANGE OF MOTION</span>
            <div className="text-2xl font-black text-amber-400 font-mono">{scoreBreakdown.rangeOfMotion}%</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-mono">STABILITY</span>
            <div className="text-2xl font-black text-purple-400 font-mono">{scoreBreakdown.stability}%</div>
          </div>
        </div>

        {/* Side-by-Side Visual Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left: Your Current Form */}
          <div className="bg-slate-950/70 border border-rose-500/30 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/20 text-rose-300 border-b border-l border-rose-500/30 text-[11px] font-mono font-bold rounded-bl-xl flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>YOUR CURRENT POSE</span>
            </div>

            <h3 className="text-base font-bold text-rose-300 mb-2">Detected Form & Flaws</h3>
            <p className="text-xs text-slate-300 mb-4 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl font-medium">
              ⚠️ <span className="font-bold">{comp.primaryFlaw}</span>
            </p>

            {/* Skeleton Diagram Box */}
            <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative mb-4 p-3">
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                {/* Visual Skeleton Icon Simulation */}
                <div className="relative w-24 h-32 flex flex-col items-center justify-between">
                  <div className="w-6 h-6 rounded-full border-2 border-rose-400 bg-rose-500/20" />
                  <div className="w-1 h-12 bg-rose-400 rounded" />
                  <div className="flex justify-between w-16">
                    <div className="w-1 h-12 bg-rose-400 transform rotate-12" />
                    <div className="w-1 h-12 bg-rose-400 transform -rotate-12" />
                  </div>
                </div>
                <div className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                  Elbow: {comp.currentElbow} | Torso: {comp.currentTorso}
                </div>
              </div>
            </div>

            {/* Angle Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Elbow Flexion:</span>
                <span className="font-mono text-rose-300 font-bold">{comp.currentElbow}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Torso Swing / Lean:</span>
                <span className="font-mono text-amber-300 font-bold">{comp.currentTorso}</span>
              </div>
              {comp.currentUpperArmDrift && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Upper Arm Drift:</span>
                  <span className="font-mono text-rose-300 font-bold">{comp.currentUpperArmDrift}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Correct Target Form */}
          <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 border-b border-l border-emerald-500/30 text-[11px] font-mono font-bold rounded-bl-xl flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>GOLD STANDARD FORM</span>
            </div>

            <h3 className="text-base font-bold text-emerald-300 mb-2">Ideal Anatomical Target</h3>
            <p className="text-xs text-slate-300 mb-4 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl font-medium">
              ✓ <span className="font-bold text-emerald-200">Strict Joint Isolation & Spine Alignment</span>
            </p>

            {/* Skeleton Diagram Box */}
            <div className="h-44 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative mb-4 p-3">
              <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
                <div className="relative w-24 h-32 flex flex-col items-center justify-between">
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-400 bg-emerald-500/20" />
                  <div className="w-1 h-12 bg-emerald-400 rounded" />
                  <div className="flex justify-between w-14">
                    <div className="w-1 h-12 bg-emerald-400" />
                    <div className="w-1 h-12 bg-emerald-400" />
                  </div>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Ideal Elbow: {comp.idealElbow} | Ideal Torso: {comp.idealTorso}
                </div>
              </div>
            </div>

            {/* Target Angle Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Target Flexion:</span>
                <span className="font-mono text-emerald-300 font-bold">{comp.idealElbow}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Target Torso Incline:</span>
                <span className="font-mono text-emerald-300 font-bold">{comp.idealTorso}</span>
              </div>
              {comp.idealUpperArmDrift && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Target Arm Position:</span>
                  <span className="font-mono text-emerald-300 font-bold">{comp.idealUpperArmDrift}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Biomechanical Explanation & How To Correct */}
        <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-5 mb-6 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Biomechanical Explanation & Anatomical Impact</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            {comp.anatomyImpact}
          </p>

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Step-by-Step Posture Correction Checklist:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {comp.corrections.map((step, idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-start space-x-2.5">
                  <span className="w-5 h-5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full flex items-center justify-center text-[11px] font-mono font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-emerald-300 transition-all flex items-center space-x-2"
          >
            <span>Apply Correction & Resume Workout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
