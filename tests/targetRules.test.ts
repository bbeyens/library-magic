import assert from 'node:assert/strict';
import {
  targetAttackDamage,
  targetAutomationInterval,
  targetMaxActiveTargets,
  targetReward,
  targetSpawnInterval,
} from '../src/game/simulation/targetRules.ts';

assert.equal(targetSpawnInterval(0), 1.4);
assert.equal(targetSpawnInterval(4), 1);
assert.equal(targetSpawnInterval(20), 0.4);

assert.equal(targetMaxActiveTargets(0), 1);
assert.equal(targetMaxActiveTargets(3), 4);
assert.equal(targetMaxActiveTargets(10), 6);

assert.equal(targetAttackDamage(0), 1);
assert.equal(targetAttackDamage(3), 4);

assert.equal(targetAutomationInterval(0), 0);
assert.equal(targetAutomationInterval(1), 2.2);
assert.equal(targetAutomationInterval(10), 0.85);

assert.equal(targetReward(1, 1), 2);
assert.equal(targetReward(5, 3), 8);

console.log('targetRules ok');
