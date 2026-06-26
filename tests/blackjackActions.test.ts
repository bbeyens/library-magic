import assert from 'node:assert/strict';
import {
  applyAction,
  blackjackAutoDealUnlocked,
  blackjackCanDeal,
  blackjackCurrentMainBet,
  blackjackUpgradeCellLevel,
  blackjackResultSummary,
} from '../src/game/simulation/actions.ts';
import { createInitialState, type BlackjackCard, type GameState } from '../src/game/simulation/state.ts';

const card = (rank: BlackjackCard['rank'], suit: BlackjackCard['suit']): BlackjackCard => ({ rank, suit });

function blackjackState(): GameState {
  const state = createInitialState();
  state.books.blackjack.unlocked = true;
  state.selectedBook = 'blackjack';
  state.openBookPanels = [{ bookId: 'blackjack', slot: 0 }];
  state.resources.chips = 90;
  state.blackjack.phase = 'player';
  state.blackjack.round = 1;
  state.blackjack.playerBet = 10;
  state.blackjack.playerHand = [card('10', 'hearts'), card('6', 'clubs')];
  state.blackjack.dealerHand = [card('10', 'clubs'), card('7', 'diamonds')];
  return state;
}

{
  const state = blackjackState();
  state.blackjack.deck = [card('5', 'spades')];

  applyAction(state, { type: 'doubleBlackjack' });

  assert.equal(state.blackjack.playerBet, 20);
  assert.equal(state.blackjack.playerHand.length, 3);
  assert.equal(state.blackjack.phase, 'won');
  assert.equal(state.blackjack.lastOutcome, 'Victoire');
  assert.equal(blackjackResultSummary(state), 'Victoire · +40 Jetons');
  assert.equal(state.resources.chips, 120);
}

{
  const state = blackjackState();
  state.resources.chips = 90;
  state.blackjack.playerHand = [card('8', 'hearts'), card('8', 'clubs')];
  state.blackjack.dealerHand = [card('10', 'clubs'), card('7', 'diamonds')];
  state.blackjack.deck = [card('3', 'spades'), card('2', 'diamonds')];

  applyAction(state, { type: 'splitBlackjack' });

  assert.deepEqual(state.blackjack.playerHand, [card('8', 'hearts'), card('2', 'diamonds')]);
  assert.deepEqual(state.blackjack.splitHand, [card('8', 'clubs'), card('3', 'spades')]);
  assert.equal(state.blackjack.playerBet, 10);
  assert.equal(state.blackjack.splitBet, 10);
  assert.equal(state.resources.chips, 80);
  assert.equal(state.blackjack.activeHand, 'primary');
}

{
  const state = blackjackState();
  state.resources.chips = 80;
  state.blackjack.playerHand = [card('10', 'hearts'), card('10', 'clubs')];
  state.blackjack.splitHand = [card('9', 'hearts'), card('10', 'clubs')];
  state.blackjack.playerBet = 10;
  state.blackjack.splitBet = 10;
  state.blackjack.dealerHand = [card('10', 'spades'), card('8', 'diamonds')];

  applyAction(state, { type: 'standBlackjack' });
  assert.equal(state.blackjack.phase, 'player');
  assert.equal(state.blackjack.activeHand, 'split');

  applyAction(state, { type: 'standBlackjack' });
  assert.equal(state.blackjack.phase, 'won');
  assert.equal(state.blackjack.lastOutcome, '2 victoires');
  assert.equal(state.resources.chips, 120);
}

{
  const state = blackjackState();
  state.resources.chips = 300;

  applyAction(state, { type: 'unlockBlackjackBonus', bonusId: 'pair' });
  assert.equal(state.blackjack.pair.unlocked, true);
  assert.equal(state.blackjack.pair.level, 1);
  assert.equal(state.resources.chips, 220);

  state.blackjack.pair.xp = 999;
  applyAction(state, { type: 'buyBlackjackBonusUpgrade', bonusId: 'pair' });
  applyAction(state, { type: 'buyBlackjackBonusUpgrade', bonusId: 'pair' });
  applyAction(state, { type: 'buyBlackjackBonusUpgrade', bonusId: 'pair' });
  applyAction(state, { type: 'buyBlackjackBonusUpgrade', bonusId: 'pair' });

  assert.equal(state.blackjack.pair.level, 5);
  assert.equal(state.blackjack.pair.autoEnabled, true);
}

{
  const state = blackjackState();
  state.books.blackjack.level = 2;
  state.blackjack.playerHand = [card('10', 'hearts'), card('9', 'clubs')];
  state.blackjack.dealerHand = [card('10', 'clubs'), card('8', 'diamonds')];

  applyAction(state, { type: 'standBlackjack' });

  assert.equal(state.blackjack.phase, 'won');
  assert.equal(state.blackjack.lastReward, 21);
  assert.equal(blackjackResultSummary(state), 'Victoire · +21 Jetons');
  assert.equal(state.resources.chips, 111);
}

{
  const state = blackjackState();
  state.blackjack.playerHand = [card('10', 'hearts'), card('8', 'clubs')];
  state.blackjack.dealerHand = [card('10', 'clubs'), card('2', 'diamonds')];
  state.blackjack.deck = [card('2', 'spades'), card('3', 'hearts')];

  applyAction(state, { type: 'standBlackjack' });

  assert.equal(state.blackjack.phase, 'dealer');
  assert.equal(state.blackjack.dealerCardRevealed, true);
  assert.deepEqual(state.blackjack.dealerHand, [card('10', 'clubs'), card('2', 'diamonds'), card('3', 'hearts')]);
  assert.equal(state.blackjack.lastReward, 0);

  applyAction(state, { type: 'advanceBlackjackDealer' });

  assert.equal(state.blackjack.phase, 'dealer');
  assert.deepEqual(state.blackjack.dealerHand, [
    card('10', 'clubs'),
    card('2', 'diamonds'),
    card('3', 'hearts'),
    card('2', 'spades'),
  ]);
  assert.equal(state.blackjack.lastReward, 0);

  applyAction(state, { type: 'advanceBlackjackDealer' });

  assert.equal(state.blackjack.phase, 'won');
  assert.deepEqual(state.blackjack.dealerHand, [
    card('10', 'clubs'),
    card('2', 'diamonds'),
    card('3', 'hearts'),
    card('2', 'spades'),
  ]);
  assert.equal(state.blackjack.lastOutcome, 'Victoire');
}

{
  const state = blackjackState();
  state.resources.chips = 100;

  applyAction(state, { type: 'buyBlackjackActionUpgrade' });

  assert.equal(state.blackjack.actions.unlocked, true);
  assert.equal(state.blackjack.actions.level, 1);
  assert.equal(state.resources.chips, 10);
}

{
  const state = blackjackState();
  state.resources.chips = 500;

  applyAction(state, { type: 'buyBlackjackUpgradeCell', cellId: 'actionStand' });

  assert.equal(blackjackUpgradeCellLevel(state, 'actionStand'), 2);
  assert.equal(blackjackUpgradeCellLevel(state, 'actionDouble'), 1);
  assert.equal(state.blackjack.actions.unlocked, true);
}

{
  const state = blackjackState();
  state.resources.chips = 500;

  applyAction(state, { type: 'buyBlackjackUpgradeCell', cellId: 'pairUnlock' });

  assert.equal(state.blackjack.pair.unlocked, true);
  assert.equal(blackjackUpgradeCellLevel(state, 'pairUnlock'), 2);
  assert.equal(blackjackUpgradeCellLevel(state, 'pairPayout'), 1);

  state.blackjack.pair.xp = 100;
  applyAction(state, { type: 'buyBlackjackUpgradeCell', cellId: 'pairPayout' });

  assert.equal(blackjackUpgradeCellLevel(state, 'pairPayout'), 2);
  assert.equal(blackjackUpgradeCellLevel(state, 'pairXp'), 1);
}

{
  const state = blackjackState();
  state.blackjack.actions.level = 2;
  state.blackjack.playerHand = [card('10', 'hearts'), card('6', 'clubs')];
  state.blackjack.dealerHand = [card('10', 'clubs'), card('9', 'diamonds')];
  state.blackjack.deck = [card('2', 'spades')];

  applyAction(state, { type: 'doubleBlackjack' });

  assert.equal(state.blackjack.phase, 'lost');
  assert.equal(state.blackjack.lastOutcome, 'Perdu · Double amorti +3');
  assert.equal(blackjackResultSummary(state), 'Defaite · Double amorti +3 · +3 Jetons');
  assert.equal(state.resources.chips, 83);
}

{
  const state = blackjackState();
  state.blackjack.actions.level = 3;
  state.blackjack.playerHand = [card('8', 'hearts'), card('8', 'clubs')];
  state.blackjack.deck = [card('3', 'spades'), card('2', 'diamonds')];

  applyAction(state, { type: 'splitBlackjack' });

  assert.equal(state.blackjack.splitBet, 8);
  assert.equal(state.resources.chips, 82);
}

{
  const state = blackjackState();
  state.books.blackjack.level = 3;
  state.blackjack.playerHand = [card('A', 'hearts'), card('K', 'clubs')];
  state.blackjack.dealerHand = [card('10', 'clubs'), card('7', 'diamonds')];

  applyAction(state, { type: 'standBlackjack' });

  assert.equal(state.blackjack.phase, 'blackjack');
  assert.equal(state.blackjack.lastReward, 27);
  assert.equal(blackjackResultSummary(state), 'Blackjack · +27 Jetons');
  assert.equal(state.resources.chips, 117);
}

{
  const state = blackjackState();
  state.books.blackjack.level = 3;
  state.blackjack.baseBetLevel = 1;
  state.mana = 0;
  state.resources.chips = 0;

  assert.equal(blackjackCurrentMainBet(state), 10);

  applyAction(state, { type: 'increaseBlackjackBaseBet' });
  assert.equal(blackjackCurrentMainBet(state), 12);

  applyAction(state, { type: 'increaseBlackjackBaseBet' });
  assert.equal(blackjackCurrentMainBet(state), 14);

  applyAction(state, { type: 'decreaseBlackjackBaseBet' });
  assert.equal(blackjackCurrentMainBet(state), 12);

  applyAction(state, { type: 'decreaseBlackjackBaseBet' });
  applyAction(state, { type: 'decreaseBlackjackBaseBet' });
  assert.equal(blackjackCurrentMainBet(state), 10);
}

{
  const state = blackjackState();
  state.books.blackjack.level = 3;
  state.blackjack.baseBetLevel = 3;
  state.mana = 500;
  state.resources.chips = 500;

  applyAction(state, { type: 'increaseBlackjackBaseBet' });

  assert.equal(state.books.blackjack.level, 3);
  assert.equal(blackjackCurrentMainBet(state), 14);
  assert.equal(state.mana, 500);
  assert.equal(state.resources.chips, 500);
}

{
  const state = blackjackState();
  state.books.blackjack.level = 3;
  state.blackjack.baseBetLevel = 3;
  state.mana = 500;
  state.resources.chips = 500;

  applyAction(state, { type: 'buyUpgrade', bookId: 'blackjack' });

  assert.equal(state.books.blackjack.level, 4);
  assert.equal(blackjackCurrentMainBet(state), 16);
  assert.ok(state.mana < 500);
  assert.ok(state.resources.chips < 500);
}

{
  const state = blackjackState();
  state.books.blackjack.level = 1;
  state.mana = 100;
  state.resources.chips = 100;
  state.books.blackjack.automation = 0;
  assert.equal(blackjackAutoDealUnlocked(state), false);

  applyAction(state, { type: 'buyUpgrade', bookId: 'blackjack' });
  assert.equal(state.books.blackjack.level, 2);
  assert.equal(blackjackAutoDealUnlocked(state), false);

  applyAction(state, { type: 'buyBlackjackAutoDeal' });
  assert.equal(blackjackAutoDealUnlocked(state), true);
}

{
  const state = blackjackState();
  assert.equal(blackjackCanDeal(state), false);
  assert.equal(blackjackResultSummary(state), '');

  state.blackjack.phase = 'dealer';
  assert.equal(blackjackCanDeal(state), false);
  assert.equal(blackjackResultSummary(state), '');

  state.blackjack.phase = 'won';
  state.blackjack.lastOutcome = 'Victoire';
  state.blackjack.lastReward = 20;
  assert.equal(blackjackCanDeal(state), true);
  const previousSummary = blackjackResultSummary(state);
  assert.equal(previousSummary, 'Victoire · +20 Jetons');

  const previousRound = state.blackjack.round;
  applyAction(state, { type: 'dealBlackjack' });

  assert.equal(state.blackjack.round, previousRound + 1);
  assert.equal(state.blackjack.playerBet, blackjackCurrentMainBet(state));
  assert.equal(state.blackjack.playerHand.length >= 2, true);
  assert.notEqual(blackjackResultSummary(state), previousSummary);
}

{
  const state = blackjackState();
  state.blackjack.phase = 'idle';
  state.blackjack.playerBet = 0;
  state.resources.chips = 130;

  applyAction(state, { type: 'prepareBlackjackWager', amount: 10 });
  assert.equal(state.blackjack.playerBet, 10);
  assert.equal(state.resources.chips, 120);

  applyAction(state, { type: 'prepareBlackjackWager', amount: 100 });
  assert.equal(state.blackjack.playerBet, 110);
  assert.equal(state.resources.chips, 20);

  applyAction(state, { type: 'resetBlackjackWager' });
  assert.equal(state.blackjack.playerBet, 0);
  assert.equal(state.resources.chips, 130);
}

{
  const state = blackjackState();
  state.blackjack.phase = 'idle';
  state.blackjack.playerBet = 0;
  state.resources.chips = 90;

  assert.equal(blackjackCanDeal(state), false);

  applyAction(state, { type: 'prepareBlackjackWager', amount: 10 });
  const preparedBet = state.blackjack.playerBet;
  const reservedChips = state.resources.chips;

  assert.equal(blackjackCanDeal(state), true);
  applyAction(state, { type: 'dealBlackjack' });

  assert.equal(state.blackjack.playerBet, preparedBet);
  assert.equal(state.resources.chips >= reservedChips, true);
  assert.equal(state.blackjack.phase === 'player' || state.blackjack.phase === 'won' || state.blackjack.phase === 'lost' || state.blackjack.phase === 'push' || state.blackjack.phase === 'blackjack', true);
}

console.log('blackjackActions ok');
