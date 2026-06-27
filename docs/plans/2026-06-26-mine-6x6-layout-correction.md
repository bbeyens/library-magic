# mine 7x7 layout correction

Objective:
Mine 7x7 layout correction; done when grid count/layout/docs/browser proof show 49 blocks and 7x7.

Goal plan:
docs/plans/2026-06-26-mine-6x6-layout-correction.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)
- docs (docs/plans/templates/packs/docs.md)

Task source:
- type: user prompt
- id / link: N/A
- title: Mine 7x7
- acceptance criteria: replace the just-added 9x9 Mine layout with a 7x7 layout.

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
- initial confidence score: 94/100
- improvement loop: N/A
- final score / loop closure: 97/100 after tests/build/browser proof

Completion threshold:
- `MINING_GRID_COLUMNS` and `MINING_GRID_ROWS` are 7.
- `createInitialMiningBlocks()` creates 49 blocks.
- Mine HUD aria label and CSS grid render 7 columns and 7 rows.
- CONTEXT says Mine is 7x7.
- Tests, typecheck, build, and browser proof pass.

Verification surface:
- `npx tsx tests/miningRules.test.ts`
- `npm test`
- `npm run typecheck`
- `npm run build`
- Browser proof on Mine des Profondeurs: 49 `.mining-block` elements and computed grid 7x7.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: latest user correction, "non un 7x7 finalement".
- Allowed edit scope: Mine grid constants, Mine HUD/CSS labels, focused test, CONTEXT docs, this plan.
- Browser surface: local Vite Mine panel.
- Tracker sync: N/A.
- Non-goals: new mining economy, changing materials, changing other mini-games.

Current verdict:
- verdict: complete
- confidence: 97/100
- next owner: user
- reason: implementation and verification are complete; active goal tool objective remains stale at 6x6 and is not marked complete.

Pre-solution issue challenge:
- reporter claim: the mine should be 7x7, replacing the intermediate 6x6 correction.
- suggested diagnosis or fix: change the actual grid constants plus all user-facing layout references.
- repro ladder:
  - tests / source-level repro: update focused test to expect 7x7 and 49 blocks, then observe it fail before changing constants.
  - repo-owned automated browser or integration proof: N/A, no E2E suite.
  - Browser plugin: try tool discovery; fallback to local Chrome if browser-use unavailable.
  - screenshot / visual proof: capture final Mine panel.
- reproduction verdict: valid by source audit; current code said 6x6 after the intermediate correction.
- validity verdict: valid correction.
- best long-term fix boundary: constants own block count; HUD/CSS/docs mirror those dimensions.
- harsh honest feedback: leaving 9x9 in tests or aria would be sloppy.
- hard-stop decision: continue.

Blocked condition:
- Block only if build or browser proof cannot run after the source-level proof passes.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-mine-6x6-layout-correction.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | latest prompt corrects the target to 7x7 finally |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | active goal was created for 6x6 before latest user correction; plan records corrected 7x7 target |
| Source of truth read before edits | yes | current Mine constants/tests/HUD/CSS/CONTEXT searched |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | valid layout correction |
| Reproduction verdict before implementation | yes | current source still had 6x6 |
| Repro escalation ladder selected | yes | focused test then browser proof |
| Suggested fix reviewed against durable boundary | yes | constants plus mirrored UI/docs |
| TDD decision before behavior change or bug fix | yes | update test expectation first |
| Browser proof decision for browser surface | yes | verify rendered Mine panel |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | local Vite Mine panel |
| Browser tool decision recorded | yes | use browser-use if exposed, otherwise local Chrome fallback |
| Docs pack selected | yes | CONTEXT touched |
| Target docs and nearest sibling docs read | yes | CONTEXT Mine entry searched/read |
| Documented source owner identified | yes | CONTEXT.md |

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
- [x] Docs pack: target docs, nearest sibling docs, and source owner are recorded.
- [x] Docs pack: named APIs, imports, options, routes, components, demos, and previews are source-backed or marked N/A.
- [x] Docs pack: docs use current-state reference voice, not changelog voice.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `npm test`, `npm run typecheck`, `npm run build`, and browser proof passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | valid correction; fixed by constants plus mirrored UI/docs |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | focused test failed on `6 !== 7`, then passed |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature/layout correction, not bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/miningRules.test.ts` passed with 7x7 and 49 blocks |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Mine panel rendered 49 blocks, 7 columns, 7 rows |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script in package.json |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | diff reviewed; unrelated existing diffs ignored |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-mine-6x6-layout-correction.md` | passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | debug unlock button, then Mine book canvas click |
| Browser console/network check | yes | Record console/network state or N/A | zero console errors, page errors, and failed requests |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `.tmp/mine-7x7-proof.png` |
| Docs source-backed claim audit | yes | Verify docs claims against current source | CONTEXT 7x7 matches `MINING_GRID_COLUMNS/ROWS = 7` |
| Docs links / routes / previews | N/A | Verify or record N/A | docs change is glossary text, no links/routes |
| Docs parser/build | N/A | Run relevant docs parser/build or record N/A | no docs parser/build for CONTEXT.md |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan and captured newest 7x7 correction | implementation |
| Implementation | complete | 7x7 test and source patch applied | verification |
| Verification | complete | tests, typecheck, build, browser proof passed | closeout |
| Closeout | complete | evidence recorded; goal tool not completed because objective is stale | final response |

Findings:
- Current source had 6x6 in `state.ts`, `tests/miningRules.test.ts`, Mine aria label, CSS grid repeats, and CONTEXT after the intermediate correction.
- Browser-use was not exposed by tool discovery; local Chrome via Node REPL provided the real browser proof.

Decisions and tradeoffs:
- Use one real model change: 7 columns x 7 rows constants.
- Keep the full-panel TD-like styling and material tiers unchanged.

Timeline:
- 2026-06-26T23:13:49.498Z: plan created.
- 2026-06-26T23:15:00Z: captured 7x7 correction and source audit of current 9x9 references.
- 2026-06-26T23:18:00Z: test expectation changed to 7x7; targeted test failed on `6 !== 7`, then passed after constants/UI/docs were patched.
- 2026-06-26T23:22:00Z: `npm test`, `npm run typecheck`, `npm run build`, and browser proof passed.

Verification evidence:
- `npx tsx tests/miningRules.test.ts`: failed on `6 !== 7` before constants changed, then passed.
- `npm test`: passed all test files, including `miningRules ok`.
- `npm run typecheck`: passed.
- `npm run build`: passed; Vite chunk-size warning only.
- Browser proof on `http://127.0.0.1:5174/`: 49 `.mining-block` elements, aria `Mine des Profondeurs 7 par 7`, computed grid columns 7, rows 7, overlay/panel/shell all 476x476, grid 453x453, zero console/page/request errors, screenshot `.tmp/mine-7x7-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Mine 7x7 with 49 visible blocks |
| What have I learned? | Newest correction superseded the active goal label |
| What have I done? | Implemented and verified 7x7 |

Open risks:
- None.
