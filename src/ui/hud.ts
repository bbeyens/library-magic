import { books, getBook, type BookId } from '../game/content/books';
import { gameStore } from '../game/store';
import {
  manaAutomationInterval,
  manaCriticalMultiplier,
  manaSkillCost,
  manaSkillMaxLevel,
  manaWandCount,
  runeTypingCurrentWord,
  runeTypingRewardPreview,
  snakeBaseMultiplier,
  snakeAutomationActive,
  snakeExtraLivesRemaining,
  snakeMoveInterval,
  snakeSkillCost,
  snakeSkillMaxLevel,
  snakeTotalMultiplier,
  type ManaSkillId,
  type SnakeSkillId,
} from '../game/simulation/actions';
import type { BookPanelSlot, GameState, SnakeCell, SnakeDirection } from '../game/simulation/state';

let rootElement: HTMLDivElement | null = null;
let openUpgradePanel: BookId | null = null;
let upgradePanelMode: 'detail' | 'compact' = 'detail';
let lastRenderSignature = '';
let lastSelectedBook: BookId | null = null;
let lastOpenPanelsSignature = '';
let lastOpenUpgradePanel: BookId | null = null;
let lastUpgradePanelMode: 'detail' | 'compact' = 'detail';
let lastSnakeRewardMarker = '';
let lastRuneTypingRewardMarker = '';
let lastManaAutoCastCount = 0;
let snakeControlsInstalled = false;
let typingControlsInstalled = false;
let escapeControlsInstalled = false;
let suppressClickListenerInstalled = false;
let suppressNextPanelClickUntil = 0;
const bookPanelPositions = new Map<BookId, { left: number; top: number }>();
const bookPanelSizes = new Map<BookId, { width: number; height: number }>();

export function mountHud(root: HTMLDivElement | null): void {
  rootElement = root;
  if (!rootElement) {
    throw new Error('Missing #hud-root');
  }
  installSnakeControls();
  installTypingControls();
  installEscapeControls();
  gameStore.subscribe(renderHud);
}

function renderHud(state: GameState): void {
  if (!rootElement) {
    return;
  }

  const signature = createHudSignature(state);
  if (signature === lastRenderSignature) {
    updateDynamicHudValues(state);
    runHudTransientEffects(state);
    return;
  }

  const openPanelsSignature = state.openBookPanels.map((panel) => `${panel.bookId}:${panel.slot}`).join('|');
  const shouldAnimatePage = openPanelsSignature !== lastOpenPanelsSignature || lastSelectedBook !== state.selectedBook;
  const shouldAnimateUpgradePanel =
    openUpgradePanel !== null && (lastOpenUpgradePanel !== openUpgradePanel || lastUpgradePanelMode !== upgradePanelMode);
  lastRenderSignature = signature;
  lastSelectedBook = state.selectedBook;
  lastOpenPanelsSignature = openPanelsSignature;
  lastOpenUpgradePanel = openUpgradePanel;
  lastUpgradePanelMode = upgradePanelMode;

  rootElement.innerHTML = `
    <div class="screen-vignette"></div>
    <aside class="resource-panel" aria-label="Resources">
      ${resourceRow('scales', '☉', 'Ecailles', state.resources.scales, '#a78cff')}
      ${resourceRow('runes', '✦', 'Runes', state.resources.runes, '#ed9fff')}
      ${resourceRow('spores', '♣', 'Spores', state.resources.spores, '#91d980')}
    </aside>
    ${state.openBookPanels.map((panel) => bookOverlay(panel.bookId, panel.slot, state, shouldAnimatePage, shouldAnimateUpgradePanel)).join('')}
    <section class="unlock-strip" aria-label="Unlock books">
      ${books.map((book) => unlockCard(book.id, state)).join('')}
    </section>
  `;

  if (!suppressClickListenerInstalled) {
    suppressClickListenerInstalled = true;
    rootElement.addEventListener('click', suppressPanelClickAfterDrag, true);
  }

  rootElement.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const bookId = button.dataset.bookId as BookId | undefined;
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
      if (action === 'toggleSnakeAutomation') {
        gameStore.dispatch({ type: 'toggleSnakeAutomation' });
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
      if (action === 'buyUpgrade' && bookId) {
        gameStore.dispatch({ type: 'buyUpgrade', bookId });
      }
      if (action === 'selectBook' && bookId) {
        openUpgradePanel = null;
        upgradePanelMode = 'detail';
        gameStore.dispatch({ type: 'selectBook', bookId });
      }
      if (action === 'unlockBook' && bookId) {
        openUpgradePanel = null;
        upgradePanelMode = 'detail';
        gameStore.dispatch({ type: 'unlockBook', bookId });
      }
    });
  });

  rootElement.querySelectorAll<HTMLElement>('.book-overlay, .mini-skill-popover, .upgrade-panel').forEach((panel) => {
    panel.addEventListener('pointerdown', stopHudPointerEvent);
    panel.addEventListener('pointerup', stopHudPointerEvent);
    panel.addEventListener('click', stopHudPointerEvent);
  });
  installBookPanelDragging();

  updateDynamicHudValues(state);
  runHudTransientEffects(state);
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
}

function updateDynamicHudValues(state: GameState): void {
  setDynamicText('mana', Math.floor(state.mana));
  setDynamicText('scales', Math.floor(state.resources.scales));
  setDynamicText('runes', Math.floor(state.resources.runes));
  setDynamicText('spores', Math.floor(state.resources.spores));
  setDynamicText('snake-score', state.snake.score);
  setDynamicText('snake-best', state.snake.best);
  setDynamicText('typing-reward', runeTypingRewardPreview(state));
  setDynamicText('typing-combo', state.runeTyping.combo);
  setDynamicText('typing-penalty', state.runeTyping.penaltyWordsRemaining);
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
      startBookPanelResize(event, panel);
      startBookPanelDrag(event, panel);
    });
  });
}

function startBookPanelResize(event: PointerEvent, panel: HTMLElement): void {
  if (!rootElement || event.button !== 0 || !isBookPanelResizeHandle(event)) {
    return;
  }

  const bookId = panel.dataset.bookId as BookId | undefined;
  if (!bookId) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const rootRect = rootElement.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const currentLeft = panelRect.left - rootRect.left;
  const currentTop = panelRect.top - rootRect.top;
  const startWidth = panelRect.width;
  const startHeight = panelRect.height;
  const pointerId = event.pointerId;

  panel.setPointerCapture(pointerId);
  panel.classList.add('is-resizing', 'is-drag-positioned', 'is-resized');
  setBookPanelPosition(bookId, panel, currentLeft, currentTop);
  setBookPanelSize(bookId, panel, startWidth, startHeight);

  let hasResized = false;
  const resizePanel = (moveEvent: PointerEvent): void => {
    if (moveEvent.pointerId !== pointerId) {
      return;
    }
    moveEvent.preventDefault();
    const movedX = moveEvent.clientX - event.clientX;
    const movedY = moveEvent.clientY - event.clientY;
    if (!hasResized && Math.hypot(movedX, movedY) < 4) {
      return;
    }
    hasResized = true;
    setBookPanelSize(bookId, panel, startWidth + movedX, startHeight + movedY);
    setBookPanelPosition(bookId, panel, currentLeft, currentTop);
  };

  const stopResize = (upEvent: PointerEvent): void => {
    if (upEvent.pointerId !== pointerId) {
      return;
    }
    upEvent.preventDefault();
    upEvent.stopPropagation();
    if (hasResized) {
      suppressNextPanelClickUntil = performance.now() + 240;
    }
    panel.classList.remove('is-resizing');
    panel.releasePointerCapture(pointerId);
    panel.removeEventListener('pointermove', resizePanel);
    panel.removeEventListener('pointerup', stopResize);
    panel.removeEventListener('pointercancel', stopResize);
  };

  panel.addEventListener('pointermove', resizePanel);
  panel.addEventListener('pointerup', stopResize);
  panel.addEventListener('pointercancel', stopResize);
}

function startBookPanelDrag(event: PointerEvent, panel: HTMLElement): void {
  if (!rootElement || event.button !== 0 || !isBookPanelDragHandle(event)) {
    return;
  }

  const bookId = panel.dataset.bookId as BookId | undefined;
  if (!bookId) {
    return;
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
      panel.classList.add('is-dragging', 'is-drag-positioned');
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
    panel.releasePointerCapture(pointerId);
    panel.removeEventListener('pointermove', movePanel);
    panel.removeEventListener('pointerup', stopDrag);
    panel.removeEventListener('pointercancel', stopDrag);
  };

  panel.addEventListener('pointermove', movePanel);
  panel.addEventListener('pointerup', stopDrag);
  panel.addEventListener('pointercancel', stopDrag);
}

function isBookPanelDragHandle(event: PointerEvent): boolean {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return Boolean(target.closest('.book-panel-move'));
}

function isBookPanelResizeHandle(event: PointerEvent): boolean {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return Boolean(target.closest('.book-panel-resize'));
}

function setBookPanelPosition(bookId: BookId, panel: HTMLElement, left: number, top: number): void {
  if (!rootElement) {
    return;
  }

  const rootRect = rootElement.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const padding = 8;
  const maxLeft = Math.max(padding, rootRect.width - panelRect.width - padding);
  const maxTop = Math.max(padding, rootRect.height - panelRect.height - padding);
  const next = {
    left: Math.round(clamp(left, padding, maxLeft)),
    top: Math.round(clamp(top, padding, maxTop)),
  };
  bookPanelPositions.set(bookId, next);
  panel.style.setProperty('--panel-left', `${next.left}px`);
  panel.style.setProperty('--panel-top', `${next.top}px`);
}

function setBookPanelSize(bookId: BookId, panel: HTMLElement, width: number, height: number): void {
  if (!rootElement) {
    return;
  }

  const rootRect = rootElement.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const padding = 8;
  const minWidth = 330;
  const minHeight = 320;
  const maxWidth = Math.max(minWidth, rootRect.width - (panelRect.left - rootRect.left) - padding);
  const maxHeight = Math.max(minHeight, rootRect.height - (panelRect.top - rootRect.top) - padding);
  const next = {
    width: Math.round(clamp(width, minWidth, maxWidth)),
    height: Math.round(clamp(height, minHeight, maxHeight)),
  };
  bookPanelSizes.set(bookId, next);
  panel.classList.add('is-resized');
  panel.style.setProperty('--panel-width', `${next.width}px`);
  panel.style.setProperty('--panel-height', `${next.height}px`);
}

function clampRenderedPanel(panel: HTMLElement): void {
  const bookId = panel.dataset.bookId as BookId | undefined;
  const position = bookId ? bookPanelPositions.get(bookId) : undefined;
  const size = bookId ? bookPanelSizes.get(bookId) : undefined;
  if (!bookId) {
    return;
  }
  if (size) {
    setBookPanelSize(bookId, panel, size.width, size.height);
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
  const size = bookPanelSizes.get(bookId);
  const dragClass = `${position ? ' is-drag-positioned' : ''}${size ? ' is-resized' : ''}`;
  const panelVars = [
    position ? `--panel-left:${position.left}px; --panel-top:${position.top}px;` : '',
    size ? `--panel-width:${size.width}px; --panel-height:${size.height}px;` : '',
  ].join(' ');
  const dragStyle = panelVars ? ` style="${panelVars}"` : '';
  const isMinimalPage = selectedBook.id === 'mana' || selectedBook.id === 'serpent' || selectedBook.id === 'typing';
  const hasUpgradeControls = selectedBook.id !== 'typing';
  return `
    <section class="book-overlay panel-slot-${slot} ${isFocused ? 'is-focused' : ''} ${shouldAnimatePage ? 'is-entering' : ''}${dragClass}"${dragStyle} data-book-id="${selectedBook.id}" aria-label="${selectedBook.name}">
      <button class="book-panel-move" data-book-id="${selectedBook.id}" title="Deplacer le panneau" aria-label="Deplacer le panneau">↔</button>
      <button class="book-panel-close" data-action="closeBookPanel" data-book-id="${selectedBook.id}" title="Fermer le panneau">×</button>
      <header class="book-page-header ${isMinimalPage ? 'is-minimal' : ''}">
        ${hasUpgradeControls ? `<button class="book-upgrade-tile ${openUpgradePanel === selectedBook.id ? 'is-open' : ''}" data-action="toggleUpgradePanel" data-book-id="${selectedBook.id}" title="Upgrade">
          ▲
        </button>
        <button class="upgrade-compact-tile ${openUpgradePanel === selectedBook.id && upgradePanelMode === 'compact' ? 'is-open' : ''}" data-action="toggleCompactUpgradePanel" data-book-id="${selectedBook.id}" title="Ameliorations compactes">${openUpgradePanel === selectedBook.id && upgradePanelMode === 'compact' ? '◀' : '▶'}</button>
        ${openUpgradePanel === selectedBook.id && upgradePanelMode === 'compact' ? compactUpgradePopover(selectedBook.id, state, shouldAnimateUpgradePanel) : ''}` : ''}
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
      <button class="book-panel-resize" data-book-id="${selectedBook.id}" title="Redimensionner le panneau" aria-label="Redimensionner le panneau"></button>
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

  return [
    state.selectedBook,
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
    snakeSkills.automation,
    snakeSkills.automationEnabled ? 1 : 0,
    snakeSkills.baseMultiplier,
    snakeSkills.bonusFruit,
    snakeSkills.extraLife,
    snakeSkills.edgeWrap,
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
          ${snakeSkillCompactButton(state, 'automation', '⌁')}
          ${snakeSkillCompactButton(state, 'baseMultiplier', '×')}
          ${snakeSkillCompactButton(state, 'bonusFruit', '●')}
          ${snakeSkillCompactButton(state, 'extraLife', '♡')}
          ${snakeSkillCompactButton(state, 'edgeWrap', '⇄')}
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
        ${snakeSkillButton(state, 'speed', 'Vitesse', `${snakeMoveInterval(state).toFixed(2)}s/case`, '-0.02s par niveau, min 0.25s')}
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
      return `<span class="${className}">${letter}</span>`;
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
  const target = rootElement?.querySelector<HTMLElement>(targetSelector);
  if (!target) {
    return;
  }

  const gain = Math.max(1, Math.round(amount));
  const rect = target.getBoundingClientRect();
  const host = target.closest<HTMLElement>('.book-overlay');
  const hostRect = host?.getBoundingClientRect();
  const { x, y } = floatingGainOffset(rect);
  const pop = document.createElement('span');
  pop.className = 'floating-gain';
  pop.textContent = `+${gain}`;
  pop.style.left = `${rect.left - (hostRect?.left ?? 0) + rect.width * 0.5 + x}px`;
  pop.style.top = `${rect.top - (hostRect?.top ?? 0) + rect.height * 0.48 + y}px`;
  (host ?? document.body).appendChild(pop);
  pop.addEventListener('animationend', () => pop.remove(), { once: true });
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
  const cells = Array.from({ length: snake.gridSize * snake.gridSize }, (_, index) => {
    const cell = { x: index % snake.gridSize, y: Math.floor(index / snake.gridSize) };
    const key = cellKey(cell);
    const classNames = ['snake-cell', (cell.x + cell.y) % 2 === 0 ? 'is-light' : 'is-dark'];
    if (key === headKey) {
      classNames.push('is-snake', 'is-head', `is-facing-${snake.nextDirection}`, ...snakeConnectionClasses(cell, snake.body));
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
        <div class="snake-board" role="img" aria-label="Mini jeu Snake du Livre du Serpent">
          <span class="snake-spriterrific-familiar" aria-hidden="true"></span>
          ${cells}
        </div>
      </div>
    </div>
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

function unlockCard(bookId: BookId, state: GameState): string {
  const definition = getBook(bookId);
  const book = state.books[bookId];
  const cost = definition.unlockResource
    ? `${definition.unlockMana} Mana + ${definition.unlockResource.amount} ${getResourceName(definition.unlockResource.id)}`
    : `${definition.unlockMana} Mana`;
  return `
    <button class="unlock-card ${book.unlocked ? 'unlocked' : ''}" data-action="${book.unlocked ? 'selectBook' : 'unlockBook'}" data-book-id="${bookId}">
      <span>${book.unlocked ? '✓' : '×'}</span>
      <strong>${definition.name}</strong>
      <small>${book.unlocked ? `Lv ${book.level}` : cost}</small>
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
    default:
      return resourceId;
  }
}
