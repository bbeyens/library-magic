import type { BookId, ResourceId } from './books';

export type ForbiddenOfferingResourceId = 'mana' | ResourceId;

export interface ForbiddenGrimoireRequirement {
  id: ForbiddenOfferingResourceId;
  amount: number;
}

export interface ForbiddenGrimoireSeal {
  level: number;
  unlocksBookId: BookId;
  requirements: ForbiddenGrimoireRequirement[];
}

export const forbiddenGrimoireSeals: ForbiddenGrimoireSeal[] = [
  { level: 1, unlocksBookId: 'serpent', requirements: [{ id: 'mana', amount: 70 }] },
  { level: 2, unlocksBookId: 'typing', requirements: [{ id: 'mana', amount: 180 }, { id: 'scales', amount: 10 }] },
  { level: 3, unlocksBookId: 'herbarium', requirements: [{ id: 'mana', amount: 280 }, { id: 'runes', amount: 12 }] },
  { level: 4, unlocksBookId: 'defense', requirements: [{ id: 'mana', amount: 420 }, { id: 'spores', amount: 14 }] },
  { level: 5, unlocksBookId: 'blackjack', requirements: [{ id: 'mana', amount: 620 }, { id: 'sigils', amount: 16 }] },
  { level: 6, unlocksBookId: 'hundred', requirements: [{ id: 'mana', amount: 860 }, { id: 'chips', amount: 18 }] },
  { level: 7, unlocksBookId: 'mine', requirements: [{ id: 'mana', amount: 1120 }, { id: 'fragments', amount: 20 }] },
  { level: 8, unlocksBookId: 'runner', requirements: [{ id: 'mana', amount: 1380 }, { id: 'minerals', amount: 22 }] },
  { level: 9, unlocksBookId: 'slimeTrainer', requirements: [{ id: 'mana', amount: 1680 }, { id: 'marks', amount: 24 }] },
];

export function getForbiddenGrimoireSeal(level: number): ForbiddenGrimoireSeal | null {
  return forbiddenGrimoireSeals.find((seal) => seal.level === level) ?? null;
}

export function getForbiddenGrimoireSealForBook(bookId: BookId): ForbiddenGrimoireSeal | null {
  return forbiddenGrimoireSeals.find((seal) => seal.unlocksBookId === bookId) ?? null;
}
