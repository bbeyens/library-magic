export type BookId = 'mana' | 'serpent' | 'typing' | 'herbarium';

export type ResourceId = 'scales' | 'runes' | 'spores';

export interface BookDefinition {
  id: BookId;
  name: string;
  subtitle: string;
  resourceId?: ResourceId;
  resourceName?: string;
  icon: 'drop' | 'coil' | 'spark' | 'leaf';
  color: number;
  accent: string;
  shelf: number;
  slot: number;
  unlockMana: number;
  unlockResource?: {
    id: ResourceId;
    amount: number;
  };
}

export const books: BookDefinition[] = [
  {
    id: 'mana',
    name: 'Grimoire de Mana',
    subtitle: 'Concentre la Mana et nourrit toute la bibliotheque.',
    icon: 'drop',
    color: 0x4aa8ff,
    accent: '#70c7ff',
    shelf: 0,
    slot: 0,
    unlockMana: 0,
  },
  {
    id: 'serpent',
    name: 'Livre du Serpent',
    subtitle: 'Ramasse des orbes sans vraie defaite.',
    resourceId: 'scales',
    resourceName: 'Ecailles',
    icon: 'coil',
    color: 0x9a7dd9,
    accent: '#a78cff',
    shelf: 0,
    slot: 1,
    unlockMana: 70,
  },
  {
    id: 'typing',
    name: 'Arc Typing',
    subtitle: 'Tape des glyphes courts pour fabriquer des runes.',
    resourceId: 'runes',
    resourceName: 'Runes',
    icon: 'spark',
    color: 0xd77be8,
    accent: '#ed9fff',
    shelf: 0,
    slot: 2,
    unlockMana: 180,
    unlockResource: { id: 'scales', amount: 10 },
  },
  {
    id: 'herbarium',
    name: 'Herbier Enchante',
    subtitle: 'Cultive une production lente et douce.',
    resourceId: 'spores',
    resourceName: 'Spores',
    icon: 'leaf',
    color: 0x73b86b,
    accent: '#91d980',
    shelf: 1,
    slot: 0,
    unlockMana: 280,
    unlockResource: { id: 'runes', amount: 12 },
  },
];

export function getBook(id: BookId): BookDefinition {
  const book = books.find((candidate) => candidate.id === id);
  if (!book) {
    throw new Error(`Unknown book: ${id}`);
  }
  return book;
}
