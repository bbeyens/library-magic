import type { DefenseEnemy } from './state';

export type DefensePoint = {
  x: number;
  y: number;
};

const DEFENSE_CENTER = 50;
const DEFENSE_HALF_SIZE = 50;

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

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(3))));
}
