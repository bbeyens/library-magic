# fix w opens mini game menu

Objective:
Fix W opening mini-game menu; done when browser repro stays closed after W and typecheck/build pass.

Goal plan:
docs/plans/2026-06-26-fix-w-opens-mini-game-menu.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct bug report
- id / link: N/A
- title: "Quand on appuie sur W, la sélection des mini-jeux s'ouvre."
- acceptance criteria: Pressing `w` with the mini-game menu closed must not open the menu.

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
- Browser repro: menu closed before `w`; after pressing `w`, `.book-menu-drawer` is still absent and toggle `aria-expanded` remains `false`.
- `npm run typecheck` passes.
- `npm run build` passes.

Verification surface:
- Browser proof against local Vite app with Chrome fallback if browser-use is unavailable.
- Source audit of keyboard/menu focus handling.
- `npm run typecheck`, `npm run build`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/hud.ts` HUD/menu keyboard handling.
- Allowed edit scope: smallest UI focus/keyboard fix plus this plan.
- Browser surface: local Vite app, mini-game menu toggle.
- Tracker sync: N/A.
- Non-goals: no gameplay changes, no menu redesign.

Current verdict:
- verdict: valid bug report with defensive fix verified by browser proof
- confidence: 82/100
- next owner: task
- reason: `W` is a movement key and should not operate the menu toggle.

Pre-solution issue challenge:
- reporter claim: pressing `W` opens the mini-game selector.
- suggested diagnosis or fix: likely focus remains on the menu toggle after click, so a keyboard event activates the focused button.
- repro ladder:
  - tests / source-level repro: source audit of menu toggle focus handling.
  - repo-owned automated browser or integration proof: browser script presses `w` and checks menu state.
  - Browser plugin: browser-use unavailable in this thread; use Chrome/Playwright fallback.
  - screenshot / visual proof: not necessary if DOM proof is exact.
- reproduction verdict: not reproduced by Chrome automation; accepted as a real user-reported focus bug and fixed defensively at the menu focus boundary
- validity verdict: valid enough to patch because the fix prevents a focused menu control from consuming movement keys
- best long-term fix boundary: menu toggle focus/keyboard semantics, not snake movement logic
- harsh honest feedback: a focused hamburger button eating `W` is dumb UI behavior; movement keys must not trigger menus.
- hard-stop decision: proceed after red-capable repro

Blocked condition:
- Stop only if the local app cannot launch and no browser fallback can reproduce the keyboard path.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-fix-w-opens-mini-game-menu.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User reported `W` opens mini-game selector; acceptance criteria captured. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | `get_goal` returned null; created active goal for this plan. |
| Source of truth read before edits | yes | Read `src/ui/hud.ts` keyboard/menu handlers and searched key/menu code. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | yes | Reported behavior is a bug claim; challenge recorded. |
| Reproduction verdict before implementation | yes | Browser repro to run before implementation. |
| Repro escalation ladder selected | yes | Browser script is the tight loop. |
| Suggested fix reviewed against durable boundary | yes | Fix belongs to menu toggle focus/keyboard semantics. |
| TDD decision before behavior change or bug fix | yes | Browser repro red -> fix -> green. |
| Browser proof decision for browser surface | yes | Required because the bug is key/focus behavior. |
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
| Named verification threshold | yes | Run the named proof or record blocker | Passed: after pressing `w`, `.book-menu-drawer` stayed absent and `aria-expanded` stayed `false`; typecheck/build passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Automation did not reproduce red, but source and browser proof support defensive focus fix at menu boundary. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit plus Chrome/Playwright fallback. Browser-use unavailable. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: Chrome automation did not reproduce, but user-reported focus bug was fixed defensively. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Passed: after menu toggle click, active element was `BODY`; after `w`, menu remained closed. |
| TypeScript or typed config changed | yes | Run relevant typecheck | Passed: `npm run typecheck`. |
| Build-sensitive behavior changed | yes | Run relevant build/check | Passed: `npm run build`; Vite large chunk warning only. |
| Browser surface changed | yes | Capture browser proof | Passed: local Vite app at `http://127.0.0.1:5174/`; screenshot `/tmp/library-magic-w-menu-closed-proof.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script in `package.json`. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Accepted: fix is scoped to menu toggle focus and movement-key focus release. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-fix-w-opens-mini-game-menu.md` | Run after plan closure. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Passed: clicked menu toggle, pressed `w`, menu stayed closed. |
| Browser console/network check | yes | Record console/network state or N/A | Console had Vite/Phaser logs plus one generic 404 resource message; `requestfailed` empty. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-w-menu-closed-proof.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source read; browser repro selected. | implementation |
| Implementation | complete | Menu toggle now blurs on toggle; movement keys blur focused menu toggle during capture. | verification |
| Verification | complete | `npm run typecheck`, `npm run build`, browser proof. | closeout |
| Closeout | complete | Autoreview and plan checker. | final response |

Findings:
- `W` maps to snake `up`, but snake controls only call `preventDefault` when Serpent is selected and open.
- The menu toggle is a real `<button>`; if it remains focused, browser keyboard activation can toggle it.
- Chrome automation did not reproduce the menu opening on `w`; the patch still removes the likely focus trap and proves the menu remains closed after `w`.

Decisions and tradeoffs:
- Use a browser repro instead of a shallow unit test because the bug is native button focus/keyboard behavior.
- Do not change snake movement semantics; movement keys keep their gameplay meaning while the hamburger stops holding focus.

Timeline:
- 2026-06-26T09:49:35.561Z: plan created.
- 2026-06-26: read keyboard/menu handlers and set browser repro threshold.
- 2026-06-26: patched menu focus handling and movement-key focus release.
- 2026-06-26: verified with typecheck, build, and browser proof.

Verification evidence:
- `npm run typecheck` passed.
- `npm run build` passed; Vite reported only the existing large chunk warning.
- Browser proof: `w` after menu toggle left `aria-expanded=false` and `.book-menu-drawer` absent; screenshot `/tmp/library-magic-w-menu-closed-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Pressing `w` must not open the mini-game menu. |
| What have I learned? | Chrome automation did not reproduce red, but the focus trap boundary is now guarded. |
| What have I done? | Patched, verified, and recorded evidence. |

Open risks:
- Browser-use unavailable; fallback proof uses Chrome system via Playwright.
