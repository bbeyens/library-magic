import assert from 'node:assert/strict';
import {
  applyAction,
  miningAttackRangePixels,
  miningBlockIdsWithinAttackRange,
  miningSkillMaxLevel,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';
import {
  miningAttackCircleRadiusPx,
  miningPointToDiamondDistance,
} from '../src/ui/miningThreeTerrain.ts';

const state = createInitialState();

// Range starts at 1px (level 1) and climbs 1px per level up to 40px — exactly 40 levels.
assert.equal(miningAttackRangePixels(state), 1);
assert.deepEqual(miningBlockIdsWithinAttackRange(12, 10), [12]);

state.miningSkills.splashDamage = 6;
assert.equal(miningAttackRangePixels(state), 7); // 1 + 6 levels
assert.deepEqual(miningBlockIdsWithinAttackRange(12, 16), [7, 11, 12, 13, 17]);

state.miningSkills.splashDamage = 15;
assert.equal(miningSkillMaxLevel('splashDamage'), 39);
assert.equal(miningAttackRangePixels(state), 16); // 1 + 15 levels
assert.equal(miningBlockIdsWithinAttackRange(12, 34).length, 13);
assert.equal(miningBlockIdsWithinAttackRange(12, 34).includes(0), false);
// At the max level (39) the range reaches exactly 40px.
state.miningSkills.splashDamage = 39;
assert.equal(miningAttackRangePixels(state), 40);
const nearlyEqual = (a: number, b: number) => Math.abs(a - b) < 0.05;

// The pointer touch zone IS the round reticle: a tile is hit when the screen circle (radius sized off
// the wide lattice axis) overlaps its top-face diamond. Distances are to the diamond surface, not the
// centre, so the shape is symmetric. Board sample: half-extents halfW=40, halfH=16 (a 2.5:1 tile).
const halfW = 40;
const halfH = 16;
// Point inside the diamond → distance 0.
assert.equal(miningPointToDiamondDistance(0, 0, halfW, halfH), 0);
assert.equal(miningPointToDiamondDistance(20, 8, halfW, halfH), 0); // 20/40 + 8/16 = 1, on the edge
// Vertex-neighbour tips: the nearest point of each neighbour's diamond is one tile-vertex away, and
// all four come out equal despite the squash — left/right no longer lag behind top/bottom.
const leftTip = miningPointToDiamondDistance(80, 0, halfW, halfH); // left/right neighbour centre 80px out
const topTip = miningPointToDiamondDistance(0, 32, halfW, halfH); // top/bottom neighbour centre 32px out
assert.ok(nearlyEqual(leftTip, 40)); // its near tip sits 40px away
assert.ok(nearlyEqual(topTip, 16)); // its near tip sits 16px away
// Reticle radius is shared with the drawing code and scales with range (√2 · range/16 · halfW).
assert.ok(nearlyEqual(miningAttackCircleRadiusPx(0, halfW), 0));
assert.ok(nearlyEqual(miningAttackCircleRadiusPx(16, halfW), Math.SQRT2 * 40));
// At base range (1px) the circle is small enough to hit only the hovered tile, not its neighbours.
const baseRadius = miningAttackCircleRadiusPx(1, halfW);
assert.ok(baseRadius < topTip && baseRadius < leftTip);
// A wide circle (range 20px → radius ≈ 70px) overlaps both the top and the left neighbour tips.
const wideRadius = miningAttackCircleRadiusPx(20, halfW);
assert.ok(wideRadius >= leftTip && wideRadius >= topTip);

state.miningSkills.splashDamage = 999;
assert.equal(miningAttackRangePixels(state), 40);

const baseRangeState = createInitialState();
baseRangeState.books.mine.unlocked = true;
baseRangeState.openBookPanels = [{ bookId: 'mine', slot: 0 }];
applyAction(baseRangeState, { type: 'digMiningBlock', blockId: 12 });
assert.equal(baseRangeState.mining.blocks[12]?.health, 2);
assert.equal(baseRangeState.mining.blocks[7]?.health, 3);

const upgradedRangeState = createInitialState();
upgradedRangeState.books.mine.unlocked = true;
upgradedRangeState.openBookPanels = [{ bookId: 'mine', slot: 0 }];
// Level 15 → 16px range, the first level that reaches the four orthogonal neighbours (one 16px step).
upgradedRangeState.miningSkills.splashDamage = 15;
applyAction(upgradedRangeState, { type: 'digMiningBlock', blockId: 12 });
for (const affectedId of [7, 11, 12, 13, 17]) {
  assert.equal(upgradedRangeState.mining.blocks[affectedId]?.health, 2);
}
assert.equal(upgradedRangeState.mining.blocks[6]?.health, 3);

const pointerAreaState = createInitialState();
pointerAreaState.books.mine.unlocked = true;
pointerAreaState.openBookPanels = [{ bookId: 'mine', slot: 0 }];
applyAction(pointerAreaState, { type: 'digMiningArea', blockIds: [7, 12] });
assert.equal(pointerAreaState.mining.blocks[7]?.health, 2);
assert.equal(pointerAreaState.mining.blocks[12]?.health, 2);
assert.equal(pointerAreaState.mining.blocks[11]?.health, 3);

console.log('miningAttackRange ok');
