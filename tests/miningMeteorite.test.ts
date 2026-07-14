import assert from 'node:assert/strict';
import {
  applyAction,
  miningMeteoriteClickThreshold,
  miningMeteoriteDamage,
  miningSkillMaxLevel,
  tickState,
} from '../src/game/simulation/actions.ts';
import { createInitialState } from '../src/game/simulation/state.ts';

// Threshold: 1000 clicks by default, -50 per meteorite level, floored at 250 (level 15).
const thresholdState = createInitialState();
assert.equal(miningMeteoriteClickThreshold(thresholdState), 1000);
assert.equal(miningSkillMaxLevel('meteorite'), 15);
thresholdState.miningSkills.meteorite = 5;
assert.equal(miningMeteoriteClickThreshold(thresholdState), 750);
thresholdState.miningSkills.meteorite = 15;
assert.equal(miningMeteoriteClickThreshold(thresholdState), 250);
thresholdState.miningSkills.meteorite = 999;
assert.equal(miningMeteoriteClickThreshold(thresholdState), 250);

// Meteorite damage is the click damage x50 (50 at base).
assert.equal(miningMeteoriteDamage(createInitialState()), 50);

// Manual clicks accumulate one at a time; hitting the threshold LAUNCHES a meteorite (bumps the
// pulse + queues an impact) but does not damage anything yet — the damage is deferred until the ball
// lands, so it strikes together with the impact particles.
const state = createInitialState();
state.books.mine.unlocked = true;
state.openBookPanels = [{ bookId: 'mine', slot: 0 }];
state.miningSkills.meteorite = 15; // threshold 250 keeps the loop short
for (const block of state.mining.blocks) {
  block.health = 1_000_000;
  block.maxHealth = 1_000_000;
}
const threshold = miningMeteoriteClickThreshold(state);
for (let click = 0; click < threshold - 1; click += 1) {
  applyAction(state, { type: 'digMiningBlock', blockId: 12 });
}
assert.equal(state.mining.meteoritePulse, 0);
assert.equal(state.mining.meteoriteClicks, threshold - 1);

applyAction(state, { type: 'digMiningBlock', blockId: 12 });
assert.equal(state.mining.meteoritePulse, 1); // launched
assert.equal(state.mining.meteoriteClicks, 0);
assert.equal(state.mining.meteoriteImpactTimers.length, 1); // one meteorite is falling
// Damage is deferred: the untouched corner block is still at full health right after the launch.
assert.equal(state.mining.blocks[0]!.health, 1_000_000);

// Tick out the 3s fall; the meteorite then lands and damages EVERY block (even ones never clicked).
state.lastTick = 0;
for (let second = 1; second <= 3; second += 1) {
  tickState(state, second * 1000);
}
assert.equal(state.mining.meteoriteImpactTimers.length, 0);
assert.equal(state.mining.blocks[0]!.health, 1_000_000 - 50);

// Auto-clicks count toward the meteorite too: one auto interval fires `capacity` auto-clicks.
const autoState = createInitialState();
autoState.lastTick = 0;
autoState.books.mine.unlocked = true;
autoState.miningSkills.automation = 1; // 5s interval
autoState.miningSkills.multiAutoClicker = 4; // capacity 5
for (const block of autoState.mining.blocks) {
  block.health = 1_000_000;
  block.maxHealth = 1_000_000;
}
// tickState clamps each delta to 1s, so five 1s ticks reach the 5s auto interval and fire once.
for (let second = 1; second <= 5; second += 1) {
  tickState(autoState, second * 1000);
}
assert.equal(autoState.mining.meteoriteClicks, 5);
assert.equal(autoState.mining.meteoritePulse, 0);

console.log('miningMeteorite ok');
