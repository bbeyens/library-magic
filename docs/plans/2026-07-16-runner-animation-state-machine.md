# runner-animation-state-machine

Objective:
Intégrer les cinq FBX du Runner avec transitions de sélection, course standard, blessure de 2 s et mort, puis prouver les états par tests, build et navigateur.

Goal plan:
docs/plans/2026-07-16-runner-animation-state-machine.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A: no external ticket
- title: Runner hero animation state machine
- acceptance criteria: the selected hero rises with Sit To Stand; the previous hero sits with Stand To Sit; Standard Run drives normal play and launch; Injured Run lasts exactly 2 seconds after enemy contact; Fall Flat plays on death.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: 2 seconds for the injured animation only; no requested work-duration checkpoint
- semantics: gameplay timing contract, not a minimum agent work duration
- initial confidence score: 86/100
- improvement loop: validate skeleton compatibility, add deterministic transition tests, then verify the rendered states in the browser
- final score / loop closure: 98/100 after full tests, typecheck, build, and browser proof of all five states

Completion threshold:
- Five immutable source FBXs are preserved under `exports/runner-mixamo/` and five animation-only GLBs ship under `public/assets/runner/heroes/`.
- Menu selection plays Sit To Stand for the newly selected skin and Stand To Sit for the previous skin.
- Gameplay starts and continues with Standard Run, switches to Injured Run for `[0, 2000)` ms after enemy contact, then returns to Standard Run.
- Death overrides all other states with a clamped Fall Flat one-shot.
- Focused tests, full tests, typecheck, build, browser interaction proof, and browser console check pass.

Verification surface:
- `tests/runnerHeroAnimation.test.ts`, `tests/runnerRules.test.ts`, `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`, and in-app Browser proof at `http://127.0.0.1:5178/`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `RunnerRunState` and runner collision rules own hit/death signals; `runnerThreeLane.ts` owns rendered animation transitions; the five user FBXs own motion data.
- Allowed edit scope: runner state/rules, Runner Three.js renderer, focused tests, deterministic export script, runner animation assets and source intake.
- Browser surface: Runner menu character selection, Run launch, gameplay hit feedback, and death presentation.
- Tracker sync: N/A: direct request with no tracker item.
- Non-goals: no stat changes, no model/texture replacement, no enemy animation changes, no unrelated mini-game changes, no commit/push.

Current verdict:
- verdict: valid feature request
- confidence: 98/100
- next owner: user visual review
- reason: every requested state is implemented and passed deterministic plus rendered proof

Pre-solution issue challenge:
- reporter claim: the five named motions should drive the corresponding Runner states.
- suggested diagnosis or fix: importing each FBX directly into every hero instance would duplicate meshes and make state timing implicit.
- repro ladder:
  - tests / source-level repro: existing renderer only supports sitting menu clips and its base gameplay clip; no explicit hero-hit timestamp exists.
  - repo-owned automated browser or integration proof: focused deterministic tests will cover timing and assets.
  - Browser plugin: required for final visual state proof.
  - screenshot / visual proof: required for menu selection and gameplay animation framing.
- reproduction verdict: valid missing feature, reproduced in source.
- validity verdict: valid.
- best long-term fix boundary: explicit runner animation state selection plus animation-only GLBs shared by both compatible rigs.
- harsh honest feedback: driving the injured animation from unit-count changes would be wrong because gates can also change units.
- hard-stop decision: proceed; the source skeletons and runtime events are locally inspectable.

Blocked condition:
- Block only if a supplied FBX does not match the 43-bone shipping hero rig, Blender cannot export a valid animation-only GLB, or the real Runner route cannot be opened for browser proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-animation-state-machine.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Five named FBX mappings and exact 2-second duration copied above |
| Timed checkpoint parsed | yes | 2 seconds is gameplay duration; no work timer requested |
| Active goal checked or created | yes | active goal `019f41dc-55e9-7191-b974-050bf461d370` |
| Source of truth read before edits | yes | `RunnerRunState`, runner collision code, and renderer animation ownership inspected |
| Acceptance criteria captured | yes | Task source and completion threshold above |
| Pre-solution issue challenge required | yes | Feature gap challenged against current renderer and state |
| Reproduction verdict before implementation | yes | valid missing feature reproduced in source |
| Repro escalation ladder selected | yes | focused tests, full suite, browser interaction, screenshot |
| Suggested fix reviewed against durable boundary | yes | explicit state signal and animation-only asset layer |
| TDD decision before behavior change or bug fix | yes | write focused failing animation/timing tests first |
| Browser proof decision for browser surface | yes | required after implementation |
| Browser pack selected | yes | browser pack materialized in this plan |
| Browser route / app surface identified | yes | localhost Runner menu and active run |
| Browser tool decision recorded | yes | in-app Browser through `mcp__node_repl__js` |

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
| Named verification threshold | yes | Run the named proof or record blocker | Five assets plus all five states verified; full suite green |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid missing feature; explicit state signal and shared animation asset boundary used |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Red tests, full tests, in-app Browser, and screenshots completed |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Initial tests failed on missing module and missing `lastDamageAt` |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerHeroAnimation`, `runnerRules`, `runnerHeroSkin`, and `runnerMenuScene` pass |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; only pre-existing chunk-size warning |
| Browser surface changed | yes | Capture browser proof | Menu switch, Standard Run, Injured Run, recovery, and flat death captured at 5178 |
| Final lint/format | yes | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passed |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Confirmed animation priority, 2-second boundary, asset reuse, and no unrelated mini-game edits in task scope |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | 2 seconds is a gameplay requirement, verified at 1999/2000 ms and in browser |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-animation-state-machine.md` | Final checker command recorded below |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Real Runner route exercised through selection, Run, hit, recovery, and death |
| Browser console/network check | yes | Record console/network state or N/A | No error/warning logs; local static asset network inspection N/A, successful renders prove GLB loads |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Final screenshots captured for switch, standard run, injured run, and flat death |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | Five FBXs validated against exact 43-bone rig | implementation |
| Implementation | completed | Export pipeline, runtime clips, state signals, and transitions added | verification |
| Verification | completed | Full tests, typecheck, build, diff check, and browser proof passed | closeout |
| Closeout | completed | Autoreview complete and final plan checker next | final response |

Findings:
- The current runtime loads sitting clips only; gameplay uses the base hero GLB clip.
- Enemy contact is the correct injured trigger; unit count alone is ambiguous because gates also modify it.
- All five FBXs match the shipping 43-bone rig exactly and export to 132-channel animation-only GLBs.
- The HUD can recreate the Three.js canvas during skin selection, so selection transitions must survive at module scope.
- Fall Flat needs its armature-level X rotation retained and retargeted; the other clips must filter their global armature motion.

Decisions and tradeoffs:
- Preserve each source FBX and export armature-only GLBs so both compatible hero meshes reuse the motion without duplicated geometry.
- Use a deterministic state selector with priority `death > injured > standard run`.

Timeline:
- 2026-07-16T00:35:39.412Z: plan created.
- 2026-07-16: explicit requirements, boundaries, TDD decision, and browser proof path captured.
- 2026-07-16: five source FBXs preserved and exported through Blender 5.1.2.
- 2026-07-16: state machine, menu transitions, gameplay actions, and focused tests implemented.
- 2026-07-16: browser proof corrected two visual-only defects: lost menu transition state and filtered Fall Flat root rotation.
- 2026-07-16: full tests, typecheck, build, and diff check passed.

Verification evidence:
- `npm test`: all 39 test files pass, including `runnerHeroAnimation ok` and `runnerRules ok`.
- `npm run typecheck`: passed.
- `npm run build`: passed with Vite 7.3.5; pre-existing bundle-size advisory only.
- `git diff --check`: passed.
- Browser at `http://127.0.0.1:5178/`: `sitToStand`, `standToSit`, `standardRun`, `injuredRun`, recovery to `standardRun`, and `fallFlat` visibly proved.
- Browser diagnostics: no error or warning entries; context-loss messages are info logs caused by repeated proof-page reloads.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Integrate five Runner animations with correct selection, hit, run, and death transitions |
| What have I learned? | See Findings |
| What have I done? | Implemented and proved the complete five-animation state machine |

Open risks:
- Residual risk is limited to subjective animation taste; technical skeleton, timing, transition, and rendering contracts are proved.
