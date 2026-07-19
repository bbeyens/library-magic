import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { runnerEnemyVariantIndex } from '../src/ui/runnerThreeLane.ts';

const monsterSlugs = ['beholder', 'cactus', 'chest-monster', 'skeleton-warrior'];
const assetRoot = new URL('../public/assets/runner/monsters/', import.meta.url);
const rendererSource = readFileSync(new URL('../src/ui/runnerThreeLane.ts', import.meta.url), 'utf8');

for (const slug of monsterSlugs) {
  const assetUrl = new URL(`${slug}.glb`, assetRoot);
  assert.equal(existsSync(assetUrl), true, `${slug}.glb should ship with the runner`);

  const asset = readFileSync(assetUrl);
  assert.equal(asset.subarray(0, 4).toString('ascii'), 'glTF', `${slug}.glb should be a valid GLB`);

  const jsonChunkLength = asset.readUInt32LE(12);
  const json = JSON.parse(asset.subarray(20, 20 + jsonChunkLength).toString('utf8').trim());
  assert.equal(json.meshes?.length, 1, `${slug}.glb should contain one mesh`);
  assert.equal(json.skins?.length ?? 0, slug === 'skeleton-warrior' ? 0 : 1, `${slug}.glb skin count`);
  assert.equal(json.animations?.length, 1, `${slug}.glb should contain one locomotion animation`);
}

const skeletonExportRoot = new URL('../exports/runner-skeleton-monster/', import.meta.url);
for (const filename of [
  'skeleton_girl_guy_sketchfab.fbx',
  'skeleton_texture.tga.png',
  'skeleton-warrior.blend',
  'skeleton-warrior-preview.png',
  'export-report.json',
]) {
  assert.equal(existsSync(new URL(filename, skeletonExportRoot)), true, `${filename} should be reproducible`);
}
const skeletonReport = JSON.parse(readFileSync(new URL('export-report.json', skeletonExportRoot), 'utf8'));
assert.equal(skeletonReport.meshCount, 1);
assert.equal(skeletonReport.skinCount, 0);
assert.equal(skeletonReport.materialCount, 1);
assert.equal(skeletonReport.polygonCount, 2491);

assert.equal(
  existsSync(new URL('monster-basecolor.png', assetRoot)),
  true,
  'the shared Polyart base-color texture should ship with the runner',
);

for (const requiredSource of [
  "import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';",
  'const RUNNER_MONSTER_ASSETS = [',
  "'/assets/runner/monsters/beholder.glb'",
  "'/assets/runner/monsters/skeleton-warrior.glb'",
  "const RUNNER_MONSTER_TEXTURE = '/assets/runner/monsters/monster-basecolor.png';",
  "!asset.endsWith('/skeleton-warrior.glb')",
  'runnerEnemyVariantIndex(enemy.id, lane.enemyTemplates.length)',
  'new AnimationMixer(monster)',
  'visual.rotation.y = Math.PI;',
  'enemy.isBoss ||',
  "enemy.isBoss ? '#fde047' : '#fee2e2'",
]) {
  assert.equal(rendererSource.includes(requiredSource), true, `runner renderer should include ${requiredSource}`);
}

assert.equal(
  rendererSource.includes('!onMove || editorInteraction?.enabled'),
  false,
  'the runner squad should keep following the cursor while the development editor is open',
);

for (const removedSlug of ['slime', 'turtle-shell']) {
  assert.equal(
    rendererSource.includes(`/assets/runner/monsters/${removedSlug}.glb`),
    false,
    `${removedSlug} should no longer be part of the runner monster pool`,
  );
}

assert.equal(runnerEnemyVariantIndex(0, 4), 0);
assert.equal(runnerEnemyVariantIndex(4, 4), 0);
assert.equal(runnerEnemyVariantIndex(5, 4), 1);
assert.equal(runnerEnemyVariantIndex(-5, 4), 1);
assert.equal(runnerEnemyVariantIndex(99, 0), 0);

console.log('runnerMonsterAsset ok');
