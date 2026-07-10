# Crystal skills XP

## Outcome

- Crystal has new skill cards for click multiplier, double chance, triple chance, XP orb chance/value, and hold-click.
- Crystal shows an XP bar.
- Clicks can spawn a red XP orb, and collecting it grants XP.
- Holding the crystal auto-clicks at 10 clicks per second once the holder skill is bought.

## Verification

- [x] Focused gameplay tests cover click multiplier, double/triple chance, XP orb spawn/collect, max/reset debug paths.
- [x] Static HUD test covers the new Crystal skill cards, XP bar, red orb, and hold controls.
- [x] `npx tsx tests/manaSkills.test.ts`
- [x] `npx tsx tests/debugActions.test.ts`
- [x] `npx tsx tests/hudStatic.test.ts`
- [x] `npm run build`
- [x] Browser smoke: Crystal panel opens, XP bar visible, hold-click shows repeated gain popups; red XP orb appears and collect updates XP to 1.

## Notes

- Keep existing Crystal particles and TD-style dock layout.
- Ignore unrelated dirty workspace diffs.
