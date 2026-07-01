# replace mana crystal asset

Objective:
Remplacer le cristal mana par `public/assets/Crystal/Crystal.png`; done when CSS active states use the new asset, build and browser asset proof pass.

Goal plan:
docs/plans/2026-06-27-replace-mana-crystal-asset.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: "j'ai rajoute un png et json crystal dans le dossier, change le crystal qu'on avait avec celui la"
- acceptance criteria: the HUD mana crystal uses the newly added `public/assets/Crystal/Crystal.png` / `Crystal.json` pack instead of the old Spriterrific relic sheets.

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
- `.mana-sprite` and its click/wand states reference `/assets/Crystal/Crystal.png`.
- `.mana-sprite` no longer uses 5x2 spritesheet background sizing or background-position animation.
- `npm run build` passes.
- Browser proof loads `/assets/Crystal/Crystal.png` from Vite with natural size `128x128`.

Verification surface:
- Source audit with `rg` over `src/style.css`.
- `npm run build`.
- Browser proof for the new public PNG.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `public/assets/Crystal/Crystal.json`, `public/assets/Crystal/Crystal.png`, and `.mana-sprite` CSS.
- Allowed edit scope: `src/style.css` and this plan.
- Browser surface: Vite public asset URL `/assets/Crystal/Crystal.png`.
- Tracker sync: N/A.
- Non-goals: generating new art, modifying the supplied PNG/JSON, changing mana gameplay.

Current verdict:
- verdict: valid
- confidence: 90/100
- next owner: task
- reason: new `Crystal.json` is a one-frame Aseprite atlas pointing to `Crystal.png`; CSS must stop treating the crystal as a 5x2 spritesheet.

Pre-solution issue challenge:
- reporter claim: replace the existing mana crystal with the newly added PNG/JSON crystal.
- suggested diagnosis or fix: point the mana sprite CSS to `/assets/Crystal/Crystal.png` and remove spritesheet-specific background sizing/animations.
- repro ladder:
  - tests / source-level repro: source audit of CSS references.
  - repo-owned automated browser or integration proof: direct Vite asset load.
  - Browser plugin: browser-use unavailable in exposed tools; use Chrome/Node fallback.
  - screenshot / visual proof: browser asset proof.
- reproduction verdict: valid; new files exist and old CSS still points at relic sheets.
- validity verdict: valid.
- best long-term fix boundary: CSS asset swap, not copying over the user's supplied files.
- harsh honest feedback: keeping old background-position keyframes would be dumb here; the new atlas has one frame, so it would only shift/crop the image.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if the supplied PNG cannot be loaded or build fails from the CSS asset path.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-replace-mana-crystal-asset.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Replace old crystal with newly added `public/assets/Crystal/Crystal.png` / JSON pack. |
| Timed checkpoint parsed | N/A: no duration requested | Direct asset swap. |
| Active goal checked or created | yes | `get_goal` returned none; active goal created for this plan. |
| Source of truth read before edits | yes | `Crystal.json` points to `Crystal.png`, one `128x128` frame. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | yes | Valid direct asset replacement. |
| Reproduction verdict before implementation | yes | Old CSS references relic sheets; new asset exists. |
| Repro escalation ladder selected | yes | CSS audit, build, browser asset proof. |
| Suggested fix reviewed against durable boundary | yes | CSS swap only; no art mutation. |
| TDD decision before behavior change or bug fix | N/A: CSS/asset visual swap | No gameplay logic. |
| Browser proof decision for browser surface | yes | New public PNG must load from Vite. |
| Browser pack selected | yes | Browser pack applied. |
| Browser route / app surface identified | yes | `/assets/Crystal/Crystal.png`. |
| Browser tool decision recorded | yes | browser-use unavailable; use Chrome/Node fallback. |

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
| Named verification threshold | yes | Run the named proof or record blocker | CSS uses `/assets/Crystal/Crystal.png` for base/click/wand states; old relic sheet references removed from `src/style.css`; build passed; browser loaded new PNG at `128x128`. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | CSS audit, build, browser proof selected. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Old CSS references relic sheets while new asset exists. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `rg` source audit, `npm run build`, and Chrome asset proof completed. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: CSS only. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | yes | Capture browser proof | `/tmp/library-magic-new-crystal-proof.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: focused CSS edit. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff limited to CSS and plan; supplied PNG/JSON left unchanged; old single-frame-incompatible keyframes removed. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | Direct asset swap. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-replace-mana-crystal-asset.md` | `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-replace-mana-crystal-asset.md` passed. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Chrome loaded `/assets/Crystal/Crystal.png?proof=...` from Vite. |
| Browser console/network check | yes | Record console/network state or N/A | No page errors; only normal Vite/Phaser console messages. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-new-crystal-proof.png`; natural size `128x128`, `background-size=contain`, `image-rendering=pixelated`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | inspected new PNG/JSON and old CSS references | implementation |
| Implementation | complete | CSS now uses `/assets/Crystal/Crystal.png` for mana sprite states and disables old spritesheet animations | verification |
| Verification | complete | source audit, build, Chrome asset proof | closeout |
| Closeout | complete | final check next | final response |

Findings:
- `public/assets/Crystal/Crystal.json` is an Aseprite JSON atlas with one frame `Sprite-0001.` at `128x128`.
- The old CSS treats the crystal as a 5x2 spritesheet (`background-size: 500% 200%` and background-position keyframes), so it needs a single-frame CSS path.

Decisions and tradeoffs:
- Use the supplied PNG directly from `/assets/Crystal/Crystal.png`; keep JSON as source metadata but do not add a runtime parser for one CSS sprite.
- Disable old spritesheet background-position animations for mana sprite states because the new crystal has one frame.

Timeline:
- 2026-06-27T21:29:49.293Z: plan created.
- 2026-06-27: located and inspected `public/assets/Crystal/Crystal.png` and `Crystal.json`.

Verification evidence:
- Source audit: `src/style.css` references `/assets/Crystal/Crystal.png` for base/click/wand states; `relic-idle`, `relic-use`, and `spriterrific-crystal-*` no longer appear in the stylesheet.
- Build: `npm run build` passed.
- Browser proof: `/tmp/library-magic-new-crystal-proof.png`; Chrome reports new image complete with `naturalWidth=128`, `naturalHeight=128`, `backgroundSize=contain`, `imageRendering=pixelated`.
- Dev server: relaunched on `http://127.0.0.1:5173/` for proof.
- Autogoal: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-replace-mana-crystal-asset.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Replace old mana crystal visual with the user-added Crystal PNG/JSON pack. |
| What have I learned? | New asset works as a single-frame CSS sprite and should not use old background-position animations. |
| What have I done? | Swapped CSS to the new asset, removed stale keyframes, built, and browser-proofed the asset. |

Open risks:
- Single-frame replacement removes the old sprite-sheet shine animation; click shake/scale still runs on the orb.
