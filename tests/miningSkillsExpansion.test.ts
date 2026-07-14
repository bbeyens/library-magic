import assert from 'node:assert/strict';
import {
  applyAction,
  miningAutoClickerCapacity,
  miningAutomationInterval,
  miningCriticalChance,
  miningCriticalMultiplier,
  miningDamageHitResult,
  miningHoldClickRate,
  miningMaterialTotal,
  miningPickaxeDamage,
  miningPickaxeMultiplier,
  miningResourceMultiplier,
  miningResourcesPerSecond,
  miningSkillMaxLevel,
  tickState,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

const state = createInitialState();
state.miningSkills.pickaxeForce = 1;
state.miningSkills.pickaxeMultiplier = 4;
state.miningSkills.criticalChance = 10;
state.miningSkills.criticalMultiplier = 5;
state.miningSkills.holdClick = 1;
state.miningSkills.multiAutoClicker = 3;
state.miningSkills.resourceMultiplier = 4;

assert.equal(miningPickaxeMultiplier(state), 2);
assert.equal(miningPickaxeDamage(state), 4);
assert.equal(miningCriticalChance(state), 0.1);
assert.equal(miningCriticalMultiplier(state), 2.5);
assert.deepEqual(miningDamageHitResult(state, () => 0), { amount: 10, critical: true });
assert.deepEqual(miningDamageHitResult(state, () => 0.5), { amount: 4, critical: false });
assert.equal(miningHoldClickRate(state), 5);
assert.equal(miningAutoClickerCapacity(state), 4);
assert.equal(miningResourceMultiplier(state), 2);
assert.equal(miningAutomationInterval(1), 5);
assert.equal(miningSkillMaxLevel('criticalChance'), 50);
assert.equal(miningSkillMaxLevel('multiAutoClicker'), 4);
// Multi auto clicker now reaches x5 at its (raised) max level of 4.
state.miningSkills.multiAutoClicker = 4;
assert.equal(miningAutoClickerCapacity(state), 5);
// Auto clicker max level is now 25, whose interval bottoms out at 0.2s (0.1s level removed).
assert.equal(miningSkillMaxLevel('automation'), 25);
assert.equal(miningAutomationInterval(25), 0.2);

const rewardState = createInitialState();
rewardState.books.mine.unlocked = true;
rewardState.openBookPanels = [{ bookId: 'mine', slot: 0 }];
rewardState.miningSkills.resourceBonus = 2;
rewardState.miningSkills.resourceMultiplier = 4;
rewardState.mining.blocks[0]!.health = 1;
applyAction(rewardState, { type: 'digMiningBlock', blockId: 0 });
assert.equal(rewardState.mining.materials.dirt, 6);

const autoState = createInitialState();
autoState.lastTick = 0;
autoState.books.mine.unlocked = true;
autoState.miningSkills.automation = 1;
autoState.miningSkills.multiAutoClicker = 3;
for (let second = 1; second <= 5; second += 1) {
  tickState(autoState, second * 1000);
}
// The auto-clicker sweeps the front-left edge first (row 4: ids 20..24), left to right.
for (const autoTargetId of [20, 21, 22, 23]) {
  assert.equal(autoState.mining.blocks[autoTargetId]?.health, 2);
}
assert.equal(autoState.mining.blocks[24]?.health, 3);
assert.equal(autoState.miningSkills.autoDigCount, 4);

const counterState = createInitialState();
counterState.mining.materials.dirt = 2;
counterState.mining.materials.coal = 3;
assert.equal(miningMaterialTotal(counterState), 5);
assert.equal(miningResourcesPerSecond(counterState), 0);
counterState.miningSkills.automation = 1;
const baseResourceRate = miningResourcesPerSecond(counterState);
counterState.miningSkills.resourceBonus = 2;
counterState.miningSkills.resourceMultiplier = 4;
assert.equal(Number((miningResourcesPerSecond(counterState) / baseResourceRate).toFixed(2)), 6);

console.log('miningSkillsExpansion ok');
