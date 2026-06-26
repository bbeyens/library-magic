# w opens mini game menu

Objective:
Make W open the mini-game selector; done when browser proof shows W opens the menu and checks pass.

Goal plan:
docs/plans/2026-06-26-w-opens-mini-game-menu.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user correction
- id / link: N/A
- title: "Quand j'appuie sur W, ça ouvre ce bouton."
- acceptance criteria: Pressing `W` opens the hamburger mini-game selector.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: final response includes score confiance.

Completion threshold:
- Browser proof: menu closed before `W`; after pressing `W`, `.book-menu-drawer` exists and toggle `aria-expanded` is `true`.
- `npm run typecheck` passes.
- `npm run build` passes.

Verification surface:
- Browser proof against local Vite app.
- Source audit of `src/ui/hud.ts` W shortcut handling.
- `npm run typecheck`, `npm run build`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/hud.ts` HUD/menu keyboard handling.
- Allowed edit scope: smallest menu shortcut change plus this plan.
- Browser surface: local Vite app, hamburger mini-game selector.
- Tracker sync: N/A.
- Non-goals: no menu redesign, no gameplay rule changes except W shortcut priority.

Current verdict:
- verdict: valid user correction
- confidence: 86/100
- next owner: task
- reason: User explicitly wants W to open the hamburger mini-game selector.

Pre-solution issue challenge:
- reporter claim: W should open the hamburger mini-game selector.
- suggested diagnosis or fix: add a HUD-level keyboard shortcut that opens, not toggles, the menu.
- repro ladder:
  - tests / source-level repro: source audit of menu key handlers.
  - repo-owned automated browser or integration proof: browser script presses `w` and checks menu open.
  - Browser plugin: browser-use unavailable in this thread; use Chrome/Playwright fallback.
  - screenshot / visual proof: optional.
- reproduction verdict: current behavior should be red because previous fix keeps W from opening the menu.
- validity verdict: valid user-requested behavior.
- best long-term fix boundary: HUD menu shortcut.
- harsh honest feedback: We fixed the wrong direction earlier because the first wording sounded like a complaint. Now the intent is clear.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if local app cannot launch and no browser fallback can validate the W shortcut.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-w-opens-mini-game-menu.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User wants `W` to open hamburger mini-game selector. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | Created active goal for this plan. |
| Source of truth read before edits | yes | Read `src/ui/hud.ts` menu and key handlers. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | no | N/A: user correction, not a bug report requiring rejection. |
| Reproduction verdict before implementation | yes | Browser proof will show current W closed behavior. |
| Repro escalation ladder selected | yes | Browser script is the proof. |
| Suggested fix reviewed against durable boundary | yes | Fix belongs in HUD menu shortcut. |
| TDD decision before behavior change or bug fix | yes | Browser red -> patch -> green. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Applied browser pack. |
| Browser route / app surface identified | yes | Local Vite app. |
| Browser tool decision recorded | yes | browser-use unavailable; Chrome/Playwright fallback. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Passed: after pressing `w`, `.book-menu-drawer` exists and `aria-expanded=true`; typecheck/build pass. |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: user clarified desired behavior. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Browser red/green proof via Chrome/Playwright fallback. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Red proof before patch: `w` left menu closed. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Green proof after patch: `w` opens menu. |
| TypeScript or typed config changed | yes | Run relevant typecheck | Passed: `npm run typecheck`. |
| Build-sensitive behavior changed | yes | Run relevant build/check | Passed: `npm run build`; Vite large chunk warning only. |
| Browser surface changed | yes | Capture browser proof | Passed: screenshot `/tmp/library-magic-w-opens-menu-proof.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script in `package.json`. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Accepted: shortcut implemented in HUD key handler; no menu redesign. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-w-opens-mini-game-menu.md` | Run after plan closure. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Passed: menu closed before `w`, open after `w`. |
| Browser console/network check | yes | Record console/network state or N/A | Console had Vite/Phaser logs plus one generic 404 resource message; requestfailed empty. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-w-opens-menu-proof.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source owner identified. | implementation |
| Implementation | complete | Added `openBookMenuFromShortcut` for `W`. | verification |
| Verification | complete | Red proof, typecheck, build, green browser proof. | closeout |
| Closeout | complete | Plan checker to run. | final response |

Findings:
- Current code blurs the hamburger and movement keys do not open the menu.
- The correct owner is a HUD-level shortcut, because the requested target is the hamburger selector itself.
- Red proof before patch: `w` left `aria-expanded=false` and no drawer.
- Green proof after patch: `w` changed `aria-expanded=true` and drawer contained book entries.

Decisions and tradeoffs:
- `W` opens the menu rather than toggling it closed; repeated `W` while open is harmless.
- The handler ignores repeated W and modified shortcuts such as Ctrl-W, which avoids nasty browser-level conflicts.

Timeline:
- 2026-06-26T10:03:28.000Z: plan created.
- 2026-06-26: captured requirements and source owner.
- 2026-06-26: implemented and verified W shortcut.

Verification evidence:
- Red proof: before patch, `w` left menu closed.
- `npm run typecheck` passed.
- `npm run build` passed; Vite large chunk warning only.
- Green browser proof: `w` opened mini-game selector; screenshot `/tmp/library-magic-w-opens-menu-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Pressing `W` opens the mini-game selector. |
| What have I learned? | This is an intentional shortcut, not a bug to suppress. |
| What have I done? | Implemented, verified, and left the dev server running. |

Open risks:
- `W` is also a snake movement key; this request gives menu opening priority.
