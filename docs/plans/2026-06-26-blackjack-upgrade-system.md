# blackjack upgrade system

Objective:
Blackjack upgrade system includes planned V1 upgrade tracks and visible effects; done when focused tests, typecheck, build, and plan gates pass.

Goal plan:
docs/plans/2026-06-26-blackjack-upgrade-system.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: user prompt
- id / link: chat
- title: Improve Blackjack upgrade system with all reflected upgrades
- acceptance criteria: upgrade UI exposes the planned V1 upgrade tracks; each upgrade has a real gameplay/economy effect; Pair and 21+3 progression are clear; verification passes.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: no timed checkpoint requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Done when Table du Blackjack upgrade page exposes: main bet upgrade, Pair unlock/progression, 21+3 unlock/progression, explicit upcoming effects per level, auto toggles when unlocked, and each progression effect is backed by rules tested through focused behavior tests.

Verification surface:
- Focused tests: blackjack rules/action tests bundled through esbuild and run with node.
- Static checks: `npm run typecheck`, `npm run build`, `git diff --check`.
- Browser proof: required by surface, but repo says use browser-use first and no substitute; record blocker if unavailable.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `CONTEXT.md`, `src/game/simulation/blackjackRules.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`.
- Allowed edit scope: blackjack rules/state/actions, blackjack HUD upgrade UI, focused blackjack tests, this plan.
- Browser surface: Table du Blackjack book page and upgrade page.
- Tracker sync: N/A, no tracker requested.
- Non-goals: no complex talent tree, no extra side bonuses, no rigged deck, no strategy automation, no PR/commit/push unless requested.

Current verdict:
- verdict: complete
- confidence: 90/100
- next owner: user
- reason: Upgrade tracks are implemented, tested, typechecked, and built; browser-use proof remains unavailable in this thread.

Pre-solution issue challenge:
- reporter claim: Upgrade page is too thin and should include all planned upgrades.
- suggested diagnosis or fix: Add explicit upgrade tracks/effects for main bet, Pair, and 21+3.
- repro ladder:
  - tests / source-level repro: existing UI only exposes coarse main bet and generic bonus cards; rules need explicit tested effects.
  - repo-owned automated browser or integration proof: N/A before implementation.
  - Browser plugin: browser-use availability will be checked before closeout.
  - screenshot / visual proof: user screenshot shows only Mise principale, Pair, 21+3 cards.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: blackjack rules metadata plus upgrade UI rendering from that metadata.
- harsh honest feedback: the current page is not enough; it hides the progression, so the player cannot understand why to invest.
- hard-stop decision: proceed with implementation.

Blocked condition:
- Stop only if blackjack source cannot compile after scoped changes or if browser-use proof is unavailable; browser-use absence is a proof blocker, not an implementation blocker.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-system.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | This plan captures upgrade UI/effects request and non-goals. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | `create_goal` created active goal for this plan. |
| Source of truth read before edits | yes | `CONTEXT.md`, blackjack rules/actions/HUD inspected. |
| Acceptance criteria captured | yes | See task source and completion threshold. |
| Pre-solution issue challenge required | yes | Valid UI/progression gap recorded. |
| Reproduction verdict before implementation | yes | Valid from screenshot plus source audit. |
| Repro escalation ladder selected | yes | Source/test first; browser-use proof if available. |
| Suggested fix reviewed against durable boundary | yes | Implement in blackjack rules metadata and HUD. |
| TDD decision before behavior change or bug fix | yes | Use focused tests for upgrade effects. |
| Browser proof decision for browser surface | yes | Try browser-use; no substitutes per repo rule. |

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

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `blackjackRules.test.ts`, `blackjackActions.test.ts`, `npm run typecheck`, `npm run build` passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid; implemented in blackjack rules/actions/HUD. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit plus screenshot; browser-use unavailable. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Feature/UX upgrade request, not a bug. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | esbuild bundled tests both passed. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | blocked | Capture browser proof | `browser-use` not exposed by tool search; repo forbids Playwright/Puppeteer/DevTools substitutes. HTTP 200 checked on localhost. |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `git diff --check` passed for scoped files. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Source audit confirms explicit steps, effects, UI list, tests. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-system.md` | Passed with `[autogoal] complete`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | `CONTEXT.md`, blackjack rules/actions/HUD/CSS/tests read. | implementation |
| Implementation | complete | Upgrade metadata/effects/UI/tests patched. | verification |
| Verification | complete | Focused tests, typecheck, build, diff check passed; browser-use unavailable. | closeout |
| Closeout | complete | Plan updated with verification evidence. | final response |

Findings:
- Upgrade effects were previously real but too generic and hidden; explicit rule metadata now makes the progression understandable.
- Pair now has named progression: unlock, payout, XP, miss refund, Auto Pair.
- 21+3 now has named progression: unlock, payout, XP, jackpot boost, Auto 21+3.

Decisions and tradeoffs:
- Kept V1 compact: no talent tree and no extra bonus types.
- Implemented 21+3 level 4 as a jackpot boost for Straight Flush and Suited Trips, because 21+3 already has rare jackpot-like outcomes.
- Did not use Playwright for screenshot proof because repo instructions require browser-use first and forbid substitutes.

Timeline:
- 2026-06-26T14:57:40.649Z: plan created.
- 2026-06-26T15:00Z: added focused rule/action tests for upgrade effects.
- 2026-06-26T15:01Z: implemented explicit upgrade rules and upgrade page list UI.
- 2026-06-26T15:02Z: verification passed except browser-use proof blocker.

Verification evidence:
- command: `./node_modules/.bin/esbuild tests/blackjackRules.test.ts --bundle --platform=node --format=esm --outfile=/tmp/blackjackRules.test.mjs >/dev/null && node /tmp/blackjackRules.test.mjs` passed with `blackjackRules ok`.
- command: `./node_modules/.bin/esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/blackjackActions.test.mjs >/dev/null && node /tmp/blackjackActions.test.mjs` passed with `blackjackActions ok`.
- command: `npm run typecheck` passed.
- command: `npm run build` passed.
- command: `git diff --check -- src/game/simulation/blackjackRules.ts src/game/simulation/actions.ts src/ui/hud.ts src/style.css tests/blackjackRules.test.ts tests/blackjackActions.test.ts docs/plans/2026-06-26-blackjack-upgrade-system.md` passed.
- command: `curl -I --max-time 3 http://127.0.0.1:5174/` returned HTTP 200.
- source-audit: `rg -n "blackjackBonusUpgradeSteps|blackjackPayoutMultiplier\\(|blackjackMissRefund\\(|blackjackCurrentBonusEffectLabel|is-blackjack-upgrade|Doubler|Diviser" ...` found rules, UI, CSS, and tests.
- browser: blocked because `browser-use` is unavailable in this thread and substitutes are disallowed.
- command: `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-system.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Closeout |
| What is the goal? | Blackjack upgrade system includes planned V1 upgrade tracks and visible effects. |
| What have I learned? | The upgrade page needed explicit track communication, not more mechanics. |
| What have I done? | Implemented rules metadata/effects, HUD list rendering, focused tests, and verification. |

Open risks:
- Browser visual proof not captured because `browser-use` is not exposed.
