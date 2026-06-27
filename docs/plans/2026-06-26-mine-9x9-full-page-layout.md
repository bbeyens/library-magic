# mine 9x9 full page layout

Objective:
Mine 9x9 plein panneau; done when grid count/layout, non-yellow surface, tests/build/typecheck, and browser proof pass.

Goal plan:
docs/plans/2026-06-26-mine-9x9-full-page-layout.md

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
- title: Mine 9x9 plein panneau
- acceptance criteria: ne pas garder le fond jaune, la mine prend toute la page du livre comme le TD, grille de 9x9 cases.

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
- initial confidence score: 86/100
- improvement loop: N/A
- final score / loop closure: 97/100 after tests/build/browser proof

Completion threshold:
- `createInitialMiningBlocks()` creates 81 blocks from a 9x9 mine grid.
- The mine HUD aria label and CSS grid reflect 9x9.
- The mine book uses a full-panel, TD-like square surface instead of a smaller inset grid.
- The visible mine surface is dark/stone/earth oriented, not dominated by yellow.
- Tests, typecheck, build, and browser proof pass.

Verification surface:
- `npm test`
- `npm run typecheck`
- `npm run build`
- Browser proof on Mine des Profondeurs: 81 `.mining-block` elements, computed grid has 9 columns, surface fills the book panel, screenshot shows no yellow-dominant background.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: latest user prompt plus existing Mine/TD implementation.
- Allowed edit scope: mining state constants/tests, Mine HUD markup, Mine CSS, CONTEXT docs if vocabulary changes.
- Browser surface: local Vite app, Mine des Profondeurs book panel.
- Tracker sync: N/A.
- Non-goals: new mining rewards/economy, generated texture assets, changing TD behavior.

Current verdict:
- verdict: complete
- confidence: 97/100
- next owner: user
- reason: implementation and verification are complete.

Pre-solution issue challenge:
- reporter claim: current Mine layout is too small/yellow and should be full-page like TD with 9x9 cells.
- suggested diagnosis or fix: change Mine grid dimensions and restyle Mine overlay/panel to follow TD square-arena ownership.
- repro ladder:
  - tests / source-level repro: failing test for 81 initial blocks.
  - repo-owned automated browser or integration proof: N/A, no E2E suite.
  - Browser plugin: try repo-approved browser-use first; fallback if unavailable.
  - screenshot / visual proof: capture final Mine panel screenshot.
- reproduction verdict: valid by source audit and prior browser screenshot.
- validity verdict: valid.
- best long-term fix boundary: grid constants for block count, scoped Mine CSS for full-panel layout.
- harsh honest feedback: scaling a 3x5 grid bigger would be the dumb fix; the actual grid has to become 9x9.
- hard-stop decision: continue.

Blocked condition:
- Block only if the app cannot build or no browser proof path can inspect the rendered Mine panel.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-mine-9x9-full-page-layout.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | fond non-jaune, plein panneau façon TD, grille 9x9 |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | active goal created for this request |
| Source of truth read before edits | yes | prompt, Mine state/HUD/CSS, TD panel CSS/HUD |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | valid feature/layout correction |
| Reproduction verdict before implementation | yes | valid by source audit/prior proof |
| Repro escalation ladder selected | yes | TDD count test plus browser proof |
| Suggested fix reviewed against durable boundary | yes | constants + scoped Mine CSS |
| TDD decision before behavior change or bug fix | yes | test 81 blocks before changing constants |
| Browser proof decision for browser surface | yes | verify rendered Mine panel |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | local Vite Mine panel |
| Browser tool decision recorded | yes | try browser-use first, fallback if unavailable |
| Docs pack selected | yes | CONTEXT may need 9x9 wording |
| Target docs and nearest sibling docs read | yes | CONTEXT Mine glossary read |
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
| Named verification threshold | yes | Run the named proof or record blocker | `npm test`, `npm run typecheck`, `npm run build`, browser proof passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | valid correction; fixed by 9x9 constants plus Mine-specific full-panel CSS |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | red test failed on `3 !== 9`, then passed after constants changed |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature/layout correction, not bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/miningRules.test.ts` passed with 9x9 and 81 blocks |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Mine panel rendered 81 blocks, 9 columns, 9 rows, full square shell |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script in package.json |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | diff reviewed; unrelated existing diffs ignored |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-mine-9x9-full-page-layout.md` | final run pending |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | clicked debug unlock button, then clicked Mine book in canvas |
| Browser console/network check | yes | Record console/network state or N/A | zero console errors, page errors, and failed requests |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `.tmp/mine-9x9-full-page-proof.png` |
| Docs source-backed claim audit | yes | Verify docs claims against current source | CONTEXT 9x9 matches `MINING_GRID_COLUMNS/ROWS = 9` |
| Docs links / routes / previews | N/A | Verify or record N/A | docs change is glossary text, no links/routes |
| Docs parser/build | N/A | Run relevant docs parser/build or record N/A | no docs parser/build for CONTEXT.md |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | prompt, Mine, TD sources read | implementation |
| Implementation | complete | constants/HUD/CSS/docs/test updated | verification |
| Verification | complete | tests, typecheck, build, browser proof passed | closeout |
| Closeout | complete | diff reviewed and evidence recorded | final response |

Findings:
- TD uses a full square overlay with `.defense-panel` and `.defense-arena` occupying the whole book body.
- Mine currently has 3 columns x 5 rows constants and an aria label that still says 3 par 5.
- Mine CSS constrains the grid to `width: min(100%, 320px)` with 3x5 tracks, leaving it visually smaller than TD.
- Browser proof initially hit Vite module-identity duplication when importing store directly; real proof used the UI path: debug unlock button plus canvas click on Mine.

Decisions and tradeoffs:
- Make the block count a real 9x9 state change, not only CSS.
- Keep material progression every 10 layers unchanged.
- Remove the yellow-dominant sand surface by darkening the Mine arena and making sand muted stone/tan instead of bright yellow.

Timeline:
- 2026-06-26T22:54:07.075Z: plan created.
- 2026-06-26T22:56:00Z: requirements captured and TD/Mine layout sources read.
- 2026-06-26T23:00:00Z: red test failed on `MINING_GRID_COLUMNS` 3 instead of 9.
- 2026-06-26T23:04:00Z: updated Mine constants to 9x9, HUD aria label, full-panel CSS, and CONTEXT.
- 2026-06-26T23:08:00Z: browser proof passed with 81 blocks, 9 columns, 9 rows, dark shell background, square full panel.

Verification evidence:
- `npx tsx tests/miningRules.test.ts`: first failed on `3 !== 9`; passed after implementation.
- `npm test`: passed all tests, including `miningRules ok`.
- `npm run typecheck`: passed.
- `npm run build`: passed; Vite chunk-size warning only.
- Browser proof on `http://127.0.0.1:5174/`: `.mining-block` count 81, aria `Mine des Profondeurs 9 par 9`, computed grid columns 9, grid rows 9, overlay/panel/shell all 476x476, grid 453x453, shell background `rgb(41, 44, 42)`, first block background `rgb(98, 99, 87)`, zero console/page/request errors, screenshot `.tmp/mine-9x9-full-page-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Mine 9x9 plein panneau avec surface non-jaune |
| What have I learned? | Direct store imports were not the right browser proof path; real UI interaction worked |
| What have I done? | Implemented 9x9 full-panel Mine layout and verified it |

Open risks:
- None known. Remaining taste risk: exact block palette can still be tuned.
