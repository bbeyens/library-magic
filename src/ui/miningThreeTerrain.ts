import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three';
import {
  MINING_GRID_COLUMNS,
  MINING_GRID_ROWS,
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
  state: GameState | null;
  damageAnimations: Map<number, MiningDamageAnimation>;
  animationFrame: number | null;
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

const terrainByCanvas = new WeakMap<HTMLCanvasElement, MiningThreeTerrain>();
const activeTerrains = new Set<MiningThreeTerrain>();
const emptyMarkerColor = new Color('#14371f');
const miningDamagePressMs = 90;
const miningDamageReleaseMs = 150;
const miningDamageCompression = 0.12;
let activeTerrain: MiningThreeTerrain | null = null;
let activeDigHandler: ((blockId: number) => void) | null = null;
let activePressedBlockId: number | null = null;
let lastInputAt = 0;
let lastInputX = 0;
let lastInputY = 0;

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

export function syncMiningThreeTerrain(state: GameState, onDigBlock: (blockId: number) => void): void {
  disposeDetachedMiningTerrains();

  const canvas = document.querySelector<HTMLCanvasElement>('[data-mining-3d-board]');
  if (!canvas) {
    return;
  }

  const terrain = terrainByCanvas.get(canvas) ?? createMiningThreeTerrain(canvas);
  activeTerrain = terrain;
  activeDigHandler = onDigBlock;
  installMiningThreePointerListener();
  canvas.onpointerdown = handleMiningThreePointerDown;
  canvas.onmousedown = handleMiningThreePointerDown;
  terrain.state = state;
  resizeMiningThreeTerrain(terrain);
  renderMiningThreeTerrain(terrain, state);
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

  const blockGeometry = new BoxGeometry(1, 1, 1);
  const emptyGeometry = new BoxGeometry(0.88, 0.02, 0.88);
  const emptyMaterial = new MeshBasicMaterial({ color: emptyMarkerColor });
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const materials = new Map<string, Material[]>();
  const blockMeshes: Mesh[] = [];
  const damageAnimations = new Map<number, MiningDamageAnimation>();

  const cleanup = () => {
    if (activeTerrain === instance) {
      activeTerrain = null;
      activeDigHandler = null;
    }
    canvas.onpointerdown = null;
    canvas.onmousedown = null;
    releaseMiningPressedBlock(instance);
    if (instance.animationFrame !== null) {
      window.cancelAnimationFrame(instance.animationFrame);
      instance.animationFrame = null;
    }
    blockGeometry.dispose();
    emptyGeometry.dispose();
    emptyMaterial.dispose();
    for (const materialSet of materials.values()) {
      for (const material of materialSet) {
        material.dispose();
      }
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
    state: null,
    damageAnimations,
    animationFrame: null,
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
  if (!terrain || !activeDigHandler) {
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
  terrain.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  terrain.pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  terrain.scene.updateMatrixWorld(true);
  terrain.camera.updateMatrixWorld(true);
  terrain.raycaster.setFromCamera(terrain.pointer, terrain.camera);
  const hit = terrain.raycaster.intersectObjects(terrain.blockMeshes, false)[0];
  const blockId = hit?.object.userData.blockId ?? nearestProjectedBlockId(terrain.blockMeshes, terrain.camera, terrain.pointer);
  if (typeof blockId !== 'number') {
    return;
  }

  startMiningPressAnimation(terrain, blockId);
  activeDigHandler(blockId);
}

function handleMiningThreePointerRelease(): void {
  const terrain = activeTerrain;
  if (!terrain) {
    activePressedBlockId = null;
    return;
  }
  releaseMiningPressedBlock(terrain);
}

function handleMiningThreeWindowBlur(): void {
  handleMiningThreePointerRelease();
}

function startMiningPressAnimation(terrain: MiningThreeTerrain, blockId: number): void {
  const now = performance.now();
  activePressedBlockId = blockId;
  terrain.damageAnimations.set(blockId, {
    phase: 'pressing',
    startedAt: now,
    releaseStartedAt: 0,
    releaseFromScale: 1,
  });
  scheduleMiningDamageFrame(terrain);
}

function releaseMiningPressedBlock(terrain: MiningThreeTerrain): void {
  if (activePressedBlockId === null) {
    return;
  }
  const now = performance.now();
  const blockId = activePressedBlockId;
  activePressedBlockId = null;
  const animation = terrain.damageAnimations.get(blockId);
  if (!animation) {
    return;
  }
  animation.releaseFromScale = miningDamageScaleForAnimation(animation, now);
  animation.releaseStartedAt = now;
  animation.phase = 'releasing';
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
    return;
  }

  renderMiningThreeTerrain(terrain, state);
  if (miningDamageAnimationsAreMoving(terrain)) {
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

function nearestProjectedBlockId(blockMeshes: Mesh[], camera: OrthographicCamera, pointer: Vector2): number | null {
  let bestBlockId: number | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  const projected = new Vector3();

  for (const mesh of blockMeshes) {
    projected.set(mesh.position.x, mesh.position.y + mesh.scale.y / 2, mesh.position.z).project(camera);
    const distance = Math.hypot(projected.x - pointer.x, projected.y - pointer.y);
    if (distance >= bestDistance) {
      continue;
    }
    bestDistance = distance;
    bestBlockId = typeof mesh.userData.blockId === 'number' ? mesh.userData.blockId : null;
  }

  return bestDistance <= 0.16 ? bestBlockId : null;
}

function renderMiningThreeTerrain(terrain: MiningThreeTerrain, state: GameState): void {
  terrain.terrain.clear();
  terrain.blockMeshes.length = 0;
  const now = performance.now();

  for (const block of state.mining.blocks) {
    const x = block.id % MINING_GRID_COLUMNS;
    const z = Math.floor(block.id / MINING_GRID_COLUMNS);
    const centeredX = x - (MINING_GRID_COLUMNS - 1) / 2;
    const centeredZ = z - (MINING_GRID_ROWS - 1) / 2;

    if (block.layersRemaining <= 0) {
      const marker = createEmptyMarker(terrain, centeredX, centeredZ);
      terrain.terrain.add(marker);
      continue;
    }

    const height = block.layersRemaining * 0.42 * miningDamageScaleForBlock(terrain, block.id, now);
    const mesh = new Mesh(terrain.blockGeometry, materialSetForBlock(terrain, block.material));
    mesh.position.set(centeredX, height / 2, centeredZ);
    mesh.scale.set(1, height, 1);
    mesh.userData.blockId = block.id;
    mesh.userData.layersRemaining = block.layersRemaining;
    terrain.terrain.add(mesh);
    terrain.blockMeshes.push(mesh);
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

function materialSetForBlock(terrain: MiningThreeTerrain, materialId: MiningBlockMaterialId): Material[] {
  const cached = terrain.materials.get(materialId);
  if (cached) {
    return cached;
  }

  const palette = miningPalettes[materialId] ?? miningPalettes.dirt;
  const materialSet = [
    new MeshBasicMaterial({ color: palette.right }),
    new MeshBasicMaterial({ color: palette.left }),
    new MeshBasicMaterial({ color: palette.top }),
    new MeshBasicMaterial({ color: palette.bottom }),
    new MeshBasicMaterial({ color: palette.right }),
    new MeshBasicMaterial({ color: palette.left }),
  ];
  terrain.materials.set(materialId, materialSet);
  return materialSet;
}

function resizeMiningThreeTerrain(terrain: MiningThreeTerrain): void {
  const rect = terrain.canvas.getBoundingClientRect();
  const width = Math.max(160, Math.floor(rect.width * 0.62));
  const height = Math.max(120, Math.floor(rect.height * 0.62));
  if (terrain.canvas.width !== width || terrain.canvas.height !== height) {
    terrain.renderer.setSize(width, height, false);
  }

  const aspect = width / height;
  const viewSize = 6.3;
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
