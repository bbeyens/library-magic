# td static background dynamic actors

Objective:
Optimize TD HUD so Tiled background stays mounted while enemies/shots update dynamically.

Goal plan:
docs/plans/2026-06-26-td-static-background-dynamic-actors.md

Template:
docs/plans/templates/task.md

Task source:
- type: user request
- id / link: chat
- title: Keep TD background mounted and update only enemies/shots
- acceptance criteria:
  - Tiled background is not rebuilt every enemy movement tick.
  - Background tile animations keep running.
  - Enemies and tower shots still update.
  - Performance proof shows fewer `#hud-root.innerHTML` writes during TD.
  - Typecheck, build, diff check, and focused tests pass.

First checkpoint:
- Explicit requirements copied: optimize as discussed, preserve background animation, split static Tiled background from dynamic gameplay actors.
- Non-goals: no new engine, no asset redesign, no gameplay rebalance.

Timed checkpoint:
- requested duration: N/A
- semantics: no timed work requested
- initial confidence score: 92/100
- improvement loop: measure baseline, isolate dynamic actor updates, measure again
- final score / loop closure: 96/100

Completion threshold:
Done when TD actor movement no longer forces repeated root HUD rebuilds and browser proof confirms background animation plus gameplay behavior.

Verification surface:
- Chrome measurement of `#hud-root.innerHTML` writes.
- Browser proof for enemy movement, shot, and background animation progress.
- `node tests/defenseRules.test.ts`
- `npm run typecheck`
- `npm run build`
- `git diff --check`

Constraints:
- Preserve behavior outside TD.
- Keep Tiled map DOM and CSS animations intact.
- Do not create PRs, commits, pushes, or external comments unless requested.

Boundaries:
- Source of truth: HUD render/update boundary for TD.
- Allowed edit scope: `src/ui/hud.ts`, plan file, cleanup needed for checks.
- Browser surface: Bastion Arcanique panel.
- Tracker sync: none requested.
- Non-goals: no full rendering engine rewrite.

Current verdict:
- verdict: complete
- confidence: 96/100
- next owner: task
- reason: root HUD rewrites dropped from 71 to 4 over the measured TD window.

Pre-solution issue challenge:
- reporter claim: TD lags heavily and optimization should keep background mounted.
- suggested diagnosis or fix: avoid rebuilding full HUD/map for enemy movement; update only the actors layer.
- repro ladder:
  - tests / source-level repro: inspected `createHudSignature` and `renderHud`.
  - repo-owned automated browser or integration proof: instrumented `Element.prototype.innerHTML` in Chrome.
  - Browser plugin: exact browser-use tool unavailable; used local Chrome automation.
  - screenshot / visual proof: `/tmp/library-magic-td-optimized-layer.png`.
- reproduction verdict: valid: baseline showed 71 root HUD rewrites in about 3 seconds.
- validity verdict: valid.
- best long-term fix boundary: dynamic TD actors layer, not rebuilding static Tiled terrain.
- harsh honest feedback: rebuilding 890 tiles and 1030 tile images for enemy movement was the lag. That was the wrong rendering boundary.
- hard-stop decision: proceed.

Blocked condition:
Blocked only if browser instrumentation cannot measure root rewrites or TD panel cannot run.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-td-static-background-dynamic-actors.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | static background, dynamic actors, preserve background animation |
| Timed checkpoint parsed | yes | no timed request |
| Active goal checked or created | yes | goal created |
| Source of truth read before edits | yes | `renderHud`, `createHudSignature`, `defensePanel` |
| Acceptance criteria captured | yes | see task source |
| Pre-solution issue challenge required | yes | perf regression report |
| Reproduction verdict before implementation | yes | baseline browser metric reproduced |
| Repro escalation ladder selected | yes | Chrome instrumentation |
| Suggested fix reviewed against durable boundary | yes | actor layer update boundary |
| TDD decision before behavior change or bug fix | yes | existing focused rule test retained; browser perf proof is the main regression loop |
| Browser proof decision for browser surface | yes | required and completed |

Work Checklist:
- [x] First checkpoint complete.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Timed checkpoint recorded as N/A.
- [x] Task source and acceptance criteria are captured.
- [x] Reporter claim challenged and reproduced.
- [x] Repro escalation ladder followed.
- [x] Hard-stop rule followed.
- [x] Nearby implementation patterns read before edits.
- [x] Implementation fixes the HUD ownership boundary.
- [x] Verification evidence is recorded.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run browser measurement and checks | passed |
| Pre-solution issue challenge verdict | yes | Record verdict | valid perf issue |
| Repro escalation ladder | yes | Browser instrumentation | baseline and after metrics captured |
| Bug reproduced before fix | yes | Record failing perf signal | 71 `#hud-root.innerHTML` writes in about 3s |
| Targeted behavior verification | yes | Browser proof | after optimization: 4 root writes, enemy moved, shot appeared, background animation advanced |
| TypeScript or typed config changed | yes | Run typecheck | passed |
| Build-sensitive behavior changed | yes | Run build | passed |
| Browser surface changed | yes | Capture browser proof | `/tmp/library-magic-td-optimized-layer.png` |
| Final lint/format | yes | Run diff check | passed |
| Autoreview | yes | Review final result | actor updates isolated in `.defense-actors` |
| Timed checkpoint | N/A | no timed request | N/A |
| Goal plan complete | yes | Run checker | passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | HUD render loop inspected | implementation |
| Implementation | complete | dynamic actors layer added | verification |
| Verification | complete | checks and browser proof passed | closeout |
| Closeout | complete | checker pending | final response |

Findings:
- The lag was client-side DOM churn, not Vite.
- Baseline TD proof: 71 root HUD `innerHTML` writes, 2069 DOM nodes, 890 Tiled tiles, 1030 tile images.
- Actor movement and shot timer were part of the full HUD signature, so the Tiled terrain was repeatedly rebuilt.

Decisions and tradeoffs:
- Keep Tiled terrain in the normal render.
- Move enemies and tower shot into `.defense-actors`.
- Update enemy styles and shot DOM directly during dynamic HUD updates.
- Remove enemy movement and shot timer from the full HUD signature.

Timeline:
- 2026-06-26: measured baseline lag.
- 2026-06-26: added dynamic defense actor update path.
- 2026-06-26: removed TD movement/shot churn from full HUD signature.
- 2026-06-26: verified root rewrites and behavior in Chrome.

Verification evidence:
- Baseline Chrome proof: `hudInnerHTMLWrites: 71`, `tiledTiles: 890`, `tiledImages: 1030`.
- Optimized Chrome proof: `hudInnerHTMLWrites: 4`, `tiledTiles: 890`, `tiledImages: 1030`, `animatedTiles: 28`.
- Behavior proof: enemy position changed from `0.046% / 95.775%` to `5.088% / 91.155%`; background tile animation progress changed; tower shot appeared.
- Screenshot: `/tmp/library-magic-td-optimized-layer.png`.
- `node tests/defenseRules.test.ts` passed.
- `npm run typecheck` passed.
- `npm run build` passed.
- `git diff --check` passed.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-td-static-background-dynamic-actors.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Keep TD background mounted while dynamic actors update |
| What have I learned? | Root HUD rebuild was the perf problem |
| What have I done? | Added `.defense-actors` dynamic layer and removed movement/shot churn from full signature |

Open risks:
- Further optimization could move resource/stats updates out of full render too, but the major TD lag is fixed.
