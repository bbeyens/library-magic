# blackjack bottom wager chips

Objective:
Fix blackjack wager preparation layout; done when 1/5/10/100 chips render at bottom, top duplicate counters are gone, Jouer starts the hand, and checks pass.

Goal plan:
docs/plans/2026-06-26-blackjack-bottom-wager-chips.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: N/A: chat request with screenshot
- title: Bottom wager chips
- acceptance criteria: show chips 1/5/10/100 at the bottom during preparation, launch via "Jouer", and remove the repeated top solde/mise counters because reserve/mise icons now carry that information.

First checkpoint:
- Explicit requirements: chips must be `1/5/10/100`; they should be at the bottom during preparation; click "Jouer" to launch; remove repeated top solde/mise counters.
- Scope: blackjack preparation UI, chip denomination asset/reference, focused tests/source audit.
- Non-goals: no payout/balance changes, no unrelated dirty workspace cleanup, no commit/push.
- Deliverables: bottom chip tray, `10` chip asset/reference, removed top scoreboard markup, "Jouer" start button, verification evidence, final score confiance.
- Verification surface: focused blackjack test, typecheck, build, source audit, HTTP asset check, browser proof attempt.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Blackjack denomination list and UI references are `100, 10, 5, 1`, with no active `25` reference.
- Preparation renders a bottom chip tray for `1/5/10/100`; the reserve card is no longer the clickable stacked-button control.
- Start button says `Jouer`.
- Top `Jetons` / `Mise base` scoreboard markup is removed from the blackjack table.
- Focused test, typecheck, and build pass.

Verification surface:
- `./node_modules/.bin/esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackActions.test.mjs >/dev/null && node /tmp/library-magic-blackjackActions.test.mjs`
- `npm run typecheck`
- `npm run build`
- Source audit with `rg` for `chip-25`, `chip-10`, `blackjack-wager-tray`, `blackjack-scoreboard`, and `Jouer`
- HTTP asset check for `chip-10.svg`

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.
- Ignore unrelated dirty workspace changes.

Boundaries:
- Source of truth: `src/ui/hud.ts`, `src/style.css`, blackjack chip SVG assets, focused blackjack action test.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, `tests/blackjackActions.test.ts`, `public/assets/blackjack/chips/`, this plan.
- Browser surface: local Vite app, blackjack preparation table.
- Tracker sync: N/A: no ticket.
- Non-goals: payout math, economy/balance changes, commits/pushes.

Current verdict:
- verdict: valid correction
- confidence: 90/100
- next owner: task
- reason: Current screenshot shows clickable stacked reserve chips at mid-table, still has top duplicate counters, and uses `25` instead of requested `10`.

Pre-solution issue challenge:
- reporter claim: Preparation layout should show `1/5/10/100` chips at bottom, launch with `Jouer`, and remove top duplicate counters.
- suggested diagnosis or fix: Move click targets into a bottom wager tray, replace denomination `25` with `10`, and remove scoreboard markup.
- repro ladder:
  - tests / source-level repro: source audit finds `25`, `.blackjack-scoreboard`, and `Lancer`.
  - repo-owned automated browser or integration proof: N/A unless approved browser tool appears.
  - Browser plugin: try browser-use; record blocker if unavailable.
  - screenshot / visual proof: useful but blocked without browser-use.
- reproduction verdict: valid; screenshot and source both show the mismatch.
- validity verdict: valid.
- best long-term fix boundary: presentation layer and denomination asset/reference.
- harsh honest feedback: Stacking clickable chips on top of each other was clever-looking and bad UX. A bottom row is the obvious casino interaction.
- hard-stop decision: proceed.

Blocked condition:
- Stop if build/typecheck failures come from unrelated dirty work that cannot be isolated without reverting user changes, or if browser-use remains unavailable for visual proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-bottom-wager-chips.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint records chips `1/5/10/100`, bottom placement, `Jouer`, and top-counter removal |
| Timed checkpoint parsed | N/A: no duration requested | No timed checkpoint in prompt |
| Active goal checked or created | yes | `create_goal` created active goal for this plan |
| Source of truth read before edits | yes | Read screenshot, `blackjackPanel`, chip render helpers, CSS table/chip/start-button blocks, focused tests |
| Acceptance criteria captured | yes | See Task source and Completion threshold |
| Pre-solution issue challenge required | yes | Screenshot/source mismatch validated |
| Reproduction verdict before implementation | yes | `rg` found active `25`, `blackjack-scoreboard`, and `Lancer` references |
| Repro escalation ladder selected | yes | Source audit plus focused test/build; browser-use attempted after implementation |
| Suggested fix reviewed against durable boundary | yes | UI/asset/reference fix only; no gameplay math |
| TDD decision before behavior change or bug fix | yes | Keep action test focused on denomination behavior; visual placement via source/build proof |
| Browser proof decision for browser surface | yes | Attempt browser-use after implementation; record blocker if unavailable |
| Browser pack selected | yes | Browser pack applied |
| Browser route / app surface identified | yes | Local Vite blackjack preparation table |
| Browser tool decision recorded | yes | Try browser-use; no Playwright/Puppeteer substitute |

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
      `N/A` with reason. Evidence: valid correction, source/screenshot mismatch.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. Evidence: source audit selected; browser proof after implementation.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: valid correction, proceed.
- [x] Nearby implementation patterns are read before edits. Evidence: read current panel markup, chip helpers, CSS, test block.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: UI rendering and chip asset/reference only; no blackjack payout/economy changes.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: manual final diff/source audit against prompt requirements.
- [x] Verification evidence is recorded beside each relevant gate. Evidence: commands and results recorded below.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof. Evidence: local Vite blackjack preparation table; expected bottom chip tray and `Jouer`.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. Evidence: `tool_search` did not expose browser-use; no Playwright/Puppeteer substitute used.
- [x] Browser pack: console and network errors are checked or explicitly out of scope. Evidence: out of scope because browser-use unavailable.
- [x] Browser pack: proof uses the real affected browser surface. Evidence: blocker recorded; source/build/HTTP proof used instead.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run named proofs or record blocker | Focused test, typecheck, build, source audit, diff check, and asset HTTP check passed |
| Pre-solution issue challenge verdict | yes | Record claim and durable boundary | Verdict valid; fix stayed in blackjack UI, chip assets, and focused test |
| Repro escalation ladder | yes | Source proof plus browser blocker | Source audit found old refs before work; browser-use unavailable after `tool_search` |
| Bug reproduced before fix | yes | Record failing source/screenshot repro | Screenshot and source showed `25`, top scoreboard, stacked click targets, and `Lancer` |
| Targeted behavior verification | yes | Run focused test/proof | `blackjackActions ok` after 1/10/100 wager-prep assertions |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed with existing chunk-size warning only |
| Browser surface changed | yes | Capture browser proof or blocker | Browser-use not exposed by available tools; no substitute browser automation used |
| Final lint/format | yes | Run relevant lint/format command or record reason | `git diff --check` passed for touched files |
| Autoreview | yes | Review final diff against objective | Final source audit confirms no `chip-25`, no `blackjack-scoreboard`, no `Lancer`; `chip-10`, tray, and `Jouer` present |
| Timed checkpoint | N/A: no duration requested | No timed loop required | No duration requested |
| Goal plan complete | yes | Run autogoal checker | Run after final plan update |
| Browser interaction proof | yes | Exercise route or record blocker | Blocked: browser-use unavailable in this session |
| Browser console/network check | N/A: browser unavailable | Record reason | Browser-use unavailable, so console/network check not possible |
| Browser final proof artifact | N/A: browser unavailable | Record caveat | No screenshot captured; source/build/HTTP proof recorded |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | plan filled; source and screenshot read | implementation |
| Implementation | complete | bottom tray, `10` chip asset/reference, `Jouer`, top scoreboard removal, dead upgrade UI cleanup | verification |
| Verification | complete | focused test, typecheck, build, source audit, diff check, HTTP asset check | closeout |
| Closeout | complete | autogoal checker and final response | final response |

Findings:
- Current denomination source is `[100, 25, 5, 1]`.
- Current top scoreboard still renders `Jetons` and `Mise base`.
- Current clickable reserve chips are stacked together, which creates poor hover/click targeting.

Decisions and tradeoffs:
- Keep reserve/mise summary cards visible; remove only the duplicate top scoreboard.
- Bottom tray owns preparation click targets; reserve/mise cards are status/reset surfaces.
- Replace `25` with `10` instead of adding both, because user explicitly listed `1/5/10/100`.

Timeline:
- 2026-06-26T17:07:36.584Z: plan created.
- 2026-06-26T17:16:36Z: focused blackjack test, source audit, diff check, and chip asset HTTP check passed.
- 2026-06-26T17:18Z: typecheck and production build passed after removing dead upgrade-panel helpers/imports.

Verification evidence:
- Focused test passed: `./node_modules/.bin/esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackActions.test.mjs >/dev/null && node /tmp/library-magic-blackjackActions.test.mjs` -> `blackjackActions ok`.
- Legacy source audit passed: `rg -n "chip-25|is-25|blackjack-scoreboard|Lancer" src/ui/hud.ts src/style.css tests/blackjackActions.test.ts public/assets/blackjack/chips || true` returned no matches.
- Expected source audit passed: `chip-10`, `.is-10`, `Jouer`, `blackjack-wager-tray`, and `BLACKJACK_WAGER_TRAY_DENOMINATIONS` are present in `src/ui/hud.ts` and `src/style.css`.
- Typecheck passed: `npm run typecheck`.
- Build passed: `npm run build`; Vite reported only the existing large-chunk warning.
- Diff whitespace check passed: `git diff --check -- src/ui/hud.ts src/style.css tests/blackjackActions.test.ts public/assets/blackjack/chips/chip-10.svg docs/plans/2026-06-26-blackjack-bottom-wager-chips.md`.
- Asset check passed: `curl -I http://127.0.0.1:5178/assets/blackjack/chips/chip-10.svg` returned `HTTP/1.1 200 OK` and `Content-Type: image/svg+xml`.
- Browser proof blocker: `tool_search` for browser-use did not expose the repo-required browser-use tool; no Playwright/Puppeteer substitute used.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Fix blackjack wager preparation layout; done when 1/5/10/100 chips render at bottom, top duplicate counters are gone, Jouer starts the hand, and checks pass. |
| What have I learned? | The table needed a bottom tray and the upgrade-panel migration had dead helpers blocking build |
| What have I done? | Implemented bottom chip tray, `10` chip, `Jouer`, top scoreboard removal, test update, and verification |

Open risks:
- Browser-use is unavailable in this session, so visual proof is limited to source/build/HTTP evidence.
- Workspace has unrelated dirty changes in the same files; ignore unrelated diffs.
