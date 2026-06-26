import assert from 'node:assert/strict';
import {
  HUNDRED_TARGET_MIN,
  hundredOptionRange,
  hundredReward,
  hundredTargetMax,
  rollHundredOption,
} from '../src/game/simulation/hundredRules.ts';

assert.equal(HUNDRED_TARGET_MIN, 100);
assert.equal(hundredTargetMax(1), 100);
assert.equal(hundredTargetMax(4), 103);

assert.deepEqual(hundredOptionRange('A', 1), { min: 2, max: 4 });
assert.deepEqual(hundredOptionRange('B', 1), { min: 10, max: 20 });
assert.deepEqual(hundredOptionRange('C', 1), { min: 30, max: 60 });
assert.deepEqual(hundredOptionRange('D', 1), { min: 50, max: 100 });

const baseDRange = hundredOptionRange('D', 1);
const upgradedDRange = hundredOptionRange('D', 10);
assert.ok(upgradedDRange.min > baseDRange.min);
assert.ok(upgradedDRange.max < baseDRange.max);
assert.equal(rollHundredOption('B', 1, () => 0), 10);
assert.equal(rollHundredOption('B', 1, () => 0.999), 20);
assert.equal(hundredReward(1, 100), 3);
assert.equal(hundredReward(5, 102), 9);

console.log('hundredRules ok');
