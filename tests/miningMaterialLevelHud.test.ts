import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

assert.equal(hudSource.includes('class="mining-material-level${isMaxed'), true);
assert.equal(hudSource.includes('<button\n      type="button"\n      class="mining-material-level'), true);
assert.equal(hudSource.includes('class="mining-material-level-badge"'), true);
assert.equal(hudSource.includes('data-dynamic-value="mining-material-level"'), true);
assert.equal(hudSource.includes('data-dynamic-value="mining-material-name"'), true);
assert.equal(hudSource.includes('data-dynamic-value="mining-material-xp"'), true);
assert.equal(hudSource.includes('data-block-type="${spriteIndex}"'), true);
assert.equal(hudSource.includes('data-dynamic-value="mining-block-type-bonus"'), true);
assert.equal(hudSource.includes('data-dynamic-value="mining-total-mine-bonus"'), true);
assert.equal(hudSource.includes('data-dynamic-value="mining-global-bonus"'), true);
assert.equal(hudSource.includes('updateMiningMaterialLevelHud(state);'), true);
assert.equal(hudSource.includes("const levelLabel = isMaxed ? 'MAX'"), true);
assert.equal(styleSource.includes('conic-gradient(var(--mining-level-color)'), true);
assert.equal(styleSource.includes('.mining-material-level.is-maxed'), true);
assert.equal(styleSource.includes('.mining-material-level.is-xp-gaining'), true);
assert.equal(styleSource.includes('.mining-material-level:focus-within .mining-material-level-body'), true);
assert.equal(styleSource.includes('visibility: hidden;'), true);
assert.equal(styleSource.includes('pointer-events: auto;'), true);
assert.equal(hudSource.includes("hud.removeAttribute('title');"), true);
assert.equal(styleSource.includes('.book-overlay[data-book-id="mine"] .book-page-header.is-minimal'), true);

console.log('miningMaterialLevelHud ok');
