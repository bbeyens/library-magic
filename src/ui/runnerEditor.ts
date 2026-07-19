import { gameStore } from '../game/store';
import {
  parseRunnerEditorConfig,
  runnerEditorConfigFromRun,
  serializeRunnerEditorConfig,
  type RunnerEditorMonsterConfig,
  type RunnerMonsterModelId,
} from '../game/simulation/runnerEditorRules';
import type { GameState, RunnerEnemy } from '../game/simulation/state';

export type RunnerEditorMode = 'select' | 'place';

export interface RunnerEditorInteraction {
  enabled: boolean;
  mode: RunnerEditorMode;
  selectedEnemyId: number | null;
  place: (x: number, z: number) => void;
  select: (enemyId: number | null) => void;
}

interface PaneEvent<T> {
  value: T;
}

interface PaneControl<T = unknown> {
  on(event: 'change', listener: (event: PaneEvent<T>) => void): PaneControl<T>;
  on(event: 'click', listener: () => void): PaneControl<T>;
  disabled: boolean;
  element: HTMLElement;
}

interface PaneFolder extends PaneControl {
  addBinding<T extends object, K extends keyof T>(
    target: T,
    key: K,
    options?: Record<string, unknown>,
  ): PaneControl<T[K]>;
  addButton(options: { title: string; label?: string }): PaneControl;
  addFolder(options: { title: string; expanded?: boolean }): PaneFolder;
}

interface RunnerEditorPane extends PaneFolder {
  refresh(): void;
  dispose(): void;
}

const MODEL_OPTIONS: Record<string, RunnerMonsterModelId> = {
  Beholder: 'beholder',
  Cactus: 'cactus',
  Coffre: 'chest-monster',
  Squelette: 'skeleton-warrior',
};

const editorParams = {
  mode: 'select' as RunnerEditorMode,
  paused: true,
  modelId: 'beholder' as RunnerMonsterModelId,
  x: 0,
  distance: 16,
  health: 5,
  contactDamage: 1,
  coinReward: 1,
  scale: 1,
  speedMultiplier: 1,
};

let installed = false;
let editorOpen = false;
let selectedEnemyId: number | null = null;
let pane: RunnerEditorPane | null = null;
let selectedFolder: PaneFolder | null = null;
let host: HTMLDivElement | null = null;
let jsonField: HTMLTextAreaElement | null = null;
let statusElement: HTMLDivElement | null = null;
let creatingPane: Promise<void> | null = null;

export function installRunnerEditor(): void {
  if (!import.meta.env.DEV || installed) {
    return;
  }
  installed = true;
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'F2' || isTypingTarget(event.target)) {
      return;
    }
    event.preventDefault();
    toggleRunnerEditor();
  });
}

export function syncRunnerEditor(state: GameState): void {
  if (!import.meta.env.DEV) {
    return;
  }

  const runnerOpen = state.openBookPanels.some((panel) => panel.bookId === 'runner');
  if (!runnerOpen && editorOpen) {
    closeRunnerEditor();
    return;
  }
  if (!editorOpen) {
    return;
  }

  const selected = selectedEnemy(state);
  if (selectedEnemyId !== null && !selected) {
    selectedEnemyId = null;
  }
  syncModeButtons();
  if (selectedFolder) {
    selectedFolder.disabled = !selected;
  }
  const activeElement = document.activeElement;
  const editingControl = Boolean(
    host &&
      activeElement instanceof HTMLElement &&
      host.contains(activeElement) &&
      activeElement.matches('input, select, textarea, [contenteditable="true"]'),
  );
  if (!editingControl) {
    syncParamsFromEnemy(state, selected);
    pane?.refresh();
  }
}

export function runnerEditorInteraction(): RunnerEditorInteraction {
  return {
    enabled: import.meta.env.DEV && editorOpen,
    mode: editorParams.mode,
    selectedEnemyId,
    place: placeRunnerEditorEnemy,
    select: selectRunnerEditorEnemy,
  };
}

function toggleRunnerEditor(): void {
  const state = gameStore.snapshot;
  if (!state.openBookPanels.some((panel) => panel.bookId === 'runner')) {
    return;
  }
  if (editorOpen) {
    closeRunnerEditor();
    return;
  }

  editorOpen = true;
  if (!state.runner.running || state.runner.dead) {
    gameStore.dispatch({ type: 'startRunnerRun' });
  }
  gameStore.dispatch({ type: 'setRunnerEditorPaused', paused: true });
  editorParams.paused = true;
  void ensurePane();
}

function closeRunnerEditor(): void {
  editorOpen = false;
  selectedEnemyId = null;
  host?.classList.remove('is-visible');
  if (gameStore.snapshot.runner.editorPaused) {
    gameStore.dispatch({ type: 'setRunnerEditorPaused', paused: false });
  }
}

async function ensurePane(): Promise<void> {
  if (pane) {
    host?.classList.add('is-visible');
    syncRunnerEditor(gameStore.snapshot);
    return;
  }
  if (creatingPane) {
    return creatingPane;
  }

  creatingPane = createPane();
  await creatingPane;
  creatingPane = null;
}

async function createPane(): Promise<void> {
  const { Pane } = await import('tweakpane');
  host = document.createElement('div');
  host.className = 'runner-editor-host is-visible';
  host.innerHTML = `
    <div class="runner-editor-modes" role="group" aria-label="Mode de l'éditeur runner">
      <button type="button" data-runner-editor-mode="select" aria-pressed="true">Sélection</button>
      <button type="button" data-runner-editor-mode="place" aria-pressed="false">Placement</button>
    </div>
    <div class="runner-editor-pane"></div>
    <textarea class="runner-editor-json" aria-label="Configuration JSON du runner" spellcheck="false"></textarea>
    <div class="runner-editor-status" role="status"></div>
  `;
  document.body.append(host);
  jsonField = host.querySelector('.runner-editor-json');
  statusElement = host.querySelector('.runner-editor-status');
  host.querySelectorAll<HTMLButtonElement>('[data-runner-editor-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      editorParams.mode = button.dataset.runnerEditorMode === 'place' ? 'place' : 'select';
      syncModeButtons();
    });
  });

  const paneContainer = host.querySelector<HTMLElement>('.runner-editor-pane');
  if (!paneContainer) {
    throw new Error('Runner editor container missing.');
  }
  pane = new Pane({ title: 'Runner Editor', container: paneContainer }) as unknown as RunnerEditorPane;

  const sceneFolder = pane.addFolder({ title: 'Scène', expanded: true });
  const pauseBinding = sceneFolder.addBinding(editorParams, 'paused', { label: 'Pause' }).on('change', (event) => {
    gameStore.dispatch({ type: 'setRunnerEditorPaused', paused: event.value });
  });
  pauseBinding.element.querySelector<HTMLInputElement>('input')?.addEventListener('change', (event) => {
    const paused = (event.currentTarget as HTMLInputElement).checked;
    editorParams.paused = paused;
    gameStore.dispatch({ type: 'setRunnerEditorPaused', paused });
  });

  const placementFolder = pane.addFolder({ title: 'Placement', expanded: true });
  const modelBinding = placementFolder
    .addBinding(editorParams, 'modelId', { label: 'Modèle', options: MODEL_OPTIONS })
    .on('change', (event) => updateSelected({ modelId: event.value }));
  modelBinding.element.querySelector<HTMLSelectElement>('select')?.addEventListener('change', (event) => {
    const modelId = (event.currentTarget as HTMLSelectElement).value as RunnerMonsterModelId;
    editorParams.modelId = modelId;
    updateSelected({ modelId });
  });

  selectedFolder = pane.addFolder({ title: 'Monstre sélectionné', expanded: true });
  bindSelectedNumber('x', 'X', { min: -2.4, max: 2.4, step: 0.05 });
  bindSelectedNumber('distance', 'Distance', { min: -2, max: 64, step: 0.5 });
  bindSelectedNumber('health', 'Vie', { min: 1, max: 1_000_000, step: 1 });
  bindSelectedNumber('contactDamage', 'Dégâts', { min: 1, max: 60, step: 1 });
  bindSelectedNumber('coinReward', 'Récompense', { min: 0, max: 1_000_000, step: 1 });
  bindSelectedNumber('speedMultiplier', 'Vitesse', { min: 0, max: 4, step: 0.05 });
  bindSelectedNumber('scale', 'Échelle', { min: 0.25, max: 3, step: 0.05 });
  selectedFolder.addButton({ title: 'Dupliquer' }).on('click', duplicateSelected);
  selectedFolder.addButton({ title: 'Supprimer' }).on('click', removeSelected);

  const configFolder = pane.addFolder({ title: 'Configuration', expanded: false });
  configFolder.addButton({ title: 'Exporter JSON' }).on('click', exportRunnerEditorJson);
  configFolder.addButton({ title: 'Importer JSON' }).on('click', importRunnerEditorJson);
  configFolder.addButton({ title: 'Effacer les placements' }).on('click', clearRunnerEditorPlacements);

  syncRunnerEditor(gameStore.snapshot);
}

function syncModeButtons(): void {
  host?.querySelectorAll<HTMLButtonElement>('[data-runner-editor-mode]').forEach((button) => {
    const active = button.dataset.runnerEditorMode === editorParams.mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function bindSelectedNumber(
  key: Exclude<keyof RunnerEditorMonsterConfig, 'modelId'>,
  label: string,
  options: { min: number; max: number; step: number },
): void {
  const binding = selectedFolder
    ?.addBinding(editorParams, key, { label, ...options })
    .on('change', (event) => updateSelected({ [key]: event.value }));
  const input = binding?.element.querySelector<HTMLInputElement>('input');
  input?.addEventListener('input', () => updateSelectedNumberFromInput(key, input));
  input?.addEventListener('change', () => updateSelectedNumberFromInput(key, input));
}

function updateSelectedNumberFromInput(
  key: Exclude<keyof RunnerEditorMonsterConfig, 'modelId'>,
  input: HTMLInputElement,
): void {
  const value = Number(input.value.replace(',', '.'));
  if (!Number.isFinite(value)) {
    return;
  }
  editorParams[key] = value;
  updateSelected({ [key]: value });
}

function selectedEnemy(state: GameState): RunnerEnemy | null {
  if (selectedEnemyId === null) {
    return null;
  }
  return state.runner.enemies.find((enemy) => enemy.id === selectedEnemyId) ?? null;
}

function syncParamsFromEnemy(state: GameState, enemy: RunnerEnemy | null): void {
  editorParams.paused = state.runner.editorPaused;
  if (!enemy) {
    return;
  }
  editorParams.modelId = enemy.modelId ?? 'beholder';
  editorParams.x = roundEditorValue(enemy.x);
  editorParams.distance = roundEditorValue(enemy.z - state.runner.distance);
  editorParams.health = roundEditorValue(enemy.maxHealth);
  editorParams.contactDamage = roundEditorValue(enemy.contactDamage ?? 1);
  editorParams.coinReward = roundEditorValue(enemy.coinReward ?? 1);
  editorParams.scale = roundEditorValue(enemy.scale ?? 1);
  editorParams.speedMultiplier = roundEditorValue(enemy.speedMultiplier ?? 1);
}

function placeRunnerEditorEnemy(x: number, z: number): void {
  if (!editorOpen || editorParams.mode !== 'place') {
    return;
  }
  const state = gameStore.snapshot;
  const nextId = state.runner.nextEntityId;
  gameStore.dispatch({
    type: 'addRunnerEditorEnemy',
    monster: {
      modelId: editorParams.modelId,
      x,
      distance: z - state.runner.distance,
      health: editorParams.health,
      contactDamage: editorParams.contactDamage,
      coinReward: editorParams.coinReward,
      scale: editorParams.scale,
      speedMultiplier: editorParams.speedMultiplier,
    },
  });
  selectedEnemyId = nextId;
  setStatus('Monstre placé.');
}

function selectRunnerEditorEnemy(enemyId: number | null): void {
  if (!editorOpen || editorParams.mode !== 'select') {
    return;
  }
  selectedEnemyId = enemyId;
  syncRunnerEditor(gameStore.snapshot);
}

function updateSelected(patch: Partial<RunnerEditorMonsterConfig>): void {
  if (selectedEnemyId === null) {
    return;
  }
  gameStore.dispatch({ type: 'updateRunnerEditorEnemy', enemyId: selectedEnemyId, patch });
}

function duplicateSelected(): void {
  if (selectedEnemyId === null) {
    return;
  }
  const nextId = gameStore.snapshot.runner.nextEntityId;
  gameStore.dispatch({ type: 'duplicateRunnerEditorEnemy', enemyId: selectedEnemyId });
  selectedEnemyId = nextId;
  setStatus('Monstre dupliqué.');
}

function removeSelected(): void {
  if (selectedEnemyId === null) {
    return;
  }
  gameStore.dispatch({ type: 'removeRunnerEditorEnemy', enemyId: selectedEnemyId });
  selectedEnemyId = null;
  setStatus('Monstre supprimé.');
}

function exportRunnerEditorJson(): void {
  if (!jsonField) {
    return;
  }
  const json = serializeRunnerEditorConfig(runnerEditorConfigFromRun(gameStore.snapshot.runner));
  jsonField.value = json;
  jsonField.focus();
  jsonField.select();
  setStatus('Configuration exportée.');
}

function importRunnerEditorJson(): void {
  if (!jsonField) {
    return;
  }
  try {
    const config = parseRunnerEditorConfig(jsonField.value);
    selectedEnemyId = null;
    gameStore.dispatch({ type: 'replaceRunnerEditorEnemies', config });
    setStatus(`${config.monsters.length} monstre(s) importé(s).`);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Configuration runner invalide.', true);
  }
}

function clearRunnerEditorPlacements(): void {
  selectedEnemyId = null;
  gameStore.dispatch({ type: 'replaceRunnerEditorEnemies', config: { version: 1, monsters: [] } });
  setStatus('Placements effacés.');
}

function setStatus(message: string, error = false): void {
  if (!statusElement) {
    return;
  }
  statusElement.textContent = message;
  statusElement.classList.toggle('is-error', error);
}

function roundEditorValue(value: number): number {
  return Math.round(value * 100) / 100;
}

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  );
}
