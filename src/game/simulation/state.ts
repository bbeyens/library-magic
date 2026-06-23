import type { BookId, ResourceId } from '../content/books';

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

export type SnakeDirection = 'up' | 'right' | 'down' | 'left';
export type SnakeBonusFruitType = 'orange' | 'pear' | 'banana';
export type RuneTypingFeedback = 'idle' | 'correct' | 'mistake' | 'complete';

export interface SnakeBonusFood {
  cell: SnakeCell;
  type: SnakeBonusFruitType;
}

export interface SnakeCell {
  x: number;
  y: number;
}

export type BookPanelSlot = 'left' | 'right';

export interface OpenBookPanel {
  bookId: BookId;
  slot: BookPanelSlot;
}

export interface GameState {
  mana: number;
  resources: Record<ResourceId, number>;
  selectedBook: BookId;
  openBookPanels: OpenBookPanel[];
  books: Record<BookId, BookState>;
  manaSkills: ManaSkillsState;
  snakeSkills: SnakeSkillsState;
  snake: SnakeState;
  runeTyping: RuneTypingState;
  lastTick: number;
}

export function createStartingSnakeBody(): SnakeCell[] {
  return [
    { x: 4, y: 4 },
    { x: 3, y: 4 },
    { x: 2, y: 4 },
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

export function createInitialState(): GameState {
  const snakeBody = createStartingSnakeBody();
  const snakeGridSize = 9;

  return {
    mana: 0,
    resources: {
      scales: 0,
      runes: 0,
      spores: 0,
    },
    selectedBook: 'mana',
    openBookPanels: [{ bookId: 'mana', slot: 'right' }],
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
    lastTick: performance.now(),
  };
}

function cellKey(cell: SnakeCell): string {
  return `${cell.x}:${cell.y}`;
}
