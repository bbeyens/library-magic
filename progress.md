Original prompt: il faudrait une animation pour quand tu remplis la barre, comme plein de particules de la ressource en question qui part du livre pour arriver dans le grimoire interdit. utilise le skill qu'il faut pour que ça reste du gaming

## 2026-06-26T18:26:50Z

- Using `develop-web-game` for the game-feel loop and `autogoal` for browser-proof closure.
- Goal: when the forbidden grimoire receives an offering, resource particles should travel from the corresponding source book to the forbidden grimoire and the ritual bar should still update correctly.
- TODO: implement Phaser particle burst, verify with typecheck/build and browser screenshots during animation.

## 2026-06-26T18:38:00Z

- Implemented Phaser resource transfer particles in `LibraryScene.ts`.
- Each offering now creates curved resource-icon particles with glow trails from the source book to the forbidden grimoire, then impact sparks on arrival.
- Verified with `npm run typecheck`, `npm run build`, and Chrome screenshots.
- Web-game client blocker: bundled Playwright client could not launch because its Chromium headless shell is not installed locally; used system Chrome fallback for the actual visual proof.
- Suggested next improvement: close or suppress opened book panels automatically during ritual proof runs so screenshots stay clean.

## 2026-06-26T18:57:16Z

- Started the full A/B/C cozy animation pass from the brainstorm.
- Added: candle glow/flicker, shelf glints, book idle breathing, book idle sparkles, ritual ready orbit runes, seal-ready pulse, seal-break burst, unlock reveal, and falling lock visual.
- `npm run typecheck` passed after the first implementation patch.
- TODO: run build, browser proof, inspect screenshots, and tune if too noisy.

## 2026-06-26T19:13:47Z

- Finished the A/B/C cozy animation pass.
- Progression: offering particles still travel from source book to forbidden grimoire, completed seals now show orbiting runes and a ready pulse.
- Ambient: books idle subtly, unlocked/selected books sparkle, shelf glints and candle glow keep the library alive without covering the book art.
- Reward: breaking a seal emits a golden wave, sparkles the forbidden grimoire, reveals the unlocked book, drops the lock, then opens the mini-game after a short delay.
- Debug shortcut `o` now also grants one forbidden-grimoire key so ritual unlock flows can be tested quickly.
- Verified with `npm run typecheck`, `npm run build`, and Chrome screenshots:
  - `docs/plans/2026-06-26-cozy-animation-idle.png`
  - `docs/plans/2026-06-26-cozy-animation-selected-seal.png`
  - `docs/plans/2026-06-26-cozy-animation-ready-ritual.png`
  - `docs/plans/2026-06-26-cozy-animation-seal-break.png`
  - `docs/plans/2026-06-26-cozy-animation-unlocked.png`
- Browser-use was not exposed in this Codex session; Chrome automation via `node_repl` was used instead. Final run had no request failures and only normal Vite/Phaser console logs.
