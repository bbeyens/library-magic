# Fix TD Book Click

## Outcome

- [x] Clicking the Bastion Arcanique/Tower Defense book opens the TD Book Page.
- [x] Existing book click/open behavior still works for normal books.
- [x] Verification evidence recorded before closing the goal.

## Evidence

- [x] Source audit identifies the broken click/open path.
- [x] Focused test or browser proof confirms TD opens by click.

## Notes

- User report: "j'arrive pas a ouvrir le jeu TD par click".
- Root cause: the TD panel did open in state, but CSS overrode the square panel with `aspect-ratio: auto` while the body was absolutely positioned, producing a visible height of `0px`.
- Fix: make the TD overlay auto-height while keeping the arena square, so the skills dock below the arena is not clipped.
- Browser proof: clicking the TD book after `K` opens `.book-overlay[data-book-id="defense"]` with a visible `397x598` panel, a `397x397` TD arena, and a visible `397x201` skill dock with 3 tabs and 8 skill cards.
- Test proof: `npm test` and `npm run typecheck` pass.
