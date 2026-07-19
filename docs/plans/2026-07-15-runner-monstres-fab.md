# runner-monstres-fab

Objective:
Exporter cinq monstres Polyart du pack Unreal vers des GLB animés et les utiliser uniquement comme ennemis du runner, avec tests, build et preuve navigateur sans régression des autres mini-jeux.

Goal plan:
docs/plans/2026-07-15-runner-monstres-fab.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A: no tracker ticket requested
- title: Utiliser les monstres Fab dans le mini-jeu runner
- acceptance criteria: cinq monstres du pack apparaissent comme variantes animées dans le runner; gameplay inchangé; autres mini-jeux non modifiés; fallback visible si chargement impossible.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: no duration requested
- initial confidence score: 82/100 because Unreal-to-web export must be proven
- improvement loop: export, inspect GLB, integrate, test, browser-proof, repair if needed
- final score / loop closure: 100/100 after asset inspection, full tests, build and browser proof

Completion threshold:
- Five distinct Polyart enemies from `MonsterForSurvivalGame` ship under `public/assets/runner/` as browser-readable GLB assets.
- Runner assigns variants deterministically and plays an embedded locomotion/idle animation when available.
- Existing runner simulation, collisions, labels and fallback behavior remain intact.
- Focused runner tests, typecheck, production build and browser runner proof pass.
- No source outside runner-owned files, focused tests, generated assets and this plan is intentionally changed.

Verification surface:
- Focused asset/integration test replacing `tests/runnerMushroomAsset.test.ts` expectations.
- Existing `tests/runnerRules.test.ts`.
- `npm run typecheck`, `npm run build`, `git diff --check`.
- Browser plugin proof at `http://127.0.0.1:5173/`: start runner, confirm multiple animated monster variants render and inspect console errors.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `/Users/zbeyens/Documents/Unreal Projects/libraryUnreal/Content/MonsterForSurvivalGame` for imported assets; `src/ui/runnerThreeLane.ts` for rendering.
- Allowed edit scope: `src/ui/runnerThreeLane.ts`, runner-focused tests, `public/assets/runner/`, optional reproducible export script, and this plan.
- Browser surface: runner mini-game in the Library Magic overlay at `http://127.0.0.1:5173/`.
- Tracker sync: N/A: no issue or PR requested.
- Non-goals: changing runner simulation/economy/collision rules, redesigning runner UI, touching mining/TD/crystal/other mini-games, modifying the Unreal source pack.

Current verdict:
- verdict: valid feature request; imported pack is available but requires conversion from `.uasset`
- confidence: 82/100
- next owner: task
- reason: Unreal content includes Polyart skeletal meshes and animations; browser runtime needs GLB conversion and Three.js animation support.

Pre-solution issue challenge:
- reporter claim: imported Fab monsters should now be usable in the runner.
- suggested diagnosis or fix: use imported assets directly.
- repro ladder:
  - tests / source-level repro: source audit confirms `.uasset` assets cannot be loaded by current `GLTFLoader`.
  - repo-owned automated browser or integration proof: focused runner asset test will validate shipped GLBs and loader contract.
  - Browser plugin: required after integration.
  - screenshot / visual proof: required to confirm orientation, scale and animation.
- reproduction verdict: valid conversion gap.
- validity verdict: partially valid: assets are present but not browser-readable until exported.
- best long-term fix boundary: export compact GLBs once, then own loading and animation inside the runner renderer.
- harsh honest feedback: copying `.uasset` files into `public/` would not work; Three.js cannot parse Unreal packages.
- hard-stop decision: proceed with conversion; stop only if Unreal cannot export the meshes/animations or licensing metadata blocks derivative runtime assets.

Blocked condition:
- Unreal headless export fails repeatedly, required mesh/animation assets are corrupt or unavailable, or the pack cannot legally be redistributed inside the game.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-15-runner-monstres-fab.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User asked to use newly imported monsters in runner; scope and non-goals recorded above. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created for export, integration and proof. |
| Source of truth read before edits | yes | Unreal content tree and existing runner renderer inspected. |
| Acceptance criteria captured | yes | Five animated variants, runner-only scope, unchanged gameplay, tests/build/browser proof. |
| Pre-solution issue challenge required | yes | Direct `.uasset` use rejected; conversion gap recorded. |
| Reproduction verdict before implementation | yes | `.uasset` source exists; current loader only accepts GLB. |
| Repro escalation ladder selected | yes | Source/test first, then browser visual proof. |
| Suggested fix reviewed against durable boundary | yes | Convert assets once and keep runtime ownership in runner renderer. |
| TDD decision before behavior change or bug fix | yes | Update focused asset contract test before loader change; gameplay rules unchanged. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Browser pack materialized in this plan. |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, runner overlay and live run. |
| Browser tool decision recorded | yes | Use repo-approved in-app Browser plugin. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Full `npm test`, focused runner tests, typecheck, build and browser proof passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit, focused tests and live runner screenshots all passed. |
| Bug reproduced before fix | N/A | Feature request; conversion gap confirmed by source audit | `.uasset` sources vs GLTFLoader contract |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerMonsterAsset ok`; `runnerRules ok`. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; only the existing Vite bundle-size warning remains. |
| Browser surface changed | yes | Capture browser proof | In-app Browser runner playthrough rendered Chest Monster and other colored variants at about 96 FPS. |
| Final lint/format | yes | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Final scoped diff reviewed; renderer owns loading/animation and simulation behavior remains unchanged. |
| Timed checkpoint | N/A | No duration requested | N/A |
| Goal plan complete | yes | Run global autogoal checker because the repo-local checker is absent | Global checker passed after final evidence update. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened Galerie des Cibles, clicked Commencer/Relancer and played through a run to 73 m. |
| Browser console/network check | yes | Record console/network state or N/A | Vite connected; no runner asset, GLTF, texture or runtime errors in captured logs. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Live screenshots captured at `http://127.0.0.1:5173/`, including multiple enemy variants. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Unreal source and existing renderer audited | implementation |
| Implementation | complete | five GLBs, shared texture, exporter and animated Three.js loader | verification |
| Verification | complete | full tests, focused tests, typecheck, build, diff check and browser playthrough passed | closeout |
| Closeout | complete | plan evidence recorded and global checker passed | final response |

Findings:
- Imported source contains nine Polyart skeletal meshes and extensive per-character animation assets.
- Current runner loads one static mushroom GLB, clones mesh-only templates and simulates motion with squash/wobble.
- Browser runtime cannot consume Unreal `.uasset` packages directly.

Decisions and tradeoffs:
- Use five diverse Polyart enemies for visual variety and lower runtime cost.
- Export embedded run/locomotion animation per GLB and play it with `AnimationMixer`; retain squash fallback only when a clip is absent.
- Keep deterministic enemy-id variant assignment and simulation-owned collision behavior.

Timeline:
- 2026-07-15T15:08:37.790Z: plan created.
- 2026-07-15: requirements captured; Unreal source and runner ownership boundary audited.

Verification evidence:
- Unreal commandlet exported five browser-readable GLBs with one mesh, one skin and one animation each.
- `npm test`: all 35 project test files passed.
- `npx tsx tests/runnerMonsterAsset.test.ts`: passed.
- `npx tsx tests/runnerRules.test.ts`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with only the existing large-chunk warning.
- `git diff --check`: passed.
- In-app Browser: runner playthrough reached 73 m, rendered multiple colored Fab variants, and produced no runtime/asset errors.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final checker and user handoff |
| What is the goal? | Ship five animated Polyart runner enemies with focused and browser proof. |
| What have I learned? | Unreal animation assets export cleanly as skinned GLBs; the pack material needs the separately exported shared base-color atlas. |
| What have I done? | Exported five variants, integrated deterministic animated loading, preserved fallback/gameplay, and passed all automated and browser checks. |

Open risks:
- The production bundle still emits the pre-existing Vite large-chunk warning; the five monster GLBs are fetched as external assets and do not add to that JavaScript chunk.
