# TD 10 minute FPS stability

Objective:
Keep TD FPS stable for 10 minutes; done when the wave-100 browser probe shows no sustained FPS decay and checks pass.

Goal plan:
docs/plans/2026-07-08-td-10-minute-fps-stability.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user correction
- id / link: local app at `http://127.0.0.1:5173/`
- title: Fix TD FPS drop that still appears after about 10 minutes
- acceptance criteria: keep working until the FPS drop after 10 minutes is gone; this is release-blocking.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: 10 minutes of browser runtime per proof attempt
- semantics: minimum active probe duration, not a hard stop
- initial confidence score: 70/100
- improvement loop: run 10-minute probe, identify degrading counter/hot path, patch one owner, verify, rerun 10-minute probe
- final score / loop closure: record after 10-minute proof passes

Completion threshold:
- TD wave-100 browser probe runs for at least 10 minutes after setup.
- After the 10-minute mark, the live counter and recent stability window remain above 105 FPS.
- Final 2-minute average FPS is not more than 5 FPS below the first 2-minute post-warmup average.
- DOM nodes, `document.getAnimations().length`, and `.defense-actors` child counts remain bounded.
- Focused tests, typecheck, and build pass.

Verification surface:
- Browser proof on `http://127.0.0.1:5173/`: TD, wave 100, full skills/resources, debug tower HP, base speed ON, reported speed left at the scenario used by the repro.
- Probe summary by 60-second windows: min/avg FPS, DOM nodes, animations, actors, enemies, shots, lightning, money, impacts.
- Commands: `npx tsx tests/hudStatic.test.ts`, `npx tsx tests/defenseRules.test.ts`, `npm run typecheck`, `npm run build`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.
- Do not cap visible combat effects as a fake fix.
- Do not touch unrelated orb/orbit animations.
- Do not change enemy spawn behavior unless the probe proves it is the owner.

Boundaries:
- Source of truth: actual FPS trend in the TD browser surface over 10 minutes.
- Allowed edit scope: TD render hot paths in `src/ui/hud.ts`, `src/style.css`, TD simulation only if the simulation probe proves a state leak, focused tests, and this plan.
- Browser surface: local Vite app TD mini-game.
- Tracker sync: N/A.
- Non-goals: redesigning TD, economy rebalance, changing unrelated crystal/orb features.

Current verdict:
- verdict: previous 120s proof insufficient
- confidence: 70/100
- next owner: task
- reason: user reports FPS still decays after about 10 minutes; release-blocking until a 10-minute probe passes.

Pre-solution issue challenge:
- reporter claim: FPS still drops after 10 minutes despite the 120s fix; this must be fixed before release.
- suggested diagnosis or fix: previous patches removed short-spike paint costs, but a longer-run source may remain.
- repro ladder:
  - tests / source-level repro: simulation probe can prove or exclude state growth.
  - repo-owned automated browser or integration proof: 10-minute Chrome/Playwright probe samples real FPS counter.
  - Browser plugin: tool search did not expose browser-use; use repeatable Chrome automation and current in-app context.
  - screenshot / visual proof: user live report is accepted; automated probe will provide numeric proof.
- reproduction verdict: pending 10-minute probe.
- validity verdict: likely valid until proven otherwise.
- best long-term fix boundary: measured TD state/render owner, not a speed-toggle workaround.
- harsh honest feedback: a 120s benchmark was too weak for the user’s actual 10-minute failure. That’s on the benchmark, not the user.
- hard-stop decision: continue.

Blocked condition:
- If three distinct 10-minute probes cannot reproduce the drop but the user still sees it, request a DevTools Performance trace or F3 debug recording from the exact visible browser session.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-td-10-minute-fps-stability.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | user requires continuing until 10-minute FPS drop is gone |
| Timed checkpoint parsed | yes | 10-minute minimum browser proof |
| Active goal checked or created | yes | active autogoal checked before closeout |
| Source of truth read before edits | yes | `td-performance-debug` skill plus prior TD FPS findings |
| Acceptance criteria captured | yes | no FPS decay after 10 minutes |
| Pre-solution issue challenge required | yes | user claim accepted pending numeric repro |
| Reproduction verdict before implementation | yes | long browser probes reproduced TD render spikes and late FPS decay before final fixes |
| Repro escalation ladder selected | yes | simulation probe if needed, then browser proof |
| Suggested fix reviewed against durable boundary | yes | measured owner only; no speed-toggle workaround |
| TDD decision before behavior change or bug fix | yes | static/rules tests plus browser proof; FPS cannot be unit-tested honestly |
| Browser proof decision for browser surface | yes | required |
| Browser pack selected | yes | local Chrome automation; browser-use not exposed by tool search |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/` TD |
| Browser tool decision recorded | yes | Playwright/Chrome via bundled Node modules |

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
| Named verification threshold | yes | Run the named proof or record blocker | 604s wave-100 TD probe; final recent 120s min 120 FPS, avg 121.06 FPS |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | valid; long-run render churn existed; speed/display confusion was separately identified and excluded |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | simulation stayed bounded; browser proof isolated HUD render sections |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | reproduced as late FPS decay/render spikes in Chrome probe before direct-DOM money and pool fixes |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/hudStatic.test.ts`; `npx tsx tests/defenseRules.test.ts`; 604s browser proof |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | TD wave 100, full skills, x2, base speed ON, debug HP, 604s runtime |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script required for this scoped fix |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | verified no cadence-keeper hack kept after user clarified display issue |
| Timed checkpoint | yes | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | 604s proof after setup, final 2 minutes stable above 105 FPS |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-td-10-minute-fps-stability.md` | run during closeout |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | route `http://127.0.0.1:5173/`, TD panel open on wave 100 |
| Browser console/network check | N/A | Record console/network state or N/A | performance-only local probe; no console/network regressions observed in automation path |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | numeric probe output recorded in Verification evidence |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | plan and `td-performance-debug` skill read | implementation |
| Implementation | complete | TD HUD hot paths optimized | verification |
| Verification | complete | tests, typecheck, build, and 604s browser proof passed | closeout |
| Closeout | complete | plan updated and autogoal check to run | final response |

Findings:
- Previous 120s proof passed but was too short for the actual reported failure.
- Known prior fixes: damage text canvas cache, transform-only projectiles/coins, removal of runtime hit drop-shadow, removal of duplicate shot pseudo-glow.
- The false 60 FPS plateau was caused by the probe/browser being on a 60 Hz display, not by TD render saturation.
- Remaining real spikes were in TD HUD render hot paths: pooled effect reactivation, money popup parsing, layout reads for money pulse, and unconditional wave cleanup scans.

Decisions and tradeoffs:
- Use a 10-minute proof as the completion gate even though it slows iteration.
- Preserve visible gameplay counts; performance fixes must be render/state ownership fixes.

Timeline:
- 2026-07-08T09:40:39.914Z: plan created.
- 2026-07-08: captured 10-minute release-blocking acceptance threshold.
- 2026-07-08: added HUD perf section instrumentation to isolate `actors-setup`, `attacks`, `money`, and `enemies`.
- 2026-07-08: changed shots, enemy projectiles, lightning, and money popups to direct DOM activation instead of template parsing.
- 2026-07-08: removed money counter layout reads and throttled/reused the money pulse.
- 2026-07-08: avoided expensive animation cancellation for hidden TD pooled effects and skipped wave pool pruning unless the layer grows beyond 80 children.
- 2026-07-08: removed an unnecessary cadence-keeper idea after user clarified the 60 FPS plateau came from the display.
- 2026-07-08: final 604s probe passed with final 120s min 120 FPS, average 121.06 FPS.

Verification evidence:
- `npm run typecheck` passed.
- `npx tsx tests/hudStatic.test.ts` passed.
- `npx tsx tests/defenseRules.test.ts` passed.
- `npm run build` passed.
- Browser proof on `http://127.0.0.1:5173/`: TD wave 100, full skills/resources, debug tower HP, base speed ON, x2.
- Final probe runtime: 604 seconds.
- Final FPS evidence: current 120 FPS; last 30 samples all 120-124 FPS; recent 60s min 120 FPS, avg 120.85 FPS; recent 120s min 120 FPS, avg 121.06 FPS.
- Bounded runtime evidence: nodes 342, animations 20, actors 28-41 during final window, active money popups 4-6, active enemies 2-11, no DOM damage/impact buildup.
- Caveat: one isolated early sample hit 103 FPS before the final stable window; it did not persist and did not affect the 10-minute stability window.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | TD must not decay below 105 FPS after a 10-minute wave-100 run |
| What have I learned? | See Findings and Verification evidence |
| What have I done? | See Timeline |

Open risks:
- None for the measured TD long-run FPS regression. Residual risk: isolated browser/display focus samples can still appear if the window is moved to a 60 Hz display.
