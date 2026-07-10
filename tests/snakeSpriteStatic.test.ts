import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const hudSource = readFileSync(new URL('../src/ui/hud.ts', import.meta.url), 'utf8');

function pngSize(path: URL): { width: number; height: number } {
  const bytes = readFileSync(path);
  assert.equal(bytes.toString('ascii', 1, 4), 'PNG', `${path.pathname} should be a PNG.`);
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

const snakeSheet = new URL('../public/assets/Snake dragon/Snake sprite.png', import.meta.url);
assert.deepEqual(pngSize(snakeSheet), { width: 256, height: 128 }, 'Snake runtime sheet should keep the duplicated 2-frame 256x128 layout.');
assert.equal(hudSource.includes('?v=snake-sprite2-heads-3'), true, 'Snake crop URLs should be cache-busted when the atlas is remapped.');

const frames = ['a', 'b'] as const;
const tileNames = [
  'head-up',
  'head-right',
  'head-down',
  'head-left',
  'body-straight',
  'body-tail',
  'body-corner-left-up',
  'body-corner-up-right',
  'body-corner-right-down',
  'body-corner-down-left',
  'body-corner-up-left',
  'body-corner-right-up',
  'body-corner-down-right',
  'body-corner-left-down',
];

for (const tileName of tileNames) {
  for (const frame of frames) {
    const tilePath = new URL(`../public/assets/Snake dragon/crops/${tileName}-${frame}.png`, import.meta.url);
    assert.equal(existsSync(tilePath), true, `Missing Snake crop ${tileName}-${frame}.png.`);
    assert.deepEqual(pngSize(tilePath), { width: 16, height: 16 }, `${tileName}-${frame}.png should stay on the 16x16 grid.`);
  }
}

for (const foodSprite of [
  'round-red',
  'round-blue',
  'round-green',
  'round-pink',
  'diamond-red',
  'diamond-blue',
  'diamond-green',
  'diamond-pink',
]) {
  const foodPath = new URL(`../public/assets/Snake dragon/food/${foodSprite}.png`, import.meta.url);
  assert.equal(existsSync(foodPath), true, `Missing Snake food sprite ${foodSprite}.png.`);
  assert.deepEqual(pngSize(foodPath), { width: 16, height: 16 }, `${foodSprite}.png should stay on the 16x16 grid.`);
}

console.log('snakeSpriteStatic ok');
