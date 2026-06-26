# blackjack incremental bonuses v1

Objective:
Implement blackjack incremental bonuses V1; done when tests/build and browser proof pass; plan docs/plans/2026-06-26-blackjack-incremental-bonuses-v1.md.

Goal plan:
docs/plans/2026-06-26-blackjack-incremental-bonuses-v1.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: delegated execution thread
- id / link: blackjack-incremental-bonuses-v1
- title: Blackjack incremental bonuses V1
- acceptance criteria: fast blackjack hands with bankroll/main bet/side bonuses/bonus XP/upgrades/debt, scoped to existing repo patterns, verified with tests/build/browser proof.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested.
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: final user closeout includes score confiance per repo instruction.

Completion threshold:
- V1 blackjack table supports pure blackjack start, bankroll, main bet from book upgrades, manual Pair and 21+3 side-bonus activation, side-bonus XP/upgrades/auto toggles, and soft-fail debt.
- Focused rules tests pass, TypeScript build passes, and blackjack UI is exercised in a browser or exact browser-tool blocker is recorded.

Verification surface:
- `npm run build`
- focused blackjack rules test under `tests/`
- browser proof on the Table du Blackjack surface, using repo-approved browser tooling when available.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: orchestrator V1 design plus existing `CONTEXT.md` vocabulary and current blackjack implementation.
- Allowed edit scope: blackjack simulation state/actions/rules, HUD rendering/control wiring, CSS, tests, this plan.
- Browser surface: Table du Blackjack book page.
- Tracker sync: N/A: no GitHub/Linear issue handoff requested.
- Non-goals: no flash objectives, no 10 bonuses, no complex auto strategy, no manual combat skills, no rigged deck, no massive talent tree, no PR unless requested.

Current verdict:
- verdict: valid feature request
- confidence: 82/100 at intake
- next owner: task
- reason: existing blackjack surface is present and scoped replacement is feasible.

Pre-solution issue challenge:
- reporter claim: current mini blackjack should become a V1 playable incremental-bonus loop.
- suggested diagnosis or fix: replace old reroll-skill progression with bankroll, side bets, XP upgrades, and debt.
- repro ladder:
  - tests / source-level repro: N/A: feature work, not a bug report.
  - repo-owned automated browser or integration proof: use build and browser smoke after implementation.
  - Browser plugin: try repo-approved browser-use first for proof; record blocker if unavailable.
  - screenshot / visual proof: use if browser proof is possible.
- reproduction verdict: N/A: feature request.
- validity verdict: valid
- best long-term fix boundary: blackjack simulation owns rules/state; HUD renders the existing book page.
- harsh honest feedback: keeping old reroll skills beside the requested bonus economy would be muddled. Replace the blackjack slice instead.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if package install/build is broken beyond this feature, browser tooling is unavailable after local proof attempts, or existing unrelated dirty files block safe scoped edits.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-incremental-bonuses-v1.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | copied orchestrator requirements into Task source, Completion threshold, Boundaries, and Non-goals before implementation |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | `get_goal` returned none, then `create_goal` created active goal |
| Source of truth read before edits | yes | read `CONTEXT.md`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`, prior blackjack plan |
| Acceptance criteria captured | yes | see Task source and Completion threshold |
| Pre-solution issue challenge required | no | N/A: feature request, not public bug claim |
| Reproduction verdict before implementation | no | N/A: feature request |
| Repro escalation ladder selected | no | N/A: feature request |
| Suggested fix reviewed against durable boundary | yes | blackjack rules/state/actions/HUD are the durable boundary |
| TDD decision before behavior change or bug fix | yes | use focused rules tests for side-bonus, debt, and hand-value behavior |
| Browser proof decision for browser surface | yes | attempt browser-use first; if unavailable, report exact blocker and use available practical proof |
| Browser pack selected | yes | UI/book page changes affect real browser surface |
| Browser route / app surface identified | yes | Vite root app, Table du Blackjack book page |
| Browser tool decision recorded | yes | browser-use required by repo; tool not exposed yet, will search before proof |

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
| Named verification threshold | yes | Run the named proof or record blocker | rules tests, full tests, typecheck, build, HTTP smoke passed; browser-use interaction proof blocked |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: feature request, verdict valid |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: feature request |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature request |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `/Users/joellebeyens/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --experimental-strip-types tests/blackjackRules.test.ts` passed |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; Vite chunk-size warning only |
| Browser surface changed | yes | Capture browser proof | browser-use unavailable after two `tool_search` attempts; `curl -I http://127.0.0.1:5174/` returned `HTTP/1.1 200 OK` |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint/format script in `package.json` |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | diff audit confirmed scoped blackjack rules/state/actions/HUD/CSS/test/plan changes; unrelated dirty workspace left untouched |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-incremental-bonuses-v1.md` | `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-incremental-bonuses-v1.md` passed |
| Browser interaction proof | no | Exercise target route/interaction or record blocker | Blocked: browser-use plugin/tool was not exposed by tool discovery; repo forbids substituting Playwright/Puppeteer/raw DevTools |
| Browser console/network check | no | Record console/network state or N/A | N/A due browser-use blocker; HTTP server responded 200 |
| Browser final proof artifact | no | Record screenshot/trace/route proof or exact caveat | No screenshot/trace because browser-use unavailable |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read source, context, prior blackjack plan, and skill instructions | implementation |
| Implementation | complete | added `blackjackRules.ts`, updated blackjack state/actions/HUD/CSS, added test | verification |
| Verification | complete | tests, typecheck, build, HTTP smoke passed; browser-use proof blocked | closeout |
| Closeout | complete | final evidence recorded | final response |

Findings:
- Existing blackjack has card rendering, actions, auto-redeal, and old reroll skills.
- Prior blackjack plan implemented reroll/dealer reveal/ace bias; this V1 needs bonus economy instead, so replacement is cleaner than layering.
- Project autogoal helper is not installed under repo `.agents`; used `/Users/joellebeyens/.agents/skills/autogoal/scripts/create-goal-scratchpad.mjs`.
- Browser-use is not exposed in this child thread after two `tool_search` attempts; available tools exposed node_repl/Figma/Linear, but repo instructions forbid substituting Playwright/Puppeteer/raw DevTools for browser usage.

Decisions and tradeoffs:
- Use a new blackjack rules module as the small testable interface; keep state mutation in actions and rendering in HUD.
- Use Jetons/chips as the bankroll because CONTEXT defines Jetons as the blackjack unique resource.
- Main bet comes from book level so the existing upgrade path increases bet without a per-hand bet slider.
- Start with 50 Jetons and Pair unlock at 80 Jetons so the first hands are pure blackjack and not immediate debt/bonus play.

Timeline:
- 2026-06-26T14:24:45.997Z: plan created.
- 2026-06-26: branch `codex/blackjack-incremental-bonuses-v1` created.
- 2026-06-26: active goal created.
- 2026-06-26: implemented blackjack V1 bankroll, main bet, Pair, 21+3, XP upgrades, auto toggles, and debt routing.
- 2026-06-26: full tests/typecheck/build passed.
- 2026-06-26: dev server started on `http://127.0.0.1:5174/`; HTTP smoke returned 200.

Verification evidence:
- `/Users/joellebeyens/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --experimental-strip-types tests/blackjackRules.test.ts` -> passed.
- `for file in tests/*.test.ts; do ...; done` with Codex Node -> all six tests passed.
- `npm run typecheck` -> passed.
- `npm run build` -> passed with only Vite chunk-size warning.
- `curl -sS -I http://127.0.0.1:5174/` -> `HTTP/1.1 200 OK`.
- Browser-use proof -> blocked because browser-use tool/plugin unavailable in this thread and repo forbids Playwright/Puppeteer substitution.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Implement blackjack incremental bonuses V1 |
| What have I learned? | Existing blackjack table can support V1 by replacing the old reroll skills with side-bonus tracks |
| What have I done? | Implemented V1, verified tests/typecheck/build/server smoke, recorded browser-use blocker |

Open risks:
- Browser interaction proof is missing because browser-use is unavailable in this child thread.
- Worktree contains unrelated dirty files, including `AGENTS.md`, `.agents/skills/**`, `src/phaser/scenes/LibraryScene.ts`, and several prior plan/image files; ignored per repo instruction.
