import type { DefenseEnemy, DefenseSpeedMultiplier } from './state';

export type DefensePoint = {
  x: number;
  y: number;
};

const DEFENSE_CENTER = 50;
const DEFENSE_HALF_SIZE = 50;
const DEFENSE_TOWER_HITBOX = {
  minX: 38,
  maxX: 62,
  minY: 30,
  maxY: 66,
};

export function defenseEnemyEdgePoint(lane: number): DefensePoint {
  const radians = (lane * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);
  const scale = DEFENSE_HALF_SIZE / Math.max(Math.abs(dx), Math.abs(dy), 0.001);

  return {
    x: clampPercent(DEFENSE_CENTER + dx * scale),
    y: clampPercent(DEFENSE_CENTER + dy * scale),
  };
}

export function defenseEnemyPosition(enemy: Pick<DefenseEnemy, 'lane' | 'distance'>): DefensePoint {
  const edge = defenseEnemyEdgePoint(enemy.lane);
  const distance = Math.max(0, Math.min(1, enemy.distance));

  return {
    x: DEFENSE_CENTER + (edge.x - DEFENSE_CENTER) * distance,
    y: DEFENSE_CENTER + (edge.y - DEFENSE_CENTER) * distance,
  };
}

export function defenseEnemyInTowerRange(enemy: Pick<DefenseEnemy, 'lane' | 'distance'>, range: number): boolean {
  const position = defenseEnemyPosition(enemy);
  const distanceFromCenter = Math.hypot(position.x - DEFENSE_CENTER, position.y - DEFENSE_CENTER) / DEFENSE_HALF_SIZE;
  return distanceFromCenter <= range;
}

export function defenseEnemyInTowerHitbox(enemy: Pick<DefenseEnemy, 'lane' | 'distance'>): boolean {
  const position = defenseEnemyPosition(enemy);
  return (
    position.x >= DEFENSE_TOWER_HITBOX.minX &&
    position.x <= DEFENSE_TOWER_HITBOX.maxX &&
    position.y >= DEFENSE_TOWER_HITBOX.minY &&
    position.y <= DEFENSE_TOWER_HITBOX.maxY
  );
}

export function nextDefenseSpeedMultiplier(current: number): DefenseSpeedMultiplier {
  if (current === 1) {
    return 2;
  }
  if (current === 2) {
    return 4;
  }
  return 1;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(3))));
}
