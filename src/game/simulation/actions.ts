import { books, getBook, type BookId } from '../content/books';
import { runeWords } from '../content/runeWords';
import {
  createStartingSnakeBody,
  randomSnakeFood,
  type BookPanelSlot,
  type GameState,
  type SnakeBonusFruitType,
  type SnakeCell,
  type SnakeDirection,
} from './state';

export type ManaSkillId = 'power' | 'automation' | 'criticalHit' | 'criticalEffect' | 'extraWands';
export type SnakeSkillId = 'speed' | 'automation' | 'baseMultiplier' | 'bonusFruit' | 'extraLife' | 'edgeWrap';

const DEBUG_MANA_SKILL_MAX_LEVELS: Record<ManaSkillId, number> = {
  power: 50,
  automation: 50,
  criticalHit: 20,
  criticalEffect: 40,
  extraWands: 9,
};

const DEBUG_SNAKE_SKILL_MAX_LEVELS: Record<SnakeSkillId, number> = {
  speed: 23,
  automation: 10,
  baseMultiplier: 40,
  bonusFruit: 3,
  extraLife: 3,
  edgeWrap: 1,
};

export type GameAction =
  | { type: 'selectBook'; bookId: BookId }
  | { type: 'closeBookPanel'; bookId: BookId }
  | { type: 'moveBookPanel'; bookId: BookId }
  | { type: 'chargeMana' }
  | { type: 'buyManaSkill'; skillId: ManaSkillId }
  | { type: 'buySnakeSkill'; skillId: SnakeSkillId }
  | { type: 'maxManaSkills' }
  | { type: 'resetManaSkills' }
  | { type: 'buyUpgrade'; bookId: BookId }
  | { type: 'togglePin'; bookId: BookId }
  | { type: 'unlockBook'; bookId: BookId }
  | { type: 'snakeTurn'; direction: SnakeDirection }
  | { type: 'toggleSnakeAutomation' }
  | { type: 'typeRuneKey'; key: string }
  | { type: 'grantDebugResources' };

export function applyAction(state: GameState, action: GameAction): void {
  switch (action.type) {
    case 'selectBook':
      if (state.books[action.bookId].unlocked) {
        state.selectedBook = action.bookId;
        openBookPanel(state, action.bookId);
      }
      return;
    case 'closeBookPanel':
      closeBookPanel(state, action.bookId);
      return;
    case 'moveBookPanel':
      moveBookPanel(state, action.bookId);
      return;
    case 'chargeMana':
      chargeMana(state);
      return;
    case 'buyManaSkill':
      buyManaSkill(state, action.skillId);
      return;
    case 'buySnakeSkill':
      buySnakeSkill(state, action.skillId);
      return;
    case 'maxManaSkills':
      maxManaSkills(state);
      return;
    case 'resetManaSkills':
      resetManaSkills(state);
      return;
    case 'buyUpgrade':
      buyUpgrade(state, action.bookId);
      return;
    case 'togglePin':
      togglePin(state, action.bookId);
      return;
    case 'unlockBook':
      unlockBook(state, action.bookId);
      return;
    case 'snakeTurn':
      snakeTurn(state, action.direction);
      return;
    case 'toggleSnakeAutomation':
      toggleSnakeAutomation(state);
      return;
    case 'typeRuneKey':
      typeRuneKey(state, action.key);
      return;
    case 'grantDebugResources':
      grantDebugResources(state);
      return;
  }
}

export function tickState(state: GameState, now: number): void {
  const deltaSeconds = Math.min((now - state.lastTick) / 1000, 1);
  state.lastTick = now;

  for (const bookDefinition of books) {
    const book = state.books[bookDefinition.id];
    if (!book.unlocked || book.automation === 0) {
      continue;
    }

    const pinMultiplier = book.pinned ? 1 : 0.35;
    const amount = deltaSeconds * book.automation * pinMultiplier * (1 + book.level * 0.12);
    state.mana += amount * 0.65;
    if (bookDefinition.resourceId) {
      state.resources[bookDefinition.resourceId] += amount * 0.22;
    }
  }

  tickManaAutomation(state, deltaSeconds);
  tickSnake(state, deltaSeconds);
}

function chargeMana(state: GameState): void {
  const book = state.books.mana;
  const gain = rollManaClickGain(state);
  book.charge = Math.min(book.charge + 12 + book.level * 2, 100);
  state.mana += gain;
}

function tickManaAutomation(state: GameState, deltaSeconds: number): void {
  const skills = state.manaSkills;
  if (skills.automation <= 0) {
    skills.automationTimer = 0;
    return;
  }

  skills.automationTimer += deltaSeconds;
  const interval = manaAutomationInterval(skills.automation);
  if (skills.automationTimer < interval) {
    return;
  }

  const casts = Math.max(1, Math.floor(skills.automationTimer / interval));
  skills.automationTimer %= interval;
  const wandCount = manaWandCount(state);
  for (let cast = 0; cast < casts; cast += 1) {
    for (let wand = 0; wand < wandCount; wand += 1) {
      state.mana += rollManaClickGain(state);
    }
  }
  skills.autoCastCount += casts;
}

function rollManaClickGain(state: GameState): number {
  const skills = state.manaSkills;
  const baseGain = 1 + skills.power;
  const criticalChance = Math.min(20, skills.criticalHit) / 100;
  if (criticalChance <= 0 || Math.random() >= criticalChance) {
    return baseGain;
  }

  return baseGain * manaCriticalMultiplier(state);
}

export function manaCriticalMultiplier(state: GameState): number {
  return 2 + Math.min(40, state.manaSkills.criticalEffect) * 0.1;
}

export function manaAutomationInterval(level: number): number {
  if (level <= 0) {
    return 0;
  }
  return Math.max(0.5, 5 - (level - 1) * 0.1);
}

export function manaWandCount(state: GameState): number {
  if (state.manaSkills.automation <= 0) {
    return 0;
  }
  return 1 + Math.min(9, state.manaSkills.extraWands);
}

export function manaSkillCost(state: GameState, skillId: ManaSkillId): number {
  const level = state.manaSkills[skillId];
  switch (skillId) {
    case 'power':
      return Math.round(12 * Math.pow(1.38, level));
    case 'automation':
      return Math.round(90 * Math.pow(1.42, level));
    case 'criticalHit':
      return Math.round(80 * Math.pow(1.36, level));
    case 'criticalEffect':
      return Math.round(120 * Math.pow(1.32, level));
    case 'extraWands':
      return Math.round(260 * Math.pow(2.05, level));
  }
}

export function manaSkillMaxLevel(skillId: ManaSkillId): number | null {
  switch (skillId) {
    case 'criticalHit':
      return 20;
    case 'criticalEffect':
      return 40;
    case 'extraWands':
      return 9;
    case 'power':
    case 'automation':
      return null;
  }
}

export function snakeMoveInterval(state: GameState): number {
  return Math.max(0.25, 0.7 - state.snakeSkills.speed * 0.02);
}

export function snakeBaseMultiplier(state: GameState): number {
  return Math.min(5, 1 + state.snakeSkills.baseMultiplier * 0.1);
}

export function snakeComboMultiplier(state: GameState): number {
  return 1 + state.snake.comboSteps * 0.1;
}

export function snakeTotalMultiplier(state: GameState): number {
  return snakeBaseMultiplier(state) * snakeComboMultiplier(state) + snakeBonusMultiplier(state);
}

export function snakeBonusMultiplier(state: GameState): number {
  if (!state.snake.bonusFood) {
    return 0;
  }
  return snakeBonusFruitMultiplier(state.snake.bonusFood.type);
}

export function snakeBonusFruitMultiplier(type: SnakeBonusFruitType): number {
  switch (type) {
    case 'orange':
      return 0.2;
    case 'pear':
      return 0.4;
    case 'banana':
      return 1;
  }
}

export function snakeExtraLivesRemaining(state: GameState): number {
  return Math.max(0, state.snakeSkills.extraLife - state.snake.extraLivesUsed);
}

export function snakeAutomationActive(state: GameState): boolean {
  if (!state.snakeSkills.automationEnabled || state.snakeSkills.automation <= 0) {
    return false;
  }
  return state.snake.comboSteps <= Math.floor(snakeBaseMultiplier(state) * 10);
}

export function snakeSkillMaxLevel(skillId: SnakeSkillId): number {
  return DEBUG_SNAKE_SKILL_MAX_LEVELS[skillId];
}

export function snakeSkillCost(state: GameState, skillId: SnakeSkillId): number {
  const level = state.snakeSkills[skillId];
  switch (skillId) {
    case 'speed':
      return Math.round(25 * Math.pow(1.28, level));
    case 'automation':
      return Math.round(160 * Math.pow(1.42, level));
    case 'baseMultiplier':
      return Math.round(55 * Math.pow(1.22, level));
    case 'bonusFruit':
      return Math.round(220 * Math.pow(2.2, level));
    case 'extraLife':
      return Math.round(320 * Math.pow(2.4, level));
    case 'edgeWrap':
      return Math.round(900 * Math.pow(2, level));
  }
}

export function runeTypingCurrentWord(state: GameState): string {
  return runeWords[state.runeTyping.wordIndex % runeWords.length];
}

export function runeTypingRewardPreview(state: GameState): number {
  const typing = state.runeTyping;
  if (typing.currentWordHadMistake || typing.penaltyWordsRemaining > 0) {
    return 1;
  }
  return 1 + Math.min(4, Math.floor(typing.combo / 5));
}

function typeRuneKey(state: GameState, rawKey: string): void {
  if (!state.books.typing.unlocked || !isBookPanelOpen(state, 'typing')) {
    return;
  }

  const typing = state.runeTyping;
  typing.lastReward = 0;

  if (rawKey === 'Backspace') {
    typing.typed = typing.typed.slice(0, -1);
    typing.lastFeedback = 'idle';
    return;
  }

  const key = rawKey.toLowerCase();
  if (!/^[a-z]$/.test(key)) {
    return;
  }

  const word = runeTypingCurrentWord(state);
  const expected = word[typing.typed.length];
  if (key !== expected) {
    typing.currentWordHadMistake = true;
    typing.combo = 0;
    typing.penaltyWordsRemaining = Math.max(typing.penaltyWordsRemaining, 3);
    typing.lastFeedback = 'mistake';
    return;
  }

  typing.typed += key;
  typing.lastFeedback = 'correct';
  if (typing.typed.length >= word.length) {
    completeRuneWord(state, word);
  }
}

function completeRuneWord(state: GameState, completedWord: string): void {
  const typing = state.runeTyping;
  const wasPerfect = !typing.currentWordHadMistake;
  const reward = runeTypingRewardPreview(state);

  state.resources.runes += reward;
  typing.lastReward = reward;
  typing.lastCompletedWord = completedWord;
  typing.completedWords += 1;

  if (wasPerfect) {
    typing.combo += 1;
    typing.penaltyWordsRemaining = Math.max(0, typing.penaltyWordsRemaining - 1);
  } else {
    typing.combo = 0;
    typing.penaltyWordsRemaining = Math.max(typing.penaltyWordsRemaining, 3);
  }

  typing.wordIndex = (typing.wordIndex + 1) % runeWords.length;
  typing.typed = '';
  typing.currentWordHadMistake = false;
  typing.lastFeedback = 'complete';
}

function buySnakeSkill(state: GameState, skillId: SnakeSkillId): void {
  const maxLevel = snakeSkillMaxLevel(skillId);
  if (state.snakeSkills[skillId] >= maxLevel) {
    return;
  }

  const cost = snakeSkillCost(state, skillId);
  if (state.mana < cost) {
    return;
  }

  state.mana -= cost;
  state.snakeSkills[skillId] += 1;
  if (skillId === 'automation') {
    state.snakeSkills.automationEnabled = true;
  }
  if (skillId === 'bonusFruit' && !state.snake.bonusFood) {
    state.snake.bonusFood = nextBonusFood(state);
  }
}

function toggleSnakeAutomation(state: GameState): void {
  if (!state.books.serpent.unlocked || state.snakeSkills.automation <= 0) {
    return;
  }
  state.snakeSkills.automationEnabled = !state.snakeSkills.automationEnabled;
}

function buyManaSkill(state: GameState, skillId: ManaSkillId): void {
  const maxLevel = manaSkillMaxLevel(skillId);
  if (maxLevel !== null && state.manaSkills[skillId] >= maxLevel) {
    return;
  }

  const cost = manaSkillCost(state, skillId);
  if (state.mana < cost) {
    return;
  }

  state.mana -= cost;
  state.manaSkills[skillId] += 1;
}

function maxManaSkills(state: GameState): void {
  state.manaSkills.power = DEBUG_MANA_SKILL_MAX_LEVELS.power;
  state.manaSkills.automation = DEBUG_MANA_SKILL_MAX_LEVELS.automation;
  state.manaSkills.criticalHit = DEBUG_MANA_SKILL_MAX_LEVELS.criticalHit;
  state.manaSkills.criticalEffect = DEBUG_MANA_SKILL_MAX_LEVELS.criticalEffect;
  state.manaSkills.extraWands = DEBUG_MANA_SKILL_MAX_LEVELS.extraWands;
  state.manaSkills.automationTimer = 0;
}

function resetManaSkills(state: GameState): void {
  state.manaSkills.power = 0;
  state.manaSkills.automation = 0;
  state.manaSkills.criticalHit = 0;
  state.manaSkills.criticalEffect = 0;
  state.manaSkills.extraWands = 0;
  state.manaSkills.automationTimer = 0;
  state.manaSkills.autoCastCount = 0;
}

function buyUpgrade(state: GameState, bookId: BookId): void {
  const book = state.books[bookId];
  if (!book.unlocked) {
    return;
  }

  const definition = getBook(bookId);
  const cost = Math.round(20 * Math.pow(1.55, book.level - 1));
  const resourceCost = Math.round(3 * Math.pow(1.35, book.level - 1));
  if (state.mana < cost) {
    return;
  }
  if (definition.resourceId && state.resources[definition.resourceId] < resourceCost) {
    return;
  }

  state.mana -= cost;
  if (definition.resourceId) {
    state.resources[definition.resourceId] -= resourceCost;
  }
  book.level += 1;
  if (book.level >= 2) {
    book.automation = Math.max(book.automation, 0.35);
  }
  if (book.level >= 4) {
    book.automation += 0.15;
  }
}

function togglePin(state: GameState, bookId: BookId): void {
  const book = state.books[bookId];
  if (!book.unlocked) {
    return;
  }
  const pinnedCount = Object.values(state.books).filter((candidate) => candidate.pinned).length;
  if (!book.pinned && pinnedCount >= 3) {
    return;
  }
  book.pinned = !book.pinned;
}

function unlockBook(state: GameState, bookId: BookId): void {
  const book = state.books[bookId];
  if (book.unlocked) {
    return;
  }

  const definition = getBook(bookId);
  if (state.mana < definition.unlockMana) {
    return;
  }
  if (definition.unlockResource && state.resources[definition.unlockResource.id] < definition.unlockResource.amount) {
    return;
  }

  state.mana -= definition.unlockMana;
  if (definition.unlockResource) {
    state.resources[definition.unlockResource.id] -= definition.unlockResource.amount;
  }
  book.unlocked = true;
  state.selectedBook = bookId;
  openBookPanel(state, bookId);
}

function openBookPanel(state: GameState, bookId: BookId): void {
  const existingPanel = state.openBookPanels.find((panel) => panel.bookId === bookId);
  if (existingPanel) {
    return;
  }

  const usedSlots = new Set(state.openBookPanels.map((panel) => panel.slot));
  const nextSlot: BookPanelSlot = usedSlots.has('right') ? 'left' : 'right';
  if (state.openBookPanels.length < 2) {
    state.openBookPanels.push({ bookId, slot: nextSlot });
    return;
  }

  const replaceIndex = Math.max(0, state.openBookPanels.findIndex((panel) => panel.bookId !== state.selectedBook));
  const releasedSlot = state.openBookPanels[replaceIndex]?.slot ?? nextSlot;
  state.openBookPanels.splice(replaceIndex, 1);
  state.openBookPanels.push({ bookId, slot: releasedSlot });
}

function closeBookPanel(state: GameState, bookId: BookId): void {
  state.openBookPanels = state.openBookPanels.filter((panel) => panel.bookId !== bookId);
  if (state.selectedBook === bookId && state.openBookPanels.length > 0) {
    state.selectedBook = state.openBookPanels[state.openBookPanels.length - 1].bookId;
  }
}

function moveBookPanel(state: GameState, bookId: BookId): void {
  const currentPanel = state.openBookPanels.find((panel) => panel.bookId === bookId);
  if (!currentPanel) {
    return;
  }

  const nextSlot: BookPanelSlot = currentPanel.slot === 'right' ? 'left' : 'right';
  const otherPanel = state.openBookPanels.find((panel) => panel.slot === nextSlot);
  if (otherPanel) {
    otherPanel.slot = currentPanel.slot;
  }
  currentPanel.slot = nextSlot;
}

function isBookPanelOpen(state: GameState, bookId: BookId): boolean {
  return state.openBookPanels.some((panel) => panel.bookId === bookId);
}

function snakeTurn(state: GameState, direction: SnakeDirection): void {
  const book = state.books.serpent;
  if (!book.unlocked) {
    return;
  }

  if (isOppositeDirection(state.snake.direction, direction)) {
    return;
  }

  state.snake.nextDirection = direction;
  state.snake.running = true;
}

function tickSnake(state: GameState, deltaSeconds: number): void {
  const book = state.books.serpent;
  const snake = state.snake;
  snake.lastReward = 0;
  snake.invincibleTimer = Math.max(0, snake.invincibleTimer - deltaSeconds);

  if (!book.unlocked || !isBookPanelOpen(state, 'serpent')) {
    return;
  }

  snake.running = true;
  snake.moveTimer += deltaSeconds;
  const moveEvery = snakeMoveInterval(state);
  if (snake.moveTimer < moveEvery) {
    return;
  }
  snake.moveTimer = 0;
  if (snakeAutomationActive(state)) {
    snake.nextDirection = automatedSnakeDirection(state) ?? snake.nextDirection;
  }
  advanceSnake(state);
}

function advanceSnake(state: GameState): void {
  const snake = state.snake;
  const direction = snake.nextDirection;
  const head = snake.body[0];
  const nextHead = nextSnakeHead(state, head, direction);

  if (isOutOfBounds(nextHead, snake.gridSize) || snake.body.some((cell) => cellsMatch(cell, nextHead))) {
    handleSnakeCollision(state);
    return;
  }

  snake.direction = direction;
  const ateFood = cellsMatch(nextHead, snake.food);
  const ateBonusFood = snake.bonusFood ? cellsMatch(nextHead, snake.bonusFood.cell) : false;
  snake.body = [nextHead, ...snake.body];

  if (ateFood || ateBonusFood) {
    const book = state.books.serpent;
    snake.comboSteps += 1;
    const bonusMultiplier = ateBonusFood && snake.bonusFood ? snakeBonusFruitMultiplier(snake.bonusFood.type) : 0;
    const rewardMultiplier = snakeBaseMultiplier(state) * snakeComboMultiplier(state) + bonusMultiplier;
    const reward = Math.max(1, Math.round((1 + Math.floor(book.level * 0.4)) * rewardMultiplier));
    snake.score += reward;
    snake.best = Math.max(snake.best, snake.score);
    snake.lastReward = reward;
    state.resources.scales += reward;
    state.mana += 1 + book.level * 0.25;
    if (ateFood) {
      snake.food = randomSnakeFood(excludedSnakeFoodCells(state), snake.gridSize);
    }
    if (ateBonusFood) {
      snake.bonusFood = nextBonusFood(state);
    } else if (!snake.bonusFood) {
      snake.bonusFood = nextBonusFood(state);
    }
    return;
  }

  snake.body.pop();
}

function handleSnakeCollision(state: GameState): void {
  const snake = state.snake;
  if (snake.invincibleTimer > 0) {
    return;
  }
  if (snakeExtraLivesRemaining(state) > 0) {
    snake.extraLivesUsed += 1;
    snake.invincibleTimer = 2;
    return;
  }
  resetSnakeRun(state);
}

function resetSnakeRun(state: GameState): void {
  const snake = state.snake;
  snake.score = 0;
  snake.comboSteps = 0;
  snake.extraLivesUsed = 0;
  snake.invincibleTimer = 0;
  snake.body = createStartingSnakeBody();
  snake.direction = 'right';
  snake.nextDirection = 'right';
  snake.food = randomSnakeFood(snake.body, snake.gridSize);
  snake.bonusFood = nextBonusFood(state);
  snake.moveTimer = 0;
  snake.running = true;
  snake.lastReward = 0;
}

function nextSnakeHead(state: GameState, cell: SnakeCell, direction: SnakeDirection): SnakeCell {
  const next = nextCell(cell, direction);
  if (state.snakeSkills.edgeWrap <= 0 || !isOutOfBounds(next, state.snake.gridSize)) {
    return next;
  }

  return {
    x: (next.x + state.snake.gridSize) % state.snake.gridSize,
    y: (next.y + state.snake.gridSize) % state.snake.gridSize,
  };
}

function nextCell(cell: SnakeCell, direction: SnakeDirection): SnakeCell {
  switch (direction) {
    case 'up':
      return { x: cell.x, y: cell.y - 1 };
    case 'right':
      return { x: cell.x + 1, y: cell.y };
    case 'down':
      return { x: cell.x, y: cell.y + 1 };
    case 'left':
      return { x: cell.x - 1, y: cell.y };
  }
}

function isOutOfBounds(cell: SnakeCell, gridSize: number): boolean {
  return cell.x < 0 || cell.y < 0 || cell.x >= gridSize || cell.y >= gridSize;
}

function cellsMatch(first: SnakeCell, second: SnakeCell): boolean {
  return first.x === second.x && first.y === second.y;
}

function nextBonusFood(state: GameState): GameState['snake']['bonusFood'] {
  const type = snakeBonusFruitType(state);
  if (!type) {
    return null;
  }
  return {
    type,
    cell: randomSnakeFood(excludedSnakeFoodCells(state), state.snake.gridSize),
  };
}

function snakeBonusFruitType(state: GameState): SnakeBonusFruitType | null {
  if (state.snakeSkills.bonusFruit >= 3) {
    return 'banana';
  }
  if (state.snakeSkills.bonusFruit >= 2) {
    return 'pear';
  }
  if (state.snakeSkills.bonusFruit >= 1) {
    return 'orange';
  }
  return null;
}

function excludedSnakeFoodCells(state: GameState): SnakeCell[] {
  return state.snake.bonusFood ? [...state.snake.body, state.snake.food, state.snake.bonusFood.cell] : [...state.snake.body, state.snake.food];
}

function isOppositeDirection(current: SnakeDirection, next: SnakeDirection): boolean {
  return (
    (current === 'up' && next === 'down') ||
    (current === 'down' && next === 'up') ||
    (current === 'left' && next === 'right') ||
    (current === 'right' && next === 'left')
  );
}

function automatedSnakeDirection(state: GameState): SnakeDirection | null {
  const snake = state.snake;
  const head = snake.body[0];
  const target = snake.bonusFood?.cell ?? snake.food;
  const candidates: SnakeDirection[] = ['up', 'right', 'down', 'left'];
  let best: { direction: SnakeDirection; distance: number } | null = null;

  for (const direction of candidates) {
    if (isOppositeDirection(snake.direction, direction)) {
      continue;
    }

    const next = nextSnakeHead(state, head, direction);
    if (isOutOfBounds(next, snake.gridSize) || snake.body.some((cell) => cellsMatch(cell, next))) {
      continue;
    }

    const distance = Math.abs(next.x - target.x) + Math.abs(next.y - target.y);
    if (!best || distance < best.distance) {
      best = { direction, distance };
    }
  }

  return best?.direction ?? null;
}

function grantDebugResources(state: GameState): void {
  state.mana += 999;
  state.resources.scales += 999;
  state.resources.runes += 999;
  state.resources.spores += 999;
}
