import type { DefenseEnemy, DefenseSpeedMultiplier } from './state';

export type DefensePoint = {
  x: number;
  y: number;
};

const DEFENSE_CENTER = 50;
const DEFENSE_HALF_SIZE = 50;
const DEFENSE_MAP_PIXEL_SIZE = 320;
const DEFENSE_ENEMY_COLLISION_DIAMETER_PX = 8;
const DEFENSE_ENEMY_COLLISION_RADIUS_PERCENT =
  (DEFENSE_ENEMY_COLLISION_DIAMETER_PX / 2 / DEFENSE_MAP_PIXEL_SIZE) * 100;
const DEFENSE_MAP_TILE_COUNT = 20;
const DEFENSE_TREE_SPAWN_POINTS = buildDefenseTreeSpawnPoints();

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

export function randomDefenseTreeSpawnLane(random = Math.random): number {
  const index = Math.min(
    DEFENSE_TREE_SPAWN_POINTS.length - 1,
    Math.max(0, Math.floor(random() * DEFENSE_TREE_SPAWN_POINTS.length)),
  );
  return defenseLaneFromPoint(DEFENSE_TREE_SPAWN_POINTS[index]);
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
  return defenseEnemyDistanceFromCenter(enemy) <= range;
}

export function defenseEnemyDistanceFromCenter(enemy: Pick<DefenseEnemy, 'lane' | 'distance'>): number {
  const position = defenseEnemyPosition(enemy);
  return Math.hypot(position.x - DEFENSE_CENTER, position.y - DEFENSE_CENTER) / DEFENSE_HALF_SIZE;
}

export function defenseEnemyPathDistanceForCenterRange(enemy: Pick<DefenseEnemy, 'lane'>, range: number): number {
  const edge = defenseEnemyEdgePoint(enemy.lane);
  const edgeDistanceFromCenter = Math.hypot(edge.x - DEFENSE_CENTER, edge.y - DEFENSE_CENTER) / DEFENSE_HALF_SIZE;
  if (edgeDistanceFromCenter <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, range / edgeDistanceFromCenter));
}

export function defenseEnemyInTowerHitbox(enemy: Pick<DefenseEnemy, 'lane' | 'distance'>): boolean {
  const position = defenseEnemyPosition(enemy);
  return Math.hypot(position.x - DEFENSE_CENTER, position.y - DEFENSE_CENTER) <= DEFENSE_ENEMY_COLLISION_RADIUS_PERCENT;
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

function buildDefenseTreeSpawnPoints(): DefensePoint[] {
  const points: DefensePoint[] = [];

  for (let tile = 0; tile < DEFENSE_MAP_TILE_COUNT; tile += 1) {
    points.push({ x: tileCenterPercent(tile), y: 0 });
    points.push({ x: 0, y: tileCenterPercent(tile) });
    points.push({ x: 100, y: tileCenterPercent(tile) });
  }

  for (const tile of [0, 1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 18, 19]) {
    points.push({ x: tileCenterPercent(tile), y: 100 });
  }

  return points;
}

function tileCenterPercent(tile: number): number {
  return ((tile + 0.5) / DEFENSE_MAP_TILE_COUNT) * 100;
}

function defenseLaneFromPoint(point: DefensePoint): number {
  const degrees = (Math.atan2(point.y - DEFENSE_CENTER, point.x - DEFENSE_CENTER) * 180) / Math.PI;
  return (degrees + 360) % 360;
}
