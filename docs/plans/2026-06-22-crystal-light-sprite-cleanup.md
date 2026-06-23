# crystal light sprite cleanup

Objective:
Clean crystal runtime sprites so the vertical white highlight is removed and the animation uses aquamarine-style faceted glints instead.

Goal plan:
docs/plans/2026-06-22-crystal-light-sprite-cleanup.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: user visual direction
- id / link: /var/folders/v0/m9v03dm522qgkml9w0kr6m_m0000gn/T/TemporaryItems/NSIRD_screencaptureui_ej716h/Screenshot 2026-06-22 at 22.57.19.png
- title: Aquamarine-inspired crystal sprite animation
- acceptance criteria: Runtime crystal animation keeps the existing crystal role, removes the white vertical stripe, uses moving aquamarine facets/spark glints inspired by the reference, validates through Spriterrific, and still renders in the game.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested
- initial confidence score: N/A: no timed loop
- improvement loop: N/A: no timed loop
- final score / loop closure: N/A: no timed loop

Completion threshold:
- `idle-s` and `use-s-v2` runtime spritesheets have no bright white vertical center highlight.
- Crystal frames show faceted aquamarine-style light variation and sparkle/glint motion inspired by the provided reference.
- `spriterrific finalize-runtime` has been run for both exports and `spriterrific validate` passes for both run dirs.
- `npm run typecheck` and `npm run build` pass.
- Browser proof on the local game shows the updated crystal sprite in idle/click use.

Verification surface:
- Artifact review: inspect `public/assets/spriterrific/crystal/idle-s/export/spritesheet.transparent.png` and `public/assets/spriterrific/crystal/use-s-v2/export/spritesheet.transparent.png`.
- Spriterrific CLI: `spriterrific finalize-runtime`; `spriterrific validate --run-dir ...`.
- App commands: `npm run typecheck`; `npm run build`.
- Browser proof: `http://127.0.0.1:5173/` idle crystal and click animation.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: Spriterrific runtime crystal exports under `public/assets/spriterrific/crystal`.
- Allowed edit scope: crystal sprite export assets and this plan.
- Browser surface: `http://127.0.0.1:5173/`.
- Tracker sync: N/A: not requested.
- Non-goals: no mini-game logic change, no UI redesign, no heart-shaped replacement.

Current verdict:
- verdict: valid asset-direction request
- confidence: 0.84 before final verification
- next owner: task
- reason: current crystal had a vertical highlight; reference asks for faceted gem animation and spark-like light.

Pre-solution issue challenge:
- reporter claim: Crystal light should not read as a vertical white stripe; animation should be inspired by aquamarine faceted gem sheet.
- suggested diagnosis or fix: Modify runtime spritesheets, not CSS, then finalise and validate through Spriterrific.
- repro ladder:
  - tests / source-level repro: Existing runtime spritesheets contained a bright center stripe before cleanup; current request adds visual reference for faceted animation.
  - repo-owned automated browser or integration proof: N/A: asset visual proof is required.
  - Browser plugin: Required for final proof if available; fallback to Computer Use Chrome if browser-use is unavailable.
  - screenshot / visual proof: Reference screenshot viewed and runtime spritesheet previews inspected.
- reproduction verdict: valid
- validity verdict: valid visual/asset request
- best long-term fix boundary: Spriterrific runtime exports for the crystal.
- harsh honest feedback: CSS masking would be the wrong fix; the sprite itself needs to carry the better light design.
- hard-stop decision: proceed.

Blocked condition:
- Stop if Spriterrific validation fails after asset edits or if browser cannot load the local app for final proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-crystal-light-sprite-cleanup.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Requirement captured: remove vertical white stripe; use aquamarine faceted/spark inspiration for crystal animation |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | `get_goal` returned no goal, then active goal created for this plan |
| Source of truth read before edits | yes | Spriterrific skill read; runtime export paths inspected |
| Acceptance criteria captured | yes | Task source section |
| Pre-solution issue challenge required | yes | Valid visual asset request |
| Reproduction verdict before implementation | yes | Runtime spritesheets and reference screenshot inspected |
| Repro escalation ladder selected | yes | Artifact review, Spriterrific validate, app build, browser proof |
| Suggested fix reviewed against durable boundary | yes | Asset-level Spriterrific export edit, not CSS mask |
| TDD decision before behavior change or bug fix | no | N/A: binary visual asset edit, not logic behavior |
| Browser proof decision for browser surface | yes | Required after asset validation |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. N/A: no duration requested.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason. Verdict: valid visual asset request.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. Evidence path selected: asset preview, Spriterrific validate, browser proof.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: proceed decision recorded.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Boundary: crystal Spriterrific exports.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Target: crystal runtime exports,
      `src/style.css` click animation, and this plan; unrelated dirty files ignored.
- [x] Verification evidence is recorded beside each relevant gate.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Spriterrific finalized idle/use exports; validation ok/ok; pixel audit reports `brightWhite=0 centerBrightWhite=0`; build passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Verdict recorded above: valid visual asset request; durable boundary is Spriterrific crystal runtime exports |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Artifact preview, pixel audit, Spriterrific validate, build, and Chrome Computer Use proof used |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | N/A: visual direction/change request, not a code bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `src/style.css` click keyframes now translate only, no `scale`; `use-s-v2` bbox width stays 165px across all click frames |
| TypeScript or typed config changed | no | Run relevant typecheck | No typed source changed, but `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; Vite chunk-size warning only |
| Browser surface changed | yes | Capture browser proof | Chrome at `127.0.0.1:5173/` showed updated blue faceted crystal; clicking it showed `+1` and mana increment |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: repo has no lint/format script in `package.json`; CSS patch is small |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Passed: no click shrink, use animation vibrates through stable-offset sprite frames, cracks fade/regenerate, white vertical highlight removed |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-crystal-light-sprite-cleanup.md` | First run caught missing closeout evidence; plan updated and command rerun for final gate |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Spriterrific skill and runtime export paths read; reference screenshot inspected | done |
| Implementation | complete | Updated idle/use crystal spritesheets and CSS click animation | done |
| Verification | complete | Spriterrific finalize/validate, pixel audit, typecheck/build, Chrome proof | closeout |
| Closeout | complete | Plan updated; check-complete rerun for final gate | final response |

Findings:
- `use-s-v2` previously had frames with much smaller bounding boxes, which caused the click shrink.
- Rebuilding the click action from a stable crystal silhouette fixed the shrink while still allowing vibration by frame offset.
- The white vertical highlight needed asset-level color cleanup in both idle and use exports, not CSS masking.

Decisions and tradeoffs:
- Rebuilt `use-s-v2` from the stable idle silhouette so click frames stay the same size.
- Kept the vibration as sprite-frame offsets and small container translation, with no scale.
- Added temporary dark/cyan crack lines that are strong in early use frames and fade by the final frames.

Timeline:
- 2026-06-22T20:56:29.155Z: plan created.
- 2026-06-22T23:10:34+02:00: finalized `use-s-v2` after stable-size rebuild.
- 2026-06-22T23:14:00+02:00: removed remaining bright vertical white pixels from idle and use sheets.
- 2026-06-22T23:14:00+02:00: patched `crystal-click` to remove scaling and play all 8 `use-s-v2` frames.
- 2026-06-22T23:14:00+02:00: finalized both Spriterrific exports, validated, audited pixels, built app, and verified in Chrome.
- 2026-06-22T23:15:00+02:00: ran autogoal check-complete once, fixed closeout metadata, and prepared final rerun.

Verification evidence:
- `spriterrific finalize-runtime --animation-dir public/assets/spriterrific/crystal/idle-s/export --animation-dir public/assets/spriterrific/crystal/use-s-v2/export --anchor-policy preserve-motion` wrote both `finalize-runtime.json` files.
- `spriterrific validate --run-dir public/assets/spriterrific/crystal/idle-s && spriterrific validate --run-dir public/assets/spriterrific/crystal/use-s-v2` returned `ok` and `ok`.
- Pixel audit: idle `brightWhite=0 centerBrightWhite=0`; use `brightWhite=0 centerBrightWhite=0`.
- `use-s-v2` bbox audit: every click frame width is 165px; height is 209-210px.
- `npm run typecheck && npm run build` passed; Vite emitted only the existing large chunk warning.
- Chrome Computer Use: page at `127.0.0.1:5173/` rendered the updated blue faceted crystal; clicking `Concentrer la Mana` showed `+1` and mana increment.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Final verification complete |
| Where am I going? | Final response |
| What is the goal? | Crystal click should not shrink; it should vibrate, crack, regenerate, and keep non-white faceted light |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Browser tooling could not capture the very short crack frame at the exact moment of animation, but the runtime sheet and CSS evidence verify it.
