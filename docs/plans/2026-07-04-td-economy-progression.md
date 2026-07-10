# td economy progression

Objective:
Rebalance TD economy/progression; done when early wave HP, first damage cost, death rollback, and progression tests/build pass.

Goal plan:
docs/plans/2026-07-04-td-economy-progression.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: user request
- id / link: chat
- title: TD economy and death rollback rebalance
- acceptance criteria:
  - Wave 1 spawns one slime with 5 HP, killable in five base hits.
  - Wave 2 spawns two slimes with 6 HP each.
  - Existing percentage relationships for non-slime monsters are preserved.
  - Damage + costs 2 coins at the beginning.
  - Coin/resource progression is tuned toward roughly 1h30 completion, with occasional 2-3 minute farm walls.
  - On death, TD rolls back to the first wave after the previous completed tens block: wave 12 -> 11, wave 24 -> 21, wave 84 -> 81.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: no hard stop; 1h30 is target player completion time, not agent work time
- semantics: tune model toward a 90-minute player run
- initial confidence score: 72/100
- improvement loop: implement formulas, add focused tests, run build, review diff against requested constraints
- final score / loop closure: 88/100 after focused formula tests and build; capped because no full player-run simulator exists.

Completion threshold:
- Source implements TD wave/enemy/economy progression with wave 1 = one 5 HP slime, wave 2 = two 6 HP slimes, damage + initial cost = 2, non-slime HP ratios preserved, and death rollback examples covered.
- Focused tests for wave composition/HP, costs, reward shape, and death rollback pass.
- `npm run build` passes.

Verification surface:
- Focused TypeScript tests under `tests/`.
- `npm run build`.
- Source audit of changed defense formulas.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: TD simulation/formulas and HUD cost display in `src/`.
- Allowed edit scope: defense game state, simulation/actions, TD constants/formulas, focused tests.
- Browser surface: local Vite UI at `http://127.0.0.1:5173/`; browser proof optional unless tests/build miss visual behavior.
- Tracker sync: N/A.
- Non-goals: no sprite/layout redesign, no unrelated mini-game economy changes, no commit/push unless requested.

Current verdict:
- verdict: valid feature request
- confidence: 72/100
- next owner: task
- reason: request has concrete numeric anchors plus a balancing target that can be modeled and tested.

Pre-solution issue challenge:
- reporter claim: current TD economy/progression needs redesign around early wave HP, skill prices, run length, farm walls, and death rollback.
- suggested diagnosis or fix: replace ad hoc/current scaling with explicit formulas and tests.
- repro ladder:
  - tests / source-level repro: source formulas and focused tests apply.
  - repo-owned automated browser or integration proof: N/A unless visual HUD proof needed.
  - Browser plugin: N/A for formula changes.
  - screenshot / visual proof: N/A.
- reproduction verdict: N/A: feature/economy request, not a bug repro.
- validity verdict: valid.
- best long-term fix boundary: central TD formula/state helpers, not per-HUD patches.
- harsh honest feedback: balancing without a sim/test is bullshit; this needs formulas plus executable checks.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if TD progression formulas cannot be found or tests/build cannot run for unrelated repo damage that prevents proving this change.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-04-td-economy-progression.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Task source acceptance criteria copied before implementation |
| Timed checkpoint parsed | yes | 1h30 is target player completion time, not a hard stop |
| Active goal checked or created | yes | `get_goal` returned no goal; `create_goal` created active goal |
| Source of truth read before edits | yes | Read `src/game/simulation/actions.ts`, `src/game/simulation/defenseRules.ts`, `src/game/simulation/state.ts`, `tests/defenseRules.test.ts` |
| Acceptance criteria captured | yes | Task source section |
| Pre-solution issue challenge required | yes | validity verdict: valid feature request |
| Reproduction verdict before implementation | no | N/A: feature/economy request |
| Repro escalation ladder selected | no | N/A: feature/economy request |
| Suggested fix reviewed against durable boundary | yes | central TD formula/state helpers |
| TDD decision before behavior change or bug fix | yes | add focused behavior tests around formulas |
| Browser proof decision for browser surface | no | formula/state change; tests/build are primary proof |

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
      matters. N/A: feature/economy request.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. N/A: valid feature request.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason.
- [x] Verification evidence is recorded beside each relevant gate.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run focused tests and build | `npx tsx tests/defenseRules.test.ts` ok; `npm run build` ok |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: feature/economy request |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature/economy request |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/defenseRules.test.ts` ok |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run build` ok |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` ok |
| Browser surface changed | no | Capture browser proof | N/A: no visual layout change intended |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script identified yet |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff changes central TD formulas/actions plus focused tests; unrelated dirty files preserved |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no agent hard-stop duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-04-td-economy-progression.md` | Ready to run after closeout row update |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read TD formulas/actions/state/tests | implementation |
| Implementation | complete | Added TD progression helpers, cost/reward curve, spawn HP use, death rollback | verification |
| Verification | complete | defenseRules/debugActions/build passed | closeout |
| Closeout | complete | plan updated with final evidence | final response |

Findings:
- User wants the early game to be legible: wave 1 = 5 hits, wave 2 = two 6 HP slimes.
- Economy target is player-facing: finish around 90 minutes, with occasional 2-3 minute farm walls.
- Death rollback should snap to the first wave after the previous tens checkpoint.
- Existing TD formulas used `4 + min(10, wave + level)` enemy count and `2 + floor(wave * 0.45)` slime HP; those directly conflicted with wave 1 and wave 2 requirements.
- `resetDefenseRun` always returned to wave 1; death rollback needed a checkpoint helper.

Decisions and tradeoffs:
- Use formula helpers and tests rather than hand-setting dozens of waves. Manual tables here would rot fast.
- Tune first costs down sharply: Damage + starts at 2 sigils, while other early attack/economy skills start low enough to create early choices instead of a dead shop.
- Keep non-slime HP ratios through `defenseEnemyMaxHealthForWave`: skeleton 60%, bat 40%, goblin king 10x.

Timeline:
- 2026-07-04T16:03:18.113Z: plan created.
- 2026-07-04: added focused failing TD tests for early waves, HP ratios, first damage cost, reward, and death rollback.
- 2026-07-04: implemented `defenseSlimeMaxHealthForWave`, `defenseEnemyMaxHealthForWave`, and `defenseRollbackWave`.
- 2026-07-04: changed TD spawn to use centralized max-health helper.
- 2026-07-04: changed death reset to rollback to wave 1/11/21/... checkpoints.
- 2026-07-04: adjusted TD costs/rewards for early progression and 90-minute target curve.

Verification evidence:
- `npx tsx tests/defenseRules.test.ts` -> pass (`defenseRules ok`).
- `npx tsx tests/debugActions.test.ts` -> pass (`debugActions ok`).
- `npm run build` -> pass (`tsc && vite build` completed).
- `git diff --check -- src/game/simulation/actions.ts tests/defenseRules.test.ts src/ui/hud.ts docs/plans/2026-07-04-td-economy-progression.md` -> pass.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Rebalance TD economy/progression with tested early waves, costs, death rollback, and build proof |
| What have I learned? | Existing early TD curve conflicted with wave 1/wave 2 requirements; rollback was hard reset to wave 1 |
| What have I done? | Implemented formulas, spawn usage, rollback, tests, and build proof |

Open risks:
- 90-minute completion cannot be fully proven without a full player simulation; this pass will implement a defensible curve and source/test proof, not fake certainty.
