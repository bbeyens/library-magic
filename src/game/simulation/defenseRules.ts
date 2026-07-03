import type { DefenseEnemy, DefenseSpeedMultiplier } from './state';

export type DefensePoint = {
  x: number;
  y: number;
};

export type DefenseRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const DEFENSE_CENTER = 50;
const DEFENSE_HALF_SIZE = 50;
const DEFENSE_MAP_PIXEL_SIZE = 320;
const DEFENSE_ENEMY_COLLISION_DIAMETER_PX = 52;
const DEFENSE_ENEMY_COLLISION_RADIUS_PERCENT =
  (DEFENSE_ENEMY_COLLISION_DIAMETER_PX / 2 / DEFENSE_MAP_PIXEL_SIZE) * 100;
const DEFENSE_SLIME_FRAME_SIZE_PX = { width: 32, height: 24 };
const DEFENSE_SLIME_RENDER_SIZE_PX = { width: 40, height: 30 };
const DEFENSE_SKELETON_RENDER_SIZE_PX = { width: 32, height: 48 };
const DEFENSE_BAT_RENDER_SIZE_PX = { width: 26, height: 26 };
const DEFENSE_SLIME_VISIBLE_BOX_PX = {
  left: 4,
  top: 10,
  right: 28,
  bottom: 21,
};
const DEFENSE_SKELETON_VISIBLE_CENTER_OFFSET = {
  x: 0,
  y: (-32 / DEFENSE_MAP_PIXEL_SIZE) * 100,
};
const DEFENSE_GOBLIN_FRAME_SIZE_PX = 64;
const DEFENSE_GOBLIN_RENDER_WIDTH_PX = 64 * 1.08;
const DEFENSE_GOBLIN_RENDER_HEIGHT_PX = 64 * 1.38;
const DEFENSE_GOBLIN_VISIBLE_BOX_PX = {
  left: 15,
  top: 23,
  right: 49,
  bottom: 64,
};
const DEFENSE_GOBLIN_COLLISION_BOX_SCALE = 1 / 3;
const DEFENSE_GOBLIN_VISIBLE_BOX_CENTER_PX = {
  x: (DEFENSE_GOBLIN_VISIBLE_BOX_PX.left + DEFENSE_GOBLIN_VISIBLE_BOX_PX.right) / 2,
  y: (DEFENSE_GOBLIN_VISIBLE_BOX_PX.top + DEFENSE_GOBLIN_VISIBLE_BOX_PX.bottom) / 2,
};
const DEFENSE_GOBLIN_COLLISION_BOX_PX = {
  left:
    DEFENSE_GOBLIN_VISIBLE_BOX_CENTER_PX.x -
    ((DEFENSE_GOBLIN_VISIBLE_BOX_PX.right - DEFENSE_GOBLIN_VISIBLE_BOX_PX.left) * DEFENSE_GOBLIN_COLLISION_BOX_SCALE) / 2,
  top:
    DEFENSE_GOBLIN_VISIBLE_BOX_CENTER_PX.y -
    ((DEFENSE_GOBLIN_VISIBLE_BOX_PX.bottom - DEFENSE_GOBLIN_VISIBLE_BOX_PX.top) * DEFENSE_GOBLIN_COLLISION_BOX_SCALE) / 2,
  right:
    DEFENSE_GOBLIN_VISIBLE_BOX_CENTER_PX.x +
    ((DEFENSE_GOBLIN_VISIBLE_BOX_PX.right - DEFENSE_GOBLIN_VISIBLE_BOX_PX.left) * DEFENSE_GOBLIN_COLLISION_BOX_SCALE) / 2,
  bottom:
    DEFENSE_GOBLIN_VISIBLE_BOX_CENTER_PX.y +
    ((DEFENSE_GOBLIN_VISIBLE_BOX_PX.bottom - DEFENSE_GOBLIN_VISIBLE_BOX_PX.top) * DEFENSE_GOBLIN_COLLISION_BOX_SCALE) / 2,
};
const DEFENSE_GOBLIN_COLLISION_BOX_PERCENT = {
  left:
    ((-DEFENSE_GOBLIN_RENDER_WIDTH_PX / 2 +
      DEFENSE_GOBLIN_COLLISION_BOX_PX.left * (DEFENSE_GOBLIN_RENDER_WIDTH_PX / DEFENSE_GOBLIN_FRAME_SIZE_PX)) /
      DEFENSE_MAP_PIXEL_SIZE) *
    100,
  right:
    ((-DEFENSE_GOBLIN_RENDER_WIDTH_PX / 2 +
      DEFENSE_GOBLIN_COLLISION_BOX_PX.right * (DEFENSE_GOBLIN_RENDER_WIDTH_PX / DEFENSE_GOBLIN_FRAME_SIZE_PX)) /
      DEFENSE_MAP_PIXEL_SIZE) *
    100,
  top:
    ((-DEFENSE_GOBLIN_RENDER_HEIGHT_PX / 2 +
      DEFENSE_GOBLIN_COLLISION_BOX_PX.top * (DEFENSE_GOBLIN_RENDER_HEIGHT_PX / DEFENSE_GOBLIN_FRAME_SIZE_PX)) /
      DEFENSE_MAP_PIXEL_SIZE) *
    100,
  bottom:
    ((-DEFENSE_GOBLIN_RENDER_HEIGHT_PX / 2 +
      DEFENSE_GOBLIN_COLLISION_BOX_PX.bottom * (DEFENSE_GOBLIN_RENDER_HEIGHT_PX / DEFENSE_GOBLIN_FRAME_SIZE_PX)) /
      DEFENSE_MAP_PIXEL_SIZE) *
    100,
};
const DEFENSE_MAP_TILE_COUNT = 20;
const DEFENSE_TREE_SPAWN_POINTS = buildDefenseTreeSpawnPoints();
const DEFENSE_SLIME_VISIBLE_CENTER_OFFSET = spriteVisibleCenterOffsetPercent(
  DEFENSE_SLIME_FRAME_SIZE_PX.width,
  DEFENSE_SLIME_FRAME_SIZE_PX.height,
  DEFENSE_SLIME_RENDER_SIZE_PX.width,
  DEFENSE_SLIME_RENDER_SIZE_PX.height,
  DEFENSE_SLIME_VISIBLE_BOX_PX,
);
const DEFENSE_GOBLIN_VISIBLE_CENTER_OFFSET = spriteVisibleCenterOffsetPercent(
  DEFENSE_GOBLIN_FRAME_SIZE_PX,
  DEFENSE_GOBLIN_FRAME_SIZE_PX,
  DEFENSE_GOBLIN_RENDER_WIDTH_PX,
  DEFENSE_GOBLIN_RENDER_HEIGHT_PX,
  DEFENSE_GOBLIN_VISIBLE_BOX_PX,
);

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
  const distance = Math.max(0, enemy.distance);

  return {
    x: DEFENSE_CENTER + (edge.x - DEFENSE_CENTER) * distance,
    y: DEFENSE_CENTER + (edge.y - DEFENSE_CENTER) * distance,
  };
}

export function defenseEnemyVisibleCenter(
  enemy: Pick<DefenseEnemy, 'lane' | 'distance'> & Pick<Partial<DefenseEnemy>, 'kind'>,
): DefensePoint {
  const position = defenseEnemyPosition(enemy);
  const offset = defenseEnemyVisibleCenterOffset(enemy.kind);

  return {
    x: clampPercent(position.x + offset.x),
    y: clampPercent(position.y + offset.y),
  };
}

export function defenseEnemyVisibleBounds(
  enemy: Pick<DefenseEnemy, 'lane' | 'distance'> & Pick<Partial<DefenseEnemy>, 'kind' | 'state'>,
): DefenseRect {
  const position = defenseEnemyPosition(enemy);
  const kind = enemy.kind ?? 'slime';

  if (kind === 'skeletonMage') {
    return renderBoxFromBottomCenter(position, DEFENSE_SKELETON_RENDER_SIZE_PX.width, DEFENSE_SKELETON_RENDER_SIZE_PX.height);
  }

  if (kind === 'bat') {
    return renderBoxFromCenter(position, DEFENSE_BAT_RENDER_SIZE_PX.width, DEFENSE_BAT_RENDER_SIZE_PX.height);
  }

  if (kind === 'goblinKing') {
    return renderBoxFromCenter(position, DEFENSE_GOBLIN_RENDER_WIDTH_PX, DEFENSE_GOBLIN_RENDER_HEIGHT_PX);
  }

  const slimeWidth = enemy.state === 'attacking' ? DEFENSE_SLIME_RENDER_SIZE_PX.width * 2 : DEFENSE_SLIME_RENDER_SIZE_PX.width;
  return renderBoxFromCenter(position, slimeWidth, DEFENSE_SLIME_RENDER_SIZE_PX.height);
}

export function defenseEnemyFullyVisible(
  enemy: Pick<DefenseEnemy, 'lane' | 'distance'> & Pick<Partial<DefenseEnemy>, 'kind' | 'state'>,
): boolean {
  const bounds = defenseEnemyVisibleBounds(enemy);
  return bounds.left >= 0 && bounds.top >= 0 && bounds.right <= 100 && bounds.bottom <= 100;
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

export function defenseEnemyInTowerHitbox(enemy: Pick<DefenseEnemy, 'lane' | 'distance'> & Pick<Partial<DefenseEnemy>, 'kind'>): boolean {
  const position = defenseEnemyPosition(enemy);
  if (enemy.kind === 'goblinKing') {
    return circleIntersectsRect(
      { x: DEFENSE_CENTER, y: DEFENSE_CENTER },
      DEFENSE_ENEMY_COLLISION_RADIUS_PERCENT,
      {
        left: position.x + DEFENSE_GOBLIN_COLLISION_BOX_PERCENT.left,
        top: position.y + DEFENSE_GOBLIN_COLLISION_BOX_PERCENT.top,
        right: position.x + DEFENSE_GOBLIN_COLLISION_BOX_PERCENT.right,
        bottom: position.y + DEFENSE_GOBLIN_COLLISION_BOX_PERCENT.bottom,
      },
    );
  }

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

function defenseEnemyVisibleCenterOffset(kind: DefenseEnemy['kind']): DefensePoint {
  if (kind === 'bat') {
    return { x: 0, y: 0 };
  }

  if (kind === 'skeletonMage') {
    return DEFENSE_SKELETON_VISIBLE_CENTER_OFFSET;
  }

  if (kind === 'goblinKing') {
    return DEFENSE_GOBLIN_VISIBLE_CENTER_OFFSET;
  }

  return DEFENSE_SLIME_VISIBLE_CENTER_OFFSET;
}

function spriteVisibleCenterOffsetPercent(
  frameWidth: number,
  frameHeight: number,
  renderWidth: number,
  renderHeight: number,
  visibleBox: { left: number; top: number; right: number; bottom: number },
): DefensePoint {
  const scaleX = renderWidth / frameWidth;
  const scaleY = renderHeight / frameHeight;
  const visibleCenterX = ((visibleBox.left + visibleBox.right) / 2) * scaleX;
  const visibleCenterY = ((visibleBox.top + visibleBox.bottom) / 2) * scaleY;

  return {
    x: ((visibleCenterX - renderWidth / 2) / DEFENSE_MAP_PIXEL_SIZE) * 100,
    y: ((visibleCenterY - renderHeight / 2) / DEFENSE_MAP_PIXEL_SIZE) * 100,
  };
}

function renderBoxFromCenter(center: DefensePoint, widthPx: number, heightPx: number): DefenseRect {
  const halfWidth = pixelToMapPercent(widthPx / 2);
  const halfHeight = pixelToMapPercent(heightPx / 2);
  return {
    left: center.x - halfWidth,
    top: center.y - halfHeight,
    right: center.x + halfWidth,
    bottom: center.y + halfHeight,
  };
}

function renderBoxFromBottomCenter(bottomCenter: DefensePoint, widthPx: number, heightPx: number): DefenseRect {
  const halfWidth = pixelToMapPercent(widthPx / 2);
  const height = pixelToMapPercent(heightPx);
  return {
    left: bottomCenter.x - halfWidth,
    top: bottomCenter.y - height,
    right: bottomCenter.x + halfWidth,
    bottom: bottomCenter.y,
  };
}

function pixelToMapPercent(value: number): number {
  return (value / DEFENSE_MAP_PIXEL_SIZE) * 100;
}

function circleIntersectsRect(
  circle: DefensePoint,
  radius: number,
  rect: { left: number; top: number; right: number; bottom: number },
): boolean {
  const nearestX = Math.max(rect.left, Math.min(circle.x, rect.right));
  const nearestY = Math.max(rect.top, Math.min(circle.y, rect.bottom));
  return Math.hypot(nearestX - circle.x, nearestY - circle.y) <= radius;
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
