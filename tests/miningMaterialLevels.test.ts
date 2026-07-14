import assert from 'node:assert/strict';
import {
  applyAction,
  MINING_MATERIAL_MAX_LEVEL,
  MINING_MATERIAL_XP_PER_LEVEL,
  miningActiveBlockTypeIndex,
  miningBlockTypeLevel,
  miningBlockTypeLevelForXp,
  miningBlockTypeLevelProgress,
  miningBlockTypeXpCurrent,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

const state = createInitialState();
state.books.mine.unlocked = true;
state.openBookPanels = [{ bookId: 'mine', slot: 0 }];

assert.equal(MINING_MATERIAL_MAX_LEVEL, 10);
assert.equal(MINING_MATERIAL_XP_PER_LEVEL, 100);
assert.equal(miningActiveBlockTypeIndex(state), 1);
assert.equal(miningBlockTypeLevel(state, 1), 0);
assert.equal(miningBlockTypeLevelProgress(state, 1), 0);
assert.equal(state.mining.blockTypeXp.length, 20);
assert.equal(state.mining.blockTypeXp[0], 0);
assert.equal(state.mining.blockTypeXp[1], 0);

state.mining.blocks[0]!.health = 1;
applyAction(state, { type: 'digMiningBlock', blockId: 0 });

assert.equal(state.mining.blockTypeXp[0], 1);
assert.equal(state.mining.blockTypeXp[1], 0);
assert.equal(miningBlockTypeXpCurrent(state, 1), 1);
assert.equal(miningBlockTypeLevelProgress(state, 1), 1);

state.mining.blockTypeXp[0] = 299;
assert.equal(miningBlockTypeLevel(state, 1), 2);
assert.equal(miningBlockTypeXpCurrent(state, 1), 99);
assert.equal(miningBlockTypeLevelProgress(state, 1), 99);
assert.equal(miningBlockTypeLevel(state, 2), 0);

state.mining.terrainCycle = 7;
assert.equal(miningActiveBlockTypeIndex(state), 7);
assert.equal(miningBlockTypeLevel(state, miningActiveBlockTypeIndex(state)), 0);
state.mining.terrainCycle = 1;

state.mining.blockTypeXp[0] = 1_000;
assert.equal(miningBlockTypeLevel(state, 1), MINING_MATERIAL_MAX_LEVEL);
assert.equal(miningBlockTypeXpCurrent(state, 1), MINING_MATERIAL_XP_PER_LEVEL);
assert.equal(miningBlockTypeLevelProgress(state, 1), 100);
assert.equal(miningBlockTypeLevelForXp(10_000), MINING_MATERIAL_MAX_LEVEL);

state.mining.blocks[0]!.health = 1;
applyAction(state, { type: 'digMiningBlock', blockId: 0 });
assert.equal(state.mining.blockTypeXp[0], 1_000);

console.log('miningMaterialLevels ok');
