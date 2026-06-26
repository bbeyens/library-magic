export type SnakeRuleDirection = 'up' | 'right' | 'down' | 'left';

const SNAKE_SPEED_LEGACY_CAP_LEVEL = 25;
const SNAKE_SPEED_LEGACY_MIN_INTERVAL = 0.15;
const SNAKE_SPEED_MIN_INTERVAL = 0.1;

export function snakeMoveIntervalForSpeedLevel(speedLevel: number): number {
  const legacyInterval = Math.max(
    SNAKE_SPEED_LEGACY_MIN_INTERVAL,
    0.7 - Math.min(speedLevel, SNAKE_SPEED_LEGACY_CAP_LEVEL) * 0.022,
  );
  if (speedLevel <= SNAKE_SPEED_LEGACY_CAP_LEVEL) {
    return roundSnakeInterval(legacyInterval);
  }
  return roundSnakeInterval(
    Math.max(SNAKE_SPEED_MIN_INTERVAL, legacyInterval - (speedLevel - SNAKE_SPEED_LEGACY_CAP_LEVEL) * 0.05),
  );
}

function roundSnakeInterval(interval: number): number {
  return Math.round(interval * 100) / 100;
}

export function isOppositeSnakeDirection(current: SnakeRuleDirection, next: SnakeRuleDirection): boolean {
  return (
    (current === 'up' && next === 'down') ||
    (current === 'down' && next === 'up') ||
    (current === 'left' && next === 'right') ||
    (current === 'right' && next === 'left')
  );
}

export function canQueueSnakeDirection(
  currentDirection: SnakeRuleDirection,
  queuedDirection: SnakeRuleDirection,
  requestedDirection: SnakeRuleDirection,
): boolean {
  return (
    !isOppositeSnakeDirection(currentDirection, requestedDirection) &&
    !isOppositeSnakeDirection(queuedDirection, requestedDirection)
  );
}

export function committedSnakeDirection(
  currentDirection: SnakeRuleDirection,
  queuedDirection: SnakeRuleDirection,
): SnakeRuleDirection {
  return isOppositeSnakeDirection(currentDirection, queuedDirection) ? currentDirection : queuedDirection;
}
