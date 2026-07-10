import assert from 'node:assert/strict';
import { snakeTotalMultiplier, tickState } from '../src/game/simulation/actions.ts';
import {
  canQueueSnakeDirection,
  committedSnakeDirection,
  isOppositeSnakeDirection,
  snakeMoveIntervalForSpeedLevel,
} from '../src/game/simulation/snakeRules.ts';
import { createInitialState, randomSnakeFood } from '../src/game/simulation/state.ts';

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

assert.deepEqual(
  randomSnakeFood(
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    2,
  ),
  { x: 1, y: 0 },
);
assert.equal(
  randomSnakeFood(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    2,
  ),
  null,
);

const scoreFoodState = createInitialState();
scoreFoodState.lastTick = 0;
scoreFoodState.books.serpent.unlocked = true;
scoreFoodState.openBookPanels = [{ bookId: 'serpent', slot: 0 }];
scoreFoodState.snake.body = [
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];
scoreFoodState.snake.direction = 'right';
scoreFoodState.snake.nextDirection = 'right';
scoreFoodState.snake.food = null;
scoreFoodState.snake.bonusFood = { type: 'round-blue', cell: { x: 2, y: 1 } };
const scoreFoodScalesBefore = scoreFoodState.resources.scales;
tickState(scoreFoodState, 1000);
assert.equal(scoreFoodState.snake.score > 0, true);
assert.equal(scoreFoodState.resources.scales > scoreFoodScalesBefore, true);
assert.equal(scoreFoodState.snake.comboSteps, 1);

const multiplierFoodState = createInitialState();
multiplierFoodState.lastTick = 0;
multiplierFoodState.books.serpent.unlocked = true;
multiplierFoodState.openBookPanels = [{ bookId: 'serpent', slot: 0 }];
multiplierFoodState.snake.body = [
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];
multiplierFoodState.snake.direction = 'right';
multiplierFoodState.snake.nextDirection = 'right';
multiplierFoodState.snake.food = null;
multiplierFoodState.snake.bonusFood = { type: 'diamond-pink', cell: { x: 2, y: 1 } };
const multiplierFoodScalesBefore = multiplierFoodState.resources.scales;
tickState(multiplierFoodState, 1000);
assert.equal(multiplierFoodState.snake.score, 0);
assert.equal(multiplierFoodState.resources.scales, multiplierFoodScalesBefore);
assert.equal(multiplierFoodState.snake.comboSteps, 10);
assert.equal(snakeTotalMultiplier(multiplierFoodState), 2);

console.log('snakeRules ok');
