import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

const snakePanelSource = hudSource.match(/function snakePanel[\s\S]*?\n}\n\nfunction snakeBoardShellContent/)?.[0];
const snakeDockSignatureSource = hudSource.match(/function snakeSkillDockSignature[\s\S]*?\n}\n\nfunction snakeSkillCardDynamicSignature/)?.[0];
const snakeDynamicUpdaterSource = hudSource.match(/function updateDynamicSnakeSkillCards[\s\S]*?\n}\n\nfunction refreshSnakeSkillDock/)?.[0];
const snakeSkillCardSource = hudSource.match(/function snakeSkillShopCard[\s\S]*?\n}\n\nfunction snakeSkillIcon/)?.[0];
const snakeSkillTabsSource = hudSource.match(/function snakeSkillShopTabs[\s\S]*?\n}\n\nfunction snakeSkillShopCard/)?.[0];

assert.ok(snakePanelSource, 'snakePanel should exist.');
assert.ok(snakeDockSignatureSource, 'snakeSkillDockSignature should exist.');
assert.ok(snakeDynamicUpdaterSource, 'updateDynamicSnakeSkillCards should exist.');
assert.ok(snakeSkillCardSource, 'snakeSkillShopCard should exist.');
assert.ok(snakeSkillTabsSource, 'snakeSkillShopTabs should exist.');

for (const requiredSnakeLayout of [
  '<div class="snake-board-shell">',
  '<div class="snake-skill-dock">',
  '<div class="snake-status-hud" aria-label="Etat du serpent">',
  'data-dynamic-value="snake-scales"',
  'data-dynamic-value="snake-multiplier"',
  "snakeSkillShop(state, false, { docked: true, showCompactButton: false })",
  'function refreshSnakeBoard(state: GameState): void',
  'function bindSnakeBoardControls(shell: HTMLElement): void',
  'function shouldPatchOpenSnakePanel(state: GameState, structureSignature: string): boolean',
]) {
  assert.equal(hudSource.includes(requiredSnakeLayout), true, `Snake should use the TD-style board + dock layout: missing ${requiredSnakeLayout}`);
}

for (const forbiddenVolatileReference of [
  'state.snake.score',
  'state.snake.body',
  'state.snake.direction',
  'state.snake.food',
  'state.snake.bonusFood',
]) {
  assert.equal(
    snakeDockSignatureSource.includes(forbiddenVolatileReference),
    false,
    `snakeSkillDockSignature must not include volatile Snake gameplay values: found ${forbiddenVolatileReference}`,
  );
}

for (const requiredDynamicUpdaterRule of [
  "rootElement?.querySelectorAll<HTMLButtonElement>('.snake-skill-dock .skill-shop-card[data-skill-id]')",
  'const currentScales = Math.floor(state.resources.scales);',
  'setTextContentIfChanged(card.querySelector<HTMLElement>(\'[data-skill-card-value]\'), snapshot.value);',
  'setInnerHTMLIfChanged(buyElement, snapshot.isMaxed ? \'<b>Max</b>\' : snapshot.costHtml);',
  'clearOneShotHoverTarget(card);',
]) {
  assert.equal(
    snakeDynamicUpdaterSource.includes(requiredDynamicUpdaterRule),
    true,
    `Snake dynamic skill updates should patch cards in place: missing ${requiredDynamicUpdaterRule}`,
  );
}

assert.equal(
  snakeSkillCardSource.includes('state.resources.scales < cost'),
  true,
  'Snake skill cards should use scales affordability, not mana.',
);
assert.equal(
  snakeSkillCardSource.includes('snakeSkillShopCostHtml(cost)'),
  true,
  'Snake skill cards should display scale costs.',
);
assert.equal(snakeSkillCardSource.includes('standardManaCostHtml(cost)'), false, 'Snake skill cards must not display mana costs.');

for (const requiredSnakeSkill of [
  "snakeSkillShopCard(state, 'foodCount', 'Food Count'",
  "snakeSkillShopCard(state, 'growthThreshold', 'Growth'",
  "value === 'foodCount'",
  "value === 'growthThreshold'",
]) {
  assert.equal(hudSource.includes(requiredSnakeSkill), true, `Snake skill dock should expose the new progression skill: missing ${requiredSnakeSkill}`);
}

for (const requiredSnakeAutoTabRule of [
  "type SnakeSkillShopTabId = 'snake' | 'auto'",
  "let snakeSkillShopTab: SnakeSkillShopTabId = 'snake'",
  "id: 'auto'",
  "label: 'Auto'",
  "snakeSkillShopCard(state, 'automation', 'Auto'",
  'snakeSkillShopTab,',
]) {
  assert.equal(hudSource.includes(requiredSnakeAutoTabRule), true, `Snake should expose a dedicated Auto tab: missing ${requiredSnakeAutoTabRule}`);
}

const snakeManualTabSource = snakeSkillTabsSource.split("id: 'auto'")[0];
assert.equal(
  snakeManualTabSource.includes("snakeSkillShopCard(state, 'automation'"),
  false,
  'Snake automation must not remain in the manual Snake tab.',
);

for (const requiredSnakeStyle of [
  '.book-overlay[data-book-id="serpent"]',
  '--snake-arena-size: 480px;',
  'background: #071014;',
  '.book-overlay[data-book-id="serpent"] .book-page-body',
  'position: relative;',
  '.snake-panel',
  'display: flex;',
  'flex-direction: column;',
  '.snake-board-shell',
  'background: transparent;',
  'box-shadow: none;',
  '.snake-board',
  'width: min(100%, 480px);',
  '.snake-status-hud',
  'grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);',
  '.snake-hud-hearts',
  '.snake-hud-resource',
  '.snake-hud-multiplier',
  '.snake-skill-dock',
]) {
  assert.equal(styleSource.includes(requiredSnakeStyle), true, `Snake CSS should match the TD-style square board + dock layout: missing ${requiredSnakeStyle}`);
}
