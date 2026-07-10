import { books, getBook, type BookId } from '../game/content/books';
import {
  hasDefenseTiledMap,
  loadDefenseTiledMap,
  renderDefenseTiledForeground,
  renderDefenseTiledTerrain,
} from '../game/content/tdTiledMap';
import { defenseEnemyPosition, defenseEnemyVisibleCenter, type DefensePoint } from '../game/simulation/defenseRules';
import { gameStore } from '../game/store';
import {
  blackjackCardLabel,
  blackjackAutoDealUnlocked,
  blackjackCanDecreaseBaseBet,
  blackjackCanBuyUpgradeCell,
  blackjackCanBuyAutoDeal,
  blackjackCanDeal,
  blackjackCanDouble,
  blackjackCanIncreaseBaseBet,
  blackjackCanSplit,
  blackjackCurrentActionMaxLevel,
  blackjackCurrentActionUpgradeCost,
  blackjackCurrentBonusMaxLevel,
  blackjackCurrentBonusUnlockCost,
  blackjackCurrentBonusUpgradeCost,
  blackjackCurrentUpgradeCellCost,
  blackjackCurrentUpgradeCellEffectLabel,
  blackjackCurrentUpgradeCellMaxLevel,
  blackjackCurrentUpgradeCellTier,
  blackjackCurrentMainBet,
  blackjackCurrentWinPayoutMultiplier,
  blackjackHandValue,
  blackjackResultSummary,
  blackjackUpgradeCellLevel,
  blackjackVisibleDealerValue,
  defenseDamageMultiplier,
  manaAutomationInterval,
  manaCriticalMultiplier,
  manaSkillCost,
  manaSkillMaxLevel,
  manaWandCount,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseEnemyReward,
  defenseGoldMultiplier,
  defenseIceActive,
  defenseIceAttackInterval,
  defenseIceDamage,
  defenseIceRange,
  defenseIceRangePercent,
  defenseIceSlow,
  defenseLightningAttackInterval,
  defenseLightningDamage,
  defenseLightningTargetCount,
  defenseMaxTowerHealth,
  defenseSkillCost,
  defenseSkillLocked,
  defenseSkillMaxLevel,
  defenseTowerHealthRegenPerSecond,
  defenseTowerRange,
  defenseTowerRangePercent,
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
  type DefenseSkillId,
  type ManaSkillId,
  type BlackjackUpgradeCellId,
  type BlackjackUpgradeCost,
  type BlackjackSideBonusId,
  type MiningSkillId,
  type SnakeSkillId,
} from '../game/simulation/actions';
import { blackjackMainBet } from '../game/simulation/blackjackRules';
import type { HundredOptionId } from '../game/simulation/hundredRules';
import {
  targetAttackDamage,
  targetAutomationInterval,
  targetMaxActiveTargets,
  targetSpawnInterval,
  type TargetSkillId,
} from '../game/simulation/targetRules';
import type { SlimeTrainerCommandId } from '../game/simulation/slimeTrainerRules';
import { syncMiningThreeTerrain } from './miningThreeTerrain';
import {
  MINING_MATERIAL_RESOURCE_IDS,
  miningBlockMaterialById,
  type BlackjackCard,
  type BookPanelSlot,
  type GameState,
  type SnakeCell,
  type SnakeDirection,
} from '../game/simulation/state';

let rootElement: HTMLDivElement | null = null;
const DEFENSE_WAVE_MARKER_STEP_PERCENT = 24;
const DEFENSE_WAVE_RAIL_STEP_PERCENT = 33;
let openUpgradePanel: BookId | null = null;
let upgradePanelMode: 'detail' | 'compact' = 'detail';
let defenseSkillShopTab: DefenseSkillShopTabId = 'attack';
let lastRenderSignature = '';
let lastOpenPanelsSignature = '';
let lastOpenUpgradePanel: BookId | null = null;
let lastUpgradePanelMode: 'detail' | 'compact' = 'detail';
let lastRenderStructureSignature = '';
let lastSnakeRewardMarker = '';
let lastRuneTypingRewardMarker = '';
let lastRenderStableSignature = '';
let lastMiningSkillDockSignature = '';
let lastBlackjackRewardMarker = '';
let lastHundredRewardMarker = '';
let lastTargetRewardMarker = '';
let lastMiningRewardMarker = '';
let lastSlimeTrainerRewardMarker = '';
let lastBlackjackRenderedRound = -1;
let lastBlackjackRenderedHands: Record<'dealer' | 'player' | 'split', string[]> = { dealer: [], player: [], split: [] };
let lastBlackjackMotionSignature = '';
let blackjackMotionSettlesAt = 0;
let blackjackScoreRevealTimeout: number | null = null;
let lastBlackjackSettledDisplay: BlackjackDisplayState | null = null;
let blackjackAutoDealTimeout: number | null = null;
let blackjackAutoDealMarker = '';
let blackjackDealerStepTimeout: number | null = null;
let blackjackDealerStepMarker = '';
let lastManaAutoCastCount = 0;
let manaClickEffectFlip = false;
let manaClickTimestamps: number[] = [];
let manaClickScaleResetTimeout: number | null = null;
let wandCastEffectFlip = false;
let lastHundredDisplayedProgress = 0;
let lastHundredProgressAnimationMarker = '';
let pendingHundredProgressAnimationMarker = '';
let hundredProgressSettleTimeout: number | null = null;
let activeHundredProgressTarget: number | null = null;
let lastDefenseDisplayedHealth: number | null = null;
let lastDefenseDisplayedSigils: number | null = null;
let lastDefenseSkillDockSignature = '';
const defenseEnemyHealthSnapshots = new Map<string, number>();
const dynamicResourceGainSnapshots = new Map<string, number>();
const DEFENSE_SLIME_WALK_CYCLE_MS = 1586;
let snakeControlsInstalled = false;
let typingControlsInstalled = false;
let blackjackControlsInstalled = false;
let defenseControlsInstalled = false;
let panelSizeControlsInstalled = false;
let escapeControlsInstalled = false;
let suppressClickListenerInstalled = false;
let oneShotHoverListenerInstalled = false;
let suppressNextPanelClickUntil = 0;
let activePanelInteractionCount = 0;
const FLOATING_GAIN_MAX_VISIBLE = 18;
const FLOATING_GAIN_FLUSH_MS = 80;
const CRYSTAL_CLICK_RATE_WINDOW_MS = 1000;
const CRYSTAL_CLICK_RATE_FOR_MAX_SHAKE = 10;
const CRYSTAL_CLICK_SCALE_RESET_MS = 1500;
const CRYSTAL_CLICK_SCALE_CLICKS_FOR_MAX = 100;
const BLACKJACK_CARD_RECEIVE_MS = 760;
const BLACKJACK_CARD_STAGGER_MS = 150;
const BLACKJACK_SCORE_REVEAL_BUFFER_MS = 180;
const pendingFloatingGains = new Map<string, { amount: number; className?: string }>();
let floatingGainFlushHandle: number | null = null;
const activeOneShotHoverKeys = new Set<string>();
const activeOneShotHoverElements = new Set<HTMLElement>();
const BOOK_PANEL_ASPECT_RATIO = 210 / 297;
const BOOK_PANEL_MIN_HORIZONTAL_TRAVEL = 96;
const BOOK_PANEL_SIZE_PRESETS = [
  { id: 'small', label: 'S', width: 245 },
  { id: 'medium', label: 'M', width: 370 },
  { id: 'large', label: 'L', width: 496 },
] as const;
const DEFENSE_MEDIUM_PANEL_SCALE = 0.8;
const DEFENSE_LARGE_PANEL_SCALE = 0.9;
type BookPanelSizePreset = (typeof BOOK_PANEL_SIZE_PRESETS)[number];
type BookPanelSizePresetId = BookPanelSizePreset['id'];
interface BlackjackDisplayState {
  chips: number;
  stake: number;
  debt: number;
  scoresVisible: boolean;
  dealerScore: string;
  playerScore: string;
  splitScore: string;
}
const BLACKJACK_CHIP_DENOMINATIONS = [100, 10, 5, 1] as const;
type BlackjackChipDenomination = (typeof BLACKJACK_CHIP_DENOMINATIONS)[number];
const BLACKJACK_WAGER_TRAY_DENOMINATIONS: BlackjackChipDenomination[] = [1, 5, 10, 100];
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
  installDefenseControls();
  installPanelSizeControls();
  installEscapeControls();
  gameStore.subscribe(renderHud);
  void loadDefenseTiledMap().then(() => {
    lastRenderSignature = '';
    lastRenderStableSignature = '';
    lastRenderStructureSignature = '';
    renderHud(gameStore.snapshot, { forceFull: true });
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

function renderHud(state: GameState, options: { forceFull?: boolean } = {}): void {
  if (!rootElement) {
    return;
  }

  if (activePanelInteractionCount > 0) {
    updateDynamicHudValues(state);
    return;
  }

  const signature = createHudSignature(state);
  const stableSignature = createHudSignature(state, { includeDefenseVolatile: false });
  const structureSignature = createHudStructureSignature(state);
  pruneOneShotHoverState();
  if (!options.forceFull && shouldPatchOpenDefensePanel(state, structureSignature)) {
    lastRenderSignature = signature;
    lastRenderStableSignature = stableSignature;
    updateDynamicHudValues(state);
    runHudTransientEffects(state);
    scheduleBlackjackAutoDeal(state);
    return;
  }
  if (!options.forceFull && shouldPatchOpenMiningPanel(state, structureSignature)) {
    lastRenderSignature = signature;
    lastRenderStableSignature = stableSignature;
    refreshMiningBoard(state);
    refreshMiningSkillDock(state);
    updateDynamicHudValues(state);
    runHudTransientEffects(state);
    scheduleBlackjackAutoDeal(state);
    return;
  }
  if (!options.forceFull && activeOneShotHoverKeys.size > 0 && stableSignature === lastRenderStableSignature) {
    updateDynamicHudValues(state);
    runHudTransientEffects(state);
    scheduleBlackjackAutoDeal(state);
    return;
  }
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
  lastRenderStableSignature = stableSignature;
  lastRenderStructureSignature = structureSignature;
  lastOpenPanelsSignature = openPanelsSignature;
  lastOpenUpgradePanel = openUpgradePanel;
  lastUpgradePanelMode = upgradePanelMode;

  rootElement.innerHTML = `
    <div class="screen-vignette"></div>
    <button class="unlock-all-grimoires-button" data-action="unlockAllBooks" title="Debloquer tous les grimoires" aria-label="Debloquer tous les grimoires">-</button>
    ${state.openBookPanels
      .map((panel) =>
        bookOverlay(
          panel.bookId,
          panel.slot,
          state,
          !previousOpenBookIds.has(panel.bookId),
          shouldAnimateUpgradePanel,
          state.openBookPanels.length === 1,
        ),
      )
      .join('')}
  `;

  if (!suppressClickListenerInstalled) {
    suppressClickListenerInstalled = true;
    rootElement.addEventListener('click', suppressPanelClickAfterDrag, true);
  }
  installOneShotHoverAnimations();

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
      if (action === 'buyDefenseSkill') {
        const skillId = button.dataset.skillId as DefenseSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buyDefenseSkill', skillId });
          refreshDefenseSkillDock(gameStore.snapshot, { force: true });
        }
      }
      if (action === 'setDefenseSkillShopTab') {
        const tabId = button.dataset.skillShopTab;
        if (isDefenseSkillShopTabId(tabId)) {
          defenseSkillShopTab = tabId;
          refreshDefenseSkillDock(gameStore.snapshot, { force: true });
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
      if (action === 'unlockBlackjackBonus') {
        const bonusId = button.dataset.bonusId as BlackjackSideBonusId | undefined;
        if (bonusId && button.getAttribute('aria-disabled') !== 'true') {
          gameStore.dispatch({ type: 'unlockBlackjackBonus', bonusId });
        }
      }
      if (action === 'buyBlackjackBonusUpgrade') {
        const bonusId = button.dataset.bonusId as BlackjackSideBonusId | undefined;
        if (bonusId && button.getAttribute('aria-disabled') !== 'true') {
          const targetLevel = Number(button.dataset.targetLevel || 0);
          if (targetLevel > 0) {
            if (!gameStore.snapshot.blackjack[bonusId].unlocked) {
              gameStore.dispatch({ type: 'unlockBlackjackBonus', bonusId });
            }
            while (
              gameStore.snapshot.blackjack[bonusId].unlocked &&
              gameStore.snapshot.blackjack[bonusId].level < targetLevel
            ) {
              const beforeLevel = gameStore.snapshot.blackjack[bonusId].level;
              gameStore.dispatch({ type: 'buyBlackjackBonusUpgrade', bonusId });
              if (gameStore.snapshot.blackjack[bonusId].level === beforeLevel) {
                break;
              }
            }
          } else {
            gameStore.dispatch({ type: 'buyBlackjackBonusUpgrade', bonusId });
          }
        }
      }
      if (action === 'buyBlackjackActionUpgrade' && button.getAttribute('aria-disabled') !== 'true') {
        const targetLevel = Number(button.dataset.targetLevel || 0);
        if (targetLevel > 0) {
          while (gameStore.snapshot.blackjack.actions.level < targetLevel) {
            const beforeLevel = gameStore.snapshot.blackjack.actions.level;
            gameStore.dispatch({ type: 'buyBlackjackActionUpgrade' });
            if (gameStore.snapshot.blackjack.actions.level === beforeLevel) {
              break;
            }
          }
        } else {
          gameStore.dispatch({ type: 'buyBlackjackActionUpgrade' });
        }
      }
      if (action === 'buyBlackjackUpgradeCell' && button.getAttribute('aria-disabled') !== 'true') {
        const cellId = button.dataset.cellId as BlackjackUpgradeCellId | undefined;
        if (cellId) {
          gameStore.dispatch({ type: 'buyBlackjackUpgradeCell', cellId });
        }
      }
      if (action === 'toggleBlackjackBonusAuto') {
        const bonusId = button.dataset.bonusId as BlackjackSideBonusId | undefined;
        if (bonusId) {
          gameStore.dispatch({ type: 'toggleBlackjackBonusAuto', bonusId });
        }
      }
      if (action === 'activateBlackjackBonus') {
        const bonusId = button.dataset.bonusId as BlackjackSideBonusId | undefined;
        if (bonusId) {
          gameStore.dispatch({ type: 'activateBlackjackBonus', bonusId });
        }
      }
      if (action === 'prepareBlackjackWager') {
        const amount = Number(button.dataset.wagerAmount || 0);
        if (amount > 0) {
          showBlackjackWagerChipFlight(button, amount);
          gameStore.dispatch({ type: 'prepareBlackjackWager', amount });
        }
      }
      if (action === 'resetBlackjackWager') {
        gameStore.dispatch({ type: 'resetBlackjackWager' });
      }
      if (action === 'increaseBlackjackBaseBet') {
        gameStore.dispatch({ type: 'increaseBlackjackBaseBet' });
      }
      if (action === 'decreaseBlackjackBaseBet') {
        gameStore.dispatch({ type: 'decreaseBlackjackBaseBet' });
      }
      if (action === 'buyBlackjackAutoDeal') {
        gameStore.dispatch({ type: 'buyBlackjackAutoDeal' });
      }
      if (action === 'buyBlackjackWagerUpgrade') {
        const targetLevel = Number(button.dataset.targetLevel || 0);
        if (targetLevel > 0) {
          while (gameStore.snapshot.books.blackjack.level < targetLevel) {
            const beforeLevel = gameStore.snapshot.books.blackjack.level;
            gameStore.dispatch({ type: 'buyUpgrade', bookId: 'blackjack' });
            if (gameStore.snapshot.books.blackjack.level === beforeLevel) {
              break;
            }
          }
        } else {
          gameStore.dispatch({ type: 'buyUpgrade', bookId: 'blackjack' });
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
      if (action === 'doubleBlackjack') {
        gameStore.dispatch({ type: 'doubleBlackjack' });
      }
      if (action === 'splitBlackjack') {
        gameStore.dispatch({ type: 'splitBlackjack' });
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
      if (action === 'exchangeMiningMaterials') {
        gameStore.dispatch({ type: 'exchangeMiningMaterials' });
      }
      if (action === 'trainSlime') {
        const commandId = button.dataset.commandId as SlimeTrainerCommandId | undefined;
        if (commandId) {
          gameStore.dispatch({ type: 'trainSlime', commandId });
        }
      }
      if (action === 'cycleDefenseSpeed') {
        gameStore.dispatch({ type: 'cycleDefenseSpeed' });
      }
      if (action === 'setDefenseWaveDelta') {
        const delta = Number(button.dataset.waveDelta || 0);
        if (Number.isFinite(delta)) {
          gameStore.dispatch({ type: 'setDefenseWave', wave: gameStore.snapshot.defense.wave + delta });
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
      if (action === 'unlockAllBooks') {
        gameStore.dispatch({ type: 'unlockAllBooks' });
      }
    });
  });

  rootElement.querySelectorAll<HTMLInputElement>('[data-defense-wave-input]').forEach((input) => {
    input.addEventListener('change', () => {
      setDefenseWaveFromInput(input);
    });
    input.addEventListener('keydown', (event) => {
      event.stopPropagation();
      if (event.key === 'Enter') {
        event.preventDefault();
        setDefenseWaveFromInput(input);
        input.blur();
      }
    });
  });

  rootElement.querySelectorAll<HTMLElement>('.book-overlay, .mini-skill-popover, .upgrade-panel').forEach((panel) => {
    panel.addEventListener('pointerdown', stopHudPointerEvent);
    panel.addEventListener('pointerup', stopHudPointerEvent);
    panel.addEventListener('click', stopHudPointerEvent);
  });
  installBookPanelFocus();
  installBookPanelDragging();
  refreshMiningBoard(state);
  refreshMiningSkillDock(state, { force: true });

  updateDynamicHudValues(state);
  runHudTransientEffects(state);
  scheduleBlackjackAutoDeal(state);
  scheduleBlackjackDealerStep(state);
}

function setDefenseWaveFromInput(input: HTMLInputElement): void {
  const wave = Number(input.value);
  if (!Number.isFinite(wave)) {
    input.value = String(gameStore.snapshot.defense.wave);
    return;
  }
  gameStore.dispatch({ type: 'setDefenseWave', wave });
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

  if (isBookPanelOpen(state, 'blackjack') && state.blackjack.lastReward > 0 && !blackjackMotionIsSettling()) {
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
    const marker = `${state.mining.totalMined}:${state.mining.lastBrokenDepth}:${state.mining.hitPulse}`;
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
    blackjackAutoDealUnlocked(state) &&
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
      blackjackAutoDealUnlocked(current) &&
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

function scheduleBlackjackDealerStep(state: GameState): void {
  const shouldStep = isBookPanelOpen(state, 'blackjack') && state.blackjack.phase === 'dealer';
  const marker = [
    state.blackjack.round,
    state.blackjack.dealerCardRevealed ? 1 : 0,
    state.blackjack.dealerHand.map(blackjackCardLabel).join(','),
  ].join(':');

  if (!shouldStep) {
    clearBlackjackDealerStep();
    return;
  }

  if (blackjackDealerStepTimeout !== null && blackjackDealerStepMarker === marker) {
    return;
  }

  clearBlackjackDealerStep();
  blackjackDealerStepMarker = marker;
  const delay = Math.max(0, blackjackMotionSettlesAt - Date.now() + 140);
  blackjackDealerStepTimeout = window.setTimeout(() => {
    blackjackDealerStepTimeout = null;
    blackjackDealerStepMarker = '';
    const current = gameStore.snapshot;
    const currentMarker = [
      current.blackjack.round,
      current.blackjack.dealerCardRevealed ? 1 : 0,
      current.blackjack.dealerHand.map(blackjackCardLabel).join(','),
    ].join(':');
    if (isBookPanelOpen(current, 'blackjack') && current.blackjack.phase === 'dealer' && currentMarker === marker) {
      gameStore.dispatch({ type: 'advanceBlackjackDealer' });
    }
  }, delay);
}

function clearBlackjackDealerStep(): void {
  if (blackjackDealerStepTimeout === null) {
    blackjackDealerStepMarker = '';
    return;
  }
  window.clearTimeout(blackjackDealerStepTimeout);
  blackjackDealerStepTimeout = null;
  blackjackDealerStepMarker = '';
}

function updateDynamicHudValues(state: GameState): void {
  const currentMana = Math.floor(state.mana);
  setDynamicText('mana', currentMana);
  setDynamicText('mana-panel-total', compactHudNumber(state.mana));
  setDynamicText('mana-panel-rate', formatManaPerSecond(manaPerSecond(state)));
  trackDynamicResourceGain('mana-panel-total', currentMana);
  setDynamicResourceText('scales', Math.floor(state.resources.scales));
  setDynamicResourceText('runes', Math.floor(state.resources.runes));
  setDynamicResourceText('spores', Math.floor(state.resources.spores));
  setDynamicResourceText('sigils', Math.floor(state.resources.sigils));
  const displayedChips =
    isBookPanelOpen(state, 'blackjack') && blackjackMotionIsSettling() && lastBlackjackSettledDisplay
      ? lastBlackjackSettledDisplay.chips
      : Math.floor(state.resources.chips);
  setDynamicResourceText('chips', displayedChips);
  setDynamicResourceText('fragments', Math.floor(state.resources.fragments));
  setDynamicResourceText('marks', Math.floor(state.resources.marks));
  setDynamicResourceText('minerals', Math.floor(state.resources.minerals));
  setDynamicResourceText('gels', Math.floor(state.resources.gels));
  setDynamicText('snake-score', state.snake.score);
  setDynamicText('snake-best', state.snake.best);
  setDynamicText('target-score', state.targets.score);
  setDynamicText('target-best', state.targets.best);
  setDynamicText('typing-reward', runeTypingRewardPreview(state));
  setDynamicText('typing-combo', state.runeTyping.combo);
  setDynamicText('typing-penalty', state.runeTyping.penaltyWordsRemaining);
  animateHundredProgress(state);
  updateDynamicDefensePanel(state);
}

function defenseHealthPercent(state: GameState): number {
  return Math.max(0, Math.min(100, (state.defense.towerHealth / defenseMaxTowerHealth(state)) * 100));
}

function defenseHpSpriteFrame(healthPercent: number): number {
  if (healthPercent >= 100) {
    return 0;
  }
  if (healthPercent <= 0) {
    return 69;
  }
  return Math.max(0, Math.min(69, Math.round((1 - healthPercent / 100) * 69)));
}

function defenseHpSpriteStyle(healthPercent: number): string {
  return `--defense-hp-offset:${defenseHpSpriteFrame(healthPercent) * -71}px`;
}

function defenseHealthToneClass(healthPercent: number): string {
  if (healthPercent <= 30) {
    return 'is-danger';
  }
  if (healthPercent <= 60) {
    return 'is-warn';
  }
  return '';
}

function compactHudNumber(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000) {
    return `${Math.floor(value / 100_000) / 10}M`;
  }
  if (absolute >= 10_000) {
    return `${Math.floor(value / 100) / 10}k`;
  }
  return String(Math.floor(value));
}

function defenseWaveRailProgress(state: GameState, wave: number): number {
  const progress = wave >= 100 ? 0 : Math.min(1, Math.max(0, defenseWaveProgress(state)));
  return wave === 1 ? Math.min(0.92, progress) : progress;
}

function updateDynamicDefensePanel(state: GameState): void {
  if (!rootElement || !isBookPanelOpen(state, 'defense')) {
    lastDefenseDisplayedHealth = null;
    lastDefenseDisplayedSigils = null;
    defenseEnemyHealthSnapshots.clear();
    return;
  }

  const healthPercent = defenseHealthPercent(state);
  const maxHealth = defenseMaxTowerHealth(state);
  const currentHealth = Math.ceil(state.defense.towerHealth);
  const currentSigils = Math.floor(state.resources.sigils);
  const currentWave = Math.min(100, Math.max(1, state.defense.wave));
  const healthToneClass = defenseHealthToneClass(healthPercent);
  const defensePanelElement = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-panel');
  const healthHud = rootElement.querySelector<HTMLElement>('.defense-hud-health');
  const moneyHud = rootElement.querySelector<HTMLElement>('.defense-hud-money');
  const moneyValue = rootElement.querySelector<HTMLElement>('[data-dynamic-value="defense-money"]');
  let waveRail = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-wave');
  if (defensePanelElement && lastDefenseDisplayedHealth !== null && currentHealth < lastDefenseDisplayedHealth) {
    restartOneShotClass(defensePanelElement, 'is-damage-shaking');
    if (healthHud) {
      restartOneShotClass(healthHud, 'is-damage-shaking');
    }
  }
  defensePanelElement?.classList.toggle('is-paused', state.defense.paused);
  defensePanelElement?.style.setProperty('--defense-time-scale', defenseTimeScale(state.defense.speedMultiplier));
  const speedToggle = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-speed-toggle');
  if (speedToggle) {
    speedToggle.classList.toggle('is-paused', state.defense.paused);
    speedToggle.textContent = `x${state.defense.speedMultiplier}`;
  }
  if (lastDefenseDisplayedSigils !== null && currentSigils > lastDefenseDisplayedSigils) {
    if (moneyHud && moneyValue) {
      playDefenseMoneyCounterPulse(moneyHud, moneyValue);
    }
  }
  lastDefenseDisplayedHealth = currentHealth;
  lastDefenseDisplayedSigils = currentSigils;
  updateDynamicDefenseSkillCards(state);
  refreshDefenseSkillDock(state);
  if (healthHud) {
    healthHud.classList.toggle('is-warn', healthToneClass === 'is-warn');
    healthHud.classList.toggle('is-danger', healthToneClass === 'is-danger');
    healthHud.setAttribute('aria-label', `HP ${currentHealth}/${maxHealth}`);
    healthHud.setAttribute('title', `HP ${currentHealth}/${maxHealth}`);
    healthHud.querySelector<HTMLElement>('[data-defense-hp-sprite]')?.style.setProperty(
      '--defense-hp-offset',
      `${defenseHpSpriteFrame(healthPercent) * -71}px`,
    );
  }
  setDynamicText('defense-health-value', currentHealth);
  setDynamicText('defense-wave', state.defense.wave);
  setDynamicText('defense-money', compactHudNumber(currentSigils));
  const waveInput = rootElement.querySelector<HTMLInputElement>('[data-defense-wave-input]');
  if (waveInput && document.activeElement !== waveInput) {
    waveInput.value = String(currentWave);
  }

  const healthBar = rootElement.querySelector<HTMLElement>('.defense-health');
  const healthFill = rootElement.querySelector<HTMLElement>('.defense-health i');
  const rangeElement = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-range');
  rangeElement?.style.setProperty('--defense-range-scale', defenseTowerRange(state).toFixed(3));
  syncDefenseIceAura(state);
  if (healthBar) {
    healthBar.classList.toggle('is-full', healthPercent >= 100);
  }
  if (healthFill) {
    healthFill.style.width = `${healthPercent}%`;
  }

  if (waveRail?.dataset.defenseWave !== String(currentWave)) {
    waveRail?.insertAdjacentHTML('afterend', defenseWaveRail(state));
    waveRail?.remove();
    waveRail = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-wave');
  }

  if (waveRail) {
    const waveProgress = defenseWaveRailProgress(state, currentWave);
    const waveSlide = waveProgress * DEFENSE_WAVE_MARKER_STEP_PERCENT;
    const waveFillProgress = waveProgress * DEFENSE_WAVE_RAIL_STEP_PERCENT;
    const waveFillLeft = currentWave === 1 ? 50 - waveFillProgress : 50 - DEFENSE_WAVE_RAIL_STEP_PERCENT;
    const waveFillWidth = currentWave === 1 ? waveFillProgress : DEFENSE_WAVE_RAIL_STEP_PERCENT;
    waveRail.style.setProperty('--wave-slide', `${waveSlide.toFixed(3)}%`);
    waveRail.style.setProperty('--wave-rail-step', `${DEFENSE_WAVE_RAIL_STEP_PERCENT.toFixed(3)}%`);
    waveRail.style.setProperty('--wave-fill-left', `${waveFillLeft.toFixed(3)}%`);
    waveRail.style.setProperty('--wave-fill-width', `${waveFillWidth.toFixed(3)}%`);
    waveRail.style.setProperty('--wave-fill-opacity', currentWave === 1 && waveProgress <= 0.001 ? '0' : '1');
  }

  const actorsLayer = rootElement.querySelector<HTMLElement>('.defense-actors');
  if (!actorsLayer) {
    return;
  }

  const liveEnemyIds = new Set<string>();
  const sortableEnemyIds = new Set<string>();
  const visualEnemyPositions = new Map<number, DefensePoint>();
  const enemyLayerOrder: Array<{ id: string; y: number }> = [];
  for (const enemy of state.defense.enemies) {
    const enemyId = String(enemy.id);
    liveEnemyIds.add(enemyId);
    let healthBarElement = actorsLayer.querySelector<HTMLElement>(`.defense-enemy-health-bar[data-enemy-id="${enemyId}"]`);
    let enemyElement = actorsLayer.querySelector<HTMLElement>(`.defense-enemy[data-enemy-id="${enemyId}"]`);
    if (!healthBarElement) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseEnemyHealthBarMarkup(enemy));
      healthBarElement = actorsLayer.querySelector<HTMLElement>(`.defense-enemy-health-bar[data-enemy-id="${enemyId}"]`);
    }
    if (!enemyElement) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseEnemyMarkup(enemy));
      enemyElement = actorsLayer.querySelector<HTMLElement>(`.defense-enemy[data-enemy-id="${enemyId}"]`);
    }

    const position = defenseEnemyPosition(enemy);
    visualEnemyPositions.set(enemy.id, position);
    const health = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));
    if (enemy.state !== 'dying') {
      sortableEnemyIds.add(enemyId);
      enemyLayerOrder.push({ id: enemyId, y: position.y });
    }

    if (healthBarElement) {
      healthBarElement.style.setProperty('--enemy-x', `${position.x}%`);
      healthBarElement.style.setProperty('--enemy-y', `${position.y}%`);
      healthBarElement.style.setProperty('--enemy-health-value', String(health));
      healthBarElement.className = defenseEnemyHealthBarClass(enemy);
    }

    if (enemyElement) {
      const previousHealth = defenseEnemyHealthSnapshots.get(enemyId);
      const facingScale = defenseEnemyFacingScale(position);
      enemyElement.style.setProperty('--enemy-x', `${position.x}%`);
      enemyElement.style.setProperty('--enemy-y', `${position.y}%`);
      enemyElement.style.setProperty('--enemy-facing-scale', String(facingScale));
      enemyElement.classList.toggle('is-skeleton-mage', enemy.kind === 'skeletonMage');
      enemyElement.classList.toggle('is-bat', enemy.kind === 'bat');
      enemyElement.classList.toggle('is-goblin-king', enemy.kind === 'goblinKing');
      enemyElement.classList.toggle('is-idle', enemy.state === 'idle');
      enemyElement.classList.toggle('is-attacking', enemy.state === 'attacking');
      enemyElement.classList.toggle('is-dying', enemy.state === 'dying');
      if (previousHealth !== undefined && enemy.health < previousHealth) {
        playDefenseEnemyHitFeedback(enemyElement);
      }
      defenseEnemyHealthSnapshots.set(enemyId, enemy.health);
    }
  }

  const sortedEnemyLayerOrder = enemyLayerOrder
    .sort((left, right) => left.y - right.y || Number(left.id) - Number(right.id))
    .map(({ id }) => id);
  const currentEnemyLayerOrder = Array.from(actorsLayer.querySelectorAll<HTMLElement>('.defense-enemy'))
    .map((enemyElement) => enemyElement.dataset.enemyId)
    .filter((enemyId): enemyId is string => typeof enemyId === 'string' && sortableEnemyIds.has(enemyId));

  if (currentEnemyLayerOrder.join('|') !== sortedEnemyLayerOrder.join('|')) {
    sortedEnemyLayerOrder.forEach((id) => {
      const enemyElement = actorsLayer.querySelector<HTMLElement>(`.defense-enemy[data-enemy-id="${id}"]`);
      if (enemyElement) {
        actorsLayer.appendChild(enemyElement);
      }
    });
  }

  actorsLayer.querySelectorAll<HTMLElement>('.defense-enemy-health-bar').forEach((healthBarElement) => {
    const enemyId = healthBarElement.dataset.enemyId;
    if (!enemyId || !liveEnemyIds.has(enemyId)) {
      healthBarElement.remove();
    }
  });

  actorsLayer.querySelectorAll<HTMLElement>('.defense-enemy').forEach((enemyElement) => {
    const enemyId = enemyElement.dataset.enemyId;
    if (!enemyId || !liveEnemyIds.has(enemyId)) {
      if (enemyId) {
        defenseEnemyHealthSnapshots.delete(enemyId);
      }
      enemyElement.remove();
    }
  });

  const liveShotIds = new Set<string>();
  for (const shot of state.defense.shots) {
    const shotId = String(shot.id);
    liveShotIds.add(shotId);
    if (!actorsLayer.querySelector<HTMLElement>(`.defense-shot[data-shot-id="${shotId}"]`)) {
      actorsLayer.insertAdjacentHTML('afterbegin', defenseShotMarkup(shot));
    }
  }

  actorsLayer.querySelectorAll<HTMLElement>('.defense-shot').forEach((shotElement) => {
    const shotId = shotElement.dataset.shotId;
    if (!shotId || !liveShotIds.has(shotId)) {
      shotElement.remove();
    }
  });

  const liveEnemyProjectileIds = new Set<string>();
  for (const projectile of state.defense.enemyProjectiles) {
    const projectileId = String(projectile.id);
    liveEnemyProjectileIds.add(projectileId);
    if (!actorsLayer.querySelector<HTMLElement>(`.defense-enemy-projectile[data-enemy-projectile-id="${projectileId}"]`)) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseEnemyProjectileMarkup(projectile));
    }
  }

  actorsLayer.querySelectorAll<HTMLElement>('.defense-enemy-projectile').forEach((projectileElement) => {
    const projectileId = projectileElement.dataset.enemyProjectileId;
    if (!projectileId || !liveEnemyProjectileIds.has(projectileId)) {
      projectileElement.remove();
    }
  });

  const liveLightningStrikeIds = new Set<string>();
  for (const strike of state.defense.lightningStrikes) {
    const strikeId = String(strike.id);
    liveLightningStrikeIds.add(strikeId);
    if (!actorsLayer.querySelector<HTMLElement>(`.defense-lightning-strike[data-lightning-strike-id="${strikeId}"]`)) {
      const targetEnemy = state.defense.enemies.find((enemy) => enemy.id === strike.targetEnemyId);
      actorsLayer.insertAdjacentHTML(
        'beforeend',
        defenseLightningStrikeMarkup(strike, visualEnemyPositions.get(strike.targetEnemyId), targetEnemy),
      );
    }
  }

  actorsLayer.querySelectorAll<HTMLElement>('.defense-lightning-strike').forEach((strikeElement) => {
    const strikeId = strikeElement.dataset.lightningStrikeId;
    if (!strikeId || !liveLightningStrikeIds.has(strikeId)) {
      strikeElement.remove();
    }
  });

  const livePopupIds = new Set<string>();
  for (const popup of state.defense.damagePopups) {
    const popupId = String(popup.id);
    livePopupIds.add(popupId);
    if (!actorsLayer.querySelector<HTMLElement>(`.defense-damage-popup[data-popup-id="${popupId}"]`)) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseDamagePopupMarkup(popup));
    }
  }

  actorsLayer.querySelectorAll<HTMLElement>('.defense-damage-popup').forEach((popupElement) => {
    const popupId = popupElement.dataset.popupId;
    if (!popupId || !livePopupIds.has(popupId)) {
      popupElement.remove();
    }
  });

  const liveMoneyPopupIds = new Set<string>();
  for (const popup of state.defense.moneyPopups) {
    const popupId = String(popup.id);
    liveMoneyPopupIds.add(popupId);
    const existingPopup = actorsLayer.querySelector<HTMLElement>(`.defense-money-popup[data-money-popup-id="${popupId}"]`);
    if (!existingPopup) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseMoneyPopupMarkup(popup));
    } else {
      const amountElement = existingPopup.querySelector<HTMLElement>('b');
      const nextAmount = `+${popup.amount}`;
      if (amountElement && amountElement.textContent !== nextAmount) {
        amountElement.textContent = nextAmount;
      }
      existingPopup.style.setProperty('--money-heat', defenseMoneyPopupHeat(popup.combo).toFixed(3));
      existingPopup.style.setProperty('--money-stack', String(defenseMoneyPopupStack(popup.combo)));
    }
  }

  actorsLayer.querySelectorAll<HTMLElement>('.defense-money-popup').forEach((popupElement) => {
    const popupId = popupElement.dataset.moneyPopupId;
    if (!popupId || !liveMoneyPopupIds.has(popupId)) {
      popupElement.remove();
    }
  });
}

function syncDefenseIceAura(state: GameState): void {
  const arena = rootElement?.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-arena');
  if (!arena) {
    return;
  }

  let aura = arena.querySelector<HTMLElement>('.defense-ice-aura');
  let range = arena.querySelector<HTMLElement>('.defense-ice-range');
  if (!defenseIceActive(state)) {
    aura?.remove();
    range?.remove();
    return;
  }

  if (!aura || !range) {
    aura?.remove();
    range?.remove();
    const rangeElement = arena.querySelector<HTMLElement>('.defense-range');
    rangeElement?.insertAdjacentHTML('afterend', defenseIceAuraMarkup(state));
    aura = arena.querySelector<HTMLElement>('.defense-ice-aura');
    range = arena.querySelector<HTMLElement>('.defense-ice-range');
  }

  aura?.style.setProperty('--defense-ice-range-scale', defenseIceRange(state).toFixed(3));
  range?.style.setProperty('--defense-ice-range-scale', defenseIceRange(state).toFixed(3));
}

function defenseEnemyFacingScale(position: DefensePoint): number {
  return position.x <= 50 ? 1 : -1;
}

function updateDynamicDefenseSkillCards(state: GameState): void {
  const currentSigils = Math.floor(state.resources.sigils);
  rootElement?.querySelectorAll<HTMLButtonElement>('.defense-skill-dock .skill-shop-card[data-skill-id]').forEach((card) => {
    const skillId = card.dataset.skillId;
    if (!isDefenseSkillId(skillId)) {
      return;
    }
    const snapshot = defenseSkillShopCardSnapshot(state, skillId);
    if (!card.dataset.action && card.dataset.defenseDynamicClickBound !== '1') {
      card.dataset.defenseDynamicClickBound = '1';
      card.addEventListener('click', () => {
        const clickedSkillId = card.dataset.skillId;
        if (card.disabled || !isDefenseSkillId(clickedSkillId)) {
          return;
        }

        gameStore.dispatch({ type: 'buyDefenseSkill', skillId: clickedSkillId });
        refreshDefenseSkillDock(gameStore.snapshot, { force: true });
      });
    }

    const isMaxed = state.defenseSkills[skillId] >= defenseSkillMaxLevel(skillId);
    const isLocked = defenseSkillLocked(state, skillId);
    const isUnaffordable = !isMaxed && !isLocked && currentSigils < defenseSkillCost(state, skillId);
    const canBuy = !isMaxed && !isLocked && !isUnaffordable;
    card.classList.toggle('is-locked', isLocked);
    card.classList.toggle('is-unaffordable', isUnaffordable);
    card.classList.toggle('is-maxed', isMaxed);
    card.disabled = !canBuy;
    if (canBuy) {
      card.dataset.action = 'buyDefenseSkill';
    } else {
      delete card.dataset.action;
    }

    if (snapshot) {
      card.setAttribute('aria-label', `${snapshot.title}: ${snapshot.value}. ${snapshot.detail}. ${snapshot.costText}.`);
      card.setAttribute('title', `${snapshot.title} - ${snapshot.value} - ${snapshot.costText}`);
      card.querySelector<HTMLElement>('[data-skill-card-value]')?.replaceChildren(document.createTextNode(snapshot.value));
      const deltaElement = card.querySelector<HTMLElement>('[data-skill-card-delta]');
      if (deltaElement) {
        deltaElement.textContent = snapshot.delta;
        deltaElement.toggleAttribute('hidden', snapshot.isLocked || snapshot.delta.length === 0);
      }
      const buyElement = card.querySelector<HTMLElement>('[data-skill-card-buy]');
      if (buyElement) {
        buyElement.innerHTML = snapshot.isLocked ? '' : snapshot.isMaxed ? '<b>Max</b>' : snapshot.costHtml;
      }
    }
  });
}

function refreshDefenseSkillDock(state: GameState, options: { force?: boolean } = {}): void {
  if (!rootElement || !isBookPanelOpen(state, 'defense')) {
    lastDefenseSkillDockSignature = '';
    return;
  }

  const dock = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-skill-dock');
  if (!dock) {
    lastDefenseSkillDockSignature = '';
    return;
  }

  const signature = defenseSkillDockSignature(state);
  if (!options.force && signature === lastDefenseSkillDockSignature) {
    return;
  }

  dock.innerHTML = defenseSkillShop(state, false, { docked: true, showCompactButton: false });
  lastDefenseSkillDockSignature = signature;
  bindDefenseSkillDockControls(dock);
  installOneShotHoverAnimations();
}

function defenseSkillDockSignature(state: GameState): string {
  const skills = state.defenseSkills;
  return [
    defenseSkillShopTab,
    skills.damage,
    skills.damageMultiplier,
    skills.attackSpeed,
    skills.range,
    skills.criticalChance,
    skills.criticalMultiplier,
    skills.superCriticalChance,
    skills.superCriticalMultiplier,
    skills.lightningDamage,
    skills.lightningSpeed,
    skills.lightningCount,
    skills.iceDamage,
    skills.iceSpeed,
    skills.iceRange,
    skills.iceSlow,
    skills.health,
    skills.healthRegen,
    skills.moneyPerEnemy,
    skills.goldMultiplier,
  ].join('/');
}

function defenseSkillShopCardSnapshot(state: GameState, skillId: DefenseSkillId): SkillShopCard | undefined {
  return defenseSkillShopTabs(state).flatMap((tab) => tab.cards).find((card) => card.skillId === skillId);
}

function bindDefenseSkillDockControls(dock: HTMLElement): void {
  dock.querySelectorAll<HTMLButtonElement>('[data-action="buyDefenseSkill"][data-skill-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const skillId = button.dataset.skillId;
      if (button.disabled || !isDefenseSkillId(skillId)) {
        return;
      }
      gameStore.dispatch({ type: 'buyDefenseSkill', skillId });
      refreshDefenseSkillDock(gameStore.snapshot, { force: true });
    });
  });

  dock.querySelectorAll<HTMLButtonElement>('[data-action="setDefenseSkillShopTab"]').forEach((button) => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.skillShopTab;
      if (!isDefenseSkillShopTabId(tabId)) {
        return;
      }
      defenseSkillShopTab = tabId;
      refreshDefenseSkillDock(gameStore.snapshot, { force: true });
    });
  });
}

function isDefenseSkillId(value: string | undefined): value is DefenseSkillId {
  switch (value) {
    case 'damage':
    case 'damageMultiplier':
    case 'attackSpeed':
    case 'range':
    case 'criticalChance':
    case 'criticalMultiplier':
    case 'superCriticalChance':
    case 'superCriticalMultiplier':
    case 'lightningDamage':
    case 'lightningSpeed':
    case 'lightningCount':
    case 'iceDamage':
    case 'iceSpeed':
    case 'iceRange':
    case 'iceSlow':
    case 'health':
    case 'healthRegen':
    case 'moneyPerEnemy':
    case 'goldMultiplier':
      return true;
    default:
      return false;
  }
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

function setDynamicText(id: string, value: number | string): void {
  rootElement?.querySelectorAll<HTMLElement>(`[data-dynamic-value="${id}"]`).forEach((element) => {
    const next = String(value);
    if (element.textContent !== next) {
      element.textContent = next;
    }
  });
}

function setDynamicResourceText(id: string, value: number): void {
  setDynamicText(id, value);
  trackDynamicResourceGain(id, value);
}

function trackDynamicResourceGain(id: string, value: number): void {
  const current = Math.floor(value);
  const previous = dynamicResourceGainSnapshots.get(id);
  dynamicResourceGainSnapshots.set(id, current);
  if (previous === undefined || current <= previous) {
    return;
  }

  appendFloatingGain(current - previous, `[data-dynamic-value="${id}"]`, 'is-resource-counter');
}

function restartOneShotClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function playDefenseEnemyHitFeedback(enemyElement: HTMLElement): void {
  enemyElement
    .getAnimations()
    .filter((animation) => animation.id === 'defense-enemy-hit-feedback')
    .forEach((animation) => animation.cancel());

  const animation = enemyElement.animate(
    [
      {
        filter: 'brightness(1.35) sepia(1) saturate(9) hue-rotate(-44deg) drop-shadow(0 0 4px rgba(255, 34, 30, 0.72))',
        opacity: '0.5',
        offset: 0,
      },
      {
        filter: 'brightness(1.35) sepia(1) saturate(9) hue-rotate(-44deg) drop-shadow(0 0 4px rgba(255, 34, 30, 0.72))',
        opacity: '0.5',
        offset: 0.22,
      },
      {
        filter: 'none',
        opacity: '1',
        offset: 1,
      },
    ],
    {
      duration: 280,
      easing: 'cubic-bezier(0.16, 0.86, 0.3, 1)',
    },
  );
  animation.id = 'defense-enemy-hit-feedback';
}

function playDefenseMoneyCounterPulse(moneyHud: HTMLElement, moneyValue: HTMLElement): void {
  moneyHud.animate(
    [
      { transform: 'translate3d(0, 0, 0) scale(1)' },
      { transform: 'translate3d(-2px, 0, 0) scale(1.04)' },
      { transform: 'translate3d(2px, 0, 0) scale(1.04)' },
      { transform: 'translate3d(-1px, 0, 0) scale(1.02)' },
      { transform: 'translate3d(0, 0, 0) scale(1)' },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.18, 0.84, 0.3, 1)',
      composite: 'add',
    },
  );

  const pulse = document.createElement('strong');
  pulse.className = 'defense-money-pulse';
  pulse.textContent = moneyValue.textContent;
  pulse.style.left = `${moneyValue.offsetLeft}px`;
  pulse.style.top = `${moneyValue.offsetTop}px`;
  pulse.style.width = `${moneyValue.offsetWidth}px`;
  moneyHud.append(pulse);
  window.setTimeout(() => pulse.remove(), 460);
}

function stopHudPointerEvent(event: Event): void {
  event.stopPropagation();
}

function installOneShotHoverAnimations(): void {
  if (!rootElement || oneShotHoverListenerInstalled) {
    return;
  }

  oneShotHoverListenerInstalled = true;
  rootElement.addEventListener('pointerover', handleOneShotHoverPointerOver, true);
  rootElement.addEventListener('pointerout', handleOneShotHoverPointerOut, true);
}

function pruneOneShotHoverState(): void {
  activeOneShotHoverElements.forEach((element) => {
    if (!element.isConnected || !element.matches(':hover')) {
      element.classList.remove('is-hover-bouncing');
      activeOneShotHoverElements.delete(element);
    }
  });
}

function handleOneShotHoverPointerOver(event: PointerEvent): void {
  const hoverTarget = resolveOneShotHoverTarget(event.target);
  if (!hoverTarget || isRelatedTargetInside(event.relatedTarget, hoverTarget.element)) {
    return;
  }
  if (activeOneShotHoverKeys.has(hoverTarget.key)) {
    activeOneShotHoverElements.add(hoverTarget.element);
    return;
  }
  if (activeOneShotHoverElements.has(hoverTarget.element)) {
    return;
  }

  activeOneShotHoverElements.add(hoverTarget.element);
  activeOneShotHoverKeys.add(hoverTarget.key);
  hoverTarget.element.classList.add('is-hover-bouncing');
  hoverTarget.element.addEventListener(
    'animationend',
    () => {
      hoverTarget.element.classList.remove('is-hover-bouncing');
    },
    { once: true },
  );
}

function handleOneShotHoverPointerOut(event: PointerEvent): void {
  const hoverTarget = resolveOneShotHoverTarget(event.target);
  if (!hoverTarget || isRelatedTargetInside(event.relatedTarget, hoverTarget.element)) {
    return;
  }
  activeOneShotHoverElements.delete(hoverTarget.element);
  hoverTarget.element.classList.remove('is-hover-bouncing');
  window.setTimeout(() => {
    const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY);
    const nextHoverTarget = resolveOneShotHoverTarget(elementUnderPointer);
    if (nextHoverTarget?.key === hoverTarget.key) {
      activeOneShotHoverElements.add(nextHoverTarget.element);
      return;
    }

    activeOneShotHoverKeys.delete(hoverTarget.key);
    if (activeOneShotHoverKeys.size === 0 && createHudSignature(gameStore.snapshot) !== lastRenderSignature) {
      renderHud(gameStore.snapshot);
    }
  }, 0);
}

function resolveOneShotHoverTarget(target: EventTarget | null): { element: HTMLElement; key: string } | null {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  const manaOrb = target.closest<HTMLElement>('.mana-orb');
  if (manaOrb) {
    return { element: manaOrb, key: 'mana-orb' };
  }

  const defenseSkillCard = target.closest<HTMLElement>('.defense-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable)');
  if (defenseSkillCard) {
    return { element: defenseSkillCard, key: `defense-skill-card:${defenseSkillCard.dataset.skillId ?? defenseSkillCard.textContent ?? ''}` };
  }

  const defenseSkillTab = target.closest<HTMLElement>('.defense-skill-dock .skill-shop-tab');
  if (defenseSkillTab) {
    return { element: defenseSkillTab, key: `defense-skill-tab:${defenseSkillTab.dataset.skillShopTab ?? defenseSkillTab.textContent ?? ''}` };
  }

  return null;
}

function isRelatedTargetInside(relatedTarget: EventTarget | null, element: HTMLElement): boolean {
  return relatedTarget instanceof Node && element.contains(relatedTarget);
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
  setBookPanelSize(bookId, panel, getBookPanelPresetWidth(bookId, nextPreset));
  setBookPanelPosition(bookId, panel, currentLeft, currentTop);
  lastRenderSignature = '';
  lastRenderStableSignature = '';
  lastRenderStructureSignature = '';
  renderHud(gameStore.snapshot, { forceFull: true });
}

function getBookPanelPreset(bookId: BookId): BookPanelSizePreset {
  const presetId = bookPanelSizePresetIds.get(bookId) ?? 'large';
  return BOOK_PANEL_SIZE_PRESETS.find((preset) => preset.id === presetId) ?? BOOK_PANEL_SIZE_PRESETS[0];
}

function bookPanelSizeFromPreset(bookId: BookId, preset: BookPanelSizePreset): { width: number; height: number } {
  const width = getBookPanelPresetWidth(bookId, preset);
  return {
    width,
    height: getBookPanelHeightForWidth(bookId, width),
  };
}

function getBookPanelPresetWidth(bookId: BookId, preset: BookPanelSizePreset): number {
  if (bookId === 'defense' && preset.id === 'medium') {
    return Math.round(preset.width * DEFENSE_MEDIUM_PANEL_SCALE);
  }
  if (bookId === 'defense' && preset.id === 'large') {
    return Math.round(preset.width * DEFENSE_LARGE_PANEL_SCALE);
  }
  return preset.width;
}

function getBookPanelSize(bookId: BookId): { width: number; height: number } {
  if (bookId === 'defense' && getBookPanelPreset(bookId).id === 'large') {
    return bookPanelSizeFromPreset(bookId, getBookPanelPreset(bookId));
  }
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
  isSingleOpenPanel: boolean,
): string {
  const selectedBook = getBook(bookId);
  const isFocused = state.selectedBook === bookId;
  const position = bookPanelPositions.get(bookId);
  const panelSizePreset = getBookPanelPreset(bookId);
  const size = getBookPanelSize(bookId);
  const dragClass = `${position ? ' is-drag-positioned' : ''} is-resized panel-size-${panelSizePreset.id}`;
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
  const hasUpgradeControls = selectedBook.id !== 'typing' && selectedBook.id !== 'defense' && selectedBook.id !== 'mine';
  const isCompactUpgradeOpen = openUpgradePanel === selectedBook.id && upgradePanelMode === 'compact';
  const miniSkillClass = isCompactUpgradeOpen ? ' has-mini-skills' : '';
  return `
    <section class="book-overlay panel-slot-${slot}${isSingleOpenPanel ? ' is-single-open-panel' : ''} ${isFocused ? 'is-focused' : ''} ${shouldAnimatePage ? 'is-entering' : ''}${miniSkillClass}${dragClass}"${dragStyle} data-book-id="${selectedBook.id}" aria-label="${selectedBook.name}">
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

function createHudSignature(state: GameState, options: { includeDefenseVolatile?: boolean } = {}): string {
  const includeDefenseVolatile = options.includeDefenseVolatile ?? false;
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
  const hundred = state.hundred;
  const targetState = state.targets;
  const targetSkills = state.targetSkills;
  const mining = state.mining;
  const miningSkills = state.miningSkills;
  const slimeTrainer = state.slimeTrainer;

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
    ...(includeDefenseVolatile
      ? [Math.ceil(state.defense.towerHealth), state.defense.score, state.defense.best, state.defense.lastReward]
      : ['defense-volatile']),
    state.defense.speedMultiplier,
    blackjack.phase,
    blackjack.round,
    blackjack.dealerCardRevealed ? 1 : 0,
    blackjack.lastReward,
    blackjack.lastDebtPayment,
    blackjack.debt,
    blackjack.lastOutcome,
    blackjack.activeHand,
    blackjack.playerBet,
    blackjack.splitBet,
    blackjack.playerHandDone ? 1 : 0,
    blackjack.splitHandDone ? 1 : 0,
    blackjack.playerHandDoubled ? 1 : 0,
    blackjack.splitHandDoubled ? 1 : 0,
    blackjack.playerHand.map(blackjackCardLabel).join(','),
    blackjack.splitHand?.map(blackjackCardLabel).join(',') ?? 'none',
    blackjack.dealerHand.map(blackjackCardLabel).join(','),
    blackjack.pair.unlocked ? 1 : 0,
    blackjack.pair.level,
    blackjack.pair.xp,
    blackjack.pair.autoEnabled ? 1 : 0,
    blackjack.pair.activatedThisHand ? 1 : 0,
    blackjack.pair.lastOutcome,
    blackjack.pair.lastPayout,
    blackjack.pair.lastXp,
    blackjack.twentyOneThree.unlocked ? 1 : 0,
    blackjack.twentyOneThree.level,
    blackjack.twentyOneThree.xp,
    blackjack.twentyOneThree.autoEnabled ? 1 : 0,
    blackjack.twentyOneThree.activatedThisHand ? 1 : 0,
    blackjack.twentyOneThree.lastOutcome,
    blackjack.twentyOneThree.lastPayout,
    blackjack.twentyOneThree.lastXp,
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
    mining.blocks.map((block) => `${block.id},${block.depth},${block.material},${block.health},${block.lastHit}`).join(';'),
    MINING_MATERIAL_RESOURCE_IDS.map((resourceId) => `${resourceId}:${Math.floor(mining.materials[resourceId])}`).join(';'),
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
    'defense-skills-dynamic',
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

function createHudStructureSignature(state: GameState): string {
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
    state.openBookPanels.map((panel) => `${panel.bookId}:${panel.slot}`).join('|'),
    openUpgradePanel ?? 'none',
    upgradePanelMode,
    defenseSkillShopTab,
    state.defense.speedMultiplier,
    bookState,
  ].join('/');
}

function shouldPatchOpenDefensePanel(state: GameState, structureSignature: string): boolean {
  if (!rootElement || structureSignature !== lastRenderStructureSignature) {
    return false;
  }
  if (state.openBookPanels.length !== 1 || state.openBookPanels[0]?.bookId !== 'defense') {
    return false;
  }
  return Boolean(rootElement.querySelector('.book-overlay[data-book-id="defense"] .defense-panel'));
}

function shouldPatchOpenMiningPanel(state: GameState, structureSignature: string): boolean {
  if (!rootElement || structureSignature !== lastRenderStructureSignature) {
    return false;
  }
  if (state.openBookPanels.length !== 1 || state.openBookPanels[0]?.bookId !== 'mine') {
    return false;
  }
  return Boolean(rootElement.querySelector('.book-overlay[data-book-id="mine"] .mining-panel'));
}

function refreshMiningBoard(state: GameState): void {
  const playfield = rootElement?.querySelector<HTMLElement>('.book-overlay[data-book-id="mine"] .mining-playfield');
  if (playfield) {
    for (const block of state.mining.blocks) {
      const button = playfield.querySelector<HTMLButtonElement>(`[data-mining-block-id="${block.id}"]`);
      if (!button) {
        continue;
      }
      const material = miningBlockMaterialById(block.material);
      const title =
        block.layersRemaining > 0
          ? `${material.name} - profondeur ${block.depth}, ${block.health}/${block.maxHealth} PV`
          : `Emplacement vide - profondeur ${block.depth}`;
      button.dataset.material = material.id;
      button.dataset.layerCount = String(block.layersRemaining);
      button.disabled = block.layersRemaining <= 0;
      button.title = title;
      button.setAttribute(
        'aria-label',
        block.layersRemaining > 0
          ? `Bloc de ${material.name} profondeur ${block.depth}, ${block.health} PV sur ${block.maxHealth}, ${block.layersRemaining} couches restantes`
          : `Emplacement vide profondeur ${block.depth}`,
      );
      const materialLabel = button.querySelector<HTMLElement>('span');
      const layerLabel = button.querySelector<HTMLElement>('i');
      if (materialLabel) {
        materialLabel.textContent = material.shortName;
      }
      if (layerLabel) {
        layerLabel.textContent = String(block.layersRemaining);
      }
    }
  }

  syncMiningThreeTerrain(state, (blockId) => {
    const board = rootElement?.querySelector<HTMLElement>('[data-mining-3d-board]');
    if (board) {
      focusBookPanelFromControl(board, 'mine');
    }
    gameStore.dispatch({ type: 'digMiningBlock', blockId });
  });
}

function refreshMiningSkillDock(state: GameState, options: { force?: boolean } = {}): void {
  if (!rootElement || !isBookPanelOpen(state, 'mine')) {
    lastMiningSkillDockSignature = '';
    return;
  }

  const dock = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="mine"] .mining-skill-dock');
  if (!dock) {
    lastMiningSkillDockSignature = '';
    return;
  }

  const signature = [
    Math.floor(state.mana),
    state.miningSkills.pickaxeForce,
    state.miningSkills.splashDamage,
    state.miningSkills.automation,
  ].join('/');
  if (!options.force && signature === lastMiningSkillDockSignature) {
    return;
  }

  dock.innerHTML = miningSkillShop(state, false, { docked: true, showCompactButton: false });
  lastMiningSkillDockSignature = signature;
  dock.querySelectorAll<HTMLButtonElement>('[data-action="buyMiningSkill"][data-skill-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const skillId = button.dataset.skillId;
      if (button.disabled || !isMiningSkillId(skillId)) {
        return;
      }
      gameStore.dispatch({ type: 'buyMiningSkill', skillId });
      refreshMiningSkillDock(gameStore.snapshot, { force: true });
    });
  });
}

function isMiningSkillId(value: string | undefined): value is MiningSkillId {
  return value === 'pickaxeForce' || value === 'splashDamage' || value === 'automation';
}

function upgradePanel(bookId: BookId, state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (bookId === 'mana') {
    return manaUpgradePanel(state, shouldAnimate, mode);
  }
  if (bookId === 'serpent') {
    return snakeUpgradePanel(state, shouldAnimate, mode);
  }
  if (bookId === 'defense') {
    return defenseUpgradePanel(state, shouldAnimate, mode);
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
    ${standardUpgradePanel(bookId, shouldAnimate, 'Table des upgrades', definition.name, [
      {
        action: 'buyUpgrade',
        bookId,
        icon: '▲',
        title: 'Puissance',
        subtitle: `Lv ${book.level}`,
        levelLabel: `Lv ${book.level}`,
        detail: 'Upgrade principal du livre',
        costHtml: standardManaCostHtml(upgradeManaCost(bookId, state), resourceLabel),
        costText: `${upgradeManaCost(bookId, state)} Mana${resourceLabel}`,
      },
      {
        icon: '⌁',
        title: 'Automatisation',
        subtitle: book.automation > 0 ? 'Active' : 'Verrouillee',
        levelLabel: book.automation > 0 ? 'On' : 'Lv 2',
        detail: 'Se debloque avec Puissance',
        costHtml: 'Progression',
        costText: 'Progression',
        isInfo: true,
      },
      {
        icon: '✦',
        title: 'Resonance',
        subtitle: `Lv ${Math.max(0, book.level - 3)}`,
        levelLabel: `Lv ${Math.max(0, book.level - 3)}`,
        detail: 'Bonus a partir du Lv 4',
        costHtml: 'Passif',
        costText: 'Passif',
        isInfo: true,
      },
    ])}
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
  if (bookId === 'defense') {
    return `
      <div class="mini-skill-popover ${shouldAnimate ? 'is-entering' : ''}" aria-label="Mini competences du bastion">
        <div class="mini-skill-scroll is-mana">
          ${defenseSkillCompactButton(state, 'damage', '▲')}
          ${defenseSkillCompactButton(state, 'attackSpeed', '⌁')}
          ${defenseSkillCompactButton(state, 'range', '◎')}
          ${defenseSkillCompactButton(state, 'criticalChance', '◇')}
          ${defenseSkillCompactButton(state, 'health', '♥')}
          ${defenseSkillCompactButton(state, 'moneyPerEnemy', '◆')}
          ${defenseSkillCompactButton(state, 'goldMultiplier', '×')}
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
          ${blackjackBonusCompactButton(state, 'pair', 'Pair')}
          ${blackjackBonusCompactButton(state, 'twentyOneThree', '21+3')}
          <button class="compact-upgrade-entry" data-action="buyUpgrade" data-book-id="blackjack" title="Mise">
            <span>${blackjackUpgradeIcon('wager', 'Mise')}</span><strong>${blackjackCurrentMainBet(state)}</strong>
          </button>
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

interface StandardUpgradeTrack {
  action?: string;
  skillId?: string;
  bookId?: BookId;
  icon: string;
  title: string;
  subtitle: string;
  levelLabel: string;
  detail: string;
  costHtml: string;
  costText: string;
  isMaxed?: boolean;
  isInfo?: boolean;
  tier?: 'gray' | 'green' | 'blue' | 'purple' | 'red' | 'yellow';
}

function standardUpgradePanel(
  bookId: BookId,
  shouldAnimate: boolean,
  title: string,
  subtitle: string,
  tracks: StandardUpgradeTrack[],
): string {
  return `
    <section class="upgrade-panel is-mana-skills is-blackjack-upgrades is-standard-upgrades ${shouldAnimate ? 'is-entering' : ''}" aria-label="${title}">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="${bookId}" title="Fermer">×</button>
      <div class="blackjack-upgrade-panel-header">
        <div>
          <strong>${title}</strong>
          <span>${subtitle}</span>
        </div>
        <button class="blackjack-upgrade-hide" data-action="toggleCompactUpgradePanel" data-book-id="${bookId}" title="Masquer le panneau complet">
          Compact
        </button>
      </div>
      <div class="blackjack-upgrade-board" aria-label="${title}">
        ${tracks.map(standardUpgradeTrackRow).join('')}
      </div>
    </section>
  `;
}

function standardUpgradeTrackRow(track: StandardUpgradeTrack): string {
  const stateClass = track.isInfo ? 'info' : track.isMaxed ? 'owned is-maxed' : 'next';
  const tier = track.tier ?? (track.isInfo ? 'gray' : track.isMaxed ? 'green' : 'blue');
  const actionAttrs = track.action && !track.isMaxed
    ? `${track.action ? `data-action="${track.action}"` : ''}${track.skillId ? ` data-skill-id="${track.skillId}"` : ''}${track.bookId ? ` data-book-id="${track.bookId}"` : ''}`
    : 'aria-disabled="true"';
  return `
    <article class="blackjack-upgrade-track is-standard-track">
      <div class="blackjack-upgrade-track-main">
        <div class="blackjack-upgrade-title">
          <span class="blackjack-upgrade-icon blackjack-upgrade-glyph">${track.icon}</span>
          <header>
            <strong>${track.title}</strong>
            <span>${track.subtitle}</span>
          </header>
        </div>
      </div>
      <div class="blackjack-upgrade-lane">
        <div class="blackjack-upgrade-nodes">
          <button
            class="blackjack-upgrade-node is-${stateClass} is-tier-${tier}"
            type="button"
            ${actionAttrs}
            aria-label="${track.title}: ${track.levelLabel}. ${track.detail} Cout: ${track.costText}."
          >
            <b>${track.icon}</b>
            <span>${track.levelLabel}</span>
            <i class="blackjack-upgrade-tooltip" role="tooltip">
              <strong>${track.title}</strong>
              <small>${track.levelLabel}</small>
              <small>${track.detail}</small>
              <em class="blackjack-tooltip-cost">
                <span>Cout</span>
                <b>${track.costHtml}</b>
              </em>
            </i>
          </button>
        </div>
      </div>
    </article>
  `;
}

function standardManaCostHtml(cost: number, extraCost = ''): string {
  return `${blackjackResourceCost('mana', String(cost))}${extraCost ? `<span class="standard-upgrade-extra-cost">${extraCost}</span>` : ''}`;
}

type SkillShopTheme = 'attack' | 'defense' | 'utility';
type DefenseSkillShopTabId = SkillShopTheme;

interface SkillShopCard {
  action: string;
  skillId: string;
  title: string;
  value: string;
  delta: string;
  detail: string;
  level: number;
  maxLevel: number;
  costHtml: string;
  costText: string;
  isMaxed: boolean;
  isDisabled?: boolean;
  isLocked?: boolean;
  isUnaffordable?: boolean;
}

interface SkillShopTab<T extends string = string> {
  id: T;
  label: string;
  icon: string;
  theme: SkillShopTheme;
  cards: SkillShopCard[];
}

interface SkillShopPanelOptions {
  docked?: boolean;
  showCompactButton?: boolean;
}

function isDefenseSkillShopTabId(value: string | undefined): value is DefenseSkillShopTabId {
  return value === 'attack' || value === 'defense' || value === 'utility';
}

function skillShopPanel<T extends string>(
  bookId: BookId,
  shouldAnimate: boolean,
  title: string,
  subtitle: string,
  activeTabId: T,
  tabs: Array<SkillShopTab<T>>,
  tabAction: string,
  options: SkillShopPanelOptions = {},
): string {
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  return `
    <section class="upgrade-panel is-skill-shop is-skill-shop-${activeTab.theme} ${options.docked ? 'is-docked' : ''} ${shouldAnimate ? 'is-entering' : ''}" aria-label="${title}">
      ${options.docked ? '' : `<button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="${bookId}" title="Fermer">×</button>`}
      <div class="skill-shop-frame">
        <header class="skill-shop-header">
          <div>
            <strong>${title}</strong>
            <span>${subtitle}</span>
          </div>
          ${
            options.showCompactButton === false
              ? ''
              : `<button class="skill-shop-compact" data-action="toggleCompactUpgradePanel" data-book-id="${bookId}" title="Mode compact">Compact</button>`
          }
        </header>
        <div class="skill-shop-card-grid" aria-label="${activeTab.label}">
          ${activeTab.cards.map((card) => skillShopCard(card, activeTab.theme)).join('')}
        </div>
        <nav class="skill-shop-tabs" aria-label="Categories">
          ${tabs.map((tab) => skillShopTabButton(tab, activeTab.id, tabAction)).join('')}
        </nav>
      </div>
    </section>
  `;
}

function skillShopTabButton<T extends string>(tab: SkillShopTab<T>, activeTabId: T, tabAction: string): string {
  const selected = tab.id === activeTabId;
  return `
    <button
      class="skill-shop-tab is-${tab.theme} ${selected ? 'is-selected' : ''}"
      type="button"
      data-action="${tabAction}"
      data-skill-shop-tab="${tab.id}"
      aria-pressed="${selected ? 'true' : 'false'}"
      title="${tab.label}"
    >
      <strong>${tab.label}</strong>
    </button>
  `;
}

function skillShopCard(card: SkillShopCard, theme: SkillShopTheme): string {
  const canBuy = !card.isMaxed && !card.isDisabled;
  const compactTitle = compactSkillShopTitle(card.title);
  return `
    <button
      class="skill-shop-card is-${theme} ${card.isMaxed ? 'is-maxed' : ''} ${card.isLocked ? 'is-locked' : ''} ${card.isUnaffordable ? 'is-unaffordable' : ''}"
      type="button"
      data-skill-id="${card.skillId}"
      ${canBuy ? `data-action="${card.action}"` : 'disabled'}
      aria-label="${card.title}: ${card.value}. ${card.detail}. ${card.costText}."
      title="${card.title} - ${card.value} - ${card.costText}"
    >
      <span class="skill-shop-card-topline">
        <strong data-compact-title="${compactTitle}">${card.title}</strong>
      </span>
      <span class="skill-shop-card-value">
        <strong data-skill-card-value>${card.value}</strong>
        <small data-skill-card-delta ${!card.isLocked && card.delta ? '' : 'hidden'}>${card.delta}</small>
      </span>
      <span class="skill-shop-card-detail">${card.detail}</span>
      <span class="skill-shop-buy" data-skill-card-buy>
        ${card.isLocked ? '' : card.isMaxed ? '<b>Max</b>' : card.costHtml}
      </span>
    </button>
  `;
}

function compactSkillShopTitle(title: string): string {
  return title.replace(/\bSuper\b/g, 'S.').replace(/\bCritical\b|\bCrit\b/g, 'C.');
}

function defenseUpgradePanel(state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences du bastion">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="defense" title="Fermer">×</button>
        <div class="compact-upgrade-grid is-mana">
          ${defenseSkillCompactButton(state, 'damage', '▲')}
          ${defenseSkillCompactButton(state, 'attackSpeed', '⌁')}
          ${defenseSkillCompactButton(state, 'range', '◎')}
          ${defenseSkillCompactButton(state, 'criticalChance', '◇')}
          ${defenseSkillCompactButton(state, 'health', '♥')}
          ${defenseSkillCompactButton(state, 'moneyPerEnemy', '◆')}
          ${defenseSkillCompactButton(state, 'goldMultiplier', '×')}
        </div>
      </section>
    `;
  }

  return defenseSkillShop(state, shouldAnimate);
}

function defenseSkillShop(state: GameState, shouldAnimate = false, options: SkillShopPanelOptions = {}): string {
  return skillShopPanel(
    'defense',
    shouldAnimate,
    'Bastion Skills',
    'Tower defense upgrades',
    defenseSkillShopTab,
    defenseSkillShopTabs(state),
    'setDefenseSkillShopTab',
    options,
  );
}

function defenseSkillShopTabs(state: GameState): Array<SkillShopTab<DefenseSkillShopTabId>> {
  return [
    {
      id: 'attack',
      label: 'Attack',
      icon: '⚔',
      theme: 'attack',
      cards: [
        defenseSkillShopCard(state, 'damage', 'Damage +', `${defenseTowerDamage(state)} dmg`, '+1 per level'),
        defenseSkillShopCard(state, 'attackSpeed', 'Attack Speed', `${defenseTowerAttackInterval(state).toFixed(2)}s`, 'shorter cooldown'),
        defenseSkillShopCard(state, 'range', 'Range', `${Math.round(defenseTowerRangePercent(state) * 100)}%`, 'larger attack circle'),
        defenseSkillShopCard(state, 'damageMultiplier', 'Damage all x', `x${defenseDamageMultiplier(state).toFixed(2)}`, 'all base damage'),
        defenseSkillShopCard(state, 'criticalChance', 'Critical Chance', `${Math.round(Math.min(60, state.defenseSkills.criticalChance * 2))}%`, 'chance to crit'),
        defenseSkillShopCard(state, 'criticalMultiplier', 'Critical Multiplier', `x${(2 + state.defenseSkills.criticalMultiplier * 0.125).toFixed(2)}`, 'bigger crits'),
        defenseSkillShopCard(state, 'superCriticalChance', 'Super Crit Chance', `${Math.round(Math.min(25, state.defenseSkills.superCriticalChance))}%`, 'chance to super crit'),
        defenseSkillShopCard(state, 'superCriticalMultiplier', 'Super Crit Multiplier', `x${(3 + state.defenseSkills.superCriticalMultiplier * 0.25).toFixed(2)}`, 'huge crits'),
      ],
    },
    {
      id: 'defense',
      label: 'Element',
      icon: '♛',
      theme: 'defense',
      cards: [
        defenseSkillShopCard(state, 'lightningCount', 'Lightning', `${defenseLightningTargetCount(state)}`, 'targets per strike'),
        defenseSkillShopCard(state, 'lightningDamage', 'Lightning Damage', `${defenseLightningDamage(state)} dmg`, 'random map strike'),
        defenseSkillShopCard(state, 'lightningSpeed', 'Lightning Speed', `${defenseLightningAttackInterval(state).toFixed(2)}s`, 'faster lightning'),
        defenseSkillShopCard(state, 'iceDamage', 'Ice Damage', `${defenseIceDamage(state)} dmg`, 'aura damage tick'),
        defenseSkillShopCard(state, 'iceSpeed', 'Ice Speed', `${defenseIceAttackInterval(state).toFixed(2)}s`, 'faster aura ticks'),
        defenseSkillShopCard(state, 'iceRange', 'Ice Range', `${Math.round(defenseIceRangePercent(state) * 100)}%`, 'larger frozen aura'),
        defenseSkillShopCard(state, 'iceSlow', 'Ice Slow', `${Math.round(defenseIceSlow(state) * 100)}%`, 'slower enemies'),
      ],
    },
    {
      id: 'utility',
      label: 'Other',
      icon: '▰',
      theme: 'utility',
      cards: [
        defenseSkillShopCard(state, 'health', 'Health +', `${Math.round(state.defense.towerHealth)}/${defenseMaxTowerHealth(state)}`, '+2 max hp'),
        defenseSkillShopCard(state, 'healthRegen', 'Health Regen', `${defenseTowerHealthRegenPerSecond(state).toFixed(2)}/s`, 'passive healing'),
        defenseSkillShopCard(state, 'moneyPerEnemy', 'Gold +', `${defenseEnemyReward(state)}`, '+1 seal per enemy'),
        defenseSkillShopCard(state, 'goldMultiplier', 'Gold x', `x${defenseGoldMultiplier(state).toFixed(1)}`, '+10% gold per level'),
      ],
    },
  ];
}

function defenseSkillShopCard(
  state: GameState,
  skillId: DefenseSkillId,
  title: string,
  value: string,
  detail: string,
): SkillShopCard {
  const level = state.defenseSkills[skillId];
  const maxLevel = defenseSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const isLocked = defenseSkillLocked(state, skillId);
  const cost = defenseSkillCost(state, skillId);
  const isUnaffordable = !isMaxed && !isLocked && state.resources.sigils < cost;
  return {
    action: 'buyDefenseSkill',
    skillId,
    title,
    value,
    delta: isMaxed ? '' : defenseSkillDeltaLabel(skillId),
    detail,
    level,
    maxLevel,
    costHtml: isLocked ? '' : isMaxed ? 'Max' : defenseSkillCostHtml(cost),
    costText: isLocked ? '' : isMaxed ? 'Max' : `${cost} Sceaux`,
    isMaxed,
    isDisabled: isLocked || isUnaffordable,
    isLocked,
    isUnaffordable,
  };
}

function defenseSkillCostHtml(cost: number): string {
  return `<span class="blackjack-cost-resource"><img class="blackjack-upgrade-icon is-cost-icon" src="/assets/library/resources/sigils.svg" alt="Sceaux" loading="lazy" decoding="async"><b>${cost}</b></span>`;
}

function defenseSkillDeltaLabel(skillId: DefenseSkillId): string {
  switch (skillId) {
    case 'damage':
      return '(+1)';
    case 'damageMultiplier':
      return '(+0.05x)';
    case 'attackSpeed':
      return '(-0.03s)';
    case 'criticalChance':
      return '(+2%)';
    case 'criticalMultiplier':
      return '(+0.13x)';
    case 'superCriticalChance':
      return '(+1%)';
    case 'superCriticalMultiplier':
      return '(+0.25x)';
    case 'lightningDamage':
      return '(+1)';
    case 'lightningSpeed':
      return '(-0.08s)';
    case 'lightningCount':
      return '(+1 count)';
    case 'iceDamage':
      return '(+1)';
    case 'iceSpeed':
      return '(-0.05s)';
    case 'iceRange':
      return '(+1%)';
    case 'iceSlow':
      return '(+2%)';
    case 'health':
      return '(+2)';
    case 'healthRegen':
      return '(+0.08/s)';
    case 'range':
      return '(+2%)';
    case 'moneyPerEnemy':
      return '(+1)';
    case 'goldMultiplier':
      return '(+10%)';
  }
  return '';
}

function defenseSkillCompactButton(state: GameState, skillId: DefenseSkillId, icon: string): string {
  const level = state.defenseSkills[skillId];
  const maxLevel = defenseSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  return `
    <button class="compact-upgrade-entry ${isMaxed ? 'is-maxed' : ''}" data-action="buyDefenseSkill" data-skill-id="${skillId}" ${isMaxed ? 'disabled' : ''}>
      <span>${icon}</span><strong>${level}</strong>
    </button>
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
    ${standardUpgradePanel('serpent', shouldAnimate, 'Table des upgrades', 'Serpent', [
      snakeSkillTrack(state, 'speed', '↯', 'Vitesse', `${snakeMoveInterval(state).toFixed(2)}s/case`, '-0.022s par niveau, cap 0.10s'),
      snakeSkillTrack(state, 'gridSize', '▦', 'Taille grille', `${snakeGridSize(state)}x${snakeGridSize(state)}`, '+1 case par axe, max 9x9'),
      snakeSkillTrack(state, 'automation', '⌁', 'Automatisation', snakeAutomationActive(state) ? 'Active' : 'Off', 'Assistance de direction bornee'),
      snakeSkillTrack(state, 'baseMultiplier', '×', 'Base multi', `x${snakeBaseMultiplier(state).toFixed(1)}`, 'Monte par +0.1 jusqu a x5'),
      snakeSkillTrack(state, 'bonusFruit', '●', 'Fruits bonus', snakeBonusFruitLabel(state), 'Orange, poire, banane'),
      snakeSkillTrack(state, 'extraLife', '♡', 'Vie sup.', `${state.snakeSkills.extraLife}`, 'Collision absorbee puis invincible'),
      snakeSkillTrack(state, 'edgeWrap', '⇄', 'Traverse bord', state.snakeSkills.edgeWrap > 0 ? 'On' : 'Off', 'Sortir revient cote oppose'),
    ])}
  `;
}

function snakeSkillTrack(
  state: GameState,
  skillId: SnakeSkillId,
  icon: string,
  label: string,
  value: string,
  detail: string,
): StandardUpgradeTrack {
  const level = state.snakeSkills[skillId];
  const maxLevel = snakeSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = snakeSkillCost(state, skillId);
  return {
    action: 'buySnakeSkill',
    skillId,
    icon,
    title: label,
    subtitle: value,
    levelLabel: `Lv ${level}/${maxLevel}`,
    detail,
    costHtml: isMaxed ? 'MAX' : standardManaCostHtml(cost),
    costText: isMaxed ? 'MAX' : `${cost} Mana`,
    isMaxed,
  };
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
    ${standardUpgradePanel('targets', shouldAnimate, 'Table des upgrades', 'Cibles', [
      targetSkillTrack(state, 'spawnSpeed', '↯', 'Apparition', `${targetSpawnInterval(state.targetSkills.spawnSpeed).toFixed(2)}s`, 'Les cibles arrivent plus vite'),
      targetSkillTrack(state, 'targetCount', '◎', 'Cibles max', `${targetMaxActiveTargets(state.targetSkills.targetCount)}`, 'Plus de cibles en meme temps'),
      targetSkillTrack(state, 'damage', '▲', 'Degats', `${targetAttackDamage(state.targetSkills.damage)}`, 'Chaque clic tape plus fort'),
      targetSkillTrack(state, 'automation', '⌁', 'Automatisation', targetAutomationLabel(state), 'Tir automatique sur les cibles'),
    ])}
  `;
}

function targetSkillTrack(
  state: GameState,
  skillId: TargetSkillId,
  icon: string,
  label: string,
  value: string,
  detail: string,
): StandardUpgradeTrack {
  const level = state.targetSkills[skillId];
  const maxLevel = targetSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = targetSkillCost(state, skillId);
  return {
    action: 'buyTargetSkill',
    skillId,
    icon,
    title: label,
    subtitle: value,
    levelLabel: `Lv ${level}/${maxLevel}`,
    detail,
    costHtml: isMaxed ? 'MAX' : standardManaCostHtml(cost),
    costText: isMaxed ? 'MAX' : `${cost} Mana`,
    isMaxed,
  };
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

function miningSkillShop(state: GameState, shouldAnimate = false, options: SkillShopPanelOptions = {}): string {
  return skillShopPanel(
    'mine',
    shouldAnimate,
    'Mine Skills',
    'Mining upgrades',
    'mine',
    miningSkillShopTabs(state),
    'setMiningSkillShopTab',
    options,
  );
}

function miningSkillShopTabs(state: GameState): Array<SkillShopTab<'mine'>> {
  return [
    {
      id: 'mine',
      label: 'Mine',
      icon: 'Mine',
      theme: 'utility',
      cards: [
        miningSkillShopCard(state, 'pickaxeForce', 'Pickaxe +', `${miningPickaxeDamage(state)} dmg`, '+1 damage'),
        miningSkillShopCard(state, 'splashDamage', 'Splash', `${miningSplashDamage(state)} neighbor`, 'adjacent blocks'),
        miningSkillShopCard(state, 'automation', 'Auto Dig', miningAutomationLabel(state), 'weakest block'),
      ],
    },
  ];
}

function miningSkillShopCard(
  state: GameState,
  skillId: MiningSkillId,
  title: string,
  value: string,
  detail: string,
): SkillShopCard {
  const level = state.miningSkills[skillId];
  const maxLevel = miningSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = miningSkillCost(state, skillId);
  const isUnaffordable = !isMaxed && state.mana < cost;
  return {
    action: 'buyMiningSkill',
    skillId,
    title,
    value,
    delta: isMaxed ? '' : miningSkillDeltaLabel(skillId),
    detail,
    level,
    maxLevel,
    costHtml: isMaxed ? '<b>Max</b>' : `<b>${cost}</b>`,
    costText: isMaxed ? 'Max' : `${cost} Mana`,
    isMaxed,
    isDisabled: isUnaffordable,
    isUnaffordable,
  };
}

function miningSkillDeltaLabel(skillId: MiningSkillId): string {
  switch (skillId) {
    case 'pickaxeForce':
      return '(+1)';
    case 'splashDamage':
      return '(+1)';
    case 'automation':
      return '(-0.2s)';
  }
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

  return miningSkillShop(state, shouldAnimate);
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

function blackjackUpgradeIcon(asset: string, label: string, className = ''): string {
  return `<img class="blackjack-upgrade-icon ${className}" src="/assets/blackjack/upgrades/${asset}.svg" alt="${label}" loading="lazy" decoding="async">`;
}

function blackjackResourceCost(resource: 'mana' | 'chips' | 'xp', amount: string): string {
  const asset = resource === 'mana' ? 'mana' : resource === 'chips' ? 'wager' : 'xp';
  const label = resource === 'mana' ? 'Mana' : resource === 'chips' ? 'Jetons' : 'XP';
  return `<span class="blackjack-cost-resource">${blackjackUpgradeIcon(asset, label, 'is-cost-icon')}<b>${amount}</b></span>`;
}

interface BlackjackUpgradeCellConfig {
  id: BlackjackUpgradeCellId;
  iconAsset: string;
  title: string;
}

interface BlackjackUpgradeRowConfig {
  title: string;
  subtitle: (state: GameState) => string;
  iconAsset: string;
  cells: BlackjackUpgradeCellConfig[];
}

const BLACKJACK_UPGRADE_ROWS: BlackjackUpgradeRowConfig[] = [
  {
    title: 'Mise principale',
    subtitle: (state) => `Mise ${blackjackCurrentMainBet(state)} · gain x${blackjackCurrentWinPayoutMultiplier(state).toFixed(1)}`,
    iconAsset: 'wager',
    cells: [
      { id: 'wagerBase', iconAsset: 'wager', title: 'Mise max' },
      { id: 'wagerWin', iconAsset: 'win', title: 'Gain victoire' },
      { id: 'wagerNatural', iconAsset: 'blackjack', title: 'Blackjack naturel' },
      { id: 'wagerStreak', iconAsset: 'streak', title: 'Serie gagnante' },
      { id: 'wagerDebt', iconAsset: 'debt', title: 'Dette reduite' },
    ],
  },
  {
    title: 'Actions',
    subtitle: (state) => state.blackjack.actions.unlocked ? `Lv ${state.blackjack.actions.level}` : 'Verrouille',
    iconAsset: 'actions',
    cells: [
      { id: 'actionStand', iconAsset: 'stand', title: 'Rester lucide' },
      { id: 'actionDouble', iconAsset: 'double', title: 'Double amorti' },
      { id: 'actionSplit', iconAsset: 'split', title: 'Split moins cher' },
      { id: 'actionFaceSplit', iconAsset: 'pair', title: 'Figures jumelles' },
      { id: 'actionMastery', iconAsset: 'actions', title: 'Maitrise de table' },
    ],
  },
  {
    title: 'Auto relance',
    subtitle: (state) => blackjackAutoDealUnlocked(state) ? 'Active' : 'Verrouillee',
    iconAsset: 'auto',
    cells: [
      { id: 'autoDeal', iconAsset: 'auto', title: 'Auto relance' },
      { id: 'autoSpeed', iconAsset: 'auto', title: 'Relance rapide' },
    ],
  },
  {
    title: 'Pair',
    subtitle: (state) => state.blackjack.pair.unlocked ? `${Math.floor(state.blackjack.pair.xp)} XP` : 'Verrouille',
    iconAsset: 'pair',
    cells: [
      { id: 'pairUnlock', iconAsset: 'pair', title: 'Debloquer Pair' },
      { id: 'pairPayout', iconAsset: 'win', title: 'Paiement Pair' },
      { id: 'pairXp', iconAsset: 'xp', title: 'XP Pair' },
      { id: 'pairRefund', iconAsset: 'debt', title: 'Ratage amorti' },
      { id: 'pairAuto', iconAsset: 'auto', title: 'Auto Pair' },
    ],
  },
  {
    title: '21+3',
    subtitle: (state) => state.blackjack.twentyOneThree.unlocked ? `${Math.floor(state.blackjack.twentyOneThree.xp)} XP` : 'Verrouille',
    iconAsset: 'twenty-one-three',
    cells: [
      { id: 'twentyOneThreeUnlock', iconAsset: 'twenty-one-three', title: 'Debloquer 21+3' },
      { id: 'twentyOneThreePayout', iconAsset: 'win', title: 'Paiement 21+3' },
      { id: 'twentyOneThreeXp', iconAsset: 'xp', title: 'XP 21+3' },
      { id: 'twentyOneThreeJackpot', iconAsset: 'jackpot', title: 'Jackpot 21+3' },
      { id: 'twentyOneThreeAuto', iconAsset: 'auto', title: 'Auto 21+3' },
    ],
  },
];

function blackjackUpgradePanel(state: GameState, shouldAnimate: boolean, mode: 'detail' | 'compact'): string {
  if (mode === 'compact') {
    return `
      <section class="upgrade-panel is-compact ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences blackjack">
        <button class="upgrade-panel-close" data-action="toggleCompactUpgradePanel" data-book-id="blackjack" title="Fermer">×</button>
        <div class="compact-upgrade-grid is-blackjack">
          <button class="compact-upgrade-entry" data-action="buyUpgrade" data-book-id="blackjack" title="Mise">
            <span>${blackjackUpgradeIcon('wager', 'Mise')}</span><strong>${blackjackCurrentMainBet(state)}</strong>
          </button>
          ${blackjackActionCompactButton(state)}
          <button
            class="compact-upgrade-entry ${blackjackAutoDealUnlocked(state) ? '' : 'is-locked'}"
            ${blackjackCanBuyAutoDeal(state) ? 'data-action="buyBlackjackAutoDeal"' : 'disabled'}
            title="${blackjackAutoDealUnlocked(state) ? 'Auto relance active' : 'Debloquer auto relance'}"
          >
            <span>${blackjackUpgradeIcon('auto', 'Auto relance')}</span><strong>${blackjackAutoDealUnlocked(state) ? 'On' : 'Auto'}</strong>
          </button>
          ${blackjackBonusCompactButton(state, 'pair', 'Pair')}
          ${blackjackBonusCompactButton(state, 'twentyOneThree', '21+3')}
        </div>
      </section>
    `;
  }

  return `
    <section class="upgrade-panel is-mana-skills is-blackjack-upgrades ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences blackjack">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="blackjack" title="Fermer">×</button>
      <div class="blackjack-upgrade-panel-header">
        <div>
          <strong>Table des upgrades</strong>
          <span>Blackjack</span>
        </div>
        <button class="blackjack-upgrade-hide" data-action="toggleCompactUpgradePanel" data-book-id="blackjack" title="Masquer le panneau complet">
          Compact
        </button>
      </div>
      <div class="blackjack-upgrade-board" aria-label="Upgrades blackjack">
        ${BLACKJACK_UPGRADE_ROWS.map((row) => blackjackUpgradeCellRow(state, row)).join('')}
      </div>
    </section>
  `;
}

function blackjackUpgradeCellRow(state: GameState, row: BlackjackUpgradeRowConfig): string {
  return `
    <article class="blackjack-upgrade-track">
      <div class="blackjack-upgrade-track-main">
        <div class="blackjack-upgrade-title">
          ${blackjackUpgradeIcon(row.iconAsset, row.title)}
          <header>
            <strong>${row.title}</strong>
            <span>${row.subtitle(state)}</span>
          </header>
        </div>
      </div>
      <div class="blackjack-upgrade-lane">
        <div class="blackjack-upgrade-nodes">
          ${row.cells.map((cell) => blackjackUpgradeCellButton(state, cell)).join('')}
        </div>
      </div>
    </article>
  `;
}

function blackjackUpgradeCellButton(state: GameState, cell: BlackjackUpgradeCellConfig): string {
  const level = blackjackUpgradeCellLevel(state, cell.id);
  const maxLevel = blackjackCurrentUpgradeCellMaxLevel(cell.id);
  const displayLevel = blackjackUpgradeCellDisplayLevel(level);
  const displayMaxLevel = blackjackUpgradeCellDisplayLevel(maxLevel);
  const tier = blackjackCurrentUpgradeCellTier(state, cell.id);
  const canBuy = blackjackCanBuyUpgradeCell(state, cell.id);
  const cost = blackjackCurrentUpgradeCellCost(state, cell.id);
  const effect = blackjackCurrentUpgradeCellEffectLabel(state, cell.id);
  const stateClass = level >= maxLevel ? 'owned is-maxed' : canBuy ? 'next' : 'locked';
  const attrs = canBuy
    ? `data-action="buyBlackjackUpgradeCell" data-cell-id="${cell.id}"`
    : 'aria-disabled="true"';
  return `
    <button
      class="blackjack-upgrade-node is-${stateClass} is-tier-${tier}"
      type="button"
      ${attrs}
      aria-label="${cell.title}: niveau ${displayLevel}/${displayMaxLevel}. ${effect} Cout: ${blackjackUpgradeCostText(cost)}."
    >
      ${blackjackUpgradeIcon(cell.iconAsset, cell.title, 'is-node-icon')}
      <span>${level >= maxLevel ? 'MAX' : `Lv ${displayLevel}`}</span>
      <i class="blackjack-upgrade-tooltip" role="tooltip">
        <strong>${cell.title}</strong>
        <small>Niveau ${displayLevel}/${displayMaxLevel}</small>
        <small>${effect}</small>
        <em class="blackjack-tooltip-cost">
          <span>Cout</span>
          <b>${blackjackUpgradeCostHtml(cost)}</b>
        </em>
      </i>
    </button>
  `;
}

function blackjackUpgradeCellDisplayLevel(internalLevel: number): number {
  return Math.max(0, internalLevel - 1);
}

function blackjackUpgradeCostHtml(cost: BlackjackUpgradeCost): string {
  switch (cost.kind) {
    case 'resources':
      return `${blackjackResourceCost('mana', String(cost.mana))}${blackjackResourceCost('chips', String(cost.chips))}`;
    case 'chips':
      return blackjackResourceCost('chips', String(cost.chips));
    case 'pairXp':
    case 'twentyOneThreeXp':
      return blackjackResourceCost('xp', String(cost.xp));
    case 'blocked':
      return cost.reason;
    case 'max':
      return 'MAX';
  }
}

function blackjackUpgradeCostText(cost: BlackjackUpgradeCost): string {
  switch (cost.kind) {
    case 'resources':
      return `${cost.mana} Mana + ${cost.chips} Jetons`;
    case 'chips':
      return `${cost.chips} Jetons`;
    case 'pairXp':
    case 'twentyOneThreeXp':
      return `${cost.xp} XP`;
    case 'blocked':
      return cost.reason;
    case 'max':
      return 'MAX';
  }
}

function blackjackBonusCompactButton(state: GameState, bonusId: BlackjackSideBonusId, label: string): string {
  const bonus = blackjackBonusState(state, bonusId);
  const action = bonus.unlocked ? 'buyBlackjackBonusUpgrade' : 'unlockBlackjackBonus';
  const iconAsset = bonusId === 'pair' ? 'pair' : 'twenty-one-three';
  return `
    <button class="compact-upgrade-entry ${bonus.unlocked ? '' : 'is-locked'}" data-action="${action}" data-bonus-id="${bonusId}" title="${label}">
      <span>${blackjackUpgradeIcon(iconAsset, label)}</span><strong>${bonus.unlocked ? bonus.level : 0}</strong>
    </button>
  `;
}

function blackjackActionCompactButton(state: GameState): string {
  const level = state.blackjack.actions.level;
  const canBuy = level < blackjackCurrentActionMaxLevel() && state.resources.chips >= blackjackCurrentActionUpgradeCost(state);
  return `
    <button class="compact-upgrade-entry ${level > 0 ? '' : 'is-locked'}" ${canBuy ? 'data-action="buyBlackjackActionUpgrade"' : 'disabled'} title="Actions blackjack">
      <span>${blackjackUpgradeIcon('actions', 'Actions')}</span><strong>${level}</strong>
    </button>
  `;
}

function blackjackBonusState(state: GameState, bonusId: BlackjackSideBonusId) {
  return bonusId === 'pair' ? state.blackjack.pair : state.blackjack.twentyOneThree;
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
    ${standardUpgradePanel('mana', shouldAnimate, 'Table des upgrades', 'Mana', [
      manaSkillTrack(state, 'power', '▲', 'Puissance', `+${state.manaSkills.power} par clic`, '+1 mana par niveau'),
      manaSkillTrack(state, 'automation', '⌁', 'Automatisation', automationLabel(state), automationDetail(state)),
      manaSkillTrack(state, 'criticalHit', '◇', 'Critical hit', `${state.manaSkills.criticalHit}%`, '1% par niveau, max 20%'),
      manaSkillTrack(state, 'criticalEffect', '✦', 'Critical effect', `x${manaCriticalMultiplier(state).toFixed(1)}`, 'Critique plus violent, max x6'),
      manaSkillTrack(state, 'extraWands', '✧', 'Plus de baguette', `${manaWandCount(state) || 0}/10`, 'Max 10 baguettes ensemble'),
    ])}
  `;
}

function manaSkillTrack(
  state: GameState,
  skillId: ManaSkillId,
  icon: string,
  label: string,
  value: string,
  detail: string,
): StandardUpgradeTrack {
  const level = state.manaSkills[skillId];
  const maxLevel = manaSkillMaxLevel(skillId);
  const isMaxed = maxLevel !== null && level >= maxLevel;
  const cost = manaSkillCost(state, skillId);
  return {
    action: 'buyManaSkill',
    skillId,
    icon,
    title: label,
    subtitle: value,
    levelLabel: `Lv ${level}${maxLevel === null ? '' : `/${maxLevel}`}`,
    detail,
    costHtml: isMaxed ? 'MAX' : standardManaCostHtml(cost),
    costText: isMaxed ? 'MAX' : `${cost} Mana`,
    isMaxed,
  };
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

function manaPanel(state: GameState): string {
  const wandCount = manaWandCount(state);
  const wandIndexes = Array.from({ length: wandCount }, (_, index) => index);
  return `
    <div class="mana-panel">
      <div class="mana-counter-box" aria-label="Mana actuelle">
        <strong data-dynamic-value="mana-panel-total">${compactHudNumber(state.mana)}</strong>
        <span>per second: <b data-dynamic-value="mana-panel-rate">${formatManaPerSecond(manaPerSecond(state))}</b></span>
      </div>
      <div class="mana-fall-layer" aria-hidden="true"></div>
      <div class="magic-wands" aria-hidden="true">
        ${wandIndexes.map((index) => `<span class="magic-wand wand-${index + 1}"><i></i></span>`).join('')}
      </div>
      <button class="mana-orb" data-action="chargeMana" data-book-id="mana" title="Concentrer la Mana" aria-label="Concentrer la Mana">
        <span class="mana-crystal-light"></span>
        <span class="mana-orb-aura"></span>
        <span class="mana-sprite" aria-hidden="true"></span>
      </button>
    </div>
  `;
}

function manaPerSecond(state: GameState): number {
  const interval = manaAutomationInterval(state.manaSkills.automation);
  if (interval <= 0) {
    return 0;
  }
  return manaExpectedCastGain(state) * manaWandCount(state) * (1 / interval);
}

function manaExpectedCastGain(state: GameState): number {
  const baseGain = 1 + state.manaSkills.power;
  const criticalChance = Math.min(20, state.manaSkills.criticalHit) / 100;
  return baseGain * (1 + criticalChance * (manaCriticalMultiplier(state) - 1));
}

function formatManaPerSecond(value: number): string {
  if (value <= 0) {
    return '0/s';
  }
  if (value < 10) {
    return `${value.toFixed(2)}/s`;
  }
  if (value < 100) {
    return `${value.toFixed(1)}/s`;
  }
  return `${compactHudNumber(value)}/s`;
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
  const manaSprite = manaOrb.querySelector<HTMLElement>('.mana-sprite');
  const now = performance.now();
  manaClickTimestamps = manaClickTimestamps.filter((timestamp) => now - timestamp <= CRYSTAL_CLICK_SCALE_RESET_MS);
  manaClickTimestamps.push(now);
  const recentClickCount = manaClickTimestamps.filter((timestamp) => now - timestamp <= CRYSTAL_CLICK_RATE_WINDOW_MS).length;
  const fastClickBoost = Math.min(1, Math.max(0, (recentClickCount - 1) / (CRYSTAL_CLICK_RATE_FOR_MAX_SHAKE - 1)));
  const scaleProgress = Math.min(1, Math.max(0, (manaClickTimestamps.length - 1) / (CRYSTAL_CLICK_SCALE_CLICKS_FOR_MAX - 1)));
  const shakePower = 1 + fastClickBoost;
  const baseShake = 0.4;
  const clickScale = 1 + scaleProgress;
  manaOrb.style.setProperty('--crystal-shake-s', `${baseShake * shakePower}px`);
  manaOrb.style.setProperty('--crystal-shake-sn', `${-baseShake * shakePower}px`);
  manaOrb.style.setProperty('--crystal-shake-m', `${baseShake * 2 * shakePower}px`);
  manaOrb.style.setProperty('--crystal-shake-mn', `${baseShake * -2 * shakePower}px`);
  manaOrb.style.setProperty('--crystal-shake-l', `${baseShake * 3 * shakePower}px`);
  manaOrb.style.setProperty('--crystal-shake-ln', `${baseShake * -3 * shakePower}px`);
  manaOrb.style.setProperty('--crystal-shake-r', `${baseShake * 0.75 * shakePower}deg`);
  manaOrb.style.setProperty('--crystal-shake-rn', `${baseShake * -0.75 * shakePower}deg`);
  manaOrb.style.setProperty('--crystal-click-scale', clickScale.toFixed(3));
  manaOrb.classList.add('is-click-charged');
  if (manaClickScaleResetTimeout !== null) {
    window.clearTimeout(manaClickScaleResetTimeout);
  }
  manaClickScaleResetTimeout = window.setTimeout(() => {
    manaClickTimestamps = [];
    manaOrb.style.setProperty('--crystal-click-scale', '1');
    manaOrb.classList.remove('is-click-charged');
    manaClickScaleResetTimeout = null;
  }, CRYSTAL_CLICK_SCALE_RESET_MS);

  manaClickEffectFlip = !manaClickEffectFlip;
  manaOrb.classList.remove('is-clicked-a', 'is-clicked-b');
  if (manaSprite) {
    manaSprite.style.animation = 'none';
  }
  manaOrb.style.animation = 'none';
  void manaOrb.offsetWidth;
  manaOrb.style.animation = '';
  if (manaSprite) {
    manaSprite.style.animation = '';
  }
  manaOrb.classList.add(manaClickEffectFlip ? 'is-clicked-a' : 'is-clicked-b');
  const clickToken = String(performance.now());
  manaOrb.dataset.clickToken = clickToken;
  window.setTimeout(() => {
    if (manaOrb.dataset.clickToken === clickToken) {
      manaOrb.classList.remove('is-clicked-a', 'is-clicked-b');
    }
  }, 1000);

  showManaClickParticles(manaOrb, amount);

  const sparkCount = manaSparkCount(amount);
  const gain = normalizedManaGain(amount);
  for (let index = 0; index < sparkCount; index += 1) {
    const shard = document.createElement('i');
    const sparkValue = manaParticleUnitValue(gain, sparkCount, index);
    const angle = (index / sparkCount) * 360 + (index % 2) * 12;
    const distance = 30 + Math.min(74, Math.sqrt(gain) * 13) + (index % 4) * 7;
    const size = Math.min(24, 10 + Math.min(5, sparkValue) * 2.6 + (index % 3) * 2);
    shard.className = 'mana-spark';
    shard.dataset.gainValue = String(sparkValue);
    if (sparkValue >= 4) {
      shard.classList.add('is-critical');
    }
    shard.style.setProperty('--spark-x', `${Math.cos((angle * Math.PI) / 180) * distance}px`);
    shard.style.setProperty('--spark-y', `${Math.sin((angle * Math.PI) / 180) * distance}px`);
    shard.style.setProperty('--spark-size', `${size}px`);
    shard.style.setProperty('--spark-delay', `${(index % 5) * 18}ms`);
    manaOrb.appendChild(shard);
    shard.addEventListener('animationend', () => shard.remove(), { once: true });
  }
}

function normalizedManaGain(amount: number): number {
  return Math.max(1, Math.round(amount));
}

function manaParticleVisualCount(amount: number): number {
  const gain = normalizedManaGain(amount);
  if (gain <= 12) {
    return gain;
  }
  return Math.min(32, 12 + Math.ceil((gain - 12) / 4));
}

function manaParticleUnitValue(gain: number, particleCount: number, index: number): number {
  const baseValue = Math.floor(gain / particleCount);
  const remainder = gain % particleCount;
  return baseValue + (index < remainder ? 1 : 0);
}

function manaSparkCount(amount: number): number {
  return manaParticleVisualCount(amount);
}

function showManaClickParticles(manaOrb: HTMLElement, amount: number): void {
  const layer = rootElement?.querySelector<HTMLElement>('.mana-fall-layer');
  const counter = rootElement?.querySelector<HTMLElement>('.mana-counter-box');
  if (!layer || !counter) {
    return;
  }

  const layerRect = layer.getBoundingClientRect();
  const orbRect = manaOrb.getBoundingClientRect();
  const counterRect = counter.getBoundingClientRect();
  const startX = orbRect.left - layerRect.left + orbRect.width * 0.5;
  const startY = orbRect.top - layerRect.top + orbRect.height * 0.45;
  const endX = counterRect.left - layerRect.left + counterRect.width * 0.5 - startX;
  const endY = counterRect.top - layerRect.top + counterRect.height * 0.5 - startY;
  const gain = normalizedManaGain(amount);
  const particleCount = manaParticleVisualCount(gain);

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement('i');
    const unitValue = manaParticleUnitValue(gain, particleCount, index);
    const isCrystal = unitValue > 1 || index % 4 === 0;
    const spreadX = (Math.random() - 0.5) * Math.min(160, orbRect.width * 0.52);
    const spreadY = (Math.random() - 0.5) * Math.min(110, orbRect.height * 0.34);
    const endJitterX = (Math.random() - 0.5) * 30;
    const endJitterY = (Math.random() - 0.5) * 16;
    const valueScale = Math.min(5, unitValue);
    const size = Math.min(34, 15 + valueScale * 3.6 + (index % 3) * 2);
    particle.className = isCrystal ? `mana-falling-crystal mana-crystal-tier-${index % 2 === 0 ? 'b' : 'a'}` : 'mana-falling-orb';
    particle.dataset.gainValue = String(unitValue);
    if (unitValue >= 4) {
      particle.classList.add('is-critical');
    }
    if (unitValue >= 2) {
      particle.classList.add('is-bundled');
    }
    particle.style.setProperty('--particle-start-x', `${startX + spreadX}px`);
    particle.style.setProperty('--particle-start-y', `${startY + spreadY}px`);
    particle.style.setProperty('--particle-early-x', `${spreadX * -0.15}px`);
    particle.style.setProperty('--particle-early-y', `${-12 - Math.random() * 18}px`);
    particle.style.setProperty('--particle-mid-x', `${endX * 0.45 + spreadX * 0.4}px`);
    particle.style.setProperty('--particle-mid-y', `${endY * 0.45 - 44 - Math.random() * 32}px`);
    particle.style.setProperty('--particle-end-x', `${endX + endJitterX}px`);
    particle.style.setProperty('--particle-end-y', `${endY + endJitterY}px`);
    particle.style.setProperty('--particle-size', `${size}px`);
    particle.style.setProperty('--fall-delay', `${index * 24}ms`);
    particle.style.setProperty('--fall-duration', `${1040 + (index % 5) * 56}ms`);
    layer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
  }
}

function showWandCastEffect(): void {
  const wands = rootElement?.querySelector<HTMLElement>('.magic-wands');
  const manaOrb = rootElement?.querySelector<HTMLButtonElement>('.mana-orb');
  if (!wands || !manaOrb) {
    return;
  }

  wandCastEffectFlip = !wandCastEffectFlip;
  wands.classList.remove('is-casting-a', 'is-casting-b');
  manaOrb.classList.remove('is-wand-hit-a', 'is-wand-hit-b');
  void wands.offsetWidth;
  void manaOrb.offsetWidth;
  wands.classList.add(wandCastEffectFlip ? 'is-casting-a' : 'is-casting-b');
  manaOrb.classList.add(wandCastEffectFlip ? 'is-wand-hit-a' : 'is-wand-hit-b');
  const castToken = String(performance.now());
  wands.dataset.castToken = castToken;
  window.setTimeout(() => {
    if (wands.dataset.castToken === castToken) {
      wands.classList.remove('is-casting-a', 'is-casting-b');
      manaOrb.classList.remove('is-wand-hit-a', 'is-wand-hit-b');
    }
  }, 660);
}

function showFloatingGain(amount: number, targetSelector = '.mana-orb', className?: string): void {
  const gain = Math.max(1, Math.round(amount));
  const pending = pendingFloatingGains.get(targetSelector);
  pendingFloatingGains.set(targetSelector, {
    amount: (pending?.amount ?? 0) + gain,
    className: className ?? pending?.className,
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
    appendFloatingGain(pending.amount, targetSelector, pending.className);
  }
}

function appendFloatingGain(amount: number, targetSelector: string, className?: string): void {
  const target = rootElement?.querySelector<HTMLElement>(targetSelector);
  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const host = document.querySelector<HTMLElement>('#game-shell') ?? document.body;
  const hostRect = host.getBoundingClientRect();
  const { x, y } = floatingGainOffset(rect);
  const pop = document.createElement('span');
  pop.className = className ? `floating-gain ${className}` : 'floating-gain';
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
  const multiplier = snakeTotalMultiplier(state);
  const automationButton = canToggleAutomation
    ? `
      <button
        class="snake-auto-toggle ${automationEnabled ? 'is-on' : 'is-off'}"
        data-action="toggleSnakeAutomation"
        title="Automatisation serpent"
        aria-label="Automatisation serpent"
        aria-pressed="${automationEnabled ? 'true' : 'false'}"
      >⌁</button>
    `
    : '';
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
        ${automationButton}
        <div class="snake-board has-snake-sprite" style="--snake-grid-size:${snake.gridSize}" role="img" aria-label="Mini jeu Snake du Livre du Serpent">
          <div class="snake-board-hearts" aria-label="Vies">${hearts}</div>
          <strong class="snake-board-multiplier" style="--snake-multiplier-hue:${snakeMultiplierHue(multiplier)}deg">+${multiplier.toFixed(1).replace('.', ',')}</strong>
          <span class="snake-spriterrific-familiar" aria-hidden="true"></span>
          ${cells}
          ${snakeSegments}
        </div>
      </div>
    </div>
  `;
}

function snakeMultiplierHue(multiplier: number): number {
  const stops = [52, 32, 8, 338, 286, 232, 190, 142];
  const progress = Math.max(0, Math.min(stops.length - 1, (multiplier - 1) * 1.4));
  const index = Math.floor(progress);
  const nextIndex = Math.min(stops.length - 1, index + 1);
  const blend = progress - index;
  return Math.round(stops[index] + (stops[nextIndex] - stops[index]) * blend);
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
  return `
    <div class="mining-panel">
      <div class="mining-playfield">
        ${miningPlayfield(state)}
      </div>
      <div class="mining-skill-dock">
        ${miningSkillShop(state, false, { docked: true, showCompactButton: false })}
      </div>
    </div>
  `;
}

function miningPlayfield(state: GameState): string {
  const blocks = state.mining.blocks
    .map((block) => {
      const material = miningBlockMaterialById(block.material);
      const title =
        block.layersRemaining > 0
          ? `${material.name} - profondeur ${block.depth}, ${block.health}/${block.maxHealth} PV`
          : `Emplacement vide - profondeur ${block.depth}`;
      const ariaLabel =
        block.layersRemaining > 0
          ? `Bloc de ${material.name} profondeur ${block.depth}, ${block.health} PV sur ${block.maxHealth}, ${block.layersRemaining} couches restantes`
          : `Emplacement vide profondeur ${block.depth}`;
      return `
        <button
          type="button"
          class="mining-keyboard-block"
          data-action="digMiningBlock"
          data-block-id="${block.id}"
          data-mining-block-id="${block.id}"
          role="gridcell"
          data-material="${material.id}"
          data-layer-count="${block.layersRemaining}"
          title="${title}"
          aria-label="${ariaLabel}"
          ${block.layersRemaining > 0 ? '' : 'disabled'}
        >
          <span>${material.shortName}</span>
          <i>${block.layersRemaining}</i>
        </button>
      `;
    })
    .join('');

  return `
    <div class="mining-grid-shell">
      <div
        class="mining-grid mining-three-frame"
        role="application"
        aria-label="Mine des Profondeurs 3D 6 par 6"
      >
        <canvas
          class="mining-three-board"
          data-mining-3d-board="true"
          aria-label="Terrain 3D de mine en pixel art"
        ></canvas>
        <div class="mining-accessible-grid" role="grid" aria-label="Mine des Profondeurs 6 par 6">
          ${blocks}
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
  const hasVisibleHands = blackjack.dealerHand.length > 0 || blackjack.playerHand.length > 0;
  const dealerValue = blackjackVisibleDealerValue(state);
  const revealDealer = blackjack.phase !== 'player' || blackjack.dealerCardRevealed;
  const previousHands =
    blackjack.round === lastBlackjackRenderedRound ? lastBlackjackRenderedHands : { dealer: [], player: [], split: [] };
  const currentHands = {
    dealer: blackjack.dealerHand.map((card) => blackjackCardKey(card, 'dealer')),
    player: blackjack.playerHand.map((card) => blackjackCardKey(card, 'player')),
    split: blackjack.splitHand?.map((card) => blackjackCardKey(card, 'split')) ?? [],
  };
  const handGrew = {
    dealer: currentHands.dealer.length > previousHands.dealer.length,
    player: currentHands.player.length > previousHands.player.length,
    split: currentHands.split.length > previousHands.split.length,
  };
  updateBlackjackMotionGate(state, currentHands);
  const isSettling = blackjackMotionIsSettling();
  const liveDisplay = blackjackLiveDisplayState(state, dealerValue);
  const display =
    isSettling && lastBlackjackSettledDisplay
      ? blackjackSettlingDisplay(state, lastBlackjackSettledDisplay, liveDisplay)
      : liveDisplay;
  const isPreparing = blackjack.phase === 'idle';
  const canStartHand = blackjackCanDeal(state) && !isSettling;
  const showHandScores = isSettling ? Boolean(lastBlackjackSettledDisplay?.scoresVisible) : liveDisplay.scoresVisible;
  const outcomeClass = `is-${blackjack.phase}${isSettling ? ' is-settling' : ''}`;
  const outcomeText = isSettling ? '' : blackjackOutcomeText(state);
  const twentyOneBannerText = isSettling ? '' : blackjackTwentyOneBannerText(state);
  const dealerHandClass = isSettling ? '' : blackjackHandOutcomeClass(state, 'dealer');
  const playerHandClass = isSettling ? '' : blackjackHandOutcomeClass(state, 'player');
  if (!isSettling) {
    lastBlackjackSettledDisplay = liveDisplay;
  }
  lastBlackjackRenderedRound = blackjack.round;
  lastBlackjackRenderedHands = currentHands;

  return `
    <div class="blackjack-panel">
      <div class="blackjack-table ${outcomeClass}" aria-label="Mini jeu Table du Blackjack">
        ${blackjackControlRail(state)}
        <div class="blackjack-outcome-slot">
          ${outcomeText ? `<div class="blackjack-outcome" aria-live="polite">${outcomeText}</div>` : ''}
        </div>
        ${blackjackBonusStrip(state)}
        ${blackjackChipZone(state, display, blackjackStakeLabel(state))}
        ${isPreparing ? blackjackWagerTray(display.chips) : ''}
        ${twentyOneBannerText ? `<div class="blackjack-twenty-one-banner" aria-live="polite">${twentyOneBannerText}</div>` : ''}
        ${
          canStartHand
            ? `<button class="blackjack-start-button" data-action="dealBlackjack" title="Jouer" aria-label="Jouer au blackjack">Jouer</button>`
            : ''
        }
        ${
          hasVisibleHands
            ? `
              <div class="blackjack-hand-row is-dealer-row">
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
                ${showHandScores ? blackjackHandValueBadge('Croupier', display.dealerScore, 'dealer') : ''}
              </div>
              <div class="blackjack-player-hands ${blackjack.splitHand ? 'is-split' : ''}">
                ${blackjackPlayerHandRow(
                  blackjack.playerHand,
                  blackjack.splitHand ? 'Joueur 1' : 'Joueur',
                  blackjack.playerBet,
                  'player',
                  blackjack.activeHand === 'primary',
                  playerHandClass,
                  previousHands.player,
                  handGrew.player,
                  showHandScores ? display.playerScore : null,
                )}
                ${
                  blackjack.splitHand
                    ? blackjackPlayerHandRow(
                        blackjack.splitHand,
                        'Joueur 2',
                        blackjack.splitBet,
                        'split',
                        blackjack.activeHand === 'split',
                        playerHandClass,
                        previousHands.split,
                        handGrew.split,
                        showHandScores ? display.splitScore : null,
                      )
                    : ''
                }
              </div>
            `
            : ''
        }
        ${
          isPlayerTurn
            ? `<div class="blackjack-actions">
                <button class="blackjack-action is-hit" data-action="hitBlackjack" title="Tirer une carte" aria-label="Tirer une carte" ${isPlayerTurn ? '' : 'disabled'}>
                  <span class="blackjack-action-icon" aria-hidden="true"></span>
                </button>
                <button class="blackjack-action is-stand" data-action="standBlackjack" title="Rester" aria-label="Rester" ${isPlayerTurn ? '' : 'disabled'}>
                  <span class="blackjack-action-icon" aria-hidden="true"></span>
                </button>
                <button class="blackjack-action is-double" data-action="doubleBlackjack" title="Doubler la mise et tirer une carte" aria-label="Doubler" ${blackjackCanDouble(state) ? '' : 'disabled'}>
                  <span class="blackjack-action-icon" aria-hidden="true"></span>
                </button>
                <button class="blackjack-action is-split-action" data-action="splitBlackjack" title="Diviser une paire" aria-label="Diviser" ${blackjackCanSplit(state) ? '' : 'disabled'}>
                  <span class="blackjack-action-icon" aria-hidden="true"></span>
                </button>
              </div>`
            : ''
        }
      </div>
    </div>
  `;
}

function blackjackLiveDisplayState(state: GameState, dealerValue: number): BlackjackDisplayState {
  const blackjack = state.blackjack;
  return {
    chips: Math.floor(state.resources.chips),
    stake: blackjackActiveStake(state),
    debt: Math.ceil(blackjack.debt),
    scoresVisible: !blackjackCanDeal(state),
    dealerScore: dealerValue ? dealerValue.toString() : '-',
    playerScore: blackjack.playerHand.length > 0 ? blackjackHandValue(blackjack.playerHand).toString() : '-',
    splitScore: blackjack.splitHand && blackjack.splitHand.length > 0 ? blackjackHandValue(blackjack.splitHand).toString() : '-',
  };
}

function blackjackSettlingDisplay(
  state: GameState,
  settledDisplay: BlackjackDisplayState,
  liveDisplay: BlackjackDisplayState,
): BlackjackDisplayState {
  return {
    ...settledDisplay,
    scoresVisible: settledDisplay.scoresVisible || liveDisplay.scoresVisible,
    dealerScore: state.blackjack.phase === 'dealer' ? liveDisplay.dealerScore : settledDisplay.dealerScore,
  };
}

function updateBlackjackMotionGate(
  state: GameState,
  currentHands: Record<'dealer' | 'player' | 'split', string[]>,
): void {
  const blackjack = state.blackjack;
  const signature = [
    blackjack.round,
    blackjack.phase,
    blackjack.dealerCardRevealed ? 1 : 0,
    currentHands.dealer.join(','),
    currentHands.player.join(','),
    currentHands.split.join(','),
  ].join('|');
  if (signature === lastBlackjackMotionSignature) {
    return;
  }

  lastBlackjackMotionSignature = signature;
  if (blackjack.phase === 'idle' || (currentHands.dealer.length === 0 && currentHands.player.length === 0)) {
    blackjackMotionSettlesAt = 0;
    clearBlackjackScoreRevealTimeout();
    return;
  }

  const longestDealOrder = Math.max(
    ...currentHands.dealer.map((_, index) => index * 2 + 1),
    ...currentHands.player.map((_, index) => index * 2),
    ...currentHands.split.map((_, index) => index * 2),
    0,
  );
  blackjackMotionSettlesAt =
    Date.now() + BLACKJACK_CARD_RECEIVE_MS + longestDealOrder * BLACKJACK_CARD_STAGGER_MS + BLACKJACK_SCORE_REVEAL_BUFFER_MS;
  scheduleBlackjackScoreReveal();
}

function scheduleBlackjackScoreReveal(): void {
  clearBlackjackScoreRevealTimeout();
  const delay = Math.max(0, blackjackMotionSettlesAt - Date.now());
  blackjackScoreRevealTimeout = window.setTimeout(() => {
    blackjackScoreRevealTimeout = null;
    lastRenderSignature = '';
    lastRenderStableSignature = '';
    lastRenderStructureSignature = '';
    renderHud(gameStore.snapshot, { forceFull: true });
  }, delay);
}

function clearBlackjackScoreRevealTimeout(): void {
  if (blackjackScoreRevealTimeout === null) {
    return;
  }
  window.clearTimeout(blackjackScoreRevealTimeout);
  blackjackScoreRevealTimeout = null;
}

function blackjackMotionIsSettling(): boolean {
  return Date.now() < blackjackMotionSettlesAt;
}

function blackjackStakeLabel(state: GameState): string {
  return state.blackjack.phase === 'idle' || state.blackjack.playerBet <= 0 ? 'Mise base' : 'Mise en jeu';
}

function blackjackActiveStake(state: GameState): number {
  const blackjack = state.blackjack;
  if (blackjack.phase === 'idle') {
    return blackjack.playerBet;
  }
  if (blackjack.playerBet <= 0) {
    return blackjackCurrentMainBet(state);
  }
  return blackjack.playerBet + blackjack.splitBet;
}

function blackjackChipZone(state: GameState, display: BlackjackDisplayState, stakeLabel: string): string {
  const isPreparing = state.blackjack.phase === 'idle';
  return `
    <div class="blackjack-chip-zone" aria-label="Jetons blackjack">
      ${blackjackChipStack('Reserve', display.chips, 'bankroll')}
      ${blackjackChipStack(stakeLabel, display.stake, 'stake', false, isPreparing && display.stake > 0)}
    </div>
  `;
}

function blackjackChipStack(
  label: string,
  amount: number,
  variant: 'bankroll' | 'stake',
  canPrepareWager = false,
  canResetWager = false,
): string {
  const chips = blackjackChipDenominations(amount);
  const tag = canResetWager ? 'button' : 'div';
  const resetAttributes = canResetWager
    ? 'type="button" data-action="resetBlackjackWager" title="Remettre la mise a 0"'
    : '';
  const resetClass = canResetWager ? ' is-clickable' : '';
  return `
    <${tag} class="blackjack-chip-stack is-${variant}${resetClass}" ${resetAttributes} aria-label="${label}: ${Math.floor(amount)} jetons">
      <div class="blackjack-chip-stack-art" style="--chip-count: ${chips.length}">
        ${chips
          .map((denomination, index) => blackjackChipToken(denomination, index, canPrepareWager && amount >= denomination))
          .join('')}
      </div>
      <span>
        <small>${label}</small>
        <strong>${Math.floor(amount)}</strong>
      </span>
    </${tag}>
  `;
}

function blackjackChipToken(denomination: BlackjackChipDenomination, index: number, isClickable: boolean): string {
  const style = `--chip-offset: ${index * 3}px; --chip-tilt: ${(index - 3) * 3}deg`;
  if (!isClickable) {
    return `<i class="blackjack-chip-token is-${denomination}" style="${style}" aria-hidden="true"></i>`;
  }

  return `
    <button
      class="blackjack-chip-token is-${denomination} is-clickable"
      type="button"
      style="${style}"
      data-action="prepareBlackjackWager"
      data-wager-amount="${denomination}"
      title="Miser ${denomination} jetons"
      aria-label="Miser ${denomination} jetons"
    ></button>
  `;
}

function blackjackWagerTray(availableChips: number): string {
  return `
    <div class="blackjack-wager-tray" aria-label="Choisir une mise">
      ${BLACKJACK_WAGER_TRAY_DENOMINATIONS.map((denomination) => blackjackWagerTrayChip(denomination, availableChips >= denomination)).join('')}
    </div>
  `;
}

function blackjackWagerTrayChip(denomination: BlackjackChipDenomination, canUse: boolean): string {
  return `
    <button
      class="blackjack-wager-chip is-${denomination}"
      type="button"
      data-action="prepareBlackjackWager"
      data-wager-amount="${denomination}"
      title="Miser ${denomination} jetons"
      aria-label="Miser ${denomination} jetons"
      ${canUse ? '' : 'disabled'}
    >
      <span>${denomination}</span>
    </button>
  `;
}

function showBlackjackWagerChipFlight(source: HTMLElement, amount: number): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const denomination = BLACKJACK_WAGER_TRAY_DENOMINATIONS.includes(amount as BlackjackChipDenomination)
    ? amount as BlackjackChipDenomination
    : 1;
  const table = source.closest<HTMLElement>('.blackjack-table');
  const target = table?.querySelector<HTMLElement>('.blackjack-chip-stack.is-stake .blackjack-chip-stack-art');
  if (!target) {
    return;
  }

  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const size = Math.min(Math.max(sourceRect.width || 52, 42), 72);
  const startX = sourceRect.left + sourceRect.width / 2 - size / 2;
  const startY = sourceRect.top + sourceRect.height / 2 - size / 2;
  const endX = targetRect.left + targetRect.width / 2 - size / 2;
  const endY = targetRect.top + targetRect.height / 2 - size / 2;
  const chip = document.createElement('i');
  chip.className = `blackjack-wager-chip-flight is-${denomination}`;
  chip.style.left = `${startX}px`;
  chip.style.top = `${startY}px`;
  chip.style.width = `${size}px`;
  document.body.appendChild(chip);
  const animation = chip.animate(
    [
      { opacity: 0.95, transform: 'translate3d(0, 0, 0) scale(1)' },
      { offset: 0.68, opacity: 1, transform: `translate3d(${(endX - startX) * 0.52}px, ${endY - startY - 82}px, 0) scale(1.1)` },
      { opacity: 0.96, transform: `translate3d(${endX - startX}px, ${endY - startY}px, 0) scale(0.72)` },
    ],
    {
      duration: 1450,
      easing: 'cubic-bezier(0.12, 0.62, 0.18, 1)',
    },
  );
  animation.addEventListener('finish', () => chip.remove(), { once: true });
  animation.addEventListener('cancel', () => chip.remove(), { once: true });
}

function blackjackChipDenominations(amount: number): BlackjackChipDenomination[] {
  let remaining = Math.max(0, Math.floor(amount));
  const chips: BlackjackChipDenomination[] = [];
  for (const denomination of BLACKJACK_CHIP_DENOMINATIONS) {
    const count = Math.min(Math.floor(remaining / denomination), Math.max(0, 8 - chips.length));
    for (let index = 0; index < count; index += 1) {
      chips.push(denomination);
    }
    remaining -= denomination * count;
    if (chips.length >= 8) {
      break;
    }
  }
  return chips.length > 0 ? chips.reverse() : [1];
}

function blackjackControlRail(state: GameState): string {
  return `
    <div class="blackjack-control-rail" aria-label="Reglages de mise et bonus">
      ${blackjackMainBetControl(state)}
      ${blackjackBonusControl(state, 'pair', 'Pair')}
      ${blackjackBonusControl(state, 'twentyOneThree', '21+3')}
    </div>
  `;
}

function blackjackMainBetControl(state: GameState): string {
  const currentBet = blackjackCurrentMainBet(state);
  const selectedBetLevel = Math.max(1, Math.min(state.books.blackjack.level, state.blackjack.baseBetLevel ?? state.books.blackjack.level));
  const nextBetLevel = selectedBetLevel < state.books.blackjack.level ? selectedBetLevel + 1 : state.books.blackjack.level + 1;
  const nextBet = blackjackMainBet(nextBetLevel);
  const canDecrease = blackjackCanDecreaseBaseBet(state);
  const canIncrease = blackjackCanIncreaseBaseBet(state);
  const increaseTitle = selectedBetLevel < state.books.blackjack.level
    ? `Augmenter la mise de base a ${nextBet}`
    : 'Mise max deja selectionnee';
  return `
    <div class="blackjack-bet-stepper" aria-label="Mise de base blackjack">
      <button
        class="blackjack-bet-arrow ${canDecrease ? '' : 'is-disabled'}"
        data-action="decreaseBlackjackBaseBet"
        title="Diminuer la mise de base"
        aria-label="Diminuer la mise de base"
        ${canDecrease ? '' : 'disabled'}
      >‹</button>
      <span class="blackjack-bet-value">
        <small>Mise de base</small>
        <strong>${currentBet}</strong>
      </span>
      <button
        class="blackjack-bet-arrow ${canIncrease ? '' : 'is-disabled'}"
        data-action="increaseBlackjackBaseBet"
        title="${increaseTitle}"
        aria-label="${increaseTitle}"
        ${canIncrease ? '' : 'disabled'}
      >›</button>
    </div>
  `;
}

function blackjackBonusControl(state: GameState, bonusId: BlackjackSideBonusId, label: string): string {
  const bonus = blackjackBonusState(state, bonusId);
  const maxLevel = blackjackCurrentBonusMaxLevel();
  const icon = bonusId === 'pair' ? 'P' : '21';
  if (!bonus.unlocked) {
    const cost = blackjackCurrentBonusUnlockCost(bonusId);
    const prerequisiteMet = bonusId === 'pair' || state.blackjack.pair.unlocked;
    const canUnlock = prerequisiteMet && state.resources.chips >= cost;
    const title = prerequisiteMet ? `Debloquer ${label}: ${cost} Jetons` : 'Debloque Pair avant 21+3';
    return `
      <button
        class="blackjack-bonus-toggle is-locked ${canUnlock ? '' : 'is-disabled'}"
        data-action="unlockBlackjackBonus"
        data-bonus-id="${bonusId}"
        data-tooltip="${title}"
        aria-label="${title}"
        aria-pressed="false"
        aria-disabled="${canUnlock ? 'false' : 'true'}"
      >
        <span aria-hidden="true">${icon}</span>
      </button>
    `;
  }

  const cost = blackjackCurrentBonusUpgradeCost(state, bonusId);
  const isMaxed = bonus.level >= maxLevel;
  const canUpgrade = !isMaxed && bonus.xp >= cost;
  const title = isMaxed
    ? `${label} au maximum`
    : canUpgrade
      ? `Ameliorer ${label}`
      : `${label} bloque: ${Math.floor(bonus.xp)}/${cost} XP`;
  return `
    <button
      class="blackjack-bonus-toggle is-unlocked ${isMaxed ? 'is-maxed' : ''} ${canUpgrade ? '' : 'is-disabled'}"
      data-action="buyBlackjackBonusUpgrade"
      data-bonus-id="${bonusId}"
      data-tooltip="${title}"
      aria-label="${title}"
      aria-pressed="true"
      aria-disabled="${canUpgrade ? 'false' : 'true'}"
    >
      <span aria-hidden="true">${icon}</span>
    </button>
  `;
}

function blackjackHandValueBadge(label: string, value: string, hand: 'dealer' | 'player'): string {
  return `
    <aside class="blackjack-hand-value is-${hand}" aria-label="${label} ${value}">
      <small>${label}</small>
      <strong>${value}</strong>
    </aside>
  `;
}

function blackjackPlayerHandRow(
  hand: BlackjackCard[],
  label: string,
  bet: number,
  keyHand: 'player' | 'split',
  isActive: boolean,
  outcomeClass: string,
  previousHand: string[],
  handGrew: boolean,
  scoreText: string | null,
): string {
  return `
    <div class="blackjack-hand-row is-player-row ${isActive ? 'is-active-hand' : ''}">
      <div class="blackjack-hand is-player ${outcomeClass}" style="--hand-size: ${Math.max(1, hand.length)}" aria-label="Main ${label}">
        ${hand
          .map((card, index) => {
            const cardKey = blackjackCardKey(card, keyHand);
            const isNewCard = !previousHand.includes(cardKey);
            return blackjackCard(
              card,
              false,
              'player',
              index,
              hand.length,
              isNewCard,
              handGrew && !isNewCard,
            );
          })
          .join('')}
      </div>
      ${scoreText ? blackjackHandValueBadge(label, scoreText, 'player') : ''}
      ${bet > 0 ? `<span class="blackjack-hand-bet">Mise ${bet}</span>` : ''}
    </div>
  `;
}

function blackjackBonusStrip(state: GameState): string {
  const bonusIds: BlackjackSideBonusId[] = ['pair', 'twentyOneThree'];
  const visibleBonuses = bonusIds.filter(
    (bonusId) => blackjackBonusState(state, bonusId).unlocked,
  );
  if (visibleBonuses.length === 0 && state.blackjack.debt <= 0) {
    return '';
  }

  return `
    <div class="blackjack-bonus-strip" aria-label="Bonus blackjack">
      ${visibleBonuses.map((bonusId) => blackjackBonusStatusPill(state, bonusId)).join('')}
      ${
        state.blackjack.lastDebtPayment > 0
          ? `<span class="blackjack-bonus-pill is-debt">Dette -${Math.floor(state.blackjack.lastDebtPayment)}</span>`
          : ''
      }
    </div>
  `;
}

function blackjackBonusStatusPill(state: GameState, bonusId: BlackjackSideBonusId): string {
  const bonus = blackjackBonusState(state, bonusId);
  const label = bonusId === 'pair' ? 'Pair' : '21+3';
  const reward = bonus.lastPayout > 0 ? ` +${Math.floor(bonus.lastPayout)}` : '';
  const xp = bonus.lastXp > 0 ? ` XP +${bonus.lastXp}` : '';
  return `<span class="blackjack-bonus-pill">${label} Lv ${bonus.level}: ${bonus.lastOutcome}${reward}${xp}</span>`;
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

function blackjackCardKey(card: BlackjackCard, hand: 'dealer' | 'player' | 'split'): string {
  return `${hand}:${card.rank}:${card.suit}`;
}

function blackjackTwentyOneBannerText(state: GameState): string {
  const blackjack = state.blackjack;
  if (blackjack.phase === 'idle' || blackjack.playerHand.length === 0) {
    return '';
  }

  const playerHand = blackjack.activeHand === 'split' && blackjack.splitHand ? blackjack.splitHand : blackjack.playerHand;
  const playerValue = blackjackHandValue(playerHand);
  const dealerValue = blackjackHandValue(blackjack.dealerHand);
  if (playerValue !== 21 && dealerValue !== 21) {
    return '';
  }

  const dealerNatural = blackjackIsNaturalTwentyOne(blackjack.dealerHand);
  const playerNatural = blackjack.splitHand === null && blackjackIsNaturalTwentyOne(playerHand);
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
  return blackjackResultSummary(state);
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
    case 'dealer':
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
  const rangeScale = defenseTowerRange(state);
  const healthPercent = defenseHealthPercent(state);
  const maxHealth = defenseMaxTowerHealth(state);
  const currentHealth = Math.ceil(defense.towerHealth);
  const healthToneClass = defenseHealthToneClass(healthPercent);

  return `
    <div class="defense-panel ${defense.paused ? 'is-paused' : ''}" style="--defense-time-scale:${defenseTimeScale(defense.speedMultiplier)}">
      <div class="defense-arena ${hasTiledTerrain ? 'has-tiled-map' : ''}" style="--defense-shot:${defense.shotPulse % 2}" role="img" aria-label="Mini jeu Bastion Arcanique">
        <div class="defense-terrain ${hasTiledTerrain ? 'is-tiled' : 'is-fallback'}" aria-hidden="true">
          ${renderDefenseTiledTerrain()}
        </div>
        ${defenseWaveChooser(defense.wave)}
        <div class="defense-range" style="--defense-range-scale:${rangeScale.toFixed(3)}" aria-hidden="true"></div>
        ${defenseIceActive(state) ? defenseIceAuraMarkup(state) : ''}
        <div class="defense-status-hud" aria-label="Etat du bastion">
          <span class="defense-hud-health ${healthToneClass}" title="HP ${currentHealth}/${maxHealth}" aria-label="HP ${currentHealth}/${maxHealth}">
            <i class="defense-hp-sprite" data-defense-hp-sprite style="${defenseHpSpriteStyle(healthPercent)}" aria-hidden="true"></i>
            <strong class="defense-hp-value" data-dynamic-value="defense-health-value">${currentHealth}</strong>
          </span>
          <span class="defense-hud-wave" title="Vague"><strong data-dynamic-value="defense-wave">${defense.wave}</strong></span>
          <span class="defense-hud-money" title="Sceaux">◆ <strong data-dynamic-value="defense-money">${compactHudNumber(state.resources.sigils)}</strong></span>
        </div>
        ${defenseWaveRail(state)}
        <div class="defense-lanes" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
        <i class="defense-orb" aria-hidden="true"></i>
        <div class="defense-actors" aria-hidden="true">
          ${defenseActorsMarkup(defense)}
        </div>
        ${hasTiledTerrain ? `<div class="defense-foreground" aria-hidden="true">${renderDefenseTiledForeground()}</div>` : ''}
        ${
          hasTiledTerrain
            ? ''
            : `<div class="defense-tower" aria-hidden="true">
                <span></span>
              </div>`
        }
        <button class="defense-speed-toggle ${defense.paused ? 'is-paused' : ''}" data-action="cycleDefenseSpeed" data-book-id="defense" title="Vitesse du jeu TD" aria-label="Changer la vitesse du tower defense">x${defense.speedMultiplier}</button>
      </div>
      <div class="defense-skill-dock">
        ${defenseSkillShop(state, false, { docked: true, showCompactButton: false })}
      </div>
    </div>
  `;
}

function defenseIceAuraMarkup(state: GameState): string {
  const rangeScale = defenseIceRange(state).toFixed(3);
  return `
    <i class="defense-ice-range" style="--defense-ice-range-scale:${rangeScale}" aria-hidden="true"></i>
    <i class="defense-ice-aura" style="--defense-ice-range-scale:${rangeScale}" aria-hidden="true"></i>
  `;
}

function defenseTimeScale(speedMultiplier: number): string {
  return (1 / Math.max(1, speedMultiplier)).toFixed(3);
}

function defenseWaveChooser(wave: number): string {
  const currentWave = Math.min(100, Math.max(1, Math.floor(wave)));

  return `
    <div class="defense-wave-chooser" aria-label="Choisir la vague TD">
      <button type="button" data-action="setDefenseWaveDelta" data-book-id="defense" data-wave-delta="-1" aria-label="Vague precedente">-</button>
      <label>
        <span>Wave</span>
        <input data-defense-wave-input type="number" min="1" max="100" step="1" value="${currentWave}" inputmode="numeric" aria-label="Vague TD" />
      </label>
      <button type="button" data-action="setDefenseWaveDelta" data-book-id="defense" data-wave-delta="1" aria-label="Vague suivante">+</button>
    </div>
  `;
}

function defenseActorsMarkup(defense: GameState['defense']): string {
  return [
    defense.shots.map((shot) => defenseShotMarkup(shot)).join(''),
    defense.enemyProjectiles.map((projectile) => defenseEnemyProjectileMarkup(projectile)).join(''),
    defense.lightningStrikes
      .map((strike) => defenseLightningStrikeMarkup(
        strike,
        undefined,
        defense.enemies.find((enemy) => enemy.id === strike.targetEnemyId),
      ))
      .join(''),
    defense.enemies.map((enemy) => defenseEnemyHealthBarMarkup(enemy)).join(''),
    defense.enemies.map((enemy) => defenseEnemyMarkup(enemy)).join(''),
    defense.damagePopups.map((popup) => defenseDamagePopupMarkup(popup)).join(''),
    defense.moneyPopups.map((popup) => defenseMoneyPopupMarkup(popup)).join(''),
  ].join('');
}

function defenseEnemyKindClass(enemy: GameState['defense']['enemies'][number]): string {
  return enemy.kind === 'skeletonMage'
    ? ' is-skeleton-mage'
    : enemy.kind === 'bat'
      ? ' is-bat'
      : enemy.kind === 'goblinKing'
        ? ' is-goblin-king'
        : '';
}

function defenseEnemyHealthBarClass(enemy: GameState['defense']['enemies'][number]): string {
  return `defense-enemy-health-bar${defenseEnemyKindClass(enemy)}${enemy.state === 'dying' ? ' is-dying' : ''}`;
}

function defenseEnemyHealthBarMarkup(enemy: GameState['defense']['enemies'][number]): string {
  const position = defenseEnemyPosition(enemy);
  const health = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));

  return `
    <i
      class="${defenseEnemyHealthBarClass(enemy)}"
      data-enemy-id="${enemy.id}"
      style="--enemy-x:${position.x}%; --enemy-y:${position.y}%; --enemy-health-value:${health}"
      aria-hidden="true"
    ><b></b></i>
  `;
}

function defenseEnemyMarkup(enemy: GameState['defense']['enemies'][number]): string {
  const position = defenseEnemyPosition(enemy);
  const facingScale = defenseEnemyFacingScale(position);
  const walkOffset = defenseEnemyWalkOffset(enemy);
  const kindClass = defenseEnemyKindClass(enemy);
  const stateClass =
    enemy.state === 'dying'
      ? ' is-dying'
      : enemy.state === 'attacking'
        ? ' is-attacking'
        : enemy.state === 'idle'
          ? ' is-idle'
          : '';

  return `
    <i
      class="defense-enemy${kindClass}${stateClass}"
      data-enemy-id="${enemy.id}"
      style="${walkOffset}--enemy-x:${position.x}%; --enemy-y:${position.y}%; --enemy-facing-scale:${facingScale}"
      aria-hidden="true"
    ></i>
  `;
}

function defenseEnemyWalkOffset(enemy: GameState['defense']['enemies'][number]): string {
  if ((enemy.kind ?? 'slime') !== 'slime' || enemy.state === 'dying') {
    return '';
  }

  const offset = -(Date.now() % DEFENSE_SLIME_WALK_CYCLE_MS);
  return `--enemy-walk-offset:${offset}ms; `;
}

function defenseEnemyProjectileMarkup(projectile: GameState['defense']['enemyProjectiles'][number]): string {
  const source = defenseEnemyPosition(projectile);
  const projectileAngle = Math.atan2(50 - source.y, 50 - source.x) * (180 / Math.PI) - 90;
  const projectileDurationMs = Math.max(1, Math.round(projectile.duration * 1000));
  return `
    <i
      class="defense-enemy-projectile"
      data-enemy-projectile-id="${projectile.id}"
      style="--enemy-shot-x:${source.x.toFixed(3)}%; --enemy-shot-y:${source.y.toFixed(3)}%; --enemy-shot-angle:${projectileAngle.toFixed(2)}deg; --enemy-shot-duration:${projectileDurationMs}ms"
      aria-hidden="true"
    ></i>
  `;
}

function defenseLightningStrikeMarkup(
  strike: GameState['defense']['lightningStrikes'][number],
  visualPosition?: DefensePoint,
  targetEnemy?: GameState['defense']['enemies'][number],
): string {
  const position = visualPosition ?? defenseEnemyPosition(strike);
  const durationMs = Math.max(1, Math.round(strike.duration * 1000));
  const targetClass = targetEnemy ? defenseLightningTargetClass(targetEnemy) : '';
  return `
    <i
      class="defense-lightning-strike${targetClass}"
      data-lightning-strike-id="${strike.id}"
      style="--lightning-x:${position.x.toFixed(3)}%; --lightning-y:${position.y.toFixed(3)}%; --lightning-duration:${durationMs}ms"
      aria-hidden="true"
    ></i>
  `;
}

function defenseLightningTargetClass(enemy: GameState['defense']['enemies'][number]): string {
  const kind = enemy.kind ?? 'slime';
  return kind === 'skeletonMage'
    ? ' is-target-skeleton-mage'
    : kind === 'bat'
      ? ' is-target-bat'
      : kind === 'goblinKing'
        ? ' is-target-goblin-king'
        : ' is-target-slime';
}

function defenseShotMarkup(shot: GameState['defense']['shots'][number]): string {
  const shotTarget = defenseEnemyVisibleCenter({ lane: shot.lane, distance: shot.distance, kind: shot.targetKind });
  const shotAngle = Math.atan2(shotTarget.y - 50, shotTarget.x - 50) * (180 / Math.PI) - 90;
  const shotDurationMs = Math.max(1, Math.round((shot.duration * 1000) / 0.85));
  return `
    <i
      class="defense-shot"
      data-shot-id="${shot.id}"
      style="--shot-target-x:${shotTarget.x.toFixed(3)}%; --shot-target-y:${shotTarget.y.toFixed(3)}%; --shot-angle:${shotAngle.toFixed(2)}deg; --shot-duration:${shotDurationMs}ms"
      aria-hidden="true"
    ></i>
  `;
}

function defenseWaveRail(state: GameState): string {
  const finalWave = 100;
  const wave = Math.min(finalWave, Math.max(1, state.defense.wave));
  const progress = defenseWaveRailProgress(state, wave);
  const segment = DEFENSE_WAVE_MARKER_STEP_PERCENT;
  const railSegment = DEFENSE_WAVE_RAIL_STEP_PERCENT;
  const slide = progress * segment;
  const fillProgress = progress * railSegment;
  const fillLeft = wave === 1 ? 50 - fillProgress : 50 - railSegment;
  const fillWidth = wave === 1 ? fillProgress : railSegment;
  const fillOpacity = wave === 1 && progress <= 0.001 ? 0 : 1;
  const markerValues = [
    wave > 1 ? { value: wave - 1, slot: 'previous', baseX: 50 - segment } : null,
    { value: wave, slot: 'current', baseX: 50 },
    wave < finalWave ? { value: wave + 1, slot: 'next', baseX: 50 + segment } : null,
    wave + 2 <= finalWave ? { value: wave + 2, slot: 'after-next', baseX: 50 + segment * 2 } : null,
  ].filter((marker): marker is { value: number; slot: string; baseX: number } => Boolean(marker));
  const markers = markerValues
    .map((marker) => {
      const stateClass = marker.value < wave ? ' is-past' : marker.value === wave ? ' is-current' : '';
      const finalClass = marker.value === finalWave ? ' is-final' : '';
      return `<span class="${`${stateClass}${finalClass} is-${marker.slot}`.trim()}" style="--wave-marker-base-x:${marker.baseX.toFixed(3)}%">${marker.value}</span>`;
    })
    .join('');

  return `
    <div class="defense-wave" data-defense-wave="${wave}" aria-label="Vague ${wave}" style="--wave-marker-step:${segment.toFixed(3)}%; --wave-rail-step:${railSegment.toFixed(3)}%; --wave-slide:${slide.toFixed(3)}%; --wave-fill-left:${fillLeft.toFixed(3)}%; --wave-fill-width:${fillWidth.toFixed(3)}%; --wave-fill-opacity:${fillOpacity}">
      <div class="defense-wave-track">
        <i class="defense-wave-fill" aria-hidden="true"></i>
        <i class="defense-wave-markers">${markers}</i>
      </div>
    </div>
  `;
}

function defenseDamagePopupMarkup(popup: GameState['defense']['damagePopups'][number]): string {
  const position = defenseEnemyPosition(popup);
  const motion = defenseDamagePopupMotion(popup);
  return `
    <span
      class="defense-damage-popup is-${popup.kind}"
      data-popup-id="${popup.id}"
      style="--damage-x:${position.x}%; --damage-y:${position.y}%; ${motion}"
      aria-hidden="true"
    >${popup.amount}</span>
  `;
}

function defenseDamagePopupMotion(popup: GameState['defense']['damagePopups'][number]): string {
  const kindSeed = popup.kind === 'superCritical' ? 29 : popup.kind === 'critical' ? 17 : 5;
  const seed = popup.id * 53 + popup.amount * 17 + kindSeed;
  const offsetX = ((seed % 7) - 3) * 4;
  const offsetY = -10 - (Math.floor(seed / 7) % 5) * 3;
  const driftX = ((Math.floor(seed / 31) % 7) - 3) * 2;
  return [
    `--damage-offset-x:${offsetX}px`,
    `--damage-offset-y:${offsetY}px`,
    `--damage-drift-mid-x:${(driftX * 0.5).toFixed(1)}px`,
    `--damage-drift-late-x:${(driftX * 0.8).toFixed(1)}px`,
    `--damage-drift-x:${driftX}px`,
  ].join('; ');
}

function defenseMoneyPopupMarkup(popup: GameState['defense']['moneyPopups'][number]): string {
  const position = defenseEnemyPosition(popup);
  const motion = defenseMoneyPopupMotion(popup);
  return `
    <span
      class="defense-money-popup"
      data-money-popup-id="${popup.id}"
      style="--money-x:${position.x}%; --money-y:${position.y}%; --money-heat:${defenseMoneyPopupHeat(popup.combo).toFixed(3)}; --money-stack:${defenseMoneyPopupStack(popup.combo)}; ${motion}"
      aria-hidden="true"
    ><i></i><b>+${popup.amount}</b></span>
  `;
}

function defenseMoneyPopupMotion(popup: GameState['defense']['moneyPopups'][number]): string {
  const seed = popup.id * 97 + popup.amount * 13 + popup.combo * 17;
  const direction = ((seed % 9) - 4) / 4;
  const lift = (Math.floor(seed / 9) % 5) - 2;
  const rotateA = -10 + (seed % 7) * 3;
  const rotateB = -6 + (Math.floor(seed / 7) % 7) * 2;
  const rotateC = -9 + (Math.floor(seed / 17) % 7) * 3;
  const kickX = direction * 9;
  const driftX = direction * 24;
  const driftY = -28 + lift * 3;
  return [
    `--money-kick-x:${kickX.toFixed(1)}px`,
    `--money-drift-x:${driftX.toFixed(1)}px`,
    `--money-drift-y:${driftY.toFixed(1)}px`,
    `--money-rotate-a:${rotateA}deg`,
    `--money-rotate-b:${rotateB}deg`,
    `--money-rotate-c:${rotateC}deg`,
  ].join('; ');
}

function defenseMoneyPopupHeat(combo: number): number {
  return Math.max(0, Math.min(1, (combo - 1) / 9));
}

function defenseMoneyPopupStack(combo: number): number {
  return Math.max(0, Math.min(5, combo - 1));
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

function installDefenseControls(): void {
  if (defenseControlsInstalled) {
    return;
  }
  defenseControlsInstalled = true;
  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'l' || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    const state = gameStore.snapshot;
    if (state.selectedBook !== 'defense' || !isBookPanelOpen(state, 'defense') || !state.books.defense.unlocked) {
      return;
    }

    event.preventDefault();
    gameStore.dispatch({ type: 'toggleDefensePause' });
  });
}

function installPanelSizeControls(): void {
  if (panelSizeControlsInstalled) {
    return;
  }
  panelSizeControlsInstalled = true;
  window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() !== 'h' || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    const state = gameStore.snapshot;
    const focusedPanel = state.openBookPanels.find((panel) => panel.bookId === state.selectedBook);
    const panelToResize = focusedPanel ?? state.openBookPanels[state.openBookPanels.length - 1];
    if (!panelToResize || !rootElement) {
      return;
    }

    const panelElement = rootElement.querySelector<HTMLElement>(
      `.book-overlay[data-book-id="${panelToResize.bookId}"]`,
    );
    if (!panelElement) {
      return;
    }

    event.preventDefault();
    focusBookPanel(panelToResize.bookId);
    cycleBookPanelSize(panelToResize.bookId, panelElement);
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

function upgradeManaCost(bookId: BookId, state: GameState): number {
  const level = state.books[bookId].level;
  return Math.round(20 * Math.pow(1.55, level - 1));
}

function upgradeResourceCost(bookId: BookId, state: GameState): number {
  const level = state.books[bookId].level;
  return Math.round(3 * Math.pow(1.35, level - 1));
}
