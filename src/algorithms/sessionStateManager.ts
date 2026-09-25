export type SessionState = 'ACTIVE' | 'PAUSED' | 'DISCARDED';

export interface SessionStatus {
  state: SessionState;
  outDurationMs: number;
  remainingMsBeforeDiscard: number | null;
  formattedRemainingTime: string | null;
}

export const OUT_OF_FRAME_DISCARD_MS = 2 * 60 * 1000; // 2 minutes (120,000 ms)
export const DEBOUNCE_FRAME_THRESHOLD = 8; // ~250ms at 30fps

export class SessionStateManager {
  private state: SessionState = 'ACTIVE';
  private outOfFrameSince: number | null = null;
  private consecutiveOutOfFrameFrames: number = 0;
  private consecutiveInFrameFrames: number = 0;

  private onDiscard: () => void;
  private onPause: () => void;
  private onResume: () => void;

  constructor(
    onDiscard: () => void,
    onPause: () => void,
    onResume: () => void
  ) {
    this.onDiscard = onDiscard;
    this.onPause = onPause;
    this.onResume = onResume;
  }

  public update(isInFrame: boolean, now = Date.now()): SessionStatus {
    if (this.state === 'DISCARDED') {
      return this.status(now);
    }

    if (isInFrame) {
      this.consecutiveInFrameFrames++;
      this.consecutiveOutOfFrameFrames = 0;

      // Reset out-of-frame tracking when stably back in frame
      if (this.state === 'PAUSED' && this.consecutiveInFrameFrames >= 3) {
        this.state = 'ACTIVE';
        this.outOfFrameSince = null;
        this.onResume();
      }

      return this.status(now);
    }

    // User is NOT in frame
    this.consecutiveOutOfFrameFrames++;
    this.consecutiveInFrameFrames = 0;

    if (this.state === 'ACTIVE') {
      // Apply Debounce: Only pause after 8 consecutive out-of-frame frames (~250ms)
      if (this.consecutiveOutOfFrameFrames >= DEBOUNCE_FRAME_THRESHOLD) {
        this.state = 'PAUSED';
        this.outOfFrameSince = now;
        this.onPause();
      }
    } else if (this.state === 'PAUSED') {
      const outDuration = now - (this.outOfFrameSince || now);
      if (outDuration >= OUT_OF_FRAME_DISCARD_MS) {
        this.state = 'DISCARDED';
        this.onDiscard();
      }
    }

    return this.status(now);
  }

  public reset(now = Date.now()) {
    this.state = 'ACTIVE';
    this.outOfFrameSince = null;
    this.consecutiveOutOfFrameFrames = 0;
    this.consecutiveInFrameFrames = 0;
    return this.status(now);
  }

  public status(now = Date.now()): SessionStatus {
    const outDurationMs = this.outOfFrameSince ? now - this.outOfFrameSince : 0;
    const remainingMsBeforeDiscard =
      this.state === 'PAUSED'
        ? Math.max(0, OUT_OF_FRAME_DISCARD_MS - outDurationMs)
        : null;

    let formattedRemainingTime: string | null = null;
    if (remainingMsBeforeDiscard !== null) {
      const totalSec = Math.ceil(remainingMsBeforeDiscard / 1000);
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      formattedRemainingTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    return {
      state: this.state,
      outDurationMs,
      remainingMsBeforeDiscard,
      formattedRemainingTime
    };
  }
}
