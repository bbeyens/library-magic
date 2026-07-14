import assert from 'node:assert/strict';
import {
  applyAction,
  miningMeteoriteBonusFactor,
  miningMeteoriteDamageBonus,
  miningPickaxeDamage,
  miningSkillCost,
  miningSkillMaxLevel,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

// The meteoriteBonus skill tops out at level 5.
assert.equal(miningSkillMaxLevel('meteoriteBonus'), 5);

// Per-launch factor: 1 at level 0, then x1.01 / x1.02 ... x1.05 at levels 1..5.
const factors = createInitialState();
assert.equal(miningMeteoriteBonusFactor(factors), 1);
for (let level = 1; level <= 5; level += 1) {
  factors.miningSkills.meteoriteBonus = level;
  assert.ok(Math.abs(miningMeteoriteBonusFactor(factors) - (1 + level * 0.01)) < 1e-9);
}
// Clamped at level 5 even if the stored level somehow overflows.
factors.miningSkills.meteoriteBonus = 99;
assert.ok(Math.abs(miningMeteoriteBonusFactor(factors) - 1.05) < 1e-9);

// Without the skill the permanent bonus stays at 1 no matter how many meteorites launch.
const noSkill = createInitialState();
noSkill.books.mine.unlocked = true;
assert.equal(miningMeteoriteDamageBonus(noSkill), 1);
applyAction(noSkill, { type: 'debugTriggerMeteorite' });
applyAction(noSkill, { type: 'debugTriggerMeteorite' });
assert.equal(noSkill.mining.meteoriteDamageBonus, 1);

// With the skill at level 3 (x1.03), every launched meteorite multiplies the permanent bonus, and it
// feeds true click damage (pickaxe+ x pickaxe× x bonus), before crits.
const state = createInitialState();
state.books.mine.unlocked = true;
state.miningSkills.meteoriteBonus = 3;
state.miningSkills.pickaxeForce = 99; // base damage 100 so the multiplier survives rounding
assert.equal(miningPickaxeDamage(state), 100);

applyAction(state, { type: 'debugTriggerMeteorite' });
assert.ok(Math.abs(state.mining.meteoriteDamageBonus - 1.03) < 1e-9);
applyAction(state, { type: 'debugTriggerMeteorite' });
assert.ok(Math.abs(state.mining.meteoriteDamageBonus - 1.03 * 1.03) < 1e-9);
assert.equal(miningPickaxeDamage(state), Math.round(100 * 1.03 * 1.03)); // 106

// Cost curve: 500 * 1.6^level.
const shop = createInitialState();
assert.equal(miningSkillCost(shop, 'meteoriteBonus'), 500);
shop.miningSkills.meteoriteBonus = 1;
assert.equal(miningSkillCost(shop, 'meteoriteBonus'), Math.round(500 * 1.6));

console.log('miningMeteoriteBonus ok');
