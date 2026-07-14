import Phaser from 'phaser';
import './style.css';
import { BootScene } from './phaser/scenes/BootScene';
import { LibraryScene } from './phaser/scenes/LibraryScene';
import { gameStore } from './game/store';
import { mountHud } from './ui/hud';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: 'game-root',
  backgroundColor: '#19131b',
  width: 1280,
  height: 720,
  pixelArt: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, LibraryScene],
};

const game = new Phaser.Game(config);
let latestFps = 0;

mountHud(document.querySelector<HTMLDivElement>('#hud-root'));
installDevProbeHooks();
installFrameCounter();
installDebugMonitor(game);
installBurstClickHotkey();
installHoverAutoClickHotkey();
installDebugResourceHotkey();
installDebugManaSkillHotkeys();
installResetMiniGameHotkey();

window.addEventListener('beforeunload', () => {
  game.destroy(true);
});

function installDevProbeHooks(): void {
  if (!import.meta.env.DEV) {
    return;
  }

  Object.defineProperty(window, '__libraryMagicDebug', {
    configurable: true,
    value: {
      get snapshot() {
        return gameStore.snapshot;
      },
      dispatch: gameStore.dispatch.bind(gameStore),
    },
  });
}

function installFrameCounter(): void {
  const gameShell = document.querySelector<HTMLElement>('#game-shell');
  if (!gameShell || gameShell.querySelector('#frame-counter')) {
    return;
  }

  const frameCounter = document.createElement('div');
  frameCounter.id = 'frame-counter';
  frameCounter.textContent = 'FPS --';
  gameShell.appendChild(frameCounter);

  let frameCount = 0;
  let lastSampleTime = performance.now();

  const update = (now: number) => {
    frameCount += 1;
    const elapsed = now - lastSampleTime;
    if (elapsed >= 500) {
      const fps = Math.round((frameCount * 1000) / elapsed);
      latestFps = fps;
      frameCounter.textContent = `FPS ${fps}`;
      frameCounter.dataset.fps = String(fps);
      frameCounter.dataset.status = fps < 45 ? 'low' : fps < 55 ? 'warn' : 'ok';
      frameCount = 0;
      lastSampleTime = now;
    }
    window.requestAnimationFrame(update);
  };

  window.requestAnimationFrame(update);
}

type PerformanceMemory = {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
};

type PerformanceWithMemory = Performance & {
  memory?: PerformanceMemory;
};

type PhaserTextureManagerWithList = Phaser.Textures.TextureManager & {
  list?: Record<string, unknown>;
};

function installDebugMonitor(gameInstance: Phaser.Game): void {
  const gameShell = document.querySelector<HTMLElement>('#game-shell');
  if (!gameShell || gameShell.querySelector('#debug-monitor')) {
    return;
  }

  const debugMonitor = document.createElement('section');
  debugMonitor.id = 'debug-monitor';
  debugMonitor.hidden = true;
  debugMonitor.setAttribute('aria-label', 'Debug performance monitor');
  gameShell.appendChild(debugMonitor);

  let visible = false;
  let lastUpdate = 0;

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'F3' || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    event.preventDefault();
    visible = !visible;
    debugMonitor.hidden = !visible;
    if (visible) {
      lastUpdate = 0;
      window.requestAnimationFrame(updateDebugMonitor);
    }
  });

  const updateDebugMonitor = (now: number) => {
    if (!visible) {
      return;
    }

    if (now - lastUpdate >= 250) {
      debugMonitor.innerHTML = debugMonitorMarkup(gameInstance);
      lastUpdate = now;
    }

    window.requestAnimationFrame(updateDebugMonitor);
  };
}

function debugMonitorMarkup(gameInstance: Phaser.Game): string {
  const state = gameStore.snapshot;
  const heap = (performance as PerformanceWithMemory).memory;
  const phaserStats = phaserDebugStats(gameInstance);
  const heapValue = heap ? `${formatDebugMegabytes(heap.usedJSHeapSize)} / ${formatDebugMegabytes(heap.jsHeapSizeLimit)}` : 'n/a';
  const totalHeapValue = heap ? formatDebugMegabytes(heap.totalJSHeapSize) : 'n/a';

  return `
    <header>
      <strong>DEBUG F3</strong>
      <span>watch growth</span>
    </header>
    <div class="debug-monitor-grid">
      ${debugMetric('FPS', latestFps > 0 ? String(latestFps) : '--')}
      ${debugMetric('Heap', heapValue)}
      ${debugMetric('Heap total', totalHeapValue)}
      ${debugMetric('DOM', document.querySelectorAll('*').length)}
      ${debugMetric('Animations', document.getAnimations().length)}
      ${debugMetric('Phaser children', phaserStats.children)}
      ${debugMetric('Textures', phaserStats.textures)}
      ${debugMetric('Scenes', phaserStats.scenes)}
      ${debugMetric('TD enemies', state.defense.enemies.length)}
      ${debugMetric('TD shots', state.defense.shots.length)}
      ${debugMetric('TD projectiles', state.defense.enemyProjectiles.length)}
      ${debugMetric('TD lightning', state.defense.lightningStrikes.length)}
      ${debugMetric('TD damage', state.defense.damagePopups.length)}
      ${debugMetric('TD money', state.defense.moneyPopups.length)}
      ${debugMetric('TD queued', state.defense.queuedShots.length)}
      ${debugMetric('TD next enemy id', state.defense.nextEnemyId)}
    </div>
  `;
}

function debugMetric(label: string, value: string | number): string {
  return `<span class="debug-monitor-label">${label}</span><b>${value}</b>`;
}

function formatDebugMegabytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function phaserDebugStats(gameInstance: Phaser.Game): { children: number; textures: number; scenes: number } {
  const scenes = gameInstance.scene.getScenes(false);
  const children = scenes.reduce((total, scene) => total + (scene.children?.list.length ?? 0), 0);
  const textureList = (gameInstance.textures as PhaserTextureManagerWithList).list;
  return {
    children,
    textures: textureList ? Object.keys(textureList).length : 0,
    scenes: scenes.length,
  };
}

function installBurstClickHotkey(): void {
  const gameShell = document.querySelector<HTMLElement>('#game-shell');
  let lastPointerPosition: { x: number; y: number } | null = null;
  let isBursting = false;

  window.addEventListener('pointermove', (event) => {
    lastPointerPosition = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'p' || event.repeat || isBursting || isTypingTarget(event.target)) {
      return;
    }
    if (!gameShell || !lastPointerPosition || !isInsideElement(gameShell, lastPointerPosition)) {
      return;
    }

    event.preventDefault();
    isBursting = true;
    void runClickBurst(lastPointerPosition, () => {
      isBursting = false;
    });
  });
}

function installHoverAutoClickHotkey(): void {
  const gameShell = document.querySelector<HTMLElement>('#game-shell');
  let lastPointerPosition: { x: number; y: number } | null = null;
  let hoverAutoClickInterval: number | null = null;

  const stopHoverAutoClick = () => {
    if (hoverAutoClickInterval === null) {
      return;
    }
    window.clearInterval(hoverAutoClickInterval);
    hoverAutoClickInterval = null;
  };

  window.addEventListener('pointermove', (event) => {
    lastPointerPosition = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener('blur', stopHoverAutoClick);

  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 't' || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    event.preventDefault();
    if (hoverAutoClickInterval !== null) {
      stopHoverAutoClick();
      return;
    }
    if (!gameShell || !lastPointerPosition || !isInsideElement(gameShell, lastPointerPosition)) {
      return;
    }

    hoverAutoClickInterval = window.setInterval(() => {
      if (!lastPointerPosition || !isInsideElement(gameShell, lastPointerPosition)) {
        stopHoverAutoClick();
        return;
      }
      dispatchSyntheticClick(lastPointerPosition);
    }, 100);
  });
}

async function runClickBurst(position: { x: number; y: number }, onDone: () => void): Promise<void> {
  for (let index = 0; index < 10; index += 1) {
    dispatchSyntheticClick(position);
    if (index < 9) {
      await delay(100);
    }
  }
  onDone();
}

function dispatchSyntheticClick(position: { x: number; y: number }): void {
  const target = document.elementFromPoint(position.x, position.y);
  if (!target) {
    return;
  }

  target.dispatchEvent(createPointerEvent('pointerdown', position, 1));
  target.dispatchEvent(createMouseEvent('mousedown', position, 1));
  target.dispatchEvent(createPointerEvent('pointerup', position, 0));
  target.dispatchEvent(createMouseEvent('mouseup', position, 0));
  target.dispatchEvent(createMouseEvent('click', position, 0));
}

function createPointerEvent(type: string, position: { x: number; y: number }, buttons: number): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: position.x,
    clientY: position.y,
    button: 0,
    buttons,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
  });
}

function createMouseEvent(type: string, position: { x: number; y: number }, buttons: number): MouseEvent {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: position.x,
    clientY: position.y,
    button: 0,
    buttons,
    view: window,
  });
}

function isInsideElement(element: HTMLElement, position: { x: number; y: number }): boolean {
  const rect = element.getBoundingClientRect();
  return position.x >= rect.left && position.x <= rect.right && position.y >= rect.top && position.y <= rect.bottom;
}

function installDebugResourceHotkey(): void {
  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'o' || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    event.preventDefault();
    gameStore.dispatch({ type: 'grantDebugResources' });
  });
}

function installDebugManaSkillHotkeys(): void {
  window.addEventListener('keydown', (event) => {
    if (event.repeat || isTypingTarget(event.target)) {
      return;
    }

    const key = event.key.toLowerCase();
    if (key === 'k') {
      event.preventDefault();
      gameStore.dispatch({ type: 'unlockAllBooks' });
      return;
    }
    if (key === 'i') {
      event.preventDefault();
      gameStore.dispatch({ type: 'maxAllSkills' });
      return;
    }
    if (event.key === ')') {
      // Debug: drop a meteorite on demand for testing.
      event.preventDefault();
      gameStore.dispatch({ type: 'debugTriggerMeteorite' });
      return;
    }
    if (key === 'j') {
      event.preventDefault();
      gameStore.dispatch({ type: 'setDefenseDebugTowerHealth', enabled: true });
      return;
    }
    if (key === 'u') {
      if (gameStore.snapshot.defense.debugTowerHealthEnabled) {
        event.preventDefault();
        gameStore.dispatch({ type: 'setDefenseDebugTowerHealth', enabled: false });
        return;
      }
      event.preventDefault();
      gameStore.dispatch({ type: 'resetAllSkills' });
    }
  });
}

function installResetMiniGameHotkey(): void {
  window.addEventListener(
    'keydown',
    (event) => {
      if (event.key.toLowerCase() !== 'r' || event.repeat || isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();
      gameStore.dispatch({ type: 'resetSelectedMiniGame' });
    },
    true,
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
