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
  createInitialMiningBlocks,
  createInitialMiningMaterials,
  miningBlockMaterialForDepth,
  miningBlockMaxHealth,
  miningMaterialExchangeValue,
  MINING_GRID_COLUMNS,
  MINING_MATERIAL_RESOURCE_IDS,
  MINING_GRID_ROWS,
  MINING_TERRAIN_LAYER_COUNT,
  randomSnakeFood,
  snakeGridSizeForLevel,
  type BlackjackCard,
  type BlackjackRank,
  type BlackjackSuit,
  type BlackjackUpgradeCellId,
  type BookPanelSlot,
  type DefenseDamagePopupKind,
  type DefenseHitFeedbackSource,
  type DefenseEnemy,
  type DefenseQueuedShot,
  type GameState,
  type ManaIdleCompanionSkillId,
  type ManaOrbKind,
  type ManaResearchSkillId,
  type ManaXpOrb,
  type MiningBlock,
  type MiningMaterialResourceId,
  type SnakeBonusFruitType,
  type SnakeCell,
  type SnakeDirection,
  type TargetInstance,
} from './state';
import {
  defenseEnemyDistanceFromCenter,
  defenseEnemyFullyVisible,
  defenseEnemyInTowerHitbox,
  defenseEnemyInTowerRange,
  defenseEnemyImpactPoint,
  defenseEnemyPathDistanceForCenterRange,
  defenseEnemyPosition,
  nextDefenseSpeedMultiplier,
  randomDefenseTreeSpawnLane,
} from './defenseRules';
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

export type ManaSkillId =
  | 'power'
  | 'clickMultiplier'
  | 'research'
  | 'clickResearch'
  | 'autoClicker'
  | 'multiAutoClicker'
  | 'xpOrbChance'
  | 'yellowOrbChance'
  | 'greenOrbChance'
  | 'blueOrbChance'
  | 'xpValue'
  | 'levelUpEffect'
  | 'holdClick'
  | 'allyFindOrb'
  | 'meowKnight'
  | ManaIdleCompanionSkillId
  | ManaResearchSkillId
  | 'criticalHit'
  | 'criticalEffect'
  ;
export type SnakeSkillId = 'speed' | 'gridSize' | 'automation' | 'baseMultiplier' | 'bonusFruit' | 'extraLife' | 'edgeWrap';
export type DefenseSkillId =
  | 'damage'
  | 'damageMultiplier'
  | 'attackSpeed'
  | 'range'
  | 'criticalChance'
  | 'criticalMultiplier'
  | 'superCriticalChance'
  | 'superCriticalMultiplier'
  | 'lightningDamage'
  | 'lightningSpeed'
  | 'lightningCount'
  | 'iceDamage'
  | 'iceSpeed'
  | 'iceRange'
  | 'iceSlow'
  | 'health'
  | 'healthRegen'
  | 'moneyPerEnemy'
  | 'goldMultiplier'
  | 'baseSpeed';
export type MiningSkillId = 'pickaxeForce' | 'splashDamage' | 'automation';
export type { TargetSkillId };
export type { BlackjackSideBonusId };
export type { BlackjackBonusUpgradeStep };
export type { BlackjackUpgradeCellId };
export type { BlackjackUpgradeCost };
export type { BlackjackUpgradeTier };
export type { ManaResearchSkillId };

const DEBUG_MANA_SKILL_MAX_LEVELS: Record<ManaSkillId, number> = {
  power: 50,
  clickMultiplier: 40,
  research: 1,
  clickResearch: 20,
  autoClicker: 26,
  multiAutoClicker: 4,
  xpOrbChance: 20,
  yellowOrbChance: 20,
  greenOrbChance: 20,
  blueOrbChance: 20,
  xpValue: 20,
  levelUpEffect: 30,
  holdClick: 16,
  allyFindOrb: 20,
  meowKnight: 60,
  idleGlock: 60,
  idleAk47: 60,
  idleBazooka: 60,
  idleBow: 60,
  idleSword: 60,
  idleOrangeCat: 60,
  idlePickaxe: 60,
  researchClickPower: 10,
  researchMeowKnight: 10,
  researchIdleGlock: 10,
  researchIdleAk47: 10,
  researchIdleBazooka: 10,
  researchIdleBow: 10,
  researchIdleSword: 10,
  researchIdleOrangeCat: 10,
  researchIdlePickaxe: 10,
  criticalHit: 50,
  criticalEffect: 40,
};

export const MANA_IDLE_COMPANION_SKILL_IDS = [
  'idleGlock',
  'idleAk47',
  'idleBazooka',
  'idleBow',
  'idleSword',
  'idleOrangeCat',
  'idlePickaxe',
] as const satisfies readonly ManaIdleCompanionSkillId[];

export const MANA_RESEARCH_SKILL_IDS = [
  'researchClickPower',
  'researchMeowKnight',
  'researchIdleGlock',
  'researchIdleAk47',
  'researchIdleBazooka',
  'researchIdleBow',
  'researchIdleSword',
  'researchIdleOrangeCat',
  'researchIdlePickaxe',
] as const satisfies readonly ManaResearchSkillId[];

export const MANA_XP_PER_LEVEL = 100;
export const MANA_CRYSTAL_MAX_LEVEL = 99;
export const MANA_CRYSTAL_GEM_THRESHOLDS = [
  10_000,
  100_000,
  1_000_000,
  10_000_000,
  100_000_000,
  1_000_000_000,
  10_000_000_000,
  100_000_000_000,
  1_000_000_000_000,
  10_000_000_000_000,
] as const;
export const MANA_CRYSTAL_REVEAL_REQUIRED_MANA = MANA_CRYSTAL_GEM_THRESHOLDS[0];
const MANA_IDLE_ATTACK_INTERVAL = 1;
const MANA_IDLE_ATTACK_STAGGER_SECONDS = 0.12;

const DEBUG_SNAKE_SKILL_MAX_LEVELS: Record<SnakeSkillId, number> = {
  speed: 26,
  gridSize: 5,
  automation: 10,
  baseMultiplier: 40,
  bonusFruit: 7,
  extraLife: 2,
  edgeWrap: 1,
};

const DEBUG_TARGET_SKILL_MAX_LEVELS: Record<TargetSkillId, number> = {
  spawnSpeed: 10,
  targetCount: 5,
  damage: 20,
  automation: 10,
};

const DEBUG_DEFENSE_SKILL_MAX_LEVELS: Record<DefenseSkillId, number> = {
  damage: 60,
  damageMultiplier: 40,
  attackSpeed: 25,
  range: 25,
  criticalChance: 60,
  criticalMultiplier: 30,
  superCriticalChance: 25,
  superCriticalMultiplier: 25,
  lightningDamage: 50,
  lightningSpeed: 24,
  lightningCount: 5,
  iceDamage: 50,
  iceSpeed: 30,
  iceRange: 21,
  iceSlow: 20,
  health: 30,
  healthRegen: 30,
  moneyPerEnemy: 40,
  goldMultiplier: 90,
  baseSpeed: 10,
};

const DEFENSE_DAMAGE_COST_CURVE = [
  1, 3, 6, 9, 15, 30, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 1500, 1800, 2100, 2400, 2700, 3000,
  3300, 3600, 3900, 4200, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 60000, 70000, 80000,
  90000, 100000, 110000, 120000, 130000, 140000, 150000, 500000, 600000, 700000, 800000, 900000, 1000000, 1100000,
  1200000, 1300000, 1400000, 3000000, 5000000, 10000000,
] as const;

const DEFENSE_ATTACK_SPEED_COST_CURVE = [
  3, 6, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480, 40960, 81920, 163840, 327000, 655000, 1310000,
  2620000, 5240000, 10000000, 15000000, 20000000, 50000000,
] as const;

const DEFENSE_RANGE_COST_CURVE = [
  2, 6, 18, 51, 150, 450, 1500, 4500, 15000, 45000, 150000, 450000, 1500000, 2000000, 2500000, 3000000, 3500000,
  10000000, 15000000, 20000000, 25000000, 50000000, 100000000, 200000000, 500000000,
] as const;

const DEFENSE_GOLD_COST_CURVE = [
  10, 30, 80, 200, 500, 1500, 3000, 6000, 10000, 30000, 60000, 100000, 150000, 220000, 300000, 400000, 550000,
  750000, 1000000, 1300000, 1700000, 2200000, 2800000, 3500000, 4500000, 6000000, 8000000, 10000000, 13000000,
  17000000, 22000000, 28000000, 36000000, 46000000, 58000000, 75000000, 95000000, 120000000, 160000000, 220000000,
] as const;

const DEFENSE_GOLD_MULTIPLIER_COST_ANCHORS = [
  [1, 30],
  [2, 75],
  [3, 120],
  [4, 160],
  [5, 250],
  [6, 500],
  [7, 1000],
  [8, 2000],
  [9, 4000],
  [10, 7500],
  [15, 50000],
  [20, 200000],
  [30, 1500000],
  [40, 7000000],
  [50, 25000000],
  [60, 70000000],
  [75, 200000000],
  [90, 468000000],
] as const;

const DEFENSE_EXPLICIT_SKILL_COSTS: Partial<Record<DefenseSkillId, readonly number[]>> = {
  damage: DEFENSE_DAMAGE_COST_CURVE,
  attackSpeed: DEFENSE_ATTACK_SPEED_COST_CURVE,
  range: DEFENSE_RANGE_COST_CURVE,
  moneyPerEnemy: DEFENSE_GOLD_COST_CURVE,
  lightningCount: [90, 1500, 50000, 250000, 3000000],
  iceRange: [
    60, 120, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000,
    10000000, 25000000, 50000000, 100000000, 250000000,
  ],
  iceSlow: [55, 110, 220, 450, 900, 1800, 3500, 7000, 14000, 28000, 56000, 110000, 220000, 450000, 900000, 1800000, 3500000, 7000000, 14000000, 30000000],
};

const DEFENSE_COST_CURVES = {
  damage: DEFENSE_DAMAGE_COST_CURVE,
  attackSpeed: DEFENSE_ATTACK_SPEED_COST_CURVE,
  moneyPerEnemy: DEFENSE_GOLD_COST_CURVE,
} as const;

const DEFENSE_SCALED_SKILL_COSTS: Partial<
  Record<DefenseSkillId, { curve: keyof typeof DEFENSE_COST_CURVES; multiplier: number }>
> = {
  damageMultiplier: { curve: 'damage', multiplier: 75 },
  criticalChance: { curve: 'damage', multiplier: 26 },
  criticalMultiplier: { curve: 'damage', multiplier: 34 },
  superCriticalChance: { curve: 'attackSpeed', multiplier: 40 },
  superCriticalMultiplier: { curve: 'attackSpeed', multiplier: 53.34 },
  lightningDamage: { curve: 'damage', multiplier: 40 },
  lightningSpeed: { curve: 'attackSpeed', multiplier: 10 },
  iceDamage: { curve: 'damage', multiplier: 50 },
  iceSpeed: { curve: 'attackSpeed', multiplier: 15 },
  health: { curve: 'damage', multiplier: 8 },
  healthRegen: { curve: 'damage', multiplier: 14 },
  baseSpeed: { curve: 'moneyPerEnemy', multiplier: 6 },
};

const DEFENSE_TOWER_BASE_RANGE_PERCENT = 0.3;
const DEFENSE_TOWER_MAX_RANGE_PERCENT = 0.8;
const DEFENSE_TOWER_RANGE_PER_LEVEL_PERCENT = 0.02;
const DEFENSE_TOWER_DIRT_EDGE_RANGE = 0.36;
const DEFENSE_TOWER_BASE_HEALTH = 3;

const DEBUG_MINING_SKILL_MAX_LEVELS: Record<MiningSkillId, number> = {
  pickaxeForce: 30,
  splashDamage: 12,
  automation: 20,
};

const BOOK_PANEL_SLOTS: BookPanelSlot[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const BOOK_PANEL_OPEN_SLOTS: BookPanelSlot[] = [3, 0, 1, 2, 7, 4, 5, 6, 8];
const DEFENSE_DEATH_RESTART_DELAY = 3;
const DEFENSE_ENEMY_DEATH_DURATION = 0.62;
const DEFENSE_ENEMY_SPAWN_DISTANCE = 1.08;
const DEFENSE_DAMAGE_POPUP_DURATION = 1.5;
const DEFENSE_MONEY_POPUP_DURATION = 1.45;
const DEFENSE_MONEY_POPUP_VISUAL_DELAY = 0.5;
const DEFENSE_MONEY_COUNTER_POPUP_DELAY = 1;
const DEFENSE_MONEY_POPUP_CLUSTER_SECONDS = 0.24;
const DEFENSE_MONEY_POPUP_CLUSTER_RADIUS = 4.5;
const DEFENSE_MONEY_POPUP_COMBO_SECONDS = 0.2;
const DEFENSE_MONEY_POPUP_COMBO_MAX = 10;
const DEFENSE_MONEY_POPUP_COIN_COUNT = 1;
const DEFENSE_MONEY_POPUP_MAX_ACTIVE = 8;
const DEFENSE_MONEY_POPUP_FAST_MAX_ACTIVE = 6;
const DEFENSE_MONEY_POPUP_TURBO_MAX_ACTIVE = 4;
const DEFENSE_SKELETON_MAGE_HEALTH_RATIO = 0.6;
const DEFENSE_SKELETON_MAGE_ATTACK_RANGE = 0.35;
const DEFENSE_SKELETON_MAGE_DEATH_DURATION = 0.988;
const DEFENSE_ENEMY_TOWER_ATTACK_INTERVAL = 2;
const DEFENSE_SLIME_ATTACK_ANIMATION_DURATION = 0.84;
const DEFENSE_SKELETON_MAGE_ATTACK_INTERVAL = 2;
const DEFENSE_SKELETON_MAGE_ATTACK_ANIMATION_DURATION = 0.72;
const DEFENSE_SKELETON_MAGE_FIREBALL_DELAY = 0.28;
const DEFENSE_SKELETON_MAGE_FIREBALL_DURATION = 0.52;
const DEFENSE_BAT_HEALTH_RATIO = 0.4;
const DEFENSE_BAT_SPEED_MULTIPLIER = 1.95;
const DEFENSE_BAT_ATTACK_ANIMATION_DURATION = 0.58;
const DEFENSE_GOBLIN_KING_HEALTH_RATIO = 10;
const DEFENSE_GOBLIN_KING_SPEED_MULTIPLIER = 0.25;
const DEFENSE_GOBLIN_KING_ATTACK_ANIMATION_DURATION = 1.04;
const DEFENSE_GOBLIN_KING_DEATH_DURATION = 0.88;
const DEFENSE_SHOT_MIN_DURATION = 0.26;
const DEFENSE_SHOT_MAX_DURATION = 0.72;
const DEFENSE_SHOT_SECONDS_PER_MAP_PERCENT = 0.0115;
const DEFENSE_LIGHTNING_STRIKE_DURATION = 0.34;
const DEFENSE_LIGHTNING_BASE_DAMAGE = 10;
const DEFENSE_LIGHTNING_DAMAGE_PER_LEVEL = 5;
const DEFENSE_LIGHTNING_BASE_INTERVAL = 2.6;
const DEFENSE_LIGHTNING_MIN_INTERVAL = 0.55;
const DEFENSE_LIGHTNING_BURST_INTERVAL = 0.1;
const DEFENSE_ICE_BASE_DAMAGE = 3;
const DEFENSE_ICE_DAMAGE_PER_LEVEL = 2;
const DEFENSE_ICE_BASE_INTERVAL = 2;
const DEFENSE_ICE_MIN_INTERVAL = 0.5;
const DEFENSE_ICE_BASE_RANGE_PERCENT = 0.35;
const DEFENSE_ICE_MAX_RANGE_PERCENT = 0.75;
const DEFENSE_ICE_RANGE_PER_LEVEL_PERCENT = 0.02;
const DEFENSE_ICE_BASE_SLOW = 0.3;
const DEFENSE_ICE_MAX_SLOW = 0.7;
const DEFENSE_MAX_LEVEL = 99;
const DEFENSE_FINAL_WAVE = 100;

export type GameAction =
  | { type: 'selectBook'; bookId: BookId }
  | { type: 'closeBookPanel'; bookId: BookId }
  | { type: 'moveBookPanel'; bookId: BookId }
  | { type: 'chargeMana' }
  | { type: 'collectManaXpOrb' }
  | { type: 'setManaHoldClickActive'; active: boolean }
  | { type: 'tickManaHoldClick'; deltaSeconds: number }
  | { type: 'buyManaSkill'; skillId: ManaSkillId }
  | { type: 'startManaResearch'; skillId: ManaResearchSkillId }
  | { type: 'buySnakeSkill'; skillId: SnakeSkillId }
  | { type: 'buyDefenseSkill'; skillId: DefenseSkillId }
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
  | { type: 'maxAllSkills' }
  | { type: 'resetManaSkills' }
  | { type: 'resetAllSkills' }
  | { type: 'resetSelectedMiniGame' }
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
  | { type: 'exchangeMiningMaterials' }
  | { type: 'trainSlime'; commandId: SlimeTrainerCommandId }
  | { type: 'enemyAttackSlime' }
  | { type: 'cycleDefenseSpeed' }
  | { type: 'toggleDefenseBaseSpeed' }
  | { type: 'toggleDefensePause' }
  | { type: 'setDefenseWave'; wave: number }
  | { type: 'setDefenseDebugTowerHealth'; enabled: boolean }
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
    case 'collectManaXpOrb':
      collectManaXpOrb(state);
      return;
    case 'setManaHoldClickActive':
      setManaHoldClickActive(state, action.active);
      return;
    case 'tickManaHoldClick':
      tickManaHoldClick(state, action.deltaSeconds);
      return;
    case 'buyManaSkill':
      buyManaSkill(state, action.skillId);
      return;
    case 'startManaResearch':
      startManaResearch(state, action.skillId);
      return;
    case 'buySnakeSkill':
      buySnakeSkill(state, action.skillId);
      return;
    case 'buyDefenseSkill':
      buyDefenseSkill(state, action.skillId);
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
    case 'maxAllSkills':
      maxAllSkills(state);
      return;
    case 'resetManaSkills':
      resetManaSkills(state);
      return;
    case 'resetAllSkills':
      resetAllSkills(state);
      return;
    case 'resetSelectedMiniGame':
      resetSelectedMiniGame(state);
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
    case 'exchangeMiningMaterials':
      exchangeMiningMaterials(state);
      return;
    case 'trainSlime':
      trainSlime(state, action.commandId);
      return;
    case 'enemyAttackSlime':
      enemyAttackSlime(state);
      return;
    case 'cycleDefenseSpeed':
      state.defense.speedMultiplier = nextDefenseSpeedMultiplier(state.defense.speedMultiplier);
      state.defense.paused = false;
      return;
    case 'toggleDefenseBaseSpeed':
      state.defense.baseSpeedEnabled = !state.defense.baseSpeedEnabled;
      return;
    case 'toggleDefensePause':
      state.defense.paused = !state.defense.paused;
      return;
    case 'setDefenseWave':
      setDefenseWave(state, action.wave);
      return;
    case 'setDefenseDebugTowerHealth':
      setDefenseDebugTowerHealth(state, action.enabled);
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
    if (!book.unlocked || !bookUsesGenericAutomation(bookDefinition.id) || book.automation === 0) {
      continue;
    }

    const pinMultiplier = book.pinned ? 1 : 0.35;
    const amount = deltaSeconds * book.automation * pinMultiplier * (1 + book.level * 0.12);
    state.mana += amount * 0.65;
    if (bookDefinition.resourceId) {
      state.resources[bookDefinition.resourceId] += amount * 0.22;
    }
  }

  tickManaMeowKnight(state, deltaSeconds);
  tickManaIdleCompanions(state, deltaSeconds);
  tickManaAutoClicker(state, deltaSeconds);
  tickManaResearch(state, deltaSeconds);
  tickSnake(state, deltaSeconds);
  tickDefense(state, deltaSeconds);
  tickTargets(state, deltaSeconds);
  tickMining(state, deltaSeconds);
  tickSlimeTrainer(state, deltaSeconds);
}

function bookUsesGenericAutomation(bookId: BookId): boolean {
  return bookId !== 'mana' && bookId !== 'blackjack';
}

function chargeMana(state: GameState): void {
  const book = state.books.mana;
  const result = rollManaClickResult(state);
  const gain = result.gain;
  advanceManaResearchByClicks(state, 1);
  state.manaCrystal.lastXpOrbSpawned = false;
  state.manaCrystal.lastXpGain = 0;
  state.manaCrystal.lastCollectedXpOrb = null;
  book.charge += 12 + book.level * 2;
  while (book.charge >= 100) {
    book.charge -= 100;
    state.forbiddenGrimoire.keys += 1;
    state.forbiddenGrimoire.pulse += 1;
  }
  state.mana += gain;
  grantManaCrystalHarvest(state, gain);
  state.manaSkills.lastManaGainCritical = result.critical;
  maybeSpawnManaXpOrb(state);
}

function tickManaMeowKnight(state: GameState, deltaSeconds: number): void {
  const skills = state.manaSkills;
  const level = skills.meowKnight ?? 0;
  if (level <= 0) {
    skills.meowKnightTimer = 0;
    return;
  }

  const initialTimer =
    skills.meowKnightTimer === 0 && (skills.lastMeowKnightAttackCount ?? 0) <= 0
      ? -MANA_IDLE_ATTACK_STAGGER_SECONDS
      : skills.meowKnightTimer;
  skills.meowKnightTimer = initialTimer + Math.max(0, deltaSeconds);
  const attacks = Math.floor(skills.meowKnightTimer / MANA_IDLE_ATTACK_INTERVAL);
  if (attacks <= 0) {
    return;
  }

  skills.meowKnightTimer %= MANA_IDLE_ATTACK_INTERVAL;
  const gain = manaMeowKnightDamage(state);
  state.mana += gain * attacks;
  grantManaCrystalHarvest(state, gain * attacks);
  skills.lastMeowKnightAttackCount = (skills.lastMeowKnightAttackCount ?? 0) + attacks;
  for (let attack = 0; attack < attacks; attack += 1) {
    maybeSpawnManaAllyOrb(state);
  }
}

function tickManaIdleCompanions(state: GameState, deltaSeconds: number): void {
  const skills = state.manaSkills;
  for (const skillId of MANA_IDLE_COMPANION_SKILL_IDS) {
    const level = skills[skillId] ?? 0;
    if (level <= 0) {
      delete skills.idleCompanionTimers[skillId];
      continue;
    }

    const timer = (skills.idleCompanionTimers[skillId] ?? -manaIdleCompanionAttackOffset(skillId)) + Math.max(0, deltaSeconds);
    const attacks = Math.floor(timer / MANA_IDLE_ATTACK_INTERVAL);
    skills.idleCompanionTimers[skillId] = attacks > 0 ? timer % MANA_IDLE_ATTACK_INTERVAL : timer;
    if (attacks <= 0) {
      continue;
    }

    const gain = manaIdleCompanionDamage(state, skillId);
    state.mana += gain * attacks;
    grantManaCrystalHarvest(state, gain * attacks);
    skills.idleCompanionAttackCounts[skillId] = (skills.idleCompanionAttackCounts[skillId] ?? 0) + attacks;
    for (let attack = 0; attack < attacks; attack += 1) {
      maybeSpawnManaAllyOrb(state);
    }
  }
}

function tickManaAutoClicker(state: GameState, deltaSeconds: number): void {
  const interval = manaAutoClickerInterval(state);
  const clickCount = manaAutoClickerCount(state);
  if (!Number.isFinite(interval) || clickCount <= 0) {
    state.manaSkills.autoClickTimer = 0;
    return;
  }

  state.manaSkills.autoClickTimer += Math.max(0, deltaSeconds);
  const cycles = Math.floor(state.manaSkills.autoClickTimer / interval);
  if (cycles <= 0) {
    return;
  }

  state.manaSkills.autoClickTimer %= interval;
  const totalClicks = cycles * clickCount;
  for (let index = 0; index < totalClicks; index += 1) {
    chargeMana(state);
  }
  state.manaSkills.lastAutoClickCount = (state.manaSkills.lastAutoClickCount ?? 0) + totalClicks;
}

function tickManaResearch(state: GameState, deltaSeconds: number): void {
  const activeResearch = state.manaSkills.activeResearch;
  if (!activeResearch) {
    return;
  }

  if (!manaCanResearch(state, activeResearch.skillId)) {
    state.manaSkills.activeResearch = null;
    return;
  }

  activeResearch.elapsed += Math.max(0, deltaSeconds) * manaResearchSpeedMultiplier(state);
  completeManaResearchIfReady(state);
}

function manaIdleCompanionAttackOffset(skillId: ManaIdleCompanionSkillId): number {
  const index = MANA_IDLE_COMPANION_SKILL_IDS.indexOf(skillId);
  return Math.max(0, index) * MANA_IDLE_ATTACK_STAGGER_SECONDS;
}

function rollManaClickResult(state: GameState): { gain: number; critical: boolean } {
  const skills = state.manaSkills;
  const baseGain = manaClickGainPreview(state);
  let gain = baseGain;
  let critical = false;

  const criticalChance = Math.min(50, skills.criticalHit) / 100;
  if (criticalChance <= 0 || Math.random() >= criticalChance) {
    return { gain, critical };
  }

  return { gain: roundManaAmount(gain * manaCriticalMultiplier(state)), critical: true };
}

function maybeSpawnManaXpOrb(state: GameState): void {
  const orbKind = rollManaOrbKind(state);
  if (!orbKind) {
    return;
  }

  const orb = {
    id: state.manaCrystal.nextXpOrbId,
    kind: orbKind,
    x: Math.round(18 + Math.random() * 64),
    y: Math.round(26 + Math.random() * 48),
    value: manaOrbPrimaryValue(state, orbKind),
  };
  state.manaCrystal.nextXpOrbId += 1;
  state.manaCrystal.lastXpOrbSpawned = true;
  state.manaCrystal.lastCollectedXpOrb = orb;
  collectManaXpOrbReward(state, orb);
}

function maybeSpawnManaAllyOrb(state: GameState): void {
  const orbKind = rollManaAllyOrbKind(state);
  if (!orbKind) {
    return;
  }

  const orb = {
    id: state.manaCrystal.nextXpOrbId,
    kind: orbKind,
    x: Math.round(18 + Math.random() * 64),
    y: Math.round(26 + Math.random() * 48),
    value: manaOrbPrimaryValue(state, orbKind),
  };
  state.manaCrystal.nextXpOrbId += 1;
  state.manaCrystal.lastXpOrbSpawned = true;
  state.manaCrystal.lastCollectedXpOrb = orb;
  collectManaXpOrbReward(state, orb);
}

function rollManaOrbKind(state: GameState): ManaOrbKind | null {
  const candidates: Array<{ kind: ManaOrbKind; chance: number }> = [
    { kind: 'red', chance: manaXpOrbChance(state) },
    { kind: 'yellow', chance: manaYellowOrbChance(state) },
    { kind: 'green', chance: manaGreenOrbChance(state) },
    { kind: 'blue', chance: manaBlueOrbChance(state) },
  ];

  for (const candidate of candidates) {
    if (candidate.chance > 0 && Math.random() < candidate.chance) {
      return candidate.kind;
    }
  }
  return null;
}

function rollManaAllyOrbKind(state: GameState): ManaOrbKind | null {
  const chance = manaAllyFindOrbChance(state);
  if (chance <= 0 || Math.random() >= chance) {
    return null;
  }

  const candidates = manaOrbChanceCandidates(state).filter((candidate) => candidate.chance > 0);
  if (candidates.length === 0) {
    return 'red';
  }

  const totalChance = candidates.reduce((total, candidate) => total + candidate.chance, 0);
  let roll = Math.random() * totalChance;
  for (const candidate of candidates) {
    roll -= candidate.chance;
    if (roll <= 0) {
      return candidate.kind;
    }
  }
  return candidates[candidates.length - 1]?.kind ?? 'red';
}

function manaOrbChanceCandidates(state: GameState): Array<{ kind: ManaOrbKind; chance: number }> {
  return [
    { kind: 'red', chance: manaXpOrbChance(state) },
    { kind: 'yellow', chance: manaYellowOrbChance(state) },
    { kind: 'green', chance: manaGreenOrbChance(state) },
    { kind: 'blue', chance: manaBlueOrbChance(state) },
  ];
}

function collectManaXpOrb(state: GameState): void {
  const orb = state.manaCrystal.xpOrb;
  if (!orb) {
    state.manaCrystal.lastXpGain = 0;
    return;
  }

  collectManaXpOrbReward(state, orb);
  state.manaCrystal.xpOrb = null;
}

function collectManaXpOrbReward(state: GameState, orb: ManaXpOrb): void {
  const xpGain = manaOrbXpReward(state, orb.kind);
  const manaGain = manaOrbManaReward(state, orb.kind);
  const beforeLevel = manaCrystalLevelForXp(state.manaCrystal.xp);
  state.manaCrystal.xp += xpGain;
  const afterLevel = manaCrystalLevelForXp(state.manaCrystal.xp);
  const levelUpBonus = afterLevel > beforeLevel ? manaLevelUpBonus(state, afterLevel - beforeLevel) : 0;
  const totalManaGain = manaGain + levelUpBonus;
  state.mana += totalManaGain;
  grantManaCrystalHarvest(state, totalManaGain);
  state.manaCrystal.lastXpGain = xpGain;
}

function grantManaCrystalHarvest(state: GameState, amount: number): void {
  if (amount <= 0) {
    return;
  }
  state.manaCrystal.harvestedMana = Math.max(0, state.manaCrystal.harvestedMana + amount);
}

function setManaHoldClickActive(state: GameState, active: boolean): void {
  state.manaCrystal.holdClickActive = active && manaHoldClickUnlocked(state);
  if (!state.manaCrystal.holdClickActive) {
    state.manaCrystal.holdClickTimer = 0;
  }
}

function tickManaHoldClick(state: GameState, deltaSeconds: number): void {
  if (!manaHoldClickUnlocked(state) || !state.manaCrystal.holdClickActive) {
    state.manaCrystal.holdClickTimer = 0;
    return;
  }

  state.manaCrystal.holdClickTimer += Math.max(0, deltaSeconds);
  const interval = 1 / manaHoldClickRate(state);
  const clicks = Math.floor(state.manaCrystal.holdClickTimer / interval);
  if (clicks <= 0) {
    return;
  }

  state.manaCrystal.holdClickTimer %= interval;
  for (let index = 0; index < clicks; index += 1) {
    chargeMana(state);
  }
}

export function manaClickMultiplier(state: GameState): number {
  return 1 + state.manaSkills.clickMultiplier * 0.25;
}

export function manaClickGainPreview(state: GameState): number {
  const directClickDamage =
    (1 + state.manaSkills.power) *
    manaClickMultiplier(state) *
    manaCrystalResourceMultiplier(state) *
    manaResearchMultiplier(state, 'researchClickPower');
  return roundManaAmount(directClickDamage + manaResearchAllyClickDamage(state));
}

export function manaMeowKnightDamage(state: GameState): number {
  const level = Math.max(0, state.manaSkills.meowKnight ?? 0);
  return level <= 0 ? 0 : roundManaAmount(level * manaCrystalAllyAttackMultiplier(state) * manaResearchMultiplier(state, 'researchMeowKnight'));
}

export function manaIdleCompanionDamage(state: GameState, skillId: ManaIdleCompanionSkillId): number {
  const level = Math.max(0, state.manaSkills[skillId] ?? 0);
  return level <= 0
    ? 0
    : roundManaAmount(level * manaCrystalAllyAttackMultiplier(state) * manaResearchMultiplier(state, manaResearchSkillForAlly(skillId)));
}

function roundManaAmount(value: number): number {
  return Math.max(1, Number(value.toFixed(1)));
}

export function manaCrystalDiscoveredGemCount(state: GameState): number {
  const harvested = Math.max(0, state.manaCrystal.harvestedMana ?? 0);
  return MANA_CRYSTAL_GEM_THRESHOLDS.filter((threshold) => harvested >= threshold).length;
}

export function manaCrystalCurrentGemIndex(state: GameState): number {
  return Math.min(MANA_CRYSTAL_GEM_THRESHOLDS.length - 1, manaCrystalDiscoveredGemCount(state));
}

export function manaCrystalResourceMultiplier(state: GameState): number {
  return Number((manaCrystalGemMultiplier(state) * manaCrystalLevelResourceMultiplier(state)).toFixed(2));
}

export function manaCrystalAllyAttackMultiplier(state: GameState): number {
  return Number((manaCrystalGemMultiplier(state) * manaCrystalLevelAttackMultiplier(state)).toFixed(2));
}

function manaCrystalGemMultiplier(state: GameState): number {
  return Number((1 + manaCrystalDiscoveredGemCount(state) * 0.1).toFixed(1));
}

export function manaCrystalLevelForXp(xp: number): number {
  return Math.max(0, Math.min(MANA_CRYSTAL_MAX_LEVEL, Math.floor(Math.max(0, xp) / MANA_XP_PER_LEVEL)));
}

export function manaCrystalLevel(state: GameState): number {
  return manaCrystalLevelForXp(state.manaCrystal.xp);
}

export function manaCrystalLevelResourceMultiplier(state: GameState): number {
  return manaCrystalLevelBonusMultiplier(state);
}

export function manaCrystalLevelXpMultiplier(state: GameState): number {
  return manaCrystalLevelBonusMultiplier(state);
}

export function manaCrystalLevelAttackMultiplier(state: GameState): number {
  return manaCrystalLevelBonusMultiplier(state);
}

function manaCrystalLevelBonusMultiplier(state: GameState): number {
  return Number((1 + manaCrystalLevel(state) * 0.05).toFixed(2));
}

export function manaCrystalRevealProgress(state: GameState): number {
  const harvested = Math.max(0, state.manaCrystal.harvestedMana ?? 0);
  const currentGemIndex = manaCrystalCurrentGemIndex(state);
  if (manaCrystalDiscoveredGemCount(state) >= MANA_CRYSTAL_GEM_THRESHOLDS.length) {
    return 1;
  }
  const previousThreshold = currentGemIndex <= 0 ? 0 : MANA_CRYSTAL_GEM_THRESHOLDS[currentGemIndex - 1];
  const nextThreshold = MANA_CRYSTAL_GEM_THRESHOLDS[currentGemIndex];
  const rawProgress = Math.max(0, Math.min(1, (harvested - previousThreshold) / (nextThreshold - previousThreshold)));
  return Number(Math.pow(rawProgress, 0.58).toFixed(4));
}

export function manaXpOrbChance(state: GameState): number {
  return Math.min(1, state.manaSkills.xpOrbChance * 0.05);
}

export function manaYellowOrbChance(state: GameState): number {
  return Math.min(1, state.manaSkills.yellowOrbChance * 0.05);
}

export function manaGreenOrbChance(state: GameState): number {
  return Math.min(1, state.manaSkills.greenOrbChance * 0.05);
}

export function manaBlueOrbChance(state: GameState): number {
  return Math.min(1, state.manaSkills.blueOrbChance * 0.05);
}

export function manaAllyFindOrbChance(state: GameState): number {
  const strongestClickChance = Math.max(...manaOrbChanceCandidates(state).map((candidate) => candidate.chance));
  const clickMinusFivePercent = Math.max(0, strongestClickChance - 0.05);
  return Math.min(clickMinusFivePercent, state.manaSkills.allyFindOrb * 0.05);
}

export function manaXpOrbValue(state: GameState): number {
  return roundManaAmount((1 + state.manaSkills.xpValue) * manaCrystalLevelXpMultiplier(state));
}

export function manaLevelUpEffectMultiplier(state: GameState): number {
  return 1 + state.manaSkills.levelUpEffect * 0.1;
}

function manaLevelUpBonus(state: GameState, levelsGained: number): number {
  return Math.max(0, Math.round(levelsGained * 100 * manaLevelUpEffectMultiplier(state)));
}

function manaOrbPrimaryValue(state: GameState, kind: ManaOrbKind): number {
  if (kind === 'yellow') {
    return manaOrbManaReward(state, kind);
  }
  if (kind === 'blue') {
    return manaOrbXpReward(state, kind) + manaOrbManaReward(state, kind);
  }
  return manaOrbXpReward(state, kind);
}

function manaOrbXpReward(state: GameState, kind: ManaOrbKind): number {
  switch (kind) {
    case 'red':
      return manaXpOrbValue(state);
    case 'green':
      return manaXpOrbValue(state) * 2;
    case 'blue':
      return manaXpOrbValue(state);
    case 'yellow':
      return 0;
  }
}

function manaOrbManaReward(state: GameState, kind: ManaOrbKind): number {
  const clickGain = manaClickGainPreview(state);
  switch (kind) {
    case 'yellow':
      return Math.max(1, clickGain * 8);
    case 'blue':
      return Math.max(1, clickGain * 3);
    case 'red':
    case 'green':
      return 0;
  }
}

export function manaHoldClickUnlocked(state: GameState): boolean {
  return state.manaSkills.holdClick > 0;
}

export function manaHoldClickRate(state: GameState): number {
  const level = Math.max(0, state.manaSkills.holdClick ?? 0);
  return level <= 0 ? 0 : Math.min(20, 4 + level);
}

export function manaAutoClickerInterval(state: GameState): number {
  const level = Math.max(0, state.manaSkills.autoClicker ?? 0);
  return level <= 0 ? Number.POSITIVE_INFINITY : Number(Math.max(0.1, 5 - (level - 1) * 0.2).toFixed(1));
}

export function manaAutoClickerCount(state: GameState): number {
  if ((state.manaSkills.autoClicker ?? 0) <= 0) {
    return 0;
  }
  return Math.max(1, Math.min(4, state.manaSkills.multiAutoClicker || 1));
}

export function manaResearchUnlocked(state: GameState): boolean {
  return (state.manaSkills.research ?? 0) > 0;
}

export function manaClickResearchSecondsPerFiveClicks(state: GameState): number {
  return Math.min(20, Math.max(0, state.manaSkills.clickResearch ?? 0));
}

export function manaResearchSpeedMultiplier(state: GameState): number {
  return manaCrystalLevelBonusMultiplier(state);
}

export function manaResearchDuration(state: GameState, skillId: ManaResearchSkillId): number {
  const level = Math.max(0, state.manaSkills[skillId] ?? 0);
  return Number((30 * Math.pow(1.45, level)).toFixed(1));
}

export function manaResearchMultiplier(state: GameState, skillId: ManaResearchSkillId): number {
  const level = Math.max(0, state.manaSkills[skillId] ?? 0);
  return Number(Math.pow(1.1, level).toFixed(4));
}

export function manaCanResearch(state: GameState, skillId: ManaResearchSkillId): boolean {
  if (!manaResearchUnlocked(state)) {
    return false;
  }
  const maxLevel = manaSkillMaxLevel(skillId);
  if (maxLevel !== null && (state.manaSkills[skillId] ?? 0) >= maxLevel) {
    return false;
  }
  const allySkillId = manaAllySkillForResearch(skillId);
  return !allySkillId || (state.manaSkills[allySkillId] ?? 0) > 0;
}

export function manaResearchProgress(state: GameState, skillId: ManaResearchSkillId): number {
  const activeResearch = state.manaSkills.activeResearch;
  if (!activeResearch || activeResearch.skillId !== skillId || activeResearch.duration <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, activeResearch.elapsed / activeResearch.duration));
}

export function manaResearchRemainingSeconds(state: GameState, skillId: ManaResearchSkillId): number {
  const activeResearch = state.manaSkills.activeResearch;
  if (!activeResearch || activeResearch.skillId !== skillId) {
    return manaResearchDuration(state, skillId);
  }
  return Math.max(0, activeResearch.duration - activeResearch.elapsed);
}

function manaResearchAllyClickDamage(state: GameState): number {
  const meowResearchLevel = Math.max(0, state.manaSkills.researchMeowKnight ?? 0);
  let total = meowResearchLevel > 0 ? manaMeowKnightDamage(state) * meowResearchLevel * 0.01 : 0;
  for (const allySkillId of MANA_IDLE_COMPANION_SKILL_IDS) {
    const researchSkillId = manaResearchSkillForAlly(allySkillId);
    const researchLevel = Math.max(0, state.manaSkills[researchSkillId] ?? 0);
    if (researchLevel <= 0) {
      continue;
    }
    total += manaIdleCompanionDamage(state, allySkillId) * researchLevel * 0.01;
  }
  return total;
}

function manaResearchSkillForAlly(skillId: ManaIdleCompanionSkillId): ManaResearchSkillId {
  switch (skillId) {
    case 'idleGlock':
      return 'researchIdleGlock';
    case 'idleAk47':
      return 'researchIdleAk47';
    case 'idleBazooka':
      return 'researchIdleBazooka';
    case 'idleBow':
      return 'researchIdleBow';
    case 'idleSword':
      return 'researchIdleSword';
    case 'idleOrangeCat':
      return 'researchIdleOrangeCat';
    case 'idlePickaxe':
      return 'researchIdlePickaxe';
  }
}

function manaAllySkillForResearch(skillId: ManaResearchSkillId): ManaIdleCompanionSkillId | 'meowKnight' | null {
  switch (skillId) {
    case 'researchClickPower':
      return null;
    case 'researchMeowKnight':
      return 'meowKnight';
    case 'researchIdleGlock':
      return 'idleGlock';
    case 'researchIdleAk47':
      return 'idleAk47';
    case 'researchIdleBazooka':
      return 'idleBazooka';
    case 'researchIdleBow':
      return 'idleBow';
    case 'researchIdleSword':
      return 'idleSword';
    case 'researchIdleOrangeCat':
      return 'idleOrangeCat';
    case 'researchIdlePickaxe':
      return 'idlePickaxe';
  }
}

function startManaResearch(state: GameState, skillId: ManaResearchSkillId): void {
  if (state.manaSkills.activeResearch || !manaCanResearch(state, skillId)) {
    return;
  }
  state.manaSkills.activeResearch = {
    skillId,
    elapsed: 0,
    duration: manaResearchDuration(state, skillId),
  };
}

function advanceManaResearchByClicks(state: GameState, clicks: number): void {
  const activeResearch = state.manaSkills.activeResearch;
  const secondsPerFiveClicks = manaClickResearchSecondsPerFiveClicks(state);
  if (!activeResearch || secondsPerFiveClicks <= 0 || clicks <= 0) {
    return;
  }

  activeResearch.elapsed += (secondsPerFiveClicks / 5) * clicks * manaResearchSpeedMultiplier(state);
  completeManaResearchIfReady(state);
}

function completeManaResearchIfReady(state: GameState): void {
  const activeResearch = state.manaSkills.activeResearch;
  if (!activeResearch || activeResearch.elapsed < activeResearch.duration) {
    return;
  }

  const skillId = activeResearch.skillId;
  if (manaCanResearch(state, skillId)) {
    state.manaSkills[skillId] = Math.min((state.manaSkills[skillId] ?? 0) + 1, manaSkillMaxLevel(skillId) ?? Number.MAX_SAFE_INTEGER);
  }
  state.manaSkills.activeResearch = null;
}

export function manaCriticalMultiplier(state: GameState): number {
  return 2 + Math.min(40, state.manaSkills.criticalEffect) * 0.1;
}

export function manaSkillCost(state: GameState, skillId: ManaSkillId): number {
  const level = state.manaSkills[skillId] ?? 0;
  switch (skillId) {
    case 'power':
      return Math.round(12 * Math.pow(1.38, level));
    case 'clickMultiplier':
      return Math.round(65 * Math.pow(1.4, level));
    case 'research':
      return 900;
    case 'clickResearch':
      return Math.round(420 * Math.pow(1.36, level));
    case 'autoClicker':
      return Math.round(180 * Math.pow(1.32, level));
    case 'multiAutoClicker':
      return Math.round(650 * Math.pow(1.7, level));
    case 'xpOrbChance':
      return Math.round(120 * Math.pow(1.34, level));
    case 'yellowOrbChance':
      return Math.round(140 * Math.pow(1.34, level));
    case 'greenOrbChance':
      return Math.round(180 * Math.pow(1.36, level));
    case 'blueOrbChance':
      return Math.round(220 * Math.pow(1.38, level));
    case 'xpValue':
      return Math.round(220 * Math.pow(1.48, level));
    case 'levelUpEffect':
      return Math.round(260 * Math.pow(1.42, level));
    case 'holdClick':
      return Math.round(120 * Math.pow(1.36, level));
    case 'allyFindOrb':
      return Math.round(340 * Math.pow(1.42, level));
    case 'meowKnight':
      return Math.round(160 * Math.pow(1.42, level));
    case 'idleGlock':
      return Math.round(240 * Math.pow(1.42, level));
    case 'idleAk47':
      return Math.round(520 * Math.pow(1.44, level));
    case 'idleBazooka':
      return Math.round(1200 * Math.pow(1.46, level));
    case 'idleBow':
      return Math.round(210 * Math.pow(1.4, level));
    case 'idleSword':
      return Math.round(360 * Math.pow(1.42, level));
    case 'idleOrangeCat':
      return Math.round(2500 * Math.pow(1.48, level));
    case 'idlePickaxe':
      return Math.round(460 * Math.pow(1.43, level));
    case 'researchClickPower':
    case 'researchMeowKnight':
    case 'researchIdleGlock':
    case 'researchIdleAk47':
    case 'researchIdleBazooka':
    case 'researchIdleBow':
    case 'researchIdleSword':
    case 'researchIdleOrangeCat':
    case 'researchIdlePickaxe':
      return 0;
    case 'criticalHit':
      return Math.round(80 * Math.pow(1.36, level));
    case 'criticalEffect':
      return Math.round(120 * Math.pow(1.32, level));
  }
}

export function manaSkillMaxLevel(skillId: ManaSkillId): number | null {
  switch (skillId) {
    case 'clickMultiplier':
      return 40;
    case 'research':
      return 1;
    case 'clickResearch':
      return 20;
    case 'autoClicker':
      return 26;
    case 'multiAutoClicker':
      return 4;
    case 'xpOrbChance':
    case 'yellowOrbChance':
    case 'greenOrbChance':
    case 'blueOrbChance':
      return 20;
    case 'xpValue':
      return 20;
    case 'levelUpEffect':
      return 30;
    case 'holdClick':
      return 16;
    case 'allyFindOrb':
      return 20;
    case 'meowKnight':
    case 'idleGlock':
    case 'idleAk47':
    case 'idleBazooka':
    case 'idleBow':
    case 'idleSword':
    case 'idleOrangeCat':
    case 'idlePickaxe':
      return 60;
    case 'researchClickPower':
    case 'researchMeowKnight':
    case 'researchIdleGlock':
    case 'researchIdleAk47':
    case 'researchIdleBazooka':
    case 'researchIdleBow':
    case 'researchIdleSword':
    case 'researchIdleOrangeCat':
    case 'researchIdlePickaxe':
      return 10;
    case 'criticalHit':
      return 50;
    case 'criticalEffect':
      return 40;
    case 'power':
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
  return snakeBaseMultiplier(state) * snakeComboMultiplier(state);
}

export function snakeBonusMultiplier(state: GameState): number {
  return state.snake.bonusFood && snakeBonusFoodKind(state.snake.bonusFood.type) === 'multiplier'
    ? snakeBonusFruitMultiplier(state.snake.bonusFood.type)
    : 0;
}

export function snakeBonusFruitMultiplier(type: SnakeBonusFruitType): number {
  switch (type) {
    case 'round-blue':
    case 'round-green':
    case 'round-pink':
      return 0;
    case 'diamond-red':
      return 0.2;
    case 'diamond-blue':
      return 0.4;
    case 'diamond-green':
      return 0.7;
    case 'diamond-pink':
      return 1;
  }
}

function snakeBonusFoodKind(type: SnakeBonusFruitType): 'score' | 'multiplier' {
  return type.startsWith('round-') ? 'score' : 'multiplier';
}

function snakeBonusFoodComboSteps(type: SnakeBonusFruitType): number {
  return Math.round(snakeBonusFruitMultiplier(type) * 10);
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

export function defenseSkillMaxLevel(skillId: DefenseSkillId): number {
  return DEBUG_DEFENSE_SKILL_MAX_LEVELS[skillId];
}

function scaledDefenseSkillCost(skillId: DefenseSkillId, level: number): number | null {
  const config = DEFENSE_SCALED_SKILL_COSTS[skillId];
  if (!config) {
    return null;
  }

  const curve = DEFENSE_COST_CURVES[config.curve];
  const maxLevel = Math.max(1, defenseSkillMaxLevel(skillId));
  const position = (Math.max(0, level) / Math.max(1, maxLevel - 1)) * (curve.length - 1);
  const lowIndex = Math.floor(position);
  const highIndex = Math.min(curve.length - 1, lowIndex + 1);
  const blend = position - lowIndex;
  const cost = curve[lowIndex] + (curve[highIndex] - curve[lowIndex]) * blend;
  return roundDefenseSkillCost(cost * config.multiplier);
}

function roundDefenseSkillCost(cost: number): number {
  if (cost < 1000) return Math.max(1, Math.round(cost));
  if (cost < 10000) return Math.round(cost / 10) * 10;
  if (cost < 100000) return Math.round(cost / 100) * 100;
  if (cost < 1000000) return Math.round(cost / 1000) * 1000;
  if (cost < 10000000) return Math.round(cost / 10000) * 10000;
  if (cost < 100000000) return Math.round(cost / 100000) * 100000;
  return Math.round(cost / 1000000) * 1000000;
}

function defenseGoldMultiplierCost(level: number): number {
  const purchaseLevel = Math.min(defenseSkillMaxLevel('goldMultiplier'), Math.max(1, level + 1));
  const firstAnchor = DEFENSE_GOLD_MULTIPLIER_COST_ANCHORS[0];
  if (purchaseLevel <= firstAnchor[0]) {
    return firstAnchor[1];
  }

  for (let index = 1; index < DEFENSE_GOLD_MULTIPLIER_COST_ANCHORS.length; index += 1) {
    const [targetLevel, targetCost] = DEFENSE_GOLD_MULTIPLIER_COST_ANCHORS[index];
    if (purchaseLevel === targetLevel) {
      return targetCost;
    }
    if (purchaseLevel < targetLevel) {
      const [sourceLevel, sourceCost] = DEFENSE_GOLD_MULTIPLIER_COST_ANCHORS[index - 1];
      const progress = (purchaseLevel - sourceLevel) / (targetLevel - sourceLevel);
      return roundDefenseSkillCost(sourceCost * Math.pow(targetCost / sourceCost, progress));
    }
  }

  return DEFENSE_GOLD_MULTIPLIER_COST_ANCHORS[DEFENSE_GOLD_MULTIPLIER_COST_ANCHORS.length - 1][1];
}

export function defenseSkillCost(state: GameState, skillId: DefenseSkillId): number {
  const level = state.defenseSkills[skillId];
  const explicitCosts = DEFENSE_EXPLICIT_SKILL_COSTS[skillId];
  if (explicitCosts && level >= 0 && level < explicitCosts.length) {
    return explicitCosts[level];
  }
  const scaledCost = scaledDefenseSkillCost(skillId, level);
  if (scaledCost !== null) {
    return scaledCost;
  }

  switch (skillId) {
    case 'damage':
      return Math.round(2 * Math.pow(1.42, level));
    case 'damageMultiplier':
      return Math.round(75 * Math.pow(1.42, level));
    case 'attackSpeed':
      return Math.round(12 * Math.pow(1.36, level));
    case 'range':
      return Math.round(18 * Math.pow(1.45, level));
    case 'criticalChance':
      return Math.round(26 * Math.pow(1.38, level));
    case 'criticalMultiplier':
      return Math.round(34 * Math.pow(1.36, level));
    case 'superCriticalChance':
      return Math.round(120 * Math.pow(1.5, level));
    case 'superCriticalMultiplier':
      return Math.round(160 * Math.pow(1.48, level));
    case 'lightningDamage':
      return Math.round(40 * Math.pow(1.34, level));
    case 'lightningSpeed':
      return Math.round(30 * Math.pow(1.38, level));
    case 'lightningCount':
      return Math.round(90 * Math.pow(1.55, level));
    case 'iceDamage':
      return Math.round(50 * Math.pow(1.34, level));
    case 'iceSpeed':
      return Math.round(45 * Math.pow(1.37, level));
    case 'iceRange':
      return Math.round(60 * Math.pow(1.36, level));
    case 'iceSlow':
      return Math.round(55 * Math.pow(1.38, level));
    case 'health':
      return Math.round(8 * Math.pow(1.34, level));
    case 'healthRegen':
      return Math.round(14 * Math.pow(1.42, level));
    case 'moneyPerEnemy':
      return Math.round(12 * Math.pow(1.38, level));
    case 'goldMultiplier':
      return defenseGoldMultiplierCost(level);
    case 'baseSpeed':
      return Math.round(60 * Math.pow(1.45, level));
  }
}

export function defenseSkillLocked(state: GameState, skillId: DefenseSkillId): boolean {
  switch (skillId) {
    case 'iceSpeed':
    case 'iceRange':
    case 'iceSlow':
      return state.defenseSkills.iceDamage < 1;
    case 'lightningDamage':
    case 'lightningSpeed':
      return state.defenseSkills.lightningCount < 1;
    default:
      return false;
  }
}

export function defenseMaxTowerHealth(state: GameState): number {
  if (state.defense.debugTowerHealthEnabled) {
    return 10000;
  }
  return DEFENSE_TOWER_BASE_HEALTH + state.defenseSkills.health * 2;
}

export function defenseTowerHealthRegenPerSecond(state: GameState): number {
  return state.defenseSkills.healthRegen * 0.02;
}

export function defenseTowerResistance(_state: GameState): number {
  return 0;
}

export function defenseEnemyTowerDamage(state: GameState): number {
  const wave = Math.max(1, Math.floor(state.defense.wave));
  const waveDamage = Math.floor((wave - 1) / 10) + 1;
  return Math.max(0.2, waveDamage - defenseTowerResistance(state));
}

export function defenseExperienceToNextLevel(rawLevel: number): number {
  const level = Math.max(0, Math.min(DEFENSE_MAX_LEVEL, Math.floor(rawLevel)));
  if (level >= DEFENSE_MAX_LEVEL) {
    return 0;
  }

  return 10 + level * 15 + level * (level - 1);
}

export function defenseLevelMultiplier(state: GameState): number {
  const level = Math.max(0, Math.min(DEFENSE_MAX_LEVEL, Math.floor(state.defense.level ?? 0)));
  return 1 + level * 0.05;
}

export function defenseTowerRange(state: GameState): number {
  const rangePercent = defenseTowerRangePercent(state);
  return DEFENSE_TOWER_DIRT_EDGE_RANGE + (1 - DEFENSE_TOWER_DIRT_EDGE_RANGE) * rangePercent;
}

export function defenseTowerRangePercent(state: GameState): number {
  const rangeLevel = Math.max(0, Math.min(defenseSkillMaxLevel('range'), state.defenseSkills.range));
  return Math.min(
    DEFENSE_TOWER_MAX_RANGE_PERCENT,
    DEFENSE_TOWER_BASE_RANGE_PERCENT + rangeLevel * DEFENSE_TOWER_RANGE_PER_LEVEL_PERCENT,
  );
}

export function defenseCriticalChance(state: GameState): number {
  return Math.min(0.6, state.defenseSkills.criticalChance * 0.01);
}

export function defenseCriticalMultiplier(state: GameState): number {
  return 2 + state.defenseSkills.criticalMultiplier * 0.1;
}

export function defenseSuperCriticalChance(state: GameState): number {
  return Math.min(0.25, state.defenseSkills.superCriticalChance * 0.01);
}

export function defenseSuperCriticalMultiplier(state: GameState): number {
  return 3 + state.defenseSkills.superCriticalMultiplier * 0.25;
}

export function defenseLightningDamage(state: GameState): number {
  const baseDamage = DEFENSE_LIGHTNING_BASE_DAMAGE + state.defenseSkills.lightningDamage * DEFENSE_LIGHTNING_DAMAGE_PER_LEVEL;
  return roundDefenseDamage(baseDamage * defenseDamageMultiplier(state));
}

export function defenseLightningDamageUpgradeDelta(state: GameState): number {
  if (state.defenseSkills.lightningDamage >= defenseSkillMaxLevel('lightningDamage')) {
    return 0;
  }

  const nextState: GameState = {
    ...state,
    defenseSkills: {
      ...state.defenseSkills,
      lightningDamage: state.defenseSkills.lightningDamage + 1,
    },
  };

  return Math.max(0, Math.round((defenseLightningDamage(nextState) - defenseLightningDamage(state)) * 10) / 10);
}

export function defenseLightningAttackInterval(state: GameState): number {
  return Math.max(
    DEFENSE_LIGHTNING_MIN_INTERVAL,
    DEFENSE_LIGHTNING_BASE_INTERVAL - state.defenseSkills.lightningSpeed * 0.08,
  );
}

export function defenseLightningTargetCount(state: GameState): number {
  return state.defenseSkills.lightningCount;
}

export function defenseIceActive(state: GameState): boolean {
  return (
    state.defenseSkills.iceDamage > 0 ||
    state.defenseSkills.iceSpeed > 0 ||
    state.defenseSkills.iceRange > 0 ||
    state.defenseSkills.iceSlow > 0
  );
}

export function defenseIceDamage(state: GameState): number {
  if (!defenseIceActive(state)) {
    return 0;
  }

  const damageLevel = Math.max(1, state.defenseSkills.iceDamage);
  const baseDamage = DEFENSE_ICE_BASE_DAMAGE + (damageLevel - 1) * DEFENSE_ICE_DAMAGE_PER_LEVEL;
  return roundDefenseDamage(baseDamage * defenseDamageMultiplier(state));
}

export function defenseIceDamageUpgradeDelta(state: GameState): number {
  if (state.defenseSkills.iceDamage >= defenseSkillMaxLevel('iceDamage')) {
    return 0;
  }

  const nextState: GameState = {
    ...state,
    defenseSkills: {
      ...state.defenseSkills,
      iceDamage: state.defenseSkills.iceDamage + 1,
    },
  };

  return Math.max(0, Math.round((defenseIceDamage(nextState) - defenseIceDamage(state)) * 10) / 10);
}

function roundDefenseDamage(value: number): number {
  return Math.max(1, Math.round(value * 10) / 10);
}

export function defenseDamageMultiplier(state: GameState): number {
  return defenseSkillDamageMultiplier(state) * defenseLevelMultiplier(state);
}

export function defenseSkillDamageMultiplier(state: GameState): number {
  return 1 + state.defenseSkills.damageMultiplier * 0.1;
}

export function defenseIceAttackInterval(state: GameState): number {
  return Math.max(DEFENSE_ICE_MIN_INTERVAL, DEFENSE_ICE_BASE_INTERVAL - state.defenseSkills.iceSpeed * 0.05);
}

export function defenseIceRangePercent(state: GameState): number {
  if (!defenseIceActive(state)) {
    return 0;
  }

  const maxRangeLevel = defenseSkillMaxLevel('iceRange');
  const rangeLevel = Math.max(1, Math.min(maxRangeLevel, state.defenseSkills.iceRange));
  return Math.min(DEFENSE_ICE_MAX_RANGE_PERCENT, DEFENSE_ICE_BASE_RANGE_PERCENT + (rangeLevel - 1) * DEFENSE_ICE_RANGE_PER_LEVEL_PERCENT);
}

export function defenseIceRange(state: GameState): number {
  return defenseIceRangePercent(state);
}

export function defenseIceSlow(state: GameState): number {
  if (!defenseIceActive(state)) {
    return 0;
  }

  return Math.min(DEFENSE_ICE_MAX_SLOW, DEFENSE_ICE_BASE_SLOW + state.defenseSkills.iceSlow * 0.02);
}

export function defenseEnemyReward(state: GameState, kind: NonNullable<DefenseEnemy['kind']> = 'slime'): number {
  const baseReward =
    1 +
    Math.floor(state.books.defense.level * 0.25) +
    Math.floor((Math.max(1, state.defense.wave) - 1) / 8) +
    state.defenseSkills.moneyPerEnemy;
  const slimeReward = roundDefenseReward(baseReward * defenseGoldMultiplier(state) * defenseWaveGoldMultiplier(state) * defenseLevelMultiplier(state));
  return roundDefenseReward(slimeReward * defenseEnemyRewardKindMultiplier(kind));
}

function defenseEnemyRewardKindMultiplier(kind: NonNullable<DefenseEnemy['kind']>): number {
  if (kind === 'goblinKing') {
    return 3;
  }
  if (kind === 'skeletonMage' || kind === 'bat') {
    return 1.5;
  }
  return 1;
}

function roundDefenseReward(value: number): number {
  return Math.max(1, Math.round(value * 10) / 10);
}

export function defenseEnemyRewardUpgradeDelta(state: GameState): number {
  if (state.defenseSkills.moneyPerEnemy >= defenseSkillMaxLevel('moneyPerEnemy')) {
    return 0;
  }

  const nextState: GameState = {
    ...state,
    defenseSkills: {
      ...state.defenseSkills,
      moneyPerEnemy: state.defenseSkills.moneyPerEnemy + 1,
    },
  };

  return Math.max(0, Math.round((defenseEnemyReward(nextState) - defenseEnemyReward(state)) * 10) / 10);
}

export function defenseGoldMultiplier(state: GameState): number {
  return Math.min(10, 1 + (state.defenseSkills.goldMultiplier ?? 0) * 0.1);
}

export function defenseBaseSpeedMultiplier(state: GameState): number {
  if (!state.defense.baseSpeedEnabled) {
    return 1;
  }
  return Math.min(2, 1 + Math.max(0, state.defenseSkills.baseSpeed) * 0.1);
}

export function defenseEffectiveSpeedMultiplier(state: GameState): number {
  return state.defense.speedMultiplier * defenseBaseSpeedMultiplier(state);
}

export function defenseWaveGoldMultiplier(state: GameState): number {
  return Math.pow(2, defenseWaveGoldBoostCount(state));
}

export function defenseWaveGoldBoostCount(state: GameState): number {
  const wave = Math.max(1, Math.floor(state.defense.wave));
  const waveBoosts = Math.floor((wave - 1) / 10);
  const earnedBoosts = Math.floor(Math.max(0, state.defense.lastGoldBoostWave) / 10);
  return Math.min(10, Math.max(waveBoosts, earnedBoosts));
}

export function defenseExperienceGain(
  _state: GameState,
  kind: NonNullable<DefenseEnemy['kind']> = 'slime',
): number {
  const baseExperience = kind === 'goblinKing' ? 10 : 1;
  return baseExperience;
}

export function defenseTowerHitDamage(
  state: GameState,
  enemy: Pick<DefenseEnemy, 'distance'>,
  roll: () => number = Math.random,
): number {
  return defenseTowerHitResult(state, enemy, roll).amount;
}

export function defenseTowerHitResult(
  state: GameState,
  _enemy: Pick<DefenseEnemy, 'distance'>,
  roll: () => number = Math.random,
): { amount: number; kind: DefenseDamagePopupKind } {
  return defenseDamageHitResult(state, defenseTowerDamage(state), roll);
}

export function defenseDamageHitResult(
  state: GameState,
  rawDamage: number,
  roll: () => number = Math.random,
): { amount: number; kind: DefenseDamagePopupKind } {
  const superChance = defenseSuperCriticalChance(state);
  if (superChance > 0 && roll() < superChance) {
    return {
      amount: roundDefenseDamage(rawDamage * defenseCriticalMultiplier(state) * defenseSuperCriticalMultiplier(state)),
      kind: 'superCritical',
    };
  }

  const criticalChance = defenseCriticalChance(state);
  if (criticalChance > 0 && roll() < criticalChance) {
    return {
      amount: roundDefenseDamage(rawDamage * defenseCriticalMultiplier(state)),
      kind: 'critical',
    };
  }

  return {
    amount: rawDamage,
    kind: 'normal',
  };
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

function buyDefenseSkill(state: GameState, skillId: DefenseSkillId): void {
  if (defenseSkillLocked(state, skillId)) {
    return;
  }

  const maxLevel = defenseSkillMaxLevel(skillId);
  if (state.defenseSkills[skillId] >= maxLevel) {
    return;
  }

  const cost = defenseSkillCost(state, skillId);
  if (state.resources.sigils < cost) {
    return;
  }

  const previousMaxHealth = defenseMaxTowerHealth(state);
  state.resources.sigils -= cost;
  state.defenseSkills[skillId] += 1;
  if (skillId === 'health') {
    state.defense.towerHealth += defenseMaxTowerHealth(state) - previousMaxHealth;
  }
  state.defense.tower.range = defenseTowerRange(state);
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
  const currentLevel = state.manaSkills[skillId] ?? 0;
  const maxLevel = manaSkillMaxLevel(skillId);
  if (maxLevel !== null && currentLevel >= maxLevel) {
    return;
  }

  const cost = manaSkillCost(state, skillId);
  if (state.mana < cost) {
    return;
  }

  state.mana -= cost;
  state.manaSkills[skillId] = currentLevel + 1;
}

function maxManaSkills(state: GameState): void {
  state.manaSkills.power = DEBUG_MANA_SKILL_MAX_LEVELS.power;
  state.manaSkills.clickMultiplier = DEBUG_MANA_SKILL_MAX_LEVELS.clickMultiplier;
  state.manaSkills.research = DEBUG_MANA_SKILL_MAX_LEVELS.research;
  state.manaSkills.clickResearch = DEBUG_MANA_SKILL_MAX_LEVELS.clickResearch;
  state.manaSkills.autoClicker = DEBUG_MANA_SKILL_MAX_LEVELS.autoClicker;
  state.manaSkills.multiAutoClicker = DEBUG_MANA_SKILL_MAX_LEVELS.multiAutoClicker;
  state.manaSkills.xpOrbChance = DEBUG_MANA_SKILL_MAX_LEVELS.xpOrbChance;
  state.manaSkills.yellowOrbChance = DEBUG_MANA_SKILL_MAX_LEVELS.yellowOrbChance;
  state.manaSkills.greenOrbChance = DEBUG_MANA_SKILL_MAX_LEVELS.greenOrbChance;
  state.manaSkills.blueOrbChance = DEBUG_MANA_SKILL_MAX_LEVELS.blueOrbChance;
  state.manaSkills.xpValue = DEBUG_MANA_SKILL_MAX_LEVELS.xpValue;
  state.manaSkills.levelUpEffect = DEBUG_MANA_SKILL_MAX_LEVELS.levelUpEffect;
  state.manaSkills.holdClick = DEBUG_MANA_SKILL_MAX_LEVELS.holdClick;
  state.manaSkills.allyFindOrb = DEBUG_MANA_SKILL_MAX_LEVELS.allyFindOrb;
  state.manaSkills.meowKnight = DEBUG_MANA_SKILL_MAX_LEVELS.meowKnight;
  for (const skillId of MANA_IDLE_COMPANION_SKILL_IDS) {
    state.manaSkills[skillId] = DEBUG_MANA_SKILL_MAX_LEVELS[skillId];
  }
  for (const skillId of MANA_RESEARCH_SKILL_IDS) {
    state.manaSkills[skillId] = DEBUG_MANA_SKILL_MAX_LEVELS[skillId];
  }
  state.manaSkills.criticalHit = DEBUG_MANA_SKILL_MAX_LEVELS.criticalHit;
  state.manaSkills.criticalEffect = DEBUG_MANA_SKILL_MAX_LEVELS.criticalEffect;
  state.manaSkills.activeResearch = null;
  state.manaSkills.autoClickTimer = 0;
  state.manaSkills.lastAutoClickCount = 0;
  state.manaSkills.meowKnightTimer = 0;
  state.manaSkills.lastMeowKnightAttackCount = 0;
  state.manaSkills.idleCompanionTimers = {};
  state.manaSkills.idleCompanionAttackCounts = {};
  state.manaSkills.lastManaGainCritical = false;
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

function maxTargetSkills(state: GameState): void {
  state.targetSkills.spawnSpeed = DEBUG_TARGET_SKILL_MAX_LEVELS.spawnSpeed;
  state.targetSkills.targetCount = DEBUG_TARGET_SKILL_MAX_LEVELS.targetCount;
  state.targetSkills.damage = DEBUG_TARGET_SKILL_MAX_LEVELS.damage;
  state.targetSkills.automation = DEBUG_TARGET_SKILL_MAX_LEVELS.automation;
  state.targets.spawnTimer = 0;
  state.targets.automationTimer = 0;
}

function maxDefenseSkills(state: GameState): void {
  state.defenseSkills.damage = DEBUG_DEFENSE_SKILL_MAX_LEVELS.damage;
  state.defenseSkills.damageMultiplier = DEBUG_DEFENSE_SKILL_MAX_LEVELS.damageMultiplier;
  state.defenseSkills.attackSpeed = DEBUG_DEFENSE_SKILL_MAX_LEVELS.attackSpeed;
  state.defenseSkills.range = DEBUG_DEFENSE_SKILL_MAX_LEVELS.range;
  state.defenseSkills.criticalChance = DEBUG_DEFENSE_SKILL_MAX_LEVELS.criticalChance;
  state.defenseSkills.criticalMultiplier = DEBUG_DEFENSE_SKILL_MAX_LEVELS.criticalMultiplier;
  state.defenseSkills.superCriticalChance = DEBUG_DEFENSE_SKILL_MAX_LEVELS.superCriticalChance;
  state.defenseSkills.superCriticalMultiplier = DEBUG_DEFENSE_SKILL_MAX_LEVELS.superCriticalMultiplier;
  state.defenseSkills.lightningDamage = DEBUG_DEFENSE_SKILL_MAX_LEVELS.lightningDamage;
  state.defenseSkills.lightningSpeed = DEBUG_DEFENSE_SKILL_MAX_LEVELS.lightningSpeed;
  state.defenseSkills.lightningCount = DEBUG_DEFENSE_SKILL_MAX_LEVELS.lightningCount;
  state.defenseSkills.iceDamage = DEBUG_DEFENSE_SKILL_MAX_LEVELS.iceDamage;
  state.defenseSkills.iceSpeed = DEBUG_DEFENSE_SKILL_MAX_LEVELS.iceSpeed;
  state.defenseSkills.iceRange = DEBUG_DEFENSE_SKILL_MAX_LEVELS.iceRange;
  state.defenseSkills.iceSlow = DEBUG_DEFENSE_SKILL_MAX_LEVELS.iceSlow;
  state.defenseSkills.health = DEBUG_DEFENSE_SKILL_MAX_LEVELS.health;
  state.defenseSkills.healthRegen = DEBUG_DEFENSE_SKILL_MAX_LEVELS.healthRegen;
  state.defenseSkills.moneyPerEnemy = DEBUG_DEFENSE_SKILL_MAX_LEVELS.moneyPerEnemy;
  state.defenseSkills.goldMultiplier = DEBUG_DEFENSE_SKILL_MAX_LEVELS.goldMultiplier;
  state.defenseSkills.baseSpeed = DEBUG_DEFENSE_SKILL_MAX_LEVELS.baseSpeed;
  state.defense.tower.range = defenseTowerRange(state);
  state.defense.towerHealth = defenseMaxTowerHealth(state);
}

function maxBlackjackSkills(state: GameState): void {
  ensureBlackjackUpgradeCells(state);
  for (const cellId of BLACKJACK_UPGRADE_CELL_IDS) {
    state.blackjack.upgradeCells[cellId] = blackjackUpgradeCellMaxLevel(cellId);
  }
  for (const cellId of BLACKJACK_UPGRADE_CELL_IDS) {
    applyBlackjackUpgradeCellSideEffects(state, cellId);
  }
  state.blackjack.actions.unlocked = true;
  state.blackjack.actions.level = blackjackActionMaxLevel();
  state.blackjack.actions.lastOutcome = `Niveau ${state.blackjack.actions.level}`;
  state.blackjack.pair.unlocked = true;
  state.blackjack.pair.level = blackjackBonusMaxLevel();
  state.blackjack.pair.autoEnabled = true;
  state.blackjack.pair.lastOutcome = 'Pret';
  state.blackjack.twentyOneThree.unlocked = true;
  state.blackjack.twentyOneThree.level = blackjackBonusMaxLevel();
  state.blackjack.twentyOneThree.autoEnabled = true;
  state.blackjack.twentyOneThree.lastOutcome = 'Pret';
  state.blackjack.baseBetLevel = blackjackUpgradeCellMaxLevel('wagerBase');
}

function maxAllSkills(state: GameState): void {
  maxManaSkills(state);
  maxSnakeSkills(state);
  maxTargetSkills(state);
  maxDefenseSkills(state);
  maxMiningSkills(state);
  maxBlackjackSkills(state);
}

function resizeSnakeGrid(state: GameState): void {
  state.snake.gridSize = snakeGridSize(state);
  resetSnakeRun(state);
}

function resetManaSkills(state: GameState): void {
  state.manaSkills.power = 0;
  state.manaSkills.clickMultiplier = 0;
  state.manaSkills.research = 0;
  state.manaSkills.clickResearch = 0;
  state.manaSkills.autoClicker = 0;
  state.manaSkills.multiAutoClicker = 0;
  state.manaSkills.xpOrbChance = 0;
  state.manaSkills.yellowOrbChance = 0;
  state.manaSkills.greenOrbChance = 0;
  state.manaSkills.blueOrbChance = 0;
  state.manaSkills.xpValue = 0;
  state.manaSkills.levelUpEffect = 0;
  state.manaSkills.holdClick = 0;
  state.manaSkills.allyFindOrb = 0;
  state.manaSkills.meowKnight = 0;
  for (const skillId of MANA_IDLE_COMPANION_SKILL_IDS) {
    state.manaSkills[skillId] = 0;
  }
  for (const skillId of MANA_RESEARCH_SKILL_IDS) {
    state.manaSkills[skillId] = 0;
  }
  state.manaSkills.criticalHit = 0;
  state.manaSkills.criticalEffect = 0;
  state.manaSkills.activeResearch = null;
  state.manaSkills.autoClickTimer = 0;
  state.manaSkills.lastAutoClickCount = 0;
  state.manaSkills.meowKnightTimer = 0;
  state.manaSkills.lastMeowKnightAttackCount = 0;
  state.manaSkills.idleCompanionTimers = {};
  state.manaSkills.idleCompanionAttackCounts = {};
  state.manaSkills.lastManaGainCritical = false;
  state.manaCrystal.xp = 0;
  state.manaCrystal.harvestedMana = 0;
  state.manaCrystal.xpOrb = null;
  state.manaCrystal.lastCollectedXpOrb = null;
  state.manaCrystal.nextXpOrbId = 1;
  state.manaCrystal.lastXpGain = 0;
  state.manaCrystal.lastXpOrbSpawned = false;
  state.manaCrystal.holdClickActive = false;
  state.manaCrystal.holdClickTimer = 0;
}

function resetAllSkills(state: GameState): void {
  resetManaSkills(state);

  state.snakeSkills.speed = 0;
  state.snakeSkills.gridSize = 0;
  state.snakeSkills.automation = 0;
  state.snakeSkills.automationEnabled = false;
  state.snakeSkills.baseMultiplier = 0;
  state.snakeSkills.bonusFruit = 0;
  state.snakeSkills.extraLife = 0;
  state.snakeSkills.edgeWrap = 0;
  state.snake.gridSize = 8;
  state.snake.body = createStartingSnakeBody(state.snake.gridSize);
  state.snake.food = randomSnakeFood(state.snake.body, state.snake.gridSize);
  state.snake.bonusFood = null;
  state.snake.moveTimer = 0;

  state.targetSkills.spawnSpeed = 0;
  state.targetSkills.targetCount = 0;
  state.targetSkills.damage = 0;
  state.targetSkills.automation = 0;
  state.targets.spawnTimer = 0;
  state.targets.automationTimer = 0;

  state.defenseSkills.damage = 0;
  state.defenseSkills.damageMultiplier = 0;
  state.defenseSkills.attackSpeed = 0;
  state.defenseSkills.range = 0;
  state.defenseSkills.criticalChance = 0;
  state.defenseSkills.criticalMultiplier = 0;
  state.defenseSkills.superCriticalChance = 0;
  state.defenseSkills.superCriticalMultiplier = 0;
  state.defenseSkills.lightningDamage = 0;
  state.defenseSkills.lightningSpeed = 0;
  state.defenseSkills.lightningCount = 0;
  state.defenseSkills.iceDamage = 0;
  state.defenseSkills.iceSpeed = 0;
  state.defenseSkills.iceRange = 0;
  state.defenseSkills.iceSlow = 0;
  state.defenseSkills.health = 0;
  state.defenseSkills.healthRegen = 0;
  state.defenseSkills.moneyPerEnemy = 0;
  state.defenseSkills.goldMultiplier = 0;
  state.defenseSkills.baseSpeed = 0;
  state.defense.baseSpeedEnabled = true;
  state.defense.level = 0;
  state.defense.xp = 0;
  state.defense.lastXpGain = 0;
  state.defense.tower.range = defenseTowerRange(state);
  state.defense.towerHealth = defenseMaxTowerHealth(state);

  state.miningSkills.pickaxeForce = 0;
  state.miningSkills.splashDamage = 0;
  state.miningSkills.automation = 0;
  state.miningSkills.automationTimer = 0;
  state.miningSkills.autoDigCount = 0;

  state.blackjack.actions.unlocked = false;
  state.blackjack.actions.level = 0;
  state.blackjack.actions.autoEnabled = false;
  state.blackjack.actions.xp = 0;
  state.blackjack.pair.unlocked = false;
  state.blackjack.pair.level = 0;
  state.blackjack.pair.autoEnabled = false;
  state.blackjack.pair.xp = 0;
  state.blackjack.twentyOneThree.unlocked = false;
  state.blackjack.twentyOneThree.level = 0;
  state.blackjack.twentyOneThree.autoEnabled = false;
  state.blackjack.twentyOneThree.xp = 0;
  state.blackjack.baseBetLevel = 1;
  for (const cellId of BLACKJACK_UPGRADE_CELL_IDS) {
    state.blackjack.upgradeCells[cellId] = 1;
  }
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
  if (bookUsesGenericAutomation(bookId) && book.level >= 2) {
    book.automation = Math.max(book.automation, 0.35);
  }
  if (bookUsesGenericAutomation(bookId) && book.level >= 4) {
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
  delete state.forbiddenGrimoire.offeringsByBook[bookId];
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
    saveCurrentForbiddenOfferings(state);
    state.forbiddenGrimoire.selectedBookId = null;
    state.forbiddenGrimoire.offerings = emptyForbiddenOfferings();
    state.forbiddenGrimoire.lastOffered = {};
    return;
  }

  if (state.forbiddenGrimoire.selectedBookId === bookId) {
    return;
  }

  saveCurrentForbiddenOfferings(state);
  state.forbiddenGrimoire.selectedBookId = bookId;
  state.forbiddenGrimoire.offerings = cloneForbiddenOfferings(state.forbiddenGrimoire.offeringsByBook[bookId] ?? emptyForbiddenOfferings());
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
    saveCurrentForbiddenOfferings(state);
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
  delete state.forbiddenGrimoire.offeringsByBook[seal.unlocksBookId];
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

function saveCurrentForbiddenOfferings(state: GameState): void {
  const bookId = state.forbiddenGrimoire.selectedBookId;
  if (!bookId) {
    return;
  }
  state.forbiddenGrimoire.offeringsByBook[bookId] = cloneForbiddenOfferings(state.forbiddenGrimoire.offerings);
}

function cloneForbiddenOfferings(offerings: Record<ForbiddenOfferingResourceId, number>): Record<ForbiddenOfferingResourceId, number> {
  return { ...offerings };
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
  const nextSlot = BOOK_PANEL_OPEN_SLOTS.find((slot) => !usedSlots.has(slot)) ?? BOOK_PANEL_OPEN_SLOTS[0];
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

function resetSelectedMiniGame(state: GameState): void {
  const bookId = state.selectedBook;
  if (!state.books[bookId]?.unlocked) {
    return;
  }

  switch (bookId) {
    case 'mana':
      resetManaRun(state);
      return;
    case 'serpent':
      resetSnakeRun(state);
      return;
    case 'typing':
      resetRuneTypingRun(state);
      return;
    case 'herbarium':
      return;
    case 'defense':
      resetDefenseRun(state);
      return;
    case 'blackjack':
      resetBlackjackRun(state);
      return;
    case 'hundred':
      resetHundredRun(state);
      return;
    case 'mine':
      resetMiningRun(state);
      return;
    case 'targets':
      resetTargetRun(state);
      return;
    case 'slimeTrainer':
      resetSlimeTrainerRun(state);
      return;
  }
}

function resetManaRun(state: GameState): void {
  state.books.mana.charge = 0;
  state.manaSkills.lastManaGainCritical = false;
}

function resetRuneTypingRun(state: GameState): void {
  const typing = state.runeTyping;
  typing.wordIndex = 0;
  typing.typed = '';
  typing.completedWords = 0;
  typing.combo = 0;
  typing.penaltyWordsRemaining = 0;
  typing.currentWordHadMistake = false;
  typing.lastReward = 0;
  typing.lastCompletedWord = null;
  typing.lastFeedback = 'idle';
}

function resetBlackjackRun(state: GameState): void {
  const blackjack = state.blackjack;
  const reserved = Math.max(0, Math.floor(blackjack.playerBet + blackjack.splitBet));
  if (reserved > 0) {
    state.resources.chips += reserved;
  }

  blackjack.deck = [];
  blackjack.playerHand = [];
  blackjack.splitHand = null;
  blackjack.dealerHand = [];
  blackjack.phase = 'idle';
  blackjack.activeHand = 'primary';
  blackjack.playerBet = 0;
  blackjack.splitBet = 0;
  blackjack.playerHandDone = false;
  blackjack.splitHandDone = false;
  blackjack.playerHandDoubled = false;
  blackjack.splitHandDoubled = false;
  blackjack.dealerCardRevealed = false;
  blackjack.lastReward = 0;
  blackjack.lastOutcome = 'En attente';
  blackjack.lastDebtPayment = 0;
  resetBlackjackBonusHand(state, 'pair');
  resetBlackjackBonusHand(state, 'twentyOneThree');
}

function resetHundredRun(state: GameState): void {
  const hundred = state.hundred;
  hundred.total = 0;
  hundred.attempts = 0;
  hundred.lastRoll = 0;
  hundred.lastOption = null;
  hundred.lastReward = 0;
  hundred.lastOutcome = 'idle';
}

function resetTargetRun(state: GameState): void {
  const targets = state.targets;
  targets.running = false;
  targets.score = 0;
  targets.spawnTimer = 0;
  targets.automationTimer = 0;
  targets.nextTargetId = 1;
  targets.lastReward = 0;
  targets.shotPulse = 0;
  targets.targets = [];
}

function resetMiningRun(state: GameState): void {
  state.mining.terrainCycle = 1;
  state.mining.blocks = createInitialMiningBlocks(state.mining.terrainCycle);
  state.mining.totalMined = 0;
  state.mining.deepestLayer = 1;
  state.mining.lastReward = 0;
  state.mining.lastBrokenDepth = 0;
  state.mining.hitPulse = 0;
  state.miningSkills.automationTimer = 0;
  state.miningSkills.autoDigCount = 0;
}

function resetSlimeTrainerRun(state: GameState): void {
  const trainer = state.slimeTrainer;
  trainer.turn = 'player';
  trainer.enemyTurnTimer = 0;
  trainer.slimeMaxHealth = slimeTrainerMaxHealth(trainer.level);
  trainer.slimeHealth = trainer.slimeMaxHealth;
  trainer.enemy = slimeTrainerEnemyForVictoryCount(trainer.victories, trainer.level);
  trainer.lastCommand = null;
  trainer.lastDamage = 0;
  trainer.lastEnemyDamage = 0;
  trainer.lastXp = 0;
  trainer.lastReward = 0;
  trainer.lastOutcome = 'idle';
  trainer.hitPulse = 0;
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
  const ateFood = snake.food ? cellsMatch(nextHead, snake.food) : false;
  const ateBonusFood = snake.bonusFood ? cellsMatch(nextHead, snake.bonusFood.cell) : false;
  snake.body = [nextHead, ...snake.body];

  if (ateFood || ateBonusFood) {
    const book = state.books.serpent;
    const bonusFood = ateBonusFood ? snake.bonusFood : null;
    const bonusKind = bonusFood ? snakeBonusFoodKind(bonusFood.type) : null;
    const givesScoreReward = ateFood || bonusKind === 'score';

    if (bonusFood && bonusKind === 'multiplier') {
      snake.comboSteps += snakeBonusFoodComboSteps(bonusFood.type);
      snake.lastReward = 0;
    } else {
      snake.comboSteps += 1;
    }

    if (givesScoreReward) {
      const rewardMultiplier = snakeBaseMultiplier(state) * snakeComboMultiplier(state);
      const reward = Math.max(1, Math.round((1 + Math.floor(book.level * 0.4)) * rewardMultiplier));
      snake.score += reward;
      snake.best = Math.max(snake.best, snake.score);
      snake.lastReward = reward;
      state.resources.scales += reward;
      state.mana += 1 + book.level * 0.25;
    }

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
  const cell = randomSnakeFood(excludedSnakeFoodCells(state), state.snake.gridSize);
  if (!cell) {
    return null;
  }
  return {
    type,
    cell,
  };
}

function snakeBonusFruitType(state: GameState): SnakeBonusFruitType | null {
  const unlockedTypes: SnakeBonusFruitType[] = [];
  if (state.snakeSkills.bonusFruit >= 1) {
    unlockedTypes.push('round-blue');
  }
  if (state.snakeSkills.bonusFruit >= 2) {
    unlockedTypes.push('round-green');
  }
  if (state.snakeSkills.bonusFruit >= 3) {
    unlockedTypes.push('round-pink');
  }
  if (state.snakeSkills.bonusFruit >= 4) {
    unlockedTypes.push('diamond-red');
  }
  if (state.snakeSkills.bonusFruit >= 5) {
    unlockedTypes.push('diamond-blue');
  }
  if (state.snakeSkills.bonusFruit >= 6) {
    unlockedTypes.push('diamond-green');
  }
  if (state.snakeSkills.bonusFruit >= 7) {
    unlockedTypes.push('diamond-pink');
  }
  return unlockedTypes.length > 0 ? unlockedTypes[Math.floor(Math.random() * unlockedTypes.length)] : null;
}

function excludedSnakeFoodCells(state: GameState): SnakeCell[] {
  const excluded = [...state.snake.body];
  if (state.snake.food) {
    excluded.push(state.snake.food);
  }
  if (state.snake.bonusFood) {
    excluded.push(state.snake.bonusFood.cell);
  }
  return excluded;
}

function automatedSnakeDirection(state: GameState): SnakeDirection | null {
  const snake = state.snake;
  const head = snake.body[0];
  const target = snake.bonusFood?.cell ?? snake.food;
  if (!target) {
    return null;
  }
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
  const wave = Math.max(1, state.defense.wave);
  const waveCount = wave <= 3 ? wave : Math.min(18, Math.floor(4 + wave / 4));
  return waveCount + Math.floor(state.books.defense.level / 6);
}

export function defenseSlimeMaxHealthForWave(rawWave: number): number {
  const wave = Math.max(1, Math.floor(rawWave));
  return Math.max(5, Math.round(5 * Math.pow(1.048, wave - 1) + (wave - 1) * 0.55));
}

export function defenseEnemyMaxHealthForWave(rawWave: number, kind: NonNullable<DefenseEnemy['kind']>): number {
  const slimeMaxHealth = defenseSlimeMaxHealthForWave(rawWave);
  switch (kind) {
    case 'skeletonMage':
      return Math.max(1, Math.round(slimeMaxHealth * DEFENSE_SKELETON_MAGE_HEALTH_RATIO));
    case 'bat':
      return Math.max(1, Math.round(slimeMaxHealth * DEFENSE_BAT_HEALTH_RATIO));
    case 'goblinKing':
      return Math.max(1, Math.round(slimeMaxHealth * DEFENSE_GOBLIN_KING_HEALTH_RATIO));
    case 'slime':
      return slimeMaxHealth;
  }
}

export function defenseRollbackWave(rawWave: number): number {
  const wave = Math.max(1, Math.min(100, Math.floor(rawWave)));
  return Math.max(1, Math.floor((wave - 1) / 10) * 10 + 1);
}

export function defenseTowerDamage(state: GameState): number {
  return roundDefenseDamage((1 + state.defenseSkills.damage) * defenseDamageMultiplier(state));
}

export function defenseTowerDamageUpgradeDelta(state: GameState): number {
  if (state.defenseSkills.damage >= defenseSkillMaxLevel('damage')) {
    return 0;
  }

  const nextState: GameState = {
    ...state,
    defenseSkills: {
      ...state.defenseSkills,
      damage: state.defenseSkills.damage + 1,
    },
  };

  return Math.max(0, Math.round((defenseTowerDamage(nextState) - defenseTowerDamage(state)) * 10) / 10);
}

export function defenseTowerAttackInterval(state: GameState): number {
  return Math.max(0.25, 1.5 - state.defenseSkills.attackSpeed * 0.05);
}

export function defenseWaveProgress(state: GameState): number {
  return Math.min(1, state.defense.killsThisWave / defenseWaveEnemyCount(state));
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
  defense.wave = Math.max(1, Math.min(DEFENSE_FINAL_WAVE, Math.floor(defense.wave)));

  if (!book.unlocked || !isBookPanelOpen(state, 'defense')) {
    defense.running = false;
    return;
  }

  if (defense.deathTimer > 0) {
    tickDefenseDeathSequence(state, deltaSeconds);
    return;
  }

  if (defense.towerHealth <= 0) {
    startDefenseDeathSequence(state);
    return;
  }

  if (defense.paused) {
    defense.running = false;
    defense.tower.range = defenseTowerRange(state);
    return;
  }

  defense.running = true;
  const scaledDeltaSeconds = deltaSeconds * defenseEffectiveSpeedMultiplier(state);
  defense.tower.range = defenseTowerRange(state);
  defense.towerHealth = Math.min(
    defenseMaxTowerHealth(state),
    defense.towerHealth + defenseTowerHealthRegenPerSecond(state) * scaledDeltaSeconds,
  );
  defense.tower.cooldown = Math.max(0, defense.tower.cooldown - scaledDeltaSeconds);
  defense.lightningCooldown = Math.max(0, defense.lightningCooldown - scaledDeltaSeconds);
  defense.lightningBurstCooldown = Math.max(0, defense.lightningBurstCooldown - scaledDeltaSeconds);
  defense.iceCooldown = Math.max(0, defense.iceCooldown - scaledDeltaSeconds);
  tickDefenseShot(state, deltaSeconds);
  tickDefenseLightningStrikes(state, deltaSeconds);
  tickDefenseEnemyProjectiles(state, scaledDeltaSeconds);
  if (defense.towerHealth <= 0) {
    startDefenseDeathSequence(state);
    return;
  }
  tickDefenseDamagePopups(state, deltaSeconds);
  tickDefenseMoneyPopups(state, deltaSeconds);
  spawnDefenseEnemies(state, scaledDeltaSeconds);
  fireDefenseLightning(state);
  fireDefenseIceAura(state);
  fireDefenseTower(state);
  moveDefenseEnemies(state, scaledDeltaSeconds);
  completeDefenseWaveIfReady(state);
}

function spawnDefenseEnemies(state: GameState, deltaSeconds: number): void {
  const defense = state.defense;
  const enemyCount = defenseWaveEnemyCount(state);
  if (defense.spawnedThisWave >= enemyCount) {
    return;
  }

  defense.spawnTimer += deltaSeconds;
  if (defense.nextSpawnDelay <= 0) {
    defense.nextSpawnDelay = randomDefenseSpawnDelay(enemyCount);
  }
  if (defense.spawnTimer < defense.nextSpawnDelay) {
    return;
  }

  defense.spawnTimer = 0;
  const groupSize = Math.min(defenseSpawnGroupSize(enemyCount), enemyCount - defense.spawnedThisWave);
  for (let index = 0; index < groupSize; index += 1) {
    spawnDefenseEnemy(state);
  }
  defense.nextSpawnDelay = defense.spawnedThisWave >= enemyCount ? 0 : randomDefenseSpawnDelay(enemyCount);
}

function randomDefenseSpawnDelay(enemyCount: number): number {
  const minDelay = 0.1;
  const maxDelay = Math.max(minDelay, 1 - Math.max(0, enemyCount - 1) * 0.06);
  return minDelay + Math.random() * (maxDelay - minDelay);
}

function defenseSpawnGroupSize(enemyCount: number): number {
  return Math.max(1, Math.floor(Math.max(0, enemyCount) / 6) + 1);
}

function spawnDefenseEnemy(state: GameState): void {
  const defense = state.defense;
  defense.spawnedThisWave += 1;
  const lane = randomDefenseTreeSpawnLane();
  const kind = defenseEnemyKindForSpawn(defense.wave, defense.spawnedThisWave);
  const maxHealth = defenseEnemyMaxHealthForWave(defense.wave, kind);
  defense.enemies.push({
    id: defense.nextEnemyId,
    kind,
    lane,
    distance: DEFENSE_ENEMY_SPAWN_DISTANCE,
    health: maxHealth,
    maxHealth,
    state: 'walking',
    deathTimer: 0,
    attackCooldown: kind === 'skeletonMage' ? 0 : undefined,
  });
  defense.nextEnemyId += 1;
}

function defenseEnemyKindForSpawn(wave: number, spawnedThisWave: number): NonNullable<DefenseEnemy['kind']> {
  if (wave < 2) {
    return 'slime';
  }
  if (wave >= 5 && spawnedThisWave % 5 === 0) {
    return 'goblinKing';
  }
  if (spawnedThisWave % 4 === 0) {
    return 'bat';
  }
  if (spawnedThisWave % 3 === 0) {
    return 'skeletonMage';
  }
  return 'slime';
}

function moveDefenseEnemies(state: GameState, deltaSeconds: number): void {
  const defense = state.defense;
  const speed = 0.105 + Math.min(0.06, defense.wave * 0.006);
  const survivors: DefenseEnemy[] = [];

  for (const enemy of defense.enemies) {
    if (enemy.state === 'dying') {
      const deathTimer = enemy.deathTimer - deltaSeconds;
      if (deathTimer > 0) {
        survivors.push({ ...enemy, deathTimer });
      }
      continue;
    }

    const enemyKind = enemy.kind ?? 'slime';
    const movementScale = defenseEnemyIceSpeedMultiplier(state, enemy);
    if (enemyKind === 'skeletonMage') {
      survivors.push(moveDefenseSkeletonMage(state, enemy, speed * movementScale, deltaSeconds));
      continue;
    }

    if (enemyKind === 'bat') {
      survivors.push(moveDefenseBat(state, enemy, speed * movementScale, deltaSeconds));
      continue;
    }

    if (enemyKind === 'goblinKing') {
      survivors.push(moveDefenseGoblinKing(state, enemy, speed * movementScale, deltaSeconds));
      continue;
    }

    const nextDistance = defenseEnemyInTowerHitbox(enemy) ? enemy.distance : enemy.distance - speed * movementScale * deltaSeconds;
    if (defenseEnemyInTowerHitbox({ ...enemy, distance: nextDistance })) {
      survivors.push(updateDefenseTowerContactEnemy(state, enemy, nextDistance, deltaSeconds, DEFENSE_SLIME_ATTACK_ANIMATION_DURATION));
      continue;
    }
    survivors.push({ ...enemy, distance: nextDistance });
  }

  defense.enemies = survivors;
  if (defense.towerHealth <= 0) {
    startDefenseDeathSequence(state);
  }
}

function moveDefenseBat(
  state: GameState,
  enemy: DefenseEnemy,
  slimeSpeed: number,
  deltaSeconds: number,
): DefenseEnemy {
  const nextDistance = defenseEnemyInTowerHitbox(enemy)
    ? enemy.distance
    : enemy.distance - slimeSpeed * DEFENSE_BAT_SPEED_MULTIPLIER * deltaSeconds;
  if (defenseEnemyInTowerHitbox({ ...enemy, distance: nextDistance })) {
    return updateDefenseTowerContactEnemy(state, enemy, nextDistance, deltaSeconds, DEFENSE_BAT_ATTACK_ANIMATION_DURATION);
  }

  return { ...enemy, distance: nextDistance, state: 'walking' };
}

function moveDefenseGoblinKing(
  state: GameState,
  enemy: DefenseEnemy,
  slimeSpeed: number,
  deltaSeconds: number,
): DefenseEnemy {
  const nextDistance = defenseEnemyInTowerHitbox(enemy)
    ? enemy.distance
    : enemy.distance - slimeSpeed * DEFENSE_GOBLIN_KING_SPEED_MULTIPLIER * deltaSeconds;
  if (defenseEnemyInTowerHitbox({ ...enemy, distance: nextDistance })) {
    return updateDefenseTowerContactEnemy(
      state,
      enemy,
      nextDistance,
      deltaSeconds,
      DEFENSE_GOBLIN_KING_ATTACK_ANIMATION_DURATION,
    );
  }

  return { ...enemy, distance: nextDistance, state: 'walking' };
}

function updateDefenseTowerContactEnemy(
  state: GameState,
  enemy: DefenseEnemy,
  distance: number,
  deltaSeconds: number,
  attackAnimationDuration: number,
): DefenseEnemy {
  let attackCooldown = Math.max(0, (enemy.attackCooldown ?? 0) - deltaSeconds);
  let attackAnimationTimer = Math.max(0, (enemy.attackAnimationTimer ?? 0) - deltaSeconds);

  if (attackCooldown <= 0.001) {
    damageDefenseTower(state);
    attackCooldown = DEFENSE_ENEMY_TOWER_ATTACK_INTERVAL;
    attackAnimationTimer = attackAnimationDuration;
  }

  return {
    ...enemy,
    distance,
    state: attackAnimationTimer > 0 ? 'attacking' : 'idle',
    attackCooldown,
    attackAnimationTimer,
    attackDamageDelay: undefined,
  };
}

function moveDefenseSkeletonMage(
  state: GameState,
  enemy: DefenseEnemy,
  speed: number,
  deltaSeconds: number,
): DefenseEnemy {
  const attackDistance = defenseEnemyPathDistanceForCenterRange(enemy, DEFENSE_SKELETON_MAGE_ATTACK_RANGE);
  const nextDistance =
    defenseEnemyDistanceFromCenter(enemy) > DEFENSE_SKELETON_MAGE_ATTACK_RANGE
      ? Math.max(attackDistance, enemy.distance - speed * 0.82 * deltaSeconds)
      : attackDistance;

  if (defenseEnemyDistanceFromCenter({ ...enemy, distance: nextDistance }) > DEFENSE_SKELETON_MAGE_ATTACK_RANGE + 0.0001) {
    return {
      ...enemy,
      distance: nextDistance,
      state: 'walking',
      attackAnimationTimer: Math.max(0, (enemy.attackAnimationTimer ?? 0) - deltaSeconds),
    };
  }

  let attackCooldown = (enemy.attackCooldown ?? 0) - deltaSeconds;
  let attackAnimationTimer = Math.max(0, (enemy.attackAnimationTimer ?? 0) - deltaSeconds);
  let attackProjectileDelay =
    enemy.attackProjectileDelay === undefined ? undefined : enemy.attackProjectileDelay - deltaSeconds;

  if (attackProjectileDelay !== undefined && attackProjectileDelay <= 0) {
    pushDefenseEnemyProjectile(state, enemy);
    attackProjectileDelay = undefined;
  }

  if (attackCooldown <= 0.001 && attackProjectileDelay === undefined) {
    attackCooldown = DEFENSE_SKELETON_MAGE_ATTACK_INTERVAL;
    attackAnimationTimer = DEFENSE_SKELETON_MAGE_ATTACK_ANIMATION_DURATION;
    attackProjectileDelay = DEFENSE_SKELETON_MAGE_FIREBALL_DELAY;
  }

  return {
    ...enemy,
    distance: nextDistance,
    state: attackAnimationTimer > 0 ? 'attacking' : 'idle',
    attackCooldown,
    attackAnimationTimer,
    attackProjectileDelay,
  };
}

function defenseShotDuration(target: Pick<DefenseEnemy, 'lane' | 'distance'> & Pick<Partial<DefenseEnemy>, 'kind'>): number {
  const position = defenseEnemyImpactPoint(target);
  const mapDistance = Math.hypot(position.x - 50, position.y - 50);
  return Math.max(
    DEFENSE_SHOT_MIN_DURATION,
    Math.min(DEFENSE_SHOT_MAX_DURATION, mapDistance * DEFENSE_SHOT_SECONDS_PER_MAP_PERCENT),
  );
}

function pushDefenseShot(
  state: GameState,
  target: Pick<DefenseEnemy, 'lane' | 'distance'> & Pick<Partial<DefenseEnemy>, 'kind'>,
): void {
  const defense = state.defense;
  const shotDuration = defenseShotDuration(target);
  defense.shotPulse += 1;
  defense.shots.push({
    id: defense.shotPulse,
    lane: target.lane,
    distance: target.distance,
    targetKind: target.kind,
    timer: shotDuration,
    duration: shotDuration,
  });

  if (defense.shots.length > 16) {
    defense.shots.splice(0, defense.shots.length - 16);
  }
}

function pushDefenseEnemyProjectile(state: GameState, source: Pick<DefenseEnemy, 'lane' | 'distance'>): void {
  const defense = state.defense;
  defense.enemyProjectiles.push({
    id: defense.nextEnemyProjectileId,
    lane: source.lane,
    distance: source.distance,
    timer: DEFENSE_SKELETON_MAGE_FIREBALL_DURATION,
    duration: DEFENSE_SKELETON_MAGE_FIREBALL_DURATION,
  });
  defense.nextEnemyProjectileId += 1;

  if (defense.enemyProjectiles.length > 12) {
    defense.enemyProjectiles.splice(0, defense.enemyProjectiles.length - 12);
  }
}

function damageDefenseTower(state: GameState): void {
  const damage = defenseEnemyTowerDamage(state);
  state.defense.towerHealth = Math.max(0, state.defense.towerHealth - damage);
  state.defense.score = 0;
}

function fireDefenseLightning(state: GameState): void {
  const defense = state.defense;
  const strikeCount = defenseLightningTargetCount(state);
  if (strikeCount <= 0) {
    defense.lightningCooldown = 0;
    defense.lightningBurstCharges = 0;
    defense.lightningBurstCooldown = 0;
    defense.lightningBurstTargetIds = [];
    return;
  }

  const wasBursting = defense.lightningBurstCharges > 0;
  if (defense.lightningBurstCharges <= 0) {
    if (defense.lightningCooldown > 0) {
      return;
    }
    defense.lightningBurstCharges = strikeCount;
    defense.lightningBurstCooldown = 0;
    defense.lightningBurstTargetIds = [];
  }

  if (defense.lightningBurstCooldown > 0) {
    return;
  }

  const excludedTargetIds = wasBursting ? new Set(defense.lightningBurstTargetIds) : undefined;
  const [target] = randomDefenseLightningTargets(defense.enemies, 1, excludedTargetIds);
  if (!target) {
    defense.lightningBurstCharges = 0;
    defense.lightningBurstCooldown = 0;
    defense.lightningBurstTargetIds = [];
    if (wasBursting) {
      defense.lightningCooldown = defenseLightningAttackInterval(state);
    }
    return;
  }

  applyDefenseLightningHit(state, target);
  pushDefenseLightningStrike(state, target);
  defense.lightningBurstTargetIds.push(target.id);
  collectDefenseEnemyIfDefeated(state, target);

  defense.lightningBurstCharges = Math.max(0, defense.lightningBurstCharges - 1);
  if (defense.lightningBurstCharges > 0) {
    defense.lightningBurstCooldown = DEFENSE_LIGHTNING_BURST_INTERVAL;
    return;
  }

  defense.lightningCooldown = defenseLightningAttackInterval(state);
  defense.lightningBurstCooldown = 0;
  defense.lightningBurstTargetIds = [];
}

function randomDefenseLightningTargets(enemies: DefenseEnemy[], count: number, excludedTargetIds?: ReadonlySet<number>): DefenseEnemy[] {
  const candidates = enemies.filter((enemy) => isDefenseLightningTarget(enemy) && !excludedTargetIds?.has(enemy.id));
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }
  return candidates.slice(0, count);
}

function isDefenseLightningTarget(enemy: DefenseEnemy): boolean {
  if (enemy.state === 'dying' || enemy.health <= 0) {
    return false;
  }

  return defenseEnemyFullyVisible(enemy);
}

function applyDefenseLightningHit(state: GameState, enemy: DefenseEnemy): void {
  const hit = defenseDamageHitResult(state, defenseLightningDamage(state));
  enemy.health -= hit.amount;
  enemy.lastHitSource = 'lightning';
  recordDefenseDamagePopup(state, enemy, hit.amount, hit.kind, 'lightning');
}

function pushDefenseLightningStrike(state: GameState, target: Pick<DefenseEnemy, 'id' | 'lane' | 'distance'>): void {
  const defense = state.defense;
  const id = defense.nextLightningStrikeId;
  defense.lightningStrikes.push({
    id,
    targetEnemyId: target.id,
    lane: target.lane,
    distance: target.distance,
    timer: DEFENSE_LIGHTNING_STRIKE_DURATION,
    duration: DEFENSE_LIGHTNING_STRIKE_DURATION,
  });
  defense.nextLightningStrikeId += 1;

  if (defense.lightningStrikes.length > 30) {
    defense.lightningStrikes.splice(0, defense.lightningStrikes.length - 30);
  }
}

function fireDefenseIceAura(state: GameState): void {
  const defense = state.defense;
  if (!defenseIceActive(state)) {
    defense.iceCooldown = 0;
    return;
  }

  if (defense.iceCooldown > 0) {
    return;
  }

  const targets = defense.enemies.filter((enemy) => isDefenseIceTarget(state, enemy));
  if (targets.length === 0) {
    return;
  }

  for (const target of targets) {
    const hit = defenseDamageHitResult(state, defenseIceDamage(state));
    target.health -= hit.amount;
    target.lastHitSource = 'ice';
    recordDefenseDamagePopup(state, target, hit.amount, hit.kind, 'ice');
    collectDefenseEnemyIfDefeated(state, target);
  }

  defense.iceCooldown = defenseIceAttackInterval(state);
}

function isDefenseIceTarget(state: GameState, enemy: DefenseEnemy): boolean {
  return enemy.state !== 'dying' && enemy.health > 0 && defenseEnemyInIceRange(state, enemy);
}

function defenseEnemyInIceRange(state: GameState, enemy: Pick<DefenseEnemy, 'lane' | 'distance'>): boolean {
  const range = defenseIceRange(state);
  return range > 0 && defenseEnemyDistanceFromCenter(enemy) <= range;
}

function defenseEnemyIceSpeedMultiplier(state: GameState, enemy: Pick<DefenseEnemy, 'lane' | 'distance'>): number {
  if (!defenseEnemyInIceRange(state, enemy)) {
    return 1;
  }

  return Math.max(0.3, 1 - defenseIceSlow(state));
}

function fireDefenseTower(state: GameState): void {
  const defense = state.defense;
  if (defense.enemies.length === 0) {
    return;
  }

  if (fireQueuedDefenseShot(state)) {
    return;
  }

  if (defense.tower.cooldown > 0) {
    return;
  }

  const target = defense.enemies
    .filter((enemy) => isDefenseShotTargetAliveAndInRange(state, enemy))
    .sort((first, second) => first.distance - second.distance)[0];
  if (!target) {
    return;
  }

  applyDefenseEnemyHit(state, target);
  defense.tower.cooldown = defenseTowerAttackInterval(state);
  pushDefenseShot(state, target);

  collectDefenseEnemyIfDefeated(state, target);
}

function fireQueuedDefenseShot(state: GameState): boolean {
  const defense = state.defense;
  while (defense.queuedShots.length > 0) {
    const queuedShot = defense.queuedShots.shift();
    if (!queuedShot) {
      continue;
    }

    const target = selectDefenseQueuedShotTarget(state, queuedShot);
    if (!target) {
      continue;
    }

    applyDefenseEnemyHit(state, target, queuedShot.damageScale);
    pushDefenseShot(state, target);
    collectDefenseEnemyIfDefeated(state, target);
    return true;
  }

  return false;
}

function selectDefenseQueuedShotTarget(state: GameState, queuedShot: DefenseQueuedShot): DefenseEnemy | undefined {
  const requestedTarget = state.defense.enemies.find((enemy) => enemy.id === queuedShot.enemyId);
  if (requestedTarget && isDefenseShotTargetAliveAndInRange(state, requestedTarget)) {
    return requestedTarget;
  }

  return state.defense.enemies
    .filter((enemy) => isDefenseShotTargetAliveAndInRange(state, enemy))
    .sort((first, second) => first.distance - second.distance)[0];
}

function isDefenseShotTargetAliveAndInRange(state: GameState, enemy: DefenseEnemy): boolean {
  return enemy.state !== 'dying' && enemy.health > 0 && defenseEnemyInTowerRange(enemy, defenseTowerRange(state));
}

function applyDefenseEnemyHit(state: GameState, enemy: DefenseEnemy, damageScale = 1): void {
  const hit = defenseTowerHitResult(state, enemy);
  const amount = roundDefenseDamage(hit.amount * damageScale);
  enemy.health -= amount;
  enemy.lastHitSource = 'normal';
  recordDefenseDamagePopup(state, enemy, amount, hit.kind, 'normal');
}

function recordDefenseDamagePopup(
  state: GameState,
  enemy: Pick<DefenseEnemy, 'lane' | 'distance'> & Pick<Partial<DefenseEnemy>, 'kind'>,
  amount: number,
  kind: DefenseDamagePopupKind,
  source: DefenseHitFeedbackSource,
): void {
  const defense = state.defense;
  defense.damagePopups.push({
    id: defense.nextDamagePopupId,
    lane: enemy.lane,
    distance: enemy.distance,
    targetKind: enemy.kind,
    amount,
    kind,
    source,
    timer: DEFENSE_DAMAGE_POPUP_DURATION,
  });
  defense.nextDamagePopupId += 1;
  if (defense.damagePopups.length > 18) {
    defense.damagePopups.splice(0, defense.damagePopups.length - 18);
  }
}

function collectDefenseEnemyIfDefeated(state: GameState, enemy: DefenseEnemy): void {
  if (enemy.health > 0 || enemy.state === 'dying') {
    return;
  }

  const reward = defenseEnemyReward(state, enemy.kind ?? 'slime');
  const defense = state.defense;
  enemy.state = 'dying';
  enemy.deathTimer =
    (enemy.kind ?? 'slime') === 'skeletonMage'
      ? DEFENSE_SKELETON_MAGE_DEATH_DURATION
      : enemy.kind === 'goblinKing'
        ? DEFENSE_GOBLIN_KING_DEATH_DURATION
        : DEFENSE_ENEMY_DEATH_DURATION;
  defense.killsThisWave += 1;
  grantDefenseExperience(state, enemy.kind ?? 'slime');
  defense.score += reward;
  defense.best = Math.max(defense.best, defense.score);
  defense.lastReward += reward;
  state.resources.sigils += reward;
  recordDefenseMoneyPopup(state, enemy, reward);
  state.mana += 0.5 + state.books.defense.level * 0.2;
}

function grantDefenseExperience(state: GameState, kind: NonNullable<DefenseEnemy['kind']>): void {
  const defense = state.defense;
  if (defense.level >= DEFENSE_MAX_LEVEL) {
    defense.level = DEFENSE_MAX_LEVEL;
    defense.xp = 0;
    defense.lastXpGain = 0;
    return;
  }

  const gainedExperience = defenseExperienceGain(state, kind);
  defense.lastXpGain = gainedExperience;
  defense.xp += gainedExperience;

  while (defense.level < DEFENSE_MAX_LEVEL) {
    const requiredExperience = defenseExperienceToNextLevel(defense.level);
    if (requiredExperience <= 0 || defense.xp < requiredExperience) {
      break;
    }
    defense.xp -= requiredExperience;
    defense.level += 1;
  }

  if (defense.level >= DEFENSE_MAX_LEVEL) {
    defense.level = DEFENSE_MAX_LEVEL;
    defense.xp = 0;
  }
}

function recordDefenseMoneyPopup(state: GameState, enemy: Pick<DefenseEnemy, 'kind' | 'lane' | 'distance'>, amount: number): void {
  const defense = state.defense;
  const combo = defenseMoneyPopupCombo(defense.moneyPopups);
  const coinCount = DEFENSE_MONEY_POPUP_COIN_COUNT;
  const mergeTarget = defense.moneyPopups.find((popup) => shouldMergeDefenseMoneyPopup(state, popup, enemy));
  if (mergeTarget) {
    const mergeCombo = defenseMoneyPopupIsRecent(mergeTarget) ? Math.max(mergeTarget.combo + 1, combo) : combo;
    mergeTarget.amount += amount;
    mergeTarget.coinCount = DEFENSE_MONEY_POPUP_COIN_COUNT;
    mergeTarget.combo = Math.min(DEFENSE_MONEY_POPUP_COMBO_MAX, mergeCombo);
    mergeTarget.delay = DEFENSE_MONEY_POPUP_VISUAL_DELAY;
    mergeTarget.counterDelay = DEFENSE_MONEY_POPUP_VISUAL_DELAY + DEFENSE_MONEY_COUNTER_POPUP_DELAY;
    mergeTarget.timer = DEFENSE_MONEY_POPUP_DURATION + DEFENSE_MONEY_COUNTER_POPUP_DELAY;
    return;
  }

  defense.moneyPopups.push({
    id: defense.nextMoneyPopupId,
    lane: enemy.lane,
    distance: enemy.distance,
    amount,
    coinCount,
    combo,
    delay: DEFENSE_MONEY_POPUP_VISUAL_DELAY,
    counterDelay: DEFENSE_MONEY_POPUP_VISUAL_DELAY + DEFENSE_MONEY_COUNTER_POPUP_DELAY,
    timer: DEFENSE_MONEY_POPUP_DURATION + DEFENSE_MONEY_COUNTER_POPUP_DELAY,
  });
  defense.nextMoneyPopupId += 1;
  const maxActive = defenseMoneyPopupMaxActive(state);
  if (defense.moneyPopups.length > maxActive) {
    defense.moneyPopups.splice(0, defense.moneyPopups.length - maxActive);
  }
}

function defenseMoneyPopupMaxActive(state: GameState): number {
  if (state.defense.speedMultiplier >= 4) {
    return DEFENSE_MONEY_POPUP_TURBO_MAX_ACTIVE;
  }
  if (state.defense.speedMultiplier >= 2) {
    return DEFENSE_MONEY_POPUP_FAST_MAX_ACTIVE;
  }
  return DEFENSE_MONEY_POPUP_MAX_ACTIVE;
}

function defenseMoneyPopupCombo(popups: Array<{ delay?: number; timer: number }>): number {
  const recentCount = popups.filter(defenseMoneyPopupIsRecent).length;
  return Math.min(DEFENSE_MONEY_POPUP_COMBO_MAX, recentCount + 1);
}

function defenseMoneyPopupAge(popup: { delay?: number; timer: number }): number {
  return DEFENSE_MONEY_POPUP_DURATION + DEFENSE_MONEY_COUNTER_POPUP_DELAY + DEFENSE_MONEY_POPUP_VISUAL_DELAY - ((popup.delay ?? 0) + popup.timer);
}

function defenseMoneyPopupIsRecent(popup: { delay?: number; timer: number }): boolean {
  return defenseMoneyPopupAge(popup) < DEFENSE_MONEY_POPUP_COMBO_SECONDS;
}

function shouldMergeDefenseMoneyPopup(
  state: GameState,
  popup: Pick<DefenseEnemy, 'lane' | 'distance'> & { delay?: number; timer: number },
  enemy: Pick<DefenseEnemy, 'lane' | 'distance'>,
): boolean {
  if ((popup.delay ?? 0) <= 0) {
    return false;
  }
  if (defenseMoneyPopupAge(popup) > DEFENSE_MONEY_POPUP_CLUSTER_SECONDS) {
    return false;
  }
  if (state.defense.speedMultiplier >= 4) {
    return true;
  }
  const popupPosition = defenseEnemyPosition(popup);
  const enemyPosition = defenseEnemyPosition(enemy);
  const radius = state.defense.speedMultiplier >= 2 ? DEFENSE_MONEY_POPUP_CLUSTER_RADIUS * 2 : DEFENSE_MONEY_POPUP_CLUSTER_RADIUS;
  return Math.hypot(popupPosition.x - enemyPosition.x, popupPosition.y - enemyPosition.y) <= radius;
}

function completeDefenseWaveIfReady(state: GameState): void {
  const defense = state.defense;
  if (
    defense.spawnedThisWave < defenseWaveEnemyCount(state) ||
    defense.enemies.length > 0 ||
    defense.enemyProjectiles.length > 0
  ) {
    return;
  }

  const completedWave = defense.wave;
  const nextWave = defense.wave >= DEFENSE_FINAL_WAVE ? DEFENSE_FINAL_WAVE : defense.wave + 1;
  defense.wave = nextWave;
  if (completedWave % 10 === 0 && (nextWave > completedWave || completedWave === DEFENSE_FINAL_WAVE)) {
    defense.lastGoldBoostWave = completedWave === DEFENSE_FINAL_WAVE ? completedWave : nextWave;
  }
  defense.spawnedThisWave = 0;
  defense.killsThisWave = 0;
  resetDefenseWaveEntityIds(defense);
  pulseDefenseCleanup(defense);
  defense.spawnTimer = -1.1;
  defense.nextSpawnDelay = 0;
}

function resetDefenseWaveEntityIds(defense: GameState['defense']): void {
  defense.nextEnemyId = 1;
  defense.nextEnemyProjectileId = 1;
}

function pulseDefenseCleanup(defense: GameState['defense']): void {
  defense.cleanupPulse = (Number.isFinite(defense.cleanupPulse) ? defense.cleanupPulse : 0) + 1;
}

function startDefenseDeathSequence(state: GameState): void {
  const defense = state.defense;
  if (defense.deathTimer > 0) {
    return;
  }

  defense.running = false;
  defense.paused = false;
  defense.deathTimer = DEFENSE_DEATH_RESTART_DELAY;
  defense.towerHealth = 0;
  defense.score = 0;
  defense.spawnTimer = 0;
  defense.nextSpawnDelay = 0;
  defense.shotPulse = 0;
  defense.tower.cooldown = 0;
  defense.lightningCooldown = 0;
  defense.lightningBurstCharges = 0;
  defense.lightningBurstCooldown = 0;
  defense.lightningBurstTargetIds = [];
  defense.iceCooldown = 0;
  defense.shots = [];
  defense.enemyProjectiles = [];
  defense.lightningStrikes = [];
  defense.queuedShots = [];
}

function tickDefenseDeathSequence(state: GameState, deltaSeconds: number): void {
  const defense = state.defense;
  defense.running = false;
  defense.paused = false;
  defense.tower.range = defenseTowerRange(state);
  defense.deathTimer = Math.max(0, defense.deathTimer - deltaSeconds);
  if (defense.deathTimer <= 0) {
    resetDefenseRun(state);
  }
}

function resetDefenseRun(state: GameState): void {
  const defense = state.defense;
  const rollbackWave = defenseRollbackWave(defense.wave);
  defense.running = false;
  defense.paused = false;
  defense.deathTimer = 0;
  defense.wave = rollbackWave;
  defense.towerHealth = defenseMaxTowerHealth(state);
  defense.score = 0;
  defense.spawnTimer = 0;
  defense.nextSpawnDelay = 0;
  defense.spawnedThisWave = 0;
  defense.killsThisWave = 0;
  pulseDefenseCleanup(defense);
  defense.nextEnemyId = 1;
  defense.nextEnemyProjectileId = 1;
  defense.nextLightningStrikeId = 1;
  defense.nextDamagePopupId = 1;
  defense.nextMoneyPopupId = 1;
  defense.lastReward = 0;
  defense.shotPulse = 0;
  defense.lightningCooldown = 0;
  defense.lightningBurstCharges = 0;
  defense.lightningBurstCooldown = 0;
  defense.lightningBurstTargetIds = [];
  defense.iceCooldown = 0;
  defense.tower.range = defenseTowerRange(state);
  defense.tower.cooldown = 0;
  defense.shots = [];
  defense.enemyProjectiles = [];
  defense.lightningStrikes = [];
  defense.queuedShots = [];
  defense.enemies = [];
  defense.damagePopups = [];
  defense.moneyPopups = [];
}

function setDefenseDebugTowerHealth(state: GameState, enabled: boolean): void {
  state.defense.debugTowerHealthEnabled = enabled;
  state.defense.towerHealth = enabled ? 10000 : Math.min(state.defense.towerHealth, defenseMaxTowerHealth(state));
}

function setDefenseWave(state: GameState, rawWave: number): void {
  if (!state.books.defense.unlocked) {
    return;
  }

  const defense = state.defense;
  const nextWave = Math.max(1, Math.min(DEFENSE_FINAL_WAVE, Math.floor(rawWave)));
  if (!Number.isFinite(nextWave)) {
    return;
  }

  defense.running = false;
  defense.paused = false;
  defense.deathTimer = 0;
  defense.wave = nextWave;
  defense.towerHealth = defenseMaxTowerHealth(state);
  defense.spawnTimer = 0;
  defense.nextSpawnDelay = 0;
  defense.spawnedThisWave = 0;
  defense.killsThisWave = 0;
  pulseDefenseCleanup(defense);
  defense.nextEnemyId = 1;
  defense.nextEnemyProjectileId = 1;
  defense.nextLightningStrikeId = 1;
  defense.nextDamagePopupId = 1;
  defense.nextMoneyPopupId = 1;
  defense.lastReward = 0;
  defense.shotPulse = 0;
  defense.lightningCooldown = 0;
  defense.lightningBurstCharges = 0;
  defense.lightningBurstCooldown = 0;
  defense.lightningBurstTargetIds = [];
  defense.iceCooldown = 0;
  defense.tower.range = defenseTowerRange(state);
  defense.tower.cooldown = 0;
  defense.shots = [];
  defense.enemyProjectiles = [];
  defense.lightningStrikes = [];
  defense.queuedShots = [];
  defense.enemies = [];
  defense.damagePopups = [];
  defense.moneyPopups = [];
}

function tickDefenseShot(state: GameState, deltaSeconds: number): void {
  const shots = state.defense.shots;
  if (shots.length === 0) {
    return;
  }

  let writeIndex = 0;
  for (const shot of shots) {
    shot.timer -= deltaSeconds;
    if (shot.timer > 0) {
      shots[writeIndex] = shot;
      writeIndex += 1;
    }
  }
  shots.length = writeIndex;
}

function tickDefenseLightningStrikes(state: GameState, deltaSeconds: number): void {
  const strikes = state.defense.lightningStrikes;
  if (strikes.length === 0) {
    return;
  }

  let writeIndex = 0;
  for (const strike of strikes) {
    strike.timer -= deltaSeconds;
    if (strike.timer > 0) {
      strikes[writeIndex] = strike;
      writeIndex += 1;
    }
  }
  strikes.length = writeIndex;
}

function tickDefenseEnemyProjectiles(state: GameState, deltaSeconds: number): void {
  const projectiles = state.defense.enemyProjectiles;
  if (projectiles.length === 0) {
    return;
  }

  let writeIndex = 0;
  for (const projectile of projectiles) {
    projectile.timer -= deltaSeconds;
    if (projectile.timer <= 0) {
      damageDefenseTower(state);
      continue;
    }
    projectiles[writeIndex] = projectile;
    writeIndex += 1;
  }
  projectiles.length = writeIndex;
}

function tickDefenseDamagePopups(state: GameState, deltaSeconds: number): void {
  const popups = state.defense.damagePopups;
  let writeIndex = 0;
  for (const popup of popups) {
    popup.timer -= deltaSeconds;
    if (popup.timer > 0) {
      popups[writeIndex] = popup;
      writeIndex += 1;
    }
  }
  popups.length = writeIndex;
}

function tickDefenseMoneyPopups(state: GameState, deltaSeconds: number): void {
  const popups = state.defense.moneyPopups;
  let writeIndex = 0;
  for (const popup of popups) {
    if (popup.delay > 0) {
      const nextDelay = popup.delay - deltaSeconds;
      if (nextDelay >= 0) {
        popup.delay = nextDelay;
      } else {
        popup.delay = 0;
        popup.timer += nextDelay;
      }
    } else {
      popup.timer -= deltaSeconds;
    }
    popup.counterDelay = Math.max(0, (popup.counterDelay ?? popup.delay) - deltaSeconds);
    if (popup.timer > 0) {
      popups[writeIndex] = popup;
      writeIndex += 1;
    }
  }
  popups.length = writeIndex;
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
    applyMiningHit(state, target, miningPickaxeDamage(state));
  }
  skills.autoDigCount += digs;
}

function digMiningBlock(state: GameState, blockId: number): void {
  if (!state.books.mine.unlocked || !isBookPanelOpen(state, 'mine')) {
    return;
  }

  const block = state.mining.blocks.find((candidate) => candidate.id === blockId);
  if (!block || block.layersRemaining <= 0) {
    return;
  }

  state.mining.lastReward = 0;
  applyMiningHit(state, block, miningPickaxeDamage(state));

  const splash = miningSplashDamage(state);
  if (splash <= 0) {
    return;
  }

  for (const neighbor of miningNeighbors(state, blockId)) {
    applyMiningHit(state, neighbor, splash);
  }
}

function weakestMiningBlock(state: GameState): MiningBlock | null {
  return (
    state.mining.blocks
      .filter((block) => block.layersRemaining > 0)
      .sort((first, second) => {
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
    .filter((cell) => cell.x >= 0 && cell.x < MINING_GRID_COLUMNS && cell.y >= 0 && cell.y < MINING_GRID_ROWS)
    .map((cell) => cell.y * MINING_GRID_COLUMNS + cell.x);

  return state.mining.blocks.filter((block) => neighborIds.includes(block.id));
}

function applyMiningHit(state: GameState, block: MiningBlock, damage: number): void {
  if (block.layersRemaining <= 0) {
    return;
  }
  state.mining.hitPulse += 1;
  block.lastHit = state.mining.hitPulse;
  block.health -= damage;
  if (block.health > 0) {
    return;
  }

  breakMiningBlock(state, block);
}

function breakMiningBlock(state: GameState, block: MiningBlock): void {
  const brokenDepth = block.depth;
  const reward = miningBlockReward(state, block);
  const material = miningBlockMaterialForDepth(brokenDepth);
  state.mining.materials[material.resourceId] += reward;
  state.mining.totalMined += 1;
  state.mining.lastReward += reward;
  state.mining.lastBrokenDepth = brokenDepth;

  block.layersRemaining = Math.max(0, block.layersRemaining - 1);
  state.mining.deepestLayer = Math.max(state.mining.deepestLayer, brokenDepth);

  if (block.layersRemaining > 0) {
    const nextDepth = brokenDepth + 1;
    const nextMaxHealth = miningBlockMaxHealth(nextDepth);
    const nextMaterial = miningBlockMaterialForDepth(nextDepth);
    block.depth = nextDepth;
    block.material = nextMaterial.id;
    block.maxHealth = nextMaxHealth;
    block.health = nextMaxHealth;
    state.mining.deepestLayer = Math.max(state.mining.deepestLayer, nextDepth);
    return;
  }

  block.health = 0;
  block.maxHealth = 0;

  if (state.mining.blocks.every((candidate) => candidate.layersRemaining <= 0)) {
    advanceMiningTerrainCycle(state);
  }
}

function advanceMiningTerrainCycle(state: GameState): void {
  state.mining.terrainCycle += 1;
  const startDepth = (state.mining.terrainCycle - 1) * MINING_TERRAIN_LAYER_COUNT + 1;
  state.mining.blocks = createInitialMiningBlocks(state.mining.terrainCycle);
  state.mining.deepestLayer = Math.max(state.mining.deepestLayer, startDepth);
}

function miningBlockReward(state: GameState, block: MiningBlock): number {
  return 1 + Math.floor(block.depth * 0.45) + Math.floor(state.books.mine.level * 0.3);
}

function exchangeMiningMaterials(state: GameState): void {
  let coins = 0;
  for (const resourceId of MINING_MATERIAL_RESOURCE_IDS) {
    const amount = Math.floor(state.mining.materials[resourceId]);
    if (amount <= 0) {
      continue;
    }
    coins += amount * miningMaterialExchangeValue(resourceId);
    state.mining.materials[resourceId] -= amount;
  }
  state.resources.minerals += coins;
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
  const debugResourceAmount = 100_000_000;
  state.mana += debugResourceAmount;
  state.forbiddenGrimoire.keys += 1;
  state.resources.scales += debugResourceAmount;
  state.resources.runes += debugResourceAmount;
  state.resources.spores += debugResourceAmount;
  state.resources.sigils += debugResourceAmount;
  state.resources.chips += debugResourceAmount;
  state.resources.fragments += debugResourceAmount;
  state.resources.marks += debugResourceAmount;
  state.resources.minerals += debugResourceAmount;
  state.resources.gels += debugResourceAmount;
  state.mining.materials = createInitialMiningMaterials();
  for (const resourceId of MINING_MATERIAL_RESOURCE_IDS) {
    state.mining.materials[resourceId as MiningMaterialResourceId] = debugResourceAmount;
  }
}
