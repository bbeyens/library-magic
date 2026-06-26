import assert from 'node:assert/strict';
import {
  canQueueSnakeDirection,
  committedSnakeDirection,
  isOppositeSnakeDirection,
  snakeMoveIntervalForSpeedLevel,
} from '../src/game/simulation/snakeRules.ts';

assert.equal(isOppositeSnakeDirection('right', 'left'), true);
assert.equal(isOppositeSnakeDirection('right', 'up'), false);

assert.equal(canQueueSnakeDirection('right', 'right', 'up'), true);
assert.equal(canQueueSnakeDirection('right', 'up', 'left'), false);
assert.equal(canQueueSnakeDirection('right', 'up', 'down'), false);

assert.equal(committedSnakeDirection('right', 'left'), 'right');
assert.equal(committedSnakeDirection('right', 'up'), 'up');

assert.equal(snakeMoveIntervalForSpeedLevel(0), 0.7);
assert.equal(snakeMoveIntervalForSpeedLevel(25), 0.15);
assert.equal(snakeMoveIntervalForSpeedLevel(26), 0.1);
assert.equal(snakeMoveIntervalForSpeedLevel(27), 0.1);

console.log('snakeRules ok');
