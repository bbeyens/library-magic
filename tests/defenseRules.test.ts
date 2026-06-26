import assert from 'node:assert/strict';
import {
  defenseEnemyEdgePoint,
  defenseEnemyInTowerHitbox,
  defenseEnemyInTowerRange,
  defenseEnemyPosition,
  nextDefenseSpeedMultiplier,
} from '../src/game/simulation/defenseRules.ts';

assert.deepEqual(defenseEnemyEdgePoint(0), { x: 100, y: 50 });
assert.deepEqual(defenseEnemyEdgePoint(90), { x: 50, y: 100 });
assert.deepEqual(defenseEnemyEdgePoint(180), { x: 0, y: 50 });
assert.deepEqual(defenseEnemyEdgePoint(270), { x: 50, y: 0 });

assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 1 }), { x: 100, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0.5 }), { x: 75, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0 }), { x: 50, y: 50 });

assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.68 }, 0.68), true);
assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.69 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.68 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.48 }, 0.68), true);

assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 270, distance: 0.4 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 270, distance: 0.42 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.24 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.26 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.32 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.35 }), false);

assert.equal(nextDefenseSpeedMultiplier(1), 2);
assert.equal(nextDefenseSpeedMultiplier(2), 4);
assert.equal(nextDefenseSpeedMultiplier(4), 1);
assert.equal(nextDefenseSpeedMultiplier(99), 1);

console.log('defenseRules ok');
