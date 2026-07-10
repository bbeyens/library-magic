import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

const snakePanelSource = hudSource.match(/function snakePanel[\s\S]*?\n}\n\nfunction snakeBoardShellContent/)?.[0];
const snakeDockSignatureSource = hudSource.match(/function snakeSkillDockSignature[\s\S]*?\n}\n\nfunction snakeSkillCardDynamicSignature/)?.[0];
const snakeDynamicUpdaterSource = hudSource.match(/function updateDynamicSnakeSkillCards[\s\S]*?\n}\n\nfunction refreshSnakeSkillDock/)?.[0];

assert.ok(snakePanelSource, 'snakePanel should exist.');
assert.ok(snakeDockSignatureSource, 'snakeSkillDockSignature should exist.');
assert.ok(snakeDynamicUpdaterSource, 'updateDynamicSnakeSkillCards should exist.');

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
