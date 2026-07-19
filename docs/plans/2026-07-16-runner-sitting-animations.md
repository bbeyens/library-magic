# runner-sitting-animations

Objective:
Intégrer Sitting.fbx pour la fille et Sitting Idle.fbx pour le garçon dans le menu Runner, avec animations légères, mapping vérifié, tests, build et preuve navigateur.

Goal plan:
docs/plans/2026-07-16-runner-sitting-animations.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request with local FBX files
- id / link: `/Users/zbeyens/Downloads/Sitting.fbx`, `/Users/zbeyens/Downloads/Sitting Idle.fbx`
- title: Poses assises FBX des héros Runner
- acceptance criteria: la fille utilise Sitting; le garçon utilise Sitting Idle; les deux animations sont visibles dans le menu; la course et les autres mini-jeux restent inchangés.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 75/100 before skeleton compatibility inspection
- improvement loop: inspect rigs, convert animation-only assets, integrate, test and visually prove both selections
- final score / loop closure: 98/100; both mapped poses and launch transition proved in runtime

Completion threshold:
- Both FBX sources are preserved as immutable intake or converted artifacts with recorded mapping.
- Girl menu model plays `Sitting`; boy menu model plays `Sitting Idle` without bind-pose corruption.
- Runner launch still transitions into gameplay, automated checks pass, and browser captures prove both poses.

Verification surface:
- FBX/GLB skeleton and clip inspection, focused Runner asset test, full tests, typecheck, build, `git diff --check`, and live Runner menu proof for boy and girl.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: explicit `RunnerSkinId -> sitting clip` mapping in the Runner 3D asset loader.
- Allowed edit scope: Runner hero animation assets, conversion script if needed, Runner renderer, focused tests, this plan.
- Browser surface: Runner menu and its existing launch transition.
- Tracker sync: N/A; direct local request.
- Non-goals: hero stats, gameplay animation, model replacement, enemy animation, other mini-games.

Current verdict:
- verdict: complete
- confidence: 98/100
- next owner: task
- reason: exact 43-bone compatibility, animation-only export, runtime mapping and visual proof all passed.

Pre-solution issue challenge:
- reporter claim: N/A; this is a feature request.
- suggested diagnosis or fix: use the supplied Sitting animation for girl and Sitting Idle for boy.
- repro ladder:
  - tests / source-level repro: inspect animation clips and exact bone compatibility before writing runtime code.
  - repo-owned automated browser or integration proof: focused asset/mapping test required.
  - Browser plugin: exercise both character selections in the Runner menu.
  - screenshot / visual proof: required for both sitting poses.
- reproduction verdict: N/A; feature request.
- validity verdict: valid request.
- best long-term fix boundary: compressed animation-only runtime assets plus one explicit skin mapping.
- harsh honest feedback: loading full FBX character meshes at runtime would duplicate geometry and waste memory; extract only the clips when possible.
- hard-stop decision: stop only if the supplied rigs are incompatible and cannot be retargeted reliably with local Blender tooling.

Blocked condition:
- Block only on incompatible/unretargetable skeletons, corrupt FBX files, or missing local conversion tooling after direct inspection.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-sitting-animations.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | exact FBX-to-skin mapping captured |
| Timed checkpoint parsed | N/A | no duration requested |
| Active goal checked or created | yes | active goal created |
| Source of truth read before edits | yes | renderer, both hero GLBs and both FBXs inspected in Blender 5.1 |
| Acceptance criteria captured | yes | Task source and threshold above |
| Pre-solution issue challenge required | N/A | feature request, not a bug claim |
| Reproduction verdict before implementation | N/A | feature request |
| Repro escalation ladder selected | yes | asset inspection, focused test, browser proof |
| Suggested fix reviewed against durable boundary | yes | animation-only assets preferred over full FBX runtime loading |
| TDD decision before behavior change or bug fix | yes | asset mapping/clip contract test before integration; visual deformation needs browser proof |
| Browser proof decision for browser surface | yes | both menu heroes must be captured |
| Browser pack selected | yes | browser pack materialized |
| Browser route / app surface identified | yes | local Runner menu |
| Browser tool decision recorded | yes | repo-approved in-app Browser plugin |

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
| Named verification threshold | yes | Run the named proof or record blocker | exact mapping, tests, build and runtime proof passed |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | feature request, no bug claim |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Blender inspection, red/green asset test and live menu proof |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature request; red test proved missing assets and mapping |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `runnerHeroSkin ok` |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | both sitting poses visible; girl selection and launch proved |
| Final lint/format | yes | Run relevant lint/format command or record N/A | no lint script; `git diff --check` passed |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | mapping exact; gameplay clip path unchanged; no other mini-game touched |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-sitting-animations.md` | ready for checker |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | opened Runner, observed both poses, selected girl, launched run, reset to menu |
| Browser console/network check | yes | Record console/network state or N/A | zero console errors/warnings; both GLBs visibly loaded without loader warnings |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | final menu screenshot with girl selected and both authored poses; deliverable tab kept open |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | exact skeleton/action inspection in Blender | implementation |
| Implementation | completed | source preservation, converter, GLBs and runtime mixers | verification |
| Verification | completed | targeted/full tests, typecheck, build and browser proof | closeout |
| Closeout | completed | audit and evidence recorded | final response |

Findings:
- User mapping is fixed: `girl -> Sitting.fbx`; `boy -> Sitting Idle.fbx`.
- Both FBXs and both shipping GLBs expose the same 43 named bones in the same order.
- `Sitting.fbx` contains one 389-frame action; `Sitting Idle.fbx` contains one 215-frame action.
- An armature-only Blender export preserves 132 animation channels in about 150 KB with no mesh or skin payload.

Decisions and tradeoffs:
- Prefer offline conversion to animation-only assets over shipping full FBX character meshes at runtime.
- Preserve sources under each existing `exports/runner-mixamo/<skin>/animations` package and ship only the compressed GLB clips under `public`.

Timeline:
- 2026-07-16T00:02:40.013Z: plan created.
- 2026-07-16: inspected both FBXs and shipping GLBs; all four use the same 43-bone skeleton.
- 2026-07-16: red asset test failed on missing boy sitting clip as expected.
- 2026-07-16: preserved FBX intakes and exported animation-only GLBs with 132 channels each.
- 2026-07-16: wired `boy -> RunnerBoySittingIdle` and `girl -> RunnerGirlSitting`; filtered three armature-object tracks.
- 2026-07-16: full tests, typecheck, build, whitespace check and live menu/launch proof passed.

Verification evidence:
- Sources: boy 831 KB / 215 frames; girl 1.1 MB / 389 frames; both 43 bones.
- Runtime assets: boy 108 KB, girl 211 KB, zero meshes, zero skins, one named clip and 132 channels each.
- Focused test: `npx tsx tests/runnerHeroSkin.test.ts` passed after the expected red phase.
- Regression: `npm test` passed every test file.
- Static/build: `npm run typecheck`, `npm run build`, and `git diff --check` passed.
- Browser: girl visibly cross-legged with `Sitting`; boy visibly seated hands-on-knees with `Sitting Idle`; selection ring moved to girl; Run transitioned to gameplay; zero warnings/errors.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Use the two supplied sitting animations on the correct Runner menu heroes |
| What have I learned? | See Findings |
| What have I done? | Integrated, proved and preserved both authored sitting animations |

Open risks:
- Residual risk is limited to future hero skeleton renames; the asset-backed test now fails if required targets disappear.
