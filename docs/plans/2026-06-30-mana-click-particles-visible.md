# Mana Click Particles Visible

## Outcome

- [x] Clicking the mana crystal creates visible click feedback.
- [x] Floating gain text or particle nodes render above the crystal panel.
- [x] Existing mana click gain still increments mana.

## Evidence

- [x] Source audit identifies why feedback is hidden or not inserted.
- [x] Browser proof confirms visible feedback nodes/classes after a click.
- [x] `npm test` passes.
- [x] `npm run typecheck` passes.

## Notes

- Click feedback previously created only tiny local sparks and no `mana-falling-*` particles despite existing CSS.
- Browser proof after the fix: one click created 8 sparks, 5 falling particles, 1 floating gain, and mana incremented to `1`.
- Falling particles are now around 30px and opacity ~1 during the visible part of the animation.
