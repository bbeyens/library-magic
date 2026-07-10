import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');
const terrainSource = readFileSync(new URL('../src/ui/miningThreeTerrain.ts', import.meta.url), 'utf8');

for (const requiredHudFeature of [
  "import { syncMiningThreeTerrain } from './miningThreeTerrain';",
  'data-mining-3d-board="true"',
  'class="mining-skill-dock"',
  'Mine des Profondeurs 3D 6 par 6',
  "selectedBook.id !== 'mine'",
]) {
  assert.ok(hudSource.includes(requiredHudFeature), `missing Mine HUD feature: ${requiredHudFeature}`);
}

for (const requiredStyle of [
  '--mine-arena-size: 480px;',
  '.mining-three-board',
  '.mining-skill-dock',
  'background: transparent;',
]) {
  assert.ok(styleSource.includes(requiredStyle), `missing Mine style: ${requiredStyle}`);
}

for (const requiredTerrainFeature of [
  'new WebGLRenderer',
  'new OrthographicCamera',
  'new Raycaster',
  'new BoxGeometry(1, 1, 1)',
  "dirt: { top: '#99e550', left: '#37946e', right: '#6abe30'",
  "phase: 'pressing' | 'held' | 'releasing'",
  'const miningDamageCompression = 0.12;',
]) {
  assert.ok(terrainSource.includes(requiredTerrainFeature), `missing Three.js Mine feature: ${requiredTerrainFeature}`);
}

for (const forbiddenLineRenderer of ['EdgesGeometry', 'LineSegments', 'LineBasicMaterial']) {
  assert.equal(terrainSource.includes(forbiddenLineRenderer), false, `unexpected block line renderer: ${forbiddenLineRenderer}`);
}

console.log('miningThreeTerrainStatic ok');
