import assert from 'node:assert/strict';
import { applyAction } from '../src/game/simulation/actions.ts';
import {
  createInitialState,
  MINING_TERRAIN_LAYER_COUNT,
  miningLevelSpriteTier,
  miningMaxReachedCycle,
} from '../src/game/simulation/state.ts';

// Max reached cycle is derived from the deepest broken layer.
assert.equal(miningMaxReachedCycle(1), 1);
assert.equal(miningMaxReachedCycle(5), 1);
assert.equal(miningMaxReachedCycle(6), 2);
assert.equal(miningMaxReachedCycle(11), 3);
assert.equal(miningMaxReachedCycle(0), 1);

// Each cycle maps to exactly one sprite tier / face.
assert.equal(miningLevelSpriteTier(1).spriteIndex, 1);
assert.equal(miningLevelSpriteTier(2).spriteIndex, 2);
assert.equal(miningLevelSpriteTier(3).spriteIndex, 3);
assert.equal(miningLevelSpriteTier(1).assetPath, miningLevelSpriteTier(1).assetPath);

const state = createInitialState();
state.books.mine.unlocked = true;
state.openBookPanels = [{ bookId: 'mine', slot: 0 }];

// Clear the first two terrains so cycles 1-3 are reachable.
for (let cycle = 0; cycle < 2; cycle += 1) {
  for (let blockIndex = 0; blockIndex < state.mining.blocks.length; blockIndex += 1) {
    for (let layerBreak = 0; layerBreak < MINING_TERRAIN_LAYER_COUNT; layerBreak += 1) {
      state.mining.blocks[blockIndex]!.health = 1;
      applyAction(state, { type: 'digMiningBlock', blockId: blockIndex });
    }
  }
}

assert.equal(state.mining.terrainCycle, 3);
const maxReached = miningMaxReachedCycle(state.mining.deepestLayer);
assert.equal(maxReached >= 3, true);

// Jumping back to a reached level regenerates that terrain.
applyAction(state, { type: 'selectMiningLevel', cycle: 1 });
assert.equal(state.mining.terrainCycle, 1);
assert.equal(state.mining.blocks.every((block) => block.layersRemaining === 5), true);
assert.equal(state.mining.blocks[0]!.depth, 1);
assert.equal(state.mining.blocks[0]!.material, 'dirt');

// The furthest-reached ceiling is preserved after going back.
assert.equal(miningMaxReachedCycle(state.mining.deepestLayer), maxReached);

// Unreached levels are clamped and cannot be selected.
applyAction(state, { type: 'selectMiningLevel', cycle: maxReached + 50 });
assert.equal(state.mining.terrainCycle <= maxReached, true);

// Below-range values clamp to level 1.
applyAction(state, { type: 'selectMiningLevel', cycle: 3 });
applyAction(state, { type: 'selectMiningLevel', cycle: 0 });
assert.equal(state.mining.terrainCycle, 1);

// A closed mine panel ignores the action.
const closed = createInitialState();
closed.books.mine.unlocked = true;
closed.openBookPanels = [];
closed.mining.deepestLayer = 20;
const cycleBefore = closed.mining.terrainCycle;
applyAction(closed, { type: 'selectMiningLevel', cycle: 2 });
assert.equal(closed.mining.terrainCycle, cycleBefore);

console.log('miningLevelSelect ok');
