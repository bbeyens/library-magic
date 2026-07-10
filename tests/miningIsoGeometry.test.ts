import assert from 'node:assert/strict';
import {
  MINING_ISO_BOARD,
  miningIsoBlockCenter,
  miningIsoBlockIdFromPoint,
  miningIsoBoardBounds,
} from '../src/ui/miningIsoGeometry.ts';

const bounds = miningIsoBoardBounds(MINING_ISO_BOARD);
assert.equal(bounds.width, 336);
assert.equal(bounds.height, 192);

for (let blockId = 0; blockId < 36; blockId += 1) {
  const center = miningIsoBlockCenter(blockId, MINING_ISO_BOARD);
  assert.equal(
    miningIsoBlockIdFromPoint(center.x, center.y, MINING_ISO_BOARD),
    blockId,
    `center of block ${blockId} should resolve to itself`,
  );
}

assert.equal(miningIsoBlockIdFromPoint(bounds.left - 1, bounds.top, MINING_ISO_BOARD), null);
assert.equal(miningIsoBlockIdFromPoint(bounds.right + 1, bounds.top, MINING_ISO_BOARD), null);
assert.equal(miningIsoBlockIdFromPoint(bounds.left, bounds.bottom + 1, MINING_ISO_BOARD), null);

const block21 = miningIsoBlockCenter(21, MINING_ISO_BOARD);
assert.equal(miningIsoBlockIdFromPoint(block21.x, block21.y - MINING_ISO_BOARD.tileHeight / 2 + 1, MINING_ISO_BOARD), 21);
assert.equal(miningIsoBlockIdFromPoint(block21.x, block21.y - MINING_ISO_BOARD.tileHeight / 2 - 1, MINING_ISO_BOARD), 14);
assert.equal(miningIsoBlockIdFromPoint(block21.x, block21.y + MINING_ISO_BOARD.tileHeight / 2 - 1, MINING_ISO_BOARD), 21);
assert.equal(miningIsoBlockIdFromPoint(block21.x, block21.y + MINING_ISO_BOARD.tileHeight / 2 + 1, MINING_ISO_BOARD), 28);

console.log('miningIsoGeometry ok');
