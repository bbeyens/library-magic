import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  applyAction,
  miniGameResourceReward,
  miningAllGamesResourceMultiplier,
  miningBlockTypeLevel,
  miningBlockTypeLevelProgress,
  miningMineResourceMultiplier,
} from '../src/game/simulation/actions.ts';
import { createInitialState, MINING_BLOCK_SPRITE_TIERS } from '../src/game/simulation/state.ts';

const state = createInitialState();
assert.equal(MINING_BLOCK_SPRITE_TIERS.length, 20);
assert.equal(state.mining.blockTypeXp.length, 20);
assert.equal(miningBlockTypeLevel(state, 1), 0);
assert.equal(miningBlockTypeLevel(state, 2), 0);
assert.equal(miningMineResourceMultiplier(state), 1);
assert.equal(miningAllGamesResourceMultiplier(state), 1);

state.mining.blockTypeXp[0] = 100;
assert.equal(miningBlockTypeLevel(state, 1), 1);
assert.equal(miningBlockTypeLevel(state, 2), 0, 'two dirt block types must level independently');
assert.equal(miningBlockTypeLevelProgress(state, 1), 0);
assert.equal(miningMineResourceMultiplier(state), 1.05);
assert.equal(miningAllGamesResourceMultiplier(state), 1);

state.mining.blockTypeXp[0] = 1_000;
assert.equal(miningBlockTypeLevel(state, 1), 10);
assert.equal(miningBlockTypeLevelProgress(state, 1), 100);
assert.equal(miningMineResourceMultiplier(state), 1.5);
assert.equal(miningAllGamesResourceMultiplier(state), 1.05);
assert.equal(miniGameResourceReward(state, 10), 10.5);

state.mining.blockTypeXp.fill(1_000);
assert.equal(miningMineResourceMultiplier(state), 11);
assert.equal(miningAllGamesResourceMultiplier(state), 2);
assert.equal(miniGameResourceReward(state, 10), 20);

const rewardState = createInitialState();
rewardState.books.mine.unlocked = true;
rewardState.openBookPanels = [{ bookId: 'mine', slot: 0 }];
rewardState.mining.blockTypeXp[0] = 100;
rewardState.mining.blocks[0]!.health = 1;
applyAction(rewardState, { type: 'digMiningBlock', blockId: 0 });
assert.equal(rewardState.mining.materials.dirt, 1.05);
assert.equal(rewardState.mining.blockTypeXp[0], 101);

const actionsSource = readFileSync(new URL('../src/game/simulation/actions.ts', import.meta.url), 'utf8');
for (const requiredRewardPath of [
  'const reward = miniGameResourceReward(state, runeTypingRewardPreview(state));',
  'const reward = miniGameResourceReward(state, baseReward);',
  "const reward = miniGameResourceReward(state, defenseEnemyReward(state, enemy.kind ?? 'slime'));",
  'const resourceGain = miniGameResourceReward(state, totalGain);',
  'const reward = miniGameResourceReward(state, hundredReward(book.level, nextTotal));',
  // The runner ('runner') is deliberately absent: its coins are internal to its own shop,
  // so it has no global resource reward to multiply.
  'const reward = miniGameResourceReward(state, slimeTrainerResourceReward(trainer.enemy, trainer.level));',
  'state.resources[bookDefinition.resourceId] += miniGameResourceReward(state, amount * 0.22);',
]) {
  assert.equal(
    actionsSource.includes(requiredRewardPath),
    true,
    `resource reward path should use the global multiplier: ${requiredRewardPath}`,
  );
}
assert.equal(actionsSource.includes('miningMineResourceMultiplier(state)'), true);
assert.equal(actionsSource.includes('miningAllGamesResourceMultiplier(state)'), true);
assert.equal(actionsSource.includes('(directClickDamage + manaResearchAllyClickDamage(state)) * miningAllGamesResourceMultiplier(state)'), true);

console.log('miningGlobalBonuses ok');
