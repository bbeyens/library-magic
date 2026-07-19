import type { BookId, ResourceId } from '../content/books';
import type { ForbiddenOfferingResourceId } from '../content/forbiddenGrimoire';
import {
  runnerAttackRange,
  runnerAttackCount,
  runnerBaseDamage,
  runnerBaseFireRate,
  runnerHomingStrength,
  runnerLateralSpeed,
  runnerNextBossDistance,
  runnerNextBoostPortalDistance,
  runnerProjectileSpeed,
  runnerStartUnits,
  RUNNER_BASE_SPEED,
  type RunnerGateKind,
  type RunnerUpgradeId,
} from './runnerRules';
import type { RunnerMonsterModelId } from './runnerEditorRules';
import { slimeTrainerEnemyForVictoryCount, type SlimeTrainerCommandId, type SlimeTrainerEnemy } from './slimeTrainerRules';

export interface BookState {
  level: number;
  automation: number;
  pinned: boolean;
  unlocked: boolean;
  charge: number;
}

export type ManaIdleCompanionSkillId =
  | 'idleGlock'
  | 'idleAk47'
  | 'idleBazooka'
  | 'idleBow'
  | 'idleSword'
  | 'idleOrangeCat'
  | 'idlePickaxe';

export type ManaResearchSkillId =
  | 'researchClickPower'
  | 'researchMeowKnight'
  | 'researchIdleGlock'
  | 'researchIdleAk47'
  | 'researchIdleBazooka'
  | 'researchIdleBow'
  | 'researchIdleSword'
  | 'researchIdleOrangeCat'
  | 'researchIdlePickaxe';

export interface ManaActiveResearch {
  skillId: ManaResearchSkillId;
  elapsed: number;
  duration: number;
}

export interface ManaSkillsState {
  power: number;
  clickMultiplier: number;
  research: number;
  clickResearch: number;
  autoClicker: number;
  multiAutoClicker: number;
  xpOrbChance: number;
  yellowOrbChance: number;
  greenOrbChance: number;
  blueOrbChance: number;
  xpValue: number;
  levelUpEffect: number;
  holdClick: number;
  allyFindOrb: number;
  meowKnight: number;
  idleGlock: number;
  idleAk47: number;
  idleBazooka: number;
  idleBow: number;
  idleSword: number;
  idleOrangeCat: number;
  idlePickaxe: number;
  researchClickPower: number;
  researchMeowKnight: number;
  researchIdleGlock: number;
  researchIdleAk47: number;
  researchIdleBazooka: number;
  researchIdleBow: number;
  researchIdleSword: number;
  researchIdleOrangeCat: number;
  researchIdlePickaxe: number;
  criticalHit: number;
  criticalEffect: number;
  activeResearch: ManaActiveResearch | null;
  autoClickTimer: number;
  lastAutoClickCount: number;
  meowKnightTimer: number;
  lastMeowKnightAttackCount: number;
  idleCompanionTimers: Partial<Record<ManaIdleCompanionSkillId, number>>;
  idleCompanionAttackCounts: Partial<Record<ManaIdleCompanionSkillId, number>>;
  lastManaGainCritical: boolean;
}

export type ManaOrbKind = 'red' | 'yellow' | 'green' | 'blue';

export interface ManaXpOrb {
  id: number;
  kind: ManaOrbKind;
  x: number;
  y: number;
  value: number;
}

export interface ManaCrystalState {
  xp: number;
  harvestedMana: number;
  xpOrb: ManaXpOrb | null;
  lastCollectedXpOrb: ManaXpOrb | null;
  nextXpOrbId: number;
  lastXpGain: number;
  lastXpOrbSpawned: boolean;
  holdClickActive: boolean;
  holdClickTimer: number;
  // True while a gem-discovery animation plays: harvesting is paused so the player
  // can't damage the next gem until it finishes. UI-driven, never persisted.
  revealAnimating: boolean;
}

export interface SnakeSkillsState {
  // Purchased speed level (the cap). `speedSetting` is the active level the player dials in [0, speed].
  speed: number;
  speedSetting: number;
  gridSize: number;
  foodCount: number;
  growthThreshold: number;
  automation: number;
  automationEnabled: boolean;
  baseMultiplier: number;
  bonusFruit: number;
  extraLife: number;
  edgeWrap: number;
}

export interface SnakeState {
  running: boolean;
  score: number;
  best: number;
  comboSteps: number;
  foodsEatenTowardGrowth: number;
  extraLivesUsed: number;
  invincibleTimer: number;
  gridSize: number;
  body: SnakeCell[];
  direction: SnakeDirection;
  nextDirection: SnakeDirection;
  foods: SnakeCell[];
  bonusFood: SnakeBonusFood | null;
  moveTimer: number;
  moveFrame: number;
  lastReward: number;
}

export interface RuneTypingState {
  wordIndex: number;
  typed: string;
  completedWords: number;
  combo: number;
  penaltyWordsRemaining: number;
  currentWordHadMistake: boolean;
  lastReward: number;
  lastCompletedWord: string | null;
  lastFeedback: RuneTypingFeedback;
}

export interface DefenseEnemy {
  id: number;
  kind?: 'slime' | 'skeletonMage' | 'bat' | 'goblinKing';
  lane: number;
  distance: number;
  health: number;
  maxHealth: number;
  state: 'walking' | 'idle' | 'attacking' | 'dying';
  deathTimer: number;
  attackCooldown?: number;
  attackAnimationTimer?: number;
  attackProjectileDelay?: number;
  attackDamageDelay?: number;
  lastHitSource?: DefenseHitFeedbackSource;
}

export interface DefenseShot {
  id: number;
  lane: number;
  distance: number;
  targetKind?: DefenseEnemy['kind'];
  timer: number;
  duration: number;
}

export interface DefenseEnemyProjectile {
  id: number;
  lane: number;
  distance: number;
  timer: number;
  duration: number;
}

export interface DefenseLightningStrike {
  id: number;
  targetEnemyId: number;
  lane: number;
  distance: number;
  timer: number;
  duration: number;
}

export interface DefenseQueuedShot {
  enemyId: number;
  damageScale: number;
}

export type DefenseDamagePopupKind = 'normal' | 'critical' | 'superCritical';
export type DefenseHitFeedbackSource = 'normal' | 'lightning' | 'ice';

export interface DefenseDamagePopup {
  id: number;
  lane: number;
  distance: number;
  targetKind?: DefenseEnemy['kind'];
  amount: number;
  kind: DefenseDamagePopupKind;
  source: DefenseHitFeedbackSource;
  timer: number;
}

export interface DefenseMoneyPopup {
  id: number;
  lane: number;
  distance: number;
  amount: number;
  coinCount: number;
  combo: number;
  delay: number;
  counterDelay?: number;
  timer: number;
}

export interface DefenseTowerState {
  id: 'unique';
  range: number;
  cooldown: number;
}

export interface DefenseSkillsState {
  damage: number;
  damageMultiplier: number;
  attackSpeed: number;
  range: number;
  criticalChance: number;
  criticalMultiplier: number;
  superCriticalChance: number;
  superCriticalMultiplier: number;
  lightningDamage: number;
  lightningSpeed: number;
  lightningCount: number;
  iceDamage: number;
  iceSpeed: number;
  iceRange: number;
  iceSlow: number;
  health: number;
  healthRegen: number;
  moneyPerEnemy: number;
  goldMultiplier: number;
  baseSpeed: number;
}

export type DefenseSpeedMultiplier = 1 | 2 | 4;

export interface DefenseState {
  running: boolean;
  paused: boolean;
  deathTimer: number;
  wave: number;
  level: number;
  xp: number;
  lastXpGain: number;
  speedMultiplier: DefenseSpeedMultiplier;
  baseSpeedEnabled: boolean;
  debugTowerHealthEnabled: boolean;
  towerHealth: number;
  score: number;
  best: number;
  spawnTimer: number;
  nextSpawnDelay: number;
  spawnedThisWave: number;
  killsThisWave: number;
  cleanupPulse: number;
  nextEnemyId: number;
  nextEnemyProjectileId: number;
  nextLightningStrikeId: number;
  nextDamagePopupId: number;
  nextMoneyPopupId: number;
  lastGoldBoostWave: number;
  lastReward: number;
  shotPulse: number;
  lightningCooldown: number;
  lightningBurstCharges: number;
  lightningBurstCooldown: number;
  lightningBurstTargetIds: number[];
  iceCooldown: number;
  shots: DefenseShot[];
  enemyProjectiles: DefenseEnemyProjectile[];
  lightningStrikes: DefenseLightningStrike[];
  queuedShots: DefenseQueuedShot[];
  tower: DefenseTowerState;
  enemies: DefenseEnemy[];
  damagePopups: DefenseDamagePopup[];
  moneyPopups: DefenseMoneyPopup[];
}

export type BlackjackRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type BlackjackSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type BlackjackPhase = 'idle' | 'player' | 'dealer' | 'won' | 'lost' | 'push' | 'blackjack';
export type BlackjackHandId = 'primary' | 'split';

export interface BlackjackCard {
  rank: BlackjackRank;
  suit: BlackjackSuit;
}

export interface BlackjackBonusTrackState {
  unlocked: boolean;
  level: number;
  xp: number;
  autoEnabled: boolean;
  activatedThisHand: boolean;
  lastOutcome: string;
  lastPayout: number;
  lastXp: number;
}

export type BlackjackUpgradeCellId =
  | 'wagerBase'
  | 'wagerWin'
  | 'wagerNatural'
  | 'wagerStreak'
  | 'wagerDebt'
  | 'actionStand'
  | 'actionDouble'
  | 'actionSplit'
  | 'actionFaceSplit'
  | 'actionMastery'
  | 'autoDeal'
  | 'autoSpeed'
  | 'pairUnlock'
  | 'pairPayout'
  | 'pairXp'
  | 'pairRefund'
  | 'pairAuto'
  | 'twentyOneThreeUnlock'
  | 'twentyOneThreePayout'
  | 'twentyOneThreeXp'
  | 'twentyOneThreeJackpot'
  | 'twentyOneThreeAuto';

export type BlackjackUpgradeCellsState = Record<BlackjackUpgradeCellId, number>;

export interface BlackjackState {
  deck: BlackjackCard[];
  playerHand: BlackjackCard[];
  splitHand: BlackjackCard[] | null;
  dealerHand: BlackjackCard[];
  phase: BlackjackPhase;
  round: number;
  baseBetLevel: number;
  activeHand: BlackjackHandId;
  playerBet: number;
  splitBet: number;
  playerHandDone: boolean;
  splitHandDone: boolean;
  playerHandDoubled: boolean;
  splitHandDoubled: boolean;
  dealerCardRevealed: boolean;
  lastReward: number;
  lastOutcome: string;
  lastDebtPayment: number;
  winStreak: number;
  debt: number;
  actions: BlackjackBonusTrackState;
  pair: BlackjackBonusTrackState;
  twentyOneThree: BlackjackBonusTrackState;
  upgradeCells: BlackjackUpgradeCellsState;
}

export interface HundredState {
  total: number;
  attempts: number;
  wins: number;
  bestTotal: number;
  lastRoll: number;
  lastOption: HundredOptionId | null;
  lastReward: number;
  lastOutcome: HundredOutcome;
}

/** A cube barrelling down the lane at the squad. */
export interface RunnerEnemy {
  id: number;
  x: number;
  z: number;
  health: number;
  maxHealth: number;
  modelId?: RunnerMonsterModelId;
  contactDamage?: number;
  coinReward?: number;
  scale?: number;
  speedMultiplier?: number;
  editorPlaced?: boolean;
  isMiniBoss?: boolean;
  isBoss?: boolean;
}

/** A seal floating over the lane; shoot its hit points away to absorb the modifier. */
export interface RunnerGate {
  id: number;
  x: number;
  z: number;
  kind: RunnerGateKind;
  value: number;
  shotsRequired: number;
  shotsRemaining: number;
  activated: boolean;
}

export interface RunnerBoostPortalPair {
  id: number;
  z: number;
  leftUpgradeId: RunnerUpgradeId;
  rightUpgradeId: RunnerUpgradeId;
}

export interface RunnerBullet {
  id: number;
  x: number;
  z: number;
  maxZ: number;
  damage: number;
}

export interface RunnerImpact {
  id: number;
  x: number;
  z: number;
  createdAt: number;
}

export interface RunnerDefeatEffect {
  id: number;
  x: number;
  z: number;
  amount: number;
  scale: number;
  createdAt: number;
}

/** The run in flight. Reset from scratch on every relaunch. */
export interface RunnerRunState {
  running: boolean;
  dead: boolean;
  editorPaused: boolean;
  distance: number;
  playerX: number;
  playerTargetX: number;
  lateralSpeed: number;
  /** Remaining lives. Enemy contact subtracts the enemy's remaining health. */
  units: number;
  /** Projectiles emitted by each volley, independent from remaining lives. */
  attacks: number;
  damage: number;
  fireRate: number;
  attackRange: number;
  homingStrength: number;
  projectileSpeed: number;
  speed: number;
  fireCooldown: number;
  enemySpawnTimer: number;
  nextGateDistance: number;
  nextBoostPortalDistance: number;
  nextBossDistance: number;
  gateIndex: number;
  nextEntityId: number;
  enemies: RunnerEnemy[];
  gates: RunnerGate[];
  boostPortals: RunnerBoostPortalPair[];
  temporaryUpgrades: Record<RunnerUpgradeId, number>;
  bullets: RunnerBullet[];
  impacts: RunnerImpact[];
  defeatEffects: RunnerDefeatEffect[];
  coinsEarned: number;
  kills: number;
  /** Bumped on each kill / gate crack so the renderer can fire one-shot effects. */
  hitPulse: number;
  gatePulse: number;
  boostPortalPulse: number;
  lastBoostUpgradeId: RunnerUpgradeId | null;
  lastBoostAt: number | null;
  deathPulse: number;
  /** Exact simulation time of the latest enemy contact, used by hit feedback. */
  lastDamageAt: number | null;
  /** Exact simulation time when the current run ended. */
  deathAt: number | null;
  /** Set while the home camp fades back in after a completed death sequence. */
  menuReturnAt: number | null;
}

/** Survives across runs. Coins are spendable only in this mini-game's own shop. */
export interface RunnerMetaState {
  coins: number;
  bestDistance: number;
  lastRunCoins: number;
  lastRunDistance: number;
  selectedCheckpoint: number;
  upgrades: Record<RunnerUpgradeId, number>;
}

export function createInitialRunnerUpgrades(): Record<RunnerUpgradeId, number> {
  return {
    baseDamage: 0,
    startUnits: 0,
    baseFireRate: 0,
    lateralSpeed: 0,
    attackRange: 0,
    multishot: 0,
    homing: 0,
    projectileSpeed: 0,
    gateQuality: 0,
    coinFlat: 0,
    coinGain: 0,
  };
}

/** A fresh run, seeded from the permanent upgrades bought in the shop. */
export function createRunnerRunState(
  upgrades: Record<RunnerUpgradeId, number>,
  startDistance = 0,
): RunnerRunState {
  const distance = Math.max(0, startDistance);
  return {
    running: false,
    dead: false,
    editorPaused: false,
    distance,
    playerX: 0,
    playerTargetX: 0,
    lateralSpeed: runnerLateralSpeed(upgrades.lateralSpeed),
    units: runnerStartUnits(upgrades.startUnits),
    attacks: runnerAttackCount(upgrades.multishot),
    damage: runnerBaseDamage(upgrades.baseDamage),
    fireRate: runnerBaseFireRate(upgrades.baseFireRate),
    attackRange: runnerAttackRange(upgrades.attackRange),
    homingStrength: runnerHomingStrength(upgrades.homing),
    projectileSpeed: runnerProjectileSpeed(upgrades.projectileSpeed),
    speed: RUNNER_BASE_SPEED,
    fireCooldown: 0,
    enemySpawnTimer: 0,
    nextGateDistance: distance + 30,
    nextBoostPortalDistance: runnerNextBoostPortalDistance(distance),
    nextBossDistance: runnerNextBossDistance(distance),
    gateIndex: Math.floor(distance / 35),
    nextEntityId: 1,
    enemies: [],
    gates: [],
    boostPortals: [],
    temporaryUpgrades: createInitialRunnerUpgrades(),
    bullets: [],
    impacts: [],
    defeatEffects: [],
    coinsEarned: 0,
    kills: 0,
    hitPulse: 0,
    gatePulse: 0,
    boostPortalPulse: 0,
    lastBoostUpgradeId: null,
    lastBoostAt: null,
    deathPulse: 0,
    lastDamageAt: null,
    deathAt: null,
    menuReturnAt: null,
  };
}

// Special block kinds (rolled at generation). 'bomb' explodes on the first break.
export type MiningSpecialKind = 'none' | 'bomb';

export interface MiningBlock {
  id: number;
  depth: number;
  material: MiningBlockMaterialId;
  layersRemaining: number;
  health: number;
  maxHealth: number;
  lastHit: number;
  // Holographic rarity: 0 = normal, 1 = Holo, 2 = Arc-en-ciel, 3 = Négatif (see MINING_HOLO_TIERS).
  holoTier: number;
  special: MiningSpecialKind;
}

export interface MiningHitFeedback {
  blockId: number;
  amount: number;
  critical: boolean;
}

export interface MiningBreakFeedback {
  blockId: number;
  reward: number;
}

export interface MiningSkillsState {
  pickaxeForce: number;
  pickaxeMultiplier: number;
  splashDamage: number;
  criticalChance: number;
  criticalMultiplier: number;
  holdClick: number;
  automation: number;
  multiAutoClicker: number;
  resourceBonus: number;
  resourceMultiplier: number;
  holoChance: number;
  rainbowChance: number;
  negativeChance: number;
  bombChance: number;
  bombRange: number;
  bombPower: number;
  // Shaves clicks off the meteorite threshold (50 per level, down to MINING_METEORITE_MIN_CLICKS).
  meteorite: number;
  // Each launched meteorite permanently multiplies damage by (1 + level * 0.01); max level 5.
  meteoriteBonus: number;
  automationTimer: number;
  autoDigCount: number;
}

export interface MiningState {
  blocks: MiningBlock[];
  materials: Record<MiningMaterialResourceId, number>;
  blockTypeXp: number[];
  terrainCycle: number;
  totalMined: number;
  deepestLayer: number;
  lastReward: number;
  lastBrokenDepth: number;
  hitPulse: number;
  hitFeedback: MiningHitFeedback[];
  breakFeedback: MiningBreakFeedback[];
  // Countdown (seconds) for the frontier-wave time challenge; re-armed on entering the frontier.
  frontierTimer: number;
  // Bumped when the frontier timer runs out, so the HUD can flash a "time up" cue.
  frontierFailPulse: number;
  // Bumped whenever a bomb detonates; bombFeedback holds the detonating block ids (for FX).
  bombPulse: number;
  bombFeedback: number[];
  // Clicks accumulated toward the next meteorite (manual + auto); meteoritePulse bumps on launch
  // (so the renderer starts the falling ball), and each entry in meteoriteImpactTimers is a meteorite
  // still falling — its damage lands when the timer reaches 0.
  meteoriteClicks: number;
  meteoritePulse: number;
  meteoriteImpactTimers: number[];
  // Permanent damage multiplier that grows with every meteorite launched (see the meteoriteBonus
  // skill). Starts at 1 and is never reset on a run reset — only a full skills reset clears it.
  meteoriteDamageBonus: number;
}

export type SlimeTrainerOutcome = 'idle' | 'hit' | 'enemyHit' | 'locked' | 'waitingEnemy' | 'victory' | 'levelUp' | 'slimeDown';
export type SlimeTrainerTurn = 'player' | 'enemy';

export interface SlimeTrainerState {
  level: number;
  xp: number;
  victories: number;
  turn: SlimeTrainerTurn;
  enemyTurnTimer: number;
  slimeHealth: number;
  slimeMaxHealth: number;
  enemy: SlimeTrainerEnemy;
  lastCommand: SlimeTrainerCommandId | null;
  lastDamage: number;
  lastEnemyDamage: number;
  lastXp: number;
  lastReward: number;
  lastOutcome: SlimeTrainerOutcome;
  hitPulse: number;
}

export type SnakeDirection = 'up' | 'right' | 'down' | 'left';
export type SnakeBonusFruitType =
  | 'round-blue'
  | 'round-green'
  | 'round-pink'
  | 'diamond-red'
  | 'diamond-blue'
  | 'diamond-green'
  | 'diamond-pink';
export type RuneTypingFeedback = 'idle' | 'correct' | 'mistake' | 'complete';
export type HundredOptionId = 'A' | 'B' | 'C' | 'D';
export type HundredOutcome = 'idle' | 'rolled' | 'won' | 'bust';

export interface SnakeBonusFood {
  cell: SnakeCell;
  type: SnakeBonusFruitType;
}

export interface SnakeCell {
  x: number;
  y: number;
}

export type BookPanelSlot = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface OpenBookPanel {
  bookId: BookId;
  slot: BookPanelSlot;
}

export interface ForbiddenGrimoireState {
  level: number;
  keys: number;
  selectedBookId: BookId | null;
  offerings: Record<ForbiddenOfferingResourceId, number>;
  offeringsByBook: Partial<Record<BookId, Record<ForbiddenOfferingResourceId, number>>>;
  lastOffered: Partial<Record<ForbiddenOfferingResourceId, number>>;
  lastUnlockedBookId: BookId | null;
  pulse: number;
}

export interface GameState {
  mana: number;
  resources: Record<ResourceId, number>;
  forbiddenGrimoire: ForbiddenGrimoireState;
  selectedBook: BookId;
  openBookPanels: OpenBookPanel[];
  books: Record<BookId, BookState>;
  manaSkills: ManaSkillsState;
  manaCrystal: ManaCrystalState;
  snakeSkills: SnakeSkillsState;
  snake: SnakeState;
  runeTyping: RuneTypingState;
  defenseSkills: DefenseSkillsState;
  defense: DefenseState;
  blackjack: BlackjackState;
  hundred: HundredState;
  runnerMeta: RunnerMetaState;
  runner: RunnerRunState;
  miningSkills: MiningSkillsState;
  mining: MiningState;
  slimeTrainer: SlimeTrainerState;
  lastTick: number;
}

export const SNAKE_BASE_GRID_SIZE = 4;
export const SNAKE_MAX_GRID_SIZE = 9;
export const MINING_GRID_COLUMNS = 5;
export const MINING_GRID_ROWS = 5;
export const MINING_TERRAIN_LAYER_COUNT = 5;
export const MINING_SPRITE_LAYER_SIZE = 5;
// The deepest reached wave (the frontier) must be cleared within this time limit to advance.
export const MINING_FRONTIER_TIME_LIMIT = 30;

export type MiningBlockMaterialId =
  | 'dirt'
  | 'sand'
  | 'stone'
  | 'coal'
  | 'iron'
  | 'gold'
  | 'ruby'
  | 'lapis'
  | 'diamond'
  | 'emerald'
  | 'obsidian';

export type MiningMaterialResourceId =
  | 'dirt'
  | 'stone'
  | 'sand'
  | 'coal'
  | 'iron'
  | 'gold'
  | 'ruby'
  | 'lapis'
  | 'diamond'
  | 'emerald'
  | 'obsidian';

export interface MiningBlockMaterial {
  id: MiningBlockMaterialId;
  name: string;
  shortName: string;
  resourceId: MiningMaterialResourceId;
  exchangeValue: number;
}

export interface MiningBlockSpriteTier {
  spriteIndex: number;
  materialId: MiningBlockMaterialId;
  assetPath: string;
}

export interface MiningBlockDepthTier extends MiningBlockSpriteTier {
  shadeLevel: number;
}

export interface MiningBlockCrackOverlay {
  row: 1 | 2 | 3 | 4;
  column: 1 | 2 | 3 | 4;
}

export const MINING_BLOCK_MATERIALS: Record<MiningBlockMaterialId, MiningBlockMaterial> = {
  dirt: { id: 'dirt', name: 'Terre', shortName: 'Terre', resourceId: 'dirt', exchangeValue: 1 },
  sand: { id: 'sand', name: 'Sable', shortName: 'Sable', resourceId: 'sand', exchangeValue: 2 },
  stone: { id: 'stone', name: 'Pierre', shortName: 'Pierre', resourceId: 'stone', exchangeValue: 3 },
  coal: { id: 'coal', name: 'Charbon', shortName: 'Charbon', resourceId: 'coal', exchangeValue: 5 },
  iron: { id: 'iron', name: 'Fer', shortName: 'Fer', resourceId: 'iron', exchangeValue: 8 },
  gold: { id: 'gold', name: 'Or', shortName: 'Or', resourceId: 'gold', exchangeValue: 13 },
  ruby: { id: 'ruby', name: 'Rubis', shortName: 'Rubis', resourceId: 'ruby', exchangeValue: 21 },
  lapis: { id: 'lapis', name: 'Lapis', shortName: 'Lapis', resourceId: 'lapis', exchangeValue: 34 },
  diamond: { id: 'diamond', name: 'Diamant', shortName: 'Diam', resourceId: 'diamond', exchangeValue: 55 },
  emerald: { id: 'emerald', name: 'Emeraude', shortName: 'Emer', resourceId: 'emerald', exchangeValue: 89 },
  obsidian: { id: 'obsidian', name: 'Obsidienne', shortName: 'Obsi', resourceId: 'obsidian', exchangeValue: 144 },
};

export const MINING_MATERIAL_RESOURCE_IDS: MiningMaterialResourceId[] = [
  'dirt',
  'stone',
  'sand',
  'coal',
  'iron',
  'gold',
  'ruby',
  'lapis',
  'diamond',
  'emerald',
  'obsidian',
];

export const MINING_BLOCK_SPRITE_TIERS: MiningBlockSpriteTier[] = [
  { spriteIndex: 1, materialId: 'dirt', assetPath: '/assets/Block%20terre/1%20block%20herb.jpg' },
  { spriteIndex: 2, materialId: 'dirt', assetPath: '/assets/Block%20terre/2%20block%20terre%20A.jpg' },
  { spriteIndex: 3, materialId: 'sand', assetPath: '/assets/Block%20terre/3%20block%20sable.jpg' },
  { spriteIndex: 4, materialId: 'stone', assetPath: '/assets/Block%20terre/4%20block%20cobblestone%20under.jpg' },
  { spriteIndex: 5, materialId: 'stone', assetPath: '/assets/Block%20terre/5%20block%20cobblestone.jpg' },
  { spriteIndex: 6, materialId: 'stone', assetPath: '/assets/Block%20terre/6%20block%20rock.jpg' },
  { spriteIndex: 7, materialId: 'coal', assetPath: '/assets/Block%20terre/7%20block%20charbon.jpg' },
  { spriteIndex: 8, materialId: 'iron', assetPath: '/assets/Block%20terre/8%20block%20iron.jpg' },
  { spriteIndex: 9, materialId: 'gold', assetPath: '/assets/Block%20terre/9%20block%20gold%20B.jpg' },
  { spriteIndex: 10, materialId: 'ruby', assetPath: '/assets/Block%20terre/10%20block%20ruby.jpg' },
  { spriteIndex: 11, materialId: 'lapis', assetPath: '/assets/Block%20terre/11%20block%20lapis%20lazuli.jpg' },
  { spriteIndex: 12, materialId: 'diamond', assetPath: '/assets/Block%20terre/12%20block%20diamand.jpg' },
  { spriteIndex: 13, materialId: 'emerald', assetPath: '/assets/Block%20terre/13%20block%20emerald%20.jpg' },
  { spriteIndex: 14, materialId: 'iron', assetPath: '/assets/Block%20terre/14%20block%20iron%20full.jpg' },
  { spriteIndex: 15, materialId: 'gold', assetPath: '/assets/Block%20terre/15%20block%20gold%20full.jpg' },
  { spriteIndex: 16, materialId: 'ruby', assetPath: '/assets/Block%20terre/16%20block%20ruby%20full.jpg' },
  { spriteIndex: 17, materialId: 'lapis', assetPath: '/assets/Block%20terre/17%20block%20lapis%20lazuli%20full.jpg' },
  { spriteIndex: 18, materialId: 'diamond', assetPath: '/assets/Block%20terre/18%20block%20diamond%20full.jpg' },
  { spriteIndex: 19, materialId: 'emerald', assetPath: '/assets/Block%20terre/19%20block%20emerald%20full.jpg' },
  { spriteIndex: 20, materialId: 'obsidian', assetPath: '/assets/Block%20terre/20%20block%20obsidian.jpg' },
];

// Highest selectable level: one cycle per sprite tier, capped so the last level is obsidian.
export const MINING_MAX_CYCLE = MINING_BLOCK_SPRITE_TIERS.length;

export function snakeGridSizeForLevel(level: number): number {
  return Math.min(SNAKE_MAX_GRID_SIZE, SNAKE_BASE_GRID_SIZE + level);
}

export function createStartingSnakeBody(gridSize: number): SnakeCell[] {
  const headX = Math.max(2, Math.floor(gridSize / 2));
  const headY = Math.floor(gridSize / 2);
  return [
    { x: headX, y: headY },
    { x: headX - 1, y: headY },
    { x: headX - 2, y: headY },
  ];
}

export function randomSnakeFood(body: SnakeCell[], gridSize: number): SnakeCell | null {
  const occupiedCells = new Set(body.map(cellKey));
  const availableCells: SnakeCell[] = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const cell = { x, y };
      if (!occupiedCells.has(cellKey(cell))) {
        availableCells.push(cell);
      }
    }
  }

  if (availableCells.length === 0) {
    return null;
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

export function miningBlockMaxHealth(depth: number): number {
  const layer = Math.max(1, depth);
  return 3 + Math.floor((layer - 1) * 1.45) + Math.floor((layer - 1) * (layer - 1) * 0.08);
}

export function miningBlockSpriteTierForDepth(depth: number): MiningBlockDepthTier {
  const layer = Math.max(1, Math.floor(depth));
  const rawTier = Math.floor((layer - 1) / MINING_SPRITE_LAYER_SIZE);
  const spriteTier = MINING_BLOCK_SPRITE_TIERS[Math.min(rawTier, MINING_BLOCK_SPRITE_TIERS.length - 1)]!;
  return {
    ...spriteTier,
    shadeLevel: ((layer - 1) % MINING_SPRITE_LAYER_SIZE) + 1,
  };
}

export function miningBlockMaterialForDepth(depth: number): MiningBlockMaterial {
  return MINING_BLOCK_MATERIALS[miningBlockSpriteTierForDepth(depth).materialId];
}

export function miningBlockMaterialById(materialId: MiningBlockMaterialId): MiningBlockMaterial {
  return MINING_BLOCK_MATERIALS[materialId] ?? MINING_BLOCK_MATERIALS.dirt;
}

// The shallowest layer of a terrain cycle. Each cycle spans exactly one sprite tier.
export function miningLevelStartDepth(cycle: number): number {
  return (Math.max(1, Math.floor(cycle)) - 1) * MINING_TERRAIN_LAYER_COUNT + 1;
}

// Deepest cycle the player has unlocked, derived from the deepest broken layer (capped at obsidian).
export function miningMaxReachedCycle(deepestLayer: number): number {
  return Math.min(
    MINING_MAX_CYCLE,
    Math.floor((Math.max(1, Math.floor(deepestLayer)) - 1) / MINING_TERRAIN_LAYER_COUNT) + 1,
  );
}

// True when the current wave is the frontier (deepest reached), i.e. the timed challenge wave.
export function miningIsFrontierWave(terrainCycle: number, deepestLayer: number): boolean {
  return Math.floor(terrainCycle) >= miningMaxReachedCycle(deepestLayer);
}

// Representative block face (material + sprite asset) shown for a terrain cycle.
export function miningLevelSpriteTier(cycle: number): MiningBlockDepthTier {
  return miningBlockSpriteTierForDepth(miningLevelStartDepth(cycle));
}

export function createInitialMiningMaterials(): Record<MiningMaterialResourceId, number> {
  return Object.fromEntries(MINING_MATERIAL_RESOURCE_IDS.map((resourceId) => [resourceId, 0])) as Record<MiningMaterialResourceId, number>;
}

export function createInitialMiningBlockTypeXp(): number[] {
  return Array.from({ length: MINING_BLOCK_SPRITE_TIERS.length }, () => 0);
}

export function miningMaterialExchangeValue(resourceId: MiningMaterialResourceId): number {
  return MINING_BLOCK_MATERIALS[resourceId].exchangeValue;
}

export function miningBlockCrackOverlayForDamage(
  health: number,
  maxHealth: number,
  blockId: number,
): MiningBlockCrackOverlay | null {
  if (maxHealth <= 0) {
    return null;
  }
  const damagePercent = Math.max(0, Math.min(100, 100 - (Math.max(0, health) / maxHealth) * 100));
  if (damagePercent < 5) {
    return null;
  }
  const column = damagePercent <= 25 ? 1 : damagePercent <= 50 ? 2 : damagePercent <= 75 ? 3 : 4;
  const row = ((Math.max(0, Math.floor(blockId)) % 4) + 1) as 1 | 2 | 3 | 4;
  return { row, column };
}

export interface MiningHoloTierDef {
  tier: number;
  name: string;
  multiplier: number;
}

// Holographic rarity ladder: rarer tiers pay out much more. Tier index 0 = tier 1 (Holo).
export const MINING_HOLO_TIERS: MiningHoloTierDef[] = [
  { tier: 1, name: 'Holo', multiplier: 5 },
  { tier: 2, name: 'Arc-en-ciel', multiplier: 25 },
  { tier: 3, name: 'Négatif', multiplier: 100 },
];
// Chance that a holo block bumps up one rarity tier (cascading, so higher tiers are rarer).
export const MINING_HOLO_UPGRADE_CHANCE = 0.15;

// Bomb spawn chance: base at skill level 0, capped by the bomb-chance skill.
export const MINING_BOMB_CHANCE_BASE = 0.01;
export const MINING_BOMB_CHANCE_MAX = 0.05;
// Base blast damage multiplier (x the player's click damage) before the bomb-power skill.
export const MINING_BOMB_BASE_POWER = 5;

// Meteorite: every N clicks (manual + auto) a meteorite falls on the centre and damages every block.
// The meteorite skill shaves 50 clicks off that threshold per level, down to a 250-click floor.
export const MINING_METEORITE_BASE_CLICKS = 1000;
export const MINING_METEORITE_MIN_CLICKS = 250;
export const MINING_METEORITE_CLICKS_PER_LEVEL = 50;
// Damage the meteorite deals to each block (x the player's click damage), capped to this many layers.
export const MINING_METEORITE_DAMAGE_MULTIPLIER = 50;
export const MINING_METEORITE_MAX_LAYERS = MINING_TERRAIN_LAYER_COUNT;
// Seconds the meteorite spends falling before it lands — the damage is deferred this long so it hits
// exactly when the ball impacts (must match the fall animation length in the renderer).
export const MINING_METEORITE_FALL_SECONDS = 3;

// Reward multiplier for a block's holo tier (1 for a normal block).
export function miningHoloMultiplier(holoTier: number): number {
  const def = MINING_HOLO_TIERS[Math.floor(holoTier) - 1];
  return def ? def.multiplier : 1;
}

// Roll a block's holo rarity: first the base holo chance, then cascading tier upgrades.
// tierUpgradeChances[i] is the chance to reach tier i+2 (index 0 = holo->arc-en-ciel);
// unspecified entries fall back to MINING_HOLO_UPGRADE_CHANCE.
export function rollMiningHoloTier(
  holoChance: number,
  tierUpgradeChances: number[] = [],
  random: () => number = Math.random,
): number {
  if (holoChance <= 0 || random() >= holoChance) {
    return 0;
  }
  let tier = 1;
  while (tier < MINING_HOLO_TIERS.length && random() < (tierUpgradeChances[tier - 1] ?? MINING_HOLO_UPGRADE_CHANCE)) {
    tier += 1;
  }
  return tier;
}

export function createInitialMiningBlocks(
  terrainCycle = 1,
  holoChance = 0,
  tierChances: number[] = [],
  bombChance = MINING_BOMB_CHANCE_BASE,
): MiningBlock[] {
  const startDepth = Math.max(1, Math.floor(terrainCycle - 1) * MINING_TERRAIN_LAYER_COUNT + 1);
  return Array.from({ length: MINING_GRID_COLUMNS * MINING_GRID_ROWS }, (_, id) => {
    const maxHealth = miningBlockMaxHealth(startDepth);
    const material = miningBlockMaterialForDepth(startDepth);
    // A block is either a bomb or a (possibly holo) normal block — never both.
    const isBomb = Math.random() < bombChance;
    return {
      id,
      depth: startDepth,
      material: material.id,
      layersRemaining: MINING_TERRAIN_LAYER_COUNT,
      health: maxHealth,
      maxHealth,
      lastHit: 0,
      holoTier: isBomb ? 0 : rollMiningHoloTier(holoChance, tierChances),
      special: isBomb ? 'bomb' : 'none',
    };
  });
}

export function createInitialState(): GameState {
  const snakeGridSize = snakeGridSizeForLevel(0);
  const snakeBody = createStartingSnakeBody(snakeGridSize);
  const initialSnakeFood = randomSnakeFood(snakeBody, snakeGridSize);

  return {
    mana: 0,
    resources: {
      scales: 0,
      runes: 0,
      spores: 0,
      sigils: 0,
      chips: 50,
      fragments: 0,
      minerals: 0,
      marks: 0,
      gels: 0,
    },
    forbiddenGrimoire: {
      level: 1,
      keys: 0,
      selectedBookId: null,
      offerings: {
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
      },
      offeringsByBook: {},
      lastOffered: {},
      lastUnlockedBookId: null,
      pulse: 0,
    },
    selectedBook: 'mana',
    openBookPanels: [],
    books: {
      mana: {
        level: 1,
        automation: 0,
        pinned: true,
        unlocked: true,
        charge: 0,
      },
      serpent: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      typing: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      herbarium: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      defense: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      blackjack: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      hundred: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      mine: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      runner: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
      slimeTrainer: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: true,
        charge: 0,
      },
    },
    manaSkills: {
      power: 0,
      clickMultiplier: 0,
      research: 0,
      clickResearch: 0,
      autoClicker: 0,
      multiAutoClicker: 0,
      xpOrbChance: 0,
      yellowOrbChance: 0,
      greenOrbChance: 0,
      blueOrbChance: 0,
      xpValue: 0,
      levelUpEffect: 0,
      holdClick: 0,
      allyFindOrb: 0,
      meowKnight: 0,
      idleGlock: 0,
      idleAk47: 0,
      idleBazooka: 0,
      idleBow: 0,
      idleSword: 0,
      idleOrangeCat: 0,
      idlePickaxe: 0,
      researchClickPower: 0,
      researchMeowKnight: 0,
      researchIdleGlock: 0,
      researchIdleAk47: 0,
      researchIdleBazooka: 0,
      researchIdleBow: 0,
      researchIdleSword: 0,
      researchIdleOrangeCat: 0,
      researchIdlePickaxe: 0,
      criticalHit: 0,
      criticalEffect: 0,
      activeResearch: null,
      autoClickTimer: 0,
      lastAutoClickCount: 0,
      meowKnightTimer: 0,
      lastMeowKnightAttackCount: 0,
      idleCompanionTimers: {},
      idleCompanionAttackCounts: {},
      lastManaGainCritical: false,
    },
    manaCrystal: {
      xp: 0,
      harvestedMana: 0,
      xpOrb: null,
      lastCollectedXpOrb: null,
      nextXpOrbId: 1,
      lastXpGain: 0,
      lastXpOrbSpawned: false,
      holdClickActive: false,
      holdClickTimer: 0,
      revealAnimating: false,
    },
    snakeSkills: {
      speed: 0,
      speedSetting: 0,
      gridSize: 0,
      foodCount: 0,
      growthThreshold: 0,
      automation: 0,
      automationEnabled: true,
      baseMultiplier: 0,
      bonusFruit: 0,
      extraLife: 0,
      edgeWrap: 0,
    },
    snake: {
      running: false,
      score: 0,
      best: 0,
      comboSteps: 0,
      foodsEatenTowardGrowth: 0,
      extraLivesUsed: 0,
      invincibleTimer: 0,
      gridSize: snakeGridSize,
      body: snakeBody,
      direction: 'right',
      nextDirection: 'right',
      foods: initialSnakeFood ? [initialSnakeFood] : [],
      bonusFood: null,
      moveTimer: 0,
      moveFrame: 0,
      lastReward: 0,
    },
    runeTyping: {
      wordIndex: 0,
      typed: '',
      completedWords: 0,
      combo: 0,
      penaltyWordsRemaining: 0,
      currentWordHadMistake: false,
      lastReward: 0,
      lastCompletedWord: null,
      lastFeedback: 'idle',
    },
    defenseSkills: {
      damage: 0,
      damageMultiplier: 0,
      attackSpeed: 0,
      range: 0,
      criticalChance: 0,
      criticalMultiplier: 0,
      superCriticalChance: 0,
      superCriticalMultiplier: 0,
      lightningDamage: 0,
      lightningSpeed: 0,
      lightningCount: 0,
      iceDamage: 0,
      iceSpeed: 0,
      iceRange: 0,
      iceSlow: 0,
      health: 0,
      healthRegen: 0,
      moneyPerEnemy: 0,
      goldMultiplier: 0,
      baseSpeed: 0,
    },
    defense: {
      running: false,
      paused: false,
      deathTimer: 0,
      wave: 1,
      level: 0,
      xp: 0,
      lastXpGain: 0,
      speedMultiplier: 1,
      baseSpeedEnabled: true,
      debugTowerHealthEnabled: false,
      towerHealth: 3,
      score: 0,
      best: 0,
      spawnTimer: 0,
      nextSpawnDelay: 0,
      spawnedThisWave: 0,
      killsThisWave: 0,
      cleanupPulse: 0,
      nextEnemyId: 1,
      nextEnemyProjectileId: 1,
      nextLightningStrikeId: 1,
      nextDamagePopupId: 1,
      nextMoneyPopupId: 1,
      lastGoldBoostWave: 0,
      lastReward: 0,
      shotPulse: 0,
      lightningCooldown: 0,
      lightningBurstCharges: 0,
      lightningBurstCooldown: 0,
      lightningBurstTargetIds: [],
      iceCooldown: 0,
      shots: [],
      enemyProjectiles: [],
      lightningStrikes: [],
      queuedShots: [],
      tower: {
        id: 'unique',
        range: 0.552,
        cooldown: 0,
      },
      enemies: [],
      damagePopups: [],
      moneyPopups: [],
    },
    blackjack: {
      deck: [],
      playerHand: [],
      splitHand: null,
      dealerHand: [],
      phase: 'idle',
      round: 0,
      baseBetLevel: 1,
      activeHand: 'primary',
      playerBet: 0,
      splitBet: 0,
      playerHandDone: false,
      splitHandDone: false,
      playerHandDoubled: false,
      splitHandDoubled: false,
      dealerCardRevealed: false,
      lastReward: 0,
      lastOutcome: 'En attente',
      lastDebtPayment: 0,
      winStreak: 0,
      debt: 0,
      actions: {
        unlocked: false,
        level: 0,
        xp: 0,
        autoEnabled: false,
        activatedThisHand: false,
        lastOutcome: 'Verrouille',
        lastPayout: 0,
        lastXp: 0,
      },
      pair: {
        unlocked: false,
        level: 0,
        xp: 0,
        autoEnabled: false,
        activatedThisHand: false,
        lastOutcome: 'Verrouille',
        lastPayout: 0,
        lastXp: 0,
      },
      twentyOneThree: {
        unlocked: false,
        level: 0,
        xp: 0,
        autoEnabled: false,
        activatedThisHand: false,
        lastOutcome: 'Verrouille',
        lastPayout: 0,
        lastXp: 0,
      },
      upgradeCells: {
        wagerBase: 1,
        wagerWin: 1,
        wagerNatural: 1,
        wagerStreak: 1,
        wagerDebt: 1,
        actionStand: 1,
        actionDouble: 1,
        actionSplit: 1,
        actionFaceSplit: 1,
        actionMastery: 1,
        autoDeal: 1,
        autoSpeed: 1,
        pairUnlock: 1,
        pairPayout: 1,
        pairXp: 1,
        pairRefund: 1,
        pairAuto: 1,
        twentyOneThreeUnlock: 1,
        twentyOneThreePayout: 1,
        twentyOneThreeXp: 1,
        twentyOneThreeJackpot: 1,
        twentyOneThreeAuto: 1,
      },
    },
    hundred: {
      total: 0,
      attempts: 0,
      wins: 0,
      bestTotal: 0,
      lastRoll: 0,
      lastOption: null,
      lastReward: 0,
      lastOutcome: 'idle',
    },
    runnerMeta: {
      coins: 0,
      bestDistance: 0,
      lastRunCoins: 0,
      lastRunDistance: 0,
      selectedCheckpoint: 0,
      upgrades: createInitialRunnerUpgrades(),
    },
    miningSkills: {
      pickaxeForce: 0,
      pickaxeMultiplier: 0,
      splashDamage: 0,
      criticalChance: 0,
      criticalMultiplier: 0,
      holdClick: 0,
      automation: 0,
      multiAutoClicker: 0,
      resourceBonus: 0,
      resourceMultiplier: 0,
      holoChance: 0,
      rainbowChance: 0,
      negativeChance: 0,
      bombChance: 0,
      bombRange: 0,
      bombPower: 0,
      meteorite: 0,
      meteoriteBonus: 0,
      automationTimer: 0,
      autoDigCount: 0,
    },
    runner: createRunnerRunState(createInitialRunnerUpgrades()),
    mining: {
      blocks: createInitialMiningBlocks(),
      materials: createInitialMiningMaterials(),
      blockTypeXp: createInitialMiningBlockTypeXp(),
      terrainCycle: 1,
      totalMined: 0,
      deepestLayer: 1,
      lastReward: 0,
      lastBrokenDepth: 0,
      hitPulse: 0,
      hitFeedback: [],
      breakFeedback: [],
      frontierTimer: MINING_FRONTIER_TIME_LIMIT,
      frontierFailPulse: 0,
      bombPulse: 0,
      bombFeedback: [],
      meteoriteClicks: 0,
      meteoritePulse: 0,
      meteoriteImpactTimers: [],
      meteoriteDamageBonus: 1,
    },
    slimeTrainer: {
      level: 1,
      xp: 0,
      victories: 0,
      turn: 'player',
      enemyTurnTimer: 0,
      slimeHealth: 10,
      slimeMaxHealth: 10,
      enemy: slimeTrainerEnemyForVictoryCount(0, 1),
      lastCommand: null,
      lastDamage: 0,
      lastEnemyDamage: 0,
      lastXp: 0,
      lastReward: 0,
      lastOutcome: 'idle',
      hitPulse: 0,
    },
    lastTick: performance.now(),
  };
}

function cellKey(cell: SnakeCell): string {
  return `${cell.x}:${cell.y}`;
}
