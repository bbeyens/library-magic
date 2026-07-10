import assert from 'node:assert/strict';
import {
  applyAction,
  MANA_CRYSTAL_MAX_LEVEL,
  MANA_CRYSTAL_GEM_THRESHOLDS,
  MANA_CRYSTAL_REVEAL_REQUIRED_MANA,
  manaBlueOrbChance,
  manaAutoClickerCapacity,
  manaAutoClickerCount,
  manaAutoClickerInterval,
  manaClickGainPreview,
  manaClickMultiplier,
  manaAllyFindOrbChance,
  manaCanResearch,
  manaClickResearchSecondsPerFiveClicks,
  manaCrystalCurrentGemIndex,
  manaCrystalDiscoveredGemCount,
  manaCrystalLevel,
  manaCrystalLevelAttackMultiplier,
  manaCrystalLevelResourceMultiplier,
  manaCrystalLevelXpMultiplier,
  manaCrystalRevealProgress,
  manaCrystalResourceMultiplier,
  manaGreenOrbChance,
  manaHoldClickRate,
  manaIdleCompanionDamage,
  manaLevelUpEffectMultiplier,
  manaMeowKnightDamage,
  manaResearchDuration,
  manaResearchMultiplier,
  manaResearchProgress,
  manaResearchUnlocked,
  manaSkillMaxLevel,
  manaSkillUpgradeEffectDelta,
  manaYellowOrbChance,
  manaXpOrbChance,
  manaXpOrbValue,
  tickState,
  type ManaSkillId,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

function withRandomSequence<T>(values: number[], run: () => T): T {
  const originalRandom = Math.random;
  let index = 0;
  Math.random = () => values[Math.min(index++, values.length - 1)] ?? 0.99;
  try {
    return run();
  } finally {
    Math.random = originalRandom;
  }
}

const multiplierState = createInitialState();
multiplierState.manaSkills.power = 4;
multiplierState.manaSkills.clickMultiplier = 4;
assert.equal(manaClickMultiplier(multiplierState), 2);
assert.equal(manaClickGainPreview(multiplierState), 10);

const powerUpgradePreviewState = createInitialState();
powerUpgradePreviewState.manaSkills.power = 4;
powerUpgradePreviewState.manaSkills.clickMultiplier = 1;
powerUpgradePreviewState.manaSkills.researchClickPower = 2;
powerUpgradePreviewState.manaCrystal.xp = 200;
assert.equal(manaClickGainPreview(powerUpgradePreviewState), 8.3);
assert.equal(
  manaSkillUpgradeEffectDelta(powerUpgradePreviewState, 'power'),
  1.7,
  'Power + should preview the effective click gain after every Crystal multiplier.',
);

const allyUpgradePreviewState = createInitialState();
allyUpgradePreviewState.manaSkills.idleBow = 4;
allyUpgradePreviewState.manaSkills.researchIdleBow = 2;
allyUpgradePreviewState.manaCrystal.xp = 200;
allyUpgradePreviewState.manaCrystal.harvestedMana = MANA_CRYSTAL_GEM_THRESHOLDS[0];
assert.equal(manaIdleCompanionDamage(allyUpgradePreviewState, 'idleBow'), 5.9);
assert.equal(
  manaSkillUpgradeEffectDelta(allyUpgradePreviewState, 'idleBow'),
  1.4,
  'Idle ally cards should preview their effective damage gain after level, gem, and research boosts.',
);

const utilityUpgradePreviewState = createInitialState();
utilityUpgradePreviewState.manaCrystal.xp = 200;
utilityUpgradePreviewState.manaSkills.xpValue = 4;
utilityUpgradePreviewState.manaSkills.xpOrbChance = 4;
utilityUpgradePreviewState.manaSkills.allyFindOrb = 1;
assert.equal(manaSkillUpgradeEffectDelta(utilityUpgradePreviewState, 'xpValue'), 1.1);
assert.equal(manaSkillUpgradeEffectDelta(utilityUpgradePreviewState, 'allyFindOrb'), 5);
assert.equal(manaSkillUpgradeEffectDelta(utilityUpgradePreviewState, 'holdClick'), 5);
utilityUpgradePreviewState.manaSkills.holdClick = 1;
assert.equal(manaSkillUpgradeEffectDelta(utilityUpgradePreviewState, 'holdClick'), 1);
assert.equal(manaSkillUpgradeEffectDelta(utilityUpgradePreviewState, 'autoClicker'), 5);
utilityUpgradePreviewState.manaSkills.autoClicker = 1;
assert.equal(manaSkillUpgradeEffectDelta(utilityUpgradePreviewState, 'autoClicker'), -0.2);
assert.equal(manaSkillUpgradeEffectDelta(utilityUpgradePreviewState, 'clickMultiplier'), 0.25);

const multiAutoPreviewState = createInitialState();
assert.equal(manaAutoClickerCapacity(multiAutoPreviewState), 1);
assert.equal(manaSkillUpgradeEffectDelta(multiAutoPreviewState, 'multiAutoClicker'), 1);
multiAutoPreviewState.manaSkills.autoClicker = 1;
assert.equal(manaAutoClickerCount(multiAutoPreviewState), 1);
assert.equal(manaSkillUpgradeEffectDelta(multiAutoPreviewState, 'multiAutoClicker'), 1);
multiAutoPreviewState.manaSkills.multiAutoClicker = 3;
assert.equal(manaAutoClickerCapacity(multiAutoPreviewState), 4);
assert.equal(manaAutoClickerCount(multiAutoPreviewState), 4);
assert.equal(manaSkillMaxLevel('multiAutoClicker'), 3);

withRandomSequence([0.99], () => {
  applyAction(multiplierState, { type: 'chargeMana' });
});
assert.equal(multiplierState.mana, 10);

const xpState = createInitialState();
xpState.manaSkills.xpOrbChance = 1;
assert.equal(manaXpOrbChance(xpState), 0.05);
withRandomSequence([0.01, 0.25, 0.75], () => {
  applyAction(xpState, { type: 'chargeMana' });
});
assert.equal(xpState.manaCrystal.lastCollectedXpOrb?.value, 1);
assert.equal(xpState.manaCrystal.lastCollectedXpOrb?.kind, 'red');
assert.equal(xpState.manaCrystal.xp, 1);
assert.equal(xpState.manaCrystal.xpOrb, null);

const yellowOrbState = createInitialState();
yellowOrbState.manaSkills.yellowOrbChance = 1;
assert.equal(manaYellowOrbChance(yellowOrbState), 0.05);
const yellowBeforeCollectMana = yellowOrbState.mana;
const yellowBeforeHarvest = yellowOrbState.manaCrystal.harvestedMana;
withRandomSequence([0.01, 0.25, 0.75], () => {
  applyAction(yellowOrbState, { type: 'chargeMana' });
});
assert.equal(yellowOrbState.manaCrystal.lastCollectedXpOrb?.kind, 'yellow');
assert.ok(yellowOrbState.mana > yellowBeforeCollectMana, 'Yellow orb should give Mana when collected.');
assert.ok(yellowOrbState.manaCrystal.harvestedMana > yellowBeforeHarvest, 'Yellow orb Mana should reveal the Crystal cover.');
assert.equal(yellowOrbState.manaCrystal.xp, 0);

const greenOrbState = createInitialState();
greenOrbState.manaSkills.greenOrbChance = 1;
assert.equal(manaGreenOrbChance(greenOrbState), 0.05);
withRandomSequence([0.01, 0.25, 0.75], () => {
  applyAction(greenOrbState, { type: 'chargeMana' });
});
assert.equal(greenOrbState.manaCrystal.lastCollectedXpOrb?.kind, 'green');
assert.equal(greenOrbState.manaCrystal.xp, 2);

const blueOrbState = createInitialState();
blueOrbState.manaSkills.blueOrbChance = 1;
assert.equal(manaBlueOrbChance(blueOrbState), 0.05);
const blueBeforeCollectMana = blueOrbState.mana;
withRandomSequence([0.01, 0.25, 0.75], () => {
  applyAction(blueOrbState, { type: 'chargeMana' });
});
assert.equal(blueOrbState.manaCrystal.lastCollectedXpOrb?.kind, 'blue');
assert.ok(blueOrbState.mana > blueBeforeCollectMana, 'Blue orb should give Mana when collected.');
assert.equal(blueOrbState.manaCrystal.xp, 1);

const xpValueState = createInitialState();
xpValueState.manaSkills.xpValue = 1;
assert.equal(manaXpOrbValue(xpValueState), 2);

const manaLevelState = createInitialState();
assert.equal(manaCrystalLevel(manaLevelState), 0);
assert.equal(manaCrystalLevelResourceMultiplier(manaLevelState), 1);
assert.equal(manaCrystalLevelXpMultiplier(manaLevelState), 1);
assert.equal(manaCrystalLevelAttackMultiplier(manaLevelState), 1);
manaLevelState.manaCrystal.xp = 100;
assert.equal(manaCrystalLevel(manaLevelState), 1);
assert.equal(manaCrystalLevelResourceMultiplier(manaLevelState), 1.05);
assert.equal(manaCrystalLevelXpMultiplier(manaLevelState), 1.05);
assert.equal(manaCrystalLevelAttackMultiplier(manaLevelState), 1.05);
assert.equal(manaClickGainPreview(manaLevelState), 1.1);
manaLevelState.manaSkills.xpValue = 1;
assert.equal(manaXpOrbValue(manaLevelState), 2.1);
manaLevelState.manaCrystal.xp = MANA_CRYSTAL_MAX_LEVEL * 100 + 99;
assert.equal(manaCrystalLevel(manaLevelState), MANA_CRYSTAL_MAX_LEVEL);
manaLevelState.manaCrystal.xp += 100;
assert.equal(manaCrystalLevel(manaLevelState), MANA_CRYSTAL_MAX_LEVEL);

const levelUpState = createInitialState();
levelUpState.manaSkills.xpOrbChance = 1;
levelUpState.manaSkills.levelUpEffect = 1;
levelUpState.manaCrystal.xp = 99;
assert.equal(manaLevelUpEffectMultiplier(levelUpState), 1.1);
withRandomSequence([0.01, 0.25, 0.75], () => {
  applyAction(levelUpState, { type: 'chargeMana' });
});
assert.equal(levelUpState.manaCrystal.xp, 100);
assert.ok(levelUpState.mana > 1, 'Level Up Effect should add Mana when XP crosses a level.');

const skillIds: ManaSkillId[] = [
  'power',
  'clickMultiplier',
  'research',
  'clickResearch',
  'autoClicker',
  'multiAutoClicker',
  'xpOrbChance',
  'yellowOrbChance',
  'greenOrbChance',
  'blueOrbChance',
  'xpValue',
  'levelUpEffect',
  'holdClick',
  'allyFindOrb',
  'meowKnight',
  'idleGlock',
  'idleAk47',
  'idleBazooka',
  'idleBow',
  'idleSword',
  'idleOrangeCat',
  'idlePickaxe',
  'researchClickPower',
  'researchMeowKnight',
  'researchIdleGlock',
  'researchIdleAk47',
  'researchIdleBazooka',
  'researchIdleBow',
  'researchIdleSword',
  'researchIdleOrangeCat',
  'researchIdlePickaxe',
  'criticalHit',
  'criticalEffect',
];
for (const skillId of skillIds) {
  assert.ok(manaSkillMaxLevel(skillId) === null || manaSkillMaxLevel(skillId)! > 0, `${skillId} should have a usable max level.`);
}
assert.equal(manaSkillMaxLevel('criticalHit'), 50, 'Crystal Critical Chance should max at level 50 for 50%.');

const holdState = createInitialState();
holdState.manaSkills.holdClick = 1;
holdState.manaCrystal.holdClickActive = true;
assert.equal(manaHoldClickRate(holdState), 5);
withRandomSequence(Array.from({ length: 40 }, () => 0.99), () => {
  holdState.lastTick = 0;
  applyAction(holdState, { type: 'tickManaHoldClick', deltaSeconds: 1 });
});
assert.equal(holdState.mana, 5, 'Hold-click should start at 5 Crystal clicks per second.');
holdState.manaSkills.holdClick = 16;
assert.equal(manaHoldClickRate(holdState), 20, 'Hold-click should cap at 20 Crystal clicks per second.');

const researchState = createInitialState();
assert.equal(manaResearchUnlocked(researchState), false);
researchState.mana = 10_000;
applyAction(researchState, { type: 'buyManaSkill', skillId: 'research' });
assert.equal(manaResearchUnlocked(researchState), true);
assert.equal(manaCanResearch(researchState, 'researchClickPower'), true);
assert.equal(manaCanResearch(researchState, 'researchIdleGlock'), false, 'Ally research should stay locked until that ally is owned.');
applyAction(researchState, { type: 'startManaResearch', skillId: 'researchClickPower' });
assert.equal(researchState.manaSkills.activeResearch?.skillId, 'researchClickPower');
assert.equal(manaResearchProgress(researchState, 'researchClickPower'), 0);
applyAction(researchState, { type: 'startManaResearch', skillId: 'researchMeowKnight' });
assert.equal(researchState.manaSkills.activeResearch?.skillId, 'researchClickPower', 'Only one Mana research should run at once.');
researchState.lastTick = 0;
for (let now = 1000; now <= manaResearchDuration(researchState, 'researchClickPower') * 1000; now += 1000) {
  tickState(researchState, now);
}
assert.equal(researchState.manaSkills.researchClickPower, 1);
assert.equal(researchState.manaSkills.activeResearch, null);
assert.equal(manaResearchMultiplier(researchState, 'researchClickPower'), 1.1);

const clickResearchState = createInitialState();
clickResearchState.manaSkills.research = 1;
clickResearchState.manaSkills.clickResearch = 5;
assert.equal(manaClickResearchSecondsPerFiveClicks(clickResearchState), 5);
applyAction(clickResearchState, { type: 'startManaResearch', skillId: 'researchClickPower' });
withRandomSequence([0.99], () => {
  applyAction(clickResearchState, { type: 'chargeMana' });
});
assert.equal(clickResearchState.manaSkills.activeResearch?.elapsed, 1, 'Click Research should add one second per click at 5s per 5 clicks.');

const autoClickState = createInitialState();
autoClickState.manaSkills.autoClicker = 1;
autoClickState.manaSkills.multiAutoClicker = 3;
assert.equal(manaAutoClickerInterval(autoClickState), 5);
assert.equal(manaAutoClickerCount(autoClickState), 4);
assert.equal(autoClickState.manaSkills.lastAutoClickCount, 0);
autoClickState.lastTick = 0;
withRandomSequence(Array.from({ length: 8 }, () => 0.99), () => {
  for (let now = 1000; now <= 5000; now += 1000) {
    tickState(autoClickState, now);
  }
});
assert.equal(autoClickState.mana, 4, 'Auto Clicker should apply all active auto clickers on its cadence.');
assert.equal(autoClickState.manaSkills.lastAutoClickCount, 4, 'Auto Clicker should expose a stable visual event counter for Crystal hand animations.');

const meowState = createInitialState();
meowState.manaSkills.meowKnight = 1;
meowState.lastTick = 0;
assert.equal(manaMeowKnightDamage(meowState), 1);
tickState(meowState, 999);
assert.equal(meowState.mana, 0, 'Meow Knight should wait for its one-second attack cadence.');
tickState(meowState, 1000);
assert.equal(meowState.mana, 0, 'Meow Knight first attack should be slightly staggered.');
tickState(meowState, 1119);
assert.equal(meowState.mana, 0, 'Meow Knight should not attack before its staggered cadence lands.');
tickState(meowState, 1120);
assert.equal(meowState.mana, 1, 'Meow Knight should attack once per second after purchase.');
assert.equal(meowState.manaCrystal.harvestedMana, 1, 'Meow Knight damage should reveal Crystal gems.');
assert.equal(meowState.manaSkills.lastMeowKnightAttackCount, 1);
meowState.manaSkills.meowKnight = 2;
tickState(meowState, 2119);
assert.equal(meowState.mana, 1, 'Meow Knight should keep the stagger between later attacks.');
tickState(meowState, 2120);
assert.equal(manaMeowKnightDamage(meowState), 2);
assert.equal(meowState.mana, 3, 'Upgrading Meow Knight should increase its attack gain.');

const glockState = createInitialState();
glockState.manaSkills.idleGlock = 1;
glockState.lastTick = 0;
assert.equal(manaIdleCompanionDamage(glockState, 'idleGlock'), 1);
tickState(glockState, 999);
assert.equal(glockState.mana, 0, 'Idle Glock should wait for its one-second attack cadence.');
tickState(glockState, 1000);
assert.equal(glockState.mana, 1, 'Idle Glock should attack once per second after purchase.');
assert.equal(glockState.manaCrystal.harvestedMana, 1, 'Idle Glock damage should reveal Crystal gems.');
assert.equal(glockState.manaSkills.idleCompanionAttackCounts.idleGlock, 1);
glockState.manaSkills.idleGlock = 3;
tickState(glockState, 2000);
assert.equal(manaIdleCompanionDamage(glockState, 'idleGlock'), 3);
assert.equal(glockState.mana, 4, 'Upgrading Idle Glock should increase its attack gain.');

const staggeredIdleState = createInitialState();
staggeredIdleState.manaSkills.idleGlock = 1;
staggeredIdleState.manaSkills.idleAk47 = 1;
staggeredIdleState.lastTick = 0;
tickState(staggeredIdleState, 1000);
assert.equal(staggeredIdleState.manaSkills.idleCompanionAttackCounts.idleGlock, 1);
assert.equal(staggeredIdleState.manaSkills.idleCompanionAttackCounts.idleAk47 ?? 0, 0);
tickState(staggeredIdleState, 1119);
assert.equal(staggeredIdleState.manaSkills.idleCompanionAttackCounts.idleAk47 ?? 0, 0);
tickState(staggeredIdleState, 1120);
assert.equal(staggeredIdleState.manaSkills.idleCompanionAttackCounts.idleAk47, 1);

const allyOrbMissState = createInitialState();
allyOrbMissState.manaSkills.idleGlock = 1;
allyOrbMissState.manaSkills.xpOrbChance = 2;
allyOrbMissState.manaSkills.allyFindOrb = 20;
allyOrbMissState.lastTick = 0;
assert.equal(manaAllyFindOrbChance(allyOrbMissState), 0.05);
withRandomSequence([0.06], () => {
  tickState(allyOrbMissState, 1000);
});
assert.equal(allyOrbMissState.manaCrystal.lastCollectedXpOrb, null, 'Ally orb chance should stay five points under the strongest click orb chance.');

const allyOrbHitState = createInitialState();
allyOrbHitState.manaSkills.idleGlock = 1;
allyOrbHitState.manaSkills.xpOrbChance = 2;
allyOrbHitState.manaSkills.allyFindOrb = 20;
allyOrbHitState.lastTick = 0;
withRandomSequence([0.04, 0, 0.25, 0.75], () => {
  tickState(allyOrbHitState, 1000);
});
assert.equal(allyOrbHitState.manaCrystal.lastCollectedXpOrb?.kind, 'red');
assert.equal(allyOrbHitState.manaCrystal.xp, 1);

const revealState = createInitialState();
assert.equal(manaCrystalRevealProgress(revealState), 0);
withRandomSequence([0.99], () => {
  applyAction(revealState, { type: 'chargeMana' });
});
assert.equal(revealState.manaCrystal.harvestedMana, 1);
assert.ok(manaCrystalRevealProgress(revealState) > 0, 'Crystal clicks should start removing the rock cover.');
revealState.manaCrystal.harvestedMana = MANA_CRYSTAL_REVEAL_REQUIRED_MANA / 4;
const quarterReveal = manaCrystalRevealProgress(revealState);
revealState.manaCrystal.harvestedMana = MANA_CRYSTAL_REVEAL_REQUIRED_MANA / 2;
const halfReveal = manaCrystalRevealProgress(revealState);
assert.ok(quarterReveal > 0.25, 'Crystal rock cover should reveal quickly at first.');
assert.ok(halfReveal - quarterReveal < quarterReveal, 'Crystal rock cover reveal should get harder as progress rises.');
revealState.manaCrystal.harvestedMana = MANA_CRYSTAL_REVEAL_REQUIRED_MANA - 1;
assert.ok(manaCrystalRevealProgress(revealState) > 0.99);

const gemProgressState = createInitialState();
assert.equal(MANA_CRYSTAL_GEM_THRESHOLDS.length, 10, 'Crystal should have 10 sequential gem unlock thresholds.');
assert.equal(MANA_CRYSTAL_GEM_THRESHOLDS[0], 10_000);
assert.equal(MANA_CRYSTAL_GEM_THRESHOLDS[1], 100_000);
assert.equal(MANA_CRYSTAL_GEM_THRESHOLDS[9], 10_000_000_000_000);
assert.equal(manaCrystalDiscoveredGemCount(gemProgressState), 0);
assert.equal(manaCrystalCurrentGemIndex(gemProgressState), 0);
assert.equal(manaCrystalResourceMultiplier(gemProgressState), 1);
gemProgressState.manaCrystal.harvestedMana = 9_999;
assert.equal(manaCrystalDiscoveredGemCount(gemProgressState), 0);
assert.equal(manaCrystalCurrentGemIndex(gemProgressState), 0);
assert.equal(manaCrystalRevealProgress(gemProgressState) < 1, true);
gemProgressState.manaCrystal.harvestedMana = 10_000;
assert.equal(manaCrystalDiscoveredGemCount(gemProgressState), 1);
assert.equal(manaCrystalCurrentGemIndex(gemProgressState), 1);
assert.equal(manaCrystalResourceMultiplier(gemProgressState), 1.1);
assert.equal(manaCrystalRevealProgress(gemProgressState), 0);
gemProgressState.manaCrystal.harvestedMana = 100_000;
assert.equal(manaCrystalDiscoveredGemCount(gemProgressState), 2);
assert.equal(manaCrystalCurrentGemIndex(gemProgressState), 2);
assert.equal(manaCrystalResourceMultiplier(gemProgressState), 1.2);
gemProgressState.manaCrystal.harvestedMana = MANA_CRYSTAL_GEM_THRESHOLDS[9];
assert.equal(manaCrystalDiscoveredGemCount(gemProgressState), 10);
assert.equal(manaCrystalCurrentGemIndex(gemProgressState), 9);
assert.equal(manaCrystalResourceMultiplier(gemProgressState), 2);

const gemBonusState = createInitialState();
gemBonusState.manaCrystal.harvestedMana = 10_000;
withRandomSequence([0.99], () => {
  applyAction(gemBonusState, { type: 'chargeMana' });
});
assert.equal(gemBonusState.mana, 1.1, 'One discovered Crystal gem should add +10% Mana gain.');

console.log('manaSkills ok');
