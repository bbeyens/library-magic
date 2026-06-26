# w toggles mini game menu

Objective:
Make W toggle the mini-game selector; done when browser proof shows W opens then closes the menu and checks pass.

Goal plan:
docs/plans/2026-06-26-w-toggles-mini-game-menu.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user correction
- id / link: N/A
- title: "W ouvre le menu; si le menu est actif, W le désactive aussi."
- acceptance criteria: Pressing `W` opens the hamburger mini-game selector when closed and closes it when open.

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
- Browser proof: menu closed before first `W`, open after first `W`, closed after second `W`.
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
- Non-goals: no menu redesign, no unrelated gameplay changes.

Current verdict:
- verdict: valid user correction
- confidence: 88/100
- next owner: task
- reason: User wants W to toggle the hamburger mini-game selector.

Pre-solution issue challenge:
- reporter claim: W should open the mini-game selector when closed and remove it when open.
- suggested diagnosis or fix: change the HUD-level W shortcut from open-only to toggle.
- repro ladder:
  - tests / source-level repro: source audit of menu key handler.
  - repo-owned automated browser or integration proof: browser script presses `w` twice and checks closed-open-closed.
  - Browser plugin: browser-use unavailable in this thread; use Chrome/Playwright fallback.
  - screenshot / visual proof: optional.
- reproduction verdict: current behavior should fail second-W close because handler is open-only.
- validity verdict: valid user-requested behavior.
- best long-term fix boundary: HUD menu shortcut.
- harsh honest feedback: Open-only was half the interaction; toggle is the obvious finished shortcut.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if local app cannot launch and no browser fallback can validate the W shortcut.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-w-toggles-mini-game-menu.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User wants W to toggle hamburger mini-game selector. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | Created active goal for this plan. |
| Source of truth read before edits | yes | Read `src/ui/hud.ts` menu and key handlers. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | no | N/A: user correction. |
| Reproduction verdict before implementation | yes | Browser red proof will check second W close before patch. |
| Repro escalation ladder selected | yes | Browser script is proof. |
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
| Named verification threshold | yes | Run the named proof or record blocker | Passed: browser proof showed closed -> open -> closed across two W presses; typecheck/build pass. |
| Pre-solution issue challenge verdict | no | Record verdict | N/A: user correction. |
| Repro escalation ladder | yes | Browser proof | Red before patch: second W left menu open; green after patch: second W closed menu. |
| Bug reproduced before fix | yes | Record failing test/repro | Red proof: closed -> open -> still open. |
| Targeted behavior verification | yes | Run focused proof | Green proof: closed -> open -> closed. |
| TypeScript or typed config changed | yes | Run relevant typecheck | Passed: `npm run typecheck`. |
| Build-sensitive behavior changed | yes | Run relevant build/check | Passed: `npm run build`; first run hit transient dist cleanup ENOTEMPTY, retry passed. |
| Browser surface changed | yes | Capture browser proof | Passed: `/tmp/library-magic-w-toggles-menu-proof.png`; DOM proof is closed-open-closed. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script in package.json. |
| Autoreview | yes | Review final diff/output | Accepted: one-line toggle behavior in HUD shortcut. |
| Timed checkpoint | no | N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-w-toggles-mini-game-menu.md` | Run after closure. |
| Browser interaction proof | yes | Exercise target route/interaction | Passed: W twice toggles menu closed-open-closed. |
| Browser console/network check | yes | Record console/network state | Console had Vite/Phaser logs plus generic 404; requestfailed empty. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof | `/tmp/library-magic-w-toggles-menu-proof.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source owner identified. | implementation |
| Implementation | complete | Changed W shortcut from open-only to toggle. | verification |
| Verification | complete | Red proof, typecheck, build, green browser proof. | closeout |
| Closeout | complete | Plan checker to run. | final response |

Findings:
- Current W handler opens the menu but returns early when it is already open.
- The correct owner is the HUD-level shortcut in `src/ui/hud.ts`.

Decisions and tradeoffs:
- `W` should toggle the selector; repeated W closes it instead of leaving it stuck open.

Timeline:
- 2026-06-26T10:09:57.341Z: plan created.
- 2026-06-26: captured toggle requirement and source owner.

Verification evidence:
- Red proof before patch: closed -> open -> still open.
- `npm run typecheck` passed.
- `npm run build` passed on retry after transient dist cleanup ENOTEMPTY.
- Green browser proof: closed -> open -> closed; screenshot `/tmp/library-magic-w-toggles-menu-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Pressing `W` toggles the mini-game selector closed-open-closed. |
| What have I learned? | Toggle is one-line state inversion in the existing W handler. |
| What have I done? | Implemented and verified closed-open-closed. |

Open risks:
- `W` is also a snake movement key; user explicitly gives selector toggle priority.
