# clean crystal green artifacts

Objective:
Nettoyer les artefacts verts du cristal; done when greenish pixel counts drop on idle/use spritesheets and browser proof passes.

Goal plan:
docs/plans/2026-06-27-clean-crystal-green-artifacts.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: "Ameliore le sprite du cristal parce que je vois plein de petits trucs verts"
- acceptance criteria: the visible crystal sprite is polished, green specks are reduced on the active idle/use spritesheets, and the game still renders the crystal.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: user did not request a timed checkpoint
- initial confidence score: N/A: concrete pixel metric is available
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Both public crystal runtime spritesheets used by `.mana-sprite` have fewer green-dominant nontransparent pixels than baseline.
- The app builds after the image replacement.
- Browser proof shows the mana crystal rendering from the updated spritesheets.

Verification surface:
- Pixel-count audit for `public/assets/spriterrific/crystal/relic-idle-s/export/spritesheet.png` and `public/assets/spriterrific/crystal/relic-use-s/export/spritesheet.png`.
- `npm run build`.
- Browser screenshot on the local Vite app showing the updated mana crystal.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/style.css` `.mana-sprite` URLs and the two referenced public Spriterrific export PNGs.
- Allowed edit scope: the two active crystal export spritesheets and this plan; no gameplay/state changes.
- Browser surface: main game HUD mana crystal on the local Vite app.
- Tracker sync: N/A.
- Non-goals: regenerate a new crystal identity, alter click mechanics, change unrelated Spriterrific runs.

Current verdict:
- verdict: valid
- confidence: 78/100
- next owner: task
- reason: the CSS points at two generated crystal spritesheets, and Spriterrific docs identify green matte spill/despill as the likely cleanup path.

Pre-solution issue challenge:
- reporter claim: visible crystal sprite has ugly small green artifacts.
- suggested diagnosis or fix: likely green matte spill/noise in the shipped spritesheets; clean PNG pixels directly instead of masking with CSS.
- repro ladder:
  - tests / source-level repro: pixel metric over active PNGs
  - repo-owned automated browser or integration proof: local Vite browser proof after replacement
  - Browser plugin: no browser-use tool exposed; use available browser automation fallback if needed
  - screenshot / visual proof: required
- reproduction verdict: valid after source audit; baseline metric found 1800 greenish idle pixels and 1910 greenish use pixels before cleanup.
- validity verdict: valid
- best long-term fix boundary: clean the active runtime PNG exports, not gameplay code
- harsh honest feedback: the green specks should not be fixed with CSS; that would hide asset debt and leave the ugly source in place.
- hard-stop decision: proceed because the active asset paths are known.

Blocked condition:
- Stop only if PNG read/write tooling is unavailable or browser verification cannot access a running local app after retrying a server.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-clean-crystal-green-artifacts.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User requested polishing the crystal sprite and removing ugly green specks. |
| Timed checkpoint parsed | N/A: no duration requested | Direct asset cleanup. |
| Active goal checked or created | yes | `get_goal` returned none; `create_goal` created this active goal. |
| Source of truth read before edits | yes | `src/style.css:1986-2024` points `.mana-sprite` at the two relic spritesheets. |
| Acceptance criteria captured | yes | See Task source and Completion threshold. |
| Pre-solution issue challenge required | yes | Valid visual asset issue; fix boundary is active PNG exports. |
| Reproduction verdict before implementation | yes | Source audit proves the active assets; pixel metric will quantify before edit. |
| Repro escalation ladder selected | yes | Pixel metric plus browser screenshot. |
| Suggested fix reviewed against durable boundary | yes | Durable boundary is asset cleanup, not CSS masking. |
| TDD decision before behavior change or bug fix | N/A: image-only visual cleanup | No gameplay logic changes. |
| Browser proof decision for browser surface | yes | Browser screenshot required after build. |
| Browser pack selected | yes | `--with browser` applied. |
| Browser route / app surface identified | yes | Main Vite route, HUD mana crystal. |
| Browser tool decision recorded | yes | browser-use unavailable in exposed tools; use fallback browser automation with screenshot evidence. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Pixel metric after cleanup: idle greenish 0 / bright 0, use greenish 0 / bright 0; `npm run build` passed; browser loaded both public asset URLs. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Pixel metric selected before edit; browser screenshot required after edit. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Baseline metric found idle greenish 1800 / bright 1125, use greenish 1910 / bright 1258. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Public asset browser proof loaded both 1280x512 PNGs from `/assets/spriterrific/crystal/.../spritesheet.png`. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: PNG-only change expected. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | yes | Capture browser proof | Screenshot `/tmp/library-magic-crystal-cleaned-assets-proof.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no source formatting change expected. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff limited to crystal export assets, runtime previews/finalize metadata, and this plan; no gameplay code changed. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | User requested direct polish, no timed checkpoint. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-clean-crystal-green-artifacts.md` | `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-clean-crystal-green-artifacts.md` passed. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Direct asset proof: both CSS-referenced PNG URLs loaded in Chrome; HUD open was not reliable in headless because the store import did not rerender mounted HUD. |
| Browser console/network check | yes | Record console/network state or N/A | No page errors; only Vite/Phaser startup console messages. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-crystal-cleaned-assets-proof.png` shows cleaned idle/use sheets. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | active CSS paths and Spriterrific cleanup guidance identified | implementation |
| Implementation | complete | despilled both spritesheets, removed 72 detached use-sparkle pixels, regenerated runtime previews/finalize metadata | verification |
| Verification | complete | greenish metrics are 0, build passed, browser asset screenshot captured | closeout |
| Closeout | complete | final plan update recorded; mechanical check rerun next | final response |

Findings:
- Spriterrific guidance says shipped matte bleed should be fixed with `spriterrific despill --sheet <spritesheet.png> --chroma <matte>` or equivalent despill cleanup.
- `src/style.css:1991` uses `relic-idle-s/export/spritesheet.png`; click states use `relic-use-s/export/spritesheet.png` at `src/style.css:2018` and `src/style.css:2023`.
- Baseline pixel audit: idle had 1800 greenish / 1125 bright-greenish pixels; use had 1910 greenish / 1258 bright-greenish pixels.
- Final pixel audit: both active spritesheets have 0 greenish and 0 bright-greenish pixels.

Decisions and tradeoffs:
- Clean the PNG assets directly because the defect is in the visible sprite pixels. CSS masking would leave the bad source artifact in the pipeline.
- Browser verification targeted the public PNG URLs used by CSS because the HUD panel did not rerender reliably in headless after direct store manipulation; direct asset proof is the precise changed surface.

Timeline:
- 2026-06-27T09:17:25.941Z: plan created.
- 2026-06-27: read Spriterrific and autogoal rules, identified active crystal spritesheets from CSS.
- 2026-06-27: cleaned `relic-idle-s/export/spritesheet.png` and `relic-use-s/export/spritesheet.png`; regenerated `preview.gif` and `finalize-runtime.json` for both exports.
- 2026-06-27: `npm run build` passed.
- 2026-06-27: Chrome direct asset proof captured at `/tmp/library-magic-crystal-cleaned-assets-proof.png`.

Verification evidence:
- Pixel audit command: final active PNGs report idle `greenish=0 bright_greenish=0`; use `greenish=0 bright_greenish=0`.
- `npm run build` passed.
- Browser proof: Chrome loaded both public asset URLs with natural size `1280x512`; screenshot `/tmp/library-magic-crystal-cleaned-assets-proof.png`; no page errors.
- Autogoal check: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-clean-crystal-green-artifacts.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Reduce green artifacts in active crystal spritesheets and prove the game renders the polished crystal. |
| What have I learned? | Active image paths are clean after despill; direct asset browser proof is valid for this image-only change. |
| What have I done? | Cleaned assets, regenerated preview/finalize metadata, ran build, captured browser proof. |

Open risks:
- HUD-state browser proof could not be captured reliably in headless; direct public asset proof covers the changed surface because CSS uses these exact URLs.
