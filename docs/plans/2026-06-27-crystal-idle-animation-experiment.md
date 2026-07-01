# crystal idle animation experiment

Objective:
Creer un essai idle pixel-art non branche pour le cristal; done when spritesheet, metadata, GIF preview, and source audit exist.

Goal plan:
docs/plans/2026-06-27-crystal-idle-animation-experiment.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: direct user request
- id / link: N/A
- title: "sans rien implementer, essaie de faire un pixel art en te basant sur ce crystal avec une idle animation"
- acceptance criteria: create preview-only idle animation assets based on `public/assets/Crystal/Crystal.png`, with no game integration or source-code changes.

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
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Create a preview-only idle spritesheet under `public/assets/Crystal/idle-experiment/`.
- Create metadata JSON describing frames and animation timing.
- Create an animated GIF preview.
- Verify no `src/` files changed for this request.

Verification surface:
- File existence and image dimensions for generated assets.
- Visual inspection of generated spritesheet/GIF.
- `git status --short -- src public/assets/Crystal/idle-experiment`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `public/assets/Crystal/Crystal.png` and `Crystal.json`.
- Allowed edit scope: new files under `public/assets/Crystal/idle-experiment/` and this plan.
- Browser surface: N/A; preview asset only.
- Tracker sync: N/A.
- Non-goals: wiring into HUD/game, editing `src/`, replacing current active crystal, creating a new generated identity from scratch.

Current verdict:
- verdict: valid
- confidence: 88/100
- next owner: task
- reason: existing crystal is a clean 128x128 pixel-art PNG; deterministic frame transforms can make a credible idle without implementation.

Pre-solution issue challenge:
- reporter claim: make a pixel-art idle animation based on the current crystal, without implementing it.
- suggested diagnosis or fix: create preview-only derived sprite assets, not app integration.
- repro ladder:
  - tests / source-level repro: asset dimensions and file existence.
  - repo-owned automated browser or integration proof: N/A preview-only.
  - Browser plugin: N/A preview-only.
  - screenshot / visual proof: local image/GIF preview.
- reproduction verdict: N/A: creative asset request.
- validity verdict: valid.
- best long-term fix boundary: write preview assets only.
- harsh honest feedback: implementing this immediately would ignore the user's first four words.
- hard-stop decision: proceed with preview asset generation only.

Blocked condition:
- Stop only if PNG read/write or GIF generation tooling cannot preserve transparency enough for a usable preview.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-crystal-idle-animation-experiment.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User asked for no implementation, pixel art based on current crystal, with idle animation. |
| Timed checkpoint parsed | N/A: no duration requested | Direct preview asset generation. |
| Active goal checked or created | yes | `get_goal` returned none; active goal created. |
| Source of truth read before edits | yes | Spriterrific skill read; `Crystal.png` is `128x128` RGBA. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | yes | Creative request, not a bug; boundary is preview assets only. |
| Reproduction verdict before implementation | N/A: creative asset request | No repro needed. |
| Repro escalation ladder selected | N/A: preview asset request | File and visual proof is enough. |
| Suggested fix reviewed against durable boundary | yes | Generate preview assets only, no `src/` edits. |
| TDD decision before behavior change or bug fix | N/A: generated asset preview | No app behavior change. |
| Browser proof decision for browser surface | N/A: no browser surface changed | Preview-only assets. |

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

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Created `frames/frame-01.png` through `frame-08.png`, `idle-spritesheet.png`, `idle-animation.json`, and `idle-preview.gif` under `public/assets/Crystal/idle-experiment/`. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above. |
| Repro escalation ladder | N/A: creative preview asset request | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | File and visual proof only. |
| Bug reproduced before fix | N/A: not a bug | Record failing test/repro or N/A with reason | Creative asset request. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `sips` shows spritesheet `1024x128`, runtime frame `128x128`, GIF preview `512x512`; visual inspection passed for a clean low-res crystal idle experiment. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: no typed files touched. |
| Build-sensitive behavior changed | no | Run relevant build/check | N/A: preview-only public assets, no app integration. |
| Browser surface changed | no | Capture browser proof | N/A: no browser surface changed. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: generated binary/JSON assets only. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Output is preview-only, based on `Crystal.png`, and no game runtime files were edited for this request. `src/style.css` is already dirty from earlier work and was not modified by this task. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-crystal-idle-animation-experiment.md` | First check found missing closeout evidence; plan updated and check rerun. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan; read source crystal | implementation |
| Implementation | complete | generated preview-only idle assets in `public/assets/Crystal/idle-experiment/` | verification |
| Verification | complete | file list, `sips` dimensions, visual inspection, source audit | closeout |
| Closeout | complete | first autogoal check reported missing closeout evidence; plan updated for final rerun | final response |

Findings:
- Source crystal is `128x128` RGBA and already pixel-art styled.
- `ffmpeg` is available for GIF generation.
- Generated runtime frames are transparent `128x128` PNGs.
- Generated preview frames and GIF are scaled to `512x512` on a dark background for easier inspection.

Decisions and tradeoffs:
- Use deterministic transforms instead of AI regeneration: preserves the exact crystal identity and avoids implementing anything.
- Idle motion: subtle vertical bob, internal brightness pulse, tiny diagonal glint, and shadow flicker.
- Keep the output unhooked: no `src/` edits for this request.

Timeline:
- 2026-06-27T21:40:53.986Z: plan created.
- 2026-06-27: read Spriterrific workflow and confirmed source crystal dimensions/tooling.
- 2026-06-27: generated preview-only idle sprite assets and GIF.
- 2026-06-27: verified dimensions and inspected the spritesheet/preview frame.

Verification evidence:
- `find public/assets/Crystal/idle-experiment -maxdepth 2 -type f -print | sort` listed README, 8 runtime frames, 8 preview frames, metadata JSON, spritesheet, and GIF.
- `sips -g pixelWidth -g pixelHeight public/assets/Crystal/idle-experiment/idle-spritesheet.png public/assets/Crystal/idle-experiment/frames/frame-01.png public/assets/Crystal/idle-experiment/idle-preview.gif` returned `1024x128`, `128x128`, and `512x512`.
- Visual inspection of `idle-spritesheet.png` and `preview-frames/frame-04.png` shows a readable pixel-art crystal with subtle idle changes.
- `git status --short -- src public/assets/Crystal/idle-experiment docs/plans/2026-06-27-crystal-idle-animation-experiment.md` shows new experiment assets and this plan. Existing `M src/style.css` was already dirty before this request; this task did not edit `src/`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Autogoal check, then final response |
| What is the goal? | Generate a preview-only idle animation based on the supplied crystal, without implementation. |
| What have I learned? | Source is a single 128x128 pixel-art PNG; deterministic animation is appropriate. |
| What have I done? | Created preview-only idle sprite assets, metadata, GIF, and verification evidence. |

Open risks:
- Deterministic transforms can feel less rich than hand-drawn animation; this is an experiment, not final art direction.
