import assert from 'node:assert/strict';
import { miningLayerTransforms } from '../src/ui/miningThreeTerrain.ts';

const restingLayers = miningLayerTransforms(5, 1);
const pressedLayers = miningLayerTransforms(5, 0.88);

assert.equal(restingLayers.length, 5);
assert.equal(pressedLayers.length, 5);
assert.deepEqual(
  pressedLayers.slice(0, 4),
  restingLayers.slice(0, 4),
  'pressing a block should not move or resize its four lower layers',
);
assert.deepEqual(restingLayers[4], { y: 2.25, height: 0.5, isTop: true });
assert.deepEqual(pressedLayers[4], { y: 2.22, height: 0.44, isTop: true });

console.log('miningLayerAnimation ok');
