import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  Raycaster,
  RingGeometry,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three';
import { miningAttackRangePixels, miningAutoClickTargetIds, miningHoldClickRate } from '../game/simulation/actions';
import {
  MINING_GRID_COLUMNS,
  MINING_GRID_ROWS,
  MINING_METEORITE_FALL_SECONDS,
  MINING_TERRAIN_LAYER_COUNT,
  miningBlockSpriteTierForDepth,
  type GameState,
  type MiningBlockMaterialId,
} from '../game/simulation/state';

type MiningThreeTerrain = {
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: OrthographicCamera;
  raycaster: Raycaster;
  pointer: Vector2;
  terrain: Group;
  blockMeshes: Mesh[];
  blockGeometry: BoxGeometry;
  emptyGeometry: BoxGeometry;
  emptyMaterial: MeshBasicMaterial;
  materials: Map<string, Material[]>;
  textures: Map<string, Texture>;
  attackRangeIndicator: HTMLDivElement | null;
  pointerClientX: number | null;
  pointerClientY: number | null;
  holdTimeout: number | null;
  state: GameState | null;
  damageAnimations: Map<number, MiningDamageAnimation>;
  animationFrame: number | null;
  // Blocks currently under the cursor (the touch zone), highlighted while hovering.
  highlightIds: Set<number>;
  cleanup: () => void;
};

type MiningDamageAnimation = {
  phase: 'pressing' | 'held' | 'releasing';
  startedAt: number;
  releaseStartedAt: number;
  releaseFromScale: number;
};

type MiningPalette = {
  top: string;
  left: string;
  right: string;
  bottom: string;
};

type MiningTextureFaces = {
  top: string;
  left: string;
  right: string;
};

export type MiningLayerTransform = {
  y: number;
  height: number;
  isTop: boolean;
};

const terrainByCanvas = new WeakMap<HTMLCanvasElement, MiningThreeTerrain>();
const activeTerrains = new Set<MiningThreeTerrain>();
const miningTextureLoader = new TextureLoader();
const emptyMarkerColor = new Color('#14371f');
const miningDamagePressMs = 90;
const miningDamageReleaseMs = 150;
const miningDamageCompression = 0.12;
const miningLayerHeight = 0.5;
const miningBoardWidthTargetRatio = 0.88;
let activeTerrain: MiningThreeTerrain | null = null;
let activeDigHandler: ((blockIds: number[]) => void) | null = null;
// Every block currently pushed in by a click (the whole splash), released together on pointer-up.
const activePressedBlockIds = new Set<number>();
let lastInputAt = 0;
let lastInputX = 0;
let lastInputY = 0;
// Manual clicks are capped at 10/s. This does NOT limit the hover loop or the autoclicker,
// which run on their own rates.
const miningManualClickMinIntervalMs = 100;
let lastManualDigAt = 0;

const miningPalettes: Record<MiningBlockMaterialId, MiningPalette> = {
  dirt: { top: '#99e550', left: '#37946e', right: '#6abe30', bottom: '#26684e' },
  sand: { top: '#ead679', left: '#c4a456', right: '#aa8b42', bottom: '#80672f' },
  stone: { top: '#9d9d94', left: '#73786d', right: '#62675d', bottom: '#44483f' },
  coal: { top: '#74746f', left: '#53574f', right: '#41463e', bottom: '#252922' },
  iron: { top: '#958b79', left: '#766957', right: '#625746', bottom: '#443a2e' },
  gold: { top: '#d8bb4d', left: '#b8912f', right: '#997827', bottom: '#6d551d' },
  ruby: { top: '#d84a68', left: '#aa314c', right: '#88243c', bottom: '#5f182a' },
  lapis: { top: '#416bdf', left: '#2d4fb2', right: '#233f91', bottom: '#162a63' },
  diamond: { top: '#72e8ef', left: '#3dbbc6', right: '#2d9faa', bottom: '#1c6f78' },
  emerald: { top: '#54db7c', left: '#33af60', right: '#278e4d', bottom: '#1a6737' },
  obsidian: { top: '#3f3650', left: '#2e263d', right: '#231d31', bottom: '#171220' },
};

// Keyed by sprite tier index (see MINING_BLOCK_SPRITE_TIERS): grass/dirt and the ore
// vs "full block" pairs share a material with a neighbour, so the terrain textures per
// depth tier rather than per material to keep every stratum distinct. Each folder ships
// pixel-native faces under /assets/mine/materials/<folder>/ (see generate-mine-textures).
const miningSpriteTextureFolders: Record<number, string> = {
  1: 'grass',
  2: 'dirt',
  3: 'sand',
  4: 'mossy',
  5: 'cobblestone',
  6: 'stone',
  7: 'coal',
  8: 'iron',
  9: 'gold',
  10: 'ruby',
  11: 'lapis',
  12: 'diamond',
  13: 'emerald',
  14: 'iron_block',
  15: 'gold_block',
  16: 'ruby_block',
  17: 'lapis_block',
  18: 'diamond_block',
  19: 'emerald_block',
  20: 'obsidian',
};

const miningSpriteTextureFaces = new Map<number, MiningTextureFaces>();

function miningTextureFacesForTier(spriteIndex: number): MiningTextureFaces | undefined {
  const folder = miningSpriteTextureFolders[spriteIndex];
  if (!folder) {
    return undefined;
  }
  let faces = miningSpriteTextureFaces.get(spriteIndex);
  if (!faces) {
    faces = {
      top: `/assets/mine/materials/${folder}/top.png`,
      left: `/assets/mine/materials/${folder}/left.png`,
      right: `/assets/mine/materials/${folder}/right.png`,
    };
    miningSpriteTextureFaces.set(spriteIndex, faces);
  }
  return faces;
}

// Bomb blocks render as a TNT crate (red sides with a "TNT" label, cream-banded, fuse on top),
// overriding the depth-tier texture. Kept at a fixed orientation so the label stays readable.
const tntTextureFaces: MiningTextureFaces = {
  top: '/assets/mine/materials/tnt/top.png',
  left: '/assets/mine/materials/tnt/left.png',
  right: '/assets/mine/materials/tnt/right.png',
};
const tntPalette: MiningPalette = { top: '#c0301f', left: '#9a2415', right: '#7e1d10', bottom: '#5a1a0e' };

const miningOrientationCount = 4;
const miningBlockFootprint = 0.95;
const miningAoBottom = 0.55;
const miningAoTop = 1;

// Hover highlight: a bright top-face decal on each block currently in the touch zone.
const miningHighlightGeometry = new PlaneGeometry(miningBlockFootprint, miningBlockFootprint);
let miningHighlightFillMaterial: MeshBasicMaterial | null = null;
function miningHighlightFill(): MeshBasicMaterial {
  if (!miningHighlightFillMaterial) {
    miningHighlightFillMaterial = new MeshBasicMaterial({
      color: 0x9be8ff,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
  }
  return miningHighlightFillMaterial;
}

// Mining juice: a crack decal that deepens with damage, plus debris + shake on break.
const miningCrackTexturePath = '/assets/Block%20terre/fissur.png';
const miningCrackGeometry = new PlaneGeometry(miningBlockFootprint, miningBlockFootprint);
// fissur.png is a 4x4 sheet: within each row the crack grows small -> maximum (left -> right).
const miningCrackAtlasCols = 4;
const miningCrackAtlasRows = 4;
const miningCrackTextures = new Map<number, Texture>();
const miningCrackMaterials = new Map<number, MeshBasicMaterial>();
const miningLastLayers = new WeakMap<MiningThreeTerrain, Map<number, number>>();
const miningLastHolo = new WeakMap<MiningThreeTerrain, Map<number, number>>();
const miningBreakParticleCount = 16;
let miningCrackBase: Texture | null = null;

// Debris particles live inside the 3D scene so front blocks occlude them properly.
type MiningParticle = {
  mesh: Mesh;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  size: number;
  life: number;
  maxLife: number;
  groundY: number;
  gravity: number;
};

const miningParticleGeometry = new BoxGeometry(1, 1, 1);
const miningParticleMaterials = new Map<string, MeshBasicMaterial>();
const miningParticleGroups = new WeakMap<MiningThreeTerrain, Group>();
const miningParticleStates = new WeakMap<MiningThreeTerrain, MiningParticle[]>();
const miningParticleLastFrame = new WeakMap<MiningThreeTerrain, number>();
const miningParticleGravity = -9;
// Sized for several full-board breaks / bomb bursts / meteorite effects in flight at once, so
// particles rarely get cut short; extra headroom is recycled oldest-first, never the current
// frame's burst. (A whole-board break alone is grid-cells x break-count.)
const miningParticleMaxCount = (MINING_GRID_COLUMNS * MINING_GRID_ROWS + 3) * miningBreakParticleCount * 4;

type MiningBlockVariant = {
  orient: number;
  bucket: number;
  brightness: number;
};

type MiningFaceTransform = {
  rotationQuarters?: number;
  mirror?: boolean;
  flipY?: boolean;
};

// Spread a seed into an uncorrelated hash so neighbours pick different variants.
function miningBlockHash(seed: number): number {
  let x = Math.imul(seed + 1, 374761393);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return (x ^ (x >>> 16)) >>> 0;
}

// Vary per block AND per stacked layer: a per-layer flip breaks the tile pattern,
// while a vertical ambient-occlusion gradient darkens the column toward its base.
function miningBlockVariant(blockId: number, layerIndex: number, layerCount: number): MiningBlockVariant {
  const hash = miningBlockHash(blockId * 32 + layerIndex);
  const orient = hash % miningOrientationCount;
  const depth = layerCount <= 1 ? 1 : layerIndex / (layerCount - 1);
  const jitter = 1 + (hash / 4294967296 - 0.5) * 0.08;
  const brightness = Math.min(1.04, (miningAoBottom + (miningAoTop - miningAoBottom) * depth) * jitter);
  const bucket = Math.round(brightness * 16);
  return { orient, bucket, brightness };
}

function miningTintColor(brightness: number): Color {
  return new Color().setScalar(brightness);
}

function miningScaledColor(hex: string, brightness: number): Color {
  return new Color(hex).multiplyScalar(brightness);
}

function miningCrackBaseTexture(terrain: MiningThreeTerrain): Texture {
  if (miningCrackBase) {
    return miningCrackBase;
  }
  const texture = miningTextureLoader.load(miningCrackTexturePath, () => {
    for (const staged of miningCrackTextures.values()) {
      staged.needsUpdate = true;
    }
    if (terrain.state && terrain.canvas.isConnected) {
      renderMiningThreeTerrain(terrain, terrain.state);
    }
  });
  texture.colorSpace = SRGBColorSpace;
  miningCrackBase = texture;
  return texture;
}

// One cell of fissur.png (a 4x4 sheet of progressively worse crack stages).
function miningCrackTextureForStage(terrain: MiningThreeTerrain, stage: number): Texture {
  const cached = miningCrackTextures.get(stage);
  if (cached) {
    return cached;
  }
  const texture = miningCrackBaseTexture(terrain).clone();
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = SRGBColorSpace;
  // Each crack sits in the top-left 16x16 of a 32px cell, so sample that half-cell
  // tile (repeat 1/8) rather than the whole cell (which left 3/4 of the block bare).
  const col = stage % miningCrackAtlasCols;
  const row = Math.floor(stage / miningCrackAtlasCols);
  const cellUV = 1 / miningCrackAtlasCols;
  const tileUV = cellUV / 2;
  texture.repeat.set(tileUV, tileUV);
  texture.offset.set(col * cellUV, 1 - tileUV - row * cellUV);
  texture.needsUpdate = true;
  miningCrackTextures.set(stage, texture);
  return texture;
}

// Crack severity as a health bar: 0 = none, 1..4 = small -> maximum.
// Thresholds: cracks appear below 80% health and worsen at 60%, 40% and 20%.
function miningCrackLevel(healthRatio: number): number {
  if (healthRatio >= 0.8) {
    return 0;
  }
  if (healthRatio >= 0.6) {
    return 1;
  }
  if (healthRatio >= 0.4) {
    return 2;
  }
  if (healthRatio >= 0.2) {
    return 3;
  }
  return 4;
}

// Atlas cell for a crack level on a given block. The column escalates small -> max with the
// level (never shrinking), while the block id picks a stable row so blocks look varied.
function miningCrackStage(blockId: number, level: number): number {
  const col = Math.min(miningCrackAtlasCols - 1, Math.max(0, level - 1));
  const row = ((blockId % miningCrackAtlasRows) + miningCrackAtlasRows) % miningCrackAtlasRows;
  return row * miningCrackAtlasCols + col;
}

// Cached by atlas cell so hitting a block never allocates a new material.
function miningCrackMaterial(terrain: MiningThreeTerrain, stage: number): MeshBasicMaterial {
  const cached = miningCrackMaterials.get(stage);
  if (cached) {
    return cached;
  }
  const material = new MeshBasicMaterial({
    map: miningCrackTextureForStage(terrain, stage),
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  });
  miningCrackMaterials.set(stage, material);
  return material;
}

function miningFxLayer(frame: HTMLElement): HTMLDivElement {
  let fx = frame.querySelector<HTMLDivElement>('.mining-fx');
  if (!fx) {
    fx = document.createElement('div');
    fx.className = 'mining-fx';
    frame.appendChild(fx);
  }
  return fx;
}

const miningLastHitPulse = new WeakMap<MiningThreeTerrain, number>();
const miningDamagePopupCap = 6;
const miningDamagePopupMaxActive = 16;

function formatMiningDamage(value: number): string {
  const rounded = Math.round(value);
  if (rounded >= 1e9) {
    return `${(rounded / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (rounded >= 1e6) {
    return `${(rounded / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (rounded >= 1e3) {
    return `${(rounded / 1e3).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(rounded);
}

// Floating damage numbers on hit blocks (manual clicks and auto-clicker), Crystal-style.
function updateMiningDamagePopups(terrain: MiningThreeTerrain, state: GameState): void {
  const previousPulse = miningLastHitPulse.get(terrain);
  miningLastHitPulse.set(terrain, state.mining.hitPulse);
  if (previousPulse === undefined || previousPulse === state.mining.hitPulse) {
    return;
  }
  const feedback = state.mining.hitFeedback;
  if (!feedback || feedback.length === 0) {
    return;
  }
  const frame = terrain.canvas.parentElement;
  if (!frame) {
    return;
  }
  const rect = terrain.canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }

  let layer = frame.querySelector<HTMLDivElement>('.mining-damage-popups');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'mining-damage-popups';
    layer.setAttribute('aria-hidden', 'true');
    frame.appendChild(layer);
  }
  terrain.camera.updateMatrixWorld(true);
  const projected = new Vector3();
  for (const hit of feedback.slice(0, miningDamagePopupCap)) {
    const block = state.mining.blocks[hit.blockId];
    const col = hit.blockId % MINING_GRID_COLUMNS;
    const row = Math.floor(hit.blockId / MINING_GRID_COLUMNS);
    const centeredX = col - (MINING_GRID_COLUMNS - 1) / 2;
    const centeredZ = row - (MINING_GRID_ROWS - 1) / 2;
    const topY = Math.max(0, block ? block.layersRemaining : 0) * miningLayerHeight + 0.2;
    projected.set(centeredX, topY, centeredZ).project(terrain.camera);
    const pop = document.createElement('span');
    pop.className = hit.critical
      ? 'floating-gain is-mining-damage is-critical'
      : 'floating-gain is-mining-damage';
    pop.textContent = `-${formatMiningDamage(hit.amount)}`;
    pop.style.left = `${(projected.x * 0.5 + 0.5) * rect.width}px`;
    pop.style.top = `${(-projected.y * 0.5 + 0.5) * rect.height}px`;
    layer.appendChild(pop);
    pop.addEventListener('animationend', () => pop.remove(), { once: true });
  }
  while (layer.childElementCount > miningDamagePopupMaxActive) {
    layer.firstElementChild?.remove();
  }
}

const miningLastRewardMined = new WeakMap<MiningThreeTerrain, number>();

// Floating resource-gain numbers directly above each destroyed block.
function updateMiningRewardPopups(terrain: MiningThreeTerrain, state: GameState): void {
  const previousMined = miningLastRewardMined.get(terrain);
  miningLastRewardMined.set(terrain, state.mining.totalMined);
  if (previousMined === undefined || previousMined === state.mining.totalMined) {
    return;
  }
  const feedback = state.mining.breakFeedback;
  if (!feedback || feedback.length === 0) {
    return;
  }
  const frame = terrain.canvas.parentElement;
  if (!frame) {
    return;
  }
  const rect = terrain.canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }

  // Aggregate per block so a block broken several times in one burst shows one clean total.
  const totals = new Map<number, number>();
  for (const entry of feedback) {
    totals.set(entry.blockId, (totals.get(entry.blockId) ?? 0) + entry.reward);
  }

  let layer = frame.querySelector<HTMLDivElement>('.mining-reward-popups');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'mining-reward-popups';
    layer.setAttribute('aria-hidden', 'true');
    frame.appendChild(layer);
  }
  terrain.camera.updateMatrixWorld(true);
  const projected = new Vector3();
  let shown = 0;
  for (const [blockId, reward] of totals) {
    if (shown >= miningDamagePopupCap) {
      break;
    }
    shown += 1;
    const block = state.mining.blocks[blockId];
    const col = blockId % MINING_GRID_COLUMNS;
    const row = Math.floor(blockId / MINING_GRID_COLUMNS);
    const centeredX = col - (MINING_GRID_COLUMNS - 1) / 2;
    const centeredZ = row - (MINING_GRID_ROWS - 1) / 2;
    // Float above the block's post-break top surface, clear of the damage number.
    const topY = Math.max(0, block ? block.layersRemaining : 0) * miningLayerHeight + 0.45;
    projected.set(centeredX, topY, centeredZ).project(terrain.camera);
    const pop = document.createElement('span');
    pop.className = 'floating-gain is-mining-reward';
    pop.textContent = `+${formatMiningDamage(reward)}`;
    pop.style.left = `${(projected.x * 0.5 + 0.5) * rect.width}px`;
    pop.style.top = `${(-projected.y * 0.5 + 0.5) * rect.height}px`;
    layer.appendChild(pop);
    pop.addEventListener('animationend', () => pop.remove(), { once: true });
  }
  while (layer.childElementCount > miningDamagePopupMaxActive) {
    layer.firstElementChild?.remove();
  }
}

let lastMiningAutoDigCount = 0;

// Draw a tapping hand on each block the auto-clicker is currently targeting.
function updateMiningAutoClickHands(terrain: MiningThreeTerrain, state: GameState): void {
  const frame = terrain.canvas.parentElement;
  if (!frame) {
    return;
  }
  const targetIds = miningAutoClickTargetIds(state);
  let layer = frame.querySelector<HTMLDivElement>('.mining-auto-hands');
  if (targetIds.length === 0) {
    layer?.replaceChildren();
    return;
  }
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'mining-auto-hands';
    layer.setAttribute('aria-hidden', 'true');
    frame.appendChild(layer);
  }

  const rect = terrain.canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  terrain.camera.updateMatrixWorld(true);

  while (layer.childElementCount < targetIds.length) {
    const hand = document.createElement('span');
    hand.className = 'mining-auto-hand';
    hand.style.setProperty('--auto-hand-delay', `${layer.childElementCount * 140}ms`);
    layer.appendChild(hand);
  }
  while (layer.childElementCount > targetIds.length) {
    layer.lastElementChild?.remove();
  }

  const projected = new Vector3();
  targetIds.forEach((blockId, index) => {
    const hand = layer.children[index] as HTMLElement | undefined;
    const block = state.mining.blocks[blockId];
    if (!hand) {
      return;
    }
    if (!block || block.layersRemaining <= 0) {
      hand.style.display = 'none';
      return;
    }
    hand.style.display = '';
    const col = blockId % MINING_GRID_COLUMNS;
    const row = Math.floor(blockId / MINING_GRID_COLUMNS);
    const centeredX = col - (MINING_GRID_COLUMNS - 1) / 2;
    const centeredZ = row - (MINING_GRID_ROWS - 1) / 2;
    const topY = Math.max(0, block.layersRemaining) * miningLayerHeight;
    projected.set(centeredX, topY, centeredZ).project(terrain.camera);
    hand.style.left = `${(projected.x * 0.5 + 0.5) * rect.width}px`;
    hand.style.top = `${(-projected.y * 0.5 + 0.5) * rect.height}px`;
  });

  // Jab the hands down once per actual auto-clicker fire (tracked via autoDigCount).
  const autoDigCount = state.miningSkills.autoDigCount ?? 0;
  if (autoDigCount !== lastMiningAutoDigCount) {
    lastMiningAutoDigCount = autoDigCount;
    for (const child of Array.from(layer.children)) {
      const hand = child as HTMLElement;
      if (hand.style.display === 'none') {
        continue;
      }
      hand.classList.remove('is-clicking');
      void hand.offsetWidth;
      hand.classList.add('is-clicking');
    }
  }
}


const miningCrtStorageKey = 'libraryMagic.miningCrt';
let miningCrtOn: boolean | null = null;

function miningCrtEnabled(): boolean {
  if (miningCrtOn === null) {
    try {
      miningCrtOn = window.localStorage.getItem(miningCrtStorageKey) === '1';
    } catch {
      miningCrtOn = false;
    }
  }
  return miningCrtOn;
}

function setMiningCrt(on: boolean): void {
  miningCrtOn = on;
  try {
    window.localStorage.setItem(miningCrtStorageKey, on ? '1' : '0');
  } catch {
    // Ignore storage failures; the toggle still works for the session.
  }
}

function applyMiningCrtState(frame: HTMLElement): void {
  const on = miningCrtEnabled();
  frame.classList.toggle('is-crt', on);
  const toggle = frame.querySelector<HTMLButtonElement>('.mining-crt-toggle');
  if (toggle) {
    toggle.classList.toggle('is-active', on);
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
}

// Lazily inject the CRT overlay + its toggle button into the board frame.
function ensureMiningCrtControls(frame: HTMLElement): void {
  if (!frame.querySelector('.mining-crt')) {
    const overlay = document.createElement('div');
    overlay.className = 'mining-crt';
    overlay.setAttribute('aria-hidden', 'true');
    frame.appendChild(overlay);
  }
  if (!frame.querySelector('.mining-crt-toggle')) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mining-crt-toggle';
    toggle.dataset.miningCrtToggle = 'true';
    toggle.textContent = 'CRT';
    toggle.title = 'Effet CRT';
    toggle.setAttribute('aria-label', "Activer ou desactiver l'effet CRT");
    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMiningCrt(!miningCrtEnabled());
      applyMiningCrtState(frame);
    });
    frame.appendChild(toggle);
  }
  applyMiningCrtState(frame);
  applyMiningHoloState(frame);
}

const miningHoloStorageKey = 'libraryMagic.miningHolo';
let miningHoloOn: boolean | null = null;

function miningHoloEnabled(): boolean {
  if (miningHoloOn === null) {
    try {
      miningHoloOn = window.localStorage.getItem(miningHoloStorageKey) === '1';
    } catch {
      miningHoloOn = false;
    }
  }
  return miningHoloOn;
}

function applyMiningHoloState(frame: HTMLElement): void {
  const toggle = frame.querySelector<HTMLButtonElement>('.mining-holo-toggle');
  if (toggle) {
    const on = miningHoloEnabled();
    toggle.classList.toggle('is-active', on);
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
}

const miningHoloTimeUniform = { value: 0 };
const miningHoloPatchedSets = new WeakMap<Material[], Map<number, Material[]>>();

// The screen-space sheen GLSL for each holo rarity tier (1 = Holo, 2 = Arc-en-ciel, 3 = Négatif).
function miningHoloTierGlsl(tier: number): string[] {
  const head = [
    '{',
    '  vec2 ndc = vHoloClip.xy / vHoloClip.w;',
    '  float diag = ndc.x * 0.8 + ndc.y;',
  ];
  if (tier >= 3) {
    // Négatif: just the photo-negative of the block — clean, no scanlines.
    return head.concat([
      '  gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;',
      '}',
      '#include <colorspace_fragment>',
    ]);
  }
  if (tier >= 2) {
    // Arc-en-ciel: fully-saturated multi-band rainbow (HSV hue ramp) drifting across the face,
    // blended at 60% so the block's own colour still shows through.
    return head.concat([
      '  float hue = fract(diag * 3.5 + uTime * 0.2);',
      '  vec3 rainbow = clamp(abs(fract(hue + vec3(0.0, 0.6667, 0.3333)) * 6.0 - 3.0) - 1.0, 0.0, 1.0);',
      '  gl_FragColor.rgb = mix(gl_FragColor.rgb, rainbow, 0.6);',
      '}',
      '#include <colorspace_fragment>',
    ]);
  }
  // Holo (tier 1): a bright white/silver foil shine that keeps the block's own colour.
  return head.concat([
    '  float sweep = 0.5 + 0.5 * sin(diag * 4.5 - uTime * 0.7);',
    '  float gloss = 0.22 + 0.78 * smoothstep(0.3, 1.0, sweep);',
    '  float hue = fract(diag * 0.9 + uTime * 0.06);',
    '  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + hue));',
    '  vec3 sheen = mix(vec3(1.0), irid, 0.4) * gloss * 0.6;',
    '  gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - sheen);',
    '}',
    '#include <colorspace_fragment>',
  ]);
}

// Glossy foil sheen injected on top of a normal block material via onBeforeCompile,
// so the base (per-face textures, ambient occlusion, colour management) is untouched.
// The highlight sweeps in screen space, so it moves uniformly in one direction.
function patchHoloMaterial(source: Material, tier = 1): Material {
  const material = source.clone();
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = miningHoloTimeUniform;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec4 vHoloClip;')
      .replace('#include <project_vertex>', '#include <project_vertex>\n  vHoloClip = gl_Position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nvarying vec4 vHoloClip;')
      .replace('#include <colorspace_fragment>', miningHoloTierGlsl(tier).join('\n'));
  };
  // Each tier injects different GLSL from the same onBeforeCompile source, so give Three.js a
  // distinct cache key per tier — otherwise it compiles once and reuses one tier for all.
  material.customProgramCacheKey = () => `mining-holo-tier-${tier}`;
  material.needsUpdate = true;
  return material;
}

// Holo-patched clones of a block's normal material set, cached per source set and rarity tier.
function holoPatchedMaterialSet(normalSet: Material[], tier: number): Material[] {
  let byTier = miningHoloPatchedSets.get(normalSet);
  if (!byTier) {
    byTier = new Map<number, Material[]>();
    miningHoloPatchedSets.set(normalSet, byTier);
  }
  const cached = byTier.get(tier);
  if (cached) {
    return cached;
  }
  const patched = normalSet.map((material) => patchHoloMaterial(material, tier));
  byTier.set(tier, patched);
  return patched;
}

function shakeMiningBoard(terrain: MiningThreeTerrain, scale = 1): void {
  const px = (v: number) => `${(v * scale).toFixed(2)}px`;
  terrain.canvas.animate(
    [
      { transform: 'translate(0, 0)' },
      { transform: `translate(${px(-2)}, ${px(1.5)})` },
      { transform: `translate(${px(2)}, ${px(-1)})` },
      { transform: `translate(${px(-1.5)}, ${px(1)})` },
      { transform: `translate(${px(1)}, ${px(-0.5)})` },
      { transform: 'translate(0, 0)' },
    ],
    { duration: 190 + 60 * (scale - 1), easing: 'ease-out' },
  );
}



const miningBombBurstColors = ['#ff5a1f', '#ffb020', '#ff2d2d', '#ffe45e', '#ffffff'];
const miningBombBurstCount = 40;

// A punchy red/orange fireball where a bomb just detonated.
function spawnMiningBombBurst(terrain: MiningThreeTerrain, blockId: number): void {
  const states = miningParticleStates.get(terrain) ?? [];
  miningParticleStates.set(terrain, states);
  const group = miningParticleGroup(terrain);
  const overflow = states.length + miningBombBurstCount - miningParticleMaxCount;
  if (overflow > 0) {
    const recycled = states.splice(0, overflow);
    for (const dead of recycled) {
      group.remove(dead.mesh);
    }
  }
  const col = blockId % MINING_GRID_COLUMNS;
  const row = Math.floor(blockId / MINING_GRID_COLUMNS);
  const centeredX = col - (MINING_GRID_COLUMNS - 1) / 2;
  const centeredZ = row - (MINING_GRID_ROWS - 1) / 2;
  const topY = 0.35;
  for (let i = 0; i < miningBombBurstCount; i += 1) {
    const size = 0.1 + Math.random() * 0.16;
    const mesh = new Mesh(miningParticleGeometry, miningParticleMaterial(miningBombBurstColors[i % miningBombBurstColors.length]!));
    mesh.position.set(centeredX + (Math.random() - 0.5) * 0.3, topY, centeredZ + (Math.random() - 0.5) * 0.3);
    mesh.scale.setScalar(size);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.6 + Math.random() * 2.8;
    const life = 0.6 + Math.random() * 0.6;
    states.push({
      mesh,
      vx: Math.cos(angle) * speed,
      vz: Math.sin(angle) * speed,
      vy: 2.4 + Math.random() * 3.2,
      rx: (Math.random() - 0.5) * 14,
      ry: (Math.random() - 0.5) * 14,
      rz: (Math.random() - 0.5) * 14,
      size,
      life,
      maxLife: life,
      groundY: topY,
      gravity: miningParticleGravity,
    });
  }
  miningParticleLastFrame.set(terrain, performance.now());
  scheduleMiningDamageFrame(terrain);
}

const miningMeteoriteBurstCount = 80;
// A towering impact fountain from the centre. Much higher upward velocity (and longer life) than a
// bomb so the debris shoots well above the block stack and stays visible, instead of being swallowed
// behind the blocks.
function spawnMiningMeteoriteBurst(terrain: MiningThreeTerrain): void {
  const states = miningParticleStates.get(terrain) ?? [];
  miningParticleStates.set(terrain, states);
  const group = miningParticleGroup(terrain);
  const overflow = states.length + miningMeteoriteBurstCount - miningParticleMaxCount;
  if (overflow > 0) {
    const recycled = states.splice(0, overflow);
    for (const dead of recycled) {
      group.remove(dead.mesh);
    }
  }
  const blockId = miningCenterBlockId();
  const centeredX = (blockId % MINING_GRID_COLUMNS) - (MINING_GRID_COLUMNS - 1) / 2;
  const centeredZ = Math.floor(blockId / MINING_GRID_COLUMNS) - (MINING_GRID_ROWS - 1) / 2;
  const topY = 0.35;
  for (let i = 0; i < miningMeteoriteBurstCount; i += 1) {
    const size = 0.12 + Math.random() * 0.22;
    const mesh = new Mesh(miningParticleGeometry, miningParticleMaterial(miningBombBurstColors[i % miningBombBurstColors.length]!));
    mesh.position.set(centeredX + (Math.random() - 0.5) * 0.6, topY, centeredZ + (Math.random() - 0.5) * 0.6);
    mesh.scale.setScalar(size);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.4 + Math.random() * 3;
    const life = 1.4 + Math.random() * 1.1;
    states.push({
      mesh,
      vx: Math.cos(angle) * speed,
      vz: Math.sin(angle) * speed,
      vy: 9 + Math.random() * 7, // launches high above the board (peak well over the block stack)
      rx: (Math.random() - 0.5) * 16,
      ry: (Math.random() - 0.5) * 16,
      rz: (Math.random() - 0.5) * 16,
      size,
      life,
      maxLife: life,
      groundY: topY,
      gravity: miningParticleGravity,
    });
  }
  miningParticleLastFrame.set(terrain, performance.now());
  scheduleMiningDamageFrame(terrain);
}

const miningLastBombPulse = new WeakMap<MiningThreeTerrain, number>();
// Fire a bomb flash + fireball + rising smoke + a bigger board shake each time a bomb detonates.
function updateMiningBombFx(terrain: MiningThreeTerrain, state: GameState): void {
  const previous = miningLastBombPulse.get(terrain);
  miningLastBombPulse.set(terrain, state.mining.bombPulse);
  if (previous === undefined || previous === state.mining.bombPulse) {
    return;
  }
  for (const blockId of state.mining.bombFeedback) {
    spawnMiningBombFlash(terrain, blockId);
    spawnMiningBombBurst(terrain, blockId);
    spawnMiningBombSmoke(terrain, blockId);
  }
  if (state.mining.bombFeedback.length > 0) {
    shakeMiningBoard(terrain, 2.4);
  }
}

// A brief bright additive flash at the blast (grows fast, fades out in ~170ms).
type MiningBombFlash = { sprite: Sprite; material: SpriteMaterial; startedAt: number; duration: number; maxScale: number };
const miningBombFlashes = new WeakMap<MiningThreeTerrain, MiningBombFlash[]>();

function spawnMiningBombFlash(terrain: MiningThreeTerrain, blockId: number): void {
  const col = blockId % MINING_GRID_COLUMNS;
  const row = Math.floor(blockId / MINING_GRID_COLUMNS);
  const cx = col - (MINING_GRID_COLUMNS - 1) / 2;
  const cz = row - (MINING_GRID_ROWS - 1) / 2;
  const material = new SpriteMaterial({
    map: miningShockwaveHaloTexture(),
    color: new Color('#fff0c0'),
    transparent: true,
    opacity: 1,
    blending: AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });
  const sprite = new Sprite(material);
  sprite.position.set(cx, 0.55, cz);
  sprite.renderOrder = 12;
  miningParticleGroup(terrain).add(sprite);
  const flashes = miningBombFlashes.get(terrain) ?? [];
  flashes.push({ sprite, material, startedAt: performance.now(), duration: 170, maxScale: 2.7 });
  miningBombFlashes.set(terrain, flashes);
  scheduleMiningDamageFrame(terrain);
}

function updateMiningBombFlashes(terrain: MiningThreeTerrain, now: number): boolean {
  const flashes = miningBombFlashes.get(terrain);
  if (!flashes || flashes.length === 0) {
    return false;
  }
  const group = miningParticleGroup(terrain);
  for (let i = flashes.length - 1; i >= 0; i -= 1) {
    const flash = flashes[i]!;
    const p = (now - flash.startedAt) / flash.duration;
    if (p >= 1) {
      group.remove(flash.sprite);
      flash.material.dispose();
      flashes.splice(i, 1);
      continue;
    }
    flash.sprite.scale.setScalar(flash.maxScale * (0.35 + 0.65 * Math.min(1, p * 2.2)));
    flash.material.opacity = (1 - p) * (1 - p);
  }
  return flashes.length > 0;
}

function clearMiningBombFlashes(terrain: MiningThreeTerrain): void {
  const flashes = miningBombFlashes.get(terrain);
  if (!flashes) {
    return;
  }
  const group = miningParticleGroups.get(terrain);
  for (const flash of flashes) {
    group?.remove(flash.sprite);
    flash.material.dispose();
  }
  miningBombFlashes.set(terrain, []);
}

const miningBombSmokeCount = 10;
const miningBombSmokeColors = ['#4a4a52', '#5c5c66', '#3a3a42', '#6b6b76'];

// A soft grey smoke puff that lingers and drifts up after the blast (near-zero gravity so it rises).
function spawnMiningBombSmoke(terrain: MiningThreeTerrain, blockId: number): void {
  const states = miningParticleStates.get(terrain) ?? [];
  miningParticleStates.set(terrain, states);
  const group = miningParticleGroup(terrain);
  const overflow = states.length + miningBombSmokeCount - miningParticleMaxCount;
  if (overflow > 0) {
    const recycled = states.splice(0, overflow);
    for (const dead of recycled) {
      group.remove(dead.mesh);
    }
  }
  const col = blockId % MINING_GRID_COLUMNS;
  const row = Math.floor(blockId / MINING_GRID_COLUMNS);
  const cx = col - (MINING_GRID_COLUMNS - 1) / 2;
  const cz = row - (MINING_GRID_ROWS - 1) / 2;
  const topY = 0.4;
  for (let i = 0; i < miningBombSmokeCount; i += 1) {
    const size = 0.16 + Math.random() * 0.22;
    const mesh = new Mesh(miningParticleGeometry, miningParticleMaterial(miningBombSmokeColors[i % miningBombSmokeColors.length]!));
    mesh.position.set(cx + (Math.random() - 0.5) * 0.42, topY + Math.random() * 0.18, cz + (Math.random() - 0.5) * 0.42);
    mesh.scale.setScalar(size);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    const life = 1 + Math.random() * 0.7;
    states.push({
      mesh,
      vx: (Math.random() - 0.5) * 0.5,
      vz: (Math.random() - 0.5) * 0.5,
      vy: 0.8 + Math.random() * 0.9,
      rx: (Math.random() - 0.5) * 3,
      ry: (Math.random() - 0.5) * 3,
      rz: (Math.random() - 0.5) * 3,
      size,
      life,
      maxLife: life,
      groundY: topY - 0.8, // sits below the spawn so the rising puff is never culled by the ground check
      gravity: 0, // smoke drifts up instead of falling
    });
  }
  miningParticleLastFrame.set(terrain, performance.now());
  scheduleMiningDamageFrame(terrain);
}

// --- Meteorite: a lava ball drops onto the middle of the board and the whole grid takes the hit.
// The blocks are already damaged in the game logic; this is the incoming-ball + impact show. ---
const MINING_METEORITE_TEXTURE_PATH = '/assets/mine/Lava.png';

// Procedural lava-ball fallback (a faithful reproduction of the reference art) so the meteorite is
// always visible even without a custom PNG dropped at MINING_METEORITE_TEXTURE_PATH.
function miningMeteoriteCanvasTexture(): Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;
  const r = size / 2 - 6;

  // Molten body: a hot highlight near the top that deepens to a dark, near-black rim (gives volume).
  const body = ctx.createRadialGradient(c - r * 0.3, c - r * 0.38, r * 0.06, c, c, r);
  body.addColorStop(0, '#fff4c0');
  body.addColorStop(0.2, '#ffcf47');
  body.addColorStop(0.44, '#ff8a1e');
  body.addColorStop(0.72, '#ef331a');
  body.addColorStop(0.9, '#9c1507');
  body.addColorStop(1, '#560c04');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fill();

  // Keep every detail inside the sphere.
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.clip();

  // Cooled-magma craters: soft dark reddish-brown blotches of varying size.
  for (const [dx, dy, rr] of [[-0.28, 0.22, 0.17], [0.26, 0.32, 0.13], [0.36, -0.04, 0.1], [-0.06, -0.3, 0.12], [0.1, 0.46, 0.09], [-0.42, -0.08, 0.08]]) {
    const crater = ctx.createRadialGradient(c + dx * r, c + dy * r, 0, c + dx * r, c + dy * r, rr * r);
    crater.addColorStop(0, 'rgba(66, 12, 5, 0.9)');
    crater.addColorStop(0.7, 'rgba(96, 22, 9, 0.45)');
    crater.addColorStop(1, 'rgba(96, 22, 9, 0)');
    ctx.fillStyle = crater;
    ctx.beginPath();
    ctx.arc(c + dx * r, c + dy * r, rr * r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright molten flecks that catch the light.
  ctx.fillStyle = 'rgba(255, 244, 190, 0.92)';
  for (const [dx, dy, rr] of [[-0.34, -0.36, 0.055], [0.14, -0.16, 0.035], [-0.14, 0.08, 0.03]]) {
    ctx.beginPath();
    ctx.arc(c + dx * r, c + dy * r, rr * r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Shadow on the lower-right to round the sphere off.
  const shade = ctx.createRadialGradient(c - r * 0.32, c - r * 0.36, r * 0.2, c + r * 0.28, c + r * 0.32, r * 1.15);
  shade.addColorStop(0, 'rgba(20, 3, 1, 0)');
  shade.addColorStop(0.62, 'rgba(20, 3, 1, 0)');
  shade.addColorStop(1, 'rgba(20, 3, 1, 0.5)');
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

let miningMeteoriteTextureCache: Texture | null = null;
function miningMeteoriteTexture(): Texture {
  if (miningMeteoriteTextureCache) {
    return miningMeteoriteTextureCache;
  }
  // Start with the procedural ball so the meteorite is never invisible, then swap in the custom PNG
  // if /assets/mine/meteorite.png exists. On a 404 the fallback simply stays.
  miningMeteoriteTextureCache = miningMeteoriteCanvasTexture();
  miningTextureLoader.load(
    MINING_METEORITE_TEXTURE_PATH,
    (loaded) => {
      loaded.magFilter = NearestFilter;
      loaded.minFilter = NearestFilter;
      loaded.generateMipmaps = false;
      loaded.colorSpace = SRGBColorSpace;
      miningMeteoriteTextureCache = loaded;
      if (miningMeteoriteMaterial) {
        miningMeteoriteMaterial.map = loaded;
        miningMeteoriteMaterial.needsUpdate = true;
      }
      if (activeTerrain?.state && activeTerrain.canvas.isConnected) {
        renderMiningThreeTerrain(activeTerrain, activeTerrain.state);
      }
    },
    undefined,
    () => {
      /* no custom texture yet: keep the procedural fallback */
    },
  );
  return miningMeteoriteTextureCache;
}

let miningMeteoriteMaterial: SpriteMaterial | null = null;
function meteoriteSpriteMaterial(): SpriteMaterial {
  if (!miningMeteoriteMaterial) {
    // depthTest off so the falling ball always draws in front of the (intact) board instead of being
    // occluded by the blocks it is about to hit.
    miningMeteoriteMaterial = new SpriteMaterial({ map: miningMeteoriteTexture(), transparent: true, depthWrite: false, depthTest: false });
  }
  return miningMeteoriteMaterial;
}

// Must match the game-side fall duration so the ball lands exactly when the deferred damage strikes.
const MINING_METEORITE_FALL_MS = MINING_METEORITE_FALL_SECONDS * 1000;
// Starts well above the visible frame so the ball streaks in from off-screen, then lands on impact.
const MINING_METEORITE_START_HEIGHT = 9.5;
const MINING_METEORITE_LANDING_Y = 0.7;
// Peak per-frame screenshake (px) reached just before impact; it builds up as the ball nears the ground.
const MINING_METEORITE_MAX_FALL_SHAKE_PX = 6;
// Gentle tumble as it falls (radians per second the sprite texture spins).
const MINING_METEORITE_SPIN_RATE = 0.5;
// The ball settles this many screen pixels above the base landing point (converted to world units per
// fall so it stays a true 50px whatever the canvas size).
const MINING_METEORITE_LANDING_LIFT_PX = 50;
const miningMeteoriteFalls = new WeakMap<MiningThreeTerrain, { sprite: Sprite; startedAt: number; landingY: number }>();

// World Y where the ball ends its fall: the base landing raised by MINING_METEORITE_LANDING_LIFT_PX
// screen pixels (measured against the live projection so it is exactly that many pixels on screen).
function miningMeteoriteLandingY(terrain: MiningThreeTerrain): number {
  const base = MINING_METEORITE_LANDING_Y;
  const rect = terrain.canvas.getBoundingClientRect();
  if (rect.height <= 0) {
    return base;
  }
  terrain.camera.updateMatrixWorld(true);
  const a = new Vector3(0, base, 0).project(terrain.camera);
  const b = new Vector3(0, base + 1, 0).project(terrain.camera);
  const pxPerUnit = Math.abs(((a.y - b.y) / 2) * rect.height);
  return pxPerUnit > 0.001 ? base + MINING_METEORITE_LANDING_LIFT_PX / pxPerUnit : base + 0.9;
}

function miningCenterBlockId(): number {
  return Math.floor(MINING_GRID_ROWS / 2) * MINING_GRID_COLUMNS + Math.floor(MINING_GRID_COLUMNS / 2);
}

const miningMeteoriteTrailColors = ['#ff7a1f', '#ffb020', '#ffe45e', '#ff3b1f', '#ffffff'];
const miningMeteoriteTrailPerFrame = 6;
// Drop a dense clump of embers at the ball's current position each frame. They barely move, so as the
// ball keeps falling they stay behind in its wake and fade — forming a thick fiery comet tail.
function emitMiningMeteoriteTrail(terrain: MiningThreeTerrain, x: number, y: number, z: number): void {
  const states = miningParticleStates.get(terrain) ?? [];
  miningParticleStates.set(terrain, states);
  const group = miningParticleGroup(terrain);
  const overflow = states.length + miningMeteoriteTrailPerFrame - miningParticleMaxCount;
  if (overflow > 0) {
    const recycled = states.splice(0, overflow);
    for (const dead of recycled) {
      group.remove(dead.mesh);
    }
  }
  for (let i = 0; i < miningMeteoriteTrailPerFrame; i += 1) {
    const size = 0.24 + Math.random() * 0.36;
    const mesh = new Mesh(
      miningParticleGeometry,
      miningParticleMaterial(miningMeteoriteTrailColors[Math.floor(Math.random() * miningMeteoriteTrailColors.length)]!),
    );
    mesh.position.set(x + (Math.random() - 0.5) * 0.5, y + (Math.random() - 0.5) * 0.4, z + (Math.random() - 0.5) * 0.5);
    mesh.scale.setScalar(size);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    const life = 0.55 + Math.random() * 0.55;
    states.push({
      mesh,
      vx: (Math.random() - 0.5) * 0.5,
      vz: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.6, // barely moves, so it lingers in the ball's wake
      rx: (Math.random() - 0.5) * 6,
      ry: (Math.random() - 0.5) * 6,
      rz: (Math.random() - 0.5) * 6,
      size,
      life,
      maxLife: life,
      groundY: -1000, // trail floats high above the board; only its life removes it
      gravity: -1,
    });
  }
  miningParticleLastFrame.set(terrain, performance.now());
}

// Smoke uses its own translucent grey materials (the fire particles are opaque). Cached by colour so
// puffs share materials cheaply.
const miningSmokeMaterials = new Map<string, MeshBasicMaterial>();
function miningSmokeMaterial(hex: string): MeshBasicMaterial {
  const cached = miningSmokeMaterials.get(hex);
  if (cached) {
    return cached;
  }
  const material = new MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.5, depthWrite: false });
  miningSmokeMaterials.set(hex, material);
  return material;
}

const miningMeteoriteSmokeColors = ['#8f8f8f', '#6f6f6f', '#a6a6a6', '#585858'];
// Push one soft grey puff into the wake per frame. Barely rises and lives a long time, so a lazy
// smoke plume trails behind the fireball and lingers after the bright embers have burned out.
function emitMiningMeteoriteSmoke(terrain: MiningThreeTerrain, x: number, y: number, z: number): void {
  const states = miningParticleStates.get(terrain) ?? [];
  miningParticleStates.set(terrain, states);
  const group = miningParticleGroup(terrain);
  const overflow = states.length + 1 - miningParticleMaxCount;
  if (overflow > 0) {
    const recycled = states.splice(0, overflow);
    for (const dead of recycled) {
      group.remove(dead.mesh);
    }
  }
  const size = 0.34 + Math.random() * 0.4;
  const mesh = new Mesh(
    miningParticleGeometry,
    miningSmokeMaterial(miningMeteoriteSmokeColors[Math.floor(Math.random() * miningMeteoriteSmokeColors.length)]!),
  );
  mesh.position.set(x + (Math.random() - 0.5) * 0.55, y + (Math.random() - 0.5) * 0.4, z + (Math.random() - 0.5) * 0.55);
  mesh.scale.setScalar(size);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  group.add(mesh);
  const life = 1.6 + Math.random() * 1.3;
  states.push({
    mesh,
    vx: (Math.random() - 0.5) * 0.4,
    vz: (Math.random() - 0.5) * 0.4,
    vy: 0.5 + Math.random() * 0.5, // slow buoyant rise
    rx: (Math.random() - 0.5) * 1.4,
    ry: (Math.random() - 0.5) * 1.4,
    rz: (Math.random() - 0.5) * 1.4,
    size,
    life,
    maxLife: life,
    groundY: -1000, // smoke drifts up and away; only its life removes it
    gravity: -0.5, // eases the rise so it hangs and lingers near the apex
  });
  miningParticleLastFrame.set(terrain, performance.now());
}

const miningMeteoriteSmokePlumeCount = 26;
// A billowing column of smoke from the centre on impact, rising well above the board and lingering
// long after the fire fountain has settled.
function spawnMiningMeteoriteSmoke(terrain: MiningThreeTerrain): void {
  const states = miningParticleStates.get(terrain) ?? [];
  miningParticleStates.set(terrain, states);
  const group = miningParticleGroup(terrain);
  const overflow = states.length + miningMeteoriteSmokePlumeCount - miningParticleMaxCount;
  if (overflow > 0) {
    const recycled = states.splice(0, overflow);
    for (const dead of recycled) {
      group.remove(dead.mesh);
    }
  }
  const blockId = miningCenterBlockId();
  const centeredX = (blockId % MINING_GRID_COLUMNS) - (MINING_GRID_COLUMNS - 1) / 2;
  const centeredZ = Math.floor(blockId / MINING_GRID_COLUMNS) - (MINING_GRID_ROWS - 1) / 2;
  for (let i = 0; i < miningMeteoriteSmokePlumeCount; i += 1) {
    const size = 0.4 + Math.random() * 0.5;
    const mesh = new Mesh(
      miningParticleGeometry,
      miningSmokeMaterial(miningMeteoriteSmokeColors[i % miningMeteoriteSmokeColors.length]!),
    );
    mesh.position.set(centeredX + (Math.random() - 0.5) * 0.8, 0.5 + Math.random() * 0.5, centeredZ + (Math.random() - 0.5) * 0.8);
    mesh.scale.setScalar(size);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    const life = 2 + Math.random() * 1.6;
    states.push({
      mesh,
      vx: (Math.random() - 0.5) * 1.1,
      vz: (Math.random() - 0.5) * 1.1,
      vy: 1.4 + Math.random() * 1.4, // rises above the block stack
      rx: (Math.random() - 0.5) * 1.6,
      ry: (Math.random() - 0.5) * 1.6,
      rz: (Math.random() - 0.5) * 1.6,
      size,
      life,
      maxLife: life,
      groundY: -1000,
      gravity: -0.7, // decelerates the climb so the plume hangs and lingers
    });
  }
  miningParticleLastFrame.set(terrain, performance.now());
  scheduleMiningDamageFrame(terrain);
}

// --- Shockwave ("Énergie"): a bright leading rim races out, a softer rim trails it, and a warm
// diffuse halo glows underneath — all flat on the surface and additively blended for a punchy flash. ---
type MiningShockwaveLayer = { mesh: Mesh; material: MeshBasicMaterial };
type MiningShockwave = {
  group: Group;
  rim: MiningShockwaveLayer; // sharp bright leading edge
  trail: MiningShockwaveLayer; // second rim a touch behind
  halo: MiningShockwaveLayer; // soft warm glow disc
  startedAt: number;
  duration: number;
  maxRadius: number;
};
const miningShockwaves = new WeakMap<MiningThreeTerrain, MiningShockwave[]>();
// Two flat unit rings (outer radius 1) of different thickness + a unit glow plane; the mesh scale
// drives the actual radius each frame.
const miningShockwaveRimGeometry = new RingGeometry(0.86, 1, 72);
const miningShockwaveTrailGeometry = new RingGeometry(0.93, 1, 72);
const miningShockwaveHaloGeometry = new PlaneGeometry(1, 1);

// Soft radial warm glow drawn to a canvas → texture, so the halo fades smoothly to nothing.
let miningShockwaveHaloTextureCache: Texture | null = null;
function miningShockwaveHaloTexture(): Texture {
  if (miningShockwaveHaloTextureCache) {
    return miningShockwaveHaloTextureCache;
  }
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,224,160,0.95)');
  gradient.addColorStop(0.45, 'rgba(255,150,60,0.5)');
  gradient.addColorStop(1, 'rgba(255,110,40,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  miningShockwaveHaloTextureCache = texture;
  return texture;
}

function makeMiningShockwaveLayer(geometry: RingGeometry | PlaneGeometry, color: string, map: Texture | null): MiningShockwaveLayer {
  const material = new MeshBasicMaterial({
    color,
    map: map ?? undefined,
    transparent: true,
    opacity: 1,
    side: DoubleSide,
    depthWrite: false,
    depthTest: false, // always drawn on top of the surface so it never clips into blocks
    blending: AdditiveBlending, // warm light adds onto the board for a glowing punch
  });
  const mesh = new Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; // lay flat on the board surface (XZ plane)
  mesh.position.set(0, 0.52, 0); // just above the top face at board centre
  return { mesh, material };
}

function spawnMiningShockwave(terrain: MiningThreeTerrain): void {
  const group = new Group();
  const halo = makeMiningShockwaveLayer(miningShockwaveHaloGeometry, '#ffb060', miningShockwaveHaloTexture());
  const trail = makeMiningShockwaveLayer(miningShockwaveTrailGeometry, '#ffb055', null);
  const rim = makeMiningShockwaveLayer(miningShockwaveRimGeometry, '#fff0c8', null);
  halo.mesh.renderOrder = 7;
  trail.mesh.renderOrder = 8;
  rim.mesh.renderOrder = 9;
  group.add(halo.mesh, trail.mesh, rim.mesh);
  miningParticleGroup(terrain).add(group);
  const waves = miningShockwaves.get(terrain) ?? [];
  waves.push({ group, rim, trail, halo, startedAt: performance.now(), duration: 640, maxRadius: 3.3 });
  miningShockwaves.set(terrain, waves);
  scheduleMiningDamageFrame(terrain);
}

const miningShockwaveEaseOut = (p: number): number => 1 - (1 - p) * (1 - p);

// Expand each layer at its own pace while fading it, and drop the wave once it has run out.
function updateMiningShockwaves(terrain: MiningThreeTerrain, now: number): boolean {
  const waves = miningShockwaves.get(terrain);
  if (!waves || waves.length === 0) {
    return false;
  }
  const parent = miningParticleGroup(terrain);
  for (let i = waves.length - 1; i >= 0; i -= 1) {
    const wave = waves[i]!;
    const p = Math.min(1, (now - wave.startedAt) / wave.duration);
    if (p >= 1) {
      parent.remove(wave.group);
      wave.rim.material.dispose();
      wave.trail.material.dispose();
      wave.halo.material.dispose();
      waves.splice(i, 1);
      continue;
    }
    const span = wave.maxRadius - 0.3;
    // Leading rim: fast, bright, fades hard at the end.
    const rimR = 0.3 + span * miningShockwaveEaseOut(p);
    wave.rim.mesh.scale.setScalar(rimR);
    wave.rim.material.opacity = Math.min(1, 1.7 * (1 - p));
    // Trailing rim: a touch behind the leading edge, dimmer.
    const trailP = Math.max(0, (p - 0.16) / (1 - 0.16));
    const trailR = 0.3 + span * miningShockwaveEaseOut(trailP);
    wave.trail.mesh.scale.setScalar(trailR);
    wave.trail.material.opacity = (1 - p) * 0.8;
    // Warm halo: fills a bit inside the rim, glows then fades.
    const haloR = 0.3 + span * 0.9 * miningShockwaveEaseOut(p);
    wave.halo.mesh.scale.setScalar(haloR * 2); // plane spans -0.5..0.5, so scale to diameter
    wave.halo.material.opacity = (1 - p) * (1 - p) * 0.55;
  }
  return waves.length > 0;
}

function clearMiningShockwaves(terrain: MiningThreeTerrain): void {
  const waves = miningShockwaves.get(terrain);
  if (waves) {
    const parent = miningParticleGroups.get(terrain);
    for (const wave of waves) {
      parent?.remove(wave.group);
      wave.rim.material.dispose();
      wave.trail.material.dispose();
      wave.halo.material.dispose();
    }
    miningShockwaves.delete(terrain);
  }
}

// --- Impact bounce: every block gives a quick hop on impact, rippling outward from the centre so the
// jolt travels with the shockwave. Applied as a per-column Y offset in the render loop. ---
const MINING_METEORITE_BOUNCE_HEIGHT = 1.6; // world-unit hop at the peak
const MINING_METEORITE_BOUNCE_MS = 800; // duration of a single column's up-and-down
const MINING_METEORITE_BOUNCE_DELAY_PER_UNIT = 80; // ms of ripple delay per grid unit from centre
const MINING_METEORITE_BOUNCE_MAX_DELAY =
  Math.hypot((MINING_GRID_COLUMNS - 1) / 2, (MINING_GRID_ROWS - 1) / 2) * MINING_METEORITE_BOUNCE_DELAY_PER_UNIT;
const miningMeteoriteBounces = new WeakMap<MiningThreeTerrain, { startedAt: number; endsAt: number }>();

function startMiningMeteoriteBounce(terrain: MiningThreeTerrain): void {
  const now = performance.now();
  miningMeteoriteBounces.set(terrain, { startedAt: now, endsAt: now + MINING_METEORITE_BOUNCE_MAX_DELAY + MINING_METEORITE_BOUNCE_MS });
  scheduleMiningDamageFrame(terrain);
}

// Vertical hop for a block at (centeredX, centeredZ): a half-sine pop, delayed by its distance from
// the centre so the wave of hops rolls outward. Returns 0 outside the block's own hop window.
function miningMeteoriteBounceOffset(terrain: MiningThreeTerrain, centeredX: number, centeredZ: number, now: number): number {
  const bounce = miningMeteoriteBounces.get(terrain);
  if (!bounce) {
    return 0;
  }
  const delay = Math.hypot(centeredX, centeredZ) * MINING_METEORITE_BOUNCE_DELAY_PER_UNIT;
  const tt = (now - bounce.startedAt - delay) / MINING_METEORITE_BOUNCE_MS;
  if (tt <= 0 || tt >= 1) {
    return 0;
  }
  return Math.sin(tt * Math.PI) * MINING_METEORITE_BOUNCE_HEIGHT;
}

function miningMeteoriteBounceActive(terrain: MiningThreeTerrain, now: number): boolean {
  const bounce = miningMeteoriteBounces.get(terrain);
  if (!bounce) {
    return false;
  }
  if (now >= bounce.endsAt) {
    miningMeteoriteBounces.delete(terrain);
    return false;
  }
  return true;
}

// One-shot bright flash over the whole board on impact.
function flashMiningBoard(terrain: MiningThreeTerrain): void {
  const flash = terrain.canvas.closest('.mining-three-frame')?.querySelector<HTMLElement>('[data-mining-meteorite-flash]');
  flash?.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 220, easing: 'ease-out' });
}

function spawnMiningMeteorite(terrain: MiningThreeTerrain): void {
  const group = miningParticleGroup(terrain);
  const existing = miningMeteoriteFalls.get(terrain);
  if (existing) {
    group.remove(existing.sprite);
  }
  const sprite = new Sprite(meteoriteSpriteMaterial());
  sprite.scale.setScalar(3.2);
  sprite.position.set(0, MINING_METEORITE_START_HEIGHT, 0);
  sprite.renderOrder = 6;
  sprite.frustumCulled = false;
  group.add(sprite);
  miningMeteoriteFalls.set(terrain, { sprite, startedAt: performance.now(), landingY: miningMeteoriteLandingY(terrain) });
  // Keep the main render loop alive for the whole fall (a static board would otherwise stop it).
  scheduleMiningDamageFrame(terrain);
  animateMiningMeteorite(terrain);
}

function animateMiningMeteorite(terrain: MiningThreeTerrain): void {
  const fall = miningMeteoriteFalls.get(terrain);
  if (!fall) {
    return;
  }
  const group = miningParticleGroup(terrain);
  if (!terrain.canvas.isConnected) {
    group.remove(fall.sprite);
    miningMeteoriteFalls.delete(terrain);
    terrain.canvas.style.transform = '';
    return;
  }
  const t = Math.min(1, (performance.now() - fall.startedAt) / MINING_METEORITE_FALL_MS);
  const eased = 1 - Math.pow(1 - t, 1.6); // fast plunge in, gently decelerating (still moving at impact)
  fall.sprite.position.y = MINING_METEORITE_START_HEIGHT + (fall.landingY - MINING_METEORITE_START_HEIGHT) * eased;
  fall.sprite.scale.setScalar(3.2 + eased * 1.4);
  fall.sprite.material.rotation = ((performance.now() - fall.startedAt) / 1000) * MINING_METEORITE_SPIN_RATE;
  emitMiningMeteoriteTrail(terrain, fall.sprite.position.x, fall.sprite.position.y, fall.sprite.position.z);
  emitMiningMeteoriteSmoke(terrain, fall.sprite.position.x, fall.sprite.position.y, fall.sprite.position.z);
  // Escalating screenshake: barely a tremor up high, building to a violent rumble as it nears the
  // ground (magnitude grows with eased^2 so the last stretch really ramps up).
  const shakeMag = eased * eased * MINING_METEORITE_MAX_FALL_SHAKE_PX;
  const jx = (Math.random() - 0.5) * 2 * shakeMag;
  const jy = (Math.random() - 0.5) * 2 * shakeMag;
  terrain.canvas.style.transform = `translate(${jx.toFixed(2)}px, ${jy.toFixed(2)}px)`;
  terrain.renderer.render(terrain.scene, terrain.camera);
  if (t >= 1) {
    group.remove(fall.sprite);
    miningMeteoriteFalls.delete(terrain);
    // Clear the fall jitter, then a big one-shot impact shake + a towering debris fountain (per-block
    // break FX already fired on damage).
    terrain.canvas.style.transform = '';
    spawnMiningMeteoriteBurst(terrain);
    spawnMiningMeteoriteSmoke(terrain);
    spawnMiningShockwave(terrain);
    startMiningMeteoriteBounce(terrain);
    shakeMiningBoard(terrain, 8);
    flashMiningBoard(terrain);
    return;
  }
  window.requestAnimationFrame(() => animateMiningMeteorite(terrain));
}

const miningLastMeteoritePulse = new WeakMap<MiningThreeTerrain, number>();
// Drop a meteorite each time meteoritePulse advances (one per impact).
function updateMiningMeteoriteFx(terrain: MiningThreeTerrain, state: GameState): void {
  const previous = miningLastMeteoritePulse.get(terrain);
  miningLastMeteoritePulse.set(terrain, state.mining.meteoritePulse);
  if (previous === undefined || previous === state.mining.meteoritePulse) {
    return;
  }
  spawnMiningMeteorite(terrain);
}

// Explosive debris burst + shockwave + board shake where a block just lost a layer.
function miningParticleMaterial(hex: string): MeshBasicMaterial {
  const cached = miningParticleMaterials.get(hex);
  if (cached) {
    return cached;
  }
  const material = new MeshBasicMaterial({ color: hex });
  miningParticleMaterials.set(hex, material);
  return material;
}

const miningHoloParticleMaterials = new Map<string, Material>();

// Debris from a holo block shimmers with the same holographic sheen for its rarity tier.
function miningHoloParticleMaterial(hex: string, tier: number): Material {
  const key = `${tier}:${hex}`;
  const cached = miningHoloParticleMaterials.get(key);
  if (cached) {
    return cached;
  }
  const material = patchHoloMaterial(new MeshBasicMaterial({ color: hex }), tier);
  miningHoloParticleMaterials.set(key, material);
  return material;
}

function miningParticleGroup(terrain: MiningThreeTerrain): Group {
  let group = miningParticleGroups.get(terrain);
  if (!group) {
    group = new Group();
    terrain.scene.add(group);
    miningParticleGroups.set(terrain, group);
  }
  return group;
}

// Spawn 3D debris cubes at the broken block; they are depth-tested against the
// terrain, so debris from a back block is hidden behind the blocks in front.
function spawnMiningBreakParticles(
  terrain: MiningThreeTerrain,
  blockId: number,
  layersRemaining: number,
  materialId: MiningBlockMaterialId,
  holoTier: number,
): void {
  const holo = holoTier > 0;
  const states = miningParticleStates.get(terrain) ?? [];
  miningParticleStates.set(terrain, states);

  const group = miningParticleGroup(terrain);
  // Keep the live count bounded without ever skipping a break: recycle the OLDEST particles
  // (front of the array, from earlier frames) to make room. The cap fits a whole-board burst,
  // so this only trims older debris — the particles spawned this frame are always kept.
  const overflow = states.length + miningBreakParticleCount - miningParticleMaxCount;
  if (overflow > 0) {
    const recycled = states.splice(0, overflow);
    for (const dead of recycled) {
      group.remove(dead.mesh);
    }
  }
  const col = blockId % MINING_GRID_COLUMNS;
  const row = Math.floor(blockId / MINING_GRID_COLUMNS);
  const centeredX = col - (MINING_GRID_COLUMNS - 1) / 2;
  const centeredZ = row - (MINING_GRID_ROWS - 1) / 2;
  const topY = Math.max(0, layersRemaining) * miningLayerHeight + 0.06;
  const palette = miningPalettes[materialId] ?? miningPalettes.dirt;
  const colors = [palette.top, palette.left, palette.right];

  for (let i = 0; i < miningBreakParticleCount; i += 1) {
    // Rarer holo tiers throw slightly bigger debris (2x, 2.35x, 2.7x).
    const size = (0.06 + Math.random() * 0.08) * (holo ? 2 + (holoTier - 1) * 0.35 : 1);
    const material = holo
      ? miningHoloParticleMaterial(colors[i % colors.length]!, holoTier)
      : miningParticleMaterial(colors[i % colors.length]!);
    const mesh = new Mesh(miningParticleGeometry, material);
    mesh.position.set(
      centeredX + (Math.random() - 0.5) * 0.4,
      topY,
      centeredZ + (Math.random() - 0.5) * 0.4,
    );
    mesh.scale.setScalar(size);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    const angle = Math.random() * Math.PI * 2;
    // Holo debris erupts upward like a fountain: less horizontal spread, much more lift,
    // lighter gravity and a longer life so it rises well above the block and lingers.
    const speed = holo ? 0.3 + Math.random() * 0.6 : 0.5 + Math.random() * 1.5;
    const life = holo ? 1.7 + Math.random() * 1.0 : 0.9 + Math.random() * 0.7;
    states.push({
      mesh,
      vx: Math.cos(angle) * speed,
      vz: Math.sin(angle) * speed,
      vy: holo ? 3.6 + Math.random() * 1.8 : 1.6 + Math.random() * 2.4,
      rx: (Math.random() - 0.5) * 12,
      ry: (Math.random() - 0.5) * 12,
      rz: (Math.random() - 0.5) * 12,
      size,
      life,
      maxLife: life,
      groundY: topY,
      gravity: holo ? -4.5 : miningParticleGravity,
    });
  }
  miningParticleLastFrame.set(terrain, performance.now());
  scheduleMiningDamageFrame(terrain);
}

function updateMiningParticles(terrain: MiningThreeTerrain, now: number): boolean {
  const states = miningParticleStates.get(terrain);
  if (!states || states.length === 0) {
    return false;
  }
  const last = miningParticleLastFrame.get(terrain) ?? now;
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  miningParticleLastFrame.set(terrain, now);
  const group = miningParticleGroup(terrain);

  for (let i = states.length - 1; i >= 0; i -= 1) {
    const particle = states[i]!;
    particle.life -= dt;
    if (particle.life <= 0) {
      group.remove(particle.mesh);
      states.splice(i, 1);
      continue;
    }
    particle.vy += particle.gravity * dt;
    particle.mesh.position.x += particle.vx * dt;
    particle.mesh.position.y += particle.vy * dt;
    particle.mesh.position.z += particle.vz * dt;
    // Remove debris once it falls back to the break surface so none piles up below the block.
    if (particle.mesh.position.y < particle.groundY) {
      group.remove(particle.mesh);
      states.splice(i, 1);
      continue;
    }
    particle.mesh.rotation.x += particle.rx * dt;
    particle.mesh.rotation.y += particle.ry * dt;
    particle.mesh.rotation.z += particle.rz * dt;
    const fade = Math.min(1, particle.life / (particle.maxLife * 0.5));
    particle.mesh.scale.setScalar(particle.size * (0.2 + 0.8 * fade));
  }
  return states.length > 0;
}

function miningNeedsAnimation(terrain: MiningThreeTerrain): boolean {
  if (miningDamageAnimationsAreMoving(terrain)) {
    return true;
  }
  if (miningMeteoriteFalls.has(terrain)) {
    return true;
  }
  const shockwaves = miningShockwaves.get(terrain);
  if (shockwaves && shockwaves.length > 0) {
    return true;
  }
  const bombFlashes = miningBombFlashes.get(terrain);
  if (bombFlashes && bombFlashes.length > 0) {
    return true;
  }
  if (miningMeteoriteBounceActive(terrain, performance.now())) {
    return true;
  }
  if (miningWaveActive(terrain)) {
    return true;
  }
  if (miningHoloEnabled()) {
    return true;
  }
  if (terrain.state?.mining.blocks.some((block) => block.holoTier > 0 && block.layersRemaining > 0)) {
    return true;
  }
  const states = miningParticleStates.get(terrain);
  return Boolean(states && states.length > 0);
}

function clearMiningParticles(terrain: MiningThreeTerrain): void {
  clearMiningShockwaves(terrain);
  clearMiningBombFlashes(terrain);
  const group = miningParticleGroups.get(terrain);
  if (group) {
    group.clear();
    terrain.scene.remove(group);
    miningParticleGroups.delete(terrain);
  }
  miningParticleStates.delete(terrain);
}

function spawnMiningBreakFx(
  terrain: MiningThreeTerrain,
  blockId: number,
  layersRemaining: number,
  materialId: MiningBlockMaterialId,
  holoTier: number,
): void {
  const frame = terrain.canvas.parentElement;
  if (!frame) {
    return;
  }
  shakeMiningBoard(terrain);
  spawnMiningBreakParticles(terrain, blockId, layersRemaining, materialId, holoTier);

  const rect = terrain.canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  const col = blockId % MINING_GRID_COLUMNS;
  const row = Math.floor(blockId / MINING_GRID_COLUMNS);
  const centeredX = col - (MINING_GRID_COLUMNS - 1) / 2;
  const centeredZ = row - (MINING_GRID_ROWS - 1) / 2;
  const topY = Math.max(0, layersRemaining) * miningLayerHeight + 0.1;
  terrain.camera.updateMatrixWorld(true);
  const projected = new Vector3(centeredX, topY, centeredZ).project(terrain.camera);
  const px = (projected.x * 0.5 + 0.5) * rect.width;
  const py = (-projected.y * 0.5 + 0.5) * rect.height;

  // Central shockwave flash (a brief 2D glow at the impact point).
  const flash = document.createElement('div');
  flash.className = 'mining-fx-flash';
  flash.style.left = `${px}px`;
  flash.style.top = `${py}px`;
  miningFxLayer(frame).appendChild(flash);
  const flashAnimation = flash.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0.3)', opacity: 0.6 },
      { transform: 'translate(-50%, -50%) scale(1.9)', opacity: 0 },
    ],
    { duration: 320, easing: 'ease-out' },
  );
  flashAnimation.onfinish = () => flash.remove();
}

export function miningThreeCameraViewSize(
  columns = MINING_GRID_COLUMNS,
  rows = MINING_GRID_ROWS,
): number {
  const projectedBoardWidth = (Math.max(1, columns) + Math.max(1, rows)) / Math.SQRT2;
  return projectedBoardWidth / miningBoardWidthTargetRatio;
}

export function miningLayerTransforms(layersRemaining: number, topScale = 1): MiningLayerTransform[] {
  const layerCount = Math.max(0, Math.floor(layersRemaining));
  const clampedTopScale = Math.max(0, Math.min(1, topScale));
  return Array.from({ length: layerCount }, (_, layerIndex) => {
    const isTop = layerIndex === layerCount - 1;
    const height = miningLayerHeight * (isTop ? clampedTopScale : 1);
    return {
      y: layerIndex * miningLayerHeight + height / 2,
      height,
      isTop,
    };
  });
}

// Screen-pixel radius of the round range reticle. Sized off the WIDE lattice axis (halfW) so the
// circle encloses the whole reach; the same value drives BOTH the drawn ring and the hit test, so
// what the circle visually covers is exactly what gets mined.
export function miningAttackCircleRadiusPx(rangePixels: number, halfWidthPx: number): number {
  return Math.SQRT2 * (Math.max(0, rangePixels) / 16) * Math.max(0, halfWidthPx);
}

// Shortest distance (screen px) from a point offset (dx, dy) from a tile's centre to that tile's
// top-face diamond (half-extents halfW horizontal, halfH vertical). 0 when the point sits on/inside
// the diamond. The round reticle then hits a tile whenever radius >= this distance — i.e. whenever
// the circle OVERLAPS the tile — symmetric in every direction regardless of the iso squash.
export function miningPointToDiamondDistance(
  dx: number,
  dy: number,
  halfW: number,
  halfH: number,
): number {
  const a = Math.max(1e-6, halfW);
  const b = Math.max(1e-6, halfH);
  const px = Math.abs(dx);
  const py = Math.abs(dy);
  if (px / a + py / b <= 1) {
    return 0;
  }
  // Project onto the first-quadrant boundary segment (a, 0) -> (0, b) and clamp to it.
  const lenSq = a * a + b * b;
  let t = ((px - a) * -a + py * b) / lenSq;
  t = Math.min(1, Math.max(0, t));
  const nearestX = a - t * a;
  const nearestY = t * b;
  return Math.hypot(px - nearestX, py - nearestY);
}

export function syncMiningThreeTerrain(state: GameState, onDigBlocks: (blockIds: number[]) => void): void {
  disposeDetachedMiningTerrains();

  const canvas = document.querySelector<HTMLCanvasElement>('[data-mining-3d-board]');
  if (!canvas) {
    return;
  }

  const terrain = terrainByCanvas.get(canvas) ?? createMiningThreeTerrain(canvas);
  activeTerrain = terrain;
  activeDigHandler = onDigBlocks;
  installMiningThreePointerListener();
  canvas.onpointerdown = handleMiningThreePointerDown;
  canvas.onmousedown = handleMiningThreePointerDown;
  canvas.onpointermove = handleMiningThreePointerMove;
  canvas.onpointerleave = handleMiningThreePointerLeave;
  terrain.state = state;
  if (canvas.parentElement) {
    ensureMiningCrtControls(canvas.parentElement);
  }
  resizeMiningThreeTerrain(terrain);
  // Reuse the last hover result for visibility; the next pointer move recomputes it precisely.
  updateMiningAttackRangeIndicator(terrain, terrain.highlightIds.size > 0);
  renderMiningThreeTerrain(terrain, state);
  updateMiningDamagePopups(terrain, state);
  updateMiningRewardPopups(terrain, state);
  updateMiningBombFx(terrain, state);
  updateMiningMeteoriteFx(terrain, state);
  updateMiningAutoClickHands(terrain, state);
  // Keep the animation loop alive for continuous effects (e.g. the holo sheen sweep).
  if (miningNeedsAnimation(terrain)) {
    scheduleMiningDamageFrame(terrain);
  }
}

function createMiningThreeTerrain(canvas: HTMLCanvasElement): MiningThreeTerrain {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(1);

  const scene = new Scene();
  scene.add(new AmbientLight(0xffffff, 2.8));

  const keyLight = new DirectionalLight(0xffffff, 0.4);
  keyLight.position.set(2, 5, 4);
  scene.add(keyLight);

  const camera = new OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
  camera.position.set(6.8, 6.4, 6.8);
  camera.lookAt(new Vector3(0, 1.5, 0));

  const terrain = new Group();
  scene.add(terrain);

  // Dark floor that only shows through the gaps between blocks. Kept just inside the
  // terrain footprint so its edge hides under the outer blocks instead of casting a
  // hard black shape onto the frame's border.
  const floorGeometry = new PlaneGeometry(MINING_GRID_COLUMNS - 0.1, MINING_GRID_ROWS - 0.1);
  const floorMaterial = new MeshBasicMaterial({ color: 0x07171e });
  const floor = new Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.05;
  scene.add(floor);

  const blockGeometry = new BoxGeometry(1, 1, 1);
  const emptyGeometry = new BoxGeometry(0.88, 0.02, 0.88);
  const emptyMaterial = new MeshBasicMaterial({ color: emptyMarkerColor });
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const materials = new Map<string, Material[]>();
  const textures = new Map<string, Texture>();
  const attackRangeIndicator = canvas.parentElement?.querySelector<HTMLDivElement>('[data-mining-attack-range]') ?? null;
  const blockMeshes: Mesh[] = [];
  const damageAnimations = new Map<number, MiningDamageAnimation>();

  const cleanup = () => {
    if (activeTerrain === instance) {
      activeTerrain = null;
      activeDigHandler = null;
    }
    canvas.onpointerdown = null;
    canvas.onmousedown = null;
    canvas.onpointermove = null;
    canvas.onpointerleave = null;
    releaseMiningPressedBlock(instance);
    stopMiningHoverLoop(instance);
    clearMiningParticles(instance);
    if (instance.animationFrame !== null) {
      window.cancelAnimationFrame(instance.animationFrame);
      instance.animationFrame = null;
    }
    blockGeometry.dispose();
    emptyGeometry.dispose();
    emptyMaterial.dispose();
    floorGeometry.dispose();
    floorMaterial.dispose();
    for (const materialSet of materials.values()) {
      for (const material of materialSet) {
        material.dispose();
      }
    }
    for (const texture of textures.values()) {
      texture.dispose();
    }
    renderer.dispose();
  };

  const instance = {
    canvas,
    renderer,
    scene,
    camera,
    raycaster,
    pointer,
    terrain,
    blockMeshes,
    blockGeometry,
    emptyGeometry,
    emptyMaterial,
    materials,
    textures,
    attackRangeIndicator,
    pointerClientX: null,
    pointerClientY: null,
    holdTimeout: null,
    state: null,
    damageAnimations,
    animationFrame: null,
    highlightIds: new Set<number>(),
    cleanup,
  };
  terrainByCanvas.set(canvas, instance);
  activeTerrains.add(instance);
  return instance;
}

function installMiningThreePointerListener(): void {
  document.removeEventListener('pointerdown', handleMiningThreePointerDown, true);
  document.removeEventListener('mousedown', handleMiningThreePointerDown, true);
  document.removeEventListener('pointerup', handleMiningThreePointerRelease, true);
  document.removeEventListener('mouseup', handleMiningThreePointerRelease, true);
  document.removeEventListener('pointercancel', handleMiningThreePointerRelease, true);
  window.removeEventListener('blur', handleMiningThreeWindowBlur);
  document.addEventListener('pointerdown', handleMiningThreePointerDown, true);
  document.addEventListener('mousedown', handleMiningThreePointerDown, true);
  document.addEventListener('pointerup', handleMiningThreePointerRelease, true);
  document.addEventListener('mouseup', handleMiningThreePointerRelease, true);
  document.addEventListener('pointercancel', handleMiningThreePointerRelease, true);
  window.addEventListener('blur', handleMiningThreeWindowBlur);
}

function handleMiningThreePointerDown(event: PointerEvent | MouseEvent): void {
  const terrain = activeTerrain;
  if (!terrain || !activeDigHandler || !terrain.state) {
    return;
  }
  const state = terrain.state;

  // The level strip and overlay toggles sit over the canvas rect; let them handle their own clicks.
  const target = event.target as Element | null;
  if (target?.closest?.('[data-mining-level-strip], [data-mining-crt-toggle], [data-mining-holo-toggle]')) {
    return;
  }

  const rect = terrain.canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
    return;
  }
  const now = performance.now();
  if (now - lastInputAt < 80 && Math.abs(event.clientX - lastInputX) < 2 && Math.abs(event.clientY - lastInputY) < 2) {
    return;
  }
  lastInputAt = now;
  lastInputX = event.clientX;
  lastInputY = event.clientY;

  event.preventDefault();
  // Update the pointer position (and kick off the hover loop) even when the click itself is capped.
  rememberMiningPointerPosition(terrain, event.clientX, event.clientY);

  // Manual click limit: at most 10/s. The hover loop and autoclicker are not affected by this.
  if (now - lastManualDigAt < miningManualClickMinIntervalMs) {
    return;
  }

  terrain.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  terrain.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  // Every block whose top diamond the range circle overlaps is diggable — not only the one under
  // the cursor centre. Aiming the circle over blocks mines them even when its centre is on a gap,
  // an edge or a side wall.
  const affectedSet = new Set(
    miningBlockIdsTouchedByPointer(terrain, terrain.pointer, miningAttackRangePixels(state), rect),
  );
  // Also include the block directly under the cursor (if any) so a block's edge never misses,
  // even when its diamond centre falls just outside a small circle.
  const centerBlockId = miningRaycastTopBlockId(terrain);
  if (centerBlockId !== null) {
    affectedSet.add(centerBlockId);
  }
  if (affectedSet.size === 0) {
    return;
  }
  const affectedBlockIds = [...affectedSet];

  lastManualDigAt = now;
  // Push in every block the click hits, not just the primary one.
  startMiningPressAnimation(terrain, affectedBlockIds);
  activeDigHandler(affectedBlockIds);
}

function handleMiningThreePointerMove(event: PointerEvent): void {
  const terrain = activeTerrain;
  if (!terrain || event.currentTarget !== terrain.canvas) {
    return;
  }
  rememberMiningPointerPosition(terrain, event.clientX, event.clientY);
}

function handleMiningThreePointerLeave(event: PointerEvent): void {
  const terrain = activeTerrain;
  if (!terrain || event.currentTarget !== terrain.canvas) {
    return;
  }
  terrain.pointerClientX = null;
  terrain.pointerClientY = null;
  terrain.attackRangeIndicator?.classList.remove('is-visible');
  if (terrain.highlightIds.size > 0) {
    terrain.highlightIds = new Set<number>();
    scheduleMiningDamageFrame(terrain);
  }
  stopMiningHoverLoop(terrain);
}

function rememberMiningPointerPosition(terrain: MiningThreeTerrain, clientX: number, clientY: number): void {
  terrain.pointerClientX = clientX;
  terrain.pointerClientY = clientY;
  // Highlight the blocks currently in the touch zone (what a click would hit) and re-render so the
  // highlight follows the cursor. This is empty when the cursor is over a side wall / empty space.
  const targeted = miningBlockIdsUnderPointer(terrain);
  terrain.highlightIds = new Set(targeted);
  // Only show the reticle where an attack could actually land — hide it over walls / empty space.
  updateMiningAttackRangeIndicator(terrain, targeted.length > 0);
  scheduleMiningDamageFrame(terrain);
  // Hovering over the board is enough to mine — no button hold required.
  startMiningHoverLoop(terrain);
}

function updateMiningAttackRangeIndicator(terrain: MiningThreeTerrain, targetable: boolean): void {
  const indicator = terrain.attackRangeIndicator;
  const state = terrain.state;
  if (!indicator || !state || terrain.pointerClientX === null || terrain.pointerClientY === null) {
    indicator?.classList.remove('is-visible');
    return;
  }

  const canvasRect = terrain.canvas.getBoundingClientRect();
  const frameRect = terrain.canvas.parentElement?.getBoundingClientRect() ?? canvasRect;
  const rangePixels = miningAttackRangePixels(state);
  const { width, height } = projectedMiningAttackRangeSize(terrain, rangePixels, canvasRect);
  indicator.style.left = `${terrain.pointerClientX - frameRect.left}px`;
  indicator.style.top = `${terrain.pointerClientY - frameRect.top}px`;
  indicator.style.setProperty('--mining-attack-range-w', `${width}px`);
  indicator.style.setProperty('--mining-attack-range-h', `${height}px`);
  indicator.dataset.rangePixels = String(rangePixels);
  indicator.classList.add('is-visible');
  // The reticle always follows the cursor so it stays visible everywhere; it just dims to an
  // "inactive" outline over a side wall / empty space where no attack can land.
  indicator.classList.toggle('is-inactive', !targetable);
}

// Size of the range reticle. The touch zone itself is a diamond-matching ellipse (≈2.5:1 wide in
// grid space), but drawing that flat pancake reads badly, so the reticle is rendered as a round
// CIRCLE sized to the HORIZONTAL reach. Using the wide axis for both dimensions keeps the circle
// enclosing the whole touch zone — no side-tile ever lights up outside the ring — while giving it a
// taller, proper-circle silhouette. The cyan highlight remains the exact source of truth for hits.
function projectedMiningAttackRangeSize(
  terrain: MiningThreeTerrain,
  rangePixels: number,
  canvasRect: DOMRect,
): { width: number; height: number } {
  const basis = miningIsoScreenBasis(terrain, canvasRect);
  const halfW = (Math.abs(basis.ax) + Math.abs(basis.bx)) / 2;
  const diameter = miningAttackCircleRadiusPx(rangePixels, halfW) * 2;
  return { width: diameter, height: diameter };
}

// The two projected grid-edge vectors (in screen pixels) that span the iso lattice: one step along
// +x world and one step along +z world. Used to un-project a screen offset back into grid units so
// distance is measured on the diamond lattice instead of the squashed screen.
export interface MiningIsoBasis {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  det: number;
}

function miningIsoScreenBasis(terrain: MiningThreeTerrain, canvasRect: DOMRect): MiningIsoBasis {
  terrain.camera.updateMatrixWorld(true);
  const center = new Vector3(0, 0, 0).project(terrain.camera);
  const xNeighbor = new Vector3(1, 0, 0).project(terrain.camera);
  const zNeighbor = new Vector3(0, 0, 1).project(terrain.camera);
  // Same screen convention as the pointer/centre maths: x grows right, y grows down.
  const ax = ((xNeighbor.x - center.x) * canvasRect.width) / 2;
  const ay = (-(xNeighbor.y - center.y) * canvasRect.height) / 2;
  const bx = ((zNeighbor.x - center.x) * canvasRect.width) / 2;
  const by = (-(zNeighbor.y - center.y) * canvasRect.height) / 2;
  return { ax, ay, bx, by, det: ax * by - bx * ay };
}


function handleMiningThreePointerRelease(): void {
  const terrain = activeTerrain;
  if (!terrain) {
    activePressedBlockIds.clear();
    return;
  }
  // Releasing the button only ends the press animation; hover mining keeps going while the
  // cursor stays over the board (it stops on pointerleave / window blur).
  releaseMiningPressedBlock(terrain);
}

function handleMiningThreeWindowBlur(): void {
  const terrain = activeTerrain;
  if (terrain) {
    stopMiningHoverLoop(terrain);
  }
  handleMiningThreePointerRelease();
}

// The block the cursor targets, or null when it is over a deeper layer's wall or empty space. A
// column renders as one mesh per remaining layer, tagged isTopLayer on the current (topmost) one —
// the only "live" block. A hit counts when it lands on that top layer, whether on its top face OR on
// its own wall band; a hit on a lower layer's exposed wall (a deeper, not-yet-reached block) does
// not. Raycasting returns the nearest mesh first, so a taller block's wall still blocks the surface
// behind it.
function miningRaycastTopBlockId(terrain: MiningThreeTerrain): number | null {
  terrain.scene.updateMatrixWorld(true);
  terrain.camera.updateMatrixWorld(true);
  terrain.raycaster.setFromCamera(terrain.pointer, terrain.camera);
  const hit = terrain.raycaster.intersectObjects(terrain.blockMeshes, false)[0];
  if (!hit || hit.object.userData.isTopLayer !== true) {
    return null;
  }
  const id = hit.object.userData.blockId;
  return typeof id === 'number' ? id : null;
}

function miningBlockIdsUnderPointer(terrain: MiningThreeTerrain): number[] {
  const state = terrain.state;
  if (!state || terrain.pointerClientX === null || terrain.pointerClientY === null) {
    return [];
  }
  const rect = terrain.canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return [];
  }
  terrain.pointer.x = ((terrain.pointerClientX - rect.left) / rect.width) * 2 - 1;
  terrain.pointer.y = -(((terrain.pointerClientY - rect.top) / rect.height) * 2 - 1);
  // Everything the range circle covers on screen gets mined: a block is targeted whenever the
  // circle overlaps its top diamond, even if the cursor centre is on a gap or a side wall.
  const ids = new Set(miningBlockIdsTouchedByPointer(terrain, terrain.pointer, miningAttackRangePixels(state), rect));
  // Also include the block directly under the cursor so hovering a block's edge still mines it.
  const primary = miningRaycastTopBlockId(terrain);
  if (primary !== null) {
    ids.add(primary);
  }
  return [...ids];
}

// Hover mining: while the cursor is over the board (no button held), auto-dig whatever is under
// the circle at the Click Holder rate, re-targeting each tick so it never needs a re-press.
function startMiningHoverLoop(terrain: MiningThreeTerrain): void {
  if (terrain.holdTimeout !== null) {
    return;
  }
  scheduleMiningHoverClick(terrain);
}

function scheduleMiningHoverClick(terrain: MiningThreeTerrain): void {
  const state = terrain.state;
  const rate = state ? miningHoldClickRate(state) : 0;
  if (rate <= 0 || terrain.pointerClientX === null || terrain.pointerClientY === null) {
    terrain.holdTimeout = null;
    return;
  }
  terrain.holdTimeout = window.setTimeout(() => {
    terrain.holdTimeout = null;
    if (!terrain.canvas.isConnected || terrain.pointerClientX === null) {
      return;
    }
    const blockIds = miningBlockIdsUnderPointer(terrain);
    if (blockIds.length > 0) {
      activeDigHandler?.(blockIds);
    }
    // Keep looping even with no block under the cursor, so it resumes as soon as one is.
    scheduleMiningHoverClick(terrain);
  }, 1000 / rate);
}

function stopMiningHoverLoop(terrain: MiningThreeTerrain): void {
  if (terrain.holdTimeout !== null) {
    window.clearTimeout(terrain.holdTimeout);
    terrain.holdTimeout = null;
  }
}

function startMiningPressAnimation(terrain: MiningThreeTerrain, blockIds: number[]): void {
  const now = performance.now();
  for (const blockId of blockIds) {
    activePressedBlockIds.add(blockId);
    terrain.damageAnimations.set(blockId, {
      phase: 'pressing',
      startedAt: now,
      releaseStartedAt: 0,
      releaseFromScale: 1,
    });
  }
  scheduleMiningDamageFrame(terrain);
}

function releaseMiningPressedBlock(terrain: MiningThreeTerrain): void {
  if (activePressedBlockIds.size === 0) {
    return;
  }
  const now = performance.now();
  const blockIds = [...activePressedBlockIds];
  activePressedBlockIds.clear();
  for (const blockId of blockIds) {
    const animation = terrain.damageAnimations.get(blockId);
    if (!animation) {
      continue;
    }
    animation.releaseFromScale = miningDamageScaleForAnimation(animation, now);
    animation.releaseStartedAt = now;
    animation.phase = 'releasing';
  }
  scheduleMiningDamageFrame(terrain);
}

function scheduleMiningDamageFrame(terrain: MiningThreeTerrain): void {
  if (terrain.animationFrame === null) {
    terrain.animationFrame = window.requestAnimationFrame(() => animateMiningDamage(terrain));
  }
}

function animateMiningDamage(terrain: MiningThreeTerrain): void {
  terrain.animationFrame = null;
  const state = terrain.state;
  if (!state || !terrain.canvas.isConnected) {
    terrain.damageAnimations.clear();
    clearMiningParticles(terrain);
    return;
  }

  const now = performance.now();
  miningHoloTimeUniform.value = now / 1000;
  updateMiningParticles(terrain, now);
  updateMiningShockwaves(terrain, now);
  updateMiningBombFlashes(terrain, now);
  renderMiningThreeTerrain(terrain, state);
  if (terrain.animationFrame === null && miningNeedsAnimation(terrain)) {
    terrain.animationFrame = window.requestAnimationFrame(() => animateMiningDamage(terrain));
  }
}

function miningDamageAnimationsAreMoving(terrain: MiningThreeTerrain): boolean {
  for (const animation of terrain.damageAnimations.values()) {
    if (animation.phase !== 'held') {
      return true;
    }
  }
  return false;
}

function miningBlockIdsTouchedByPointer(
  terrain: MiningThreeTerrain,
  pointer: Vector2,
  rangePixels: number,
  canvasRect: DOMRect,
): number[] {
  const basis = miningIsoScreenBasis(terrain, canvasRect);
  const halfW = (Math.abs(basis.ax) + Math.abs(basis.bx)) / 2;
  const halfH = (Math.abs(basis.ay) + Math.abs(basis.by)) / 2;
  if (halfW <= 0 || halfH <= 0) {
    return [];
  }

  const pointerX = ((pointer.x + 1) * canvasRect.width) / 2;
  const pointerY = ((1 - pointer.y) * canvasRect.height) / 2;
  // The touch zone is the same round circle the reticle draws: a tile is hit when the circle
  // overlaps its diamond (radius >= point-to-diamond distance). Measuring to the diamond — not the
  // centre — keeps every direction symmetric, and using the wide-axis radius means what the circle
  // covers on screen is exactly what gets mined.
  const radius = miningAttackCircleRadiusPx(rangePixels, halfW);
  const projected = new Vector3();
  const affectedBlockIds = new Set<number>();
  for (const mesh of terrain.blockMeshes) {
    if (!mesh.userData.isTopLayer || typeof mesh.userData.blockId !== 'number') {
      continue;
    }
    projected.set(0, 0.5, 0).applyMatrix4(mesh.matrixWorld).project(terrain.camera);
    const centerX = ((projected.x + 1) * canvasRect.width) / 2;
    const centerY = ((1 - projected.y) * canvasRect.height) / 2;
    const distance = miningPointToDiamondDistance(centerX - pointerX, centerY - pointerY, halfW, halfH);
    if (distance <= radius) {
      affectedBlockIds.add(mesh.userData.blockId);
    }
  }
  return [...affectedBlockIds];
}

// New-wave entry animation: each layer drops in from above and bounces into place.
const miningWaveState = new WeakMap<MiningThreeTerrain, { blocks: unknown; startedAt: number }>();
const miningWaveEntryHeight = 3.4;
const miningWaveLayerDurationMs = 420;
const miningWaveLayerStaggerMs = 60;
const miningWaveBlockStaggerMs = 45;
const miningWaveTotalMs = 1200;

// Overshoot easing so the layer lands, dips, then springs back up ("petit rebond").
function miningEaseOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const u = t - 1;
  return 1 + c3 * u * u * u + c1 * u * u;
}

function miningWaveActive(terrain: MiningThreeTerrain): boolean {
  const wave = miningWaveState.get(terrain);
  return wave ? performance.now() - wave.startedAt < miningWaveTotalMs : false;
}

function renderMiningThreeTerrain(terrain: MiningThreeTerrain, state: GameState): void {
  terrain.terrain.clear();
  terrain.blockMeshes.length = 0;
  const now = performance.now();
  const lastLayers = miningLastLayers.get(terrain) ?? new Map<number, number>();
  miningLastLayers.set(terrain, lastLayers);
  const lastHolo = miningLastHolo.get(terrain) ?? new Map<number, number>();
  miningLastHolo.set(terrain, lastHolo);

  // Trigger the entry animation whenever the blocks array is regenerated (advancing,
  // selecting a level, or refilling a revisited wave) — a new array reference. Normal
  // mining mutates the same array, so it does not replay. The first render starts
  // already settled so opening the mine does not replay it.
  const previousWave = miningWaveState.get(terrain);
  if (!previousWave) {
    miningWaveState.set(terrain, { blocks: state.mining.blocks, startedAt: now - miningWaveTotalMs });
  } else if (previousWave.blocks !== state.mining.blocks) {
    previousWave.blocks = state.mining.blocks;
    previousWave.startedAt = now;
  }
  const wave = miningWaveState.get(terrain)!;
  const waveAnimating = now - wave.startedAt < miningWaveTotalMs;

  for (const block of state.mining.blocks) {
    const previousLayers = lastLayers.get(block.id);
    if (previousLayers !== undefined && previousLayers > block.layersRemaining) {
      // The broken layer's holo tier was captured before it re-rolled for the next layer.
      spawnMiningBreakFx(terrain, block.id, block.layersRemaining, block.material, lastHolo.get(block.id) ?? 0);
      // Drop any press animation: the layer that was pushed in is gone, so the newly-revealed layer
      // below must appear at full height instead of inheriting the still-held squash.
      activePressedBlockIds.delete(block.id);
      terrain.damageAnimations.delete(block.id);
    }
    lastLayers.set(block.id, block.layersRemaining);
    lastHolo.set(block.id, block.holoTier);

    const x = block.id % MINING_GRID_COLUMNS;
    const z = Math.floor(block.id / MINING_GRID_COLUMNS);
    const centeredX = x - (MINING_GRID_COLUMNS - 1) / 2;
    const centeredZ = z - (MINING_GRID_ROWS - 1) / 2;

    if (block.layersRemaining <= 0) {
      const marker = createEmptyMarker(terrain, centeredX, centeredZ);
      terrain.terrain.add(marker);
      continue;
    }

    const topScale = miningDamageScaleForBlock(terrain, block.id, now);
    const bounceOffset = miningMeteoriteBounceOffset(terrain, centeredX, centeredZ, now);
    const spriteIndex = miningBlockSpriteTierForDepth(block.depth).spriteIndex;
    const layerTransforms = miningLayerTransforms(block.layersRemaining, topScale);
    const layerCount = layerTransforms.length;
    const globalHolo = miningHoloEnabled();
    // The TNT band sits on ONE stable layer per bomb block (spread across all 5 by a per-block
    // hash), so different bombs surface their TNT at different depths — never the whole column.
    const bombLayer = miningBlockHash(block.id) % MINING_TERRAIN_LAYER_COUNT;
    for (const [layerIndex, layer] of layerTransforms.entries()) {
      let entryOffset = 0;
      if (waveAnimating) {
        const delay = (x + z) * miningWaveBlockStaggerMs + layerIndex * miningWaveLayerStaggerMs;
        const progress = (now - wave.startedAt - delay) / miningWaveLayerDurationMs;
        if (progress <= 0) {
          continue; // this layer has not dropped in yet
        }
        if (progress < 1) {
          entryOffset = (1 - miningEaseOutBack(progress)) * miningWaveEntryHeight;
        }
      }
      const materialSet = materialSetForBlock(
        terrain,
        spriteIndex,
        block.material,
        block.id,
        layerIndex,
        layerCount,
        // Exactly one layer of a bomb block is TNT (its designated depth), never the full column.
        block.special === 'bomb' && layerIndex === bombLayer,
      );
      // Only the exposed top layer shows the block's holo rarity; lower layers stay normal.
      // The global holo toggle paints everything with the base (tier 1) sheen.
      const layerTier = globalHolo ? 1 : (block.holoTier > 0 && layer.isTop ? block.holoTier : 0);
      const material = layerTier > 0 ? holoPatchedMaterialSet(materialSet, layerTier) : materialSet;
      const mesh = new Mesh(terrain.blockGeometry, material);
      mesh.position.set(centeredX, layer.y + entryOffset + bounceOffset, centeredZ);
      mesh.scale.set(miningBlockFootprint, layer.height, miningBlockFootprint);
      mesh.userData.blockId = block.id;
      mesh.userData.layerIndex = layerIndex;
      mesh.userData.isTopLayer = layer.isTop;
      terrain.terrain.add(mesh);
      terrain.blockMeshes.push(mesh);
    }

    const healthRatio = block.maxHealth > 0 ? block.health / block.maxHealth : 0;
    const crackLevel = miningCrackLevel(healthRatio);
    const topLayer = layerTransforms[layerCount - 1];
    if (crackLevel > 0 && topLayer) {
      const stage = miningCrackStage(block.id, crackLevel);
      const crack = new Mesh(miningCrackGeometry, miningCrackMaterial(terrain, stage));
      crack.rotation.x = -Math.PI / 2;
      crack.position.set(centeredX, topLayer.y + topLayer.height / 2 + 0.012 + bounceOffset, centeredZ);
      crack.renderOrder = 2;
      terrain.terrain.add(crack);
    }

    // Hover highlight: light up the top of each block currently in the cursor's touch zone.
    if (terrain.highlightIds.has(block.id) && topLayer) {
      const glow = new Mesh(miningHighlightGeometry, miningHighlightFill());
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(centeredX, topLayer.y + topLayer.height / 2 + 0.03 + bounceOffset, centeredZ);
      glow.renderOrder = 3;
      terrain.terrain.add(glow);
    }
  }

  terrain.renderer.render(terrain.scene, terrain.camera);
}

function miningDamageScaleForBlock(terrain: MiningThreeTerrain, blockId: number, now: number): number {
  const animation = terrain.damageAnimations.get(blockId);
  if (!animation) {
    return 1;
  }

  const scale = miningDamageScaleForAnimation(animation, now);
  if (animation.phase === 'releasing' && scale >= 1) {
    terrain.damageAnimations.delete(blockId);
    return 1;
  }
  return scale;
}

function miningDamageScaleForAnimation(animation: MiningDamageAnimation, now: number): number {
  if (animation.phase === 'held') {
    return 1 - miningDamageCompression;
  }
  if (animation.phase === 'pressing') {
    const progress = Math.min(1, (now - animation.startedAt) / miningDamagePressMs);
    if (progress >= 1) {
      animation.phase = 'held';
      return 1 - miningDamageCompression;
    }
    return 1 - easeOutMiningDamage(progress) * miningDamageCompression;
  }

  const progress = Math.min(1, (now - animation.releaseStartedAt) / miningDamageReleaseMs);
  return animation.releaseFromScale + (1 - animation.releaseFromScale) * easeOutMiningDamage(progress);
}

function easeOutMiningDamage(progress: number): number {
  return 1 - (1 - progress) * (1 - progress);
}

function createEmptyMarker(terrain: MiningThreeTerrain, centeredX: number, centeredZ: number): Mesh {
  const marker = new Mesh(terrain.emptyGeometry, terrain.emptyMaterial);
  marker.position.set(centeredX, -0.02, centeredZ);
  return marker;
}

function materialSetForBlock(
  terrain: MiningThreeTerrain,
  spriteIndex: number,
  materialId: MiningBlockMaterialId,
  blockId: number,
  layerIndex: number,
  layerCount: number,
  isBomb: boolean,
): Material[] {
  const variant = miningBlockVariant(blockId, layerIndex, layerCount);
  if (isBomb) {
    const bombKey = `tnt:${variant.bucket}`;
    const cachedBomb = terrain.materials.get(bombKey);
    if (cachedBomb) {
      return cachedBomb;
    }
    // Fixed orientation (no flip/rotation) keeps the "TNT" label upright; keep the AO brightness.
    const bombVariant: MiningBlockVariant = { orient: 0, bucket: variant.bucket, brightness: variant.brightness };
    const bombSet = texturedMaterialSetForBlock(terrain, tntTextureFaces, tntPalette, bombVariant);
    terrain.materials.set(bombKey, bombSet);
    return bombSet;
  }
  const textureFaces = miningTextureFacesForTier(spriteIndex);
  const materialKey = `${spriteIndex}:${materialId}:${variant.orient}:${variant.bucket}`;
  const cached = terrain.materials.get(materialKey);
  if (cached) {
    return cached;
  }

  const palette = miningPalettes[materialId] ?? miningPalettes.dirt;
  const materialSet = textureFaces
    ? texturedMaterialSetForBlock(terrain, textureFaces, palette, variant)
    : flatMaterialSetForBlock(palette, variant);
  terrain.materials.set(materialKey, materialSet);
  return materialSet;
}

function texturedMaterialSetForBlock(
  terrain: MiningThreeTerrain,
  faces: MiningTextureFaces,
  palette: MiningPalette,
  variant: MiningBlockVariant,
): Material[] {
  // Rotate the square top; flip the side strips on X/Y (aspect-preserving, unlike
  // rotation which would distort the vertically-squished side faces).
  const flipX = (variant.orient & 1) === 1;
  const flipY = (variant.orient & 2) === 2;
  const tint = miningTintColor(variant.brightness);
  const top = pixelTextureForFace(terrain, faces.top, { rotationQuarters: variant.orient });
  const left = pixelTextureForFace(terrain, faces.left, { mirror: flipX, flipY });
  const right = pixelTextureForFace(terrain, faces.right, { mirror: flipX, flipY });
  return [
    new MeshBasicMaterial({ map: right, color: tint }),
    new MeshBasicMaterial({ map: left, color: tint }),
    new MeshBasicMaterial({ map: top, color: tint }),
    new MeshBasicMaterial({ color: miningScaledColor(palette.bottom, variant.brightness) }),
    new MeshBasicMaterial({ map: right, color: tint }),
    new MeshBasicMaterial({ map: left, color: tint }),
  ];
}

function flatMaterialSetForBlock(palette: MiningPalette, variant: MiningBlockVariant): Material[] {
  const b = variant.brightness;
  return [
    new MeshBasicMaterial({ color: miningScaledColor(palette.right, b) }),
    new MeshBasicMaterial({ color: miningScaledColor(palette.left, b) }),
    new MeshBasicMaterial({ color: miningScaledColor(palette.top, b) }),
    new MeshBasicMaterial({ color: miningScaledColor(palette.bottom, b) }),
    new MeshBasicMaterial({ color: miningScaledColor(palette.right, b) }),
    new MeshBasicMaterial({ color: miningScaledColor(palette.left, b) }),
  ];
}

function pixelTextureForFace(
  terrain: MiningThreeTerrain,
  path: string,
  transform: MiningFaceTransform = {},
): Texture {
  const rotationQuarters = (((transform.rotationQuarters ?? 0) % 4) + 4) % 4;
  const mirror = transform.mirror ? 1 : 0;
  const flipY = transform.flipY ? 1 : 0;
  const textureKey = `${path}:${rotationQuarters}:${mirror}:${flipY}`;
  const cached = terrain.textures.get(textureKey);
  if (cached) {
    return cached;
  }

  const texture = miningTextureLoader.load(path, () => {
    if (terrain.state && terrain.canvas.isConnected) {
      renderMiningThreeTerrain(terrain, terrain.state);
    }
  });
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = SRGBColorSpace;
  if (rotationQuarters !== 0 || mirror || flipY) {
    texture.center.set(0.5, 0.5);
  }
  if (rotationQuarters !== 0) {
    texture.rotation = (rotationQuarters * Math.PI) / 2;
  }
  if (mirror) {
    texture.repeat.x = -1;
  }
  if (flipY) {
    texture.repeat.y = -1;
  }
  terrain.textures.set(textureKey, texture);
  return texture;
}

function resizeMiningThreeTerrain(terrain: MiningThreeTerrain): void {
  const rect = terrain.canvas.getBoundingClientRect();
  const width = Math.max(160, Math.floor(rect.width * 0.62));
  const height = Math.max(120, Math.floor(rect.height * 0.62));
  if (terrain.canvas.width !== width || terrain.canvas.height !== height) {
    terrain.renderer.setSize(width, height, false);
  }

  const aspect = width / height;
  const viewSize = miningThreeCameraViewSize();
  terrain.camera.left = (-viewSize * aspect) / 2;
  terrain.camera.right = (viewSize * aspect) / 2;
  terrain.camera.top = viewSize / 2;
  terrain.camera.bottom = -viewSize / 2;
  terrain.camera.updateProjectionMatrix();
}

function disposeDetachedMiningTerrains(): void {
  for (const terrain of [...activeTerrains]) {
    if (terrain.canvas.isConnected) {
      continue;
    }
    terrain.cleanup();
    activeTerrains.delete(terrain);
  }
}
