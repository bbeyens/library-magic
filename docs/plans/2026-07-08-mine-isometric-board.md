# mine isometric board

Objective:
Mine des Profondeurs uses an isometric 7x7 clickable board; done when hit-test tests, build checks, and browser proof pass.

Goal plan:
docs/plans/2026-07-08-mine-isometric-board.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: N/A
- title: Mine des Profondeurs plateau iso
- acceptance criteria: render the mining mini-game as an isometric 7x7 board, visually separate diamond tiles, preserve current mining state/actions, and make clicks resolve to the intended block.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: none
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: pending final confidence score in handoff

Completion threshold:
- Mine des Profondeurs presents a 7x7 isometric diamond board with 49 visible tiles, per-tile material/depth/crack styling remains wired, and click coordinates inside the board dispatch the matching `digMiningBlock` id.
- Focused mining geometry/unit coverage passes, existing mining rules still pass, typecheck/build pass or any blocker is recorded, and browser proof captures the real mine surface.

Verification surface:
- Focused test: `npx tsx tests/miningIsoGeometry.test.ts`.
- Existing domain test: `npx tsx tests/miningRules.test.ts`.
- Typed/build checks: `npm run typecheck`, `npm run build`.
- Browser proof: use repo-approved browser tool first; record blocker if unavailable.
- Source audit: `src/ui/miningIsoGeometry.ts`, `src/ui/hud.ts`, `src/style.css`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `CONTEXT.md`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`, existing mining asset folder `public/assets/Block terre`.
- Allowed edit scope: mining UI/geometry/tests and this goal plan.
- Browser surface: Library Magic app, Mine des Profondeurs book panel.
- Tracker sync: N/A, no issue requested.
- Non-goals: no new mining economy, no sprite generation, no camera system, no Phaser scene rewrite, no decorative trees/props in V1.

Current verdict:
- verdict: valid feature request
- confidence: 89/100
- next owner: task
- reason: current 7x7 state and button-driven actions can be preserved while changing projection and hit-testing.

Pre-solution issue challenge:
- reporter claim: user wants the dirt-block mini-game rendered as an isometric plateau with separated diamond clicks.
- suggested diagnosis or fix: replace rectangular CSS grid interaction with an isometric projection and coordinate hit-test.
- repro ladder:
  - tests / source-level repro: existing source read shows rectangular `.mining-grid` and `.mining-block` button cells.
  - repo-owned automated browser or integration proof: focused geometry test will cover click separation.
  - Browser plugin: required for final visual/interaction proof if available.
  - screenshot / visual proof: required for final surface proof if browser tool available.
- reproduction verdict: N/A, feature request not bug report.
- validity verdict: valid.
- best long-term fix boundary: keep mining simulation unchanged; isolate projection/hit-test in UI layer.
- harsh honest feedback: CSS-rotated button hitboxes would be the dumb path; calculate the tile from pointer coordinates.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if TypeScript/build is broken by unrelated existing dirty work beyond scoped repair, or browser-use proof is unavailable after tool discovery.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-mine-isometric-board.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User requested a plateau isometric for the dirt-block mini-game, diamond-separated tiles, and separate click handling; captured in acceptance criteria and boundaries. |
| Timed checkpoint parsed | N/A: no duration requested | no timed checkpoint in user request |
| Active goal checked or created | yes | `get_goal` returned none; `create_goal` created this goal. |
| Source of truth read before edits | yes | Read `CONTEXT.md`, `src/ui/hud.ts`, `src/style.css`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts` mining references. |
| Acceptance criteria captured | yes | See Task source and Completion threshold. |
| Pre-solution issue challenge required | N/A: feature request | Recorded as feature request; no bug hard-stop required. |
| Reproduction verdict before implementation | N/A: feature request | Existing source confirms current rectangular grid surface. |
| Repro escalation ladder selected | yes | Focused geometry test, existing mining rules, type/build, browser proof. |
| Suggested fix reviewed against durable boundary | yes | Keep simulation and block IDs unchanged; isolate UI geometry. |
| TDD decision before behavior change or bug fix | yes | Add focused public geometry test before wiring DOM click behavior. |
| Browser proof decision for browser surface | yes | Required because visual/browser surface changes. |
| Browser pack selected | yes | Applied `browser` pack. |
| Browser route / app surface identified | yes | Mine des Profondeurs book panel in Library Magic app. |
| Browser tool decision recorded | yes | `tool_search` did not expose browser-use; used Computer Use on real Chrome after browser-use absence, not Playwright/Puppeteer/CDP. |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm test` passed; `npm run typecheck` passed; `npm run build` passed after one Vite `dist` cleanup retry; Chrome proof showed iso board and a tile click reduced PV from 3 to 2. |
| Pre-solution issue challenge verdict | N/A: feature request | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | feature request, valid, proceed |
| Repro escalation ladder | N/A: not a bug report | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | focused geometry test and browser proof still planned |
| Bug reproduced before fix | N/A: feature request | Record failing test/repro or N/A with reason | no bug claim |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/miningIsoGeometry.test.ts` and `npx tsx tests/miningRules.test.ts` passed; real Chrome click changed a tile from 3 PV to 2 PV. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed on retry; first run hit Vite `ENOTEMPTY` while deleting prior `dist/assets/spriterrific/crystal`. |
| Browser surface changed | yes | Capture browser proof | Computer Use on Chrome at `http://127.0.0.1:5174/` showed Mine des Profondeurs as an isometric 7x7 board. |
| Final lint/format | N/A: no lint script in package | Run relevant lint/format command or record N/A | `package.json` has test/build/typecheck scripts but no lint/format script. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Source audit confirmed geometry module, HUD handler, iso tile markup, CSS diamond board, and focused test coverage are scoped to mining UI plus plan. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no timed checkpoint |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-mine-isometric-board.md` | passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Browser-use unavailable from tool search; Computer Use opened Chrome, selected Mine des Profondeurs, saw 49-cell iso plateau, clicked a tile, and accessibility tree showed one bloc at `2/3 PV`. |
| Browser console/network check | partial | Record console/network state or N/A | No browser-use/DevTools console check; `curl -I http://127.0.0.1:5174/` returned HTTP 200 and Chrome surface loaded assets visibly. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Computer Use screenshot in tool output showed the isometric mine board in Chrome. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read mining state/HUD/CSS and created plan | implementation |
| Implementation | complete | added geometry module/test, rewired mining HUD click routing, added iso CSS plateau | verification |
| Verification | complete | tests, typecheck, build, HTTP smoke, Chrome visual/click proof passed | closeout |
| Closeout | complete | final plan audit in progress; check-complete rerun next | final response |

Findings:
- Current mining UI renders 49 buttons in a rectangular CSS grid; the simulation action already accepts `blockId`, so the isometric work belongs in UI geometry/routing.
- Browser-use plugin/tool was not exposed by `tool_search`; Computer Use was used for real Chrome proof after that absence.
- Chrome proof: Mine des Profondeurs displays a green isometric plateau on a dark red base; a real click on the board changed one tile from 3 PV to 2 PV.

Decisions and tradeoffs:
- Use explicit pointer-to-iso hit-testing instead of relying on rotated CSS button hitboxes.
- Keep V1 as a clean plateau with separated diamond tiles and depth edges; no decorative props.

Timeline:
- 2026-07-08T13:18:36.645Z: plan created.
- 2026-07-08T13:25Z: `npx tsx tests/miningIsoGeometry.test.ts`, `npx tsx tests/miningRules.test.ts`, and `npm run typecheck` passed.
- 2026-07-08T13:26Z: `npm test` passed all repo tests.
- 2026-07-08T13:27Z: `npm run build` passed after one `ENOTEMPTY` retry from Vite dist cleanup.
- 2026-07-08T13:28Z: dev server started at `http://127.0.0.1:5174/` because 5173 was occupied; HTTP smoke returned 200.
- 2026-07-08T13:30Z: Computer Use Chrome proof opened Mine des Profondeurs, saw iso board, and verified click changed a tile PV.

Verification evidence:
- `npx tsx tests/miningIsoGeometry.test.ts` passed.
- `npx tsx tests/miningRules.test.ts` passed.
- `npm test` passed.
- `npm run typecheck` passed.
- `npm run build` passed on retry; first run hit `ENOTEMPTY` deleting prior generated `dist`.
- `curl -I http://127.0.0.1:5174/` returned HTTP 200.
- Computer Use on Chrome at `http://127.0.0.1:5174/`: Mine des Profondeurs iso board visible; one tile click reduced PV from 3 to 2.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Mine des Profondeurs uses an isometric 7x7 clickable board |
| What have I learned? | Rectangular mining button grid can be replaced at the UI boundary |
| What have I done? | Implemented and verified isometric mining board |

Open risks:
- `src/style.css` and `src/ui/hud.ts` had large unrelated dirty diffs before this task; final review focused only on the mining sections touched here.
- Computer Use proof is a real browser proof, but not the repo-preferred browser-use plugin because browser-use was unavailable in tool discovery.
