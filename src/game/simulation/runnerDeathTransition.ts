import type { RunnerRunState } from './state';

// RunnerFallFlat ends at 2.566666 seconds in the exported GLB.
export const RUNNER_DEATH_ANIMATION_MS = 2_567;
export const RUNNER_DEATH_FADE_MS = 450;
export const RUNNER_MENU_FADE_IN_MS = 450;

export type RunnerDeathTransitionPhase = 'none' | 'falling' | 'fading-out' | 'complete' | 'fading-in';

export function runnerDeathTransitionPhase(
  run: Pick<RunnerRunState, 'dead' | 'deathAt' | 'menuReturnAt'>,
  now: number,
): RunnerDeathTransitionPhase {
  if (run.dead && typeof run.deathAt === 'number') {
    const elapsed = Math.max(0, now - run.deathAt);
    if (elapsed < RUNNER_DEATH_ANIMATION_MS) {
      return 'falling';
    }
    if (elapsed < RUNNER_DEATH_ANIMATION_MS + RUNNER_DEATH_FADE_MS) {
      return 'fading-out';
    }
    return 'complete';
  }

  if (
    !run.dead &&
    typeof run.menuReturnAt === 'number' &&
    now - run.menuReturnAt < RUNNER_MENU_FADE_IN_MS
  ) {
    return 'fading-in';
  }

  return 'none';
}
