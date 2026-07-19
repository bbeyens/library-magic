# Runner portails de bonus temporaires

Objective:
Ajouter au Runner deux portails exclusifs tous les 50 m qui accordent un niveau temporaire de compétence pour la run actuelle, au-delà des caps permanents, avec choix par placement du héros.

Goal plan:
docs/plans/2026-07-17-runner-portails-bonus-temporaires.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user feature request
- id / link: N/A: no tracker ticket requested
- title: Portails de bonus temporaires du Runner
- acceptance criteria: two side-by-side portals every 50 m; one choice only; temporary run-only boosts for every Runner skill stat; bonuses may exceed permanent max levels; center position can never collect both.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A: no duration requested
- semantics: N/A
- initial confidence score: 85/100
- improvement loop: implement deterministic rules, render, test, browser-play, repair until green
- final score / loop closure: 100/100; implementation, automated verification, and live browser proof complete

Completion threshold:
- Runner state schedules a portal pair at each 50 m boundary and resets it on a new run.
- A portal pair exposes two distinct Runner skill bonuses and accepts exactly one side based on hero placement.
- Crossing in the middle resolves deterministically to at most one portal and never grants both.
- The chosen temporary level affects the same stat formula as its permanent skill and can exceed the permanent cap.
- All current Runner skill effects are eligible for portal bonuses.
- Two readable 3D portals and their bonus labels are visible in the live Runner.
- Focused tests, full tests, typecheck, build, and browser proof pass.

Verification surface:
- Focused deterministic tests in `tests/runnerRules.test.ts` and a portal renderer/source contract test.
- `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.
- Live browser proof at `http://127.0.0.1:5173/` showing a pair, readable labels, side selection, and exclusive disappearance.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: Runner run state and formulas under `src/game/simulation`, with the Three.js lane renderer in `src/ui/runnerThreeLane.ts`.
- Allowed edit scope: Runner simulation/state/actions, Runner Three.js renderer, focused tests, this plan.
- Browser surface: Runner mini-game at `http://127.0.0.1:5173/`.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: no permanent skill purchases, no save migration for temporary bonuses, no negative portals, no changes to other mini-games.

Current verdict:
- verdict: implemented and verified
- confidence: 100/100
- next owner: user acceptance
- reason: deterministic rules, full verification suite, and live Runner proof pass

Pre-solution issue challenge:
- reporter claim: N/A: new feature, not a bug report
- suggested diagnosis or fix: model bonuses as uncapped temporary skill levels owned by the active run
- repro ladder:
  - tests / source-level repro: N/A for new feature; tests will define behavior before implementation
  - repo-owned automated browser or integration proof: focused TypeScript tests plus full suite
  - Browser plugin: required after implementation
  - screenshot / visual proof: required after implementation
- reproduction verdict: N/A: new feature
- validity verdict: valid
- best long-term fix boundary: active Runner run state owns temporary levels; shared formulas consume permanent plus temporary levels
- harsh honest feedback: duplicating every skill formula in a separate portal system would drift; virtual temporary levels avoid that defect
- hard-stop decision: proceed

Blocked condition:
- Block only if the current Runner skill inventory cannot be mapped to deterministic stat effects, or the live Runner cannot be opened for visual proof after three attempts.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-17-runner-portails-bonus-temporaires.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Completion threshold and task acceptance criteria |
| Timed checkpoint parsed | N/A | No duration requested |
| Active goal checked or created | yes | Goal `019f41dc-55e9-7191-b974-050bf461d370` active |
| Source of truth read before edits | yes | Previous Runner work plus source inventory follows before implementation |
| Acceptance criteria captured | yes | Task source and completion threshold |
| Pre-solution issue challenge required | N/A | New feature, not a bug report |
| Reproduction verdict before implementation | N/A | New feature |
| Repro escalation ladder selected | yes | Focused tests, full suite, Browser, screenshot |
| Suggested fix reviewed against durable boundary | yes | Run-owned temporary levels consumed by shared formulas |
| TDD decision before behavior change or bug fix | yes | Red/green deterministic portal tests required |
| Browser proof decision for browser surface | yes | Required |
| Browser pack selected | yes | Browser pack materialized |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, Runner panel |
| Browser tool decision recorded | yes | Use repo-approved in-app Browser first |

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
| Named verification threshold | pass | Run the named proof or record blocker | Focused tests, full tests, typecheck, build, diff check, and browser proof pass |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | New feature; run-owned uncapped temporary levels selected as durable boundary |
| Repro escalation ladder | N/A | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | New feature, not a bug claim |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | New feature; TDD began with missing portal interval and renderer contract failures |
| Targeted behavior verification | pass | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/runnerBoostPortals.test.ts`, Runner rules and multishot tests pass |
| TypeScript or typed config changed | pass | Run relevant typecheck | `npm run typecheck` passes |
| Build-sensitive behavior changed | pass | Run relevant build/check | `npm run build` passes; only pre-existing chunk-size warning |
| Browser surface changed | pass | Capture browser proof | In-app Browser at 43 m shows two readable side-by-side portals |
| Final lint/format | pass | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passes |
| Autoreview | pass | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed Runner-only ownership, reset path, formulas, renderer, pools, and tests |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-17-runner-portails-bonus-temporaires.md` | Final checker run after verification |
| Browser interaction proof | pass | Exercise target route/interaction or record blocker | Portal pair spawned at 6 m and remained visible through 43 m; Fox placed on one side |
| Browser console/network check | pass | Record console/network state or N/A | Browser console returned no warnings or errors; network check N/A because assets were visibly rendered and no request failure surfaced |
| Browser final proof artifact | pass | Record screenshot/trace/route proof or exact caveat | `/tmp/runner-boost-portals-proof.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Runner rules, run state, actions, and Three.js renderer inventoried | done |
| Implementation | completed | Run-owned temporary levels, 50 m scheduling, exclusive resolver, pooled 3D portal visuals | done |
| Verification | completed | Focused/full tests, typecheck, build, diff check, browser screenshot and console | done |
| Closeout | completed | Final review and goal checker | final response |

Findings:
- The user reference shows full-width translucent left/right gates; Runner needs side-local trigger volumes instead of a shared center trigger.
- The Renderer camera sees regular planes from their back face; portal panels require a 180-degree Y rotation so labels are not mirrored.
- Portal pairs enter the render window at 6 m because they are spawned 44 m ahead of the 50 m crossing point.

Decisions and tradeoffs:
- A portal grants one uncapped temporary skill level, reusing permanent skill formulas instead of duplicating bonus values.
- The first valid side entered atomically resolves the pair; center overlap is excluded by a dead zone and can never grant both.

Timeline:
- 2026-07-16T23:06:35.731Z: plan created.
- 2026-07-17: explicit requirements captured; one-shot implementation authorized by the direct feature request.
- 2026-07-17: deterministic tests added for interval, distinct choices, center dead zone, atomic resolution, cap overflow, stat application, and reset.
- 2026-07-17: pooled Three.js portals and temporary boost feedback implemented for all ten Runner skills.
- 2026-07-17: live proof found and repaired mirrored labels; final screenshot captured at 43 m with two readable choices.

Verification evidence:
- `npx tsx tests/runnerBoostPortals.test.ts`: pass.
- `npm test`: pass.
- `npm run typecheck`: pass.
- `npm run build`: pass; pre-existing chunk-size warning only.
- `git diff --check`: pass.
- Browser proof: at 43 m the canvas reported two portals (`coinGain` and `projectileSpeed`) and visibly rendered `OR +1` / `PROJECTILE +1` side by side.
- Browser console: zero warnings and zero errors.
- Visual artifact: `/tmp/runner-boost-portals-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | User acceptance |
| What is the goal? | Add exclusive temporary Runner bonus portals every 50 m |
| What have I learned? | Run-owned temporary levels reuse every existing skill formula without mutating permanent progression |
| What have I done? | Implemented, tested, built, visually repaired, and browser-verified the portal system |

Open risks:
- Temporary multishot is technically capped at 20 projectiles to protect frame time; this remains above the permanent skill cap and matches the current prototype maximum.
- Browser playthrough was visually proven before crossing; atomic single-choice and center-dead-zone behavior are proven deterministically in tests because enemies can end a manual proof run immediately after the portal approach.
