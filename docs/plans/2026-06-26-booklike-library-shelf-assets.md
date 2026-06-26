# booklike-library-shelf-assets

Objective:
Rendre le hub plus credible: livres volumetriques type grimoires et bibliotheque asset bois, pas cartes posees sur rectangle brun.

Goal plan:
docs/plans/2026-06-26-booklike-library-shelf-assets.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: latest chat critique
- title: More book-like books and real library shelf
- acceptance criteria:
  - Les livres doivent plus ressembler a des livres.
  - La bibliotheque doit ressembler a un vrai meuble, pas a une UI moche.
  - Generer/ameliorer les assets et composer le hub avec eux.
  - Garder interactions existantes.
  - Verifier build et rendu navigateur.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: no timed work requested
- initial confidence score: 83/100
- improvement loop: regenerate assets, integrate, browser proof
- final score / loop closure: 91/100 after asset rewrite, browser proof, typecheck, and build.

Completion threshold:
- Book SVGs have visible book traits: spine, page block, bevel, leather texture, thickness, bookmark.
- New bookshelf SVG asset exists and is rendered as the central shelf.
- `LibraryScene` uses shelf + book image assets for the hub composition.
- `npm run typecheck`, `npm run build`, browser proof pass.

Verification surface:
- Files: `scripts/generate-library-book-assets.mjs`, `public/assets/library/*`, `src/phaser/scenes/LibraryScene.ts`.
- Commands: asset generator, `npm run typecheck`, `npm run build`.
- Browser: localhost screenshot + click proof.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: current generated asset hub and user critique.
- Allowed edit scope: asset generator, generated assets, LibraryScene, proof/plan.
- Browser surface: Vite root.
- Tracker sync: N/A.
- Non-goals: no live OpenAI image generation unless API key exists; no mini-game redesign.

Current verdict:
- verdict: valid aesthetic correction
- confidence: 83/100
- next owner: task
- reason: books improved but still read too much like cards; shelf is primitive and flat.

Pre-solution issue challenge:
- reporter claim: books are not book-like enough, library is ugly and not library-like.
- suggested diagnosis or fix: more volumetric book SVGs and a generated shelf asset.
- repro ladder:
  - tests / source-level repro: current generator outputs flat front-cover assets; scene still draws shelf primitives.
  - repo-owned automated browser or integration proof: prior screenshot shows flat shelf/cards.
  - Browser plugin: browser-use unavailable; local Chrome proof acceptable with caveat.
  - screenshot / visual proof: previous generated proof.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: generated visual assets + Phaser image composition
- harsh honest feedback: A shelf made out of rectangles still looks like a rectangle. Generate the furniture too.
- hard-stop decision: proceed

Blocked condition:
- Block only if assets fail to load or build/browser proof fails.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-booklike-library-shelf-assets.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | acceptance criteria above |
| Timed checkpoint parsed | yes | no duration |
| Active goal checked or created | yes | active goal created |
| Source of truth read before edits | yes | generator and LibraryScene read |
| Acceptance criteria captured | yes | Task source |
| Pre-solution issue challenge required | yes | recorded |
| Reproduction verdict before implementation | yes | valid |
| Repro escalation ladder selected | yes | source/browser proof |
| Suggested fix reviewed against durable boundary | yes | visual assets |
| TDD decision before behavior change or bug fix | yes | N/A visual asset generation |
| Browser proof decision for browser surface | yes | local Chrome proof |
| Browser pack selected | yes | applied |
| Browser route / app surface identified | yes | `/` |
| Browser tool decision recorded | yes | browser-use unavailable |

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
| Named verification threshold | yes | Run the named proof or record blocker | shelf asset generated, books regenerated, scene integrated, browser/build passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source + screenshot + browser proof |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | visual correction, not bug |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | final render proof has panels 0; earlier click proof still opens panels |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | screenshot captured |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | fixed bottom row, removed title collision, removed status labels, removed shelf shadow box |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-booklike-library-shelf-assets.md` | pending checker run |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | final browser proof: panels 0, 120 FPS; previous click proof panels 0 to 1 |
| Browser console/network check | yes | Record console/network state or N/A | no page errors |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `docs/plans/2026-06-26-booklike-library-shelf-assets-final.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | plan filled, source read | implementation |
| Implementation | complete | shelf asset + book assets regenerated, scene integrated | verification |
| Verification | complete | typecheck/build/browser proof passed | closeout |
| Closeout | complete | final audit complete | final response |

Findings:
- Current generator creates decent covers, but not enough visible page volume.
- Current `LibraryScene` still draws the shelf via Phaser primitives.
- New books have stronger right-side page block, top pages, thicker spine, bevel, leather texture.
- New `public/assets/library/shelf.svg` replaces the primitive shelf drawing.
- Removed state labels below books because they made the shelf feel like a menu.

Decisions and tradeoffs:
- Generate deterministic SVG shelf and book assets locally.
- Use image assets for the shelf, keep only lightweight overlays for dynamic states.
- Keep selection/hover via frame/glow instead of text under each book.

Timeline:
- 2026-06-26T14:49:49.674Z: plan created.
- 2026-06-26T14:50Z: generated shelf asset and more volumetric book assets.
- 2026-06-26T14:52Z: integrated shelf SVG in `LibraryScene`.
- 2026-06-26T14:56Z: removed UI labels below books and captured final proof.

Verification evidence:
- `node scripts/generate-library-book-assets.mjs`: regenerated book SVGs and `public/assets/library/shelf.svg`.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser proof: final screenshot saved to `docs/plans/2026-06-26-booklike-library-shelf-assets-final.png`, panels 0, no page errors, 120 FPS in final sample.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | More book-like assets and real shelf composition |
| What have I learned? | See Findings |
| What have I done? | Generated better books, generated shelf, integrated and verified |

Open risks:
- `OPENAI_API_KEY` still missing, so this remains deterministic SVG generation rather than live diffusion/painting.
