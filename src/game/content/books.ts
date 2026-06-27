export type BookId =
  | 'mana'
  | 'serpent'
  | 'typing'
  | 'herbarium'
  | 'defense'
  | 'blackjack'
  | 'hundred'
  | 'mine'
  | 'targets'
  | 'slimeTrainer';

export type ResourceId = 'scales' | 'runes' | 'spores' | 'sigils' | 'chips' | 'fragments' | 'minerals' | 'marks' | 'gels';

export interface BookDefinition {
  id: BookId;
  name: string;
  subtitle: string;
  resourceId?: ResourceId;
  resourceName?: string;
  icon: 'drop' | 'coil' | 'spark' | 'leaf' | 'tower' | 'card' | 'number' | 'target' | 'pickaxe' | 'slime';
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
  {
    id: 'defense',
    name: 'Bastion Arcanique',
    subtitle: 'Une tour unique grave des sceaux en repoussant les vagues.',
    resourceId: 'sigils',
    resourceName: 'Sceaux',
    icon: 'tower',
    color: 0xf2b35f,
    accent: '#ffc36e',
    shelf: 1,
    slot: 1,
    unlockMana: 420,
    unlockResource: { id: 'spores', amount: 14 },
  },
  {
    id: 'blackjack',
    name: 'Table du Blackjack',
    subtitle: 'Tire, reste, et grave des jetons arcanes.',
    resourceId: 'chips',
    resourceName: 'Jetons',
    icon: 'card',
    color: 0x4e8f66,
    accent: '#74d88f',
    shelf: 1,
    slot: 2,
    unlockMana: 620,
    unlockResource: { id: 'sigils', amount: 16 },
  },
  {
    id: 'hundred',
    name: 'Calcul du Cent',
    subtitle: 'Atteins 100 avec des tirages de plus en plus maitrises.',
    resourceId: 'fragments',
    resourceName: 'Fragments',
    icon: 'number',
    color: 0x4f79d8,
    accent: '#7ea4ff',
    shelf: 2,
    slot: 0,
    unlockMana: 860,
    unlockResource: { id: 'chips', amount: 18 },
  },
  {
    id: 'mine',
    name: 'Mine des Profondeurs',
    subtitle: 'Creuse, stocke les materiaux, puis echange-les en monnaie de mine.',
    resourceId: 'minerals',
    resourceName: 'Pieces de mine',
    icon: 'pickaxe',
    color: 0x9d6b41,
    accent: '#d69a58',
    shelf: 2,
    slot: 1,
    unlockMana: 1120,
    unlockResource: { id: 'fragments', amount: 20 },
  },
  {
    id: 'targets',
    name: 'Galerie des Cibles',
    subtitle: 'Clique les cibles, monte les degats, puis automatise le tir.',
    resourceId: 'marks',
    resourceName: 'Marques',
    icon: 'target',
    color: 0xd8505a,
    accent: '#ff7a80',
    shelf: 2,
    slot: 2,
    unlockMana: 1380,
    unlockResource: { id: 'minerals', amount: 22 },
  },
  {
    id: 'slimeTrainer',
    name: 'Slime Trainer',
    subtitle: 'Entraine un slime dans des duels de monstres.',
    resourceId: 'gels',
    resourceName: 'Gels',
    icon: 'slime',
    color: 0x66d88a,
    accent: '#7df0a3',
    shelf: 2,
    slot: 3,
    unlockMana: 1680,
    unlockResource: { id: 'marks', amount: 24 },
  },
];

export function getBook(id: BookId): BookDefinition {
  const book = books.find((candidate) => candidate.id === id);
  if (!book) {
    throw new Error(`Unknown book: ${id}`);
  }
  return book;
}
