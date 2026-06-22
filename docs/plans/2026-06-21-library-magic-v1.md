---
date: 2026-06-21
topic: library-magic-v1
---

# Library Magic V1

## Outcome
- Build a Vite + TypeScript + Phaser prototype in this repo.
- Keep the game in a fixed 16:9 shell.
- Show a cozy magical bookcase with 4 starter books.
- Use Mana as the shared resource.
- Give each book a unique resource.
- Let the Mana Grimoire open in a partial overlay.
- Include local upgrades per book.
- Include a simple Snake mini-game book.
- Include pinned mini-game panels to prove the hybrid late-game direction.

## Verification
- `npm run typecheck` passes.
- `npm run build` passes.
- Local dev server opens in browser.
- The first screen shows the bookcase, Mana bar, unique resource icons, book overlay, and pinned panel affordance.
- The provided bookshelf reference is used as the in-game decor/book art.
- Clickable book hotspots remain aligned with the visible books.

## Non-Goals
- No Steam wrapper yet.
- No final art pipeline yet.
- No save system yet.
- No mobile responsive layout yet.
