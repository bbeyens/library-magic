import assert from 'node:assert/strict';
import { runnerShootingClipTime } from '../src/ui/runnerHeroAnimation.ts';

const approx = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

// fireRate 2 => interval 0.5s. Clip 1s long, recoil "bump" at 10% of the clip.
const dur = 1;
const bump = 0.1;

// Right after a shot: fireCooldown resets to the full interval, so the clip sits exactly on the bump.
assert.ok(approx(runnerShootingClipTime(0.5, 2, dur, bump), 0.1), 'shot moment -> bump frame');

// Half-way to the next shot: the clip has advanced half a loop past the bump.
assert.ok(approx(runnerShootingClipTime(0.25, 2, dur, bump), 0.6), 'mid cycle');

// Just before the next shot the cycle wraps back around to the bump.
assert.ok(approx(runnerShootingClipTime(0, 2, dur, bump), 0.1), 'cycle end wraps to bump');

// Faster fire rate compresses the same clip: at fireRate 5 (interval 0.2s), half-way is still 0.6.
assert.ok(approx(runnerShootingClipTime(0.1, 5, dur, bump), 0.6), 'higher fire rate, same phase math');

// The returned time is always within the clip [0, duration).
for (const fc of [-1, 0, 0.13, 0.4, 0.5, 2]) {
  const t = runnerShootingClipTime(fc, 2, dur, bump);
  assert.ok(t >= 0 && t < dur, `time in range for cooldown ${fc}`);
}

// Cooldown beyond the interval clamps (no negative phase), and a tiny fireRate is floored at 0.1.
assert.ok(approx(runnerShootingClipTime(99, 2, dur, bump), 0.1), 'cooldown over interval clamps to shot moment');
assert.ok(Number.isFinite(runnerShootingClipTime(0.5, 0.0001, dur, bump)), 'tiny fireRate stays finite');

console.log('runnerShootingSync ok');
