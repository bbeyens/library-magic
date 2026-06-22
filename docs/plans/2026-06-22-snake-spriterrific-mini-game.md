---
date: 2026-06-22
topic: snake-spriterrific-mini-game
---

# Snake Spriterrific Mini-Game

## Outcome
- Add a Snake mini-game that follows the Mana grimoire pattern: one large clickable sprite inside the book page.
- Use Spriterrific-compatible assets under `public/assets/spriterrific/snake`.
- Clicking Snake grants Ecailles and Mana through existing `snakeStep` rules.
- Add a compact upgrade-panel button beside the blue upgrade button.
- Compact upgrade panel shows icon-only mini boxes with level numbers.

## Auto Workflow Notes
- GitHub PRD/issues are blocked: this local repo has no configured git remote.
- Local implementation proceeds as the useful first slice.

## Verification
- `npm run typecheck` passes.
- `npm run build` passes.
- Local server responds on `localhost:5173`.
- Browser-visible UI has Snake clickable sprite and compact upgrade panel.
