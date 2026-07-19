import assert from 'node:assert/strict';
import { applyAction, snakeActiveSpeedLevel, snakeMoveInterval } from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';
import { snakeMoveIntervalForSpeedLevel } from '../src/game/simulation/snakeRules.ts';

const s = createInitialState();

// Fresh: nothing bought, active speed sits at level 0 (base speed).
assert.equal(s.snakeSkills.speed, 0);
assert.equal(s.snakeSkills.speedSetting, 0);
assert.equal(snakeActiveSpeedLevel(s), 0);
assert.equal(snakeMoveInterval(s), snakeMoveIntervalForSpeedLevel(0));

// Buying speed raises the cap AND dials the active setting up to the new max.
s.resources.scales = 1e9;
applyAction(s, { type: 'buySnakeSkill', skillId: 'speed' });
applyAction(s, { type: 'buySnakeSkill', skillId: 'speed' });
applyAction(s, { type: 'buySnakeSkill', skillId: 'speed' });
assert.equal(s.snakeSkills.speed, 3);
assert.equal(s.snakeSkills.speedSetting, 3);
assert.equal(snakeActiveSpeedLevel(s), 3);
assert.equal(snakeMoveInterval(s), snakeMoveIntervalForSpeedLevel(3));

// − dials the active level down and it drives the move interval.
applyAction(s, { type: 'adjustSnakeSpeed', delta: -1 });
assert.equal(s.snakeSkills.speedSetting, 2);
assert.equal(snakeMoveInterval(s), snakeMoveIntervalForSpeedLevel(2));

// Floors at level 0 (base speed) — cannot go negative.
applyAction(s, { type: 'adjustSnakeSpeed', delta: -1 });
applyAction(s, { type: 'adjustSnakeSpeed', delta: -1 });
applyAction(s, { type: 'adjustSnakeSpeed', delta: -1 });
assert.equal(s.snakeSkills.speedSetting, 0);

// + dials up, capped at what was purchased (3).
applyAction(s, { type: 'adjustSnakeSpeed', delta: 1 });
assert.equal(s.snakeSkills.speedSetting, 1);
for (let i = 0; i < 10; i += 1) {
  applyAction(s, { type: 'adjustSnakeSpeed', delta: 1 });
}
assert.equal(s.snakeSkills.speedSetting, 3);

// Only the sign of delta matters — a big magnitude still moves one step.
applyAction(s, { type: 'adjustSnakeSpeed', delta: -5 });
assert.equal(s.snakeSkills.speedSetting, 2);

// The active level is always clamped to the purchased cap, even if the setting somehow overshoots.
s.snakeSkills.speedSetting = 99;
assert.equal(snakeActiveSpeedLevel(s), 3);

console.log('snakeSpeedSetting ok');
