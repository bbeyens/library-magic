import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { runnerTerrainSegmentPositions } from '../src/ui/runnerTerrainLoop.ts';

const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');

assert.deepEqual(runnerTerrainSegmentPositions(), runnerTerrainSegmentPositions(), 'terrain layout must be stable');

assert.equal(
  rendererSource.includes('syncRunnerTerrain(lane);'),
  true,
  'the Runner renderer should synchronize a stationary terrain without run distance',
);
assert.equal(
  rendererSource.includes('standardRun: stand?.clone()'),
  true,
  'normal gameplay should use the standing hero clip',
);
assert.equal(
  rendererSource.includes('injuredRun: stand?.clone()'),
  true,
  'taking damage must not make the stationary hero run',
);
assert.equal(
  rendererSource.includes('enemy.z - run.distance'),
  true,
  'logical distance should still make enemies approach the fixed player',
);
assert.equal(
  rendererSource.includes("dataset.runnerTerrainMotion = 'stationary'"),
  true,
  'the browser proof surface should expose stationary terrain ownership',
);
assert.equal(rendererSource.includes("dataset.runnerHeroZ = '0'"), true, 'the gameplay hero should stay at z = 0');
assert.equal(
  rendererSource.includes('dataset.runnerNearestEnemyZ'),
  true,
  'browser proof should expose the nearest approaching enemy',
);

console.log('runnerStationaryWorld ok');
