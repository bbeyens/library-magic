import { MINING_GRID_COLUMNS, MINING_GRID_ROWS } from '../game/simulation/state.ts';

export interface MiningIsoBoard {
  columns: number;
  rows: number;
  tileWidth: number;
  tileHeight: number;
  paddingX: number;
  paddingY: number;
}

export interface MiningIsoPoint {
  x: number;
  y: number;
}

export interface MiningIsoBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export const MINING_ISO_BOARD: MiningIsoBoard = {
  columns: MINING_GRID_COLUMNS,
  rows: MINING_GRID_ROWS,
  tileWidth: 48,
  tileHeight: 24,
  paddingX: 24,
  paddingY: 24,
};

export function miningIsoBoardBounds(board: MiningIsoBoard = MINING_ISO_BOARD): MiningIsoBounds {
  const width = ((board.columns + board.rows) * board.tileWidth) / 2 + board.paddingX * 2;
  const height = ((board.columns + board.rows) * board.tileHeight) / 2 + board.paddingY * 2;
  return {
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height,
  };
}

export function miningIsoBlockCenter(blockId: number, board: MiningIsoBoard = MINING_ISO_BOARD): MiningIsoPoint {
  const column = Math.max(0, Math.min(board.columns - 1, Math.floor(blockId) % board.columns));
  const row = Math.max(0, Math.min(board.rows - 1, Math.floor(blockId / board.columns)));
  const bounds = miningIsoBoardBounds(board);
  return {
    x: bounds.width / 2 + (column - row) * (board.tileWidth / 2),
    y: board.paddingY + board.tileHeight / 2 + (column + row) * (board.tileHeight / 2),
  };
}

export function miningIsoBlockIdFromPoint(
  x: number,
  y: number,
  board: MiningIsoBoard = MINING_ISO_BOARD,
): number | null {
  const bounds = miningIsoBoardBounds(board);
  if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) {
    return null;
  }

  const originX = bounds.width / 2;
  const originY = board.paddingY;
  const isoX = (x - originX) / (board.tileWidth / 2);
  const isoY = (y - originY) / (board.tileHeight / 2);
  const column = Math.floor((isoY + isoX) / 2);
  const row = Math.floor((isoY - isoX) / 2);

  if (column < 0 || column >= board.columns || row < 0 || row >= board.rows) {
    return null;
  }

  return row * board.columns + column;
}
