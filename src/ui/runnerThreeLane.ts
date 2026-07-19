import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  AnimationMixer,
  BackSide,
  Box3,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  ConeGeometry,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  LoopOnce,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PCFSoftShadowMap,
  Raycaster,
  RingGeometry,
  Scene,
  Sprite,
  SpriteMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type AnimationAction,
  type AnimationClip,
  type Material,
  Object3D,
  type BufferGeometry,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

import type { GameState, RunnerDefeatEffect } from '../game/simulation/state';
import {
  RUNNER_INJURED_ANIMATION_SPEED,
  runnerFoxGameplayAnimationState,
  runnerFoxLateralDirection,
  runnerGroundCorrectionY,
  runnerInPlaceRootTrackValues,
  runnerPointerTargetX,
  runnerShootingClipTime,
  type RunnerGameplayAnimationState,
  type RunnerLateralDirection,
} from './runnerHeroAnimation';
import {
  RUNNER_BASE_ATTACKS,
  RUNNER_BOOST_PORTAL_LEFT_X,
  RUNNER_BOOST_PORTAL_RIGHT_X,
  RUNNER_GATE_HALF_WIDTH,
  RUNNER_LANE_HALF_WIDTH,
  RUNNER_IMPACT_LIFETIME_MS,
  RUNNER_DEFEAT_EFFECT_LIFETIME_MS,
  RUNNER_MAX_ACTIVE_IMPACTS,
  RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS,
  RUNNER_MAX_ACTIVE_PROJECTILES,
  RUNNER_SPAWN_AHEAD,
  type RunnerGateKind,
  type RunnerUpgradeId,
} from '../game/simulation/runnerRules';
import {
  runnerEnemyModelId,
  RUNNER_MONSTER_MODEL_IDS,
} from '../game/simulation/runnerEditorRules';
import { runnerDeathTransitionPhase } from '../game/simulation/runnerDeathTransition';
import type { RunnerEditorInteraction } from './runnerEditor';
import { RUNNER_TERRAIN_SEGMENT_COUNT, runnerTerrainSegmentPositions } from './runnerTerrainLoop';
import {
  RUNNER_MAX_MULTISHOT_ORBS,
  RUNNER_MULTISHOT_ORB_REFLOW_MS,
  runnerMultishotOrbFormation,
  runnerMultishotOrbReflow,
  type RunnerMultishotOrbPosition,
} from './runnerMultishotOrbs';

/**
 * Three.js view for the Runner mini-game.
 *
 * The hero and authored terrain stay fixed. `run.distance` is logical progression;
 * moving entities are drawn at `z - distance`, so enemies approach the player while
 * the camera and terrain remain anchored at the origin.
 */

interface RunnerLane {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  world: Group;
  units: Group;
  enemies: Group;
  gates: Group;
  boostPortals: Group;
  bullets: Group;
  terrain: Group;
  terrainSegments: Group[];
  road: Mesh;
  playerHero: Group;
  contactShadow: Mesh;
  runnerMultishotOrbCore: InstancedMesh;
  runnerMultishotOrbGlow: InstancedMesh;
  runnerMultishotOrbHalo: InstancedMesh;
  runnerMultishotOrbWisp: InstancedMesh;
  runnerMultishotOrbPositions: RunnerMultishotOrbPosition[];
  runnerMultishotOrbLastFrameAt: number | null;
  menuCamp: Group;
  menuHeroSlot: Group;
  launchTransition: RunnerLaunchTransition | null;
  launchRafId: number | null;
  heroTemplate: RunnerHeroTemplate | null;
  unitPool: Mesh[];
  enemyPool: Group[];
  enemyTemplates: RunnerEnemyTemplate[];
  fireballInstances: InstancedMesh[];
  fireballDrawCalls: number;
  runnerImpactParticles: InstancedMesh;
  runnerCoinInstances: InstancedMesh[];
  runnerCoinDrawCalls: number;
  runnerCoinLabels: Sprite[];
  runnerDeathSmoke: InstancedMesh;
  runnerDeathSmokeOutline: InstancedMesh;
  gatePool: Mesh[];
  boostPortalPool: Group[];
  boostFeedback: Sprite;
  enemyLabels: Sprite[];
  playerLabel: Sprite | null;
  gateTextures: Map<string, CanvasTexture>;
  boostPortalTextures: Map<RunnerUpgradeId, CanvasTexture>;
  boostFeedbackTextures: Map<RunnerUpgradeId, CanvasTexture>;
  numberTextures: Map<string, CanvasTexture>;
  coinPopupTextures: Map<string, CanvasTexture>;
  width: number;
  height: number;
  runnerHeroLateralDirection: RunnerLateralDirection;
}

interface RunnerEnemyTemplate {
  scene: Group;
  clips: AnimationClip[];
}

interface RunnerHeroTemplate extends RunnerEnemyTemplate {
  menuClip: AnimationClip | null;
  heroClips: Partial<Record<RunnerHeroAnimationId, AnimationClip>>;
}

interface RunnerFireballTemplate {
  parts: Array<{ geometry: BufferGeometry; material: Material | Material[] }>;
  drawCalls: number;
}

type RunnerCoinTemplate = RunnerFireballTemplate;

type RunnerHeroAnimationId =
  | 'standing'
  | 'sitToStand'
  | RunnerGameplayAnimationState;

interface RunnerLaunchTransition {
  startedAt: number;
  durationMs: number;
  onComplete: (initialPlayerX?: number) => void;
}

const laneByCanvas = new WeakMap<HTMLCanvasElement, RunnerLane>();

let keyListenerInstalled = false;
/** Arrow keys currently held. Drained by a dedicated rAF loop, NOT by the render path. */
const heldKeys = new Set<string>();
let keyboardRafId: number | null = null;
/** Latest squad position, mirrored on every render so keyboard nudges stay relative. */
let latestPlayerX = 0;
let latestRunnerPointerTargetX: number | null = null;
let onMove: ((x: number) => void) | null = null;
let latestRunnerState: GameState | null = null;
let editorInteraction: RunnerEditorInteraction | null = null;
let handledRunnerMenuReturnAt: number | null = null;
const runnerRaycaster = new Raycaster();
const runnerPointer = new Vector2();
const runnerFireballTransform = new Object3D();
const runnerImpactTransform = new Object3D();
const runnerDefeatTransform = new Object3D();
const runnerMultishotOrbTransform = new Object3D();
const runnerFoxGroundBounds = new Box3();
const runnerFoxGroundScale = new Vector3();
const runnerImpactColor = new Color();
const runnerImpactWhite = new Color('#ffffff');
const runnerImpactYellow = new Color('#ffef38');
const runnerImpactOrange = new Color('#ff7700');
const runnerImpactRed = new Color('#ff4500');
export const RUNNER_DEATH_SMOKE_FILL_DARK = '#9aa0a6';
export const RUNNER_DEATH_SMOKE_FILL_LIGHT = '#d6d9dd';
export const RUNNER_DEATH_SMOKE_OUTLINE_COLOR = '#555b62';
const runnerSmokeDark = new Color(RUNNER_DEATH_SMOKE_FILL_DARK);
const runnerSmokeLight = new Color(RUNNER_DEATH_SMOKE_FILL_LIGHT);

const ROAD_LENGTH = RUNNER_SPAWN_AHEAD + 30;
const ROAD_WIDTH = RUNNER_LANE_HALF_WIDTH * 2 + 1.6;
const RUNNER_MENU_TRANSITION_MS = 900;
const RUNNER_MENU_STAND_MS = 2_300;
const RUNNER_MENU_CAMERA_POSITION = new Vector3(0, 2.45, -4.85);
const RUNNER_MENU_CAMERA_TARGET = new Vector3(0, 0.7, 0.34);
const RUNNER_PLAY_CAMERA_POSITION = new Vector3(0, 7.2, -13.8);
const RUNNER_PLAY_CAMERA_TARGET = new Vector3(0, 0.65, 17);
const runnerCameraTarget = new Vector3();

const UNIT_RADIUS = 0.28;
const HERO_VISUAL_HEIGHT = 1.5;
const ENEMY_FALLBACK_SIZE = 0.62;
const ENEMY_VISUAL_HEIGHT = 1.05;
const RUNNER_MONSTER_ASSETS = [
  '/assets/runner/monsters/beholder.glb',
  '/assets/runner/monsters/cactus.glb',
  '/assets/runner/monsters/chest-monster.glb',
  '/assets/runner/monsters/skeleton-warrior.glb',
] as const;
const RUNNER_MONSTER_TEXTURE = '/assets/runner/monsters/monster-basecolor.png';
const RUNNER_FIREBALL_ASSET = '/assets/runner/projectiles/fireball.glb';
const RUNNER_COIN_ASSET = '/assets/runner/effects/coin.glb';
const RUNNER_COIN_POPUP_TEXTURE_CACHE_LIMIT = 32;
export const RUNNER_COIN_GOLD_COLOR = '#ffd21f';
export const RUNNER_FIREBALL_INSTANCE_CAPACITY = RUNNER_MAX_ACTIVE_PROJECTILES;
export const RUNNER_IMPACT_PARTICLES_PER_HIT = 9;
export const RUNNER_IMPACT_INSTANCE_CAPACITY =
  RUNNER_MAX_ACTIVE_IMPACTS * RUNNER_IMPACT_PARTICLES_PER_HIT;
export const RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT = 7;
export const RUNNER_DEATH_SMOKE_INSTANCE_CAPACITY =
  RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS * RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT;
const RUNNER_FOX_ASSET = '/assets/runner/heroes/boy.glb';
const RUNNER_SHOOTING_ASSET = '/assets/runner/heroes/shooting.fbx';
const RUNNER_PAIN_ASSET = '/assets/runner/heroes/pain-gesture.fbx';
const RUNNER_JUMP_ASSET = '/assets/runner/heroes/joyful-jump.fbx';
// Fraction of the shooting clip where the shot actually leaves (the recoil "bump"); the clip is
// phase-shifted so this frame coincides with each volley. Tunable to match the animation.
const RUNNER_SHOOTING_BUMP_FRACTION = 0.12;
const RUNNER_ENVIRONMENT_ASSETS = [
  '/assets/runner/environment/canyon-segment-1.glb',
  '/assets/runner/environment/canyon-segment-2.glb',
  '/assets/runner/environment/canyon-segment-3.glb',
] as const;

let runnerEnemyTemplatesPromise: Promise<RunnerEnemyTemplate[]> | null = null;
let runnerHeroTemplatePromise: Promise<RunnerHeroTemplate | null> | null = null;
const runnerExternalClipPromises = new Map<string, Promise<AnimationClip | null>>();
let runnerEnvironmentTemplatesPromise: Promise<Group[]> | null = null;
let runnerFireballTemplatePromise: Promise<RunnerFireballTemplate> | null = null;
let runnerCoinTemplatePromise: Promise<RunnerCoinTemplate> | null = null;

const gateColors: Record<RunnerGateKind, string> = {
  unit: '#4ade80',
  damage: '#f87171',
  fireRate: '#facc15',
  speed: '#60a5fa',
};

const gateLabels: Record<RunnerGateKind, string> = {
  unit: 'VIES',
  damage: 'DÉGÂTS',
  fireRate: 'CADENCE',
  speed: 'VITESSE',
};

const RUNNER_BOOST_PORTAL_LABELS: Record<RunnerUpgradeId, { icon: string; name: string; color: string }> = {
  baseDamage: { icon: '▲', name: 'DÉGÂTS', color: '#fb7185' },
  startUnits: { icon: '♥', name: 'PV', color: '#4ade80' },
  baseFireRate: { icon: '⌁', name: 'CADENCE', color: '#facc15' },
  lateralSpeed: { icon: '↔', name: 'VITESSE', color: '#22d3ee' },
  attackRange: { icon: '⌒', name: 'PORTÉE', color: '#fb923c' },
  multishot: { icon: '✣', name: 'MULTISHOT', color: '#c084fc' },
  homing: { icon: '⌖', name: 'HOMING', color: '#60a5fa' },
  projectileSpeed: { icon: '»', name: 'PROJECTILE', color: '#fbbf24' },
  gateQuality: { icon: '◈', name: 'PORTAILS', color: '#2dd4bf' },
  coinFlat: { icon: '◎', name: 'OR +', color: '#fde047' },
  coinGain: { icon: '◎', name: 'OR ×', color: '#fde047' },
};

const RUNNER_BOOST_PORTAL_WIDTH = 2.08;
const RUNNER_BOOST_PORTAL_HEIGHT = 1.72;
const RUNNER_BOOST_FEEDBACK_MS = 1_150;

export function syncRunnerThreeLane(
  state: GameState,
  onPlayerMove: (x: number) => void,
  nextEditorInteraction: RunnerEditorInteraction | null = null,
): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-runner-3d-lane]');
  if (!canvas) {
    return;
  }

  const lane = laneByCanvas.get(canvas) ?? createRunnerLane(canvas);
  onMove = onPlayerMove;
  latestRunnerState = state;
  editorInteraction = nextEditorInteraction;

  installRunnerKeyListener();
  canvas.onpointermove = handleRunnerPointerMove;
  canvas.onpointerdown = handleRunnerPointerDown;

  // NB: keyboard movement is driven by its own rAF loop (installRunnerKeyListener), never
  // polled here. Dispatching a move from inside the render path would re-enter renderHud
  // and recurse until the stack blows — which froze the game on any arrow press.
  resizeRunnerLane(lane, canvas);
  renderRunnerLane(lane, state);
}

function createRunnerLane(canvas: HTMLCanvasElement): RunnerLane {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    premultipliedAlpha: false,
  });
  renderer.setClearColor(0xa8ddf4, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  // Filmic tone mapping so highlights roll off instead of clipping; exposure lifts it back to the
  // previous brightness. Lit surfaces (environment, road, hero) gain depth and punch.
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new Scene();
  scene.background = null;
  scene.fog = new Fog(0xa8ddf4, 34, 76);
  // Softer, directional-friendly ambient: a low base fill + a sky/ground hemisphere so surfaces get a
  // natural top-lit gradient (warm sand bounce below, cool sky above) instead of a flat wash.
  scene.add(new AmbientLight(0xffffff, 0.45));
  scene.add(new HemisphereLight(0xbfe6ff, 0x7a5324, 0.85));
  const keyLight = new DirectionalLight(0xfff1cf, 2.5);
  keyLight.position.set(-8, 14, -10);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -14;
  keyLight.shadow.camera.right = 14;
  keyLight.shadow.camera.top = 28;
  keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 65;
  keyLight.shadow.bias = -0.0006;
  keyLight.shadow.normalBias = 0.02;
  keyLight.shadow.radius = 3.5;
  scene.add(keyLight);
  // Cool rim/back light from the opposite side to separate the squad from the canyon behind it.
  const rimLight = new DirectionalLight(0xbcd4ff, 0.8);
  rimLight.position.set(9, 8, 12);
  scene.add(rimLight);

  // Behind and above the squad, looking down the lane. Pulled far enough back that the
  // ground stays visible well behind z=0: the squad sits at the origin and its rear ranks
  // trail to about z=-3, so a closer camera clips the crowd off the bottom of the frame.
  const camera = new PerspectiveCamera(42, 0.6, 0.1, 200);
  camera.position.copy(RUNNER_MENU_CAMERA_POSITION);
  camera.lookAt(RUNNER_MENU_CAMERA_TARGET);

  const world = new Group();
  scene.add(world);

  const roadMaterial = new MeshLambertMaterial({ color: 0xd89235, transparent: true });
  const road = new Mesh(
    new PlaneGeometry(ROAD_WIDTH, ROAD_LENGTH),
    roadMaterial,
  );
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, -0.02, ROAD_LENGTH / 2 - 8);
  road.receiveShadow = true;
  world.add(road);

  const terrain = new Group();
  terrain.name = 'runner-canyon-terrain';
  world.add(terrain);

  const units = new Group();
  const playerHero = createRunnerHeroVisual();
  const contactShadow = createRunnerContactShadow();
  const {
    core: runnerMultishotOrbCore,
    glow: runnerMultishotOrbGlow,
    halo: runnerMultishotOrbHalo,
    wisp: runnerMultishotOrbWisp,
  } = createRunnerMultishotOrbs();
  units.add(
    contactShadow,
    playerHero,
    runnerMultishotOrbWisp,
    runnerMultishotOrbGlow,
    runnerMultishotOrbHalo,
    runnerMultishotOrbCore,
  );
  const { camp: menuCamp, heroSlot: menuHeroSlot } = createRunnerMenuCamp();
  const enemies = new Group();
  const gates = new Group();
  const boostPortals = new Group();
  const bullets = new Group();
  const runnerImpactParticles = createRunnerImpactParticles();
  const {
    fill: runnerDeathSmoke,
    outline: runnerDeathSmokeOutline,
  } = createRunnerDeathSmoke();
  const boostFeedback = new Sprite(new SpriteMaterial({ transparent: true, depthTest: false }));
  boostFeedback.visible = false;
  boostFeedback.renderOrder = 20;
  units.add(boostFeedback);
  bullets.add(runnerImpactParticles, runnerDeathSmokeOutline, runnerDeathSmoke);
  world.add(menuCamp, units, enemies, gates, boostPortals, bullets);

  const lane: RunnerLane = {
    renderer,
    scene,
    camera,
    world,
    units,
    enemies,
    gates,
    boostPortals,
    bullets,
    terrain,
    terrainSegments: [],
    road,
    playerHero,
    contactShadow,
    runnerMultishotOrbCore,
    runnerMultishotOrbGlow,
    runnerMultishotOrbHalo,
    runnerMultishotOrbWisp,
    runnerMultishotOrbPositions: [],
    runnerMultishotOrbLastFrameAt: null,
    menuCamp,
    menuHeroSlot,
    launchTransition: null,
    launchRafId: null,
    heroTemplate: null,
    unitPool: [],
    enemyPool: [],
    enemyTemplates: [],
    fireballInstances: [],
    fireballDrawCalls: 0,
    runnerImpactParticles,
    runnerCoinInstances: [],
    runnerCoinDrawCalls: 0,
    runnerCoinLabels: [],
    runnerDeathSmoke,
    runnerDeathSmokeOutline,
    gatePool: [],
    boostPortalPool: [],
    boostFeedback,
    enemyLabels: [],
    playerLabel: null,
    gateTextures: new Map(),
    boostPortalTextures: new Map(),
    boostFeedbackTextures: new Map(),
    numberTextures: new Map(),
    coinPopupTextures: new Map(),
    width: 0,
    height: 0,
    runnerHeroLateralDirection: 'idle',
  };

  laneByCanvas.set(canvas, lane);
  void loadRunnerEnemyTemplates(lane, canvas);
  void loadRunnerFoxTemplate(lane, canvas);
  void loadRunnerEnvironmentTemplates(lane, canvas);
  void loadRunnerFireball(lane, canvas);
  void loadRunnerCoin(lane, canvas);
  return lane;
}

function resizeRunnerLane(lane: RunnerLane, canvas: HTMLCanvasElement): void {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  if (lane.width === width && lane.height === height) {
    return;
  }

  lane.width = width;
  lane.height = height;
  lane.renderer.setSize(width, height, false);
  lane.camera.aspect = width / height;
  lane.camera.updateProjectionMatrix();
}

function createRunnerMenuCamp(): {
  camp: Group;
  heroSlot: Group;
} {
  const camp = new Group();
  camp.name = 'runner-menu-camp';
  camp.position.x = 0;

  const heroSlot = new Group();
  heroSlot.name = 'runner-menu-fox';
  heroSlot.position.set(0, 0.03, 0);
  heroSlot.scale.setScalar(1.12);
  camp.add(heroSlot);

  return { camp, heroSlot };
}

function renderRunnerLane(lane: RunnerLane, state: GameState): void {
  const run = state.runner;
  // Mirror the squad position so the keyboard loop can nudge relative to it.
  latestPlayerX = run.playerX;
  syncRunnerDeathFade(lane, state);

  syncRunnerTerrain(lane);
  lane.renderer.domElement.dataset.runnerTerrainMotion = 'stationary';
  const launching = lane.launchTransition !== null;
  const gameplayVisible = (run.running || run.dead) && !launching;
  lane.units.visible = gameplayVisible;
  lane.enemies.visible = gameplayVisible;
  lane.gates.visible = gameplayVisible;
  lane.boostPortals.visible = gameplayVisible;
  lane.bullets.visible = gameplayVisible;

  syncRunnerMenuScene(lane, state);
  syncRunnerMenuCamera(lane, state);

  if (gameplayVisible) {
    syncUnits(lane, state);
    syncEnemies(lane, state);
    syncGates(lane, state);
    syncRunnerBoostPortals(lane, state);
    syncBullets(lane, state);
    syncRunnerImpactParticles(lane, state);
    syncRunnerDefeatEffects(lane, state);
  } else {
    lane.runnerHeroLateralDirection = 'idle';
  }

  lane.renderer.render(lane.scene, lane.camera);
}

function syncRunnerMenuScene(lane: RunnerLane, state: GameState): void {
  const transition = lane.launchTransition;
  if (typeof state.runner.menuReturnAt === 'number' && state.runner.menuReturnAt !== handledRunnerMenuReturnAt) {
    handledRunnerMenuReturnAt = state.runner.menuReturnAt;
  }
  const menuVisible = (!state.runner.running && !state.runner.dead) || transition !== null;
  lane.menuCamp.visible = menuVisible;
  if (!menuVisible) {
    return;
  }

  const progress = transition
    ? Math.min(1, Math.max(0, (performance.now() - transition.startedAt) / RUNNER_MENU_TRANSITION_MS))
    : 0;
  const smoothProgress = progress * progress * (3 - 2 * progress);
  const model = lane.menuHeroSlot.getObjectByName('runner-menu-hero-model');
  if (!model) {
    return;
  }
  const animation = transition ? 'sitToStand' : 'sitting';
  const animationElapsed = transition ? performance.now() - transition.startedAt : state.lastTick;
  if (model.userData.runnerMenuHeroMixer) {
    syncRunnerMenuHeroAnimation(model, animation, animationElapsed);
  } else {
    applyRunnerSeatedPose(model, transition ? 0 : 1);
  }
  model.position.y = 0;
  model.rotation.y = transition ? Math.PI * (1 - smoothProgress) : Math.PI;
  groundRunnerFoxModel(model);
  lane.renderer.domElement.dataset.runnerMenuAnimation = animation;
}

function syncRunnerMenuCamera(lane: RunnerLane, state: GameState): void {
  if ((state.runner.running || state.runner.dead) && !lane.launchTransition) {
    lane.camera.position.copy(RUNNER_PLAY_CAMERA_POSITION);
    lane.camera.lookAt(RUNNER_PLAY_CAMERA_TARGET);
    return;
  }

  const transition = lane.launchTransition;
  const progress = transition
    ? Math.min(1, Math.max(0, (performance.now() - transition.startedAt) / RUNNER_MENU_TRANSITION_MS))
    : 0;
  const smoothProgress = progress * progress * (3 - 2 * progress);
  lane.camera.position.lerpVectors(RUNNER_MENU_CAMERA_POSITION, RUNNER_PLAY_CAMERA_POSITION, smoothProgress);
  runnerCameraTarget.lerpVectors(RUNNER_MENU_CAMERA_TARGET, RUNNER_PLAY_CAMERA_TARGET, smoothProgress);
  lane.camera.lookAt(runnerCameraTarget);
}

function syncRunnerDeathFade(lane: RunnerLane, state: GameState): void {
  const frame = lane.renderer.domElement.closest<HTMLElement>('.runner-lane-frame');
  if (!frame) {
    return;
  }
  const phase = runnerDeathTransitionPhase(state.runner, state.lastTick);
  frame.classList.toggle('is-runner-death-fading', phase === 'fading-out');
  frame.classList.toggle('is-runner-menu-fading-in', phase === 'fading-in');
  frame.dataset.runnerDeathTransition = phase;
}

function syncRunnerTerrain(lane: RunnerLane): void {
  const positions = runnerTerrainSegmentPositions();
  for (let index = 0; index < lane.terrainSegments.length; index += 1) {
    const segment = lane.terrainSegments[index]!;
    segment.position.z = positions[index] ?? 0;
  }
  lane.renderer.domElement.dataset.runnerTerrainAnchorZ = (positions[0] ?? 0).toFixed(3);
}

async function loadRunnerEnvironmentTemplates(lane: RunnerLane, canvas: HTMLCanvasElement): Promise<void> {
  const templates = await runnerEnvironmentTemplates();
  if (laneByCanvas.get(canvas) !== lane || templates.length === 0) {
    return;
  }

  lane.terrain.clear();
  lane.terrainSegments = [];
  for (let index = 0; index < RUNNER_TERRAIN_SEGMENT_COUNT; index += 1) {
    const template = templates[index % templates.length]!;
    const segment = template.clone(true) as Group;
    segment.name = `runner-canyon-segment-${index + 1}`;
    lane.terrain.add(segment);
    lane.terrainSegments.push(segment);
  }

  const roadMaterial = lane.road.material as MeshLambertMaterial;
  roadMaterial.opacity = 0;
  roadMaterial.depthWrite = false;
  roadMaterial.needsUpdate = true;
  syncRunnerTerrain(lane);
  lane.renderer.render(lane.scene, lane.camera);
}

function runnerEnvironmentTemplates(): Promise<Group[]> {
  if (!runnerEnvironmentTemplatesPromise) {
    const loader = new GLTFLoader();
    runnerEnvironmentTemplatesPromise = Promise.allSettled(
      RUNNER_ENVIRONMENT_ASSETS.map((asset) => loader.loadAsync(asset)),
    ).then((results) =>
      results.flatMap((result, index) => {
        if (result.status === 'rejected') {
          console.warn(
            `Runner environment model could not be loaded: ${RUNNER_ENVIRONMENT_ASSETS[index]}`,
            result.reason,
          );
          return [];
        }
        result.value.scene.traverse((object) => {
          if (object instanceof Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
            object.userData.runnerSharedEnvironmentAsset = true;
          }
        });
        return [result.value.scene];
      }),
    );
  }
  return runnerEnvironmentTemplatesPromise;
}

export function runnerFireballInstanceCount(bulletCount: number): number {
  return Math.min(RUNNER_FIREBALL_INSTANCE_CAPACITY, Math.max(0, Math.floor(bulletCount)));
}

export function runnerImpactInstanceCount(activeImpactCount: number): number {
  const impacts = Math.min(RUNNER_MAX_ACTIVE_IMPACTS, Math.max(0, Math.floor(activeImpactCount)));
  return impacts * RUNNER_IMPACT_PARTICLES_PER_HIT;
}

export function runnerDeathSmokeInstanceCount(activeEffectCount: number): number {
  const effects = Math.min(RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS, Math.max(0, Math.floor(activeEffectCount)));
  return effects * RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT;
}

function createRunnerImpactParticles(): InstancedMesh {
  const instances = new InstancedMesh(
    new BoxGeometry(0.16, 0.16, 0.16),
    new MeshBasicMaterial({ color: 0xffffff, toneMapped: false, vertexColors: true }),
    RUNNER_IMPACT_INSTANCE_CAPACITY,
  );
  instances.name = 'runner-fire-impact-particles';
  instances.count = 0;
  instances.visible = false;
  instances.frustumCulled = false;
  instances.castShadow = false;
  instances.receiveShadow = false;
  instances.instanceMatrix.setUsage(DynamicDrawUsage);
  instances.setColorAt(0, runnerImpactWhite);
  return instances;
}

function createRunnerDeathSmoke(): { fill: InstancedMesh; outline: InstancedMesh } {
  const geometry = new SphereGeometry(0.24, 10, 8);
  const fill = new InstancedMesh(
    geometry,
    new MeshBasicMaterial({
      color: 0xffffff,
      transparent: false,
      toneMapped: false,
    }),
    RUNNER_DEATH_SMOKE_INSTANCE_CAPACITY,
  );
  fill.name = 'runner-death-smoke-fill';
  fill.setColorAt(0, runnerSmokeDark);

  const outline = new InstancedMesh(
    geometry,
    new MeshBasicMaterial({
      color: RUNNER_DEATH_SMOKE_OUTLINE_COLOR,
      transparent: true,
      opacity: 0.72,
      depthTest: true,
      depthWrite: false,
      side: BackSide,
      toneMapped: false,
    }),
    RUNNER_DEATH_SMOKE_INSTANCE_CAPACITY,
  );
  outline.name = 'runner-death-smoke-outline';

  for (const smoke of [fill, outline]) {
    smoke.count = 0;
    smoke.visible = false;
    smoke.frustumCulled = false;
    smoke.castShadow = false;
    smoke.receiveShadow = false;
    smoke.instanceMatrix.setUsage(DynamicDrawUsage);
  }
  outline.renderOrder = 13;
  fill.renderOrder = 14;
  return { fill, outline };
}

export function runnerDeathSmokeStackHeight(particleIndex: number): number {
  const safeIndex = Math.min(
    RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT - 1,
    Math.max(0, Math.floor(particleIndex)),
  );
  return Math.round(safeIndex * 13) / 100;
}

function runnerImpactNoise(impactId: number, particleIndex: number, salt: number): number {
  const value = Math.sin((impactId + 1) * 12.9898 + particleIndex * 78.233 + salt * 37.719) * 43_758.5453;
  return value - Math.floor(value);
}

function syncRunnerImpactParticles(lane: RunnerLane, state: GameState): void {
  const run = state.runner;
  const runnerImpactParticles = lane.runnerImpactParticles;
  let instanceIndex = 0;
  let activeImpactCount = 0;

  for (const impact of run.impacts ?? []) {
    const age = state.lastTick - impact.createdAt;
    if (age < 0 || age >= RUNNER_IMPACT_LIFETIME_MS || activeImpactCount >= RUNNER_MAX_ACTIVE_IMPACTS) {
      continue;
    }
    const progress = age / RUNNER_IMPACT_LIFETIME_MS;
    const grow = Math.min(1, progress / 0.12);
    const shrink = Math.pow(Math.max(0, 1 - progress), 0.72);

    for (let particleIndex = 0; particleIndex < RUNNER_IMPACT_PARTICLES_PER_HIT; particleIndex += 1) {
      const directionSeed = runnerImpactNoise(impact.id, particleIndex, 1);
      const speedSeed = runnerImpactNoise(impact.id, particleIndex, 2);
      const sizeSeed = runnerImpactNoise(impact.id, particleIndex, 3);
      const angle = (particleIndex / RUNNER_IMPACT_PARTICLES_PER_HIT) * Math.PI * 2 + directionSeed * 0.8;
      const spread = progress * (0.24 + speedSeed * 0.48);
      const size = (0.6 + sizeSeed * 0.8) * grow * shrink;

      runnerImpactTransform.position.set(
        impact.x + Math.cos(angle) * spread,
        0.56 + Math.sin(progress * Math.PI) * (0.48 + speedSeed * 0.3),
        impact.z - run.distance + Math.sin(angle) * spread,
      );
      runnerImpactTransform.rotation.set(
        directionSeed * Math.PI + progress * 4.2,
        speedSeed * Math.PI + progress * 3.4,
        sizeSeed * Math.PI + progress * 5.1,
      );
      runnerImpactTransform.scale.setScalar(size);
      runnerImpactTransform.updateMatrix();
      runnerImpactParticles.setMatrixAt(instanceIndex, runnerImpactTransform.matrix);

      if (progress < 0.18) {
        runnerImpactColor.lerpColors(runnerImpactWhite, runnerImpactYellow, progress / 0.18);
      } else if (progress < 0.68) {
        runnerImpactColor.lerpColors(runnerImpactYellow, runnerImpactOrange, (progress - 0.18) / 0.5);
      } else {
        runnerImpactColor.lerpColors(runnerImpactOrange, runnerImpactRed, (progress - 0.68) / 0.32);
      }
      runnerImpactParticles.setColorAt(instanceIndex, runnerImpactColor);
      instanceIndex += 1;
    }
    activeImpactCount += 1;
  }

  runnerImpactParticles.count = Math.min(instanceIndex, RUNNER_IMPACT_INSTANCE_CAPACITY);
  runnerImpactParticles.visible = runnerImpactParticles.count > 0;
  runnerImpactParticles.instanceMatrix.needsUpdate = true;
  if (runnerImpactParticles.instanceColor) {
    runnerImpactParticles.instanceColor.needsUpdate = true;
  }
  lane.renderer.domElement.dataset.runnerImpactInstanceCount = String(runnerImpactParticles.count);
  lane.renderer.domElement.dataset.runnerActiveImpactCount = String(activeImpactCount);
}

function syncRunnerDefeatEffects(lane: RunnerLane, state: GameState): void {
  const run = state.runner;
  const effects = run.defeatEffects
    .filter((effect) => {
      const age = state.lastTick - effect.createdAt;
      return age >= 0 && age < RUNNER_DEFEAT_EFFECT_LIFETIME_MS;
    })
    .slice(-RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS);

  syncRunnerDeathSmoke(lane, state, effects);
  syncRunnerCoinPopups(lane, state, effects);
  lane.renderer.domElement.dataset.runnerDefeatEffectCount = String(effects.length);
}

function syncRunnerDeathSmoke(
  lane: RunnerLane,
  state: GameState,
  effects: readonly RunnerDefeatEffect[],
): void {
  const smoke = lane.runnerDeathSmoke;
  const outline = lane.runnerDeathSmokeOutline;
  let instanceIndex = 0;
  const smokeLifetimeMs = RUNNER_DEFEAT_EFFECT_LIFETIME_MS * 0.72;

  for (const effect of effects) {
    const age = state.lastTick - effect.createdAt;
    const progress = age / smokeLifetimeMs;
    if (progress < 0 || progress >= 1) continue;
    const localZ = effect.z - state.runner.distance;
    const depthScale = runnerDefeatFeedbackDepthScale(localZ);

    for (let particleIndex = 0; particleIndex < RUNNER_DEATH_SMOKE_PARTICLES_PER_EFFECT; particleIndex += 1) {
      const angleSeed = runnerImpactNoise(effect.id, particleIndex, 11);
      const spreadSeed = runnerImpactNoise(effect.id, particleIndex, 12);
      const sizeSeed = runnerImpactNoise(effect.id, particleIndex, 13);
      const stackHeight = runnerDeathSmokeStackHeight(particleIndex);
      const envelope = Math.pow(Math.sin(progress * Math.PI), 0.46);
      const size = (0.62 + sizeSeed * 0.28) * envelope * depthScale;
      const wobble = (angleSeed - 0.5) * (0.2 + progress * 0.08);
      const drift = Math.sin(progress * Math.PI * 2 + angleSeed * Math.PI * 2) * 0.05;

      runnerDefeatTransform.position.set(
        effect.x + wobble + drift,
        0.3 + stackHeight + progress * (0.48 + spreadSeed * 0.18),
        localZ + (spreadSeed - 0.5) * 0.16 * depthScale,
      );
      runnerDefeatTransform.rotation.set(
        angleSeed * 0.34,
        spreadSeed * Math.PI * 2 + progress * 0.7,
        (sizeSeed - 0.5) * 0.28,
      );
      runnerDefeatTransform.scale.set(
        size * (0.92 + spreadSeed * 0.16),
        size * (0.9 + sizeSeed * 0.18),
        size,
      );
      runnerDefeatTransform.updateMatrix();
      smoke.setMatrixAt(instanceIndex, runnerDefeatTransform.matrix);
      runnerDefeatTransform.scale.multiplyScalar(1.08);
      runnerDefeatTransform.updateMatrix();
      outline.setMatrixAt(instanceIndex, runnerDefeatTransform.matrix);
      runnerImpactColor.lerpColors(runnerSmokeDark, runnerSmokeLight, progress * 0.72 + sizeSeed * 0.18);
      smoke.setColorAt(instanceIndex, runnerImpactColor);
      instanceIndex += 1;
    }
  }

  smoke.count = Math.min(instanceIndex, RUNNER_DEATH_SMOKE_INSTANCE_CAPACITY);
  smoke.visible = smoke.count > 0;
  outline.count = smoke.count;
  outline.visible = smoke.visible;
  smoke.instanceMatrix.needsUpdate = smoke.count > 0;
  outline.instanceMatrix.needsUpdate = outline.count > 0;
  if (smoke.instanceColor) smoke.instanceColor.needsUpdate = smoke.count > 0;
  lane.renderer.domElement.dataset.runnerDeathSmokeInstanceCount = String(smoke.count);
  lane.renderer.domElement.dataset.runnerDeathSmokeStyle = 'cartoon-grey';
  lane.renderer.domElement.dataset.runnerDeathSmokeDrawCalls = smoke.count > 0 ? '2' : '0';
}

function syncRunnerCoinPopups(
  lane: RunnerLane,
  state: GameState,
  effects: readonly RunnerDefeatEffect[],
): void {
  ensureRunnerCoinLabelPool(lane, effects.length);

  for (let index = 0; index < effects.length; index += 1) {
    const effect = effects[index]!;
    const progress = (state.lastTick - effect.createdAt) / RUNNER_DEFEAT_EFFECT_LIFETIME_MS;
    const pop = Math.min(1, progress / 0.14);
    const fade = Math.min(1, Math.max(0, (1 - progress) / 0.28));
    const rise = runnerCoinPopupBaseY(effect.scale)
      + Math.sin(Math.min(1, progress) * Math.PI * 0.58) * 0.42
      + progress * 0.72;
    const localZ = effect.z - state.runner.distance;
    const depthScale = runnerDefeatFeedbackDepthScale(localZ);

    runnerDefeatTransform.position.set(effect.x - 0.3, rise, localZ);
    runnerDefeatTransform.rotation.set(0, progress * Math.PI * 7, 0.08 * Math.sin(progress * Math.PI * 4));
    runnerDefeatTransform.scale.setScalar(0.42 * depthScale * pop * fade);
    runnerDefeatTransform.updateMatrix();
    for (const coinInstances of lane.runnerCoinInstances) {
      coinInstances.setMatrixAt(index, runnerDefeatTransform.matrix);
    }

    const label = lane.runnerCoinLabels[index]!;
    const labelMaterial = label.material as SpriteMaterial;
    label.visible = true;
    label.position.set(effect.x + 0.28, rise + 0.08, localZ - 0.015);
    label.scale.set(1.02 * depthScale * pop, 0.42 * depthScale * pop, 1);
    labelMaterial.map = runnerCoinPopupTexture(lane, effect.amount);
    labelMaterial.opacity = fade;
    labelMaterial.needsUpdate = true;
    label.userData.runnerDefeatEffectId = effect.id;
  }

  for (let index = effects.length; index < lane.runnerCoinLabels.length; index += 1) {
    lane.runnerCoinLabels[index]!.visible = false;
  }
  for (const coinInstances of lane.runnerCoinInstances) {
    coinInstances.count = effects.length;
    coinInstances.visible = effects.length > 0;
    coinInstances.instanceMatrix.needsUpdate = effects.length > 0;
  }
  lane.renderer.domElement.dataset.runnerCoinPopupCount = String(effects.length);
  lane.renderer.domElement.dataset.runnerCoinDrawCalls = effects.length > 0 ? String(lane.runnerCoinDrawCalls) : '0';
}

function runnerDefeatFeedbackDepthScale(localZ: number): number {
  return 1 + Math.min(2.4, Math.max(0, localZ) * 0.06);
}

export function runnerCoinPopupBaseY(enemyScale: number): number {
  const safeScale = Number.isFinite(enemyScale) ? Math.max(0.25, enemyScale) : 1;
  return ENEMY_VISUAL_HEIGHT * safeScale + 0.35;
}

function ensureRunnerCoinLabelPool(lane: RunnerLane, needed: number): void {
  while (lane.runnerCoinLabels.length < needed) {
    const label = new Sprite(new SpriteMaterial({ depthTest: false, transparent: true }));
    label.name = 'runner-coin-popup-label';
    label.renderOrder = 14;
    lane.bullets.add(label);
    lane.runnerCoinLabels.push(label);
  }
}

async function loadRunnerCoin(lane: RunnerLane, canvas: HTMLCanvasElement): Promise<void> {
  try {
    const template = await runnerCoinTemplate();
    if (laneByCanvas.get(canvas) !== lane) return;

    lane.runnerCoinInstances = template.parts.map((part, index) => {
      const instances = new InstancedMesh(
        part.geometry,
        part.material,
        RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS,
      );
      instances.name = `runner-coin-popup-instances-${index + 1}`;
      instances.count = 0;
      instances.visible = false;
      instances.frustumCulled = false;
      instances.castShadow = false;
      instances.receiveShadow = false;
      instances.instanceMatrix.setUsage(DynamicDrawUsage);
      instances.userData.runnerSharedCoinAsset = true;
      lane.bullets.add(instances);
      return instances;
    });
    lane.runnerCoinDrawCalls = template.drawCalls;
    canvas.dataset.runnerCoinReady = 'true';

    const currentState = latestRunnerState;
    if (currentState) renderRunnerLane(lane, currentState);
  } catch (error) {
    canvas.dataset.runnerCoinReady = 'false';
    console.warn(`Runner coin model could not be loaded: ${RUNNER_COIN_ASSET}`, error);
  }
}

function runnerCoinTemplate(): Promise<RunnerCoinTemplate> {
  if (!runnerCoinTemplatePromise) {
    runnerCoinTemplatePromise = new GLTFLoader().loadAsync(RUNNER_COIN_ASSET).then((gltf) => {
      const parts: Array<{ geometry: BufferGeometry; material: Material | Material[] }> = [];
      gltf.scene.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        const material = Array.isArray(object.material)
          ? object.material.map((entry) => entry.clone())
          : object.material.clone();
        const materials = Array.isArray(material) ? material : [material];
        for (const entry of materials) {
          if (entry instanceof MeshStandardMaterial) {
            entry.color.set(RUNNER_COIN_GOLD_COLOR);
            entry.emissive.set('#6b4700');
            entry.emissiveIntensity = 0.48;
            entry.metalness = 0.42;
            entry.roughness = 0.28;
          }
          entry.toneMapped = false;
          entry.needsUpdate = true;
        }
        parts.push({ geometry: object.geometry, material });
      });
      if (parts.length === 0) throw new Error('RunnerCoin mesh is missing from the GLB.');
      return {
        parts,
        drawCalls: parts.reduce(
          (total, part) => total + (Array.isArray(part.material) ? Math.max(1, part.geometry.groups.length) : 1),
          0,
        ),
      };
    });
  }
  return runnerCoinTemplatePromise;
}

async function loadRunnerFireball(lane: RunnerLane, canvas: HTMLCanvasElement): Promise<void> {
  try {
    const template = await runnerFireballTemplate();
    if (laneByCanvas.get(canvas) !== lane) {
      return;
    }

    lane.fireballInstances = template.parts.map((part, index) => {
      const instances = new InstancedMesh(
        part.geometry,
        part.material,
        RUNNER_FIREBALL_INSTANCE_CAPACITY,
      );
      instances.name = `runner-fireball-instances-${index + 1}`;
      instances.count = 0;
      instances.visible = false;
      instances.frustumCulled = false;
      instances.castShadow = false;
      instances.receiveShadow = false;
      instances.instanceMatrix.setUsage(DynamicDrawUsage);
      instances.userData.runnerSharedFireballAsset = true;
      lane.bullets.add(instances);
      return instances;
    });
    lane.fireballDrawCalls = template.drawCalls;

    const currentState = latestRunnerState;
    if (currentState) {
      renderRunnerLane(lane, currentState);
    } else {
      lane.renderer.render(lane.scene, lane.camera);
    }
  } catch (error) {
    canvas.dataset.runnerFireballReady = 'false';
    console.warn(`Runner fireball model could not be loaded: ${RUNNER_FIREBALL_ASSET}`, error);
  }
}

function runnerFireballTemplate(): Promise<RunnerFireballTemplate> {
  if (!runnerFireballTemplatePromise) {
    runnerFireballTemplatePromise = new GLTFLoader().loadAsync(RUNNER_FIREBALL_ASSET).then((gltf) => {
      const parts: Array<{ geometry: BufferGeometry; material: Material | Material[] }> = [];
      gltf.scene.traverse((object) => {
        if (object instanceof Mesh) {
          normalizeRunnerBoltMaterial(object.material as Material | Material[]);
          parts.push({
            geometry: object.geometry,
            material: object.material as Material | Material[],
          });
        }
      });
      if (parts.length === 0) {
        throw new Error('RunnerFireball mesh is missing from the GLB.');
      }
      return {
        parts,
        drawCalls: parts.reduce(
          (total, part) => total + (Array.isArray(part.material) ? Math.max(1, part.geometry.groups.length) : 1),
          0,
        ),
      };
    });
  }
  return runnerFireballTemplatePromise;
}

function normalizeRunnerBoltMaterial(materialOrMaterials: Material | Material[]): void {
  const materials = Array.isArray(materialOrMaterials) ? materialOrMaterials : [materialOrMaterials];
  for (const material of materials) {
    material.toneMapped = false;
    if (material.name === 'RunnerBoltGlow') {
      material.transparent = true;
      material.opacity = 0.28;
      material.depthWrite = false;
      material.blending = AdditiveBlending;
      material.side = DoubleSide;
    }
    material.needsUpdate = true;
  }
}

/** The crowd: one circle per unit, packed into rows behind the lead. */
function syncUnits(lane: RunnerLane, state: GameState): void {
  const { runner: run } = state;
  const count = run.units;
  // The disc stands upright facing the camera. Laid flat on the road it would be seen at a
  // ~14 degree grazing angle and squash into an invisible sliver.
  lane.playerHero.visible = count > 0 || run.dead;
  lane.contactShadow.visible = lane.playerHero.visible;
  lane.contactShadow.position.x = run.playerX;
  if (lane.playerHero.visible) {
    syncRunnerFoxHero(lane);
    lane.runnerHeroLateralDirection = runnerFoxLateralDirection(run.playerX, run.playerTargetX);
    lane.playerHero.position.set(run.playerX, 0, 0);
    lane.playerHero.rotation.y = 0;
    lane.renderer.domElement.dataset.runnerHeroZ = '0';
    syncRunnerGameplayHeroAnimation(lane, state);
  }
  syncRunnerMultishotOrbs(lane, state);

  for (const mesh of lane.unitPool) {
    mesh.visible = false;
  }

  // The squad's life count (units === hit points), billboarded over the crowd.
  if (!lane.playerLabel) {
    lane.playerLabel = new Sprite(new SpriteMaterial({ depthTest: false }));
    lane.playerLabel.scale.set(1.0, 0.75, 1);
    lane.playerLabel.renderOrder = 10;
    lane.units.add(lane.playerLabel);
  }
  if (count > 0) {
    lane.playerLabel.visible = true;
    lane.playerLabel.position.set(run.playerX, HERO_VISUAL_HEIGHT + 0.35, 0.2);
    lane.playerLabel.material.map = numberTexture(lane, count, '#dff2ff');
  } else {
    lane.playerLabel.visible = false;
  }
}

function createRunnerMultishotOrbs(): {
  core: InstancedMesh;
  glow: InstancedMesh;
  halo: InstancedMesh;
  wisp: InstancedMesh;
} {
  const orbGeometry = new SphereGeometry(0.095, 12, 10);
  const core = new InstancedMesh(
    orbGeometry,
    new MeshBasicMaterial({
      color: 0x8bdcff,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      toneMapped: false,
    }),
    RUNNER_MAX_MULTISHOT_ORBS,
  );
  core.name = 'runnerMultishotOrbCore';
  core.count = 0;
  core.instanceMatrix.setUsage(DynamicDrawUsage);
  core.renderOrder = 7;

  const glow = new InstancedMesh(
    orbGeometry,
    new MeshBasicMaterial({
      color: 0x006cff,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    }),
    RUNNER_MAX_MULTISHOT_ORBS,
  );
  glow.name = 'runnerMultishotOrbGlow';
  glow.count = 0;
  glow.instanceMatrix.setUsage(DynamicDrawUsage);
  glow.renderOrder = 6;

  const halo = new InstancedMesh(
    new TorusGeometry(0.145, 0.012, 6, 20),
    new MeshBasicMaterial({
      color: 0x42d9ff,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    }),
    RUNNER_MAX_MULTISHOT_ORBS,
  );
  halo.name = 'runnerMultishotOrbHalo';
  halo.count = 0;
  halo.instanceMatrix.setUsage(DynamicDrawUsage);
  halo.renderOrder = 8;

  const wisp = new InstancedMesh(
    new ConeGeometry(0.065, 0.32, 8, 1, true),
    new MeshBasicMaterial({
      color: 0x168bff,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    }),
    RUNNER_MAX_MULTISHOT_ORBS,
  );
  wisp.name = 'runnerMultishotOrbWisp';
  wisp.count = 0;
  wisp.instanceMatrix.setUsage(DynamicDrawUsage);
  wisp.renderOrder = 5;
  return { core, glow, halo, wisp };
}

function syncRunnerMultishotOrbs(lane: RunnerLane, state: GameState): void {
  const gameplayCount = state.runner.running && !state.runner.dead
    ? Math.max(0, state.runner.attacks - RUNNER_BASE_ATTACKS)
    : 0;
  const previewCount = runnerMultishotOrbPreviewCount();
  const count = state.runner.running && !state.runner.dead
    ? Math.max(gameplayCount, previewCount)
    : 0;
  const targetFormation = runnerMultishotOrbFormation(count);
  const frameAt = performance.now();
  const elapsedMs = lane.runnerMultishotOrbLastFrameAt === null
    ? 16
    : Math.min(250, Math.max(1, frameAt - lane.runnerMultishotOrbLastFrameAt));
  const reflowProgress = 1 - Math.exp(-elapsedMs / RUNNER_MULTISHOT_ORB_REFLOW_MS);
  const formation = runnerMultishotOrbReflow(
    lane.runnerMultishotOrbPositions,
    targetFormation,
    reflowProgress,
  );
  lane.runnerMultishotOrbPositions = formation;
  lane.runnerMultishotOrbLastFrameAt = frameAt;
  const {
    runnerMultishotOrbCore: core,
    runnerMultishotOrbGlow: glow,
    runnerMultishotOrbHalo: halo,
    runnerMultishotOrbWisp: wisp,
  } = lane;
  core.count = formation.length;
  glow.count = formation.length;
  halo.count = formation.length;
  wisp.count = formation.length;
  core.visible = formation.length > 0;
  glow.visible = formation.length > 0;
  halo.visible = formation.length > 0;
  wisp.visible = formation.length > 0;

  formation.forEach((orb, index) => {
    const phase = state.lastTick * 0.0035 + index * 1.7;
    const bob = Math.sin(phase) * 0.04;
    const pulse = 1 + Math.sin(phase * 1.65) * 0.1;
    const x = state.runner.playerX + orb.x;
    const y = orb.y + bob;
    runnerMultishotOrbTransform.position.set(x, y, orb.z);
    runnerMultishotOrbTransform.rotation.set(0, 0, 0);
    runnerMultishotOrbTransform.scale.setScalar(pulse);
    runnerMultishotOrbTransform.updateMatrix();
    core.setMatrixAt(index, runnerMultishotOrbTransform.matrix);

    runnerMultishotOrbTransform.scale.setScalar(1.7 + Math.sin(phase * 1.3) * 0.12);
    runnerMultishotOrbTransform.updateMatrix();
    glow.setMatrixAt(index, runnerMultishotOrbTransform.matrix);

    runnerMultishotOrbTransform.position.set(x, y, orb.z + 0.004);
    runnerMultishotOrbTransform.rotation.set(1.02, 0, phase * 0.42);
    runnerMultishotOrbTransform.scale.setScalar(0.88 + Math.sin(phase * 1.9) * 0.07);
    runnerMultishotOrbTransform.updateMatrix();
    halo.setMatrixAt(index, runnerMultishotOrbTransform.matrix);

    runnerMultishotOrbTransform.position.set(x, y - 0.145, orb.z - 0.015);
    runnerMultishotOrbTransform.rotation.set(0, 0, Math.PI + Math.sin(phase) * 0.16);
    runnerMultishotOrbTransform.scale.set(0.78 * pulse, 0.9 + Math.cos(phase * 1.4) * 0.1, 0.78 * pulse);
    runnerMultishotOrbTransform.updateMatrix();
    wisp.setMatrixAt(index, runnerMultishotOrbTransform.matrix);
  });
  core.instanceMatrix.needsUpdate = formation.length > 0;
  glow.instanceMatrix.needsUpdate = formation.length > 0;
  halo.instanceMatrix.needsUpdate = formation.length > 0;
  wisp.instanceMatrix.needsUpdate = formation.length > 0;
  lane.renderer.domElement.dataset.runnerMultishotOrbCount = String(formation.length);
  lane.renderer.domElement.dataset.runnerMultishotOrbDrawCalls = formation.length > 0 ? '4' : '0';
  lane.renderer.domElement.dataset.runnerMultishotOrbStyle = 'light-spirit';
  lane.renderer.domElement.dataset.runnerMultishotOrbLayout = 'dynamic-orbit';
  lane.renderer.domElement.dataset.runnerMultishotOrbPreview = String(previewCount);
  lane.renderer.domElement.dataset.runnerMultishotOrbSpreadX = runnerMultishotOrbSpread(formation, 'x');
  lane.renderer.domElement.dataset.runnerMultishotOrbSpreadY = runnerMultishotOrbSpread(formation, 'y');
  lane.renderer.domElement.dataset.runnerMultishotOrbSpreadZ = runnerMultishotOrbSpread(formation, 'z');
}

function runnerMultishotOrbSpread(
  formation: readonly RunnerMultishotOrbPosition[],
  axis: keyof RunnerMultishotOrbPosition,
): string {
  if (formation.length < 2) return '0.00';
  const values = formation.map((orb) => orb[axis]);
  return (Math.max(...values) - Math.min(...values)).toFixed(2);
}

function runnerMultishotOrbPreviewCount(): number {
  if (!import.meta.env.DEV || typeof window === 'undefined') return 0;
  const rawCount = Number(new URLSearchParams(window.location.search).get('runnerOrbPreview'));
  if (!Number.isFinite(rawCount)) return 0;
  return Math.min(RUNNER_MAX_MULTISHOT_ORBS, Math.max(0, Math.floor(rawCount)));
}

// Soft radial-gradient blob laid on the road under the hero: an ambient-occlusion contact shadow that
// grounds the character (the crisp directional shadow is cast off to the side and misses the feet).
function createRunnerContactShadow(): Mesh {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  const mesh = new Mesh(
    new PlaneGeometry(1.5, 1.15),
    new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 0.012, 0);
  mesh.renderOrder = 1;
  return mesh;
}

function createRunnerHeroVisual(): Group {
  const visual = new Group();
  const fallback = new Mesh(
    new CircleGeometry(UNIT_RADIUS, 20),
    new MeshBasicMaterial({ color: new Color('#7dd3fc'), side: DoubleSide }),
  );
  fallback.name = 'runner-hero-fallback';
  fallback.position.y = UNIT_RADIUS;
  visual.add(fallback);
  return visual;
}

function syncEnemies(lane: RunnerLane, state: GameState): void {
  const run = state.runner;
  let nearestEnemyZ = Number.POSITIVE_INFINITY;
  ensurePool(lane.enemyPool, lane.enemies, run.enemies.length, createRunnerEnemyVisual);

  ensureLabelPool(lane.enemyLabels, lane.enemies, run.enemies.length);

  for (let index = 0; index < lane.enemyPool.length; index += 1) {
    const visual = lane.enemyPool[index]!;
    const label = lane.enemyLabels[index]!;
    const enemy = run.enemies[index];
    if (!enemy) {
      visual.visible = false;
      label.visible = false;
      continue;
    }
    visual.visible = true;
    visual.userData.runnerEnemyId = enemy.id;
    if (lane.enemyTemplates.length > 0) {
      const modelIndex = RUNNER_MONSTER_MODEL_IDS.indexOf(runnerEnemyModelId(enemy.id, enemy.modelId));
      syncRunnerEnemyVariant(
        lane,
        visual,
        modelIndex >= 0 ? modelIndex : runnerEnemyVariantIndex(enemy.id, lane.enemyTemplates.length),
      );
    }

    const phase = state.lastTick * 0.006 + enemy.id * 1.73;
    const mixer = visual.userData.runnerEnemyMixer as AnimationMixer | undefined;
    if (mixer) {
      mixer.setTime(state.lastTick / 1000 + enemy.id * 0.17);
    }
    // Keep a restrained fallback bounce if every animated asset failed to load.
    const bounce = mixer ? 0 : Math.abs(Math.sin(phase));
    const healthRatio = enemy.maxHealth > 0 ? Math.max(0, enemy.health / enemy.maxHealth) : 1;
    const widthScale = mixer ? 1 : 1 + bounce * 0.045;
    const heightScale = mixer ? 1 : (0.96 + healthRatio * 0.04) * (1 - bounce * 0.035);
    const relativeZ = enemy.z - run.distance;
    nearestEnemyZ = Math.min(nearestEnemyZ, relativeZ);
    visual.position.set(enemy.x, bounce * 0.035, relativeZ);
    visual.rotation.y = Math.PI;
    const editorScale = enemy.scale ?? 1;
    visual.scale.set(widthScale * editorScale, heightScale * editorScale, widthScale * editorScale);
    const selection = visual.getObjectByName('runner-enemy-selection');
    if (selection) {
      selection.visible = Boolean(
        enemy.isBoss || (editorInteraction?.enabled && editorInteraction.selectedEnemyId === enemy.id),
      );
    }

    // Remaining hit points, billboarded just above the monster.
    label.visible = true;
    label.position.set(
      enemy.x,
      ENEMY_VISUAL_HEIGHT * editorScale + 0.35,
      enemy.z - run.distance,
    );
    (label.material as SpriteMaterial).map = numberTexture(
      lane,
      Math.max(0, Math.ceil(enemy.health)),
      enemy.isBoss ? '#fde047' : '#fee2e2',
    );
  }
  lane.renderer.domElement.dataset.runnerNearestEnemyZ = Number.isFinite(nearestEnemyZ)
    ? nearestEnemyZ.toFixed(3)
    : 'none';
}

function createRunnerEnemyVisual(): Group {
  const visual = new Group();
  const fallback = new Mesh(
    new BoxGeometry(ENEMY_FALLBACK_SIZE, ENEMY_FALLBACK_SIZE, ENEMY_FALLBACK_SIZE),
    new MeshLambertMaterial({ color: new Color('#f87171') }),
  );
  fallback.name = 'runner-enemy-fallback';
  fallback.position.y = ENEMY_FALLBACK_SIZE / 2;
  visual.add(fallback);
  const selection = new Mesh(
    new RingGeometry(0.42, 0.54, 32),
    new MeshBasicMaterial({ color: 0xfacc15, depthTest: false, side: DoubleSide }),
  );
  selection.name = 'runner-enemy-selection';
  selection.rotation.x = -Math.PI / 2;
  selection.position.y = 0.015;
  selection.renderOrder = 20;
  selection.visible = false;
  visual.add(selection);
  visual.userData.runnerEnemyVariant = -1;
  return visual;
}

async function loadRunnerEnemyTemplates(lane: RunnerLane, canvas: HTMLCanvasElement): Promise<void> {
  const templates = await runnerEnemyTemplates();
  if (laneByCanvas.get(canvas) !== lane || templates.length === 0) {
    return;
  }

  lane.enemyTemplates = templates;
  for (const visual of lane.enemyPool) {
    const enemyId = Number(visual.userData.runnerEnemyId);
    if (Number.isFinite(enemyId)) {
      syncRunnerEnemyVariant(lane, visual, runnerEnemyVariantIndex(enemyId, templates.length));
    }
  }
  lane.renderer.render(lane.scene, lane.camera);
}

function runnerEnemyTemplates(): Promise<RunnerEnemyTemplate[]> {
  if (!runnerEnemyTemplatesPromise) {
    runnerEnemyTemplatesPromise = new TextureLoader()
      .loadAsync(RUNNER_MONSTER_TEXTURE)
      .then(async (texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.flipY = false;
        const material = new MeshLambertMaterial({ map: texture });
        const loader = new GLTFLoader();
        const results = await Promise.allSettled(
          RUNNER_MONSTER_ASSETS.map((asset) => loader.loadAsync(asset)),
        );

        return results.flatMap((result, index) => {
          const asset = RUNNER_MONSTER_ASSETS[index]!;
          if (result.status === 'rejected') {
            console.warn(`Runner monster model could not be loaded: ${asset}`, result.reason);
            return [];
          }
          result.value.scene.traverse((object) => {
            if (object instanceof Mesh && !asset.endsWith('/skeleton-warrior.glb')) {
              object.material = material;
              object.userData.runnerSharedMonsterAsset = true;
            }
          });
          return [normalizeRunnerEnemyTemplate(result.value.scene, result.value.animations)];
        });
      })
      .catch((error: unknown) => {
        console.warn('Runner monster texture could not be loaded.', error);
        return [];
      });
  }
  return runnerEnemyTemplatesPromise;
}

async function loadRunnerFoxTemplate(lane: RunnerLane, canvas: HTMLCanvasElement): Promise<void> {
  const template = await runnerFoxTemplate();
  if (laneByCanvas.get(canvas) !== lane) {
    return;
  }
  lane.heroTemplate = template;
  syncRunnerFoxHero(lane);
  syncRunnerMenuHeroModels(lane);
  lane.renderer.render(lane.scene, lane.camera);
}

function runnerFoxTemplate(): Promise<RunnerHeroTemplate | null> {
  if (!runnerHeroTemplatePromise) {
    const loader = new GLTFLoader();
    runnerHeroTemplatePromise = Promise.all([
      loader.loadAsync(RUNNER_FOX_ASSET),
      loadRunnerFbxClip(RUNNER_SHOOTING_ASSET, 'FoxShoot'),
      loadRunnerFbxClip(RUNNER_PAIN_ASSET, 'FoxPain'),
      loadRunnerFbxClip(RUNNER_JUMP_ASSET, 'FoxJump'),
    ])
      .then(([result, shootingClipRaw, painClipRaw, jumpClipRaw]) => {
        result.scene.traverse((object) => {
          if (object instanceof Mesh) {
            object.userData.runnerSharedHeroAsset = true;
          }
        });
        const inPlaceClips = runnerInPlaceHeroClips(result.scene, result.animations);
        const embeddedClips = runnerEmbeddedHeroClips(inPlaceClips);
        // The external Mixamo clips share the mixamorig skeleton, so they bind to the same rig;
        // flatten their root track the same way so the fox holds its ground.
        const external = (raw: AnimationClip | null): AnimationClip | undefined =>
          raw ? runnerInPlaceHeroClips(result.scene, [raw])[0] : undefined;
        return {
          ...normalizeRunnerHeroTemplate(result.scene, inPlaceClips),
          menuClip: embeddedClips.menu,
          heroClips: {
            ...embeddedClips.gameplay,
            shooting: external(shootingClipRaw),
            // Damage plays the one-shot pain gesture; bonus plays the one-shot joyful jump.
            injuredRun: external(painClipRaw) ?? embeddedClips.gameplay.injuredRun,
            jump: external(jumpClipRaw),
          },
        };
      })
      .catch((error: unknown) => {
        console.warn(`Runner Fox model could not be loaded: ${RUNNER_FOX_ASSET}`, error);
        return null;
      });
  }
  return runnerHeroTemplatePromise;
}

// Load an external animation (FBX, Mixamo rig) and hand back just its clip, cached per asset.
function loadRunnerFbxClip(asset: string, clipName: string): Promise<AnimationClip | null> {
  let promise = runnerExternalClipPromises.get(asset);
  if (!promise) {
    promise = new FBXLoader()
      .loadAsync(asset)
      .then((fbx) => {
        const clip = fbx.animations?.[0] ?? null;
        if (clip) {
          clip.name = clipName;
        }
        return clip;
      })
      .catch((error: unknown) => {
        console.warn(`Runner animation could not be loaded: ${asset}`, error);
        return null;
      });
    runnerExternalClipPromises.set(asset, promise);
  }
  return promise;
}

function runnerInPlaceHeroClips(scene: Group, clips: AnimationClip[]): AnimationClip[] {
  const hips = scene.getObjectByName('mixamorig:Hips');
  if (!hips) return clips;
  const anchor = [hips.position.x, hips.position.y, hips.position.z] as const;
  return clips.map((clip) => {
    const normalized = clip.clone();
    const rootTrack = normalized.tracks.find((track) => track.name.endsWith('mixamorig:Hips.position'));
    if (rootTrack && rootTrack.values.length >= 3) {
      rootTrack.values = runnerInPlaceRootTrackValues(rootTrack.values, anchor);
    }
    return normalized;
  });
}

function runnerEmbeddedHeroClips(
  clips: AnimationClip[],
): {
  menu: AnimationClip | null;
  gameplay: Partial<Record<RunnerHeroAnimationId, AnimationClip>>;
} {
  const idle = clips.find((clip) => clip.name === 'FoxIdle');
  const stand = clips.find((clip) => clip.name === 'FoxStand');
  const standUp = clips.find((clip) => clip.name === 'FoxSitToStand');
  const death = clips.find((clip) => clip.name === 'FoxDeath');
  const strafeLeft = clips.find((clip) => clip.name === 'FoxStrafeLeft');
  const strafeRight = clips.find((clip) => clip.name === 'FoxStrafeRight');
  return {
    menu: idle?.clone() ?? null,
    gameplay: {
      standing: stand?.clone(),
      sitToStand: standUp?.clone(),
      standardRun: stand?.clone(),
      injuredRun: stand?.clone(),
      fallFlat: death?.clone(),
      strafeLeft: strafeLeft?.clone(),
      strafeRight: strafeRight?.clone(),
    },
  };
}

function normalizeRunnerHeroTemplate(scene: Group, clips: AnimationClip[]): RunnerEnemyTemplate {
  scene.updateMatrixWorld(true);
  const initialBounds = new Box3().setFromObject(scene);
  const initialSize = initialBounds.getSize(new Vector3());
  scene.scale.multiplyScalar(HERO_VISUAL_HEIGHT / Math.max(0.001, initialSize.y));
  scene.updateMatrixWorld(true);

  const normalizedBounds = new Box3().setFromObject(scene);
  const center = normalizedBounds.getCenter(new Vector3());
  scene.position.x -= center.x;
  scene.position.y -= normalizedBounds.min.y;
  scene.position.z -= center.z;
  scene.updateMatrixWorld(true);
  return { scene, clips };
}

function syncRunnerFoxHero(lane: RunnerLane): void {
  if (lane.playerHero.userData.runnerFoxLoaded) {
    return;
  }
  const template = lane.heroTemplate;
  if (!template) {
    return;
  }

  const previousMixer = lane.playerHero.userData.runnerHeroMixer as AnimationMixer | undefined;
  previousMixer?.stopAllAction();
  const previous = lane.playerHero.getObjectByName('runner-hero-model');
  if (previous) {
    lane.playerHero.remove(previous);
  }

  const hero = cloneSkeleton(template.scene) as Group;
  hero.name = 'runner-hero-model';
  lane.playerHero.add(hero);
  lane.playerHero.userData.runnerFoxLoaded = true;
  lane.playerHero.userData.runnerHeroMixer = undefined;
  lane.playerHero.userData.runnerHeroActions = undefined;
  const gameplayClips = {
    standardRun: template.heroClips.standardRun ?? template.clips[0],
    injuredRun: template.heroClips.injuredRun,
    fallFlat: template.heroClips.fallFlat,
    strafeLeft: template.heroClips.strafeLeft,
    strafeRight: template.heroClips.strafeRight,
    // Idle shooting animation (external Mixamo clip); falls back to the run clip if it failed to load.
    shooting: template.heroClips.shooting ?? template.heroClips.standardRun ?? template.clips[0],
    // One-shot joyful jump on bonus pickup; falls back to standing if it failed to load.
    jump: template.heroClips.jump ?? template.heroClips.standardRun ?? template.clips[0],
  } satisfies Partial<Record<RunnerGameplayAnimationState, AnimationClip | undefined>>;
  // These play through exactly once and hold their final frame (no loop).
  const oneShotStates = new Set<RunnerGameplayAnimationState>(['fallFlat', 'injuredRun', 'jump']);
  if (gameplayClips.standardRun) {
    const mixer = new AnimationMixer(hero);
    const actions: Partial<Record<RunnerGameplayAnimationState, AnimationAction>> = {};
    (Object.entries(gameplayClips) as Array<[RunnerGameplayAnimationState, AnimationClip | undefined]>).forEach(
      ([id, clip]) => {
        if (!clip) return;
        const action = mixer.clipAction(clip);
        action.enabled = false;
        action.setEffectiveWeight(0);
        if (oneShotStates.has(id)) {
          action.setLoop(LoopOnce, 1);
          action.clampWhenFinished = true;
        }
        action.play();
        action.paused = true;
        actions[id] = action;
      },
    );
    lane.playerHero.userData.runnerHeroMixer = mixer;
    lane.playerHero.userData.runnerHeroActions = actions;
  }
  const fallback = lane.playerHero.getObjectByName('runner-hero-fallback');
  if (fallback) {
    fallback.visible = false;
  }
}

function syncRunnerMenuHeroModels(lane: RunnerLane): void {
  const slot = lane.menuHeroSlot;
  if (slot.getObjectByName('runner-menu-hero-model')) {
    return;
  }
  const template = lane.heroTemplate;
  if (!template) {
    return;
  }
  const hero = cloneSkeleton(template.scene) as Group;
  hero.name = 'runner-menu-hero-model';
  hero.userData.runnerMenuProceduralSeated = false;
  hero.rotation.y = Math.PI;
  hero.traverse((object) => {
    object.userData.runnerMenuBaseRotation = {
      x: object.rotation.x,
      y: object.rotation.y,
      z: object.rotation.z,
    };
  });
  if (template.menuClip) {
    const mixer = new AnimationMixer(hero);
    const actions: Record<string, AnimationAction> = {};
    actions.sitting = mixer.clipAction(template.menuClip);
    actions.sitting.play();
    if (template.heroClips.standing) {
      actions.standing = mixer.clipAction(template.heroClips.standing);
      actions.standing.play();
    }
    const standUpClip = template.heroClips.sitToStand;
    if (standUpClip) {
      const action = mixer.clipAction(standUpClip);
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
      actions.sitToStand = action;
    }
    mixer.setTime(0);
    hero.userData.runnerMenuHeroMixer = mixer;
    hero.userData.runnerMenuHeroAction = actions.sitting;
    hero.userData.runnerMenuHeroActions = actions;
    hero.userData.runnerMenuHeroClip = template.menuClip.name;
  } else {
    applyRunnerSeatedPose(hero, 1);
  }
  slot.add(hero);
}

function syncRunnerMenuHeroAnimation(
  hero: Object3D,
  animation: 'sitting' | 'sitToStand',
  elapsedMs: number,
): void {
  const mixer = hero.userData.runnerMenuHeroMixer as AnimationMixer | undefined;
  const actions = hero.userData.runnerMenuHeroActions as Record<string, AnimationAction> | undefined;
  const sittingAction = actions?.sitting;
  const standingAction = actions?.standing;
  const transitionAction = animation === 'sitToStand' ? actions?.sitToStand : undefined;
  if (mixer && actions && transitionAction) {
    for (const candidate of Object.values(actions)) {
      candidate.enabled = candidate === transitionAction;
      candidate.setEffectiveWeight(candidate === transitionAction ? 1 : 0);
    }
    transitionAction.paused = false;
    const duration = transitionAction.getClip().duration;
    const animationTime = Number.isFinite(elapsedMs)
      ? Math.min(elapsedMs / 1000, duration)
      : duration;
    mixer.setTime(animationTime);
    return;
  }
  if (mixer && actions && sittingAction && standingAction) {
    const transitionProgress = Number.isFinite(elapsedMs)
      ? Math.min(1, Math.max(0, elapsedMs / RUNNER_MENU_TRANSITION_MS))
      : 1;
    const sittingWeight = animation === 'sitting'
      ? 1
      : animation === 'sitToStand'
        ? 1 - transitionProgress
        : 0;
    const standingWeight = 1 - sittingWeight;
    for (const candidate of Object.values(actions)) {
      const isMenuPose = candidate === sittingAction || candidate === standingAction;
      candidate.enabled = isMenuPose;
      candidate.setEffectiveWeight(
        candidate === sittingAction ? sittingWeight : candidate === standingAction ? standingWeight : 0,
      );
    }
    sittingAction.paused = false;
    standingAction.paused = false;
    const elapsedSeconds = Number.isFinite(elapsedMs) ? elapsedMs / 1000 : 0;
    const animationTime = animation === 'sitting'
      ? elapsedSeconds % Math.max(0.001, sittingAction.getClip().duration)
      : Math.min(elapsedSeconds, Math.max(sittingAction.getClip().duration, standingAction.getClip().duration));
    mixer.setTime(animationTime);
    return;
  }
  const action = actions?.[animation];
  if (!mixer || !actions || !action) return;
  for (const candidate of Object.values(actions)) {
    candidate.enabled = candidate === action;
    candidate.setEffectiveWeight(candidate === action ? 1 : 0);
  }
  action.paused = false;
  const animationTime = animation === 'sitting'
    ? (elapsedMs / 1000) % Math.max(0.001, action.getClip().duration)
    : Math.min(elapsedMs / 1000, action.getClip().duration);
  mixer.setTime(animationTime);
}

function runnerMenuStandDurationMs(lane: RunnerLane): number {
  const model = lane.menuHeroSlot.getObjectByName('runner-menu-hero-model');
  const actions = model?.userData.runnerMenuHeroActions as Record<string, AnimationAction> | undefined;
  const durationSeconds = actions?.sitToStand?.getClip().duration;
  return durationSeconds
    ? Math.max(RUNNER_MENU_TRANSITION_MS, durationSeconds * 1000)
    : RUNNER_MENU_STAND_MS;
}

function groundRunnerFoxModel(model: Object3D): void {
  model.updateMatrixWorld(true);
  const minY = runnerFoxGroundBounds.setFromObject(model).min.y;
  if (!Number.isFinite(minY)) {
    return;
  }
  model.parent?.getWorldScale(runnerFoxGroundScale);
  model.position.y += runnerGroundCorrectionY(minY, 0, runnerFoxGroundScale.y || 1);
  model.updateMatrixWorld(true);
}

function syncRunnerGameplayHeroAnimation(lane: RunnerLane, state: GameState): void {
  const mixer = lane.playerHero.userData.runnerHeroMixer as AnimationMixer | undefined;
  const actions = lane.playerHero.userData.runnerHeroActions as
    | Partial<Record<RunnerGameplayAnimationState, AnimationAction>>
    | undefined;
  const animation = runnerFoxGameplayAnimationState(
    state.runner,
    state.lastTick,
    lane.runnerHeroLateralDirection,
  );
  const action = actions?.[animation];
  if (!mixer || !actions || !action) return;
  if (lane.playerHero.userData.runnerHeroAnimation !== animation) {
    lane.playerHero.userData.runnerHeroAnimationStartedAt = state.lastTick;
  }
  for (const candidate of Object.values(actions)) {
    if (!candidate) continue;
    candidate.enabled = candidate === action;
    candidate.setEffectiveWeight(candidate === action ? 1 : 0);
  }
  const startedAt = animation === 'injuredRun'
    ? state.runner.lastDamageAt ?? state.lastTick
    : animation === 'jump'
      ? state.runner.lastBoostAt ?? state.lastTick
      : animation === 'fallFlat'
        ? state.runner.deathAt ?? state.lastTick
        : Number(lane.playerHero.userData.runnerHeroAnimationStartedAt ?? state.lastTick);
  const elapsed = Math.max(0, state.lastTick - startedAt) / 1000;
  action.paused = false;
  const clipDuration = action.getClip().duration;
  // Damage (pain gesture), bonus (joyful jump) and death play through exactly once, then hold. The
  // pain gesture is sped up for a snappier hit reaction.
  const oneShot = animation === 'fallFlat' || animation === 'injuredRun' || animation === 'jump';
  const oneShotSpeed = animation === 'injuredRun' ? RUNNER_INJURED_ANIMATION_SPEED : 1;
  const animationTime = oneShot
    ? Math.min(elapsed * oneShotSpeed, clipDuration)
    : animation === 'shooting'
      // Phase-lock the shooting clip to the fire cadence: its recoil lands on each shot and the loop
      // speeds up as fireRate climbs.
      ? runnerShootingClipTime(state.runner.fireCooldown, state.runner.fireRate, clipDuration, RUNNER_SHOOTING_BUMP_FRACTION)
      : elapsed % Math.max(0.001, clipDuration);
  mixer.setTime(animationTime);
  lane.playerHero.userData.runnerHeroAnimation = animation;
  lane.renderer.domElement.dataset.runnerHeroAnimation = animation;
  lane.renderer.domElement.dataset.runnerHeroLocomotion = animation === 'fallFlat'
    ? 'fallen'
    : animation === 'strafeLeft'
      ? 'strafe-left'
      : animation === 'strafeRight'
        ? 'strafe-right'
        : 'stationary';
}

function applyRunnerSeatedPose(hero: Object3D, amount: number, useCurrentPose = false): void {
  const poseAmount = Math.min(1, Math.max(0, amount));
  const applyBone = (names: string[], x: number, y: number, z: number, weight = poseAmount): void => {
    const bone = names.map((name) => hero.getObjectByName(name)).find(Boolean);
    if (!bone) {
      return;
    }
    const storedBase = bone.userData.runnerMenuBaseRotation as { x: number; y: number; z: number } | undefined;
    const base = useCurrentPose
      ? { x: bone.rotation.x, y: bone.rotation.y, z: bone.rotation.z }
      : storedBase;
    if (!base) {
      return;
    }
    bone.rotation.set(base.x + x * weight, base.y + y * weight, base.z + z * weight);
  };

  if (useCurrentPose) {
    applyBone(['mixamorig:Hips'], -0.12, 0, 0);
    applyBone(['mixamorig:Spine'], 0.18, 0, 0);
    applyBone(['mixamorig:LeftUpLeg'], -1.22, 0, -0.06);
    applyBone(['mixamorig:RightUpLeg'], -1.22, 0, 0.06);
    applyBone(['mixamorig:LeftLeg'], 1.42, 0, 0);
    applyBone(['mixamorig:RightLeg'], 1.42, 0, 0);
    applyBone(['mixamorig:LeftArm'], -0.22, 0, -0.18);
    applyBone(['mixamorig:RightArm'], -0.22, 0, 0.18);
    applyBone(['mixamorig:LeftForeArm'], -0.62, 0, 0);
    applyBone(['mixamorig:RightForeArm'], -0.62, 0, 0);
    return;
  }

  applyBone(['pelvis'], 0, 0.08, 0);
  applyBone(['spine_01'], 0, -0.16, 0);
  applyBone(['thigh_l'], 0, -1.18, -0.08);
  applyBone(['thigh_r'], 0, -1.18, 0.08);
  applyBone(['calf_l'], 0, 1.3, 0);
  applyBone(['calf_r'], 0, 1.3, 0);
  applyBone(['upperarm_l'], 0, -0.18, -0.95, 1);
  applyBone(['upperarm_r'], 0, -0.18, 0.95, 1);
  applyBone(['lowerarm_l'], 0, -0.16, 0, 1);
  applyBone(['lowerarm_r'], 0, -0.16, 0, 1);
}

function normalizeRunnerEnemyTemplate(scene: Group, clips: AnimationClip[]): RunnerEnemyTemplate {
  scene.updateMatrixWorld(true);
  const initialBounds = new Box3().setFromObject(scene);
  const initialSize = initialBounds.getSize(new Vector3());
  scene.scale.multiplyScalar(ENEMY_VISUAL_HEIGHT / Math.max(0.001, initialSize.y));
  scene.updateMatrixWorld(true);

  const normalizedBounds = new Box3().setFromObject(scene);
  const center = normalizedBounds.getCenter(new Vector3());
  scene.position.x -= center.x;
  scene.position.y -= normalizedBounds.min.y;
  scene.position.z -= center.z;
  scene.updateMatrixWorld(true);
  return { scene, clips };
}

export function runnerEnemyVariantIndex(enemyId: number, variantCount: number): number {
  if (variantCount <= 0) {
    return 0;
  }
  return Math.abs(Math.floor(enemyId)) % Math.floor(variantCount);
}

function syncRunnerEnemyVariant(lane: RunnerLane, visual: Group, variantIndex: number): void {
  const safeVariant = runnerEnemyVariantIndex(variantIndex, lane.enemyTemplates.length);
  if (visual.userData.runnerEnemyVariant === safeVariant) {
    return;
  }

  const previousMixer = visual.userData.runnerEnemyMixer as AnimationMixer | undefined;
  previousMixer?.stopAllAction();
  const previous = visual.getObjectByName('runner-enemy-model');
  if (previous) {
    visual.remove(previous);
  }

  const template = lane.enemyTemplates[safeVariant];
  if (!template) {
    return;
  }
  const monster = cloneSkeleton(template.scene) as Group;
  monster.name = 'runner-enemy-model';
  visual.add(monster);
  visual.userData.runnerEnemyVariant = safeVariant;
  visual.userData.runnerEnemyMixer = undefined;
  const clip = template.clips[0];
  if (clip) {
    const mixer = new AnimationMixer(monster);
    mixer.clipAction(clip).play();
    visual.userData.runnerEnemyMixer = mixer;
  }
  const fallback = visual.getObjectByName('runner-enemy-fallback');
  if (fallback) {
    fallback.visible = false;
  }
}

function syncBullets(lane: RunnerLane, state: GameState): void {
  const run = state.runner;
  const instanceParts = lane.fireballInstances;
  if (instanceParts.length === 0) {
    lane.renderer.domElement.dataset.runnerFireballReady = 'false';
    return;
  }

  const count = runnerFireballInstanceCount(run.bullets.length);
  for (const instances of instanceParts) {
    instances.count = count;
    instances.visible = count > 0;
  }
  for (let index = 0; index < count; index += 1) {
    const bullet = run.bullets[index];
    if (!bullet) break;

    const phase = (bullet.id % 23) * 0.37 + run.distance * 0.16;
    const pulse = 0.86 + Math.sin(phase) * 0.045;
    runnerFireballTransform.position.set(bullet.x, 0.72, bullet.z - run.distance);
    // Blender's -Z proof tail exports along glTF -Y; +90 degrees aligns it behind
    // the projectile while the simulation advances toward world +Z.
    runnerFireballTransform.rotation.set(Math.PI / 2, 0, 0);
    runnerFireballTransform.scale.set(pulse, pulse * 1.45, pulse);
    runnerFireballTransform.updateMatrix();
    for (const instances of instanceParts) {
      instances.setMatrixAt(index, runnerFireballTransform.matrix);
    }
  }
  for (const instances of instanceParts) {
    instances.instanceMatrix.needsUpdate = true;
  }
  lane.renderer.domElement.dataset.runnerFireballReady = 'true';
  lane.renderer.domElement.dataset.runnerFireballInstanceCount = String(count);
  lane.renderer.domElement.dataset.runnerFireballDrawCalls = String(lane.fireballDrawCalls);
}

/** Gates are billboards showing the modifier and how many shots are still needed. */
function syncGates(lane: RunnerLane, state: GameState): void {
  const run = state.runner;
  ensurePool(lane.gatePool, lane.gates, run.gates.length, () => {
    const mesh = new Mesh(
      new PlaneGeometry(RUNNER_GATE_HALF_WIDTH * 2, 1.15),
      new MeshBasicMaterial({ transparent: true, side: DoubleSide, depthWrite: false }),
    );
    mesh.rotation.y = Math.PI;
    mesh.renderOrder = 7;
    return mesh;
  });

  for (let index = 0; index < lane.gatePool.length; index += 1) {
    const mesh = lane.gatePool[index]!;
    const gate = run.gates[index];
    if (!gate) {
      mesh.visible = false;
      continue;
    }
    mesh.visible = true;
    mesh.position.set(gate.x, 0.72, gate.z - run.distance);

    const material = mesh.material as MeshBasicMaterial;
    material.map = runnerGateTexture(lane, gate.kind, gate.value, gate.shotsRemaining, gate.activated);
    material.opacity = gate.activated ? 0.35 : 1;
    material.needsUpdate = true;
  }

  lane.renderer.domElement.dataset.runnerGateCount = String(run.gates.length);
}

function createRunnerBoostPortalVisual(): Group {
  const portal = new Group();
  const panel = new Mesh(
    new PlaneGeometry(RUNNER_BOOST_PORTAL_WIDTH, RUNNER_BOOST_PORTAL_HEIGHT),
    new MeshBasicMaterial({ transparent: true, side: DoubleSide, depthWrite: false }),
  );
  panel.name = 'runner-boost-portal-panel';
  panel.position.y = RUNNER_BOOST_PORTAL_HEIGHT * 0.5;
  panel.rotation.y = Math.PI;
  panel.renderOrder = 7;
  portal.add(panel);

  for (const x of [-RUNNER_BOOST_PORTAL_WIDTH * 0.48, RUNNER_BOOST_PORTAL_WIDTH * 0.48]) {
    const post = new Mesh(
      new BoxGeometry(0.1, RUNNER_BOOST_PORTAL_HEIGHT + 0.16, 0.1),
      new MeshBasicMaterial({ color: '#67e8f9' }),
    );
    post.name = 'runner-boost-portal-post';
    post.position.set(x, RUNNER_BOOST_PORTAL_HEIGHT * 0.5, 0.025);
    post.renderOrder = 8;
    portal.add(post);
  }

  const top = new Mesh(
    new BoxGeometry(RUNNER_BOOST_PORTAL_WIDTH, 0.08, 0.08),
    new MeshBasicMaterial({ color: '#67e8f9' }),
  );
  top.name = 'runner-boost-portal-top';
  top.position.set(0, RUNNER_BOOST_PORTAL_HEIGHT, 0.025);
  top.renderOrder = 8;
  portal.add(top);
  return portal;
}

function syncRunnerBoostPortals(lane: RunnerLane, state: GameState): void {
  const pairs = state.runner.boostPortals;
  const needed = pairs.length * 2;
  ensurePool(lane.boostPortalPool, lane.boostPortals, needed, createRunnerBoostPortalVisual);

  for (let index = 0; index < lane.boostPortalPool.length; index += 1) {
    const visual = lane.boostPortalPool[index]!;
    const pair = pairs[Math.floor(index / 2)];
    if (!pair) {
      visual.visible = false;
      continue;
    }

    const isLeft = index % 2 === 0;
    const upgradeId = isLeft ? pair.leftUpgradeId : pair.rightUpgradeId;
    const style = RUNNER_BOOST_PORTAL_LABELS[upgradeId];
    visual.visible = true;
    visual.position.set(
      isLeft ? RUNNER_BOOST_PORTAL_LEFT_X : RUNNER_BOOST_PORTAL_RIGHT_X,
      0,
      pair.z - state.runner.distance,
    );
    const pulse = 1 + Math.sin(state.lastTick * 0.005 + pair.id + index) * 0.025;
    visual.scale.set(1, pulse, 1);

    const panel = visual.getObjectByName('runner-boost-portal-panel') as Mesh;
    const panelMaterial = panel.material as MeshBasicMaterial;
    panelMaterial.map = runnerBoostPortalTexture(lane, upgradeId);
    panelMaterial.opacity = 0.9;
    panelMaterial.needsUpdate = true;
    visual.traverse((object) => {
      if (!(object instanceof Mesh) || object === panel) return;
      (object.material as MeshBasicMaterial).color.set(style.color);
    });
  }

  syncRunnerBoostFeedback(lane, state);
  lane.renderer.domElement.dataset.runnerBoostPortalCount = String(needed);
  lane.renderer.domElement.dataset.runnerBoostPortalLeft = pairs[0]?.leftUpgradeId ?? '';
  lane.renderer.domElement.dataset.runnerBoostPortalRight = pairs[0]?.rightUpgradeId ?? '';
}

function runnerBoostPortalTexture(lane: RunnerLane, upgradeId: RunnerUpgradeId): CanvasTexture {
  const cached = lane.boostPortalTextures.get(upgradeId);
  if (cached) return cached;

  const style = RUNNER_BOOST_PORTAL_LABELS[upgradeId];
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(5, 18, 28, 0.56)';
  ctx.fillRect(8, 8, 496, 304);
  ctx.strokeStyle = style.color;
  ctx.lineWidth = 12;
  ctx.strokeRect(8, 8, 496, 304);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = style.color;
  ctx.shadowBlur = 20;
  ctx.font = 'bold 112px sans-serif';
  ctx.fillText(`${style.icon} +1`, 256, 148);
  ctx.shadowBlur = 8;
  ctx.fillStyle = style.color;
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText(style.name, 256, 222);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('CETTE RUN', 256, 272);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  lane.boostPortalTextures.set(upgradeId, texture);
  return texture;
}

function syncRunnerBoostFeedback(lane: RunnerLane, state: GameState): void {
  const { lastBoostAt, lastBoostUpgradeId } = state.runner;
  if (lastBoostAt === null || lastBoostUpgradeId === null) {
    lane.boostFeedback.visible = false;
    return;
  }
  const age = state.lastTick - lastBoostAt;
  if (age < 0 || age >= RUNNER_BOOST_FEEDBACK_MS) {
    lane.boostFeedback.visible = false;
    return;
  }

  const progress = age / RUNNER_BOOST_FEEDBACK_MS;
  lane.boostFeedback.visible = true;
  lane.boostFeedback.position.set(state.runner.playerX, 2.25 + progress * 0.5, 0.2);
  lane.boostFeedback.scale.set(1.75, 0.62, 1);
  lane.boostFeedback.material.map = runnerBoostFeedbackTexture(lane, lastBoostUpgradeId);
  lane.boostFeedback.material.opacity = Math.min(1, (1 - progress) * 1.8);
  lane.boostFeedback.material.needsUpdate = true;
}

function runnerBoostFeedbackTexture(lane: RunnerLane, upgradeId: RunnerUpgradeId): CanvasTexture {
  const cached = lane.boostFeedbackTextures.get(upgradeId);
  if (cached) return cached;
  const style = RUNNER_BOOST_PORTAL_LABELS[upgradeId];
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = style.color;
  ctx.shadowBlur = 18;
  ctx.font = 'bold 58px sans-serif';
  ctx.fillText(`+1 ${style.name}`, 256, 100);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  lane.boostFeedbackTextures.set(upgradeId, texture);
  return texture;
}

function runnerGateTexture(
  lane: RunnerLane,
  kind: RunnerGateKind,
  value: number,
  shotsRemaining: number,
  activated: boolean,
): CanvasTexture {
  const key = `${kind}:${value}:${activated ? 'x' : Math.max(0, shotsRemaining)}`;
  const cached = lane.gateTextures.get(key);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  const accent = gateColors[kind];

  ctx.fillStyle = 'rgba(8, 16, 24, 0.86)';
  roundRect(ctx, 4, 4, 248, 152, 16);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = accent;
  roundRect(ctx, 4, 4, 248, 152, 16);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = accent;
  ctx.font = 'bold 58px sans-serif';
  ctx.fillText(`+${value}`, 128, 66);

  ctx.fillStyle = '#dbeafe';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(gateLabels[kind], 128, 96);

  // The shot counter is the whole tension of the gate: it says what it will cost you.
  ctx.fillStyle = activated ? '#4ade80' : '#94a3b8';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(activated ? '✓' : `${Math.max(0, Math.ceil(shotsRemaining))}`, 128, 136);

  const texture = new CanvasTexture(canvas);
  // Cache is bounded: a run only ever shows a handful of distinct counters at once.
  if (lane.gateTextures.size > 400) {
    for (const [staleKey, staleTexture] of lane.gateTextures) {
      staleTexture.dispose();
      lane.gateTextures.delete(staleKey);
      if (lane.gateTextures.size <= 200) {
        break;
      }
    }
  }
  lane.gateTextures.set(key, texture);
  return texture;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function ensurePool<T extends Object3D>(pool: T[], group: Group, needed: number, create: () => T): void {
  while (pool.length < needed) {
    const mesh = create();
    group.add(mesh);
    pool.push(mesh);
  }
}

/** A parallel pool of billboarded number labels (sprites always face the camera). */
function ensureLabelPool(pool: Sprite[], group: Group, needed: number): void {
  while (pool.length < needed) {
    // depthTest off so the label is never hidden inside its own cube.
    const sprite = new Sprite(new SpriteMaterial({ depthTest: false }));
    sprite.scale.set(0.72, 0.54, 1);
    sprite.renderOrder = 10;
    group.add(sprite);
    pool.push(sprite);
  }
}

/**
 * A crisp number drawn onto a canvas, cached by value+colour. Health integers are tiny
 * (1..~60), so the cache stays small and no texture is ever re-rasterised per frame.
 */
function numberTexture(lane: RunnerLane, value: number, color: string): CanvasTexture {
  const key = `${color}:${value}`;
  const cached = lane.numberTextures.get(key);
  if (cached) {
    return cached;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 70px sans-serif';
  const text = `${value}`;
  // Heavy dark outline so the digit reads over the road, the cubes and the crowd alike.
  ctx.lineJoin = 'round';
  ctx.lineWidth = 12;
  ctx.strokeStyle = 'rgba(2, 6, 12, 0.92)';
  ctx.strokeText(text, 64, 52);
  ctx.fillStyle = color;
  ctx.fillText(text, 64, 52);

  const texture = new CanvasTexture(canvas);
  lane.numberTextures.set(key, texture);
  return texture;
}

function runnerCoinPopupTexture(lane: RunnerLane, amount: number): CanvasTexture {
  const displayAmount = Number.isInteger(amount) ? `${amount}` : amount.toFixed(1);
  const cached = lane.coinPopupTextures.get(displayAmount);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 58px sans-serif';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 11;
  ctx.strokeStyle = 'rgba(34, 16, 2, 0.94)';
  ctx.strokeText(`+${displayAmount}`, 128, 50);
  ctx.fillStyle = '#ffe66d';
  ctx.fillText(`+${displayAmount}`, 128, 50);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  if (lane.coinPopupTextures.size >= RUNNER_COIN_POPUP_TEXTURE_CACHE_LIMIT) {
    const oldestKey = lane.coinPopupTextures.keys().next().value as string | undefined;
    if (oldestKey) {
      lane.coinPopupTextures.get(oldestKey)?.dispose();
      lane.coinPopupTextures.delete(oldestKey);
    }
  }
  lane.coinPopupTextures.set(displayAmount, texture);
  return texture;
}

// ---------------------------------------------------------------------------
// Input: the squad only ever moves sideways.
// ---------------------------------------------------------------------------

export function startRunnerLaunchTransition(onComplete: (initialPlayerX?: number) => void): boolean {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-runner-3d-lane]');
  const state = latestRunnerState;
  if (!canvas || !state || state.runner.running) {
    return false;
  }
  const lane = laneByCanvas.get(canvas);
  if (!lane || lane.launchTransition) {
    return false;
  }

  lane.launchTransition = {
    startedAt: performance.now(),
    durationMs: runnerMenuStandDurationMs(lane),
    onComplete,
  };
  latestRunnerPointerTargetX = null;
  document.querySelector('.runner-hub')?.classList.add('is-launching');

  const animate = (): void => {
    const transition = lane.launchTransition;
    const currentState = latestRunnerState;
    if (!transition || !currentState || laneByCanvas.get(canvas) !== lane) {
      lane.launchRafId = null;
      return;
    }
    resizeRunnerLane(lane, canvas);
    renderRunnerLane(lane, currentState);
    if (performance.now() - transition.startedAt >= transition.durationMs) {
      lane.launchTransition = null;
      lane.launchRafId = null;
      const pointerTargetX = latestRunnerPointerTargetX;
      transition.onComplete(pointerTargetX ?? undefined);
      return;
    }
    lane.launchRafId = requestAnimationFrame(animate);
  };
  lane.launchRafId = requestAnimationFrame(animate);
  return true;
}

function setRunnerRaycasterFromPointer(
  event: PointerEvent | MouseEvent,
  canvas: HTMLCanvasElement,
  lane: RunnerLane,
): boolean {
  const bounds = canvas.getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) {
    return false;
  }
  runnerPointer.set(
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
  );
  runnerRaycaster.setFromCamera(runnerPointer, lane.camera);
  return true;
}

function handleRunnerPointerMove(event: PointerEvent | MouseEvent): void {
  const canvas = event.currentTarget as HTMLCanvasElement | null;
  if (!canvas) {
    return;
  }

  canvas.style.cursor = 'default';
  const bounds = canvas.getBoundingClientRect();
  if (bounds.width <= 0) {
    return;
  }

  // Ignore any pointer outside the lane: once the cursor leaves the panel, the squad
  // holds its position instead of being yanked by an out-of-bounds move.
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  ) {
    return;
  }

  const pointerTargetX = runnerPointerTargetX(
    event.clientX,
    bounds.left,
    bounds.width,
    RUNNER_LANE_HALF_WIDTH,
  );
  const state = latestRunnerState;
  const lane = laneByCanvas.get(canvas);
  if (state && lane && !state.runner.running) {
    if (lane.launchTransition) latestRunnerPointerTargetX = pointerTargetX;
    return;
  }
  latestRunnerPointerTargetX = pointerTargetX;
  onMove?.(pointerTargetX);
}

function handleRunnerPointerDown(event: PointerEvent): void {
  const canvas = event.currentTarget as HTMLCanvasElement | null;
  if (!canvas) {
    return;
  }
  const editor = editorInteraction;
  const state = latestRunnerState;
  const lane = laneByCanvas.get(canvas);
  if (state && lane && !state.runner.running && !lane.launchTransition) {
    return;
  }
  if (!editor?.enabled || !state || !lane) {
    handleRunnerPointerMove(event);
    return;
  }
  event.preventDefault();
  event.stopPropagation();

  if (!setRunnerRaycasterFromPointer(event, canvas, lane)) {
    return;
  }

  if (editor.mode === 'place') {
    const roadHit = runnerRaycaster.intersectObject(lane.road, false)[0];
    if (roadHit) {
      editor.place(roadHit.point.x, roadHit.point.z + state.runner.distance);
    }
    return;
  }

  const enemyHit = runnerRaycaster.intersectObjects(lane.enemyPool, true)[0];
  let target: Object3D | null = enemyHit?.object ?? null;
  while (target && !Number.isFinite(Number(target.userData.runnerEnemyId))) {
    target = target.parent;
  }
  editor.select(target ? Number(target.userData.runnerEnemyId) : null);
}

function installRunnerKeyListener(): void {
  if (keyListenerInstalled) {
    return;
  }
  keyListenerInstalled = true;

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    // Only steer when the runner lane is actually on screen, and never while typing.
    if (isTypingTarget(event.target) || !document.querySelector('[data-runner-3d-lane]')) {
      return;
    }
    heldKeys.add(event.key);
    event.preventDefault(); // stop the arrow keys from scrolling the page
    startRunnerKeyboardLoop();
  });
  window.addEventListener('keyup', (event) => {
    heldKeys.delete(event.key);
    if (heldKeys.size === 0) {
      stopRunnerKeyboardLoop();
    }
  });
}

/**
 * Steady keyboard steering, on its own rAF loop. Kept OUT of the render path on purpose:
 * dispatching a move from inside renderHud re-enters renderHud and recurses forever.
 */
function startRunnerKeyboardLoop(): void {
  if (keyboardRafId !== null) {
    return;
  }
  const step = (): void => {
    if (heldKeys.size === 0 || !onMove) {
      keyboardRafId = null;
      return;
    }
    const direction = (heldKeys.has('ArrowRight') ? 1 : 0) - (heldKeys.has('ArrowLeft') ? 1 : 0);
    if (direction !== 0) {
      // Negated for the same mirrored-camera reason as the mouse: ArrowRight => screen-right.
      onMove(latestPlayerX - direction * 0.09);
    }
    keyboardRafId = requestAnimationFrame(step);
  };
  keyboardRafId = requestAnimationFrame(step);
}

function stopRunnerKeyboardLoop(): void {
  if (keyboardRafId !== null) {
    cancelAnimationFrame(keyboardRafId);
    keyboardRafId = null;
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  );
}

export function disposeRunnerThreeLane(canvas: HTMLCanvasElement): void {
  const lane = laneByCanvas.get(canvas);
  if (!lane) {
    return;
  }

  if (lane.launchRafId !== null) {
    cancelAnimationFrame(lane.launchRafId);
    lane.launchRafId = null;
  }
  lane.launchTransition = null;

  for (const texture of lane.gateTextures.values()) {
    texture.dispose();
  }
  for (const texture of lane.boostPortalTextures.values()) {
    texture.dispose();
  }
  for (const texture of lane.boostFeedbackTextures.values()) {
    texture.dispose();
  }
  for (const texture of lane.numberTextures.values()) {
    texture.dispose();
  }
  lane.scene.traverse((object) => {
    if (object instanceof Mesh) {
      if (
        object.userData.runnerSharedMonsterAsset ||
        object.userData.runnerSharedHeroAsset ||
        object.userData.runnerSharedEnvironmentAsset ||
        object.userData.runnerSharedFireballAsset
      ) {
        return;
      }
      object.geometry.dispose();
      const material = object.material as Material | Material[];
      if (Array.isArray(material)) {
        material.forEach((entry) => entry.dispose());
      } else {
        material.dispose();
      }
    } else if (object instanceof Sprite) {
      object.material.dispose();
    }
  });
  for (const visual of lane.enemyPool) {
    const mixer = visual.userData.runnerEnemyMixer as AnimationMixer | undefined;
    mixer?.stopAllAction();
  }
  const menuModel = lane.menuHeroSlot.getObjectByName('runner-menu-hero-model');
  const menuMixer = menuModel?.userData.runnerMenuHeroMixer as AnimationMixer | undefined;
  menuMixer?.stopAllAction();
  const heroMixer = lane.playerHero.userData.runnerHeroMixer as AnimationMixer | undefined;
  heroMixer?.stopAllAction();
  lane.renderer.dispose();
  laneByCanvas.delete(canvas);
}
