import type { RunnerRunState } from './state';

export const RUNNER_MONSTER_MODEL_IDS = [
  'beholder',
  'cactus',
  'chest-monster',
  'skeleton-warrior',
] as const;

export type RunnerMonsterModelId = (typeof RUNNER_MONSTER_MODEL_IDS)[number];

interface RunnerEnemyCollisionProfile {
  halfWidth: number;
  halfDepth: number;
}

/** Bounds of each model after the renderer normalizes it to 1.05 world units tall. */
const RUNNER_ENEMY_COLLISION_PROFILES: Record<RunnerMonsterModelId, RunnerEnemyCollisionProfile> = {
  beholder: { halfWidth: 0.61, halfDepth: 0.44 },
  cactus: { halfWidth: 0.84, halfDepth: 0.29 },
  'chest-monster': { halfWidth: 0.42, halfDepth: 0.38 },
  'skeleton-warrior': { halfWidth: 0.24, halfDepth: 0.28 },
};

const RUNNER_PROJECTILE_COLLISION_RADIUS = 0.06;

export function runnerEnemyModelId(
  enemyId: number,
  explicitModelId?: RunnerMonsterModelId,
): RunnerMonsterModelId {
  if (explicitModelId) {
    return explicitModelId;
  }
  const index = Math.abs(Math.floor(enemyId)) % RUNNER_MONSTER_MODEL_IDS.length;
  return RUNNER_MONSTER_MODEL_IDS[index] ?? 'beholder';
}

export function runnerEnemyCollisionBounds(
  enemyId: number,
  explicitModelId?: RunnerMonsterModelId,
  scale = 1,
): RunnerEnemyCollisionProfile {
  const profile = RUNNER_ENEMY_COLLISION_PROFILES[runnerEnemyModelId(enemyId, explicitModelId)];
  const safeScale = Math.max(0, scale);
  return {
    halfWidth: profile.halfWidth * safeScale + RUNNER_PROJECTILE_COLLISION_RADIUS,
    halfDepth: profile.halfDepth * safeScale + RUNNER_PROJECTILE_COLLISION_RADIUS,
  };
}

export interface RunnerEditorMonsterConfig {
  modelId: RunnerMonsterModelId;
  x: number;
  distance: number;
  health: number;
  contactDamage: number;
  coinReward: number;
  scale: number;
  speedMultiplier: number;
}

export interface RunnerEditorConfig {
  version: 1;
  monsters: RunnerEditorMonsterConfig[];
}

export function runnerEditorConfigFromRun(run: RunnerRunState): RunnerEditorConfig {
  return {
    version: 1,
    monsters: run.enemies
      .filter((enemy) => enemy.editorPlaced)
      .map((enemy) => ({
        modelId: enemy.modelId ?? 'beholder',
        x: roundEditorNumber(enemy.x),
        distance: roundEditorNumber(enemy.z - run.distance),
        health: roundEditorNumber(enemy.maxHealth),
        contactDamage: roundEditorNumber(enemy.contactDamage ?? 1),
        coinReward: roundEditorNumber(enemy.coinReward ?? 1),
        scale: roundEditorNumber(enemy.scale ?? 1),
        speedMultiplier: roundEditorNumber(enemy.speedMultiplier ?? 1),
      })),
  };
}

const MAX_EDITOR_MONSTERS = 200;

export function serializeRunnerEditorConfig(config: RunnerEditorConfig): string {
  return JSON.stringify(parseRunnerEditorConfig(JSON.stringify(config)), null, 2);
}

export function parseRunnerEditorConfig(json: string): RunnerEditorConfig {
  const value: unknown = JSON.parse(json);
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.monsters)) {
    throw new Error('Configuration runner invalide: version 1 attendue.');
  }
  if (value.monsters.length > MAX_EDITOR_MONSTERS) {
    throw new Error(`Configuration runner invalide: ${MAX_EDITOR_MONSTERS} monstres maximum.`);
  }

  return {
    version: 1,
    monsters: value.monsters.map(parseRunnerEditorMonster),
  };
}

function parseRunnerEditorMonster(value: unknown): RunnerEditorMonsterConfig {
  if (!isRecord(value) || !isRunnerMonsterModelId(value.modelId)) {
    throw new Error('Configuration runner invalide: modèle de monstre inconnu.');
  }

  return {
    modelId: value.modelId,
    x: requiredNumber(value.x, 'x', -2.4, 2.4),
    distance: requiredNumber(value.distance, 'distance', -2, 64),
    health: requiredNumber(value.health, 'health', 1, 1_000_000),
    contactDamage: requiredNumber(value.contactDamage, 'contactDamage', 1, 60),
    coinReward: requiredNumber(value.coinReward, 'coinReward', 0, 1_000_000),
    scale: requiredNumber(value.scale, 'scale', 0.25, 3),
    speedMultiplier: requiredNumber(value.speedMultiplier, 'speedMultiplier', 0, 4),
  };
}

function requiredNumber(value: unknown, label: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new Error(`Configuration runner invalide: ${label} doit être compris entre ${min} et ${max}.`);
  }
  return value;
}

function isRunnerMonsterModelId(value: unknown): value is RunnerMonsterModelId {
  return typeof value === 'string' && RUNNER_MONSTER_MODEL_IDS.includes(value as RunnerMonsterModelId);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function roundEditorNumber(value: number): number {
  return Math.round(value * 100) / 100;
}
