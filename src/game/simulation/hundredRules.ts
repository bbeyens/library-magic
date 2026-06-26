export type HundredOptionId = 'A' | 'B' | 'C' | 'D';
export type HundredOutcome = 'idle' | 'rolled' | 'won' | 'bust';

export interface HundredRange {
  min: number;
  max: number;
}

export const HUNDRED_TARGET_MIN = 100;

const BASE_RANGES: Record<HundredOptionId, HundredRange> = {
  A: { min: 2, max: 4 },
  B: { min: 10, max: 20 },
  C: { min: 30, max: 60 },
  D: { min: 50, max: 100 },
};

export function hundredTargetMax(level: number): number {
  return HUNDRED_TARGET_MIN + Math.max(0, level - 1);
}

export function hundredOptionRange(optionId: HundredOptionId, level: number): HundredRange {
  const base = BASE_RANGES[optionId];
  const reduction = Math.max(0, level - 1);
  const mid = (base.min + base.max) / 2;
  const halfSpread = Math.max(0, Math.ceil((base.max - base.min) / 2) - reduction);
  return {
    min: Math.max(base.min, Math.floor(mid - halfSpread)),
    max: Math.min(base.max, Math.ceil(mid + halfSpread)),
  };
}

export function rollHundredOption(optionId: HundredOptionId, level: number, random = Math.random): number {
  const range = hundredOptionRange(optionId, level);
  return range.min + Math.floor(random() * (range.max - range.min + 1));
}

export function hundredReward(level: number, total: number): number {
  const precisionBonus = Math.max(0, total - HUNDRED_TARGET_MIN);
  return 3 + Math.floor(level * 0.8) + precisionBonus;
}
