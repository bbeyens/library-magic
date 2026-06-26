# blackjack chip wager preparation

Objective:
Add blackjack chip-click wager prep; done when wager reserve/reset behavior is tested, rendered, and checks pass.

Goal plan:
docs/plans/2026-06-26-blackjack-chip-wager-preparation.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: N/A: chat request with screenshot
- title: Blackjack chip wager preparation
- acceptance criteria: during preparation, chips are shown below; clicking a chip increases the wager; clicking the starting wager resets wager to 0 and returns all reserved chips.

First checkpoint:
- Explicit requirements: during preparation, show available chips below; clicking a chip increases the wager; clicking the starting wager resets the wager to 0 and returns all reserved chips.
- Scope: blackjack preparation state, UI interactions, focused tests.
- Non-goals: no payout rebalance, no new currency, no unrelated workspace cleanup, no commit/push.
- Deliverables: tested simulation actions, wired UI buttons, updated chip area styling, verification evidence, final score confiance.
- Verification surface: focused blackjack tests, typecheck, build, source audit, browser proof attempt.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- A focused test proves clicking/dispatching chip denominations moves chips from reserve into `blackjack.playerBet` while idle.
- A focused test proves resetting the starting wager returns the full prepared wager to `resources.chips` and sets `blackjack.playerBet` to 0.
- `dealBlackjack` uses the prepared wager and does not subtract it a second time.
- UI exposes clickable chips below during idle and a clickable stake reset target.
- `npm run typecheck` and `npm run build` pass.

Verification surface:
- `node --experimental-strip-types tests/blackjackActions.test.ts`
- `npm run typecheck`
- `npm run build`
- Source audit for new actions and `data-action` wiring
- Browser proof or explicit browser-use blocker

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.
- Ignore unrelated dirty workspace changes.

Boundaries:
- Source of truth: blackjack state/actions, `src/ui/hud.ts`, `src/style.css`, blackjack tests.
- Allowed edit scope: `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`, `tests/blackjackActions.test.ts`, this plan.
- Browser surface: local Vite app, blackjack book panel in idle/preparation.
- Tracker sync: N/A: no ticket.
- Non-goals: payout math, upgrade costs, generated chip art, commits/pushes.

Current verdict:
- verdict: valid feature request
- confidence: 86/100
- next owner: task
- reason: The screenshot shows the right visual direction, but the current model still treats idle stake as derived base bet rather than a user-prepared wager.

Pre-solution issue challenge:
- reporter claim: Preparation UX should use clickable chips and resettable starting wager.
- suggested diagnosis or fix: Use `blackjack.playerBet` as the prepared wager while phase is idle; reserve/return chips through explicit actions.
- repro ladder:
  - tests / source-level repro: focused action tests can prove the behavior.
  - repo-owned automated browser or integration proof: N/A unless browser tool available.
  - Browser plugin: try repo-approved browser-use; record blocker if unavailable.
  - screenshot / visual proof: useful but blocked if browser-use unavailable.
- reproduction verdict: valid feature request; existing source shows no click-to-wager action.
- validity verdict: valid.
- best long-term fix boundary: simulation actions own reserve/reset/deal behavior; UI only dispatches actions.
- harsh honest feedback: Doing this only in DOM state would be bullshit; the wager has to live in game state so deal/payouts stay honest.
- hard-stop decision: proceed with TDD.

Blocked condition:
- Stop if tests/build reveal unrelated pre-existing dirty changes that cannot be isolated without reverting user work, or if browser-use remains unavailable for visual proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-chip-wager-preparation.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint lists explicit requirements, scope, non-goals, deliverables, and success criteria |
| Timed checkpoint parsed | N/A: no duration requested | No timed checkpoint in prompt |
| Active goal checked or created | yes | `create_goal` created active goal for this plan |
| Source of truth read before edits | yes | Read blackjack action dispatch, deal/double/split/resolve code, state initialization, current UI chip rendering, current tests |
| Acceptance criteria captured | yes | See Task source and Completion threshold |
| Pre-solution issue challenge required | yes | Feature claim validated against source; no current click-to-wager action exists |
| Reproduction verdict before implementation | yes | Source-level verdict: missing behavior is valid |
| Repro escalation ladder selected | yes | TDD via action tests first; browser proof attempted after implementation |
| Suggested fix reviewed against durable boundary | yes | Simulation actions own reserve/reset/deal behavior; UI dispatches |
| TDD decision before behavior change or bug fix | yes | Use vertical TDD on `tests/blackjackActions.test.ts` |
| Browser proof decision for browser surface | yes | Attempt browser-use after implementation; record blocker if still unavailable |
| Browser pack selected | yes | Browser pack applied |
| Browser route / app surface identified | yes | Local Vite blackjack book panel, idle/preparation state |
| Browser tool decision recorded | yes | Try repo-approved browser-use first; no Playwright/Puppeteer substitute |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. Evidence: N/A, no duration.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason. Evidence: feature/behavior request validated through source read.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. Evidence: source-level verdict complete; test-first implementation next.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: verdict valid, proceed.
- [x] Nearby implementation patterns are read before edits. Evidence: read action union/dispatch, deal/double/split, blackjack state initialization, UI action wiring.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: simulation actions own wager reserve/reset/deal semantics; UI dispatches actions only.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: reviewed `prepareBlackjackWager`, `resetBlackjackWager`, `dealBlackjack`, chip UI buttons, and CSS button reset against the request.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof. Evidence: route `http://127.0.0.1:5178/`; interaction path is open blackjack in idle, click reserve chip, click stake stack; expected reserve decreases/stake increases/reset returns wager.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. Evidence: `tool_search` did not expose browser-use; node_repl/Playwright-adjacent tools were not used because repo forbids substitutes.
- [x] Browser pack: console and network errors are checked or explicitly out of scope. Evidence: console/network browser check blocked by missing browser-use; HTTP app and asset checks passed.
- [x] Browser pack: proof uses the real affected browser surface. Evidence: local Vite app is running and served HTTP 200; interactive proof blocked by missing browser-use.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Focused test passed; `npm run typecheck` passed; `npm run build` passed; source audit passed; HTTP app/SVG checks passed; browser-use missing blocks screenshot |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above; valid feature request |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | TDD action test first; browser-use unavailable for visual proof |
| Bug reproduced before fix | N/A: feature request | Record failing test/repro or N/A with reason | Test red confirmed missing public action behavior before implementation |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `./node_modules/.bin/esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackActions.test.mjs >/dev/null && node /tmp/library-magic-blackjackActions.test.mjs` passed |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Blocked: browser-use unavailable; local HTTP checks passed |
| Final lint/format | N/A: no lint script | Run relevant lint/format command or record N/A | `package.json` has no lint/format script; `git diff --check` passed for touched files |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Confirmed simulation owns wager accounting, UI dispatches actions, reset only applies in idle to avoid refund exploit |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No timed checkpoint |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-chip-wager-preparation.md` | Passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Blocker: browser-use unavailable from `tool_search`; no substitute used |
| Browser console/network check | yes | Record console/network state or N/A | Browser console/network blocked by missing approved tool; HTTP checks passed |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Caveat: no screenshot because approved browser tool unavailable |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created and filled plan; source read complete | implementation |
| Implementation | complete | Added wager prep/reset actions, deal prepared-wager handling, clickable chip UI, resettable stake UI, CSS button states | verification |
| Verification | complete | Red test failed first; focused test now passes; typecheck/build/source/HTTP checks pass | closeout |
| Closeout | complete | Final plan evidence recorded; checker pending | final response |

Findings:
- `dealBlackjack` currently derives stake from `blackjackCurrentMainBet(state)` and subtracts chips at deal time.
- `blackjack.playerBet` is unused in idle except as 0; it can own prepared wager without adding a new state field.
- UI action wiring already routes `data-action` buttons through `gameStore.dispatch`, so clickable chips can use new actions.

Decisions and tradeoffs:
- Prepared wager uses `blackjack.playerBet` during idle. That avoids a parallel model and lets existing payout fields keep meaning after deal starts.
- `blackjackCurrentMainBet` remains the unlocked/default bet size for upgrade/base-level systems. The prepared wager is separate during idle.
- Reset action is only meaningful during idle/preparation and returns `playerBet + splitBet` defensively.

Timeline:
- 2026-06-26T16:58:30.060Z: plan created.
- 2026-06-26T17:00Z: red test failed because `prepareBlackjackWager` behavior did not exist.
- 2026-06-26T17:01Z: implemented wager reserve/reset actions and prepared-wager deal handling.
- 2026-06-26T17:02Z: wired clickable reserve chips and resettable stake stack.
- 2026-06-26T17:03Z: focused blackjack action test passed.
- 2026-06-26T17:03Z: `npm run typecheck` passed after transient/intermediate import cleanup and relaunch.
- 2026-06-26T17:03Z: `npm run build` passed.
- 2026-06-26T17:04Z: HTTP checks for app and chip SVG returned 200.
- 2026-06-26T17:04Z: autogoal checker passed.

Verification evidence:
- Red: `./node_modules/.bin/esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackActions.test.mjs >/dev/null && node /tmp/library-magic-blackjackActions.test.mjs` failed with `0 !== 25` before implementation.
- Green: same focused command passed with `blackjackActions ok`.
- `npm run typecheck` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- `git diff --check -- src/game/simulation/actions.ts src/ui/hud.ts src/style.css tests/blackjackActions.test.ts docs/plans/2026-06-26-blackjack-chip-wager-preparation.md` passed.
- `rg -n "prepareBlackjackWager|resetBlackjackWager|data-wager-amount|blackjackChipToken|blackjackActiveStake" ...` found action, tests, and UI wiring.
- `curl -I http://127.0.0.1:5178/` returned HTTP 200.
- `curl -I http://127.0.0.1:5178/assets/blackjack/chips/chip-25.svg` returned HTTP 200 `image/svg+xml`.
- `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-chip-wager-preparation.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run mechanical checker, then final response |
| What is the goal? | Add blackjack chip-click wager prep; done when wager reserve/reset behavior is tested, rendered, and checks pass. |
| What have I learned? | See Findings |
| What have I done? | Implemented and verified wager prep/reset behavior; recorded browser-use blocker. |

Open risks:
- Interactive browser proof may remain blocked because `browser-use` was unavailable in the previous run.
- Workspace has unrelated dirty changes in the same files, so final diff must be described by touched behavior rather than full-file diff.
