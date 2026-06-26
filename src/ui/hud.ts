import { books, getBook, type BookId } from '../game/content/books';
import { hasDefenseTiledMap, loadDefenseTiledMap, renderDefenseTiledTerrain } from '../game/content/tdTiledMap';
import { defenseEnemyPosition } from '../game/simulation/defenseRules';
import { gameStore } from '../game/store';
import {
  blackjackCardLabel,
  blackjackAceBiasChance,
  blackjackHandValue,
  blackjackSkillCost,
  blackjackSkillMaxLevel,
  blackjackVisibleDealerValue,
  manaAutomationInterval,
  manaCriticalMultiplier,
  manaSkillCost,
  manaSkillMaxLevel,
  manaWandCount,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseWaveEnemyCount,
  defenseWaveProgress,
  hundredOptionRange,
  hundredTargetMax,
  miningAutomationInterval,
  miningPickaxeDamage,
  miningSkillCost,
  miningSkillMaxLevel,
  miningSplashDamage,
  runeTypingCurrentWord,
  runeTypingRewardPreview,
  SLIME_TRAINER_COMMANDS,
  slimeTrainerCommandDamage,
  slimeTrainerCommandUnlocked,
  slimeTrainerEnemyAttackDamage,
  slimeTrainerXpToNextLevel,
  snakeBaseMultiplier,
  snakeAutomationActive,
  snakeExtraLivesRemaining,
  snakeGridSize,
  snakeMoveInterval,
  snakeSkillCost,
  snakeSkillMaxLevel,
  snakeTotalMultiplier,
  targetSkillCost,
  targetSkillMaxLevel,
  type ManaSkillId,
  type BlackjackSkillId,
  type MiningSkillId,
  type SnakeSkillId,
} from '../game/simulation/actions';
import type { HundredOptionId } from '../game/simulation/hundredRules';
import {
  targetAttackDamage,
  targetAutomationInterval,
  targetMaxActiveTargets,
  targetSpawnInterval,
  type TargetSkillId,
} from '../game/simulation/targetRules';
import type { SlimeTrainerCommandId } from '../game/simulation/slimeTrainerRules';
import type { BlackjackCard, BookPanelSlot, GameState, SnakeCell, SnakeDirection } from '../game/simulation/state';

let rootElement: HTMLDivElement | null = null;
let openUpgradePanel: BookId | null = null;
let upgradePanelMode: 'detail' | 'compact' = 'detail';
let bookMenuOpen = false;
let lastRenderSignature = '';
let lastOpenPanelsSignature = '';
let lastOpenUpgradePanel: BookId | null = null;
let lastUpgradePanelMode: 'detail' | 'compact' = 'detail';
let lastSnakeRewardMarker = '';
let lastRuneTypingRewardMarker = '';
let lastDefenseRewardMarker = '';
let lastBlackjackRewardMarker = '';
let lastHundredRewardMarker = '';
let lastTargetRewardMarker = '';
let lastMiningRewardMarker = '';
let lastSlimeTrainerRewardMarker = '';
let lastBlackjackRenderedRound = -1;
let lastBlackjackRenderedHands: Record<'dealer' | 'player', string[]> = { dealer: [], player: [] };
let blackjackAutoDealTimeout: number | null = null;
let blackjackAutoDealMarker = '';
let lastManaAutoCastCount = 0;
let lastHundredDisplayedProgress = 0;
let lastHundredProgressAnimationMarker = '';
let pendingHundredProgressAnimationMarker = '';
let hundredProgressSettleTimeout: number | null = null;
let activeHundredProgressTarget: number | null = null;
let snakeControlsInstalled = false;
let typingControlsInstalled = false;
let blackjackControlsInstalled = false;
let escapeControlsInstalled = false;
let suppressClickListenerInstalled = false;
let bookMenuOutsideCloseInstalled = false;
let pendingBookMenuOutsideClose = false;
let suppressNextPanelClickUntil = 0;
let activePanelInteractionCount = 0;
const FLOATING_GAIN_MAX_VISIBLE = 18;
const FLOATING_GAIN_FLUSH_MS = 80;
const pendingFloatingGains = new Map<string, { amount: number }>();
let floatingGainFlushHandle: number | null = null;
const BOOK_PANEL_ASPECT_RATIO = 210 / 297;
const BOOK_PANEL_MIN_HORIZONTAL_TRAVEL = 96;
const BOOK_PANEL_SIZE_PRESETS = [
  { id: 'small', label: 'S', width: 245 },
  { id: 'medium', label: 'M', width: 370 },
  { id: 'large', label: 'L', width: 496 },
] as const;
type BookPanelSizePreset = (typeof BOOK_PANEL_SIZE_PRESETS)[number];
type BookPanelSizePresetId = BookPanelSizePreset['id'];
const bookPanelPositions = new Map<BookId, { left: number; top: number }>();
const bookPanelSizes = new Map<BookId, { width: number; height: number }>();
const bookPanelSizePresetIds = new Map<BookId, BookPanelSizePresetId>();
const preloadedSnakeAtlasImages: HTMLImageElement[] = [];
let snakeAtlasPreloaded = false;

export function mountHud(root: HTMLDivElement | null): void {
  rootElement = root;
  if (!rootElement) {
    throw new Error('Missing #hud-root');
  }
  preloadSnakeAtlasTiles();
  installSnakeControls();
  installTypingControls();
  installBlackjackControls();
  installEscapeControls();
  installBookMenuOutsideClose();
  gameStore.subscribe(renderHud);
  void loadDefenseTiledMap().then(() => {
    lastRenderSignature = '';
    renderHud(gameStore.snapshot);
  });
}

function preloadSnakeAtlasTiles(): void {
  if (snakeAtlasPreloaded) {
    return;
  }

  snakeAtlasPreloaded = true;
  const frames = ['a', 'b'] as const;
  const headDirections: SnakeDirection[] = ['up', 'right', 'down', 'left'];
  const cornerDirections = ['left-up', 'up-right', 'right-down', 'down-left', 'up-left', 'right-up', 'down-right', 'left-down'];
  const tileNames = [
    ...headDirections.map((direction) => `head-${direction}`),
    'body-straight',
    'body-tail',
    ...cornerDirections.map((direction) => `body-corner-${direction}`),
  ];

  for (const tileName of tileNames) {
    for (const frame of frames) {
      const image = new Image();
      image.decoding = 'sync';
      image.src = snakeAtlasTile(tileName, frame);
      preloadedSnakeAtlasImages.push(image);
    }
  }
}

function renderHud(state: GameState): void {
  if (!rootElement) {
    return;
  }

  if (activePanelInteractionCount > 0) {
    updateDynamicHudValues(state);
    return;
  }

  const signature = createHudSignature(state);
  if (signature === lastRenderSignature) {
    updateDynamicHudValues(state);
    runHudTransientEffects(state);
    scheduleBlackjackAutoDeal(state);
    return;
  }

  const openPanelsSignature = state.openBookPanels.map((panel) => `${panel.bookId}:${panel.slot}`).join('|');
  const previousOpenBookIds = new Set(
    lastOpenPanelsSignature
      .split('|')
      .filter(Boolean)
      .map((panelSignature) => panelSignature.split(':')[0] as BookId),
  );
  const shouldAnimateUpgradePanel =
    openUpgradePanel !== null && (lastOpenUpgradePanel !== openUpgradePanel || lastUpgradePanelMode !== upgradePanelMode);
  lastRenderSignature = signature;
  lastOpenPanelsSignature = openPanelsSignature;
  lastOpenUpgradePanel = openUpgradePanel;
  lastUpgradePanelMode = upgradePanelMode;

  rootElement.innerHTML = `
    <div class="screen-vignette"></div>
    <button class="book-menu-toggle" data-action="toggleBookMenu" aria-label="Ouvrir la liste des mini-jeux" aria-expanded="${bookMenuOpen ? 'true' : 'false'}">
      <span></span>
      <span></span>
      <span></span>
    </button>
    ${bookMenuOpen ? `
      <section class="book-menu-drawer" aria-label="Mini-jeux">
        ${books.map((book) => bookMenuEntry(book.id, state)).join('')}
      </section>
    ` : ''}
    <aside class="resource-panel" aria-label="Resources">
      ${resourceRow('scales', '☉', 'Ecailles', state.resources.scales, '#a78cff')}
      ${resourceRow('runes', '✦', 'Runes', state.resources.runes, '#ed9fff')}
      ${resourceRow('spores', '♣', 'Spores', state.resources.spores, '#91d980')}
      ${resourceRow('sigils', '◆', 'Sceaux', state.resources.sigils, '#ffc36e')}
      ${resourceRow('chips', '♠', 'Jetons', state.resources.chips, '#74d88f')}
      ${resourceRow('fragments', '#', 'Fragments', state.resources.fragments, '#7ea4ff')}
      ${resourceRow('marks', '◎', 'Marques', state.resources.marks, '#ff7a80')}
      ${resourceRow('minerals', '▰', 'Minerais', state.resources.minerals, '#d69a58')}
      ${resourceRow('gels', '●', 'Gels', state.resources.gels, '#7df0a3')}
    </aside>
    ${state.openBookPanels
      .map((panel) => bookOverlay(panel.bookId, panel.slot, state, !previousOpenBookIds.has(panel.bookId), shouldAnimateUpgradePanel))
      .join('')}
  `;

  if (!suppressClickListenerInstalled) {
    suppressClickListenerInstalled = true;
    rootElement.addEventListener('click', suppressPanelClickAfterDrag, true);
  }

  rootElement.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const bookId = button.dataset.bookId as BookId | undefined;
      focusBookPanelFromControl(button, bookId);
      if (action === 'chargeMana') {
        const beforeMana = gameStore.snapshot.mana;
        gameStore.dispatch({ type: 'chargeMana' });
        const gainedMana = gameStore.snapshot.mana - beforeMana;
        showCrystalClickEffect(gainedMana);
        showFloatingGain(gainedMana);
      }
      if (action === 'closeBookPanel' && bookId) {
        if (openUpgradePanel === bookId) {
          openUpgradePanel = null;
        }
        upgradePanelMode = 'detail';
        gameStore.dispatch({ type: 'closeBookPanel', bookId });
      }
      if (action === 'moveBookPanel' && bookId) {
        gameStore.dispatch({ type: 'moveBookPanel', bookId });
      }
      if (action === 'cycleBookPanelSize' && bookId) {
        const panel = button.closest<HTMLElement>('.book-overlay');
        if (panel) {
          cycleBookPanelSize(bookId, panel);
        }
      }
      if (action === 'buyManaSkill') {
        const skillId = button.dataset.skillId as ManaSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buyManaSkill', skillId });
        }
      }
      if (action === 'buySnakeSkill') {
        const skillId = button.dataset.skillId as SnakeSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buySnakeSkill', skillId });
        }
      }
      if (action === 'buyTargetSkill') {
        const skillId = button.dataset.skillId as TargetSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buyTargetSkill', skillId });
        }
      }
      if (action === 'buyMiningSkill') {
        const skillId = button.dataset.skillId as MiningSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buyMiningSkill', skillId });
        }
      }
      if (action === 'buyBlackjackSkill') {
        const skillId = button.dataset.skillId as BlackjackSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buyBlackjackSkill', skillId });
        }
      }
      if (action === 'toggleSnakeAutomation') {
        gameStore.dispatch({ type: 'toggleSnakeAutomation' });
      }
      if (action === 'dealBlackjack') {
        gameStore.dispatch({ type: 'dealBlackjack' });
      }
      if (action === 'hitBlackjack') {
        gameStore.dispatch({ type: 'hitBlackjack' });
      }
      if (action === 'standBlackjack') {
        gameStore.dispatch({ type: 'standBlackjack' });
      }
      if (action === 'rerollPlayerBlackjackCard') {
        gameStore.dispatch({ type: 'rerollPlayerBlackjackCard' });
      }
      if (action === 'rerollDealerBlackjackCard') {
        gameStore.dispatch({ type: 'rerollDealerBlackjackCard' });
      }
      if (action === 'revealBlackjackDealerCard') {
        gameStore.dispatch({ type: 'revealBlackjackDealerCard' });
      }
      if (action === 'chooseHundredOption') {
        const optionId = button.dataset.optionId as HundredOptionId | undefined;
        if (optionId) {
          gameStore.dispatch({ type: 'chooseHundredOption', optionId });
        }
      }
      if (action === 'attackTarget') {
        const targetId = Number(button.dataset.targetId);
        if (Number.isFinite(targetId)) {
          gameStore.dispatch({ type: 'attackTarget', targetId });
        }
      }
      if (action === 'digMiningBlock') {
        const blockId = Number(button.dataset.blockId);
        if (Number.isFinite(blockId)) {
          gameStore.dispatch({ type: 'digMiningBlock', blockId });
        }
      }
      if (action === 'trainSlime') {
        const commandId = button.dataset.commandId as SlimeTrainerCommandId | undefined;
        if (commandId) {
          gameStore.dispatch({ type: 'trainSlime', commandId });
        }
      }
      if (action === 'toggleUpgradePanel' && bookId) {
        const isSamePanel = openUpgradePanel === bookId && upgradePanelMode === 'detail';
        openUpgradePanel = isSamePanel ? null : bookId;
        upgradePanelMode = 'detail';
        renderHud(gameStore.snapshot);
      }
      if (action === 'toggleCompactUpgradePanel' && bookId) {
        const isSamePanel = openUpgradePanel === bookId && upgradePanelMode === 'compact';
        openUpgradePanel = isSamePanel ? null : bookId;
        upgradePanelMode = 'compact';
        renderHud(gameStore.snapshot);
      }
      if (action === 'toggleBookMenu') {
        blurElement(button);
        bookMenuOpen = !bookMenuOpen;
        renderHud(gameStore.snapshot);
      }
      if (action === 'buyUpgrade' && bookId) {
        gameStore.dispatch({ type: 'buyUpgrade', bookId });
      }
      if (action === 'selectBook' && bookId) {
        openUpgradePanel = null;
        upgradePanelMode = 'detail';
        gameStore.dispatch({ type: isBookPanelOpen(gameStore.snapshot, bookId) ? 'closeBookPanel' : 'selectBook', bookId });
      }
      if (action === 'unlockBook' && bookId) {
        openUpgradePanel = null;
        upgradePanelMode = 'detail';
        gameStore.dispatch({ type: 'unlockBook', bookId });
      }
    });
  });

  rootElement.querySelectorAll<HTMLElement>('.book-overlay, .mini-skill-popover, .upgrade-panel, .book-menu-toggle, .book-menu-drawer').forEach((panel) => {
    panel.addEventListener('pointerdown', stopHudPointerEvent);
    panel.addEventListener('pointerup', stopHudPointerEvent);
    panel.addEventListener('click', stopHudPointerEvent);
  });
  installBookPanelFocus();
  installBookPanelDragging();

  updateDynamicHudValues(state);
  runHudTransientEffects(state);
  scheduleBlackjackAutoDeal(state);
}

function runHudTransientEffects(state: GameState): void {
  if (isBookPanelOpen(state, 'serpent') && state.snake.lastReward > 0) {
    const marker = `${state.snake.score}:${Math.floor(state.resources.scales)}`;
    if (marker !== lastSnakeRewardMarker) {
      lastSnakeRewardMarker = marker;
      showFloatingGain(state.snake.lastReward, '.snake-board');
    }
  }

  if (isBookPanelOpen(state, 'mana') && state.manaSkills.autoCastCount !== lastManaAutoCastCount) {
    lastManaAutoCastCount = state.manaSkills.autoCastCount;
    showWandCastEffect();
  }

  if (isBookPanelOpen(state, 'typing') && state.runeTyping.lastReward > 0) {
    const marker = `${state.runeTyping.completedWords}:${Math.floor(state.resources.runes)}`;
    if (marker !== lastRuneTypingRewardMarker) {
      lastRuneTypingRewardMarker = marker;
      showFloatingGain(state.runeTyping.lastReward, '.typing-focus');
    }
  }

  if (isBookPanelOpen(state, 'defense') && state.defense.lastReward > 0) {
    const marker = `${state.defense.score}:${Math.floor(state.resources.sigils)}:${state.defense.shotPulse}`;
    if (marker !== lastDefenseRewardMarker) {
      lastDefenseRewardMarker = marker;
      showFloatingGain(state.defense.lastReward, '.defense-arena');
    }
  }

  if (isBookPanelOpen(state, 'blackjack') && state.blackjack.lastReward > 0) {
    const marker = `${state.blackjack.round}:${Math.floor(state.resources.chips)}:${state.blackjack.phase}`;
    if (marker !== lastBlackjackRewardMarker) {
      lastBlackjackRewardMarker = marker;
      showFloatingGain(state.blackjack.lastReward, '.blackjack-table');
    }
  }

  if (isBookPanelOpen(state, 'hundred') && state.hundred.lastReward > 0) {
    const marker = `${state.hundred.wins}:${Math.floor(state.resources.fragments)}:${state.hundred.lastRoll}`;
    if (marker !== lastHundredRewardMarker) {
      lastHundredRewardMarker = marker;
      showFloatingGain(state.hundred.lastReward, '.hundred-board');
    }
  }

  if (isBookPanelOpen(state, 'targets') && state.targets.lastReward > 0) {
    const marker = `${state.targets.score}:${Math.floor(state.resources.marks)}:${state.targets.shotPulse}`;
    if (marker !== lastTargetRewardMarker) {
      lastTargetRewardMarker = marker;
      showFloatingGain(state.targets.lastReward, '.target-gallery');
    }
  }

  if (isBookPanelOpen(state, 'mine') && state.mining.lastReward > 0) {
    const marker = `${state.mining.totalMined}:${Math.floor(state.resources.minerals)}:${state.mining.hitPulse}`;
    if (marker !== lastMiningRewardMarker) {
      lastMiningRewardMarker = marker;
      showFloatingGain(state.mining.lastReward, '.mining-grid');
    }
  }

  if (isBookPanelOpen(state, 'slimeTrainer') && state.slimeTrainer.lastReward > 0) {
    const marker = `${state.slimeTrainer.victories}:${Math.floor(state.resources.gels)}:${state.slimeTrainer.hitPulse}`;
    if (marker !== lastSlimeTrainerRewardMarker) {
      lastSlimeTrainerRewardMarker = marker;
      showFloatingGain(state.slimeTrainer.lastReward, '.slime-battlefield');
    }
  }
}

function scheduleBlackjackAutoDeal(state: GameState): void {
  const shouldAutoDeal =
    isBookPanelOpen(state, 'blackjack') &&
    ['won', 'lost', 'push', 'blackjack'].includes(state.blackjack.phase);
  const marker = `${state.blackjack.round}:${state.blackjack.phase}`;

  if (!shouldAutoDeal) {
    clearBlackjackAutoDeal();
    return;
  }

  if (blackjackAutoDealTimeout !== null && blackjackAutoDealMarker === marker) {
    return;
  }

  clearBlackjackAutoDeal();
  blackjackAutoDealMarker = marker;
  blackjackAutoDealTimeout = window.setTimeout(() => {
    blackjackAutoDealTimeout = null;
    blackjackAutoDealMarker = '';
    const current = gameStore.snapshot;
    if (
      isBookPanelOpen(current, 'blackjack') &&
      ['won', 'lost', 'push', 'blackjack'].includes(current.blackjack.phase) &&
      `${current.blackjack.round}:${current.blackjack.phase}` === marker
    ) {
      gameStore.dispatch({ type: 'dealBlackjack' });
    }
  }, 2000);
}

function clearBlackjackAutoDeal(): void {
  if (blackjackAutoDealTimeout === null) {
    blackjackAutoDealMarker = '';
    return;
  }
  window.clearTimeout(blackjackAutoDealTimeout);
  blackjackAutoDealTimeout = null;
  blackjackAutoDealMarker = '';
}

function updateDynamicHudValues(state: GameState): void {
  setDynamicText('mana', Math.floor(state.mana));
  setDynamicText('scales', Math.floor(state.resources.scales));
  setDynamicText('runes', Math.floor(state.resources.runes));
  setDynamicText('spores', Math.floor(state.resources.spores));
  setDynamicText('sigils', Math.floor(state.resources.sigils));
  setDynamicText('chips', Math.floor(state.resources.chips));
  setDynamicText('fragments', Math.floor(state.resources.fragments));
  setDynamicText('marks', Math.floor(state.resources.marks));
  setDynamicText('minerals', Math.floor(state.resources.minerals));
  setDynamicText('gels', Math.floor(state.resources.gels));
  setDynamicText('snake-score', state.snake.score);
  setDynamicText('snake-best', state.snake.best);
  setDynamicText('target-score', state.targets.score);
  setDynamicText('target-best', state.targets.best);
  setDynamicText('typing-reward', runeTypingRewardPreview(state));
  setDynamicText('typing-combo', state.runeTyping.combo);
  setDynamicText('typing-penalty', state.runeTyping.penaltyWordsRemaining);
  setDynamicText('defense-enemy-count', state.defense.enemies.length);
  animateHundredProgress(state);
  updateDynamicDefensePanel(state);
}

function updateDynamicDefensePanel(state: GameState): void {
  if (!rootElement || !isBookPanelOpen(state, 'defense')) {
    return;
  }

  const healthFill = rootElement.querySelector<HTMLElement>('.defense-health i');
  if (healthFill) {
    healthFill.style.width = `${Math.max(0, Math.min(100, state.defense.towerHealth * 10))}%`;
  }

  const waveFill = rootElement.querySelector<HTMLElement>('.defense-wave i');
  if (waveFill) {
    waveFill.style.width = `${Math.round(defenseWaveProgress(state) * 100)}%`;
  }

  const actorsLayer = rootElement.querySelector<HTMLElement>('.defense-actors');
  if (!actorsLayer) {
    return;
  }

  const liveEnemyIds = new Set<string>();
  for (const enemy of state.defense.enemies) {
    const enemyId = String(enemy.id);
    liveEnemyIds.add(enemyId);
    let enemyElement = actorsLayer.querySelector<HTMLElement>(`.defense-enemy[data-enemy-id="${enemyId}"]`);
    if (!enemyElement) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseEnemyMarkup(enemy));
      enemyElement = actorsLayer.querySelector<HTMLElement>(`.defense-enemy[data-enemy-id="${enemyId}"]`);
    }

    if (enemyElement) {
      const position = defenseEnemyPosition(enemy);
      const health = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));
      enemyElement.style.setProperty('--enemy-x', `${position.x}%`);
      enemyElement.style.setProperty('--enemy-y', `${position.y}%`);
      enemyElement.style.setProperty('--enemy-health', `${health}%`);
    }
  }

  actorsLayer.querySelectorAll<HTMLElement>('.defense-enemy').forEach((enemyElement) => {
    const enemyId = enemyElement.dataset.enemyId;
    if (!enemyId || !liveEnemyIds.has(enemyId)) {
      enemyElement.remove();
    }
  });

  const currentShot = actorsLayer.querySelector<SVGSVGElement>('.defense-shot');
  if (!state.defense.shot) {
    currentShot?.remove();
    return;
  }

  if (currentShot?.dataset.shotId === String(state.defense.shot.id)) {
    return;
  }

  currentShot?.remove();
  actorsLayer.insertAdjacentHTML('afterbegin', defenseShotMarkup(state.defense));
}

function animateHundredProgress(state: GameState): void {
  const progressElement = rootElement?.querySelector<HTMLElement>('.hundred-progress');
  const fillElement = progressElement?.querySelector<HTMLElement>('i');
  if (!progressElement || !fillElement || !isBookPanelOpen(state, 'hundred')) {
    lastHundredDisplayedProgress = 0;
    activeHundredProgressTarget = null;
    pendingHundredProgressAnimationMarker = '';
    if (hundredProgressSettleTimeout !== null) {
      window.clearTimeout(hundredProgressSettleTimeout);
      hundredProgressSettleTimeout = null;
    }
    return;
  }

  const targetMax = hundredTargetMax(state.books.hundred.level);
  const targetProgress = Math.min(100, (state.hundred.total / targetMax) * 100);
  const progressMarker = progressElement.dataset.progressMarker ?? '';

  const runningAnimations = fillElement.getAnimations().filter((animation) => animation.playState === 'running');
  if (activeHundredProgressTarget !== null && Math.abs(activeHundredProgressTarget - targetProgress) < 0.01) {
    if (runningAnimations.length > 0) {
      return;
    }
    activeHundredProgressTarget = null;
  }

  const progressWidth = progressElement.getBoundingClientRect().width;
  const fillWidth = fillElement.getBoundingClientRect().width;
  const inlineProgress = Number.parseFloat(fillElement.style.width);
  const startProgress =
    runningAnimations.length > 0 && progressWidth > 0
      ? Math.min(100, Math.max(0, (fillWidth / progressWidth) * 100))
      : Number.isFinite(inlineProgress)
        ? inlineProgress
      : lastHundredDisplayedProgress;
  const chargeDuration = targetProgress >= startProgress ? 920 : 420;
  progressElement.style.setProperty('--hundred-charge-duration', `${chargeDuration}ms`);

  if (Math.abs(targetProgress - startProgress) < 0.1) {
    fillElement.style.width = `${targetProgress}%`;
    lastHundredDisplayedProgress = targetProgress;
    lastHundredProgressAnimationMarker = progressMarker;
    pendingHundredProgressAnimationMarker = '';
    return;
  }

  fillElement.getAnimations().forEach((animation) => animation.cancel());
  fillElement.style.width = `${targetProgress}%`;
  activeHundredProgressTarget = targetProgress;
  settleHundredProgressAnimation(progressMarker, targetProgress, chargeDuration);
  const shakeDistance = 0.35 + targetProgress * 0.018;
  progressElement.getAnimations().forEach((animation) => animation.cancel());
  progressElement.animate(
    [
      { transform: 'translateX(0)' },
      { transform: `translateX(${-shakeDistance}px)` },
      { transform: `translateX(${shakeDistance}px)` },
      { transform: `translateX(${-shakeDistance * 0.65}px)` },
      { transform: `translateX(${shakeDistance * 0.45}px)` },
      { transform: 'translateX(0)' },
    ],
    {
      duration: 1000,
      easing: 'ease-in-out',
    },
  );
  const animation = fillElement.animate([{ width: `${startProgress}%` }, { width: `${targetProgress}%` }], {
    duration: chargeDuration,
    easing: 'cubic-bezier(0.2, 0.78, 0.16, 1)',
    fill: 'both',
  });
  animation.addEventListener('finish', () => {
    if (activeHundredProgressTarget !== targetProgress) {
      return;
    }
    lastHundredDisplayedProgress = targetProgress;
    activeHundredProgressTarget = null;
    lastHundredProgressAnimationMarker = progressMarker;
    pendingHundredProgressAnimationMarker = '';
    fillElement.style.width = `${targetProgress}%`;
  });
}

function settleHundredProgressAnimation(progressMarker: string, targetProgress: number, chargeDuration: number): void {
  if (pendingHundredProgressAnimationMarker === progressMarker && hundredProgressSettleTimeout !== null) {
    return;
  }
  if (hundredProgressSettleTimeout !== null) {
    window.clearTimeout(hundredProgressSettleTimeout);
  }
  pendingHundredProgressAnimationMarker = progressMarker;
  hundredProgressSettleTimeout = window.setTimeout(() => {
    hundredProgressSettleTimeout = null;
    if (pendingHundredProgressAnimationMarker !== progressMarker) {
      return;
    }
    lastHundredDisplayedProgress = targetProgress;
    lastHundredProgressAnimationMarker = progressMarker;
    pendingHundredProgressAnimationMarker = '';
  }, chargeDuration);
}

function setDynamicText(id: string, value: number): void {
  rootElement?.querySelectorAll<HTMLElement>(`[data-dynamic-value="${id}"]`).forEach((element) => {
    const next = String(value);
    if (element.textContent !== next) {
      element.textContent = next;
    }
  });
}

function stopHudPointerEvent(event: Event): void {
  event.stopPropagation();
}

function blurElement(element: Element | null): void {
  if (element instanceof HTMLElement) {
    element.blur();
  }
}

function openBookMenuFromShortcut(event: KeyboardEvent): void {
  if (event.key.toLowerCase() !== 'w' || event.repeat || event.altKey || event.ctrlKey || event.metaKey || isTypingTarget(event.target)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  blurElement(document.activeElement);
  bookMenuOpen = !bookMenuOpen;
  renderHud(gameStore.snapshot);
}

function installBookMenuOutsideClose(): void {
  if (bookMenuOutsideCloseInstalled) {
    return;
  }
  bookMenuOutsideCloseInstalled = true;
  window.addEventListener('pointerdown', closeBookMenuFromOutside, true);
  window.addEventListener('keydown', openBookMenuFromShortcut, true);
}

function closeBookMenuFromOutside(event: PointerEvent): void {
  if (!bookMenuOpen || pendingBookMenuOutsideClose) {
    return;
  }
  const target = event.target;
  if (target instanceof HTMLElement && target.closest('.book-menu-toggle, .book-menu-drawer')) {
    return;
  }
  pendingBookMenuOutsideClose = true;
  window.setTimeout(() => {
    pendingBookMenuOutsideClose = false;
    if (!bookMenuOpen) {
      return;
    }
    bookMenuOpen = false;
    renderHud(gameStore.snapshot);
  }, 0);
}

function installBookPanelFocus(): void {
  if (!rootElement) {
    return;
  }

  rootElement.querySelectorAll<HTMLElement>('.book-overlay').forEach((panel) => {
    panel.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('[data-action]')) {
        return;
      }
      const bookId = panel.dataset.bookId as BookId | undefined;
      focusBookPanel(bookId);
    });
  });
}

function focusBookPanelFromControl(control: HTMLElement, bookId: BookId | undefined): void {
  if (!control.closest('.book-overlay')) {
    return;
  }
  focusBookPanel(bookId);
}

function focusBookPanel(bookId: BookId | undefined): void {
  if (!bookId || gameStore.snapshot.selectedBook === bookId || !gameStore.snapshot.books[bookId].unlocked) {
    return;
  }
  gameStore.dispatch({ type: 'selectBook', bookId });
}

function suppressPanelClickAfterDrag(event: MouseEvent): void {
  if (performance.now() > suppressNextPanelClickUntil) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function installBookPanelDragging(): void {
  if (!rootElement) {
    return;
  }

  rootElement.querySelectorAll<HTMLElement>('.book-overlay').forEach((panel) => {
    clampRenderedPanel(panel);
    panel.addEventListener('pointerdown', (event) => {
      startBookPanelDrag(event, panel);
    });
  });
}

function beginPanelInteraction(): void {
  activePanelInteractionCount += 1;
}

function endPanelInteraction(): void {
  activePanelInteractionCount = Math.max(0, activePanelInteractionCount - 1);
  if (activePanelInteractionCount === 0) {
    lastRenderSignature = '';
    renderHud(gameStore.snapshot);
  }
}

function startBookPanelDrag(event: PointerEvent, panel: HTMLElement): boolean {
  if (!rootElement || event.button !== 0 || !isBookPanelDragHandle(event, panel)) {
    return false;
  }

  const bookId = panel.dataset.bookId as BookId | undefined;
  if (!bookId) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();

  const rootRect = rootElement.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const currentLeft = panelRect.left - rootRect.left;
  const currentTop = panelRect.top - rootRect.top;
  const offsetX = event.clientX - panelRect.left;
  const offsetY = event.clientY - panelRect.top;
  const pointerId = event.pointerId;

  panel.setPointerCapture(pointerId);
  beginPanelInteraction();
  rootElement.querySelectorAll<HTMLElement>('.book-overlay.is-entering').forEach((openPanel) => {
    openPanel.classList.remove('is-entering');
  });
  focusBookPanel(bookId);
  rootElement.querySelectorAll<HTMLElement>('.book-overlay.is-focused').forEach((openPanel) => {
    openPanel.classList.toggle('is-focused', openPanel === panel);
  });
  panel.classList.add('is-dragging');

  let hasDragged = false;
  const movePanel = (moveEvent: PointerEvent): void => {
    if (moveEvent.pointerId !== pointerId) {
      return;
    }
    moveEvent.preventDefault();
    const movedX = moveEvent.clientX - event.clientX;
    const movedY = moveEvent.clientY - event.clientY;
    if (!hasDragged && Math.hypot(movedX, movedY) < 4) {
      return;
    }
    if (!hasDragged) {
      hasDragged = true;
      panel.classList.add('is-drag-positioned');
      setBookPanelPosition(bookId, panel, currentLeft, currentTop);
    }
    const nextLeft = moveEvent.clientX - rootRect.left - offsetX;
    const nextTop = moveEvent.clientY - rootRect.top - offsetY;
    setBookPanelPosition(bookId, panel, nextLeft, nextTop);
  };

  const stopDrag = (upEvent: PointerEvent): void => {
    if (upEvent.pointerId !== pointerId) {
      return;
    }
    upEvent.preventDefault();
    upEvent.stopPropagation();
    if (hasDragged) {
      suppressNextPanelClickUntil = performance.now() + 240;
    }
    panel.classList.remove('is-dragging');
    if (panel.hasPointerCapture(pointerId)) {
      panel.releasePointerCapture(pointerId);
    }
    window.removeEventListener('pointermove', movePanel, true);
    window.removeEventListener('pointerup', stopDrag, true);
    window.removeEventListener('pointercancel', stopDrag, true);
    endPanelInteraction();
  };

  window.addEventListener('pointermove', movePanel, true);
  window.addEventListener('pointerup', stopDrag, true);
  window.addEventListener('pointercancel', stopDrag, true);
  return true;
}

function isBookPanelDragHandle(event: PointerEvent, panel: HTMLElement): boolean {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.closest('button, .mini-skill-popover, .upgrade-panel')) {
    return false;
  }
  const panelRect = panel.getBoundingClientRect();
  const dragBandHeight = clamp(panelRect.height * 0.18, 64, 112);
  return event.clientY <= panelRect.top + dragBandHeight;
}

function setBookPanelPosition(bookId: BookId, panel: HTMLElement, left: number, top: number): void {
  if (!rootElement) {
    return;
  }

  const rootRect = rootElement.getBoundingClientRect();
  let panelRect = panel.getBoundingClientRect();
  const maxPanelWidth = getBookPanelMaxWidth(rootRect, bookId);
  if (panelRect.width > maxPanelWidth + 1) {
    setBookPanelSize(bookId, panel, maxPanelWidth);
    panelRect = panel.getBoundingClientRect();
  }
  const padding = 8;
  const rawMaxLeft = rootRect.width - panelRect.width - padding;
  const minLeft = rawMaxLeft <= padding ? Math.min(rawMaxLeft, padding - BOOK_PANEL_MIN_HORIZONTAL_TRAVEL) : padding;
  const maxLeft = Math.max(padding, rawMaxLeft);
  const maxTop = Math.max(padding, rootRect.height - panelRect.height - padding);
  const next = {
    left: Math.round(clamp(left, minLeft, maxLeft)),
    top: Math.round(clamp(top, padding, maxTop)),
  };
  bookPanelPositions.set(bookId, next);
  panel.style.setProperty('--panel-left', `${next.left}px`);
  panel.style.setProperty('--panel-top', `${next.top}px`);
}

function setBookPanelSize(bookId: BookId, panel: HTMLElement, width: number): void {
  if (!rootElement) {
    return;
  }

  const rootRect = rootElement.getBoundingClientRect();
  const preferredMinWidth = BOOK_PANEL_SIZE_PRESETS[0].width;
  const maxRatioWidth = getBookPanelMaxWidth(rootRect, bookId);
  const minWidth = Math.min(preferredMinWidth, maxRatioWidth);
  const nextWidth = Math.round(clamp(width, minWidth, maxRatioWidth));
  const next = {
    width: nextWidth,
    height: getBookPanelHeightForWidth(bookId, nextWidth),
  };
  bookPanelSizes.set(bookId, next);
  panel.classList.add('is-resized');
  panel.style.setProperty('--panel-width', `${next.width}px`);
  panel.style.setProperty('--panel-height', `${next.height}px`);
}

function cycleBookPanelSize(bookId: BookId, panel: HTMLElement): void {
  if (!rootElement) {
    return;
  }

  const currentPreset = getBookPanelPreset(bookId);
  const currentIndex = BOOK_PANEL_SIZE_PRESETS.findIndex((preset) => preset.id === currentPreset.id);
  const nextPreset = BOOK_PANEL_SIZE_PRESETS[(currentIndex + 1) % BOOK_PANEL_SIZE_PRESETS.length];
  const rootRect = rootElement.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const currentLeft = panelRect.left - rootRect.left;
  const currentTop = panelRect.top - rootRect.top;

  bookPanelSizePresetIds.set(bookId, nextPreset.id);
  panel.classList.add('is-drag-positioned', 'is-resized');
  setBookPanelPosition(bookId, panel, currentLeft, currentTop);
  setBookPanelSize(bookId, panel, nextPreset.width);
  setBookPanelPosition(bookId, panel, currentLeft, currentTop);
  lastRenderSignature = '';
  renderHud(gameStore.snapshot);
}

function getBookPanelPreset(bookId: BookId): BookPanelSizePreset {
  const presetId = bookPanelSizePresetIds.get(bookId) ?? (isSquareBookPanel(bookId) ? 'large' : 'medium');
  return BOOK_PANEL_SIZE_PRESETS.find((preset) => preset.id === presetId) ?? BOOK_PANEL_SIZE_PRESETS[0];
}

function bookPanelSizeFromPreset(bookId: BookId, preset: BookPanelSizePreset): { width: number; height: number } {
  return {
    width: preset.width,
    height: getBookPanelHeightForWidth(bookId, preset.width),
  };
}

function getBookPanelSize(bookId: BookId): { width: number; height: number } {
  return bookPanelSizes.get(bookId) ?? bookPanelSizeFromPreset(bookId, getBookPanelPreset(bookId));
}

function getBookPanelHeightForWidth(bookId: BookId, width: number): number {
  return Math.round(width / (isSquareBookPanel(bookId) ? 1 : BOOK_PANEL_ASPECT_RATIO));
}

function isSquareBookPanel(bookId: BookId): boolean {
  return bookId === 'serpent' || bookId === 'defense';
}

function getBookPanelMaxWidth(rootRect: DOMRect, bookId?: BookId): number {
  const padding = 8;
  const hardMinWidth = 180;
  const horizontalTravel = Math.min(BOOK_PANEL_MIN_HORIZONTAL_TRAVEL, Math.max(0, rootRect.width - padding * 2 - hardMinWidth));
  const availableWidth = Math.max(hardMinWidth, rootRect.width - padding * 2 - horizontalTravel);
  const panelAspectRatio = bookId && isSquareBookPanel(bookId) ? 1 : BOOK_PANEL_ASPECT_RATIO;
  const availableHeight = Math.max(hardMinWidth / panelAspectRatio, rootRect.height - padding * 2);
  return Math.max(hardMinWidth, Math.min(availableWidth, availableHeight * panelAspectRatio));
}

function clampRenderedPanel(panel: HTMLElement): void {
  const bookId = panel.dataset.bookId as BookId | undefined;
  const position = bookId ? bookPanelPositions.get(bookId) : undefined;
  const size = bookId ? bookPanelSizes.get(bookId) : undefined;
  if (!bookId) {
    return;
  }
  if (size) {
    setBookPanelSize(bookId, panel, size.width);
  }
  if (position) {
    setBookPanelPosition(bookId, panel, position.left, position.top);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function bookOverlay(
  bookId: BookId,
  slot: BookPanelSlot,
  state: GameState,
  shouldAnimatePage: boolean,
  shouldAnimateUpgradePanel: boolean,
): string {
  const selectedBook = getBook(bookId);
  const isFocused = state.selectedBook === bookId;
  const position = bookPanelPositions.get(bookId);
  const panelSizePreset = getBookPanelPreset(bookId);
  const size = getBookPanelSize(bookId);
  const dragClass = `${position ? ' is-drag-positioned' : ''} is-resized`;
  const panelVars = [
    position ? `--panel-left:${position.left}px; --panel-top:${position.top}px;` : '',
    size ? `--panel-width:${size.width}px; --panel-height:${size.height}px;` : '',
  ].join(' ');
  const dragStyle = panelVars ? ` style="${panelVars}"` : '';
  const isMinimalPage =
    selectedBook.id === 'mana' ||
    selectedBook.id === 'serpent' ||
    selectedBook.id === 'typing' ||
    selectedBook.id === 'defense' ||
    selectedBook.id === 'blackjack' ||
    selectedBook.id === 'hundred' ||
    selectedBook.id === 'targets' ||
    selectedBook.id === 'mine' ||
    selectedBook.id === 'slimeTrainer';
  const hasUpgradeControls = selectedBook.id !== 'typing';
  const isCompactUpgradeOpen = openUpgradePanel === selectedBook.id && upgradePanelMode === 'compact';
  const miniSkillClass = isCompactUpgradeOpen ? ' has-mini-skills' : '';
  return `
    <section class="book-overlay panel-slot-${slot} ${isFocused ? 'is-focused' : ''} ${shouldAnimatePage ? 'is-entering' : ''}${miniSkillClass}${dragClass}"${dragStyle} data-book-id="${selectedBook.id}" aria-label="${selectedBook.name}">
      <button class="book-panel-close" data-action="closeBookPanel" data-book-id="${selectedBook.id}" title="Fermer le panneau">×</button>
      <header class="book-page-header ${isMinimalPage ? 'is-minimal' : ''}${miniSkillClass}">
        ${hasUpgradeControls ? `<button class="book-upgrade-tile ${openUpgradePanel === selectedBook.id ? 'is-open' : ''}" data-action="toggleUpgradePanel" data-book-id="${selectedBook.id}" title="Upgrade">
          ▲
        </button>
        <button class="upgrade-compact-tile ${isCompactUpgradeOpen ? 'is-open' : ''}" data-action="toggleCompactUpgradePanel" data-book-id="${selectedBook.id}" title="Ameliorations compactes">${isCompactUpgradeOpen ? '◀' : '▶'}</button>
        ${isCompactUpgradeOpen ? compactUpgradePopover(selectedBook.id, state, shouldAnimateUpgradePanel) : ''}` : ''}
        ${isMinimalPage ? '' : `<div class="book-page-title">
          <p>${selectedBook.name}</p>
          <span>${selectedBook.subtitle}</span>
        </div>`}
      </header>
      <div class="book-page-body">
        ${
          selectedBook.id === 'mana'
            ? manaPanel(state)
            : selectedBook.id === 'serpent'
              ? snakePanel(state)
              : selectedBook.id === 'typing'
                ? typingPanel(state)
                : selectedBook.id === 'defense'
                  ? defensePanel(state)
                  : selectedBook.id === 'blackjack'
                    ? blackjackPanel(state)
                    : selectedBook.id === 'hundred'
                      ? hundredPanel(state)
                      : selectedBook.id === 'targets'
                        ? targetPanel(state)
                        : selectedBook.id === 'mine'
                          ? miningPanel(state)
                          : selectedBook.id === 'slimeTrainer'
                            ? slimeTrainerPanel(state)
                        : placeholderPanel()
        }
      </div>
      ${hasUpgradeControls && openUpgradePanel === selectedBook.id && upgradePanelMode === 'detail' ? upgradePanel(selectedBook.id, state, shouldAnimateUpgradePanel, upgradePanelMode) : ''}
      ${isMinimalPage ? '' : `
        <footer class="book-page-actions">
          <button class="primary-action" data-action="chargeMana" data-book-id="${selectedBook.id}">
            Activer
          </button>
        </footer>
      `}
      <button class="book-panel-size" data-action="cycleBookPanelSize" data-book-id="${selectedBook.id}" title="Taille du panneau: ${panelSizePreset.label}" aria-label="Changer la taille du panneau">${panelSizePreset.label}</button>
    </section>
  `;
}

function createHudSignature(state: GameState): string {
  const bookState = books
    .map((book) => {
      const current = state.books[book.id];
      return [
        book.id,
        current.level,
        current.automation.toFixed(2),
        current.pinned ? 1 : 0,
        current.unlocked ? 1 : 0,
      ].join(':');
    })
    .join('|');
  const manaSkills = state.manaSkills;
  const snakeSkills = state.snakeSkills;
  const typing = state.runeTyping;
  const blackjack = state.blackjack;
  const blackjackSkills = state.blackjackSkills;
  const hundred = state.hundred;
  const targetState = state.targets;
  const targetSkills = state.targetSkills;
  const mining = state.mining;
  const miningSkills = state.miningSkills;
  const slimeTrainer = state.slimeTrainer;

  return [
    state.selectedBook,
    bookMenuOpen ? 'book-menu-open' : 'book-menu-closed',
    state.openBookPanels.map((panel) => `${panel.bookId}:${panel.slot}`).join('|'),
    openUpgradePanel ?? 'none',
    upgradePanelMode,
    state.snake.score,
    state.snake.best,
    state.snake.comboSteps,
    state.snake.direction,
    state.snake.nextDirection,
    state.snake.food.x,
    state.snake.food.y,
    state.snake.bonusFood?.type ?? 'none',
    state.snake.bonusFood?.cell.x ?? -1,
    state.snake.bonusFood?.cell.y ?? -1,
    state.snake.extraLivesUsed,
    state.snake.invincibleTimer.toFixed(1),
    state.snake.body.map((cell) => `${cell.x},${cell.y}`).join(';'),
    state.defense.wave,
    state.defense.towerHealth,
    state.defense.score,
    state.defense.best,
    state.defense.lastReward,
    blackjack.phase,
    blackjack.round,
    blackjack.playerRerollsUsed,
    blackjack.dealerRerollsUsed,
    blackjack.dealerCardRevealed ? 1 : 0,
    blackjack.lastReward,
    blackjack.lastOutcome,
    blackjack.playerHand.map(blackjackCardLabel).join(','),
    blackjack.dealerHand.map(blackjackCardLabel).join(','),
    blackjackSkills.rerollPlayer,
    blackjackSkills.rerollDealer,
    blackjackSkills.revealDealer,
    blackjackSkills.aceBias,
    hundred.total,
    hundred.attempts,
    hundred.wins,
    hundred.bestTotal,
    hundred.lastRoll,
    hundred.lastOption ?? 'none',
    hundred.lastReward,
    hundred.lastOutcome,
    targetState.score,
    targetState.best,
    targetState.lastReward,
    targetState.shotPulse,
    targetState.targets.map((target) => `${target.id},${target.x},${target.y},${target.health}`).join(';'),
    mining.totalMined,
    mining.deepestLayer,
    mining.lastReward,
    mining.lastBrokenDepth,
    mining.hitPulse,
    mining.blocks.map((block) => `${block.id},${block.depth},${block.health},${block.lastHit}`).join(';'),
    slimeTrainer.level,
    slimeTrainer.xp,
    slimeTrainer.victories,
    slimeTrainer.enemy.id,
    slimeTrainer.enemy.health,
    slimeTrainer.enemy.maxHealth,
    slimeTrainer.turn,
    slimeTrainer.enemyTurnTimer.toFixed(2),
    slimeTrainer.slimeHealth,
    slimeTrainer.slimeMaxHealth,
    slimeTrainer.lastCommand ?? 'none',
    slimeTrainer.lastDamage,
    slimeTrainer.lastEnemyDamage,
    slimeTrainer.lastReward,
    slimeTrainer.lastXp,
    slimeTrainer.lastOutcome,
    slimeTrainer.hitPulse,
    typing.wordIndex,
    typing.typed,
    typing.completedWords,
    typing.combo,
    typing.penaltyWordsRemaining,
    typing.currentWordHadMistake ? 1 : 0,
    typing.lastReward,
    typing.lastFeedback,
    manaSkills.power,
    manaSkills.automation,
    manaSkills.criticalHit,
    manaSkills.criticalEffect,
    manaSkills.extraWands,
    snakeSkills.speed,
    snakeSkills.gridSize,
    snakeSkills.automation,
    snakeSkills.automationEnabled ? 1 : 0,
    snakeSkills.baseMultiplier,
    snakeSkills.bonusFruit,
    snakeSkills.extraLife,
    snakeSkills.edgeWrap,
    targetSkills.spawnSpeed,
    targetSkills.targetCount,
    targetSkills.damage,
    targetSkills.automation,
    miningSkills.pickaxeForce,
    miningSkills.splashDamage,
    miningSkills.automation,
    miningSkills.autoDigCount,
    bookState,
  ].join('/');
}

function upgradePanel(bookId: BookId, state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (bookId === 'mana') {
    return manaUpgradePanel(state, shouldAnimate, mode);
  }
  if (bookId === 'serpent') {
    return snakeUpgradePanel(state, shouldAnimate, mode);
  }
  if (bookId === 'targets') {
    return targetUpgradePanel(state, shouldAnimate, mode);
  }
  if (bookId === 'mine') {
    return miningUpgradePanel(state, shouldAnimate, mode);
  }
  if (bookId === 'blackjack') {
    return blackjackUpgradePanel(state, shouldAnimate, mode);
  }

  const book = state.books[bookId];
  const definition = getBook(bookId);
  const resourceLabel = definition.resourceName ? ` + ${upgradeResourceCost(bookId, state)} ${definition.resourceName}` : '';
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Ameliorations">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="${bookId}" title="Fermer">×</button>
        <div class="compact-upgrade-grid">
          <button class="compact-upgrade-entry" data-action="buyUpgrade" data-book-id="${bookId}" title="Puissance">
            <span>▲</span><strong>${book.level}</strong>
          </button>
          <div class="compact-upgrade-entry" title="Automatisation">
            <span>⏱</span><strong>${book.automation > 0 ? 1 : 0}</strong>
          </div>
          <div class="compact-upgrade-entry" title="Resonance">
            <span>✦</span><strong>${Math.max(0, book.level - 3)}</strong>
          </div>
        </div>
      </section>
    `;
  }
  return `
    <section class="upgrade-panel ${shouldAnimate ? 'is-entering' : ''}" aria-label="Ameliorations">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="${bookId}" title="Fermer">×</button>
      <div class="upgrade-panel-grid">
        <button class="upgrade-entry is-primary" data-action="buyUpgrade" data-book-id="${bookId}">
          <strong>Puissance</strong>
          <span>Lv ${book.level}</span>
          <small>${upgradeManaCost(bookId, state)} Mana${resourceLabel}</small>
        </button>
        <div class="upgrade-entry">
          <strong>Automatisation</strong>
          <span>${book.automation > 0 ? 'Active' : 'Lv 2'}</span>
          <small>Se debloque avec Puissance</small>
        </div>
        <div class="upgrade-entry">
          <strong>Resonance</strong>
          <span>Lv ${Math.max(0, book.level - 3)}</span>
          <small>Bonus a partir du Lv 4</small>
        </div>
      </div>
    </section>
  `;
}

function compactUpgradePopover(bookId: BookId, state: GameState, shouldAnimate: boolean): string {
  if (bookId === 'mana') {
    return `
      <div class="mini-skill-popover ${shouldAnimate ? 'is-entering' : ''}" aria-label="Mini competences de mana">
        <div class="mini-skill-scroll is-mana">
          ${manaSkillCompactButton(state, 'power', '▲')}
          ${manaSkillCompactButton(state, 'automation', '⌁')}
          ${manaSkillCompactButton(state, 'criticalHit', '◇')}
          ${manaSkillCompactButton(state, 'criticalEffect', '✦')}
          ${manaSkillCompactButton(state, 'extraWands', '✧')}
        </div>
      </div>
    `;
  }
  if (bookId === 'serpent') {
    return `
      <div class="mini-skill-popover ${shouldAnimate ? 'is-entering' : ''}" aria-label="Mini competences du serpent">
        <div class="mini-skill-scroll is-mana">
          ${snakeSkillCompactButton(state, 'speed', '↯')}
          ${snakeSkillCompactButton(state, 'gridSize', '▦')}
          ${snakeSkillCompactButton(state, 'automation', '⌁')}
          ${snakeSkillCompactButton(state, 'baseMultiplier', '×')}
          ${snakeSkillCompactButton(state, 'bonusFruit', '●')}
          ${snakeSkillCompactButton(state, 'extraLife', '♡')}
          ${snakeSkillCompactButton(state, 'edgeWrap', '⇄')}
        </div>
      </div>
    `;
  }
  if (bookId === 'targets') {
    return `
      <div class="mini-skill-popover ${shouldAnimate ? 'is-entering' : ''}" aria-label="Mini competences des cibles">
        <div class="mini-skill-scroll is-mana">
          ${targetSkillCompactButton(state, 'spawnSpeed', '↯')}
          ${targetSkillCompactButton(state, 'targetCount', '◎')}
          ${targetSkillCompactButton(state, 'damage', '▲')}
          ${targetSkillCompactButton(state, 'automation', '⌁')}
        </div>
      </div>
    `;
  }
  if (bookId === 'mine') {
    return `
      <div class="mini-skill-popover ${shouldAnimate ? 'is-entering' : ''}" aria-label="Mini competences de mine">
        <div class="mini-skill-scroll is-mana">
          ${miningSkillCompactButton(state, 'pickaxeForce', '▲')}
          ${miningSkillCompactButton(state, 'splashDamage', '✣')}
          ${miningSkillCompactButton(state, 'automation', '⌁')}
        </div>
      </div>
    `;
  }
  if (bookId === 'blackjack') {
    return `
      <div class="mini-skill-popover ${shouldAnimate ? 'is-entering' : ''}" aria-label="Mini competences blackjack">
        <div class="mini-skill-scroll is-mana">
          ${blackjackSkillCompactButton(state, 'rerollPlayer', 'R', 'Reroll joueur')}
          ${blackjackSkillCompactButton(state, 'rerollDealer', 'D', 'Reroll croupier')}
          ${blackjackSkillCompactButton(state, 'revealDealer', '?', 'Carte revelee')}
          ${blackjackSkillCompactButton(state, 'aceBias', 'A', 'Plus d As')}
        </div>
      </div>
    `;
  }

  const book = state.books[bookId];
  return `
    <div class="mini-skill-popover ${shouldAnimate ? 'is-entering' : ''}" aria-label="Mini ameliorations">
      <div class="mini-skill-scroll">
        <button class="compact-upgrade-entry" data-action="buyUpgrade" data-book-id="${bookId}" title="Puissance">
          <span>▲</span><strong>${book.level}</strong>
        </button>
        <div class="compact-upgrade-entry" title="Automatisation">
          <span>⌁</span><strong>${book.automation > 0 ? 1 : 0}</strong>
        </div>
        <div class="compact-upgrade-entry" title="Resonance">
          <span>✦</span><strong>${Math.max(0, book.level - 3)}</strong>
        </div>
      </div>
    </div>
  `;
}

function snakeUpgradePanel(state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences du serpent">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="serpent" title="Fermer">×</button>
        <div class="compact-upgrade-grid is-mana">
          ${snakeSkillCompactButton(state, 'speed', '↯')}
          ${snakeSkillCompactButton(state, 'gridSize', '▦')}
          ${snakeSkillCompactButton(state, 'automation', '⌁')}
          ${snakeSkillCompactButton(state, 'baseMultiplier', '×')}
          ${snakeSkillCompactButton(state, 'bonusFruit', '●')}
          ${snakeSkillCompactButton(state, 'extraLife', '♡')}
          ${snakeSkillCompactButton(state, 'edgeWrap', '⇄')}
        </div>
      </section>
    `;
  }

  return `
    <section class="upgrade-panel is-mana-skills ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences du serpent">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="serpent" title="Fermer">×</button>
      <div class="mana-skill-grid">
        ${snakeSkillButton(state, 'speed', 'Vitesse', `${snakeMoveInterval(state).toFixed(2)}s/case`, '-0.022s par niveau, cap 0.10s')}
        ${snakeSkillButton(state, 'gridSize', 'Taille grille', `${snakeGridSize(state)}x${snakeGridSize(state)}`, '+1 case par axe, max 9x9')}
        ${snakeSkillButton(state, 'automation', 'Automatisation', snakeAutomationActive(state) ? 'Active' : 'Off', 'Assistance de direction bornee')}
        ${snakeSkillButton(state, 'baseMultiplier', 'Base multi', `x${snakeBaseMultiplier(state).toFixed(1)}`, 'Monte par +0.1 jusqu a x5')}
        ${snakeSkillButton(state, 'bonusFruit', 'Fruits bonus', snakeBonusFruitLabel(state), 'Orange, poire, banane')}
        ${snakeSkillButton(state, 'extraLife', 'Vie sup.', `${state.snakeSkills.extraLife}`, 'Collision absorbee puis invincible')}
        ${snakeSkillButton(state, 'edgeWrap', 'Traverse bord', state.snakeSkills.edgeWrap > 0 ? 'On' : 'Off', 'Sortir revient cote oppose')}
      </div>
    </section>
  `;
}

function snakeSkillButton(
  state: GameState,
  skillId: SnakeSkillId,
  label: string,
  value: string,
  detail: string,
): string {
  const level = state.snakeSkills[skillId];
  const maxLevel = snakeSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = snakeSkillCost(state, skillId);
  return `
    <button class="mana-skill-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buySnakeSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <strong>${label}</strong>
      <span>Lv ${level}/${maxLevel}</span>
      <em>${value}</em>
      <small>${isMaxed ? 'MAX' : `${cost} Mana`} · ${detail}</small>
    </button>
  `;
}

function snakeSkillCompactButton(state: GameState, skillId: SnakeSkillId, icon: string): string {
  const level = state.snakeSkills[skillId];
  const maxLevel = snakeSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  return `
    <button class="compact-upgrade-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buySnakeSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <span>${icon}</span><strong>${level}</strong>
    </button>
  `;
}

function targetUpgradePanel(state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences des cibles">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="targets" title="Fermer">×</button>
        <div class="compact-upgrade-grid is-mana">
          ${targetSkillCompactButton(state, 'spawnSpeed', '↯')}
          ${targetSkillCompactButton(state, 'targetCount', '◎')}
          ${targetSkillCompactButton(state, 'damage', '▲')}
          ${targetSkillCompactButton(state, 'automation', '⌁')}
        </div>
      </section>
    `;
  }

  return `
    <section class="upgrade-panel is-mana-skills ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences des cibles">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="targets" title="Fermer">×</button>
      <div class="mana-skill-grid">
        ${targetSkillButton(state, 'spawnSpeed', 'Apparition', `${targetSpawnInterval(state.targetSkills.spawnSpeed).toFixed(2)}s`, 'Les cibles arrivent plus vite')}
        ${targetSkillButton(state, 'targetCount', 'Cibles max', `${targetMaxActiveTargets(state.targetSkills.targetCount)}`, 'Plus de cibles en meme temps')}
        ${targetSkillButton(state, 'damage', 'Degats', `${targetAttackDamage(state.targetSkills.damage)}`, 'Chaque clic tape plus fort')}
        ${targetSkillButton(state, 'automation', 'Automatisation', targetAutomationLabel(state), 'Tir automatique sur les cibles')}
      </div>
    </section>
  `;
}

function targetSkillButton(
  state: GameState,
  skillId: TargetSkillId,
  label: string,
  value: string,
  detail: string,
): string {
  const level = state.targetSkills[skillId];
  const maxLevel = targetSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = targetSkillCost(state, skillId);
  return `
    <button class="mana-skill-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyTargetSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <strong>${label}</strong>
      <span>Lv ${level}/${maxLevel}</span>
      <em>${value}</em>
      <small>${isMaxed ? 'MAX' : `${cost} Mana`} · ${detail}</small>
    </button>
  `;
}

function targetSkillCompactButton(state: GameState, skillId: TargetSkillId, icon: string): string {
  const level = state.targetSkills[skillId];
  const maxLevel = targetSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  return `
    <button class="compact-upgrade-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyTargetSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <span>${icon}</span><strong>${level}</strong>
    </button>
  `;
}

function targetAutomationLabel(state: GameState): string {
  const interval = targetAutomationInterval(state.targetSkills.automation);
  return interval > 0 ? `${interval.toFixed(2)}s/tir` : 'Off';
}

function snakeBonusFruitLabel(state: GameState): string {
  if (state.snakeSkills.bonusFruit >= 3) {
    return 'Banane';
  }
  if (state.snakeSkills.bonusFruit >= 2) {
    return 'Poire';
  }
  if (state.snakeSkills.bonusFruit >= 1) {
    return 'Orange';
  }
  return 'Off';
}

function miningUpgradePanel(state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences de mine">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="mine" title="Fermer">×</button>
        <div class="compact-upgrade-grid is-mana">
          ${miningSkillCompactButton(state, 'pickaxeForce', '▲')}
          ${miningSkillCompactButton(state, 'splashDamage', '✣')}
          ${miningSkillCompactButton(state, 'automation', '⌁')}
        </div>
      </section>
    `;
  }

  return `
    <section class="upgrade-panel is-mana-skills ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences de mine">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="mine" title="Fermer">×</button>
      <div class="mana-skill-grid">
        ${miningSkillButton(state, 'pickaxeForce', 'Force de pioche', `${miningPickaxeDamage(state)} degats`, '+1 degat par niveau')}
        ${miningSkillButton(state, 'splashDamage', 'Splash', `${miningSplashDamage(state)} voisin`, 'Tape les blocs adjacents')}
        ${miningSkillButton(state, 'automation', 'Automatisation', miningAutomationLabel(state), 'Creuse le bloc le plus fragile')}
      </div>
    </section>
  `;
}

function miningSkillButton(
  state: GameState,
  skillId: MiningSkillId,
  label: string,
  value: string,
  detail: string,
): string {
  const level = state.miningSkills[skillId];
  const maxLevel = miningSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = miningSkillCost(state, skillId);
  return `
    <button class="mana-skill-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyMiningSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <strong>${label}</strong>
      <span>Lv ${level}/${maxLevel}</span>
      <em>${value}</em>
      <small>${isMaxed ? 'MAX' : `${cost} Mana`} · ${detail}</small>
    </button>
  `;
}

function miningSkillCompactButton(state: GameState, skillId: MiningSkillId, icon: string): string {
  const level = state.miningSkills[skillId];
  const maxLevel = miningSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  return `
    <button class="compact-upgrade-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyMiningSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <span>${icon}</span><strong>${level}</strong>
    </button>
  `;
}

function miningAutomationLabel(state: GameState): string {
  if (state.miningSkills.automation <= 0) {
    return 'Off';
  }
  return `${miningAutomationInterval(state.miningSkills.automation).toFixed(1)}s`;
}

function blackjackPlayerRerollsRemaining(state: GameState): number {
  return Math.max(0, state.blackjackSkills.rerollPlayer - state.blackjack.playerRerollsUsed);
}

function blackjackDealerRerollsRemaining(state: GameState): number {
  return Math.max(0, state.blackjackSkills.rerollDealer - state.blackjack.dealerRerollsUsed);
}

function blackjackUpgradePanel(state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences blackjack">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="blackjack" title="Fermer">×</button>
        <div class="compact-upgrade-grid is-blackjack">
          ${blackjackSkillCompactButton(state, 'rerollPlayer', 'R', 'Reroll joueur')}
          ${blackjackSkillCompactButton(state, 'rerollDealer', 'D', 'Reroll croupier')}
          ${blackjackSkillCompactButton(state, 'revealDealer', '?', 'Carte revelee')}
          ${blackjackSkillCompactButton(state, 'aceBias', 'A', 'Plus d As')}
        </div>
      </section>
    `;
  }

  return `
    <section class="upgrade-panel is-mana-skills ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences blackjack">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="blackjack" title="Fermer">×</button>
      <div class="mana-skill-grid is-blackjack">
        ${blackjackSkillButton(state, 'rerollPlayer', 'Reroll joueur', `${blackjackPlayerRerollsRemaining(state)} relance`, 'Relance la derniere carte joueur.')}
        ${blackjackSkillButton(state, 'rerollDealer', 'Reroll croupier', `${blackjackDealerRerollsRemaining(state)} relance`, 'Relance une carte du croupier.')}
        ${blackjackSkillButton(state, 'revealDealer', 'Carte revelee', state.blackjackSkills.revealDealer > 0 ? 'Passif' : 'Cachee', 'Revele automatiquement la carte cachee du croupier.')}
        ${blackjackSkillButton(state, 'aceBias', 'Plus d As', `+${Math.round(blackjackAceBiasChance(state) * 100)}%`, 'Augmente nos chances de piocher des As.')}
      </div>
    </section>
  `;
}

function blackjackSkillButton(
  state: GameState,
  skillId: BlackjackSkillId,
  label: string,
  value: string,
  detail: string,
): string {
  const level = state.blackjackSkills[skillId];
  const maxLevel = blackjackSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = blackjackSkillCost(state, skillId);
  return `
    <button class="mana-skill-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyBlackjackSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <strong>${label}</strong>
      <span>Lv ${level}/${maxLevel}</span>
      <em>${value}</em>
      <small>${isMaxed ? 'MAX' : `${cost} Jetons`} · ${detail}</small>
    </button>
  `;
}

function blackjackSkillCompactButton(state: GameState, skillId: BlackjackSkillId, icon: string, label: string): string {
  const level = state.blackjackSkills[skillId];
  const maxLevel = blackjackSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  return `
    <button class="compact-upgrade-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyBlackjackSkill" data-skill-id="${skillId}" title="${label}" ${isMaxed ? 'disabled' : ''}>
      <span>${icon}</span><strong>${level}</strong>
    </button>
  `;
}

function manaUpgradePanel(state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences de mana">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="mana" title="Fermer">×</button>
        <div class="compact-upgrade-grid is-mana">
          ${manaSkillCompactButton(state, 'power', '▲')}
          ${manaSkillCompactButton(state, 'automation', '⏱')}
          ${manaSkillCompactButton(state, 'criticalHit', '◇')}
          ${manaSkillCompactButton(state, 'criticalEffect', '✦')}
          ${manaSkillCompactButton(state, 'extraWands', '⌁')}
        </div>
      </section>
    `;
  }

  return `
    <section class="upgrade-panel is-mana-skills ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences de mana">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="mana" title="Fermer">×</button>
      <div class="mana-skill-grid">
        ${manaSkillButton(state, 'power', 'Puissance', `+${state.manaSkills.power} par clic`, '+1 mana par niveau')}
        ${manaSkillButton(state, 'automation', 'Automatisation', automationLabel(state), automationDetail(state))}
        ${manaSkillButton(state, 'criticalHit', 'Critical hit', `${state.manaSkills.criticalHit}%`, '1% par niveau, max 20%')}
        ${manaSkillButton(state, 'criticalEffect', 'Critical effect', `x${manaCriticalMultiplier(state).toFixed(1)}`, 'Critique plus violent, max x6')}
        ${manaSkillButton(state, 'extraWands', 'Plus de baguette', `${manaWandCount(state) || 0}/10`, 'Max 10 baguettes ensemble')}
      </div>
    </section>
  `;
}

function manaSkillButton(
  state: GameState,
  skillId: ManaSkillId,
  label: string,
  value: string,
  detail: string,
): string {
  const level = state.manaSkills[skillId];
  const maxLevel = manaSkillMaxLevel(skillId);
  const isMaxed = maxLevel !== null && level >= maxLevel;
  const cost = manaSkillCost(state, skillId);
  return `
    <button class="mana-skill-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyManaSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <strong>${label}</strong>
      <span>Lv ${level}${maxLevel === null ? '' : `/${maxLevel}`}</span>
      <em>${value}</em>
      <small>${isMaxed ? 'MAX' : `${cost} Mana`} · ${detail}</small>
    </button>
  `;
}

function manaSkillCompactButton(state: GameState, skillId: ManaSkillId, icon: string): string {
  const level = state.manaSkills[skillId];
  const maxLevel = manaSkillMaxLevel(skillId);
  const isMaxed = maxLevel !== null && level >= maxLevel;
  return `
    <button class="compact-upgrade-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyManaSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <span>${icon}</span><strong>${level}</strong>
    </button>
  `;
}

function automationLabel(state: GameState): string {
  if (state.manaSkills.automation <= 0) {
    return 'Off';
  }
  return `${manaWandCount(state)} clic${manaWandCount(state) > 1 ? 's' : ''}/${manaAutomationInterval(state.manaSkills.automation).toFixed(1)}s`;
}

function automationDetail(state: GameState): string {
  if (state.manaSkills.automation <= 0) {
    return 'Debloque 1 baguette toutes les 5s';
  }
  return '-0.1s par niveau';
}

function resourceRow(resourceId: string, icon: string, label: string, value: number, color: string): string {
  return `
    <div class="resource-row" data-resource="${resourceId}">
      <span style="color:${color}">${icon}</span>
      <strong data-dynamic-value="${resourceId}">${Math.floor(value)}</strong>
      <small>${label}</small>
    </div>
  `;
}

function manaPanel(state: GameState): string {
  const wandCount = manaWandCount(state);
  const wandIndexes = Array.from({ length: wandCount }, (_, index) => index);
  return `
    <div class="mana-panel">
      <div class="magic-wands" aria-hidden="true">
        ${wandIndexes.map((index) => `<span class="magic-wand wand-${index + 1}"><i></i></span>`).join('')}
      </div>
      <button class="mana-orb" data-action="chargeMana" data-book-id="mana" title="Concentrer la Mana" aria-label="Concentrer la Mana">
        <span class="mana-orb-aura"></span>
        <span class="mana-sprite" aria-hidden="true"></span>
      </button>
    </div>
  `;
}

function typingPanel(state: GameState): string {
  const word = runeTypingCurrentWord(state);
  const typedLength = state.runeTyping.typed.length;
  const progress = Math.round((typedLength / word.length) * 100);
  const letters = [...word]
    .map((letter, index) => {
      const className = index < typedLength ? 'is-typed' : index === typedLength ? 'is-active' : '';
      return `<span class="typing-stone ${className}" aria-hidden="true">${letter}</span>`;
    })
    .join('');
  return `
    <div class="typing-panel">
      <div class="typing-focus is-${state.runeTyping.lastFeedback}">
        <span class="typing-rune-halo" aria-hidden="true"></span>
        <div class="typing-word" aria-label="${word}">
          ${letters}
        </div>
        <div class="typing-progress" aria-hidden="true">
          <i style="width:${progress}%"></i>
        </div>
        <div class="typing-mini-stats" aria-label="Rune typing state">
          <span>✦ <strong data-dynamic-value="typing-reward">${runeTypingRewardPreview(state)}</strong></span>
          <span>◇ <strong data-dynamic-value="typing-combo">${state.runeTyping.combo}</strong></span>
          <span>⌁ <strong data-dynamic-value="typing-penalty">${state.runeTyping.penaltyWordsRemaining}</strong></span>
        </div>
      </div>
    </div>
  `;
}

function showCrystalClickEffect(amount: number): void {
  const manaOrb = rootElement?.querySelector<HTMLButtonElement>('.mana-orb');
  if (!manaOrb) {
    return;
  }

  manaOrb.classList.remove('is-clicked');
  void manaOrb.offsetWidth;
  manaOrb.classList.add('is-clicked');
  const clickToken = String(performance.now());
  manaOrb.dataset.clickToken = clickToken;
  window.setTimeout(() => {
    if (manaOrb.dataset.clickToken === clickToken) {
      manaOrb.classList.remove('is-clicked');
    }
  }, 1000);

  const sparkCount = manaSparkCount(amount);
  for (let index = 0; index < sparkCount; index += 1) {
    const shard = document.createElement('i');
    const angle = (index / sparkCount) * 360 + (index % 2) * 12;
    const distance = 34 + Math.min(78, amount * 2.2) + (index % 4) * 8;
    const size = Math.min(13, 4 + amount * 0.22 + (index % 3) * 2);
    shard.className = 'mana-spark';
    shard.style.setProperty('--spark-x', `${Math.cos((angle * Math.PI) / 180) * distance}px`);
    shard.style.setProperty('--spark-y', `${Math.sin((angle * Math.PI) / 180) * distance}px`);
    shard.style.setProperty('--spark-size', `${size}px`);
    shard.style.setProperty('--spark-delay', `${(index % 5) * 18}ms`);
    manaOrb.appendChild(shard);
    shard.addEventListener('animationend', () => shard.remove(), { once: true });
  }
}

function manaSparkCount(amount: number): number {
  const gain = Math.max(1, Math.round(amount));
  return Math.min(42, Math.max(2, Math.ceil(Math.sqrt(gain) * 2.2)));
}

function showWandCastEffect(): void {
  const wands = rootElement?.querySelector<HTMLElement>('.magic-wands');
  const manaOrb = rootElement?.querySelector<HTMLButtonElement>('.mana-orb');
  if (!wands || !manaOrb) {
    return;
  }

  wands.classList.remove('is-casting');
  manaOrb.classList.remove('is-wand-hit');
  void wands.offsetWidth;
  wands.classList.add('is-casting');
  manaOrb.classList.add('is-wand-hit');
  wands.addEventListener('animationend', () => wands.classList.remove('is-casting'), { once: true });
  window.setTimeout(() => manaOrb.classList.remove('is-wand-hit'), 760);
}

function showFloatingGain(amount: number, targetSelector = '.mana-orb'): void {
  const gain = Math.max(1, Math.round(amount));
  const pending = pendingFloatingGains.get(targetSelector);
  pendingFloatingGains.set(targetSelector, {
    amount: (pending?.amount ?? 0) + gain,
  });

  if (floatingGainFlushHandle !== null) {
    return;
  }

  floatingGainFlushHandle = window.setTimeout(flushFloatingGains, FLOATING_GAIN_FLUSH_MS);
}

function flushFloatingGains(): void {
  floatingGainFlushHandle = null;

  for (const [targetSelector, pending] of pendingFloatingGains) {
    pendingFloatingGains.delete(targetSelector);
    appendFloatingGain(pending.amount, targetSelector);
  }
}

function appendFloatingGain(amount: number, targetSelector: string): void {
  const target = rootElement?.querySelector<HTMLElement>(targetSelector);
  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const host = document.querySelector<HTMLElement>('#game-shell') ?? document.body;
  const hostRect = host.getBoundingClientRect();
  const { x, y } = floatingGainOffset(rect);
  const pop = document.createElement('span');
  pop.className = 'floating-gain';
  pop.textContent = `+${amount}`;
  pop.style.left = `${rect.left - hostRect.left + rect.width * 0.5 + x}px`;
  pop.style.top = `${rect.top - hostRect.top + rect.height * 0.48 + y}px`;
  host.appendChild(pop);
  pruneFloatingGains(host);
  pop.addEventListener('animationend', () => pop.remove(), { once: true });
}

function pruneFloatingGains(host: HTMLElement | HTMLElementTagNameMap['body']): void {
  const gains = host.querySelectorAll<HTMLElement>('.floating-gain');
  const overflow = gains.length - FLOATING_GAIN_MAX_VISIBLE;
  for (let index = 0; index < overflow; index += 1) {
    gains[index]?.remove();
  }
}

function floatingGainOffset(rect: DOMRect): { x: number; y: number } {
  const radius = Math.min(rect.width, rect.height);
  const angle = Math.random() * Math.PI * 2;
  const distance = radius * (0.12 + Math.random() * 0.24);
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance * 0.72,
  };
}

function snakePanel(state: GameState): string {
  const snake = state.snake;
  const hearts = Array.from({ length: Math.min(3, snakeExtraLivesRemaining(state) + 1) }, () => '<span>♥</span>').join('');
  const canToggleAutomation = state.snakeSkills.automation > 0;
  const automationEnabled = canToggleAutomation && state.snakeSkills.automationEnabled;
  const bodyKeys = new Set(snake.body.map(cellKey));
  const headKey = cellKey(snake.body[0]);
  const foodKey = cellKey(snake.food);
  const bonusFoodKey = snake.bonusFood ? cellKey(snake.bonusFood.cell) : null;
  const snakeSegments = snakeAtlasSegments(snake.body, snake.gridSize, snake.direction, snake.moveFrame ?? 0);
  const cells = Array.from({ length: snake.gridSize * snake.gridSize }, (_, index) => {
    const cell = { x: index % snake.gridSize, y: Math.floor(index / snake.gridSize) };
    const key = cellKey(cell);
    const classNames = ['snake-cell', (cell.x + cell.y) % 2 === 0 ? 'is-light' : 'is-dark'];
    if (key === headKey) {
      classNames.push('is-snake', 'is-head', `is-facing-${snake.direction}`, ...snakeConnectionClasses(cell, snake.body));
    } else if (bodyKeys.has(key)) {
      classNames.push('is-snake', 'is-body', ...snakeConnectionClasses(cell, snake.body));
    }
    if (key === foodKey) {
      classNames.push('is-food');
    }
    if (key === bonusFoodKey && snake.bonusFood) {
      classNames.push('is-bonus-food', `is-${snake.bonusFood.type}`);
    }
    return `<i class="${classNames.join(' ')}"></i>`;
  }).join('');

  return `
    <div class="snake-panel">
      <div class="snake-board-shell">
        <div class="snake-stats" aria-label="Etat du serpent">
          <strong>+${snakeTotalMultiplier(state).toFixed(1).replace('.', ',')}</strong>
          <div class="snake-hearts" aria-label="Vies">${hearts}</div>
          <button
            class="snake-auto-toggle ${automationEnabled ? 'is-on' : 'is-off'}"
            data-action="toggleSnakeAutomation"
            title="Automatisation serpent"
            aria-label="Automatisation serpent"
            aria-pressed="${automationEnabled ? 'true' : 'false'}"
            ${canToggleAutomation ? '' : 'disabled'}
          >⌁</button>
        </div>
        <div class="snake-board has-snake-sprite" style="--snake-grid-size:${snake.gridSize}" role="img" aria-label="Mini jeu Snake du Livre du Serpent">
          <span class="snake-spriterrific-familiar" aria-hidden="true"></span>
          ${cells}
          ${snakeSegments}
        </div>
      </div>
    </div>
  `;
}

function snakeAtlasSegments(body: SnakeCell[], gridSize: number, headDirection: SnakeDirection, moveFrame: number): string {
  return body
    .map((cell, index) => snakeAtlasSegment(body, index, cell, gridSize, headDirection, moveFrame))
    .join('');
}

function snakeAtlasSegment(
  body: SnakeCell[],
  index: number,
  cell: SnakeCell,
  gridSize: number,
  headDirection: SnakeDirection,
  moveFrame: number,
): string {
  const unit = 100 / gridSize;
  const frame = moveFrame % 2 === 0 ? 'a' : 'b';
  const piece = snakeAtlasPiece(body, index, cell, gridSize, headDirection);
  const rotation = piece.kind === 'corner' ? 0 : piece.rotation;
  return `
    <span
      class="snake-atlas-segment is-${piece.kind}"
      style="--segment-x:${cell.x * unit}%; --segment-y:${cell.y * unit}%; --segment-rotation:${rotation}deg; --snake-tile:url('${snakeAtlasTile(piece.tileName, frame)}');"
      aria-hidden="true"
    ></span>
  `;
}

function snakeAtlasPiece(
  body: SnakeCell[],
  index: number,
  cell: SnakeCell,
  gridSize: number,
  headDirection: SnakeDirection,
): { kind: 'head' | 'straight' | 'corner' | 'tail'; rotation: number; tileName: string } {
  if (index === 0) {
    return { kind: 'head', rotation: 0, tileName: `head-${headDirection}` };
  }
  const previous = snakeDistinctNeighbor(body, index, -1);
  const next = snakeDistinctNeighbor(body, index, 1);
  if (!previous) {
    return { kind: 'straight', rotation: snakeDirectionRotation(headDirection), tileName: 'body-straight' };
  }
  const towardHead = snakeDirectionBetween(cell, previous, gridSize);
  if (!next) {
    return { kind: 'tail', rotation: snakeDirectionRotation(towardHead), tileName: 'body-tail' };
  }

  const towardTail = snakeDirectionBetween(cell, next, gridSize);
  if (isOppositeSnakeDirection(towardHead, towardTail)) {
    return { kind: 'straight', rotation: snakeDirectionRotation(towardHead), tileName: 'body-straight' };
  }

  return { kind: 'corner', rotation: 0, tileName: `body-corner-${towardTail}-${towardHead}` };
}

function snakeDistinctNeighbor(body: SnakeCell[], index: number, step: -1 | 1): SnakeCell | undefined {
  const cell = body[index];
  for (let cursor = index + step; cursor >= 0 && cursor < body.length; cursor += step) {
    if (!cellsMatch(cell, body[cursor])) {
      return body[cursor];
    }
  }
  return undefined;
}

function snakeAtlasTile(tileName: string, frame: 'a' | 'b'): string {
  return `/assets/Snake%20dragon/crops/${tileName}-${frame}.png`;
}

function snakeDirectionBetween(cell: SnakeCell, neighbor: SnakeCell, gridSize: number): SnakeDirection {
  if (neighbor.x === (cell.x + 1) % gridSize && neighbor.y === cell.y) {
    return 'right';
  }
  if (neighbor.x === (cell.x - 1 + gridSize) % gridSize && neighbor.y === cell.y) {
    return 'left';
  }
  if (neighbor.y === (cell.y + 1) % gridSize && neighbor.x === cell.x) {
    return 'down';
  }
  if (neighbor.y === (cell.y - 1 + gridSize) % gridSize && neighbor.x === cell.x) {
    return 'up';
  }
  return 'up';
}

function snakeDirectionRotation(direction: SnakeDirection): number {
  switch (direction) {
    case 'right':
      return 0;
    case 'down':
      return 90;
    case 'left':
      return 180;
    case 'up':
      return 270;
  }
}

function isOppositeSnakeDirection(first: SnakeDirection, second: SnakeDirection): boolean {
  return (
    (first === 'left' && second === 'right') ||
    (first === 'right' && second === 'left') ||
    (first === 'up' && second === 'down') ||
    (first === 'down' && second === 'up')
  );
}

function miningPanel(state: GameState): string {
  const blocks = state.mining.blocks
    .map((block) => {
      const health = Math.max(0, Math.round((block.health / block.maxHealth) * 100));
      return `
        <button
          class="mining-block"
          data-action="digMiningBlock"
          data-block-id="${block.id}"
          style="--block-health:${health}%; --block-depth:${Math.min(9, block.depth)}; --block-hit:${block.lastHit % 2}"
          title="Profondeur ${block.depth}, ${block.health}/${block.maxHealth} PV"
          aria-label="Bloc de terre profondeur ${block.depth}, ${block.health} PV sur ${block.maxHealth}"
        >
          <span>${block.depth}</span>
          <i>${block.health}</i>
        </button>
      `;
    })
    .join('');

  return `
    <div class="mining-panel">
      <div class="mining-grid-shell">
        <div class="mining-stats" aria-label="Etat de la mine">
          <span>▰ <strong data-dynamic-value="minerals">${Math.floor(state.resources.minerals)}</strong></span>
          <span>▲ <strong>${miningPickaxeDamage(state)}</strong></span>
          <span>✣ <strong>${miningSplashDamage(state)}</strong></span>
          <span>⌁ <strong>${miningAutomationLabel(state)}</strong></span>
        </div>
        <div class="mining-grid" role="grid" aria-label="Mine des Profondeurs 3 par 5">
          ${blocks}
        </div>
        <div class="mining-depth" aria-label="Profondeur">
          <span>${state.mining.totalMined}</span>
          <strong>${state.mining.deepestLayer}</strong>
        </div>
      </div>
    </div>
  `;
}

function slimeTrainerPanel(state: GameState): string {
  const trainer = state.slimeTrainer;
  const enemyHealth = Math.max(0, Math.round((trainer.enemy.health / trainer.enemy.maxHealth) * 100));
  const slimeHealth = Math.max(0, Math.round((trainer.slimeHealth / trainer.slimeMaxHealth) * 100));
  const xpToNext = slimeTrainerXpToNextLevel(trainer.level);
  const xpProgress = Math.min(100, Math.round((trainer.xp / xpToNext) * 100));
  const outcome = slimeTrainerOutcomeLabel(state);

  return `
    <div class="slime-trainer-panel">
      <div class="slime-battlefield is-${trainer.lastOutcome}" style="--slime-hit:${trainer.hitPulse % 2}" aria-label="Mini jeu Slime Trainer">
        <div class="slime-battle-stats" aria-label="Etat Slime Trainer">
          <span>● <strong data-dynamic-value="gels">${Math.floor(state.resources.gels)}</strong></span>
          <span>Lv <strong>${trainer.level}</strong></span>
          <span>HP <strong>${trainer.slimeHealth}/${trainer.slimeMaxHealth}</strong></span>
          <span>XP <strong>${trainer.xp}/${xpToNext}</strong></span>
        </div>
        <div class="slime-enemy-card" aria-label="${trainer.enemy.name}">
          <strong>${trainer.enemy.name}</strong>
          <span>Lv ${trainer.enemy.level}</span>
          <i><b style="width:${enemyHealth}%"></b></i>
        </div>
        <div class="slime-stage" aria-hidden="true">
          <img class="slime-sprite is-player" src="/assets/spriterrific/slime-trainer/slime/idle/export/spritesheet.png" alt="">
          <img class="slime-sprite is-enemy is-${trainer.enemy.id}" src="${slimeEnemySpritePath(trainer.enemy.id)}" alt="">
          <div class="slime-health-ring is-player-health"><i style="width:${slimeHealth}%"></i></div>
        </div>
        <div class="slime-outcome" aria-live="polite">
          <strong>${outcome.title}</strong>
          <span>${outcome.detail}</span>
        </div>
        <div class="slime-xp-bar" aria-label="Experience du slime"><i style="width:${xpProgress}%"></i></div>
        <div class="slime-enemy-action ${trainer.turn === 'enemy' ? 'is-active' : ''}" aria-label="Tour ennemi">
          <strong>${trainer.enemy.name}</strong>
          <span>${trainer.turn === 'enemy' ? `Prepare ${slimeTrainerEnemyAttackDamage(trainer.enemy, trainer.level)}` : 'Attend'}</span>
        </div>
        <div class="slime-commands">
          ${SLIME_TRAINER_COMMANDS.map((command) => slimeCommandButton(command.id, state)).join('')}
        </div>
      </div>
    </div>
  `;
}

function slimeCommandButton(commandId: SlimeTrainerCommandId, state: GameState): string {
  const command = SLIME_TRAINER_COMMANDS.find((candidate) => candidate.id === commandId);
  if (!command) {
    return '';
  }
  const unlocked = slimeTrainerCommandUnlocked(commandId, state.slimeTrainer.level);
  const canAct = unlocked && state.slimeTrainer.turn === 'player';
  return `
    <button class="slime-command ${unlocked ? 'is-unlocked' : 'is-locked'} ${state.slimeTrainer.turn === 'enemy' ? 'is-waiting' : ''}" data-action="trainSlime" data-command-id="${commandId}" ${canAct ? '' : 'disabled'}>
      <strong>${command.name}</strong>
      <span>${unlocked ? (state.slimeTrainer.turn === 'player' ? `${slimeTrainerCommandDamage(commandId, state.slimeTrainer.level)} degats` : 'Tour ennemi') : `Lv ${command.unlockLevel}`}</span>
    </button>
  `;
}

function slimeTrainerOutcomeLabel(state: GameState): { title: string; detail: string } {
  const trainer = state.slimeTrainer;
  switch (trainer.lastOutcome) {
    case 'hit':
      return { title: `-${trainer.lastDamage}`, detail: `${trainer.enemy.name} encaisse. A lui.` };
    case 'enemyHit':
      return { title: `-${trainer.lastEnemyDamage} HP`, detail: 'Ton slime encaisse. A toi.' };
    case 'locked':
      return { title: 'Verrouille', detail: 'Monte de niveau pour cette commande.' };
    case 'waitingEnemy':
      return { title: 'Tour ennemi', detail: `${trainer.enemy.name} doit attaquer.` };
    case 'victory':
      return { title: 'Victoire', detail: `+${trainer.lastXp} XP, +${trainer.lastReward} Gels` };
    case 'levelUp':
      return { title: 'Niveau +1', detail: `+${trainer.lastXp} XP, commande renforcee.` };
    case 'slimeDown':
      return { title: 'K.O.', detail: `Le slime repart avec ${trainer.slimeHealth} HP.` };
    case 'idle':
      return { title: 'Pret', detail: 'Choisis une commande.' };
  }
}

function slimeEnemySpritePath(enemyId: GameState['slimeTrainer']['enemy']['id']): string {
  switch (enemyId) {
    case 'mossSpine':
      return '/assets/spriterrific/slime-trainer/monsters/moss-spine/export/spritesheet.png';
    case 'dustImp':
      return '/assets/spriterrific/slime-trainer/monsters/dust-imp/export/spritesheet.png';
    case 'inkMite':
      return '/assets/spriterrific/slime-trainer/monsters/ink-mite/export/spritesheet.png';
    case 'thornBlob':
      return '/assets/spriterrific/slime-trainer/monsters/thorn-blob/export/spritesheet.png';
  }
}

function blackjackPanel(state: GameState): string {
  const blackjack = state.blackjack;
  const isPlayerTurn = blackjack.phase === 'player';
  const hasHand = blackjack.playerHand.length > 0;
  const playerValue = blackjackHandValue(blackjack.playerHand);
  const dealerValue = blackjackVisibleDealerValue(state);
  const revealDealer = blackjack.phase !== 'player' || blackjack.dealerCardRevealed || state.blackjackSkills.revealDealer > 0;
  const outcomeClass = `is-${blackjack.phase}`;
  const outcomeText = blackjackOutcomeText(state);
  const twentyOneBannerText = blackjackTwentyOneBannerText(state);
  const dealerHandClass = blackjackHandOutcomeClass(state, 'dealer');
  const playerHandClass = blackjackHandOutcomeClass(state, 'player');
  const playerRerolls = blackjackPlayerRerollsRemaining(state);
  const dealerRerolls = blackjackDealerRerollsRemaining(state);
  const canRerollPlayer = isPlayerTurn && playerRerolls > 0 && blackjack.playerHand.length > 0;
  const canRerollDealer = isPlayerTurn && dealerRerolls > 0 && blackjack.dealerHand.length > 0;
  const previousHands =
    blackjack.round === lastBlackjackRenderedRound ? lastBlackjackRenderedHands : { dealer: [], player: [] };
  const currentHands = {
    dealer: blackjack.dealerHand.map((card) => blackjackCardKey(card, 'dealer')),
    player: blackjack.playerHand.map((card) => blackjackCardKey(card, 'player')),
  };
  const handGrew = {
    dealer: currentHands.dealer.length > previousHands.dealer.length,
    player: currentHands.player.length > previousHands.player.length,
  };
  lastBlackjackRenderedRound = blackjack.round;
  lastBlackjackRenderedHands = currentHands;

  return `
    <div class="blackjack-panel">
      <div class="blackjack-table ${outcomeClass}" aria-label="Mini jeu Table du Blackjack">
        <div class="blackjack-scoreboard" aria-label="Etat blackjack">
          <span>♠ <strong data-dynamic-value="chips">${Math.floor(state.resources.chips)}</strong></span>
          <span>J <strong>${playerValue || '-'}</strong></span>
          <span>D <strong>${dealerValue || '-'}</strong></span>
        </div>
        <div class="blackjack-outcome ${outcomeText ? '' : 'is-visual-result'}" aria-live="polite">${outcomeText}</div>
        ${twentyOneBannerText ? `<div class="blackjack-twenty-one-banner" aria-live="polite">${twentyOneBannerText}</div>` : ''}
        ${
          hasHand
            ? ''
            : `<button class="blackjack-start-button" data-action="dealBlackjack" title="Lancer" aria-label="Lancer le blackjack">Lancer</button>`
        }
        <div class="blackjack-hand is-dealer ${dealerHandClass}" style="--hand-size: ${Math.max(1, blackjack.dealerHand.length)}" aria-label="Main du croupier">
          ${blackjack.dealerHand
            .map((card, index) => {
              const cardKey = blackjackCardKey(card, 'dealer');
              const isNewCard = !previousHands.dealer.includes(cardKey);
              return blackjackCard(
                card,
                !revealDealer && index === 1,
                'dealer',
                index,
                blackjack.dealerHand.length,
                isNewCard,
                handGrew.dealer && !isNewCard,
              );
            })
            .join('')}
        </div>
        <div class="blackjack-hand is-player ${playerHandClass}" style="--hand-size: ${Math.max(1, blackjack.playerHand.length)}" aria-label="Main du joueur">
          ${blackjack.playerHand
            .map((card, index) => {
              const cardKey = blackjackCardKey(card, 'player');
              const isNewCard = !previousHands.player.includes(cardKey);
              return blackjackCard(
                card,
                false,
                'player',
                index,
                blackjack.playerHand.length,
                isNewCard,
                handGrew.player && !isNewCard,
              );
            })
            .join('')}
        </div>
        ${
          isPlayerTurn
            ? `<div class="blackjack-actions">
                <button class="blackjack-action is-skill" data-action="rerollPlayerBlackjackCard" title="Reroll joueur (${playerRerolls})" aria-label="Reroll joueur" ${canRerollPlayer ? '' : 'disabled'}>R</button>
                <button class="blackjack-action is-skill" data-action="rerollDealerBlackjackCard" title="Reroll croupier (${dealerRerolls})" aria-label="Reroll croupier" ${canRerollDealer ? '' : 'disabled'}>D</button>
                <button class="blackjack-action" data-action="hitBlackjack" title="Tirer" aria-label="Tirer" ${isPlayerTurn ? '' : 'disabled'}>+</button>
                <button class="blackjack-action" data-action="standBlackjack" title="Rester" aria-label="Rester" ${isPlayerTurn ? '' : 'disabled'}>✓</button>
              </div>`
            : ''
        }
      </div>
    </div>
  `;
}

function blackjackCard(
  card: BlackjackCard,
  hidden: boolean,
  hand: 'dealer' | 'player',
  index: number,
  handSize: number,
  shouldAnimate: boolean,
  shouldShift: boolean,
): string {
  const dealOrder = index * 2 + (hand === 'dealer' ? 1 : 0);
  const dealX = hand === 'dealer' ? 66 - index * 7 : 86 - index * 8;
  const dealY = hand === 'dealer' ? -82 - index * 3 : -136 - index * 2;
  const dealRotate = hand === 'dealer' ? 16 - index * 6 : -18 + index * 7;
  const settleRotate = blackjackSettleRotate(hand, index, handSize);
  const animationClass = shouldAnimate ? 'is-receiving' : shouldShift ? 'is-settled is-shifting' : 'is-settled';
  const dealStyle = [
    `--deal-order: ${dealOrder}`,
    `--deal-x: ${dealX}px`,
    `--deal-y: ${dealY}px`,
    `--deal-rotate: ${dealRotate}deg`,
    `--settle-rotate: ${settleRotate}deg`,
    `--shift-x: ${blackjackShiftDistance(handSize)}px`,
  ].join('; ');

  if (hidden) {
    return `<span class="blackjack-card is-${hand} ${animationClass} is-hidden" style="${dealStyle}" aria-label="Carte cachee"><i>?</i></span>`;
  }
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  return `
    <span class="blackjack-card is-${hand} ${animationClass} ${isRed ? 'is-red' : 'is-black'}" style="${dealStyle}" aria-label="${blackjackCardLabel(card)}">
      <i>${card.rank}</i>
      <b>${blackjackSuit(card)}</b>
    </span>
  `;
}

function blackjackCardKey(card: BlackjackCard, hand: 'dealer' | 'player'): string {
  return `${hand}:${card.rank}:${card.suit}`;
}

function blackjackTwentyOneBannerText(state: GameState): string {
  const blackjack = state.blackjack;
  if (blackjack.phase === 'idle' || blackjack.playerHand.length === 0) {
    return '';
  }

  const playerValue = blackjackHandValue(blackjack.playerHand);
  const dealerValue = blackjackHandValue(blackjack.dealerHand);
  if (playerValue !== 21 && dealerValue !== 21) {
    return '';
  }

  const dealerNatural = blackjackIsNaturalTwentyOne(blackjack.dealerHand);
  const playerNatural = blackjackIsNaturalTwentyOne(blackjack.playerHand);
  if (playerValue === 21 && dealerValue === 21) {
    return dealerNatural && playerNatural ? 'Double blackjack' : 'Double 21';
  }

  if (playerValue === 21) {
    return playerNatural ? 'Blackjack !' : '21 !';
  }

  return dealerNatural ? 'Blackjack du croupier' : '21 du croupier';
}

function blackjackIsNaturalTwentyOne(hand: BlackjackCard[]): boolean {
  return hand.length === 2 && blackjackHandValue(hand) === 21;
}

function blackjackOutcomeText(state: GameState): string {
  switch (state.blackjack.phase) {
    case 'won':
    case 'lost':
    case 'blackjack':
      return '';
    case 'push':
      return 'Egalite';
    case 'idle':
    case 'player':
      return state.blackjack.lastOutcome;
  }
}

function blackjackHandOutcomeClass(state: GameState, hand: 'dealer' | 'player'): string {
  switch (state.blackjack.phase) {
    case 'won':
    case 'blackjack':
      return hand === 'player' ? 'is-winning-hand' : 'is-losing-hand';
    case 'lost':
      return hand === 'dealer' ? 'is-winning-hand' : 'is-losing-hand';
    case 'push':
    case 'idle':
    case 'player':
      return '';
  }
}

function blackjackSettleRotate(hand: 'dealer' | 'player', index: number, handSize: number): number {
  const center = (handSize - 1) / 2;
  const spread = hand === 'dealer' ? 5 : 6;
  return Math.round((index - center) * spread);
}

function blackjackShiftDistance(handSize: number): number {
  return Math.max(12, Math.min(24, 32 - handSize * 2));
}

function blackjackSuit(card: BlackjackCard): string {
  return blackjackCardLabel(card).replace(card.rank, '');
}

function hundredPanel(state: GameState): string {
  const hundred = state.hundred;
  const targetMax = hundredTargetMax(state.books.hundred.level);
  const progress = Math.min(100, (hundred.total / targetMax) * 100);
  const progressMarker = hundredProgressMarker(hundred, targetMax);
  const initialProgress = hundredProgressStart(hundred, progress, targetMax, progressMarker);
  const options: HundredOptionId[] = ['A', 'B', 'C', 'D'];

  return `
    <div class="hundred-panel">
      <div class="hundred-board is-${hundred.lastOutcome}" aria-label="Mini jeu Calcul du Cent">
        <div class="hundred-target">
          <span>Total</span>
          <strong>${hundred.total}</strong>
          <small>cible 100-${targetMax}</small>
        </div>
        <div class="hundred-progress" aria-hidden="true" data-progress="${progress.toFixed(2)}" data-progress-marker="${progressMarker}"><i style="width:${initialProgress}%"></i></div>
        <div class="hundred-stats" aria-label="Etat du calcul">
          <span># <strong data-dynamic-value="fragments">${Math.floor(state.resources.fragments)}</strong></span>
          <span>✓ <strong>${hundred.wins}</strong></span>
          <span>↟ <strong>${hundred.bestTotal}</strong></span>
        </div>
        <div class="hundred-last" aria-live="polite">
          <strong>${hundredOutcomeLabel(hundred.lastOutcome)}</strong>
          <span>${hundred.lastOption ? `${hundred.lastOption} +${hundred.lastRoll}` : 'Choisis un tirage'}</span>
        </div>
        <div class="hundred-options">
          ${options.map((optionId) => hundredOptionButton(optionId, state)).join('')}
        </div>
      </div>
    </div>
  `;
}

function hundredProgressMarker(hundred: GameState['hundred'], targetMax: number): string {
  return `${hundred.total}:${hundred.lastRoll}:${hundred.lastOption ?? 'none'}:${hundred.lastOutcome}:${targetMax}`;
}

function hundredProgressStart(
  hundred: GameState['hundred'],
  progress: number,
  targetMax: number,
  progressMarker: string,
): number {
  if (
    hundred.lastOutcome !== 'rolled' ||
    hundred.lastRoll <= 0 ||
    progressMarker === lastHundredProgressAnimationMarker
  ) {
    return progress;
  }
  const previousTotal = Math.max(0, hundred.total - hundred.lastRoll);
  return Math.min(100, Math.max(0, (previousTotal / targetMax) * 100));
}

function hundredOptionButton(optionId: HundredOptionId, state: GameState): string {
  const range = hundredOptionRange(optionId, state.books.hundred.level);
  return `
    <button class="hundred-option" data-action="chooseHundredOption" data-option-id="${optionId}">
      <strong>${optionId}</strong>
      <span>${range.min}-${range.max}</span>
    </button>
  `;
}

function hundredOutcomeLabel(outcome: GameState['hundred']['lastOutcome']): string {
  switch (outcome) {
    case 'won':
      return 'Reussi';
    case 'bust':
      return 'Depasse';
    case 'rolled':
      return 'Tirage';
    case 'idle':
      return 'Pret';
  }
}

function targetPanel(state: GameState): string {
  const targetState = state.targets;
  const automationInterval = targetAutomationInterval(state.targetSkills.automation);
  const targets = targetState.targets
    .map((target) => {
      const health = Math.max(0, Math.round((target.health / target.maxHealth) * 100));
      return `
        <button
          class="target-dot"
          data-action="attackTarget"
          data-book-id="targets"
          data-target-id="${target.id}"
          style="--target-x:${target.x}%; --target-y:${target.y}%; --target-health:${health}%"
          title="Attaquer la cible"
          aria-label="Attaquer la cible ${target.id}"
        >
          <span></span>
        </button>
      `;
    })
    .join('');

  return `
    <div class="target-panel">
      <div class="target-gallery" style="--target-shot:${targetState.shotPulse % 2}" role="img" aria-label="Mini jeu Galerie des Cibles">
        <div class="target-stats" aria-label="Etat des cibles">
          <span>◎ <strong data-dynamic-value="marks">${Math.floor(state.resources.marks)}</strong></span>
          <span>▲ <strong>${targetAttackDamage(state.targetSkills.damage)}</strong></span>
          <span>↯ <strong>${targetSpawnInterval(state.targetSkills.spawnSpeed).toFixed(1)}s</strong></span>
        </div>
        <div class="target-board" aria-label="Cibles actives">
          ${targets || '<i class="target-empty" aria-hidden="true"></i>'}
        </div>
        <div class="target-mini-stats" aria-label="Galerie">
          <span># <strong data-dynamic-value="target-score">${targetState.score}</strong></span>
          <span>↟ <strong data-dynamic-value="target-best">${targetState.best}</strong></span>
          <span>◎ <strong>${targetState.targets.length}/${targetMaxActiveTargets(state.targetSkills.targetCount)}</strong></span>
          <span>⌁ <strong>${automationInterval > 0 ? `${automationInterval.toFixed(1)}s` : 'Off'}</strong></span>
        </div>
      </div>
    </div>
  `;
}

function defensePanel(state: GameState): string {
  const defense = state.defense;
  const hasTiledTerrain = hasDefenseTiledMap();
  const healthPercent = Math.max(0, Math.min(100, defense.towerHealth * 10));
  const wavePercent = Math.round(defenseWaveProgress(state) * 100);
  const attackInterval = defenseTowerAttackInterval(state).toFixed(2);

  return `
    <div class="defense-panel">
      <div class="defense-arena ${hasTiledTerrain ? 'has-tiled-map' : ''}" style="--defense-shot:${defense.shotPulse % 2}" role="img" aria-label="Mini jeu Bastion Arcanique">
        <div class="defense-terrain ${hasTiledTerrain ? 'is-tiled' : 'is-fallback'}" aria-hidden="true">
          ${renderDefenseTiledTerrain()}
        </div>
        <div class="defense-stats" aria-label="Etat du bastion">
          <span>♥ <strong>${defense.towerHealth}/10</strong></span>
          <span>◆ <strong data-dynamic-value="sigils">${Math.floor(state.resources.sigils)}</strong></span>
          <span>W <strong>${defense.wave}</strong></span>
        </div>
        <div class="defense-health" aria-hidden="true"><i style="width:${healthPercent}%"></i></div>
        <div class="defense-range" aria-hidden="true"></div>
        <div class="defense-wave" aria-label="Progression vague"><i style="width:${wavePercent}%"></i></div>
        <div class="defense-lanes" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="defense-actors" aria-hidden="true">
          ${defenseActorsMarkup(defense)}
        </div>
        ${
          hasTiledTerrain
            ? ''
            : `<div class="defense-tower" aria-hidden="true">
                <span></span>
              </div>`
        }
        <div class="defense-mini-stats" aria-label="Bastion">
          <span>▲ <strong>${defenseTowerDamage(state)}</strong></span>
          <span>⌁ <strong>${attackInterval}s</strong></span>
          <span>◎ <strong data-dynamic-value="defense-enemy-count">${defense.enemies.length}</strong>/${defenseWaveEnemyCount(state)}</span>
        </div>
      </div>
    </div>
  `;
}

function defenseActorsMarkup(defense: GameState['defense']): string {
  return `${defenseShotMarkup(defense)}${defense.enemies.map((enemy) => defenseEnemyMarkup(enemy)).join('')}`;
}

function defenseEnemyMarkup(enemy: GameState['defense']['enemies'][number]): string {
  const position = defenseEnemyPosition(enemy);
  const health = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));

  return `
    <i
      class="defense-enemy"
      data-enemy-id="${enemy.id}"
      style="--enemy-x:${position.x}%; --enemy-y:${position.y}%; --enemy-health:${health}%"
      aria-hidden="true"
    ></i>
  `;
}

function defenseShotMarkup(defense: GameState['defense']): string {
  if (!defense.shot) {
    return '';
  }

  const shotTarget = defenseEnemyPosition(defense.shot);
  return `
    <svg class="defense-shot" data-shot-id="${defense.shot.id}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line x1="50" y1="50" x2="${shotTarget.x}" y2="${shotTarget.y}"></line>
    </svg>
  `;
}

function placeholderPanel(): string {
  return `
    <div class="placeholder-panel">
      <strong>♣ ♣ ♣</strong>
      <p>L'herbier sera une production passive avec recoltes timing.</p>
    </div>
  `;
}

function cellKey(cell: SnakeCell): string {
  return `${cell.x}:${cell.y}`;
}

function snakeConnectionClasses(cell: SnakeCell, body: SnakeCell[]): string[] {
  const index = body.findIndex((candidate) => cellsMatch(candidate, cell));
  if (index === -1) {
    return [];
  }

  return [body[index - 1], body[index + 1]]
    .filter((candidate): candidate is SnakeCell => candidate !== undefined)
    .map((candidate) => snakeConnectionClass(cell, candidate));
}

function snakeConnectionClass(cell: SnakeCell, neighbor: SnakeCell): string {
  if (neighbor.x < cell.x) {
    return 'connect-left';
  }
  if (neighbor.x > cell.x) {
    return 'connect-right';
  }
  if (neighbor.y < cell.y) {
    return 'connect-up';
  }
  return 'connect-down';
}

function cellsMatch(first: SnakeCell, second: SnakeCell): boolean {
  return first.x === second.x && first.y === second.y;
}

function installSnakeControls(): void {
  if (snakeControlsInstalled) {
    return;
  }
  snakeControlsInstalled = true;
  window.addEventListener('keydown', (event) => {
    const direction = snakeDirectionForKey(event.key);
    if (!direction || event.repeat || isTypingTarget(event.target)) {
      return;
    }
    const state = gameStore.snapshot;
    if (state.selectedBook !== 'serpent' || !isBookPanelOpen(state, 'serpent') || !state.books.serpent.unlocked) {
      return;
    }
    event.preventDefault();
    gameStore.dispatch({ type: 'snakeTurn', direction });
  });
}

function installTypingControls(): void {
  if (typingControlsInstalled) {
    return;
  }
  typingControlsInstalled = true;
  window.addEventListener('keydown', (event) => {
    if (event.repeat || isTypingTarget(event.target)) {
      return;
    }
    const state = gameStore.snapshot;
    if (state.selectedBook !== 'typing' || !isBookPanelOpen(state, 'typing') || !state.books.typing.unlocked) {
      return;
    }
    if (event.key.length !== 1 && event.key !== 'Backspace') {
      return;
    }
    event.preventDefault();
    gameStore.dispatch({ type: 'typeRuneKey', key: event.key });
  });
}

function installBlackjackControls(): void {
  if (blackjackControlsInstalled) {
    return;
  }
  blackjackControlsInstalled = true;
  window.addEventListener('keydown', (event) => {
    if ((event.code !== 'Space' && event.key !== ' ') || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    const state = gameStore.snapshot;
    if (
      state.selectedBook !== 'blackjack' ||
      !isBookPanelOpen(state, 'blackjack') ||
      !state.books.blackjack.unlocked
    ) {
      return;
    }

    event.preventDefault();
    if (state.blackjack.phase === 'idle' || state.blackjack.playerHand.length === 0) {
      gameStore.dispatch({ type: 'dealBlackjack' });
      return;
    }
    if (state.blackjack.phase === 'player') {
      gameStore.dispatch({ type: 'standBlackjack' });
    }
  });
}

function installEscapeControls(): void {
  if (escapeControlsInstalled) {
    return;
  }
  escapeControlsInstalled = true;
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    const state = gameStore.snapshot;
    if (openUpgradePanel !== null) {
      openUpgradePanel = null;
      upgradePanelMode = 'detail';
      event.preventDefault();
      renderHud(state);
      return;
    }

    const focusedPanel = state.openBookPanels.find((panel) => panel.bookId === state.selectedBook);
    const panelToClose = focusedPanel ?? state.openBookPanels[state.openBookPanels.length - 1];
    if (!panelToClose) {
      return;
    }

    event.preventDefault();
    gameStore.dispatch({ type: 'closeBookPanel', bookId: panelToClose.bookId });
  });
}

function snakeDirectionForKey(key: string): SnakeDirection | null {
  switch (key.toLowerCase()) {
    case 'arrowup':
    case 'w':
    case 'z':
      return 'up';
    case 'arrowright':
    case 'd':
      return 'right';
    case 'arrowdown':
    case 's':
      return 'down';
    case 'arrowleft':
    case 'a':
    case 'q':
      return 'left';
    default:
      return null;
  }
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}

function isBookPanelOpen(state: GameState, bookId: BookId): boolean {
  return state.openBookPanels.some((panel) => panel.bookId === bookId);
}

function bookMenuEntry(bookId: BookId, state: GameState): string {
  const definition = getBook(bookId);
  const book = state.books[bookId];
  const isVisible = isBookPanelOpen(state, bookId);
  const cost = definition.unlockResource
    ? `${definition.unlockMana} Mana + ${definition.unlockResource.amount} ${getResourceName(definition.unlockResource.id)}`
    : `${definition.unlockMana} Mana`;
  return `
    <button class="book-menu-entry ${book.unlocked ? 'is-unlocked' : 'is-locked'} ${isVisible ? 'is-visible' : ''} ${state.selectedBook === bookId ? 'is-active' : ''}" style="--book-accent:${definition.accent}" data-action="${book.unlocked ? 'selectBook' : 'unlockBook'}" data-book-id="${bookId}">
      <span>${book.unlocked ? '✓' : '×'}</span>
      <strong>${definition.name}</strong>
      ${book.unlocked ? '' : `<small>${cost}</small>`}
    </button>
  `;
}

function upgradeManaCost(bookId: BookId, state: GameState): number {
  const level = state.books[bookId].level;
  return Math.round(20 * Math.pow(1.55, level - 1));
}

function upgradeResourceCost(bookId: BookId, state: GameState): number {
  const level = state.books[bookId].level;
  return Math.round(3 * Math.pow(1.35, level - 1));
}

function getResourceName(resourceId: string): string {
  switch (resourceId) {
    case 'scales':
      return 'Ecailles';
    case 'runes':
      return 'Runes';
    case 'spores':
      return 'Spores';
    case 'sigils':
      return 'Sceaux';
    case 'chips':
      return 'Jetons';
    case 'fragments':
      return 'Fragments';
    case 'marks':
      return 'Marques';
    case 'minerals':
      return 'Minerais';
    case 'gels':
      return 'Gels';
    default:
      return resourceId;
  }
}
