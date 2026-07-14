import assert from 'node:assert/strict';
import { BLACKJACK_UPGRADE_CELL_IDS } from '../src/game/simulation/blackjackRules.ts';
import {
  applyAction,
  blackjackCurrentActionMaxLevel,
  blackjackCurrentBonusMaxLevel,
  blackjackCurrentUpgradeCellMaxLevel,
  defenseMaxTowerHealth,
  defenseSkillMaxLevel,
  defenseTowerRange,
  miningSkillMaxLevel,
  snakeSkillMaxLevel,
  targetSkillMaxLevel,
  type DefenseSkillId,
  type ManaSkillId,
  type MiningSkillId,
  type SnakeSkillId,
  type TargetSkillId,
} from '../src/game/simulation/actions.ts';
import { books } from '../src/game/content/books.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

const state = createInitialState();

applyAction(state, { type: 'unlockAllBooks' });

for (const book of books) {
  assert.equal(state.books[book.id].unlocked, true);
}

applyAction(state, { type: 'maxAllSkills' });

assert.equal(state.manaSkills.power, 50);

const manaSkillIds: ManaSkillId[] = [
  'power',
  'clickMultiplier',
  'xpOrbChance',
  'yellowOrbChance',
  'greenOrbChance',
  'blueOrbChance',
  'xpValue',
  'levelUpEffect',
  'holdClick',
  'criticalHit',
  'criticalEffect',
];
for (const skillId of manaSkillIds) {
  const debugMax: Record<ManaSkillId, number> = {
    power: 50,
    clickMultiplier: 40,
    xpOrbChance: 20,
    yellowOrbChance: 20,
    greenOrbChance: 20,
    blueOrbChance: 20,
    xpValue: 20,
    levelUpEffect: 30,
    holdClick: 16,
    criticalHit: 50,
    criticalEffect: 40,
  };
  assert.equal(state.manaSkills[skillId], debugMax[skillId]);
}

const snakeSkillIds: SnakeSkillId[] = ['speed', 'gridSize', 'automation', 'baseMultiplier', 'bonusFruit', 'extraLife', 'edgeWrap'];
for (const skillId of snakeSkillIds) {
  assert.equal(state.snakeSkills[skillId], snakeSkillMaxLevel(skillId));
}
assert.equal(state.snakeSkills.automationEnabled, true);

const targetSkillIds: TargetSkillId[] = ['spawnSpeed', 'targetCount', 'damage', 'automation'];
for (const skillId of targetSkillIds) {
  assert.equal(state.targetSkills[skillId], targetSkillMaxLevel(skillId));
}

const defenseSkillIds: DefenseSkillId[] = [
  'damage',
  'damageMultiplier',
  'attackSpeed',
  'range',
  'criticalChance',
  'criticalMultiplier',
  'superCriticalChance',
  'superCriticalMultiplier',
  'lightningDamage',
  'lightningSpeed',
  'lightningCount',
  'iceDamage',
  'iceSpeed',
  'iceRange',
  'iceSlow',
  'health',
  'healthRegen',
  'moneyPerEnemy',
  'goldMultiplier',
  'baseSpeed',
];
for (const skillId of defenseSkillIds) {
  assert.equal(state.defenseSkills[skillId], defenseSkillMaxLevel(skillId));
}

const miningSkillIds: MiningSkillId[] = [
  'pickaxeForce',
  'pickaxeMultiplier',
  'splashDamage',
  'criticalChance',
  'criticalMultiplier',
  'holdClick',
  'automation',
  'multiAutoClicker',
  'resourceBonus',
  'resourceMultiplier',
];
for (const skillId of miningSkillIds) {
  assert.equal(state.miningSkills[skillId], miningSkillMaxLevel(skillId));
}

assert.equal(state.blackjack.actions.unlocked, true);
assert.equal(state.blackjack.actions.level, blackjackCurrentActionMaxLevel());
assert.equal(state.blackjack.pair.unlocked, true);
assert.equal(state.blackjack.pair.level, blackjackCurrentBonusMaxLevel());
assert.equal(state.blackjack.pair.autoEnabled, true);
assert.equal(state.blackjack.twentyOneThree.unlocked, true);
assert.equal(state.blackjack.twentyOneThree.level, blackjackCurrentBonusMaxLevel());
assert.equal(state.blackjack.twentyOneThree.autoEnabled, true);

for (const cellId of BLACKJACK_UPGRADE_CELL_IDS) {
  assert.equal(state.blackjack.upgradeCells[cellId], blackjackCurrentUpgradeCellMaxLevel(cellId));
}

const debugResourceState = createInitialState();
applyAction(debugResourceState, { type: 'grantDebugResources' });
assert.equal(debugResourceState.mana, 100_000_000);
assert.equal(debugResourceState.resources.scales, 100_000_000);
assert.equal(debugResourceState.resources.runes, 100_000_000);
assert.equal(debugResourceState.resources.spores, 100_000_000);
assert.equal(debugResourceState.resources.sigils, 100_000_000);
assert.equal(debugResourceState.resources.chips, 100_000_050);
assert.equal(debugResourceState.resources.fragments, 100_000_000);
assert.equal(debugResourceState.resources.marks, 100_000_000);
assert.equal(debugResourceState.resources.minerals, 100_000_000);
assert.equal(debugResourceState.resources.gels, 100_000_000);
for (const amount of Object.values(debugResourceState.mining.materials)) {
  assert.equal(amount, 100_000_000);
}

applyAction(state, { type: 'resetAllSkills' });

for (const book of books) {
  assert.equal(state.books[book.id].unlocked, true);
}

assert.equal(state.manaSkills.power, 0);
for (const skillId of manaSkillIds) {
  assert.equal(state.manaSkills[skillId], 0);
}
assert.equal(state.manaCrystal.xp, 0);
assert.equal(state.manaCrystal.xpOrb, null);
assert.equal(state.manaCrystal.holdClickActive, false);

for (const skillId of snakeSkillIds) {
  assert.equal(state.snakeSkills[skillId], 0);
}
assert.equal(state.snakeSkills.automationEnabled, false);
assert.equal(state.snake.gridSize, 8);

for (const skillId of targetSkillIds) {
  assert.equal(state.targetSkills[skillId], 0);
}

for (const skillId of defenseSkillIds) {
  assert.equal(state.defenseSkills[skillId], 0);
}
assert.equal(state.defense.tower.range, defenseTowerRange(state));
assert.equal(state.defense.towerHealth, defenseMaxTowerHealth(state));

for (const skillId of miningSkillIds) {
  assert.equal(state.miningSkills[skillId], 0);
}

assert.equal(state.blackjack.actions.unlocked, false);
assert.equal(state.blackjack.actions.level, 0);
assert.equal(state.blackjack.actions.autoEnabled, false);
assert.equal(state.blackjack.pair.unlocked, false);
assert.equal(state.blackjack.pair.level, 0);
assert.equal(state.blackjack.pair.autoEnabled, false);
assert.equal(state.blackjack.twentyOneThree.unlocked, false);
assert.equal(state.blackjack.twentyOneThree.level, 0);
assert.equal(state.blackjack.twentyOneThree.autoEnabled, false);
assert.equal(state.blackjack.baseBetLevel, 1);
for (const cellId of BLACKJACK_UPGRADE_CELL_IDS) {
  assert.equal(state.blackjack.upgradeCells[cellId], 1);
}

console.log('debugActions ok');
