import assert from 'node:assert/strict';

import {
  parseRunnerEditorConfig,
  runnerEnemyCollisionBounds,
  runnerEditorConfigFromRun,
  runnerEnemyModelId,
  serializeRunnerEditorConfig,
  type RunnerEditorConfig,
} from '../src/game/simulation/runnerEditorRules.ts';
import { applyAction, tickState } from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

const config: RunnerEditorConfig = {
  version: 1,
  monsters: [
    {
      modelId: 'chest-monster',
      x: 1.25,
      distance: 18,
      health: 12,
      contactDamage: 3,
      coinReward: 7,
      scale: 1.4,
      speedMultiplier: 0.75,
    },
  ],
};

assert.deepEqual(parseRunnerEditorConfig(serializeRunnerEditorConfig(config)), config);
assert.throws(() => parseRunnerEditorConfig('{"version":1,"monsters":[{"modelId":"missing"}]}'));
assert.throws(() => parseRunnerEditorConfig('{"version":1,"monsters":[{"modelId":"slime"}]}'));
assert.throws(() => parseRunnerEditorConfig('{"version":1,"monsters":[{"modelId":"turtle-shell"}]}'));
assert.equal(runnerEnemyModelId(3), 'skeleton-warrior');
assert.equal(runnerEnemyModelId(7), 'skeleton-warrior');
assert.equal(runnerEnemyModelId(0, 'skeleton-warrior'), 'skeleton-warrior');
assert.deepEqual(runnerEnemyCollisionBounds(0, 'skeleton-warrior'), {
  halfWidth: 0.3,
  halfDepth: 0.34,
});

const state = createInitialState();
state.books.runner.unlocked = true;
applyAction(state, { type: 'selectBook', bookId: 'runner' });
applyAction(state, { type: 'startRunnerRun' });
applyAction(state, {
  type: 'addRunnerEditorEnemy',
  monster: config.monsters[0]!,
});

assert.deepEqual(state.runner.enemies[0], {
  id: 1,
  x: 1.25,
  z: 18,
  health: 12,
  maxHealth: 12,
  modelId: 'chest-monster',
  contactDamage: 3,
  coinReward: 7,
  scale: 1.4,
  speedMultiplier: 0.75,
  editorPlaced: true,
});

applyAction(state, {
  type: 'updateRunnerEditorEnemy',
  enemyId: 1,
  patch: { modelId: 'cactus', health: 20, distance: 24, speedMultiplier: 0 },
});
assert.equal(state.runner.enemies[0]?.modelId, 'cactus');
assert.equal(state.runner.enemies[0]?.health, 20);
assert.equal(state.runner.enemies[0]?.maxHealth, 20);
assert.equal(state.runner.enemies[0]?.z, 24);

applyAction(state, { type: 'duplicateRunnerEditorEnemy', enemyId: 1 });
assert.equal(state.runner.enemies.length, 2);
assert.equal(state.runner.enemies[1]?.id, 2);
assert.equal(state.runner.enemies[1]?.editorPlaced, true);

applyAction(state, { type: 'setRunnerEditorPaused', paused: true });
state.lastTick = 1_000;
tickState(state, 2_000);
assert.equal(state.runner.distance, 0);
assert.equal(state.runner.enemies[0]?.z, 24);

const exported = runnerEditorConfigFromRun(state.runner);
assert.equal(exported.monsters.length, 2);
applyAction(state, { type: 'removeRunnerEditorEnemy', enemyId: 1 });
assert.equal(state.runner.enemies.length, 1);
applyAction(state, { type: 'replaceRunnerEditorEnemies', config: exported });
assert.equal(state.runner.enemies.length, 2);
assert.deepEqual(runnerEditorConfigFromRun(state.runner), exported);

console.log('runnerEditorRules ok');
