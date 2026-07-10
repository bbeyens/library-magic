import type { BookId, ResourceId } from '../content/books';
import type { ForbiddenOfferingResourceId } from '../content/forbiddenGrimoire';
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
}

export interface SnakeSkillsState {
  speed: number;
  gridSize: number;
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
  extraLivesUsed: number;
  invincibleTimer: number;
  gridSize: number;
  body: SnakeCell[];
  direction: SnakeDirection;
  nextDirection: SnakeDirection;
  food: SnakeCell | null;
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

export interface TargetInstance {
  id: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
}

export interface TargetSkillsState {
  spawnSpeed: number;
  targetCount: number;
  damage: number;
  automation: number;
}

export interface TargetState {
  running: boolean;
  score: number;
  best: number;
  spawnTimer: number;
  automationTimer: number;
  nextTargetId: number;
  lastReward: number;
  shotPulse: number;
  targets: TargetInstance[];
}

export interface MiningBlock {
  id: number;
  depth: number;
  material: MiningBlockMaterialId;
  layersRemaining: number;
  health: number;
  maxHealth: number;
  lastHit: number;
}

export interface MiningSkillsState {
  pickaxeForce: number;
  splashDamage: number;
  automation: number;
  automationTimer: number;
  autoDigCount: number;
}

export interface MiningState {
  blocks: MiningBlock[];
  materials: Record<MiningMaterialResourceId, number>;
  terrainCycle: number;
  totalMined: number;
  deepestLayer: number;
  lastReward: number;
  lastBrokenDepth: number;
  hitPulse: number;
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
  targetSkills: TargetSkillsState;
  targets: TargetState;
  miningSkills: MiningSkillsState;
  mining: MiningState;
  slimeTrainer: SlimeTrainerState;
  lastTick: number;
}

export const SNAKE_BASE_GRID_SIZE = 4;
export const SNAKE_MAX_GRID_SIZE = 9;
export const MINING_GRID_COLUMNS = 6;
export const MINING_GRID_ROWS = 6;
export const MINING_TERRAIN_LAYER_COUNT = 5;
export const MINING_SPRITE_LAYER_SIZE = 5;

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

export function createInitialMiningMaterials(): Record<MiningMaterialResourceId, number> {
  return Object.fromEntries(MINING_MATERIAL_RESOURCE_IDS.map((resourceId) => [resourceId, 0])) as Record<MiningMaterialResourceId, number>;
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

export function createInitialMiningBlocks(terrainCycle = 1): MiningBlock[] {
  const startDepth = Math.max(1, Math.floor(terrainCycle - 1) * MINING_TERRAIN_LAYER_COUNT + 1);
  return Array.from({ length: MINING_GRID_COLUMNS * MINING_GRID_ROWS }, (_, id) => {
    const maxHealth = miningBlockMaxHealth(startDepth);
    const material = miningBlockMaterialForDepth(startDepth);
    return {
      id,
      depth: startDepth,
      material: material.id,
      layersRemaining: MINING_TERRAIN_LAYER_COUNT,
      health: maxHealth,
      maxHealth,
      lastHit: 0,
    };
  });
}

export function createInitialState(): GameState {
  const snakeGridSize = snakeGridSizeForLevel(0);
  const snakeBody = createStartingSnakeBody(snakeGridSize);

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
      targets: {
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
    },
    snakeSkills: {
      speed: 0,
      gridSize: 0,
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
      extraLivesUsed: 0,
      invincibleTimer: 0,
      gridSize: snakeGridSize,
      body: snakeBody,
      direction: 'right',
      nextDirection: 'right',
      food: randomSnakeFood(snakeBody, snakeGridSize),
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
    targetSkills: {
      spawnSpeed: 0,
      targetCount: 0,
      damage: 0,
      automation: 0,
    },
    miningSkills: {
      pickaxeForce: 0,
      splashDamage: 0,
      automation: 0,
      automationTimer: 0,
      autoDigCount: 0,
    },
    targets: {
      running: false,
      score: 0,
      best: 0,
      spawnTimer: 0,
      automationTimer: 0,
      nextTargetId: 1,
      lastReward: 0,
      shotPulse: 0,
      targets: [],
    },
    mining: {
      blocks: createInitialMiningBlocks(),
      materials: createInitialMiningMaterials(),
      terrainCycle: 1,
      totalMined: 0,
      deepestLayer: 1,
      lastReward: 0,
      lastBrokenDepth: 0,
      hitPulse: 0,
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
