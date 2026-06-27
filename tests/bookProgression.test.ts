import assert from 'node:assert/strict';
import { books } from '../src/game/content/books.ts';
import { applyAction } from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

{
  const state = createInitialState();

  assert.equal(state.books.mana.unlocked, true);
  assert.equal(state.books.serpent.unlocked, false);
  assert.equal(state.books.blackjack.unlocked, false);
  assert.deepEqual(state.openBookPanels, []);
}

{
  const state = createInitialState();

  applyAction(state, { type: 'unlockBook', bookId: 'serpent' });

  assert.equal(state.books.serpent.unlocked, false);
  assert.equal(state.selectedBook, 'mana');
}

{
  const state = createInitialState();
  state.mana = 70;
  state.forbiddenGrimoire.keys = 1;

  applyAction(state, { type: 'unlockBook', bookId: 'serpent' });

  assert.equal(state.books.serpent.unlocked, true);
  assert.equal(state.mana, 0);
  assert.equal(state.forbiddenGrimoire.keys, 0);
  assert.equal(state.selectedBook, 'serpent');
  assert.deepEqual(state.openBookPanels, [{ bookId: 'serpent', slot: 3 }]);
}

{
  const state = createInitialState();
  state.mana = 180;
  state.resources.scales = 9;
  state.forbiddenGrimoire.keys = 1;

  applyAction(state, { type: 'unlockBook', bookId: 'typing' });

  assert.equal(state.books.typing.unlocked, false);
  assert.equal(state.forbiddenGrimoire.keys, 1);

  state.resources.scales = 10;
  applyAction(state, { type: 'unlockBook', bookId: 'typing' });

  assert.equal(state.books.typing.unlocked, true);
  assert.equal(state.mana, 0);
  assert.equal(state.resources.scales, 0);
  assert.equal(state.forbiddenGrimoire.keys, 0);
}

{
  const state = createInitialState();
  state.mana = 13;
  state.resources.scales = 2;
  state.resources.runes = 3;
  const resourcesBefore = { ...state.resources };

  applyAction(state, { type: 'unlockAllBooks' });

  for (const book of books) {
    assert.equal(state.books[book.id].unlocked, true);
  }
  assert.equal(state.mana, 13);
  assert.deepEqual(state.resources, resourcesBefore);
  assert.equal(state.selectedBook, 'mana');
  assert.deepEqual(state.openBookPanels, []);
}

{
  const state = createInitialState();
  applyAction(state, { type: 'unlockAllBooks' });

  applyAction(state, { type: 'selectBook', bookId: 'mana' });
  applyAction(state, { type: 'selectBook', bookId: 'typing' });

  assert.deepEqual(state.openBookPanels, [
    { bookId: 'mana', slot: 3 },
    { bookId: 'typing', slot: 0 },
  ]);
  assert.equal(state.selectedBook, 'typing');
}

{
  const state = createInitialState();
  applyAction(state, { type: 'unlockAllBooks' });
  state.openBookPanels = [
    { bookId: 'mana', slot: 3 },
    { bookId: 'typing', slot: 0 },
  ];

  applyAction(state, { type: 'selectBook', bookId: 'typing' });

  assert.deepEqual(state.openBookPanels, [
    { bookId: 'mana', slot: 3 },
    { bookId: 'typing', slot: 0 },
  ]);
  assert.equal(state.selectedBook, 'typing');
}

console.log('bookProgression ok');
