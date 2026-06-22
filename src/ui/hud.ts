import { books, getBook, type BookId } from '../game/content/books';
import { gameStore } from '../game/store';
import type { GameState, SnakeCell, SnakeDirection } from '../game/simulation/state';

let rootElement: HTMLDivElement | null = null;
let openUpgradePanel: BookId | null = null;
let upgradePanelMode: 'detail' | 'compact' = 'detail';
let lastRenderSignature = '';
let lastSelectedBook: BookId | null = null;
let lastOpenUpgradePanel: BookId | null = null;
let lastUpgradePanelMode: 'detail' | 'compact' = 'detail';
let lastSnakeRewardMarker = '';
let snakeControlsInstalled = false;

export function mountHud(root: HTMLDivElement | null): void {
  rootElement = root;
  if (!rootElement) {
    throw new Error('Missing #hud-root');
  }
  installSnakeControls();
  gameStore.subscribe(renderHud);
}

function renderHud(state: GameState): void {
  if (!rootElement) {
    return;
  }

  const selectedBook = getBook(state.selectedBook);
  const signature = createHudSignature(state);
  if (signature === lastRenderSignature) {
    return;
  }

  const shouldAnimatePage = lastSelectedBook !== state.selectedBook;
  const shouldAnimateUpgradePanel =
    openUpgradePanel !== null && (lastOpenUpgradePanel !== openUpgradePanel || lastUpgradePanelMode !== upgradePanelMode);
  lastRenderSignature = signature;
  lastSelectedBook = state.selectedBook;
  lastOpenUpgradePanel = openUpgradePanel;
  lastUpgradePanelMode = upgradePanelMode;

  rootElement.innerHTML = `
    <div class="screen-vignette"></div>
    <aside class="resource-panel" aria-label="Resources">
      ${resourceRow('☉', 'Ecailles', state.resources.scales, '#a78cff')}
      ${resourceRow('✦', 'Runes', state.resources.runes, '#ed9fff')}
      ${resourceRow('♣', 'Spores', state.resources.spores, '#91d980')}
    </aside>
    <section class="book-overlay ${shouldAnimatePage ? 'is-entering' : ''}" aria-label="${selectedBook.name}">
      <header class="book-page-header ${selectedBook.id === 'mana' ? 'is-minimal' : ''}">
        <button class="book-upgrade-tile ${openUpgradePanel === selectedBook.id ? 'is-open' : ''}" data-action="toggleUpgradePanel" data-book-id="${selectedBook.id}" title="Upgrade">
          ▲
          <small>${upgradeCost(state.selectedBook, state)}</small>
        </button>
        <button class="upgrade-compact-tile ${openUpgradePanel === selectedBook.id && upgradePanelMode === 'compact' ? 'is-open' : ''}" data-action="toggleCompactUpgradePanel" data-book-id="${selectedBook.id}" title="Ameliorations compactes">▦</button>
        ${selectedBook.id === 'mana' ? '' : `<div class="book-page-title">
          <p>${selectedBook.name}</p>
          <span>${selectedBook.subtitle}</span>
        </div>`}
        ${selectedBook.id === 'mana' ? '' : `<button class="icon-button" data-action="togglePin" data-book-id="${selectedBook.id}" title="Epingler">⌑</button>`}
      </header>
      <div class="book-page-body">
        ${selectedBook.id === 'mana' ? manaPanel() : selectedBook.id === 'serpent' ? snakePanel(state) : placeholderPanel(selectedBook.id)}
      </div>
      ${openUpgradePanel === selectedBook.id ? upgradePanel(selectedBook.id, state, shouldAnimateUpgradePanel, upgradePanelMode) : ''}
      ${selectedBook.id === 'mana' || selectedBook.id === 'serpent' ? '' : `
        <footer class="book-page-actions">
          <button class="primary-action" data-action="chargeMana" data-book-id="${selectedBook.id}">
            Activer
          </button>
        </footer>
      `}
    </section>
    <section class="unlock-strip" aria-label="Unlock books">
      ${books.map((book) => unlockCard(book.id, state)).join('')}
    </section>
    <section class="pinned-zone" aria-label="Pinned games">
      ${books.filter((book) => state.books[book.id].pinned && state.books[book.id].unlocked).map((book) => pinnedCard(book.id, state)).join('')}
    </section>
  `;

  rootElement.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const bookId = button.dataset.bookId as BookId | undefined;
      if (action === 'chargeMana') {
        const beforeMana = gameStore.snapshot.mana;
        gameStore.dispatch({ type: 'chargeMana' });
        const gainedMana = gameStore.snapshot.mana - beforeMana;
        showCrystalClickEffect();
        showFloatingGain(gainedMana);
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
      if (action === 'togglePin' && bookId) {
        gameStore.dispatch({ type: 'togglePin', bookId });
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

  if (state.selectedBook === 'serpent' && state.snake.lastReward > 0) {
    const marker = `${state.snake.score}:${Math.floor(state.resources.scales)}`;
    if (marker !== lastSnakeRewardMarker) {
      lastSnakeRewardMarker = marker;
      showFloatingGain(state.snake.lastReward, '.snake-board');
    }
  }
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

  return [
    state.selectedBook,
    openUpgradePanel ?? 'none',
    upgradePanelMode,
    Math.floor(state.mana),
    Math.floor(state.resources.scales),
    Math.floor(state.resources.runes),
    Math.floor(state.resources.spores),
    state.snake.score,
    state.snake.best,
    state.snake.lastReward,
    state.snake.direction,
    state.snake.nextDirection,
    state.snake.food.x,
    state.snake.food.y,
    state.snake.body.map((cell) => `${cell.x},${cell.y}`).join(';'),
    bookState,
  ].join('/');
}

function upgradePanel(bookId: BookId, state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
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

function resourceRow(icon: string, label: string, value: number, color: string): string {
  return `
    <div class="resource-row">
      <span style="color:${color}">${icon}</span>
      <strong>${Math.floor(value)}</strong>
      <small>${label}</small>
    </div>
  `;
}

function manaPanel(): string {
  return `
    <div class="mana-panel">
      <button class="mana-orb" data-action="chargeMana" data-book-id="mana" title="Concentrer la Mana" aria-label="Concentrer la Mana">
        <span class="mana-orb-aura"></span>
        <span class="mana-sprite" aria-hidden="true"></span>
      </button>
    </div>
  `;
}

function showCrystalClickEffect(): void {
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

  for (let index = 0; index < 8; index += 1) {
    const shard = document.createElement('i');
    const angle = index * 45;
    const distance = 58 + (index % 2) * 20;
    shard.className = 'mana-spark';
    shard.style.setProperty('--spark-x', `${Math.cos((angle * Math.PI) / 180) * distance}px`);
    shard.style.setProperty('--spark-y', `${Math.sin((angle * Math.PI) / 180) * distance}px`);
    manaOrb.appendChild(shard);
    shard.addEventListener('animationend', () => shard.remove(), { once: true });
  }
}

function showFloatingGain(amount: number, targetSelector = '.mana-orb'): void {
  const target = rootElement?.querySelector<HTMLElement>(targetSelector);
  if (!target) {
    return;
  }

  const gain = Math.max(1, Math.round(amount));
  const rect = target.getBoundingClientRect();
  const pop = document.createElement('span');
  pop.className = 'floating-gain';
  pop.textContent = `+${gain}`;
  pop.style.left = `${rect.left + rect.width * 0.5}px`;
  pop.style.top = `${rect.top + rect.height * 0.28}px`;
  document.body.appendChild(pop);
  pop.addEventListener('animationend', () => pop.remove(), { once: true });
}

function snakePanel(state: GameState): string {
  const snake = state.snake;
  const bodyKeys = new Set(snake.body.map(cellKey));
  const headKey = cellKey(snake.body[0]);
  const foodKey = cellKey(snake.food);
  const cells = Array.from({ length: snake.gridSize * snake.gridSize }, (_, index) => {
    const cell = { x: index % snake.gridSize, y: Math.floor(index / snake.gridSize) };
    const key = cellKey(cell);
    const classNames = ['snake-cell'];
    if (key === headKey) {
      classNames.push('is-head');
    } else if (bodyKeys.has(key)) {
      classNames.push('is-body');
    }
    if (key === foodKey) {
      classNames.push('is-food');
    }
    return `<i class="${classNames.join(' ')}"></i>`;
  }).join('');

  return `
    <div class="snake-panel">
      <div class="snake-board-shell">
        <div class="snake-stats" aria-label="Score du serpent">
          <span>☉ ${Math.floor(state.resources.scales)}</span>
          <span>◆ ${Math.floor(state.mana)}</span>
          <span>◇ ${snake.score}</span>
          <span>✦ ${snake.best}</span>
        </div>
        <div class="snake-board" role="img" aria-label="Mini jeu Snake du Livre du Serpent">
          ${cells}
        </div>
      </div>
    </div>
  `;
}

function placeholderPanel(bookId: BookId): string {
  if (bookId === 'typing') {
    return `
      <div class="placeholder-panel">
        <strong>✦ ✧ ✦</strong>
        <p>Typing arcane sera une session courte avec glyphes simples.</p>
      </div>
    `;
  }
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
    if (state.selectedBook !== 'serpent' || !state.books.serpent.unlocked) {
      return;
    }
    event.preventDefault();
    gameStore.dispatch({ type: 'snakeTurn', direction });
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

function pinnedCard(bookId: BookId, state: GameState): string {
  const definition = getBook(bookId);
  const book = state.books[bookId];
  return `
    <article class="pinned-card">
      <button class="pin-close" data-action="togglePin" data-book-id="${bookId}">×</button>
      <strong>${definition.name}</strong>
      <div class="pinned-meter"><i style="width:${Math.min(100, book.level * 18 + book.automation * 30)}%"></i></div>
      <small>${definition.resourceName ? `${definition.resourceName} + Mana` : 'Mana'}</small>
    </article>
  `;
}

function upgradeCost(bookId: BookId, state: GameState): string {
  const definition = getBook(bookId);
  if (!definition.resourceName) {
    return `${upgradeManaCost(bookId, state)}M`;
  }
  return `${upgradeManaCost(bookId, state)}M ${upgradeResourceCost(bookId, state)}${definition.resourceName.slice(0, 1)}`;
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
