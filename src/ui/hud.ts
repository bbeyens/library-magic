import { books, getBook, type BookId } from '../game/content/books';
import {
  hasDefenseTiledMap,
  loadDefenseTiledMap,
  renderDefenseTiledForeground,
  renderDefenseTiledTerrain,
} from '../game/content/tdTiledMap';
import {
  defenseEnemyVisibleCenter,
  defenseEnemyImpactPoint,
  defenseEnemyPosition,
  defenseSkeletonMageProjectileOriginPoint,
  type DefensePoint,
} from '../game/simulation/defenseRules';
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
  MANA_CRYSTAL_MAX_LEVEL,
  MANA_XP_PER_LEVEL,
  manaBlueOrbChance,
  manaClickGainPreview,
  manaClickMultiplier,
  manaCrystalLevel,
  manaCrystalCurrentGemIndex,
  manaCrystalDiscoveredGemCount,
  manaCrystalRevealProgress,
  manaCrystalResourceMultiplier,
  manaGreenOrbChance,
  manaAllyFindOrbChance,
  manaAutoClickerCapacity,
  manaAutoClickerCount,
  manaAutoClickerInterval,
  manaCanResearch,
  manaHoldClickUnlocked,
  manaHoldClickRate,
  manaClickResearchSecondsPerFiveClicks,
  MANA_IDLE_COMPANION_SKILL_IDS,
  MANA_RESEARCH_SKILL_IDS,
  manaIdleCompanionDamage,
  manaLevelUpEffectMultiplier,
  manaMeowKnightDamage,
  manaCriticalMultiplier,
  manaResearchDuration,
  manaResearchProgress,
  manaResearchRemainingSeconds,
  manaResearchSpeedMultiplier,
  manaResearchUnlocked,
  manaSkillCost,
  manaSkillMaxLevel,
  manaSkillUpgradeEffectDelta,
  manaYellowOrbChance,
  manaXpOrbChance,
  manaXpOrbValue,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseTowerDamageUpgradeDelta,
  defenseBaseSpeedMultiplier,
  defenseEnemyReward,
  defenseEnemyRewardUpgradeDelta,
  defenseEffectiveSpeedMultiplier,
  defenseExperienceToNextLevel,
  defenseGoldMultiplier,
  defenseIceActive,
  defenseIceAttackInterval,
  defenseIceDamage,
  defenseIceDamageUpgradeDelta,
  defenseIceRange,
  defenseIceRangePercent,
  defenseIceSlow,
  defenseLevelMultiplier,
  defenseLightningAttackInterval,
  defenseLightningDamage,
  defenseLightningDamageUpgradeDelta,
  defenseLightningTargetCount,
  defenseMaxTowerHealth,
  defenseSkillCost,
  defenseSkillDamageMultiplier,
  defenseSkillLocked,
  defenseSkillMaxLevel,
  defenseTowerHealthRegenPerSecond,
  defenseTowerRange,
  defenseTowerRangePercent,
  defenseWaveGoldBoostCount,
  defenseWaveGoldMultiplier,
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
  type ManaResearchSkillId,
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
import { miningIsoBlockIdFromPoint, miningIsoBoardBounds } from './miningIsoGeometry';
import { syncMiningThreeTerrain } from './miningThreeTerrain';
import {
  MINING_MATERIAL_RESOURCE_IDS,
  miningBlockMaterialById,
  type BlackjackCard,
  type BookPanelSlot,
  type GameState,
  type ManaIdleCompanionSkillId,
  type ManaOrbKind,
  type ManaXpOrb,
  type SnakeCell,
  type SnakeDirection,
} from '../game/simulation/state';

let rootElement: HTMLDivElement | null = null;
const MANA_CRYSTAL_COVER_GRID_SIZE = 16;
const MANA_CRYSTAL_COVER_CELL_COUNT = MANA_CRYSTAL_COVER_GRID_SIZE * MANA_CRYSTAL_COVER_GRID_SIZE;
const MANA_CRYSTAL_COVER_CELL_RANKS = createManaCrystalCoverCellRanks();
const MANA_CRYSTAL_GEM_IMAGES = [
  '/assets/Crystal/gems/crystal-a.png',
  '/assets/Crystal/gems/crystal-b.png',
  '/assets/Crystal/gems/crystal-c.png',
  '/assets/Crystal/gems/crystal-d.png',
  '/assets/Crystal/gems/crystal-e.png',
  '/assets/Crystal/gems/crystal-f.png',
  '/assets/Crystal/gems/crystal-g.png',
  '/assets/Crystal/gems/crystal-h.png',
  '/assets/Crystal/gems/crystal-i.png',
  '/assets/Crystal/gems/crystal-j.png',
] as const;
const DEFENSE_WAVE_MARKER_STEP_PERCENT = 24;
const DEFENSE_WAVE_RAIL_STEP_PERCENT = 33;
const DEFENSE_MONEY_COUNTER_POPUP_DELAY_MS = 1000;
const DEFENSE_DAMAGE_POPUP_CANVAS_DURATION_SECONDS = 1.5;
const DEFENSE_FIREBALL_IMPACT_CANVAS_DURATION_SECONDS = 0.36;
const DEFENSE_ICE_IMPACT_CANVAS_DURATION_SECONDS = 0.56;
const DEFENSE_LIGHTNING_IMPACT_CANVAS_DURATION_SECONDS = 0.33;
const DEFENSE_MONEY_GOAL_CACHE_MS = 60_000;
const DEFENSE_DYNAMIC_HUD_MIN_INTERVAL_MS = 1000 / 60;
const DEFENSE_MONEY_COUNTER_PULSE_MIN_INTERVAL_MS = 140;
const DEFENSE_HUD_PERF_SLOW_FRAME_MS = 20;
const DEFENSE_RENDER_MEMORY_PRUNE_CHILD_LIMIT = 80;
let manaCrystalRevealHoldToken = 0;
let manaCrystalRevealHold: { token: number; gemIndex: number } | null = null;
let openUpgradePanel: BookId | null = null;
let upgradePanelMode: 'detail' | 'compact' = 'detail';
let manaSkillShopTab: ManaSkillShopTabId = 'click';
let lastManaSkillDockTab: ManaSkillShopTabId | null = null;
let defenseSkillShopTab: DefenseSkillShopTabId = 'attack';
let lastDefenseSkillDockTab: DefenseSkillShopTabId | null = null;
let miningSkillShopTab: MiningSkillShopTabId = 'mine';
let lastMiningSkillDockTab: MiningSkillShopTabId | null = null;
let lastRenderSignature = '';
let lastOpenPanelsSignature = '';
let lastOpenUpgradePanel: BookId | null = null;
let lastUpgradePanelMode: 'detail' | 'compact' = 'detail';
let lastRenderStructureSignature = '';
let lastSnakeRewardMarker = '';
let lastRuneTypingRewardMarker = '';
let lastRenderStableSignature = '';
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
let lastManaAutoClickCount = 0;
let lastManaMeowKnightAttackCount = 0;
let lastManaIdleCompanionAttackCounts: Partial<Record<ManaIdleCompanionSkillId, number>> = {};
let lastManaDisplayedXp: number | null = null;
let lastManaCollectedXpOrbId = 0;
let manaClickEffectFlip = false;
let manaClickTimestamps: number[] = [];
let manaClickScaleResetTimeout: number | null = null;
let manaHoldClickInterval: number | null = null;
let lastHundredDisplayedProgress = 0;
let lastHundredProgressAnimationMarker = '';
let pendingHundredProgressAnimationMarker = '';
let hundredProgressSettleTimeout: number | null = null;
let activeHundredProgressTarget: number | null = null;
let lastDefenseDisplayedHealth: number | null = null;
let lastDefenseDisplayedSigils: number | null = null;
let lastDefenseDisplayedLevel: number | null = null;
let lastDefenseDisplayedGoldBoostWave: number | null = null;
let lastDefenseCleanupPulse: number | null = null;
let lastDefenseDynamicHudUpdateAt = 0;
let lastDefenseMoneyCounterPulseAt = 0;
let defenseMoneyPulseRemovalTimer: number | null = null;
let lastManaSkillDockSignature = '';
let lastManaSkillCardDynamicSignature = '';
let lastSnakeSkillDockSignature = '';
let lastSnakeSkillCardDynamicSignature = '';
let lastDefenseSkillDockSignature = '';
let lastDefenseSkillCardDynamicSignature = '';
let lastMiningSkillDockSignature = '';
let lastMiningSkillCardDynamicSignature = '';
const defenseEnemyHealthSnapshots = new Map<string, number>();
const dynamicTextSnapshots = new Map<string, string>();
const dynamicResourceGainSnapshots = new Map<string, number>();
const timedOneShotClassTimers = new WeakMap<HTMLElement, Map<string, number>>();
const defenseEnemyHitFeedbackTimes = new WeakMap<HTMLElement, number>();
const defenseEnemyFlinchFeedbackTimes = new WeakMap<HTMLElement, number>();
let defenseActorsSizeCache: { element: HTMLElement | null; sampledAt: number; width: number; height: number } = {
  element: null,
  sampledAt: 0,
  width: 0,
  height: 0,
};
let defenseEffectsCanvasSizeCache: { element: HTMLCanvasElement | null; sampledAt: number; width: number; height: number } = {
  element: null,
  sampledAt: 0,
  width: 0,
  height: 0,
};

type DefenseHudPerfSection = {
  name: string;
  durationMs: number;
};

type DefenseHudPerfSlowFrame = {
  at: number;
  totalMs: number;
  sections: DefenseHudPerfSection[];
  enemies: number;
  shots: number;
  lightning: number;
  money: number;
  actors: number;
  animations: number;
};

type DefenseHudPerfStats = {
  frames: number;
  lastTotalMs: number;
  maxTotalMs: number;
  sectionMaxMs: Record<string, number>;
  sectionLastMs: Record<string, number>;
  slowFrames: DefenseHudPerfSlowFrame[];
  reset: () => void;
};

type WindowWithDefenseHudPerf = Window & {
  __libraryMagicHudPerf?: DefenseHudPerfStats;
};

function createDefenseHudPerfStats(): DefenseHudPerfStats {
  return {
    frames: 0,
    lastTotalMs: 0,
    maxTotalMs: 0,
    sectionMaxMs: {},
    sectionLastMs: {},
    slowFrames: [],
    reset() {
      this.frames = 0;
      this.lastTotalMs = 0;
      this.maxTotalMs = 0;
      this.sectionMaxMs = {};
      this.sectionLastMs = {};
      this.slowFrames = [];
    },
  };
}

function getDefenseHudPerfStats(): DefenseHudPerfStats | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const targetWindow = window as WindowWithDefenseHudPerf;
  if (!targetWindow.__libraryMagicHudPerf) {
    targetWindow.__libraryMagicHudPerf = createDefenseHudPerfStats();
  }
  return targetWindow.__libraryMagicHudPerf;
}
let lastDefenseMoneyGoalSampleAt = 0;
let defenseOrbRecoilAnimation: Animation | null = null;
let snakeControlsInstalled = false;
let manaHoldControlsInstalled = false;
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
  installManaHoldControls();
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
  if (!options.forceFull && shouldPatchOpenManaPanel(state, structureSignature)) {
    lastRenderSignature = signature;
    lastRenderStableSignature = stableSignature;
    updateDynamicHudValues(state);
    refreshManaSkillDock(state);
    runHudTransientEffects(state);
    scheduleBlackjackAutoDeal(state);
    return;
  }
  if (!options.forceFull && shouldPatchOpenDefensePanel(state, structureSignature)) {
    if (shouldSkipDefenseDynamicHudFrame()) {
      return;
    }
    lastRenderSignature = signature;
    lastRenderStableSignature = stableSignature;
    updateDynamicHudValues(state);
    runHudTransientEffects(state);
    scheduleBlackjackAutoDeal(state);
    return;
  }
  if (!options.forceFull && shouldPatchOpenSnakePanel(state, structureSignature)) {
    lastRenderSignature = signature;
    lastRenderStableSignature = stableSignature;
    refreshSnakeBoard(state);
    updateDynamicHudValues(state);
    refreshSnakeSkillDock(state);
    runHudTransientEffects(state);
    scheduleBlackjackAutoDeal(state);
    return;
  }
  if (!options.forceFull && shouldPatchOpenMiningPanel(state, structureSignature)) {
    lastRenderSignature = signature;
    lastRenderStableSignature = stableSignature;
    refreshMiningBoard(state);
    updateDynamicHudValues(state);
    refreshMiningSkillDock(state);
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
    button.addEventListener('click', (event) => {
      const action = button.dataset.action;
      const bookId = button.dataset.bookId as BookId | undefined;
      focusBookPanelFromControl(button, bookId);
      if (action === 'chargeMana') {
        const beforeMana = gameStore.snapshot.mana;
        gameStore.dispatch({ type: 'chargeMana' });
        const gainedMana = gameStore.snapshot.mana - beforeMana;
        showCrystalClickEffect(gainedMana, event);
        showManaLocalFloatingGain(gainedMana, event, 'is-mana-click');
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
        const skillId = button.dataset.skillId;
        if (!button.closest('.mana-skill-dock') && isManaSkillButtonActionable(button, skillId)) {
          gameStore.dispatch({ type: 'buyManaSkill', skillId });
          refreshManaSkillDock(gameStore.snapshot, { force: true });
        }
      }
      if (action === 'setManaSkillShopTab') {
        const tabId = button.dataset.skillShopTab;
        if (isManaSkillShopTabId(tabId)) {
          manaSkillShopTab = tabId;
          refreshManaSkillDock(gameStore.snapshot, { force: true });
        }
      }
      if (action === 'buySnakeSkill') {
        const skillId = button.dataset.skillId as SnakeSkillId | undefined;
        if (skillId) {
          gameStore.dispatch({ type: 'buySnakeSkill', skillId });
          refreshSnakeSkillDock(gameStore.snapshot, { force: true });
        }
      }
      if (action === 'setSnakeSkillShopTab') {
        refreshSnakeSkillDock(gameStore.snapshot, { force: true });
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
      if (action === 'setMiningSkillShopTab') {
        const tabId = button.dataset.skillShopTab;
        if (isMiningSkillShopTabId(tabId)) {
          miningSkillShopTab = tabId;
          refreshMiningSkillDock(gameStore.snapshot, { force: true });
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
          refreshMiningSkillDock(gameStore.snapshot, { force: true });
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
      if (action === 'toggleDefenseBaseSpeed') {
        gameStore.dispatch({ type: 'toggleDefenseBaseSpeed' });
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
  installMiningIsoBoardHandlers();
  syncMiningThreeTerrain(state, (blockId) => {
    const board = rootElement?.querySelector<HTMLElement>('[data-mining-3d-board]');
    if (board) {
      focusBookPanelFromControl(board, 'mine');
    }
    gameStore.dispatch({ type: 'digMiningBlock', blockId });
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

  updateDynamicHudValues(state);
  runHudTransientEffects(state);
  scheduleBlackjackAutoDeal(state);
  scheduleBlackjackDealerStep(state);
}

function shouldSkipDefenseDynamicHudFrame(): boolean {
  const now = performance.now();
  if (now - lastDefenseDynamicHudUpdateAt < DEFENSE_DYNAMIC_HUD_MIN_INTERVAL_MS) {
    return true;
  }
  lastDefenseDynamicHudUpdateAt = now;
  return false;
}

function setDefenseWaveFromInput(input: HTMLInputElement): void {
  const wave = Number(input.value);
  if (!Number.isFinite(wave)) {
    input.value = String(gameStore.snapshot.defense.wave);
    return;
  }
  gameStore.dispatch({ type: 'setDefenseWave', wave });
}

function installMiningIsoBoardHandlers(): void {
  if (!rootElement) {
    return;
  }

  const bounds = miningIsoBoardBounds();
  rootElement.querySelectorAll<HTMLElement>('[data-mining-iso-board]').forEach((board) => {
    if (board.dataset.miningIsoClickBound === '1') {
      return;
    }
    board.dataset.miningIsoClickBound = '1';
    board.addEventListener('click', (event) => {
      if (!(event instanceof MouseEvent) || event.detail === 0) {
        return;
      }
      const rect = board.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        return;
      }

      const x = ((event.clientX - rect.left) / rect.width) * bounds.width;
      const y = ((event.clientY - rect.top) / rect.height) * bounds.height;
      const blockId = miningIsoBlockIdFromPoint(x, y);
      if (blockId === null) {
        return;
      }

      focusBookPanelFromControl(board, 'mine');
      gameStore.dispatch({ type: 'digMiningBlock', blockId });
    });
  });

  rootElement.querySelectorAll<HTMLButtonElement>('[data-mining-block-id]').forEach((button) => {
    if (button.dataset.miningKeyboardClickBound === '1') {
      return;
    }
    button.dataset.miningKeyboardClickBound = '1';
    button.addEventListener('click', (event) => {
      if (event.detail !== 0) {
        return;
      }
      const blockId = Number(button.dataset.miningBlockId);
      if (!Number.isFinite(blockId)) {
        return;
      }
      focusBookPanelFromControl(button, 'mine');
      gameStore.dispatch({ type: 'digMiningBlock', blockId });
    });
  });
}

function runHudTransientEffects(state: GameState): void {
  if (isBookPanelOpen(state, 'serpent') && state.snake.lastReward > 0) {
    const marker = `${state.snake.score}:${Math.floor(state.resources.scales)}`;
    if (marker !== lastSnakeRewardMarker) {
      lastSnakeRewardMarker = marker;
      showFloatingGain(state.snake.lastReward, '.snake-board');
    }
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
  const manaPanelOpen = isBookPanelOpen(state, 'mana');
  const snakePanelOpen = isBookPanelOpen(state, 'serpent');
  const miningPanelOpen = isBookPanelOpen(state, 'mine');
  const targetPanelOpen = isBookPanelOpen(state, 'targets');
  const typingPanelOpen = isBookPanelOpen(state, 'typing');
  const hundredPanelOpen = isBookPanelOpen(state, 'hundred');
  setDynamicText('mana', formatGameNumber(state.mana));
  if (manaPanelOpen) {
    setDynamicText('mana-panel-total', compactHudNumber(state.mana));
    setDynamicText('mana-panel-rate', formatManaPerSecond(manaPerSecond(state)));
    trackDynamicResourceGain('mana-panel-total', currentMana);
    updateManaXpHud(state);
    syncManaDiscoveredGems(state);
    syncManaCrystalCover(state);
    syncManaAutoClickHands(state);
    syncManaMeowKnight(state);
    syncManaIdleCompanions(state);
    syncManaXpOrb(state);
    updateDynamicManaSkillCards(state);
  }
  setDynamicResourceText('scales', state.resources.scales);
  setDynamicResourceText('runes', state.resources.runes);
  setDynamicResourceText('spores', state.resources.spores);
  if (isBookPanelOpen(state, 'defense')) {
    setDynamicText('sigils', formatGameNumber(state.resources.sigils));
    dynamicResourceGainSnapshots.set('sigils', Math.floor(state.resources.sigils));
  } else {
    setDynamicResourceText('sigils', state.resources.sigils);
  }
  const displayedChips =
    isBookPanelOpen(state, 'blackjack') && blackjackMotionIsSettling() && lastBlackjackSettledDisplay
      ? lastBlackjackSettledDisplay.chips
      : Math.floor(state.resources.chips);
  setDynamicResourceText('chips', displayedChips);
  setDynamicResourceText('fragments', state.resources.fragments);
  setDynamicResourceText('marks', state.resources.marks);
  setDynamicResourceText('minerals', state.resources.minerals);
  setDynamicResourceText('gels', state.resources.gels);
  if (snakePanelOpen) {
    setDynamicText('snake-score', state.snake.score);
    setDynamicText('snake-best', state.snake.best);
    setDynamicText('snake-scales', compactHudNumber(state.resources.scales));
    setDynamicText('snake-multiplier', `x${snakeTotalMultiplier(state).toFixed(1).replace('.', ',')}`);
    updateDynamicSnakeSkillCards(state);
  }
  if (miningPanelOpen) {
    updateDynamicMiningSkillCards(state);
  }
  if (targetPanelOpen) {
    setDynamicText('target-score', state.targets.score);
    setDynamicText('target-best', state.targets.best);
  }
  if (typingPanelOpen) {
    setDynamicText('typing-reward', runeTypingRewardPreview(state));
    setDynamicText('typing-combo', state.runeTyping.combo);
    setDynamicText('typing-penalty', state.runeTyping.penaltyWordsRemaining);
  }
  if (hundredPanelOpen) {
    animateHundredProgress(state);
  }
  updateDynamicDefensePanel(state);
}

function defenseHealthPercent(state: GameState): number {
  return Math.max(0, Math.min(100, (state.defense.towerHealth / defenseMaxTowerHealth(state)) * 100));
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

function formatGameNumber(value: number, options: { compact?: boolean; forceDecimal?: boolean } = {}): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const absolute = Math.abs(safeValue);
  if (options.compact && absolute >= 1_000_000) {
    return `${formatGameNumber(safeValue / 1_000_000, { forceDecimal: true })}M`;
  }
  if (options.compact && absolute >= 10_000) {
    return `${formatGameNumber(safeValue / 1_000, { forceDecimal: true })}k`;
  }

  const rounded = Math.round(safeValue * 10) / 10;
  const normalized = Object.is(rounded, -0) ? 0 : rounded;
  const shouldKeepDecimal = options.forceDecimal || !Number.isInteger(normalized);
  return shouldKeepDecimal ? normalized.toFixed(1).replace('.', ',') : String(normalized);
}

function compactHudNumber(value: number): string {
  return formatGameNumber(value, { compact: true });
}

function formatFixedGameNumber(value: number, decimals: 1 | 2): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const fixed = Object.is(safeValue, -0) ? 0 : safeValue;
  return fixed.toFixed(decimals).replace('.', ',');
}

function formatOneDecimalGameNumber(value: number): string {
  return formatFixedGameNumber(value, 1).replace(/,0$/, '');
}

function formatTwoDecimalGameNumber(value: number): string {
  return formatFixedGameNumber(value, 2);
}

function defenseWaveRailProgress(state: GameState, wave: number): number {
  const progress = wave >= 100 ? 0 : Math.min(1, Math.max(0, defenseWaveProgress(state)));
  return wave === 1 ? Math.min(0.92, progress) : progress;
}

function defenseLevelEffectLabel(state: GameState): string {
  const bonusPercent = Math.round((defenseLevelMultiplier(state) - 1) * 100);
  return `+${bonusPercent}% dégâts / +${bonusPercent}% gold`;
}

function defenseMoneyPopupReady(popup: GameState['defense']['moneyPopups'][number]): boolean {
  return popup.delay <= 0;
}

function defenseMoneyPopupCounterReady(popup: GameState['defense']['moneyPopups'][number]): boolean {
  return (popup.counterDelay ?? popup.delay ?? 0) <= 0;
}

function defensePendingMoneyAmount(state: GameState): number {
  return state.defense.moneyPopups
    .filter((popup) => !defenseMoneyPopupCounterReady(popup))
    .reduce((total, popup) => total + popup.amount, 0);
}

function defenseDisplayedSigils(state: GameState): number {
  return Math.max(0, Math.floor(state.resources.sigils - defensePendingMoneyAmount(state)));
}

function updateDynamicDefensePanel(state: GameState): void {
  if (!rootElement || !isBookPanelOpen(state, 'defense')) {
    lastDefenseDisplayedHealth = null;
    lastDefenseDisplayedSigils = null;
    lastDefenseDisplayedLevel = null;
    lastDefenseDisplayedGoldBoostWave = null;
    lastDefenseCleanupPulse = null;
    lastDefenseSkillCardDynamicSignature = '';
    defenseEnemyHealthSnapshots.clear();
    return;
  }

  const hudPerf = getDefenseHudPerfStats();
  const hudPerfStart = hudPerf ? performance.now() : 0;
  let hudPerfSectionStart = hudPerfStart;
  const hudPerfSections: DefenseHudPerfSection[] = [];
  const markHudPerfSection = (name: string): void => {
    if (!hudPerf) {
      return;
    }
    const now = performance.now();
    const durationMs = now - hudPerfSectionStart;
    hudPerf.sectionLastMs[name] = durationMs;
    hudPerf.sectionMaxMs[name] = Math.max(hudPerf.sectionMaxMs[name] ?? 0, durationMs);
    hudPerfSections.push({ name, durationMs });
    hudPerfSectionStart = now;
  };
  const finishHudPerfFrame = (actorsLayer?: HTMLElement | null): void => {
    if (!hudPerf) {
      return;
    }
    const totalMs = performance.now() - hudPerfStart;
    hudPerf.frames += 1;
    hudPerf.lastTotalMs = totalMs;
    hudPerf.maxTotalMs = Math.max(hudPerf.maxTotalMs, totalMs);
    if (totalMs >= DEFENSE_HUD_PERF_SLOW_FRAME_MS) {
      hudPerf.slowFrames.push({
        at: performance.now(),
        totalMs,
        sections: hudPerfSections.slice().sort((left, right) => right.durationMs - left.durationMs).slice(0, 6),
        enemies: state.defense.enemies.length,
        shots: state.defense.shots.length,
        lightning: state.defense.lightningStrikes.length,
        money: state.defense.moneyPopups.length,
        actors: actorsLayer?.children.length ?? 0,
        animations: document.getAnimations().length,
      });
      if (hudPerf.slowFrames.length > 40) {
        hudPerf.slowFrames.splice(0, hudPerf.slowFrames.length - 40);
      }
    }
  };

  const healthPercent = defenseHealthPercent(state);
  const maxHealth = defenseMaxTowerHealth(state);
  const currentHealth = state.defense.towerHealth;
  const currentHealthDisplay = formatGameNumber(currentHealth);
  const maxHealthDisplay = formatGameNumber(maxHealth);
  const currentSigils = defenseDisplayedSigils(state);
  const currentWave = Math.min(100, Math.max(1, state.defense.wave));
  const experienceToNextLevel = defenseExperienceToNextLevel(state.defense.level);
  const experienceProgress =
    experienceToNextLevel > 0 ? Math.min(1, Math.max(0, state.defense.xp / experienceToNextLevel)) : 1;
  const experienceLabel =
    experienceToNextLevel > 0
      ? `${formatOneDecimalGameNumber(state.defense.xp)} / ${formatOneDecimalGameNumber(experienceToNextLevel)}`
      : 'MAX';
  const experienceEffectLabel = defenseLevelEffectLabel(state);
  const healthToneClass = defenseHealthToneClass(healthPercent);
  const previousHealthPercent =
    lastDefenseDisplayedHealth === null ? healthPercent : Math.max(0, Math.min(100, (lastDefenseDisplayedHealth / maxHealth) * 100));
  const towerHealthDropped = lastDefenseDisplayedHealth !== null && currentHealth < lastDefenseDisplayedHealth;
  const towerHealthRegenerated = lastDefenseDisplayedHealth !== null && currentHealth > lastDefenseDisplayedHealth;
  const defensePanelElement = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-panel');
  const healthHud = rootElement.querySelector<HTMLElement>('.defense-hud-health');
  const moneyHud = rootElement.querySelector<HTMLElement>('.defense-hud-money');
  const moneyValue = rootElement.querySelector<HTMLElement>('[data-dynamic-value="defense-money"]');
  const experienceHud = rootElement.querySelector<HTMLElement>('.defense-hud-xp');
  const experienceBadge = experienceHud?.querySelector<HTMLElement>('.defense-xp-badge') ?? null;
  const experienceLevelValue = experienceHud?.querySelector<HTMLElement>('[data-dynamic-value="defense-level"]') ?? null;
  const goldBoostWave = state.defense.lastGoldBoostWave;
  if (experienceBadge) {
    syncDefenseGoldBoostOrbs(experienceBadge, state);
  }
  let waveRail = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-wave');
  markHudPerfSection('setup');
  if (defensePanelElement && towerHealthDropped) {
    restartTimedOneShotClass(defensePanelElement, 'is-damage-shaking', 340);
    if (healthHud) {
      setStylePropertyIfChanged(healthHud, '--defense-health-chip-from', previousHealthPercent.toFixed(2));
      setStylePropertyIfChanged(healthHud, '--defense-health-chip-to', healthPercent.toFixed(2));
      restartTimedOneShotClass(healthHud, 'is-damage-shaking', 390);
      healthHud.classList.remove('is-chip-heal');
      restartOneShotClass(healthHud, 'is-chip-damage');
      window.setTimeout(() => healthHud.classList.remove('is-chip-damage'), 430);
    }
  }
  if (healthHud && towerHealthRegenerated && !healthHud.classList.contains('is-chip-heal')) {
    setStylePropertyIfChanged(healthHud, '--defense-health-chip-from', previousHealthPercent.toFixed(2));
    setStylePropertyIfChanged(healthHud, '--defense-health-chip-to', healthPercent.toFixed(2));
    healthHud.classList.remove('is-chip-damage');
    restartOneShotClass(healthHud, 'is-chip-heal');
    window.setTimeout(() => healthHud.classList.remove('is-chip-heal'), 520);
  }
  defensePanelElement?.classList.toggle('is-paused', state.defense.paused);
  if (defensePanelElement) {
    setStylePropertyIfChanged(defensePanelElement, '--defense-time-scale', defenseTimeScale(defenseEffectiveSpeedMultiplier(state)));
  }
  const speedToggle = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-speed-toggle');
  if (speedToggle) {
    speedToggle.classList.toggle('is-paused', state.defense.paused);
    setTextContentIfChanged(speedToggle, `x${formatGameNumber(defenseEffectiveSpeedMultiplier(state), { forceDecimal: true })}`);
  }
  const baseSpeedToggle = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-base-speed-toggle');
  if (baseSpeedToggle) {
    baseSpeedToggle.classList.toggle('is-active', state.defense.baseSpeedEnabled);
    setTextContentIfChanged(baseSpeedToggle, state.defense.baseSpeedEnabled ? 'ON' : 'OFF');
  }
  if (lastDefenseDisplayedSigils !== null && currentSigils > lastDefenseDisplayedSigils) {
    if (moneyHud && moneyValue) {
      playDefenseMoneyCounterPulse(moneyHud, moneyValue);
    }
  }
  markHudPerfSection('controls');
  lastDefenseDisplayedHealth = currentHealth;
  lastDefenseDisplayedSigils = currentSigils;
  const shouldAnimateDefenseLevel =
    lastDefenseDisplayedLevel !== null && state.defense.level > lastDefenseDisplayedLevel && experienceHud && experienceBadge && experienceLevelValue;
  if (shouldAnimateDefenseLevel) {
    playDefenseLevelUpBadge(experienceHud, experienceBadge, experienceLevelValue, state.defense.level);
  } else if (experienceLevelValue?.dataset.defenseLevelAnimating !== String(state.defense.level)) {
    setDynamicText('defense-level', state.defense.level);
  }
  lastDefenseDisplayedLevel = state.defense.level;
  if (experienceHud && experienceBadge && lastDefenseDisplayedGoldBoostWave !== null && goldBoostWave > lastDefenseDisplayedGoldBoostWave) {
    playDefenseGoldBoostOrbGain(experienceHud, experienceBadge, defenseWaveGoldMultiplier(state));
  }
  lastDefenseDisplayedGoldBoostWave = goldBoostWave;
  refreshDefenseSkillDock(state);
  updateDynamicDefenseSkillCards(state);
  markHudPerfSection('skills');
  defensePanelElement?.classList.toggle('is-defeated', state.defense.deathTimer > 0);
  if (healthHud) {
    healthHud.classList.toggle('is-warn', healthToneClass === 'is-warn');
    healthHud.classList.toggle('is-danger', healthToneClass === 'is-danger');
    healthHud.setAttribute('aria-label', `HP ${currentHealthDisplay}/${maxHealthDisplay}`);
    healthHud.setAttribute('title', `HP ${currentHealthDisplay}/${maxHealthDisplay}`);
    setStylePropertyIfChanged(healthHud, '--defense-health-progress', `${healthPercent.toFixed(2)}%`);
    setStylePropertyIfChanged(healthHud, '--defense-health-value', healthPercent.toFixed(2));
  }
  setDynamicText('defense-health-value', `${currentHealthDisplay}/${maxHealthDisplay}`);
  setDynamicText('defense-xp', experienceLabel);
  setDynamicText('defense-level-effect', experienceEffectLabel);
  setDynamicText('defense-money', compactHudNumber(currentSigils));
  if (experienceHud) {
    setStylePropertyIfChanged(experienceHud, '--defense-xp-progress', `${(experienceProgress * 100).toFixed(2)}%`);
    experienceHud.setAttribute('title', `Niveau ${state.defense.level} · XP ${experienceLabel} · ${experienceEffectLabel}`);
    experienceHud.setAttribute('aria-label', `Niveau ${state.defense.level}, XP ${experienceLabel}, ${experienceEffectLabel}`);
  }
  const waveInput = rootElement.querySelector<HTMLInputElement>('[data-defense-wave-input]');
  if (waveInput && document.activeElement !== waveInput) {
    waveInput.value = String(currentWave);
  }

  const rangeElement = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-range');
  if (rangeElement) {
    setStylePropertyIfChanged(rangeElement, '--defense-range-scale', defenseTowerRange(state).toFixed(3));
  }
  syncDefenseIceAura(state);
  markHudPerfSection('hud');

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
    setStylePropertyIfChanged(waveRail, '--wave-slide', `${waveSlide.toFixed(3)}%`);
    setStylePropertyIfChanged(waveRail, '--wave-rail-step', `${DEFENSE_WAVE_RAIL_STEP_PERCENT.toFixed(3)}%`);
    setStylePropertyIfChanged(waveRail, '--wave-fill-left', `${waveFillLeft.toFixed(3)}%`);
    setStylePropertyIfChanged(waveRail, '--wave-fill-width', `${waveFillWidth.toFixed(3)}%`);
    setStylePropertyIfChanged(waveRail, '--wave-fill-opacity', currentWave === 1 && waveProgress <= 0.001 ? '0' : '1');
  }

  const actorsLayer = rootElement.querySelector<HTMLElement>('.defense-actors');
  if (!actorsLayer) {
    markHudPerfSection('no-actors');
    finishHudPerfFrame(null);
    return;
  }
  const defenseCleanupPulse = Number.isFinite(state.defense.cleanupPulse) ? state.defense.cleanupPulse : 0;
  if (lastDefenseCleanupPulse !== defenseCleanupPulse) {
    flushDefenseWaveRenderMemory(actorsLayer);
    if (defensePanelElement) {
      pulseDefenseAnimationClock(defensePanelElement, defenseTimeScale(defenseEffectiveSpeedMultiplier(state)));
    }
    lastDefenseCleanupPulse = defenseCleanupPulse;
  }
  syncDefenseMoneyParticleGoal(actorsLayer, moneyHud);

  const actorsSize = cachedDefenseActorsSize(actorsLayer);
  const actorElements = mapDefenseActorElements(actorsLayer);
  const enemyHealthBarElements = actorElements.enemyHealthBars;
  const enemyElements = actorElements.enemies;
	  const shotElements = actorElements.shots;
  const enemyProjectileElements = actorElements.enemyProjectiles;
	  const lightningStrikeElements = actorElements.lightningStrikes;
	  const damagePopupElements = actorElements.damagePopups;
	  const impactElements = actorElements.impacts;
	  const moneyPopupElements = actorElements.moneyPopups;
	  syncDefenseEffectsCanvas(state);
	  damagePopupElements.forEach((popupElement) => deactivateDefensePooledEffect(popupElement, 'popupId'));
	  impactElements.forEach((impactElement) => deactivateDefensePooledEffect(impactElement, 'impactId'));
	  const liveEnemyIds = new Set<string>();
  markHudPerfSection('actors-setup');
  const visualEnemyPositions = new Map<number, DefensePoint>();
  for (const enemy of state.defense.enemies) {
    const enemyId = String(enemy.id);
    liveEnemyIds.add(enemyId);
    const previousHealth = defenseEnemyHealthSnapshots.get(enemyId);
    let healthBarElement = enemyHealthBarElements.get(enemyId) ?? null;
    let enemyElement = enemyElements.get(enemyId) ?? null;
    const shouldShowHealthBar = defenseEnemyHealthBarVisible(enemy);
    if (!healthBarElement && shouldShowHealthBar) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseEnemyHealthBarMarkup(enemy));
      healthBarElement = actorsLayer.lastElementChild instanceof HTMLElement ? actorsLayer.lastElementChild : null;
      if (healthBarElement) {
        enemyHealthBarElements.set(enemyId, healthBarElement);
      }
    } else if (healthBarElement && !shouldShowHealthBar) {
      healthBarElement.remove();
      enemyHealthBarElements.delete(enemyId);
      healthBarElement = null;
    }
    if (!enemyElement) {
      actorsLayer.insertAdjacentHTML('beforeend', defenseEnemyMarkup(enemy));
      enemyElement = actorsLayer.lastElementChild instanceof HTMLElement ? actorsLayer.lastElementChild : null;
      if (enemyElement) {
        enemyElements.set(enemyId, enemyElement);
      }
    }

    const position = defenseEnemyPosition(enemy);
    visualEnemyPositions.set(enemy.id, position);
    const health = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));

    if (healthBarElement) {
      syncDefenseEnemyHealthBar(healthBarElement, enemy, health, previousHealth);
    }

    if (enemyElement) {
      const facingScale = defenseEnemyFacingScale(position);
      setStylePropertyIfChanged(enemyElement, '--enemy-x-px', `${((position.x / 100) * actorsSize.width).toFixed(2)}px`);
      setStylePropertyIfChanged(enemyElement, '--enemy-y-px', `${((position.y / 100) * actorsSize.height).toFixed(2)}px`);
      setStylePropertyIfChanged(enemyElement, '--enemy-x', `${position.x}%`);
      setStylePropertyIfChanged(enemyElement, '--enemy-y', `${position.y}%`);
      setStylePropertyIfChanged(enemyElement, '--enemy-facing-scale', String(facingScale));
      setStylePropertyIfChanged(enemyElement, 'z-index', String(4 + Math.round(position.y / 12)));
      enemyElement.classList.toggle('is-skeleton-mage', enemy.kind === 'skeletonMage');
      enemyElement.classList.toggle('is-bat', enemy.kind === 'bat');
      enemyElement.classList.toggle('is-goblin-king', enemy.kind === 'goblinKing');
      enemyElement.classList.toggle('is-idle', enemy.state === 'idle');
      enemyElement.classList.toggle('is-attacking', enemy.state === 'attacking');
      enemyElement.classList.toggle('is-dying', enemy.state === 'dying');
      if (previousHealth !== undefined && enemy.health < previousHealth) {
        playDefenseEnemyHitFeedback(enemyElement, enemy.lastHitSource ?? 'normal', position);
      }
      defenseEnemyHealthSnapshots.set(enemyId, enemy.health);
    }
  }

  enemyHealthBarElements.forEach((healthBarElement, enemyId) => {
    if (!enemyId || !liveEnemyIds.has(enemyId)) {
      healthBarElement.remove();
      enemyHealthBarElements.delete(enemyId);
    }
  });

  enemyElements.forEach((enemyElement, enemyId) => {
    if (!enemyId || !liveEnemyIds.has(enemyId)) {
      if (enemyId) {
        defenseEnemyHealthSnapshots.delete(enemyId);
      }
      enemyElement.remove();
      enemyElements.delete(enemyId);
    }
  });
  markHudPerfSection('enemies');

  const liveShotIds = new Set<string>();
	  for (const shot of state.defense.shots) {
	    const shotId = String(shot.id);
	    liveShotIds.add(shotId);
	    if (!shotElements.has(shotId)) {
	      const shotElement = activateDefenseShotElement(actorElements.shotPool, shot);
	      actorsLayer.prepend(shotElement);
	      shotElements.set(shotId, shotElement);
	      playDefenseOrbShotRecoil(shot);
	    }
	  }

	  shotElements.forEach((shotElement, shotId) => {
	    if (!shotId || !liveShotIds.has(shotId)) {
	      deactivateDefensePooledEffect(shotElement, 'shotId');
	      shotElements.delete(shotId);
	    }
	  });

  const liveEnemyProjectileIds = new Set<string>();
	  for (const projectile of state.defense.enemyProjectiles) {
	    const projectileId = String(projectile.id);
	    liveEnemyProjectileIds.add(projectileId);
	    if (!enemyProjectileElements.has(projectileId)) {
	      const projectileElement = activateDefenseEnemyProjectileElement(actorElements.enemyProjectilePool, projectile);
	      actorsLayer.appendChild(projectileElement);
	      enemyProjectileElements.set(projectileId, projectileElement);
	    }
	  }

	  enemyProjectileElements.forEach((projectileElement, projectileId) => {
	    if (!projectileId || !liveEnemyProjectileIds.has(projectileId)) {
	      deactivateDefensePooledEffect(projectileElement, 'enemyProjectileId');
	      enemyProjectileElements.delete(projectileId);
	    }
	  });

  const visibleLightningStrikes = state.defense.lightningStrikes;
  const liveLightningStrikeIds = new Set<string>();
  const enemyById = new Map(state.defense.enemies.map((enemy) => [enemy.id, enemy] as const));
  for (const strike of visibleLightningStrikes) {
    const strikeId = String(strike.id);
    liveLightningStrikeIds.add(strikeId);
	    if (!lightningStrikeElements.has(strikeId)) {
	      const targetEnemy = enemyById.get(strike.targetEnemyId);
	      const strikeElement = activateDefenseLightningStrikeElement(
	        actorElements.lightningStrikePool,
	        strike,
	        visualEnemyPositions.get(strike.targetEnemyId),
	        targetEnemy,
	      );
	      actorsLayer.appendChild(strikeElement);
	      lightningStrikeElements.set(strikeId, strikeElement);
	    }
	  }

	  lightningStrikeElements.forEach((strikeElement, strikeId) => {
	    if (!strikeId || !liveLightningStrikeIds.has(strikeId)) {
	      deactivateDefensePooledEffect(strikeElement, 'lightningStrikeId');
	      lightningStrikeElements.delete(strikeId);
	    }
	  });
  markHudPerfSection('attacks');

	  const liveMoneyPopupIds = new Set<string>();
  for (const popup of state.defense.moneyPopups) {
    if (!defenseMoneyPopupReady(popup)) {
      continue;
    }
	    const popupId = String(popup.id);
	    liveMoneyPopupIds.add(popupId);
	    const existingPopup = moneyPopupElements.get(popupId) ?? null;
	    if (!existingPopup) {
	      const popupElement = activateDefenseMoneyPopupElement(actorElements.moneyPopupPool, popup);
	      actorsLayer.appendChild(popupElement);
	      moneyPopupElements.set(popupId, popupElement);
	    } else {
      syncDefenseMoneyPopupElement(existingPopup, popup, false);
    }
  }

	  moneyPopupElements.forEach((popupElement, popupId) => {
	    if (!popupId || !liveMoneyPopupIds.has(popupId)) {
	      deactivateDefensePooledEffect(popupElement, 'moneyPopupId');
	      moneyPopupElements.delete(popupId);
	    }
	  });
  markHudPerfSection('money');
  finishHudPerfFrame(actorsLayer);
}

type DefenseActorElementMaps = {
  enemyHealthBars: Map<string, HTMLElement>;
  enemies: Map<string, HTMLElement>;
  shots: Map<string, HTMLElement>;
  enemyProjectiles: Map<string, HTMLElement>;
  lightningStrikes: Map<string, HTMLElement>;
  damagePopups: Map<string, HTMLElement>;
  impacts: Map<string, HTMLElement>;
  moneyPopups: Map<string, HTMLElement>;
  shotPool: HTMLElement[];
  enemyProjectilePool: HTMLElement[];
  lightningStrikePool: HTMLElement[];
  damagePopupPool: HTMLElement[];
  impactPool: HTMLElement[];
  moneyPopupPool: HTMLElement[];
};

function mapDefenseActorElements(root: HTMLElement): DefenseActorElementMaps {
  const maps: DefenseActorElementMaps = {
    enemyHealthBars: new Map(),
    enemies: new Map(),
    shots: new Map(),
    enemyProjectiles: new Map(),
    lightningStrikes: new Map(),
    damagePopups: new Map(),
    impacts: new Map(),
    moneyPopups: new Map(),
    shotPool: [],
    enemyProjectilePool: [],
    lightningStrikePool: [],
    damagePopupPool: [],
    impactPool: [],
    moneyPopupPool: [],
  };

  for (const child of root.children) {
    if (!(child instanceof HTMLElement)) {
      continue;
    }

    const {
      enemyId,
      shotId,
      enemyProjectileId,
      lightningStrikeId,
      popupId,
      impactId,
      moneyPopupId,
    } = child.dataset;

    if (child.classList.contains('is-pooled-hidden')) {
      if (child.classList.contains('defense-shot')) {
        maps.shotPool.push(child);
      } else if (child.classList.contains('defense-enemy-projectile')) {
        maps.enemyProjectilePool.push(child);
      } else if (child.classList.contains('defense-lightning-strike')) {
        maps.lightningStrikePool.push(child);
      } else if (child.classList.contains('defense-damage-popup')) {
        maps.damagePopupPool.push(child);
      } else if (child.classList.contains('defense-impact-burst')) {
        maps.impactPool.push(child);
      } else if (child.classList.contains('defense-money-popup')) {
        maps.moneyPopupPool.push(child);
      }
      continue;
    }

    if (enemyId && child.classList.contains('defense-enemy-health-bar')) {
      maps.enemyHealthBars.set(enemyId, child);
    } else if (enemyId && child.classList.contains('defense-enemy')) {
      maps.enemies.set(enemyId, child);
    } else if (shotId) {
      maps.shots.set(shotId, child);
    } else if (enemyProjectileId) {
      maps.enemyProjectiles.set(enemyProjectileId, child);
    } else if (lightningStrikeId) {
      maps.lightningStrikes.set(lightningStrikeId, child);
    } else if (popupId) {
      maps.damagePopups.set(popupId, child);
    } else if (impactId) {
      maps.impacts.set(impactId, child);
    } else if (moneyPopupId) {
      maps.moneyPopups.set(moneyPopupId, child);
    }
  }

  return maps;
}

function activateDefensePooledIconEffect(pool: HTMLElement[], options: {
  className: string;
  datasetKey: keyof HTMLElement['dataset'];
  datasetValue: string;
  style: string;
}): HTMLElement {
  const element = pool.pop() ?? document.createElement('i');
  element.className = `${options.className} defense-pooled-effect`;
  element.dataset[options.datasetKey] = options.datasetValue;
  element.setAttribute('style', options.style);
  element.setAttribute('aria-hidden', 'true');
  element.replaceChildren();
  element.classList.remove('is-pooled-hidden');
  return element;
}

function deactivateDefensePooledEffect(element: HTMLElement, idAttribute: keyof HTMLElement['dataset']): void {
  delete element.dataset[idAttribute];
  element.classList.add('defense-pooled-effect', 'is-pooled-hidden');
}

function flushDefenseWaveRenderMemory(actorsLayer: HTMLElement): void {
  defenseEnemyHealthSnapshots.clear();
  if (actorsLayer.childElementCount <= DEFENSE_RENDER_MEMORY_PRUNE_CHILD_LIMIT) {
    return;
  }
  actorsLayer.querySelectorAll<HTMLElement>('.defense-pooled-effect.is-pooled-hidden').forEach((element) => {
    cancelDefenseElementAnimations(element);
    element.remove();
  });
}

function cachedDefenseActorsSize(actorsLayer: HTMLElement): { width: number; height: number } {
  const now = performance.now();
  if (
    defenseActorsSizeCache.element === actorsLayer &&
    defenseActorsSizeCache.width > 0 &&
    defenseActorsSizeCache.height > 0
  ) {
    return defenseActorsSizeCache;
  }

  defenseActorsSizeCache = {
    element: actorsLayer,
    sampledAt: now,
    width: actorsLayer.clientWidth,
    height: actorsLayer.clientHeight,
  };
  return defenseActorsSizeCache;
}

function cachedDefenseEffectsCanvasSize(canvas: HTMLCanvasElement): { width: number; height: number } {
  const now = performance.now();
  if (
    defenseEffectsCanvasSizeCache.element === canvas &&
    defenseEffectsCanvasSizeCache.width > 0 &&
    defenseEffectsCanvasSizeCache.height > 0
  ) {
    return defenseEffectsCanvasSizeCache;
  }

  defenseEffectsCanvasSizeCache = {
    element: canvas,
    sampledAt: now,
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  };
  return defenseEffectsCanvasSizeCache;
}

function pulseDefenseAnimationClock(defensePanelElement: HTMLElement, timeScale: string): void {
  const numericTimeScale = Number(timeScale);
  if (!Number.isFinite(numericTimeScale)) {
    return;
  }

  defensePanelElement.style.setProperty('--defense-time-scale', (numericTimeScale + 0.0001).toFixed(4));
  window.requestAnimationFrame(() => {
    setStylePropertyIfChanged(defensePanelElement, '--defense-time-scale', timeScale);
  });
}

function cancelDefenseElementAnimations(element: HTMLElement): void {
  try {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  } catch {
    element.getAnimations().forEach((animation) => animation.cancel());
  }
}

function syncDefenseMoneyParticleGoal(actorsLayer: HTMLElement, moneyHud: HTMLElement | null): void {
  if (!moneyHud) {
    return;
  }

  const now = performance.now();
  if (now - lastDefenseMoneyGoalSampleAt < DEFENSE_MONEY_GOAL_CACHE_MS) {
    return;
  }
  lastDefenseMoneyGoalSampleAt = now;

  const layerRect = actorsLayer.getBoundingClientRect();
  const moneyRect = moneyHud.getBoundingClientRect();
  if (layerRect.width <= 0 || layerRect.height <= 0 || moneyRect.width <= 0 || moneyRect.height <= 0) {
    return;
  }

  const goalX = ((moneyRect.left + moneyRect.width / 2 - layerRect.left) / layerRect.width) * 100;
  const goalY = ((moneyRect.top + moneyRect.height / 2 - layerRect.top) / layerRect.height) * 100;
  setStylePropertyIfChanged(actorsLayer, '--money-goal-x', `${Math.max(0, Math.min(100, goalX)).toFixed(3)}cqw`);
  setStylePropertyIfChanged(actorsLayer, '--money-goal-y', `${Math.max(0, Math.min(100, goalY)).toFixed(3)}cqw`);
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

  const iceRangeScale = defenseIceRange(state).toFixed(3);
  if (aura) {
    setStylePropertyIfChanged(aura, '--defense-ice-range-scale', iceRangeScale);
  }
  if (range) {
    setStylePropertyIfChanged(range, '--defense-ice-range-scale', iceRangeScale);
  }
}

const defenseEffectImages = new Map<string, HTMLImageElement>();
const defenseDamageTextSprites = new Map<string, { canvas: HTMLCanvasElement; width: number; height: number }>();
const DEFENSE_DAMAGE_TEXT_SPRITE_CACHE_LIMIT = 192;
let defenseEffectsCanvasHadContent = false;

function defenseEffectImage(src: string): HTMLImageElement {
  let image = defenseEffectImages.get(src);
  if (!image) {
    image = new Image();
    image.src = src;
    defenseEffectImages.set(src, image);
  }
  return image;
}

function defenseDamageTextSprite(label: string, fontSize: number, color: string): { canvas: HTMLCanvasElement; width: number; height: number } {
  const key = `${fontSize}:${color}:${label}`;
  const cached = defenseDamageTextSprites.get(key);
  if (cached) {
    defenseDamageTextSprites.delete(key);
    defenseDamageTextSprites.set(key, cached);
    return cached;
  }

  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const padding = Math.ceil(fontSize * 0.34);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return { canvas, width: 1, height: 1 };
  }

  context.font = `900 ${fontSize}px "M5x7", Georgia, serif`;
  const metrics = context.measureText(label);
  const width = Math.max(1, Math.ceil(metrics.width + padding * 2));
  const height = Math.max(1, Math.ceil(fontSize * 1.35 + padding * 2));
  canvas.width = Math.ceil(width * ratio);
  canvas.height = Math.ceil(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.imageSmoothingEnabled = false;
  context.font = `900 ${fontSize}px "M5x7", Georgia, serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(label, width / 2, height / 2);

  const sprite = { canvas, width, height };
  defenseDamageTextSprites.set(key, sprite);
  while (defenseDamageTextSprites.size > DEFENSE_DAMAGE_TEXT_SPRITE_CACHE_LIMIT) {
    const oldestKey = defenseDamageTextSprites.keys().next().value;
    if (!oldestKey) {
      break;
    }
    defenseDamageTextSprites.delete(oldestKey);
  }
  return sprite;
}

function syncDefenseEffectsCanvas(state: GameState): void {
  const canvas = rootElement?.querySelector<HTMLCanvasElement>('.book-overlay[data-book-id="defense"] .defense-effects-canvas');
  if (!canvas) {
    defenseEffectsCanvasHadContent = false;
    return;
  }

  const size = cachedDefenseEffectsCanvasSize(canvas);
  if (size.width <= 0 || size.height <= 0) {
    return;
  }
  if (state.defense.damagePopups.length === 0 && !defenseEffectsCanvasHadContent) {
    return;
  }

  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const nextWidth = Math.max(1, Math.round(size.width * ratio));
  const nextHeight = Math.max(1, Math.round(size.height * ratio));
  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, size.width, size.height);
  context.imageSmoothingEnabled = false;
  defenseEffectsCanvasHadContent = state.defense.damagePopups.length > 0;

  for (const popup of state.defense.damagePopups) {
    drawDefenseCanvasImpact(context, popup, size.width, size.height);
  }
  for (const popup of state.defense.damagePopups) {
    drawDefenseCanvasDamagePopup(context, popup, size.width, size.height);
  }
}

function drawDefenseCanvasImpact(
  context: CanvasRenderingContext2D,
  popup: GameState['defense']['damagePopups'][number],
  width: number,
  height: number,
): void {
  const age = Math.max(0, DEFENSE_DAMAGE_POPUP_CANVAS_DURATION_SECONDS - popup.timer);
  const position = defenseEnemyImpactPoint({ lane: popup.lane, distance: popup.distance, kind: popup.targetKind });
  const x = (position.x / 100) * width;
  const y = (position.y / 100) * height;

  if (popup.source === 'normal') {
    const progress = Math.min(1, age / DEFENSE_FIREBALL_IMPACT_CANVAS_DURATION_SECONDS);
    if (progress >= 1) {
      return;
    }
    const image = defenseEffectImage('/assets/td/effects/fireball-impact.png');
    if (!image.complete || image.naturalWidth <= 0) {
      return;
    }
    const frameCount = 8;
    const frame = Math.min(frameCount - 1, Math.floor(progress * frameCount));
    const frameWidth = image.naturalWidth / frameCount;
    const size = Math.max(28, Math.min(46, width * 0.05)) * (1.08 + Math.sin(progress * Math.PI) * 0.24);
    context.globalAlpha = Math.max(0, 0.6 * (1 - Math.max(0, progress - 0.62) / 0.38));
    context.drawImage(image, frame * frameWidth, 0, frameWidth, image.naturalHeight, x - size / 2, y - size / 2, size, size);
    context.globalAlpha = 1;
    return;
  }

  if (popup.source === 'ice') {
    const progress = Math.min(1, age / DEFENSE_ICE_IMPACT_CANVAS_DURATION_SECONDS);
    if (progress >= 1) {
      return;
    }
    const image = defenseEffectImage('/assets/td/ice/ice-aura-strip.png');
    if (!image.complete || image.naturalWidth <= 0) {
      return;
    }
    const frameCount = 61;
    const frame = Math.min(frameCount - 1, Math.floor(progress * frameCount));
    const frameWidth = image.naturalWidth / frameCount;
    const size = Math.max(38, Math.min(72, width * 0.08));
    context.globalAlpha = progress < 0.18 ? progress / 0.18 * 0.72 : Math.max(0, 0.72 * (1 - Math.max(0, progress - 0.72) / 0.28));
    context.drawImage(image, frame * frameWidth, 0, frameWidth, image.naturalHeight, x - size / 2, y - size / 2, size, size);
    context.globalAlpha = 1;
    return;
  }

  const progress = Math.min(1, age / DEFENSE_LIGHTNING_IMPACT_CANVAS_DURATION_SECONDS);
  if (progress >= 1) {
    return;
  }
  const impactAngle = Math.atan2(position.y - 50, position.x - 50);
  const centerIndex = 1.5;
  context.save();
  for (let index = 0; index < 4; index += 1) {
    const spread = (index - centerIndex) * 0.28;
    const distance = 17 + index * 1.4;
    const fall = 5 + (index % 2) * 4;
    const sparkX = x + Math.cos(impactAngle + spread) * distance * progress;
    const sparkY = y + Math.sin(impactAngle + spread) * distance * progress + fall * progress;
    const radius = Math.max(2, Math.min(5, width * 0.004)) * (1 - progress * 0.62);
    context.globalAlpha = Math.max(0, progress < 0.12 ? progress / 0.12 : 1 - progress);
    context.fillStyle = '#e7fbff';
    context.beginPath();
    context.arc(sparkX, sparkY, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
  context.globalAlpha = 1;
}

function drawDefenseCanvasDamagePopup(
  context: CanvasRenderingContext2D,
  popup: GameState['defense']['damagePopups'][number],
  width: number,
  height: number,
): void {
  const progress = Math.min(1, Math.max(0, (DEFENSE_DAMAGE_POPUP_CANVAS_DURATION_SECONDS - popup.timer) / DEFENSE_DAMAGE_POPUP_CANVAS_DURATION_SECONDS));
  const position = defenseEnemyPosition(popup);
  const motion = defenseDamagePopupMotionValues(popup);
  const fontSize = popup.kind === 'superCritical' ? 64 : popup.kind === 'critical' ? 48 : 32;
  const lift = -24 - progress * 54;
  const popScale = progress < 0.12 ? 0.78 + progress / 0.12 * 0.37 : progress < 0.24 ? 1.15 - ((progress - 0.12) / 0.12) * 0.11 : 1 - Math.max(0, progress - 0.78) * 0.35;
  const opacity = progress < 0.07 ? progress / 0.07 * 0.75 : progress > 0.78 ? Math.max(0, 0.75 * (1 - (progress - 0.78) / 0.22)) : 0.75;
  const driftX = motion.offsetX + motion.driftX * Math.min(1, progress * 1.2);
  const x = (position.x / 100) * width + driftX;
  const y = (position.y / 100) * height + motion.offsetY + lift;

  context.save();
  context.globalAlpha = opacity;
  context.translate(x, y);
  context.scale(popScale, popScale);
  const sprite = defenseDamageTextSprite(formatOneDecimalGameNumber(popup.amount), fontSize, defenseCanvasDamageColor(popup));
  context.drawImage(sprite.canvas, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
  context.restore();
}

function defenseCanvasDamageColor(popup: GameState['defense']['damagePopups'][number]): string {
  if (popup.kind === 'superCritical') {
    return '#ff8a3c';
  }
  if (popup.kind === 'critical') {
    return '#ffd23c';
  }
  if (popup.source === 'ice') {
    return '#5aa0ff';
  }
  if (popup.source === 'lightning') {
    return '#ff5ce0';
  }
  return '#ffffff';
}

function updateDynamicManaSkillCards(state: GameState): void {
  const signature = manaSkillCardDynamicSignature(state);
  if (signature === lastManaSkillCardDynamicSignature) {
    return;
  }
  lastManaSkillCardDynamicSignature = signature;

  rootElement?.querySelectorAll<HTMLButtonElement>('.mana-skill-dock .skill-shop-card[data-skill-id]').forEach((card) => {
    const skillId = card.dataset.skillId;
    if (!isManaSkillId(skillId)) {
      return;
    }
    const snapshot = manaSkillShopCardSnapshot(state, skillId);
    if (!snapshot) {
      return;
    }
    if (card.dataset.manaDynamicClickBound !== '1') {
      card.dataset.manaDynamicClickBound = '1';
      card.addEventListener('click', () => {
        const clickedSkillId = card.dataset.skillId;
        if (!isManaSkillButtonActionable(card, clickedSkillId)) {
          return;
        }

        if (card.dataset.action === 'startManaResearch' && isManaResearchSkillId(clickedSkillId)) {
          gameStore.dispatch({ type: 'startManaResearch', skillId: clickedSkillId });
        } else {
          gameStore.dispatch({ type: 'buyManaSkill', skillId: clickedSkillId });
        }
        refreshManaSkillDock(gameStore.snapshot, { force: true });
      });
    }

    const canAct = isManaSkillCardActionableSnapshot(snapshot);
    card.classList.toggle('is-unaffordable', Boolean(snapshot.isUnaffordable));
    card.classList.toggle('is-maxed', snapshot.isMaxed);
    card.classList.toggle('is-locked', Boolean(snapshot.isLocked));
    card.disabled = !canAct;
    if (canAct) {
      card.dataset.action = snapshot.action;
    } else {
      delete card.dataset.action;
      clearOneShotHoverTarget(card);
    }

    setAttributeIfChanged(card, 'aria-label', `${snapshot.title}: ${snapshot.value}. ${snapshot.detail}. ${snapshot.costText}.`);
    setAttributeIfChanged(card, 'title', `${snapshot.title} - ${snapshot.value} - ${snapshot.costText}`);
    setTextContentIfChanged(card.querySelector<HTMLElement>('[data-skill-card-value]'), snapshot.value);
    const deltaElement = card.querySelector<HTMLElement>('[data-skill-card-delta]');
    if (deltaElement) {
      setTextContentIfChanged(deltaElement, snapshot.delta);
      deltaElement.toggleAttribute('hidden', snapshot.delta.length === 0);
    }
    const buyElement = card.querySelector<HTMLElement>('[data-skill-card-buy]');
    if (buyElement) {
      setInnerHTMLIfChanged(buyElement, snapshot.isMaxed ? '<b>Max</b>' : snapshot.costHtml);
    }
    const progressElement = card.querySelector<HTMLElement>('[data-skill-card-progress]');
    if (progressElement && snapshot.progressPercent !== undefined) {
      progressElement.style.setProperty('--skill-research-progress', `${snapshot.progressPercent}%`);
      setTextContentIfChanged(progressElement.querySelector<HTMLElement>('[data-skill-card-progress-text]'), snapshot.progressText ?? '');
    }
  });
}

function refreshManaSkillDock(state: GameState, options: { force?: boolean } = {}): void {
  if (!rootElement || !isBookPanelOpen(state, 'mana')) {
    lastManaSkillDockSignature = '';
    lastManaSkillCardDynamicSignature = '';
    return;
  }

  const dock = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="mana"] .mana-skill-dock');
  if (!dock) {
    lastManaSkillDockSignature = '';
    lastManaSkillCardDynamicSignature = '';
    return;
  }

  const signature = manaSkillDockSignature(state);
  if (!options.force && signature === lastManaSkillDockSignature) {
    return;
  }

  const animateCardCascade = lastManaSkillDockTab !== null && lastManaSkillDockTab !== manaSkillShopTab;
  dock.innerHTML = manaSkillShop(state, false, { docked: true, showCompactButton: false, animateCardCascade });
  lastManaSkillDockTab = manaSkillShopTab;
  lastManaSkillDockSignature = signature;
  lastManaSkillCardDynamicSignature = manaSkillCardDynamicSignature(state);
  bindManaSkillDockControls(dock);
  installOneShotHoverAnimations();
}

function manaSkillDockSignature(state: GameState): string {
  const skills = state.manaSkills;
  return [
    manaSkillShopTab,
    skills.power,
    skills.clickMultiplier,
    skills.research,
    skills.clickResearch,
    skills.autoClicker,
    skills.multiAutoClicker,
    skills.xpOrbChance,
    skills.yellowOrbChance,
    skills.greenOrbChance,
    skills.blueOrbChance,
    skills.xpValue,
    skills.levelUpEffect,
    skills.holdClick,
    skills.allyFindOrb,
    skills.meowKnight ?? 0,
    ...MANA_IDLE_COMPANION_SKILL_IDS.map((skillId) => skills[skillId] ?? 0),
    ...MANA_RESEARCH_SKILL_IDS.map((skillId) => skills[skillId] ?? 0),
    skills.criticalHit,
    skills.criticalEffect,
    skills.activeResearch?.skillId ?? 'none',
  ].join('/');
}

function manaSkillCardDynamicSignature(state: GameState): string {
  const activeResearch = state.manaSkills.activeResearch;
  const researchProgress = activeResearch ? `${activeResearch.skillId}:${Math.floor(activeResearch.elapsed * 10)}` : 'none';
  return `${manaSkillDockSignature(state)}/${Math.floor(state.mana)}/${manaCrystalLevel(state)}/${manaCrystalDiscoveredGemCount(state)}/${researchProgress}`;
}

function manaSkillShopCardSnapshot(state: GameState, skillId: ManaSkillId): SkillShopCard | undefined {
  return manaSkillShopTabs(state).flatMap((tab) => tab.cards).find((card) => card.skillId === skillId);
}

function isManaSkillCardActionableSnapshot(snapshot: SkillShopCard | undefined): boolean {
  return Boolean(snapshot && !snapshot.isMaxed && !snapshot.isDisabled && !snapshot.isUnaffordable && !snapshot.isLocked);
}

function isManaSkillButtonActionable(button: HTMLButtonElement, skillId: string | undefined): skillId is ManaSkillId {
  if (
    button.disabled ||
    button.classList.contains('is-unaffordable') ||
    button.classList.contains('is-locked') ||
    button.classList.contains('is-maxed') ||
    !isManaSkillId(skillId)
  ) {
    clearOneShotHoverTarget(button);
    return false;
  }

  const snapshot = manaSkillShopCardSnapshot(gameStore.snapshot, skillId);
  if (!isManaSkillCardActionableSnapshot(snapshot)) {
    clearOneShotHoverTarget(button);
    return false;
  }

  return true;
}

function bindManaSkillDockControls(dock: HTMLElement): void {
  dock.querySelectorAll<HTMLButtonElement>('[data-action="buyManaSkill"][data-skill-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const skillId = button.dataset.skillId;
      if (!isManaSkillButtonActionable(button, skillId)) {
        return;
      }
      gameStore.dispatch({ type: 'buyManaSkill', skillId });
      refreshManaSkillDock(gameStore.snapshot, { force: true });
    });
  });

  dock.querySelectorAll<HTMLButtonElement>('[data-action="startManaResearch"][data-skill-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const skillId = button.dataset.skillId;
      if (!isManaSkillButtonActionable(button, skillId) || !isManaResearchSkillId(skillId)) {
        return;
      }
      gameStore.dispatch({ type: 'startManaResearch', skillId });
      refreshManaSkillDock(gameStore.snapshot, { force: true });
    });
  });

  dock.querySelectorAll<HTMLButtonElement>('[data-action="setManaSkillShopTab"]').forEach((button) => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.skillShopTab;
      if (!isManaSkillShopTabId(tabId)) {
        return;
      }
      manaSkillShopTab = tabId;
      refreshManaSkillDock(gameStore.snapshot, { force: true });
    });
  });
}

function updateDynamicSnakeSkillCards(state: GameState): void {
  const signature = snakeSkillCardDynamicSignature(state);
  if (signature === lastSnakeSkillCardDynamicSignature) {
    return;
  }
  lastSnakeSkillCardDynamicSignature = signature;

  const currentScales = Math.floor(state.resources.scales);
  rootElement?.querySelectorAll<HTMLButtonElement>('.snake-skill-dock .skill-shop-card[data-skill-id]').forEach((card) => {
    const skillId = card.dataset.skillId;
    if (!isSnakeSkillId(skillId)) {
      return;
    }
    const snapshot = snakeSkillShopCardSnapshot(state, skillId);
    if (!card.dataset.action && card.dataset.snakeDynamicClickBound !== '1') {
      card.dataset.snakeDynamicClickBound = '1';
      card.addEventListener('click', () => {
        const clickedSkillId = card.dataset.skillId;
        if (card.disabled || !isSnakeSkillId(clickedSkillId)) {
          return;
        }

        gameStore.dispatch({ type: 'buySnakeSkill', skillId: clickedSkillId });
        refreshSnakeSkillDock(gameStore.snapshot, { force: true });
      });
    }

    const isMaxed = state.snakeSkills[skillId] >= snakeSkillMaxLevel(skillId);
    const isUnaffordable = !isMaxed && currentScales < snakeSkillCost(state, skillId);
    const canBuy = !isMaxed && !isUnaffordable;
    card.classList.toggle('is-unaffordable', isUnaffordable);
    card.classList.toggle('is-maxed', isMaxed);
    if (!canBuy) {
      clearOneShotHoverTarget(card);
    }
    card.disabled = !canBuy;
    if (canBuy) {
      card.dataset.action = 'buySnakeSkill';
    } else {
      delete card.dataset.action;
    }

    if (snapshot) {
      setAttributeIfChanged(card, 'aria-label', `${snapshot.title}: ${snapshot.value}. ${snapshot.detail}. ${snapshot.costText}.`);
      setAttributeIfChanged(card, 'title', `${snapshot.title} - ${snapshot.value} - ${snapshot.costText}`);
      setTextContentIfChanged(card.querySelector<HTMLElement>('[data-skill-card-value]'), snapshot.value);
      const deltaElement = card.querySelector<HTMLElement>('[data-skill-card-delta]');
      if (deltaElement) {
        setTextContentIfChanged(deltaElement, snapshot.delta);
        deltaElement.toggleAttribute('hidden', snapshot.delta.length === 0);
      }
      const buyElement = card.querySelector<HTMLElement>('[data-skill-card-buy]');
      if (buyElement) {
        setInnerHTMLIfChanged(buyElement, snapshot.isMaxed ? '<b>Max</b>' : snapshot.costHtml);
      }
    }
  });
}

function refreshSnakeSkillDock(state: GameState, options: { force?: boolean } = {}): void {
  if (!rootElement || !isBookPanelOpen(state, 'serpent')) {
    lastSnakeSkillDockSignature = '';
    lastSnakeSkillCardDynamicSignature = '';
    return;
  }

  const dock = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="serpent"] .snake-skill-dock');
  if (!dock) {
    lastSnakeSkillDockSignature = '';
    lastSnakeSkillCardDynamicSignature = '';
    return;
  }

  const signature = snakeSkillDockSignature(state);
  if (!options.force && signature === lastSnakeSkillDockSignature) {
    return;
  }

  dock.innerHTML = snakeSkillShop(state, false, { docked: true, showCompactButton: false });
  lastSnakeSkillDockSignature = signature;
  lastSnakeSkillCardDynamicSignature = snakeSkillCardDynamicSignature(state);
  bindSnakeSkillDockControls(dock);
  installOneShotHoverAnimations();
}

function snakeSkillDockSignature(state: GameState): string {
  const skills = state.snakeSkills;
  return [
    skills.speed,
    skills.gridSize,
    skills.automation,
    skills.automationEnabled ? 1 : 0,
    skills.baseMultiplier,
    skills.bonusFruit,
    skills.extraLife,
    skills.edgeWrap,
  ].join('/');
}

function snakeSkillCardDynamicSignature(state: GameState): string {
  return `${snakeSkillDockSignature(state)}/${Math.floor(state.resources.scales)}`;
}

function snakeSkillShopCardSnapshot(state: GameState, skillId: SnakeSkillId): SkillShopCard | undefined {
  return snakeSkillShopTabs(state).flatMap((tab) => tab.cards).find((card) => card.skillId === skillId);
}

function bindSnakeSkillDockControls(dock: HTMLElement): void {
  dock.querySelectorAll<HTMLButtonElement>('[data-action="buySnakeSkill"][data-skill-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const skillId = button.dataset.skillId;
      if (button.disabled || !isSnakeSkillId(skillId)) {
        return;
      }
      gameStore.dispatch({ type: 'buySnakeSkill', skillId });
      refreshSnakeSkillDock(gameStore.snapshot, { force: true });
    });
  });

  dock.querySelectorAll<HTMLButtonElement>('[data-action="setSnakeSkillShopTab"]').forEach((button) => {
    button.addEventListener('click', () => {
      refreshSnakeSkillDock(gameStore.snapshot, { force: true });
    });
  });
}

function updateDynamicMiningSkillCards(state: GameState): void {
  const signature = miningSkillCardDynamicSignature(state);
  if (signature === lastMiningSkillCardDynamicSignature) {
    return;
  }
  lastMiningSkillCardDynamicSignature = signature;

  const currentMana = Math.floor(state.mana);
  rootElement?.querySelectorAll<HTMLButtonElement>('.mining-skill-dock .skill-shop-card[data-skill-id]').forEach((card) => {
    const skillId = card.dataset.skillId;
    if (!isMiningSkillId(skillId)) {
      return;
    }
    const snapshot = miningSkillShopCardSnapshot(state, skillId);
    if (!card.dataset.action && card.dataset.miningDynamicClickBound !== '1') {
      card.dataset.miningDynamicClickBound = '1';
      card.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        const clickedSkillId = card.dataset.skillId;
        if (card.disabled || !isMiningSkillId(clickedSkillId)) {
          return;
        }

        gameStore.dispatch({ type: 'buyMiningSkill', skillId: clickedSkillId });
        refreshMiningSkillDock(gameStore.snapshot, { force: true });
      });
    }

    const isMaxed = state.miningSkills[skillId] >= miningSkillMaxLevel(skillId);
    const isUnaffordable = !isMaxed && currentMana < miningSkillCost(state, skillId);
    const canBuy = !isMaxed && !isUnaffordable;
    card.classList.toggle('is-unaffordable', isUnaffordable);
    card.classList.toggle('is-maxed', isMaxed);
    if (!canBuy) {
      clearOneShotHoverTarget(card);
    }
    card.disabled = !canBuy;
    if (canBuy) {
      card.dataset.action = 'buyMiningSkill';
    } else {
      delete card.dataset.action;
    }

    if (snapshot) {
      setAttributeIfChanged(card, 'aria-label', `${snapshot.title}: ${snapshot.value}. ${snapshot.detail}. ${snapshot.costText}.`);
      setAttributeIfChanged(card, 'title', `${snapshot.title} - ${snapshot.value} - ${snapshot.costText}`);
      setTextContentIfChanged(card.querySelector<HTMLElement>('[data-skill-card-value]'), snapshot.value);
      const deltaElement = card.querySelector<HTMLElement>('[data-skill-card-delta]');
      if (deltaElement) {
        setTextContentIfChanged(deltaElement, snapshot.delta);
        deltaElement.toggleAttribute('hidden', snapshot.delta.length === 0);
      }
      const buyElement = card.querySelector<HTMLElement>('[data-skill-card-buy]');
      if (buyElement) {
        setInnerHTMLIfChanged(buyElement, snapshot.isMaxed ? '<b>Max</b>' : snapshot.costHtml);
      }
    }
  });
}

function refreshMiningSkillDock(state: GameState, options: { force?: boolean } = {}): void {
  if (!rootElement || !isBookPanelOpen(state, 'mine')) {
    lastMiningSkillDockSignature = '';
    lastMiningSkillCardDynamicSignature = '';
    lastMiningSkillDockTab = null;
    return;
  }

  const dock = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="mine"] .mining-skill-dock');
  if (!dock) {
    lastMiningSkillDockSignature = '';
    lastMiningSkillCardDynamicSignature = '';
    lastMiningSkillDockTab = null;
    return;
  }

  const signature = miningSkillDockSignature(state);
  if (!options.force && signature === lastMiningSkillDockSignature) {
    return;
  }

  const animateCardCascade = lastMiningSkillDockTab !== null && lastMiningSkillDockTab !== miningSkillShopTab;
  dock.innerHTML = miningSkillShop(state, false, { docked: true, showCompactButton: false, animateCardCascade });
  lastMiningSkillDockSignature = signature;
  lastMiningSkillDockTab = miningSkillShopTab;
  lastMiningSkillCardDynamicSignature = miningSkillCardDynamicSignature(state);
  bindMiningSkillDockControls(dock);
  cleanupSkillTabEnterAnimations(dock);
  installOneShotHoverAnimations();
}

function miningSkillDockSignature(state: GameState): string {
  const skills = state.miningSkills;
  return [miningSkillShopTab, skills.pickaxeForce, skills.splashDamage, skills.automation].join('/');
}

function miningSkillCardDynamicSignature(state: GameState): string {
  return `${miningSkillDockSignature(state)}/${Math.floor(state.mana)}`;
}

function miningSkillShopCardSnapshot(state: GameState, skillId: MiningSkillId): SkillShopCard | undefined {
  return miningSkillShopTabs(state).flatMap((tab) => tab.cards).find((card) => card.skillId === skillId);
}

function bindMiningSkillDockControls(dock: HTMLElement): void {
  dock.querySelectorAll<HTMLButtonElement>('[data-action="buyMiningSkill"][data-skill-id]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      const skillId = button.dataset.skillId;
      if (button.disabled || !isMiningSkillId(skillId)) {
        return;
      }
      gameStore.dispatch({ type: 'buyMiningSkill', skillId });
      refreshMiningSkillDock(gameStore.snapshot, { force: true });
    });
  });

  dock.querySelectorAll<HTMLButtonElement>('[data-action="setMiningSkillShopTab"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      const tabId = button.dataset.skillShopTab;
      if (!isMiningSkillShopTabId(tabId)) {
        return;
      }
      miningSkillShopTab = tabId;
      refreshMiningSkillDock(gameStore.snapshot, { force: true });
    });
  });
}

function defenseEnemyFacingScale(position: DefensePoint): number {
  return position.x <= 50 ? 1 : -1;
}

function updateDynamicDefenseSkillCards(state: GameState): void {
  const signature = defenseSkillCardDynamicSignature(state);
  if (signature === lastDefenseSkillCardDynamicSignature) {
    return;
  }
  lastDefenseSkillCardDynamicSignature = signature;

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
  if (!canBuy) {
    clearOneShotHoverTarget(card);
  }
  card.disabled = !canBuy;
    if (canBuy) {
      card.dataset.action = 'buyDefenseSkill';
    } else {
      delete card.dataset.action;
    }

    if (snapshot) {
      setAttributeIfChanged(card, 'aria-label', `${snapshot.title}: ${snapshot.value}. ${snapshot.detail}. ${snapshot.costText}.`);
      setAttributeIfChanged(card, 'title', `${snapshot.title} - ${snapshot.value} - ${snapshot.costText}`);
      setTextContentIfChanged(card.querySelector<HTMLElement>('[data-skill-card-value]'), snapshot.value);
      const deltaElement = card.querySelector<HTMLElement>('[data-skill-card-delta]');
      if (deltaElement) {
        setTextContentIfChanged(deltaElement, snapshot.delta);
        deltaElement.toggleAttribute('hidden', snapshot.isLocked || snapshot.delta.length === 0);
      }
      const buyElement = card.querySelector<HTMLElement>('[data-skill-card-buy]');
      if (buyElement) {
        setInnerHTMLIfChanged(buyElement, snapshot.isLocked ? '' : snapshot.isMaxed ? '<b>Max</b>' : snapshot.costHtml);
      }
    }
  });
}

function refreshDefenseSkillDock(state: GameState, options: { force?: boolean } = {}): void {
  if (!rootElement || !isBookPanelOpen(state, 'defense')) {
    lastDefenseSkillDockSignature = '';
    lastDefenseSkillCardDynamicSignature = '';
    lastDefenseSkillDockTab = null;
    return;
  }

  const dock = rootElement.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-skill-dock');
  if (!dock) {
    lastDefenseSkillDockSignature = '';
    lastDefenseSkillCardDynamicSignature = '';
    lastDefenseSkillDockTab = null;
    return;
  }

  const signature = defenseSkillDockSignature(state);
  if (!options.force && signature === lastDefenseSkillDockSignature) {
    return;
  }

  const animateCardCascade = lastDefenseSkillDockTab !== null && lastDefenseSkillDockTab !== defenseSkillShopTab;
  dock.innerHTML = defenseSkillShop(state, false, { docked: true, showCompactButton: false, animateCardCascade });
  lastDefenseSkillDockSignature = signature;
  lastDefenseSkillDockTab = defenseSkillShopTab;
  lastDefenseSkillCardDynamicSignature = defenseSkillCardDynamicSignature(state);
  bindDefenseSkillDockControls(dock);
  cleanupSkillTabEnterAnimations(dock);
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
    skills.baseSpeed,
    state.defense.baseSpeedEnabled ? 1 : 0,
  ].join('/');
}

function defenseSkillCardDynamicSignature(state: GameState): string {
  return `${defenseSkillDockSignature(state)}/${Math.floor(state.resources.sigils)}`;
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
    case 'baseSpeed':
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
  const next = typeof value === 'number' ? formatGameNumber(value) : String(value);
  if (dynamicTextSnapshots.get(id) === next) {
    return;
  }
  dynamicTextSnapshots.set(id, next);
  rootElement?.querySelectorAll<HTMLElement>(`[data-dynamic-value="${id}"]`).forEach((element) => {
    setTextContentIfChanged(element, next);
  });
}

function setTextContentIfChanged(element: HTMLElement | null | undefined, value: string): void {
  if (element && element.textContent !== value) {
    element.textContent = value;
  }
}

function setInnerHTMLIfChanged(element: HTMLElement | null | undefined, value: string): void {
  if (element && element.innerHTML !== value) {
    element.innerHTML = value;
  }
}

function setAttributeIfChanged(element: HTMLElement, name: string, value: string): void {
  if (element.getAttribute(name) !== value) {
    element.setAttribute(name, value);
  }
}

function setStylePropertyIfChanged(element: HTMLElement, property: string, value: string): void {
  if (element.style.getPropertyValue(property) !== value) {
    element.style.setProperty(property, value);
  }
}

function setDynamicResourceText(id: string, value: number): void {
  setDynamicText(id, formatGameNumber(value));
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

function restartTimedOneShotClass(element: HTMLElement, className: string, durationMs: number): void {
  restartOneShotClass(element, className);
  let timers = timedOneShotClassTimers.get(element);
  if (!timers) {
    timers = new Map<string, number>();
    timedOneShotClassTimers.set(element, timers);
  }

  const previousTimer = timers.get(className);
  if (previousTimer !== undefined) {
    window.clearTimeout(previousTimer);
  }

  const timer = window.setTimeout(() => {
    element.classList.remove(className);
    timers?.delete(className);
  }, durationMs);
  timers.set(className, timer);
}

function cleanupFinishedAnimation(animation: Animation): void {
  animation.addEventListener('finish', () => animation.cancel(), { once: true });
}

function shouldPlayTimedElementFeedback(timestamps: WeakMap<HTMLElement, number>, element: HTMLElement, cooldownMs: number): boolean {
  const now = performance.now();
  const previous = timestamps.get(element) ?? 0;
  if (now - previous < cooldownMs) {
    return false;
  }

  timestamps.set(element, now);
  return true;
}

function playDefenseEnemyHitFeedback(
  enemyElement: HTMLElement,
  source: GameState['defense']['enemies'][number]['lastHitSource'],
  position: DefensePoint,
): void {
  if (!shouldPlayTimedElementFeedback(defenseEnemyHitFeedbackTimes, enemyElement, 90)) {
    return;
  }

  const outlineFilter = 'none';
  const flashFilter = 'brightness(2.35) saturate(0.68) contrast(1.12)';
  const flashAnimation = enemyElement.animate(
    [
      {
        filter: flashFilter,
        offset: 0,
      },
      {
        filter: flashFilter,
        offset: 0.42,
      },
      {
        filter: outlineFilter,
        offset: 1,
      },
    ],
    {
      duration: 72,
      easing: 'cubic-bezier(0.16, 0.86, 0.3, 1)',
    },
  );
  flashAnimation.id = 'defense-enemy-hit-feedback';
  cleanupFinishedAnimation(flashAnimation);

  if (source === 'lightning') {
    enemyElement.classList.add('is-lightning-hitstop');
    window.setTimeout(() => enemyElement.classList.remove('is-lightning-hitstop'), 52);
    return;
  }

  if (source !== 'normal') {
    return;
  }

  if (!shouldPlayTimedElementFeedback(defenseEnemyFlinchFeedbackTimes, enemyElement, 140)) {
    return;
  }

  const flinchVector = defenseEnemyFlinchVector(position);
  const baseY = enemyElement.classList.contains('is-skeleton-mage') ? '-100%' : '-50%';
  const facingScale = Number(enemyElement.style.getPropertyValue('--enemy-facing-scale')) || 1;
  const positionTransform = 'translate(var(--enemy-x-px, 0px), var(--enemy-y-px, 0px))';
  const baseTransform = `${positionTransform} translate(-50%, ${baseY}) scaleX(${facingScale})`;
  const pushedTransform = `${positionTransform} translate(-50%, ${baseY}) translate(${flinchVector.x.toFixed(1)}px, ${flinchVector.y.toFixed(1)}px) scaleX(${(facingScale * 1.05).toFixed(3)}) scaleY(0.94)`;
  const flinchAnimation = enemyElement.animate(
    [
      { transform: baseTransform, offset: 0 },
      { transform: pushedTransform, offset: 0.38 },
      { transform: baseTransform, offset: 1 },
    ],
    {
      duration: 120,
      easing: 'cubic-bezier(0.18, 0.9, 0.28, 1)',
    },
  );
  flinchAnimation.id = 'defense-enemy-flinch-feedback';
  cleanupFinishedAnimation(flinchAnimation);
}

function defenseEnemyFlinchVector(position: DefensePoint): DefensePoint {
  const vectorX = position.x - 50;
  const vectorY = position.y - 50;
  const length = Math.max(1, Math.hypot(vectorX, vectorY));
  return {
    x: (vectorX / length) * 4,
    y: (vectorY / length) * 4,
  };
}

function playDefenseOrbShotRecoil(shot: GameState['defense']['shots'][number]): void {
  const orbElement = rootElement?.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-orb');
  const defensePanelElement = rootElement?.querySelector<HTMLElement>('.book-overlay[data-book-id="defense"] .defense-panel');
  if (!orbElement || defensePanelElement?.classList.contains('is-defeated')) {
    return;
  }

  defenseOrbRecoilAnimation?.cancel();
  const recoil = defenseOrbShotRecoil(shot);
  const animation = orbElement.animate(
    [
      { translate: `${recoil.x.toFixed(2)}px ${recoil.y.toFixed(2)}px`, offset: 0 },
      { translate: `${(recoil.x * 0.28).toFixed(2)}px ${(recoil.y * 0.28).toFixed(2)}px`, offset: 0.42 },
      { translate: '0px 0px', offset: 1 },
    ],
    {
      duration: 220,
      easing: 'cubic-bezier(0.16, 0.9, 0.22, 1)',
    },
  );
  animation.id = 'defense-orb-shot-recoil';
  defenseOrbRecoilAnimation = animation;
  animation.addEventListener(
    'finish',
    () => {
      if (defenseOrbRecoilAnimation === animation) {
        defenseOrbRecoilAnimation = null;
      }
    },
    { once: true },
  );
  cleanupFinishedAnimation(animation);
}

function defenseOrbShotRecoil(shot: GameState['defense']['shots'][number]): DefensePoint {
  const shotTarget = defenseEnemyImpactPoint({ lane: shot.lane, distance: shot.distance, kind: shot.targetKind });
  const directionX = shotTarget.x - 50;
  const directionY = shotTarget.y - 50;
  const length = Math.hypot(directionX, directionY) || 1;
  const recoilStrength = 5.5;
  return {
    x: -(directionX / length) * recoilStrength,
    y: -(directionY / length) * recoilStrength,
  };
}

function playDefenseMoneyCounterPulse(moneyHud: HTMLElement, moneyValue: HTMLElement): void {
  const now = performance.now();
  if (now - lastDefenseMoneyCounterPulseAt < DEFENSE_MONEY_COUNTER_PULSE_MIN_INTERVAL_MS) {
    return;
  }
  lastDefenseMoneyCounterPulseAt = now;

  const counterAnimation = moneyHud.animate(
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
  counterAnimation.id = 'defense-money-counter-pulse';
  cleanupFinishedAnimation(counterAnimation);

  const existingPulse = moneyHud.querySelector<HTMLElement>('.defense-money-pulse');
  const pulse = existingPulse ?? document.createElement('strong');
  pulse.className = 'defense-money-pulse';
  pulse.textContent = moneyValue.textContent;
  if (!existingPulse) {
    moneyHud.append(pulse);
  }
  if (defenseMoneyPulseRemovalTimer !== null) {
    window.clearTimeout(defenseMoneyPulseRemovalTimer);
  }
  defenseMoneyPulseRemovalTimer = window.setTimeout(() => {
    defenseMoneyPulseRemovalTimer = null;
    pulse.remove();
  }, 460);
}

function playDefenseLevelUpBadge(stage: HTMLElement, badgeElement: HTMLElement, numElement: HTMLElement, newLevel: number): void {
  const levelText = String(newLevel);
  const levelAnimationRunning = badgeElement
    .getAnimations()
    .some((animation) => animation.id === 'defense-level-badge-pop' && animation.playState === 'running');
  if (levelAnimationRunning || stage.querySelector('.defense-level-spark')) {
    numElement.textContent = levelText;
    delete numElement.dataset.defenseLevelAnimating;
    return;
  }

  numElement.dataset.defenseLevelAnimating = levelText;

  badgeElement
    .getAnimations()
    .filter((animation) => animation.id === 'defense-level-badge-pop')
    .forEach((animation) => animation.cancel());
  numElement
    .getAnimations()
    .filter((animation) => animation.id.startsWith('defense-level-number-'))
    .forEach((animation) => animation.cancel());

  const badgeAnimation = badgeElement.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(0.88)', offset: 0.12 },
      { transform: 'scale(1.28)', offset: 0.4 },
      { transform: 'scale(0.96)', offset: 0.7 },
      { transform: 'scale(1)' },
    ],
    { duration: 620, easing: 'ease-out' },
  );
  badgeAnimation.id = 'defense-level-badge-pop';
  cleanupFinishedAnimation(badgeAnimation);

  const glowAnimation = stage.querySelector<HTMLElement>('.defense-level-glow')?.animate(
    [{ opacity: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 0 }],
    { duration: 650, easing: 'ease-out' },
  );
  if (glowAnimation) {
    glowAnimation.id = 'defense-level-glow-flash';
    cleanupFinishedAnimation(glowAnimation);
  }

  const numberOutAnimation = numElement.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: 'translateY(-26px)', opacity: 0 },
    ],
    { duration: 260, easing: 'ease-in' },
  );
  numberOutAnimation.id = 'defense-level-number-out';
  cleanupFinishedAnimation(numberOutAnimation);

  window.setTimeout(() => {
    if (numElement.dataset.defenseLevelAnimating !== levelText) {
      return;
    }
    numElement.textContent = levelText;
    const numberInAnimation = numElement.animate(
      [
        { transform: 'translateY(26px)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
      ],
      { duration: 300, easing: 'cubic-bezier(.2,.8,.3,1.2)' },
    );
    numberInAnimation.id = 'defense-level-number-in';
    numberInAnimation.addEventListener(
      'finish',
      () => {
        if (numElement.dataset.defenseLevelAnimating === levelText) {
          delete numElement.dataset.defenseLevelAnimating;
        }
        numberInAnimation.cancel();
      },
      { once: true },
    );
    window.setTimeout(() => {
      if (numElement.dataset.defenseLevelAnimating === levelText) {
        delete numElement.dataset.defenseLevelAnimating;
      }
    }, 360);
  }, 230);

  const colors = ['#ffe08a', '#ffd23c', '#fff3c4', '#ffffff'];
  for (let index = 0; index < 14; index += 1) {
    const spark = document.createElement('span');
    spark.className = 'defense-level-spark';
    spark.style.background = colors[index % colors.length];
    spark.style.color = colors[index % colors.length];
    stage.append(spark);

    const angle = Math.random() * Math.PI * 2;
    const distance = 44 + Math.random() * 34;
    const sparkAnimation = spark.animate(
      [
        { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 1 },
        {
          transform: `translate(-50%, -50%) translate(${(Math.cos(angle) * distance).toFixed(1)}px, ${(
            Math.sin(angle) * distance
          ).toFixed(1)}px) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 700, easing: 'cubic-bezier(.2,.7,.3,1)' },
    );
    sparkAnimation.id = 'defense-level-spark-burst';
    sparkAnimation.addEventListener('finish', () => spark.remove(), { once: true });
    window.setTimeout(() => spark.remove(), 780);
  }
}

function syncDefenseGoldBoostOrbs(badgeElement: HTMLElement, state: GameState): void {
  const orbitElement = badgeElement.querySelector<HTMLElement>('.defense-gold-boost-orbit');
  if (!orbitElement) {
    return;
  }

  const multiplier = defenseWaveGoldMultiplier(state);
  if (orbitElement.dataset.defenseGoldMultiplier === String(multiplier)) {
    return;
  }
  orbitElement.dataset.defenseGoldMultiplier = String(multiplier);
  orbitElement.innerHTML = defenseGoldBoostOrbsMarkup(state);
}

function playDefenseGoldBoostOrbGain(stage: HTMLElement, badgeElement: HTMLElement, multiplier: number): void {
  restartTimedOneShotClass(stage, 'is-gold-boosting', 1420);
  restartTimedOneShotClass(badgeElement, 'is-gold-boosting', 820);

  const label = stage.querySelector<HTMLElement>('.defense-gold-boost-label');
  if (label) {
    label.textContent = `Gold x${formatGameNumber(multiplier)}`;
    restartTimedOneShotClass(label, 'is-gold-boosting', 1420);
  }

  const arrivalOrb = document.createElement('span');
  arrivalOrb.className = 'defense-gold-boost-arrival';
  stage.append(arrivalOrb);
  window.setTimeout(() => arrivalOrb.remove(), 980);

  const colors = ['#fff6c9', '#ffe080', '#ffcc3e', '#ffffff'];
  for (let index = 0; index < 12; index += 1) {
    const spark = document.createElement('span');
    spark.className = 'defense-gold-boost-spark';
    spark.style.background = colors[index % colors.length];
    spark.style.color = colors[index % colors.length];
    stage.append(spark);

    const angle = Math.random() * Math.PI * 2;
    const distance = 32 + Math.random() * 26;
    const sparkAnimation = spark.animate(
      [
        { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 1 },
        {
          transform: `translate(-50%, -50%) translate(${(Math.cos(angle) * distance).toFixed(1)}px, ${(
            Math.sin(angle) * distance
          ).toFixed(1)}px) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 760, easing: 'cubic-bezier(.2,.7,.3,1)', delay: 320 },
    );
    sparkAnimation.id = 'defense-gold-boost-spark';
    sparkAnimation.addEventListener('finish', () => spark.remove(), { once: true });
    window.setTimeout(() => spark.remove(), 1160);
  }
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
      clearOneShotHoverTarget(element);
    }
  });
}

function clearOneShotHoverTarget(element: HTMLElement): void {
  element.classList.remove('is-hover-bouncing');
  activeOneShotHoverElements.delete(element);
  const hoverTarget = resolveOneShotHoverTarget(element);
  if (hoverTarget) {
    activeOneShotHoverKeys.delete(hoverTarget.key);
  }
}

function cleanupSkillTabEnterAnimations(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('.skill-shop-card.is-tab-entering').forEach((card) => {
    const cleanup = () => {
      card.classList.remove('is-tab-entering');
      card.style.removeProperty('--skill-card-index');
    };
    card.addEventListener('animationend', cleanup, { once: true });
    window.setTimeout(cleanup, 520);
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

  const manaSkillCard = target.closest<HTMLElement>('.mana-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable):not(.is-locked):not(.is-maxed)');
  if (manaSkillCard) {
    return { element: manaSkillCard, key: `mana-skill-card:${manaSkillCard.dataset.skillId ?? manaSkillCard.textContent ?? ''}` };
  }

  const manaSkillTab = target.closest<HTMLElement>('.mana-skill-dock .skill-shop-tab');
  if (manaSkillTab) {
    return { element: manaSkillTab, key: `mana-skill-tab:${manaSkillTab.dataset.skillShopTab ?? manaSkillTab.textContent ?? ''}` };
  }

  const defenseSkillCard = target.closest<HTMLElement>('.defense-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable):not(.is-locked)');
  if (defenseSkillCard) {
    return { element: defenseSkillCard, key: `defense-skill-card:${defenseSkillCard.dataset.skillId ?? defenseSkillCard.textContent ?? ''}` };
  }

  const defenseSkillTab = target.closest<HTMLElement>('.defense-skill-dock .skill-shop-tab');
  if (defenseSkillTab) {
    return { element: defenseSkillTab, key: `defense-skill-tab:${defenseSkillTab.dataset.skillShopTab ?? defenseSkillTab.textContent ?? ''}` };
  }

  const miningSkillCard = target.closest<HTMLElement>('.mining-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable):not(.is-locked)');
  if (miningSkillCard) {
    return { element: miningSkillCard, key: `mining-skill-card:${miningSkillCard.dataset.skillId ?? miningSkillCard.textContent ?? ''}` };
  }

  const miningSkillTab = target.closest<HTMLElement>('.mining-skill-dock .skill-shop-tab');
  if (miningSkillTab) {
    return { element: miningSkillTab, key: `mining-skill-tab:${miningSkillTab.dataset.skillShopTab ?? miningSkillTab.textContent ?? ''}` };
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
  const padding = bookId === 'mana' && getBookPanelPreset(bookId).id === 'large' ? 0 : 8;
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
  const preferredMinWidth = getBookPanelSizePresets(bookId)[0].width;
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

  const presets = getBookPanelSizePresets(bookId);
  const currentPreset = getBookPanelPreset(bookId);
  const currentIndex = Math.max(0, presets.findIndex((preset) => preset.id === currentPreset.id));
  const nextPreset = presets[(currentIndex + 1) % presets.length];
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
  const presets = getBookPanelSizePresets(bookId);
  const presetId = bookPanelSizePresetIds.get(bookId) ?? 'large';
  return presets.find((preset) => preset.id === presetId) ?? presets[presets.length - 1];
}

function getBookPanelSizePresets(bookId: BookId): readonly BookPanelSizePreset[] {
  if (bookId === 'mana') {
    return [BOOK_PANEL_SIZE_PRESETS[1], BOOK_PANEL_SIZE_PRESETS[2]];
  }
  return BOOK_PANEL_SIZE_PRESETS;
}

function bookPanelSizeFromPreset(bookId: BookId, preset: BookPanelSizePreset): { width: number; height: number } {
  const width = getBookPanelPresetWidth(bookId, preset);
  return {
    width,
    height: getBookPanelHeightForWidth(bookId, width),
  };
}

function getBookPanelPresetWidth(bookId: BookId, preset: BookPanelSizePreset): number {
  if (bookId === 'mana' && preset.id === 'large' && rootElement) {
    return Math.round(getBookPanelMaxWidth(rootElement.getBoundingClientRect(), bookId));
  }
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
  return bookId === 'defense' || bookId === 'mana';
}

function getBookPanelMaxWidth(rootRect: DOMRect, bookId?: BookId): number {
  const isFullHeightMana = bookId === 'mana' && getBookPanelPreset(bookId).id === 'large';
  const padding = isFullHeightMana ? 0 : 8;
  const hardMinWidth = 180;
  const horizontalTravel = isFullHeightMana
    ? 0
    : Math.min(BOOK_PANEL_MIN_HORIZONTAL_TRAVEL, Math.max(0, rootRect.width - padding * 2 - hardMinWidth));
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
  const hasUpgradeControls =
    selectedBook.id !== 'typing' && selectedBook.id !== 'defense' && selectedBook.id !== 'mana' && selectedBook.id !== 'mine';
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
    state.snake.food?.x ?? -1,
    state.snake.food?.y ?? -1,
    state.snake.bonusFood?.type ?? 'none',
    state.snake.bonusFood?.cell.x ?? -1,
    state.snake.bonusFood?.cell.y ?? -1,
    state.snake.extraLivesUsed,
    state.snake.invincibleTimer.toFixed(1),
    state.snake.body.map((cell) => `${cell.x},${cell.y}`).join(';'),
    ...(includeDefenseVolatile
      ? [Math.ceil(state.defense.towerHealth), state.defense.score, state.defense.best, state.defense.lastReward]
      : ['defense-volatile']),
    defenseEffectiveSpeedMultiplier(state),
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
    state.manaCrystal.xp,
    state.manaCrystal.lastCollectedXpOrb?.id ?? 0,
    state.manaCrystal.lastCollectedXpOrb?.value ?? 0,
    state.manaCrystal.holdClickActive ? 1 : 0,
    manaSkills.power,
    manaSkills.clickMultiplier,
    manaSkills.xpOrbChance,
    manaSkills.yellowOrbChance,
    manaSkills.greenOrbChance,
    manaSkills.blueOrbChance,
    manaSkills.xpValue,
    manaSkills.levelUpEffect,
    manaSkills.holdClick,
    manaSkills.allyFindOrb,
    manaSkills.meowKnight ?? 0,
    ...MANA_IDLE_COMPANION_SKILL_IDS.map((skillId) => manaSkills[skillId] ?? 0),
    manaSkills.criticalHit,
    manaSkills.criticalEffect,
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
    manaSkillShopTab,
    defenseSkillShopTab,
    miningSkillShopTab,
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

function shouldPatchOpenManaPanel(state: GameState, structureSignature: string): boolean {
  if (!rootElement || structureSignature !== lastRenderStructureSignature) {
    return false;
  }
  if (state.openBookPanels.length !== 1 || state.openBookPanels[0]?.bookId !== 'mana') {
    return false;
  }
  return Boolean(rootElement.querySelector('.book-overlay[data-book-id="mana"] .mana-panel'));
}

function shouldPatchOpenSnakePanel(state: GameState, structureSignature: string): boolean {
  if (!rootElement || structureSignature !== lastRenderStructureSignature) {
    return false;
  }
  if (state.openBookPanels.length !== 1 || state.openBookPanels[0]?.bookId !== 'serpent') {
    return false;
  }
  return Boolean(rootElement.querySelector('.book-overlay[data-book-id="serpent"] .snake-panel'));
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
  if (!playfield) {
    return;
  }
  if (!playfield.querySelector('[data-mining-3d-board]')) {
    playfield.innerHTML = miningPlayfield(state);
  }
  updateMiningPlayfieldDom(playfield, state);
  installMiningIsoBoardHandlers();
  syncMiningThreeTerrain(state, (blockId) => {
    const board = rootElement?.querySelector<HTMLElement>('[data-mining-3d-board]');
    if (board) {
      focusBookPanelFromControl(board, 'mine');
    }
    gameStore.dispatch({ type: 'digMiningBlock', blockId });
  });
}

function updateMiningPlayfieldDom(playfield: HTMLElement, state: GameState): void {
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
    const ariaLabel =
      block.layersRemaining > 0
        ? `Bloc de ${material.name} profondeur ${block.depth}, ${block.health} PV sur ${block.maxHealth}, ${block.layersRemaining} couches restantes`
        : `Emplacement vide profondeur ${block.depth}`;
    button.dataset.material = material.id;
    button.dataset.layerCount = String(block.layersRemaining);
    button.disabled = block.layersRemaining <= 0;
    setAttributeIfChanged(button, 'title', title);
    setAttributeIfChanged(button, 'aria-label', ariaLabel);
    setTextContentIfChanged(button.querySelector<HTMLElement>('span'), material.shortName);
    setTextContentIfChanged(button.querySelector<HTMLElement>('i'), String(block.layersRemaining));
  }

}

function refreshSnakeBoard(state: GameState): void {
  const shell = rootElement?.querySelector<HTMLElement>('.book-overlay[data-book-id="serpent"] .snake-board-shell');
  if (!shell) {
    return;
  }
  setInnerHTMLIfChanged(shell, snakeBoardShellContent(state));
  bindSnakeBoardControls(shell);
}

function bindSnakeBoardControls(shell: HTMLElement): void {
  shell.querySelectorAll<HTMLButtonElement>('[data-action="toggleSnakeAutomation"]').forEach((button) => {
    if (button.dataset.snakeBoardControlBound === '1') {
      return;
    }
    button.dataset.snakeBoardControlBound = '1';
    button.addEventListener('click', () => {
      gameStore.dispatch({ type: 'toggleSnakeAutomation' });
    });
  });
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
  const resourceLabel = definition.resourceName ? ` + ${formatGameNumber(upgradeResourceCost(bookId, state))} ${definition.resourceName}` : '';
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
        costText: `${compactHudNumber(upgradeManaCost(bookId, state))} Mana${resourceLabel}`,
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
          ${manaSkillCompactButton(state, 'criticalHit', '◇')}
          ${manaSkillCompactButton(state, 'criticalEffect', '✦')}
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
          ${snakeSkillCompactButton(state, 'bonusFruit', '◆')}
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
  return `${blackjackResourceCost('mana', compactHudNumber(cost))}${extraCost ? `<span class="standard-upgrade-extra-cost">${extraCost}</span>` : ''}`;
}

function manaSkillShopCostHtml(cost: number): string {
  return `<b>${compactHudNumber(cost)}</b>`;
}

function miningSkillShopCostHtml(cost: number): string {
  return `<b>${compactHudNumber(cost)}</b>`;
}

function snakeSkillShopCostHtml(cost: number): string {
  return `<span class="blackjack-cost-resource"><img class="blackjack-upgrade-icon is-cost-icon" src="/assets/library/resources/scales.svg" alt="Ecailles" loading="lazy" decoding="async"><b>${compactHudNumber(cost)}</b></span>`;
}

type SkillShopTheme = 'attack' | 'defense' | 'utility' | 'research';
type ManaSkillShopTabId = 'click' | 'auto' | 'xp' | 'research';
type DefenseSkillShopTabId = SkillShopTheme;
type SnakeSkillShopTabId = 'snake';
type MiningSkillShopTabId = 'mine';
type SkillShopElementKind = 'lightning' | 'ice';

interface SkillShopCard {
  action: string;
  skillId: string;
  icon: string;
  iconTint?: string;
  elementKind?: SkillShopElementKind;
  title: string;
  value: string;
  delta: string;
  detail: string;
  level: number;
  maxLevel: number | null;
  costHtml: string;
  costText: string;
  progressPercent?: number;
  progressText?: string;
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
  animateCardCascade?: boolean;
}

function isDefenseSkillShopTabId(value: string | undefined): value is DefenseSkillShopTabId {
  return value === 'attack' || value === 'defense' || value === 'utility';
}

function isManaSkillShopTabId(value: string | undefined): value is ManaSkillShopTabId {
  return value === 'click' || value === 'xp' || value === 'auto' || value === 'research';
}

function isMiningSkillShopTabId(value: string | undefined): value is MiningSkillShopTabId {
  return value === 'mine';
}

function isManaSkillId(value: string | undefined): value is ManaSkillId {
  return (
    value === 'power' ||
    value === 'clickMultiplier' ||
    value === 'research' ||
    value === 'clickResearch' ||
    value === 'autoClicker' ||
    value === 'multiAutoClicker' ||
    value === 'xpOrbChance' ||
    value === 'yellowOrbChance' ||
    value === 'greenOrbChance' ||
    value === 'blueOrbChance' ||
    value === 'xpValue' ||
    value === 'levelUpEffect' ||
    value === 'holdClick' ||
    value === 'allyFindOrb' ||
    value === 'meowKnight' ||
    value === 'idleGlock' ||
    value === 'idleAk47' ||
    value === 'idleBazooka' ||
    value === 'idleBow' ||
    value === 'idleSword' ||
    value === 'idleOrangeCat' ||
    value === 'idlePickaxe' ||
    value === 'researchClickPower' ||
    value === 'researchMeowKnight' ||
    value === 'researchIdleGlock' ||
    value === 'researchIdleAk47' ||
    value === 'researchIdleBazooka' ||
    value === 'researchIdleBow' ||
    value === 'researchIdleSword' ||
    value === 'researchIdleOrangeCat' ||
    value === 'researchIdlePickaxe' ||
    value === 'criticalHit' ||
    value === 'criticalEffect'
  );
}

function isManaResearchSkillId(value: string | undefined): value is ManaResearchSkillId {
  return (
    value === 'researchClickPower' ||
    value === 'researchMeowKnight' ||
    value === 'researchIdleGlock' ||
    value === 'researchIdleAk47' ||
    value === 'researchIdleBazooka' ||
    value === 'researchIdleBow' ||
    value === 'researchIdleSword' ||
    value === 'researchIdleOrangeCat' ||
    value === 'researchIdlePickaxe'
  );
}

function isMiningSkillId(value: string | undefined): value is MiningSkillId {
  return value === 'pickaxeForce' || value === 'splashDamage' || value === 'automation';
}

function isSnakeSkillId(value: string | undefined): value is SnakeSkillId {
  return (
    value === 'speed' ||
    value === 'gridSize' ||
    value === 'automation' ||
    value === 'baseMultiplier' ||
    value === 'bonusFruit' ||
    value === 'extraLife' ||
    value === 'edgeWrap'
  );
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
          ${activeTab.cards
            .map((card, index) => skillShopCard(card, activeTab.theme, options.animateCardCascade ? index : undefined))
            .join('')}
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

function skillShopCard(card: SkillShopCard, theme: SkillShopTheme, cascadeIndex?: number): string {
  const canBuy = !card.isMaxed && !card.isDisabled;
  const compactTitle = compactSkillShopTitle(card.title);
  const iconStyle = card.iconTint ? ` style="color:${card.iconTint}"` : '';
  const elementKindAttribute = card.elementKind ? ` data-element-kind="${card.elementKind}"` : '';
  const cascadeClass = cascadeIndex === undefined ? '' : ' is-tab-entering';
  const cascadeStyle = cascadeIndex === undefined ? '' : ` style="--skill-card-index:${cascadeIndex}"`;
  return `
    <button
      class="skill-shop-card is-${theme}${cascadeClass} ${card.isMaxed ? 'is-maxed' : ''} ${card.isLocked ? 'is-locked' : ''} ${card.isUnaffordable ? 'is-unaffordable' : ''}"
      type="button"
      data-skill-id="${card.skillId}"
      ${cascadeStyle}
      ${elementKindAttribute}
      ${canBuy ? `data-action="${card.action}"` : 'disabled'}
      aria-label="${card.title}: ${card.value}. ${card.detail}. ${card.costText}."
      title="${card.title} - ${card.value} - ${card.costText}"
    >
      <span class="skill-shop-card-topline">
        <span class="skill-shop-card-icon" aria-hidden="true"${iconStyle}>${card.icon}</span>
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
      ${
        card.progressPercent === undefined
          ? ''
          : `<span class="skill-shop-research-progress" data-skill-card-progress style="--skill-research-progress:${card.progressPercent}%"><i></i><b data-skill-card-progress-text>${card.progressText ?? ''}</b></span>`
      }
    </button>
  `;
}

function compactSkillShopTitle(title: string): string {
  return title.replace(/\bSuper\b/g, 'S.').replace(/\bCritical\b|\bCrit\b/g, 'C.');
}

function manaSkillShop(state: GameState, shouldAnimate = false, options: SkillShopPanelOptions = {}): string {
  return skillShopPanel(
    'mana',
    shouldAnimate,
    'Crystal Skills',
    'Mana upgrades',
    manaSkillShopTab,
    manaSkillShopTabs(state),
    'setManaSkillShopTab',
    options,
  );
}

function manaSkillShopTabs(state: GameState): Array<SkillShopTab<ManaSkillShopTabId>> {
  const clickResearchCard = manaResearchUnlocked(state)
    ? manaSkillShopCard(
        state,
        'clickResearch',
        'Click Research',
        `${formatGameNumber(manaClickResearchSecondsPerFiveClicks(state))}s / 5 clicks`,
        '+1s / 5 clicks',
      )
    : manaSkillShopCard(state, 'research', 'Research', 'Locked', 'unlock research');
  const tabs: Array<SkillShopTab<ManaSkillShopTabId>> = [
    {
      id: 'click',
      label: 'Click',
      icon: '▲',
      theme: 'attack',
      cards: [
        manaSkillShopCard(state, 'power', 'Power +', `${formatOneDecimalGameNumber(manaClickGainPreview(state))}`, 'current click power'),
        manaSkillShopCard(state, 'clickMultiplier', 'Click x', `x${formatTwoDecimalGameNumber(manaClickMultiplier(state))}`, 'click multiplier'),
        clickResearchCard,
        manaSkillShopCard(state, 'autoClicker', 'Auto Clicker', manaAutoClickerCount(state) > 0 ? `${formatGameNumber(manaAutoClickerInterval(state), { forceDecimal: true })}s` : 'Off', '-0.2s'),
        manaSkillShopCard(state, 'multiAutoClicker', 'Multi Auto Clicker', `x${manaAutoClickerCapacity(state)}`, 'autoclicker capacity'),
        manaSkillShopCard(state, 'criticalHit', 'Critical Chance', `${formatGameNumber(state.manaSkills.criticalHit)}%`, '+1% old crit'),
        manaSkillShopCard(state, 'criticalEffect', 'Critical Multiplier', `x${formatTwoDecimalGameNumber(manaCriticalMultiplier(state))}`, 'critical damage'),
        manaSkillShopCard(state, 'holdClick', 'Click Holder', manaHoldClickUnlocked(state) ? `${formatGameNumber(manaHoldClickRate(state))}/s` : 'Off', '+1 click/s'),
      ],
    },
    {
      id: 'auto',
      label: 'Idle',
      icon: '⌁',
      theme: 'utility',
      cards: [
        manaSkillShopCard(state, 'meowKnight', 'Meow Knight', `${formatOneDecimalGameNumber(manaMeowKnightDamage(state))}/s`, 'effective ally damage'),
        manaSkillShopCard(state, 'idleBow', 'Bow', `${formatOneDecimalGameNumber(manaIdleCompanionDamage(state, 'idleBow'))}/s`, 'effective ally damage'),
        manaSkillShopCard(state, 'idleGlock', 'Glock', `${formatOneDecimalGameNumber(manaIdleCompanionDamage(state, 'idleGlock'))}/s`, 'effective ally damage'),
        manaSkillShopCard(state, 'idlePickaxe', 'Pickaxe', `${formatOneDecimalGameNumber(manaIdleCompanionDamage(state, 'idlePickaxe'))}/s`, 'effective ally damage'),
        manaSkillShopCard(state, 'idleBazooka', 'Bazooka', `${formatOneDecimalGameNumber(manaIdleCompanionDamage(state, 'idleBazooka'))}/s`, 'effective ally damage'),
        manaSkillShopCard(state, 'idleAk47', 'AK47', `${formatOneDecimalGameNumber(manaIdleCompanionDamage(state, 'idleAk47'))}/s`, 'effective ally damage'),
        manaSkillShopCard(state, 'idleSword', 'Sword', `${formatOneDecimalGameNumber(manaIdleCompanionDamage(state, 'idleSword'))}/s`, 'effective ally damage'),
        manaSkillShopCard(state, 'idleOrangeCat', 'Ultimate Orange Cat', `${formatOneDecimalGameNumber(manaIdleCompanionDamage(state, 'idleOrangeCat'))}/s`, 'effective ally damage'),
      ],
    },
    {
      id: 'xp',
      label: 'XP',
      icon: '●',
      theme: 'defense',
      cards: [
        manaSkillShopCard(state, 'xpOrbChance', 'Red Orb', `${formatGameNumber(manaXpOrbChance(state) * 100)}%`, 'drops XP orb'),
        manaSkillShopCard(state, 'yellowOrbChance', 'Yellow Orb', `${formatGameNumber(manaYellowOrbChance(state) * 100)}%`, 'drops Mana orb'),
        manaSkillShopCard(state, 'greenOrbChance', 'Green Orb', `${formatGameNumber(manaGreenOrbChance(state) * 100)}%`, 'drops double XP orb'),
        manaSkillShopCard(state, 'blueOrbChance', 'Blue Orb', `${formatGameNumber(manaBlueOrbChance(state) * 100)}%`, 'drops mixed orb'),
        manaSkillShopCard(state, 'xpValue', 'Exp x', `x${formatOneDecimalGameNumber(manaXpOrbValue(state))}`, 'effective XP value'),
        manaSkillShopCard(state, 'levelUpEffect', 'Level Up Effect', `x${formatTwoDecimalGameNumber(manaLevelUpEffectMultiplier(state))}`, 'level-up reward multiplier'),
        manaSkillShopCard(state, 'allyFindOrb', 'Ally Find Orb', `${formatGameNumber(manaAllyFindOrbChance(state) * 100)}%`, 'on ally attack'),
      ],
    },
  ];

  if (manaResearchUnlocked(state)) {
    tabs.push({
      id: 'research',
      label: 'Research',
      icon: '◉',
      theme: 'research',
      cards: [
        manaResearchSkillShopCard(state, 'researchClickPower', 'Click Power', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchClickPower'))}`, '+10% click'),
        manaResearchSkillShopCard(state, 'researchMeowKnight', 'Meow Knight', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchMeowKnight'))}`, '+10% ally'),
        manaResearchSkillShopCard(state, 'researchIdleBow', 'Bow', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchIdleBow'))}`, '+10% ally'),
        manaResearchSkillShopCard(state, 'researchIdleGlock', 'Glock', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchIdleGlock'))}`, '+10% ally'),
        manaResearchSkillShopCard(state, 'researchIdlePickaxe', 'Pickaxe', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchIdlePickaxe'))}`, '+10% ally'),
        manaResearchSkillShopCard(state, 'researchIdleBazooka', 'Bazooka', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchIdleBazooka'))}`, '+10% ally'),
        manaResearchSkillShopCard(state, 'researchIdleAk47', 'AK47', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchIdleAk47'))}`, '+10% ally'),
        manaResearchSkillShopCard(state, 'researchIdleSword', 'Sword', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchIdleSword'))}`, '+10% ally'),
        manaResearchSkillShopCard(state, 'researchIdleOrangeCat', 'Ultimate Orange Cat', `x${formatTwoDecimalGameNumber(manaResearchMultiplierForHud(state, 'researchIdleOrangeCat'))}`, '+10% ally'),
      ],
    });
  }

  return tabs;
}

function manaResearchMultiplierForHud(state: GameState, skillId: ManaResearchSkillId): number {
  return Math.pow(1.1, state.manaSkills[skillId] ?? 0);
}

function manaSkillShopCard(
  state: GameState,
  skillId: ManaSkillId,
  title: string,
  value: string,
  detail: string,
): SkillShopCard {
  const level = state.manaSkills[skillId];
  const maxLevel = manaSkillMaxLevel(skillId);
  const isMaxed = maxLevel !== null && level >= maxLevel;
  const cost = manaSkillCost(state, skillId);
  const isUnaffordable = !isMaxed && state.mana < cost;
  return {
    action: 'buyManaSkill',
    skillId,
    icon: manaSkillIcon(skillId),
    title,
    value,
    delta: isMaxed ? '' : manaSkillDeltaLabel(state, skillId),
    detail,
    level,
    maxLevel,
    costHtml: isMaxed ? 'Max' : manaSkillShopCostHtml(cost),
    costText: isMaxed ? 'Max' : `${compactHudNumber(cost)} Mana`,
    isMaxed,
    isDisabled: isUnaffordable,
    isUnaffordable,
  };
}

function manaResearchSkillShopCard(
  state: GameState,
  skillId: ManaResearchSkillId,
  title: string,
  value: string,
  detail: string,
): SkillShopCard {
  const level = state.manaSkills[skillId] ?? 0;
  const maxLevel = manaSkillMaxLevel(skillId);
  const isMaxed = maxLevel !== null && level >= maxLevel;
  const activeResearch = state.manaSkills.activeResearch;
  const isActive = activeResearch?.skillId === skillId;
  const isLocked = !manaCanResearch(state, skillId) && !isMaxed;
  const progressPercent = Math.round(manaResearchProgress(state, skillId) * 1000) / 10;
  const remainingSeconds = Math.ceil(manaResearchRemainingSeconds(state, skillId) / manaResearchSpeedMultiplier(state));
  return {
    action: 'startManaResearch',
    skillId,
    icon: isLocked ? '' : manaSkillIcon(skillId),
    title: isLocked ? '' : title,
    value: isLocked ? '' : value,
    delta: isLocked || isMaxed ? '' : detail,
    detail: isLocked ? '' : `${Math.ceil(manaResearchDuration(state, skillId) / manaResearchSpeedMultiplier(state))}s`,
    level,
    maxLevel,
    costHtml: '',
    costText: isLocked ? '' : isMaxed ? 'Max' : `${remainingSeconds}s`,
    progressPercent: isLocked ? undefined : progressPercent,
    progressText: isActive ? `${remainingSeconds}s` : '',
    isMaxed,
    isLocked,
    isDisabled: isLocked || isMaxed || Boolean(activeResearch),
    isUnaffordable: false,
  };
}

function manaSkillIcon(skillId: ManaSkillId): string {
  switch (skillId) {
    case 'power':
      return '▲';
    case 'clickMultiplier':
      return '×';
    case 'research':
      return '⌛';
    case 'clickResearch':
      return '⌛';
    case 'autoClicker':
      return '▶';
    case 'multiAutoClicker':
      return '▶▶';
    case 'xpOrbChance':
      return '●';
    case 'yellowOrbChance':
      return '◆';
    case 'greenOrbChance':
      return '◇';
    case 'blueOrbChance':
      return '✦';
    case 'xpValue':
      return 'XP';
    case 'levelUpEffect':
      return '↟';
    case 'holdClick':
      return '☝';
    case 'allyFindOrb':
      return '●';
    case 'meowKnight':
      return 'M';
    case 'idleGlock':
      return 'G';
    case 'idleAk47':
      return 'AK';
    case 'idleBazooka':
      return 'BZ';
    case 'idleBow':
      return 'B';
    case 'idleSword':
      return 'S';
    case 'idleOrangeCat':
      return 'OC';
    case 'idlePickaxe':
      return 'P';
    case 'researchClickPower':
      return '▲';
    case 'researchMeowKnight':
      return 'M';
    case 'researchIdleGlock':
      return 'G';
    case 'researchIdleAk47':
      return 'AK';
    case 'researchIdleBazooka':
      return 'BZ';
    case 'researchIdleBow':
      return 'B';
    case 'researchIdleSword':
      return 'S';
    case 'researchIdleOrangeCat':
      return 'OC';
    case 'researchIdlePickaxe':
      return 'P';
    case 'criticalHit':
      return '◎';
    case 'criticalEffect':
      return '✶';
  }
  return '';
}

function manaSkillDeltaLabel(state: GameState, skillId: ManaSkillId): string {
  const delta = manaSkillUpgradeEffectDelta(state, skillId);
  switch (skillId) {
    case 'power':
      return `(+${formatOneDecimalGameNumber(delta)})`;
    case 'clickMultiplier':
      return `(+${formatTwoDecimalGameNumber(delta)}x)`;
    case 'research':
      return '(unlock)';
    case 'clickResearch':
      return '(+1s / 5 clicks)';
    case 'autoClicker':
      return state.manaSkills.autoClicker <= 0
        ? `(${formatOneDecimalGameNumber(delta)}s)`
        : `(${delta >= 0 ? '+' : ''}${formatOneDecimalGameNumber(delta)}s)`;
    case 'multiAutoClicker':
      return `(+${formatGameNumber(delta)})`;
    case 'xpOrbChance':
    case 'yellowOrbChance':
    case 'greenOrbChance':
    case 'blueOrbChance':
      return `(+${formatGameNumber(delta)}%)`;
    case 'xpValue':
      return `(+${formatOneDecimalGameNumber(delta)})`;
    case 'levelUpEffect':
      return `(+${formatTwoDecimalGameNumber(delta)}x)`;
    case 'holdClick':
      return `(+${formatGameNumber(delta)}/s)`;
    case 'allyFindOrb':
      return `(+${formatGameNumber(delta)}%)`;
    case 'meowKnight':
    case 'idleGlock':
    case 'idleAk47':
    case 'idleBazooka':
    case 'idleBow':
    case 'idleSword':
    case 'idleOrangeCat':
    case 'idlePickaxe':
      return `(+${formatOneDecimalGameNumber(delta)}/s)`;
    case 'researchClickPower':
    case 'researchMeowKnight':
    case 'researchIdleGlock':
    case 'researchIdleAk47':
    case 'researchIdleBazooka':
    case 'researchIdleBow':
    case 'researchIdleSword':
    case 'researchIdleOrangeCat':
    case 'researchIdlePickaxe':
      return `(+${formatTwoDecimalGameNumber(delta)}x)`;
    case 'criticalHit':
      return `(+${formatGameNumber(delta)}%)`;
    case 'criticalEffect':
      return `(+${formatTwoDecimalGameNumber(delta)}x)`;
  }
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
        defenseSkillShopCard(state, 'damage', 'Damage +', `${formatOneDecimalGameNumber(defenseTowerDamage(state))} dmg`, '+1 per level'),
        defenseSkillShopCard(state, 'attackSpeed', 'Attack Speed', `${formatTwoDecimalGameNumber(defenseTowerAttackInterval(state))}s`, 'shorter cooldown'),
        defenseSkillShopCard(state, 'range', 'Range', `${formatGameNumber(defenseTowerRangePercent(state) * 100)}%`, 'larger attack circle'),
        defenseSkillShopCard(state, 'damageMultiplier', 'Damage x', `x${formatTwoDecimalGameNumber(defenseSkillDamageMultiplier(state))}`, 'all base damage'),
        defenseSkillShopCard(state, 'criticalChance', 'Critical Chance', `${formatGameNumber(Math.min(60, state.defenseSkills.criticalChance))}%`, 'chance to crit'),
        defenseSkillShopCard(state, 'criticalMultiplier', 'Critical DMG x', `x${formatTwoDecimalGameNumber(2 + state.defenseSkills.criticalMultiplier * 0.1)}`, 'bigger crits'),
        defenseSkillShopCard(state, 'superCriticalChance', 'Super Critical Chance', `${formatGameNumber(Math.min(25, state.defenseSkills.superCriticalChance))}%`, 'chance to super crit'),
        defenseSkillShopCard(state, 'superCriticalMultiplier', 'Super Critical DMG x', `x${formatTwoDecimalGameNumber(3 + state.defenseSkills.superCriticalMultiplier * 0.25)}`, 'huge crits'),
      ],
    },
    {
      id: 'defense',
      label: 'Element',
      icon: '♛',
      theme: 'defense',
      cards: [
        defenseSkillShopCard(state, 'iceDamage', 'Ice Damage', `${formatOneDecimalGameNumber(defenseIceDamage(state))} dmg`, 'aura damage tick', '#7fdcff'),
        defenseSkillShopCard(state, 'lightningCount', 'Lightning', `${defenseLightningTargetCount(state)}`, 'targets per strike', '#ffd23c'),
        defenseSkillShopCard(state, 'iceSpeed', 'Ice Speed', `${formatTwoDecimalGameNumber(defenseIceAttackInterval(state))}s`, 'faster aura ticks', '#7fdcff'),
        defenseSkillShopCard(state, 'lightningDamage', 'Lightning Damage', `${formatOneDecimalGameNumber(defenseLightningDamage(state))} dmg`, 'random map strike', '#ffd23c'),
        defenseSkillShopCard(state, 'iceRange', 'Ice Range', `${formatGameNumber(defenseIceRangePercent(state) * 100)}%`, 'larger frozen aura', '#7fdcff'),
        defenseSkillShopCard(state, 'lightningSpeed', 'Lightning Speed', `${formatTwoDecimalGameNumber(defenseLightningAttackInterval(state))}s`, 'faster lightning', '#ffd23c'),
        defenseSkillShopCard(state, 'iceSlow', 'Ice Slow', `${formatGameNumber(defenseIceSlow(state) * 100)}%`, 'slower enemies', '#7fdcff'),
      ],
    },
    {
      id: 'utility',
      label: 'Other',
      icon: '▰',
      theme: 'utility',
      cards: [
        defenseSkillShopCard(state, 'health', 'HP +', `${formatGameNumber(defenseMaxTowerHealth(state))}`, '+2 max hp'),
        defenseSkillShopCard(state, 'healthRegen', 'HP Regen', `${formatTwoDecimalGameNumber(defenseTowerHealthRegenPerSecond(state))}/s`, 'passive healing'),
        defenseSkillShopCard(state, 'moneyPerEnemy', 'Gold +', `${formatFixedGameNumber(defenseEnemyReward(state), 1)}`, '+1 seal per enemy'),
        defenseSkillShopCard(state, 'goldMultiplier', 'Gold x', `x${formatGameNumber(defenseGoldMultiplier(state), { forceDecimal: true })}`, '+10% gold per level'),
        defenseSkillShopCard(state, 'baseSpeed', 'Game Speed', `x${formatGameNumber(defenseBaseSpeedMultiplier(state), { forceDecimal: true })}`, 'base game speed'),
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
  iconTint?: string,
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
    icon: defenseSkillIcon(skillId),
    iconTint,
    elementKind: defenseSkillElementKind(skillId),
    title,
    value,
    delta: isMaxed ? '' : defenseSkillDeltaLabel(state, skillId),
    detail,
    level,
    maxLevel,
    costHtml: isLocked ? '' : isMaxed ? 'Max' : defenseSkillCostHtml(cost),
    costText: isLocked ? '' : isMaxed ? 'Max' : `${compactHudNumber(cost)} Sceaux`,
    isMaxed,
    isDisabled: isLocked || isUnaffordable,
    isLocked,
    isUnaffordable,
  };
}

function defenseSkillElementKind(skillId: DefenseSkillId): SkillShopElementKind | undefined {
  switch (skillId) {
    case 'lightningCount':
    case 'lightningDamage':
    case 'lightningSpeed':
      return 'lightning';
    case 'iceDamage':
    case 'iceSpeed':
    case 'iceRange':
    case 'iceSlow':
      return 'ice';
    default:
      return undefined;
  }
}

function defenseSkillIcon(skillId: DefenseSkillId): string {
  switch (skillId) {
    case 'damage':
      return skillShopPngIcon('atk_damage', 'Damage');
    case 'damageMultiplier':
      return skillShopPngIcon('atk_damage_all', 'Damage all');
    case 'attackSpeed':
      return skillShopPngIcon('atk_speed', 'Attack speed');
    case 'range':
      return skillShopPngIcon('atk_range', 'Range');
    case 'criticalChance':
      return skillShopPngIcon('atk_crit_chance', 'Critical chance');
    case 'criticalMultiplier':
      return skillShopPngIcon('atk_crit_mult', 'Critical multiplier');
    case 'superCriticalChance':
      return skillShopPngIcon('atk_supercrit_chance', 'Super critical chance');
    case 'superCriticalMultiplier':
      return skillShopPngIcon('atk_supercrit_mult', 'Super critical multiplier');
    case 'lightningCount':
      return skillShopPngIcon('elem_lightning', 'Lightning');
    case 'lightningDamage':
      return skillShopPngIcon('elem_lightning_dmg', 'Lightning damage');
    case 'lightningSpeed':
      return skillShopPngIcon('elem_lightning_speed', 'Lightning speed');
    case 'iceDamage':
      return skillShopPngIcon('elem_ice_dmg', 'Ice damage');
    case 'iceSpeed':
      return skillShopPngIcon('elem_ice_speed', 'Ice speed');
    case 'iceRange':
      return skillShopPngIcon('elem_ice_range', 'Ice range');
    case 'iceSlow':
      return skillShopPngIcon('elem_ice_slow', 'Ice slow');
    case 'health':
      return skillShopPngIcon('other_health', 'Health');
    case 'healthRegen':
      return skillShopPngIcon('other_health_regen', 'Health regen');
    case 'moneyPerEnemy':
      return skillShopPngIcon('other_gold_plus', 'Gold plus');
    case 'goldMultiplier':
      return skillShopPngIcon('other_gold_x', 'Gold multiplier');
    case 'baseSpeed':
      return skillShopPngIcon('game_speed', 'Game speed');
  }
  return '';
}

function skillShopPngIcon(name: string, label: string): string {
  return `<img class="skill-shop-png-icon is-${name}" src="/assets/td/icons/${name}.png" alt="${label}" draggable="false" loading="lazy" decoding="async">`;
}

function defenseSkillCostHtml(cost: number): string {
  return `<span class="blackjack-cost-resource"><img class="blackjack-upgrade-icon is-cost-icon" src="/assets/library/resources/sigils.svg" alt="Sceaux" loading="lazy" decoding="async"><b>${compactHudNumber(cost)}</b></span>`;
}

function defenseSkillDeltaLabel(state: GameState, skillId: DefenseSkillId): string {
  switch (skillId) {
    case 'damage':
      return `(+${formatOneDecimalGameNumber(defenseTowerDamageUpgradeDelta(state))})`;
    case 'damageMultiplier':
      return '(+0.10x)';
    case 'attackSpeed':
      return '(-0.05s)';
    case 'criticalChance':
      return '(+1%)';
    case 'criticalMultiplier':
      return '(+0.10x)';
    case 'superCriticalChance':
      return '(+1%)';
    case 'superCriticalMultiplier':
      return '(+0.25x)';
    case 'lightningDamage':
      return `(+${formatFixedGameNumber(defenseLightningDamageUpgradeDelta(state), 1)})`;
    case 'lightningSpeed':
      return '(-0.08s)';
    case 'lightningCount':
      return '(+1 count)';
    case 'iceDamage':
      return `(+${formatFixedGameNumber(defenseIceDamageUpgradeDelta(state), 1)})`;
    case 'iceSpeed':
      return '(-0.05s)';
    case 'iceRange':
      return '(+2%)';
    case 'iceSlow':
      return '(+2%)';
    case 'health':
      return '(+2)';
    case 'healthRegen':
      return '(+0.02/s)';
    case 'range':
      return '(+2%)';
    case 'moneyPerEnemy':
      return `(+${formatFixedGameNumber(defenseEnemyRewardUpgradeDelta(state), 1)})`;
    case 'goldMultiplier':
      return '(+10%)';
    case 'baseSpeed':
      return '(+0.1x)';
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
          ${snakeSkillCompactButton(state, 'bonusFruit', '◆')}
          ${snakeSkillCompactButton(state, 'extraLife', '♡')}
          ${snakeSkillCompactButton(state, 'edgeWrap', '⇄')}
        </div>
      </section>
    `;
  }

  return snakeSkillShop(state, shouldAnimate);
}

function snakeSkillShop(state: GameState, shouldAnimate = false, options: SkillShopPanelOptions = {}): string {
  return skillShopPanel(
    'serpent',
    shouldAnimate,
    'Snake Skills',
    'Serpent upgrades',
    'snake',
    snakeSkillShopTabs(state),
    'setSnakeSkillShopTab',
    options,
  );
}

function snakeSkillShopTabs(state: GameState): Array<SkillShopTab<SnakeSkillShopTabId>> {
  return [
    {
      id: 'snake',
      label: 'Snake',
      icon: '▰',
      theme: 'defense',
      cards: [
        snakeSkillShopCard(state, 'speed', 'Speed', `${formatGameNumber(snakeMoveInterval(state), { forceDecimal: true })}s`, '-0.022s'),
        snakeSkillShopCard(state, 'gridSize', 'Grid', `${snakeGridSize(state)}x${snakeGridSize(state)}`, '+1 axis'),
        snakeSkillShopCard(state, 'automation', 'Auto', snakeAutomationActive(state) ? 'On' : 'Off', 'assist'),
        snakeSkillShopCard(state, 'baseMultiplier', 'Base x', `x${formatGameNumber(snakeBaseMultiplier(state), { forceDecimal: true })}`, '+0.1x'),
        snakeSkillShopCard(state, 'bonusFruit', 'Bonus Food', snakeBonusFoodLabel(state), 'unlock food'),
        snakeSkillShopCard(state, 'extraLife', 'Life +', `${state.snakeSkills.extraLife}`, '+1 life'),
        snakeSkillShopCard(state, 'edgeWrap', 'Wrap', state.snakeSkills.edgeWrap > 0 ? 'On' : 'Off', 'cross edge'),
      ],
    },
  ];
}

function snakeSkillShopCard(
  state: GameState,
  skillId: SnakeSkillId,
  title: string,
  value: string,
  detail: string,
): SkillShopCard {
  const level = state.snakeSkills[skillId];
  const maxLevel = snakeSkillMaxLevel(skillId);
  const isMaxed = level >= maxLevel;
  const cost = snakeSkillCost(state, skillId);
  const isUnaffordable = !isMaxed && state.resources.scales < cost;
  return {
    action: 'buySnakeSkill',
    skillId,
    icon: snakeSkillIcon(skillId),
    title,
    value,
    delta: isMaxed ? '' : snakeSkillDeltaLabel(skillId),
    detail,
    level,
    maxLevel,
    costHtml: isMaxed ? 'Max' : snakeSkillShopCostHtml(cost),
    costText: isMaxed ? 'Max' : `${compactHudNumber(cost)} Ecailles`,
    isMaxed,
    isDisabled: isUnaffordable,
    isUnaffordable,
  };
}

function snakeSkillIcon(skillId: SnakeSkillId): string {
  switch (skillId) {
    case 'speed':
      return '↯';
    case 'gridSize':
      return '▦';
    case 'automation':
      return '⌁';
    case 'baseMultiplier':
      return '×';
    case 'bonusFruit':
      return '◆';
    case 'extraLife':
      return '♡';
    case 'edgeWrap':
      return '⇄';
  }
}

function snakeSkillDeltaLabel(skillId: SnakeSkillId): string {
  switch (skillId) {
    case 'speed':
      return '(-0.022s)';
    case 'gridSize':
      return '(+1)';
    case 'automation':
      return '(assist)';
    case 'baseMultiplier':
      return '(+0.1x)';
    case 'bonusFruit':
      return '(food)';
    case 'extraLife':
      return '(+1)';
    case 'edgeWrap':
      return '(wrap)';
  }
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
      targetSkillTrack(state, 'spawnSpeed', '↯', 'Apparition', `${formatGameNumber(targetSpawnInterval(state.targetSkills.spawnSpeed), { forceDecimal: true })}s`, 'Les cibles arrivent plus vite'),
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
    costText: isMaxed ? 'MAX' : `${compactHudNumber(cost)} Mana`,
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
  return interval > 0 ? `${formatGameNumber(interval, { forceDecimal: true })}s/tir` : 'Off';
}

function miningSkillShop(state: GameState, shouldAnimate = false, options: SkillShopPanelOptions = {}): string {
  return skillShopPanel(
    'mine',
    shouldAnimate,
    'Mine Skills',
    'Mining upgrades',
    miningSkillShopTab,
    miningSkillShopTabs(state),
    'setMiningSkillShopTab',
    options,
  );
}

function miningSkillShopTabs(state: GameState): Array<SkillShopTab<MiningSkillShopTabId>> {
  return [
    {
      id: 'mine',
      label: 'Mine',
      icon: '▰',
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
    icon: miningSkillIcon(skillId),
    title,
    value,
    delta: isMaxed ? '' : miningSkillDeltaLabel(skillId),
    detail,
    level,
    maxLevel,
    costHtml: isMaxed ? 'Max' : miningSkillShopCostHtml(cost),
    costText: isMaxed ? 'Max' : `${compactHudNumber(cost)} Mana`,
    isMaxed,
    isDisabled: isUnaffordable,
    isUnaffordable,
  };
}

function miningSkillIcon(skillId: MiningSkillId): string {
  switch (skillId) {
    case 'pickaxeForce':
      return '▲';
    case 'splashDamage':
      return '✣';
    case 'automation':
      return '⌁';
  }
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

function snakeBonusFoodLabel(state: GameState): string {
  const labels = ['Off', 'Blue round', 'Green round', 'Pink round', 'Red diamond', 'Blue diamond', 'Green diamond', 'Pink diamond'];
  return labels[Math.min(state.snakeSkills.bonusFruit, labels.length - 1)];
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
    ${miningSkillShop(state, shouldAnimate)}
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
  return `${formatGameNumber(miningAutomationInterval(state.miningSkills.automation), { forceDecimal: true })}s`;
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
    subtitle: (state) => `Mise ${formatGameNumber(blackjackCurrentMainBet(state))} · gain x${formatGameNumber(blackjackCurrentWinPayoutMultiplier(state), { forceDecimal: true })}`,
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
    subtitle: (state) => state.blackjack.pair.unlocked ? `${formatGameNumber(state.blackjack.pair.xp)} XP` : 'Verrouille',
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
    subtitle: (state) => state.blackjack.twentyOneThree.unlocked ? `${formatGameNumber(state.blackjack.twentyOneThree.xp)} XP` : 'Verrouille',
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
      return `${blackjackResourceCost('mana', compactHudNumber(cost.mana))}${blackjackResourceCost('chips', compactHudNumber(cost.chips))}`;
    case 'chips':
      return blackjackResourceCost('chips', compactHudNumber(cost.chips));
    case 'pairXp':
    case 'twentyOneThreeXp':
      return blackjackResourceCost('xp', formatGameNumber(cost.xp));
    case 'blocked':
      return cost.reason;
    case 'max':
      return 'MAX';
  }
}

function blackjackUpgradeCostText(cost: BlackjackUpgradeCost): string {
  switch (cost.kind) {
    case 'resources':
      return `${compactHudNumber(cost.mana)} Mana + ${compactHudNumber(cost.chips)} Jetons`;
    case 'chips':
      return `${compactHudNumber(cost.chips)} Jetons`;
    case 'pairXp':
    case 'twentyOneThreeXp':
      return `${formatGameNumber(cost.xp)} XP`;
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
          ${manaSkillCompactButton(state, 'criticalHit', '◇')}
          ${manaSkillCompactButton(state, 'criticalEffect', '✦')}
        </div>
      </section>
    `;
  }

  return manaSkillShop(state, shouldAnimate);
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

function manaPanel(state: GameState): string {
  const crystalRevealClass = manaCrystalRevealClass(state);
  const crystalGemIndex = manaCrystalDisplayGemIndex(state);
  return `
    <div class="mana-panel">
      <div class="mana-crystal-arena">
        <div class="mana-counter-box" aria-label="Mana actuelle">
          <strong data-dynamic-value="mana-panel-total">${compactHudNumber(state.mana)}</strong>
          <span>per second: <b data-dynamic-value="mana-panel-rate">${formatManaPerSecond(manaPerSecond(state))}</b></span>
        </div>
        <div
          class="mana-xp-bar"
          tabindex="0"
          title="${manaXpHoverTitle(state)}"
          aria-label="${manaXpHoverAriaLabel(state)}"
          style="--mana-xp-progress:${manaXpProgress(state)}%"
        >
          <span class="mana-xp-badge">
            <strong data-dynamic-value="mana-xp-level">${manaXpLevel(state)}</strong>
            <span class="mana-discovered-gems" data-discovered-gems="${manaCrystalDiscoveredGemCount(state)}" title="${manaCrystalDiscoveredGemCount(state)} gemmes · x${formatOneDecimalGameNumber(manaCrystalResourceMultiplier(state))} ressources" aria-hidden="true">
              ${manaDiscoveredGemMarkup(state)}
            </span>
          </span>
          <span class="mana-xp-body">
            <span class="mana-xp-top">
              <strong><b data-dynamic-value="mana-xp-current">${manaXpCurrent(state)}</b> / <b data-dynamic-value="mana-xp-required">${manaXpRequired(state)}</b></strong>
            </span>
            <i class="mana-xp-track" data-dynamic-bar="mana-xp" style="--mana-xp-fill:${manaXpProgress(state)}%">
              <span></span>
            </i>
            <span class="mana-xp-effects">
              <span data-dynamic-value="mana-xp-resource-effect">${manaXpLevelEffectLabel(state, 'Resource')}</span>
              <span>/</span>
              <span data-dynamic-value="mana-xp-xp-effect">${manaXpLevelEffectLabel(state, 'XP')}</span>
              <span>/</span>
              <span data-dynamic-value="mana-xp-ally-effect">${manaXpLevelEffectLabel(state, 'Attack Ally')}</span>
            </span>
          </span>
        </div>
        <div class="mana-fall-layer" aria-hidden="true"></div>
        <div class="mana-xp-orb-layer">
          ${manaXpOrbMarkup(state)}
        </div>
        <div class="mana-auto-click-layer" aria-hidden="true">
          ${manaAutoClickHandMarkup(state)}
        </div>
        <div class="mana-companion-layer" aria-hidden="true">
          ${manaMeowKnightMarkup(state)}
          ${manaIdleCompanionMarkup(state)}
        </div>
        <button class="mana-orb ${crystalRevealClass}" data-action="chargeMana" data-book-id="mana" title="Concentrer la Mana" aria-label="Concentrer la Mana">
          <span class="mana-crystal-light"></span>
          <span class="mana-orb-aura"></span>
          <span class="mana-sprite" aria-hidden="true" style="--mana-crystal-gem-image:url('${manaCrystalGemImagePath(crystalGemIndex)}')"></span>
          ${manaCrystalCoverMarkup(state)}
        </button>
      </div>
      <div class="mana-skill-dock">
        ${manaSkillShop(state, false, { docked: true, showCompactButton: false })}
      </div>
    </div>
  `;
}

function manaCrystalRevealClass(state: GameState): string {
  return manaCrystalDisplayRemovedCoverCells(state) >= MANA_CRYSTAL_COVER_CELL_COUNT ? 'is-crystal-revealed' : 'is-crystal-hidden';
}

function manaAutoClickHandMarkup(state: GameState): string {
  const count = manaAutoClickerCount(state);
  if (count <= 0) {
    return '';
  }

  return Array.from({ length: count }, (_, index) => {
    const handIndex = index + 1;
    return `<span class="mana-auto-click-hand is-hand-${handIndex}" data-auto-click-hand="${index}" style="--auto-hand-delay:${index * 130}ms"></span>`;
  }).join('');
}

function manaMeowKnightMarkup(state: GameState): string {
  const level = state.manaSkills.meowKnight ?? 0;
  const damage = manaMeowKnightDamage(state);
  return `<span class="mana-companion-meow" data-level="${level}" title="Meow Knight niveau ${level} · ${formatGameNumber(damage, { forceDecimal: true })}/s"${level <= 0 ? ' hidden' : ''}></span>`;
}

interface ManaIdleCompanionVisual {
  skillId: ManaIdleCompanionSkillId;
  slug: string;
  label: string;
  frames: 7 | 8 | 10 | 15;
  width: number;
  height: number;
  className: string;
  instances: Array<{
    x: number;
    y: number;
    width: number;
    rotation?: number;
    flip?: -1 | 1;
  }>;
}

const MANA_IDLE_COMPANION_VISUALS: ManaIdleCompanionVisual[] = [
  {
    skillId: 'idleBow',
    slug: 'bow',
    label: 'Bow',
    frames: 7,
    width: 48,
    height: 48,
    className: 'is-bow',
    instances: [
      { x: 22, y: 68, width: 58, rotation: -34 },
    ],
  },
  {
    skillId: 'idleGlock',
    slug: 'glock',
    label: 'Glock',
    frames: 7,
    width: 64,
    height: 48,
    className: 'is-glock',
    instances: [
      { x: 79, y: 32, width: 72, rotation: -18, flip: -1 },
    ],
  },
  {
    skillId: 'idlePickaxe',
    slug: 'pickaxe',
    label: 'Pickaxe',
    frames: 7,
    width: 32,
    height: 32,
    className: 'is-pickaxe',
    instances: [
      { x: 18, y: 49.17, width: 54, rotation: 0 },
    ],
  },
  {
    skillId: 'idleBazooka',
    slug: 'bazooka',
    label: 'Bazooka',
    frames: 7,
    width: 192,
    height: 32,
    className: 'is-bazooka',
    instances: [
      { x: 81.5, y: 69, width: 138, rotation: 28, flip: -1 },
    ],
  },
  {
    skillId: 'idleAk47',
    slug: 'ak47',
    label: 'AK47',
    frames: 7,
    width: 96,
    height: 48,
    className: 'is-ak47',
    instances: [
      { x: 81, y: 51.17, width: 104, rotation: 0, flip: -1 },
    ],
  },
  {
    skillId: 'idleSword',
    slug: 'sword',
    label: 'Sword',
    frames: 8,
    width: 25,
    height: 38,
    className: 'is-sword',
    instances: [
      { x: 33, y: 30, width: 43, rotation: 0 },
    ],
  },
  {
    skillId: 'idleOrangeCat',
    slug: 'orange-cat',
    label: 'Ultimate Orange Cat',
    frames: 15,
    width: 46,
    height: 32,
    className: 'is-orange-cat',
    instances: [{ x: 55.33, y: 87.83, width: 88, rotation: 0, flip: -1 }],
  },
];

function manaIdleCompanionMarkup(state: GameState): string {
  return MANA_IDLE_COMPANION_VISUALS.flatMap((visual) => {
    const level = state.manaSkills[visual.skillId] ?? 0;
    const damage = manaIdleCompanionDamage(state, visual.skillId);
    const title = `${visual.label} niveau ${level} · ${formatGameNumber(damage, { forceDecimal: true })}/s`;
    return visual.instances.map(
      (instance, index) =>
        `<span class="mana-idle-companion ${visual.className} is-frames-${visual.frames}" data-idle-companion-id="${visual.skillId}" data-idle-companion-instance="${index}" data-level="${level}" title="${title}" style="--idle-companion-x:${instance.x}%; --idle-companion-y:${instance.y}%; --idle-companion-width:${instance.width}px; --idle-companion-aspect:${visual.width} / ${visual.height}; --idle-companion-bg-size:${visual.frames * 100}% 100%; --idle-companion-rotate:${instance.rotation ?? 0}deg; --idle-companion-flip:${instance.flip ?? 1}; --idle-companion-image:url('/assets/Crystal/idle-companions/${visual.slug}.png');"${level <= 0 ? ' hidden' : ''}></span>`,
    );
  }).join('');
}

function manaCrystalGemImagePath(index: number): string {
  const safeIndex = Math.max(0, Math.min(MANA_CRYSTAL_GEM_IMAGES.length - 1, Math.floor(index)));
  return MANA_CRYSTAL_GEM_IMAGES[safeIndex];
}

function manaCrystalDisplayGemIndex(state: GameState): number {
  if (manaCrystalRevealHold) {
    return manaCrystalRevealHold.gemIndex;
  }
  return manaCrystalCurrentGemIndex(state);
}

function manaCrystalDisplayRevealProgress(state: GameState): number {
  return manaCrystalRevealHold ? 1 : manaCrystalRevealProgress(state);
}

function manaCrystalDisplayRemovedCoverCells(state: GameState): number {
  return Math.min(MANA_CRYSTAL_COVER_CELL_COUNT, Math.floor(manaCrystalDisplayRevealProgress(state) * MANA_CRYSTAL_COVER_CELL_COUNT));
}

function holdManaCrystalNextGemDisplay(gemIndex: number): number {
  manaCrystalRevealHoldToken += 1;
  manaCrystalRevealHold = {
    token: manaCrystalRevealHoldToken,
    gemIndex: Math.max(0, Math.min(MANA_CRYSTAL_GEM_IMAGES.length - 1, gemIndex)),
  };
  return manaCrystalRevealHoldToken;
}

function releaseManaCrystalNextGemDisplay(token: number): void {
  if (!manaCrystalRevealHold || manaCrystalRevealHold.token !== token) {
    return;
  }

  manaCrystalRevealHold = null;
  syncManaCrystalCover(gameStore.snapshot);
}

function manaDiscoveredGemMarkup(state: GameState): string {
  const discoveredCount = manaCrystalDiscoveredGemCount(state);
  return MANA_CRYSTAL_GEM_IMAGES.slice(0, discoveredCount)
    .map(
      (imagePath, index) =>
        `<i class="mana-discovered-gem" data-mana-gem-index="${index}" style="--mana-gem-index:${index}; --mana-gem-angle:${-90 + index * 36}deg; --mana-gem-image:url('${imagePath}')" title="Gemme ${String.fromCharCode(65 + index)}"></i>`,
    )
    .join('');
}

function manaCrystalCoverMarkup(state: GameState): string {
  const removedCells = manaCrystalDisplayRemovedCoverCells(state);
  const progress = manaCrystalDisplayRevealProgress(state);
  return `
    <span class="mana-crystal-cover" aria-hidden="true" data-removed-cells="${removedCells}" style="--mana-cover-reveal:${progress.toFixed(4)};">
      ${manaCrystalCoverCells(removedCells)}
    </span>
  `;
}

function manaCrystalCoverCells(removedCells: number): string {
  return Array.from({ length: MANA_CRYSTAL_COVER_CELL_COUNT }, (_, index) => {
    const x = index % MANA_CRYSTAL_COVER_GRID_SIZE;
    const y = Math.floor(index / MANA_CRYSTAL_COVER_GRID_SIZE);
    const rank = manaCrystalCoverCellRank(x, y);
    const positionX = MANA_CRYSTAL_COVER_GRID_SIZE <= 1 ? 0 : (x / (MANA_CRYSTAL_COVER_GRID_SIZE - 1)) * 100;
    const positionY = MANA_CRYSTAL_COVER_GRID_SIZE <= 1 ? 0 : (y / (MANA_CRYSTAL_COVER_GRID_SIZE - 1)) * 100;
    return `<i class="${rank < removedCells ? 'is-removed' : ''}" data-cover-rank="${rank}" style="--cover-x:${positionX.toFixed(4)}%; --cover-y:${positionY.toFixed(4)}%;"></i>`;
  }).join('');
}

function manaCrystalCoverCellRank(x: number, y: number): number {
  return MANA_CRYSTAL_COVER_CELL_RANKS[y * MANA_CRYSTAL_COVER_GRID_SIZE + x] ?? 0;
}

function createManaCrystalCoverCellRanks(): number[] {
  const cells = Array.from({ length: MANA_CRYSTAL_COVER_CELL_COUNT }, (_, index) => {
    const x = index % MANA_CRYSTAL_COVER_GRID_SIZE;
    const y = Math.floor(index / MANA_CRYSTAL_COVER_GRID_SIZE);
    return { index, score: manaCrystalCoverCellScore(x, y) };
  }).sort((left, right) => left.score - right.score);
  const ranks = Array.from({ length: MANA_CRYSTAL_COVER_CELL_COUNT }, () => 0);
  cells.forEach((cell, rank) => {
    ranks[cell.index] = rank;
  });
  return ranks;
}

function manaCrystalCoverCellScore(x: number, y: number): number {
  const hash = (x * 73 + y * 151 + x * y * 37 + ((x ^ y) * 19)) % MANA_CRYSTAL_COVER_CELL_COUNT;
  const center = (MANA_CRYSTAL_COVER_GRID_SIZE - 1) / 2;
  const distance = Math.hypot(x - center, y - center);
  const maxDistance = Math.hypot(center, center);
  const centerBias = (distance / maxDistance) * 80;
  return hash + centerBias;
}

function syncManaCrystalCover(state: GameState): void {
  const cover = rootElement?.querySelector<HTMLElement>('.mana-crystal-cover');
  const orb = cover?.closest<HTMLElement>('.mana-orb');
  const sprite = orb?.querySelector<HTMLElement>('.mana-sprite');
  if (!cover) {
    return;
  }

  const removedCells = manaCrystalDisplayRemovedCoverCells(state);
  const isRevealed = removedCells >= MANA_CRYSTAL_COVER_CELL_COUNT;
  orb?.classList.toggle('is-crystal-revealed', isRevealed);
  orb?.classList.toggle('is-crystal-hidden', !isRevealed);
  if (sprite) {
    setStylePropertyIfChanged(sprite, '--mana-crystal-gem-image', `url('${manaCrystalGemImagePath(manaCrystalDisplayGemIndex(state))}')`);
  }
  if (cover.dataset.removedCells === String(removedCells)) {
    return;
  }

  cover.dataset.removedCells = String(removedCells);
  cover.style.setProperty('--mana-cover-reveal', manaCrystalRevealProgress(state).toFixed(4));
  cover.querySelectorAll<HTMLElement>('[data-cover-rank]').forEach((cell) => {
    const rank = Number(cell.dataset.coverRank ?? 0);
    cell.classList.toggle('is-removed', rank < removedCells);
  });
}

function syncManaDiscoveredGems(state: GameState): void {
  const gemRing = rootElement?.querySelector<HTMLElement>('.mana-discovered-gems');
  if (!gemRing) {
    return;
  }

  const discoveredCount = manaCrystalDiscoveredGemCount(state);
  const previousCount = Number(gemRing.dataset.discoveredGems ?? discoveredCount);
  gemRing.title = `${discoveredCount} gemmes · x${formatOneDecimalGameNumber(manaCrystalResourceMultiplier(state))} ressources`;
  if (gemRing.dataset.discoveredGems === String(discoveredCount)) {
    return;
  }
  gemRing.dataset.discoveredGems = String(discoveredCount);
  setInnerHTMLIfChanged(gemRing, manaDiscoveredGemMarkup(state));
  if (Number.isFinite(previousCount) && previousCount < discoveredCount) {
    const revealHoldToken = holdManaCrystalNextGemDisplay(Math.max(0, previousCount));
    for (let index = Math.max(0, previousCount); index < discoveredCount; index += 1) {
      animateManaGemReceive(
        MANA_CRYSTAL_GEM_IMAGES[index] ?? MANA_CRYSTAL_GEM_IMAGES[0],
        index,
        (index - previousCount) * 140,
        revealHoldToken,
        index === discoveredCount - 1,
      );
    }
  }
}

function animateManaGemReceive(
  imagePath: string,
  gemIndex: number,
  delayMs = 0,
  revealHoldToken?: number,
  releaseRevealHoldOnFinish = false,
): void {
  const arena = rootElement?.querySelector<HTMLElement>('.mana-crystal-arena');
  const source = rootElement?.querySelector<HTMLElement>('.mana-orb .mana-sprite') ?? rootElement?.querySelector<HTMLElement>('.mana-orb');
  const target = rootElement?.querySelector<HTMLElement>(`.mana-discovered-gem[data-mana-gem-index="${gemIndex}"]`);
  const badge = rootElement?.querySelector<HTMLElement>('.mana-xp-badge');
  if (!arena || !source || !target || !badge) {
    target?.classList.remove('is-pending-dock');
    if (releaseRevealHoldOnFinish && revealHoldToken !== undefined) {
      releaseManaCrystalNextGemDisplay(revealHoldToken);
    }
    return;
  }

  let revealHoldFallback: number | null = null;
  const releaseRevealHold = () => {
    if (!releaseRevealHoldOnFinish || revealHoldToken === undefined) {
      return;
    }
    if (revealHoldFallback !== null) {
      window.clearTimeout(revealHoldFallback);
      revealHoldFallback = null;
    }
    releaseManaCrystalNextGemDisplay(revealHoldToken);
  };
  if (releaseRevealHoldOnFinish && revealHoldToken !== undefined) {
    revealHoldFallback = window.setTimeout(releaseRevealHold, delayMs + 3600);
  }

  target.classList.add('is-pending-dock');
  window.setTimeout(async () => {
    const arenaRect = arena.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const startX = sourceRect.left - arenaRect.left + sourceRect.width / 2;
    const startY = sourceRect.top - arenaRect.top + sourceRect.height / 2;
    const targetX = targetRect.left - arenaRect.left + targetRect.width / 2;
    const targetY = targetRect.top - arenaRect.top + targetRect.height / 2;
    const flySize = 72;
    const flight = document.createElement('img');
    flight.className = 'mana-gem-flight';
    flight.src = imagePath;
    flight.alt = '';
    flight.style.width = `${flySize}px`;
    flight.style.height = `${flySize}px`;
    arena.appendChild(flight);
    const place = (x: number, y: number, scale: number, rotation: number) =>
      `translate(${x - flySize / 2}px, ${y - flySize / 2}px) scale(${scale}) rotate(${rotation}deg)`;
    flight.style.opacity = '0';
    flight.style.transform = place(startX, startY, 0.55, -18);
    spawnManaGemPulse(arena, startX, startY, flySize + 14);
    spawnManaGemSparks(arena, startX, startY, 10);

    source.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.18) rotate(4deg)', offset: 0.55 },
        { transform: 'scale(1)' },
      ],
      { duration: 420, easing: 'cubic-bezier(.2,.8,.3,1.2)' },
    );

    await waitForManaGemAnimation(
      flight.animate(
        [
          { opacity: 0, transform: place(startX, startY, 0.55, -18) },
          { opacity: 1, transform: place(startX, startY, 1.18, 6) },
        ],
        {
          duration: 260,
          easing: 'cubic-bezier(.2,.8,.3,1.16)',
          fill: 'forwards',
        },
      ),
    );
    const showcase = await animateManaGemShowcase(arena, flight, startX, startY, flySize, place);
    const controlX = (showcase.x + targetX) / 2 - 70;
    const controlY = (showcase.y + targetY) / 2 - 90;
    const endScale = 16 / flySize;
    const animation = flight.animate(
      [
        { opacity: 1, transform: place(showcase.x, showcase.y, showcase.scale, 0) },
        { opacity: 1, transform: place(controlX, controlY, 0.82, 210), offset: 0.66 },
        { opacity: 1, transform: place(targetX, targetY, endScale, 360) },
      ],
      {
        duration: 720,
        easing: 'cubic-bezier(.2,.72,.25,1)',
        fill: 'both',
      },
    );

    animation.onfinish = () => {
      flight.remove();
      target.classList.remove('is-pending-dock');
      restartOneShotClass(target, 'is-docking');
      restartOneShotClass(badge, 'is-gem-docking');
      spawnManaGemPulse(arena, targetX, targetY, 24);
      spawnManaGemSparks(arena, targetX, targetY, 6);
      releaseRevealHold();
    };
  }, delayMs);
}

function waitForManaGemAnimation(animation: Animation): Promise<void> {
  return animation.finished.then(
    () => undefined,
    () => undefined,
  );
}

function waitForManaGemDelay(durationMs: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, durationMs));
}

async function animateManaGemShowcase(
  arena: HTMLElement,
  flight: HTMLImageElement,
  startX: number,
  startY: number,
  flySize: number,
  place: (x: number, y: number, scale: number, rotation: number) => string,
): Promise<{ x: number; y: number; scale: number }> {
  const arenaRect = arena.getBoundingClientRect();
  const centerX = arenaRect.width / 2;
  const centerY = arenaRect.height * 0.44;
  const showcaseScale = 2.4;
  const raysSize = flySize * showcaseScale * 3.4;
  const dim = document.createElement('span');
  const rays = document.createElement('span');
  dim.className = 'mana-gem-showcase-dim';
  rays.className = 'mana-gem-showcase-rays';
  rays.style.left = `${centerX - raysSize / 2}px`;
  rays.style.top = `${centerY - raysSize / 2}px`;
  rays.style.width = `${raysSize}px`;
  rays.style.height = `${raysSize}px`;
  arena.append(dim, rays);
  flight.classList.add('is-showcasing');

  const dimIn = dim.animate([{ opacity: 0 }, { opacity: 0.62 }], { duration: 420, fill: 'forwards', easing: 'ease-out' });
  const raysIn = rays.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 520, fill: 'forwards', easing: 'ease-out' });
  const zoom = flight.animate(
    [
      { opacity: 1, transform: place(startX, startY, 1.18, 6) },
      { opacity: 1, transform: place(centerX, centerY, showcaseScale, 0) },
    ],
    {
      duration: 560,
      easing: 'cubic-bezier(.2,.8,.3,1.12)',
      fill: 'forwards',
    },
  );
  await Promise.all([waitForManaGemAnimation(dimIn), waitForManaGemAnimation(raysIn), waitForManaGemAnimation(zoom)]);
  spawnManaGemPulse(arena, centerX, centerY, flySize * showcaseScale + 20);
  spawnManaGemSparks(arena, centerX, centerY, 14);
  await waitForManaGemDelay(820);
  const dimOut = dim.animate([{ opacity: 0.62 }, { opacity: 0 }], { duration: 320, fill: 'forwards', easing: 'ease-in' });
  const raysOut = rays.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards', easing: 'ease-in' });
  await Promise.all([waitForManaGemAnimation(dimOut), waitForManaGemAnimation(raysOut)]);
  dim.remove();
  rays.remove();
  flight.classList.remove('is-showcasing');
  return { x: centerX, y: centerY, scale: showcaseScale };
}

function spawnManaGemPulse(arena: HTMLElement, x: number, y: number, size: number): void {
  const pulse = document.createElement('span');
  pulse.className = 'mana-gem-pulse';
  pulse.style.left = `${x - size / 2}px`;
  pulse.style.top = `${y - size / 2}px`;
  pulse.style.width = `${size}px`;
  pulse.style.height = `${size}px`;
  arena.appendChild(pulse);
  pulse.animate(
    [
      { opacity: 0.9, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(2.6)' },
    ],
    { duration: 520, easing: 'ease-out' },
  ).onfinish = () => pulse.remove();
}

function spawnManaGemSparks(arena: HTMLElement, x: number, y: number, count: number): void {
  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement('span');
    spark.className = 'mana-gem-spark';
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.background = index % 2 === 0 ? '#ffe08a' : '#ffffff';
    arena.appendChild(spark);
    const angle = Math.random() * Math.PI * 2;
    const distance = 24 + Math.random() * 26;
    spark.animate(
      [
        { opacity: 1, transform: 'translate(0, 0) scale(1)' },
        { opacity: 0, transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)` },
      ],
      { duration: 520 + Math.random() * 200, easing: 'cubic-bezier(.2,.7,.3,1)' },
    ).onfinish = () => spark.remove();
  }
}

function syncManaAutoClickHands(state: GameState): void {
  const hands = rootElement?.querySelectorAll<HTMLElement>('[data-auto-click-hand]');
  const clickCount = state.manaSkills.lastAutoClickCount ?? 0;
  if (!hands || hands.length === 0) {
    lastManaAutoClickCount = clickCount;
    return;
  }

  if (clickCount === lastManaAutoClickCount) {
    return;
  }

  const previousClickCount = lastManaAutoClickCount;
  lastManaAutoClickCount = clickCount;
  const pulseCount = Math.min(Math.max(1, clickCount - previousClickCount), hands.length);
  for (let offset = 0; offset < pulseCount; offset += 1) {
    const hand = hands[(previousClickCount + offset) % hands.length];
    if (hand) {
      window.setTimeout(() => restartOneShotClass(hand, 'is-clicking'), offset * 55);
    }
  }
}

function syncManaMeowKnight(state: GameState): void {
  const meow = rootElement?.querySelector<HTMLElement>('.mana-companion-meow');
  if (!meow) {
    lastManaMeowKnightAttackCount = state.manaSkills.lastMeowKnightAttackCount ?? 0;
    return;
  }

  const level = state.manaSkills.meowKnight ?? 0;
  const attackCount = state.manaSkills.lastMeowKnightAttackCount ?? 0;
  meow.hidden = level <= 0;
  meow.dataset.level = String(level);
  meow.title = `Meow Knight niveau ${level} · ${formatGameNumber(manaMeowKnightDamage(state), { forceDecimal: true })}/s`;
  if (attackCount === lastManaMeowKnightAttackCount) {
    return;
  }

  const previousAttackCount = lastManaMeowKnightAttackCount;
  lastManaMeowKnightAttackCount = attackCount;
  restartOneShotClass(meow, 'is-attacking');
  showManaLocalFloatingGain(manaMeowKnightDamage(state) * Math.max(1, attackCount - previousAttackCount), meow, 'is-idle-ally');
}

function syncManaIdleCompanions(state: GameState): void {
  const elements = rootElement?.querySelectorAll<HTMLElement>('[data-idle-companion-id]');
  if (!elements || elements.length === 0) {
    lastManaIdleCompanionAttackCounts = { ...state.manaSkills.idleCompanionAttackCounts };
    return;
  }

  const elementsBySkill = new Map<ManaIdleCompanionSkillId, HTMLElement[]>();
  elements.forEach((element) => {
    const skillId = element.dataset.idleCompanionId;
    if (!isManaSkillId(skillId) || !MANA_IDLE_COMPANION_SKILL_IDS.includes(skillId as ManaIdleCompanionSkillId)) {
      return;
    }
    const companionId = skillId as ManaIdleCompanionSkillId;
    elementsBySkill.set(companionId, [...(elementsBySkill.get(companionId) ?? []), element]);
  });

  for (const visual of MANA_IDLE_COMPANION_VISUALS) {
    const level = state.manaSkills[visual.skillId] ?? 0;
    const attackCount = state.manaSkills.idleCompanionAttackCounts[visual.skillId] ?? 0;
    const title = `${visual.label} niveau ${level} · ${formatGameNumber(manaIdleCompanionDamage(state, visual.skillId), { forceDecimal: true })}/s`;
    const matchingElements = elementsBySkill.get(visual.skillId) ?? [];

    for (const element of matchingElements) {
      element.hidden = level <= 0;
      element.dataset.level = String(level);
      element.title = title;
    }

    if (attackCount === (lastManaIdleCompanionAttackCounts[visual.skillId] ?? 0)) {
      continue;
    }

    const previousAttackCount = lastManaIdleCompanionAttackCounts[visual.skillId] ?? 0;
    lastManaIdleCompanionAttackCounts[visual.skillId] = attackCount;
    for (const element of matchingElements) {
      restartOneShotClass(element, 'is-attacking');
    }
    const popupTarget = matchingElements[(attackCount - 1) % Math.max(1, matchingElements.length)];
    if (popupTarget) {
      showManaLocalFloatingGain(manaIdleCompanionDamage(state, visual.skillId) * Math.max(1, attackCount - previousAttackCount), popupTarget, 'is-idle-ally');
    }
  }
}

function manaXpProgress(state: GameState): number {
  if (manaXpLevel(state) >= MANA_CRYSTAL_MAX_LEVEL) {
    return 100;
  }
  return Math.max(0, Math.min(100, Number(((manaXpCurrent(state) / manaXpRequired(state)) * 100).toFixed(2))));
}

function manaXpLevel(state: GameState): number {
  return manaCrystalLevel(state);
}

function manaXpCurrent(state: GameState): number {
  if (manaXpLevel(state) >= MANA_CRYSTAL_MAX_LEVEL) {
    return manaXpRequired(state);
  }
  return Math.floor(Math.max(0, state.manaCrystal.xp) % manaXpRequired(state));
}

function manaXpRequired(_state: GameState): number {
  return MANA_XP_PER_LEVEL;
}

function manaXpLevelBonusPercent(state: GameState): number {
  return manaXpLevel(state) * 5;
}

function manaXpLevelEffectLabel(state: GameState, label: string): string {
  return `+${formatGameNumber(manaXpLevelBonusPercent(state))}% ${label}`;
}

function manaXpHoverTitle(state: GameState): string {
  return `Niveau ${manaXpLevel(state)} · XP ${manaXpCurrent(state)} / ${manaXpRequired(state)} · ${manaXpLevelEffectLabel(state, 'Resource')} · ${manaXpLevelEffectLabel(state, 'XP')} · ${manaXpLevelEffectLabel(state, 'Attack Ally')}`;
}

function manaXpHoverAriaLabel(state: GameState): string {
  return `Niveau ${manaXpLevel(state)}, XP ${manaXpCurrent(state)} / ${manaXpRequired(state)}, ${manaXpLevelEffectLabel(state, 'Resource')}, ${manaXpLevelEffectLabel(state, 'XP')}, ${manaXpLevelEffectLabel(state, 'Attack Ally')}`;
}

function updateManaXpHud(state: GameState): void {
  const xp = Math.floor(Math.max(0, state.manaCrystal.xp));
  const bar = rootElement?.querySelector<HTMLElement>('[data-dynamic-bar="mana-xp"]');
  const hud = bar?.closest<HTMLElement>('.mana-xp-bar') ?? null;
  const xpProgress = manaXpProgress(state);
  setDynamicText('mana-xp-level', manaXpLevel(state));
  setDynamicText('mana-xp-current', manaXpCurrent(state));
  setDynamicText('mana-xp-required', manaXpRequired(state));
  setDynamicText('mana-xp-resource-effect', manaXpLevelEffectLabel(state, 'Resource'));
  setDynamicText('mana-xp-xp-effect', manaXpLevelEffectLabel(state, 'XP'));
  setDynamicText('mana-xp-ally-effect', manaXpLevelEffectLabel(state, 'Attack Ally'));
  if (hud) {
    setStylePropertyIfChanged(hud, '--mana-xp-progress', `${xpProgress}%`);
    setAttributeIfChanged(hud, 'title', manaXpHoverTitle(state));
    setAttributeIfChanged(hud, 'aria-label', manaXpHoverAriaLabel(state));
  }
  if (!bar) {
    lastManaDisplayedXp = xp;
    return;
  }

  setStylePropertyIfChanged(bar, '--mana-xp-fill', `${xpProgress}%`);
  if (hud && manaXpLevel(state) < MANA_CRYSTAL_MAX_LEVEL && lastManaDisplayedXp !== null && xp > lastManaDisplayedXp) {
    restartOneShotClass(hud, 'is-xp-gaining');
  }
  lastManaDisplayedXp = xp;
}

function manaXpOrbMarkup(state: GameState): string {
  void state;
  return '';
}

function manaOrbRewardLabel(kind: ManaOrbKind, value: number): string {
  switch (kind) {
    case 'yellow':
      return `orbe jaune +${value} Mana`;
    case 'green':
      return `orbe verte +${value} XP`;
    case 'blue':
      return `orbe bleue +${value}`;
    case 'red':
    default:
      return `orbe rouge +${value} XP`;
  }
}

function syncManaXpOrb(state: GameState): void {
  const layer = rootElement?.querySelector<HTMLElement>('.mana-xp-orb-layer');
  if (!layer) {
    return;
  }

  const orb = state.manaCrystal.lastCollectedXpOrb;
  if (!orb || orb.id === lastManaCollectedXpOrbId) {
    return;
  }

  lastManaCollectedXpOrbId = orb.id;
  showManaXpOrbCollectEffect(orb, state.manaCrystal.lastXpGain);
}

function showManaXpOrbCollectEffect(orb: ManaXpOrb, xpGain: number): void {
  const layer = rootElement?.querySelector<HTMLElement>('.mana-xp-orb-layer');
  const badge = rootElement?.querySelector<HTMLElement>('.mana-xp-badge');
  if (!layer || !badge) {
    return;
  }

  const layerRect = layer.getBoundingClientRect();
  const badgeRect = badge.getBoundingClientRect();
  const startX = (layerRect.width * orb.x) / 100;
  const startY = (layerRect.height * orb.y) / 100;
  const targetX = badgeRect.left - layerRect.left + badgeRect.width * 0.5;
  const targetY = badgeRect.top - layerRect.top + badgeRect.height * 0.5;
  const dx = targetX - startX;
  const dy = targetY - startY;
  const element = document.createElement('span');
  element.className = `mana-xp-orb is-${orb.kind} is-auto-collect`;
  element.dataset.orbId = String(orb.id);
  element.style.setProperty('--mana-xp-orb-x', `${orb.x}%`);
  element.style.setProperty('--mana-xp-orb-y', `${orb.y}%`);
  element.setAttribute('aria-label', manaOrbRewardLabel(orb.kind, orb.value));
  element.appendChild(document.createElement('span')).textContent = formatGameNumber(orb.value);
  layer.appendChild(element);

  const motion = element.animate(
    [
      { opacity: 0, transform: 'translate(-50%, -50%) scale(0.72)' },
      { opacity: 1, transform: 'translate(-50%, -50%) scale(1.04)', offset: 0.16 },
      { opacity: 1, transform: `translate(calc(-50% + ${dx * 0.38}px), calc(-50% + ${dy * 0.28 - 24}px)) scale(0.94)`, offset: 0.58 },
      { opacity: 0, transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.42)` },
    ],
    {
      duration: 780,
      easing: 'cubic-bezier(0.18, 0.86, 0.24, 1)',
      fill: 'forwards',
    },
  );
  motion.addEventListener('finish', () => element.remove(), { once: true });

  if (xpGain > 0) {
    window.setTimeout(() => showManaLocalFloatingGain(xpGain, badge, 'is-xp'), 420);
  }
}

function manaPerSecond(state: GameState): number {
  let total = manaMeowKnightDamage(state);
  for (const skillId of MANA_IDLE_COMPANION_SKILL_IDS) {
    total += manaIdleCompanionDamage(state, skillId);
  }
  if (state.manaCrystal.holdClickActive && manaHoldClickUnlocked(state)) {
    total += manaExpectedCastGain(state) * 10;
  }
  return total;
}

function manaExpectedCastGain(state: GameState): number {
  const baseGain = manaClickGainPreview(state);
  const criticalChance = Math.min(50, state.manaSkills.criticalHit) / 100;
  return baseGain * (1 + criticalChance * (manaCriticalMultiplier(state) - 1));
}

function formatManaPerSecond(value: number): string {
  if (value <= 0) {
    return '0/s';
  }
  return `${formatGameNumber(value, { compact: true, forceDecimal: value < 100 })}/s`;
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

interface ManaClickPoint {
  clientX: number;
  clientY: number;
}

function showCrystalClickEffect(amount: number, origin?: ManaClickPoint): void {
  const manaOrb = rootElement?.querySelector<HTMLButtonElement>('.mana-orb');
  if (!manaOrb) {
    return;
  }
  const manaSprite = manaOrb.querySelector<HTMLElement>('.mana-sprite');
  const clickPoint = manaClickPoint(manaOrb, origin);
  const now = performance.now();
  manaClickTimestamps = manaClickTimestamps.filter((timestamp) => now - timestamp <= CRYSTAL_CLICK_SCALE_RESET_MS);
  manaClickTimestamps.push(now);
  const recentClickCount = manaClickTimestamps.filter((timestamp) => now - timestamp <= CRYSTAL_CLICK_RATE_WINDOW_MS).length;
  const fastClickBoost = Math.min(1, Math.max(0, (recentClickCount - 1) / (CRYSTAL_CLICK_RATE_FOR_MAX_SHAKE - 1)));
  const scaleProgress = Math.min(1, Math.max(0, (manaClickTimestamps.length - 1) / (CRYSTAL_CLICK_SCALE_CLICKS_FOR_MAX - 1)));
  const shakePower = 1 + fastClickBoost;
  const baseShake = 0.4;
  const hiddenCrystalScaleBoost = manaOrb.classList.contains('is-crystal-hidden') ? 0.25 : 1;
  const clickScale = 1 + scaleProgress * hiddenCrystalScaleBoost;
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

  showManaClickParticles(manaOrb, amount, clickPoint);

  const sparkCount = manaSparkCount(amount);
  const gain = normalizedManaGain(amount);
  const orbRect = manaOrb.getBoundingClientRect();
  const sparkOriginX = clickPoint.clientX - orbRect.left;
  const sparkOriginY = clickPoint.clientY - orbRect.top;
  const sparkPhase = Math.random() * 360;
  for (let index = 0; index < sparkCount; index += 1) {
    const shard = document.createElement('i');
    const sparkValue = manaParticleUnitValue(gain, sparkCount, index);
    const angle = sparkPhase + (index / sparkCount) * 360 + (Math.random() - 0.5) * 18;
    const distance = 30 + Math.min(74, Math.sqrt(gain) * 13) + (index % 4) * 7;
    const size = Math.min(24, 10 + Math.min(5, sparkValue) * 2.6 + (index % 3) * 2);
    shard.className = 'mana-spark';
    shard.dataset.gainValue = String(sparkValue);
    if (sparkValue >= 4) {
      shard.classList.add('is-critical');
    }
    shard.style.setProperty('--spark-origin-x', `${sparkOriginX}px`);
    shard.style.setProperty('--spark-origin-y', `${sparkOriginY}px`);
    shard.style.setProperty('--spark-x', `${Math.cos((angle * Math.PI) / 180) * distance}px`);
    shard.style.setProperty('--spark-y', `${Math.sin((angle * Math.PI) / 180) * distance}px`);
    shard.style.setProperty('--spark-size', `${size}px`);
    shard.style.setProperty('--spark-delay', `${(index % 5) * 18}ms`);
    manaOrb.appendChild(shard);
    shard.addEventListener('animationend', () => shard.remove(), { once: true });
  }
}

function manaClickPoint(manaOrb: HTMLElement, origin?: ManaClickPoint): ManaClickPoint {
  const rect = manaOrb.getBoundingClientRect();
  return {
    clientX: clamp(origin?.clientX ?? rect.left + rect.width * 0.5, rect.left, rect.right),
    clientY: clamp(origin?.clientY ?? rect.top + rect.height * 0.5, rect.top, rect.bottom),
  };
}

function normalizedManaGain(amount: number): number {
  return Math.max(1, Math.round(amount));
}

function manaParticleVisualCount(amount: number): number {
  return amount > 0 ? 1 : 0;
}

function manaParticleUnitValue(gain: number, particleCount: number, index: number): number {
  const baseValue = Math.floor(gain / particleCount);
  const remainder = gain % particleCount;
  return baseValue + (index < remainder ? 1 : 0);
}

function manaSparkCount(amount: number): number {
  return manaParticleVisualCount(amount);
}

function showManaClickParticles(manaOrb: HTMLElement, amount: number, origin: ManaClickPoint): void {
  const layer = rootElement?.querySelector<HTMLElement>('.mana-fall-layer');
  const counter = rootElement?.querySelector<HTMLElement>('.mana-counter-box');
  if (!layer || !counter) {
    return;
  }

  const layerRect = layer.getBoundingClientRect();
  const orbRect = manaOrb.getBoundingClientRect();
  const counterRect = counter.getBoundingClientRect();
  const startX = clamp(origin.clientX, orbRect.left, orbRect.right) - layerRect.left;
  const startY = clamp(origin.clientY, orbRect.top, orbRect.bottom) - layerRect.top;
  const endX = counterRect.left - layerRect.left + counterRect.width * 0.5 - startX;
  const endY = counterRect.top - layerRect.top + counterRect.height * 0.5 - startY;
  const gain = normalizedManaGain(amount);
  const particleCount = manaParticleVisualCount(gain);

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement('i');
    const unitValue = manaParticleUnitValue(gain, particleCount, index);
    const isCrystal = unitValue > 1 || index % 4 === 0;
    const burstAngle = Math.random() * Math.PI * 2;
    const burstDistance = Math.min(78, orbRect.width * 0.24) * (0.42 + Math.random() * 0.78);
    const spreadX = Math.cos(burstAngle) * burstDistance;
    const spreadY = Math.sin(burstAngle) * burstDistance;
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
    particle.style.setProperty('--particle-early-x', `${spreadX * 0.62}px`);
    particle.style.setProperty('--particle-early-y', `${spreadY * 0.62}px`);
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

function showManaLocalFloatingGain(amount: number, origin: ManaClickPoint | MouseEvent | HTMLElement, className?: string): void {
  if (amount <= 0) {
    return;
  }
  const layer = rootElement?.querySelector<HTMLElement>('.mana-fall-layer');
  if (!layer) {
    return;
  }

  const layerRect = layer.getBoundingClientRect();
  let clientX = layerRect.left + layerRect.width * 0.5;
  let clientY = layerRect.top + layerRect.height * 0.5;
  if (origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect();
    clientX = rect.left + rect.width * 0.5;
    clientY = rect.top + rect.height * 0.38;
  } else {
    clientX = origin.clientX;
    clientY = origin.clientY;
  }

  const pop = document.createElement('span');
  pop.className = className ? `floating-gain is-mana-local ${className}` : 'floating-gain is-mana-local';
  pop.textContent = `+${formatGameNumber(amount)}`;
  pop.style.left = `${clamp(clientX - layerRect.left, 12, layerRect.width - 12)}px`;
  pop.style.top = `${clamp(clientY - layerRect.top, 12, layerRect.height - 12)}px`;
  layer.appendChild(pop);
  pruneFloatingGains(layer);
  pop.addEventListener('animationend', () => pop.remove(), { once: true });
}

function showFloatingGain(amount: number, targetSelector = '.mana-orb', className?: string): void {
  const gain = Math.max(0.1, Math.round(amount * 10) / 10);
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
  pop.textContent = `+${formatGameNumber(amount)}`;
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
  return `
    <div class="snake-panel">
      <div class="snake-board-shell">
        ${snakeBoardShellContent(state)}
      </div>
      <div class="snake-skill-dock">
        ${snakeSkillShop(state, false, { docked: true, showCompactButton: false })}
      </div>
    </div>
  `;
}

function snakeBoardShellContent(state: GameState): string {
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
  const foodKey = snake.food ? cellKey(snake.food) : null;
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
    ${automationButton}
    <div class="snake-board has-snake-sprite" style="--snake-grid-size:${snake.gridSize}" role="img" aria-label="Mini jeu Snake du Livre du Serpent">
      <div class="snake-status-hud" aria-label="Etat du serpent">
        <span class="snake-hud-hearts" title="Vies" aria-label="Vies">${hearts}</span>
        <span class="snake-hud-resource" title="Ecailles">◆ <strong data-dynamic-value="snake-scales">${compactHudNumber(state.resources.scales)}</strong></span>
        <span class="snake-hud-multiplier" style="--snake-multiplier-hue:${snakeMultiplierHue(multiplier)}deg" title="Multiplicateur"><strong data-dynamic-value="snake-multiplier">x${multiplier.toFixed(1).replace('.', ',')}</strong></span>
      </div>
      <span class="snake-spriterrific-familiar" aria-hidden="true"></span>
      ${cells}
      ${snakeSegments}
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
  return `/assets/Snake%20dragon/crops/${tileName}-${frame}.png?v=snake-sprite2-heads-3`;
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
  const animateCardCascade = lastMiningSkillDockTab !== null && lastMiningSkillDockTab !== miningSkillShopTab;
  return `
    <div class="mining-panel">
      <div class="mining-playfield">
        ${miningPlayfield(state)}
      </div>
      <div class="mining-skill-dock">
        ${miningSkillShop(state, false, { docked: true, showCompactButton: false, animateCardCascade })}
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
          <span>● <strong data-dynamic-value="gels">${formatGameNumber(state.resources.gels)}</strong></span>
          <span>Lv <strong>${trainer.level}</strong></span>
          <span>HP <strong>${formatGameNumber(trainer.slimeHealth)}/${formatGameNumber(trainer.slimeMaxHealth)}</strong></span>
          <span>XP <strong>${formatGameNumber(trainer.xp)}/${formatGameNumber(xpToNext)}</strong></span>
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
    chips: state.resources.chips,
    stake: blackjackActiveStake(state),
    debt: blackjack.debt,
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
  const amountLabel = formatGameNumber(amount);
  return `
    <${tag} class="blackjack-chip-stack is-${variant}${resetClass}" ${resetAttributes} aria-label="${label}: ${amountLabel} jetons">
      <div class="blackjack-chip-stack-art" style="--chip-count: ${chips.length}">
        ${chips
          .map((denomination, index) => blackjackChipToken(denomination, index, canPrepareWager && amount >= denomination))
          .join('')}
      </div>
      <span>
        <small>${label}</small>
        <strong>${amountLabel}</strong>
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
    ? `Augmenter la mise de base a ${formatGameNumber(nextBet)}`
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
        <strong>${formatGameNumber(currentBet)}</strong>
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
      : `${label} bloque: ${formatGameNumber(bonus.xp)}/${formatGameNumber(cost)} XP`;
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
      ${bet > 0 ? `<span class="blackjack-hand-bet">Mise ${formatGameNumber(bet)}</span>` : ''}
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
          ? `<span class="blackjack-bonus-pill is-debt">Dette -${formatGameNumber(state.blackjack.lastDebtPayment)}</span>`
          : ''
      }
    </div>
  `;
}

function blackjackBonusStatusPill(state: GameState, bonusId: BlackjackSideBonusId): string {
  const bonus = blackjackBonusState(state, bonusId);
  const label = bonusId === 'pair' ? 'Pair' : '21+3';
  const reward = bonus.lastPayout > 0 ? ` +${formatGameNumber(bonus.lastPayout)}` : '';
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
          <strong>${formatGameNumber(hundred.total)}</strong>
          <small>cible ${formatGameNumber(100)}-${formatGameNumber(targetMax)}</small>
        </div>
        <div class="hundred-progress" aria-hidden="true" data-progress="${progress.toFixed(2)}" data-progress-marker="${progressMarker}"><i style="width:${initialProgress}%"></i></div>
        <div class="hundred-stats" aria-label="Etat du calcul">
          <span># <strong data-dynamic-value="fragments">${formatGameNumber(state.resources.fragments)}</strong></span>
          <span>✓ <strong>${formatGameNumber(hundred.wins)}</strong></span>
          <span>↟ <strong>${formatGameNumber(hundred.bestTotal)}</strong></span>
        </div>
        <div class="hundred-last" aria-live="polite">
          <strong>${hundredOutcomeLabel(hundred.lastOutcome)}</strong>
          <span>${hundred.lastOption ? `${hundred.lastOption} +${formatGameNumber(hundred.lastRoll)}` : 'Choisis un tirage'}</span>
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
      <span>${formatGameNumber(range.min)}-${formatGameNumber(range.max)}</span>
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
          <span>◎ <strong data-dynamic-value="marks">${formatGameNumber(state.resources.marks)}</strong></span>
          <span>▲ <strong>${formatGameNumber(targetAttackDamage(state.targetSkills.damage))}</strong></span>
          <span>↯ <strong>${formatGameNumber(targetSpawnInterval(state.targetSkills.spawnSpeed), { forceDecimal: true })}s</strong></span>
        </div>
        <div class="target-board" aria-label="Cibles actives">
          ${targets || '<i class="target-empty" aria-hidden="true"></i>'}
        </div>
        <div class="target-mini-stats" aria-label="Galerie">
          <span># <strong data-dynamic-value="target-score">${formatGameNumber(targetState.score)}</strong></span>
          <span>↟ <strong data-dynamic-value="target-best">${formatGameNumber(targetState.best)}</strong></span>
          <span>◎ <strong>${formatGameNumber(targetState.targets.length)}/${formatGameNumber(targetMaxActiveTargets(state.targetSkills.targetCount))}</strong></span>
          <span>⌁ <strong>${automationInterval > 0 ? `${formatGameNumber(automationInterval, { forceDecimal: true })}s` : 'Off'}</strong></span>
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
  const currentHealth = defense.towerHealth;
  const currentHealthDisplay = formatGameNumber(currentHealth);
  const maxHealthDisplay = formatGameNumber(maxHealth);
  const healthToneClass = defenseHealthToneClass(healthPercent);
  const experienceToNextLevel = defenseExperienceToNextLevel(defense.level);
  const experienceProgress =
    experienceToNextLevel > 0 ? Math.min(1, Math.max(0, defense.xp / experienceToNextLevel)) : 1;
  const experienceLabel =
    experienceToNextLevel > 0
      ? `${formatOneDecimalGameNumber(defense.xp)} / ${formatOneDecimalGameNumber(experienceToNextLevel)}`
      : 'MAX';
  const experienceEffectLabel = defenseLevelEffectLabel(state);
  const defensePanelClasses = ['defense-panel', defense.paused ? 'is-paused' : '', defense.deathTimer > 0 ? 'is-defeated' : '']
    .filter(Boolean)
    .join(' ');

  return `
    <div class="${defensePanelClasses}" style="--defense-time-scale:${defenseTimeScale(defenseEffectiveSpeedMultiplier(state))}">
      <div class="defense-arena ${hasTiledTerrain ? 'has-tiled-map' : ''}" style="--defense-shot:${defense.shotPulse % 2}" role="img" aria-label="Mini jeu Bastion Arcanique">
        <div class="defense-terrain ${hasTiledTerrain ? 'is-tiled' : 'is-fallback'}" aria-hidden="true">
          ${renderDefenseTiledTerrain()}
        </div>
        <span
          class="defense-hud-xp"
          tabindex="0"
          title="Niveau ${defense.level} · XP ${experienceLabel} · ${experienceEffectLabel}"
          aria-label="Niveau ${defense.level}, XP ${experienceLabel}, ${experienceEffectLabel}"
          style="--defense-xp-progress:${(experienceProgress * 100).toFixed(2)}%"
        >
          <span class="defense-level-glow" aria-hidden="true"></span>
          <span class="defense-xp-badge">
            <strong data-dynamic-value="defense-level">${defense.level}</strong>
            <span class="defense-gold-boost-orbit" aria-hidden="true">${defenseGoldBoostOrbsMarkup(state)}</span>
          </span>
          <span class="defense-gold-boost-label" aria-hidden="true">Gold x${formatGameNumber(defenseWaveGoldMultiplier(state))}</span>
          <span class="defense-xp-body">
            <span class="defense-xp-top">
              <span>NIVEAU</span>
              <strong data-dynamic-value="defense-xp">${experienceLabel}</strong>
            </span>
            <span class="defense-xp-effect" data-dynamic-value="defense-level-effect">${experienceEffectLabel}</span>
          </span>
        </span>
        <div class="defense-range" style="--defense-range-scale:${rangeScale.toFixed(3)}" aria-hidden="true"></div>
        ${defenseIceActive(state) ? defenseIceAuraMarkup(state) : ''}
        <div class="defense-status-hud" aria-label="Etat du bastion">
          <span
            class="defense-hud-health ${healthToneClass}"
            title="HP ${currentHealthDisplay}/${maxHealthDisplay}"
            aria-label="HP ${currentHealthDisplay}/${maxHealthDisplay}"
            style="--defense-health-progress:${healthPercent.toFixed(2)}%;--defense-health-value:${healthPercent.toFixed(2)}"
          >
            <span class="defense-health-track" aria-hidden="true"><em data-defense-health-chip></em><i data-defense-health-fill></i></span>
            <strong class="defense-hp-value" data-dynamic-value="defense-health-value">${currentHealthDisplay}/${maxHealthDisplay}</strong>
          </span>
          <span class="defense-hud-money" title="Sceaux">◆ <strong data-dynamic-value="defense-money">${compactHudNumber(defenseDisplayedSigils(state))}</strong></span>
        </div>
        ${defenseWaveChooser(defense.wave)}
        ${defenseWaveRail(state)}
        <div class="defense-lanes" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
	        <i class="defense-orb" aria-hidden="true"></i>
	        <div class="defense-actors" aria-hidden="true">
	          ${defenseActorsMarkup(defense)}
	        </div>
	        <canvas class="defense-effects-canvas" aria-hidden="true"></canvas>
	        ${hasTiledTerrain ? `<div class="defense-foreground" aria-hidden="true">${renderDefenseTiledForeground()}</div>` : ''}
        ${
          hasTiledTerrain
            ? ''
            : `<div class="defense-tower" aria-hidden="true">
                <span></span>
              </div>`
        }
        <button class="defense-speed-toggle ${defense.paused ? 'is-paused' : ''}" data-action="cycleDefenseSpeed" data-book-id="defense" title="Vitesse du jeu TD" aria-label="Changer la vitesse du tower defense">x${formatGameNumber(defenseEffectiveSpeedMultiplier(state), { forceDecimal: true })}</button>
        <button class="defense-base-speed-toggle ${defense.baseSpeedEnabled ? 'is-active' : ''}" data-action="toggleDefenseBaseSpeed" data-book-id="defense" title="Boost vitesse de base" aria-label="Activer ou désactiver le boost de vitesse de base">${defense.baseSpeedEnabled ? 'ON' : 'OFF'}</button>
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
    <span class="defense-ice-aura" style="--defense-ice-range-scale:${rangeScale}" aria-hidden="true">
      <span class="defense-ice-bloom"></span>
      <span class="defense-ice-body"></span>
      <svg class="defense-ice-veins" viewBox="0 0 250 250">
        <g stroke="rgba(220,245,255,.16)" stroke-width="1" fill="none">
          <line x1="125" y1="42" x2="125" y2="108" />
          <line x1="125" y1="42" x2="125" y2="108" transform="rotate(45 125 125)" />
          <line x1="125" y1="42" x2="125" y2="108" transform="rotate(90 125 125)" />
          <line x1="125" y1="42" x2="125" y2="108" transform="rotate(135 125 125)" />
          <line x1="125" y1="42" x2="125" y2="108" transform="rotate(180 125 125)" />
          <line x1="125" y1="42" x2="125" y2="108" transform="rotate(225 125 125)" />
          <line x1="125" y1="42" x2="125" y2="108" transform="rotate(270 125 125)" />
          <line x1="125" y1="42" x2="125" y2="108" transform="rotate(315 125 125)" />
          <line x1="125" y1="55" x2="125" y2="95" transform="rotate(22 125 125)" />
          <line x1="125" y1="55" x2="125" y2="95" transform="rotate(112 125 125)" />
          <line x1="125" y1="55" x2="125" y2="95" transform="rotate(202 125 125)" />
          <line x1="125" y1="55" x2="125" y2="95" transform="rotate(292 125 125)" />
        </g>
      </svg>
      <span class="defense-ice-sweep defense-ice-sweep-1"></span>
      <span class="defense-ice-sweep defense-ice-sweep-2"></span>
      <svg class="defense-ice-ring defense-ice-ring-1" viewBox="0 0 250 250"><circle cx="125" cy="125" r="118" fill="none" stroke="rgba(215,245,255,.5)" stroke-width="2" stroke-dasharray="2 11" stroke-linecap="round" /></svg>
      <svg class="defense-ice-ring defense-ice-ring-2" viewBox="0 0 250 250"><circle cx="125" cy="125" r="110" fill="none" stroke="rgba(180,230,255,.35)" stroke-width="1.5" stroke-dasharray="1 16" stroke-linecap="round" /></svg>
      <span class="defense-ice-rim"></span>
      ${defenseIceFlakeMarkup('defense-ice-flake-1')}
      ${defenseIceFlakeMarkup('defense-ice-flake-2')}
      ${defenseIceFlakeMarkup('defense-ice-flake-3')}
      ${defenseIceFlakeMarkup('defense-ice-flake-4')}
      ${defenseIceFlakeMarkup('defense-ice-flake-5')}
      <span class="defense-ice-glint defense-ice-glint-1"><i></i></span>
      <span class="defense-ice-glint defense-ice-glint-2"><i></i></span>
      <span class="defense-ice-glint defense-ice-glint-3"><i></i></span>
    </span>
  `;
}

function defenseIceFlakeMarkup(className: string): string {
  return `
    <span class="defense-ice-flake ${className}">
      <svg viewBox="0 0 24 24">
        <g stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none">
          <path d="M12 2v20" /><path d="M4.5 6.5l15 11" /><path d="M19.5 6.5l-15 11" />
          <path d="M12 5.4l-2 2M12 5.4l2 2" /><path d="M12 18.6l-2 -2M12 18.6l2 -2" />
          <path d="M5.6 8l.1 2.7M5.6 8l2.6 .1" /><path d="M18.4 16l-.1 -2.7M18.4 16l-2.6 -.1" />
          <path d="M18.4 8l-.1 2.7M18.4 8l-2.6 .1" /><path d="M5.6 16l.1 -2.7M5.6 16l2.6 -.1" />
        </g>
      </svg>
    </span>
  `;
}

function defenseTimeScale(speedMultiplier: number): string {
  return (1 / Math.max(1, speedMultiplier)).toFixed(3);
}

function defenseGoldBoostOrbsMarkup(state: GameState): string {
  const visibleCount = Math.min(10, defenseWaveGoldBoostCount(state));
  return Array.from({ length: visibleCount }, (_, index) => {
    const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;
    return `<i style="--boost-orb-index:${index}; --boost-orb-x:${Math.cos(angle).toFixed(4)}; --boost-orb-y:${Math.sin(angle).toFixed(4)}"></i>`;
  }).join('');
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
  const visibleLightningStrikes = defense.lightningStrikes;
  return [
    defense.shots.map((shot) => defenseShotMarkup(shot)).join(''),
    defense.enemyProjectiles.map((projectile) => defenseEnemyProjectileMarkup(projectile)).join(''),
    visibleLightningStrikes
      .map((strike) => defenseLightningStrikeMarkup(
        strike,
        undefined,
        defense.enemies.find((enemy) => enemy.id === strike.targetEnemyId),
      ))
      .join(''),
    defense.enemies.map((enemy) => defenseEnemyHealthBarMarkup(enemy)).join(''),
    defense.enemies.map((enemy) => defenseEnemyMarkup(enemy)).join(''),
    defense.moneyPopups.filter(defenseMoneyPopupReady).map((popup) => defenseMoneyPopupMarkup(popup)).join(''),
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

function defenseEnemyHealthBarVisible(enemy: GameState['defense']['enemies'][number]): boolean {
  return enemy.maxHealth > 0 && enemy.health < enemy.maxHealth;
}

function defenseEnemyHealthBarMarkup(enemy: GameState['defense']['enemies'][number]): string {
  if (!defenseEnemyHealthBarVisible(enemy)) {
    return '';
  }

  const position = defenseEnemyPosition(enemy);
  const health = Math.max(0, Math.round((enemy.health / enemy.maxHealth) * 100));

  return `
    <i
      class="${defenseEnemyHealthBarClass(enemy)}"
      data-enemy-id="${enemy.id}"
      style="--enemy-x:${position.x}%; --enemy-y:${position.y}%; --enemy-health-value:${health}"
      aria-hidden="true"
    ><em></em><b></b></i>
  `;
}

function syncDefenseEnemyHealthBar(
  healthBarElement: HTMLElement,
  enemy: GameState['defense']['enemies'][number],
  health: number,
  previousHealth?: number,
): void {
  const previousHealthPercent =
    previousHealth === undefined ? health : Math.max(0, Math.round((previousHealth / enemy.maxHealth) * 100));
  const keepChipAnimation = healthBarElement.classList.contains('is-chip-damage');
  const position = defenseEnemyPosition(enemy);
  setStylePropertyIfChanged(healthBarElement, '--enemy-x', `${position.x}%`);
  setStylePropertyIfChanged(healthBarElement, '--enemy-y', `${position.y}%`);
  setStylePropertyIfChanged(healthBarElement, '--enemy-health-value', String(health));
  const nextClassName = `${defenseEnemyHealthBarClass(enemy)}${keepChipAnimation ? ' is-chip-damage' : ''}`;
  if (healthBarElement.className !== nextClassName) {
    healthBarElement.className = nextClassName;
  }

  if (previousHealth !== undefined && enemy.health < previousHealth) {
    setStylePropertyIfChanged(healthBarElement, '--enemy-health-chip-from', String(previousHealthPercent));
    setStylePropertyIfChanged(healthBarElement, '--enemy-health-chip-to', String(health));
    restartOneShotClass(healthBarElement, 'is-chip-damage');
    window.setTimeout(() => healthBarElement.classList.remove('is-chip-damage'), 430);
  }
}

function defenseEnemyMarkup(enemy: GameState['defense']['enemies'][number]): string {
  const position = defenseEnemyPosition(enemy);
  const facingScale = defenseEnemyFacingScale(position);
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
      style="--enemy-x:${position.x}%; --enemy-y:${position.y}%; --enemy-facing-scale:${facingScale}"
      aria-hidden="true"
    ></i>
  `;
}

function defenseEnemyProjectileMarkup(projectile: GameState['defense']['enemyProjectiles'][number]): string {
  const source = defenseSkeletonMageProjectileOriginPoint(projectile);
  const projectileAngle = Math.atan2(50 - source.y, 50 - source.x) * (180 / Math.PI) - 90;
  const projectileDurationMs = Math.max(1, Math.round(projectile.duration * 1000));
  return `
    <i
      class="defense-enemy-projectile"
      data-enemy-projectile-id="${projectile.id}"
      style="--enemy-shot-x:${source.x.toFixed(3)}cqw; --enemy-shot-y:${source.y.toFixed(3)}cqw; --enemy-shot-angle:${projectileAngle.toFixed(2)}deg; --enemy-shot-duration:${projectileDurationMs}ms"
      aria-hidden="true"
    ></i>
  `;
}

function activateDefenseEnemyProjectileElement(
  pool: HTMLElement[],
  projectile: GameState['defense']['enemyProjectiles'][number],
): HTMLElement {
  const source = defenseSkeletonMageProjectileOriginPoint(projectile);
  const projectileAngle = Math.atan2(50 - source.y, 50 - source.x) * (180 / Math.PI) - 90;
  const projectileDurationMs = Math.max(1, Math.round(projectile.duration * 1000));
  return activateDefensePooledIconEffect(pool, {
    className: 'defense-enemy-projectile',
    datasetKey: 'enemyProjectileId',
    datasetValue: String(projectile.id),
    style: `--enemy-shot-x:${source.x.toFixed(3)}cqw; --enemy-shot-y:${source.y.toFixed(3)}cqw; --enemy-shot-angle:${projectileAngle.toFixed(2)}deg; --enemy-shot-duration:${projectileDurationMs}ms`,
  });
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

function activateDefenseLightningStrikeElement(
  pool: HTMLElement[],
  strike: GameState['defense']['lightningStrikes'][number],
  visualPosition?: DefensePoint,
  targetEnemy?: GameState['defense']['enemies'][number],
): HTMLElement {
  const position = visualPosition ?? defenseEnemyPosition(strike);
  const durationMs = Math.max(1, Math.round(strike.duration * 1000));
  const targetClass = targetEnemy ? defenseLightningTargetClass(targetEnemy) : '';
  return activateDefensePooledIconEffect(pool, {
    className: `defense-lightning-strike${targetClass}`,
    datasetKey: 'lightningStrikeId',
    datasetValue: String(strike.id),
    style: `--lightning-x:${position.x.toFixed(3)}%; --lightning-y:${position.y.toFixed(3)}%; --lightning-duration:${durationMs}ms`,
  });
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
  const shotAngle = defenseTowerShotAngle(shotTarget);
  const shotDurationMs = Math.max(1, Math.round((shot.duration * 1000) / 0.85));
  return `
    <i
      class="defense-shot"
      data-shot-id="${shot.id}"
      style="--shot-target-x:${shotTarget.x.toFixed(3)}cqw; --shot-target-y:${shotTarget.y.toFixed(3)}cqw; --shot-angle:${shotAngle.toFixed(2)}deg; --shot-duration:${shotDurationMs}ms"
      aria-hidden="true"
    ></i>
  `;
}

function activateDefenseShotElement(pool: HTMLElement[], shot: GameState['defense']['shots'][number]): HTMLElement {
  const shotTarget = defenseEnemyVisibleCenter({ lane: shot.lane, distance: shot.distance, kind: shot.targetKind });
  const shotAngle = defenseTowerShotAngle(shotTarget);
  const shotDurationMs = Math.max(1, Math.round((shot.duration * 1000) / 0.85));
  return activateDefensePooledIconEffect(pool, {
    className: 'defense-shot',
    datasetKey: 'shotId',
    datasetValue: String(shot.id),
    style: `--shot-target-x:${shotTarget.x.toFixed(3)}cqw; --shot-target-y:${shotTarget.y.toFixed(3)}cqw; --shot-angle:${shotAngle.toFixed(2)}deg; --shot-duration:${shotDurationMs}ms`,
  });
}

function defenseTowerShotAngle(shotTarget: DefensePoint): number {
  return Math.atan2(shotTarget.y - 50, shotTarget.x - 50) * (180 / Math.PI) - 90;
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
      return `<span class="${`${stateClass}${finalClass} is-${marker.slot}`.trim()}" style="--wave-marker-base-x:${marker.baseX.toFixed(3)}%"><strong>${marker.value}</strong></span>`;
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

function defenseDamagePopupMotionValues(popup: GameState['defense']['damagePopups'][number]): {
  offsetX: number;
  offsetY: number;
  driftX: number;
} {
  const kindSeed = popup.kind === 'superCritical' ? 29 : popup.kind === 'critical' ? 17 : 5;
  const seed = popup.id * 53 + popup.amount * 17 + kindSeed;
  const offsetX = ((seed % 7) - 3) * 4;
  const offsetY = -10 - (Math.floor(seed / 7) % 5) * 3;
  const driftX = ((Math.floor(seed / 31) % 7) - 3) * 2;
  return { offsetX, offsetY, driftX };
}

function defenseMoneyPopupMarkup(popup: GameState['defense']['moneyPopups'][number]): string {
  const position = defenseEnemyPosition(popup);
  const motion = defenseMoneyPopupMotion(popup);
  return `
    <span
      class="defense-money-popup"
      data-money-popup-id="${popup.id}"
      data-money-amount="+${formatGameNumber(popup.amount)}"
      data-money-heat="${defenseMoneyPopupHeat(popup.combo).toFixed(3)}"
      data-money-stack="${defenseMoneyPopupStack(popup.combo)}"
      data-money-coin-count="${defenseMoneyVisibleCoinCount(popup)}"
      style="--money-x:${position.x}cqw; --money-y:${position.y}cqw; --money-heat:${defenseMoneyPopupHeat(popup.combo).toFixed(3)}; --money-stack:${defenseMoneyPopupStack(popup.combo)}; --money-counter-delay:${DEFENSE_MONEY_COUNTER_POPUP_DELAY_MS}ms; ${motion}"
      aria-hidden="true"
    ><span class="defense-money-coins" data-money-coin-count="${defenseMoneyVisibleCoinCount(popup)}">${defenseMoneyCoinMarkup(popup)}</span><b>+${formatGameNumber(popup.amount)}</b></span>
  `;
}

function activateDefenseMoneyPopupElement(pool: HTMLElement[], popup: GameState['defense']['moneyPopups'][number]): HTMLElement {
  const element = pool.pop() ?? document.createElement('span');
  element.className = 'defense-money-popup defense-pooled-effect';
  syncDefenseMoneyPopupElement(element, popup, true);
  element.classList.remove('is-pooled-hidden');
  return element;
}

function syncDefenseMoneyPopupElement(
  popupElement: HTMLElement,
  popup: GameState['defense']['moneyPopups'][number],
  forceStyle: boolean,
): void {
  const popupId = String(popup.id);
  const position = defenseEnemyPosition(popup);
  const nextAmount = `+${formatGameNumber(popup.amount)}`;
  const nextHeat = defenseMoneyPopupHeat(popup.combo).toFixed(3);
  const nextStack = String(defenseMoneyPopupStack(popup.combo));
  const desiredCoinCount = String(defenseMoneyVisibleCoinCount(popup));

  popupElement.dataset.moneyPopupId = popupId;
  if (forceStyle) {
    popupElement.setAttribute(
      'style',
      `--money-x:${position.x}cqw; --money-y:${position.y}cqw; --money-heat:${nextHeat}; --money-stack:${nextStack}; --money-counter-delay:${DEFENSE_MONEY_COUNTER_POPUP_DELAY_MS}ms; ${defenseMoneyPopupMotion(popup)}`,
    );
    popupElement.setAttribute('aria-hidden', 'true');
  }
  if (popupElement.dataset.moneyHeat !== nextHeat) {
    setStylePropertyIfChanged(popupElement, '--money-heat', nextHeat);
    popupElement.dataset.moneyHeat = nextHeat;
  }
  if (popupElement.dataset.moneyStack !== nextStack) {
    setStylePropertyIfChanged(popupElement, '--money-stack', nextStack);
    popupElement.dataset.moneyStack = nextStack;
  }

  let coinsElement = popupElement.firstElementChild instanceof HTMLElement ? popupElement.firstElementChild : null;
  let amountElement = popupElement.lastElementChild instanceof HTMLElement ? popupElement.lastElementChild : null;
  if (!coinsElement?.classList.contains('defense-money-coins') || amountElement?.tagName !== 'B') {
    coinsElement = document.createElement('span');
    coinsElement.className = 'defense-money-coins';
    amountElement = document.createElement('b');
    popupElement.replaceChildren(coinsElement, amountElement);
  }
  if (popupElement.dataset.moneyCoinCount !== desiredCoinCount) {
    syncDefenseMoneyCoinElement(coinsElement, popup);
    coinsElement.dataset.moneyCoinCount = desiredCoinCount;
    popupElement.dataset.moneyCoinCount = desiredCoinCount;
  }
  if (popupElement.dataset.moneyAmount !== nextAmount) {
    setTextContentIfChanged(amountElement, nextAmount);
    popupElement.dataset.moneyAmount = nextAmount;
  }
}

function syncDefenseMoneyCoinElement(coinsElement: HTMLElement, popup: GameState['defense']['moneyPopups'][number]): void {
  let coinElement = coinsElement.firstElementChild instanceof HTMLElement ? coinsElement.firstElementChild : null;
  if (!coinElement || coinElement.tagName !== 'I') {
    coinElement = document.createElement('i');
    coinsElement.replaceChildren(coinElement);
  }
  setAttributeIfChanged(coinElement, 'style', defenseMoneyCoinStyle(popup, 0));
}

function defenseMoneyCoinMarkup(popup: GameState['defense']['moneyPopups'][number], coinIndex?: number): string {
  const coinCount = defenseMoneyVisibleCoinCount(popup);
  const coinMarkups: string[] = [];
  const startIndex = coinIndex ?? 0;
  const endIndex = coinIndex === undefined ? coinCount : coinIndex + 1;
  for (let index = startIndex; index < endIndex; index += 1) {
    const seed = popup.id * 97 + popup.amount * 13 + popup.combo * 17 + index * 31;
    const column = (index % 7) - 3;
    const row = Math.floor(index / 7);
    const scatterX = column * 3.4 + ((seed % 5) - 2) * 0.7;
    const scatterY = -row * 2.8 + ((Math.floor(seed / 5) % 5) - 2) * 0.6;
    const delay = Math.min(180, index * 24);
    coinMarkups.push(`<i style="${defenseMoneyCoinStyleFromValues(scatterX, scatterY, delay, seed)}"></i>`);
  }
  return coinMarkups.join('');
}

function defenseMoneyCoinStyle(popup: GameState['defense']['moneyPopups'][number], index: number): string {
  const seed = popup.id * 97 + popup.amount * 13 + popup.combo * 17 + index * 31;
  const column = (index % 7) - 3;
  const row = Math.floor(index / 7);
  const scatterX = column * 3.4 + ((seed % 5) - 2) * 0.7;
  const scatterY = -row * 2.8 + ((Math.floor(seed / 5) % 5) - 2) * 0.6;
  const delay = Math.min(180, index * 24);
  return defenseMoneyCoinStyleFromValues(scatterX, scatterY, delay, seed);
}

function defenseMoneyCoinStyleFromValues(scatterX: number, scatterY: number, delay: number, seed: number): string {
  return `--coin-x:${scatterX.toFixed(1)}px; --coin-y:${scatterY.toFixed(1)}px; --money-coin-delay:${delay}ms; --money-coin-frame-delay:${seed % 180}ms`;
}

function defenseMoneyVisibleCoinCount(_popup: GameState['defense']['moneyPopups'][number]): number {
  return 1;
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

function installManaHoldControls(): void {
  if (manaHoldControlsInstalled) {
    return;
  }
  manaHoldControlsInstalled = true;
  window.addEventListener(
    'pointerdown',
    (event) => {
      if (!(event.target instanceof HTMLElement) || !event.target.closest('.mana-orb')) {
        return;
      }
      const state = gameStore.snapshot;
      if (!isBookPanelOpen(state, 'mana') || !manaHoldClickUnlocked(state)) {
        return;
      }
      gameStore.dispatch({ type: 'setManaHoldClickActive', active: true });
      startManaHoldClickLoop();
    },
    true,
  );
  window.addEventListener('pointerup', stopManaHoldClickLoop, true);
  window.addEventListener('pointercancel', stopManaHoldClickLoop, true);
  window.addEventListener('blur', stopManaHoldClickLoop);
}

function startManaHoldClickLoop(): void {
  if (manaHoldClickInterval !== null) {
    return;
  }
  manaHoldClickInterval = window.setInterval(() => {
    const state = gameStore.snapshot;
    if (!state.manaCrystal.holdClickActive || !isBookPanelOpen(state, 'mana') || !manaHoldClickUnlocked(state)) {
      stopManaHoldClickLoop();
      return;
    }
    const beforeMana = state.mana;
    gameStore.dispatch({ type: 'tickManaHoldClick', deltaSeconds: 0.1 });
    const gainedMana = gameStore.snapshot.mana - beforeMana;
    if (gainedMana > 0) {
      showCrystalClickEffect(gainedMana);
      const manaOrb = rootElement?.querySelector<HTMLElement>('.mana-orb');
      if (manaOrb) {
        showManaLocalFloatingGain(gainedMana, manaOrb, 'is-mana-click');
      }
    }
  }, 100);
}

function stopManaHoldClickLoop(): void {
  gameStore.dispatch({ type: 'setManaHoldClickActive', active: false });
  if (manaHoldClickInterval === null) {
    return;
  }
  window.clearInterval(manaHoldClickInterval);
  manaHoldClickInterval = null;
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
    const key = event.key.toLowerCase();
    if ((key !== 'l' && key !== 'g') || event.repeat || isTypingTarget(event.target)) {
      return;
    }

    const state = gameStore.snapshot;
    if (state.selectedBook !== 'defense' || !isBookPanelOpen(state, 'defense') || !state.books.defense.unlocked) {
      return;
    }

    event.preventDefault();
    gameStore.dispatch(key === 'g' ? { type: 'setDefenseWave', wave: 100 } : { type: 'toggleDefensePause' });
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
