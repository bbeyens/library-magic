# Runner strafe animations

Objective:
Make Fox Left Strafe and Right Strafe remain active throughout real lateral movement in Runner, with deterministic regression coverage and live browser proof.

Goal plan:
docs/plans/2026-07-17-runner-strafe-animations.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user bug report
- id / link: N/A: no tracker ticket requested
- title: Runner Fox strafe animations do not launch during lateral movement
- acceptance criteria: Left Strafe is used while moving screen-left; Right Strafe is used while moving screen-right; idle, injury, and death priorities remain unchanged.

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
- initial confidence score: 92/100 after runtime reproduction
- improvement loop: reproduce, add a red regression contract, repair the stable movement boundary, run all checks, prove both directions in the browser
- final score / loop closure: 100/100; both runtime animation states and all automated gates pass

Completion threshold:
- `FoxStrafeLeft` remains selected while `playerX` is traveling toward a screen-left target.
- `FoxStrafeRight` remains selected while `playerX` is traveling toward a screen-right target.
- A repeated render without a new simulation position cannot reset a still-active lateral movement to idle.
- Each newly selected clip starts at its own beginning instead of an arbitrary global clock phase.
- Focused test, full tests, typecheck, build, diff check, browser proof, and browser console check pass.

Verification surface:
- `npx tsx tests/runnerHeroAnimation.test.ts`, `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.
- Live Runner at `http://127.0.0.1:5173/`, checking canvas animation and locomotion datasets for both lateral directions plus screenshots.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/runnerHeroAnimation.ts` for direction/state policy and `src/ui/runnerThreeLane.ts` for Three.js action selection.
- Allowed edit scope: the two Runner animation owners, their focused test, and this plan.
- Browser surface: Runner mini-game at `http://127.0.0.1:5173/`.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: no asset re-export, no movement-speed change, no alteration to injury/death animation priority, no changes to other mini-games.

Current verdict:
- verdict: fixed and verified
- confidence: 100/100
- next owner: user acceptance
- reason: stable target-based direction and per-animation timing are proven in tests and the live canvas

Pre-solution issue challenge:
- reporter claim: Left Strafe and Right Strafe do not visibly launch during lateral movement.
- suggested diagnosis or fix: replace render-to-render position delta with current-to-target movement intent and restart the clip clock on transition.
- repro ladder:
  - tests / source-level repro: focused renderer contract failed before the fix because it used `runnerHeroLastX` instead of `playerTargetX`.
  - repo-owned automated browser or integration proof: focused Runner animation test is the executable regression boundary.
  - Browser plugin: before the fix the state could be selected briefly from frame deltas; after the fix both stable target directions report the correct state.
  - screenshot / visual proof: emitted live screenshots for Right Strafe and Left Strafe in the actual Runner scene.
- reproduction verdict: reproduced as unstable state selection, not missing assets; both embedded clips have 102 valid rig channels.
- validity verdict: valid
- best long-term fix boundary: derive locomotion from simulation-owned current and target positions, not renderer history.
- harsh honest feedback: the clips were present and correctly rigged; the renderer was throwing away the movement intent between ticks.
- hard-stop decision: proceed with the narrow animation-owner fix.

Blocked condition:
- Block only if the embedded Fox strafe clips are absent/incompatible or the live Runner cannot expose its active animation after three attempts; neither condition occurred.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-17-runner-strafe-animations.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Both named strafe directions and gameplay-only scope captured |
| Timed checkpoint parsed | N/A | No duration requested |
| Active goal checked or created | yes | Goal `019f41dc-55e9-7191-b974-050bf461d370` active |
| Source of truth read before edits | yes | Animation policy, renderer action setup, GLB clips, and focused tests inspected |
| Acceptance criteria captured | yes | Task source and completion threshold |
| Pre-solution issue challenge required | yes | Valid bug; assets were ruled out before changing code |
| Reproduction verdict before implementation | yes | Runtime and red source contract reproduced unstable renderer-history selection |
| Repro escalation ladder selected | yes | Focused test, full suite, Browser, screenshots |
| Suggested fix reviewed against durable boundary | yes | Simulation movement intent is the stable ownership boundary |
| TDD decision before behavior change or bug fix | yes | Focused test failed before source repair |
| Browser proof decision for browser surface | yes | Both directions required in the real canvas |
| Browser pack selected | yes | Browser pack materialized |
| Browser route / app surface identified | yes | Local Runner panel |
| Browser tool decision recorded | yes | Repo-approved in-app Browser used |

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
| Named verification threshold | pass | Run the named proof or record blocker | Focused/full tests, typecheck, build, diff check, and Browser pass |
| Pre-solution issue challenge verdict | pass | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid report; asset absence disproved; renderer-history ownership corrected |
| Repro escalation ladder | pass | Record all relevant proof levels | Red focused contract and live runtime dataset used |
| Bug reproduced before fix | pass | Record failing test/repro or N/A with reason | Focused test failed on missing target-based direction call |
| Targeted behavior verification | pass | Run focused test/proof for changed behavior or record N/A | `runnerHeroAnimation ok` |
| TypeScript or typed config changed | pass | Run relevant typecheck | `npm run typecheck` exit 0 |
| Build-sensitive behavior changed | pass | Run relevant build/check | `npm run build` exit 0; existing chunk warning only |
| Browser surface changed | pass | Capture browser proof | Canvas reports `strafeRight/strafe-right` and `strafeLeft/strafe-left` |
| Final lint/format | pass | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passes |
| Autoreview | pass | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Stable target boundary, priority behavior, and clip timing reviewed |
| Timed checkpoint | N/A | No duration requested | N/A |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-17-runner-strafe-animations.md` | Final checker run after this update |
| Browser interaction proof | pass | Exercise target route/interaction or record blocker | Both sides exercised in the real Runner canvas |
| Browser console/network check | pass | Record console/network state or N/A | Zero warnings/errors; network N/A because all relevant embedded assets visibly loaded |
| Browser final proof artifact | pass | Record screenshot/trace/route proof or exact caveat | Two in-app screenshots emitted in this task, one per strafe direction |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Policy, renderer, assets, tests, and runtime inspected | done |
| Implementation | completed | Target-based direction and per-transition clip clock | done |
| Verification | completed | All commands and both browser directions pass | done |
| Closeout | completed | Final audit and checker | final response |

Findings:
- All seven Fox clips exist; both strafe clips contain 102 channels targeting valid Fox rig nodes.
- Runtime state briefly selected the strafe clip, proving the assets and actions were present.
- Renderer-owned `runnerHeroLastX` was unstable across renders without a new simulation position.

Decisions and tradeoffs:
- Use `playerX -> playerTargetX` as movement intent; it remains true for the full travel duration and is independent of render frequency.
- Reset the animation-local clock on state transition so a strafe starts at frame zero.

Timeline:
- 2026-07-17T00:46:44.416Z: plan created.
- 2026-07-17: reproduced, ruled out malformed assets, added red contract, fixed renderer ownership, verified both directions.

Verification evidence:
- Focused test: pass.
- Full `npm test`: pass.
- Typecheck: pass.
- Production build: pass with only the existing large-chunk warning.
- Browser: both strafe states and screenshots pass; console has zero warnings/errors.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | User acceptance |
| What is the goal? | Keep the correct Fox strafe clip active throughout lateral movement |
| What have I learned? | The defect was renderer history, not the FBX/GLB clips |
| What have I done? | Reproduced, repaired, tested, built, and browser-proven both directions |

Open risks:
- None in scope; injury and death still intentionally override strafing.
