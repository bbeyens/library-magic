import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyAction, miningSkillCost, type MiningSkillId } from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

const expectedBaseCosts: Record<MiningSkillId, number> = {
  pickaxeForce: 10,
  pickaxeMultiplier: 25,
  splashDamage: 30,
  criticalChance: 12,
  criticalMultiplier: 20,
  holdClick: 25,
  automation: 35,
  multiAutoClicker: 120,
  resourceBonus: 15,
  resourceMultiplier: 40,
};

for (const [skillId, expectedCost] of Object.entries(expectedBaseCosts) as Array<[MiningSkillId, number]>) {
  assert.equal(miningSkillCost(createInitialState(), skillId), expectedCost, `${skillId} should have a reduced base cost`);
}

const state = createInitialState();
state.mana = 1_000_000;
state.resources.minerals = 1_000_000;
applyAction(state, { type: 'buyMiningSkill', skillId: 'pickaxeForce' });
assert.equal(state.miningSkills.pickaxeForce, 0, 'global mana and minerals must not buy a mining skill');
assert.equal(state.mana, 1_000_000);

state.mining.materials.dirt = 6;
state.mining.materials.coal = 4;
applyAction(state, { type: 'buyMiningSkill', skillId: 'pickaxeForce' });
assert.equal(state.miningSkills.pickaxeForce, 1);
assert.equal(state.mining.materials.dirt, 0);
assert.equal(state.mining.materials.coal, 0);
assert.equal(state.resources.minerals, 1_000_000);
assert.equal(state.mana, 1_000_000, 'mining purchases must not consume mana');
assert.equal(miningSkillCost(state, 'pickaxeForce'), 12);

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const miningCardSource = hudSource.match(/function miningSkillShopCard[\s\S]*?\n}\n\nfunction miningSkillIcon/)?.[0] ?? '';
const miningDynamicSource = hudSource.match(/function updateDynamicMiningSkillCards[\s\S]*?\n}\n\nfunction refreshMiningSkillDock/)?.[0] ?? '';
const manaCardSource = hudSource.match(/function manaSkillShopCard[\s\S]*?\n}\n\nfunction manaResearchSkillShopCard/)?.[0] ?? '';
assert.equal(hudSource.includes('/assets/library/resources/minerals.svg'), true);
assert.equal(hudSource.includes("alt=\"Ressources minieres\""), true);
assert.equal(miningCardSource.includes('miningMaterialTotal(state) < cost'), true);
assert.equal(miningCardSource.includes("`${compactHudNumber(cost)} Ressources`"), true);
assert.equal(miningDynamicSource.includes('Math.floor(miningMaterialTotal(state))'), true);
assert.equal(manaCardSource.includes('state.mana < cost'), true, 'mana skills must still use mana');
assert.equal(manaCardSource.includes("`${compactHudNumber(cost)} Mana`"), true);

console.log('miningSkillEconomy ok');
