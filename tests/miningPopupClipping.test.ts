import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

assert.equal(hudSource.includes("target.closest<HTMLElement>('.mining-grid-shell .mining-grid')"), true);
assert.equal(hudSource.includes('const host = localClippingHost ?? globalHost;'), true);
assert.equal(styleSource.includes('.mining-grid-shell .mining-grid {'), true);
assert.equal(styleSource.includes('overflow: hidden;'), true);

console.log('miningPopupClipping ok');
