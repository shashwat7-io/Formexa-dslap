import React, { useEffect, useRef } from 'react';
import type { PoseLandmarks } from '../../types/pose';
import { SKELETON_CONNECTIONS, POSE_LANDMARKS } from '../../algorithms/poseAnalysis';
import type { FormCheck } from '../../types/exercise';

interface PoseOverlayProps {
  landmarks: PoseLandmarks | null;
  width: number;
  height: number;
  activeCorrections: FormCheck[];
  fps: number;
  confidence: number;
}

export const PoseOverlay: React.FC<PoseOverlayProps> = ({
  landmarks,
  width,
  height,
  activeCorrections,
  fps,
  confidence
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (!landmarks || landmarks.length === 0) return;

    // Extract target joints causing form faults to highlight in red
    const faultJoints = new Set<number>();
    activeCorrections.forEach((c) => {
      if (c.status === 'FAULT' && c.targetJoints) {
        c.targetJoints.forEach((j) => faultJoints.add(j));
      }
    });

    // 1. Draw Skeleton Bones
    ctx.lineWidth = 4;
    SKELETON_CONNECTIONS.forEach((connection) => {
      const p1 = landmarks[connection.from];
      const p2 = landmarks[connection.to];

      if (p1 && p2 && (p1.visibility ?? 1) > 0.4 && (p2.visibility ?? 1) > 0.4) {
        const x1 = p1.x * width;
        const y1 = p1.y * height;
        const x2 = p2.x * width;
        const y2 = p2.y * height;

        const isFaultBone = faultJoints.has(connection.from) || faultJoints.has(connection.to);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        // Neon line glow
        ctx.shadowBlur = isFaultBone ? 14 : 8;
        ctx.shadowColor = isFaultBone ? '#f43f5e' : '#00f6ff';
        ctx.strokeStyle = isFaultBone ? 'rgba(244, 63, 94, 0.95)' : 'rgba(0, 246, 255, 0.85)';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // 2. Draw Landmark Joints & Pulsing Fault Target Rings
    landmarks.forEach((lm, index) => {
      if (!lm || (lm.visibility ?? 1) < 0.4) return;
      const x = lm.x * width;
      const y = lm.y * height;

      const isFault = faultJoints.has(index);

      if (isFault) {
        // Pulsing target aura ring directly on body joint
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(x, y, isFault ? 9 : 6, 0, 2 * Math.PI);
      ctx.fillStyle = isFault ? '#f43f5e' : '#05ffa1';
      ctx.shadowBlur = 10;
      ctx.shadowColor = isFault ? '#f43f5e' : '#05ffa1';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner white core
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    // 3. Render On-Body Callout Badges for Active Corrections
    activeCorrections.forEach((correction) => {
      if (correction.targetJoints && correction.targetJoints.length > 0) {
        const targetIdx = correction.targetJoints[0];
        const targetLm = landmarks[targetIdx];

        if (targetLm && (targetLm.visibility ?? 1) > 0.4) {
          const tx = targetLm.x * width;
          const ty = targetLm.y * height;

          const isFault = correction.status === 'FAULT';
          const badgeText = `⚠️ ${correction.name.toUpperCase()}: ${correction.message}`;

          ctx.font = 'bold 12px JetBrains Mono';
          const textWidth = ctx.measureText(badgeText).width;

          // Draw Badge Background
          ctx.fillStyle = isFault ? 'rgba(159, 18, 57, 0.95)' : 'rgba(120, 53, 15, 0.95)';
          ctx.fillRect(tx + 14, ty - 14, textWidth + 16, 26);

          ctx.strokeStyle = isFault ? '#f43f5e' : '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(tx + 14, ty - 14, textWidth + 16, 26);

          // Draw Badge Text
          ctx.fillStyle = '#ffffff';
          ctx.fillText(badgeText, tx + 22, ty + 3);

          // Draw vector correction arrow if elbow drift
          if (correction.id === 'elbow_drift') {
            const hipLm = landmarks[POSE_LANDMARKS.RIGHT_HIP] || landmarks[POSE_LANDMARKS.LEFT_HIP];
            if (hipLm) {
              const hx = hipLm.x * width;
              ctx.beginPath();
              ctx.moveTo(tx, ty);
              ctx.lineTo(hx, ty);
              ctx.lineWidth = 3;
              ctx.strokeStyle = '#fb7185';
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(hx, ty, 4, 0, Math.PI * 2);
              ctx.fillStyle = '#f43f5e';
              ctx.fill();
            }
          }
        }
      }
    });
  }, [landmarks, width, height, activeCorrections]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full object-cover transform -scale-x-100"
      />
      {/* Top Left HUD Overlay */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 bg-black/70 backdrop-blur-md border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-cyan-300 shadow-xl z-20">
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE MEDIAPIPE POSE</span>
        </span>
        <span className="text-gray-500">|</span>
        <span>{fps} FPS</span>
        <span className="text-gray-500">|</span>
        <span>CONF: {confidence}%</span>
      </div>
    </div>
  );
};
