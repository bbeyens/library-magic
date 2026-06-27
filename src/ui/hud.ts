import { books, getBook, type BookId } from '../game/content/books';
import {
  hasDefenseTiledMap,
  loadDefenseTiledMap,
  renderDefenseTiledForeground,
  renderDefenseTiledTerrain,
} from '../game/content/tdTiledMap';
import { defenseEnemyPosition } from '../game/simulation/defenseRules';
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
  manaAutomationInterval,
  manaCriticalMultiplier,
  manaSkillCost,
  manaSkillMaxLevel,
  manaWandCount,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseEnemyReward,
  defenseMaxTowerHealth,
  defenseMoneyPerWave,
  defenseSkillCost,
  defenseSkillMaxLevel,
  defenseTowerHealthRegenPerSecond,
  defenseTowerRange,
  defenseTowerRangePercent,
  defenseTowerResistance,
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
import {
  MINING_BLOCK_MATERIALS,
  MINING_GRID_COLUMNS,
  MINING_GRID_ROWS,
  MINING_MATERIAL_RESOURCE_IDS,
  miningBlockCrackOverlayForDamage,
  miningBlockMaterialById,
  miningBlockSpriteTierForDepth,
  miningMaterialExchangeValue,
  type BlackjackCard,
  type BookPanelSlot,
  type GameState,
  type MiningBlock,
  type SnakeCell,
  type SnakeDirection,
} from '../game/simulation/state';

let rootElement: HTMLDivElement | null = null;
let openUpgradePanel: BookId | null = null;
let upgradePanelMode: 'detail' | 'compact' = 'detail';
let lastRenderSignature = '';
let lastOpenPanelsSignature = '';
let lastOpenUpgradePanel: BookId | null = null;
let lastUpgradePanelMode: 'detail' | 'compact' = 'detail';
let lastSnakeRewardMarker = '';
let lastRuneTypingRewardMarker = '';
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
let snakeControlsInstalled = false;
let typingControlsInstalled = false;
let blackjackControlsInstalled = false;
let escapeControlsInstalled = false;
let suppressClickListenerInstalled = false;
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
const pendingFloatingGains = new Map<string, { amount: number }>();
let floatingGainFlushHandle: number | null = null;
const BOOK_PANEL_ASPECT_RATIO = 210 / 297;
const BOOK_PANEL_MIN_HORIZONTAL_TRAVEL = 96;
const BOOK_PANEL_SIZE_PRESETS = [
  { id: 'small', label: 'S', width: 245 },
  { id: 'medium', label: 'M', width: 370 },
  { id: 'large', label: 'L', width: 496 },
] as const;
const DEFENSE_LARGE_PANEL_SCALE = 1.3;
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
  installEscapeControls();
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
    <button class="unlock-all-grimoires-button" data-action="unlockAllBooks" title="Debloquer tous les grimoires" aria-label="Debloquer tous les grimoires">-</button>
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
      if (action === 'buyDefenseSkill') {
        const skillId = button.dataset.skillId as DefenseSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buyDefenseSkill', skillId });
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

  rootElement.querySelectorAll<HTMLElement>('.book-overlay, .mini-skill-popover, .upgrade-panel').forEach((panel) => {
    panel.addEventListener('pointerdown', stopHudPointerEvent);
    panel.addEventListener('pointerup', stopHudPointerEvent);
    panel.addEventListener('click', stopHudPointerEvent);
  });
  installBookPanelFocus();
  installBookPanelDragging();

  updateDynamicHudValues(state);
  runHudTransientEffects(state);
  scheduleBlackjackAutoDeal(state);
  scheduleBlackjackDealerStep(state);
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
  setDynamicText('mana', Math.floor(state.mana));
  setDynamicText('scales', Math.floor(state.resources.scales));
  setDynamicText('runes', Math.floor(state.resources.runes));
  setDynamicText('spores', Math.floor(state.resources.spores));
  setDynamicText('sigils', Math.floor(state.resources.sigils));
  const displayedChips =
    isBookPanelOpen(state, 'blackjack') && blackjackMotionIsSettling() && lastBlackjackSettledDisplay
      ? lastBlackjackSettledDisplay.chips
      : Math.floor(state.resources.chips);
  setDynamicText('chips', displayedChips);
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
  animateHundredProgress(state);
  updateDynamicDefensePanel(state);
}

function defenseHealthPercent(state: GameState): number {
  return Math.max(0, Math.min(100, (state.defense.towerHealth / defenseMaxTowerHealth(state)) * 100));
}

function updateDynamicDefensePanel(state: GameState): void {
  if (!rootElement || !isBookPanelOpen(state, 'defense')) {
    return;
  }

  const healthPercent = defenseHealthPercent(state);
  const healthBar = rootElement.querySelector<HTMLElement>('.defense-health');
  const healthFill = rootElement.querySelector<HTMLElement>('.defense-health i');
  if (healthBar) {
    healthBar.classList.toggle('is-full', healthPercent >= 100);
  }
  if (healthFill) {
    healthFill.style.width = `${healthPercent}%`;
  }

  const waveFill = rootElement.querySelector<HTMLElement>('.defense-wave-fill');
  if (waveFill) {
    waveFill.style.width = `${Math.round(defenseWaveProgress(state) * 25)}%`;
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
      enemyElement.classList.toggle('is-dying', enemy.state === 'dying');
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
  } else if (currentShot?.dataset.shotId !== String(state.defense.shot.id)) {
    currentShot?.remove();
    actorsLayer.insertAdjacentHTML('afterbegin', defenseShotMarkup(state.defense));
  }

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
  renderHud(gameStore.snapshot);
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
  if (bookId === 'defense' && preset.id === 'large') {
    return Math.round(preset.width * DEFENSE_LARGE_PANEL_SCALE);
  }
  return preset.width;
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
  const hundred = state.hundred;
  const targetState = state.targets;
  const targetSkills = state.targetSkills;
  const mining = state.mining;
  const miningSkills = state.miningSkills;
  const defenseSkills = state.defenseSkills;
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
    state.defense.wave,
    Math.ceil(state.defense.towerHealth),
    state.defense.score,
    state.defense.best,
    state.defense.lastReward,
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
    defenseSkills.damage,
    defenseSkills.attackSpeed,
    defenseSkills.range,
    defenseSkills.damagePerMeter,
    defenseSkills.criticalChance,
    defenseSkills.criticalMultiplier,
    defenseSkills.ricochetCount,
    defenseSkills.ricochetChance,
    defenseSkills.superCriticalChance,
    defenseSkills.superCriticalMultiplier,
    defenseSkills.health,
    defenseSkills.healthRegen,
    defenseSkills.resistance,
    defenseSkills.moneyPerEnemy,
    defenseSkills.moneyPerWave,
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
          ${defenseSkillCompactButton(state, 'ricochetCount', '↷')}
          ${defenseSkillCompactButton(state, 'health', '♥')}
          ${defenseSkillCompactButton(state, 'resistance', '▣')}
          ${defenseSkillCompactButton(state, 'moneyPerEnemy', '◆')}
          ${defenseSkillCompactButton(state, 'moneyPerWave', '◈')}
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
          ${defenseSkillCompactButton(state, 'ricochetCount', '↷')}
          ${defenseSkillCompactButton(state, 'health', '♥')}
          ${defenseSkillCompactButton(state, 'resistance', '▣')}
          ${defenseSkillCompactButton(state, 'moneyPerEnemy', '◆')}
          ${defenseSkillCompactButton(state, 'moneyPerWave', '◈')}
        </div>
      </section>
    `;
  }

  return `
    <section class="upgrade-panel is-mana-skills is-blackjack-upgrades is-standard-upgrades ${shouldAnimate ? 'is-entering' : ''}" aria-label="Competences du bastion">
      <button class="upgrade-panel-close" data-action="toggleUpgradePanel" data-book-id="defense" title="Fermer">×</button>
      <div class="blackjack-upgrade-panel-header">
        <div>
          <strong>Table des upgrades</strong>
          <span>Bastion</span>
        </div>
        <button class="blackjack-upgrade-hide" data-action="toggleCompactUpgradePanel" data-book-id="defense" title="Masquer le panneau complet">
          Compact
        </button>
      </div>
      <div class="blackjack-upgrade-board defense-upgrade-board" aria-label="Upgrades bastion">
        ${defenseUpgradeRow('Attaque', 'Degats, cadence et critiques', [
          defenseSkillTrack(state, 'damage', '▲', 'Damage', `${defenseTowerDamage(state)} degats`, '+1 degat par niveau'),
          defenseSkillTrack(state, 'attackSpeed', '⌁', 'Attack speed', `${defenseTowerAttackInterval(state).toFixed(2)}s`, 'Reduit le cooldown de tir'),
          defenseSkillTrack(state, 'damagePerMeter', '⇢', 'Damage / metre', `+${(state.defenseSkills.damagePerMeter * 0.75).toFixed(1)}/m`, 'Plus un ennemi est loin, plus il prend cher'),
          defenseSkillTrack(state, 'criticalChance', '◇', 'Critical chance', `${Math.round(Math.min(60, state.defenseSkills.criticalChance * 2))}%`, 'Chance de coup critique'),
          defenseSkillTrack(state, 'criticalMultiplier', '✦', 'Critical multiplier', `x${(2 + state.defenseSkills.criticalMultiplier * 0.125).toFixed(2)}`, 'Multiplicateur des critiques'),
          defenseSkillTrack(state, 'superCriticalChance', '✹', 'Super critic chance', `${Math.round(Math.min(25, state.defenseSkills.superCriticalChance))}%`, 'Chance de super critique'),
          defenseSkillTrack(state, 'superCriticalMultiplier', '✷', 'Super critical multiplier', `x${(3 + state.defenseSkills.superCriticalMultiplier * 0.25).toFixed(2)}`, 'Multiplicateur du super critique'),
        ])}
        ${defenseUpgradeRow('Défense', 'Vie, soin et mitigation', [
          defenseSkillTrack(state, 'health', '♥', 'Vie', `${Math.round(state.defense.towerHealth)}/${defenseMaxTowerHealth(state)}`, '+2 PV max par niveau'),
          defenseSkillTrack(state, 'healthRegen', '+', 'Regen de vie', `${defenseTowerHealthRegenPerSecond(state).toFixed(2)}/s`, 'Regeneration continue'),
          defenseSkillTrack(state, 'resistance', '▣', 'Resistance', `${Math.round(defenseTowerResistance(state) * 100)}%`, 'Reduit les degats entrants'),
        ])}
        ${defenseUpgradeRow('Utility', 'Portee, ricochets et gains', [
          defenseSkillTrack(state, 'range', '◎', 'Range', `${Math.round(defenseTowerRangePercent(state) * 100)}%`, 'Agrandit le cercle de portee'),
          defenseSkillTrack(state, 'ricochetCount', '↷', 'Ricochet count', `${state.defenseSkills.ricochetCount}`, 'Nombre de rebonds possibles'),
          defenseSkillTrack(state, 'ricochetChance', '⤷', 'Ricochet chance', `${Math.round(Math.min(80, state.defenseSkills.ricochetChance * 4))}%`, 'Chance de declencher un ricochet'),
          defenseSkillTrack(state, 'moneyPerEnemy', '◆', 'Monnaie / ennemi', `${defenseEnemyReward(state)} sceaux`, '+1 sceau par ennemi'),
          defenseSkillTrack(state, 'moneyPerWave', '◈', 'Monnaie / vague', `${defenseMoneyPerWave(state)} sceaux`, '+3 sceaux par vague'),
        ])}
      </div>
    </section>
  `;
}

function defenseUpgradeRow(title: string, subtitle: string, tracks: StandardUpgradeTrack[]): string {
  return `
    <article class="blackjack-upgrade-track defense-upgrade-row">
      <div class="blackjack-upgrade-track-main defense-upgrade-row-main">
        <header>
          <strong>${title}</strong>
          <span>${subtitle}</span>
        </header>
      </div>
      <div class="defense-upgrade-nodes">
        ${tracks.map(defenseUpgradeNode).join('')}
      </div>
    </article>
  `;
}

function defenseUpgradeNode(track: StandardUpgradeTrack): string {
  const actionAttributes = track.action && track.skillId ? `data-action="${track.action}" data-skill-id="${track.skillId}"` : '';
  const disabled = track.isMaxed ? 'disabled' : '';
  const title = `${track.title} - ${track.subtitle} - ${track.levelLabel} - ${track.costText}`;
  return `
    <button
      class="blackjack-upgrade-node defense-upgrade-node ${track.isMaxed ? 'is-owned is-maxed' : ''}"
      ${actionAttributes}
      ${disabled}
      title="${title}"
      aria-label="${title}"
    >
      <b>${track.icon}</b>
      <span>${track.levelLabel.replace('Lv ', '')}</span>
      <i class="blackjack-upgrade-tooltip" role="tooltip">
        <strong>${track.title}</strong>
        <small>${track.subtitle}</small>
        <small>${track.detail}</small>
        <em class="blackjack-tooltip-cost">
          <span>Cout</span>
          <b>${track.costHtml}</b>
        </em>
      </i>
    </button>
  `;
}

function defenseSkillTrack(
  state: GameState,
  skillId: DefenseSkillId,
  icon: string,
  label: string,
  value: string,
  detail: string,
): StandardUpgradeTrack {
  const level = state.defenseSkills[skillId];
  const maxLevel = defenseSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = defenseSkillCost(state, skillId);
  return {
    action: 'buyDefenseSkill',
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
    ${standardUpgradePanel('mine', shouldAnimate, 'Table des upgrades', 'Mine', [
      miningSkillTrack(state, 'pickaxeForce', '▲', 'Force de pioche', `${miningPickaxeDamage(state)} degats`, '+1 degat par niveau'),
      miningSkillTrack(state, 'splashDamage', '✣', 'Splash', `${miningSplashDamage(state)} voisin`, 'Tape les blocs adjacents'),
      miningSkillTrack(state, 'automation', '⌁', 'Automatisation', miningAutomationLabel(state), 'Creuse le bloc le plus fragile'),
    ])}
  `;
}

function miningSkillTrack(
  state: GameState,
  skillId: MiningSkillId,
  icon: string,
  label: string,
  value: string,
  detail: string,
): StandardUpgradeTrack {
  const level = state.miningSkills[skillId];
  const maxLevel = miningSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = miningSkillCost(state, skillId);
  return {
    action: 'buyMiningSkill',
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
  return Math.min(18, Math.max(2, Math.ceil(Math.sqrt(gain) * 1.35)));
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
  const exchangeValue = miningMaterialExchangeTotal(state);
  const blocks = state.mining.blocks
    .map((block) => {
      const health = Math.max(0, Math.round((block.health / block.maxHealth) * 100));
      const material = miningBlockMaterialById(block.material);
      const spriteTier = miningBlockSpriteTierForDepth(block.depth);
      const crackOverlay = miningBlockCrackOverlayForDamage(block.health, block.maxHealth, block.id);
      const crackStyle = crackOverlay
        ? `--crack-opacity:0.75; --crack-x:${crackOverlay.column - 1}; --crack-y:${crackOverlay.row - 1};`
        : '--crack-opacity:0; --crack-x:0; --crack-y:0;';
      return `
        <button
          class="${miningBlockClassNames(state, block)}"
          data-action="digMiningBlock"
          data-block-id="${block.id}"
          data-material="${material.id}"
          data-sprite-index="${spriteTier.spriteIndex}"
          data-shade-level="${spriteTier.shadeLevel}"
          style="--block-health:${health}%; --block-depth:${Math.min(9, block.depth)}; --block-hit:${block.lastHit % 2}; --block-shade:${spriteTier.shadeLevel}; --block-sprite:url('${spriteTier.assetPath}'); ${crackStyle}"
          title="${material.name} - profondeur ${block.depth}, ${block.health}/${block.maxHealth} PV"
          aria-label="Bloc de ${material.name} profondeur ${block.depth}, ${block.health} PV sur ${block.maxHealth}"
        >
          <b>${material.shortName}</b>
          <i>${block.health}</i>
        </button>
      `;
    })
    .join('');

  return `
    <div class="mining-panel">
      <div class="mining-grid-shell">
        <div class="mining-material-bank" aria-label="Ressources de mine">
          ${miningMaterialStocks(state)}
          <button
            class="mining-exchange"
            data-action="exchangeMiningMaterials"
            title="Echanger les ressources contre monnaie de mine"
            aria-label="Echanger les ressources de mine contre ${exchangeValue} pieces de mine"
            ${exchangeValue > 0 ? '' : 'disabled'}
          >
            <span>⇄</span>
            <strong>${exchangeValue}</strong>
          </button>
        </div>
        <div class="mining-grid" role="grid" aria-label="Mine des Profondeurs 7 par 7">
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

function miningMaterialStocks(state: GameState): string {
  return MINING_MATERIAL_RESOURCE_IDS.map((resourceId) => {
    const amount = Math.floor(state.mining.materials[resourceId]);
    const material = MINING_BLOCK_MATERIALS[resourceId];
    return `
      <span class="mining-material-stock is-${resourceId}" title="${material.name}" aria-label="${material.name}: ${amount}">
        <i></i>
        <strong>${amount}</strong>
      </span>
    `;
  }).join('');
}

function miningMaterialExchangeTotal(state: GameState): number {
  return MINING_MATERIAL_RESOURCE_IDS.reduce((total, resourceId) => {
    return total + Math.floor(state.mining.materials[resourceId]) * miningMaterialExchangeValue(resourceId);
  }, 0);
}

function miningBlockClassNames(state: GameState, block: MiningBlock): string {
  const spriteTier = miningBlockSpriteTierForDepth(block.depth);
  const classes = ['mining-block', `is-${block.material}`, `is-shade-${spriteTier.shadeLevel}`, `is-sprite-${spriteTier.spriteIndex}`];
  const x = block.id % MINING_GRID_COLUMNS;
  const y = Math.floor(block.id / MINING_GRID_COLUMNS);
  const neighbors: Array<[string, number, number]> = [
    ['left', x - 1, y],
    ['right', x + 1, y],
    ['up', x, y - 1],
    ['down', x, y + 1],
  ];

  for (const [side, neighborX, neighborY] of neighbors) {
    if (neighborX < 0 || neighborX >= MINING_GRID_COLUMNS || neighborY < 0 || neighborY >= MINING_GRID_ROWS) {
      continue;
    }
    const neighbor = state.mining.blocks[neighborY * MINING_GRID_COLUMNS + neighborX];
    if (neighbor && block.depth > neighbor.depth) {
      classes.push(`has-shadow-${side}`);
    }
  }

  return classes.join(' ');
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
    renderHud(gameStore.snapshot);
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
  const attackInterval = defenseTowerAttackInterval(state).toFixed(2);
  const rangeScale = defenseTowerRange(state);

  return `
    <div class="defense-panel">
      <div class="defense-arena ${hasTiledTerrain ? 'has-tiled-map' : ''}" style="--defense-shot:${defense.shotPulse % 2}" role="img" aria-label="Mini jeu Bastion Arcanique">
        <div class="defense-terrain ${hasTiledTerrain ? 'is-tiled' : 'is-fallback'}" aria-hidden="true">
          ${renderDefenseTiledTerrain()}
        </div>
        <div class="defense-range" style="--defense-range-scale:${rangeScale.toFixed(3)}" aria-hidden="true"></div>
        ${defenseWaveRail(state)}
        <div class="defense-lanes" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
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
        <div class="defense-mini-stats" aria-label="Bastion">
          <span>▲ <strong>${defenseTowerDamage(state)}</strong></span>
          <span>⌁ <strong>${attackInterval}s</strong></span>
          <span>◎ <strong>${Math.round(defenseTowerRangePercent(state) * 100)}%</strong></span>
        </div>
        <button class="defense-speed-toggle" data-action="cycleDefenseSpeed" data-book-id="defense" title="Vitesse du jeu TD" aria-label="Changer la vitesse du tower defense">x${defense.speedMultiplier}</button>
      </div>
    </div>
  `;
}

function defenseActorsMarkup(defense: GameState['defense']): string {
  return `${defenseShotMarkup(defense)}${defense.enemies.map((enemy) => defenseEnemyMarkup(enemy)).join('')}${defense.damagePopups.map((popup) => defenseDamagePopupMarkup(popup)).join('')}`;
}

function defenseEnemyMarkup(enemy: GameState['defense']['enemies'][number]): string {
  const position = defenseEnemyPosition(enemy);
  const health = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));

  return `
    <i
      class="defense-enemy ${enemy.state === 'dying' ? 'is-dying' : ''}"
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

function defenseWaveRail(state: GameState): string {
  const wave = state.defense.wave;
  const progress = Math.round(defenseWaveProgress(state) * 100);
  const markerValues = wave === 1 ? [1, 2, 3, 4] : [wave - 1, wave, wave + 1, wave + 2];
  const currentIndex = markerValues.indexOf(wave);
  const segmentStart = 12.5 + currentIndex * 25;
  const segmentWidth = progress * 0.25;

  return `
    <div class="defense-wave" aria-label="Vague ${wave}">
      <div class="defense-wave-track">
        <i class="defense-wave-fill" style="left:${segmentStart}%; width:${segmentWidth}%"></i>
      </div>
    </div>
  `;
}

function defenseDamagePopupMarkup(popup: GameState['defense']['damagePopups'][number]): string {
  const position = defenseEnemyPosition(popup);
  return `
    <span
      class="defense-damage-popup is-${popup.kind}"
      data-popup-id="${popup.id}"
      style="--damage-x:${position.x}%; --damage-y:${position.y}%"
      aria-hidden="true"
    >${popup.amount}</span>
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

function upgradeManaCost(bookId: BookId, state: GameState): number {
  const level = state.books[bookId].level;
  return Math.round(20 * Math.pow(1.55, level - 1));
}

function upgradeResourceCost(bookId: BookId, state: GameState): number {
  const level = state.books[bookId].level;
  return Math.round(3 * Math.pow(1.35, level - 1));
}
