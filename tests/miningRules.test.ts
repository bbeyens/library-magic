import assert from 'node:assert/strict';
import { applyAction } from '../src/game/simulation/actions.ts';
import {
  createInitialMiningBlocks,
  createInitialState,
  MINING_BLOCK_SPRITE_TIERS,
  MINING_GRID_COLUMNS,
  MINING_GRID_ROWS,
  MINING_TERRAIN_LAYER_COUNT,
  miningBlockCrackOverlayForDamage,
  miningBlockMaterialForDepth,
  miningBlockSpriteTierForDepth,
  miningMaterialExchangeValue,
} from '../src/game/simulation/state.ts';

assert.equal(MINING_GRID_COLUMNS, 6);
assert.equal(MINING_GRID_ROWS, 6);
assert.equal(MINING_TERRAIN_LAYER_COUNT, 5);
assert.equal(createInitialMiningBlocks().length, 36);
assert.equal(createInitialMiningBlocks()[0]?.layersRemaining, 5);

assert.equal(MINING_BLOCK_SPRITE_TIERS.length, 20);
assert.equal(miningBlockSpriteTierForDepth(1).spriteIndex, 1);
assert.equal(miningBlockSpriteTierForDepth(5).spriteIndex, 1);
assert.equal(miningBlockSpriteTierForDepth(6).spriteIndex, 2);
assert.equal(miningBlockSpriteTierForDepth(100).spriteIndex, 20);
assert.equal(miningBlockSpriteTierForDepth(101).spriteIndex, 20);
assert.equal(miningBlockSpriteTierForDepth(1).shadeLevel, 1);
assert.equal(miningBlockSpriteTierForDepth(5).shadeLevel, 5);
assert.equal(miningBlockSpriteTierForDepth(6).shadeLevel, 1);

assert.equal(miningBlockCrackOverlayForDamage(3, 3, 0), null);
assert.equal(miningBlockCrackOverlayForDamage(3, 4, 0)?.column, 1);
assert.equal(miningBlockCrackOverlayForDamage(2, 4, 1)?.column, 2);
assert.equal(miningBlockCrackOverlayForDamage(1, 4, 2)?.column, 3);
assert.equal(miningBlockCrackOverlayForDamage(0, 4, 3)?.column, 4);
assert.equal(miningBlockCrackOverlayForDamage(3, 4, 0)?.row, 1);
assert.equal(miningBlockCrackOverlayForDamage(3, 4, 4)?.row, 1);
assert.equal(miningBlockCrackOverlayForDamage(3, 4, 5)?.row, 2);

assert.equal(miningBlockMaterialForDepth(1).id, 'dirt');
assert.equal(miningBlockMaterialForDepth(6).id, 'dirt');
assert.equal(miningBlockMaterialForDepth(11).id, 'sand');
assert.equal(miningBlockMaterialForDepth(16).id, 'stone');
assert.equal(miningBlockMaterialForDepth(31).id, 'coal');
assert.equal(miningBlockMaterialForDepth(36).id, 'iron');
assert.equal(miningBlockMaterialForDepth(41).id, 'gold');
assert.equal(miningBlockMaterialForDepth(46).id, 'ruby');
assert.equal(miningBlockMaterialForDepth(51).id, 'lapis');
assert.equal(miningBlockMaterialForDepth(56).id, 'diamond');
assert.equal(miningBlockMaterialForDepth(61).id, 'emerald');
assert.equal(miningBlockMaterialForDepth(100).id, 'obsidian');

assert.equal(createInitialMiningBlocks()[0]?.material, 'dirt');

const state = createInitialState();
state.books.mine.unlocked = true;
state.openBookPanels = [{ bookId: 'mine', slot: 0 }];
const manaBeforeMining = state.mana;
const mineCoinsBeforeMining = state.resources.minerals;

for (let breakCount = 0; breakCount < 5; breakCount += 1) {
  state.mining.blocks[0]!.health = 1;
  applyAction(state, { type: 'digMiningBlock', blockId: 0 });
}

assert.equal(state.mining.blocks[0]!.depth, 5);
assert.equal(state.mining.blocks[0]!.material, 'dirt');
assert.equal(state.mining.materials.dirt > 5, true);
assert.equal(state.mana, manaBeforeMining);
assert.equal(state.resources.minerals, mineCoinsBeforeMining);
const dirtBeforeExchange = state.mining.materials.dirt;

applyAction(state, { type: 'exchangeMiningMaterials' });

assert.equal(state.mining.materials.dirt, 0);
assert.equal(state.resources.minerals, mineCoinsBeforeMining + dirtBeforeExchange * miningMaterialExchangeValue('dirt'));

assert.equal(state.mining.terrainCycle, 1);
assert.equal(state.mining.blocks[0]!.layersRemaining, 0);
assert.equal(state.mining.blocks[1]!.layersRemaining, 5);

for (let blockIndex = 1; blockIndex < state.mining.blocks.length; blockIndex += 1) {
  for (let layerBreak = 0; layerBreak < MINING_TERRAIN_LAYER_COUNT; layerBreak += 1) {
    state.mining.blocks[blockIndex]!.health = 1;
    applyAction(state, { type: 'digMiningBlock', blockId: blockIndex });
  }
}

assert.equal(state.mining.terrainCycle, 2);
assert.equal(state.mining.blocks.every((block) => block.layersRemaining === 5), true);
assert.equal(state.mining.blocks.every((block) => block.depth === 6), true);
assert.equal(state.mining.materials.dirt > 0, true);

console.log('miningRules ok');
