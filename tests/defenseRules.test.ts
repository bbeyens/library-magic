import assert from 'node:assert/strict';
import {
  defenseEnemyEdgePoint,
  defenseEnemyInTowerHitbox,
  defenseEnemyInTowerRange,
  defenseEnemyPosition,
  nextDefenseSpeedMultiplier,
} from '../src/game/simulation/defenseRules.ts';
import {
  applyAction,
  defenseEnemyReward,
  defenseMaxTowerHealth,
  defenseMoneyPerWave,
  defenseSkillCost,
  defenseSkillMaxLevel,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseTowerHitDamage,
  defenseTowerHitResult,
  defenseTowerRange,
  defenseTowerRangePercent,
  tickState,
  type DefenseSkillId,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

assert.deepEqual(defenseEnemyEdgePoint(0), { x: 100, y: 50 });
assert.deepEqual(defenseEnemyEdgePoint(90), { x: 50, y: 100 });
assert.deepEqual(defenseEnemyEdgePoint(180), { x: 0, y: 50 });
assert.deepEqual(defenseEnemyEdgePoint(270), { x: 50, y: 0 });

assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 1 }), { x: 100, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0.5 }), { x: 75, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0 }), { x: 50, y: 50 });

assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.68 }, 0.68), true);
assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.69 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.68 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.48 }, 0.68), true);

assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 270, distance: 0.4 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 270, distance: 0.42 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.24 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.26 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.32 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.35 }), false);

assert.equal(nextDefenseSpeedMultiplier(1), 2);
assert.equal(nextDefenseSpeedMultiplier(2), 4);
assert.equal(nextDefenseSpeedMultiplier(4), 1);
assert.equal(nextDefenseSpeedMultiplier(99), 1);

const state = createInitialState();
state.books.defense.unlocked = true;
state.mana = 10000;

const defenseSkillIds: DefenseSkillId[] = [
  'damage',
  'attackSpeed',
  'range',
  'damagePerMeter',
  'criticalChance',
  'criticalMultiplier',
  'ricochetCount',
  'ricochetChance',
  'superCriticalChance',
  'superCriticalMultiplier',
  'health',
  'healthRegen',
  'resistance',
  'moneyPerEnemy',
  'moneyPerWave',
];

for (const skillId of defenseSkillIds) {
  assert.equal(state.defenseSkills[skillId], 0);
  assert.equal(defenseSkillMaxLevel(skillId) > 0, true);
  assert.equal(defenseSkillCost(state, skillId) > 0, true);
}

assert.equal(defenseTowerRangePercent(state), 0.3);
assert.equal(Math.round(defenseTowerRange(state) * 1000), 552);

const noSkillBookLevelState = createInitialState();
noSkillBookLevelState.books.defense.unlocked = true;
noSkillBookLevelState.books.defense.level = 8;
noSkillBookLevelState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
noSkillBookLevelState.lastTick = 3000;
noSkillBookLevelState.defense.tower.cooldown = 0;
noSkillBookLevelState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 2, maxHealth: 2, state: 'walking', deathTimer: 0 },
];

assert.equal(defenseTowerDamage(noSkillBookLevelState), 1);
assert.equal(defenseTowerAttackInterval(noSkillBookLevelState), 0.78);

tickState(noSkillBookLevelState, 3016);

assert.equal(noSkillBookLevelState.defense.shotPulse, 1);
assert.equal(noSkillBookLevelState.defense.damagePopups[0]?.amount, 1);
assert.equal(noSkillBookLevelState.defense.enemies[0]?.health, 1);
assert.equal(noSkillBookLevelState.defense.enemies[0]?.state, 'walking');

applyAction(state, { type: 'buyDefenseSkill', skillId: 'damage' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'attackSpeed' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'range' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'health' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'moneyPerEnemy' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'moneyPerWave' });

assert.equal(state.defenseSkills.damage, 1);
assert.equal(defenseTowerDamage(state), 2);
assert.equal(defenseTowerAttackInterval(state) < 0.78, true);
assert.equal(defenseTowerRangePercent(state) > 0.3, true);
assert.equal(defenseTowerRange(state) > 0.552, true);
state.defenseSkills.range = defenseSkillMaxLevel('range');
assert.equal(defenseTowerRangePercent(state), 0.8);
assert.equal(Math.round(defenseTowerRange(state) * 1000), 872);
assert.equal(defenseMaxTowerHealth(state), 12);
assert.equal(defenseEnemyReward(state), 2);
assert.equal(defenseMoneyPerWave(state), 3);

state.defenseSkills.damagePerMeter = 4;
assert.equal(defenseTowerHitDamage(state, { lane: 0, distance: 1 }), 5);
assert.deepEqual(defenseTowerHitResult(state, { lane: 0, distance: 1 }), { amount: 5, kind: 'normal' });

state.defenseSkills.criticalChance = 10;
state.defenseSkills.criticalMultiplier = 4;
assert.equal(defenseTowerHitDamage(state, { lane: 0, distance: 0 }, () => 0.1), 5);
assert.deepEqual(defenseTowerHitResult(state, { lane: 0, distance: 0 }, () => 0.1), { amount: 5, kind: 'critical' });

state.defenseSkills.superCriticalChance = 5;
state.defenseSkills.superCriticalMultiplier = 4;
assert.equal(defenseTowerHitDamage(state, { lane: 0, distance: 0 }, () => 0.01), 8);
assert.deepEqual(defenseTowerHitResult(state, { lane: 0, distance: 0 }, () => 0.01), { amount: 8, kind: 'superCritical' });

const cooldownState = createInitialState();
cooldownState.books.defense.unlocked = true;
cooldownState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
cooldownState.lastTick = 1000;
cooldownState.defense.tower.cooldown = 0;
cooldownState.defense.shotPulse = 3;
cooldownState.defense.shot = { id: 3, lane: 0, distance: 0.4, timer: 0.08 };
cooldownState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 10, maxHealth: 10, state: 'walking', deathTimer: 0 },
];

tickState(cooldownState, 1016);

assert.equal(cooldownState.defense.shotPulse, 3);
assert.equal(cooldownState.defense.enemies[0]?.health, 10);

const speedCooldownState = createInitialState();
speedCooldownState.books.defense.unlocked = true;
speedCooldownState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
speedCooldownState.lastTick = 1000;
speedCooldownState.defense.speedMultiplier = 4;
speedCooldownState.defense.tower.cooldown = 0;
speedCooldownState.defense.shotPulse = 7;
speedCooldownState.defense.shot = { id: 7, lane: 0, distance: 0.4, timer: 0.08 };
speedCooldownState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 10, maxHealth: 10, state: 'walking', deathTimer: 0 },
];

tickState(speedCooldownState, 1050);

assert.equal(speedCooldownState.defense.shotPulse, 7);
assert.equal(speedCooldownState.defense.enemies[0]?.health, 10);
assert.equal(speedCooldownState.defense.shot?.id, 7);

const ricochetState = createInitialState();
ricochetState.books.defense.unlocked = true;
ricochetState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
ricochetState.lastTick = 2000;
ricochetState.defense.tower.cooldown = 0;
ricochetState.defenseSkills.ricochetCount = 2;
ricochetState.defenseSkills.ricochetChance = defenseSkillMaxLevel('ricochetChance');
ricochetState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.38, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 12, distance: 0.42, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 3, lane: 348, distance: 0.44, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

const originalRandom = Math.random;
Math.random = () => 0;
try {
  tickState(ricochetState, 2016);
  assert.equal(ricochetState.defense.shotPulse, 1);
  assert.equal(ricochetState.defense.damagePopups.length, 1);
  assert.equal(ricochetState.defense.enemies[0]?.health, 4);
  assert.equal(ricochetState.defense.enemies[1]?.health, 5);
  assert.equal(ricochetState.defense.enemies[2]?.health, 5);

  tickState(ricochetState, 2216);
  assert.equal(ricochetState.defense.shotPulse, 2);
  assert.equal(ricochetState.defense.damagePopups.length, 2);
  assert.equal(ricochetState.defense.enemies[1]?.health, 4);

  tickState(ricochetState, 2416);
  assert.equal(ricochetState.defense.shotPulse, 3);
  assert.equal(ricochetState.defense.damagePopups.length, 3);
  assert.equal(ricochetState.defense.enemies[2]?.health, 4);
} finally {
  Math.random = originalRandom;
}

console.log('defenseRules ok');
