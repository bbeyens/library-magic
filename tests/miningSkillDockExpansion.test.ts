import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const terrainSource = readFileSync(new URL('../src/ui/miningThreeTerrain.ts', import.meta.url), 'utf8');

for (const skillId of [
  'pickaxeForce',
  'pickaxeMultiplier',
  'splashDamage',
  'criticalChance',
  'criticalMultiplier',
  'holdClick',
  'automation',
  'multiAutoClicker',
  'resourceBonus',
  'resourceMultiplier',
]) {
  assert.equal(hudSource.includes(`miningSkillShopCard(state, '${skillId}'`), true, `${skillId} card should exist`);
  assert.equal(hudSource.includes(`skills.${skillId}`), true, `${skillId} should stabilize the dock signature`);
}

for (const tabLabel of ["label: 'Attack'", "label: 'Auto'", "label: 'Resource'"]) {
  assert.equal(hudSource.includes(tabLabel), true);
}

assert.equal(hudSource.includes('/assets/Crystal/cursors/auto-click-hand.png'), true);
assert.equal(styleSource.includes('.is-mining-auto-clicker'), true);
assert.equal(styleSource.includes('grid-template-columns: repeat(3, minmax(0, 1fr));'), true);
// Click Holder is now a hover loop (no button hold), and manual clicks are capped at 10/s.
assert.equal(terrainSource.includes('startMiningHoverLoop(terrain)'), true);
assert.equal(terrainSource.includes('miningHoldClickRate(state)'), true);
assert.equal(terrainSource.includes('miningManualClickMinIntervalMs'), true);
assert.equal(hudSource.includes('class="mining-counter-box"'), true);
assert.equal(hudSource.includes('data-dynamic-value="mining-counter-total"'), true);
assert.equal(hudSource.includes("setDynamicText('mining-counter-rate'"), true);
assert.equal(hudSource.includes("trackDynamicResourceGain('mining-counter-total'"), true);
assert.equal(styleSource.includes('.mining-grid-shell .mining-counter-box strong'), true);

console.log('miningSkillDockExpansion ok');
