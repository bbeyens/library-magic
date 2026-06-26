export type SlimeTrainerCommandId = 'bounce' | 'shell' | 'bubble' | 'split';
export type SlimeTrainerEnemyId = 'mossSpine' | 'dustImp' | 'inkMite' | 'thornBlob';

export interface SlimeTrainerCommand {
  id: SlimeTrainerCommandId;
  name: string;
  unlockLevel: number;
  description: string;
  baseDamage: number;
}

export interface SlimeTrainerEnemyDefinition {
  id: SlimeTrainerEnemyId;
  name: string;
  baseHealth: number;
  baseXp: number;
  baseGel: number;
}

export interface SlimeTrainerEnemy {
  id: SlimeTrainerEnemyId;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
}

export const SLIME_TRAINER_COMMANDS: SlimeTrainerCommand[] = [
  {
    id: 'bounce',
    name: 'Bondir',
    unlockLevel: 1,
    description: 'Une attaque simple.',
    baseDamage: 2,
  },
  {
    id: 'shell',
    name: 'Carapace',
    unlockLevel: 2,
    description: 'Un coup prudent.',
    baseDamage: 3,
  },
  {
    id: 'bubble',
    name: 'Bulle',
    unlockLevel: 4,
    description: 'Une bulle lourde.',
    baseDamage: 5,
  },
  {
    id: 'split',
    name: 'Division',
    unlockLevel: 6,
    description: 'Deux frappes en une.',
    baseDamage: 7,
  },
];

const SLIME_TRAINER_ENEMIES: SlimeTrainerEnemyDefinition[] = [
  { id: 'mossSpine', name: 'Mousse-Pique', baseHealth: 4, baseXp: 3, baseGel: 2 },
  { id: 'dustImp', name: 'Poussiereux', baseHealth: 6, baseXp: 4, baseGel: 3 },
  { id: 'inkMite', name: 'Mite d encre', baseHealth: 8, baseXp: 5, baseGel: 4 },
  { id: 'thornBlob', name: 'Blob-Ronce', baseHealth: 10, baseXp: 6, baseGel: 5 },
];

export function slimeTrainerAvailableCommands(level: number): SlimeTrainerCommand[] {
  return SLIME_TRAINER_COMMANDS.filter((command) => command.unlockLevel <= Math.max(1, level));
}

export function slimeTrainerCommandById(commandId: SlimeTrainerCommandId): SlimeTrainerCommand {
  const command = SLIME_TRAINER_COMMANDS.find((candidate) => candidate.id === commandId);
  if (!command) {
    throw new Error(`Unknown slime command: ${commandId}`);
  }
  return command;
}

export function slimeTrainerCommandUnlocked(commandId: SlimeTrainerCommandId, level: number): boolean {
  return slimeTrainerCommandById(commandId).unlockLevel <= Math.max(1, level);
}

export function slimeTrainerCommandDamage(commandId: SlimeTrainerCommandId, level: number): number {
  const command = slimeTrainerCommandById(commandId);
  return command.baseDamage + Math.floor(Math.max(1, level) * 0.6);
}

export function slimeTrainerXpToNextLevel(level: number): number {
  return 5 + Math.max(0, level - 1) * 3;
}

export function slimeTrainerEnemyForVictoryCount(victories: number, slimeLevel: number): SlimeTrainerEnemy {
  const safeVictories = Math.max(0, victories);
  const definition = SLIME_TRAINER_ENEMIES[safeVictories % SLIME_TRAINER_ENEMIES.length];
  const cycle = Math.floor(safeVictories / SLIME_TRAINER_ENEMIES.length);
  const level = Math.max(1, Math.min(slimeLevel + cycle, slimeLevel + 2));
  const maxHealth = definition.baseHealth + cycle * 3 + Math.floor(Math.max(1, slimeLevel) * 0.8);
  return {
    id: definition.id,
    name: definition.name,
    level,
    health: maxHealth,
    maxHealth,
  };
}

export function slimeTrainerXpReward(enemy: SlimeTrainerEnemy, slimeLevel: number): number {
  const definition = enemyDefinition(enemy.id);
  return definition.baseXp + Math.floor(enemy.maxHealth / 5) + Math.max(0, enemy.level - slimeLevel);
}

export function slimeTrainerResourceReward(enemy: SlimeTrainerEnemy, slimeLevel: number): number {
  const definition = enemyDefinition(enemy.id);
  return definition.baseGel + Math.floor(Math.max(1, slimeLevel) / 3) + Math.floor(enemy.maxHealth / 8);
}

export function slimeTrainerEnemyAttackDamage(enemy: SlimeTrainerEnemy, slimeLevel: number): number {
  return Math.max(1, Math.floor(enemy.level * 0.8) + Math.floor(enemy.maxHealth / 8) - Math.floor(Math.max(1, slimeLevel) / 4));
}

function enemyDefinition(enemyId: SlimeTrainerEnemyId): SlimeTrainerEnemyDefinition {
  const definition = SLIME_TRAINER_ENEMIES.find((candidate) => candidate.id === enemyId);
  if (!definition) {
    throw new Error(`Unknown slime enemy: ${enemyId}`);
  }
  return definition;
}
