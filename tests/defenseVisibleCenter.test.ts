import assert from 'node:assert/strict';
import { defenseEnemyVisibleCenter } from '../src/game/simulation/defenseRules.ts';

assert.deepEqual(defenseEnemyVisibleCenter({ kind: 'bat', lane: 0, distance: 0.5 }), { x: 75, y: 50 });
assert.equal(Number(defenseEnemyVisibleCenter({ lane: 0, distance: 0.5 }).y.toFixed(3)), 51.367);
assert.equal(Number(defenseEnemyVisibleCenter({ kind: 'goblinKing', lane: 0, distance: 0.5 }).y.toFixed(3)), 54.959);
assert.equal(Number(defenseEnemyVisibleCenter({ kind: 'skeletonMage', lane: 0, distance: 0.5 }).y.toFixed(3)), 40);

console.log('defenseVisibleCenter ok');
