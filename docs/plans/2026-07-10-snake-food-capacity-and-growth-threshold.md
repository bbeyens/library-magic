# Snake food capacity and growth threshold

Objective:
Add Snake food-capacity and growth-threshold skills; done when levels 0-max behave as 1-10 active food and 1-3 food per growth with tests and browser proof.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-07-10-snake-food-capacity-and-growth-threshold.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user feature request
- id / link: N/A: no issue or external tracker item supplied
- title: Snake food capacity and growth threshold skills
- acceptance criteria:
  - A new skill increases simultaneous food on the Snake board from 1 at level 0 to 10 at max level.
  - Food never spawns on occupied Snake cells and the board-full case remains safe.
  - A second skill changes growth from one body segment per 1 food at level 0, to one segment per 2 food, then one segment per 3 food at max level.
  - Food eaten between growth events is tracked correctly.
  - Both skills appear in the Snake skill dock and use the Snake resource economy.

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
- initial confidence score: N/A: behavior has explicit pass/fail criteria
- improvement loop: tests, typecheck, build, browser proof, final diff review
- final score / loop closure: report final confidence after all gates

Completion threshold:
- Focused Snake tests prove food counts 1 and 10, growth thresholds 1, 2, and 3, and safe spawning on free cells only.
- Snake UI exposes both skills with their current values and costs in scales.
- Focused tests, typecheck, build, and browser interaction proof pass.

Verification surface:
- `npx tsx tests/snakeRules.test.ts`
- focused Snake layout/static test as appropriate
- `npm run typecheck`
- `npm run build`
- in-app browser at `http://127.0.0.1:5173/`, Snake panel and skill dock

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: Snake simulation state/rules/actions and Snake HUD rendering in `src/`.
- Allowed edit scope: Snake-owned source, focused tests, and this plan.
- Browser surface: local Vite game, Snake mini-game and its skill dock.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: no redesign of unrelated mini-games, no balancing beyond the two requested skill caps/cost progression, no commit or push.

Output budget strategy:
- Use focused `rg` queries and bounded source reads; exclude generated assets, build output, and `node_modules`; cap command output to the relevant Snake symbols and tests.

Current verdict:
- verdict: complete
- confidence: 98/100
- next owner: user playtest/balance feedback only
- reason: all requested behavior, focused/full tests, build, and browser proof pass

Pre-solution issue challenge:
- reporter claim: N/A: this is a new feature request, not a bug report
- suggested diagnosis or fix: add two Snake skills at the simulation ownership boundary and render them through the existing skill dock
- repro ladder:
  - tests / source-level repro: N/A for bug reproduction; focused TDD tests define the new behavior
  - repo-owned automated browser or integration proof: focused Snake tests and full suite pass
  - Browser plugin: local real-app proof complete
  - screenshot / visual proof: `/tmp/library-magic-snake-food-skills.png`
- reproduction verdict: N/A: feature request
- validity verdict: valid
- best long-term fix boundary: Snake state/rules/actions, with UI derived from those values
- harsh honest feedback: N/A: requested progression is concrete and fits the existing Snake skill system
- hard-stop decision: proceed; no reproduction gate applies

Blocked condition:
- Stop only if the current Snake state model cannot represent multiple foods without destructive save migration and no compatible extension is possible, or if the local app cannot be built or opened after three distinct recovery attempts.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-snake-food-capacity-and-growth-threshold.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Acceptance criteria above capture caps 10 and 3 plus level-0 values 1 and 1. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | Goal created for this exact feature. |
| Source of truth read before edits | yes | Read `CONTEXT.md`, Snake state, actions, rules, HUD, CSS, and focused tests before implementation. |
| Acceptance criteria captured | yes | Six explicit acceptance rows recorded under Task source. |
| Pre-solution issue challenge required | no | N/A: new feature, not a bug claim. |
| Reproduction verdict before implementation | no | N/A: new feature. |
| Repro escalation ladder selected | no | N/A: no existing behavior claim to reproduce. |
| Suggested fix reviewed against durable boundary | yes | Simulation owns progression; HUD only derives and displays it. |
| TDD decision before behavior change or bug fix | yes | Use vertical focused tests for food capacity, then growth threshold. |
| Browser proof decision for browser surface | yes | Verify Snake skill cards and board in local app. |
| Browser pack selected | yes | `browser` pack materialized in this plan. |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, Snake panel. |
| Browser tool decision recorded | yes | Try repo-required Browser tool first; record fallback only if unavailable. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Full tests, typecheck, build, and browser proof pass. |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: new feature, not a bug report. |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: new feature. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature request; TDD first test failed on missing `foods`, and growth test failed 3 != 2 before implementation. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/snakeRules.test.ts` and `npx tsx tests/snakeLayoutStatic.test.ts` pass. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passes. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passes; only existing large-chunk warning remains. |
| Browser surface changed | yes | Capture browser proof | Local Browser proof observed 1 food at level 0 and 10 at max; screenshot `/tmp/library-magic-snake-food-skills.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: repository has no lint script; `git diff --check` passes. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Targeted diff review found and fixed tail-removal ordering before respawn; final source audit is clean. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-snake-food-capacity-and-growth-threshold.md` | Plan rows closed; final mechanical command recorded in verification evidence after execution. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened Livre du Serpent, checked level 0, used debug max-skills hotkey, and inspected rendered food/card counts. |
| Browser console/network check | yes | Record console/network state or N/A | Console warnings/errors: none. Network N/A: feature introduces no requests or external assets. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-snake-food-skills.png` shows 10 regular foods and max cards `Food Count 10`, `Growth 3 food`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | requirements captured; source owners and tests read | implementation |
| Implementation | complete | multi-food state, growth threshold, skill economy, HUD cards | verification |
| Verification | complete | full tests, typecheck, build, browser proof | closeout |
| Closeout | complete | plan rows closed for mechanical audit | final response |

Findings:
- Requirements are explicit enough to skip an interactive brainstorming pause.
- Existing Snake used one `food` cell; the durable model is now a `foods` collection capped by the skill.
- Removing the tail before refill is necessary for correct near-full-board spawning when growth is delayed.
- The skill grid already scrolls beyond eight cards, so adding two cards does not require layout resizing.

Decisions and tradeoffs:
- Treat the growth skill as a threshold that slows body growth while preserving every food's normal score/resource reward.
- Use the existing Snake scales economy for both skills.
- Count regular food, colored round food, and multiplier diamonds toward growth, preserving the previous rule that every consumed food item grew the snake.
- Costs use existing exponential Snake curves: Food Count starts at 120 scales; Growth starts at 180 scales.

Timeline:
- 2026-07-10T20:01:40.862Z: plan created.
- 2026-07-10: requirements extracted and goal contract completed before source edits.
- 2026-07-10: TDD capacity test failed on missing multi-food state, then passed after implementation.
- 2026-07-10: TDD growth test failed with premature growth, then passed with tracked food progress.
- 2026-07-10: browser verified level-0 values 1/1 and max values 10/3 with exactly 10 foods rendered.
- 2026-07-10: autoreview fixed tail-removal ordering before respawn; full verification reran green.

Verification evidence:
- command: `npx tsx tests/snakeRules.test.ts` -> pass (`snakeRules ok`).
- command: `npx tsx tests/snakeLayoutStatic.test.ts` -> pass.
- command: `npm test` -> all repository tests pass.
- command: `npm run typecheck` -> pass.
- command: `npm run build` -> pass; Vite large-chunk warning only.
- command: `git diff --check -- <touched files>` -> pass.
- command: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-snake-food-capacity-and-growth-threshold.md` -> pass.
- browser: `http://127.0.0.1:5173/` -> level 0 rendered 1 food and cards `Food Count 1`, `Growth 1 food`; max rendered 10 foods and cards `Food Count 10`, `Growth 3 food`; no console errors/warnings.
- artifact: `/tmp/library-magic-snake-food-skills.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Final goal-plan audit |
| Where am I going? | Mechanical plan check, goal completion, final response |
| What is the goal? | Add two Snake progression skills with caps 10 simultaneous foods and 3 foods per growth. |
| What have I learned? | Multi-food spawning must happen after non-growth tail removal on near-full boards. |
| What have I done? | Implemented both skills, tests, UI, full verification, and browser proof. |

Open risks:
- Balance costs (120 scales and 180 scales at level 0) are initial values and may need tuning after playtesting; behavior and caps are complete.
