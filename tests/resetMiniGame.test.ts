import assert from 'node:assert/strict';
import { applyAction } from '../src/game/simulation/actions.ts';
import { createInitialState, type BlackjackCard } from '../src/game/simulation/state.ts';

function card(rank: BlackjackCard['rank'], suit: BlackjackCard['suit']): BlackjackCard {
  return { rank, suit };
}

{
  const state = createInitialState();
  state.books.defense.unlocked = true;
  state.selectedBook = 'defense';
  state.openBookPanels = [{ bookId: 'defense', slot: 0 }];
  state.resources.sigils = 75;
  state.defenseSkills.damage = 4;
  state.defense.wave = 7;
  state.defense.score = 42;
  state.defense.best = 100;
  state.defense.spawnedThisWave = 3;
  state.defense.killsThisWave = 2;
  state.defense.enemies = [{ id: 9, lane: 45, distance: 0.5, health: 3, maxHealth: 3, state: 'walking', deathTimer: 0 }];

  applyAction(state, { type: 'resetSelectedMiniGame' });

  assert.equal(state.defense.wave, 1);
  assert.equal(state.defense.score, 0);
  assert.equal(state.defense.best, 100);
  assert.equal(state.defense.spawnedThisWave, 0);
  assert.equal(state.defense.killsThisWave, 0);
  assert.equal(state.defense.enemies.length, 0);
  assert.equal(state.resources.sigils, 75);
  assert.equal(state.defenseSkills.damage, 4);
}

{
  const state = createInitialState();
  state.books.defense.unlocked = true;
  state.resources.sigils = 40;
  state.defenseSkills.damage = 3;
  state.defense.score = 90;
  state.defense.best = 120;
  state.defense.wave = 4;
  state.defense.spawnedThisWave = 3;
  state.defense.killsThisWave = 2;
  state.defense.towerHealth = 1;
  state.defense.enemies = [{ id: 4, lane: 90, distance: 0.45, health: 5, maxHealth: 5, state: 'walking', deathTimer: 0 }];

  applyAction(state, { type: 'setDefenseWave', wave: 25 });

  assert.equal(state.defense.wave, 25);
  assert.equal(state.defense.spawnedThisWave, 0);
  assert.equal(state.defense.killsThisWave, 0);
  assert.equal(state.defense.enemies.length, 0);
  assert.equal(state.defense.towerHealth > 1, true);
  assert.equal(state.defense.score, 90);
  assert.equal(state.defense.best, 120);
  assert.equal(state.resources.sigils, 40);
  assert.equal(state.defenseSkills.damage, 3);

  applyAction(state, { type: 'setDefenseWave', wave: 999 });

  assert.equal(state.defense.wave, 100);
}

{
  const state = createInitialState();
  state.books.blackjack.unlocked = true;
  state.selectedBook = 'blackjack';
  state.openBookPanels = [{ bookId: 'blackjack', slot: 0 }];
  state.resources.chips = 12;
  state.blackjack.phase = 'player';
  state.blackjack.playerBet = 7;
  state.blackjack.splitBet = 3;
  state.blackjack.playerHand = [card('8', 'hearts'), card('8', 'clubs')];
  state.blackjack.splitHand = [card('8', 'diamonds'), card('3', 'spades')];
  state.blackjack.dealerHand = [card('K', 'clubs'), card('5', 'diamonds')];
  state.blackjack.debt = 20;
  state.blackjack.winStreak = 3;

  applyAction(state, { type: 'resetSelectedMiniGame' });

  assert.equal(state.blackjack.phase, 'idle');
  assert.equal(state.blackjack.playerBet, 0);
  assert.equal(state.blackjack.splitBet, 0);
  assert.deepEqual(state.blackjack.playerHand, []);
  assert.equal(state.blackjack.splitHand, null);
  assert.deepEqual(state.blackjack.dealerHand, []);
  assert.equal(state.resources.chips, 22);
  assert.equal(state.blackjack.debt, 20);
  assert.equal(state.blackjack.winStreak, 3);
}

console.log('resetMiniGame ok');
