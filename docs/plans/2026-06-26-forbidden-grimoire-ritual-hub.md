# forbidden grimoire ritual hub

Objective:
Refactor the library hub into a left game-books shelf plus right forbidden-grimoire ritual boss; done when layered generated assets are integrated, progressive manual offering UI exists, and local browser proof passes.

Goal plan:
docs/plans/2026-06-26-forbidden-grimoire-ritual-hub.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user chat
- id / link: local Codex thread
- title: Forbidden grimoire boss hub
- acceptance criteria: the forbidden grimoire is the final boss on a right-side lectern, the game books are on the shelf, offerings are manual and progressive, offering icons sit under the grimoire, the grimoire levels up by deposited resources, and each level reveals the next game book.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: none
- semantics: N/A, no timed checkpoint requested
- initial confidence score: 84/100
- improvement loop: raise confidence through generated visual proof, source-level progression tests, typecheck/build, and browser proof
- final score / loop closure: 94/100 after typecheck, build, focused test, and browser proof.

Completion threshold:
- Generated hub art exists for the new composition: game shelf left/center, forbidden grimoire boss on a lectern to the right.
- Simulation supports progressive manual offerings into the forbidden grimoire.
- A fulfilled seal can be broken manually to unlock/reveal the next game book.
- Phaser hub shows the ritual UI under/near the forbidden grimoire with resource icons and progress.
- Local browser proof shows the new composition and at least one offer/break-seal progression path without console or network errors.

Verification surface:
- `npm run typecheck`
- `npm run build`
- focused simulation tests for forbidden-grimoire offerings/progression
- generated asset files under `public/assets/library/generated/`
- browser proof on local Vite route with screenshots and console/network checks
- `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-forbidden-grimoire-ritual-hub.md`

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/game/content/books.ts`, `src/phaser/scenes/LibraryScene.ts`, `src/ui/hud.ts`, generated assets.
- Allowed edit scope: progression state/actions/tests, library hub Phaser scene, generated library art/assets, and documentation/proof files.
- Browser surface: local Vite app at `http://127.0.0.1:5173/` or fallback port if Vite is already using another port.
- Tracker sync: N/A, no external ticket.
- Non-goals: redesign every mini-game panel, rebalance all game economies, deploy, commit, push, or create PR.

Current verdict:
- verdict: complete
- confidence: 94/100
- next owner: user
- reason: generated composition, simulation progression, Phaser UI, focused test, build, and browser proof are complete.

Pre-solution issue challenge:
- reporter claim: the current hub does not express the real game goal; the forbidden grimoire should be a mysterious boss on a right-side lectern, fed manually with progressive resources to reveal games.
- suggested diagnosis or fix: move the focal point from the book shelf to a boss/ritual area and add real state for progressive offerings.
- repro ladder:
  - tests / source-level repro: current state only has direct book unlock costs; no forbidden-grimoire state exists.
  - repo-owned automated browser or integration proof: pending after implementation.
  - Browser plugin: repo prefers browser-use, but it is not currently exposed; will record fallback if still unavailable.
  - screenshot / visual proof: pending after generated asset integration.
- reproduction verdict: valid product gap, not a defect repro.
- validity verdict: valid.
- best long-term fix boundary: the forbidden grimoire owns progression and book reveal; book click only opens unlocked games.
- harsh honest feedback: if the boss grimoire is only decoration, the game loop stays confusing. It needs state, costs, and a real ritual action.
- hard-stop decision: proceed; no unsafe ambiguity remains.

Blocked condition:
Stop if image generation credentials are unavailable and no generated art can be produced, or if local browser proof cannot load the app. Otherwise continue with a generated-art or vector fallback clearly recorded.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-forbidden-grimoire-ritual-hub.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Copied into task source, completion threshold, constraints, and boundaries. |
| Timed checkpoint parsed | no | No duration requested. |
| Active goal checked or created | yes | `get_goal` returned none; created active goal for this refactor. |
| Source of truth read before edits | yes | Read `LibraryScene.ts`, `state.ts`, `actions.ts`, `books.ts`, `hud.ts`, and asset paths. |
| Acceptance criteria captured | yes | Captured forbidden grimoire boss, right lectern, progressive manual offerings, and next-book reveal. |
| Pre-solution issue challenge required | yes | Product gap challenged above. |
| Reproduction verdict before implementation | yes | Current source lacks boss progression state. |
| Repro escalation ladder selected | yes | Source-level audit, focused tests, and browser proof. |
| Suggested fix reviewed against durable boundary | yes | Progression belongs in simulation state/actions, not only Phaser scene. |
| TDD decision before behavior change or bug fix | yes | Add focused simulation test for ritual offerings/progression. |
| Browser proof decision for browser surface | yes | Required after Phaser hub changes. |
| Browser pack selected | yes | Generated plan includes browser pack. |
| Browser route / app surface identified | yes | Local Vite `http://127.0.0.1:5173/`. |
| Browser tool decision recorded | yes | Try tool search; use local Chrome fallback if browser-use is unavailable. |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm run typecheck`, `npm run build`, `npx tsx tests/forbiddenGrimoire.test.ts`, and browser proof completed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above: valid product gap; progression belongs to forbidden-grimoire simulation state/actions. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit found no grimoire progression state; focused test and browser proof now cover the new behavior. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Feature/product gap, not a bug report; source-level absence of grimoire progression recorded. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/forbiddenGrimoire.test.ts` passed with `forbiddenGrimoire ok`. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; only existing Vite chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | Chrome proof on `http://127.0.0.1:5177/` captured initial, hover, offered, and seal-broken screenshots. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint script exists in `package.json`; typecheck/build used as final static verification. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Final review checked generated right-lectern boss, shelf books, no selection frame, hover effect, progressive offerings, and unlocked-resource rows. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-forbidden-grimoire-ritual-hub.md` | Ready for final `check-complete` pass after this evidence update. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Pressed debug resource key, clicked `Offrir`, then `Briser le sceau`; serpent book opened and next seal displayed. |
| Browser console/network check | yes | Record console/network state or N/A | Browser proof recorded `consoleMessages: []` and `failedRequests: []`. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Screenshots: `docs/plans/2026-06-26-forbidden-grimoire-ritual-hub-initial.png`, `...-hover.png`, `...-offered.png`, `...-seal-broken.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read source files and filled plan gates | implementation |
| Implementation | complete | Added generated 4/4/2 hub image, forbidden grimoire state/actions/content, Phaser ritual panel, hover polish, and resource icon overlays. | verification |
| Verification | complete | Typecheck, build, focused test, and Chrome browser proof passed. | closeout |
| Closeout | complete | Evidence recorded and final handoff ready. | final response |

Findings:
- Current state/actions only support direct book unlocking; there is no forbidden-grimoire progression owner.
- Existing resource icons can be reused for ritual requirement rows.
- The Phaser hub is currently built around a generated background plate plus hit overlays, so the new layout should keep a stable generated plate and put stateful UI/effects in Phaser.

Decisions and tradeoffs:
- Model the forbidden grimoire in simulation state first; Phaser renders and dispatches actions.
- Use generated art for atmosphere/layout, but keep progress bars/buttons/text in Phaser for reliability and localization.
- Use manual progressive offering with a separate final break-seal action, matching the user's A then B choices.

Timeline:
- 2026-06-26T16:51:33.896Z: plan created.
- 2026-06-26: active goal created and plan filled from user requirements.

Verification evidence:
- `npm run typecheck` passed.
- `npm run build` passed; Vite emitted only the chunk-size warning.
- `npx tsx tests/forbiddenGrimoire.test.ts` passed with `forbiddenGrimoire ok`.
- Browser proof used system Chrome because repo-preferred browser-use was not exposed in this session; no console or network errors were recorded.
- Proof screenshots: `docs/plans/2026-06-26-forbidden-grimoire-ritual-hub-initial.png`, `docs/plans/2026-06-26-forbidden-grimoire-ritual-hub-hover.png`, `docs/plans/2026-06-26-forbidden-grimoire-ritual-hub-offered.png`, `docs/plans/2026-06-26-forbidden-grimoire-ritual-hub-seal-broken.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Forbidden grimoire boss hub with progressive manual offerings |
| What have I learned? | Generated art works best as atmosphere; Phaser overlays are needed for reliable readable game icons and interaction. |
| What have I done? | Implemented the new boss hub, generated art, progressive offerings, hover selection, and verification evidence. |

Open risks:
- The repo-preferred browser-use tool was not exposed, so browser proof used system Chrome through the available Node/Playwright control.
