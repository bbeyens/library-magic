# TD stable fps over 105

Objective:
Keep TD FPS above 105; done when browser probe min FPS >=105 after warmup and checks pass.

Goal plan:
docs/plans/2026-07-08-td-stable-fps-over-105.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: local browser at http://127.0.0.1:5173/
- title: Stabilize TD long-run FPS above 105
- acceptance criteria: keep iterating until the TD FPS counter stays permanently above 105 FPS in the test surface.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: until measurable FPS threshold is met, not a fixed time box
- semantics: run repeated implementation and browser-measurement loops until min FPS is >=105 after warmup
- initial confidence score: 78/100
- improvement loop: inspect measured hotspots, make one focused change, run tests, rerun browser probe
- final score / loop closure: record after threshold proof

Completion threshold:
- Browser TD wave-100 stress probe samples FPS for at least 120 seconds after setup.
- Ignore only the first 3 seconds of warmup after route/setup.
- Minimum sampled FPS after warmup is >=105.
- No hidden cap of enemy/effect counts is introduced to fake the result.
- Focused static/rules tests and production build pass.

Verification surface:
- Browser proof on `http://127.0.0.1:5173/`: open TD, enable test resources/max skills/debug HP/wave 100, sample the visible FPS counter.
- Commands: `npx tsx tests/hudStatic.test.ts`, `npx tsx tests/defenseRules.test.ts`, `npm run typecheck`, `npm run build`.
- Source audit of TD render hot paths touched by the fix.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.
- Do not touch the unrelated orb/orbit animation the user said belongs to another prompt.
- Do not reduce visible gameplay counts or cap effects as a performance shortcut unless the user explicitly approves.
- Keep enemy spawn visuals and TD skill behavior intact.

Boundaries:
- Source of truth: live TD browser behavior and the FPS counter.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, TD simulation files only if the measured root cause requires it, focused tests, and this plan.
- Browser surface: TD mini-game in the local Vite app.
- Tracker sync: N/A.
- Non-goals: redesigning TD, changing economy balance, removing ice/lightning, changing unrelated crystal/orb work.

Current verdict:
- verdict: fixed in browser probe
- confidence: 92/100
- next owner: complete
- reason: 120s TD wave-100 probe stayed above the requested 105 FPS threshold after warmup.

Pre-solution issue challenge:
- reporter claim: TD FPS drops after long play and speed-toggle-like resets restore performance; the user wants repeated fixes until FPS stays above 105.
- suggested diagnosis or fix: likely long-run render/animation hot path rather than nextEnemyId or enemy count, based on prior debug overlay evidence.
- repro ladder:
  - tests / source-level repro: static tests can guard hot-path regressions but cannot reproduce FPS.
  - repo-owned automated browser or integration proof: Playwright/Chrome probe can sample the real FPS counter.
  - Browser plugin: in-app browser evidence exists; automated browser is used for repeatable measurement.
  - screenshot / visual proof: user supplied video and screenshots with FPS drops.
- reproduction verdict: valid enough to continue; automated probe already saw dips below 105.
- validity verdict: valid performance bug.
- best long-term fix boundary: TD render/update hot paths, not gameplay feature caps.
- harsh honest feedback: a speed-toggle reset is a symptom workaround, not a fix; shipping that as the only solution would be brittle.
- hard-stop decision: continue; not blocked.

Blocked condition:
- After at least three distinct measured fix/probe loops, if min FPS remains <105 and available browser probes cannot isolate a hotspot, ask for a DevTools Performance trace or a longer F3 debug recording.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-td-stable-fps-over-105.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | user wants repeated fixes until FPS counter stays permanently above 105 |
| Timed checkpoint parsed | yes | no fixed duration; threshold loop |
| Active goal checked or created | yes | goal created with objective: keep TD FPS above 105 |
| Source of truth read before edits | yes | `src/ui/hud.ts`, `src/style.css`, and user/browser evidence from current thread |
| Acceptance criteria captured | yes | min FPS >=105 after warmup in TD stress probe |
| Pre-solution issue challenge required | yes | performance bug claim challenged against measured evidence |
| Reproduction verdict before implementation | yes | valid enough; automated probe dipped below 105 |
| Repro escalation ladder selected | yes | browser FPS probe plus focused static tests |
| Suggested fix reviewed against durable boundary | yes | render hot path, no gameplay caps |
| TDD decision before behavior change or bug fix | yes | focused static/rules tests for code shape; FPS requires browser proof |
| Browser proof decision for browser surface | yes | required |
| Browser pack selected | yes | local browser/Chrome probe |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, TD mini-game |
| Browser tool decision recorded | yes | repeatable Playwright/Chrome probe because Browser UI evidence is already present |

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
| Named verification threshold | yes | Run the named proof or record blocker | 120s browser probe: validAfterWarmup 117, minFps 106, lowsBelow105 0 |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | recorded above |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | automated probe dipped below 105 |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/hudStatic.test.ts`; `npx tsx tests/defenseRules.test.ts` |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | 120s browser probe: minFps 106 |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script needed for targeted CSS/TS changes; build/typecheck/static tests passed |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | reviewed against no caps/no orb changes/visible FPS threshold |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | threshold-based, not time-boxed |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-td-stable-fps-over-105.md` | check-complete passed after final closeout update |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | opened local app, unlocked/maxed, opened TD, set wave 100, kept debug HP active |
| Browser console/network check | yes | Record console/network state or N/A | consoleMessages [] |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | JSON probe summary recorded in Verification evidence |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | created plan | implementation |
| Implementation | completed | optimized TD render hot paths without caps | verification |
| Verification | completed | browser probe + tests/build passed | closeout |
| Closeout | completed | plan update and verification evidence recorded | final response |

Findings:
- User video/debug overlay evidence excludes unbounded DOM growth, animation count growth, enemy count, and `nextEnemyId` as primary causes.
- Prior automated probe after damage-text canvas sprite caching improved the issue but still saw min FPS 74 over 45 seconds, so more work is required.
- Worst remaining probe sample had moderate actor counts and several active shots/lightning animations, pointing at paint/compositing hot paths rather than enemy simulation volume.
- Transforming TD shots, enemy projectiles, and money coin flights with `translate` instead of animated `left/top` removed layout work from recurring effects.
- The largest remaining spike came from runtime `drop-shadow` in enemy hit feedback during lightning/death clusters; removing that improved the worst case from FPS 22 to near threshold.
- Removing the duplicate blurred pseudo-glow from tower shots let the final 120s probe stay above threshold.

Decisions and tradeoffs:
- Use browser FPS threshold as the gate; tests alone cannot prove this performance bug.
- Optimize rendering cost without capping visible effect counts.
- Keep visible lightning/ice/orb counts intact; optimize CSS/runtime paint cost instead.

Timeline:
- 2026-07-08T06:52:52.063Z: plan created.
- 2026-07-08: captured objective, threshold, constraints, browser proof path, and current findings.
- 2026-07-08: first 90s browser probe after earlier damage canvas cache: minFps 96, lowsBelow105 2.
- 2026-07-08: after transform-only shot/projectile motion, 120s probe still saw minFps 98 with money/lightning spikes.
- 2026-07-08: after transform-only money coin flight, 120s probe saw one lightning/death cluster spike at FPS 22.
- 2026-07-08: after removing enemy hit-feedback runtime drop-shadow, 120s probe improved to minFps 104.
- 2026-07-08: after removing duplicate blurred shot pseudo-glow, 120s browser probe passed with minFps 106 and lowsBelow105 0.

Verification evidence:
- Browser probe: local Chrome, `http://127.0.0.1:5173/`, TD wave 100, max skills/resources, debug HP refreshed, speed x4. Duration 120s, validAfterWarmup 117, minFps 106, maxFps 120, avgFps 119, lowsBelow105 0, consoleMessages [].
- `npx tsx tests/hudStatic.test.ts` passed.
- `npx tsx tests/defenseRules.test.ts` passed.
- `npm run typecheck` passed.
- `npm run build` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Keep TD FPS above 105 after warmup in wave-100 browser probe |
| What have I learned? | See Findings |
| What have I done? | Optimized recurring TD render hot paths and verified minFps 106 |

Open risks:
- Headless Chrome FPS may differ from the visible in-app browser, but the prior same probe reproduced drops and now passes.
- The user's "permanent" target is approximated by a sustained 120s probe; a 10-minute manual run is still the strongest final human confirmation.
