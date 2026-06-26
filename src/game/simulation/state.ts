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

export interface ManaSkillsState {
  power: number;
  automation: number;
  criticalHit: number;
  criticalEffect: number;
  extraWands: number;
  automationTimer: number;
  autoCastCount: number;
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
  food: SnakeCell;
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
  lane: number;
  distance: number;
  health: number;
  maxHealth: number;
  state: 'walking' | 'dying';
  deathTimer: number;
}

export interface DefenseShot {
  id: number;
  lane: number;
  distance: number;
  timer: number;
}

export interface DefenseTowerState {
  id: 'unique';
  range: number;
  cooldown: number;
}

export type DefenseSpeedMultiplier = 1 | 2 | 4;

export interface DefenseState {
  running: boolean;
  wave: number;
  speedMultiplier: DefenseSpeedMultiplier;
  towerHealth: number;
  score: number;
  best: number;
  spawnTimer: number;
  spawnedThisWave: number;
  nextEnemyId: number;
  lastReward: number;
  shotPulse: number;
  shot: DefenseShot | null;
  tower: DefenseTowerState;
  enemies: DefenseEnemy[];
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
export type SnakeBonusFruitType = 'orange' | 'pear' | 'banana';
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
  snakeSkills: SnakeSkillsState;
  snake: SnakeState;
  runeTyping: RuneTypingState;
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
export const MINING_GRID_COLUMNS = 3;
export const MINING_GRID_ROWS = 5;

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

export function randomSnakeFood(body: SnakeCell[], gridSize: number): SnakeCell {
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
    return { x: 0, y: 0 };
  }

  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

export function miningBlockMaxHealth(depth: number): number {
  const layer = Math.max(1, depth);
  return 3 + Math.floor((layer - 1) * 1.45) + Math.floor((layer - 1) * (layer - 1) * 0.08);
}

export function createInitialMiningBlocks(): MiningBlock[] {
  return Array.from({ length: MINING_GRID_COLUMNS * MINING_GRID_ROWS }, (_, id) => {
    const maxHealth = miningBlockMaxHealth(1);
    return {
      id,
      depth: 1,
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
        unlocked: false,
        charge: 0,
      },
      typing: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
      herbarium: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
      defense: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
      blackjack: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
      hundred: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
      mine: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
      targets: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
      slimeTrainer: {
        level: 1,
        automation: 0,
        pinned: false,
        unlocked: false,
        charge: 0,
      },
    },
    manaSkills: {
      power: 0,
      automation: 0,
      criticalHit: 0,
      criticalEffect: 0,
      extraWands: 0,
      automationTimer: 0,
      autoCastCount: 0,
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
    defense: {
      running: false,
      wave: 1,
      speedMultiplier: 1,
      towerHealth: 10,
      score: 0,
      best: 0,
      spawnTimer: 0,
      spawnedThisWave: 0,
      nextEnemyId: 1,
      lastReward: 0,
      shotPulse: 0,
      shot: null,
      tower: {
        id: 'unique',
        range: 0.68,
        cooldown: 0,
      },
      enemies: [],
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
