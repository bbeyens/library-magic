import { books, getBook, type BookId } from '../content/books';
import type { GameState, SnakeCell, SnakeDirection } from './state';

export type GameAction =
  | { type: 'selectBook'; bookId: BookId }
  | { type: 'chargeMana' }
  | { type: 'buyUpgrade'; bookId: BookId }
  | { type: 'togglePin'; bookId: BookId }
  | { type: 'unlockBook'; bookId: BookId }
  | { type: 'snakeTurn'; direction: SnakeDirection }
  | { type: 'grantDebugResources' };

export function applyAction(state: GameState, action: GameAction): void {
  switch (action.type) {
    case 'selectBook':
      if (state.books[action.bookId].unlocked) {
        state.selectedBook = action.bookId;
      }
      return;
    case 'chargeMana':
      chargeMana(state);
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
    case 'snakeTurn':
      snakeTurn(state, action.direction);
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

  tickSnake(state, deltaSeconds);
}

function chargeMana(state: GameState): void {
  const book = state.books.mana;
  const gain = 1 + (book.level - 1) * 0.5;
  book.charge = Math.min(book.charge + 12 + book.level * 2, 100);
  state.mana += gain;
}

function buyUpgrade(state: GameState, bookId: BookId): void {
  const book = state.books[bookId];
  if (!book.unlocked) {
    return;
  }

  const definition = getBook(bookId);
  const cost = Math.round(20 * Math.pow(1.55, book.level - 1));
  const resourceCost = Math.round(3 * Math.pow(1.35, book.level - 1));
  if (state.mana < cost) {
    return;
  }
  if (definition.resourceId && state.resources[definition.resourceId] < resourceCost) {
    return;
  }

  state.mana -= cost;
  if (definition.resourceId) {
    state.resources[definition.resourceId] -= resourceCost;
  }
  book.level += 1;
  if (book.level >= 2) {
    book.automation = Math.max(book.automation, 0.35);
  }
  if (book.level >= 4) {
    book.automation += 0.15;
  }
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
  book.unlocked = true;
}

function snakeTurn(state: GameState, direction: SnakeDirection): void {
  const book = state.books.serpent;
  if (!book.unlocked) {
    return;
  }

  if (isOppositeDirection(state.snake.direction, direction)) {
    return;
  }

  state.snake.nextDirection = direction;
  state.snake.running = true;
}

function tickSnake(state: GameState, deltaSeconds: number): void {
  const book = state.books.serpent;
  const snake = state.snake;
  snake.lastReward = 0;

  if (!book.unlocked || state.selectedBook !== 'serpent') {
    return;
  }

  snake.running = true;
  snake.moveTimer += deltaSeconds;
  const moveEvery = Math.max(0.18, 0.48 - book.level * 0.025);
  if (snake.moveTimer < moveEvery) {
    return;
  }
  snake.moveTimer = 0;
  advanceSnake(state);
}

function advanceSnake(state: GameState): void {
  const snake = state.snake;
  const direction = snake.nextDirection;
  const head = snake.body[0];
  const nextHead = nextCell(head, direction);

  if (isOutOfBounds(nextHead, snake.gridSize) || snake.body.some((cell) => cellsMatch(cell, nextHead))) {
    resetSnakeRun(state);
    return;
  }

  snake.direction = direction;
  const ateFood = cellsMatch(nextHead, snake.food);
  snake.body = [nextHead, ...snake.body];

  if (ateFood) {
    const book = state.books.serpent;
    const reward = 1 + Math.floor(book.level * 0.4);
    snake.score += reward;
    snake.best = Math.max(snake.best, snake.score);
    snake.lastReward = reward;
    state.resources.scales += reward;
    state.mana += 1 + book.level * 0.25;
    snake.food = nextFoodCell(snake.body, snake.gridSize);
    return;
  }

  snake.body.pop();
}

function resetSnakeRun(state: GameState): void {
  const snake = state.snake;
  snake.score = 0;
  snake.body = [
    { x: 4, y: 4 },
    { x: 3, y: 4 },
    { x: 2, y: 4 },
  ];
  snake.direction = 'right';
  snake.nextDirection = 'right';
  snake.food = { x: 6, y: 4 };
  snake.moveTimer = 0;
  snake.running = true;
  snake.lastReward = 0;
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

function nextFoodCell(body: SnakeCell[], gridSize: number): SnakeCell {
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const candidate = { x, y };
      if (!body.some((cell) => cellsMatch(cell, candidate))) {
        return candidate;
      }
    }
  }
  return { x: gridSize - 1, y: gridSize - 1 };
}

function isOutOfBounds(cell: SnakeCell, gridSize: number): boolean {
  return cell.x < 0 || cell.y < 0 || cell.x >= gridSize || cell.y >= gridSize;
}

function cellsMatch(first: SnakeCell, second: SnakeCell): boolean {
  return first.x === second.x && first.y === second.y;
}

function isOppositeDirection(current: SnakeDirection, next: SnakeDirection): boolean {
  return (
    (current === 'up' && next === 'down') ||
    (current === 'down' && next === 'up') ||
    (current === 'left' && next === 'right') ||
    (current === 'right' && next === 'left')
  );
}

function grantDebugResources(state: GameState): void {
  state.mana += 999;
  state.resources.scales += 999;
  state.resources.runes += 999;
  state.resources.spores += 999;
}
