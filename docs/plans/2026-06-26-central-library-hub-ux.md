# central-library-hub-ux

Objective:
Refaire le hub central en bibliotheque Phaser dynamique: livres interactifs, etats hover/locked/selected, ambiance vivante, build/typecheck OK, preuve visuelle locale.

Goal plan:
docs/plans/2026-06-26-central-library-hub-ux.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: local prompt, screenshot CleanShot 2026-06-26 at 16.24.11
- title: Hub central bibliotheque dynamique
- acceptance criteria:
  - S'inspirer de l'image: grande bibliotheque, jeux dans des livres, mana visible.
  - Ne plus donner l'impression d'une simple image statique.
  - Generer une UX/UI belle et dynamique qui marche bien dans le hub central.
  - Utiliser les skills pertinents: brainstorming, autogoal, frontend-design.
  - Score confiance final sur /100.

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
- initial confidence score: 82/100 after reading LibraryScene/hud/books
- improvement loop: implement then build/typecheck/browser proof
- final score / loop closure: 88/100 after implementation and browser proof; remaining confidence loss is unrelated global TypeScript debt in `src/ui/hud.ts`.

Completion threshold:
- Hub central renders without relying on the bookshelf PNG as the primary visual.
- Each book is visibly rendered as an interactive object with icon, lock/unlock/selected affordances, hover motion, and click behavior preserved.
- Room has dynamic ambience: lighting, particles/glints, animated lantern/mana pulse, shelf depth.
- Existing mini-game panel opening behavior still works.
- `npm run typecheck` and `npm run build` pass.
- Browser proof attempts repo-approved browser-use first; if unavailable, record blocker and capture equivalent local proof.
Result note: the hub-specific code passes targeted TypeScript audit and `npx vite build` passes, but `npm run typecheck` / `npm run build` are blocked by pre-existing unrelated `src/ui/hud.ts` Blackjack errors.

Verification surface:
- Source audit: `src/phaser/scenes/LibraryScene.ts`, `src/game/content/books.ts`, `src/ui/hud.ts`, `src/style.css`, `src/main.ts`.
- Commands: `npm run typecheck`, `npm run build`.
- Browser: localhost Vite route `/`, inspect canvas renders, click/hover at least one book, check console errors where tooling allows.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: current Phaser hub plus user screenshot.
- Allowed edit scope: hub scene and minimal supporting CSS/content typing if needed.
- Browser surface: Vite app root at `http://127.0.0.1:<port>/`.
- Tracker sync: N/A, not ticket-backed.
- Non-goals: no new generated spritesheet pipeline, no full mini-game redesign, no commits/pushes unless later requested.

Current verdict:
- verdict: valid feature request
- confidence: 82/100
- next owner: task
- reason: current scene loads a static library background and overlays invisible hotspots; the request is to make the hub itself dynamic.

Pre-solution issue challenge:
- reporter claim: current central hub is just an image and lacks dynamic UX.
- suggested diagnosis or fix: rebuild the hub as Phaser-drawn interactive books and ambience while preserving existing state/actions.
- repro ladder:
  - tests / source-level repro: source confirms `LibraryScene` preloads `bookshelf-background-hires.png` and creates invisible book hotspots.
  - repo-owned automated browser or integration proof: N/A before implementation; use after implementation.
  - Browser plugin: tool_search attempted for browser-use; no browser-use tool exposed in this thread.
  - screenshot / visual proof: user supplied current screenshot.
- reproduction verdict: valid from source and screenshot
- validity verdict: valid
- best long-term fix boundary: `LibraryScene` owns the hub composition and interactions.
- harsh honest feedback: A pretty PNG with invisible hotspots is a menu skin, not a hub. The fix belongs in the scene, not in another overlay bandage.
- hard-stop decision: proceed

Blocked condition:
- Block only if the app cannot build from unrelated repo breakage, or if browser tooling cannot run at all; record exact command/tool failure.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied or explicitly recorded as blocked, final evidence is recorded, and `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-central-library-hub-ux.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | acceptance criteria above |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `get_goal` returned none, `create_goal` created active goal |
| Source of truth read before edits | yes | read `LibraryScene.ts`, `books.ts`, `hud.ts`, `style.css`, `main.ts`; inspected user screenshot |
| Acceptance criteria captured | yes | Task source section |
| Pre-solution issue challenge required | yes | feature request, challenge recorded |
| Reproduction verdict before implementation | yes | valid from source/screenshot |
| Repro escalation ladder selected | yes | source audit then browser proof |
| Suggested fix reviewed against durable boundary | yes | boundary is `LibraryScene` |
| TDD decision before behavior change or bug fix | yes | N/A: visual/interaction polish; typecheck/build/browser proof is the honest coverage |
| Browser proof decision for browser surface | yes | use browser-use if available; otherwise local browser proof with caveat |
| Browser pack selected | yes | applied during scratchpad creation |
| Browser route / app surface identified | yes | Vite root `/` |
| Browser tool decision recorded | yes | `tool_search` did not expose browser-use |

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
| Named verification threshold | yes | Run the named proof or record blocker | Hub implemented; targeted TS audit OK; `npx vite build` OK; global `npm run typecheck` / `npm run build` blocked by unrelated `src/ui/hud.ts` Blackjack errors. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source proof recorded; browser pending |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature request, not bug fix |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Browser click proof: panels 0 before click, 1 after clicking a book, no page errors. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npx tsc --noEmit --pretty false 2>&1 \| rg "LibraryScene\|src/phaser" \|\| true` returned no hub errors; global typecheck blocked by unrelated HUD errors. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npx vite build` passed; `npm run build` blocked at `tsc` by unrelated `src/ui/hud.ts` errors. |
| Browser surface changed | yes | Capture browser proof | Local Chrome proof captured. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint/format script in `package.json`. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed final screenshot and diff; fixed preview overflow found during proof. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-central-library-hub-ux.md` | checker run after closeout status update. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | `http://127.0.0.1:5173/`, close panel, click book, panel count becomes 1. |
| Browser console/network check | yes | Record console/network state or N/A | No page errors; console has Vite/Phaser logs and one 404 resource, likely favicon. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `docs/plans/2026-06-26-central-library-hub-ux-final.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | plan filled, source read | implementation |
| Implementation | complete | `src/phaser/scenes/LibraryScene.ts` rewritten as dynamic hub | verification |
| Verification | complete_with_blocker | Browser and Vite proof OK; global TSC blocked outside scope | closeout |
| Closeout | complete | final audit complete | final response |

Findings:
- Current hub depends on `public/assets/decor/bookshelf-background-hires.png` for the visible shelf.
- Book interactions are invisible containers mapped to hard-coded coordinates.
- HUD panels already render mini-game overlays; click behavior must keep dispatching `unlockBook` / `selectBook`.
- `browser-use` was searched for but is not exposed in this thread's tools.
- Global TypeScript is currently broken in unrelated Blackjack/HUD code already present in the dirty workspace.

Decisions and tradeoffs:
- Rebuild the central shelf in Phaser-drawn layers instead of adding more DOM overlay UI.
- Keep existing book definitions and gameStore actions.
- Do not run Spriterrific: request is hub UX/UI, not a new sprite asset pipeline.

Timeline:
- 2026-06-26T14:26:27.603Z: plan created.
- 2026-06-26T14:35Z: dynamic Phaser library hub implemented in `LibraryScene.ts`.
- 2026-06-26T14:43Z: local browser proof captured and preview overflow fixed.

Verification evidence:
- `npx tsc --noEmit --pretty false 2>&1 | rg "LibraryScene|src/phaser" || true`: no output, no hub-scene type errors.
- `npm run typecheck`: failed in unrelated `src/ui/hud.ts` Blackjack errors (`blackjackSkills`, missing Blackjack skill helpers, unused imports).
- `npm run build`: failed for same global `tsc` blocker.
- `npx vite build`: passed, 23 modules transformed, production bundle emitted.
- Browser proof via Playwright using system Chrome because `browser-use` was unavailable: canvas rendered at 1280x720, screenshot saved at `docs/plans/2026-06-26-central-library-hub-ux-final.png`, no page errors.
- Interaction proof: after closing existing panel, click on a book changed `.book-overlay` count from 0 to 1.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Dynamic central library hub |
| What have I learned? | Current scene is mostly static background plus invisible hotspots |
| What have I done? | Rebuilt hub scene, captured browser proof, recorded global verification blocker |

Open risks:
- `npm run typecheck` and `npm run build` remain blocked until unrelated Blackjack/HUD TypeScript errors are resolved.
- Initial app state currently opens the Mana panel, which can visually cover the hub until closed; this was existing behavior and not changed.
