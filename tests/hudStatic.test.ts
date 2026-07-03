import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const actionsSource = readFileSync(new URL('../src/game/simulation/actions.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const dockSignature = hudSource.match(/function defenseSkillDockSignature[\s\S]*?\n}\n\nfunction defenseSkillShopCardSnapshot/)?.[0];
const defenseSkillShopTabsSource = hudSource.match(/function defenseSkillShopTabs[\s\S]*?\n}\n\nfunction defenseSkillShopCard/)?.[0];
const renderHudStart = hudSource.indexOf('function renderHud');
const renderHudEnd = hudSource.indexOf('function setDefenseWaveFromInput');
const renderHudSource =
  renderHudStart === -1 || renderHudEnd === -1 ? undefined : hudSource.slice(renderHudStart, renderHudEnd);

assert.ok(dockSignature, 'defenseSkillDockSignature should exist');
assert.ok(defenseSkillShopTabsSource, 'defenseSkillShopTabs should exist');
assert.ok(renderHudSource, 'renderHud should exist');

for (const requiredPanelSizeHotkey of [
  'installPanelSizeControls();',
  'event.key.toLowerCase() !== \'h\'',
  'cycleBookPanelSize(panelToResize.bookId, panelElement)',
]) {
  assert.equal(
    hudSource.includes(requiredPanelSizeHotkey),
    true,
    `HUD should let H cycle the focused mini-game panel size: missing ${requiredPanelSizeHotkey}`,
  );
}

for (const volatileReference of [
  'state.defense.towerHealth',
  'defenseTowerDamage',
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

for (const requiredGoblinKingCss of [
  '--goblin-row-idle: 0%',
  '--goblin-row-walk: 10%',
  '--goblin-row-death: 70%',
  '--goblin-row-attack-a: 90%',
  '--goblin-row-attack-b: 100%',
  'goblin-king/goblin-king.png',
  '@keyframes defense-goblin-king-idle',
  '@keyframes defense-goblin-king-walk',
  '@keyframes defense-goblin-king-death',
  '@keyframes defense-goblin-king-attack',
]) {
  assert.equal(styleSource.includes(requiredGoblinKingCss), true, `Goblin King CSS missing ${requiredGoblinKingCss}`);
}

for (const requiredBlueSlimeCss of [
  'blue-slime/idle-compact.png',
  'blue-slime/walk-compact.png',
  'blue-slime/attack-compact.png',
  'blue-slime/death-compact.png',
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

assert.equal(
  styleSource.includes('/assets/td/tiles/Monster%20TD%201/1/generated/S_Walk_'),
  false,
  'Blue slime TD should animate one spritesheet with background-position, not swap old generated walk PNGs.',
);

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
  "restartOneShotClass(healthHud, 'is-damage-shaking')",
  '.defense-hud-health.is-damage-shaking',
  '@keyframes defense-hud-health-damage-shake',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredTowerHealthHudShake),
    true,
    `TD tower HUD health should shake briefly when the tower takes damage: missing ${requiredTowerHealthHudShake}`,
  );
}

for (const requiredEnemyLayerOrdering of [
  'const enemyLayerOrder',
  'enemyLayerOrder.push({ id: enemyId, y: position.y })',
  '.sort((left, right) => left.y - right.y',
  'actorsLayer.appendChild(enemyElement)',
]) {
  assert.equal(
    hudSource.includes(requiredEnemyLayerOrdering),
    true,
    `TD enemies should be DOM-sorted by vertical position so lower monsters render in front: missing ${requiredEnemyLayerOrdering}`,
  );
}

assert.equal(
  styleSource.includes('.defense-enemy::after'),
  false,
  'TD enemy health bars should not be pseudo-elements on enemy sprites because they can cover neighboring monsters.',
);

for (const requiredDamagePopupStability of [
  'data-popup-id="${popup.id}"',
  'defenseDamagePopupMotion(popup)',
  '--damage-offset-x',
  '--damage-offset-y',
  '--damage-drift-x',
  '--damage-popup-opacity: 0.75',
  'contain: layout paint style',
]) {
  assert.equal(
    `${hudSource}\n${styleSource}`.includes(requiredDamagePopupStability),
    true,
    `TD damage popups should keep stable ids and offset away from enemy centers: missing ${requiredDamagePopupStability}`,
  );
}

const defenseDamagePopupKeyframes = styleSource.match(/@keyframes defense-damage-pop \{[\s\S]*?\n\}/)?.[0];
assert.ok(defenseDamagePopupKeyframes, 'TD damage popup keyframes should exist.');
assert.equal(
  defenseDamagePopupKeyframes.includes('opacity: 1'),
  false,
  'TD damage popup keyframes should not override the 75% opacity cap with opacity: 1.',
);
assert.equal(
  defenseDamagePopupKeyframes.includes('var(--damage-popup-opacity, 0.75)'),
  true,
  'TD damage popup keyframes should use the popup opacity variable for visible frames.',
);

for (const requiredSkeletonFootAnchor of [
  '.defense-enemy.is-skeleton-mage',
  'transform: translate(-50%, -100%) scaleX(var(--enemy-facing-scale));',
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
  'Fire%20attack%20TD%20outlined.png',
  'background-size: 500% 100%',
  '@keyframes defense-fire-shot-frames',
  'targetKind: target.kind',
  'defenseEnemyVisibleCenter({ lane: shot.lane, distance: shot.distance, kind: shot.targetKind })',
]) {
  assert.equal(
    `${hudSource}\n${actionsSource}\n${styleSource}`.includes(requiredSkeletonProjectileSprite),
    true,
    `TD fireballs should use the fireball strip and aim at the target visible center: missing ${requiredSkeletonProjectileSprite}`,
  );
}

for (const requiredEnemyAnimationTiming of [
  'animation: defense-enemy-idle calc(1080ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-enemy-attack calc(840ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-enemy-death calc(620ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-skeleton-mage-walk calc(912ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-skeleton-mage-idle calc(1080ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-skeleton-mage-attack calc(1080ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-skeleton-mage-death calc(988ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-bat-fly calc(520ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-bat-attack calc(580ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-bat-death calc(620ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-goblin-king-idle calc(920ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-goblin-king-walk calc(980ms * var(--defense-time-scale, 1)) steps(1, end) infinite;',
  'animation: defense-goblin-king-attack calc(1040ms * var(--defense-time-scale, 1)) steps(1, end) both;',
  'animation: defense-goblin-king-death calc(880ms * var(--defense-time-scale, 1)) steps(1, end) both;',
]) {
  assert.equal(
    styleSource.includes(requiredEnemyAnimationTiming),
    true,
    `TD enemy sprite animations should use discrete spritesheet timing: missing ${requiredEnemyAnimationTiming}`,
  );
}

for (const requiredDefenseSpeedAnimationScale of [
  'style="--defense-time-scale:${defenseTimeScale(defense.speedMultiplier)}"',
  "defensePanelElement?.style.setProperty('--defense-time-scale', defenseTimeScale(state.defense.speedMultiplier));",
  'function defenseTimeScale(speedMultiplier: number): string',
]) {
  assert.equal(
    hudSource.includes(requiredDefenseSpeedAnimationScale),
    true,
    `TD enemy CSS animations should scale with x2/x4 speed so action/death sprites finish before state timers expire: missing ${requiredDefenseSpeedAnimationScale}`,
  );
}

for (const requiredEnemyLayerStability of [
  'const sortableEnemyIds = new Set<string>();',
  "if (enemy.state !== 'dying')",
  'sortableEnemyIds.add(enemyId);',
  'const sortedEnemyLayerOrder = enemyLayerOrder',
  'const currentEnemyLayerOrder = Array.from(actorsLayer.querySelectorAll<HTMLElement>(\'.defense-enemy\'))',
  "typeof enemyId === 'string' && sortableEnemyIds.has(enemyId)",
  'if (currentEnemyLayerOrder.join(\'|\') !== sortedEnemyLayerOrder.join(\'|\'))',
  'actorsLayer.appendChild(enemyElement)',
]) {
  assert.equal(
    hudSource.includes(requiredEnemyLayerStability),
    true,
    `TD enemies should only be moved in the DOM when their layer order changes, otherwise CSS sprite animations restart: missing ${requiredEnemyLayerStability}`,
  );
}

for (const requiredEnemyHitFeedback of [
  'const defenseEnemyHealthSnapshots = new Map<string, number>();',
  'const previousHealth = defenseEnemyHealthSnapshots.get(enemyId);',
  'if (previousHealth !== undefined && enemy.health < previousHealth)',
  'playDefenseEnemyHitFeedback(enemyElement);',
  "animation.id === 'defense-enemy-hit-feedback'",
  "animation.id = 'defense-enemy-hit-feedback';",
  "opacity: '0.5'",
  "filter: 'none'",
]) {
  assert.equal(
    hudSource.includes(requiredEnemyHitFeedback),
    true,
    `TD enemies should flash red once when health drops without restarting sprite animations: missing ${requiredEnemyHitFeedback}`,
  );
}

for (const requiredDefenseSkillGridLimit of [
  '--td-skill-visible-card-limit: 8;',
  '--td-skill-visible-card-rows: 4;',
  '--td-skill-visible-grid-height: 142px;',
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
  "Health +",
  "Gold +",
  "Gold x",
]) {
  assert.equal(
    defenseSkillShopTabsSource.includes(requiredDefenseSkillTabLayout),
    true,
    `TD skill tabs should keep the requested Attack / Element / Other arrangement: missing ${requiredDefenseSkillTabLayout}`,
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
const lightningDamageIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'lightningDamage'");
const healthIndex = defenseSkillShopTabsSource.indexOf("defenseSkillShopCard(state, 'health'");
assert.ok(elementTabIndex < lightningDamageIndex, 'TD lightning skills should be inside the Element tab.');
assert.ok(lightningDamageIndex < otherTabIndex, 'TD lightning skills should appear before Other starts.');
assert.ok(otherTabIndex < healthIndex, 'TD old defense skills should move into the Other tab.');
assert.equal(hudSource.includes("case 'goldMultiplier':"), true, 'TD Gold Multiplier should have a skill delta.');
assert.equal(hudSource.includes("return '(+10%)';"), true, 'TD Gold Multiplier should show +10% per level.');

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
  "range?.style.setProperty('--defense-ice-range-scale', defenseIceRange(state).toFixed(3));",
  '<i class="defense-ice-range" style="--defense-ice-range-scale:${rangeScale}" aria-hidden="true"></i>',
  '.defense-ice-range',
  'border: 3px solid rgba(82, 191, 255, 0.82);',
  'transform: translate(-50%, -50%) scale(var(--defense-ice-range-scale, 0.15));',
  '.defense-ice-aura::before',
  'inset: -21%;',
  'transform: translate(-18px, -18px);',
  'overflow: hidden;',
  '.defense-panel.is-paused .defense-ice-aura::before',
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
  "buyElement.innerHTML = snapshot.isLocked ? ''",
  '<small data-skill-card-delta ${!card.isLocked && card.delta ?',
  '${card.isLocked ? \'\' : card.isMaxed ? \'<b>Max</b>\' : card.costHtml}',
  '.skill-shop-card.is-locked',
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

console.log('hudStatic ok');
