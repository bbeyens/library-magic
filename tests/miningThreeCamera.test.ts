import assert from 'node:assert/strict';
import { MINING_GRID_COLUMNS, MINING_GRID_ROWS } from '../src/game/simulation/state.ts';
import { miningThreeCameraViewSize } from '../src/ui/miningThreeTerrain.ts';

const projectedBoardWidth = (MINING_GRID_COLUMNS + MINING_GRID_ROWS) / Math.SQRT2;
const viewSize = miningThreeCameraViewSize();
const boardWidthRatio = projectedBoardWidth / viewSize;

assert.ok(boardWidthRatio >= 0.8, `board should remain readable, got ${(boardWidthRatio * 100).toFixed(1)}%`);
assert.ok(boardWidthRatio <= 0.9, `board sides need visible margins, got ${(boardWidthRatio * 100).toFixed(1)}%`);

console.log('miningThreeCamera ok');
