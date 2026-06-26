import { books, getBook, type BookId } from '../content/books';
import {
  getForbiddenGrimoireSealForBook,
  type ForbiddenGrimoireRequirement,
  type ForbiddenOfferingResourceId,
} from '../content/forbiddenGrimoire';
import { runeWords } from '../content/runeWords';
import {
  hundredOptionRange,
  hundredReward,
  hundredTargetMax,
  rollHundredOption,
  type HundredOptionId,
} from './hundredRules';
import {
  targetAttackDamage,
  targetAutomationInterval,
  targetMaxActiveTargets,
  targetReward,
  targetSpawnInterval,
  type TargetSkillId,
} from './targetRules';
export { targetAttackDamage, targetAutomationInterval, targetMaxActiveTargets, targetSpawnInterval } from './targetRules';
import {
  slimeTrainerCommandDamage,
  slimeTrainerCommandUnlocked,
  slimeTrainerEnemyAttackDamage,
  slimeTrainerEnemyForVictoryCount,
  slimeTrainerResourceReward,
  slimeTrainerXpReward,
  slimeTrainerXpToNextLevel,
  type SlimeTrainerCommandId,
} from './slimeTrainerRules';
export {
  SLIME_TRAINER_COMMANDS,
  slimeTrainerAvailableCommands,
  slimeTrainerCommandDamage,
  slimeTrainerCommandUnlocked,
  slimeTrainerEnemyAttackDamage,
  slimeTrainerXpToNextLevel,
} from './slimeTrainerRules';
import {
  createStartingSnakeBody,
  miningBlockMaxHealth,
  MINING_GRID_COLUMNS,
  randomSnakeFood,
  snakeGridSizeForLevel,
  type BlackjackCard,
  type BlackjackRank,
  type BlackjackSuit,
  type BlackjackUpgradeCellId,
  type BookPanelSlot,
  type DefenseEnemy,
  type GameState,
  type MiningBlock,
  type SnakeBonusFruitType,
  type SnakeCell,
  type SnakeDirection,
  type TargetInstance,
} from './state';
import { defenseEnemyInTowerRange } from './defenseRules';
import { canQueueSnakeDirection, committedSnakeDirection, snakeMoveIntervalForSpeedLevel } from './snakeRules';
import {
  BLACKJACK_UPGRADE_CELL_IDS,
  blackjackActionMaxLevel,
  blackjackActionCurrentEffectLabel,
  blackjackActionNextEffectLabel,
  blackjackActionResultBonus,
  blackjackSplitCostRatio,
  blackjackActionUpgradeCost,
  blackjackActionUpgradeSteps,
  blackjackBonusActivationCost,
  blackjackBonusAutoUnlocked,
  blackjackBonusCurrentEffectLabel,
  blackjackBonusMaxLevel,
  blackjackBonusUpgradeSteps,
  blackjackBonusUpgradeXpCost,
  blackjackUpgradeCellCost,
  blackjackUpgradeCellMaxLevel,
  blackjackUpgradeTier,
  blackjackLoanAmount,
  blackjackLoanDebtForLevel,
  blackjackMainBet,
  blackjackMissRefund,
  blackjackMoneyGainSplit,
  blackjackNaturalPayoutMultiplier,
  blackjackPayoutMultiplier,
  blackjackSideBonusXp,
  blackjackWinPayoutMultiplier,
  blackjackWinStreakBonus,
  evaluatePairBonus,
  evaluateTwentyOneThree,
  type BlackjackBonusUpgradeStep,
  type BlackjackActionResultBonus,
  type BlackjackUpgradeCost,
  type BlackjackUpgradeTier,
  type BlackjackSideBonusId,
} from './blackjackRules';

export type ManaSkillId = 'power' | 'automation' | 'criticalHit' | 'criticalEffect' | 'extraWands';
export type SnakeSkillId = 'speed' | 'gridSize' | 'automation' | 'baseMultiplier' | 'bonusFruit' | 'extraLife' | 'edgeWrap';
export type MiningSkillId = 'pickaxeForce' | 'splashDamage' | 'automation';
export type { TargetSkillId };
export type { BlackjackSideBonusId };
export type { BlackjackBonusUpgradeStep };
export type { BlackjackUpgradeCellId };
export type { BlackjackUpgradeCost };
export type { BlackjackUpgradeTier };

const DEBUG_MANA_SKILL_MAX_LEVELS: Record<ManaSkillId, number> = {
  power: 50,
  automation: 50,
  criticalHit: 20,
  criticalEffect: 40,
  extraWands: 9,
};

const DEBUG_SNAKE_SKILL_MAX_LEVELS: Record<SnakeSkillId, number> = {
  speed: 26,
  gridSize: 5,
  automation: 10,
  baseMultiplier: 40,
  bonusFruit: 3,
  extraLife: 2,
  edgeWrap: 1,
};

const DEBUG_TARGET_SKILL_MAX_LEVELS: Record<TargetSkillId, number> = {
  spawnSpeed: 10,
  targetCount: 5,
  damage: 20,
  automation: 10,
};

const DEBUG_MINING_SKILL_MAX_LEVELS: Record<MiningSkillId, number> = {
  pickaxeForce: 30,
  splashDamage: 12,
  automation: 20,
};

const BOOK_PANEL_SLOTS: BookPanelSlot[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export type GameAction =
  | { type: 'selectBook'; bookId: BookId }
  | { type: 'closeBookPanel'; bookId: BookId }
  | { type: 'moveBookPanel'; bookId: BookId }
  | { type: 'chargeMana' }
  | { type: 'buyManaSkill'; skillId: ManaSkillId }
  | { type: 'buySnakeSkill'; skillId: SnakeSkillId }
  | { type: 'buyTargetSkill'; skillId: TargetSkillId }
  | { type: 'buyMiningSkill'; skillId: MiningSkillId }
  | { type: 'unlockBlackjackBonus'; bonusId: BlackjackSideBonusId }
  | { type: 'buyBlackjackBonusUpgrade'; bonusId: BlackjackSideBonusId }
  | { type: 'buyBlackjackActionUpgrade' }
  | { type: 'buyBlackjackUpgradeCell'; cellId: BlackjackUpgradeCellId }
  | { type: 'toggleBlackjackBonusAuto'; bonusId: BlackjackSideBonusId }
  | { type: 'activateBlackjackBonus'; bonusId: BlackjackSideBonusId }
  | { type: 'prepareBlackjackWager'; amount: number }
  | { type: 'resetBlackjackWager' }
  | { type: 'increaseBlackjackBaseBet' }
  | { type: 'decreaseBlackjackBaseBet' }
  | { type: 'buyBlackjackAutoDeal' }
  | { type: 'maxManaSkills' }
  | { type: 'maxSnakeSkills' }
  | { type: 'maxMiningSkills' }
  | { type: 'resetManaSkills' }
  | { type: 'buyUpgrade'; bookId: BookId }
  | { type: 'togglePin'; bookId: BookId }
  | { type: 'unlockBook'; bookId: BookId }
  | { type: 'unlockAllBooks' }
  | { type: 'selectForbiddenSealBook'; bookId: BookId }
  | { type: 'offerForbiddenGrimoire' }
  | { type: 'breakForbiddenSeal' }
  | { type: 'snakeTurn'; direction: SnakeDirection }
  | { type: 'toggleSnakeAutomation' }
  | { type: 'typeRuneKey'; key: string }
  | { type: 'dealBlackjack' }
  | { type: 'hitBlackjack' }
  | { type: 'standBlackjack' }
  | { type: 'advanceBlackjackDealer' }
  | { type: 'doubleBlackjack' }
  | { type: 'splitBlackjack' }
  | { type: 'chooseHundredOption'; optionId: HundredOptionId }
  | { type: 'attackTarget'; targetId: number }
  | { type: 'digMiningBlock'; blockId: number }
  | { type: 'trainSlime'; commandId: SlimeTrainerCommandId }
  | { type: 'enemyAttackSlime' }
  | { type: 'grantDebugResources' };

export function applyAction(state: GameState, action: GameAction): void {
  switch (action.type) {
    case 'selectBook':
      if (state.books[action.bookId].unlocked) {
        state.selectedBook = action.bookId;
        openBookPanel(state, action.bookId);
      }
      return;
    case 'closeBookPanel':
      closeBookPanel(state, action.bookId);
      return;
    case 'moveBookPanel':
      moveBookPanel(state, action.bookId);
      return;
    case 'chargeMana':
      chargeMana(state);
      return;
    case 'buyManaSkill':
      buyManaSkill(state, action.skillId);
      return;
    case 'buySnakeSkill':
      buySnakeSkill(state, action.skillId);
      return;
    case 'buyTargetSkill':
      buyTargetSkill(state, action.skillId);
      return;
    case 'buyMiningSkill':
      buyMiningSkill(state, action.skillId);
      return;
    case 'unlockBlackjackBonus':
      unlockBlackjackBonus(state, action.bonusId);
      return;
    case 'buyBlackjackBonusUpgrade':
      buyBlackjackBonusUpgrade(state, action.bonusId);
      return;
    case 'buyBlackjackActionUpgrade':
      buyBlackjackActionUpgrade(state);
      return;
    case 'buyBlackjackUpgradeCell':
      buyBlackjackUpgradeCell(state, action.cellId);
      return;
    case 'toggleBlackjackBonusAuto':
      toggleBlackjackBonusAuto(state, action.bonusId);
      return;
    case 'activateBlackjackBonus':
      activateBlackjackBonus(state, action.bonusId);
      return;
    case 'prepareBlackjackWager':
      prepareBlackjackWager(state, action.amount);
      return;
    case 'resetBlackjackWager':
      resetBlackjackWager(state);
      return;
    case 'increaseBlackjackBaseBet':
      increaseBlackjackBaseBet(state);
      return;
    case 'decreaseBlackjackBaseBet':
      decreaseBlackjackBaseBet(state);
      return;
    case 'buyBlackjackAutoDeal':
      buyBlackjackAutoDeal(state);
      return;
    case 'maxManaSkills':
      maxManaSkills(state);
      return;
    case 'maxSnakeSkills':
      maxSnakeSkills(state);
      return;
    case 'maxMiningSkills':
      maxMiningSkills(state);
      return;
    case 'resetManaSkills':
      resetManaSkills(state);
      return;
    case 'buyUpgrade':
      buyUpgrade(state, action.bookId);
      return;
    case 'togglePin':
      togglePin(state, action.bookId);
      return;
    case 'unlockBook':
      unlockBook(state, action.bookId);
      return;
    case 'unlockAllBooks':
      unlockAllBooks(state);
      return;
    case 'selectForbiddenSealBook':
      selectForbiddenSealBook(state, action.bookId);
      return;
    case 'offerForbiddenGrimoire':
      offerForbiddenGrimoire(state);
      return;
    case 'breakForbiddenSeal':
      breakForbiddenSeal(state);
      return;
    case 'snakeTurn':
      snakeTurn(state, action.direction);
      return;
    case 'toggleSnakeAutomation':
      toggleSnakeAutomation(state);
      return;
    case 'typeRuneKey':
      typeRuneKey(state, action.key);
      return;
    case 'dealBlackjack':
      dealBlackjack(state);
      return;
    case 'hitBlackjack':
      hitBlackjack(state);
      return;
    case 'standBlackjack':
      standBlackjack(state);
      return;
    case 'advanceBlackjackDealer':
      advanceBlackjackDealer(state);
      return;
    case 'doubleBlackjack':
      doubleBlackjack(state);
      return;
    case 'splitBlackjack':
      splitBlackjack(state);
      return;
    case 'chooseHundredOption':
      chooseHundredOption(state, action.optionId);
      return;
    case 'attackTarget':
      attackTarget(state, action.targetId);
      return;
    case 'digMiningBlock':
      digMiningBlock(state, action.blockId);
      return;
    case 'trainSlime':
      trainSlime(state, action.commandId);
      return;
    case 'enemyAttackSlime':
      enemyAttackSlime(state);
      return;
    case 'grantDebugResources':
      grantDebugResources(state);
      return;
  }
}

export function tickState(state: GameState, now: number): void {
  const deltaSeconds = Math.min((now - state.lastTick) / 1000, 1);
  state.lastTick = now;

  for (const bookDefinition of books) {
    const book = state.books[bookDefinition.id];
    if (!book.unlocked || book.automation === 0) {
      continue;
    }

    const pinMultiplier = book.pinned ? 1 : 0.35;
    const amount = deltaSeconds * book.automation * pinMultiplier * (1 + book.level * 0.12);
    state.mana += amount * 0.65;
    if (bookDefinition.resourceId) {
      state.resources[bookDefinition.resourceId] += amount * 0.22;
    }
  }

  tickManaAutomation(state, deltaSeconds);
  tickSnake(state, deltaSeconds);
  tickDefense(state, deltaSeconds);
  tickTargets(state, deltaSeconds);
  tickMining(state, deltaSeconds);
  tickSlimeTrainer(state, deltaSeconds);
}

function chargeMana(state: GameState): void {
  const book = state.books.mana;
  const gain = rollManaClickGain(state);
  book.charge += 12 + book.level * 2;
  while (book.charge >= 100) {
    book.charge -= 100;
    state.forbiddenGrimoire.keys += 1;
    state.forbiddenGrimoire.pulse += 1;
  }
  state.mana += gain;
}

function tickManaAutomation(state: GameState, deltaSeconds: number): void {
  const skills = state.manaSkills;
  if (skills.automation <= 0) {
    skills.automationTimer = 0;
    return;
  }

  skills.automationTimer += deltaSeconds;
  const interval = manaAutomationInterval(skills.automation);
  if (skills.automationTimer < interval) {
    return;
  }

  const casts = Math.max(1, Math.floor(skills.automationTimer / interval));
  skills.automationTimer %= interval;
  const wandCount = manaWandCount(state);
  for (let cast = 0; cast < casts; cast += 1) {
    for (let wand = 0; wand < wandCount; wand += 1) {
      state.mana += rollManaClickGain(state);
    }
  }
  skills.autoCastCount += casts;
}

function rollManaClickGain(state: GameState): number {
  const skills = state.manaSkills;
  const baseGain = 1 + skills.power;
  const criticalChance = Math.min(20, skills.criticalHit) / 100;
  if (criticalChance <= 0 || Math.random() >= criticalChance) {
    return baseGain;
  }

  return baseGain * manaCriticalMultiplier(state);
}

export function manaCriticalMultiplier(state: GameState): number {
  return 2 + Math.min(40, state.manaSkills.criticalEffect) * 0.1;
}

export function manaAutomationInterval(level: number): number {
  if (level <= 0) {
    return 0;
  }
  return Math.max(0.5, 5 - (level - 1) * 0.1);
}

export function manaWandCount(state: GameState): number {
  if (state.manaSkills.automation <= 0) {
    return 0;
  }
  return 1 + Math.min(9, state.manaSkills.extraWands);
}

export function manaSkillCost(state: GameState, skillId: ManaSkillId): number {
  const level = state.manaSkills[skillId];
  switch (skillId) {
    case 'power':
      return Math.round(12 * Math.pow(1.38, level));
    case 'automation':
      return Math.round(90 * Math.pow(1.42, level));
    case 'criticalHit':
      return Math.round(80 * Math.pow(1.36, level));
    case 'criticalEffect':
      return Math.round(120 * Math.pow(1.32, level));
    case 'extraWands':
      return Math.round(260 * Math.pow(2.05, level));
  }
}

export function manaSkillMaxLevel(skillId: ManaSkillId): number | null {
  switch (skillId) {
    case 'criticalHit':
      return 20;
    case 'criticalEffect':
      return 40;
    case 'extraWands':
      return 9;
    case 'power':
    case 'automation':
      return null;
  }
}

export function snakeMoveInterval(state: GameState): number {
  return snakeMoveIntervalForSpeedLevel(state.snakeSkills.speed);
}

export function snakeGridSize(state: GameState): number {
  return snakeGridSizeForLevel(state.snakeSkills.gridSize);
}

export function snakeBaseMultiplier(state: GameState): number {
  return Math.min(5, 1 + state.snakeSkills.baseMultiplier * 0.1);
}

export function snakeComboMultiplier(state: GameState): number {
  return 1 + state.snake.comboSteps * 0.1;
}

export function snakeTotalMultiplier(state: GameState): number {
  return snakeBaseMultiplier(state) * snakeComboMultiplier(state) + snakeBonusMultiplier(state);
}

export function snakeBonusMultiplier(state: GameState): number {
  if (!state.snake.bonusFood) {
    return 0;
  }
  return snakeBonusFruitMultiplier(state.snake.bonusFood.type);
}

export function snakeBonusFruitMultiplier(type: SnakeBonusFruitType): number {
  switch (type) {
    case 'orange':
      return 0.2;
    case 'pear':
      return 0.4;
    case 'banana':
      return 1;
  }
}

export function snakeExtraLivesRemaining(state: GameState): number {
  return Math.max(0, state.snakeSkills.extraLife - state.snake.extraLivesUsed);
}

export function snakeAutomationActive(state: GameState): boolean {
  if (!state.snakeSkills.automationEnabled || state.snakeSkills.automation <= 0) {
    return false;
  }
  return state.snake.comboSteps <= Math.floor(snakeBaseMultiplier(state) * 10);
}

export function snakeSkillMaxLevel(skillId: SnakeSkillId): number {
  return DEBUG_SNAKE_SKILL_MAX_LEVELS[skillId];
}

export function snakeSkillCost(state: GameState, skillId: SnakeSkillId): number {
  const level = state.snakeSkills[skillId];
  switch (skillId) {
    case 'speed':
      return Math.round(25 * Math.pow(1.28, level));
    case 'gridSize':
      return Math.round(70 * Math.pow(1.38, level));
    case 'automation':
      return Math.round(160 * Math.pow(1.42, level));
    case 'baseMultiplier':
      return Math.round(55 * Math.pow(1.22, level));
    case 'bonusFruit':
      return Math.round(220 * Math.pow(2.2, level));
    case 'extraLife':
      return Math.round(320 * Math.pow(2.4, level));
    case 'edgeWrap':
      return Math.round(900 * Math.pow(2, level));
  }
}

export function targetSkillMaxLevel(skillId: TargetSkillId): number {
  return DEBUG_TARGET_SKILL_MAX_LEVELS[skillId];
}

export function targetSkillCost(state: GameState, skillId: TargetSkillId): number {
  const level = state.targetSkills[skillId];
  switch (skillId) {
    case 'spawnSpeed':
      return Math.round(85 * Math.pow(1.32, level));
    case 'targetCount':
      return Math.round(150 * Math.pow(1.58, level));
    case 'damage':
      return Math.round(100 * Math.pow(1.28, level));
    case 'automation':
      return Math.round(260 * Math.pow(1.44, level));
  }
}

export function miningSkillMaxLevel(skillId: MiningSkillId): number {
  return DEBUG_MINING_SKILL_MAX_LEVELS[skillId];
}

export function miningSkillCost(state: GameState, skillId: MiningSkillId): number {
  const level = state.miningSkills[skillId];
  switch (skillId) {
    case 'pickaxeForce':
      return Math.round(70 * Math.pow(1.28, level));
    case 'splashDamage':
      return Math.round(180 * Math.pow(1.42, level));
    case 'automation':
      return Math.round(280 * Math.pow(1.46, level));
  }
}

export function miningPickaxeDamage(state: GameState): number {
  return 1 + state.miningSkills.pickaxeForce;
}

export function miningSplashDamage(state: GameState): number {
  if (state.miningSkills.splashDamage <= 0) {
    return 0;
  }
  return 1 + Math.floor(state.miningSkills.splashDamage / 3);
}

export function miningAutomationInterval(level: number): number {
  if (level <= 0) {
    return 0;
  }
  return Math.max(0.55, 3.5 - (level - 1) * 0.16);
}

export function runeTypingCurrentWord(state: GameState): string {
  return runeWords[state.runeTyping.wordIndex % runeWords.length];
}

export function runeTypingRewardPreview(state: GameState): number {
  const typing = state.runeTyping;
  if (typing.currentWordHadMistake || typing.penaltyWordsRemaining > 0) {
    return 1;
  }
  return 1 + Math.min(4, Math.floor(typing.combo / 5));
}

function typeRuneKey(state: GameState, rawKey: string): void {
  if (!state.books.typing.unlocked || !isBookPanelOpen(state, 'typing')) {
    return;
  }

  const typing = state.runeTyping;
  typing.lastReward = 0;

  if (rawKey === 'Backspace') {
    typing.typed = typing.typed.slice(0, -1);
    typing.lastFeedback = 'idle';
    return;
  }

  const key = rawKey.toLowerCase();
  if (!/^[a-z]$/.test(key)) {
    return;
  }

  const word = runeTypingCurrentWord(state);
  const expected = word[typing.typed.length];
  if (key !== expected) {
    typing.currentWordHadMistake = true;
    typing.combo = 0;
    typing.penaltyWordsRemaining = Math.max(typing.penaltyWordsRemaining, 3);
    typing.lastFeedback = 'mistake';
    return;
  }

  typing.typed += key;
  typing.lastFeedback = 'correct';
  if (typing.typed.length >= word.length) {
    completeRuneWord(state, word);
  }
}

function completeRuneWord(state: GameState, completedWord: string): void {
  const typing = state.runeTyping;
  const wasPerfect = !typing.currentWordHadMistake;
  const reward = runeTypingRewardPreview(state);

  state.resources.runes += reward;
  typing.lastReward = reward;
  typing.lastCompletedWord = completedWord;
  typing.completedWords += 1;

  if (wasPerfect) {
    typing.combo += 1;
    typing.penaltyWordsRemaining = Math.max(0, typing.penaltyWordsRemaining - 1);
  } else {
    typing.combo = 0;
    typing.penaltyWordsRemaining = Math.max(typing.penaltyWordsRemaining, 3);
  }

  typing.wordIndex = (typing.wordIndex + 1) % runeWords.length;
  typing.typed = '';
  typing.currentWordHadMistake = false;
  typing.lastFeedback = 'complete';
}

function buySnakeSkill(state: GameState, skillId: SnakeSkillId): void {
  const maxLevel = snakeSkillMaxLevel(skillId);
  if (state.snakeSkills[skillId] >= maxLevel) {
    return;
  }

  const cost = snakeSkillCost(state, skillId);
  if (state.mana < cost) {
    return;
  }

  state.mana -= cost;
  state.snakeSkills[skillId] += 1;
  if (skillId === 'gridSize') {
    resizeSnakeGrid(state);
  }
  if (skillId === 'automation') {
    state.snakeSkills.automationEnabled = true;
  }
  if (skillId === 'bonusFruit' && !state.snake.bonusFood) {
    state.snake.bonusFood = nextBonusFood(state);
  }
}

function buyTargetSkill(state: GameState, skillId: TargetSkillId): void {
  const maxLevel = targetSkillMaxLevel(skillId);
  if (state.targetSkills[skillId] >= maxLevel) {
    return;
  }

  const cost = targetSkillCost(state, skillId);
  if (state.mana < cost) {
    return;
  }

  state.mana -= cost;
  state.targetSkills[skillId] += 1;
}

function buyMiningSkill(state: GameState, skillId: MiningSkillId): void {
  const maxLevel = miningSkillMaxLevel(skillId);
  if (state.miningSkills[skillId] >= maxLevel) {
    return;
  }

  const cost = miningSkillCost(state, skillId);
  if (state.mana < cost) {
    return;
  }

  state.mana -= cost;
  state.miningSkills[skillId] += 1;
}

function unlockBlackjackBonus(state: GameState, bonusId: BlackjackSideBonusId): void {
  if (!state.books.blackjack.unlocked) {
    return;
  }

  const bonus = blackjackBonusTrack(state, bonusId);
  if (bonus.unlocked) {
    return;
  }

  if (bonusId === 'twentyOneThree' && !state.blackjack.pair.unlocked) {
    return;
  }

  const cost = blackjackBonusUnlockCost(bonusId);
  if (state.resources.chips < cost) {
    return;
  }

  state.resources.chips -= cost;
  bonus.unlocked = true;
  bonus.level = 1;
  bonus.lastOutcome = 'Pret';
}

function buyBlackjackBonusUpgrade(state: GameState, bonusId: BlackjackSideBonusId): void {
  const bonus = blackjackBonusTrack(state, bonusId);
  if (!bonus.unlocked || bonus.level >= blackjackBonusMaxLevel()) {
    return;
  }

  const cost = blackjackBonusUpgradeXpCost(bonus.level);
  if (bonus.xp < cost) {
    return;
  }

  bonus.xp -= cost;
  bonus.level += 1;
  if (blackjackBonusAutoUnlocked(bonus.level)) {
    bonus.autoEnabled = true;
  }
  bonus.lastOutcome = `Niveau ${bonus.level}`;
}

function buyBlackjackActionUpgrade(state: GameState): void {
  if (!state.books.blackjack.unlocked) {
    return;
  }

  const actions = state.blackjack.actions;
  if (actions.level >= blackjackActionMaxLevel()) {
    return;
  }

  const cost = blackjackActionUpgradeCost(actions.level);
  if (state.resources.chips < cost) {
    return;
  }

  state.resources.chips -= cost;
  actions.unlocked = true;
  actions.level += 1;
  actions.lastOutcome = `Niveau ${actions.level}`;
}

function buyBlackjackUpgradeCell(state: GameState, cellId: BlackjackUpgradeCellId): void {
  if (!state.books.blackjack.unlocked || !blackjackCanBuyUpgradeCell(state, cellId)) {
    return;
  }

  const cost = blackjackCurrentUpgradeCellCost(state, cellId);
  if (!payBlackjackUpgradeCellCost(state, cost)) {
    return;
  }

  ensureBlackjackUpgradeCells(state);
  state.blackjack.upgradeCells[cellId] = Math.min(
    blackjackUpgradeCellMaxLevel(cellId),
    blackjackUpgradeCellLevel(state, cellId) + 1,
  );
  applyBlackjackUpgradeCellSideEffects(state, cellId);
}

function ensureBlackjackUpgradeCells(state: GameState): void {
  if (!state.blackjack.upgradeCells) {
    state.blackjack.upgradeCells = {} as GameState['blackjack']['upgradeCells'];
  }
  for (const cellId of BLACKJACK_UPGRADE_CELL_IDS) {
    if (!Number.isFinite(state.blackjack.upgradeCells[cellId])) {
      state.blackjack.upgradeCells[cellId] = 1;
    }
  }
}

function payBlackjackUpgradeCellCost(state: GameState, cost: BlackjackUpgradeCost): boolean {
  switch (cost.kind) {
    case 'resources':
      if (state.mana < cost.mana || state.resources.chips < cost.chips) {
        return false;
      }
      state.mana -= cost.mana;
      state.resources.chips -= cost.chips;
      return true;
    case 'chips':
      if (state.resources.chips < cost.chips) {
        return false;
      }
      state.resources.chips -= cost.chips;
      return true;
    case 'pairXp': {
      const bonus = state.blackjack.pair;
      if (bonus.xp < cost.xp) {
        return false;
      }
      bonus.xp -= cost.xp;
      return true;
    }
    case 'twentyOneThreeXp': {
      const bonus = state.blackjack.twentyOneThree;
      if (bonus.xp < cost.xp) {
        return false;
      }
      bonus.xp -= cost.xp;
      return true;
    }
    case 'blocked':
    case 'max':
      return false;
  }
}

function applyBlackjackUpgradeCellSideEffects(state: GameState, cellId: BlackjackUpgradeCellId): void {
  const level = blackjackUpgradeCellLevel(state, cellId);
  switch (cellId) {
    case 'wagerBase':
      state.books.blackjack.level = Math.max(state.books.blackjack.level, level);
      state.blackjack.baseBetLevel = Math.max(1, Math.min(level, state.blackjack.baseBetLevel || level));
      return;
    case 'actionStand':
    case 'actionDouble':
    case 'actionSplit':
    case 'actionFaceSplit':
    case 'actionMastery':
      state.blackjack.actions.unlocked = true;
      state.blackjack.actions.level = blackjackEffectiveActionSummaryLevel(state);
      state.blackjack.actions.lastOutcome = `Niveau ${state.blackjack.actions.level}`;
      return;
    case 'autoDeal':
      if (level >= blackjackUpgradeCellMaxLevel(cellId)) {
        state.books.blackjack.automation = Math.max(state.books.blackjack.automation, 0.35);
      }
      return;
    case 'autoSpeed':
      if (state.books.blackjack.automation > 0) {
        state.books.blackjack.automation = Math.max(0.18, 0.35 - (level - 1) * 0.07);
      }
      return;
    case 'pairUnlock':
      if (level >= blackjackUpgradeCellMaxLevel(cellId)) {
        state.blackjack.pair.unlocked = true;
        state.blackjack.pair.level = Math.max(1, state.blackjack.pair.level);
        state.blackjack.pair.lastOutcome = 'Pret';
      }
      return;
    case 'pairAuto':
      if (level >= blackjackUpgradeCellMaxLevel(cellId)) {
        state.blackjack.pair.autoEnabled = true;
      }
      return;
    case 'twentyOneThreeUnlock':
      if (level >= blackjackUpgradeCellMaxLevel(cellId)) {
        state.blackjack.twentyOneThree.unlocked = true;
        state.blackjack.twentyOneThree.level = Math.max(1, state.blackjack.twentyOneThree.level);
        state.blackjack.twentyOneThree.lastOutcome = 'Pret';
      }
      return;
    case 'twentyOneThreeAuto':
      if (level >= blackjackUpgradeCellMaxLevel(cellId)) {
        state.blackjack.twentyOneThree.autoEnabled = true;
      }
      return;
    default:
      return;
  }
}

function toggleBlackjackBonusAuto(state: GameState, bonusId: BlackjackSideBonusId): void {
  const bonus = blackjackBonusTrack(state, bonusId);
  if (!bonus.unlocked || !blackjackBonusAutoUnlocked(bonus.level)) {
    return;
  }
  bonus.autoEnabled = !bonus.autoEnabled;
}

function blackjackBonusUnlockCost(bonusId: BlackjackSideBonusId): number {
  return bonusId === 'pair' ? 80 : 160;
}

function blackjackBonusTrack(state: GameState, bonusId: BlackjackSideBonusId) {
  return bonusId === 'pair' ? state.blackjack.pair : state.blackjack.twentyOneThree;
}

function toggleSnakeAutomation(state: GameState): void {
  if (!state.books.serpent.unlocked || state.snakeSkills.automation <= 0) {
    return;
  }
  state.snakeSkills.automationEnabled = !state.snakeSkills.automationEnabled;
}

function buyManaSkill(state: GameState, skillId: ManaSkillId): void {
  const maxLevel = manaSkillMaxLevel(skillId);
  if (maxLevel !== null && state.manaSkills[skillId] >= maxLevel) {
    return;
  }

  const cost = manaSkillCost(state, skillId);
  if (state.mana < cost) {
    return;
  }

  state.mana -= cost;
  state.manaSkills[skillId] += 1;
}

function maxManaSkills(state: GameState): void {
  state.manaSkills.power = DEBUG_MANA_SKILL_MAX_LEVELS.power;
  state.manaSkills.automation = DEBUG_MANA_SKILL_MAX_LEVELS.automation;
  state.manaSkills.criticalHit = DEBUG_MANA_SKILL_MAX_LEVELS.criticalHit;
  state.manaSkills.criticalEffect = DEBUG_MANA_SKILL_MAX_LEVELS.criticalEffect;
  state.manaSkills.extraWands = DEBUG_MANA_SKILL_MAX_LEVELS.extraWands;
  state.manaSkills.automationTimer = 0;
}

function maxSnakeSkills(state: GameState): void {
  state.snakeSkills.speed = DEBUG_SNAKE_SKILL_MAX_LEVELS.speed;
  state.snakeSkills.gridSize = DEBUG_SNAKE_SKILL_MAX_LEVELS.gridSize;
  state.snakeSkills.automation = DEBUG_SNAKE_SKILL_MAX_LEVELS.automation;
  state.snakeSkills.baseMultiplier = DEBUG_SNAKE_SKILL_MAX_LEVELS.baseMultiplier;
  state.snakeSkills.bonusFruit = DEBUG_SNAKE_SKILL_MAX_LEVELS.bonusFruit;
  state.snakeSkills.extraLife = DEBUG_SNAKE_SKILL_MAX_LEVELS.extraLife;
  state.snakeSkills.edgeWrap = DEBUG_SNAKE_SKILL_MAX_LEVELS.edgeWrap;
  state.snakeSkills.automationEnabled = true;
  resizeSnakeGrid(state);
  if (!state.snake.bonusFood) {
    state.snake.bonusFood = nextBonusFood(state);
  }
}

function maxMiningSkills(state: GameState): void {
  state.miningSkills.pickaxeForce = DEBUG_MINING_SKILL_MAX_LEVELS.pickaxeForce;
  state.miningSkills.splashDamage = DEBUG_MINING_SKILL_MAX_LEVELS.splashDamage;
  state.miningSkills.automation = DEBUG_MINING_SKILL_MAX_LEVELS.automation;
  state.miningSkills.automationTimer = 0;
}

function resizeSnakeGrid(state: GameState): void {
  state.snake.gridSize = snakeGridSize(state);
  resetSnakeRun(state);
}

function resetManaSkills(state: GameState): void {
  state.manaSkills.power = 0;
  state.manaSkills.automation = 0;
  state.manaSkills.criticalHit = 0;
  state.manaSkills.criticalEffect = 0;
  state.manaSkills.extraWands = 0;
  state.manaSkills.automationTimer = 0;
  state.manaSkills.autoCastCount = 0;
}

function buyUpgrade(state: GameState, bookId: BookId): void {
  const book = state.books[bookId];
  if (!book.unlocked) {
    return;
  }

  if (!canBuyUpgrade(state, bookId)) {
    return;
  }

  const definition = getBook(bookId);
  const cost = Math.round(20 * Math.pow(1.55, book.level - 1));
  const resourceCost = Math.round(3 * Math.pow(1.35, book.level - 1));
  state.mana -= cost;
  if (definition.resourceId) {
    state.resources[definition.resourceId] -= resourceCost;
  }
  book.level += 1;
  if (bookId === 'blackjack') {
    state.blackjack.baseBetLevel = book.level;
  }
  if (bookId !== 'blackjack' && book.level >= 2) {
    book.automation = Math.max(book.automation, 0.35);
  }
  if (bookId !== 'blackjack' && book.level >= 4) {
    book.automation += 0.15;
  }
}

function canBuyUpgrade(state: GameState, bookId: BookId): boolean {
  const book = state.books[bookId];
  if (!book.unlocked) {
    return false;
  }

  const definition = getBook(bookId);
  const cost = Math.round(20 * Math.pow(1.55, book.level - 1));
  const resourceCost = Math.round(3 * Math.pow(1.35, book.level - 1));
  return state.mana >= cost && (!definition.resourceId || state.resources[definition.resourceId] >= resourceCost);
}

function blackjackCurrentBaseBetLevel(state: GameState): number {
  const savedLevel = state.blackjack.baseBetLevel ?? state.books.blackjack.level;
  return Math.max(1, Math.min(state.books.blackjack.level, savedLevel));
}

function togglePin(state: GameState, bookId: BookId): void {
  const book = state.books[bookId];
  if (!book.unlocked) {
    return;
  }
  const pinnedCount = Object.values(state.books).filter((candidate) => candidate.pinned).length;
  if (!book.pinned && pinnedCount >= 3) {
    return;
  }
  book.pinned = !book.pinned;
}

function unlockBook(state: GameState, bookId: BookId): void {
  const book = state.books[bookId];
  if (book.unlocked) {
    return;
  }
  if (state.forbiddenGrimoire.keys <= 0) {
    return;
  }

  const definition = getBook(bookId);
  if (state.mana < definition.unlockMana) {
    return;
  }
  if (definition.unlockResource && state.resources[definition.unlockResource.id] < definition.unlockResource.amount) {
    return;
  }

  state.mana -= definition.unlockMana;
  if (definition.unlockResource) {
    state.resources[definition.unlockResource.id] -= definition.unlockResource.amount;
  }
  state.forbiddenGrimoire.keys -= 1;
  book.unlocked = true;
  state.selectedBook = bookId;
  openBookPanel(state, bookId);
  if (state.forbiddenGrimoire.selectedBookId === bookId) {
    state.forbiddenGrimoire.selectedBookId = null;
    state.forbiddenGrimoire.offerings = emptyForbiddenOfferings();
    state.forbiddenGrimoire.lastOffered = {};
  }
  state.forbiddenGrimoire.lastUnlockedBookId = bookId;
  state.forbiddenGrimoire.pulse += 1;
}

function unlockAllBooks(state: GameState): void {
  for (const book of books) {
    state.books[book.id].unlocked = true;
  }
}

export function forbiddenGrimoireCurrentSeal(state: GameState) {
  if (state.forbiddenGrimoire.selectedBookId) {
    return getForbiddenGrimoireSealForBook(state.forbiddenGrimoire.selectedBookId);
  }
  return null;
}

export function forbiddenGrimoireSealReady(state: GameState): boolean {
  const seal = forbiddenGrimoireCurrentSeal(state);
  if (!seal) {
    return false;
  }
  return seal.requirements.every((requirement) => forbiddenOfferingAmount(state, requirement.id) >= requirement.amount);
}

export function forbiddenGrimoireCanOffer(state: GameState): boolean {
  const seal = forbiddenGrimoireCurrentSeal(state);
  if (!seal || forbiddenGrimoireSealReady(state)) {
    return false;
  }
  return seal.requirements.some((requirement) => {
    const remaining = requirement.amount - forbiddenOfferingAmount(state, requirement.id);
    return remaining > 0 && availableOfferingResource(state, requirement.id) > 0;
  });
}

export function forbiddenGrimoireRequirementProgress(state: GameState, requirement: ForbiddenGrimoireRequirement): number {
  return Math.min(requirement.amount, forbiddenOfferingAmount(state, requirement.id));
}

function selectForbiddenSealBook(state: GameState, bookId: BookId): void {
  if (bookId === 'mana' || state.books[bookId].unlocked || !getForbiddenGrimoireSealForBook(bookId)) {
    state.forbiddenGrimoire.selectedBookId = null;
    state.forbiddenGrimoire.offerings = emptyForbiddenOfferings();
    state.forbiddenGrimoire.lastOffered = {};
    return;
  }

  if (state.forbiddenGrimoire.selectedBookId === bookId) {
    return;
  }

  state.forbiddenGrimoire.selectedBookId = bookId;
  state.forbiddenGrimoire.offerings = emptyForbiddenOfferings();
  state.forbiddenGrimoire.lastOffered = {};
}

function offerForbiddenGrimoire(state: GameState): void {
  const seal = forbiddenGrimoireCurrentSeal(state);
  if (!seal || forbiddenGrimoireSealReady(state)) {
    state.forbiddenGrimoire.lastOffered = {};
    return;
  }

  const lastOffered: Partial<Record<ForbiddenOfferingResourceId, number>> = {};
  for (const requirement of seal.requirements) {
    const current = forbiddenOfferingAmount(state, requirement.id);
    const remaining = requirement.amount - current;
    if (remaining <= 0) {
      continue;
    }

    const available = availableOfferingResource(state, requirement.id);
    const offered = Math.min(available, remaining);
    if (offered <= 0) {
      continue;
    }

    spendOfferingResource(state, requirement.id, offered);
    state.forbiddenGrimoire.offerings[requirement.id] += offered;
    lastOffered[requirement.id] = offered;
  }

  state.forbiddenGrimoire.lastOffered = lastOffered;
  if (Object.keys(lastOffered).length > 0) {
    state.forbiddenGrimoire.pulse += 1;
  }
}

function breakForbiddenSeal(state: GameState): void {
  const seal = forbiddenGrimoireCurrentSeal(state);
  if (!seal || !forbiddenGrimoireSealReady(state) || state.forbiddenGrimoire.keys <= 0) {
    return;
  }

  const unlockedBook = state.books[seal.unlocksBookId];
  unlockedBook.unlocked = true;
  state.selectedBook = seal.unlocksBookId;
  openBookPanel(state, seal.unlocksBookId);
  state.forbiddenGrimoire.keys -= 1;
  state.forbiddenGrimoire.selectedBookId = null;
  state.forbiddenGrimoire.offerings = emptyForbiddenOfferings();
  state.forbiddenGrimoire.lastOffered = {};
  state.forbiddenGrimoire.lastUnlockedBookId = seal.unlocksBookId;
  state.forbiddenGrimoire.pulse += 1;
}

function forbiddenOfferingAmount(state: GameState, id: ForbiddenOfferingResourceId): number {
  return state.forbiddenGrimoire.offerings[id];
}

function availableOfferingResource(state: GameState, id: ForbiddenOfferingResourceId): number {
  if (id === 'mana') {
    return state.mana;
  }
  return state.resources[id];
}

function spendOfferingResource(state: GameState, id: ForbiddenOfferingResourceId, amount: number): void {
  if (id === 'mana') {
    state.mana -= amount;
    return;
  }
  state.resources[id] -= amount;
}

function emptyForbiddenOfferings(): Record<ForbiddenOfferingResourceId, number> {
  return {
    mana: 0,
    scales: 0,
    runes: 0,
    spores: 0,
    sigils: 0,
    chips: 0,
    fragments: 0,
    minerals: 0,
    marks: 0,
    gels: 0,
  };
}

function openBookPanel(state: GameState, bookId: BookId): void {
  const existingPanel = state.openBookPanels.find((panel) => panel.bookId === bookId);
  if (existingPanel) {
    return;
  }

  const usedSlots = new Set(state.openBookPanels.map((panel) => panel.slot));
  const nextSlot = BOOK_PANEL_SLOTS.find((slot) => !usedSlots.has(slot)) ?? BOOK_PANEL_SLOTS[0];
  if (state.openBookPanels.length < BOOK_PANEL_SLOTS.length) {
    state.openBookPanels.push({ bookId, slot: nextSlot });
    return;
  }

  const replaceIndex = Math.max(0, state.openBookPanels.findIndex((panel) => panel.bookId !== state.selectedBook));
  const releasedSlot = state.openBookPanels[replaceIndex]?.slot ?? nextSlot;
  state.openBookPanels.splice(replaceIndex, 1);
  state.openBookPanels.push({ bookId, slot: releasedSlot });
}

function closeBookPanel(state: GameState, bookId: BookId): void {
  state.openBookPanels = state.openBookPanels.filter((panel) => panel.bookId !== bookId);
  if (state.selectedBook === bookId && state.openBookPanels.length > 0) {
    state.selectedBook = state.openBookPanels[state.openBookPanels.length - 1].bookId;
  }
}

function moveBookPanel(state: GameState, bookId: BookId): void {
  const currentPanel = state.openBookPanels.find((panel) => panel.bookId === bookId);
  if (!currentPanel) {
    return;
  }

  const nextSlot = BOOK_PANEL_SLOTS[(BOOK_PANEL_SLOTS.indexOf(currentPanel.slot) + 1) % BOOK_PANEL_SLOTS.length];
  const otherPanel = state.openBookPanels.find((panel) => panel.slot === nextSlot);
  if (otherPanel) {
    otherPanel.slot = currentPanel.slot;
  }
  currentPanel.slot = nextSlot;
}

function isBookPanelOpen(state: GameState, bookId: BookId): boolean {
  return state.openBookPanels.some((panel) => panel.bookId === bookId);
}

function snakeTurn(state: GameState, direction: SnakeDirection): void {
  const book = state.books.serpent;
  if (!book.unlocked) {
    return;
  }

  if (!canQueueSnakeDirection(state.snake.direction, state.snake.nextDirection, direction)) {
    return;
  }

  state.snake.nextDirection = direction;
  state.snake.running = true;
}

function tickSnake(state: GameState, deltaSeconds: number): void {
  const book = state.books.serpent;
  const snake = state.snake;
  snake.lastReward = 0;
  snake.invincibleTimer = Math.max(0, snake.invincibleTimer - deltaSeconds);

  if (!book.unlocked || !isBookPanelOpen(state, 'serpent')) {
    return;
  }

  snake.running = true;
  snake.moveTimer += deltaSeconds;
  const moveEvery = snakeMoveInterval(state);
  if (snake.moveTimer < moveEvery) {
    return;
  }
  snake.moveTimer = 0;
  if (snakeAutomationActive(state)) {
    snake.nextDirection = automatedSnakeDirection(state) ?? snake.nextDirection;
  }
  advanceSnake(state);
}

function advanceSnake(state: GameState): void {
  const snake = state.snake;
  const direction = committedSnakeDirection(snake.direction, snake.nextDirection);
  snake.nextDirection = direction;
  const head = snake.body[0];
  const nextHead = nextSnakeHead(state, head, direction);
  const hitWall = isOutOfBounds(nextHead, snake.gridSize);
  const hitBody = snake.body.some((cell) => cellsMatch(cell, nextHead));

  if (hitWall || (hitBody && snake.invincibleTimer <= 0)) {
    handleSnakeCollision(state);
    return;
  }

  snake.direction = direction;
  snake.moveFrame = ((snake.moveFrame ?? 0) + 1) % 2;
  const ateFood = cellsMatch(nextHead, snake.food);
  const ateBonusFood = snake.bonusFood ? cellsMatch(nextHead, snake.bonusFood.cell) : false;
  snake.body = [nextHead, ...snake.body];

  if (ateFood || ateBonusFood) {
    const book = state.books.serpent;
    snake.comboSteps += 1;
    const bonusMultiplier = ateBonusFood && snake.bonusFood ? snakeBonusFruitMultiplier(snake.bonusFood.type) : 0;
    const rewardMultiplier = snakeBaseMultiplier(state) * snakeComboMultiplier(state) + bonusMultiplier;
    const reward = Math.max(1, Math.round((1 + Math.floor(book.level * 0.4)) * rewardMultiplier));
    snake.score += reward;
    snake.best = Math.max(snake.best, snake.score);
    snake.lastReward = reward;
    state.resources.scales += reward;
    state.mana += 1 + book.level * 0.25;
    if (ateFood) {
      snake.food = randomSnakeFood(excludedSnakeFoodCells(state), snake.gridSize);
    }
    if (ateBonusFood) {
      snake.bonusFood = nextBonusFood(state);
    } else if (!snake.bonusFood) {
      snake.bonusFood = nextBonusFood(state);
    }
    return;
  }

  snake.body.pop();
}

function handleSnakeCollision(state: GameState): void {
  const snake = state.snake;
  if (snake.invincibleTimer > 0) {
    return;
  }
  if (snakeExtraLivesRemaining(state) > 0) {
    snake.extraLivesUsed += 1;
    snake.invincibleTimer = 2;
    return;
  }
  resetSnakeRun(state);
}

function resetSnakeRun(state: GameState): void {
  const snake = state.snake;
  snake.score = 0;
  snake.comboSteps = 0;
  snake.extraLivesUsed = 0;
  snake.invincibleTimer = 0;
  snake.gridSize = snakeGridSize(state);
  snake.body = createStartingSnakeBody(snake.gridSize);
  snake.direction = 'right';
  snake.nextDirection = 'right';
  snake.food = randomSnakeFood(snake.body, snake.gridSize);
  snake.bonusFood = nextBonusFood(state);
  snake.moveTimer = 0;
  snake.moveFrame = 0;
  snake.running = true;
  snake.lastReward = 0;
}

function nextSnakeHead(state: GameState, cell: SnakeCell, direction: SnakeDirection): SnakeCell {
  const next = nextCell(cell, direction);
  if (state.snakeSkills.edgeWrap <= 0 || !isOutOfBounds(next, state.snake.gridSize)) {
    return next;
  }

  return {
    x: (next.x + state.snake.gridSize) % state.snake.gridSize,
    y: (next.y + state.snake.gridSize) % state.snake.gridSize,
  };
}

function nextCell(cell: SnakeCell, direction: SnakeDirection): SnakeCell {
  switch (direction) {
    case 'up':
      return { x: cell.x, y: cell.y - 1 };
    case 'right':
      return { x: cell.x + 1, y: cell.y };
    case 'down':
      return { x: cell.x, y: cell.y + 1 };
    case 'left':
      return { x: cell.x - 1, y: cell.y };
  }
}

function isOutOfBounds(cell: SnakeCell, gridSize: number): boolean {
  return cell.x < 0 || cell.y < 0 || cell.x >= gridSize || cell.y >= gridSize;
}

function cellsMatch(first: SnakeCell, second: SnakeCell): boolean {
  return first.x === second.x && first.y === second.y;
}

function nextBonusFood(state: GameState): GameState['snake']['bonusFood'] {
  const type = snakeBonusFruitType(state);
  if (!type) {
    return null;
  }
  return {
    type,
    cell: randomSnakeFood(excludedSnakeFoodCells(state), state.snake.gridSize),
  };
}

function snakeBonusFruitType(state: GameState): SnakeBonusFruitType | null {
  const unlockedTypes: SnakeBonusFruitType[] = [];
  if (state.snakeSkills.bonusFruit >= 1) {
    unlockedTypes.push('orange');
  }
  if (state.snakeSkills.bonusFruit >= 2) {
    unlockedTypes.push('pear');
  }
  if (state.snakeSkills.bonusFruit >= 3) {
    unlockedTypes.push('banana');
  }
  return unlockedTypes.length > 0 ? unlockedTypes[Math.floor(Math.random() * unlockedTypes.length)] : null;
}

function excludedSnakeFoodCells(state: GameState): SnakeCell[] {
  return state.snake.bonusFood ? [...state.snake.body, state.snake.food, state.snake.bonusFood.cell] : [...state.snake.body, state.snake.food];
}

function automatedSnakeDirection(state: GameState): SnakeDirection | null {
  const snake = state.snake;
  const head = snake.body[0];
  const target = snake.bonusFood?.cell ?? snake.food;
  const candidates: SnakeDirection[] = ['up', 'right', 'down', 'left'];
  let best: { direction: SnakeDirection; distance: number } | null = null;

  for (const direction of candidates) {
    if (!canQueueSnakeDirection(snake.direction, snake.nextDirection, direction)) {
      continue;
    }

    const next = nextSnakeHead(state, head, direction);
    if (isOutOfBounds(next, snake.gridSize) || snake.body.some((cell) => cellsMatch(cell, next))) {
      continue;
    }

    const distance = Math.abs(next.x - target.x) + Math.abs(next.y - target.y);
    if (!best || distance < best.distance) {
      best = { direction, distance };
    }
  }

  return best?.direction ?? null;
}

export function defenseWaveEnemyCount(state: GameState): number {
  return 4 + Math.min(10, state.defense.wave + state.books.defense.level);
}

export function defenseTowerDamage(state: GameState): number {
  return 1 + Math.floor(state.books.defense.level * 0.55);
}

export function defenseTowerAttackInterval(state: GameState): number {
  return Math.max(0.28, 0.78 - state.books.defense.level * 0.035);
}

export function defenseWaveProgress(state: GameState): number {
  return state.defense.spawnedThisWave / defenseWaveEnemyCount(state);
}

export function blackjackHandValue(hand: BlackjackCard[]): number {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.rank === 'A') {
      aces += 1;
      total += 11;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

export function blackjackCurrentMainBet(state: GameState): number {
  return blackjackMainBet(blackjackCurrentBaseBetLevel(state));
}

export function blackjackUpgradeCellLevel(state: GameState, cellId: BlackjackUpgradeCellId): number {
  const maxLevel = blackjackUpgradeCellMaxLevel(cellId);
  const savedLevel = state.blackjack.upgradeCells?.[cellId];
  if (Number.isFinite(savedLevel)) {
    return Math.max(1, Math.min(maxLevel, savedLevel));
  }

  switch (cellId) {
    case 'wagerBase':
    case 'wagerWin':
    case 'wagerNatural':
    case 'wagerStreak':
    case 'wagerDebt':
      return Math.max(1, Math.min(maxLevel, state.books.blackjack.level));
    case 'actionStand':
    case 'actionDouble':
    case 'actionSplit':
    case 'actionFaceSplit':
    case 'actionMastery':
      return Math.max(1, Math.min(maxLevel, state.blackjack.actions.level + 1));
    case 'pairUnlock':
      return state.blackjack.pair.unlocked ? maxLevel : 1;
    case 'pairPayout':
    case 'pairXp':
    case 'pairRefund':
    case 'pairAuto':
      return Math.max(1, Math.min(maxLevel, state.blackjack.pair.level));
    case 'twentyOneThreeUnlock':
      return state.blackjack.twentyOneThree.unlocked ? maxLevel : 1;
    case 'twentyOneThreePayout':
    case 'twentyOneThreeXp':
    case 'twentyOneThreeJackpot':
    case 'twentyOneThreeAuto':
      return Math.max(1, Math.min(maxLevel, state.blackjack.twentyOneThree.level));
    case 'autoDeal':
      return blackjackAutoDealUnlocked(state) ? maxLevel : 1;
    case 'autoSpeed':
      return blackjackAutoDealUnlocked(state) ? Math.max(1, Math.min(maxLevel, Math.round((0.35 - state.books.blackjack.automation) / 0.07) + 1)) : 1;
  }
}

export function blackjackCurrentUpgradeCellMaxLevel(cellId: BlackjackUpgradeCellId): number {
  return blackjackUpgradeCellMaxLevel(cellId);
}

export function blackjackCurrentUpgradeCellTier(state: GameState, cellId: BlackjackUpgradeCellId): BlackjackUpgradeTier {
  return blackjackUpgradeTier(blackjackUpgradeCellLevel(state, cellId), blackjackUpgradeCellMaxLevel(cellId));
}

export function blackjackCurrentUpgradeCellCost(state: GameState, cellId: BlackjackUpgradeCellId): BlackjackUpgradeCost {
  const level = blackjackUpgradeCellLevel(state, cellId);
  if (level >= blackjackUpgradeCellMaxLevel(cellId)) {
    return { kind: 'max' };
  }

  if (cellId === 'twentyOneThreeUnlock' && !state.blackjack.pair.unlocked) {
    return { kind: 'blocked', reason: 'Pair requis' };
  }
  if (cellId.startsWith('pair') && cellId !== 'pairUnlock' && !state.blackjack.pair.unlocked) {
    return { kind: 'blocked', reason: 'Pair requis' };
  }
  if (cellId.startsWith('twentyOneThree') && cellId !== 'twentyOneThreeUnlock' && !state.blackjack.twentyOneThree.unlocked) {
    return { kind: 'blocked', reason: '21+3 requis' };
  }
  if (cellId === 'autoSpeed' && !blackjackAutoDealUnlocked(state)) {
    return { kind: 'blocked', reason: 'Auto requis' };
  }

  return blackjackUpgradeCellCost(cellId, level);
}

export function blackjackCanBuyUpgradeCell(state: GameState, cellId: BlackjackUpgradeCellId): boolean {
  const cost = blackjackCurrentUpgradeCellCost(state, cellId);
  switch (cost.kind) {
    case 'resources':
      return state.books.blackjack.unlocked && state.mana >= cost.mana && state.resources.chips >= cost.chips;
    case 'chips':
      return state.books.blackjack.unlocked && state.resources.chips >= cost.chips;
    case 'pairXp':
      return state.books.blackjack.unlocked && state.blackjack.pair.xp >= cost.xp;
    case 'twentyOneThreeXp':
      return state.books.blackjack.unlocked && state.blackjack.twentyOneThree.xp >= cost.xp;
    case 'blocked':
    case 'max':
      return false;
  }
}

export function blackjackCurrentUpgradeCellEffectLabel(state: GameState, cellId: BlackjackUpgradeCellId): string {
  const level = blackjackUpgradeCellLevel(state, cellId);
  const nextLevel = Math.min(blackjackUpgradeCellMaxLevel(cellId), level + 1);
  switch (cellId) {
    case 'wagerBase':
      return `Mise max ${blackjackMainBet(level)} -> ${blackjackMainBet(nextLevel)}.`;
    case 'wagerWin':
      return `Victoire x${blackjackWinPayoutMultiplier(level).toFixed(1)} -> x${blackjackWinPayoutMultiplier(nextLevel).toFixed(1)}.`;
    case 'wagerNatural':
      return `Blackjack x${blackjackNaturalPayoutMultiplier(level).toFixed(1)} -> x${blackjackNaturalPayoutMultiplier(nextLevel).toFixed(1)}.`;
    case 'wagerStreak':
      return `Bonus serie ${level > 1 ? 'actif' : 'bloque'}, puis +${Math.round((0.1 + (nextLevel - 1) * 0.03) * 100)}%.`;
    case 'wagerDebt':
      return `Dette de pret ${blackjackLoanDebtRatioLabel(level)} -> ${blackjackLoanDebtRatioLabel(nextLevel)}.`;
    case 'actionStand':
      return `Rester sur 18-20: +${Math.round(blackjackActionCellBonusRatio(level) * 100)}% -> +${Math.round(blackjackActionCellBonusRatio(nextLevel) * 100)}%.`;
    case 'actionDouble':
      return `Double perdu rendu ${Math.round(blackjackDoubleCellRefundRatio(level) * 100)}% -> ${Math.round(blackjackDoubleCellRefundRatio(nextLevel) * 100)}%.`;
    case 'actionSplit':
      return `Diviser coute ${Math.round(blackjackSplitCellCostRatio(level) * 100)}% -> ${Math.round(blackjackSplitCellCostRatio(nextLevel) * 100)}%.`;
    case 'actionFaceSplit':
      return `Figures divisees: +${Math.round(blackjackFaceSplitCellBonusRatio(level) * 100)}% -> +${Math.round(blackjackFaceSplitCellBonusRatio(nextLevel) * 100)}%.`;
    case 'actionMastery':
      return `Bonus d'action global x${blackjackActionMasteryMultiplier(level).toFixed(2)} -> x${blackjackActionMasteryMultiplier(nextLevel).toFixed(2)}.`;
    case 'autoDeal':
      return blackjackAutoDealUnlocked(state) ? 'Auto relance active.' : 'Debloque la relance automatique.';
    case 'autoSpeed':
      return `Delai auto plus court au niveau ${nextLevel}.`;
    case 'pairUnlock':
      return state.blackjack.pair.unlocked ? 'Pair debloque.' : 'Debloque le pari Pair.';
    case 'pairPayout':
      return `Gains Pair x${blackjackPairPayoutBoost(level).toFixed(2)} -> x${blackjackPairPayoutBoost(nextLevel).toFixed(2)}.`;
    case 'pairXp':
      return `XP Pair x${blackjackPairXpBoost(level).toFixed(2)} -> x${blackjackPairXpBoost(nextLevel).toFixed(2)}.`;
    case 'pairRefund':
      return `Ratage Pair rendu ${Math.round(blackjackPairRefundRatio(level) * 100)}% -> ${Math.round(blackjackPairRefundRatio(nextLevel) * 100)}%.`;
    case 'pairAuto':
      return state.blackjack.pair.autoEnabled ? 'Auto Pair actif.' : 'Active Pair automatiquement.';
    case 'twentyOneThreeUnlock':
      return state.blackjack.twentyOneThree.unlocked ? '21+3 debloque.' : 'Debloque le pari 21+3.';
    case 'twentyOneThreePayout':
      return `Gains 21+3 x${blackjackTwentyOneThreePayoutBoost(level).toFixed(2)} -> x${blackjackTwentyOneThreePayoutBoost(nextLevel).toFixed(2)}.`;
    case 'twentyOneThreeXp':
      return `XP 21+3 x${blackjackTwentyOneThreeXpBoost(level).toFixed(2)} -> x${blackjackTwentyOneThreeXpBoost(nextLevel).toFixed(2)}.`;
    case 'twentyOneThreeJackpot':
      return `Jackpots +${Math.round(blackjackTwentyOneThreeJackpotBoost(level) * 100)}% -> +${Math.round(blackjackTwentyOneThreeJackpotBoost(nextLevel) * 100)}%.`;
    case 'twentyOneThreeAuto':
      return state.blackjack.twentyOneThree.autoEnabled ? 'Auto 21+3 actif.' : 'Active 21+3 automatiquement.';
  }
}

export function blackjackAutoDealUnlocked(state: GameState): boolean {
  return state.books.blackjack.automation > 0;
}

export function blackjackAutoDealManaCost(state: GameState): number {
  return Math.round(20 * Math.pow(1.55, state.books.blackjack.level - 1));
}

export function blackjackAutoDealChipCost(state: GameState): number {
  return Math.round(3 * Math.pow(1.35, state.books.blackjack.level - 1));
}

export function blackjackCanBuyAutoDeal(state: GameState): boolean {
  return (
    state.books.blackjack.unlocked &&
    !blackjackAutoDealUnlocked(state) &&
    state.mana >= blackjackAutoDealManaCost(state) &&
    state.resources.chips >= blackjackAutoDealChipCost(state)
  );
}

export function blackjackCanDeal(state: GameState): boolean {
  return (
    state.books.blackjack.unlocked &&
    isBookPanelOpen(state, 'blackjack') &&
    state.blackjack.phase !== 'player' &&
    state.blackjack.phase !== 'dealer' &&
    (state.blackjack.phase !== 'idle' || state.blackjack.playerBet > 0)
  );
}

export function blackjackResultSummary(state: GameState): string {
  const blackjack = state.blackjack;
  const reward = blackjack.lastReward > 0 ? ` · +${Math.floor(blackjack.lastReward)} Jetons` : '';
  switch (blackjack.phase) {
    case 'won':
      return `${blackjack.lastOutcome || 'Victoire'}${reward}`;
    case 'blackjack':
      return `${blackjack.lastOutcome || 'Blackjack'}${reward}`;
    case 'lost': {
      const detail = blackjack.lastOutcome.replace(/^Perdu(?: · )?/, '');
      return `Defaite${detail ? ` · ${detail}` : ''}${reward}`;
    }
    case 'push':
      return `${blackjack.lastOutcome || 'Egalite'}${reward}`;
    case 'idle':
    case 'player':
    case 'dealer':
      return '';
  }
}

export function blackjackCanDecreaseBaseBet(state: GameState): boolean {
  return blackjackCurrentBaseBetLevel(state) > 1;
}

export function blackjackCanIncreaseBaseBet(state: GameState): boolean {
  return blackjackCurrentBaseBetLevel(state) < state.books.blackjack.level;
}

export function blackjackCurrentBonusCost(state: GameState, bonusId: BlackjackSideBonusId): number {
  return blackjackBonusActivationCost(blackjackCurrentMainBet(state), bonusId);
}

export function blackjackCurrentBonusUpgradeCost(state: GameState, bonusId: BlackjackSideBonusId): number {
  return blackjackBonusUpgradeXpCost(blackjackBonusTrack(state, bonusId).level);
}

export function blackjackCurrentBonusUnlockCost(bonusId: BlackjackSideBonusId): number {
  return blackjackBonusUnlockCost(bonusId);
}

export function blackjackCurrentBonusMaxLevel(): number {
  return blackjackBonusMaxLevel();
}

export function blackjackCurrentBonusAutoUnlocked(state: GameState, bonusId: BlackjackSideBonusId): boolean {
  return blackjackBonusAutoUnlocked(blackjackBonusTrack(state, bonusId).level);
}

export function blackjackCurrentBonusUpgradeSteps(bonusId: BlackjackSideBonusId): BlackjackBonusUpgradeStep[] {
  return blackjackBonusUpgradeSteps(bonusId);
}

export function blackjackCurrentBonusEffectLabel(state: GameState, bonusId: BlackjackSideBonusId): string {
  return blackjackBonusCurrentEffectLabel(bonusId, blackjackBonusTrack(state, bonusId).level);
}

export function blackjackCurrentActionUpgradeCost(state: GameState): number {
  return blackjackActionUpgradeCost(state.blackjack.actions.level);
}

export function blackjackCurrentActionMaxLevel(): number {
  return blackjackActionMaxLevel();
}

export function blackjackCurrentActionUpgradeSteps(): BlackjackBonusUpgradeStep[] {
  return blackjackActionUpgradeSteps();
}

export function blackjackCurrentActionEffectLabel(state: GameState): string {
  return blackjackActionCurrentEffectLabel(state.blackjack.actions.level);
}

export function blackjackCurrentActionNextEffectLabel(state: GameState): string {
  return blackjackActionNextEffectLabel(state.blackjack.actions.level);
}

export function blackjackCurrentWinPayoutMultiplier(state: GameState): number {
  return blackjackWinPayoutMultiplier(blackjackEffectiveWagerLevel(state, 'wagerWin'));
}

function blackjackEffectiveWagerLevel(
  state: GameState,
  cellId: 'wagerBase' | 'wagerWin' | 'wagerNatural' | 'wagerStreak' | 'wagerDebt',
): number {
  return Math.max(state.books.blackjack.level, blackjackUpgradeCellLevel(state, cellId));
}

function blackjackEffectiveActionCellLevel(
  state: GameState,
  cellId: 'actionStand' | 'actionDouble' | 'actionSplit' | 'actionFaceSplit' | 'actionMastery',
): number {
  return Math.max(1, blackjackUpgradeCellLevel(state, cellId), state.blackjack.actions.level + 1);
}

function blackjackEffectiveActionSummaryLevel(state: GameState): number {
  return Math.max(
    state.blackjack.actions.level,
    blackjackUpgradeCellLevel(state, 'actionStand') - 1,
    blackjackUpgradeCellLevel(state, 'actionDouble') - 1,
    blackjackUpgradeCellLevel(state, 'actionSplit') - 1,
    blackjackUpgradeCellLevel(state, 'actionFaceSplit') - 1,
    blackjackUpgradeCellLevel(state, 'actionMastery') - 1,
  );
}

function blackjackActionCellBonusRatio(level: number): number {
  return level <= 1 ? 0 : 0.1 + (level - 2) * 0.04;
}

function blackjackDoubleCellRefundRatio(level: number): number {
  return level <= 1 ? 0 : Math.min(0.5, 0.2 + (level - 2) * 0.075);
}

function blackjackSplitCellCostRatio(level: number): number {
  return level <= 1 ? 1 : Math.max(0.55, 0.9 - (level - 2) * 0.09);
}

function blackjackFaceSplitCellBonusRatio(level: number): number {
  return level <= 1 ? 0 : Math.min(0.75, 0.25 + (level - 2) * 0.12);
}

function blackjackActionMasteryMultiplier(level: number): number {
  return 1 + Math.max(0, level - 1) * 0.06;
}

function blackjackPairPayoutBoost(level: number): number {
  return 1 + Math.max(0, level - 1) * 0.12;
}

function blackjackPairXpBoost(level: number): number {
  return 1 + Math.max(0, level - 1) * 0.15;
}

function blackjackPairRefundRatio(level: number): number {
  return level <= 1 ? 0 : Math.min(0.45, 0.15 + (level - 2) * 0.1);
}

function blackjackTwentyOneThreePayoutBoost(level: number): number {
  return 1 + Math.max(0, level - 1) * 0.1;
}

function blackjackTwentyOneThreeXpBoost(level: number): number {
  return 1 + Math.max(0, level - 1) * 0.14;
}

function blackjackTwentyOneThreeJackpotBoost(level: number): number {
  return level <= 1 ? 0 : Math.min(0.55, 0.2 + (level - 2) * 0.12);
}

function blackjackLoanDebtRatioLabel(level: number): string {
  return level >= blackjackUpgradeCellMaxLevel('wagerDebt') ? '120%' : '150%';
}

export function blackjackCanDouble(state: GameState): boolean {
  const blackjack = state.blackjack;
  if (blackjack.phase !== 'player') {
    return false;
  }
  const hand = blackjackActivePlayerHand(state);
  return hand.length === 2 && !blackjackActiveHandDoubled(state) && state.resources.chips >= blackjackActiveBet(state);
}

export function blackjackCanSplit(state: GameState): boolean {
  const blackjack = state.blackjack;
  if (blackjack.phase !== 'player' || blackjack.splitHand !== null || blackjack.activeHand !== 'primary') {
    return false;
  }
  const [first, second] = blackjack.playerHand;
  return Boolean(first && second && blackjack.playerHand.length === 2 && first.rank === second.rank && state.resources.chips >= blackjackSplitBetCost(state));
}

export function blackjackVisibleDealerValue(state: GameState): number {
  if (state.blackjack.phase === 'player' && !state.blackjack.dealerCardRevealed) {
    return blackjackHandValue(state.blackjack.dealerHand.slice(0, 1));
  }
  return blackjackHandValue(state.blackjack.dealerHand);
}

export function blackjackCardLabel(card: BlackjackCard): string {
  return `${card.rank}${blackjackSuitSymbol(card.suit)}`;
}

export { hundredOptionRange, hundredTargetMax };

function tickDefense(state: GameState, deltaSeconds: number): void {
  const book = state.books.defense;
  const defense = state.defense;
  defense.lastReward = 0;

  if (!book.unlocked || !isBookPanelOpen(state, 'defense')) {
    defense.running = false;
    return;
  }

  defense.running = true;
  defense.tower.cooldown = Math.max(0, defense.tower.cooldown - deltaSeconds);
  tickDefenseShot(state, deltaSeconds);
  spawnDefenseEnemies(state, deltaSeconds);
  moveDefenseEnemies(state, deltaSeconds);
  fireDefenseTower(state);
  completeDefenseWaveIfReady(state);
}

function spawnDefenseEnemies(state: GameState, deltaSeconds: number): void {
  const defense = state.defense;
  const enemyCount = defenseWaveEnemyCount(state);
  if (defense.spawnedThisWave >= enemyCount) {
    return;
  }

  defense.spawnTimer += deltaSeconds;
  const spawnEvery = Math.max(0.42, 0.9 - defense.wave * 0.025);
  if (defense.spawnTimer < spawnEvery) {
    return;
  }

  defense.spawnTimer = 0;
  defense.spawnedThisWave += 1;
  const lane = (defense.nextEnemyId * 137.5) % 360;
  const maxHealth = 2 + Math.floor(defense.wave * 0.45);
  defense.enemies.push({
    id: defense.nextEnemyId,
    lane,
    distance: 1,
    health: maxHealth,
    maxHealth,
  });
  defense.nextEnemyId += 1;
}

function moveDefenseEnemies(state: GameState, deltaSeconds: number): void {
  const defense = state.defense;
  const speed = 0.105 + Math.min(0.06, defense.wave * 0.006);
  const survivors: DefenseEnemy[] = [];

  for (const enemy of defense.enemies) {
    const nextDistance = enemy.distance - speed * deltaSeconds;
    if (nextDistance <= 0.11) {
      defense.towerHealth = Math.max(0, defense.towerHealth - 1);
      defense.score = 0;
      continue;
    }
    survivors.push({ ...enemy, distance: nextDistance });
  }

  defense.enemies = survivors;
  if (defense.towerHealth <= 0) {
    resetDefenseRun(state);
  }
}

function fireDefenseTower(state: GameState): void {
  const defense = state.defense;
  if (defense.tower.cooldown > 0 || defense.enemies.length === 0) {
    return;
  }

  const target = defense.enemies
    .filter((enemy) => defenseEnemyInTowerRange(enemy, defense.tower.range))
    .sort((first, second) => first.distance - second.distance)[0];
  if (!target) {
    return;
  }

  target.health -= defenseTowerDamage(state);
  defense.tower.cooldown = defenseTowerAttackInterval(state);
  defense.shotPulse += 1;
  defense.shot = {
    id: defense.shotPulse,
    lane: target.lane,
    distance: target.distance,
    timer: 0.18,
  };

  if (target.health > 0) {
    return;
  }

  const reward = 1 + Math.floor(state.books.defense.level * 0.35) + Math.floor(defense.wave / 4);
  defense.enemies = defense.enemies.filter((enemy) => enemy.id !== target.id);
  defense.score += reward;
  defense.best = Math.max(defense.best, defense.score);
  defense.lastReward = reward;
  state.resources.sigils += reward;
  state.mana += 0.5 + state.books.defense.level * 0.2;
}

function completeDefenseWaveIfReady(state: GameState): void {
  const defense = state.defense;
  if (defense.spawnedThisWave < defenseWaveEnemyCount(state) || defense.enemies.length > 0) {
    return;
  }

  defense.wave += 1;
  defense.spawnedThisWave = 0;
  defense.spawnTimer = -1.1;
  defense.towerHealth = Math.min(10, defense.towerHealth + 2);
}

function resetDefenseRun(state: GameState): void {
  const defense = state.defense;
  defense.running = false;
  defense.wave = 1;
  defense.towerHealth = 10;
  defense.score = 0;
  defense.spawnTimer = 0;
  defense.spawnedThisWave = 0;
  defense.nextEnemyId = 1;
  defense.lastReward = 0;
  defense.shotPulse = 0;
  defense.tower.cooldown = 0;
  defense.shot = null;
  defense.enemies = [];
}

function tickDefenseShot(state: GameState, deltaSeconds: number): void {
  const shot = state.defense.shot;
  if (!shot) {
    return;
  }

  shot.timer -= deltaSeconds;
  if (shot.timer <= 0) {
    state.defense.shot = null;
  }
}

function dealBlackjack(state: GameState): void {
  if (!blackjackCanDeal(state)) {
    return;
  }

  const wagerWasPrepared = state.blackjack.phase === 'idle' && state.blackjack.playerBet > 0;
  const mainBet = wagerWasPrepared ? state.blackjack.playerBet : blackjackCurrentMainBet(state);
  if (!wagerWasPrepared) {
    ensureBlackjackBankroll(state, mainBet);
  }
  if (!wagerWasPrepared && state.resources.chips < mainBet) {
    return;
  }

  const blackjack = state.blackjack;
  blackjack.deck = shuffledBlackjackDeck();
  blackjack.playerHand = [drawBlackjackCard(state, 'player'), drawBlackjackCard(state, 'player')];
  blackjack.splitHand = null;
  blackjack.dealerHand = [drawBlackjackCard(state, 'dealer'), drawBlackjackCard(state, 'dealer')];
  blackjack.phase = 'player';
  blackjack.round += 1;
  blackjack.activeHand = 'primary';
  blackjack.playerBet = mainBet;
  blackjack.splitBet = 0;
  blackjack.playerHandDone = false;
  blackjack.splitHandDone = false;
  blackjack.playerHandDoubled = false;
  blackjack.splitHandDoubled = false;
  blackjack.dealerCardRevealed = false;
  blackjack.lastReward = 0;
  blackjack.lastDebtPayment = 0;
  blackjack.lastOutcome = 'Main ouverte';
  resetBlackjackBonusHand(state, 'pair');
  resetBlackjackBonusHand(state, 'twentyOneThree');
  if (!wagerWasPrepared) {
    state.resources.chips -= mainBet;
  }

  activateEnabledBlackjackBonus(state, 'pair');
  activateEnabledBlackjackBonus(state, 'twentyOneThree');

  const playerValue = blackjackHandValue(blackjack.playerHand);
  const dealerValue = blackjackHandValue(blackjack.dealerHand);
  if (playerValue === 21 || dealerValue === 21) {
    resolveBlackjackRound(state);
  }
}

function increaseBlackjackBaseBet(state: GameState): void {
  if (!state.books.blackjack.unlocked) {
    return;
  }

  const selectedLevel = blackjackCurrentBaseBetLevel(state);
  state.blackjack.baseBetLevel = Math.min(state.books.blackjack.level, selectedLevel + 1);
}

function decreaseBlackjackBaseBet(state: GameState): void {
  if (!state.books.blackjack.unlocked) {
    return;
  }
  state.blackjack.baseBetLevel = Math.max(1, blackjackCurrentBaseBetLevel(state) - 1);
}

function prepareBlackjackWager(state: GameState, amount: number): void {
  if (!state.books.blackjack.unlocked || !isBookPanelOpen(state, 'blackjack') || state.blackjack.phase !== 'idle') {
    return;
  }

  const wager = Math.max(0, Math.floor(amount));
  if (wager <= 0 || state.resources.chips < wager) {
    return;
  }

  state.resources.chips -= wager;
  state.blackjack.playerBet += wager;
  state.blackjack.splitBet = 0;
  state.blackjack.lastOutcome = state.blackjack.playerBet > 0 ? 'Mise preparee' : 'En attente';
}

function resetBlackjackWager(state: GameState): void {
  if (!state.books.blackjack.unlocked || !isBookPanelOpen(state, 'blackjack') || state.blackjack.phase !== 'idle') {
    return;
  }

  const reserved = Math.max(0, Math.floor(state.blackjack.playerBet + state.blackjack.splitBet));
  if (reserved > 0) {
    state.resources.chips += reserved;
  }
  state.blackjack.playerBet = 0;
  state.blackjack.splitBet = 0;
  state.blackjack.lastOutcome = 'Mise remise';
}

function buyBlackjackAutoDeal(state: GameState): void {
  if (!blackjackCanBuyAutoDeal(state)) {
    return;
  }

  state.mana -= blackjackAutoDealManaCost(state);
  state.resources.chips -= blackjackAutoDealChipCost(state);
  state.books.blackjack.automation = 0.35;
}

function hitBlackjack(state: GameState): void {
  const blackjack = state.blackjack;
  if (!state.books.blackjack.unlocked || !isBookPanelOpen(state, 'blackjack')) {
    return;
  }
  if (blackjack.phase === 'idle') {
    dealBlackjack(state);
    return;
  }
  if (blackjack.phase !== 'player') {
    return;
  }

  const hand = blackjackActivePlayerHand(state);
  hand.push(drawBlackjackCard(state, 'player'));
  blackjack.lastReward = 0;
  const playerValue = blackjackHandValue(hand);
  if (playerValue > 21) {
    blackjack.lastOutcome = blackjack.splitHand ? `${blackjackActiveHandLabel(state)} buste` : 'Buste';
    markBlackjackActiveHandDone(state);
    advanceOrResolveBlackjack(state);
  }
}

function standBlackjack(state: GameState): void {
  const blackjack = state.blackjack;
  if (!state.books.blackjack.unlocked || !isBookPanelOpen(state, 'blackjack') || blackjack.phase !== 'player') {
    return;
  }

  markBlackjackActiveHandDone(state);
  advanceOrResolveBlackjack(state);
}

function advanceBlackjackDealer(state: GameState): void {
  const blackjack = state.blackjack;
  if (!state.books.blackjack.unlocked || !isBookPanelOpen(state, 'blackjack') || blackjack.phase !== 'dealer') {
    return;
  }

  if (!blackjackHasLiveHand(state) || blackjackHandValue(blackjack.dealerHand) >= 17) {
    resolveBlackjackRound(state);
    return;
  }

  drawBlackjackDealerStep(state);
}

function doubleBlackjack(state: GameState): void {
  const blackjack = state.blackjack;
  if (!state.books.blackjack.unlocked || !isBookPanelOpen(state, 'blackjack') || !blackjackCanDouble(state)) {
    return;
  }

  const extraBet = blackjackActiveBet(state);
  state.resources.chips -= extraBet;
  setBlackjackActiveBet(state, extraBet * 2);
  setBlackjackActiveHandDoubled(state);
  blackjackActivePlayerHand(state).push(drawBlackjackCard(state, 'player'));
  blackjack.lastReward = 0;
  blackjack.lastOutcome = blackjack.splitHand ? `${blackjackActiveHandLabel(state)} doublee` : 'Main doublee';
  markBlackjackActiveHandDone(state);
  advanceOrResolveBlackjack(state);
}

function splitBlackjack(state: GameState): void {
  const blackjack = state.blackjack;
  if (!state.books.blackjack.unlocked || !isBookPanelOpen(state, 'blackjack') || !blackjackCanSplit(state)) {
    return;
  }

  const [firstCard, secondCard] = blackjack.playerHand;
  const extraBet = blackjackSplitBetCost(state);
  state.resources.chips -= extraBet;
  blackjack.playerHand = [firstCard, drawBlackjackCard(state, 'player')];
  blackjack.splitHand = [secondCard, drawBlackjackCard(state, 'player')];
  blackjack.splitBet = extraBet;
  blackjack.activeHand = 'primary';
  blackjack.playerHandDone = false;
  blackjack.splitHandDone = false;
  blackjack.playerHandDoubled = false;
  blackjack.splitHandDoubled = false;
  blackjack.lastReward = 0;
  blackjack.lastOutcome = 'Main divisee';
}

function resolveBlackjackRound(state: GameState): void {
  const blackjack = state.blackjack;
  blackjack.dealerCardRevealed = true;
  const dealerValue = blackjackHandValue(blackjack.dealerHand);
  const dealerBust = dealerValue > 21;
  const allowNaturalBlackjack = blackjack.splitHand === null;
  const splitFromFacePair = Boolean(
    blackjack.splitHand &&
      blackjack.playerHand[0] &&
      blackjack.splitHand[0] &&
      blackjackIsFaceRank(blackjack.playerHand[0].rank) &&
      blackjackIsFaceRank(blackjack.splitHand[0].rank),
  );
  const primary = applyBlackjackActionResultBonus(
    state,
    resolveBlackjackHand(
      blackjack.playerHand,
      blackjack.playerBet,
      dealerValue,
      dealerBust,
      allowNaturalBlackjack,
      blackjackWinPayoutMultiplier(blackjackEffectiveWagerLevel(state, 'wagerWin')),
      blackjackNaturalPayoutMultiplier(blackjackEffectiveWagerLevel(state, 'wagerNatural')),
    ),
    blackjack.playerHand,
    blackjack.playerBet,
    blackjack.playerHandDoubled,
    splitFromFacePair,
  );
  const split = blackjack.splitHand
    ? applyBlackjackActionResultBonus(
        state,
        resolveBlackjackHand(
          blackjack.splitHand,
          blackjack.splitBet,
          dealerValue,
          dealerBust,
          false,
          blackjackWinPayoutMultiplier(blackjackEffectiveWagerLevel(state, 'wagerWin')),
          blackjackNaturalPayoutMultiplier(blackjackEffectiveWagerLevel(state, 'wagerNatural')),
        ),
        blackjack.splitHand,
        blackjack.splitBet,
        blackjack.splitHandDoubled,
        splitFromFacePair,
      )
    : null;
  const results = split ? [primary, split] : [primary];
  const rawGain = results.reduce((sum, result) => sum + result.gain, 0);
  const wonAnyHand = results.some((result) => result.outcome === 'won' || result.outcome === 'blackjack');
  const lostEveryHand = results.every((result) => result.outcome === 'lost');
  const nextWinStreak = wonAnyHand ? blackjack.winStreak + 1 : lostEveryHand ? 0 : blackjack.winStreak;
  const streakBonus = blackjackWinStreakBonus(
    blackjack.playerBet + blackjack.splitBet,
    nextWinStreak,
    blackjackEffectiveWagerLevel(state, 'wagerStreak'),
  );
  const totalGain = rawGain + streakBonus;
  blackjack.winStreak = nextWinStreak;

  blackjack.lastReward = totalGain;
  if (totalGain > 0) {
    applyBlackjackMoneyGain(state, totalGain);
    state.mana += totalGain * (0.8 + state.books.blackjack.level * 0.15);
  }

  if (split) {
    blackjack.phase = results.some((result) => result.outcome === 'won' || result.outcome === 'blackjack')
      ? 'won'
      : results.every((result) => result.outcome === 'push')
        ? 'push'
        : 'lost';
    blackjack.lastOutcome = blackjackSplitOutcomeText(results);
  } else {
    blackjack.phase = primary.outcome === 'blackjack' ? 'blackjack' : primary.outcome;
    blackjack.lastOutcome = primary.label;
  }

  if (streakBonus > 0) {
    blackjack.lastOutcome = `${blackjack.lastOutcome} · Serie +${streakBonus}`;
  }

  if (totalGain === 0) {
    ensureBlackjackBankroll(state, blackjackCurrentMainBet(state));
  }
}

function resolveBlackjackHand(
  hand: BlackjackCard[],
  bet: number,
  dealerValue: number,
  dealerBust: boolean,
  allowNaturalBlackjack: boolean,
  winMultiplier: number,
  naturalMultiplier: number,
): { outcome: 'won' | 'lost' | 'push' | 'blackjack'; gain: number; label: string } {
  const value = blackjackHandValue(hand);
  if (value > 21) {
    return { outcome: 'lost', gain: 0, label: 'Buste' };
  }

  const natural = allowNaturalBlackjack && hand.length === 2 && value === 21;
  if (dealerBust || value > dealerValue) {
    return {
      outcome: natural ? 'blackjack' : 'won',
      gain: natural ? Math.floor(bet * naturalMultiplier) : Math.floor(bet * winMultiplier),
      label: natural ? 'Blackjack' : 'Victoire',
    };
  }

  if (value === dealerValue) {
    return { outcome: 'push', gain: bet, label: 'Egalite' };
  }

  return { outcome: 'lost', gain: 0, label: 'Perdu' };
}

function applyBlackjackActionResultBonus(
  state: GameState,
  result: { outcome: 'won' | 'lost' | 'push' | 'blackjack'; gain: number; label: string },
  hand: BlackjackCard[],
  bet: number,
  doubled: boolean,
  splitFromFacePair: boolean,
): { outcome: 'won' | 'lost' | 'push' | 'blackjack'; gain: number; label: string } {
  const legacyBonus = blackjackActionResultBonus(
    state.blackjack.actions.level,
    blackjackHandValue(hand),
    bet,
    result.outcome,
    doubled,
    splitFromFacePair,
  );
  const mastery = blackjackActionMasteryMultiplier(blackjackEffectiveActionCellLevel(state, 'actionMastery'));
  const handValue = blackjackHandValue(hand);
  const cellBonuses: BlackjackActionResultBonus[] = [];

  if (doubled && result.outcome === 'lost') {
    const refundRatio = blackjackDoubleCellRefundRatio(blackjackEffectiveActionCellLevel(state, 'actionDouble'));
    if (refundRatio > 0) {
      cellBonuses.push({ gain: Math.floor((bet / 2) * refundRatio * mastery), label: 'Double amorti' });
    }
  }
  if (splitFromFacePair && result.outcome === 'won') {
    const faceRatio = blackjackFaceSplitCellBonusRatio(blackjackEffectiveActionCellLevel(state, 'actionFaceSplit'));
    if (faceRatio > 0) {
      cellBonuses.push({ gain: Math.floor(bet * faceRatio * mastery), label: 'Figures jumelles' });
    }
  }
  if (result.outcome === 'won' && handValue >= 18 && handValue <= 20) {
    const standRatio = blackjackActionCellBonusRatio(blackjackEffectiveActionCellLevel(state, 'actionStand'));
    if (standRatio > 0) {
      cellBonuses.push({ gain: Math.floor(bet * standRatio * mastery), label: 'Rester lucide' });
    }
  }

  const bonus = [legacyBonus, ...cellBonuses]
    .filter((entry): entry is BlackjackActionResultBonus => Boolean(entry && entry.gain > 0))
    .sort((first, second) => second.gain - first.gain)[0];
  if (!bonus) {
    return result;
  }
  return {
    ...result,
    gain: result.gain + bonus.gain,
    label: `${result.label} · ${bonus.label} +${bonus.gain}`,
  };
}

function blackjackActivePlayerHand(state: GameState): BlackjackCard[] {
  const blackjack = state.blackjack;
  if (blackjack.activeHand === 'split' && blackjack.splitHand) {
    return blackjack.splitHand;
  }
  return blackjack.playerHand;
}

function blackjackActiveBet(state: GameState): number {
  return state.blackjack.activeHand === 'split' ? state.blackjack.splitBet : state.blackjack.playerBet;
}

function blackjackSplitBetCost(state: GameState): number {
  const ratio = Math.min(
    blackjackSplitCostRatio(state.blackjack.actions.level),
    blackjackSplitCellCostRatio(blackjackEffectiveActionCellLevel(state, 'actionSplit')),
  );
  return Math.max(1, Math.ceil(state.blackjack.playerBet * ratio));
}

function setBlackjackActiveBet(state: GameState, bet: number): void {
  if (state.blackjack.activeHand === 'split') {
    state.blackjack.splitBet = bet;
    return;
  }
  state.blackjack.playerBet = bet;
}

function blackjackActiveHandDoubled(state: GameState): boolean {
  return state.blackjack.activeHand === 'split' ? state.blackjack.splitHandDoubled : state.blackjack.playerHandDoubled;
}

function setBlackjackActiveHandDoubled(state: GameState): void {
  if (state.blackjack.activeHand === 'split') {
    state.blackjack.splitHandDoubled = true;
    return;
  }
  state.blackjack.playerHandDoubled = true;
}

function blackjackActiveHandLabel(state: GameState): string {
  return state.blackjack.activeHand === 'split' ? 'Main 2' : 'Main 1';
}

function blackjackIsFaceRank(rank: BlackjackRank): boolean {
  return rank === 'J' || rank === 'Q' || rank === 'K';
}

function markBlackjackActiveHandDone(state: GameState): void {
  if (state.blackjack.activeHand === 'split') {
    state.blackjack.splitHandDone = true;
    return;
  }
  state.blackjack.playerHandDone = true;
}

function advanceOrResolveBlackjack(state: GameState): void {
  const blackjack = state.blackjack;
  if (blackjack.splitHand && blackjack.activeHand === 'primary' && !blackjack.splitHandDone) {
    blackjack.activeHand = 'split';
    blackjack.lastOutcome = 'Main 2';
    return;
  }

  blackjack.dealerCardRevealed = true;
  if (!blackjackHasLiveHand(state) || blackjackHandValue(blackjack.dealerHand) >= 17) {
    resolveBlackjackRound(state);
    return;
  }

  blackjack.phase = 'dealer';
  drawBlackjackDealerStep(state);
}

function drawBlackjackDealerStep(state: GameState): void {
  state.blackjack.dealerHand.push(drawBlackjackCard(state, 'dealer'));
  state.blackjack.lastReward = 0;
  state.blackjack.lastOutcome = 'Croupier tire';
}

function blackjackHasLiveHand(state: GameState): boolean {
  const blackjack = state.blackjack;
  return blackjackHandValue(blackjack.playerHand) <= 21 || Boolean(blackjack.splitHand && blackjackHandValue(blackjack.splitHand) <= 21);
}

function blackjackSplitOutcomeText(
  results: { outcome: 'won' | 'lost' | 'push' | 'blackjack'; gain: number; label: string }[],
): string {
  const wins = results.filter((result) => result.outcome === 'won' || result.outcome === 'blackjack').length;
  const pushes = results.filter((result) => result.outcome === 'push').length;
  const losses = results.filter((result) => result.outcome === 'lost').length;
  const parts = [
    wins > 0 ? `${wins} victoire${wins > 1 ? 's' : ''}` : '',
    pushes > 0 ? `${pushes} egalite${pushes > 1 ? 's' : ''}` : '',
    losses > 0 ? `${losses} defaite${losses > 1 ? 's' : ''}` : '',
  ].filter(Boolean);
  return parts.join(', ');
}

function drawBlackjackCard(state: GameState, hand: 'player' | 'dealer'): BlackjackCard {
  if (state.blackjack.deck.length === 0) {
    state.blackjack.deck = shuffledBlackjackDeck();
  }
  void hand;
  return state.blackjack.deck.pop() ?? { rank: 'A', suit: 'spades' };
}

function activateBlackjackBonus(state: GameState, bonusId: BlackjackSideBonusId): void {
  const blackjack = state.blackjack;
  const bonus = blackjackBonusTrack(state, bonusId);
  if (
    !state.books.blackjack.unlocked ||
    !isBookPanelOpen(state, 'blackjack') ||
    blackjack.phase !== 'player' ||
    blackjack.activeHand !== 'primary' ||
    blackjack.splitHand !== null ||
    blackjack.playerHand.length !== 2 ||
    blackjack.playerHandDone ||
    !bonus.unlocked ||
    bonus.activatedThisHand
  ) {
    return;
  }

  const cost = blackjackCurrentBonusCost(state, bonusId);
  if (state.resources.chips < cost) {
    bonus.lastOutcome = 'Pas assez de Jetons';
    return;
  }

  state.resources.chips -= cost;
  bonus.activatedThisHand = true;
  const outcome =
    bonusId === 'pair'
      ? evaluatePairBonus(blackjack.playerHand.slice(0, 2))
      : evaluateTwentyOneThree(blackjack.playerHand.slice(0, 2), blackjack.dealerHand[0]);

  if (!outcome) {
    const refundLevel =
      bonusId === 'pair'
        ? Math.max(bonus.level, blackjackUpgradeCellLevel(state, 'pairRefund'))
        : bonus.level;
    const refund = blackjackMissRefund(cost, refundLevel, bonusId);
    bonus.lastOutcome = refund > 0 ? `Rate, ${refund} rendu` : 'Rate';
    bonus.lastPayout = refund;
    bonus.lastXp = 0;
    if (refund > 0) {
      applyBlackjackMoneyGain(state, refund);
    }
    ensureBlackjackBankroll(state, blackjackCurrentMainBet(state));
    return;
  }

  const payoutLevel =
    bonusId === 'pair'
      ? Math.max(bonus.level, blackjackUpgradeCellLevel(state, 'pairPayout'))
      : Math.max(bonus.level, blackjackUpgradeCellLevel(state, 'twentyOneThreePayout'));
  const xpLevel =
    bonusId === 'pair'
      ? Math.max(bonus.level, blackjackUpgradeCellLevel(state, 'pairXp'))
      : Math.max(bonus.level, blackjackUpgradeCellLevel(state, 'twentyOneThreeXp'));
  const jackpotLevel =
    bonusId === 'twentyOneThree'
      ? Math.max(payoutLevel, blackjackUpgradeCellLevel(state, 'twentyOneThreeJackpot'))
      : payoutLevel;
  const payout = Math.floor(cost * blackjackPayoutMultiplier(outcome.multiplier, jackpotLevel, bonusId, outcome.kind));
  const xp = blackjackSideBonusXp(outcome.xp, state.blackjack.debt > 0, xpLevel);
  bonus.xp += xp;
  bonus.lastOutcome = outcome.label;
  bonus.lastPayout = payout;
  bonus.lastXp = xp;
  blackjack.lastReward += payout;
  applyBlackjackMoneyGain(state, payout);
}

function activateEnabledBlackjackBonus(state: GameState, bonusId: BlackjackSideBonusId): void {
  const bonus = blackjackBonusTrack(state, bonusId);
  if (bonus.autoEnabled && blackjackBonusAutoUnlocked(bonus.level)) {
    activateBlackjackBonus(state, bonusId);
  }
}

function resetBlackjackBonusHand(state: GameState, bonusId: BlackjackSideBonusId): void {
  const bonus = blackjackBonusTrack(state, bonusId);
  bonus.activatedThisHand = false;
  bonus.lastPayout = 0;
  bonus.lastXp = 0;
  bonus.lastOutcome = bonus.unlocked ? 'Pret' : 'Verrouille';
}

function applyBlackjackMoneyGain(state: GameState, gain: number): void {
  const split = blackjackMoneyGainSplit(gain, state.blackjack.debt);
  state.resources.chips += split.bankrollGain;
  state.blackjack.lastDebtPayment += split.debtPaid;
  state.blackjack.debt = split.remainingDebt;
}

function ensureBlackjackBankroll(state: GameState, nextBet: number): void {
  if (state.resources.chips > 0) {
    return;
  }

  const loan = blackjackLoanAmount(nextBet);
  state.resources.chips += loan;
  const debtLevel =
    blackjackUpgradeCellLevel(state, 'wagerDebt') >= blackjackUpgradeCellMaxLevel('wagerDebt')
      ? 5
      : state.books.blackjack.level;
  state.blackjack.debt += blackjackLoanDebtForLevel(loan, debtLevel);
  state.blackjack.lastOutcome = `${state.blackjack.lastOutcome} · Pret magique`;
}

function shuffledBlackjackDeck(): BlackjackCard[] {
  const suits: BlackjackSuit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: BlackjackRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck = suits.flatMap((suit) => ranks.map((rank) => ({ rank, suit })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
}

function blackjackSuitSymbol(suit: BlackjackSuit): string {
  switch (suit) {
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    case 'spades':
      return '♠';
  }
}

function chooseHundredOption(state: GameState, optionId: HundredOptionId): void {
  const book = state.books.hundred;
  if (!book.unlocked || !isBookPanelOpen(state, 'hundred')) {
    return;
  }

  const hundred = state.hundred;
  const roll = rollHundredOption(optionId, book.level);
  const nextTotal = hundred.total + roll;
  const targetMax = hundredTargetMax(book.level);
  hundred.total = nextTotal;
  hundred.lastRoll = roll;
  hundred.lastOption = optionId;
  hundred.lastReward = 0;

  if (nextTotal >= 100 && nextTotal <= targetMax) {
    const reward = hundredReward(book.level, nextTotal);
    hundred.attempts += 1;
    hundred.wins += 1;
    hundred.bestTotal = Math.max(hundred.bestTotal, nextTotal);
    hundred.lastReward = reward;
    hundred.lastOutcome = 'won';
    state.resources.fragments += reward;
    state.mana += reward * (0.55 + book.level * 0.15);
    hundred.total = 0;
    return;
  }

  if (nextTotal > targetMax) {
    hundred.attempts += 1;
    hundred.bestTotal = Math.max(hundred.bestTotal, Math.min(nextTotal, targetMax));
    hundred.lastOutcome = 'bust';
    hundred.total = 0;
    return;
  }

  hundred.bestTotal = Math.max(hundred.bestTotal, nextTotal);
  hundred.lastOutcome = 'rolled';
}

function tickTargets(state: GameState, deltaSeconds: number): void {
  const book = state.books.targets;
  const targetState = state.targets;
  targetState.lastReward = 0;

  if (!book.unlocked || !isBookPanelOpen(state, 'targets')) {
    targetState.running = false;
    return;
  }

  targetState.running = true;
  spawnTargets(state, deltaSeconds);
  automateTargetAttack(state, deltaSeconds);
}

function spawnTargets(state: GameState, deltaSeconds: number): void {
  const targetState = state.targets;
  if (targetState.targets.length >= targetMaxActiveTargets(state.targetSkills.targetCount)) {
    return;
  }

  targetState.spawnTimer += deltaSeconds;
  if (targetState.spawnTimer < targetSpawnInterval(state.targetSkills.spawnSpeed)) {
    return;
  }

  targetState.spawnTimer = 0;
  targetState.targets.push(createTargetInstance(state));
}

function createTargetInstance(state: GameState): TargetInstance {
  const id = state.targets.nextTargetId;
  state.targets.nextTargetId += 1;
  const maxHealth = 1 + Math.floor(Math.max(1, state.books.targets.level) * 0.35);
  return {
    id,
    x: 14 + ((id * 37) % 72),
    y: 18 + ((id * 53) % 62),
    health: maxHealth,
    maxHealth,
  };
}

function automateTargetAttack(state: GameState, deltaSeconds: number): void {
  const interval = targetAutomationInterval(state.targetSkills.automation);
  if (interval <= 0 || state.targets.targets.length === 0) {
    state.targets.automationTimer = 0;
    return;
  }

  state.targets.automationTimer += deltaSeconds;
  if (state.targets.automationTimer < interval) {
    return;
  }

  const shots = Math.max(1, Math.floor(state.targets.automationTimer / interval));
  state.targets.automationTimer %= interval;
  for (let shot = 0; shot < shots; shot += 1) {
    const target = state.targets.targets[0];
    if (!target) {
      return;
    }
    damageTarget(state, target);
  }
}

function attackTarget(state: GameState, targetId: number): void {
  if (!state.books.targets.unlocked || !isBookPanelOpen(state, 'targets')) {
    return;
  }

  const target = state.targets.targets.find((candidate) => candidate.id === targetId);
  if (!target) {
    return;
  }

  damageTarget(state, target);
}

function damageTarget(state: GameState, target: TargetInstance): void {
  target.health -= targetAttackDamage(state.targetSkills.damage);
  state.targets.shotPulse += 1;
  if (target.health > 0) {
    return;
  }

  const reward = targetReward(state.books.targets.level, target.maxHealth);
  state.targets.targets = state.targets.targets.filter((candidate) => candidate.id !== target.id);
  state.targets.score += reward;
  state.targets.best = Math.max(state.targets.best, state.targets.score);
  state.targets.lastReward = reward;
  state.resources.marks += reward;
  state.mana += reward * (0.35 + state.books.targets.level * 0.12);
}

function tickMining(state: GameState, deltaSeconds: number): void {
  const skills = state.miningSkills;
  state.mining.lastReward = 0;

  if (!state.books.mine.unlocked) {
    skills.automationTimer = 0;
    return;
  }

  const interval = miningAutomationInterval(skills.automation);
  if (interval <= 0) {
    skills.automationTimer = 0;
    return;
  }

  skills.automationTimer += deltaSeconds;
  if (skills.automationTimer < interval) {
    return;
  }

  const digs = Math.max(1, Math.floor(skills.automationTimer / interval));
  skills.automationTimer %= interval;
  for (let dig = 0; dig < digs; dig += 1) {
    const target = weakestMiningBlock(state);
    if (!target) {
      return;
    }
    applyMiningHit(state, target, miningPickaxeDamage(state), true);
  }
  skills.autoDigCount += digs;
}

function digMiningBlock(state: GameState, blockId: number): void {
  if (!state.books.mine.unlocked || !isBookPanelOpen(state, 'mine')) {
    return;
  }

  const block = state.mining.blocks.find((candidate) => candidate.id === blockId);
  if (!block) {
    return;
  }

  state.mining.lastReward = 0;
  applyMiningHit(state, block, miningPickaxeDamage(state), false);

  const splash = miningSplashDamage(state);
  if (splash <= 0) {
    return;
  }

  for (const neighbor of miningNeighbors(state, blockId)) {
    applyMiningHit(state, neighbor, splash, false);
  }
}

function weakestMiningBlock(state: GameState): MiningBlock | null {
  return (
    [...state.mining.blocks].sort((first, second) => {
      const firstRatio = first.health / first.maxHealth;
      const secondRatio = second.health / second.maxHealth;
      return firstRatio - secondRatio || second.depth - first.depth || first.id - second.id;
    })[0] ?? null
  );
}

function miningNeighbors(state: GameState, blockId: number): MiningBlock[] {
  const x = blockId % MINING_GRID_COLUMNS;
  const y = Math.floor(blockId / MINING_GRID_COLUMNS);
  const neighborIds = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ]
    .filter((cell) => cell.x >= 0 && cell.x < MINING_GRID_COLUMNS && cell.y >= 0)
    .map((cell) => cell.y * MINING_GRID_COLUMNS + cell.x);

  return state.mining.blocks.filter((block) => neighborIds.includes(block.id));
}

function applyMiningHit(state: GameState, block: MiningBlock, damage: number, isAutomated: boolean): void {
  state.mining.hitPulse += 1;
  block.lastHit = state.mining.hitPulse;
  block.health -= damage;
  if (block.health > 0) {
    return;
  }

  breakMiningBlock(state, block, isAutomated);
}

function breakMiningBlock(state: GameState, block: MiningBlock, isAutomated: boolean): void {
  const brokenDepth = block.depth;
  const reward = miningBlockReward(state, block);
  state.resources.minerals += reward;
  state.mana += reward * (isAutomated ? 0.28 : 0.42) + state.books.mine.level * 0.12;
  state.mining.totalMined += 1;
  state.mining.lastReward += reward;
  state.mining.lastBrokenDepth = brokenDepth;

  const nextDepth = brokenDepth + 1;
  const nextMaxHealth = miningBlockMaxHealth(nextDepth);
  block.depth = nextDepth;
  block.maxHealth = nextMaxHealth;
  block.health = nextMaxHealth;
  state.mining.deepestLayer = Math.max(state.mining.deepestLayer, nextDepth);
}

function miningBlockReward(state: GameState, block: MiningBlock): number {
  return 1 + Math.floor(block.depth * 0.45) + Math.floor(state.books.mine.level * 0.3);
}

function trainSlime(state: GameState, commandId: SlimeTrainerCommandId): void {
  const book = state.books.slimeTrainer;
  const trainer = state.slimeTrainer;
  trainer.lastCommand = commandId;
  trainer.lastDamage = 0;
  trainer.lastEnemyDamage = 0;
  trainer.lastXp = 0;
  trainer.lastReward = 0;

  if (!book.unlocked || !isBookPanelOpen(state, 'slimeTrainer')) {
    return;
  }
  if (trainer.turn !== 'player') {
    trainer.lastOutcome = 'waitingEnemy';
    return;
  }
  if (!slimeTrainerCommandUnlocked(commandId, trainer.level)) {
    trainer.lastOutcome = 'locked';
    return;
  }

  const damage = slimeTrainerCommandDamage(commandId, trainer.level);
  trainer.hitPulse += 1;
  trainer.enemy.health = Math.max(0, trainer.enemy.health - damage);
  trainer.lastDamage = damage;

  if (trainer.enemy.health > 0) {
    trainer.lastOutcome = 'hit';
    trainer.turn = 'enemy';
    trainer.enemyTurnTimer = 0;
    return;
  }

  const xp = slimeTrainerXpReward(trainer.enemy, trainer.level);
  const reward = slimeTrainerResourceReward(trainer.enemy, trainer.level);
  trainer.victories += 1;
  trainer.xp += xp;
  trainer.lastXp = xp;
  trainer.lastReward = reward;
  state.resources.gels += reward;
  state.mana += reward * (0.45 + book.level * 0.14);

  let didLevelUp = false;
  while (trainer.xp >= slimeTrainerXpToNextLevel(trainer.level)) {
    trainer.xp -= slimeTrainerXpToNextLevel(trainer.level);
    trainer.level += 1;
    didLevelUp = true;
  }

  trainer.lastOutcome = didLevelUp ? 'levelUp' : 'victory';
  trainer.enemy = slimeTrainerEnemyForVictoryCount(trainer.victories, trainer.level);
  trainer.slimeMaxHealth = slimeTrainerMaxHealth(trainer.level);
  trainer.slimeHealth = Math.min(trainer.slimeMaxHealth, trainer.slimeHealth + 2 + (didLevelUp ? 2 : 0));
  trainer.turn = 'player';
  trainer.enemyTurnTimer = 0;
}

function enemyAttackSlime(state: GameState): void {
  const book = state.books.slimeTrainer;
  const trainer = state.slimeTrainer;
  trainer.lastDamage = 0;
  trainer.lastEnemyDamage = 0;
  trainer.lastXp = 0;
  trainer.lastReward = 0;

  if (!book.unlocked || !isBookPanelOpen(state, 'slimeTrainer') || trainer.turn !== 'enemy') {
    return;
  }

  trainer.enemyTurnTimer = 0;
  const damage = slimeTrainerEnemyAttackDamage(trainer.enemy, trainer.level);
  trainer.hitPulse += 1;
  trainer.lastEnemyDamage = damage;
  trainer.slimeHealth = Math.max(0, trainer.slimeHealth - damage);

  if (trainer.slimeHealth <= 0) {
    trainer.lastOutcome = 'slimeDown';
    trainer.turn = 'player';
    trainer.slimeHealth = Math.max(1, Math.ceil(trainer.slimeMaxHealth * 0.55));
    return;
  }

  trainer.lastOutcome = 'enemyHit';
  trainer.turn = 'player';
}

function tickSlimeTrainer(state: GameState, deltaSeconds: number): void {
  const trainer = state.slimeTrainer;
  if (!state.books.slimeTrainer.unlocked || !isBookPanelOpen(state, 'slimeTrainer') || trainer.turn !== 'enemy') {
    trainer.enemyTurnTimer = 0;
    return;
  }

  trainer.enemyTurnTimer += Math.min(deltaSeconds, 0.25);
  if (trainer.enemyTurnTimer >= 0.5) {
    enemyAttackSlime(state);
  }
}

function slimeTrainerMaxHealth(level: number): number {
  return 10 + Math.max(0, level - 1) * 2;
}

function grantDebugResources(state: GameState): void {
  state.mana += 999;
  state.forbiddenGrimoire.keys += 1;
  state.resources.scales += 999;
  state.resources.runes += 999;
  state.resources.spores += 999;
  state.resources.sigils += 999;
  state.resources.chips += 999;
  state.resources.fragments += 999;
  state.resources.marks += 999;
  state.resources.minerals += 999;
  state.resources.gels += 999;
}
