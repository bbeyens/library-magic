# menu entry toggles open game

Objective:
Make mini-game menu entries close already-open panels; done when browser proof shows clicking an open game removes it and checks pass.

Goal plan:
docs/plans/2026-06-26-menu-entry-toggles-open-game.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: "Dans la barre de mini-jeux, cliquer la case d'un jeu déjà ouvert l'enlève."
- acceptance criteria: In the mini-game selector, clicking an entry whose panel is already open closes/removes that panel.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: final response includes score confiance.

Completion threshold:
- Browser proof: open a game panel from the selector, click the same selector entry again, and the panel is removed.
- `npm run typecheck` passes.
- `npm run build` passes.

Verification surface:
- Browser proof against local Vite app.
- Source audit of `src/ui/hud.ts` menu entry click handling.
- `npm run typecheck`, `npm run build`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/hud.ts` menu entry handling and existing `closeBookPanel` action.
- Allowed edit scope: smallest selector click behavior change plus this plan.
- Browser surface: local Vite app mini-game selector.
- Tracker sync: N/A.
- Non-goals: no menu redesign, no panel layout changes.

Current verdict:
- verdict: valid user request
- confidence: 90/100
- next owner: task
- reason: Existing menu entries mark open panels with `is-visible`; click behavior can use that state to close instead of selecting.

Pre-solution issue challenge:
- reporter claim: clicking an already-open mini-game entry should remove it.
- suggested diagnosis or fix: in `selectBook` menu handling, dispatch `closeBookPanel` when `isBookPanelOpen(state, bookId)` is true.
- repro ladder:
  - tests / source-level repro: source audit of current `selectBook` handling.
  - repo-owned automated browser or integration proof: browser script clicks an already-open selector entry and checks panel count/id.
  - Browser plugin: browser-use unavailable in this thread; use Chrome/Playwright fallback.
  - screenshot / visual proof: optional.
- reproduction verdict: current behavior should fail because `selectBook` keeps existing panels open.
- validity verdict: valid requested behavior.
- best long-term fix boundary: selector click handling in HUD.
- harsh honest feedback: clicking a highlighted/open item and not closing it is mushy UI. Toggle is the right call.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if local app cannot launch and no browser fallback can validate selector click behavior.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-menu-entry-toggles-open-game.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User wants selector entries to close already-open panels. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | Created active goal for this plan. |
| Source of truth read before edits | yes | Read `src/ui/hud.ts` menu entry handling and `closeBookPanel` action. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | no | N/A: feature behavior request. |
| Reproduction verdict before implementation | yes | Browser red proof to run before patch. |
| Repro escalation ladder selected | yes | Browser script is proof. |
| Suggested fix reviewed against durable boundary | yes | Use existing HUD selector and `closeBookPanel` action. |
| TDD decision before behavior change or bug fix | yes | Browser red -> patch -> green. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Applied browser pack. |
| Browser route / app surface identified | yes | Local Vite app. |
| Browser tool decision recorded | yes | browser-use unavailable; Chrome/Playwright fallback. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Passed: `Arc Typing` open after first click, removed after second click; typecheck/build pass. |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: feature behavior request. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Red proof before patch, green proof after patch via Chrome/Playwright fallback. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Red proof: second click on visible `Arc Typing` entry left panel open. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Green proof: second click on visible `Arc Typing` entry removed panel. |
| TypeScript or typed config changed | yes | Run relevant typecheck | Passed: `npm run typecheck`. |
| Build-sensitive behavior changed | yes | Run relevant build/check | Passed: `npm run build`; Vite large chunk warning only. |
| Browser surface changed | yes | Capture browser proof | Passed: screenshot `/tmp/library-magic-menu-entry-toggle-proof.png`; DOM proof shows openPanels `[mana]` after second click. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script in `package.json`. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Accepted: uses existing `closeBookPanel` action and keeps menu open. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-menu-entry-toggles-open-game.md` | Run after closure. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Passed: menu entry click toggles open game panel off. |
| Browser console/network check | yes | Record console/network state or N/A | Console had Vite/Phaser logs plus generic 404; requestfailed empty. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-menu-entry-toggle-proof.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source owner identified. | implementation |
| Implementation | complete | `selectBook` menu action now dispatches `closeBookPanel` when panel is already open. | verification |
| Verification | complete | Red proof, typecheck, build, green browser proof. | closeout |
| Closeout | complete | Plan checker to run. | final response |

Findings:
- `bookMenuEntry` already computes `isVisible` from `isBookPanelOpen`, but the click handler always dispatches `selectBook`.
- Existing simulation action `closeBookPanel` already removes the panel and updates selected book.
- Red proof: after opening `Arc Typing`, clicking its visible menu entry again left it open before the patch.
- Green proof: after the patch, the same second click removes `Arc Typing` and leaves only `mana` open.

Decisions and tradeoffs:
- Keep state mutation in the existing action system: use `closeBookPanel` instead of manipulating `openBookPanels` in the HUD.
- Keep the selector menu open while closing the panel; the user asked to remove the game panel, not close the menu.

Timeline:
- 2026-06-26T10:14:47.953Z: plan created.
- 2026-06-26: captured toggle-open-entry requirement and source owner.
- 2026-06-26: implemented menu entry close behavior and verified it.

Verification evidence:
- Red proof before patch: `Arc Typing` remained open after clicking its already-visible selector entry.
- `npm run typecheck` passed.
- `npm run build` passed; Vite large chunk warning only.
- Green browser proof: `Arc Typing` removed after second click; screenshot `/tmp/library-magic-menu-entry-toggle-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Clicking an already-open mini-game selector entry closes that game panel. |
| What have I learned? | Existing `closeBookPanel` gives the correct state transition. |
| What have I done? | Implemented, verified, and recorded evidence. |

Open risks:
- Multi-panel state may shift selected book after closing; existing `closeBookPanel` owns that behavior.
