# runner-esprits-lumineux

Objective:
Remplacer les orbes multishot du Runner par des esprits bleus lumineux, performants et lisibles, avec tests, build et preuve visuelle en jeu.

Goal plan:
docs/plans/2026-07-16-runner-esprits-lumineux.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request using `threejs-3d-generator`
- id / link: N/A: no tracker ticket supplied
- title: Runner luminous blue multishot spirits
- acceptance criteria: each multishot is represented by one visibly luminous blue spirit; the formation and gameplay count remain unchanged; rendering stays bounded and performant.

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
- initial confidence score: 92/100
- improvement loop: red contract test, procedural implementation, diagnostics, browser capture
- final score / loop closure: 97/100; second visual iteration accepted after correcting the overly white first pass.

Completion threshold:
- The runtime renders one spirit per multishot using a bright core, additive aura, halo, and tapered wisp.
- The effect uses at most four instanced draw calls for all five spirits.
- Focused tests, typecheck, build, and browser gameplay proof pass.

Verification surface:
- `npx tsx tests/runnerMultishotOrbs.test.ts`
- `npm run typecheck`
- `npm run build`
- Browser plugin on the live Runner route with non-zero multishot and screenshot.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/runnerThreeLane.ts`, `src/ui/runnerMultishotOrbs.ts`, and the focused renderer contract test.
- Allowed edit scope: Runner multishot spirit rendering, its deterministic helper/test, and this plan.
- Browser surface: Runner gameplay at `http://127.0.0.1:5173/`.
- Tracker sync: N/A: no ticket requested.
- Non-goals: no multishot balance, formation count, projectile behavior, hero, enemy, terrain, or other mini-game changes.

Current verdict:
- verdict: pass
- confidence: 97/100
- next owner: user acceptance
- reason: five blue light spirits render with distinct core, aura, elliptical halo, and visible wisp at four draw calls with no console errors.

Pre-solution issue challenge:
- reporter claim: current blue orbs are too plain and do not read as luminous light spirits.
- suggested diagnosis or fix: replace the two-layer sphere with a richer luminous spirit silhouette.
- repro ladder:
  - tests / source-level repro: current source has only one sphere geometry, a core, and one glow layer with two draw calls.
  - repo-owned automated browser or integration proof: focused renderer contract and all Runner tests pass.
  - Browser plugin: live Runner launched with multishot level 5; runtime reports count 5, draw calls 4, style `light-spirit`.
  - screenshot / visual proof: second gameplay capture accepted after palette and silhouette correction.
- reproduction verdict: valid visual improvement request; browser proof required after implementation.
- validity verdict: valid.
- best long-term fix boundary: procedural instanced VFX in the existing renderer.
- harsh honest feedback: a Tripo-generated GLB would be heavier and worse for a repeated abstract glow effect; the skill's integration guidance explicitly favors procedural instancing here.
- hard-stop decision: proceed procedurally; Tripo probe reported `TRIPO_API_KEY=MISSING`, but no provider generation is needed.

Blocked condition:
- Block only if the Runner cannot load or a non-zero multishot state cannot be reached for visual proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-esprits-lumineux.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Better blue orb; luminous light-spirit appearance. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created for this task. |
| Source of truth read before edits | yes | Existing two-layer instanced sphere renderer and test inspected. |
| Acceptance criteria captured | yes | Listed above. |
| Pre-solution issue challenge required | N/A | Feature/polish request, not a bug report. |
| Reproduction verdict before implementation | yes | Existing effect confirmed as core plus glow spheres only. |
| Repro escalation ladder selected | yes | Focused contract test, build diagnostics, Browser screenshot. |
| Suggested fix reviewed against durable boundary | yes | Procedural instancing is the correct high-volume VFX boundary. |
| TDD decision before behavior change or bug fix | yes | Update focused renderer contract before implementation. |
| Browser proof decision for browser surface | yes | Required for luminous visual acceptance. |
| Browser pack selected | yes | Browser pack materialized. |
| Browser route / app surface identified | yes | Runner gameplay on localhost:5173. |
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
| Named verification threshold | yes | Run the named proof or record blocker | PASS: four spirit layers, four draw calls, tests/build/browser proof pass. |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Visual polish request, not a public bug diagnosis. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source inspection, focused test, runtime diagnostics, two visual passes. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Feature request; red test established the new four-layer contract. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | PASS: all `tests/runner*.test.ts`. |
| TypeScript or typed config changed | yes | Run relevant typecheck | PASS: `npm run typecheck`. |
| Build-sensitive behavior changed | yes | Run relevant build/check | PASS: `npm run build`, 40 modules transformed. |
| Browser surface changed | yes | Capture browser proof | PASS: level-5 gameplay screenshot and runtime diagnostics. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint script; `git diff --check` passes. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | PASS: renderer/test/plan only; gameplay count and formation unchanged. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-16-runner-esprits-lumineux.md` | PASS: completion checker run after closure. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Runner opened, debug coins added, multishot raised to 5, Run launched. |
| Browser console/network check | yes | Record console/network state or N/A | `tab.dev.logs` returned no warnings or errors. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Final capture shows five blue-tailed spirits behind the fox. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | generator integration guidance and current renderer inspected | implementation |
| Implementation | completed | four-layer instanced light-spirit effect | verification |
| Verification | completed | Runner tests, typecheck, build, browser metrics and screenshot | closeout |
| Closeout | completed | autoreview and goal checker | final response |

Findings:
- The existing effect used only two instanced sphere layers and read as a plain orb.
- The first four-layer pass was too white and ring-like; saturated blue materials, an elliptical halo, and a vertical tapered wisp fixed the silhouette.
- Tripo is unavailable (`TRIPO_API_KEY=MISSING`) and unnecessary: the skill guidance prefers procedural instancing for repeated lightweight details.

Decisions and tradeoffs:
- Use four instanced meshes rather than one generated GLB per spirit.
- Keep the existing formation and multishot count untouched.
- Use unlit/additive materials for consistent luminosity without per-orb lights.

Timeline:
- 2026-07-16T17:27:29.595Z: plan created.
- Added red renderer contract for core, glow, halo, wisp, and four draw calls.
- Implemented the four-layer instanced spirit and pulse animation.
- Corrected the first visual pass toward saturated blue and a flame-like silhouette.
- Verified level-5 gameplay and completed automated checks.

Verification evidence:
- All Runner tests: PASS.
- `npm run typecheck`: PASS.
- `npm run build`: PASS; existing large-chunk warning only.
- Browser runtime: count `5`, draw calls `4`, style `light-spirit`.
- Browser logs: no warnings or errors.
- Final screenshot: five luminous blue spirits with visible downward wisps.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Implementation, verification, closeout |
| What is the goal? | Replace plain multishot spheres with performant luminous blue light spirits. |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- At the current distant gameplay camera the spirits remain intentionally compact; future camera/hero scale changes may require proportional resizing.
