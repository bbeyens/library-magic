# runner-terrain-loop-100m

Objective:
Faire boucler le terrain 3D du Runner sans trou tous les 100 m, notamment au-delà de 170 m, avec test déterministe, suite complète et preuve navigateur.

Goal plan:
docs/plans/2026-07-15-runner-terrain-loop-100m.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: Boucle fluide du terrain Runner tous les 100 m
- acceptance criteria: période exacte de 100 m; aucun trou visible vers 170 m; recyclage sans saut perceptible; aucun changement des autres mini-jeux.

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
- initial confidence score: 84/100
- improvement loop: test rouge, correctif pur, suite complète, preuve navigateur à 170 m
- final score / loop closure: 98/100; deterministic, full-suite and live 179 m proof complete

Completion threshold:
- A deterministic test proves that terrain positions repeat every 100 m and remain gap-free at 170 m.
- The Runner renderer uses that tested loop while preserving the 16 m authored segment geometry.
- Targeted test, full tests, typecheck, build and browser proof all pass.

Verification surface:
- `tests/runnerEnvironmentAsset.test.ts`, full `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`, and the live Runner route at `http://127.0.0.1:5173/` near 170 m.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: pure terrain-loop math consumed by `src/ui/runnerThreeLane.ts`.
- Allowed edit scope: Runner terrain loop module, renderer integration, focused test, this plan.
- Browser surface: Runner mini-game only.
- Tracker sync: N/A; direct local request.
- Non-goals: terrain asset redesign, camera redesign, gameplay/economy changes, other mini-games.

Current verdict:
- verdict: complete
- confidence: 96/100
- next owner: task
- reason: current six 16 m segments form a 96 m cycle and leave the far visible edge under-covered.

Pre-solution issue challenge:
- reporter claim: terrain disappears around 170 m and should loop smoothly every 100 m.
- suggested diagnosis or fix: recycle terrain on an exact 100 m period.
- repro ladder:
  - tests / source-level repro: source confirms a 96 m cycle and only six 16 m segments; focused failing test will pin 170 m.
  - repo-owned automated browser or integration proof: no existing E2E dedicated to terrain recycling.
  - Browser plugin: required after the deterministic fix.
  - screenshot / visual proof: capture live Runner near 170 m.
- reproduction verdict: reproduced at source level.
- validity verdict: valid.
- best long-term fix boundary: tested pure 100 m loop math, consumed by Three.js renderer.
- harsh honest feedback: multiplying six segments by 16 could never satisfy an exact 100 m loop and the forward coverage was marginal by construction.
- hard-stop decision: proceed; defect is reproduced.

Blocked condition:
- Block only if the local Runner cannot launch or its authored GLB assets fail to load; otherwise continue autonomously.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-terrain-loop-100m.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | exact 100 m, fluid, no terrain loss around 170 m |
| Timed checkpoint parsed | N/A | no duration requested |
| Active goal checked or created | yes | active goal created |
| Source of truth read before edits | yes | `runnerThreeLane.ts` and Blender generator inspected |
| Acceptance criteria captured | yes | Task source and threshold above |
| Pre-solution issue challenge required | yes | valid and reproduced |
| Reproduction verdict before implementation | yes | 96 m cycle and insufficient coverage confirmed |
| Repro escalation ladder selected | yes | focused test then Browser plugin |
| Suggested fix reviewed against durable boundary | yes | pure loop module selected |
| TDD decision before behavior change or bug fix | yes | focused deterministic test first |
| Browser proof decision for browser surface | yes | required near 170 m |
| Browser pack selected | yes | browser pack already applied |
| Browser route / app surface identified | yes | local app, Runner mini-game |
| Browser tool decision recorded | yes | repo-approved in-app Browser plugin |

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
| Named verification threshold | yes | Run the named proof or record blocker | focused test, full suite, typecheck, build and browser proof pass |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | valid; 96 m cycle reproduced before implementation |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | red test, green test, live run at 179 m |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | missing 100 m loop module plus source-level 96 m mismatch |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerEnvironmentAsset ok` |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | live screenshot at 179 m shows continuous terrain |
| Final lint/format | yes | Run relevant lint/format command or record N/A | no lint script; `git diff --check` passed |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | only Runner terrain ownership and focused regression coverage changed |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-terrain-loop-100m.md` | ready for checker |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | unlocked books, opened Runner, maxed skills, ran from 0 m through 179 m |
| Browser console/network check | yes | Record console/network state or N/A | zero console errors/warnings; direct network log unavailable, GLBs visibly rendered without loader warnings |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | deliverable tab kept at local Runner, screenshot captured at 179 m |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | 96 m cycle and coverage defect reproduced | implementation |
| Implementation | completed | pure 100 m loop plus seven renderer segments | verification |
| Verification | completed | all automated checks and live 179 m proof pass | closeout |
| Closeout | completed | plan evidence recorded | final response |

Findings:
- The current loop period is `16 * 6 = 96 m`, contradicting the requested 100 m.
- At distance zero, current segment centers end at `64 m`; their geometry ends near `72 m` while Runner visibility/spawn reaches roughly `74 m`.
- The authored GLB segments are 16 m long, so seven segments spaced at `100 / 7 m` overlap slightly and cover the full visible interval without changing assets.

Decisions and tradeoffs:
- Keep authored 16 m GLBs unchanged; use seven clones and a 100 m mathematical period.
- Put loop math in a dependency-free module so the 170 m regression is deterministic and testable without WebGL.

Timeline:
- 2026-07-15T23:06:49.266Z: plan created.
- 2026-07-16: failing regression test added for exact 100 m periodicity and gap-free coverage at 170 m.
- 2026-07-16: added `runnerTerrainLoop.ts`; renderer now recycles seven 16 m GLBs on a 100 m period.
- 2026-07-16: full tests, typecheck, build and whitespace audit passed.
- 2026-07-16: live Runner crossed 170 m and reached 179 m with continuous visible terrain and no console warnings/errors.

Verification evidence:
- Red: `npx tsx tests/runnerEnvironmentAsset.test.ts` failed with `ERR_MODULE_NOT_FOUND` before the loop module existed.
- Green: focused `runnerEnvironmentAsset ok`.
- Regression: full `npm test` passed all test files.
- Static/build: `npm run typecheck`, `npm run build`, and `git diff --check` passed.
- Browser route: `http://127.0.0.1:5173/`; Runner opened from the target-book shelf, Run started, distance observed at 170 m and screenshot captured at 179 m.
- Visual outcome: road, rocks, cliffs and trees remain continuous through the far camera edge after the loop.
- Console: zero errors and warnings. Direct network logging is not exposed by the selected browser API; successful visible GLB rendering and absence of loader warnings cover the asset-load path.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Exact, fluid 100 m Runner terrain loop with no gap around 170 m |
| What have I learned? | See Findings |
| What have I done? | Implemented and proved the 100 m loop through 179 m |

Open risks:
- Residual risk is limited to extreme viewport/camera changes; current authored camera and the full 170 m live transition are covered.
