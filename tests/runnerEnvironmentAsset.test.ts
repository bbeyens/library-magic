import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import {
  RUNNER_TERRAIN_LOOP_LENGTH,
  RUNNER_TERRAIN_SEGMENT_COUNT,
  RUNNER_TERRAIN_SEGMENT_LENGTH,
  runnerTerrainSegmentPositions,
} from '../src/ui/runnerTerrainLoop.ts';

const assetRoot = new URL('../public/assets/runner/environment/', import.meta.url);
const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');
const generatorSource = readFileSync(new URL('../scripts/generate-runner-environment.py', import.meta.url), 'utf8');

for (let index = 1; index <= 3; index += 1) {
  const assetUrl = new URL(`canyon-segment-${index}.glb`, assetRoot);
  assert.equal(existsSync(assetUrl), true, `canyon segment ${index} should ship with the runner`);
  const asset = readFileSync(assetUrl);
  assert.equal(asset.subarray(0, 4).toString('ascii'), 'glTF', `segment ${index} should be a valid GLB`);
  assert.ok(asset.length > 50_000, `segment ${index} should contain the complete low-poly canyon kit`);

  const jsonChunkLength = asset.readUInt32LE(12);
  const json = JSON.parse(asset.subarray(20, 20 + jsonChunkLength).toString('utf8').trim());
  assert.ok(json.meshes?.length >= 30, `segment ${index} should include road, rocks, cliffs and trees`);
  assert.ok(json.materials?.length >= 12, `segment ${index} should preserve its Blender materials`);
}

for (const sourceRequirement of [
  'const RUNNER_ENVIRONMENT_ASSETS = [',
  "'/assets/runner/environment/canyon-segment-1.glb'",
  'RUNNER_TERRAIN_SEGMENT_COUNT',
  'runnerTerrainSegmentPositions()',
  'syncRunnerTerrain(lane);',
  'object.userData.runnerSharedEnvironmentAsset = true;',
]) {
  assert.equal(rendererSource.includes(sourceRequirement), true, `runner renderer should include ${sourceRequirement}`);
}

assert.equal(RUNNER_TERRAIN_LOOP_LENGTH, 100, 'the fixed runner terrain should span 100 metres');
assert.equal(RUNNER_TERRAIN_SEGMENT_COUNT, 7, 'seven authored segments should cover the fixed terrain span');

const positions = runnerTerrainSegmentPositions();
assert.deepEqual(positions, runnerTerrainSegmentPositions(), 'logical distance should never move the terrain layout');

const terrainIntervals = positions
  .map((position) => ({
    start: position - RUNNER_TERRAIN_SEGMENT_LENGTH / 2,
    end: position + RUNNER_TERRAIN_SEGMENT_LENGTH / 2,
  }))
  .sort((left, right) => left.start - right.start);

assert.ok(terrainIntervals[0]!.start <= -20, 'terrain should extend safely behind the fixed player');
assert.ok(terrainIntervals.at(-1)!.end >= 79, 'terrain should extend beyond the far camera edge');
for (let index = 1; index < terrainIntervals.length; index += 1) {
  assert.ok(
    terrainIntervals[index]!.start <= terrainIntervals[index - 1]!.end,
    `terrain should have no uncovered gap between segment ${index} and ${index + 1}`,
  );
}

for (const generatorRequirement of ['add_boulder(', 'add_cliff_column(', 'add_pine(', 'add_round_tree(']) {
  assert.equal(generatorSource.includes(generatorRequirement), true, `Blender generator should include ${generatorRequirement}`);
}

console.log('runnerEnvironmentAsset ok');
