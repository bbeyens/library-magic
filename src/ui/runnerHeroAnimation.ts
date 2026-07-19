import type { RunnerRunState } from '../game/simulation/state';

/** Playback speed-up for the one-shot pain gesture — a snappier hit reaction. */
export const RUNNER_INJURED_ANIMATION_SPEED = 1.7;
/** Window for the sped-up pain gesture (~2.27s clip / 1.7 ≈ 1.33s) so it still plays through once. */
export const RUNNER_INJURED_ANIMATION_MS = 1_400;
/** Matches the joyful-jump clip length (~0.97s) so the one-shot bonus reaction plays in full. */
export const RUNNER_JUMP_ANIMATION_MS = 1_000;
const RUNNER_LATERAL_MOVEMENT_EPSILON = 0.0005;

export type RunnerLateralDirection = 'idle' | 'left' | 'right';
export type RunnerGameplayAnimationState =
  | 'standardRun'
  | 'injuredRun'
  | 'fallFlat'
  | 'strafeLeft'
  | 'strafeRight'
  | 'shooting'
  | 'jump';

export function runnerPointerTargetX(
  clientX: number,
  boundsLeft: number,
  boundsWidth: number,
  laneHalfWidth: number,
): number {
  const safeWidth = Math.max(1, boundsWidth);
  const ratio = Math.min(1, Math.max(0, (clientX - boundsLeft) / safeWidth));
  const target = -(ratio * 2 - 1) * laneHalfWidth;
  return target === 0 ? 0 : target;
}

export function runnerInPlaceRootTrackValues(
  values: ArrayLike<number>,
  anchor: readonly [number, number, number],
): Float32Array {
  const normalized = new Float32Array(values.length);
  const firstY = Number(values[1] ?? anchor[1]);
  for (let index = 0; index + 2 < values.length; index += 3) {
    normalized[index] = anchor[0];
    normalized[index + 1] = anchor[1] + Number(values[index + 1] ?? firstY) - firstY;
    normalized[index + 2] = anchor[2];
  }
  return normalized;
}

export function runnerGroundCorrectionY(
  boundsMinY: number,
  targetGroundY: number,
  parentWorldScaleY: number,
): number {
  const safeScale = Math.max(0.0001, Math.abs(parentWorldScaleY));
  return (targetGroundY - boundsMinY) / safeScale;
}

export function runnerGameplayAnimationState(
  run: Pick<RunnerRunState, 'dead' | 'lastDamageAt'>,
  now: number,
): RunnerGameplayAnimationState {
  if (run.dead) {
    return 'fallFlat';
  }
  if (run.lastDamageAt !== null && now - run.lastDamageAt < RUNNER_INJURED_ANIMATION_MS) {
    return 'injuredRun';
  }
  return 'standardRun';
}

/** The play camera mirrors world X: positive X is screen-left and negative X is screen-right. */
export function runnerFoxLateralDirection(playerX: number, targetPlayerX: number): RunnerLateralDirection {
  const movement = targetPlayerX - playerX;
  if (Math.abs(movement) <= RUNNER_LATERAL_MOVEMENT_EPSILON) {
    return 'idle';
  }
  return movement > 0 ? 'left' : 'right';
}

export function runnerFoxGameplayAnimationState(
  run: Pick<RunnerRunState, 'dead' | 'lastDamageAt' | 'lastBoostAt'>,
  now: number,
  lateralDirection: RunnerLateralDirection,
): RunnerGameplayAnimationState {
  const priorityState = runnerGameplayAnimationState(run, now);
  if (priorityState !== 'standardRun') {
    // Dead -> fall, recently hit -> one-shot pain gesture.
    return priorityState;
  }
  // Just grabbed a bonus (portal/gate): a one-shot joyful jump, overriding strafe/shooting.
  if (run.lastBoostAt !== null && now - run.lastBoostAt < RUNNER_JUMP_ANIMATION_MS) {
    return 'jump';
  }
  if (lateralDirection === 'left') {
    return 'strafeLeft';
  }
  if (lateralDirection === 'right') {
    return 'strafeRight';
  }
  // Idle (standing still): the fox plays the shooting animation, phase-locked to its fire cadence.
  return 'shooting';
}

/**
 * Time (seconds) to sample the looping shooting clip at, so its recoil "bump" lands on each shot and
 * the loop speeds up with the fire rate. `fireCooldown` counts down from `1/fireRate` to 0 between
 * shots, so `1 - fireCooldown/interval` is the fraction through the current shot cycle.
 */
export function runnerShootingClipTime(
  fireCooldown: number,
  fireRate: number,
  clipDuration: number,
  bumpFraction: number,
): number {
  const interval = 1 / Math.max(0.1, fireRate);
  const cyclePhase = Math.min(1, Math.max(0, 1 - fireCooldown / interval));
  const phase = (bumpFraction + cyclePhase) % 1;
  return phase * Math.max(0.001, clipDuration);
}
