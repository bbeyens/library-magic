import { books, getBook, type BookId } from '../content/books';
import type { GameState } from './state';

export type GameAction =
  | { type: 'selectBook'; bookId: BookId }
  | { type: 'chargeMana' }
  | { type: 'buyUpgrade'; bookId: BookId }
  | { type: 'togglePin'; bookId: BookId }
  | { type: 'unlockBook'; bookId: BookId }
  | { type: 'snakeStep' }
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
    case 'snakeStep':
      snakeStep(state);
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

function snakeStep(state: GameState): void {
  const book = state.books.serpent;
  if (!book.unlocked) {
    return;
  }
  state.snake.running = true;
  state.snake.cursor = (state.snake.cursor + 1) % 17;
  const gain = 1 + Math.floor(state.snake.cursor / 4) + book.level;
  state.snake.score += gain;
  state.snake.best = Math.max(state.snake.best, state.snake.score);
  state.resources.scales += 0.45 + book.level * 0.12;
  state.mana += 0.8 + book.level * 0.18;
  if (state.snake.score >= 55) {
    state.snake.score = 0;
  }
}

function grantDebugResources(state: GameState): void {
  state.mana += 999;
  state.resources.scales += 999;
  state.resources.runes += 999;
  state.resources.spores += 999;
}
