# library book resource hud

Objective:
Book resource HUD shown above every library book; done when source audit, build, and browser proof pass.

Goal plan:
docs/plans/2026-06-26-library-book-resource-hud.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user prompt
- id / link: N/A: direct chat request
- title: HUD resource count above each book
- acceptance criteria: every library book has a visible HUD above it showing the current stock for that book's resource.

First checkpoint:
- Explicit requirement: add a HUD above every book with the number of that book's resource.
- Scope: Phaser library hub book markers.
- Non-goals: no economy changes, no new resource types, no unlock rule changes.
- Stop condition: stop after the HUD renders and verification passes, or if the local app cannot be run.
- Deliverable: code change plus proof.
- Verification surface: source audit, build, and browser proof on the library route.
- Success criteria: all 10 books have HUD objects; each HUD uses mana for the mana book and `resourceId` stock for resource books.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: user did not request a timed checkpoint
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- `LibraryScene.ts` creates a resource HUD for every `books` entry, keeps it positioned above the book, and updates the displayed number from `GameState`.
- `npm run build` passes.
- Browser proof confirms the library view renders and the book HUDs are visible without console errors.

Verification surface:
- Source audit in `src/phaser/scenes/LibraryScene.ts`.
- `npm run build`.
- Browser proof for `http://127.0.0.1:<port>/`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `books`, `GameState.mana`, and `GameState.resources`.
- Allowed edit scope: `src/phaser/scenes/LibraryScene.ts` and this goal plan.
- Browser surface: Vite app root showing `LibraryScene`.
- Tracker sync: N/A: no issue tracker item in prompt.
- Non-goals: economy balance, save/load, book unlock logic, generated assets.

Current verdict:
- verdict: in_progress
- confidence: 78/100
- next owner: task
- reason: source patterns are clear; final confidence depends on build and browser proof.

Pre-solution issue challenge:
- reporter claim: feature request, not a bug claim.
- suggested diagnosis or fix: add per-book HUD objects to Phaser book containers and sync them from `GameState`.
- repro ladder:
  - tests / source-level repro: N/A: visual feature request.
  - repo-owned automated browser or integration proof: browser proof selected.
  - Browser plugin: required by repo rule; use if available, otherwise record blocker/waiver.
  - screenshot / visual proof: expected after implementation.
- reproduction verdict: N/A: feature request.
- validity verdict: valid.
- best long-term fix boundary: `LibraryScene` owns book hotspot visuals, so the HUD belongs there.
- harsh honest feedback: putting this only in the top HUD would be weaker UX; above-book counters are the right ask.
- hard-stop decision: proceed.

Blocked condition:
Stop if TypeScript build fails for unrelated pre-existing errors that cannot be isolated, or if browser tooling cannot access the local Vite app.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-library-book-resource-hud.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint lists scope, non-goals, stop condition, deliverable, verification, and success criteria |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | `get_goal` returned null; `create_goal` created active goal for this plan |
| Source of truth read before edits | yes | Read `LibraryScene.ts`, `books.ts`, `state.ts`, and `store.ts` |
| Acceptance criteria captured | yes | See Task source and First checkpoint |
| Pre-solution issue challenge required | no | N/A: feature request, not bug report |
| Reproduction verdict before implementation | no | N/A: feature request |
| Repro escalation ladder selected | no | N/A: feature request; browser proof selected for final visual verification |
| Suggested fix reviewed against durable boundary | yes | `LibraryScene` owns book hotspot visuals and state sync |
| TDD decision before behavior change or bug fix | yes | N/A: pure visual Phaser HUD; test would be fake ceremony here |
| Browser proof decision for browser surface | yes | Browser proof required on Vite app root |
| Browser pack selected | yes | Applied `browser` pack |
| Browser route / app surface identified | yes | Vite app root, library hub canvas |
| Browser tool decision recorded | yes | Repo requests browser-use first; if unavailable, record exact blocker and use best available local proof |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. Evidence: N/A, no duration requested.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Evidence: feature request, validity `valid`.
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state. Evidence: N/A for bug repro; final browser proof selected.
      matters.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: N/A for feature request.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: `LibraryScene` owns book hotspot visuals and `syncState()` already updates each book view.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: reviewed scoped diff in `src/phaser/scenes/LibraryScene.ts` and this plan.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. Evidence: `browser-use` was searched but not exposed in this session; used Playwright with installed Chrome as waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope. Evidence: browser proof captured only Vite debug and Phaser banner logs, no page errors.
- [x] Browser pack: proof uses the real affected browser surface. Evidence: `http://127.0.0.1:5180/` Vite app root with `LibraryScene` canvas.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Source audit found `resourceHud` creation/sync helpers; `npm run build` passed; browser screenshot captured |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: feature request; verdict valid |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: no bug claim; screenshot proof used for visual feature |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature request, not bug |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Source audit: `rg -n "resourceHud|bookResourceStock|formatBookResourceStock|resourceDefinitionForBook" src/phaser/scenes/LibraryScene.ts` |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run build` passed, includes `tsc` |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Screenshot: `docs/plans/2026-06-26-library-book-resource-hud-proof.png` |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script in `package.json` |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed scoped HUD diff; no economy/unlock changes |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-library-book-resource-hud.md` | First run caught missing closeout evidence; final run passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened `http://127.0.0.1:5180/`, pressed debug `O`, verified all ten above-book HUD counters visible |
| Browser console/network check | yes | Record console/network state or N/A | No page errors; only Vite debug connect logs and Phaser banner |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `docs/plans/2026-06-26-library-book-resource-hud-proof.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read current scene, content definitions, and state shape | implementation |
| Implementation | complete | Added per-book Phaser HUD objects and state sync in `LibraryScene.ts` | verification |
| Verification | complete | `npm run build`; browser proof at `http://127.0.0.1:5180/`; source audit for HUD helpers | closeout |
| Closeout | complete | First completion check caught missing closeout evidence; final checker run passed | final response |

Findings:
- `LibraryScene` already has `resourceDefinitions`, resource icons, and `libraryResourceStock`, so the HUD can reuse those instead of duplicating resource mapping.
- `BookView` is the right holder for per-book HUD objects because `syncState()` already loops every book view.

Decisions and tradeoffs:
- Use small in-canvas Phaser HUD elements rather than DOM overlays; they stay attached to the book coordinate system and avoid panel hit-test conflicts.

Timeline:
- 2026-06-26T18:45:17.258Z: plan created.

Verification evidence:
- Source audit: `rg -n "resourceHud|bookResourceStock|formatBookResourceStock|resourceDefinitionForBook" src/phaser/scenes/LibraryScene.ts` found HUD interface fields, creation, sync, and helper functions.
- Build: `npm run build` passed.
- Browser: Vite served `http://127.0.0.1:5180/`; Chrome/Playwright screenshot captured after debug resource grant; all ten book HUDs visible above books; no page errors.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Show each book's current resource stock directly above that book |
| What have I learned? | `LibraryScene` owns book visuals and already maps resources to books |
| What have I done? | Added HUD, ran build, captured browser proof |

Open risks:
- Existing dirty workspace is broad; only claim the scoped `LibraryScene.ts`, plan, and proof screenshot changes from this task.
