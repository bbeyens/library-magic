import assert from 'node:assert/strict';
import {
  blackjackActionMaxLevel,
  blackjackActionResultBonus,
  blackjackActionUpgradeCost,
  blackjackActionUpgradeSteps,
  blackjackBonusActivationCost,
  blackjackBonusAutoUnlocked,
  blackjackLoanDebtForLevel,
  blackjackMissRefund,
  blackjackMainBet,
  blackjackMoneyGainSplit,
  blackjackNaturalPayoutMultiplier,
  blackjackPayoutMultiplier,
  blackjackSideBonusXp,
  blackjackWinPayoutMultiplier,
  blackjackWinStreakBonus,
  evaluateTwentyOneThree,
  evaluatePairBonus,
} from '../src/game/simulation/blackjackRules.ts';
import type { BlackjackCard } from '../src/game/simulation/state.ts';

const card = (rank: BlackjackCard['rank'], suit: BlackjackCard['suit']): BlackjackCard => ({ rank, suit });

assert.equal(blackjackMainBet(1), 10);
assert.equal(blackjackMainBet(4), 16);
assert.equal(blackjackWinPayoutMultiplier(1), 2);
assert.equal(blackjackWinPayoutMultiplier(2), 2.1);
assert.equal(blackjackWinPayoutMultiplier(3), 2.2);
assert.equal(blackjackNaturalPayoutMultiplier(2), 2.6);
assert.equal(blackjackNaturalPayoutMultiplier(3), 2.7);
assert.equal(blackjackWinStreakBonus(10, 1, 4), 0);
assert.equal(blackjackWinStreakBonus(10, 3, 4), 2);
assert.equal(blackjackLoanDebtForLevel(40, 4), 60);
assert.equal(blackjackLoanDebtForLevel(40, 5), 48);
assert.equal(blackjackActionUpgradeCost(0), 90);
assert.equal(blackjackActionMaxLevel(), 20);
assert.equal(blackjackActionUpgradeSteps().length, 5);
assert.deepEqual(blackjackActionResultBonus(2, 18, 20, 'lost', true, false), {
  gain: 2,
  label: 'Double amorti',
});
assert.equal(blackjackBonusActivationCost(10, 'pair'), 1);
assert.equal(blackjackBonusActivationCost(20, 'twentyOneThree'), 3);

assert.deepEqual(evaluatePairBonus([card('7', 'hearts'), card('7', 'diamonds')]), {
  kind: 'coloredPair',
  multiplier: 12,
  xp: 5,
  label: 'Colored Pair',
});
assert.deepEqual(evaluatePairBonus([card('Q', 'spades'), card('Q', 'spades')]), {
  kind: 'perfectPair',
  multiplier: 25,
  xp: 9,
  label: 'Perfect Pair',
});
assert.equal(evaluatePairBonus([card('Q', 'spades'), card('K', 'spades')]), null);

assert.deepEqual(evaluateTwentyOneThree([card('5', 'hearts'), card('6', 'hearts')], card('7', 'hearts')), {
  kind: 'straightFlush',
  multiplier: 40,
  xp: 11,
  label: 'Straight Flush',
});
assert.deepEqual(evaluateTwentyOneThree([card('9', 'clubs'), card('9', 'hearts')], card('9', 'diamonds')), {
  kind: 'threeOfKind',
  multiplier: 30,
  xp: 8,
  label: 'Three of a Kind',
});
assert.deepEqual(evaluateTwentyOneThree([card('A', 'spades'), card('K', 'spades')], card('Q', 'spades')), {
  kind: 'straightFlush',
  multiplier: 40,
  xp: 11,
  label: 'Straight Flush',
});
assert.equal(evaluateTwentyOneThree([card('2', 'spades'), card('7', 'hearts')], card('Q', 'clubs')), null);

assert.deepEqual(blackjackMoneyGainSplit(80, 60), { bankrollGain: 40, debtPaid: 40, remainingDebt: 20 });
assert.deepEqual(blackjackMoneyGainSplit(80, 20), { bankrollGain: 60, debtPaid: 20, remainingDebt: 0 });
assert.deepEqual(blackjackMoneyGainSplit(80, 0), { bankrollGain: 80, debtPaid: 0, remainingDebt: 0 });

assert.equal(blackjackSideBonusXp(8, false), 8);
assert.equal(blackjackSideBonusXp(8, true), 4);

assert.equal(blackjackPayoutMultiplier(6, 1, 'pair'), 6);
assert.equal(blackjackPayoutMultiplier(6, 2, 'pair'), 6.6000000000000005);
assert.equal(blackjackPayoutMultiplier(6, 5, 'pair'), 8.399999999999999);
assert.equal(blackjackSideBonusXp(8, false, 3), 9);
assert.equal(blackjackMissRefund(20, 3, 'pair'), 0);
assert.equal(blackjackMissRefund(20, 4, 'pair'), 4);
assert.equal(blackjackMissRefund(20, 5, 'twentyOneThree'), 0);
assert.equal(blackjackPayoutMultiplier(40, 4, 'twentyOneThree', 'straightFlush'), 57.599999999999994);
assert.equal(blackjackPayoutMultiplier(5, 4, 'twentyOneThree', 'flush'), 6.2);
assert.equal(blackjackBonusAutoUnlocked(4), false);
assert.equal(blackjackBonusAutoUnlocked(5), true);

console.log('blackjackRules ok');
