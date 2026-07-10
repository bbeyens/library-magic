# gem-td-tabs-xp-fixes

Objective:
Corriger le port TD sur Gem : onglets au format TD, hover XP avec niveau et barre, cascade d'onglets active.

Goal plan:
docs/plans/2026-07-08-gem-td-tabs-xp-fixes.md

Task source:
- type: direct user request
- title: Gem doit reprendre les boutons, la barre XP et l'animation d'onglet TD.
- acceptance criteria:
  - Les onglets Gem utilisent la meme police/taille/centrage que TD.
  - Le hover XP Gem affiche le niveau et une barre XP lisible.
  - Les cartes Gem ont l'animation cascade au changement d'onglet.

Completion threshold:
Le code source contient les trois corrections, les guards statiques couvrent ces points, `tests/hudStatic.test.ts` passe, et `npm run build` passe.

Verification surface:
- `npx tsx tests/hudStatic.test.ts`
- `npm run build`
- source audit sur `src/ui/hud.ts`, `src/style.css`, `tests/hudStatic.test.ts`

Constraints:
- Ne pas modifier le layout TD.
- Ne pas relancer la cascade sur les updates volatiles de ressources.
- Garder les hover one-shot existants.
- Ignorer les diffs locaux sans rapport.

Boundaries:
- Source of truth: le dock TD et le skill `td-skill-boxes`.
- Allowed edit scope: Gem HUD/dock CSS, Gem dock refresh, guards statiques.
- Browser surface: `http://127.0.0.1:5173/`, mini-jeu Gem.
- Tracker sync: N/A.
- Non-goals: changement d'economie, gameplay, assets, serveur local.

Current verdict:
- verdict: complete
- confidence: 96/100
- next owner: user
- reason: implementation done and verification passed.

Pre-solution issue challenge:
- reporter claim: Gem n'a pas les bons boutons, pas le level/barre XP comme TD, et pas la cascade d'onglets.
- suggested diagnosis or fix: port incomplet des patterns TD vers Gem.
- repro ladder:
  - tests / source-level repro: CSS Gem avait une regle locale a 9px, `refreshManaSkillDock` ne passait pas `animateCardCascade`, et le hover XP masquait le label niveau.
  - repo-owned automated browser or integration proof: N/A, no existing E2E for this HUD.
  - Browser plugin: unavailable in current toolset; source and build proof used.
  - screenshot / visual proof: user screenshots supplied the target gaps.
- reproduction verdict: valid.
- validity verdict: valid.
- best long-term fix boundary: reuse the shared skill shop cascade API and make Gem CSS opt into the TD tab sizing.
- harsh honest feedback: the previous port was only half done; the local 9px rule was the dumb part.
- hard-stop decision: proceed.

Blocked condition:
Blocked only if the repo cannot build or the target files are unavailable.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | acceptance criteria above |
| Active goal checked or created | yes | active autogoal created |
| Source of truth read before edits | yes | `td-skill-boxes` and nearby HUD/CSS read |
| Acceptance criteria captured | yes | task source section |
| TDD decision before behavior change | yes | static HUD guard is sufficient for this visual/source contract |
| Browser proof decision | yes | tool unavailable; source/build proof used |

Work Checklist:
- [x] Prompt requirements captured before implementation.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Task source and acceptance criteria are captured.
- [x] Reporter claim challenged and marked valid.
- [x] Nearby implementation patterns read before edits.
- [x] Implementation fixes the shared ownership boundary for Gem dock refresh and CSS.
- [x] Verification evidence recorded.
- [x] Browser proof unavailable in current toolset and caveat recorded.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | run tests/build | passed |
| Targeted behavior verification | yes | `npx tsx tests/hudStatic.test.ts` | `hudStatic ok` |
| TypeScript/build changed | yes | `npm run build` | passed |
| Browser surface changed | yes | record blocker/waiver | Browser tool unavailable in current toolset |
| Autoreview | yes | final source/diff audit | focused edits verified |
| Goal plan complete | yes | run check-complete | `[autogoal] complete` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | relevant HUD/CSS/test sections read | done |
| Implementation | complete | `src/ui/hud.ts`, `src/style.css`, `tests/hudStatic.test.ts` updated | done |
| Verification | complete | tests/build passed | done |
| Closeout | complete | final response | done |

Findings:
- Gem tabs were overridden by `.mana-skill-dock .skill-shop-tab strong { font-size: 9px; }`.
- Gem dock refresh rebuilt cards without `animateCardCascade`.
- Gem XP hover hid the `NIVEAU` label and did not expose the level inside the detail panel.

Decisions and tradeoffs:
- Reused TD cascade class/keyframes instead of creating a second animation.
- Kept cascade tied to tab changes only to avoid resource updates restarting animation.
- Used static source tests because this HUD regression is mostly CSS/source contract.

Timeline:
- Read Gem/TD HUD, CSS, and static test guards.
- Added `lastManaSkillDockTab` and `animateCardCascade` for Gem dock refresh.
- Added Gem XP level detail and wider hover panel.
- Promoted Gem tab labels to 24px centered text like TD.
- Added tests for these regressions.

Verification evidence:
- `npx tsx tests/hudStatic.test.ts` -> `hudStatic ok`
- `npm run build` -> passed
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-gem-td-tabs-xp-fixes.md` -> `[autogoal] complete`

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Gem UI parity with TD tabs/XP/cascade |
| What have I learned? | The missing behavior was a source/CSS port gap, not gameplay state |
| What have I done? | Implemented and verified |

Open risks:
- No live browser screenshot was captured because the browser-use tool was unavailable in this turn.
