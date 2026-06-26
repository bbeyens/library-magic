export type TargetSkillId = 'spawnSpeed' | 'targetCount' | 'damage' | 'automation';

export function targetSpawnInterval(level: number): number {
  return roundToHundredth(Math.max(0.4, 1.4 - Math.max(0, level) * 0.1));
}

export function targetMaxActiveTargets(level: number): number {
  return Math.min(6, 1 + Math.max(0, level));
}

export function targetAttackDamage(level: number): number {
  return 1 + Math.max(0, level);
}

export function targetAutomationInterval(level: number): number {
  if (level <= 0) {
    return 0;
  }
  return roundToHundredth(Math.max(0.85, 2.35 - level * 0.15));
}

export function targetReward(bookLevel: number, targetMaxHealth: number): number {
  return Math.max(1, targetMaxHealth) + Math.floor(Math.max(1, bookLevel) * 0.8) + 1;
}

function roundToHundredth(value: number): number {
  return Math.round(value * 100) / 100;
}
