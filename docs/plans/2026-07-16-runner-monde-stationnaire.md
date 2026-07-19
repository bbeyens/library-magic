# runner-monde-stationnaire

Objective:
Rendre le Runner visuellement stationnaire : héros et terrain fixes, progression logique conservée, ennemis venant vers le joueur, avec tests et vérification navigateur.

Goal plan:
docs/plans/2026-07-16-runner-monde-stationnaire.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A: no tracker ticket supplied
- title: Runner stationary world
- acceptance criteria: the playable hero does not run forward; the terrain does not scroll; enemies still approach; distance-based progression remains active.

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
- initial confidence score: 90/100
- improvement loop: focused test, implementation, typecheck/build, browser observation
- final score / loop closure: 98/100; focused test, full suite, build, source audit, and browser proof pass.

Completion threshold:
- Focused automated proof confirms terrain positions are invariant across logical distances and gameplay hero locomotion uses a standing clip.
- Existing Runner simulation keeps increasing logical distance and moving enemies toward contact.
- Typecheck and production build pass.
- Browser proof confirms the hero and a terrain landmark remain fixed while an enemy's screen-relative z decreases.

Verification surface:
- `npx tsx tests/runnerStationaryWorld.test.ts`
- Runner-focused tests, excluding known unrelated concurrent Demongirl assertions if still failing.
- `npm run typecheck`
- `npm run build`
- Browser plugin on `http://127.0.0.1:5173/`, including runtime positions and console check.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/runnerThreeLane.ts`, `src/ui/runnerTerrainLoop.ts`, and deterministic Runner simulation tests.
- Allowed edit scope: Runner renderer/terrain helper plus one focused test and this plan.
- Browser surface: Runner book at `http://127.0.0.1:5173/`.
- Tracker sync: N/A: no ticket requested.
- Non-goals: no economy, enemy-health, projectile, checkpoint, boss, other mini-game, asset, or save-format changes.

Current verdict:
- verdict: pass
- confidence: 98/100
- next owner: user acceptance
- reason: hero and terrain remain fixed while measured enemy-relative z decreases; all automated gates pass.

Pre-solution issue challenge:
- reporter claim: playable characters run and the terrain loop moves, while only enemies should run toward them.
- suggested diagnosis or fix: freeze hero locomotion and terrain loop without stopping logical distance progression.
- repro ladder:
  - tests / source-level repro: source confirms `syncRunnerTerrain(lane, run.distance)` and gameplay maps `standardRun` to the run clip.
  - repo-owned automated browser or integration proof: focused test failed before implementation and passes after; full `npm test` passes.
  - Browser plugin: localhost Runner launched and runtime data sampled twice.
  - screenshot / visual proof: final gameplay capture shows fixed fox, canyon, and an incoming enemy.
- reproduction verdict: reproduced before fix, then verified fixed.
- validity verdict: valid.
- best long-term fix boundary: freeze only presentation; retain deterministic logical distance and entity world coordinates.
- harsh honest feedback: stopping `run.distance` would break progression, spawning, bosses, checkpoints, bullets, and enemy scaling; that is the wrong fix.
- hard-stop decision: proceed with the presentation-layer fix.

Blocked condition:
- Block only if the Runner route cannot load or the current concurrent hero-asset work removes the standing clip required for a stationary pose.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-monde-stationnaire.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Hero stationary; terrain stationary; only enemies approach; logical progression preserved; no other mini-game changes. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created for this task. |
| Source of truth read before edits | yes | Runner terrain helper, renderer, and simulation tick inspected. |
| Acceptance criteria captured | yes | Listed above. |
| Pre-solution issue challenge required | yes | Behavior claim challenged and validated from source. |
| Reproduction verdict before implementation | yes | Reproduced: distance drives terrain positions and hero uses run clip. |
| Repro escalation ladder selected | yes | Focused test, Runner tests, Browser plugin. |
| Suggested fix reviewed against durable boundary | yes | Presentation-only fix preserves progression systems. |
| TDD decision before behavior change or bug fix | yes | Add focused red test before code changes. |
| Browser proof decision for browser surface | yes | Required because motion is rendered behavior. |
| Browser pack selected | yes | Browser pack materialized in this plan. |
| Browser route / app surface identified | yes | Runner book on localhost:5173. |
| Browser tool decision recorded | yes | Use repo-approved Browser plugin. |

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
| Named verification threshold | yes | Run the named proof or record blocker | PASS: focused test, full suite, typecheck, build, and Browser measurements. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid behavior request; presentation-only boundary selected. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Red focused test, green suite, live runtime sampling, and screenshot completed. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | `runnerStationaryWorld.test.ts` initially failed because positions changed at 37 m. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerStationaryWorld`, `runnerEnvironmentAsset`, `runnerHeroAnimation`, and `runnerHeroSkin` pass. |
| TypeScript or typed config changed | yes | Run relevant typecheck | PASS: `npm run typecheck`. |
| Build-sensitive behavior changed | yes | Run relevant build/check | PASS: `npm run build`; existing chunk-size warning only. |
| Browser surface changed | yes | Capture browser proof | PASS: localhost Runner gameplay captured. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint/format script; `git diff --check` passes. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | PASS: simulation/economy untouched; terrain, hero clip mapping, tests, and proof markers only. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-monde-stationnaire.md` | PASS: completion checker run after plan closure. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Runner opened from bookshelf and Run launched on localhost. |
| Browser console/network check | N/A | Record console/network state or N/A | No network behavior changed; Browser binding exposed no console/network log API. Assets rendered without visible load failure. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Gameplay screenshot plus runtime attributes: terrain `stationary`, anchor `-14.286`, hero z `0`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | source paths and behavior boundary recorded | implementation |
| Implementation | completed | static terrain layout, standing hero clips, runtime proof markers | verification |
| Verification | completed | all tests, typecheck, build, browser proof pass | closeout |
| Closeout | completed | autoreview and goal checker complete | final response |

Findings:
- `run.distance` is the correct logical progression source and must remain active for spawning, HP scaling, bosses, checkpoints, and projectiles.
- Only terrain segment placement used distance visually; enemy rendering already uses relative z and enemy assets already contain run animations.
- The legacy animation state names `standardRun` and `injuredRun` remain for compatibility, but both now resolve to the standing clip.

Decisions and tradeoffs:
- Freeze presentation instead of stopping simulation distance.
- Keep world-coordinate entity contracts unchanged to avoid regressions in hits, homing, gates, and checkpoints.
- Retain legacy state identifiers to keep the change narrow; tests enforce that no hero run clip is loaded.

Timeline:
- 2026-07-16T16:11:37.406Z: plan created.
- Added a focused red regression test for moving terrain and hero run clips.
- Replaced distance-phased terrain coordinates with fixed authored positions.
- Mapped normal and injured gameplay to the standing clip while preserving death.
- Added bounded runtime attributes for terrain anchor, hero z, and nearest enemy relative z.
- Completed automated and browser verification.

Verification evidence:
- `npm test`: PASS, all repository tests.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; 40 modules transformed.
- `git diff --check`: PASS.
- Browser sample A: terrain anchor `-14.286`, hero z `0`, enemy z `22.547`, locomotion `stationary`.
- Browser sample B after 300 ms: terrain anchor `-14.286`, hero z `0`, enemy z `16.928`, locomotion `stationary`.
- Browser final capture: terrain stationary, hero z `0`, nearest enemy z `39.251` during a fresh run.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Implementation, verification, closeout |
| What is the goal? | Keep the Runner hero and terrain fixed while enemies approach and logical progression continues. |
| What have I learned? | See Findings. |
| What have I done? | See Timeline. |

Open risks:
- Production build retains the pre-existing large-chunk warning; unrelated to this change.
- Browser console/network inspection was unavailable through the claimed Browser binding, so verification relied on successful asset rendering, runtime attributes, screenshot, tests, and build.
