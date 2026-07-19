import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const actionsSource = readFileSync(new URL('../src/game/simulation/actions.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const sceneSource = readFileSync(new URL('../src/phaser/scenes/LibraryScene.ts', import.meta.url), 'utf8');
const htmlSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const dockSignature = hudSource.match(/function defenseSkillDockSignature[\s\S]*?\n}\n\nfunction defenseSkillShopCardSnapshot/)?.[0];
const manaDockSignature = hudSource.match(/function manaSkillDockSignature[\s\S]*?\n}\n\nfunction manaSkillCardDynamicSignature/)?.[0];
const miningDockSignature = hudSource.match(/function miningSkillDockSignature[\s\S]*?\n}\n\nfunction miningSkillCardDynamicSignature/)?.[0];
const miningSkillShopTabsSource = hudSource.match(/function miningSkillShopTabs[\s\S]*?\n}\n\nfunction miningSkillShopCard/)?.[0];
const miningSkillShopCardSource = hudSource.match(/function miningSkillShopCard[\s\S]*?\n}\n\nfunction miningSkillIcon/)?.[0];
const defenseSkillShopTabsSource = hudSource.match(/function defenseSkillShopTabs[\s\S]*?\n}\n\nfunction defenseSkillShopCard/)?.[0];
const manaSkillShopTabsSource = hudSource.match(/function manaSkillShopTabs[\s\S]*?\n}\n\nfunction manaSkillShopCard/)?.[0];
const manaSkillShopCardSource = hudSource.match(/function manaSkillShopCard[\s\S]*?\n}\n\nfunction manaSkillDeltaLabel/)?.[0];
const renderHudStart = hudSource.indexOf('function renderHud');
const renderHudEnd = hudSource.indexOf('function setDefenseWaveFromInput');
const renderHudSource =
  renderHudStart === -1 || renderHudEnd === -1 ? undefined : hudSource.slice(renderHudStart, renderHudEnd);
const updateDynamicHudValuesSource = hudSource.match(/function updateDynamicHudValues[\s\S]*?\n}\n\nfunction defenseHealthPercent/)?.[0];
const createHudSignatureSource = hudSource.match(/function createHudSignature[\s\S]*?\n}\n\nfunction createHudStructureSignature/)?.[0];
const formatGameNumberSource = hudSource.match(/function formatGameNumber[\s\S]*?\n}\n\nfunction compactHudNumber/)?.[0];

assert.ok(dockSignature, 'defenseSkillDockSignature should exist');
assert.ok(manaDockSignature, 'manaSkillDockSignature should exist');
assert.ok(miningDockSignature, 'miningSkillDockSignature should exist');
assert.ok(miningSkillShopTabsSource, 'miningSkillShopTabs should exist');
assert.ok(miningSkillShopCardSource, 'miningSkillShopCard should exist');
assert.ok(defenseSkillShopTabsSource, 'defenseSkillShopTabs should exist');
assert.ok(manaSkillShopTabsSource, 'manaSkillShopTabs should exist');
assert.ok(manaSkillShopCardSource, 'manaSkillShopCard should exist');
assert.ok(renderHudSource, 'renderHud should exist');
assert.ok(updateDynamicHudValuesSource, 'updateDynamicHudValues should exist');
assert.ok(createHudSignatureSource, 'createHudSignature should exist');
assert.ok(formatGameNumberSource, 'formatGameNumber should exist');

assert.equal(
  createHudSignatureSource.includes('state.manaCrystal.xp,'),
  false,
  'volatile Mana crystal XP must not rebuild every open mini-game HUD on every auto click',
);
assert.equal(
  createHudSignatureSource.includes('state.manaCrystal.lastCollectedXpOrb'),
  false,
  'auto-collected Mana orbs must not remount unrelated mini-game WebGL canvases',
);
assert.equal(
  updateDynamicHudValuesSource.includes('updateManaXpHud(state);'),
  true,
  'the open Mana panel must continue to patch its XP display dynamically',
);
assert.equal(
  renderHudSource.includes('shouldPatchOpenRunnerPanel(state, structureSignature)'),
  true,
  'background automation updates must patch an open Runner panel without remounting its WebGL canvas',
);
for (const requiredRunnerStructureState of ['state.runner.running ? 1 : 0', 'state.runner.dead ? 1 : 0']) {
  assert.equal(
    hudSource.match(/function createHudStructureSignature[\s\S]*?\n}\n\nfunction shouldPatchOpenDefensePanel/)?.[0]
      ?.includes(requiredRunnerStructureState),
    true,
    `Runner ${requiredRunnerStructureState} must remain a structural HUD transition`,
  );
}

for (const requiredGameFontRule of [
  '@font-face',
  'font-family: "M5x7";',
  'src: url("/assets/fonts/m5x7.ttf") format("truetype");',
  '--game-font: "M5x7", Georgia, "Times New Roman", serif;',
  'font-family: var(--game-font);',
  '-webkit-font-smoothing: none;',
  'font-smooth: never;',
]) {
  assert.equal(
    `${htmlSource}\n${styleSource}`.includes(requiredGameFontRule),
    true,
    `Game UI should use the local M5x7 pixel font globally: missing ${requiredGameFontRule}`,
  );
}
assert.equal(
  styleSource.includes('font-family: Georgia'),
  false,
  'Game CSS should not force Georgia over the global M5x7 font.',
);

for (const requiredGameNumberRule of [
  'normalized.toFixed(1).replace(\'.\', \',\')',
  'return formatGameNumber(value, { compact: true });',
  "setDynamicText('mana', formatGameNumber(state.mana));",
  "setDynamicResourceText('scales', state.resources.scales);",
  "setDynamicResourceText('sigils', state.resources.sigils);",
  "setDynamicResourceText('gels', state.resources.gels);",
  'pop.textContent = `+${formatGameNumber(amount)}`;',
]) {
  assert.equal(
    `${formatGameNumberSource}\n${updateDynamicHudValuesSource}\n${hudSource}`.includes(requiredGameNumberRule),
    true,
    `Global game number formatting should allow one decimal with a comma: missing ${requiredGameNumberRule}`,
  );
}

for (const forbiddenDynamicResourceFloor of [
  "setDynamicResourceText('scales', Math.floor",
  "setDynamicResourceText('runes', Math.floor",
  "setDynamicResourceText('spores', Math.floor",
  "setDynamicResourceText('sigils', Math.floor",
  "setDynamicResourceText('fragments', Math.floor",
  "setDynamicResourceText('marks', Math.floor",
  "setDynamicResourceText('minerals', Math.floor",
  "setDynamicResourceText('gels', Math.floor",
]) {
  assert.equal(
    updateDynamicHudValuesSource.includes(forbiddenDynamicResourceFloor),
    false,
    `Dynamic resource counters should keep one decimal when present: found ${forbiddenDynamicResourceFloor}`,
  );
}

for (const requiredPanelSizeHotkey of [
  'installPanelSizeControls();',
  'event.key.toLowerCase() !== \'h\'',
  'cycleBookPanelSize(panelToResize.bookId, panelElement)',
  'function getBookPanelSizePresets(bookId: BookId): readonly BookPanelSizePreset[]',
  "if (bookId === 'mana')",
  'return [BOOK_PANEL_SIZE_PRESETS[1], BOOK_PANEL_SIZE_PRESETS[2]];',
]) {
  assert.equal(
    hudSource.includes(requiredPanelSizeHotkey),
    true,
    `HUD should let H cycle the focused mini-game panel size: missing ${requiredPanelSizeHotkey}`,
  );
}

for (const requiredDefenseHotkey of [
  "key !== 'l' && key !== 'g'",
  "key === 'g' ? { type: 'setDefenseWave', wave: 100 } : { type: 'toggleDefensePause' }",
]) {
  assert.equal(
    hudSource.includes(requiredDefenseHotkey),
    true,
    `HUD should let G jump TD directly to wave 100 without breaking L pause: missing ${requiredDefenseHotkey}`,
  );
}

for (const volatileReference of [
  'state.defense.towerHealth',
  'defenseTowerDamage',
  'defenseTowerDamageUpgradeDelta',
  'defenseTowerAttackInterval',
  'defenseTowerRangePercent',
  'defenseEnemyReward',
]) {
  assert.equal(
    dockSignature.includes(volatileReference),
    false,
    `defenseSkillDockSignature must not include ${volatileReference}; it would rebuild hovered TD skill buttons.`,
  );
}

const defensePatchGuardIndex = renderHudSource.indexOf('shouldPatchOpenDefensePanel(state, structureSignature)');
const fullRenderIndex = renderHudSource.indexOf('rootElement.innerHTML');
assert.notEqual(defensePatchGuardIndex, -1, 'renderHud should patch an already-open TD panel instead of rebuilding it during combat updates.');
assert.notEqual(fullRenderIndex, -1, 'renderHud should have a full-render boundary.');
assert.ok(
  defensePatchGuardIndex < fullRenderIndex,
  'The open TD panel patch guard must run before rootElement.innerHTML so hover and damage animations keep their DOM nodes.',
);

const manaPatchGuardIndex = renderHudSource.indexOf('shouldPatchOpenManaPanel(state, structureSignature)');
assert.notEqual(manaPatchGuardIndex, -1, 'renderHud should patch an already-open Crystal panel instead of rebuilding it during mana updates.');
assert.ok(
  manaPatchGuardIndex < fullRenderIndex,
  'The open Crystal panel patch guard must run before rootElement.innerHTML so crystal particles and skill hover animations keep their DOM nodes.',
);

for (const requiredManaSkillDock of [
  "return bookId === 'defense' || bookId === 'mana';",
  'let manaSkillShopTab: ManaSkillShopTabId = \'click\';',
  'let lastManaSkillDockTab: ManaSkillShopTabId | null = null;',
  '<div class="mana-crystal-arena"',
  'class="mana-xp-bar"',
  'class="mana-xp-badge"',
  '.mana-xp-badge::before',
  'z-index: 0;',
  '.mana-xp-badge strong',
  'z-index: 1;',
  'color: #ffe08a;',
  'class="mana-xp-body"',
  'class="mana-xp-top"',
  'class="mana-xp-track" data-dynamic-bar="mana-xp"',
  'class="mana-xp-effects"',
  'data-dynamic-value="mana-xp-current"',
  'data-dynamic-value="mana-xp-required"',
  'data-dynamic-value="mana-xp-resource-effect"',
  'data-dynamic-value="mana-xp-xp-effect"',
  'data-dynamic-value="mana-xp-ally-effect"',
  'class="mana-auto-click-layer"',
  'function manaAutoClickHandMarkup(state: GameState): string',
  'data-auto-click-hand',
  'function syncManaAutoClickHands(state: GameState): void',
  'state.manaSkills.lastAutoClickCount',
  "restartOneShotClass(hand, 'is-clicking')",
  '.mana-auto-click-hand.is-clicking',
  'scale(1.2)',
  '/assets/Crystal/cursors/auto-click-hand.png',
  "manaXpLevelEffectLabel(state, 'Resource')",
  "manaXpLevelEffectLabel(state, 'XP')",
  "manaXpLevelEffectLabel(state, 'Attack Ally')",
  'function manaXpHoverTitle(state: GameState): string',
  'return manaCrystalLevel(state);',
  'if (manaXpLevel(state) >= MANA_CRYSTAL_MAX_LEVEL) {',
  'return 100;',
  'return manaXpRequired(state);',
  'function updateManaXpHud(state: GameState): void',
  "setDynamicText('mana-xp-resource-effect', manaXpLevelEffectLabel(state, 'Resource'));",
  "setDynamicText('mana-xp-xp-effect', manaXpLevelEffectLabel(state, 'XP'));",
  "setDynamicText('mana-xp-ally-effect', manaXpLevelEffectLabel(state, 'Attack Ally'));",
  "setStylePropertyIfChanged(hud, '--mana-xp-progress'",
  'Number(((manaXpCurrent(state) / manaXpRequired(state)) * 100).toFixed(2))',
  'manaXpLevel(state) < MANA_CRYSTAL_MAX_LEVEL',
  "restartOneShotClass(hud, 'is-xp-gaining');",
  'conic-gradient(#ffdd6e var(--mana-xp-progress, 0%), rgba(36, 24, 18, 0.92) 0)',
  '.mana-xp-bar:hover .mana-xp-body',
  '.mana-xp-bar:focus-visible .mana-xp-body',
  '.mana-xp-bar:focus-within .mana-xp-body',
  '.mana-xp-badge:hover + .mana-xp-body',
  'visibility: hidden;',
  'visibility: visible;',
  'isolation: isolate;',
  'overflow: visible;',
  '.mana-xp-top span',
  '.mana-xp-effects',
  '.mana-xp-effects span',
  '@keyframes mana-xp-fill-pulse',
  '<div class="mana-xp-orb-layer">',
  'class="mana-crystal-cover"',
  'data-removed-cells',
  'data-cover-rank',
  'MANA_CRYSTAL_COVER_GRID_SIZE = 16',
  'manaCrystalRevealProgress(state)',
  'function manaCrystalRevealClass(state: GameState): string',
  'is-crystal-hidden',
  'is-crystal-revealed',
  'function syncManaCrystalCover(state: GameState): void',
  'function syncManaDiscoveredGems(state: GameState): void',
  "orb?.classList.toggle('is-crystal-revealed', isRevealed);",
  "orb?.classList.toggle('is-crystal-hidden', !isRevealed);",
  'let manaCrystalRevealHoldToken = 0;',
  'let manaCrystalRevealHold: { token: number; gemIndex: number } | null = null;',
  'function manaCrystalDisplayGemIndex(state: GameState): number',
  'function manaCrystalDisplayRevealProgress(state: GameState): number',
  'function manaCrystalDisplayRemovedCoverCells(state: GameState): number',
  'function holdManaCrystalNextGemDisplay(gemIndex: number): number',
  'function releaseManaCrystalNextGemDisplay(token: number): void',
  'syncManaDiscoveredGems(state);',
  "syncManaCrystalCover(state);",
  "syncManaDiscoveredGems(state);",
  'MANA_CRYSTAL_GEM_IMAGES',
  'class="mana-discovered-gems"',
  'data-discovered-gems',
  'data-mana-gem-index="${index}"',
  'manaDiscoveredGemMarkup(state)',
  'function animateManaGemReceive(',
  'releaseRevealHoldOnFinish = false',
  'const revealHoldToken = holdManaCrystalNextGemDisplay(Math.max(0, previousCount));',
  'releaseManaCrystalNextGemDisplay(revealHoldToken);',
  'window.setTimeout(releaseRevealHold, delayMs + 3600);',
  "target.classList.add('is-pending-dock');",
  'const showcase = await animateManaGemShowcase',
  'function waitForManaGemAnimation(animation: Animation)',
  'function animateManaGemShowcase(',
  'mana-gem-showcase-dim',
  'mana-gem-showcase-rays',
  "restartOneShotClass(target, 'is-docking');",
  "restartOneShotClass(badge, 'is-gem-docking');",
  'function spawnManaGemPulse(arena: HTMLElement',
  'function spawnManaGemSparks(arena: HTMLElement',
  '.mana-gem-flight',
  '.mana-gem-flight.is-showcasing',
  '.mana-gem-showcase-dim',
  '.mana-gem-showcase-rays',
  '.mana-gem-pulse',
  '.mana-gem-spark',
  '.mana-discovered-gem.is-pending-dock',
  '.mana-discovered-gem.is-docking',
  '.mana-xp-badge.is-gem-docking',
  '@keyframes mana-gem-showcase-spin',
  '@keyframes mana-discovered-gem-dock',
  '@keyframes mana-xp-badge-gem-pulse',
  '--mana-crystal-gem-image',
  '--mana-gem-angle:${-90 + index * 36}deg',
  '.mana-discovered-gem',
  'animation: none;',
  '@keyframes mana-discovered-gem-enter',
  '@keyframes crystal-gem-float',
  'background-image: url("/assets/Crystal/crystal-cover-rock.png")',
  'background-image: var(--mana-crystal-gem-image, url("/assets/Crystal/gems/crystal-a.png"))',
  '.mana-crystal-cover i.is-removed',
  'margin: -0.5px;',
  '.mana-orb.is-crystal-hidden .mana-sprite',
  'animation-play-state: paused;',
  '<div class="mana-skill-dock">',
  'function isManaSkillCardActionableSnapshot(snapshot: SkillShopCard | undefined): boolean',
  'function isManaSkillButtonActionable(button: HTMLButtonElement, skillId: string | undefined): skillId is ManaSkillId',
  '!snapshot.isMaxed && !snapshot.isDisabled && !snapshot.isUnaffordable && !snapshot.isLocked',
  "button.closest('.mana-skill-dock')",
  'if (!isManaSkillButtonActionable(button, skillId))',
  'if (!isManaSkillButtonActionable(card, clickedSkillId))',
  'const canAct = isManaSkillCardActionableSnapshot(snapshot);',
  'const animateCardCascade = lastManaSkillDockTab !== null && lastManaSkillDockTab !== manaSkillShopTab;',
  "manaSkillShop(state, false, { docked: true, showCompactButton: false, animateCardCascade })",
  'lastManaSkillDockTab = manaSkillShopTab;',
  '.mana-skill-dock .skill-shop-card.is-tab-entering',
  '.mana-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable):not(.is-locked):not(.is-maxed)',
  '.mana-skill-dock .skill-shop-card.is-hover-bouncing.is-maxed',
  'pointer-events: none;',
  '.mana-skill-dock .skill-shop-tab strong',
  'font-size: 24px;',
  "refreshManaSkillDock(gameStore.snapshot, { force: true });",
  "data-action=\"setManaSkillShopTab\"",
  'lastCollectedXpOrb',
  'let lastManaCollectedXpOrbId = 0;',
  'function showManaXpOrbCollectEffect(orb: ManaXpOrb, xpGain: number): void',
  "rootElement?.querySelector<HTMLElement>('.mana-xp-badge')",
  "showManaLocalFloatingGain(xpGain, badge, 'is-xp')",
  '.mana-xp-orb.is-auto-collect',
  'showCrystalClickEffect(gainedMana, event);',
  "showManaLocalFloatingGain(gainedMana, event, 'is-mana-click');",
  "manaOrb.classList.contains('is-crystal-hidden') ? 0.25 : 1",
  'const clickScale = 1 + scaleProgress * hiddenCrystalScaleBoost;',
  '@keyframes crystal-press-bounce',
  'transform: scale(0.955);',
  'function showManaLocalFloatingGain(amount: number, origin: ManaClickPoint | MouseEvent | HTMLElement, className?: string): void',
  "pop.className = className ? `floating-gain is-mana-local ${className}` : 'floating-gain is-mana-local';",
  "showManaLocalFloatingGain(manaMeowKnightDamage(state) * Math.max(1, attackCount - previousAttackCount), meow, 'is-idle-ally');",
  "showManaLocalFloatingGain(manaIdleCompanionDamage(state, visual.skillId) * Math.max(1, attackCount - previousAttackCount), popupTarget, 'is-idle-ally');",
  'function manaClickPoint(manaOrb: HTMLElement, origin?: ManaClickPoint): ManaClickPoint',
  'clientX: clamp(origin?.clientX ?? rect.left + rect.width * 0.5, rect.left, rect.right)',
  'function manaParticleVisualCount(amount: number): number',
  'return amount > 0 ? 1 : 0;',
  "shard.style.setProperty('--spark-origin-x'",
  'top: var(--spark-origin-y, 50%);',
  '.floating-gain.is-idle-ally',
  'font-size: 16px;',
  'gem_red_64.png',
  'gem_yellow_64.png',
  'gem_green_64.png',
  'gem_blue_64.png',
  'installManaHoldControls();',
  "gameStore.dispatch({ type: 'setManaHoldClickActive', active: true });",
  "gameStore.dispatch({ type: 'tickManaHoldClick', deltaSeconds: 0.1 });",
  '.mana-panel',
  '.mana-crystal-arena',
  '.mana-xp-bar',
  '.mana-xp-orb',
  '.mana-skill-dock',
  'function manaSkillShopCostHtml(cost: number): string',
  'return `<b>${compactHudNumber(cost)}</b>`;',
  'icon: manaSkillIcon(skillId),',
  '<span class="skill-shop-card-icon" aria-hidden="true"${iconStyle}>${card.icon}</span>',
  'function manaSkillIcon(skillId: ManaSkillId): string',
  "case 'power':",
  "case 'clickMultiplier':",
  "case 'criticalHit':",
  "case 'criticalEffect':",
  "case 'xpOrbChance':",
  "case 'levelUpEffect':",
  "case 'holdClick':",
  "case 'allyFindOrb':",
  '.skill-shop-card-icon .skill-shop-svg-icon',
  'grid-template-columns: 30px minmax(0, 1fr) minmax(52px, max-content);',
  '.defense-skill-dock .skill-shop-card-icon',
  'pointer-events: none;',
  'max-width: none;',
  'text-overflow: clip;',
  'place-items: center;',
  'text-align: center;',
  '.mana-skill-dock .skill-shop-tab.is-selected',
  '0 0 0 2px rgba(255, 244, 188, 0.6)',
  '--mana-arena-size: 480px;',
  'width: min(var(--mana-arena-size), calc(100cqw - 16px));',
  'height: min(var(--mana-arena-size, 480px), calc(100cqw - 16px));',
  '.book-overlay[data-book-id="mana"] .book-page-body',
  'flex: 0 0 auto;',
  '.book-overlay[data-book-id="mana"] .book-page-header',
  'pointer-events: none;',
  '.book-overlay[data-book-id=\"mana\"].panel-size-large',
  '--panel-max-width: min(var(--mana-arena-size), calc(100cqw - 8px));',
  'width: var(--panel-max-width);',
  '.mana-skill-dock .skill-shop-card-grid {',
  '--td-skill-visible-grid-height: 170px;',
  'max-height: var(--td-skill-visible-grid-height);',
  'overflow-y: auto;',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredManaSkillDock),
    true,
    `Crystal mini-game should use the TD square arena plus bottom skill dock layout: missing ${requiredManaSkillDock}`,
  );
}

assert.ok(
  /\.book-overlay\[data-book-id="mana"\] \.book-page-header \{[\s\S]*?z-index: 0;[\s\S]*?pointer-events: none;/.test(
    styleSource,
  ),
  'Crystal minimal header must stay behind the arena content and must not intercept the XP level-circle hover.',
);

assert.equal(
  hudSource.includes('data-action="collectManaXpOrb"'),
  false,
  'Mana XP orbs should auto-collect and should not render a clickable collect action.',
);

const miningPatchGuardIndex = renderHudSource.indexOf('shouldPatchOpenMiningPanel(state, structureSignature)');
assert.notEqual(miningPatchGuardIndex, -1, 'renderHud should patch an already-open Mine panel instead of rebuilding it during mining updates.');
assert.ok(
  miningPatchGuardIndex < fullRenderIndex,
  'The open Mine panel patch guard must run before rootElement.innerHTML so mining clicks and skill hover animations keep their DOM nodes.',
);

for (const requiredMinimalMiningLayout of [
  '<div class="mining-playfield">',
  '<div class="mining-skill-dock">',
  "miningSkillShop(state, false, { docked: true, showCompactButton: false, animateCardCascade })",
  'function refreshMiningSkillDock',
  'function refreshMiningBoard',
  "selectedBook.id !== 'mine'",
  '.book-overlay[data-book-id="mine"] {',
  'background: transparent;',
  'box-shadow: none;',
  '.mining-panel {',
  '.mining-grid-shell {',
  '.mining-grid-shell .mining-three-frame {',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredMinimalMiningLayout),
    true,
    `Mine should render as a minimal 480px game surface without extra panels: missing ${requiredMinimalMiningLayout}`,
  );
}

for (const forbiddenMiningPanelChrome of [
  '<div class="mining-material-bank"',
  '<div class="mining-depth"',
]) {
  assert.equal(
    hudSource.includes(forbiddenMiningPanelChrome),
    false,
    `Mine panel should not render extra skill/resource chrome around the 3D game: found ${forbiddenMiningPanelChrome}`,
  );
}

for (const volatileMiningReference of [
  'state.mining.totalMined',
  'state.mining.blocks',
  'state.mining.materials',
  'Math.floor(state.mana)',
  'state.mana <',
  'hitPulse',
  'lastReward',
]) {
  assert.equal(
    miningDockSignature.includes(volatileMiningReference),
    false,
    `miningSkillDockSignature must not include ${volatileMiningReference}; it would rebuild hovered Mine skill buttons.`,
  );
}

for (const requiredThreeMiningTerrain of [
  "import { syncMiningThreeTerrain } from './miningThreeTerrain';",
  'data-mining-3d-board="true"',
  'class="mining-grid mining-three-frame"',
  'class="mining-three-board"',
  'syncMiningThreeTerrain(state, (blockIds) =>',
  'new WebGLRenderer({',
  'new OrthographicCamera(',
  'new Raycaster()',
  "dirt: { top: '#99e550', left: '#37946e', right: '#6abe30'",
  'const blockGeometry = new BoxGeometry(1, 1, 1);',
  'terrain.raycaster.intersectObjects(terrain.blockMeshes, false)',
  'startMiningPressAnimation(terrain, affectedBlockIds);',
  "phase: 'pressing'",
  "animation.phase = 'held';",
  "animation.phase = 'releasing';",
  'const miningDamageCompression = 0.12;',
  'document.addEventListener(\'pointerup\', handleMiningThreePointerRelease, true);',
  'window.requestAnimationFrame(() => animateMiningDamage(terrain))',
  'return 1 - easeOutMiningDamage(progress) * miningDamageCompression;',
  "gameStore.dispatch({ type: 'digMiningBlock', blockId });",
  'image-rendering: pixelated;',
  '.mining-grid-shell .mining-three-board',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}\n${readFileSync(new URL('../src/ui/miningThreeTerrain.ts', import.meta.url), 'utf8')}`.includes(requiredThreeMiningTerrain),
    true,
    `Mine terrain should render as true Three.js 3D pixel-art blocks: missing ${requiredThreeMiningTerrain}`,
  );
}

for (const forbiddenThreeMiningLine of ['EdgesGeometry', 'LineSegments', 'LineBasicMaterial']) {
  assert.equal(
    readFileSync(new URL('../src/ui/miningThreeTerrain.ts', import.meta.url), 'utf8').includes(forbiddenThreeMiningLine),
    false,
    `Mine 3D terrain should not draw visible lines between blocks: found ${forbiddenThreeMiningLine}`,
  );
}

for (const requiredMiningFallback of [
  'data-layer-count="${block.layersRemaining}"',
  'class="mining-accessible-grid"',
  'class="mining-keyboard-block"',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredMiningFallback),
    true,
    `Mine terrain should keep accessible per-block fallbacks beside the 3D canvas: missing ${requiredMiningFallback}`,
  );
}

for (const forbiddenMiningCheckerboard of [
  'checkerboard',
  'repeating-conic-gradient(#d',
  'repeating-conic-gradient(red',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(forbiddenMiningCheckerboard),
    false,
    `Mine terrain should not ship the red checkerboard explanation texture: found ${forbiddenMiningCheckerboard}`,
  );
}

assert.equal(
  manaSkillShopCardSource.includes("costHtml: isMaxed ? 'Max' : manaSkillShopCostHtml(cost)"),
  true,
  'Crystal skill cards should show compact cost text so large Mana prices stay inside the card.',
);
assert.equal(
  manaSkillShopCardSource.includes('standardManaCostHtml(cost)'),
  false,
  'Crystal skill cards must not use the raw Mana resource cost renderer; long values overflow the TD-style card.',
);
assert.equal(
  `${hudSource}\n${styleSource}`.includes('Prochain niveau'),
  false,
  'Crystal XP HUD should not show next-level helper copy.',
);
assert.equal(
  styleSource.includes('.book-overlay[data-book-id="mana"].panel-size-small'),
  false,
  'Crystal prototype should remove S-size CSS so the Crystal panel only supports M/L.',
);
assert.equal(
  /\.book-panel-close \{[\s\S]*?border-radius: 16px;[\s\S]*?color: #111111;[\s\S]*?font-size: 16px;[\s\S]*?background: #ffb59e;/.test(styleSource),
  true,
  'Panel close control should use the larger rounded peach button style with black text.',
);
assert.equal(
  /\.book-panel-close:hover \{[\s\S]*?background: #ffc2af;/.test(styleSource),
  true,
  'Panel close control should keep a peach hover state.',
);
assert.equal(
  hudSource.includes('class="book-panel-size"'),
  false,
  'Book panels should not render the S/M/L size button.',
);
assert.equal(
  hudSource.includes('aria-label="Changer la taille du panneau"'),
  false,
  'Book panels should not render the panel-size accessibility label.',
);

assert.equal(
  /\.defense-skill-dock \.skill-shop-card-value small \{[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'TD skill card subtexts should render at 16px.',
);
assert.equal(
  /\.mana-skill-dock \.skill-shop-card-value small \{[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'Mana skill card subtexts should now match the TD 16px card rhythm.',
);
assert.equal(
  styleSource.includes('.defense-skill-dock .skill-shop-card[data-skill-id="damage"] .skill-shop-card-value strong'),
  false,
  'TD Damage + value should not be forced below the normal 16px value size.',
);
assert.equal(
  /\.upgrade-panel\.is-skill-shop \.skill-shop-header strong,[\s\S]*?\.upgrade-panel\.is-skill-shop \.skill-shop-tab strong \{[\s\S]*?-webkit-text-stroke: 0;[\s\S]*?text-shadow: none;/.test(
    styleSource,
  ),
  true,
  'All skill shop text should not render a heavy black outline or shadow.',
);
assert.equal(
  /\.defense-skill-dock \.skill-shop-tab,[\s\S]*?\.mana-skill-dock \.skill-shop-tab \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?justify-items: center;[\s\S]*?place-items: center;[\s\S]*?text-align: center;/.test(
    styleSource,
  ),
  true,
  'TD and Gem skill tab labels should be centered in the tab buttons.',
);
assert.equal(
  /\.defense-skill-dock \.skill-shop-tab strong,[\s\S]*?\.panel-size-small \.defense-skill-dock \.skill-shop-tab strong[\s\S]*?\{[\s\S]*?font-size: 24px;[\s\S]*?text-align: center;/.test(
    styleSource,
  ),
  true,
  'TD skill tab labels should render at 24px.',
);
assert.equal(
  /\.defense-speed-toggle \{[\s\S]*?font-size: 32px;/.test(styleSource),
  true,
  'TD speed toggle text should render at 32px.',
);
assert.equal(
  /\.defense-skill-dock \.skill-shop-card\.is-defense \.skill-shop-card-topline strong \{[\s\S]*?font-size: 16px;[\s\S]*?text-overflow: ellipsis;/.test(
    styleSource,
  ),
  true,
  'TD Element skill titles should render at 16px.',
);
assert.equal(
  /\.defense-skill-dock \.skill-shop-card\.is-defense \{[\s\S]*?min-height: var\(--td-skill-visible-card-height\);/.test(
    styleSource,
  ),
  true,
  'TD Element skill cards should use the same height as the other TD skill cards.',
);
assert.equal(
  styleSource.includes('.defense-skill-dock .skill-shop-card.is-defense {\n  min-height: 58px;'),
  false,
  'TD Element skill cards should not keep the old 58px height.',
);
assert.equal(
  styleSource.includes('.defense-skill-dock .skill-shop-card[data-skill-id="lightningCount"] .skill-shop-card-topline strong'),
  false,
  'TD Lightning title should not keep a separate larger font-size override.',
);
assert.equal(
  /\.defense-hp-value \{[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'TD tower health value should render at 16px next to the HP track.',
);
assert.equal(
  /\.defense-hud-xp \.defense-xp-badge strong \{[\s\S]*?font-size: 19px;/.test(styleSource),
  true,
  'TD XP badge level should render 20% larger than the base 16px.',
);
assert.equal(
  /\.defense-hud-xp \.defense-xp-top \{[\s\S]*?flex-direction: column;[\s\S]*?align-items: flex-start;[\s\S]*?text-align: left;[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'TD XP tooltip text should render at 16px and align left.',
);
assert.equal(
  /\.defense-hud-xp \.defense-xp-top strong \{[\s\S]*?text-align: left;/.test(styleSource),
  true,
  'TD XP tooltip counter should align left with the label.',
);
assert.equal(
  /\.defense-hud-xp \.defense-xp-effect \{[\s\S]*?text-align: left;/.test(styleSource),
  true,
  'TD XP tooltip level bonuses should align left.',
);
assert.equal(
  /\.book-overlay\[data-book-id="defense"\] \.defense-panel,[\s\S]*?\.book-overlay\[data-book-id="defense"\] \.defense-panel \*::after \{[\s\S]*?-webkit-text-stroke: 0;[\s\S]*?text-shadow: none;/.test(styleSource),
  true,
  'TD panel text should not render black font shadows or strokes.',
);
assert.equal(
  /\.defense-wave-markers span \{[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'TD normal wave markers should render text at 16px.',
);
assert.equal(
  /\.defense-wave-markers span:not\(\.is-current\):not\(\.is-final\) strong \{[\s\S]*?transform: translate\(1px, -1px\);/.test(styleSource),
  true,
  'TD yellow and gray wave marker digits should be nudged 1px right.',
);
assert.equal(
  /\.defense-wave-markers span\.is-final \{[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'TD final wave marker should render text at 16px.',
);
assert.equal(
  /\.panel-size-small \.defense-wave-markers span \{[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'TD small-panel wave markers should still render text at 16px.',
);
assert.equal(
  /\.panel-size-small \.defense-hp-value \{[\s\S]*?font-size: 16px;/.test(styleSource),
  true,
  'TD small-panel tower health value should still render at 16px.',
);
assert.equal(
  /\.defense-skill-dock \.skill-shop-card\.is-maxed,\s*\.mana-skill-dock \.skill-shop-card\.is-maxed,\s*\.snake-skill-dock \.skill-shop-card\.is-maxed \{[\s\S]*?linear-gradient\(180deg, #52b347, #1f7f33\)/.test(styleSource),
  true,
  'Maxed dock skill cards should turn green.',
);
assert.equal(
  /\.book-overlay\[data-book-id="defense"\] \{[\s\S]*?--defense-arena-size: 480px;[\s\S]*?width: min\(var\(--defense-arena-px, var\(--defense-arena-size\)\), calc\(100cqw - 16px\)\);/.test(
    styleSource,
  ),
  true,
  'TD game box should target a 480px square arena.',
);
assert.equal(
  /\.defense-skill-dock \{[\s\S]*?width: 100%;[\s\S]*?height: auto;/.test(styleSource),
  true,
  'TD skill dock should stay aligned to the 480px game width without forcing dock height.',
);

for (const volatileManaDockReference of [
  'state.mana <',
  'Math.floor(state.mana)',
  'manaPerSecond',
]) {
  assert.equal(
    manaDockSignature.includes(volatileManaDockReference),
    false,
    `manaSkillDockSignature must not include ${volatileManaDockReference}; it would rebuild hovered Crystal skill buttons.`,
  );
}

for (const requiredManaSkillTabLayout of [
  "label: 'Click'",
  "label: 'Idle'",
  "label: 'XP'",
  'grid-template-columns: repeat(3, minmax(0, 1fr));',
  "manaSkillShopCard(state, 'power'",
  "manaSkillShopCard(state, 'clickMultiplier'",
  "manaSkillShopCard(state, 'criticalHit'",
  "manaSkillShopCard(state, 'criticalEffect'",
  "manaSkillShopCard(state, 'xpOrbChance'",
  "manaSkillShopCard(state, 'yellowOrbChance'",
  "manaSkillShopCard(state, 'greenOrbChance'",
  "manaSkillShopCard(state, 'blueOrbChance'",
  "manaSkillShopCard(state, 'xpValue'",
  "'Exp x'",
  "manaSkillShopCard(state, 'levelUpEffect'",
  "'Level Up Effect'",
  "manaSkillShopCard(state, 'meowKnight'",
  "'Meow Knight'",
  "manaSkillShopCard(state, 'idleBow'",
  "'Bow'",
  "manaSkillShopCard(state, 'idleGlock'",
  "'Glock'",
  "manaSkillShopCard(state, 'idlePickaxe'",
  "'Pickaxe'",
  "manaSkillShopCard(state, 'idleBazooka'",
  "'Bazooka'",
  "manaSkillShopCard(state, 'idleAk47'",
  "'AK47'",
  "manaSkillShopCard(state, 'idleSword'",
  "'Sword'",
  "manaSkillShopCard(state, 'idleOrangeCat'",
  "'Ultimate Orange Cat'",
  "manaSkillShopCard(state, 'allyFindOrb'",
  "'Ally Find Orb'",
  'manaAllyFindOrbChance(state) * 100',
  "manaSkillShopCard(state, 'holdClick'",
  '.mana-companion-meow',
  '.mana-idle-companion',
  'meow-knight-idle.png',
  'meow-knight-attack.png',
  'idle-companions/${visual.slug}.png',
  '--idle-companion-rotate:${instance.rotation ?? 0}deg',
  'rotate(var(--idle-companion-rotate, 0deg))',
  "slug: 'glock'",
  "slug: 'ak47'",
  "slug: 'bazooka'",
  "slug: 'bow'",
  "slug: 'sword'",
  "slug: 'orange-cat'",
  "slug: 'pickaxe'",
  'function syncManaMeowKnight(state: GameState): void',
  'function syncManaIdleCompanions(state: GameState): void',
  'manaSkills.allyFindOrb',
  'skills.allyFindOrb',
  '@keyframes mana-meow-idle',
  '5.01%,\n  30% {\n    background-position: 20% 0%;',
  '@keyframes mana-meow-attack',
  '@keyframes mana-idle-companion-7',
  '@keyframes mana-idle-companion-8',
  '@keyframes mana-idle-companion-10',
  '@keyframes mana-idle-companion-15',
  'scale(2.9)',
  'calc(var(--idle-companion-width, 52px) * 1.8)',
  'clamp(44px',
  'formatOneDecimalGameNumber(manaClickGainPreview(state))',
  'formatTwoDecimalGameNumber(manaClickMultiplier(state))',
  'manaSkillUpgradeEffectDelta(state, skillId)',
  'manaCrystalLevel(state)',
  'manaCrystalDiscoveredGemCount(state)',
]) {
  assert.equal(
    `${manaSkillShopTabsSource}\n${hudSource}\n${styleSource}`.includes(requiredManaSkillTabLayout),
    true,
    `Crystal skill tabs should keep the requested TD-style tab/card arrangement: missing ${requiredManaSkillTabLayout}`,
  );
}

for (const requiredManaIdleStagger of [
  'const MANA_IDLE_ATTACK_STAGGER_SECONDS = 0.12;',
  'const MANA_IDLE_ATTACK_INTERVAL = 1;',
  'function manaIdleCompanionAttackOffset(skillId: ManaIdleCompanionSkillId): number',
  'delete skills.idleCompanionTimers[skillId];',
  '?? -manaIdleCompanionAttackOffset(skillId)',
  'function maybeSpawnManaAllyOrb(state: GameState): void',
  'function manaAllyFindOrbChance(state: GameState): number',
  'strongestClickChance - 0.05',
]) {
  assert.equal(
    actionsSource.includes(requiredManaIdleStagger),
    true,
    `Crystal idle allies should stagger attack loops instead of firing in sync: missing ${requiredManaIdleStagger}`,
  );
}

const manaClickTabOrder = [
  "manaSkillShopCard(state, 'power'",
  "manaSkillShopCard(state, 'clickMultiplier'",
  "manaSkillShopCard(state, 'criticalHit'",
  "manaSkillShopCard(state, 'criticalEffect'",
  "manaSkillShopCard(state, 'holdClick'",
].map((needle) => manaSkillShopTabsSource.indexOf(needle));
assert.deepEqual(
  manaClickTabOrder,
  [...manaClickTabOrder].sort((a, b) => a - b),
  'Crystal Click tab should order Power, Click x, Critical Chance, Critical Multiplier, then Click Holder.',
);
assert.equal(
  manaClickTabOrder.every((index) => index !== -1),
  true,
  'Crystal Click tab should include click skills, critical skills, and Click Holder.',
);

const manaTabOrder = [
  "label: 'Click'",
  "label: 'Idle'",
  "label: 'XP'",
].map((needle) => manaSkillShopTabsSource.indexOf(needle));
assert.deepEqual(
  manaTabOrder,
  [...manaTabOrder].sort((a, b) => a - b),
  'Crystal tabs should order Click, Idle, then XP.',
);
assert.equal(
  manaSkillShopTabsSource.includes("id: 'auto',\n      label: 'Idle',\n      icon: '⌁',\n      theme: 'utility'"),
  true,
  'Crystal Idle tab should be second and use the yellow utility theme.',
);

assert.equal(
  manaSkillShopTabsSource.includes("label: 'Luck'"),
  false,
  'Crystal should not keep a separate Luck tab; those skills live in XP.',
);

for (const requiredManaResearchButtonUi of [
  '.skill-shop-tab.is-research',
  'linear-gradient(180deg, #ff9d2e, #ad5b11)',
  '.mana-skill-dock .skill-shop-card.is-research',
  'min-height: 50px;',
  'grid-template-rows: auto auto 10px;',
  'height: 10px;',
  'progressPercent: isLocked ? undefined : progressPercent',
]) {
  assert.equal(
    `${manaSkillShopCardSource}\n${styleSource}`.includes(requiredManaResearchButtonUi),
    true,
    `Crystal Research buttons should show progress directly and use the orange research tab: missing ${requiredManaResearchButtonUi}`,
  );
}

const manaXpTabOrder = [
  "manaSkillShopCard(state, 'xpOrbChance'",
  "manaSkillShopCard(state, 'yellowOrbChance'",
  "manaSkillShopCard(state, 'greenOrbChance'",
  "manaSkillShopCard(state, 'blueOrbChance'",
  "manaSkillShopCard(state, 'xpValue'",
  "manaSkillShopCard(state, 'levelUpEffect'",
  "manaSkillShopCard(state, 'allyFindOrb'",
].map((needle) => manaSkillShopTabsSource.indexOf(needle));
assert.deepEqual(
  manaXpTabOrder,
  [...manaXpTabOrder].sort((a, b) => a - b),
  'Crystal XP tab should order red/yellow/green/blue orbs, Exp x, Level Up Effect, then Ally Find Orb.',
);
assert.equal(
  manaXpTabOrder.every((index) => index !== -1),
  true,
  'Crystal XP tab should include red orb, former Luck orbs, Exp x, Level Up Effect, and Ally Find Orb.',
);

const manaIdleTabOrder = [
  "manaSkillShopCard(state, 'meowKnight'",
  "manaSkillShopCard(state, 'idleBow'",
  "manaSkillShopCard(state, 'idleGlock'",
  "manaSkillShopCard(state, 'idlePickaxe'",
  "manaSkillShopCard(state, 'idleBazooka'",
  "manaSkillShopCard(state, 'idleAk47'",
  "manaSkillShopCard(state, 'idleSword'",
  "manaSkillShopCard(state, 'idleOrangeCat'",
].map((needle) => manaSkillShopTabsSource.indexOf(needle));
assert.deepEqual(
  manaIdleTabOrder,
  [...manaIdleTabOrder].sort((a, b) => a - b),
  'Crystal Idle tab should order Meow Knight, then annotated idle companions.',
);
assert.equal(
  manaIdleTabOrder.every((index) => index !== -1),
  true,
  'Crystal Idle tab should include the companions and Click Holder.',
);

for (const removedManaWandFeature of [
  "'Wand Speed'",
  "'Wand Count'",
  "'+1 wand'",
  'manaWandCount',
  'manaAutomationInterval',
  'showWandCastEffect',
  '.magic-wands',
  '@keyframes wand-sprite-cast',
]) {
  assert.equal(
    `${manaSkillShopTabsSource}\n${hudSource}\n${styleSource}`.includes(removedManaWandFeature),
    false,
    `Crystal should not keep removed Wand feature code: found ${removedManaWandFeature}`,
  );
}

for (const removedManaSkill of ['doubleChance', 'tripleChance', 'Double Chance', 'Triple Chance']) {
  assert.equal(
    `${hudSource}\n${actionsSource}\n${styleSource}`.includes(removedManaSkill),
    false,
    `Crystal should not keep removed x2/x3 chance skill code: found ${removedManaSkill}`,
  );
}

for (const requiredGoblinKingCss of [
  '--goblin-row-idle: 0%',
  '--goblin-row-walk: 10%',
  '--goblin-row-death: 70%',
  '--goblin-row-attack-a: 90%',
  '--goblin-row-attack-b: 100%',
  'goblin-king/goblin-king-outlined.png',
  '@keyframes defense-goblin-king-idle',
  '@keyframes defense-goblin-king-walk',
  '@keyframes defense-goblin-king-death',
  '@keyframes defense-goblin-king-attack',
]) {
  assert.equal(styleSource.includes(requiredGoblinKingCss), true, `Goblin King CSS missing ${requiredGoblinKingCss}`);
}

for (const requiredBlueSlimeCss of [
  'blue-slime/idle-compact-outlined.png',
  'blue-slime/walk-compact-outlined.png',
  'blue-slime/attack-compact-outlined.png',
  'blue-slime/death-compact-outlined.png',
  '--defense-slime-width',
  '--defense-slime-height',
  'background-size: 600% 100%',
  'background-size: 800% 100%',
  'background-size: 1000% 100%',
  'background-size: 1200% 100%',
  '@keyframes defense-enemy-idle',
  '@keyframes defense-enemy-walk',
  '@keyframes defense-enemy-attack',
  '@keyframes defense-enemy-death',
]) {
  assert.equal(styleSource.includes(requiredBlueSlimeCss), true, `Blue slime TD CSS missing ${requiredBlueSlimeCss}`);
}

for (const requiredStableSlimeWalk of [
  '.defense-enemy {\n  --enemy-facing-scale: 1;',
  'transition: none;',
  'animation: defense-enemy-walk calc(520ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
]) {
  assert.equal(
    styleSource.includes(requiredStableSlimeWalk),
    true,
    `Blue slime movement should keep JS transform positioning while the spritesheet walk animation runs: missing ${requiredStableSlimeWalk}`,
  );
}

for (const unstableSlimeWalkReference of [
  'DEFENSE_SLIME_WALK_CYCLE_MS',
  'defenseEnemyWalkOffset',
  '--enemy-walk-offset',
  'animation: defense-enemy-walk calc(1586ms * var(--defense-time-scale, 1)) linear infinite;',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(unstableSlimeWalkReference),
    false,
    `Blue slime walk should not use random offsets or linear sprite interpolation: found ${unstableSlimeWalkReference}`,
  );
}

assert.equal(
  styleSource.includes('/assets/td/tiles/Monster%20TD%201/1/generated/S_Walk_'),
  false,
  'Blue slime TD should animate one spritesheet with background-position, not swap old generated walk PNGs.',
);

const defenseStatusHudIndex = hudSource.indexOf('class="defense-status-hud"');
const defenseHudXpIndex = hudSource.indexOf('class="defense-hud-xp"');
const defenseWaveChooserIndex = hudSource.indexOf('defenseWaveChooser(defense.wave)');
const defenseHudHealthIndex = hudSource.indexOf('defense-hud-health', defenseStatusHudIndex);
const defenseHudMoneyIndex = hudSource.indexOf('defense-hud-money', defenseStatusHudIndex);
assert.equal(defenseStatusHudIndex >= 0, true, 'TD status HUD should exist.');
assert.equal(
  defenseHudXpIndex >= 0 && defenseHudXpIndex < defenseStatusHudIndex && defenseStatusHudIndex < defenseWaveChooserIndex,
  true,
  'TD arena should render the Niveau tab where Wave used to be, then put Wave after the bottom status HUD.',
);
assert.equal(
  defenseHudHealthIndex < defenseHudMoneyIndex,
  true,
  'TD status HUD should render HP before money.',
);
for (const requiredDefenseHudExperienceAlignment of [
  '.defense-hud-xp {\n  position: absolute;',
  'z-index: 30;',
  'left: calc(clamp(8px, 2cqw, 14px) + 8px);',
  'top: calc(clamp(8px, 2cqw, 14px) + 8px);',
  '.defense-wave-chooser {\n  position: absolute;',
  'right: clamp(8px, 2cqw, 14px);',
  'bottom: clamp(4px, 1cqw, 8px);',
  'tabindex="0"',
  'class="defense-level-glow"',
  'class="defense-xp-badge"',
  'width: clamp(38px, 8.16cqw, 55px);',
  'height: clamp(38px, 8.16cqw, 55px);',
  'width: clamp(62px, 12cqw, 91px);',
  'height: clamp(62px, 12cqw, 91px);',
  'class="defense-xp-body"',
  'class="defense-xp-top"',
  'class="defense-xp-effect"',
  'conic-gradient(#ffdd6e var(--defense-xp-progress, 0%), rgba(36, 24, 18, 0.92) 0)',
  '.defense-hud-xp:hover .defense-xp-body',
  '.defense-hud-xp:focus-visible .defense-xp-body',
  '.defense-hud-xp .defense-xp-effect',
  'font-size: 16px;',
  'text-shadow: none;',
  'style="--defense-xp-progress:${(experienceProgress * 100).toFixed(2)}%"',
  "setDynamicText('defense-level', state.defense.level);",
  'let lastDefenseDisplayedLevel: number | null = null;',
  'lastDefenseDisplayedLevel = null;',
  'lastDefenseDisplayedLevel !== null && state.defense.level > lastDefenseDisplayedLevel',
  'playDefenseLevelUpBadge(experienceHud, experienceBadge, experienceLevelValue, state.defense.level);',
  "experienceLevelValue?.dataset.defenseLevelAnimating !== String(state.defense.level)",
  "className = 'defense-level-spark'",
  '.defense-hud-xp .defense-level-glow',
  '.defense-hud-xp .defense-level-spark',
  "setDynamicText('defense-xp', experienceLabel);",
  "setDynamicText('defense-level-effect', experienceEffectLabel);",
  'defenseLevelEffectLabel(state)',
  '`+${bonusPercent}% dégâts / +${bonusPercent}% gold`',
  '.defense-hud-money {\n  justify-self: center;',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseHudExperienceAlignment),
    true,
    `TD status HUD should show an XP bar instead of the wave counter: missing ${requiredDefenseHudExperienceAlignment}`,
  );
}

for (const requiredDefenseGoldBoostOrbPlacement of [
  'const angle = (index / 10) * Math.PI * 2 - Math.PI / 2;',
  '--boost-orb-x:${Math.cos(angle).toFixed(4)}',
  '--boost-orb-y:${Math.sin(angle).toFixed(4)}',
  '.defense-hud-xp .defense-xp-badge {\n  position: relative;\n  z-index: 31;',
  '.defense-hud-xp .defense-gold-boost-orbit {\n  position: absolute;',
  'z-index: 32;',
  "setStylePropertyIfChanged(enemyElement, 'z-index', String(4 + Math.round(position.y / 12)));",
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseGoldBoostOrbPlacement),
    true,
    `TD gold boost orbs should stay fixed above enemies from top clockwise: missing ${requiredDefenseGoldBoostOrbPlacement}`,
  );
}

for (const forbiddenDefenseGoldBoostOrbRotation of [
  'defense-gold-boost-orbit-spin',
  'animation: defense-gold-boost-orbit-spin',
  'defense-gold-boost-orb-breathe',
  'animation: defense-gold-boost-orb-breathe',
]) {
  assert.equal(
    styleSource.includes(forbiddenDefenseGoldBoostOrbRotation),
    false,
    `TD gold boost orbs should stay fixed without infinite CSS animation: found ${forbiddenDefenseGoldBoostOrbRotation}`,
  );
}

for (const [animationName, keyframeSource] of [
  ['gold boost orb', styleSource.match(/@keyframes defense-gold-boost-orb-breathe \{[\s\S]*?\n\}/)?.[0] ?? ''],
  ['gold boost badge', styleSource.match(/@keyframes defense-gold-boost-badge-pop \{[\s\S]*?\n\}/)?.[0] ?? ''],
] as const) {
  assert.equal(keyframeSource.includes('filter:'), false, `TD ${animationName} should animate transform/opacity, not runtime filters.`);
  assert.equal(keyframeSource.includes('drop-shadow('), false, `TD ${animationName} should not animate CSS drop-shadow.`);
}

for (const requiredDefenseMoneyPulseCleanup of [
  'const DEFENSE_MONEY_COUNTER_PULSE_MIN_INTERVAL_MS = 140;',
  'let lastDefenseMoneyCounterPulseAt = 0;',
  'let defenseMoneyPulseRemovalTimer: number | null = null;',
  'if (now - lastDefenseMoneyCounterPulseAt < DEFENSE_MONEY_COUNTER_PULSE_MIN_INTERVAL_MS)',
  "moneyHud.querySelector<HTMLElement>('.defense-money-pulse')",
  "counterAnimation.id = 'defense-money-counter-pulse';",
  'window.clearTimeout(defenseMoneyPulseRemovalTimer);',
  'left: 50%;\n  top: 18%;\n  min-width: 6ch;\n  translate: -50% -100%;',
  'transform: translate3d(0, -32px, 0) scale(1);',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseMoneyPulseCleanup),
    true,
    `TD money counter should replace stale pulse animations during reward bursts: missing ${requiredDefenseMoneyPulseCleanup}`,
  );
}

for (const forbiddenDefenseMoneyPulseLayoutRead of [
  'pulse.style.left = `${moneyValue.offsetLeft}px`',
  'pulse.style.top = `${moneyValue.offsetTop}px`',
  'pulse.style.width = `${moneyValue.offsetWidth}px`',
]) {
  assert.equal(
    hudSource.includes(forbiddenDefenseMoneyPulseLayoutRead),
    false,
    `TD money counter pulse should not force layout reads: found ${forbiddenDefenseMoneyPulseLayoutRead}`,
  );
}

for (const requiredDefenseTimedOneShotCleanup of [
  'const timedOneShotClassTimers = new WeakMap<HTMLElement, Map<string, number>>();',
  'function restartTimedOneShotClass(element: HTMLElement, className: string, durationMs: number): void',
  "restartTimedOneShotClass(defensePanelElement, 'is-damage-shaking', 340);",
  "restartTimedOneShotClass(healthHud, 'is-damage-shaking', 390);",
  "restartTimedOneShotClass(stage, 'is-gold-boosting', 1420);",
  "restartTimedOneShotClass(badgeElement, 'is-gold-boosting', 820);",
  "restartTimedOneShotClass(label, 'is-gold-boosting', 1420);",
]) {
  assert.equal(
    hudSource.includes(requiredDefenseTimedOneShotCleanup),
    true,
    `TD one-shot classes should remove themselves after their animation: missing ${requiredDefenseTimedOneShotCleanup}`,
  );
}

for (const removedDefenseHudXpRail of [
  'class="defense-xp-track"',
  'data-defense-xp-fill',
  '.defense-hud-xp .defense-xp-track',
  '.defense-hud-xp .defense-xp-track i',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(removedDefenseHudXpRail),
    false,
    `TD XP HUD should be a circular badge, not a horizontal bar: found ${removedDefenseHudXpRail}`,
  );
}

for (const requiredDefenseHudHealthTrack of [
  'style="--defense-health-progress:${healthPercent.toFixed(2)}%;--defense-health-value:${healthPercent.toFixed(2)}"',
  "setStylePropertyIfChanged(healthHud, '--defense-health-progress', `${healthPercent.toFixed(2)}%`);",
  "setStylePropertyIfChanged(healthHud, '--defense-health-value', healthPercent.toFixed(2));",
  "setDynamicText('defense-health-value', `${currentHealthDisplay}/${maxHealthDisplay}`);",
  'class="defense-health-track"',
  '<em data-defense-health-chip></em>',
  '<strong class="defense-hp-value" data-dynamic-value="defense-health-value">${currentHealthDisplay}/${maxHealthDisplay}</strong>',
  '.defense-health-track em',
  '.defense-health-track i',
  'transform: scaleX(calc(var(--defense-health-value, 0) / 100));',
  'background: linear-gradient(#ff6d5c, #b72d2b);',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseHudHealthTrack),
    true,
    `TD tower HUD health should use an XP-style red track: missing ${requiredDefenseHudHealthTrack}`,
  );
}

for (const removedDefenseHudHealthSprite of [
  'defenseHpSpriteFrame',
  'defenseHpSpriteStyle',
  'data-defense-hp-sprite',
  'defense-hp-sprite',
  'defense-health-badge',
  'defense-health-body',
  'defense-health-top',
  'hp-bar.png',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(removedDefenseHudHealthSprite),
    false,
    `TD tower HUD health should not use the old sprite bar anymore: found ${removedDefenseHudHealthSprite}`,
  );
}

for (const requiredDefenseMoneyCoinSize of [
  'width: 11.52px;',
  'height: 11.52px;',
  'background-size: 69.12px 11.52px;',
  'background-position: 0 0;',
  'DEFENSE_MONEY_POPUP_COIN_COUNT = 1',
  'mergeTarget.coinCount = DEFENSE_MONEY_POPUP_COIN_COUNT',
  'DEFENSE_MONEY_POPUP_TURBO_MAX_ACTIVE = 4',
  'state.defense.speedMultiplier >= 4',
  'function defenseMoneyVisibleCoinCount(_popup: GameState[\'defense\'][\'moneyPopups\'][number]): number',
  'return 1;',
  'function defenseMoneyPopupReady(popup: GameState[\'defense\'][\'moneyPopups\'][number]): boolean',
  'return popup.delay <= 0;',
  'function defenseMoneyPopupCounterReady(popup: GameState[\'defense\'][\'moneyPopups\'][number]): boolean',
  'return (popup.counterDelay ?? popup.delay ?? 0) <= 0;',
  'function defenseDisplayedSigils(state: GameState): number',
  '.filter((popup) => !defenseMoneyPopupCounterReady(popup))',
  'syncDefenseMoneyParticleGoal(actorsLayer, moneyHud);',
  'const DEFENSE_HUD_PERF_SLOW_FRAME_MS = 20;',
  'type DefenseHudPerfStats = {',
  'function getDefenseHudPerfStats(): DefenseHudPerfStats | null',
  'markHudPerfSection(\'actors-setup\');',
  'markHudPerfSection(\'enemies\');',
  'markHudPerfSection(\'attacks\');',
  'markHudPerfSection(\'money\');',
  'targetWindow.__libraryMagicHudPerf',
  "setStylePropertyIfChanged(actorsLayer, '--money-goal-x'",
  "setStylePropertyIfChanged(actorsLayer, '--money-goal-y'",
  'data-money-amount="+${formatGameNumber(popup.amount)}"',
  'data-money-heat="${defenseMoneyPopupHeat(popup.combo).toFixed(3)}"',
  'data-money-stack="${defenseMoneyPopupStack(popup.combo)}"',
  'if (popupElement.dataset.moneyAmount !== nextAmount)',
  'if (popupElement.dataset.moneyCoinCount !== desiredCoinCount)',
  '--money-counter-delay:${DEFENSE_MONEY_COUNTER_POPUP_DELAY_MS}ms',
  'animation-delay: var(--money-counter-delay, 0ms);',
  '.book-overlay .defense-money-popup b {\n  position: absolute;\n  left: var(--money-goal-x, 50%);',
  'top: var(--money-goal-y, 96.2%);',
  'text-align: center;',
  'left: var(--money-goal-x, 50%);',
  'top: var(--money-goal-y, 96.2%);',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}\n${actionsSource}`.includes(requiredDefenseMoneyCoinSize),
    true,
    `TD falling money coin should stay large but cheap enough for x4: missing ${requiredDefenseMoneyCoinSize}`,
  );
}

assert.equal(
  styleSource.includes('blue-slime/walk.png'),
  false,
  'Blue slime TD should use the compact runtime sheet so health bars stay close to the sprite.',
);

for (const forbiddenSlimeMovementHold of [
  'DEFENSE_SLIME_MOVEMENT_HOLD_MS',
  'defenseSlimeVisualPositions',
  'defenseEnemyVisualPosition',
]) {
  assert.equal(
    hudSource.includes(forbiddenSlimeMovementHold),
    false,
    `Blue slime TD should not freeze visual movement during the walk-frame hold: found ${forbiddenSlimeMovementHold}`,
  );
}

for (const requiredEnemyHealthLayer of [
  'defenseEnemyHealthBarMarkup(enemy)',
  'class="${defenseEnemyHealthBarClass(enemy)}"',
  '.defense-enemy-health-bar',
  'z-index: 3',
  'z-index: 4',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredEnemyHealthLayer),
    true,
    `TD enemy health bars should render in a dedicated layer below enemy sprites: missing ${requiredEnemyHealthLayer}`,
  );
}

for (const requiredTowerHealthHudShake of [
  '.defense-status-hud {\n  position: absolute;\n  z-index: 40;',
  "restartTimedOneShotClass(healthHud, 'is-damage-shaking', 390)",
  "restartOneShotClass(healthHud, 'is-chip-damage')",
  "window.setTimeout(() => healthHud.classList.remove('is-chip-damage'), 430);",
  "setStylePropertyIfChanged(healthHud, '--defense-health-chip-from', previousHealthPercent.toFixed(2));",
  "setStylePropertyIfChanged(healthHud, '--defense-health-chip-to', healthPercent.toFixed(2));",
  'const towerHealthRegenerated = lastDefenseDisplayedHealth !== null && currentHealth > lastDefenseDisplayedHealth;',
  "if (healthHud && towerHealthRegenerated && !healthHud.classList.contains('is-chip-heal'))",
  "restartOneShotClass(healthHud, 'is-chip-heal')",
  "window.setTimeout(() => healthHud.classList.remove('is-chip-heal'), 520);",
  '.defense-hud-health.is-damage-shaking',
  '.defense-hud-health.is-chip-damage .defense-health-track em',
  '.defense-hud-health.is-chip-damage .defense-health-track i',
  '.defense-hud-health.is-chip-heal .defense-health-track em',
  '.defense-hud-health.is-chip-heal .defense-health-track i',
  '@keyframes defense-hud-health-damage-shake',
  '@keyframes defense-hud-health-chip',
  '@keyframes defense-hud-health-damage-fill',
  'background: linear-gradient(#fff287, #f4b132);',
  '@keyframes defense-hud-health-heal-chip',
  '@keyframes defense-hud-health-heal-fill',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredTowerHealthHudShake),
    true,
    `TD tower HUD health should shake briefly when the tower takes damage: missing ${requiredTowerHealthHudShake}`,
  );
}

for (const requiredEnemyLayerOrdering of [
  "setStylePropertyIfChanged(enemyElement, 'z-index', String(4 + Math.round(position.y / 12)));",
  'defenseEnemyHealthBarMarkup(enemy)',
  'defenseEnemyMarkup(enemy)',
]) {
  assert.equal(
    hudSource.includes(requiredEnemyLayerOrdering),
    true,
    `TD enemies should keep normal spawn animations while using z-index for vertical depth: missing ${requiredEnemyLayerOrdering}`,
  );
}

for (const forbiddenEnemyLayerOrdering of [
  'const enemyLayerOrder',
  'sortableEnemyIds',
  'sortedEnemyLayerOrder',
  'actorsLayer.appendChild(enemyElement)',
]) {
  assert.equal(
    hudSource.includes(forbiddenEnemyLayerOrdering),
    false,
    `TD enemies should not be reordered with appendChild during combat because it churns DOM and can restart animations: found ${forbiddenEnemyLayerOrdering}`,
  );
}

assert.equal(
  styleSource.includes('.defense-enemy::after'),
  false,
  'TD enemy health bars should not be pseudo-elements on enemy sprites because they can cover neighboring monsters.',
);

for (const requiredEnemyHealthBarVisibility of [
  'function defenseEnemyHealthBarVisible',
  'enemy.health < enemy.maxHealth',
  'const shouldShowHealthBar = defenseEnemyHealthBarVisible(enemy);',
  'if (!healthBarElement && shouldShowHealthBar)',
  'healthBarElement.remove();',
]) {
  assert.equal(
    hudSource.includes(requiredEnemyHealthBarVisibility),
    true,
    `TD enemy health bars should only render after enemies take damage: missing ${requiredEnemyHealthBarVisibility}`,
  );
}

for (const requiredDamagePopupStability of [
  'function drawDefenseCanvasDamagePopup(',
  'const motion = defenseDamagePopupMotionValues(popup);',
  'context.globalAlpha = opacity;',
  'const fontSize = popup.kind === \'superCritical\' ? 64 : popup.kind === \'critical\' ? 48 : 32;',
  'function defenseDamageTextSprite(label: string, fontSize: number, color: string)',
  'DEFENSE_DAMAGE_TEXT_SPRITE_CACHE_LIMIT',
  'defenseDamageTextSprite(formatOneDecimalGameNumber(popup.amount), fontSize, defenseCanvasDamageColor(popup))',
  'context.drawImage(sprite.canvas, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDamagePopupStability),
    true,
    `TD damage popups should keep stable ids and offset away from enemy centers: missing ${requiredDamagePopupStability}`,
  );
}
for (const requiredDefenseDamagePopupColor of [
  "return '#ffd23c';",
  "return '#ff8a3c';",
  "return '#5aa0ff';",
  "return '#ff5ce0';",
]) {
  assert.equal(
    hudSource.includes(requiredDefenseDamagePopupColor),
    true,
    `TD damage popup colors should match the requested palette: missing ${requiredDefenseDamagePopupColor}`,
  );
}
assert.equal(
  styleSource.includes('.panel-size-small .defense-damage-popup'),
  false,
  'TD damage popup sizes should not be overridden in S size.',
);

const defenseOrbDefeatRule = styleSource.match(/\.defense-panel\.is-defeated \.defense-orb \{[\s\S]*?\n\}/)?.[0];
assert.ok(defenseOrbDefeatRule, 'TD orb should have a defeat-state rule.');
for (const requiredOrbDefeatAnimation of [
  'background-image: url("/assets/td/orb/orb-td-destroy.png")',
  'defense-orb-destroy 3000ms steps(1, end) both',
  'defense-orb-death-zoom 3000ms',
]) {
  assert.equal(
    defenseOrbDefeatRule.includes(requiredOrbDefeatAnimation),
    true,
    `TD orb destruction should play one 3s destroy sheet during defeat: missing ${requiredOrbDefeatAnimation}`,
  );
}
assert.equal(
  defenseOrbDefeatRule.includes('defense-orb-idle'),
  false,
  'TD orb destruction should not keep the idle loop running during defeat.',
);
for (const requiredOrbDeathEffect of [
  '.defense-panel.is-defeated .defense-orb::after',
  'animation: defense-orb-light-burst 2100ms steps(14, end) both;',
  '@keyframes defense-orb-light-burst',
  '58% {',
  'transform: scale(1.05) rotate(61deg);',
  '92% {',
  'transform: scale(1.94) rotate(160deg);',
  'transform: translate(calc(-50% - 1px), calc(-50% + 0.5px)) scale(1.34) rotate(-0.6deg);',
  'transform: translate(calc(-50% - 4px), calc(-50% + 3.5px)) scale(5.12) rotate(-2.55deg);',
]) {
  assert.equal(
    styleSource.includes(requiredOrbDeathEffect),
    true,
    `TD orb death should add increasingly strong vibration and ray burst: missing ${requiredOrbDeathEffect}`,
  );
}
assert.equal(
  styleSource.includes('defense-orb-light-shards'),
  false,
  'TD orb death should not render small light balls anymore.',
);

for (const requiredDefenseOrbShotRecoil of [
  'playDefenseOrbShotRecoil(shot);',
  "animation.id = 'defense-orb-shot-recoil'",
  'function defenseOrbShotRecoil',
  'const directionX = shotTarget.x - 50;',
  'x: -(directionX / length) * recoilStrength',
  'defenseOrbRecoilAnimation?.cancel();',
  'translate:',
]) {
  assert.equal(
    hudSource.includes(requiredDefenseOrbShotRecoil),
    true,
    `TD orb should recoil opposite to its shot direction without restarting sprite loops: missing ${requiredDefenseOrbShotRecoil}`,
  );
}

for (const requiredSkeletonFootAnchor of [
  '.defense-enemy.is-skeleton-mage',
  'blue-slime/walk-compact-outlined.png',
  'blue-slime/idle-compact-outlined.png',
  'blue-slime/attack-compact-outlined.png',
  'blue-slime/death-compact-outlined.png',
  'skeleton-mage-centered-outlined.png',
  'goblin-king/goblin-king-outlined.png',
  'bat/bat-sheet-outlined.png',
  'filter: none;',
  '.defense-enemy.is-goblin-king',
  '.defense-enemy.is-bat',
  'transform: translate(var(--enemy-x-px, 0px), var(--enemy-y-px, 0px)) translate(-50%, -100%) scaleX(var(--enemy-facing-scale));',
  'transform-origin: center bottom;',
  '.defense-enemy-health-bar.is-skeleton-mage',
  '--enemy-health-bar-y: 2px;',
]) {
  assert.equal(
    styleSource.includes(requiredSkeletonFootAnchor),
    true,
    `TD skeleton mage should be anchored at its feet so radial stop positions render on a circle: missing ${requiredSkeletonFootAnchor}`,
  );
}

for (const requiredLightningFootAnchor of [
  '--lightning-visible-bottom: -96.875%;',
  '--lightning-target-bottom-offset',
  'top: calc(var(--lightning-y) + var(--lightning-target-bottom-offset));',
  'is-target-skeleton-mage',
  'is-target-bat',
  'is-target-goblin-king',
  'is-target-slime',
  '--lightning-visual-scale: 1;',
  'lightning-strike-glow.png',
  '.defense-lightning-strike',
  'filter: none;',
  '.book-overlay[data-book-id="defense"].panel-size-large .defense-lightning-strike',
  '--lightning-visual-scale: 1.6;',
  'scale(var(--lightning-visual-scale))',
  'translate(-50%, var(--lightning-visible-bottom))',
  'transform-origin: 50% 96.875%;',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredLightningFootAnchor),
    true,
    `TD lightning should align its visible bottom pixel to each enemy visible-bottom line: missing ${requiredLightningFootAnchor}`,
  );
}

for (const requiredSkeletonProjectileSprite of [
  'Fire%20attack%20TD%20glow.png',
  'background-size: 500% 100%',
  'animation: defense-fire-shot-travel var(--shot-duration, 520ms) cubic-bezier(0.16, 0.72, 0.22, 1) both;',
  'animation: defense-enemy-fireball-travel var(--enemy-shot-duration, 580ms) cubic-bezier(0.2, 0.78, 0.24, 1) both;',
  'targetKind: target.kind',
  'targetKind: enemy.kind',
  'defenseSkeletonMageProjectileOriginPoint(projectile)',
  'defenseEnemyImpactPoint({ lane: shot.lane, distance: shot.distance, kind: shot.targetKind })',
  'defenseEnemyImpactPoint({ lane: popup.lane, distance: popup.distance, kind: popup.targetKind })',
  "if (popup.source === 'normal')",
  "if (popup.source === 'ice')",
  'function syncDefenseEffectsCanvas(state: GameState): void',
  'function drawDefenseCanvasImpact(',
  '/assets/td/effects/fireball-impact.png',
  '/assets/td/ice/ice-aura-strip.png',
  '--fireball-impact-scale: 1.2;',
  'opacity: 0.6;',
  'transform: translate(-50%, -50%) scale(var(--fireball-impact-scale));',
  'background-size: 800% 100%;',
  'animation: defense-fireball-impact calc(360ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  '@keyframes defense-fireball-impact',
  '.defense-impact-burst.is-ice-contact',
  'background-image: url("/assets/td/ice/ice-aura-strip.png");',
  'background-size: 6100% 100%;',
  'defense-ice-contact-fade calc(560ms * var(--defense-time-scale, 1))',
  '@keyframes defense-ice-contact-fade',
  '87.5%,',
]) {
  assert.equal(
    `${hudSource}\n${actionsSource}\n${styleSource}`.includes(requiredSkeletonProjectileSprite),
    true,
    `TD fireballs should use the fireball strip and aim at the target visible center: missing ${requiredSkeletonProjectileSprite}`,
  );
}

for (const requiredEnemyAnimationTiming of [
  '.defense-enemy.is-skeleton-mage.is-attacking {\n  background-position: 0 var(--mage-row-attack);\n  animation: defense-skeleton-mage-attack',
  '.defense-enemy.is-goblin-king.is-attacking {\n  background-position: 0 var(--goblin-row-attack-a);\n  animation: defense-goblin-king-attack',
  '.defense-enemy.is-bat.is-attacking {\n  background-position: 0 100%;\n  animation: defense-bat-attack',
]) {
  assert.equal(
    styleSource.includes(requiredEnemyAnimationTiming),
    true,
    `TD enemy sprites should run per-state spritesheet animations without rebuilding DOM nodes: missing ${requiredEnemyAnimationTiming}`,
  );
}

for (const requiredEnemyCssAnimation of [
  'animation: defense-enemy-walk calc(520ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-enemy-idle calc(880ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-enemy-attack calc(760ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-enemy-death calc(720ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-skeleton-mage-walk calc(620ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-goblin-king-walk calc(680ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-bat-fly calc(520ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-bat-death calc(700ms * var(--defense-time-scale, 1)) steps(1, end) both;',
]) {
  assert.equal(
    styleSource.includes(requiredEnemyCssAnimation),
    true,
    `TD enemy sprites should keep restored walk/idle/attack/death animations: missing ${requiredEnemyCssAnimation}`,
  );
}

for (const requiredEnemyLayerStability of [
  "setStylePropertyIfChanged(enemyElement, 'z-index', String(4 + Math.round(position.y / 12)));",
  'healthBarElement.remove();',
  'enemyElement.remove();',
  "setStylePropertyIfChanged(enemyElement, '--enemy-x-px'",
  "setStylePropertyIfChanged(enemyElement, '--enemy-y-px'",
]) {
  assert.equal(
    hudSource.includes(requiredEnemyLayerStability),
    true,
    `TD enemies should update position in place and avoid depth reordering churn: missing ${requiredEnemyLayerStability}`,
  );
}

assert.equal(
  styleSource.includes('--defense-enemy-outline-filter:'),
  false,
  'TD enemies should use pre-outlined sprites instead of a permanent CSS drop-shadow filter.',
);
assert.equal(
  styleSource.includes('filter: var(--defense-enemy-outline-filter);'),
  false,
  'TD enemies should not reintroduce the expensive runtime outline filter.',
);

for (const requiredEnemyHitFeedback of [
  'const defenseEnemyHealthSnapshots = new Map<string, number>();',
  'const previousHealth = defenseEnemyHealthSnapshots.get(enemyId);',
  'if (previousHealth !== undefined && enemy.health < previousHealth)',
  "playDefenseEnemyHitFeedback(enemyElement, enemy.lastHitSource ?? 'normal', position);",
  'const defenseEnemyHitFeedbackTimes = new WeakMap<HTMLElement, number>();',
  'shouldPlayTimedElementFeedback(defenseEnemyHitFeedbackTimes, enemyElement, 90)',
  "flashAnimation.id = 'defense-enemy-hit-feedback';",
  "const outlineFilter = 'none';",
  "const flashFilter = 'brightness(2.35) saturate(0.68) contrast(1.12)';",
  'filter: flashFilter',
  'filter: outlineFilter',
  "enemyElement.classList.add('is-lightning-hitstop');",
  "flinchAnimation.id = 'defense-enemy-flinch-feedback';",
  'syncDefenseEffectsCanvas(state);',
  'function drawDefenseCanvasImpact(',
  '.defense-enemy-health-bar.is-chip-damage em',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredEnemyHitFeedback),
    true,
    `TD enemies should use white flash, impact burst, flinch/hitstop, and chip health feedback without restarting sprite animations: missing ${requiredEnemyHitFeedback}`,
  );
}

for (const forbiddenEnemyHitFeedback of ["hue-rotate(-44deg)", "opacity: '0.5'", 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.9))']) {
  assert.equal(
    hudSource.includes(forbiddenEnemyHitFeedback),
    false,
    `TD enemy hit feedback should no longer use the old red flash: found ${forbiddenEnemyHitFeedback}`,
  );
}

for (const requiredDefenseSkillGridLimit of [
  '--td-skill-visible-card-limit: 8;',
  '--td-skill-visible-card-rows: 4;',
  '--td-skill-visible-grid-height: 162px;',
  'max-height: var(--td-skill-visible-grid-height);',
  'overscroll-behavior: contain;',
  'scrollbar-gutter: stable;',
]) {
  assert.equal(
    styleSource.includes(requiredDefenseSkillGridLimit),
    true,
    `TD skill grid should show at most 8 skill cards before scrolling: missing ${requiredDefenseSkillGridLimit}`,
  );
}

for (const requiredDefenseSkillTabLayout of [
  "label: 'Element'",
  "label: 'Other'",
  "defenseSkillShopCard(state, 'lightningDamage'",
  "defenseSkillShopCard(state, 'lightningSpeed'",
  "defenseSkillShopCard(state, 'lightningCount'",
  "defenseSkillShopCard(state, 'health'",
  "defenseSkillShopCard(state, 'healthRegen'",
  "defenseSkillShopCard(state, 'goldMultiplier'",
  "defenseSkillShopCard(state, 'baseSpeed'",
  "'Damage x'",
  "'Critical Chance'",
  "'Critical DMG x'",
  "'Super Critical Chance'",
  "'Super Critical DMG x'",
  "'Lightning'",
  "'Lightning Damage'",
  "'Lightning Speed'",
  "'Ice Damage'",
  "'Ice Speed'",
  "'Ice Range'",
  "'Ice Slow'",
  "HP +",
  "HP Regen",
  "Gold +",
  "Gold x",
  "Game Speed",
]) {
  assert.equal(
    defenseSkillShopTabsSource.includes(requiredDefenseSkillTabLayout),
    true,
    `TD skill tabs should keep the requested Attack / Element / Other arrangement: missing ${requiredDefenseSkillTabLayout}`,
  );
}

assert.equal(
  hudSource.includes("defenseSkillShopCard(state, 'health', 'HP +', `${formatGameNumber(defenseMaxTowerHealth(state))}`, '+2 max hp')"),
  true,
  'TD HP + skill card should show only max health, not current/max health.',
);
assert.equal(
  hudSource.includes("defenseSkillShopCard(state, 'health', 'HP +', `${formatGameNumber(state.defense.towerHealth)}/${formatGameNumber(defenseMaxTowerHealth(state))}`"),
  false,
  'TD HP + skill card should not display current/max health like 2/2.',
);

for (const requiredDefenseSkillNumberFormat of [
  'function formatOneDecimalGameNumber(value: number): string',
  'return formatFixedGameNumber(value, 1).replace(/,0$/, \'\');',
  'function formatTwoDecimalGameNumber(value: number): string',
  "`${formatOneDecimalGameNumber(defenseTowerDamage(state))} dmg`",
  '`(+${formatOneDecimalGameNumber(defenseTowerDamageUpgradeDelta(state))})`',
  '`(+${formatFixedGameNumber(defenseLightningDamageUpgradeDelta(state), 1)})`',
  '`(+${formatFixedGameNumber(defenseIceDamageUpgradeDelta(state), 1)})`',
  '`${formatFixedGameNumber(defenseEnemyReward(state), 1)}`',
  '`(+${formatFixedGameNumber(defenseEnemyRewardUpgradeDelta(state), 1)})`',
  '`${formatTwoDecimalGameNumber(defenseTowerAttackInterval(state))}s`',
  '`x${formatTwoDecimalGameNumber(defenseSkillDamageMultiplier(state))}`',
  '`x${formatTwoDecimalGameNumber(2 + state.defenseSkills.criticalMultiplier * 0.1)}`',
  '`x${formatTwoDecimalGameNumber(3 + state.defenseSkills.superCriticalMultiplier * 0.25)}`',
  '`${formatOneDecimalGameNumber(defenseLightningDamage(state))} dmg`',
  '`${formatTwoDecimalGameNumber(defenseLightningAttackInterval(state))}s`',
  '`${formatOneDecimalGameNumber(defenseIceDamage(state))} dmg`',
  '`${formatTwoDecimalGameNumber(defenseIceAttackInterval(state))}s`',
  '`${formatTwoDecimalGameNumber(defenseTowerHealthRegenPerSecond(state))}/s`',
  '${formatOneDecimalGameNumber(state.defense.xp)} / ${formatOneDecimalGameNumber(experienceToNextLevel)}',
  '${formatOneDecimalGameNumber(defense.xp)} / ${formatOneDecimalGameNumber(experienceToNextLevel)}',
  'defenseDamageTextSprite(formatOneDecimalGameNumber(popup.amount), fontSize, defenseCanvasDamageColor(popup))',
]) {
  assert.equal(
    hudSource.includes(requiredDefenseSkillNumberFormat),
    true,
    `TD numeric displays should keep requested fixed decimal precision: missing ${requiredDefenseSkillNumberFormat}`,
  );
}

for (const requiredDefensePngSkillIcon of [
  'function skillShopPngIcon(name: string, label: string): string',
  'class="skill-shop-png-icon is-${name}"',
  'src="/assets/td/icons/${name}.png"',
  "skillShopPngIcon('atk_damage'",
  "skillShopPngIcon('atk_damage_all'",
  "skillShopPngIcon('atk_speed'",
  "skillShopPngIcon('atk_range'",
  "skillShopPngIcon('atk_crit_chance'",
  "skillShopPngIcon('atk_crit_mult'",
  "skillShopPngIcon('atk_supercrit_chance'",
  "skillShopPngIcon('atk_supercrit_mult'",
  "skillShopPngIcon('elem_lightning'",
  "skillShopPngIcon('elem_lightning_dmg'",
  "skillShopPngIcon('elem_lightning_speed'",
  "skillShopPngIcon('elem_ice_dmg'",
  "skillShopPngIcon('elem_ice_speed'",
  "skillShopPngIcon('elem_ice_range'",
  "skillShopPngIcon('elem_ice_slow'",
  "skillShopPngIcon('other_health'",
  "skillShopPngIcon('other_health_regen'",
  "skillShopPngIcon('other_gold_plus'",
  "skillShopPngIcon('other_gold_x'",
  "skillShopPngIcon('game_speed'",
  '.skill-shop-card-icon .skill-shop-png-icon',
  'image-rendering: pixelated;',
  'object-fit: contain;',
  "type SkillShopElementKind = 'lightning' | 'ice';",
  'elementKind?: SkillShopElementKind;',
  'data-element-kind="${card.elementKind}"',
  'function defenseSkillElementKind(skillId: DefenseSkillId): SkillShopElementKind | undefined',
  "return 'lightning';",
  "return 'ice';",
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefensePngSkillIcon),
    true,
    `TD skill cards should use the requested PNG artwork: missing ${requiredDefensePngSkillIcon}`,
  );
}

for (const removedDefenseOtherXpSkillReference of [
  "defenseSkillShopCard(state, 'xpGain'",
  "defenseSkillShopCard(state, 'xpMultiplier'",
  "case 'xpGain':",
  "case 'xpMultiplier':",
  "skillShopPngIcon('other_xp_plus'",
  "skillShopPngIcon('other_xp_x'",
  '`+${formatOneDecimalGameNumber(state.defenseSkills.xpGain)}`',
  '`x${formatOneDecimalGameNumber(defenseExperienceMultiplier(state))}`',
]) {
  assert.equal(
    `${hudSource}\n${defenseSkillShopTabsSource}`.includes(removedDefenseOtherXpSkillReference),
    false,
    `TD XP skills should be removed from the skill shop: found ${removedDefenseOtherXpSkillReference}`,
  );
}

for (const removedDefenseSkillReference of [
  "'waveHeal'",
  "'moneyPerWave'",
  'Wave Heal',
  'Gold / Wave',
  'defenseTowerWaveHeal',
  'defenseMoneyPerWave',
]) {
  assert.equal(
    `${hudSource}\n${actionsSource}\n${styleSource}`.includes(removedDefenseSkillReference),
    false,
    `TD removed skills should not be exposed anymore: found ${removedDefenseSkillReference}`,
  );
}

const elementTabIndex = defenseSkillShopTabsSource.indexOf("label: 'Element'");
const otherTabIndex = defenseSkillShopTabsSource.indexOf("label: 'Other'");
const lightningCountIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'lightningCount'");
const iceDamageIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'iceDamage'");
const lightningDamageIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'lightningDamage'");
const iceSpeedIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'iceSpeed'");
const iceRangeIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'iceRange'");
const lightningSpeedIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'lightningSpeed'");
const healthIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'health'");
assert.ok(elementTabIndex < lightningDamageIndex, 'TD lightning skills should be inside the Element tab.');
assert.ok(lightningDamageIndex < otherTabIndex, 'TD lightning skills should appear before Other starts.');
assert.ok(otherTabIndex < healthIndex, 'TD old defense skills should move into the Other tab.');
assert.ok(
  iceDamageIndex < lightningCountIndex &&
    lightningCountIndex < iceSpeedIndex &&
    iceSpeedIndex < lightningDamageIndex &&
    lightningDamageIndex < iceRangeIndex &&
    iceRangeIndex < lightningSpeedIndex,
  'TD Element tab order should be Ice Damage, Lightning, Ice Speed, Lightning Damage, Ice Range, Lightning Speed.',
);
assert.equal(hudSource.includes("case 'goldMultiplier':"), true, 'TD Gold Multiplier should have a skill delta.');
assert.equal(hudSource.includes("return '(+10%)';"), true, 'TD Gold Multiplier should show +10% per level.');
assert.equal(hudSource.includes("case 'baseSpeed':"), true, 'TD Base Speed should have a skill delta and icon.');
assert.equal(hudSource.includes("return '(+0.1x)';"), true, 'TD Base Speed should show +0.1x per level.');

for (const requiredDefenseWaveSpacing of [
  'const DEFENSE_WAVE_MARKER_STEP_PERCENT = 24;',
  'const DEFENSE_WAVE_RAIL_STEP_PERCENT = 33;',
  'const waveSlide = waveProgress * DEFENSE_WAVE_MARKER_STEP_PERCENT;',
  'const waveFillProgress = waveProgress * DEFENSE_WAVE_RAIL_STEP_PERCENT;',
  'const segment = DEFENSE_WAVE_MARKER_STEP_PERCENT;',
  'const railSegment = DEFENSE_WAVE_RAIL_STEP_PERCENT;',
  'baseX: 50 - segment',
  'baseX: 50 + segment',
  'baseX: 50 + segment * 2',
  '--wave-marker-step:${segment.toFixed(3)}%',
  '--wave-rail-step:${railSegment.toFixed(3)}%',
  'left: calc(50% - var(--wave-rail-step, 33%));',
  'right: calc(50% - var(--wave-rail-step, 33%));',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseWaveSpacing),
    true,
    `TD wave markers should use the tighter marker spacing without moving the rail: missing ${requiredDefenseWaveSpacing}`,
  );
}

for (const requiredDefenseIceRangeCircle of [
  "let range = arena.querySelector<HTMLElement>('.defense-ice-range');",
  'range?.remove();',
  "range = arena.querySelector<HTMLElement>('.defense-ice-range');",
  "setStylePropertyIfChanged(range, '--defense-ice-range-scale', iceRangeScale);",
  '<i class="defense-ice-range" style="--defense-ice-range-scale:${rangeScale}" aria-hidden="true"></i>',
  '.defense-ice-range',
  'border: 3px solid rgba(82, 191, 255, 0.82);',
  'transform: translate(-50%, -50%) scale(var(--defense-ice-range-scale, 0.15));',
  'class="defense-ice-aura"',
  'defenseIceFlakeMarkup',
  'class="defense-ice-bloom"',
  'class="defense-ice-body"',
  'class="defense-ice-veins"',
  'class="defense-ice-sweep defense-ice-sweep-1"',
  'class="defense-ice-ring defense-ice-ring-1"',
  'class="defense-ice-rim"',
  '.defense-ice-aura > *',
  '.defense-panel.is-paused .defense-ice-aura *',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseIceRangeCircle),
    true,
    `TD ice attack should render a blue range circle and a clipped aura sprite that fills it: missing ${requiredDefenseIceRangeCircle}`,
  );
}

for (const requiredDefenseSkillLocks of [
  'defenseSkillLocked,',
  'const isLocked = defenseSkillLocked(state, skillId);',
  "card.classList.toggle('is-locked', isLocked);",
  "card.isLocked ? 'is-locked' : ''",
  "case 'iceSpeed':",
  "case 'iceRange':",
  "case 'iceSlow':",
  "case 'lightningDamage':",
  "case 'lightningSpeed':",
  "deltaElement.toggleAttribute('hidden', snapshot.isLocked || snapshot.delta.length === 0);",
  "setInnerHTMLIfChanged(buyElement, snapshot.isLocked ? ''",
  '<small data-skill-card-delta ${!card.isLocked && card.delta ?',
  '${card.isLocked ? \'\' : card.isMaxed ? \'<b>Max</b>\' : card.costHtml}',
  '.skill-shop-card.is-locked',
  '.defense-skill-dock .skill-shop-card.is-locked {',
  'linear-gradient(180deg, #707783, #3d434c)',
  '.defense-skill-dock .skill-shop-card.is-locked > *',
  'visibility: hidden;',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseSkillLocks),
    true,
    `TD element skills should visually lock behind their activator skill: missing ${requiredDefenseSkillLocks}`,
  );
}

assert.equal(hudSource.includes('<b>Locked</b>'), false, 'TD locked skill cards should not display Locked text.');
assert.equal(hudSource.includes('Requiert Ice Damage niveau 1'), false, 'TD locked skill cards should not display unlock text.');
assert.equal(hudSource.includes('Requiert Lightning niveau 1'), false, 'TD locked skill cards should not display unlock text.');

for (const requiredDefenseSkillTabCascade of [
  'let lastDefenseSkillDockTab: DefenseSkillShopTabId | null = null;',
  'const animateCardCascade = lastDefenseSkillDockTab !== null && lastDefenseSkillDockTab !== defenseSkillShopTab;',
  'animateCardCascade',
  'skillShopCard(card, activeTab.theme, options.animateCardCascade ? index : undefined)',
  "const cascadeClass = cascadeIndex === undefined ? '' : ' is-tab-entering';",
  'style="--skill-card-index:${cascadeIndex}"',
  '.defense-skill-dock .skill-shop-card.is-tab-entering',
  'animation: defense-skill-tab-enter 240ms cubic-bezier(0.2, 0.8, 0.3, 1) both;',
  'animation-delay: calc(var(--skill-card-index, 0) * 35ms);',
  '@keyframes defense-skill-tab-enter',
  'translateY(calc(var(--td-skill-base-y) + 12px)) scale(0.96)',
  'function cleanupSkillTabEnterAnimations(root: ParentNode): void',
  "card.classList.remove('is-tab-entering');",
  "card.style.removeProperty('--skill-card-index');",
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseSkillTabCascade),
    true,
    `TD skill tab changes should cascade skill cards without restarting hover animations: missing ${requiredDefenseSkillTabCascade}`,
  );
}

for (const requiredStableSkillHover of [
  'function clearOneShotHoverTarget(element: HTMLElement): void',
  'clearOneShotHoverTarget(card);',
  '.skill-shop-card:hover:not(:disabled):not(.is-unaffordable):not(.is-locked)',
  '.defense-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable):not(.is-locked)',
  '.mana-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable):not(.is-locked)',
  '.mana-skill-dock .skill-shop-card:hover:not(:disabled):not(.is-unaffordable):not(.is-locked)',
  '.mana-skill-dock .skill-shop-card:active:not(:disabled):not(.is-unaffordable):not(.is-locked)',
  '.mana-skill-dock .skill-shop-card.is-hover-bouncing.is-unaffordable',
  '.defense-skill-dock .skill-shop-card-grid {',
  '--td-skill-visible-grid-height: 170px;',
  'padding: 4px 6px;',
  'margin: -4px;',
  'outline: 2px solid rgba(255, 244, 188, 0.72);',
  'outline-offset: -2px;',
  'animation: defense-skill-hover-bounce 180ms cubic-bezier(0.2, 0.86, 0.24, 1) both;',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredStableSkillHover),
    true,
    `TD skill hover should stay stable and non-reactive on locked/disabled cards: missing ${requiredStableSkillHover}`,
  );
}

const defenseSkillHoverBounceKeyframes = styleSource.match(/@keyframes defense-skill-hover-bounce \{[\s\S]*?\n\}/)?.[0];
assert.ok(defenseSkillHoverBounceKeyframes, 'TD skill hover keyframes should exist.');
assert.equal(
  defenseSkillHoverBounceKeyframes.includes('28%'),
  false,
  'TD skill hover should not use multiple rebound peaks.',
);
assert.equal(
  defenseSkillHoverBounceKeyframes.includes('scale(1.045)'),
  true,
  'TD skill hover should settle at the same visual scale as the CSS hover state.',
);

for (const requiredDefenseAnimationCleanup of [
  'function cleanupFinishedAnimation(animation: Animation): void',
  "animation.addEventListener('finish', () => animation.cancel(), { once: true });",
  'function shouldPlayTimedElementFeedback(timestamps: WeakMap<HTMLElement, number>, element: HTMLElement, cooldownMs: number): boolean',
  'shouldPlayTimedElementFeedback(defenseEnemyHitFeedbackTimes, enemyElement, 90)',
  'shouldPlayTimedElementFeedback(defenseEnemyFlinchFeedbackTimes, enemyElement, 140)',
  'cleanupFinishedAnimation(flashAnimation);',
  "flinchAnimation.id = 'defense-enemy-flinch-feedback';",
  'cleanupFinishedAnimation(flinchAnimation);',
  'cleanupFinishedAnimation(animation);',
  'const counterAnimation = moneyHud.animate(',
  'cleanupFinishedAnimation(counterAnimation);',
  'const levelAnimationRunning = badgeElement',
  "animation.id === 'defense-level-badge-pop' && animation.playState === 'running'",
  "stage.querySelector('.defense-level-spark')",
]) {
  assert.equal(
    hudSource.includes(requiredDefenseAnimationCleanup),
    true,
    `TD combat feedback animations should be cleaned up after finishing: missing ${requiredDefenseAnimationCleanup}`,
  );
}

for (const requiredDefenseMaxSkillRenderBudget of [
  'function mapDefenseActorElements(root: HTMLElement): DefenseActorElementMaps',
  'for (const child of root.children)',
  "child.classList.contains('is-pooled-hidden')",
  'shotPool: HTMLElement[];',
  'impactPool: HTMLElement[];',
  'moneyPopupPool: HTMLElement[];',
  'function activateDefensePooledIconEffect(pool: HTMLElement[], options:',
  'function activateDefenseShotElement(pool: HTMLElement[], shot: GameState[\'defense\'][\'shots\'][number]): HTMLElement',
  'function activateDefenseEnemyProjectileElement(',
  'function activateDefenseLightningStrikeElement(',
  'function activateDefenseMoneyPopupElement(pool: HTMLElement[], popup: GameState[\'defense\'][\'moneyPopups\'][number]): HTMLElement',
  'function syncDefenseMoneyPopupElement(',
  'const shotElement = activateDefenseShotElement(actorElements.shotPool, shot);',
  'const projectileElement = activateDefenseEnemyProjectileElement(actorElements.enemyProjectilePool, projectile);',
  'const strikeElement = activateDefenseLightningStrikeElement(',
  'const popupElement = activateDefenseMoneyPopupElement(actorElements.moneyPopupPool, popup);',
  'syncDefenseMoneyPopupElement(existingPopup, popup, false);',
  'for (const popup of state.defense.moneyPopups) {',
  'if (!defenseMoneyPopupReady(popup))',
  'const enemyById = new Map(state.defense.enemies.map((enemy) => [enemy.id, enemy] as const));',
  'function deactivateDefensePooledEffect(element: HTMLElement',
  "element.classList.add('defense-pooled-effect', 'is-pooled-hidden');",
  "animation: none !important;",
  "setStylePropertyIfChanged(enemyElement, '--enemy-x-px'",
  "setStylePropertyIfChanged(enemyElement, '--enemy-y-px'",
  'lastDefenseSkillCardDynamicSignature',
  'function defenseSkillCardDynamicSignature(state: GameState): string',
  'const DEFENSE_MONEY_GOAL_CACHE_MS = 60_000;',
  'defenseActorsSizeCache.element === actorsLayer &&',
  'defenseEffectsCanvasSizeCache.element === canvas &&',
  'const DEFENSE_DYNAMIC_HUD_MIN_INTERVAL_MS = 1000 / 60;',
  'let lastDefenseDynamicHudUpdateAt = 0;',
  'function shouldSkipDefenseDynamicHudFrame(): boolean',
  'if (shouldSkipDefenseDynamicHudFrame())',
  'lastDefenseCleanupPulse',
  'function flushDefenseWaveRenderMemory(actorsLayer: HTMLElement): void',
  'const DEFENSE_RENDER_MEMORY_PRUNE_CHILD_LIMIT = 80;',
  'if (actorsLayer.childElementCount <= DEFENSE_RENDER_MEMORY_PRUNE_CHILD_LIMIT)',
  'function cachedDefenseActorsSize(actorsLayer: HTMLElement): { width: number; height: number }',
  'function cachedDefenseEffectsCanvasSize(canvas: HTMLCanvasElement): { width: number; height: number }',
  "if (isBookPanelOpen(state, 'defense'))",
  "dynamicResourceGainSnapshots.set('sigils', Math.floor(state.resources.sigils));",
  'const defenseEnemyHitFeedbackTimes = new WeakMap<HTMLElement, number>();',
  'function shouldPlayTimedElementFeedback(',
  'let defenseOrbRecoilAnimation: Animation | null = null;',
  'defenseOrbRecoilAnimation?.cancel();',
  "translate: `${recoil.x.toFixed(2)}px ${recoil.y.toFixed(2)}px`",
  'function pulseDefenseAnimationClock(defensePanelElement: HTMLElement, timeScale: string): void',
  "defensePanelElement.style.setProperty('--defense-time-scale', (numericTimeScale + 0.0001).toFixed(4));",
  'window.requestAnimationFrame(() =>',
  "'.defense-pooled-effect.is-pooled-hidden'",
  'dynamicTextSnapshots',
  'transition: none;',
  'Fire%20attack%20TD%20glow.png',
  'Fire%20attack%20TD%20enemy%20glow.png',
  'money-glow.png',
  'lightning-strike-glow.png',
  'class="defense-effects-canvas"',
  'function syncDefenseEffectsCanvas(state: GameState): void',
  'function drawDefenseCanvasImpact(',
  'function drawDefenseCanvasDamagePopup(',
  "defenseEffectImage('/assets/td/effects/fireball-impact.png')",
  "defenseEffectImage('/assets/td/ice/ice-aura-strip.png')",
  'const frameCount = 61;',
  'function defenseDamageTextSprite(label: string, fontSize: number, color: string)',
  'context.drawImage(sprite.canvas, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);',
  'contain: layout paint style;',
  'opacity: 0.56;',
  'transform: rotate(10deg);',
  'transform: rotate(196deg);',
  'transform: translate(26.4%, -25.6%) rotate(0deg);',
  '.defense-impact-burst.is-ice-contact',
  'background-image: url("/assets/td/ice/ice-aura-strip.png");',
  'defense-ice-contact-fade calc(560ms * var(--defense-time-scale, 1))',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseMaxSkillRenderBudget),
    true,
    `TD max-skill rendering should keep expensive effects bounded: missing ${requiredDefenseMaxSkillRenderBudget}`,
  );
}

for (const requiredDefenseWaveCleanupStatePulse of [
  'function resetDefenseWaveEntityIds(defense: GameState',
  'defense.nextEnemyId = 1;',
  'defense.nextEnemyProjectileId = 1;',
  'resetDefenseWaveEntityIds(defense);',
  'function pulseDefenseCleanup(defense: GameState',
  'Number.isFinite(defense.cleanupPulse)',
  'pulseDefenseCleanup(defense);',
]) {
  assert.equal(
    actionsSource.includes(requiredDefenseWaveCleanupStatePulse),
    true,
    `TD wave completion should pulse invisible render cleanup safely: missing ${requiredDefenseWaveCleanupStatePulse}`,
  );
}

for (const forbiddenDefenseTickAllocation of [
  'state.defense.shots = state.defense.shots.filter',
  'state.defense.lightningStrikes = state.defense.lightningStrikes.filter',
  'activeProjectiles.push({ ...projectile, timer })',
  '.map((popup) => ({ ...popup, timer:',
  'return { ...popup, delay, counterDelay, timer };',
  "marginLeft: `${recoil.x.toFixed(2)}px`",
  "marginTop: `${recoil.y.toFixed(2)}px`",
  "hasRunningAnimation(enemyElement, 'defense-enemy-hit-feedback')",
]) {
  assert.equal(
    actionsSource.includes(forbiddenDefenseTickAllocation),
    false,
    `TD transient effect ticks should compact arrays in place instead of allocating every frame: ${forbiddenDefenseTickAllocation}`,
  );
}

assert.equal(
  sceneSource.includes('state.openBookPanels.length === 0 && previousStock !== undefined && resourceStock > previousStock'),
  true,
  'Library shelf resource gain popups should stay disabled while a mini-game panel is open.',
);

for (const forbiddenDefenseRenderCap of [
  'DEFENSE_LIGHTNING_VISIBLE_LIMIT',
  'DEFENSE_IMPACT_BURST_VISIBLE_LIMIT',
  'lightningStrikes.slice(-',
  'damagePopups.slice(-',
  'completedDefenseImpactIds',
  'bindDefenseImpactBurstLifecycle',
  'DEFENSE_IMPACT_BURST_FALLBACK_LIFETIME_MS',
  'defenseDamagePopupMarkup',
  'defenseImpactBurstMarkup',
  'visibleImpactPopups',
  'defense.damagePopups.map((popup) => defenseDamagePopupMarkup(popup))',
]) {
  assert.equal(
    hudSource.includes(forbiddenDefenseRenderCap),
    false,
    `TD combat rendering should not hide animations behind visual caps: found ${forbiddenDefenseRenderCap}`,
  );
}

assert.equal(
  /\.defense-enemy \{[\s\S]*?transition: none;/.test(styleSource),
  true,
  'TD enemies should not run a CSS transform transition while JS updates their position every frame.',
);

assert.equal(
  /\.defense-enemy \{[\s\S]*?transition: transform 140ms linear;/.test(styleSource),
  false,
  'TD enemies should not reintroduce transform transitions on the movement hot path.',
);

for (const [blockName, blockSource] of [
  ['lightning', styleSource.match(/\.defense-lightning-strike \{[\s\S]*?\n\}/)?.[0] ?? ''],
  ['tower shot', styleSource.match(/\.defense-shot \{[\s\S]*?\n\}/)?.[0] ?? ''],
  ['enemy projectile', styleSource.match(/\.defense-enemy-projectile \{[\s\S]*?\n\}/)?.[0] ?? ''],
  ['money coin', styleSource.match(/\.book-overlay \.defense-money-popup i \{[\s\S]*?\n\}/)?.[0] ?? ''],
] as const) {
  assert.equal(blockSource.includes('filter: none;'), true, `TD ${blockName} should avoid runtime CSS filters.`);
  assert.equal(blockSource.includes('drop-shadow('), false, `TD ${blockName} should use pre-baked glow sprites, not CSS drop-shadow.`);
}

assert.equal(
  styleSource.match(/\.defense-shot::before \{[\s\S]*?\n\}/)?.[0].includes('content: none;'),
  true,
  'TD tower shots should rely on the pre-baked glow sprite instead of an extra blurred pseudo-element.',
);

for (const [animationName, keyframeSource] of [
  ['tower shot', styleSource.match(/@keyframes defense-fire-shot-travel \{[\s\S]*?\n\}/)?.[0] ?? ''],
  ['enemy projectile', styleSource.match(/@keyframes defense-enemy-fireball-travel \{[\s\S]*?\n\}/)?.[0] ?? ''],
  ['money coin', styleSource.match(/@keyframes defense-money-coin-flight \{[\s\S]*?\n\}/)?.[0] ?? ''],
] as const) {
  assert.equal(keyframeSource.includes('left:'), false, `TD ${animationName} should animate translate, not layout left.`);
  assert.equal(keyframeSource.includes('top:'), false, `TD ${animationName} should animate translate, not layout top.`);
}

for (const requiredDefenseAttackAnchor of [
  'defenseEnemyVisibleCenter({ lane: shot.lane, distance: shot.distance, kind: shot.targetKind })',
  'function defenseTowerShotAngle(shotTarget: DefensePoint): number',
  'return Math.atan2(shotTarget.y - 50, shotTarget.x - 50) * (180 / Math.PI) - 90;',
  '--defense-shot-origin-cqw-x: calc(50cqw - 1px);',
  '--shot-source-x: var(--defense-shot-origin-cqw-x, calc(50cqw - 1px));',
  'translate: calc(var(--shot-source-x) - 50%) calc(var(--shot-source-y) - 50%);',
  'translate: calc(var(--shot-target-x) - 50%) calc(var(--shot-target-y) - 50%);',
  '--enemy-shot-target-x: var(--defense-shot-origin-cqw-x, calc(50cqw - 1px));',
  'translate: calc(var(--enemy-shot-target-x, 50cqw) - 50%) calc(var(--enemy-shot-target-y, 50cqw) - 50%);',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDefenseAttackAnchor),
    true,
    `TD attacks should start from the orb center and aim visible centers: missing ${requiredDefenseAttackAnchor}`,
  );
}

for (const forbiddenShotFrameAnimation of [
  'defense-fire-shot-frames',
  '--defense-fire-frame-',
  'will-change: opacity, translate, scale, background-position;',
]) {
  assert.equal(
    styleSource.includes(forbiddenShotFrameAnimation),
    false,
    `TD fire projectiles should use one travel animation only: found ${forbiddenShotFrameAnimation}`,
  );
}

const defenseMoneyPopupTextBlock = styleSource.match(/\.book-overlay \.defense-money-popup b \{[\s\S]*?\n\}/)?.[0] ?? '';
assert.equal(
  defenseMoneyPopupTextBlock.includes('-webkit-text-stroke: 0;'),
  true,
  'TD money popup text should avoid runtime stroke paint in wave-100 reward bursts.',
);
assert.equal(
  defenseMoneyPopupTextBlock.includes('text-shadow: none;'),
  true,
  'TD money popup text should avoid runtime text-shadow paint in wave-100 reward bursts.',
);

for (const forbiddenMoneyFrameAnimation of [
  'defense-money-frames',
  'will-change: opacity, translate, transform, background-position;',
]) {
  assert.equal(
    styleSource.includes(forbiddenMoneyFrameAnimation),
    false,
    `TD money particles should use one travel animation only: found ${forbiddenMoneyFrameAnimation}`,
  );
}

const defenseDamagePopupBlock = styleSource.match(/\.book-overlay \.defense-damage-popup \{[\s\S]*?\n\}/)?.[0] ?? '';
assert.equal(
  defenseDamagePopupBlock.includes('-webkit-text-stroke: 0;'),
  true,
  'TD damage popups should avoid expensive runtime text stroke.',
);
assert.equal(
  defenseDamagePopupBlock.includes('text-shadow: none;'),
  true,
  'TD damage popups should avoid expensive runtime text shadows.',
);

const defenseIceAuraBlock = styleSource.match(/\.defense-ice-aura \{[\s\S]*?\n\}/)?.[0] ?? '';
assert.equal(
  defenseIceAuraBlock.includes('mix-blend-mode: screen;'),
  false,
  'TD ice aura should avoid screen blending because it is expensive when max skills keep the aura active.',
);
assert.equal(
  defenseIceAuraBlock.includes('filter:'),
  false,
  'TD ice aura should avoid CSS filters because they force expensive offscreen painting on the permanent aura.',
);

assert.equal(
  styleSource.includes('.defense-ice-aura::before'),
  false,
  'TD permanent ice aura should use the CSS/SVG aura markup, not the old image pseudo-element.',
);
assert.equal(
  defenseIceAuraBlock.includes('ice-aura-strip.png'),
  false,
  'TD permanent ice aura should not render from the full 61-frame strip.',
);

for (const forbiddenPermanentIceAuraAnimation of [
  'animation: defense-ice-spin',
  'animation: defense-ice-spin-reverse',
  'animation: defense-ice-breathe',
  'animation: defense-ice-twinkle',
  'animation: defense-ice-flake-',
  '@keyframes defense-ice-spin',
  '@keyframes defense-ice-spin-reverse',
  '@keyframes defense-ice-breathe',
  '@keyframes defense-ice-twinkle',
  '@keyframes defense-ice-flake-',
]) {
  assert.equal(
    styleSource.includes(forbiddenPermanentIceAuraAnimation),
    false,
    `TD permanent ice aura should stay static and avoid long-running CSS animations: found ${forbiddenPermanentIceAuraAnimation}`,
  );
}

const defenseIceContactBlock = styleSource.match(/\.defense-impact-burst\.is-ice-contact \{[\s\S]*?\n\}/)?.[0] ?? '';
assert.equal(
  defenseIceContactBlock.includes('ice-aura-strip.png'),
  true,
  'TD ice contact impact should use the stripped 61-frame ice aura sheet.',
);
assert.equal(
  defenseIceContactBlock.includes('defense-ice-contact-fade'),
  true,
  'TD ice contact impact should fade out as a short burst, not stay on screen for the whole popup lifetime.',
);

console.log('hudStatic ok');
