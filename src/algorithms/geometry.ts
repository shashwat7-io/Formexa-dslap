import type { Landmark } from '../types/pose';

/**
 * Calculates the angle in degrees between three points: A (first), B (vertex), C (end).
 */
export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  if (!a || !b || !c) return 0;

  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360.0 - angle;
  }

  return Math.round(angle * 10) / 10;
}

/**
 * Calculates 2D Euclidean distance between two landmarks.
 */
export function calculateDistance(a: Landmark, b: Landmark): number {
  if (!a || !b) return 0;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the vertical inclination angle of a line relative to vertical Y-axis.
 */
export function calculateVerticalAngle(p1: Landmark, p2: Landmark): number {
  if (!p1 || !p2) return 0;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const angleRad = Math.atan2(Math.abs(dx), Math.abs(dy));
  return Math.round(((angleRad * 180) / Math.PI) * 10) / 10;
}

/**
 * Simple Exponential Moving Average (EMA) smoother for pose angles.
 */
export class AngleSmoother {
  private alpha: number;
  private previousValue: number | null = null;

  constructor(alpha: number = 0.35) {
    this.alpha = alpha;
  }

  smooth(newValue: number): number {
    if (this.previousValue === null) {
      this.previousValue = newValue;
      return newValue;
    }
    const smoothed = this.alpha * newValue + (1 - this.alpha) * this.previousValue;
    this.previousValue = smoothed;
    return Math.round(smoothed * 10) / 10;
  }

  reset() {
    this.previousValue = null;
  }
}
