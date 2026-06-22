import type { BookId, ResourceId } from '../content/books';

export interface BookState {
  level: number;
  automation: number;
  pinned: boolean;
  unlocked: boolean;
  charge: number;
}

export interface SnakeState {
  running: boolean;
  score: number;
  best: number;
  gridSize: number;
  body: SnakeCell[];
  direction: SnakeDirection;
  nextDirection: SnakeDirection;
  food: SnakeCell;
  moveTimer: number;
  lastReward: number;
}

export type SnakeDirection = 'up' | 'right' | 'down' | 'left';

export interface SnakeCell {
  x: number;
  y: number;
}

export interface GameState {
  mana: number;
  resources: Record<ResourceId, number>;
  selectedBook: BookId;
  books: Record<BookId, BookState>;
  snake: SnakeState;
  lastTick: number;
}

export function createInitialState(): GameState {
  return {
    mana: 0,
    resources: {
      scales: 0,
      runes: 0,
      spores: 0,
    },
    selectedBook: 'mana',
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
    snake: {
      running: false,
      score: 0,
      best: 0,
      gridSize: 9,
      body: [
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 2, y: 4 },
      ],
      direction: 'right',
      nextDirection: 'right',
      food: { x: 6, y: 4 },
      moveTimer: 0,
      lastReward: 0,
    },
    lastTick: performance.now(),
  };
}
