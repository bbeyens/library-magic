# lower crystal effective pixels

Objective:
Reduire la resolution effective du cristal; done when active idle/use sheets keep 256px frames but render from 128px effective pixels, build and browser proof pass.

Goal plan:
docs/plans/2026-06-27-lower-crystal-effective-pixels.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: "meme taille visible, moins de pixels"
- acceptance criteria: the crystal keeps the same on-screen/UI size, but the active sprite frames have lower effective pixel resolution, roughly half in each axis.

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
- initial confidence score: N/A: numeric pixel target exists
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- The active idle and use spritesheets remain `1280x512` overall with `256x256` runtime frames.
- Each `256x256` runtime frame is reduced to `128x128` effective source pixels and re-expanded with nearest-neighbor, so the visible crystal size is unchanged while detail resolution is halved per axis.
- Browser rendering preserves the chunky pixels instead of smoothing them.

Verification surface:
- PNG dimension audit with `sips`.
- Effective-resolution script/report proving `256 -> 128 -> 256` processing for the two active spritesheets.
- `npm run build`.
- Browser proof loading the active public asset URLs.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `.mana-sprite` CSS URLs and `public/assets/spriterrific/crystal/relic-idle-s/export/spritesheet.png`, `public/assets/spriterrific/crystal/relic-use-s/export/spritesheet.png`.
- Allowed edit scope: those active crystal export assets, their generated runtime preview/finalize metadata, `.mana-sprite` rendering mode, and this plan.
- Browser surface: the public URLs consumed by the HUD CSS.
- Tracker sync: N/A.
- Non-goals: changing CSS width/height, changing gameplay/click behavior, regenerating crystal identity from AI.

Current verdict:
- verdict: valid
- confidence: 86/100
- next owner: task
- reason: current sheets use `256x256` frames; user asked to keep visual size but reduce pixel density, which is best done by downsampling frames to `128x128` and re-upscaling.

Pre-solution issue challenge:
- reporter claim: the crystal looks too high-resolution/detailed for the desired pixel count.
- suggested diagnosis or fix: reduce effective per-frame pixel resolution while preserving `256x256` frame geometry and CSS size.
- repro ladder:
  - tests / source-level repro: `sips` reports `1280x512` spritesheets with five `256px` columns and two `256px` rows.
  - repo-owned automated browser or integration proof: direct public asset load after edit.
  - Browser plugin: browser-use is not exposed in this session; use Node REPL/Chrome fallback and record it.
  - screenshot / visual proof: required.
- reproduction verdict: valid; current active runtime frames are `256x256` and visually high-detail.
- validity verdict: valid.
- best long-term fix boundary: asset pixel-density pass plus `image-rendering: pixelated`, not resizing the UI.
- harsh honest feedback: changing CSS dimensions would be the wrong fix; it would make the crystal smaller instead of less dense.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if local PNG tooling cannot preserve transparency/dimensions or browser asset proof cannot load the public URLs.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-lower-crystal-effective-pixels.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Requirements: same visible size, fewer pixels/effective resolution, not a size change. |
| Timed checkpoint parsed | N/A: no duration requested | Direct asset pass. |
| Active goal checked or created | yes | `get_goal` returned none; `create_goal` started this plan. |
| Source of truth read before edits | yes | `.mana-sprite` uses the two relic spritesheets; current sheets are `1280x512`. |
| Acceptance criteria captured | yes | See Task source and Completion threshold. |
| Pre-solution issue challenge required | yes | Valid visual-density request. |
| Reproduction verdict before implementation | yes | Existing frames are `256x256`; target is `128x128` effective inside same frame. |
| Repro escalation ladder selected | yes | Dimension/effective-resolution audit, build, browser asset screenshot. |
| Suggested fix reviewed against durable boundary | yes | Asset density pass plus pixelated rendering; no UI size change. |
| TDD decision before behavior change or bug fix | N/A: visual asset transformation | No gameplay logic. |
| Browser proof decision for browser surface | yes | Browser proof required for active public URLs. |
| Browser pack selected | yes | `--with browser` applied. |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/assets/spriterrific/crystal/.../spritesheet.png`. |
| Browser tool decision recorded | yes | browser-use unavailable; use Node REPL/Chrome fallback. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Both active sheets remain `1280x512` with `256x256` frames; effective frame pixels are `128x128`; `uniform2x2=163840/163840` for idle and use; browser rendering is `pixelated`. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Dimension/effective-resolution audit plus browser proof selected. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Active sheets are `1280x512`, i.e. `256x256` frames; current CSS uses image smoothing. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Asset audit, CSS source audit, and browser proof completed. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: CSS/PNG only. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | yes | Capture browser proof | `/tmp/library-magic-crystal-128-effective-proof.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no formatter target for PNG; CSS one-line property change. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff preserves sheet dimensions/CSS size, changes only effective pixel density and browser smoothing. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No timed checkpoint requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-lower-crystal-effective-pixels.md` | `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-lower-crystal-effective-pixels.md` passed. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Chrome loaded both active public asset URLs cache-busted from Vite. |
| Browser console/network check | yes | Record console/network state or N/A | No page errors; only normal Vite/Phaser console messages. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-crystal-128-effective-proof.png`; images report `naturalWidth=1280`, `naturalHeight=512`, `image-rendering=pixelated`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | source CSS and Spriterrific runtime sheet dimensions identified | implementation |
| Implementation | complete | `256 -> 128 -> 256` pass applied to idle/use sheets; `image-rendering: pixelated`; Spriterrific finalize-runtime rerun | verification |
| Verification | complete | effective-resolution audit, `sips`, `npm run build`, browser proof | closeout |
| Closeout | complete | final plan evidence recorded; mechanical check next | final response |

Findings:
- Spriterrific runtime defaults are `256x256` cells; current active sheets are `1280x512`, five columns by two rows.
- User explicitly wants no visual size change, only lower pixel count/effective resolution.
- Final active sheets still measure `1280x512`, but every `2x2` block is uniform, so each `256x256` frame carries `128x128` effective pixels.
- `.mana-sprite` now uses `image-rendering: pixelated`, preventing browser smoothing from hiding the lower-resolution asset.

Decisions and tradeoffs:
- Use a deterministic `256 -> 128 -> 256` nearest-neighbor pass per runtime frame. This preserves sheet dimensions and animation CSS while lowering effective detail.
- Set `.mana-sprite { image-rendering: pixelated; }` so the browser does not blur the intentionally lower-res pixels.

Timeline:
- 2026-06-27T09:46:22.032Z: plan created.
- 2026-06-27: read Spriterrific/autogoal rules, identified active crystal sheets and CSS rendering mode.
- 2026-06-27: applied `256 -> 128 -> 256` nearest-neighbor pixel-density pass to idle/use spritesheets.
- 2026-06-27: set `.mana-sprite` image rendering to `pixelated`.
- 2026-06-27: reran `spriterrific finalize-runtime` for both crystal exports.
- 2026-06-27: `npm run build` passed.
- 2026-06-27: captured browser proof at `/tmp/library-magic-crystal-128-effective-proof.png`.

Verification evidence:
- `sips`: both active spritesheets remain `1280x512`.
- Effective-resolution audit: idle `uniform2x2=163840/163840 ratio=1.000000`; use `uniform2x2=163840/163840 ratio=1.000000`.
- CSS source audit: `.mana-sprite` uses `image-rendering: pixelated`.
- `npm run build` passed.
- Browser proof: Chrome loaded both public asset URLs with `naturalWidth=1280`, `naturalHeight=512`, `rendering=pixelated`; screenshot `/tmp/library-magic-crystal-128-effective-proof.png`.
- Autogoal check: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-lower-crystal-effective-pixels.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Same visible crystal size, lower effective sprite resolution. |
| What have I learned? | `128x128` effective content preserves UI geometry while visibly lowering detail density. |
| What have I done? | Pixel-density pass, CSS rendering fix, Spriterrific finalization, build, browser proof. |

Open risks:
- `128x128` is a first take based on the user's 400-to-200 example; if it still reads too detailed, the next clean step is `96x96` effective, not CSS resizing.
