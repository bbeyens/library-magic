# TD Hud Feedback

## Outcome

- [x] Damage to the tower shakes only the TD mini-game arena.
- [x] Gaining TD currency shakes the TD currency counter.
- [x] Wave rail shows exactly three markers: previous, current centered, next.

## Evidence

- [x] Browser proof confirms arena shake class can trigger on damage.
- [x] Browser proof confirms currency counter shake can trigger on resource gain.
- [x] Browser proof confirms three visible wave markers with current marker centered.
- [x] `npm test` passes.
- [x] `npm run typecheck` passes.

## Notes

- Browser observer saw `is-damage-shaking` during tower damage and `is-resource-shaking` during sigil gains.
- Wave rail proof showed 3 markers, e.g. `1 2 3`, with the current marker centered.
