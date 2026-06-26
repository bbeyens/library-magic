# td edge enemies and range shot

Objective:
Implement TD enemies spawning from forest edges, walking toward tower center, and tower shots only within range circle.

Goal plan:
docs/plans/2026-06-26-td-edge-enemies-and-range-shot.md

Template:
docs/plans/templates/task.md

Task source:
- type: user request
- id / link: chat
- title: Forest-edge enemy spawn, center movement, and tower range attack
- acceptance criteria:
  - Enemies appear from the square forest/frame edge.
  - Enemies move toward the center tower.
  - Tower attack visual appears from center to target.
  - Tower only attacks targets inside the visible range circle.
  - Tests, typecheck, build, browser proof, and diff check pass.
  - Existing TD monster walk sprite is used for enemies.

First checkpoint:
- Explicit requirements copied: spawn from trees/edge, walk to center/tower, add small tower attack, attack inside circle range.
- Non-goals: no new enemy spritesheet pipeline, no economy redesign, no wave redesign.

Timed checkpoint:
- requested duration: N/A
- semantics: no timed work requested
- initial confidence score: 82/100
- improvement loop: TDD rule helper, simulation/HUD/CSS integration, browser proof
- final score / loop closure: 93/100

Completion threshold:
Done when edge spawn, center movement, range-gated shot, and visual proof are implemented and verified.

Verification surface:
- `node tests/defenseRules.test.ts`
- existing rule smoke tests
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Chrome proof on `http://127.0.0.1:5173/`

Constraints:
- Preserve behavior outside the TD panel.
- Keep the Tiled map as the visual terrain source.
- Do not create PRs, commits, pushes, or external comments unless requested.

Boundaries:
- Source of truth: TD simulation state and Tiled HUD rendering.
- Allowed edit scope: defense simulation rules/state/actions, HUD rendering, CSS, focused tests, this plan.
- Browser surface: Bastion Arcanique panel.
- Tracker sync: none requested.
- Non-goals: no asset generation, no new pathfinding system.

Current verdict:
- verdict: complete
- confidence: 93/100
- next owner: task
- reason: tests and browser proof pass, with shot inside the visible range circle.

Pre-solution issue challenge:
- reporter claim: enemies should come from the forest edge and walk to the tower; tower should attack enemies in range.
- suggested diagnosis or fix: replace radial CSS placement with square-edge coordinate rules and render shot lines from center to target.
- repro ladder:
  - tests / source-level repro: added `defenseRules` tests for edge points, center interpolation, and circular range.
  - repo-owned automated browser or integration proof: Chrome proof sampled enemy coordinates and shot line.
  - Browser plugin: exact requested browser-use tool unavailable; used local Chrome automation.
  - screenshot / visual proof: `/tmp/library-magic-td-edge-spawn-range-shot.png`
- reproduction verdict: valid feature request.
- validity verdict: valid.
- best long-term fix boundary: defense rule helper owns coordinate/range math; HUD only renders.
- harsh honest feedback: the old angle/radius rendering was good enough for a prototype, not for a square Tiled forest map.
- hard-stop decision: proceed.

Blocked condition:
Blocked only if the TD panel cannot run locally or Chrome proof cannot observe enemies/shots.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-td-edge-enemies-and-range-shot.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | edge spawn, center movement, tower attack, range circle |
| Timed checkpoint parsed | yes | no timed request |
| Active goal checked or created | yes | goal created for TD edge enemies/range shot |
| Source of truth read before edits | yes | `state.ts`, `actions.ts`, `hud.ts`, `style.css` |
| Acceptance criteria captured | yes | see task source |
| Pre-solution issue challenge required | yes | gameplay feature request reviewed |
| Reproduction verdict before implementation | N/A | new feature, not bug |
| Repro escalation ladder selected | yes | tests plus browser proof |
| Suggested fix reviewed against durable boundary | yes | helper rule module owns geometry |
| TDD decision before behavior change or bug fix | yes | used `defenseRules.test.ts` tracer bullet |
| Browser proof decision for browser surface | yes | required and completed |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope boundary, timing constraint, stop condition, deliverable, final handoff section, verification surface, and success criterion is copied into this plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless explicitly marked hard stop; when no better metric exists, initial and final confidence scores are recorded.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or suggested fixes, reporter claims are challenged before implementation with a recorded verdict.
- [x] Repro escalation ladder followed for bug/behavior claims or marked N/A for new feature.
- [x] Hard-stop rule followed.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary.
- [x] Review/autoreview target selected from actual diff state.
- [x] Verification evidence is recorded beside each relevant gate.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof | tests, typecheck, build, browser proof, diff-check passed |
| Pre-solution issue challenge verdict | yes | Record verdict | valid feature request |
| Repro escalation ladder | N/A | New feature | tests and browser proof used anyway |
| Bug reproduced before fix | N/A | New feature | N/A |
| Targeted behavior verification | yes | Run focused test/proof | `defenseRules ok`; browser sampled edge movement and range shot |
| TypeScript or typed config changed | yes | Run typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run build | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | `/tmp/library-magic-td-edge-spawn-range-shot.png` |
| Final lint/format | yes | Run diff check | `git diff --check` passed |
| Autoreview | yes | Review final result | reviewed geometry/range math after browser proof exposed old range mismatch |
| Timed checkpoint | N/A | no timed request | N/A |
| Goal plan complete | yes | Run checker | passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | defense state/actions/HUD/CSS read | implementation |
| Implementation | complete | rules, state shot, HUD SVG shot, CSS placement | verification |
| Verification | complete | tests/build/browser proof passed | closeout |
| Closeout | complete | checker pending | final response |

Findings:
- Existing simulation already spawned enemies by lane/distance and gated attacks by range.
- Old rendering used circular angle/radius placement, which did not match the square Tiled forest border.
- First browser proof caught a real mismatch: shot target could be logically in range while visibly outside the range circle for diagonal edge paths.

Decisions and tradeoffs:
- Use square-edge interpolation from border to center for enemy position.
- Use Euclidean center distance against the visible circle for tower range.
- Render tower attack as a short SVG line from center to target.

Timeline:
- 2026-06-26: goal created.
- 2026-06-26: added `defenseRules` and tests.
- 2026-06-26: added transient `DefenseShot` state.
- 2026-06-26: changed HUD enemy placement from angle/radius to x/y.
- 2026-06-26: added SVG tower shot and CSS flash.
- 2026-06-26: corrected range math to match visible circle.
- 2026-06-26: replaced CSS square enemy marker with existing TD walk sprite.

Verification evidence:
- `node tests/defenseRules.test.ts && node tests/targetRules.test.ts && node tests/hundredRules.test.ts` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `git diff --check` passed.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-td-edge-enemies-and-range-shot.md` passed.
- Browser proof: spawn sample enemy at x 0.1, y 95.8 near frame edge; later x 5.1, y 91.1, center distance decreased from 67.7 to 60.9.
- Browser proof: shot line observed from 50,50 to x 52.96, y 16.21 with center distance 33.9, inside visible range radius about 34.
- Screenshot: `/tmp/library-magic-td-edge-spawn-range-shot.png`.
- Final browser sprite proof: `.defense-enemy` uses `/assets/td/tiles/Monster%20TD%201/1/S_Walk.png`, animation `defense-enemy-walk`, no bad TD asset responses.
- Final screenshot: `/tmp/library-magic-td-edge-enemy-sprite.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | TD enemies from forest edges, toward center, tower shots in range |
| What have I learned? | Range must use visual Euclidean center distance, not normalized edge distance |
| What have I done? | Rules, state, HUD, CSS, tests, browser proof |

Open risks:
- Enemy visuals are still CSS shapes, not sprite enemies.
