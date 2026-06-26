import type { BlackjackCard, BlackjackUpgradeCellId } from './state';

export type BlackjackSideBonusId = 'pair' | 'twentyOneThree';

export type PairBonusKind = 'pair' | 'coloredPair' | 'perfectPair';
export type TwentyOneThreeBonusKind = 'flush' | 'straight' | 'threeOfKind' | 'straightFlush' | 'suitedTrips';

export interface BlackjackBonusOutcome<TKind extends string = string> {
  kind: TKind;
  multiplier: number;
  xp: number;
  label: string;
}

export interface BlackjackMoneyGainSplit {
  bankrollGain: number;
  debtPaid: number;
  remainingDebt: number;
}

export interface BlackjackBonusUpgradeStep {
  level: number;
  title: string;
  detail: string;
}

export interface BlackjackActionResultBonus {
  gain: number;
  label: string;
}

export type BlackjackUpgradeCost =
  | { kind: 'resources'; mana: number; chips: number }
  | { kind: 'chips'; chips: number }
  | { kind: 'pairXp' | 'twentyOneThreeXp'; xp: number }
  | { kind: 'blocked'; reason: string }
  | { kind: 'max' };

export type BlackjackUpgradeTier = 'gray' | 'green' | 'blue' | 'purple' | 'red' | 'yellow';

export const BLACKJACK_UPGRADE_CELL_IDS: BlackjackUpgradeCellId[] = [
  'wagerBase',
  'wagerWin',
  'wagerNatural',
  'wagerStreak',
  'wagerDebt',
  'actionStand',
  'actionDouble',
  'actionSplit',
  'actionFaceSplit',
  'actionMastery',
  'autoDeal',
  'autoSpeed',
  'pairUnlock',
  'pairPayout',
  'pairXp',
  'pairRefund',
  'pairAuto',
  'twentyOneThreeUnlock',
  'twentyOneThreePayout',
  'twentyOneThreeXp',
  'twentyOneThreeJackpot',
  'twentyOneThreeAuto',
];

export function blackjackUpgradeCellMaxLevel(cellId: BlackjackUpgradeCellId): number {
  switch (cellId) {
    case 'autoDeal':
    case 'pairUnlock':
    case 'pairAuto':
    case 'twentyOneThreeUnlock':
    case 'twentyOneThreeAuto':
      return 2;
    case 'autoSpeed':
      return 3;
    case 'wagerDebt':
    case 'actionFaceSplit':
    case 'pairRefund':
    case 'twentyOneThreeJackpot':
      return 4;
    default:
      return 5;
  }
}

export function blackjackUpgradeTier(level: number, maxLevel: number): BlackjackUpgradeTier {
  if (level >= maxLevel) {
    return 'yellow';
  }
  if (level >= 5) {
    return 'red';
  }
  if (level >= 4) {
    return 'purple';
  }
  if (level >= 3) {
    return 'blue';
  }
  if (level >= 2) {
    return 'green';
  }
  return 'gray';
}

export function blackjackUpgradeCellCost(cellId: BlackjackUpgradeCellId, currentLevel: number): BlackjackUpgradeCost {
  const maxLevel = blackjackUpgradeCellMaxLevel(cellId);
  if (currentLevel >= maxLevel) {
    return { kind: 'max' };
  }

  switch (cellId) {
    case 'wagerBase':
      return {
        kind: 'resources',
        mana: Math.round(20 * Math.pow(1.55, Math.max(0, currentLevel - 1))),
        chips: Math.round(3 * Math.pow(1.35, Math.max(0, currentLevel - 1))),
      };
    case 'wagerWin':
      return { kind: 'resources', mana: Math.round(18 * Math.pow(1.45, currentLevel - 1)), chips: Math.round(5 * Math.pow(1.4, currentLevel - 1)) };
    case 'wagerNatural':
      return { kind: 'resources', mana: Math.round(30 * Math.pow(1.5, currentLevel - 1)), chips: Math.round(9 * Math.pow(1.45, currentLevel - 1)) };
    case 'wagerStreak':
      return { kind: 'resources', mana: Math.round(42 * Math.pow(1.52, currentLevel - 1)), chips: Math.round(12 * Math.pow(1.48, currentLevel - 1)) };
    case 'wagerDebt':
      return { kind: 'resources', mana: Math.round(56 * Math.pow(1.58, currentLevel - 1)), chips: Math.round(16 * Math.pow(1.5, currentLevel - 1)) };
    case 'actionStand':
      return { kind: 'chips', chips: Math.round(60 * Math.pow(1.34, currentLevel - 1)) };
    case 'actionDouble':
      return { kind: 'chips', chips: Math.round(90 * Math.pow(1.36, currentLevel - 1)) };
    case 'actionSplit':
      return { kind: 'chips', chips: Math.round(110 * Math.pow(1.38, currentLevel - 1)) };
    case 'actionFaceSplit':
      return { kind: 'chips', chips: Math.round(135 * Math.pow(1.42, currentLevel - 1)) };
    case 'actionMastery':
      return { kind: 'chips', chips: Math.round(160 * Math.pow(1.45, currentLevel - 1)) };
    case 'autoDeal':
      return { kind: 'resources', mana: 20, chips: 3 };
    case 'autoSpeed':
      return { kind: 'resources', mana: Math.round(45 * Math.pow(1.6, currentLevel - 1)), chips: Math.round(12 * Math.pow(1.5, currentLevel - 1)) };
    case 'pairUnlock':
      return { kind: 'chips', chips: 80 };
    case 'pairPayout':
      return { kind: 'pairXp', xp: Math.round(12 * Math.pow(1.3, currentLevel - 1)) };
    case 'pairXp':
      return { kind: 'pairXp', xp: Math.round(16 * Math.pow(1.32, currentLevel - 1)) };
    case 'pairRefund':
      return { kind: 'pairXp', xp: Math.round(22 * Math.pow(1.35, currentLevel - 1)) };
    case 'pairAuto':
      return { kind: 'pairXp', xp: 40 };
    case 'twentyOneThreeUnlock':
      return { kind: 'chips', chips: 160 };
    case 'twentyOneThreePayout':
      return { kind: 'twentyOneThreeXp', xp: Math.round(14 * Math.pow(1.32, currentLevel - 1)) };
    case 'twentyOneThreeXp':
      return { kind: 'twentyOneThreeXp', xp: Math.round(18 * Math.pow(1.35, currentLevel - 1)) };
    case 'twentyOneThreeJackpot':
      return { kind: 'twentyOneThreeXp', xp: Math.round(26 * Math.pow(1.38, currentLevel - 1)) };
    case 'twentyOneThreeAuto':
      return { kind: 'twentyOneThreeXp', xp: 48 };
  }
}

export function blackjackMainBet(bookLevel: number): number {
  return 10 + Math.max(0, bookLevel - 1) * 2;
}

export function blackjackWinPayoutMultiplier(bookLevel: number): number {
  return roundTenth(2 + Math.max(0, bookLevel - 1) * 0.1);
}

export function blackjackNaturalPayoutMultiplier(bookLevel: number): number {
  return roundTenth(blackjackWinPayoutMultiplier(bookLevel) + 0.5);
}

export function blackjackWinStreakBonus(bet: number, streak: number, bookLevel: number): number {
  if (bookLevel < 4 || streak < 2) {
    return 0;
  }
  return Math.floor(bet * Math.min(3, streak - 1) * 0.12);
}

export function blackjackLoanDebtForLevel(loanAmount: number, bookLevel: number): number {
  return Math.ceil(loanAmount * (bookLevel >= 5 ? 1.2 : 1.5));
}

export function blackjackActionUpgradeCost(level: number): number {
  return Math.round(90 * Math.pow(1.28, Math.max(0, level)));
}

export function blackjackActionMaxLevel(): number {
  return 20;
}

export function blackjackActionUpgradeSteps(): BlackjackBonusUpgradeStep[] {
  return [
    { level: 1, title: 'Rester lucide', detail: 'Debloque un bonus scalable sur les victoires entre 18 et 20.' },
    { level: 2, title: 'Double amorti', detail: 'Debloque un remboursement scalable quand un double perd.' },
    { level: 3, title: 'Split discipline', detail: 'Diviser coute moins cher, puis baisse encore avec les niveaux.' },
    { level: 4, title: 'Figures jumelles', detail: 'Les splits J/Q/K gagnent un bonus scalable sur chaque main victorieuse.' },
    { level: 5, title: 'Routine de table', detail: 'Les niveaux suivants continuent de monter toutes les valeurs numeriques.' },
  ];
}

export function blackjackActionCurrentEffectLabel(level: number): string {
  if (level <= 0) {
    return 'A debloquer';
  }
  return [
    `18-20 +${percent(blackjackStandBonusRatio(level))}`,
    level >= 2 ? `double rendu ${percent(blackjackDoubleRefundRatio(level))}` : 'double bloque',
    level >= 3 ? `split ${percent(blackjackSplitCostRatio(level))} du cout` : 'split plein tarif',
    level >= 4 ? `figures +${percent(blackjackFaceSplitBonusRatio(level))}` : 'figures bloquees',
  ].join(' · ');
}

export function blackjackActionNextEffectLabel(level: number): string {
  const nextLevel = Math.min(blackjackActionMaxLevel(), level + 1);
  return blackjackActionCurrentEffectLabel(nextLevel);
}

export function blackjackSplitCostRatio(actionLevel: number): number {
  if (actionLevel < 3) {
    return 1;
  }
  return Math.max(0.55, 0.8 - Math.max(0, actionLevel - 3) * 0.02);
}

export function blackjackActionResultBonus(
  actionLevel: number,
  handValue: number,
  bet: number,
  outcome: 'won' | 'lost' | 'push' | 'blackjack',
  doubled: boolean,
  splitFromFacePair: boolean,
): BlackjackActionResultBonus | null {
  if (actionLevel >= 2 && doubled && outcome === 'lost') {
    return {
      gain: Math.floor((bet / 2) * blackjackDoubleRefundRatio(actionLevel)),
      label: 'Double amorti',
    };
  }

  if (actionLevel >= 4 && splitFromFacePair && outcome === 'won') {
    return {
      gain: Math.floor(bet * blackjackFaceSplitBonusRatio(actionLevel)),
      label: 'Figures jumelles',
    };
  }

  if (actionLevel >= 1 && outcome === 'won' && handValue >= 18 && handValue <= 20) {
    return {
      gain: Math.floor(bet * blackjackStandBonusRatio(actionLevel)),
      label: 'Rester lucide',
    };
  }

  return null;
}

function blackjackStandBonusRatio(actionLevel: number): number {
  return actionLevel <= 0 ? 0 : 0.1 + actionLevel * 0.02;
}

function blackjackDoubleRefundRatio(actionLevel: number): number {
  return actionLevel < 2 ? 0 : Math.min(0.5, 0.25 + Math.max(0, actionLevel - 2) * 0.03);
}

function blackjackFaceSplitBonusRatio(actionLevel: number): number {
  return actionLevel < 4 ? 0 : Math.min(0.85, 0.35 + Math.max(0, actionLevel - 4) * 0.04);
}

export function blackjackBonusActivationCost(mainBet: number, bonusId: BlackjackSideBonusId): number {
  const ratio = bonusId === 'pair' ? 0.1 : 0.15;
  return Math.max(1, Math.ceil(mainBet * ratio));
}

export function blackjackPayoutMultiplier(
  baseMultiplier: number,
  bonusLevel: number,
  bonusId: BlackjackSideBonusId = 'pair',
  outcomeKind?: PairBonusKind | TwentyOneThreeBonusKind,
): number {
  if (bonusId === 'pair') {
    const payoutBoost = Math.max(0, bonusLevel - 1) * 0.1;
    return baseMultiplier * (1 + payoutBoost);
  }

  const baseBoost = Math.max(0, bonusLevel - 1) * 0.08;
  const jackpotBoost =
    bonusLevel >= 4 && (outcomeKind === 'straightFlush' || outcomeKind === 'suitedTrips')
      ? 0.2 + Math.max(0, bonusLevel - 4) * 0.03
      : 0;
  return baseMultiplier * (1 + baseBoost + jackpotBoost);
}

export function blackjackSideBonusXp(baseXp: number, debtActive: boolean, bonusLevel = 1): number {
  const boostedXp = baseXp * (1 + Math.max(0, bonusLevel - 1) * 0.08);
  const debtMultiplier = debtActive ? 0.5 : 1;
  return Math.max(1, Math.floor(boostedXp * debtMultiplier));
}

export function blackjackMissRefund(cost: number, bonusLevel: number, bonusId: BlackjackSideBonusId = 'pair'): number {
  if (bonusId !== 'pair' || bonusLevel < 4) {
    return 0;
  }
  return Math.floor(cost * Math.min(0.5, 0.2 + Math.max(0, bonusLevel - 4) * 0.03));
}

export function blackjackBonusUpgradeXpCost(level: number): number {
  return Math.round(12 * Math.pow(1.22, Math.max(0, level - 1)));
}

export function blackjackBonusMaxLevel(): number {
  return 20;
}

export function blackjackBonusAutoUnlocked(level: number): boolean {
  return level >= 5;
}

export function blackjackBonusUpgradeSteps(bonusId: BlackjackSideBonusId): BlackjackBonusUpgradeStep[] {
  if (bonusId === 'pair') {
    return [
      { level: 1, title: 'Deblocage Pair', detail: 'Active le pari Pair sur les 2 cartes joueur.' },
      { level: 2, title: 'Paiement Pair', detail: '+20% sur Pair, Colored Pair et Perfect Pair.' },
      { level: 3, title: 'XP Pair', detail: '+35% XP Pair sur les reussites.' },
      { level: 4, title: 'Ratage amorti', detail: 'Rend 25% du cout quand Pair rate.' },
      { level: 5, title: 'Auto Pair', detail: 'Active Pair automatiquement au debut de la main.' },
    ];
  }

  return [
    { level: 1, title: 'Deblocage 21+3', detail: 'Active le pari 21+3 avec les 2 cartes joueur et la carte visible.' },
    { level: 2, title: 'Paiement 21+3', detail: '+15% sur les gains Flush, Straight et brelans.' },
    { level: 3, title: 'XP 21+3', detail: '+35% XP 21+3 sur les reussites.' },
    { level: 4, title: 'Jackpots 21+3', detail: '+25% sur Straight Flush et Suited Trips.' },
    { level: 5, title: 'Auto 21+3', detail: 'Active 21+3 automatiquement au debut de la main.' },
  ];
}

export function blackjackBonusCurrentEffectLabel(bonusId: BlackjackSideBonusId, level: number): string {
  if (level <= 0) {
    return bonusId === 'pair' ? 'A debloquer avec Jetons' : 'Debloque Pair avant';
  }
  if (bonusId === 'pair') {
    return `Payout x${(1 + Math.max(0, level - 1) * 0.1).toFixed(1)} · XP x${(1 + Math.max(0, level - 1) * 0.08).toFixed(2)} · refund ${level >= 4 ? percent(Math.min(0.5, 0.2 + Math.max(0, level - 4) * 0.03)) : '0%'}`;
  }
  return `Payout x${(1 + Math.max(0, level - 1) * 0.08).toFixed(2)} · XP x${(1 + Math.max(0, level - 1) * 0.08).toFixed(2)} · jackpot ${level >= 4 ? `+${percent(0.2 + Math.max(0, level - 4) * 0.03)}` : 'bloque'}`;
}

export function blackjackMoneyGainSplit(gain: number, debt: number): BlackjackMoneyGainSplit {
  if (gain <= 0) {
    return { bankrollGain: 0, debtPaid: 0, remainingDebt: Math.max(0, debt) };
  }
  if (debt <= 0) {
    return { bankrollGain: gain, debtPaid: 0, remainingDebt: 0 };
  }

  const debtPaid = Math.min(debt, gain * 0.5);
  return {
    bankrollGain: gain - debtPaid,
    debtPaid,
    remainingDebt: debt - debtPaid,
  };
}

export function blackjackLoanAmount(mainBet: number): number {
  return Math.max(40, mainBet * 4);
}

export function blackjackLoanDebt(loanAmount: number): number {
  return blackjackLoanDebtForLevel(loanAmount, 1);
}

export function evaluatePairBonus(cards: BlackjackCard[]): BlackjackBonusOutcome<PairBonusKind> | null {
  const [first, second] = cards;
  if (!first || !second || first.rank !== second.rank) {
    return null;
  }
  if (first.suit === second.suit) {
    return { kind: 'perfectPair', multiplier: 25, xp: 9, label: 'Perfect Pair' };
  }
  if (cardColor(first) === cardColor(second)) {
    return { kind: 'coloredPair', multiplier: 12, xp: 5, label: 'Colored Pair' };
  }
  return { kind: 'pair', multiplier: 6, xp: 3, label: 'Pair' };
}

export function evaluateTwentyOneThree(
  playerCards: BlackjackCard[],
  dealerUpcard: BlackjackCard | undefined,
): BlackjackBonusOutcome<TwentyOneThreeBonusKind> | null {
  const cards = [playerCards[0], playerCards[1], dealerUpcard].filter((card): card is BlackjackCard => Boolean(card));
  if (cards.length !== 3) {
    return null;
  }

  const sameSuit = cards.every((card) => card.suit === cards[0].suit);
  const sameRank = cards.every((card) => card.rank === cards[0].rank);
  const straight = isThreeCardStraight(cards);

  if (sameSuit && sameRank) {
    return { kind: 'suitedTrips', multiplier: 100, xp: 18, label: 'Suited Trips' };
  }
  if (sameSuit && straight) {
    return { kind: 'straightFlush', multiplier: 40, xp: 11, label: 'Straight Flush' };
  }
  if (sameRank) {
    return { kind: 'threeOfKind', multiplier: 30, xp: 8, label: 'Three of a Kind' };
  }
  if (straight) {
    return { kind: 'straight', multiplier: 10, xp: 5, label: 'Straight' };
  }
  if (sameSuit) {
    return { kind: 'flush', multiplier: 5, xp: 3, label: 'Flush' };
  }
  return null;
}

function cardColor(card: BlackjackCard): 'red' | 'black' {
  return card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
}

function isThreeCardStraight(cards: BlackjackCard[]): boolean {
  const rankValues = cards.map((card) => blackjackRankValue(card.rank)).sort((first, second) => first - second);
  const uniqueValues = new Set(rankValues);
  if (uniqueValues.size !== 3) {
    return false;
  }
  if (rankValues[0] + 1 === rankValues[1] && rankValues[1] + 1 === rankValues[2]) {
    return true;
  }
  return rankValues[0] === 1 && rankValues[1] === 12 && rankValues[2] === 13;
}

function blackjackRankValue(rank: BlackjackCard['rank']): number {
  switch (rank) {
    case 'A':
      return 1;
    case 'J':
      return 11;
    case 'Q':
      return 12;
    case 'K':
      return 13;
    default:
      return Number(rank);
  }
}

function roundTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
