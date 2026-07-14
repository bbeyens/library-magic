import assert from 'node:assert/strict';
import {
  applyAction,
  snakeFoodCapacity,
  snakeGrowthFoodRequirement,
  snakeSkillCost,
  snakeTotalMultiplier,
  tickState,
} from '../src/game/simulation/actions.ts';
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
scoreFoodState.snake.foods = [];
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
multiplierFoodState.snake.foods = [];
multiplierFoodState.snake.bonusFood = { type: 'diamond-pink', cell: { x: 2, y: 1 } };
const multiplierFoodScalesBefore = multiplierFoodState.resources.scales;
tickState(multiplierFoodState, 1000);
assert.equal(multiplierFoodState.snake.score, 0);
assert.equal(multiplierFoodState.resources.scales, multiplierFoodScalesBefore);
assert.equal(multiplierFoodState.snake.comboSteps, 10);
assert.equal(snakeTotalMultiplier(multiplierFoodState), 2);

const snakeUpgradeCostState = createInitialState();
const speedCost = snakeSkillCost(snakeUpgradeCostState, 'speed');
snakeUpgradeCostState.mana = speedCost * 10;
snakeUpgradeCostState.resources.scales = speedCost - 1;
applyAction(snakeUpgradeCostState, { type: 'buySnakeSkill', skillId: 'speed' });
assert.equal(snakeUpgradeCostState.snakeSkills.speed, 0);
assert.equal(snakeUpgradeCostState.mana, speedCost * 10);

snakeUpgradeCostState.resources.scales = speedCost;
applyAction(snakeUpgradeCostState, { type: 'buySnakeSkill', skillId: 'speed' });
assert.equal(snakeUpgradeCostState.snakeSkills.speed, 1);
assert.equal(snakeUpgradeCostState.resources.scales, 0);
assert.equal(snakeUpgradeCostState.mana, speedCost * 10);

const foodCapacityState = createInitialState();
assert.equal(foodCapacityState.snake.foods.length, 1);
foodCapacityState.resources.scales = 1_000_000_000;
for (let level = 1; level <= 9; level += 1) {
  applyAction(foodCapacityState, { type: 'buySnakeSkill', skillId: 'foodCount' });
  assert.equal(foodCapacityState.snakeSkills.foodCount, level);
  assert.equal(foodCapacityState.snake.foods.length, level + 1);
}
assert.equal(new Set(foodCapacityState.snake.foods.map(({ x, y }) => `${x}:${y}`)).size, 10);
assert.equal(
  foodCapacityState.snake.foods.some((food) =>
    foodCapacityState.snake.body.some((segment) => segment.x === food.x && segment.y === food.y),
  ),
  false,
);

const delayedGrowthState = createInitialState();
delayedGrowthState.lastTick = 0;
delayedGrowthState.books.serpent.unlocked = true;
delayedGrowthState.openBookPanels = [{ bookId: 'serpent', slot: 0 }];
delayedGrowthState.snakeSkills.growthThreshold = 1;
delayedGrowthState.snake.body = [
  { x: 1, y: 1 },
  { x: 0, y: 1 },
];
delayedGrowthState.snake.direction = 'right';
delayedGrowthState.snake.nextDirection = 'right';
delayedGrowthState.snake.foods = [{ x: 2, y: 1 }];
delayedGrowthState.snake.bonusFood = null;
tickState(delayedGrowthState, 1000);
assert.equal(delayedGrowthState.snake.body.length, 2);
assert.equal(delayedGrowthState.snake.foodsEatenTowardGrowth, 1);

delayedGrowthState.snake.foods = [{ x: 3, y: 1 }];
tickState(delayedGrowthState, 2000);
assert.equal(delayedGrowthState.snake.body.length, 3);
assert.equal(delayedGrowthState.snake.foodsEatenTowardGrowth, 0);

const maxGrowthState = createInitialState();
assert.equal(snakeFoodCapacity(maxGrowthState), 1);
assert.equal(snakeGrowthFoodRequirement(maxGrowthState), 1);
maxGrowthState.snakeSkills.foodCount = 99;
maxGrowthState.snakeSkills.growthThreshold = 99;
assert.equal(snakeFoodCapacity(maxGrowthState), 10);
assert.equal(snakeGrowthFoodRequirement(maxGrowthState), 3);

maxGrowthState.lastTick = 0;
maxGrowthState.books.serpent.unlocked = true;
maxGrowthState.openBookPanels = [{ bookId: 'serpent', slot: 0 }];
maxGrowthState.snake.body = [
  { x: 0, y: 1 },
  { x: 0, y: 2 },
];
maxGrowthState.snake.direction = 'right';
maxGrowthState.snake.nextDirection = 'right';
maxGrowthState.snake.bonusFood = null;
for (let step = 1; step <= 3; step += 1) {
  maxGrowthState.snake.foods = [{ x: step, y: 1 }];
  tickState(maxGrowthState, step * 1000);
  assert.equal(maxGrowthState.snake.body.length, step < 3 ? 2 : 3);
  assert.equal(maxGrowthState.snake.foodsEatenTowardGrowth, step < 3 ? step : 0);
}

console.log('snakeRules ok');
