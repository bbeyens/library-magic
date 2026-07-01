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

mountHud(document.querySelector<HTMLDivElement>('#hud-root'));
installFrameCounter();
installBurstClickHotkey();
installDebugResourceHotkey();
installDebugManaSkillHotkeys();
installResetMiniGameHotkey();

window.addEventListener('beforeunload', () => {
  game.destroy(true);
});

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
      frameCounter.textContent = `FPS ${fps}`;
      frameCounter.dataset.status = fps < 45 ? 'low' : fps < 55 ? 'warn' : 'ok';
      frameCount = 0;
      lastSampleTime = now;
    }
    window.requestAnimationFrame(update);
  };

  window.requestAnimationFrame(update);
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
