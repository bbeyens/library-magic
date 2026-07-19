import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
assert.equal(rendererSource.includes('runner-menu-log'), false, 'the Runner hub should not render a log');
const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

for (const requirement of [
  'menuCamp: Group;',
  'menuHeroSlot: Group;',
  'applyRunnerSeatedPose(',
  'syncRunnerMenuCamera(',
  'export function startRunnerLaunchTransition(',
  'const RUNNER_MENU_TRANSITION_MS = 900;',
]) {
  assert.equal(rendererSource.includes(requirement), true, `runner renderer should include ${requirement}`);
}
for (const removedRequirement of [
  'menuHeroSlots',
  'menuHeroHitTargets',
  'runner-menu-hero-hit',
  'runner-menu-hero-selection',
]) {
  assert.equal(rendererSource.includes(removedRequirement), false, `runner renderer should remove ${removedRequirement}`);
}
for (const requirement of [
  'data-dynamic-value="runner-lives"',
  'data-dynamic-value="runner-attacks"',
  "startUnits: { icon: 'other_health', name: 'Vies'",
]) {
  assert.equal(hudSource.includes(requirement), true, `runner HUD should separate lives and attacks with ${requirement}`);
}
assert.equal(hudSource.includes('data-dynamic-value="runner-units"'), false, 'runner HUD should not expose lives as units');

for (const requirement of [
  '<strong>Runner</strong>',
  'data-action="startRunnerRun"',
  'data-action="toggleRunnerSkills"',
  'data-runner-checkpoint',
  'runner-checkpoint-picker',
  '<span>Run</span>',
  '<span>Skill</span>',
  'runner-skill-drawer',
  'runner-skill-close',
  'aria-label="Retour au menu du Runner"',
]) {
  assert.equal(hudSource.includes(requirement), true, `runner menu should include ${requirement}`);
}
assert.equal(
  hudSource.includes('/assets/runner/heroes/${id}-preview.png'),
  false,
  'runner menu should select the real 3D models instead of preview images',
);

assert.equal(styleSource.includes('/assets/runner/sky/clouds-3/'), false, 'runner frame should not render Clouds 3');
assert.equal(styleSource.includes('background: #a8ddf4;'), true, 'runner frame should use the clean Three.js sky color');
assert.match(
  styleSource,
  /\.runner-hub-run span \{[^}]*font-size: 32px;/s,
  'runner result counters should override the generic 12px book span size',
);
assert.match(
  styleSource,
  /\.runner-checkpoint-picker \{[^}]*position: absolute;[^}]*left: 20px;[^}]*bottom: 20px;[^}]*font-size: 32px;/s,
  'runner checkpoint picker should stay readable at the bottom left',
);
assert.match(
  styleSource,
  /\.runner-checkpoint-picker > span \{[^}]*font-size: 32px;[^}]*text-shadow: none;/s,
  'runner checkpoint label should not render a duplicate-looking shadow',
);
assert.match(
  styleSource,
  /\.runner-hub\.is-skills-open \.runner-checkpoint-picker \{[^}]*display: none;/s,
  'runner checkpoint picker should leave the layout while the skill menu is open',
);
assert.match(
  styleSource,
  /\.runner-skill-drawer \{[^}]*inset: 0;[^}]*z-index: 6;/s,
  'runner skill menu should cover the full runner panel above native controls',
);
for (const selector of [
  '.runner-shop-cat',
  '.runner-shop-grid',
  '.runner-shop-icon',
  '.runner-shop-name strong',
  '.runner-shop-tip',
  '--shop-fill',
  '.runner-shop-cost',
]) {
  assert.notEqual(styleSource.indexOf(selector), -1, `runner skill menu should style ${selector}`);
}
assert.match(
  styleSource,
  /\.runner-shop-grid \{[^}]*grid-template-columns: repeat\(var\(--shop-cols, 3\), minmax\(0, 1fr\)\);/s,
  'runner skill tiles should use a section-driven column count',
);
assert.match(
  styleSource,
  /\.runner-shop-entry \{[^}]*aspect-ratio: 1 \/ 1;/s,
  'runner skill tiles should be compact square icon boxes',
);
assert.match(
  styleSource,
  /\.runner-shop-tip \{[^}]*position: absolute;/s,
  'runner skill details should live in the hover panel anchored to the drawer',
);
assert.match(
  hudSource,
  /shouldPatchOpenRunnerPanel\(state, structureSignature\)[\s\S]*runnerHubSkillsOpen[\s\S]*refreshRunnerSkillShop\(state\);/,
  'runner updates should preserve the WebGL canvas and patch the open shop without losing its scroll position',
);
assert.match(
  hudSource,
  /function refreshRunnerSkillShop\([\s\S]*\.runner-shop[\s\S]*setTextContentIfChanged/,
  'runner skill cards should update in place so the shop keeps its scroll position',
);
assert.equal(
  hudSource.includes('class="is-distance"><b>${Math.floor(meta.lastRunDistance)}</b><i>m</i>'),
  true,
  'runner result should keep the distance value and unit grouped',
);
assert.equal(
  hudSource.includes('class="is-coins"><b>+${formatGameNumber(meta.lastRunCoins)}</b><i>◎</i>'),
  true,
  'runner result should keep the resource value and icon grouped',
);

console.log('runnerMenuScene ok');
