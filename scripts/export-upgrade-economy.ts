import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  BLACKJACK_UPGRADE_CELL_IDS,
  blackjackUpgradeCellCost,
  blackjackUpgradeCellMaxLevel,
} from '../src/game/simulation/blackjackRules';
import {
  defenseBaseSpeedMultiplier,
  defenseGoldMultiplier,
  defenseIceAttackInterval,
  defenseIceDamage,
  defenseIceRangePercent,
  defenseIceSlow,
  defenseLightningAttackInterval,
  defenseLightningDamage,
  defenseLightningTargetCount,
  defenseMaxTowerHealth,
  defenseSkillCost,
  defenseSkillDamageMultiplier,
  defenseSkillMaxLevel,
  defenseTowerAttackInterval,
  defenseTowerDamage,
  defenseTowerHealthRegenPerSecond,
  defenseTowerRangePercent,
  manaAutomationInterval,
  manaClickGainPreview,
  manaCriticalMultiplier,
  manaHoldClickUnlocked,
  manaLevelUpEffectMultiplier,
  manaSkillCost,
  manaSkillMaxLevel,
  manaWandCount,
  manaXpOrbChance,
  manaXpOrbValue,
  manaYellowOrbChance,
  manaGreenOrbChance,
  manaBlueOrbChance,
  miningAutomationInterval,
  miningPickaxeDamage,
  miningSkillCost,
  miningSkillMaxLevel,
  miningSplashDamage,
  snakeBaseMultiplier,
  snakeGridSize,
  snakeMoveInterval,
  snakeSkillCost,
  snakeSkillMaxLevel,
  targetSkillCost,
  targetSkillMaxLevel,
  type DefenseSkillId,
  type ManaSkillId,
  type MiningSkillId,
  type SnakeSkillId,
  type TargetSkillId,
} from '../src/game/simulation/actions';
import {
  targetAttackDamage,
  targetAutomationInterval,
  targetMaxActiveTargets,
  targetSpawnInterval,
} from '../src/game/simulation/targetRules';
import { createInitialState, type GameState } from '../src/game/simulation/state';

type Row = {
  mini_game: string;
  category: string;
  skill_id: string;
  skill_name: string;
  current_level: number;
  buy_to_level: number;
  max_level: number | 'uncapped';
  cost_resource: string;
  cost_amount: string;
  value_after_purchase: string;
  delta: string;
  notes: string;
};

const OUT_DIR = 'docs/economy';
const CSV_PATH = join(OUT_DIR, 'upgrade-costs.csv');
const MD_PATH = join(OUT_DIR, 'upgrade-costs.md');
const UNCAPPED_EXPORT_LEVELS = 100;

const manaSkills: Array<{ id: ManaSkillId; name: string; category: string; value: (state: GameState) => string; delta: string; notes?: string }> = [
  { id: 'power', name: 'Power +', category: 'Click', value: (state) => `${manaClickGainPreview(state)} mana/click`, delta: '+1 base damage' },
  {
    id: 'clickMultiplier',
    name: 'Click Multiplier',
    category: 'Click',
    value: (state) => `${formatNumber(1 + state.manaSkills.clickMultiplier * 0.25)}x`,
    delta: '+25%',
  },
  { id: 'criticalHit', name: 'Critical Chance', category: 'Click', value: (state) => `${state.manaSkills.criticalHit}%`, delta: '+1%' },
  {
    id: 'criticalEffect',
    name: 'Critical Multiplier',
    category: 'Click',
    value: (state) => `${formatNumber(manaCriticalMultiplier(state))}x`,
    delta: '+0.1x',
  },
  { id: 'xpOrbChance', name: 'Red Orb', category: 'XP', value: (state) => `${formatPercent(manaXpOrbChance(state))}`, delta: '+5%' },
  {
    id: 'yellowOrbChance',
    name: 'Yellow Orb',
    category: 'XP',
    value: (state) => `${formatPercent(manaYellowOrbChance(state))}`,
    delta: '+5%',
  },
  {
    id: 'greenOrbChance',
    name: 'Green Orb',
    category: 'XP',
    value: (state) => `${formatPercent(manaGreenOrbChance(state))}`,
    delta: '+5%',
  },
  {
    id: 'blueOrbChance',
    name: 'Blue Orb',
    category: 'XP',
    value: (state) => `${formatPercent(manaBlueOrbChance(state))}`,
    delta: '+5%',
  },
  { id: 'xpValue', name: 'Exp x', category: 'XP', value: (state) => `${formatNumber(manaXpOrbValue(state))}x`, delta: '+1 XP multiplier' },
  {
    id: 'levelUpEffect',
    name: 'Level Up Effect',
    category: 'XP',
    value: (state) => `${formatNumber(manaLevelUpEffectMultiplier(state))}x`,
    delta: '+10%',
  },
  {
    id: 'holdClick',
    name: 'Click Holder',
    category: 'Auto',
    value: (state) => (manaHoldClickUnlocked(state) ? '10 clicks/s' : 'Off'),
    delta: 'unlock',
  },
  {
    id: 'automation',
    name: 'Wand Speed',
    category: 'Auto',
    value: (state) => `${formatNumber(manaAutomationInterval(state.manaSkills.automation))}s`,
    delta: '-0.1s',
  },
  { id: 'extraWands', name: 'Wand Count', category: 'Auto', value: (state) => `${manaWandCount(state)} wands`, delta: '+1 wand' },
];

const snakeSkills: Array<{ id: SnakeSkillId; name: string; value: (state: GameState) => string; delta: string }> = [
  { id: 'speed', name: 'Vitesse', value: (state) => `${formatNumber(snakeMoveInterval(state))}s/case`, delta: '-0.022s then cap 0.10s' },
  { id: 'gridSize', name: 'Taille grille', value: (state) => `${snakeGridSize(state)}x${snakeGridSize(state)}`, delta: '+1 axis' },
  { id: 'automation', name: 'Automatisation', value: (state) => `${state.snakeSkills.automation}`, delta: 'assist direction' },
  { id: 'baseMultiplier', name: 'Base multi', value: (state) => `${formatNumber(snakeBaseMultiplier(state))}x`, delta: '+0.1x' },
  { id: 'bonusFruit', name: 'Fruits bonus', value: (state) => `${state.snakeSkills.bonusFruit}`, delta: 'orange, pear, banana' },
  { id: 'extraLife', name: 'Vie sup.', value: (state) => `${state.snakeSkills.extraLife}`, delta: '+1 life' },
  { id: 'edgeWrap', name: 'Traverse bord', value: (state) => (state.snakeSkills.edgeWrap > 0 ? 'On' : 'Off'), delta: 'unlock' },
];

const targetSkills: Array<{ id: TargetSkillId; name: string; value: (state: GameState) => string; delta: string }> = [
  { id: 'spawnSpeed', name: 'Apparition', value: (state) => `${formatNumber(targetSpawnInterval(state.targetSkills.spawnSpeed))}s`, delta: '-0.1s' },
  { id: 'targetCount', name: 'Cibles max', value: (state) => `${targetMaxActiveTargets(state.targetSkills.targetCount)}`, delta: '+1 target' },
  { id: 'damage', name: 'Degats', value: (state) => `${targetAttackDamage(state.targetSkills.damage)}`, delta: '+1 damage' },
  { id: 'automation', name: 'Automatisation', value: (state) => `${formatNumber(targetAutomationInterval(state.targetSkills.automation))}s`, delta: '-0.15s' },
];

const defenseSkills: Array<{ id: DefenseSkillId; name: string; category: string; value: (state: GameState) => string; delta: string; notes?: string }> = [
  { id: 'damage', name: 'Damage +', category: 'Attack', value: (state) => `${formatNumber(defenseTowerDamage(state))} dmg`, delta: '+1' },
  {
    id: 'attackSpeed',
    name: 'Attack Speed',
    category: 'Attack',
    value: (state) => `${formatNumber(defenseTowerAttackInterval(state))}s`,
    delta: '-0.05s',
  },
  { id: 'range', name: 'Range', category: 'Attack', value: (state) => `${formatPercent(defenseTowerRangePercent(state))}`, delta: '+2%' },
  {
    id: 'damageMultiplier',
    name: 'Damage all x',
    category: 'Attack',
    value: (state) => `${formatNumber(defenseSkillDamageMultiplier(state))}x`,
    delta: '+0.10x',
  },
  {
    id: 'criticalChance',
    name: 'Critical Chance',
    category: 'Attack',
    value: (state) => `${Math.min(60, state.defenseSkills.criticalChance * 2)}%`,
    delta: '+2%',
  },
  {
    id: 'criticalMultiplier',
    name: 'Critical Multiplier',
    category: 'Attack',
    value: (state) => `${formatNumber(2 + state.defenseSkills.criticalMultiplier * 0.1)}x`,
    delta: '+0.10x',
  },
  {
    id: 'superCriticalChance',
    name: 'Super Crit Chance',
    category: 'Attack',
    value: (state) => `${Math.min(25, state.defenseSkills.superCriticalChance)}%`,
    delta: '+1%',
  },
  {
    id: 'superCriticalMultiplier',
    name: 'Super Crit Multiplier',
    category: 'Attack',
    value: (state) => `${formatNumber(3 + state.defenseSkills.superCriticalMultiplier * 0.25)}x`,
    delta: '+0.25x',
  },
  {
    id: 'lightningCount',
    name: 'Lightning',
    category: 'Element',
    value: (state) => `${defenseLightningTargetCount(state)} targets`,
    delta: '+1 count',
  },
  {
    id: 'iceDamage',
    name: 'Ice Damage',
    category: 'Element',
    value: (state) => `${formatNumber(defenseIceDamage(state))} dmg`,
    delta: '+2',
  },
  {
    id: 'lightningDamage',
    name: 'Lightning DMG',
    category: 'Element',
    value: (state) => `${formatNumber(defenseLightningDamage(state))} dmg`,
    delta: '+5',
    notes: 'locked until Lightning >= 1',
  },
  {
    id: 'iceSpeed',
    name: 'Ice Speed',
    category: 'Element',
    value: (state) => `${formatNumber(defenseIceAttackInterval(state))}s`,
    delta: '-0.05s',
    notes: 'locked until Ice Damage >= 1',
  },
  {
    id: 'lightningSpeed',
    name: 'Lightning Speed',
    category: 'Element',
    value: (state) => `${formatNumber(defenseLightningAttackInterval(state))}s`,
    delta: '-0.08s',
    notes: 'locked until Lightning >= 1',
  },
  {
    id: 'iceRange',
    name: 'Ice Range',
    category: 'Element',
    value: (state) => `${formatPercent(defenseIceRangePercent(state))}`,
    delta: '+2%',
    notes: 'locked until Ice Damage >= 1',
  },
  {
    id: 'iceSlow',
    name: 'Ice Slow',
    category: 'Element',
    value: (state) => `${formatPercent(defenseIceSlow(state))}`,
    delta: '+2%',
    notes: 'locked until Ice Damage >= 1',
  },
  { id: 'health', name: 'Health +', category: 'Other', value: (state) => `${defenseMaxTowerHealth(state)} hp max`, delta: '+2 hp' },
  {
    id: 'healthRegen',
    name: 'Health Regen',
    category: 'Other',
    value: (state) => `${formatNumber(defenseTowerHealthRegenPerSecond(state))}/s`,
    delta: '+0.02/s',
  },
  { id: 'moneyPerEnemy', name: 'Gold +', category: 'Other', value: (state) => `${state.defenseSkills.moneyPerEnemy}`, delta: '+1' },
  {
    id: 'goldMultiplier',
    name: 'Gold x',
    category: 'Other',
    value: (state) => `${formatNumber(defenseGoldMultiplier(state))}x`,
    delta: '+10%',
  },
  {
    id: 'baseSpeed',
    name: 'Speed x',
    category: 'Other',
    value: (state) => `${formatNumber(defenseBaseSpeedMultiplier(state))}x`,
    delta: '+10% base speed',
  },
];

const miningSkills: Array<{ id: MiningSkillId; name: string; value: (state: GameState) => string; delta: string }> = [
  { id: 'pickaxeForce', name: 'Force de pioche', value: (state) => `${miningPickaxeDamage(state)} dmg`, delta: '+1 damage' },
  { id: 'splashDamage', name: 'Splash', value: (state) => `${miningSplashDamage(state)} adjacent`, delta: '+1 every 3 levels' },
  { id: 'automation', name: 'Automatisation', value: (state) => `${formatNumber(miningAutomationInterval(state.miningSkills.automation))}s`, delta: '-0.16s' },
];

const blackjackCellNames: Record<string, string> = {
  wagerBase: 'Mise max',
  wagerWin: 'Gain victoire',
  wagerNatural: 'Blackjack naturel',
  wagerStreak: 'Serie gagnante',
  wagerDebt: 'Dette reduite',
  actionStand: 'Rester lucide',
  actionDouble: 'Double amorti',
  actionSplit: 'Split moins cher',
  actionFaceSplit: 'Figures jumelles',
  actionMastery: 'Maitrise de table',
  autoDeal: 'Auto relance',
  autoSpeed: 'Relance rapide',
  pairUnlock: 'Debloquer Pair',
  pairPayout: 'Paiement Pair',
  pairXp: 'XP Pair',
  pairRefund: 'Ratage amorti',
  pairAuto: 'Auto Pair',
  twentyOneThreeUnlock: 'Debloquer 21+3',
  twentyOneThreePayout: 'Paiement 21+3',
  twentyOneThreeXp: 'XP 21+3',
  twentyOneThreeJackpot: 'Jackpot 21+3',
  twentyOneThreeAuto: 'Auto 21+3',
};

function main(): void {
  const rows: Row[] = [
    ...bookRows(),
    ...skillRows('Mana Crystal', 'Mana', manaSkills, 'manaSkills', manaSkillMaxLevel, manaSkillCost, applyManaLevel),
    ...skillRows('Snake', 'Mana', snakeSkills.map((skill) => ({ ...skill, category: 'General' })), 'snakeSkills', snakeSkillMaxLevel, snakeSkillCost, applySnakeLevel),
    ...skillRows('Target Gallery', 'Mana', targetSkills.map((skill) => ({ ...skill, category: 'General' })), 'targetSkills', targetSkillMaxLevel, targetSkillCost, applyTargetLevel),
    ...skillRows('Tower Defense', 'Sigils', defenseSkills, 'defenseSkills', defenseSkillMaxLevel, defenseSkillCost, applyDefenseLevel),
    ...skillRows('Mine', 'Mana', miningSkills.map((skill) => ({ ...skill, category: 'General' })), 'miningSkills', miningSkillMaxLevel, miningSkillCost, applyMiningLevel),
    ...blackjackRows(),
  ];

  mkdirSync(dirname(CSV_PATH), { recursive: true });
  writeFileSync(CSV_PATH, toCsv(rows));
  writeFileSync(MD_PATH, toMarkdown(rows));

  console.log(`Wrote ${rows.length} rows to ${CSV_PATH}`);
  console.log(`Wrote readable summary to ${MD_PATH}`);
}

function skillRows<TSkill extends string>(
  miniGame: string,
  costResource: string,
  skills: Array<{
    id: TSkill;
    name: string;
    category: string;
    value: (state: GameState) => string;
    delta: string;
    notes?: string;
  }>,
  _stateKey: string,
  maxLevelFor: (skillId: TSkill) => number | null,
  costFor: (state: GameState, skillId: TSkill) => number,
  applyLevel: (state: GameState, skillId: TSkill, level: number) => void,
): Row[] {
  const rows: Row[] = [];
  for (const skill of skills) {
    const maxLevel = maxLevelFor(skill.id);
    const exportMaxLevel = maxLevel ?? UNCAPPED_EXPORT_LEVELS;
    for (let currentLevel = 0; currentLevel < exportMaxLevel; currentLevel += 1) {
      const state = createInitialState();
      applyLevel(state, skill.id, currentLevel);
      const cost = costFor(state, skill.id);
      applyLevel(state, skill.id, currentLevel + 1);
      rows.push({
        mini_game: miniGame,
        category: skill.category,
        skill_id: skill.id,
        skill_name: skill.name,
        current_level: currentLevel,
        buy_to_level: currentLevel + 1,
        max_level: maxLevel ?? 'uncapped',
        cost_resource: costResource,
        cost_amount: String(cost),
        value_after_purchase: skill.value(state),
        delta: skill.delta,
        notes: skill.notes ?? (maxLevel === null ? `uncapped; exported first ${UNCAPPED_EXPORT_LEVELS} levels` : ''),
      });
    }
  }
  return rows;
}

function bookRows(): Row[] {
  const rows: Row[] = [];
  const bookIds = ['mana', 'serpent', 'typing', 'defense', 'blackjack', 'hundred', 'targets', 'mine', 'slime'] as const;
  for (const bookId of bookIds) {
    for (let currentLevel = 1; currentLevel <= 50; currentLevel += 1) {
      rows.push({
        mini_game: 'Book Level',
        category: bookId,
        skill_id: `${bookId}.bookLevel`,
        skill_name: `${bookId} book level`,
        current_level: currentLevel,
        buy_to_level: currentLevel + 1,
        max_level: 'uncapped',
        cost_resource: 'Mana + unique resource',
        cost_amount: `${Math.round(20 * Math.pow(1.55, currentLevel - 1))} Mana + ${Math.round(
          3 * Math.pow(1.35, currentLevel - 1),
        )} book resource`,
        value_after_purchase: `book level ${currentLevel + 1}`,
        delta: '+1 book level',
        notes: 'exported first 50 book levels; unique resource depends on book',
      });
    }
  }
  return rows;
}

function blackjackRows(): Row[] {
  const rows: Row[] = [];
  for (const cellId of BLACKJACK_UPGRADE_CELL_IDS) {
    const maxLevel = blackjackUpgradeCellMaxLevel(cellId);
    for (let currentLevel = 1; currentLevel < maxLevel; currentLevel += 1) {
      const cost = blackjackUpgradeCellCost(cellId, currentLevel);
      rows.push({
        mini_game: 'Blackjack',
        category: blackjackCategory(cellId),
        skill_id: cellId,
        skill_name: blackjackCellNames[cellId] ?? cellId,
        current_level: currentLevel - 1,
        buy_to_level: currentLevel,
        max_level: maxLevel - 1,
        cost_resource: blackjackCostResource(cost),
        cost_amount: blackjackCostAmount(cost),
        value_after_purchase: `internal level ${currentLevel + 1}; displayed level ${currentLevel}`,
        delta: blackjackDelta(cellId),
        notes: 'Blackjack stores internal level as displayed level + 1.',
      });
    }
  }
  return rows;
}

function blackjackCategory(cellId: string): string {
  if (cellId.startsWith('wager')) return 'Main wager';
  if (cellId.startsWith('action')) return 'Actions';
  if (cellId.startsWith('auto')) return 'Auto';
  if (cellId.startsWith('pair')) return 'Pair';
  return '21+3';
}

function blackjackDelta(cellId: string): string {
  if (cellId.endsWith('Unlock') || cellId.endsWith('Auto') || cellId === 'autoDeal') return 'unlock';
  if (cellId === 'autoSpeed') return 'faster auto deal';
  return 'see blackjackRules.ts effect label';
}

function blackjackCostResource(cost: ReturnType<typeof blackjackUpgradeCellCost>): string {
  switch (cost.kind) {
    case 'resources':
      return 'Mana + Chips';
    case 'chips':
      return 'Chips';
    case 'pairXp':
      return 'Pair XP';
    case 'twentyOneThreeXp':
      return '21+3 XP';
    case 'blocked':
      return 'Blocked';
    case 'max':
      return 'MAX';
  }
}

function blackjackCostAmount(cost: ReturnType<typeof blackjackUpgradeCellCost>): string {
  switch (cost.kind) {
    case 'resources':
      return `${cost.mana} Mana + ${cost.chips} Chips`;
    case 'chips':
      return String(cost.chips);
    case 'pairXp':
    case 'twentyOneThreeXp':
      return String(cost.xp);
    case 'blocked':
      return cost.reason;
    case 'max':
      return 'MAX';
  }
}

function applyManaLevel(state: GameState, skillId: ManaSkillId, level: number): void {
  state.manaSkills[skillId] = level;
}

function applySnakeLevel(state: GameState, skillId: SnakeSkillId, level: number): void {
  state.snakeSkills[skillId] = level;
}

function applyTargetLevel(state: GameState, skillId: TargetSkillId, level: number): void {
  state.targetSkills[skillId] = level;
}

function applyDefenseLevel(state: GameState, skillId: DefenseSkillId, level: number): void {
  state.defenseSkills[skillId] = level;
}

function applyMiningLevel(state: GameState, skillId: MiningSkillId, level: number): void {
  state.miningSkills[skillId] = level;
}

function toCsv(rows: Row[]): string {
  const headers = Object.keys(rows[0] ?? {}) as Array<keyof Row>;
  return `${headers.join(',')}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')).join('\n')}\n`;
}

function csvCell(value: unknown): string {
  const raw = String(value ?? '');
  if (!/[",\n]/.test(raw)) {
    return raw;
  }
  return `"${raw.replace(/"/g, '""')}"`;
}

function toMarkdown(rows: Row[]): string {
  const byGame = new Map<string, Row[]>();
  for (const row of rows) {
    const existing = byGame.get(row.mini_game) ?? [];
    existing.push(row);
    byGame.set(row.mini_game, existing);
  }

  const lines = [
    '# Upgrade Costs',
    '',
    'Generated from the current TypeScript economy rules.',
    '',
    `- CSV editable table: \`${CSV_PATH}\``,
    '- `current_level` is the level before purchase.',
    '- `buy_to_level` is the level after purchase.',
    '- Uncapped skills are exported only for the first configured range.',
    '',
  ];

  for (const [game, gameRows] of byGame.entries()) {
    lines.push(`## ${game}`, '');
    const sampleRows = gameRows.slice(0, 250);
    lines.push('| Category | Skill | Current | Buy To | Cost | Value After Purchase | Delta | Notes |');
    lines.push('|---|---|---:|---:|---|---|---|---|');
    for (const row of sampleRows) {
      const costDisplay = row.cost_resource ? `${row.cost_amount} (${row.cost_resource})` : row.cost_amount;
      lines.push(
        `| ${md(row.category)} | ${md(row.skill_name)} | ${row.current_level} | ${row.buy_to_level} | ${md(costDisplay)} | ${md(
          row.value_after_purchase,
        )} | ${md(row.delta)} | ${md(row.notes)} |`,
      );
    }
    if (gameRows.length > sampleRows.length) {
      lines.push('', `_Only first ${sampleRows.length}/${gameRows.length} rows shown here. Use the CSV for the full table._`);
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function md(value: unknown): string {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function formatPercent(value: number): string {
  return `${formatNumber(value * 100)}%`;
}

function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
}

main();
