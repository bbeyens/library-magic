import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
const syncGatesSource = rendererSource.match(
  /function syncGates[\s\S]*?\n}\n\nfunction createRunnerBoostPortalVisual/,
)?.[0];

assert.ok(syncGatesSource, 'runner gate renderer should exist');
assert.equal(
  syncGatesSource.includes('side: DoubleSide'),
  true,
  'a shot-blocking gate must remain visible from the Runner camera side',
);
assert.equal(
  syncGatesSource.includes('mesh.rotation.y = Math.PI'),
  true,
  'gate text should face the Runner camera instead of rendering mirrored',
);
assert.equal(
  syncGatesSource.includes("dataset.runnerGateCount = String(run.gates.length)"),
  true,
  'browser proof should expose every active shot-blocking gate',
);

console.log('runnerGateRenderer ok');
