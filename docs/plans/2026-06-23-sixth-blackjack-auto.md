# Sixth Blackjack Mini-Game Auto

Objective:
Add the 6th Library Magic Book Mini-Game: blackjack; publish PRD/slice issues, implement a verified first slice, run game proof and review.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-06-23-sixth-blackjack-auto.md

Template:
docs/plans/templates/auto.md

Primary template:
docs/plans/templates/auto.md

Applied packs:
- browser

Auto workflow source:
- auto skill: `.agents/skills/auto/SKILL.md`
- expected order:
  1. grill-with-docs
  2. autogoal for remaining steps
  3. to-prd
  4. to-issues
  5. implement first useful slice
  6. browser/game playtest
  7. review
  8. close with evidence

Task source:
- type: direct user request
- id / link: N/A
- title: "fait un 6e mini jeu de black jack"
- acceptance criteria:
  - A sixth Book Mini-Game exists.
  - The mini-game is blackjack.
  - It remains inside the Library Magic Book Page / panel system.
  - It can be verified in the browser.

First checkpoint:
- Scope: create the sixth book mini-game.
- Mini-game: blackjack.
- Deliverables: PRD issue, vertical slice issues, implemented first slice, browser/game proof, review.
- Final handoff must include PRD issue, slice issues, implemented slice, verification proof, browser proof, review result, and `score confiance`.
- Verification surface: typecheck/build, behavior assertions where practical, browser/game proof.
- Stop conditions: only missing tracker access, unsafe ambiguity, permissions failure, destructive action, or no honest verification path.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 77/100
- improvement loop: N/A
- final score / loop closure: pending

Completion threshold:
- PRD issue exists.
- Vertical slice issues exist.
- The first useful blackjack slice is implemented.
- `npm run typecheck` and `npm run build` pass.
- Browser/game proof opens the blackjack Book Page and exercises the main blackjack verbs.
- Review step is run and recorded before closeout.
- Final response lists PRD issue, slice issues, implemented issue/slice, verification proof, browser proof, review result, and `score confiance`.

Verification surface:
- `gh issue` commands or issue URLs for PRD/slice publication.
- `npm run typecheck`.
- `npm run build`.
- Focused runtime assertions for blackjack state transitions if available.
- Browser/game proof for the local Vite route, using browser-use first and recording any fallback.
- Review evidence against `main`.
- `/Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-sixth-blackjack-auto.md`.

Constraints:
- `grill-with-docs` must happen before this autogoal plan starts.
- After the grill-with-docs phase, do not stop for plan/issue/implementation approval unless there is a real blocker.
- Do not skip `review` before closeout.
- Do not claim a browser/game proof if the requested browser tool was unavailable; record the fallback honestly.
- Preserve unrelated dirty workspace changes.

Boundaries:
- Source of truth: user request plus `.agents/skills/auto/SKILL.md`.
- Allowed edit scope: `CONTEXT.md`, `docs/plans/**`, `src/game/**`, `src/ui/**`, `src/phaser/**`, `src/style.css`.
- Browser surface: local Vite game route.
- Tracker sync: GitHub Issues via `gh`.
- Non-goals: no casino economy overhaul, no real-money betting, no new app mode, no sprite pipeline.

Output budget strategy:
- Use focused reads and capped command output.
- For broad audits, prefer counts, filenames, or narrow `rg` patterns before printing full matches.
- Exclude generated assets, logs, `node_modules`, and build output unless they are the named source of truth.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials or permissions failure, destructive action, or inability to run any honest verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Read local skill/docs/code; no user question needed because blackjack as 6th Book Mini-Game is unambiguous. |
| Prompt requirements captured before work | yes | See First checkpoint and Task source. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | `create_goal` succeeded for this objective. |
| Source of truth read before edits | yes | Read `CONTEXT.md`, `AGENTS.md`, tracker docs, auto/grill/autogoal/to-prd/to-issues/implement/tdd/review/game-playtest skills, and relevant source. |
| Tracker target verified | yes | `gh auth status` and `gh repo view` verified `bbeyens/library-magic`. |
| PRD publication decision recorded | yes | Publish to GitHub Issues with `ready-for-agent`. |
| Slice publication decision recorded | yes | Publish vertical slices with `ready-for-agent`. |
| First useful slice selected | yes | Implement playable blackjack Book Page with deal/hit/stand/reward loop. |
| TDD decision before behavior change or bug fix | yes | Use focused runtime/type checks for blackjack reducer behavior; no permanent test framework exists. |
| Browser/game proof decision recorded | yes | Attempt browser-use first; record fallback if unavailable. |
| Review target selected before closeout | yes | Review against `main`. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | No question needed; blackjack as 6th Book Mini-Game is clear. |
| 2. autogoal | complete | Active goal handle and this plan path | Goal active; plan `docs/plans/2026-06-23-sixth-blackjack-auto.md`. |
| 3. to-prd | complete | PRD issue URL or `N/A: <reason>` | https://github.com/bbeyens/library-magic/issues/26 |
| 4. to-issues | complete | Slice issue URLs or `N/A: <reason>` | #27 playable blackjack, #28 progression tuning, #29 readability polish |
| 5. implement | complete | Implemented slice id/scope and changed owners | Implemented #27 in `src/game/**`, `src/ui/hud.ts`, `src/style.css`, `src/phaser/scenes/LibraryScene.ts`, `CONTEXT.md`; added integration shims for concurrent later-book edits. |
| 6. browser/game playtest | complete | Route, interaction, result, console/network caveat, and tool/fallback used | `browser-use` unavailable from tool search; Playwright via system Chrome fallback. Route `http://127.0.0.1:5175/`; opened Table du Blackjack, clicked Distribuer/Tirer/Rester, got resolved Buste, 5 cards rendered, action buttons visible without card overlap; screenshot `/tmp/library-magic-blackjack-proof-final-clean.png`; console only existing favicon 404. |
| 7. review | complete | Review target, findings, fixes/rejections | Review against current working-tree diff; `git diff --check` passed; no blocking blackjack findings. Caveat: workspace includes concurrent 7th/8th/9th mini-game edits. |
| 8. close with evidence | complete | Final response evidence checklist prepared | PRD #26, slices #27-#29, implementation #27, checks, browser proof, review, score confiance ready. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope boundary, timing constraint, stop condition, deliverable, final handoff section, verification surface, and success criterion is copied into this plan as checkable checkpoints before implementation.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless explicitly marked hard stop; when no better metric exists, initial and final confidence scores are recorded.
- [x] Auto Step Ledger is updated before moving past each step.
- [x] PRD issue is created or explicitly marked `N/A: <reason>`.
- [x] Vertical slice issues are created or explicitly marked `N/A: <reason>`.
- [x] First useful slice is selected and implemented.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice is recorded with reason.
- [x] Browser/game proof uses the repo-approved browser tool first or records the unavailable tool and honest fallback.
- [x] Review runs after implementation and verification, before closeout.
- [x] Final handoff evidence list is assembled before closing the goal.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | complete |
| PRD published | yes | Create PRD issue | https://github.com/bbeyens/library-magic/issues/26 |
| Slice issues published | yes | Create vertical slice issues | https://github.com/bbeyens/library-magic/issues/27, https://github.com/bbeyens/library-magic/issues/28, https://github.com/bbeyens/library-magic/issues/29 |
| Implemented slice | yes | Name the slice and changed owners | #27 playable blackjack Book Page implemented. |
| Typecheck/build/test proof | yes | Run relevant owner checks | `npm run typecheck`; `npm run build`; `npx --yes tsx -e ...` focused blackjack behavior assertions passed. |
| Browser/game proof | yes | Exercise affected browser/game surface or record blocker/waiver | Screenshot `/tmp/library-magic-blackjack-proof-final-clean.png`; DOM assertions passed; `browser-use` unavailable, system Chrome fallback used. |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | `git diff --check` passed; no blocking blackjack findings found in manual review. |
| Final handoff completeness | yes | Confirm final response evidence list and `score confiance` | ready |
| Timed checkpoint | N/A | No duration requested | N/A |
| Goal plan complete | yes | Run check-complete script | `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-sixth-blackjack-auto.md` passed. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Source/docs read; no material question needed | autogoal |
| Autogoal setup | complete | goal created; plan created | PRD |
| PRD | complete | #26 | issues |
| Issues | complete | #27, #28, #29 | implementation |
| Implementation | complete | #27 playable blackjack slice | browser/game proof |
| Browser/game proof | complete | `/tmp/library-magic-blackjack-proof-final-clean.png`; DOM assertions passed | review |
| Review | complete | `git diff --check` passed; no blocking blackjack findings | closeout |
| Closeout | complete | evidence list prepared | final response |

Findings:
- The fifth `defense` book is already present in dirty workspace state.
- Typecheck initially fails because `LibraryScene.bookPosition` lacks a `defense` return.

Decisions and tradeoffs:
- Use the existing Book Mini-Game architecture instead of a separate casino mode.
- Use a deterministic lightweight blackjack deck/hand model in game state.
- The first slice is a playable hand: deal, hit, stand, dealer resolve, reward Tomes and Mana.

Review fixes:
- Fixed blackjack small-panel button/card overlap found during browser review.
- Added minimal compile bridges for concurrent later-book edits (`targets`, `mine`) without expanding blackjack scope.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Initial `npm run typecheck` failed on missing `defense` book position | 1 | Add `defense` and `blackjack` positions while implementing | pending |

Timeline:
- 2026-06-23: plan created after grill-with-docs and autogoal setup.

Verification evidence:
- PRD: https://github.com/bbeyens/library-magic/issues/26.
- Slices: https://github.com/bbeyens/library-magic/issues/27, https://github.com/bbeyens/library-magic/issues/28, https://github.com/bbeyens/library-magic/issues/29.
- Implementation note: https://github.com/bbeyens/library-magic/issues/27#issuecomment-4783939519.
- Focused blackjack behavior assertions passed with `npx --yes tsx -e ...`.
- `npm run typecheck` passed.
- `npm run build` passed.
- Browser proof: `/tmp/library-magic-blackjack-proof-final-clean.png` at `http://127.0.0.1:5175/`; DOM asserted cards, outcome, visible non-overlapping actions.
- Review: `git diff --check` passed; no blocking blackjack findings.
- Goal checker: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-sixth-blackjack-auto.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | PRD, issues, implementation, browser/game proof, review, closeout |
| What is the goal? | Add the sixth blackjack Book Mini-Game with verified first slice |
| What have I learned? | See Findings |
| What have I done? | Published issues, implemented #27, verified behavior/build/browser, reviewed working-tree diff |

Open risks:
- Existing dirty changes and concurrent later-book additions are in the same source files; no commit was created to avoid bundling unrelated work as blackjack-only.
