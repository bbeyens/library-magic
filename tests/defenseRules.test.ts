import assert from 'node:assert/strict';
import {
  defenseEnemyEdgePoint,
  defenseEnemyDistanceFromCenter,
  defenseEnemyFullyVisible,
  defenseEnemyImpactPoint,
  defenseEnemyInTowerHitbox,
  defenseEnemyInTowerRange,
  defenseEnemyPathDistanceForCenterRange,
  defenseEnemyPosition,
  defenseSkeletonMageProjectileOriginPoint,
  nextDefenseSpeedMultiplier,
  randomDefenseTreeSpawnLane,
} from '../src/game/simulation/defenseRules.ts';
import {
  applyAction,
  defenseBaseSpeedMultiplier,
  defenseCriticalChance,
  defenseDamageMultiplier,
  defenseEffectiveSpeedMultiplier,
  defenseEnemyTowerDamage,
  defenseEnemyMaxHealthForWave,
  defenseEnemyReward,
  defenseEnemyRewardUpgradeDelta,
  defenseExperienceGain,
  defenseExperienceToNextLevel,
  defenseGoldMultiplier,
  defenseIceActive,
  defenseIceAttackInterval,
  defenseIceDamage,
  defenseIceDamageUpgradeDelta,
  defenseIceRangePercent,
  defenseIceSlow,
  defenseLightningAttackInterval,
  defenseLightningDamage,
  defenseLightningDamageUpgradeDelta,
  defenseLightningTargetCount,
  defenseRollbackWave,
  defenseSlimeMaxHealthForWave,
  defenseWaveEnemyCount,
  defenseWaveGoldBoostCount,
  defenseWaveGoldMultiplier,
  defenseWaveProgress,
  defenseLevelMultiplier,
  defenseMaxTowerHealth,
  defenseSkillCost,
  defenseSkillDamageMultiplier,
  defenseSkillLocked,
  defenseSkillMaxLevel,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseTowerDamageUpgradeDelta,
  defenseTowerHitDamage,
  defenseTowerHitResult,
  defenseTowerHealthRegenPerSecond,
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
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 1.08 }), { x: 104, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 180, distance: 1.08 }), { x: -4, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0.5 }), { x: 75, y: 50 });
assert.deepEqual(defenseEnemyPosition({ lane: 0, distance: 0 }), { x: 50, y: 50 });
assert.deepEqual(defenseEnemyImpactPoint({ kind: 'skeletonMage', lane: 0, distance: 0 }), { x: 50, y: 42.5 });
assert.deepEqual(defenseSkeletonMageProjectileOriginPoint({ lane: 0, distance: 0.35 }), { x: 64.688, y: 40.625 });
assert.deepEqual(defenseSkeletonMageProjectileOriginPoint({ lane: 180, distance: 0.35 }), { x: 35.313, y: 40.625 });
assert.equal(defenseEnemyPathDistanceForCenterRange({ lane: 0 }, 0.35), 0.35);
assert.equal(Number(defenseEnemyPathDistanceForCenterRange({ lane: 45 }, 0.35).toFixed(3)), 0.247);
assert.equal(Number(defenseEnemyDistanceFromCenter({ lane: 45, distance: defenseEnemyPathDistanceForCenterRange({ lane: 45 }, 0.35) }).toFixed(3)), 0.35);

assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.68 }, 0.68), true);
assert.equal(defenseEnemyInTowerRange({ lane: 0, distance: 0.69 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.68 }, 0.68), false);
assert.equal(defenseEnemyInTowerRange({ lane: 45, distance: 0.48 }, 0.68), true);
assert.equal(defenseEnemyFullyVisible({ lane: 0, distance: 0.87 }), true);
assert.equal(defenseEnemyFullyVisible({ lane: 0, distance: 0.88 }), false);
assert.equal(defenseEnemyFullyVisible({ kind: 'skeletonMage', lane: 270, distance: 0.7 }), true);
assert.equal(defenseEnemyFullyVisible({ kind: 'skeletonMage', lane: 270, distance: 0.72 }), false);

assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.162 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 0, distance: 0.163 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.162 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 90, distance: 0.163 }), false);
assert.equal(defenseEnemyInTowerHitbox({ lane: 45, distance: 0.114 }), true);
assert.equal(defenseEnemyInTowerHitbox({ lane: 45, distance: 0.115 }), false);
assert.equal(defenseEnemyInTowerHitbox({ kind: 'goblinKing', lane: 0, distance: 0.195 }), true);
assert.equal(defenseEnemyInTowerHitbox({ kind: 'goblinKing', lane: 0, distance: 0.196 }), false);
assert.equal(defenseEnemyInTowerHitbox({ kind: 'goblinKing', lane: 90, distance: 0.122 }), true);
assert.equal(defenseEnemyInTowerHitbox({ kind: 'goblinKing', lane: 90, distance: 0.123 }), false);
assert.equal(defenseEnemyInTowerHitbox({ kind: 'goblinKing', lane: 270, distance: 0.32 }), true);
assert.equal(defenseEnemyInTowerHitbox({ kind: 'goblinKing', lane: 270, distance: 0.321 }), false);

assert.equal(nextDefenseSpeedMultiplier(1), 2);
assert.equal(nextDefenseSpeedMultiplier(2), 4);
assert.equal(nextDefenseSpeedMultiplier(4), 1);
assert.equal(nextDefenseSpeedMultiplier(99), 1);
const defenseBaseSpeedState = createInitialState();
assert.equal(defenseBaseSpeedMultiplier(defenseBaseSpeedState), 1);
assert.equal(defenseEffectiveSpeedMultiplier(defenseBaseSpeedState), 1);
defenseBaseSpeedState.defenseSkills.baseSpeed = 5;
assert.equal(defenseBaseSpeedMultiplier(defenseBaseSpeedState), 1.5);
defenseBaseSpeedState.defense.speedMultiplier = 2;
assert.equal(defenseEffectiveSpeedMultiplier(defenseBaseSpeedState), 3);
applyAction(defenseBaseSpeedState, { type: 'toggleDefenseBaseSpeed' });
assert.equal(defenseBaseSpeedMultiplier(defenseBaseSpeedState), 1);
assert.equal(defenseEffectiveSpeedMultiplier(defenseBaseSpeedState), 2);
defenseBaseSpeedState.defenseSkills.baseSpeed = 10;
applyAction(defenseBaseSpeedState, { type: 'toggleDefenseBaseSpeed' });
assert.equal(defenseBaseSpeedMultiplier(defenseBaseSpeedState), 2);
defenseBaseSpeedState.defenseSkills.baseSpeed = 99;
assert.equal(defenseBaseSpeedMultiplier(defenseBaseSpeedState), 2);

const treeSpawnLanes = Array.from({ length: 120 }, (_, index) =>
  randomDefenseTreeSpawnLane(() => ((index * 37) % 120) / 120),
);
assert.equal(new Set(treeSpawnLanes.map((lane) => Math.round(lane))).size > 30, true);
for (const lane of treeSpawnLanes) {
  const edge = defenseEnemyEdgePoint(lane);
  const isOnMapEdge = edge.x === 0 || edge.x === 100 || edge.y === 0 || edge.y === 100;
  const isBottomDirtPathGap = edge.y === 100 && edge.x >= 40 && edge.x <= 60;
  assert.equal(isOnMapEdge, true);
  assert.equal(isBottomDirtPathGap, false);
}

const state = createInitialState();
state.books.defense.unlocked = true;
state.mana = 10000;

assert.equal(defenseSlimeMaxHealthForWave(1), 5);
assert.equal(defenseSlimeMaxHealthForWave(2), 6);
assert.equal(defenseEnemyMaxHealthForWave(2, 'slime'), 6);
assert.equal(defenseEnemyMaxHealthForWave(2, 'skeletonMage'), 4);
assert.equal(defenseEnemyMaxHealthForWave(2, 'bat'), 2);
assert.equal(defenseEnemyMaxHealthForWave(5, 'goblinKing'), defenseSlimeMaxHealthForWave(5) * 10);
assert.equal(defenseRollbackWave(1), 1);
assert.equal(defenseRollbackWave(12), 11);
assert.equal(defenseRollbackWave(24), 21);
assert.equal(defenseRollbackWave(84), 81);
assert.equal(defenseRollbackWave(100), 91);

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
  assert.equal(state.defenseSkills[skillId], 0);
  assert.equal(defenseSkillMaxLevel(skillId) > 0, true);
  assert.equal(defenseSkillCost(state, skillId) > 0, true);
}

applyAction(state, { type: 'buyDefenseSkill', skillId: 'damage' });
assert.equal(state.defenseSkills.damage, 0);
assert.equal(state.mana, 10000);

state.resources.sigils = 10000;

assert.equal(defenseTowerRangePercent(state), 0.3);
assert.equal(Math.round(defenseTowerRange(state) * 1000), 552);
assert.equal(defenseDamageMultiplier(state), 1);
assert.equal(defenseWaveEnemyCount(state), 1);
state.defense.wave = 2;
assert.equal(defenseWaveEnemyCount(state), 2);
state.defense.wave = 3;
assert.equal(defenseWaveEnemyCount(state), 3);
state.defense.wave = 12;
assert.equal(defenseWaveEnemyCount(state), 7);
state.defense.wave = 100;
assert.equal(defenseWaveEnemyCount(state), 18);
state.defense.wave = 1;
assert.equal(defenseSkillMaxLevel('lightningCount'), 5);
assert.equal(defenseSkillCost(state, 'damage'), 1);
assert.equal(defenseSkillCost(state, 'lightningCount'), 90);
assert.equal(defenseSkillCost(state, 'lightningDamage'), 40);
assert.equal(defenseSkillCost(state, 'lightningSpeed'), 30);
assert.equal(defenseSkillCost(state, 'iceDamage'), 50);
assert.equal(defenseSkillCost(state, 'iceSpeed'), 45);
assert.equal(defenseSkillCost(state, 'iceRange'), 60);
assert.equal(defenseSkillCost(state, 'iceSlow'), 55);
assert.equal(defenseSkillCost(state, 'healthRegen'), 14);
assert.equal(defenseSkillCost(state, 'goldMultiplier'), 30);
assert.equal(defenseSkillCost(state, 'baseSpeed'), 60);
assert.equal(defenseSkillMaxLevel('criticalChance'), 60);
const defenseCostTableState = createInitialState();
const expectedLightningCountCosts = [90, 1500, 50000, 250000, 3000000];
for (let level = 0; level < expectedLightningCountCosts.length; level += 1) {
  defenseCostTableState.defenseSkills.lightningCount = level;
  assert.equal(defenseSkillCost(defenseCostTableState, 'lightningCount'), expectedLightningCountCosts[level]);
}
defenseCostTableState.defenseSkills.damage = 17;
assert.equal(defenseSkillCost(defenseCostTableState, 'damage'), 1500);
defenseCostTableState.defenseSkills.damage = 59;
assert.equal(defenseSkillCost(defenseCostTableState, 'damage'), 10000000);
defenseCostTableState.defenseSkills.attackSpeed = 0;
assert.equal(defenseSkillCost(defenseCostTableState, 'attackSpeed'), 3);
defenseCostTableState.defenseSkills.attackSpeed = 24;
assert.equal(defenseSkillCost(defenseCostTableState, 'attackSpeed'), 50000000);
defenseCostTableState.defenseSkills.range = 13;
assert.equal(defenseSkillCost(defenseCostTableState, 'range'), 2000000);
defenseCostTableState.defenseSkills.range = 24;
assert.equal(defenseSkillCost(defenseCostTableState, 'range'), 500000000);
defenseCostTableState.defenseSkills.moneyPerEnemy = 0;
assert.equal(defenseSkillCost(defenseCostTableState, 'moneyPerEnemy'), 10);
defenseCostTableState.defenseSkills.moneyPerEnemy = 11;
assert.equal(defenseSkillCost(defenseCostTableState, 'moneyPerEnemy'), 100000);
defenseCostTableState.defenseSkills.moneyPerEnemy = 39;
assert.equal(defenseSkillCost(defenseCostTableState, 'moneyPerEnemy'), 220000000);
defenseCostTableState.defenseSkills.damageMultiplier = 39;
assert.equal(defenseSkillCost(defenseCostTableState, 'damageMultiplier'), 750000000);
defenseCostTableState.defenseSkills.criticalChance = 49;
assert.equal(defenseSkillCost(defenseCostTableState, 'criticalChance'), 18200000);
defenseCostTableState.defenseSkills.criticalChance = 59;
assert.equal(defenseSkillCost(defenseCostTableState, 'criticalChance'), 260000000);
defenseCostTableState.defenseSkills.lightningDamage = 49;
assert.equal(defenseSkillCost(defenseCostTableState, 'lightningDamage'), 400000000);
defenseCostTableState.defenseSkills.lightningSpeed = 23;
assert.equal(defenseSkillCost(defenseCostTableState, 'lightningSpeed'), 500000000);
defenseCostTableState.defenseSkills.iceRange = 20;
assert.equal(defenseSkillCost(defenseCostTableState, 'iceRange'), 250000000);
const expectedGoldMultiplierCostAnchors = [
  [0, 30],
  [1, 75],
  [2, 120],
  [3, 160],
  [4, 250],
  [5, 500],
  [6, 1000],
  [7, 2000],
  [8, 4000],
  [9, 7500],
  [14, 50000],
  [19, 200000],
  [29, 1500000],
  [39, 7000000],
  [49, 25000000],
  [59, 70000000],
  [74, 200000000],
  [89, 468000000],
] as const;
for (const [level, cost] of expectedGoldMultiplierCostAnchors) {
  defenseCostTableState.defenseSkills.goldMultiplier = level;
  assert.equal(defenseSkillCost(defenseCostTableState, 'goldMultiplier'), cost);
}
defenseCostTableState.defenseSkills.goldMultiplier = defenseSkillMaxLevel('goldMultiplier') - 1;
assert.equal(defenseSkillCost(defenseCostTableState, 'goldMultiplier'), 468000000);
for (const skillId of defenseSkillIds) {
  const monotonicState = createInitialState();
  let previousCost = 0;
  for (let level = 0; level < defenseSkillMaxLevel(skillId); level += 1) {
    monotonicState.defenseSkills[skillId] = level;
    const cost = defenseSkillCost(monotonicState, skillId);
    assert.equal(cost >= previousCost, true, `${skillId} cost should not drop at level ${level}`);
    previousCost = cost;
  }
}
assert.equal(defenseEnemyReward(state), 1);
assert.equal(defenseEnemyRewardUpgradeDelta(state), 1);
assert.equal(state.defense.level, 0);
assert.equal(state.defense.xp, 0);
assert.equal(defenseExperienceToNextLevel(0), 10);
assert.equal(defenseExperienceToNextLevel(1), 25);
assert.equal(defenseLevelMultiplier(state), 1);
assert.equal(defenseExperienceGain(state, 'slime'), 1);
assert.equal(defenseExperienceGain(state, 'skeletonMage'), 1);
assert.equal(defenseExperienceGain(state, 'bat'), 1);
assert.equal(defenseExperienceGain(state, 'goblinKing'), 10);
assert.equal(defenseEnemyReward(state, 'slime'), 1);
assert.equal(defenseEnemyReward(state, 'skeletonMage'), 1.5);
assert.equal(defenseEnemyReward(state, 'bat'), 1.5);
assert.equal(defenseEnemyReward(state, 'goblinKing'), 3);
state.defense.wave = 10;
assert.equal(defenseEnemyReward(state), 2);
state.defense.wave = 11;
assert.equal(defenseEnemyReward(state), 4);
assert.equal(defenseEnemyRewardUpgradeDelta(state), 2);
state.defense.wave = 21;
assert.equal(defenseEnemyReward(state), 12);
assert.equal(defenseEnemyRewardUpgradeDelta(state), 4);
state.defense.wave = 31;
assert.equal(defenseEnemyReward(state), 32);
state.defense.wave = 1;

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
assert.equal(defenseTowerAttackInterval(noSkillBookLevelState), 1.5);

tickState(noSkillBookLevelState, 3016);

assert.equal(noSkillBookLevelState.defense.shotPulse, 1);
assert.equal(noSkillBookLevelState.defense.shots.length, 1);
assert.equal(noSkillBookLevelState.defense.damagePopups[0]?.amount, 1);
assert.equal(Number(noSkillBookLevelState.defense.enemies[0]?.health.toFixed(1)), 1);
assert.equal(noSkillBookLevelState.defense.enemies[0]?.state, 'walking');

const firstWaveSpawnState = createInitialState();
firstWaveSpawnState.books.defense.unlocked = true;
firstWaveSpawnState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
firstWaveSpawnState.lastTick = 3200;
firstWaveSpawnState.defense.spawnTimer = 99;
firstWaveSpawnState.defense.tower.cooldown = 99;

tickState(firstWaveSpawnState, 3216);
tickState(firstWaveSpawnState, 4216);

assert.equal(firstWaveSpawnState.defense.wave, 1);
assert.equal(firstWaveSpawnState.defense.spawnedThisWave, 1);
assert.equal(firstWaveSpawnState.defense.enemies.length, 1);
assert.equal(firstWaveSpawnState.defense.enemies[0]?.kind, 'slime');
assert.equal(firstWaveSpawnState.defense.enemies[0]?.maxHealth, 5);

const secondWaveSpawnState = createInitialState();
secondWaveSpawnState.books.defense.unlocked = true;
secondWaveSpawnState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
secondWaveSpawnState.lastTick = 3300;
secondWaveSpawnState.defense.wave = 2;
secondWaveSpawnState.defense.spawnTimer = 99;
secondWaveSpawnState.defense.tower.cooldown = 99;

tickState(secondWaveSpawnState, 3316);
tickState(secondWaveSpawnState, 4316);

assert.equal(secondWaveSpawnState.defense.wave, 2);
assert.equal(secondWaveSpawnState.defense.spawnedThisWave, 2);
assert.equal(secondWaveSpawnState.defense.enemies.length, 2);
assert.deepEqual(
  secondWaveSpawnState.defense.enemies.map((enemy) => [enemy.kind ?? 'slime', enemy.maxHealth]),
  [
    ['slime', 6],
    ['slime', 6],
  ],
);

const originalRandom = Math.random;
try {
  const spawnDelayState = createInitialState();
  spawnDelayState.books.defense.unlocked = true;
  spawnDelayState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
  spawnDelayState.lastTick = 5000;
  spawnDelayState.defense.wave = 2;
  spawnDelayState.defense.spawnTimer = 0;
  spawnDelayState.defense.tower.cooldown = 99;
  Math.random = () => 1;

  tickState(spawnDelayState, 5016);

  assert.equal(spawnDelayState.defense.spawnedThisWave, 0);
  assert.equal(spawnDelayState.defense.enemies.length, 0);
  assert.equal(Number(spawnDelayState.defense.nextSpawnDelay.toFixed(2)), 0.94);

  tickState(spawnDelayState, 5915);
  assert.equal(spawnDelayState.defense.spawnedThisWave, 0);

  tickState(spawnDelayState, 5956);
  assert.equal(spawnDelayState.defense.spawnedThisWave, 1);
  assert.equal(spawnDelayState.defense.enemies.length, 1);

  const groupedWaveState = createInitialState();
  groupedWaveState.books.defense.unlocked = true;
  groupedWaveState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
  groupedWaveState.lastTick = 6000;
  groupedWaveState.defense.wave = 12;
  groupedWaveState.defense.spawnTimer = 99;
  groupedWaveState.defense.tower.cooldown = 99;
  Math.random = () => 0;

  tickState(groupedWaveState, 6016);

  assert.equal(defenseWaveEnemyCount(groupedWaveState), 7);
  assert.equal(groupedWaveState.defense.spawnedThisWave, 2);
  assert.equal(groupedWaveState.defense.enemies.length, 2);
  assert.equal(Number(groupedWaveState.defense.nextSpawnDelay.toFixed(2)), 0.1);

  const tripleWaveState = createInitialState();
  tripleWaveState.books.defense.unlocked = true;
  tripleWaveState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
  tripleWaveState.lastTick = 7000;
  tripleWaveState.defense.wave = 43;
  tripleWaveState.defense.spawnTimer = 99;
  tripleWaveState.defense.tower.cooldown = 99;

  tickState(tripleWaveState, 7016);

  assert.equal(defenseWaveEnemyCount(tripleWaveState) >= 12, true);
  assert.equal(tripleWaveState.defense.spawnedThisWave, 3);
  assert.equal(tripleWaveState.defense.enemies.length, 3);
} finally {
  Math.random = originalRandom;
}

const pausedDefenseState = createInitialState();
pausedDefenseState.books.defense.unlocked = true;
pausedDefenseState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
pausedDefenseState.selectedBook = 'defense';
pausedDefenseState.lastTick = 3500;
pausedDefenseState.defense.tower.cooldown = 0;
pausedDefenseState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 2, maxHealth: 2, state: 'walking', deathTimer: 0 },
];

applyAction(pausedDefenseState, { type: 'toggleDefensePause' });
tickState(pausedDefenseState, 3600);

assert.equal(pausedDefenseState.defense.paused, true);
assert.equal(pausedDefenseState.defense.running, false);
assert.equal(pausedDefenseState.defense.shotPulse, 0);
assert.equal(pausedDefenseState.defense.enemies[0]?.distance, 0.4);
assert.equal(pausedDefenseState.defense.enemies[0]?.health, 2);

applyAction(pausedDefenseState, { type: 'toggleDefensePause' });
tickState(pausedDefenseState, 3616);

assert.equal(pausedDefenseState.defense.paused, false);
assert.equal(pausedDefenseState.defense.shotPulse, 1);
assert.equal(Number(pausedDefenseState.defense.enemies[0]?.health.toFixed(1)), 1);

const noHitStopState = createInitialState();
noHitStopState.books.defense.unlocked = true;
noHitStopState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
noHitStopState.lastTick = 5000;
noHitStopState.defense.tower.cooldown = 0;
noHitStopState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 2, maxHealth: 2, state: 'walking', deathTimer: 0 },
];

tickState(noHitStopState, 5016);

assert.equal(Number(noHitStopState.defense.enemies[0]?.health.toFixed(1)), 1);
assert.equal((noHitStopState.defense.enemies[0]?.distance ?? 0) < 0.4, true);

const waveProgressState = createInitialState();
waveProgressState.books.defense.unlocked = true;
waveProgressState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
waveProgressState.lastTick = 4000;
waveProgressState.defense.spawnedThisWave = 3;

assert.equal(defenseWaveProgress(waveProgressState), 0);

waveProgressState.defense.tower.cooldown = 0;
waveProgressState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];

tickState(waveProgressState, 4016);

assert.equal(waveProgressState.defense.enemies[0]?.state, 'dying');
assert.equal(waveProgressState.defense.killsThisWave, 1);
assert.equal(waveProgressState.defense.xp, 1);
assert.equal(waveProgressState.defense.level, 0);
assert.equal(waveProgressState.defense.lastXpGain, 1);
assert.equal(waveProgressState.defense.moneyPopups.length, 1);
assert.equal(waveProgressState.defense.moneyPopups[0]?.amount, defenseEnemyReward(waveProgressState));
assert.equal(waveProgressState.defense.moneyPopups[0]?.delay, 0.5);
assert.equal(waveProgressState.defense.moneyPopups[0]?.counterDelay, 1.5);
assert.equal(waveProgressState.defense.moneyPopups[0]?.timer, 2.45);
assert.equal(waveProgressState.defense.enemies[0]?.lastHitSource, 'normal');
assert.equal(waveProgressState.defense.damagePopups[0]?.source, 'normal');
assert.equal(defenseWaveProgress(waveProgressState), 1 / defenseWaveEnemyCount(waveProgressState));

tickState(waveProgressState, 4266);

assert.equal(waveProgressState.defense.moneyPopups[0]?.delay, 0.25);
assert.equal(waveProgressState.defense.moneyPopups[0]?.counterDelay, 1.25);
assert.equal(waveProgressState.defense.moneyPopups[0]?.timer, 2.45);

tickState(waveProgressState, 4516);

assert.equal(waveProgressState.defense.moneyPopups[0]?.delay, 0);
assert.equal(waveProgressState.defense.moneyPopups[0]?.counterDelay, 1);
assert.equal(waveProgressState.defense.moneyPopups[0]?.timer, 2.45);

tickState(waveProgressState, 5516);

assert.equal(waveProgressState.defense.moneyPopups[0]?.delay, 0);
assert.equal(waveProgressState.defense.moneyPopups[0]?.counterDelay, 0);
assert.equal(Number(waveProgressState.defense.moneyPopups[0]?.timer.toFixed(2)), 1.45);

const defenseLevelUpState = createInitialState();
defenseLevelUpState.books.defense.unlocked = true;
defenseLevelUpState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
defenseLevelUpState.lastTick = 4500;
defenseLevelUpState.defense.tower.cooldown = 999;
defenseLevelUpState.defense.xp = 9;
defenseLevelUpState.defense.enemies = [
  { id: 1, kind: 'goblinKing', lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
defenseLevelUpState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(defenseLevelUpState, 4516);

assert.equal(defenseLevelUpState.defense.level, 1);
assert.equal(defenseLevelUpState.defense.xp, 9);
assert.equal(defenseLevelMultiplier(defenseLevelUpState), 1.05);
assert.equal(defenseLevelUpState.defense.lastXpGain, 10);

const waveCompleteNoHealState = createInitialState();
waveCompleteNoHealState.books.defense.unlocked = true;
waveCompleteNoHealState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
waveCompleteNoHealState.lastTick = 5000;
waveCompleteNoHealState.defense.towerHealth = 1;
waveCompleteNoHealState.defense.spawnedThisWave = defenseWaveEnemyCount(waveCompleteNoHealState);
waveCompleteNoHealState.defense.nextEnemyId = 777;
waveCompleteNoHealState.defense.nextEnemyProjectileId = 333;
const waveCompleteCleanupPulse = waveCompleteNoHealState.defense.cleanupPulse;

tickState(waveCompleteNoHealState, 5016);

assert.equal(waveCompleteNoHealState.defense.wave, 2);
assert.equal(waveCompleteNoHealState.defense.towerHealth, 1);
assert.equal(waveCompleteNoHealState.defense.lastGoldBoostWave, 0);
assert.equal(waveCompleteNoHealState.defense.nextEnemyId, 1);
assert.equal(waveCompleteNoHealState.defense.nextEnemyProjectileId, 1);
assert.equal(waveCompleteNoHealState.defense.cleanupPulse, waveCompleteCleanupPulse + 1);

const legacyWaveCleanupState = createInitialState();
legacyWaveCleanupState.books.defense.unlocked = true;
legacyWaveCleanupState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
legacyWaveCleanupState.lastTick = 5010;
legacyWaveCleanupState.defense.spawnedThisWave = defenseWaveEnemyCount(legacyWaveCleanupState);
delete (legacyWaveCleanupState.defense as Partial<typeof legacyWaveCleanupState.defense>).cleanupPulse;

tickState(legacyWaveCleanupState, 5026);

assert.equal(legacyWaveCleanupState.defense.wave, 2);
assert.equal(legacyWaveCleanupState.defense.cleanupPulse, 1);

const waveGoldBoostState = createInitialState();
waveGoldBoostState.books.defense.unlocked = true;
waveGoldBoostState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
waveGoldBoostState.lastTick = 5018;
waveGoldBoostState.defense.wave = 10;
waveGoldBoostState.defense.killsThisWave = defenseWaveEnemyCount(waveGoldBoostState);
waveGoldBoostState.defense.spawnedThisWave = defenseWaveEnemyCount(waveGoldBoostState);

tickState(waveGoldBoostState, 5034);

assert.equal(waveGoldBoostState.defense.wave, 11);
assert.equal(waveGoldBoostState.defense.lastGoldBoostWave, 11);
assert.equal(defenseWaveGoldBoostCount(waveGoldBoostState), 1);
assert.equal(defenseWaveGoldMultiplier(waveGoldBoostState), 2);

waveGoldBoostState.defense.killsThisWave = defenseWaveEnemyCount(waveGoldBoostState);
waveGoldBoostState.defense.spawnedThisWave = defenseWaveEnemyCount(waveGoldBoostState);

tickState(waveGoldBoostState, 5050);

assert.equal(waveGoldBoostState.defense.wave, 12);
assert.equal(waveGoldBoostState.defense.lastGoldBoostWave, 11);
assert.equal(defenseWaveGoldBoostCount(waveGoldBoostState), 1);

const finalWaveLoopState = createInitialState();
finalWaveLoopState.books.defense.unlocked = true;
finalWaveLoopState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
finalWaveLoopState.lastTick = 5020;
finalWaveLoopState.defense.wave = 100;
finalWaveLoopState.defense.killsThisWave = defenseWaveEnemyCount(finalWaveLoopState);
finalWaveLoopState.defense.spawnedThisWave = defenseWaveEnemyCount(finalWaveLoopState);
finalWaveLoopState.defense.nextEnemyId = 812;
finalWaveLoopState.defense.nextEnemyProjectileId = 404;
const finalWaveCleanupPulse = finalWaveLoopState.defense.cleanupPulse;

tickState(finalWaveLoopState, 5036);

assert.equal(finalWaveLoopState.defense.wave, 100);
assert.equal(finalWaveLoopState.defense.lastGoldBoostWave, 100);
assert.equal(defenseWaveGoldBoostCount(finalWaveLoopState), 10);
assert.equal(defenseWaveGoldMultiplier(finalWaveLoopState), 1024);
assert.equal(finalWaveLoopState.defense.killsThisWave, 0);
assert.equal(finalWaveLoopState.defense.spawnedThisWave, 0);
assert.equal(finalWaveLoopState.defense.nextEnemyId, 1);
assert.equal(finalWaveLoopState.defense.nextEnemyProjectileId, 1);
assert.equal(finalWaveLoopState.defense.cleanupPulse, finalWaveCleanupPulse + 1);

const deathRollbackState = createInitialState();
deathRollbackState.books.defense.unlocked = true;
deathRollbackState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
deathRollbackState.lastTick = 5050;
deathRollbackState.defense.wave = 24;
deathRollbackState.defense.towerHealth = 0;

tickState(deathRollbackState, 5066);

assert.equal(deathRollbackState.defense.wave, 24);
assert.equal(deathRollbackState.defense.towerHealth, 0);
assert.equal(deathRollbackState.defense.deathTimer, 3);

tickState(deathRollbackState, 6066);
tickState(deathRollbackState, 7066);
tickState(deathRollbackState, 8066);

assert.equal(deathRollbackState.defense.wave, 21);
assert.equal(deathRollbackState.defense.towerHealth, defenseMaxTowerHealth(deathRollbackState));
assert.equal(deathRollbackState.defense.enemies.length, 0);
assert.equal(deathRollbackState.defense.deathTimer, 0);

const clusteredRewardState = createInitialState();
clusteredRewardState.books.defense.unlocked = true;
clusteredRewardState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
clusteredRewardState.lastTick = 6000;
clusteredRewardState.defense.tower.cooldown = 999;
clusteredRewardState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 1, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
clusteredRewardState.defense.queuedShots = [
  { enemyId: 1, damageScale: 1 },
  { enemyId: 2, damageScale: 1 },
];

tickState(clusteredRewardState, 6016);
tickState(clusteredRewardState, 6096);

assert.equal(clusteredRewardState.defense.killsThisWave, 2);
assert.equal(clusteredRewardState.defense.moneyPopups.length, 1);
assert.equal(clusteredRewardState.defense.moneyPopups[0]?.amount, defenseEnemyReward(clusteredRewardState) * 2);
assert.equal(clusteredRewardState.defense.moneyPopups[0]?.combo, 2);

const resetRewardPopupColorState = createInitialState();
resetRewardPopupColorState.books.defense.unlocked = true;
resetRewardPopupColorState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
resetRewardPopupColorState.lastTick = 6200;
resetRewardPopupColorState.defense.tower.cooldown = 999;
resetRewardPopupColorState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 1, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
resetRewardPopupColorState.defense.queuedShots = [
  { enemyId: 1, damageScale: 1 },
  { enemyId: 2, damageScale: 1 },
];

tickState(resetRewardPopupColorState, 6216);
tickState(resetRewardPopupColorState, 6467);

assert.equal(resetRewardPopupColorState.defense.killsThisWave, 2);
assert.equal(resetRewardPopupColorState.defense.moneyPopups.length, 2);
assert.equal(resetRewardPopupColorState.defense.moneyPopups[1]?.amount, defenseEnemyReward(resetRewardPopupColorState));
assert.equal(resetRewardPopupColorState.defense.moneyPopups[1]?.combo, 1);

const earlyWaveCoinCountState = createInitialState();
earlyWaveCoinCountState.books.defense.unlocked = true;
earlyWaveCoinCountState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
earlyWaveCoinCountState.lastTick = 6500;
earlyWaveCoinCountState.defense.wave = 30;
earlyWaveCoinCountState.defense.tower.cooldown = 999;
earlyWaveCoinCountState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
earlyWaveCoinCountState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(earlyWaveCoinCountState, 6516);

assert.equal(earlyWaveCoinCountState.defense.moneyPopups[0]?.coinCount, 1);

const midWaveCoinCountState = createInitialState();
midWaveCoinCountState.books.defense.unlocked = true;
midWaveCoinCountState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
midWaveCoinCountState.lastTick = 6550;
midWaveCoinCountState.defense.wave = 31;
midWaveCoinCountState.defense.tower.cooldown = 999;
midWaveCoinCountState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
midWaveCoinCountState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(midWaveCoinCountState, 6566);

assert.equal(midWaveCoinCountState.defense.moneyPopups[0]?.coinCount, 1);

const lateWaveCoinCountState = createInitialState();
lateWaveCoinCountState.books.defense.unlocked = true;
lateWaveCoinCountState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
lateWaveCoinCountState.lastTick = 6570;
lateWaveCoinCountState.defense.wave = 61;
lateWaveCoinCountState.defense.tower.cooldown = 999;
lateWaveCoinCountState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
lateWaveCoinCountState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(lateWaveCoinCountState, 6586);

assert.equal(lateWaveCoinCountState.defense.moneyPopups[0]?.coinCount, 1);

const goblinCoinCountState = createInitialState();
goblinCoinCountState.books.defense.unlocked = true;
goblinCoinCountState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
goblinCoinCountState.lastTick = 6600;
goblinCoinCountState.defense.wave = 5;
goblinCoinCountState.defense.tower.cooldown = 999;
goblinCoinCountState.defense.enemies = [
  { id: 1, kind: 'goblinKing', lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
goblinCoinCountState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(goblinCoinCountState, 6616);

assert.equal(goblinCoinCountState.defense.moneyPopups[0]?.coinCount, 1);

const midWaveGoblinCoinCountState = createInitialState();
midWaveGoblinCoinCountState.books.defense.unlocked = true;
midWaveGoblinCoinCountState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
midWaveGoblinCoinCountState.lastTick = 6700;
midWaveGoblinCoinCountState.defense.wave = 31;
midWaveGoblinCoinCountState.defense.tower.cooldown = 999;
midWaveGoblinCoinCountState.defense.enemies = [
  { id: 1, kind: 'goblinKing', lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
midWaveGoblinCoinCountState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(midWaveGoblinCoinCountState, 6716);

assert.equal(midWaveGoblinCoinCountState.defense.moneyPopups[0]?.coinCount, 1);

const turboMoneyCoinCountState = createInitialState();
turboMoneyCoinCountState.books.defense.unlocked = true;
turboMoneyCoinCountState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
turboMoneyCoinCountState.lastTick = 6800;
turboMoneyCoinCountState.defense.wave = 91;
turboMoneyCoinCountState.defense.speedMultiplier = 4;
turboMoneyCoinCountState.defense.tower.cooldown = 999;
turboMoneyCoinCountState.defense.enemies = [
  { id: 1, kind: 'goblinKing', lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 2, kind: 'slime', lane: 90, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 3, kind: 'bat', lane: 180, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 4, kind: 'skeletonMage', lane: 270, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 5, kind: 'slime', lane: 45, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];
turboMoneyCoinCountState.defense.queuedShots = turboMoneyCoinCountState.defense.enemies.map((enemy) => ({
  enemyId: enemy.id,
  damageScale: 1,
}));

tickState(turboMoneyCoinCountState, 6816);

assert.equal(turboMoneyCoinCountState.defense.moneyPopups.length, 1);
assert.equal(turboMoneyCoinCountState.defense.moneyPopups[0]?.coinCount, 1);

const retargetQueuedShotState = createInitialState();
retargetQueuedShotState.books.defense.unlocked = true;
retargetQueuedShotState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
retargetQueuedShotState.lastTick = 7000;
retargetQueuedShotState.defense.tower.cooldown = 999;
retargetQueuedShotState.defense.spawnedThisWave = defenseWaveEnemyCount(retargetQueuedShotState);
retargetQueuedShotState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 2, distance: 0.42, health: 3, maxHealth: 3, state: 'walking', deathTimer: 0 },
];
retargetQueuedShotState.defense.queuedShots = [
  { enemyId: 1, damageScale: 1 },
  { enemyId: 1, damageScale: 1 },
];

tickState(retargetQueuedShotState, 7016);
tickState(retargetQueuedShotState, 7096);

assert.equal(retargetQueuedShotState.defense.enemies[0]?.id, 1);
assert.equal(retargetQueuedShotState.defense.enemies[0]?.state, 'dying');
assert.equal(retargetQueuedShotState.defense.enemies[1]?.id, 2);
assert.equal(retargetQueuedShotState.defense.enemies[1]?.health, 2);
assert.equal(retargetQueuedShotState.defense.shots.length, 2);
assert.equal(retargetQueuedShotState.defense.queuedShots.length, 0);

const stopQueuedShotState = createInitialState();
stopQueuedShotState.books.defense.unlocked = true;
stopQueuedShotState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
stopQueuedShotState.lastTick = 7200;
stopQueuedShotState.defense.tower.cooldown = 999;
stopQueuedShotState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 0, maxHealth: 1, state: 'dying', deathTimer: 0.5 },
];
stopQueuedShotState.defense.queuedShots = [{ enemyId: 1, damageScale: 1 }];

tickState(stopQueuedShotState, 7216);

assert.equal(stopQueuedShotState.defense.shots.length, 0);
assert.equal(stopQueuedShotState.defense.damagePopups.length, 0);
assert.equal(stopQueuedShotState.defense.queuedShots.length, 0);

const sigilsBeforeDefenseSkillBuy = state.resources.sigils;
const damageSkillCost = defenseSkillCost(state, 'damage');
applyAction(state, { type: 'buyDefenseSkill', skillId: 'damage' });
assert.equal(state.defenseSkills.damage, 1);
assert.equal(state.resources.sigils, sigilsBeforeDefenseSkillBuy - damageSkillCost);
assert.equal(state.mana, 10000);

applyAction(state, { type: 'buyDefenseSkill', skillId: 'attackSpeed' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'range' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'health' });
applyAction(state, { type: 'buyDefenseSkill', skillId: 'moneyPerEnemy' });

assert.equal(state.defenseSkills.damage, 1);
assert.equal(state.mana, 10000);

const lockedElementSkillState = createInitialState();
lockedElementSkillState.books.defense.unlocked = true;
lockedElementSkillState.resources.sigils = 10000;
assert.equal(defenseSkillLocked(lockedElementSkillState, 'iceSpeed'), true);
assert.equal(defenseSkillLocked(lockedElementSkillState, 'iceRange'), true);
assert.equal(defenseSkillLocked(lockedElementSkillState, 'iceSlow'), true);
assert.equal(defenseSkillLocked(lockedElementSkillState, 'lightningDamage'), true);
assert.equal(defenseSkillLocked(lockedElementSkillState, 'lightningSpeed'), true);
const sigilsBeforeLockedBuy = lockedElementSkillState.resources.sigils;
applyAction(lockedElementSkillState, { type: 'buyDefenseSkill', skillId: 'iceSpeed' });
applyAction(lockedElementSkillState, { type: 'buyDefenseSkill', skillId: 'lightningDamage' });
assert.equal(lockedElementSkillState.defenseSkills.iceSpeed, 0);
assert.equal(lockedElementSkillState.defenseSkills.lightningDamage, 0);
assert.equal(lockedElementSkillState.resources.sigils, sigilsBeforeLockedBuy);

applyAction(lockedElementSkillState, { type: 'buyDefenseSkill', skillId: 'iceDamage' });
assert.equal(defenseSkillLocked(lockedElementSkillState, 'iceSpeed'), false);
applyAction(lockedElementSkillState, { type: 'buyDefenseSkill', skillId: 'iceSpeed' });
assert.equal(lockedElementSkillState.defenseSkills.iceSpeed, 1);

applyAction(lockedElementSkillState, { type: 'buyDefenseSkill', skillId: 'lightningCount' });
assert.equal(defenseSkillLocked(lockedElementSkillState, 'lightningDamage'), false);
assert.equal(defenseSkillLocked(lockedElementSkillState, 'lightningSpeed'), false);
applyAction(lockedElementSkillState, { type: 'buyDefenseSkill', skillId: 'lightningDamage' });
applyAction(lockedElementSkillState, { type: 'buyDefenseSkill', skillId: 'lightningSpeed' });
assert.equal(lockedElementSkillState.defenseSkills.lightningDamage, 1);
assert.equal(lockedElementSkillState.defenseSkills.lightningSpeed, 1);

const baseTowerHealthState = createInitialState();
assert.equal(baseTowerHealthState.defense.towerHealth, 3);
assert.equal(defenseMaxTowerHealth(baseTowerHealthState), 3);
assert.equal(defenseMaxTowerHealth(state), 5);
state.defenseSkills.healthRegen = 3;
assert.equal(defenseTowerHealthRegenPerSecond(state).toFixed(2), '0.06');
state.defenseSkills.healthRegen = 0;
assert.equal(defenseTowerDamage(state), 2);
assert.equal(defenseTowerDamageUpgradeDelta(state), 1);
state.defenseSkills.damageMultiplier = 4;
assert.equal(defenseSkillDamageMultiplier(state), 1.4);
assert.equal(defenseDamageMultiplier(state), 1.4);
assert.equal(defenseTowerDamage(state), 2.8);
assert.equal(defenseTowerDamageUpgradeDelta(state), 1.4);
state.defenseSkills.damage = 9;
assert.equal(defenseTowerDamage(state), 14);
assert.equal(defenseTowerAttackInterval(state) < 1.5, true);
state.defenseSkills.attackSpeed = defenseSkillMaxLevel('attackSpeed');
assert.equal(defenseTowerAttackInterval(state), 0.25);
state.defenseSkills.attackSpeed = 1;
assert.equal(defenseTowerAttackInterval(state), 1.45);
assert.equal(defenseTowerRangePercent(state) > 0.3, true);
assert.equal(defenseTowerRange(state) > 0.552, true);
assert.equal(defenseSkillMaxLevel('range'), 25);
for (let rangeLevel = 0; rangeLevel <= defenseSkillMaxLevel('range'); rangeLevel += 1) {
  state.defenseSkills.range = rangeLevel;
  assert.equal(Number(defenseTowerRangePercent(state).toFixed(2)), Number((0.3 + rangeLevel * 0.02).toFixed(2)));
}
state.defenseSkills.range = defenseSkillMaxLevel('range');
assert.equal(defenseTowerRangePercent(state), 0.8);
assert.equal(Math.round(defenseTowerRange(state) * 1000), 872);
state.defenseSkills.criticalChance = 0;
assert.equal(defenseCriticalChance(state), 0);
state.defenseSkills.criticalChance = 49;
assert.equal(defenseCriticalChance(state), 0.49);
state.defenseSkills.criticalChance = defenseSkillMaxLevel('criticalChance');
assert.equal(defenseCriticalChance(state), 0.6);
state.defenseSkills.criticalChance = defenseSkillMaxLevel('criticalChance') + 10;
assert.equal(defenseCriticalChance(state), 0.6);
assert.equal(defenseMaxTowerHealth(state), 5);
state.defenseSkills.damageMultiplier = 0;
assert.equal(defenseLightningDamage(state), 10);
assert.equal(defenseLightningDamageUpgradeDelta(state), 5);
assert.equal(defenseLightningTargetCount(state), 0);
assert.equal(defenseIceActive(state), false);
assert.equal(defenseIceDamage(state), 0);
assert.equal(defenseIceDamageUpgradeDelta(state), 3);
state.defenseSkills.lightningDamage = 2;
state.defenseSkills.lightningSpeed = 3;
state.defenseSkills.lightningCount = 2;
assert.equal(defenseLightningDamage(state), 20);
assert.equal(defenseLightningDamageUpgradeDelta(state), 5);
assert.equal(defenseLightningTargetCount(state), 2);
assert.equal(defenseLightningAttackInterval(state).toFixed(2), '2.36');
state.defenseSkills.iceDamage = 1;
assert.equal(defenseIceActive(state), true);
assert.equal(defenseIceDamage(state), 3);
assert.equal(defenseIceDamageUpgradeDelta(state), 2);
state.defenseSkills.damageMultiplier = 20;
assert.equal(defenseSkillDamageMultiplier(state), 3);
assert.equal(defenseDamageMultiplier(state), 3);
assert.equal(defenseLightningDamage(state), 60);
assert.equal(defenseLightningDamageUpgradeDelta(state), 15);
assert.equal(defenseIceDamage(state), 9);
assert.equal(defenseIceDamageUpgradeDelta(state), 6);
state.defenseSkills.damageMultiplier = 0;
assert.equal(defenseIceAttackInterval(state), 2);
state.defenseSkills.iceRange = 1;
assert.equal(defenseIceRangePercent(state), 0.35);
assert.equal(defenseIceSlow(state), 0.3);
assert.equal(defenseSkillMaxLevel('iceRange'), 21);
for (let iceRangeLevel = 1; iceRangeLevel <= defenseSkillMaxLevel('iceRange'); iceRangeLevel += 1) {
  state.defenseSkills.iceRange = iceRangeLevel;
  assert.equal(Number(defenseIceRangePercent(state).toFixed(2)), Number((0.35 + (iceRangeLevel - 1) * 0.02).toFixed(2)));
}
state.defenseSkills.iceSpeed = defenseSkillMaxLevel('iceSpeed');
state.defenseSkills.iceRange = defenseSkillMaxLevel('iceRange');
state.defenseSkills.iceSlow = defenseSkillMaxLevel('iceSlow');
assert.equal(defenseSkillMaxLevel('iceSlow'), 20);
assert.equal(defenseIceAttackInterval(state), 0.5);
assert.equal(defenseIceRangePercent(state), 0.75);
assert.equal(defenseIceSlow(state), 0.7);
assert.equal(defenseEnemyReward(state), 2);
assert.equal(defenseGoldMultiplier(state), 1);
state.defenseSkills.goldMultiplier = 1;
assert.equal(defenseGoldMultiplier(state), 1.1);
assert.equal(defenseEnemyReward(state), 2.2);
state.defenseSkills.goldMultiplier = defenseSkillMaxLevel('goldMultiplier');
assert.equal(defenseGoldMultiplier(state), 10);
assert.equal(defenseEnemyReward(state), 20);

const defenseLevelBonusState = createInitialState();
defenseLevelBonusState.books.defense.unlocked = true;
defenseLevelBonusState.defense.level = 3;
assert.equal(defenseLevelMultiplier(defenseLevelBonusState), 1.15);
assert.equal(defenseTowerDamage(defenseLevelBonusState), 1.2);
assert.equal(defenseTowerDamageUpgradeDelta(defenseLevelBonusState), 1.1);
defenseLevelBonusState.defenseSkills.damage = 9;
assert.equal(defenseTowerDamage(defenseLevelBonusState), 11.5);
assert.equal(defenseEnemyReward(defenseLevelBonusState), 1.2);
defenseLevelBonusState.defenseSkills.moneyPerEnemy = 1;
assert.equal(defenseEnemyReward(defenseLevelBonusState), 2.3);
assert.equal(defenseEnemyRewardUpgradeDelta(defenseLevelBonusState), 1.2);
assert.equal(defenseExperienceGain(defenseLevelBonusState, 'slime'), 1);
assert.equal(defenseExperienceGain(defenseLevelBonusState, 'goblinKing'), 10);

const decimalRewardKillState = createInitialState();
decimalRewardKillState.books.defense.unlocked = true;
decimalRewardKillState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
decimalRewardKillState.lastTick = 9000;
decimalRewardKillState.defense.level = 3;
decimalRewardKillState.defense.tower.cooldown = 0;
decimalRewardKillState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];

tickState(decimalRewardKillState, 9016);

assert.equal(decimalRewardKillState.resources.sigils, 1.2);
assert.equal(decimalRewardKillState.defense.moneyPopups[0]?.amount, 1.2);

for (const [kind, expectedReward] of [
  ['slime', 1],
  ['skeletonMage', 1.5],
  ['bat', 1.5],
  ['goblinKing', 3],
] as const) {
  const enemyKindRewardKillState = createInitialState();
  enemyKindRewardKillState.books.defense.unlocked = true;
  enemyKindRewardKillState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
  enemyKindRewardKillState.lastTick = 9100;
  enemyKindRewardKillState.defense.tower.cooldown = 0;
  enemyKindRewardKillState.defense.enemies = [
    { id: 1, kind, lane: 0, distance: 0.4, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
  ];

  tickState(enemyKindRewardKillState, 9116);

  assert.equal(enemyKindRewardKillState.resources.sigils, expectedReward);
  assert.equal(enemyKindRewardKillState.defense.moneyPopups[0]?.amount, expectedReward);
}

const enemyTowerDamageState = createInitialState();
enemyTowerDamageState.books.defense.unlocked = true;
for (const [wave, damage] of [
  [1, 1],
  [10, 1],
  [11, 2],
  [20, 2],
  [21, 3],
  [31, 4],
  [100, 10],
] as const) {
  enemyTowerDamageState.defense.wave = wave;
  assert.equal(defenseEnemyTowerDamage(enemyTowerDamageState), damage);
}

const debugTowerHealthState = createInitialState();
debugTowerHealthState.books.defense.unlocked = true;
debugTowerHealthState.defenseSkills.health = 2;
assert.equal(defenseMaxTowerHealth(debugTowerHealthState), 7);
applyAction(debugTowerHealthState, { type: 'setDefenseDebugTowerHealth', enabled: true });
assert.equal(defenseMaxTowerHealth(debugTowerHealthState), 10000);
assert.equal(debugTowerHealthState.defense.towerHealth, 10000);
applyAction(debugTowerHealthState, { type: 'setDefenseDebugTowerHealth', enabled: false });
assert.equal(defenseMaxTowerHealth(debugTowerHealthState), 7);
assert.equal(debugTowerHealthState.defense.towerHealth, 7);

state.defenseSkills.damage = 1;
state.defenseSkills.damageMultiplier = 0;
state.defenseSkills.criticalChance = 10;
state.defenseSkills.criticalMultiplier = 4;
assert.equal(defenseTowerHitDamage(state, { lane: 0, distance: 0 }, () => 0.09), 4.8);
assert.deepEqual(defenseTowerHitResult(state, { lane: 0, distance: 0 }, () => 0.09), { amount: 4.8, kind: 'critical' });

state.defenseSkills.superCriticalChance = 5;
state.defenseSkills.superCriticalMultiplier = 4;
assert.equal(defenseTowerHitDamage(state, { lane: 0, distance: 0 }, () => 0.01), 19.2);
assert.deepEqual(defenseTowerHitResult(state, { lane: 0, distance: 0 }, () => 0.01), { amount: 19.2, kind: 'superCritical' });

const originalMathRandom = Math.random;

const lightningCriticalState = createInitialState();
lightningCriticalState.books.defense.unlocked = true;
lightningCriticalState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
lightningCriticalState.lastTick = 2000;
lightningCriticalState.defense.tower.cooldown = 99;
lightningCriticalState.defense.spawnedThisWave = defenseWaveEnemyCount(lightningCriticalState);
lightningCriticalState.defenseSkills.lightningCount = 1;
lightningCriticalState.defenseSkills.criticalMultiplier = 4;
lightningCriticalState.defenseSkills.superCriticalChance = 5;
lightningCriticalState.defenseSkills.superCriticalMultiplier = 4;
lightningCriticalState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 200, maxHealth: 200, state: 'walking', deathTimer: 0 },
];

Math.random = () => 0;
tickState(lightningCriticalState, 2016);
Math.random = originalMathRandom;

assert.equal(lightningCriticalState.defense.damagePopups[0]?.source, 'lightning');
assert.equal(lightningCriticalState.defense.damagePopups[0]?.kind, 'superCritical');
assert.equal(lightningCriticalState.defense.damagePopups[0]?.amount, 96);
assert.equal(lightningCriticalState.defense.enemies[0]?.health, 104);

const lightningBurstState = createInitialState();
lightningBurstState.books.defense.unlocked = true;
lightningBurstState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
lightningBurstState.lastTick = 3000;
lightningBurstState.defense.tower.cooldown = 99;
lightningBurstState.defense.spawnedThisWave = defenseWaveEnemyCount(lightningBurstState);
lightningBurstState.defenseSkills.lightningCount = 3;
lightningBurstState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 120, distance: 0.4, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
  { id: 3, lane: 240, distance: 0.4, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
];

tickState(lightningBurstState, 3016);

assert.equal(lightningBurstState.defense.lightningStrikes.length, 1);
assert.equal(lightningBurstState.defense.damagePopups.filter((popup) => popup.source === 'lightning').length, 1);
assert.equal(lightningBurstState.defense.lightningBurstCharges, 2);
assert.equal(Number(lightningBurstState.defense.lightningBurstCooldown.toFixed(2)), 0.1);
assert.equal(
  lightningBurstState.defense.enemies.reduce((total, enemy) => total + enemy.health, 0),
  140,
);

tickState(lightningBurstState, 3066);

assert.equal(lightningBurstState.defense.lightningStrikes.length, 1);
assert.equal(lightningBurstState.defense.damagePopups.filter((popup) => popup.source === 'lightning').length, 1);
assert.equal(Number(lightningBurstState.defense.lightningBurstCooldown.toFixed(2)), 0.05);

tickState(lightningBurstState, 3116);

assert.equal(lightningBurstState.defense.lightningStrikes.length, 2);
assert.equal(lightningBurstState.defense.damagePopups.filter((popup) => popup.source === 'lightning').length, 2);
assert.equal(lightningBurstState.defense.lightningBurstCharges, 1);
assert.equal(
  lightningBurstState.defense.enemies.reduce((total, enemy) => total + enemy.health, 0),
  130,
);

tickState(lightningBurstState, 3216);

assert.equal(lightningBurstState.defense.lightningStrikes.length, 3);
assert.equal(lightningBurstState.defense.damagePopups.filter((popup) => popup.source === 'lightning').length, 3);
assert.equal(lightningBurstState.defense.lightningBurstCharges, 0);
assert.equal(Number(lightningBurstState.defense.lightningCooldown.toFixed(2)), defenseLightningAttackInterval(lightningBurstState));
assert.equal(
  lightningBurstState.defense.enemies.reduce((total, enemy) => total + enemy.health, 0),
  120,
);

const lightningBurstNoEnemyState = createInitialState();
lightningBurstNoEnemyState.books.defense.unlocked = true;
lightningBurstNoEnemyState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
lightningBurstNoEnemyState.lastTick = 3300;
lightningBurstNoEnemyState.defense.tower.cooldown = 99;
lightningBurstNoEnemyState.defense.spawnedThisWave = defenseWaveEnemyCount(lightningBurstNoEnemyState);
lightningBurstNoEnemyState.defenseSkills.lightningCount = 3;
lightningBurstNoEnemyState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
];

tickState(lightningBurstNoEnemyState, 3316);
lightningBurstNoEnemyState.defense.enemies = [];
tickState(lightningBurstNoEnemyState, 3416);

assert.equal(lightningBurstNoEnemyState.defense.lightningBurstCharges, 0);
assert.equal(Number(lightningBurstNoEnemyState.defense.lightningCooldown.toFixed(2)), defenseLightningAttackInterval(lightningBurstNoEnemyState));

const lightningBurstUniqueTargetState = createInitialState();
lightningBurstUniqueTargetState.books.defense.unlocked = true;
lightningBurstUniqueTargetState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
lightningBurstUniqueTargetState.lastTick = 3500;
lightningBurstUniqueTargetState.defense.tower.cooldown = 99;
lightningBurstUniqueTargetState.defense.spawnedThisWave = defenseWaveEnemyCount(lightningBurstUniqueTargetState);
lightningBurstUniqueTargetState.defenseSkills.lightningCount = 2;
lightningBurstUniqueTargetState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 120, distance: 0.4, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
];

Math.random = () => 0;
tickState(lightningBurstUniqueTargetState, 3516);
tickState(lightningBurstUniqueTargetState, 3616);
Math.random = originalMathRandom;

assert.equal(lightningBurstUniqueTargetState.defense.lightningStrikes.length, 2);
assert.notEqual(
  lightningBurstUniqueTargetState.defense.lightningStrikes[0]?.targetEnemyId,
  lightningBurstUniqueTargetState.defense.lightningStrikes[1]?.targetEnemyId,
);

const lightningBurstSingleTargetState = createInitialState();
lightningBurstSingleTargetState.books.defense.unlocked = true;
lightningBurstSingleTargetState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
lightningBurstSingleTargetState.lastTick = 3700;
lightningBurstSingleTargetState.defense.tower.cooldown = 99;
lightningBurstSingleTargetState.defense.spawnedThisWave = defenseWaveEnemyCount(lightningBurstSingleTargetState);
lightningBurstSingleTargetState.defenseSkills.lightningCount = 3;
lightningBurstSingleTargetState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
];

Math.random = () => 0;
tickState(lightningBurstSingleTargetState, 3716);
tickState(lightningBurstSingleTargetState, 3816);
Math.random = originalMathRandom;

assert.equal(lightningBurstSingleTargetState.defense.lightningStrikes.length, 1);
assert.equal(lightningBurstSingleTargetState.defense.lightningBurstCharges, 0);
assert.equal(Number(lightningBurstSingleTargetState.defense.lightningCooldown.toFixed(2)), defenseLightningAttackInterval(lightningBurstSingleTargetState));

const iceCriticalState = createInitialState();
iceCriticalState.books.defense.unlocked = true;
iceCriticalState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
iceCriticalState.lastTick = 2200;
iceCriticalState.defense.tower.cooldown = 99;
iceCriticalState.defense.spawnedThisWave = defenseWaveEnemyCount(iceCriticalState);
iceCriticalState.defenseSkills.iceDamage = 1;
iceCriticalState.defenseSkills.criticalChance = 10;
iceCriticalState.defenseSkills.criticalMultiplier = 4;
iceCriticalState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.2, health: 20, maxHealth: 20, state: 'walking', deathTimer: 0 },
];

Math.random = () => 0;
tickState(iceCriticalState, 2216);
Math.random = originalMathRandom;

assert.equal(iceCriticalState.defense.damagePopups[0]?.source, 'ice');
assert.equal(iceCriticalState.defense.damagePopups[0]?.kind, 'critical');
assert.equal(iceCriticalState.defense.damagePopups[0]?.amount, 7.2);
assert.equal(iceCriticalState.defense.enemies[0]?.health, 12.8);

const cooldownState = createInitialState();
cooldownState.books.defense.unlocked = true;
cooldownState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
cooldownState.lastTick = 1000;
cooldownState.defense.tower.cooldown = 0;
cooldownState.defense.shotPulse = 3;
cooldownState.defense.shots = [{ id: 3, lane: 0, distance: 0.4, timer: 0.08, duration: 0.08 }];
cooldownState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 10, maxHealth: 10, state: 'walking', deathTimer: 0 },
];

tickState(cooldownState, 1016);

assert.equal(cooldownState.defense.shotPulse, 4);
assert.equal(cooldownState.defense.shots.length, 2);
assert.equal(cooldownState.defense.enemies[0]?.health, 9);

const speedCooldownState = createInitialState();
speedCooldownState.books.defense.unlocked = true;
speedCooldownState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
speedCooldownState.lastTick = 1000;
speedCooldownState.defense.speedMultiplier = 4;
speedCooldownState.defense.tower.cooldown = 0;
speedCooldownState.defense.shotPulse = 7;
speedCooldownState.defense.shots = [{ id: 7, lane: 0, distance: 0.4, timer: 0.08, duration: 0.08 }];
speedCooldownState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.4, health: 10, maxHealth: 10, state: 'walking', deathTimer: 0 },
];

tickState(speedCooldownState, 1050);

assert.equal(speedCooldownState.defense.shotPulse, 8);
assert.equal(speedCooldownState.defense.enemies[0]?.health, 9);
assert.equal(speedCooldownState.defense.shots.map((shot) => shot.id).join(','), '7,8');

const collisionPriorityState = createInitialState();
collisionPriorityState.books.defense.unlocked = true;
collisionPriorityState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
collisionPriorityState.lastTick = 1000;
collisionPriorityState.defense.speedMultiplier = 4;
collisionPriorityState.defense.tower.cooldown = 0;
collisionPriorityState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.27, health: 1, maxHealth: 1, state: 'walking', deathTimer: 0 },
];

tickState(collisionPriorityState, 1100);

assert.equal(collisionPriorityState.defense.shotPulse, 1);
assert.equal(collisionPriorityState.defense.shots[0]?.id, 1);
assert.equal(collisionPriorityState.defense.enemies[0]?.id, 1);
assert.equal(collisionPriorityState.defense.enemies[0]?.state, 'dying');

const simultaneousTowerAttackState = createInitialState();
simultaneousTowerAttackState.books.defense.unlocked = true;
simultaneousTowerAttackState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
simultaneousTowerAttackState.lastTick = 1000;
simultaneousTowerAttackState.defenseSkills.health = 2;
simultaneousTowerAttackState.defense.towerHealth = defenseMaxTowerHealth(simultaneousTowerAttackState);
simultaneousTowerAttackState.defense.tower.cooldown = 99;
simultaneousTowerAttackState.defense.spawnedThisWave = defenseWaveEnemyCount(simultaneousTowerAttackState);
simultaneousTowerAttackState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.026, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 2, kind: 'slime', lane: 90, distance: 0.026, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

tickState(simultaneousTowerAttackState, 1016);

assert.equal(simultaneousTowerAttackState.defense.enemies.length, 2);
assert.equal(simultaneousTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(simultaneousTowerAttackState) - 2);
assert.equal(simultaneousTowerAttackState.defense.enemies[0]?.state, 'attacking');
assert.equal(simultaneousTowerAttackState.defense.enemies[1]?.state, 'attacking');

tickState(simultaneousTowerAttackState, 2016);

assert.equal(simultaneousTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(simultaneousTowerAttackState) - 2);

tickState(simultaneousTowerAttackState, 3016);

assert.equal(simultaneousTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(simultaneousTowerAttackState) - 4);
assert.equal(simultaneousTowerAttackState.defense.enemies.length, 2);

const staggeredTowerAttackState = createInitialState();
staggeredTowerAttackState.books.defense.unlocked = true;
staggeredTowerAttackState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
staggeredTowerAttackState.lastTick = 4000;
staggeredTowerAttackState.defenseSkills.health = 2;
staggeredTowerAttackState.defense.towerHealth = defenseMaxTowerHealth(staggeredTowerAttackState);
staggeredTowerAttackState.defense.tower.cooldown = 99;
staggeredTowerAttackState.defense.spawnedThisWave = defenseWaveEnemyCount(staggeredTowerAttackState);
staggeredTowerAttackState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.026, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

tickState(staggeredTowerAttackState, 4016);

assert.equal(staggeredTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(staggeredTowerAttackState) - 1);
assert.equal(staggeredTowerAttackState.defense.enemies[0]?.attackCooldown, 2);

staggeredTowerAttackState.defense.enemies.push({
  id: 2,
  kind: 'slime',
  lane: 90,
  distance: 0.026,
  health: 5,
  maxHealth: 5,
  state: 'walking',
  deathTimer: 0,
});

tickState(staggeredTowerAttackState, 4032);

assert.equal(staggeredTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(staggeredTowerAttackState) - 2);
assert.equal(staggeredTowerAttackState.defense.enemies[0]?.attackCooldown > 1.9, true);
assert.equal(staggeredTowerAttackState.defense.enemies[1]?.attackCooldown, 2);

const waveScaledTowerAttackState = createInitialState();
waveScaledTowerAttackState.books.defense.unlocked = true;
waveScaledTowerAttackState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
waveScaledTowerAttackState.lastTick = 1000;
waveScaledTowerAttackState.defense.wave = 21;
waveScaledTowerAttackState.defenseSkills.health = 10;
waveScaledTowerAttackState.defense.towerHealth = defenseMaxTowerHealth(waveScaledTowerAttackState);
waveScaledTowerAttackState.defense.tower.cooldown = 99;
waveScaledTowerAttackState.defense.spawnedThisWave = defenseWaveEnemyCount(waveScaledTowerAttackState);
waveScaledTowerAttackState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.026, health: 50, maxHealth: 50, state: 'walking', deathTimer: 0 },
];

tickState(waveScaledTowerAttackState, 1016);

assert.equal(waveScaledTowerAttackState.defense.towerHealth, defenseMaxTowerHealth(waveScaledTowerAttackState) - 3);

const slimeAttackAnimationState = createInitialState();
slimeAttackAnimationState.books.defense.unlocked = true;
slimeAttackAnimationState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
slimeAttackAnimationState.lastTick = 1000;
slimeAttackAnimationState.defense.tower.cooldown = 99;
slimeAttackAnimationState.defense.spawnedThisWave = defenseWaveEnemyCount(slimeAttackAnimationState);
slimeAttackAnimationState.defense.enemies = [
  { id: 1, kind: 'slime', lane: 0, distance: 0.026, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

tickState(slimeAttackAnimationState, 1016);
assert.equal(slimeAttackAnimationState.defense.enemies[0]?.state, 'attacking');

tickState(slimeAttackAnimationState, 1516);
assert.equal(slimeAttackAnimationState.defense.enemies[0]?.state, 'attacking');

tickState(slimeAttackAnimationState, 1916);
assert.equal(slimeAttackAnimationState.defense.enemies[0]?.state, 'idle');

const skeletonMageState = createInitialState();
skeletonMageState.books.defense.unlocked = true;
skeletonMageState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
skeletonMageState.lastTick = 3000;
skeletonMageState.defense.tower.cooldown = 99;
skeletonMageState.defense.enemies = [
  {
    id: 1,
    kind: 'skeletonMage',
    lane: 0,
    distance: 0.355,
    health: 2,
    maxHealth: 2,
    state: 'walking',
    deathTimer: 0,
    attackCooldown: 0,
  },
];

tickState(skeletonMageState, 3100);
assert.equal(skeletonMageState.defense.enemies[0]?.distance, 0.35);
assert.equal(skeletonMageState.defense.enemies[0]?.state, 'attacking');
assert.equal(skeletonMageState.defense.enemyProjectiles.length, 0);

tickState(skeletonMageState, 3600);
assert.equal(skeletonMageState.defense.enemies[0]?.distance, 0.35);
assert.equal(skeletonMageState.defense.enemyProjectiles.length, 1);
assert.equal(skeletonMageState.defense.towerHealth, defenseMaxTowerHealth(skeletonMageState));

tickState(skeletonMageState, 4200);
assert.equal(skeletonMageState.defense.enemyProjectiles.length, 0);
assert.equal(skeletonMageState.defense.towerHealth, defenseMaxTowerHealth(skeletonMageState) - 1);
assert.equal(skeletonMageState.defense.enemies[0]?.distance, 0.35);

const diagonalSkeletonMageState = createInitialState();
diagonalSkeletonMageState.books.defense.unlocked = true;
diagonalSkeletonMageState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
diagonalSkeletonMageState.lastTick = 3000;
diagonalSkeletonMageState.defense.tower.cooldown = 99;
diagonalSkeletonMageState.defense.enemies = [
  {
    id: 1,
    kind: 'skeletonMage',
    lane: 45,
    distance: 0.251,
    health: 2,
    maxHealth: 2,
    state: 'walking',
    deathTimer: 0,
    attackCooldown: 0,
  },
];
tickState(diagonalSkeletonMageState, 3100);
assert.equal(Number(diagonalSkeletonMageState.defense.enemies[0]?.distance.toFixed(3)), 0.247);
assert.equal(Number(defenseEnemyDistanceFromCenter(diagonalSkeletonMageState.defense.enemies[0]!).toFixed(3)), 0.35);
assert.equal(diagonalSkeletonMageState.defense.enemies[0]?.state, 'attacking');

const batSpawnState = createInitialState();
batSpawnState.books.defense.unlocked = true;
batSpawnState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
batSpawnState.lastTick = 7000;
batSpawnState.defense.wave = 4;
batSpawnState.defense.spawnedThisWave = 3;
batSpawnState.defense.spawnTimer = 99;
batSpawnState.defense.tower.cooldown = 99;

tickState(batSpawnState, 7016);

assert.equal(batSpawnState.defense.enemies[0]?.kind, 'bat');
assert.equal(batSpawnState.defense.enemies[0]?.maxHealth, defenseEnemyMaxHealthForWave(4, 'bat'));
assert.equal((batSpawnState.defense.enemies[0]?.distance ?? 0) > 1, true);

const goblinKingSpawnState = createInitialState();
goblinKingSpawnState.books.defense.unlocked = true;
goblinKingSpawnState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
goblinKingSpawnState.lastTick = 9000;
goblinKingSpawnState.defense.wave = 5;
goblinKingSpawnState.defense.spawnedThisWave = 4;
goblinKingSpawnState.defense.spawnTimer = 99;
goblinKingSpawnState.defense.tower.cooldown = 99;

tickState(goblinKingSpawnState, 9016);

assert.equal(goblinKingSpawnState.defense.enemies[0]?.kind, 'goblinKing');
assert.equal(goblinKingSpawnState.defense.enemies[0]?.maxHealth, defenseEnemyMaxHealthForWave(5, 'goblinKing'));

const goblinKingSpeedState = createInitialState();
goblinKingSpeedState.books.defense.unlocked = true;
goblinKingSpeedState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
goblinKingSpeedState.lastTick = 10000;
goblinKingSpeedState.defense.wave = 5;
goblinKingSpeedState.defense.tower.cooldown = 99;
goblinKingSpeedState.defense.spawnedThisWave = defenseWaveEnemyCount(goblinKingSpeedState);
goblinKingSpeedState.defense.enemies = [
  { id: 1, kind: 'goblinKing', lane: 0, distance: 0.8, health: 40, maxHealth: 40, state: 'walking', deathTimer: 0 },
];

tickState(goblinKingSpeedState, 11000);

assert.equal(Number(goblinKingSpeedState.defense.enemies[0]?.distance.toFixed(5)), 0.76625);

const batMoveSpeedState = createInitialState();
batMoveSpeedState.books.defense.unlocked = true;
batMoveSpeedState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
batMoveSpeedState.lastTick = 12000;
batMoveSpeedState.defense.wave = 1;
batMoveSpeedState.defense.tower.cooldown = 99;
batMoveSpeedState.defense.spawnedThisWave = defenseWaveEnemyCount(batMoveSpeedState);
batMoveSpeedState.defense.enemies = [
  { id: 1, kind: 'bat', lane: 0, distance: 0.8, health: 2, maxHealth: 2, state: 'walking', deathTimer: 0 },
];

tickState(batMoveSpeedState, 13000);

assert.equal(Number(batMoveSpeedState.defense.enemies[0]?.distance.toFixed(5)), 0.58355);

const batAttackState = createInitialState();
batAttackState.books.defense.unlocked = true;
batAttackState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
batAttackState.lastTick = 8000;
batAttackState.defense.tower.cooldown = 99;
batAttackState.defense.spawnedThisWave = defenseWaveEnemyCount(batAttackState);
batAttackState.defense.enemies = [
  {
    id: 1,
    kind: 'bat',
    lane: 0,
    distance: 0.055,
    health: 1,
    maxHealth: 1,
    state: 'walking',
    deathTimer: 0,
  },
];

tickState(batAttackState, 8200);
assert.equal(batAttackState.defense.enemies[0]?.state, 'attacking');
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 1);

tickState(batAttackState, 8600);
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 1);
assert.equal(batAttackState.defense.enemies.length, 1);

tickState(batAttackState, 10200);
assert.equal(batAttackState.defense.enemies.length, 1);
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 1);

tickState(batAttackState, 10800);
assert.equal(batAttackState.defense.enemies.length, 1);
assert.equal(batAttackState.defense.towerHealth, defenseMaxTowerHealth(batAttackState) - 2);

const iceAuraState = createInitialState();
iceAuraState.books.defense.unlocked = true;
iceAuraState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
iceAuraState.lastTick = 12000;
iceAuraState.defense.tower.cooldown = 999;
iceAuraState.defenseSkills.iceDamage = 1;
iceAuraState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.14, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 0, distance: 0.8, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

tickState(iceAuraState, 12016);

assert.equal(Number(iceAuraState.defense.enemies[0]?.health.toFixed(1)), 2);
assert.equal(iceAuraState.defense.enemies[0]?.lastHitSource, 'ice');
assert.equal(iceAuraState.defense.damagePopups[0]?.source, 'ice');
assert.equal(iceAuraState.defense.enemies[1]?.health, 5);
assert.equal(Number(iceAuraState.defense.iceCooldown.toFixed(2)), 2);

tickState(iceAuraState, 13016);

assert.equal(Number(iceAuraState.defense.enemies[0]?.health.toFixed(1)), 2);

tickState(iceAuraState, 14032);

assert.equal(iceAuraState.defense.enemies[0]?.id, 2);
assert.equal(iceAuraState.defense.enemies[0]?.health, 5);
assert.equal(iceAuraState.defense.enemies.some((enemy) => enemy.health === 2 && enemy.maxHealth === 5), false);

const iceSlowState = createInitialState();
iceSlowState.books.defense.unlocked = true;
iceSlowState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
iceSlowState.lastTick = 15000;
iceSlowState.defense.tower.cooldown = 999;
iceSlowState.defense.iceCooldown = 999;
iceSlowState.defenseSkills.iceDamage = 1;
iceSlowState.defenseSkills.iceRange = 15;
iceSlowState.defenseSkills.iceSlow = defenseSkillMaxLevel('iceSlow');
iceSlowState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.25, health: 20, maxHealth: 20, state: 'walking', deathTimer: 0 },
];

const noIceSlowState = createInitialState();
noIceSlowState.books.defense.unlocked = true;
noIceSlowState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
noIceSlowState.lastTick = 15000;
noIceSlowState.defense.tower.cooldown = 999;
noIceSlowState.defense.enemies = [
  { id: 1, lane: 0, distance: 0.25, health: 20, maxHealth: 20, state: 'walking', deathTimer: 0 },
];

tickState(iceSlowState, 16000);
tickState(noIceSlowState, 16000);

assert.equal((iceSlowState.defense.enemies[0]?.distance ?? 0) > (noIceSlowState.defense.enemies[0]?.distance ?? 0), true);

const lightningMapTargetState = createInitialState();
lightningMapTargetState.books.defense.unlocked = true;
lightningMapTargetState.openBookPanels = [{ bookId: 'defense', slot: 0 }];
lightningMapTargetState.lastTick = 17000;
lightningMapTargetState.defense.spawnedThisWave = defenseWaveEnemyCount(lightningMapTargetState);
lightningMapTargetState.defense.tower.cooldown = 999;
lightningMapTargetState.defenseSkills.lightningDamage = 2;
lightningMapTargetState.defenseSkills.lightningCount = 2;
lightningMapTargetState.defense.enemies = [
  { id: 1, lane: 0, distance: 1.08, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 2, lane: 90, distance: 0.95, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
  { id: 3, lane: 90, distance: 0.85, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 },
];

tickState(lightningMapTargetState, 17016);

assert.equal(lightningMapTargetState.defense.enemies[0]?.health, 5);
assert.equal(lightningMapTargetState.defense.enemies[1]?.health, 5);
assert.equal(lightningMapTargetState.defense.enemies[2]?.health, -15);
assert.equal(lightningMapTargetState.defense.enemies[2]?.lastHitSource, 'lightning');
assert.equal(lightningMapTargetState.defense.damagePopups[0]?.source, 'lightning');
assert.equal(lightningMapTargetState.defense.lightningStrikes.length, 1);
assert.equal(lightningMapTargetState.defense.lightningStrikes[0]?.targetEnemyId, 3);
assert.equal(lightningMapTargetState.defense.lightningStrikes[0]?.lane, 90);

console.log('defenseRules ok');
