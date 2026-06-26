import assert from 'node:assert/strict';
import {
  applyAction,
  forbiddenGrimoireCanOffer,
  forbiddenGrimoireCurrentSeal,
  forbiddenGrimoireRequirementProgress,
  forbiddenGrimoireSealReady,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

{
  const state = createInitialState();
  const seal = forbiddenGrimoireCurrentSeal(state);

  assert.equal(seal, null);
  assert.equal(state.forbiddenGrimoire.keys, 0);
  assert.equal(forbiddenGrimoireCanOffer(state), false);
  assert.equal(forbiddenGrimoireSealReady(state), false);
}

{
  const state = createInitialState();
  for (let click = 0; click < 8; click += 1) {
    applyAction(state, { type: 'chargeMana' });
  }

  assert.equal(state.forbiddenGrimoire.keys, 1);
  assert.equal(state.books.serpent.unlocked, false);
  assert.equal(state.selectedBook, 'mana');
}

{
  const state = createInitialState();
  applyAction(state, { type: 'selectForbiddenSealBook', bookId: 'typing' });
  state.mana = 40;
  state.resources.scales = 10;

  applyAction(state, { type: 'offerForbiddenGrimoire' });

  const seal = forbiddenGrimoireCurrentSeal(state);
  assert.equal(seal?.unlocksBookId, 'typing');
  assert.equal(state.mana, 0);
  assert.equal(state.forbiddenGrimoire.offerings.mana, 40);
  assert.equal(state.forbiddenGrimoire.offerings.scales, 10);
  assert.equal(forbiddenGrimoireRequirementProgress(state, seal!.requirements[0]!), 40);
  assert.equal(forbiddenGrimoireSealReady(state), false);

  state.mana = 140;
  applyAction(state, { type: 'offerForbiddenGrimoire' });

  assert.equal(state.mana, 0);
  assert.equal(state.forbiddenGrimoire.offerings.mana, 180);
  assert.equal(forbiddenGrimoireSealReady(state), true);
}

{
  const state = createInitialState();
  state.forbiddenGrimoire.level = 2;
  state.forbiddenGrimoire.keys = 1;
  applyAction(state, { type: 'selectForbiddenSealBook', bookId: 'typing' });
  state.mana = 180;
  state.resources.scales = 10;

  applyAction(state, { type: 'offerForbiddenGrimoire' });
  applyAction(state, { type: 'breakForbiddenSeal' });

  assert.equal(state.books.serpent.unlocked, false);
  assert.equal(state.books.typing.unlocked, true);
  assert.equal(state.selectedBook, 'typing');
  assert.deepEqual(state.openBookPanels, [{ bookId: 'typing', slot: 0 }]);
  assert.equal(state.forbiddenGrimoire.keys, 0);
  assert.equal(state.forbiddenGrimoire.level, 2);
  assert.equal(state.forbiddenGrimoire.selectedBookId, null);
  assert.equal(state.forbiddenGrimoire.offerings.mana, 0);
  assert.equal(state.forbiddenGrimoire.offerings.scales, 0);
  assert.equal(state.forbiddenGrimoire.lastUnlockedBookId, 'typing');
  assert.equal(forbiddenGrimoireCurrentSeal(state), null);
}

console.log('forbiddenGrimoire ok');
