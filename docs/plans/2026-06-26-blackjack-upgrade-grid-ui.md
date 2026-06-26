# blackjack upgrade grid ui

Objective:
Blackjack upgrade UX becomes a compact node grid with hover details; done when source audit, typecheck, build, and goal plan gate pass.

Goal plan:
docs/plans/2026-06-26-blackjack-upgrade-grid-ui.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: user prompt
- id / link: chat
- title: Rework Blackjack upgrade UI/UX
- acceptance criteria: replace large text-heavy upgrade cards with compact small cases/nodes; show explanations on hover/focus; preserve existing upgrade effects.

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
- Done when Blackjack upgrade detail panel uses compact grid/node UI for main bet, Pair, and 21+3, and each node has a hover/focus tooltip explaining the effect/cost/state.

Verification surface:
- Source audit for node grid classes and tooltip markup.
- `npm run typecheck`, `npm run build`, scoped `git diff --check`.
- Browser proof attempted with browser-use; record blocker if unavailable.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: current Blackjack upgrade rules and HUD panel.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, this plan.
- Browser surface: Table du Blackjack upgrade panel.
- Tracker sync: N/A.
- Non-goals: no economy rule changes, no new bonus types, no PR/commit/push.

Current verdict:
- verdict: complete
- confidence: 88/100
- next owner: user
- reason: Upgrade UI is now a compact node grid with hover/focus tooltips; typecheck/build/source audit pass; browser-use proof unavailable.

Pre-solution issue challenge:
- reporter claim: Current upgrade UI is unreadable/text-heavy; better as small cases with hover explanation.
- suggested diagnosis or fix: Convert to compact node grid with hover/focus tooltips.
- repro ladder:
  - tests / source-level repro: source shows long `<ul>` text embedded inside large upgrade cards.
  - repo-owned automated browser or integration proof: N/A before implementation.
  - Browser plugin: browser-use will be checked.
  - screenshot / visual proof: user screenshot shows overflowing text-heavy cards.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: HUD rendering/CSS only.
- harsh honest feedback: the previous design put patch notes inside cards; that is lousy UX for a compact book panel.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if scoped UI changes fail to compile/build; browser-use absence blocks only visual proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-grid-ui.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User wants complete UI/UX rethink into small cases with hover explanations. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Active goal created for this plan. |
| Source of truth read before edits | yes | HUD/CSS upgrade panel source read. |
| Acceptance criteria captured | yes | Compact cases, hover/focus explanations, preserve behavior. |
| Pre-solution issue challenge required | yes | Valid UI/UX issue. |
| Reproduction verdict before implementation | yes | Valid from screenshot and source audit. |
| Repro escalation ladder selected | yes | Source/build/browser-use. |
| Suggested fix reviewed against durable boundary | yes | HUD/CSS only. |
| TDD decision before behavior change or bug fix | yes | N/A: pure UI presentation; no gameplay rule change. |
| Browser proof decision for browser surface | yes | Try browser-use, no substitutes. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Source audit, typecheck, build, diff check passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid UI issue; fixed in HUD/CSS. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit and screenshot; browser-use unavailable. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | UX redesign request, not gameplay bug. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Source audit confirms node grid and tooltip markup. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | blocked | Capture browser proof | `browser-use` not exposed; repo forbids Playwright/Puppeteer/DevTools substitutes. HTTP 200 checked. |
| Final lint/format | yes | Run relevant lint/format command or record N/A | Scoped `git diff --check` passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Final source audit matches small cases plus hover/focus tooltip requirement. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-grid-ui.md` | Passed with `[autogoal] complete`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | HUD/CSS and screenshot reviewed. | implementation |
| Implementation | complete | Replaced cards/list with `blackjack-upgrade-board`, tracks, nodes, tooltips. | verification |
| Verification | complete | Typecheck, build, diff check, source audit, HTTP 200 passed; browser-use unavailable. | closeout |
| Closeout | complete | Plan updated for checker. | final response |

Findings:
- The previous design exposed all upgrade text at once, which caused overflow and made scanning painful.
- Compact nodes preserve the upgrade depth while making the panel readable.

Decisions and tradeoffs:
- Kept interactions on the same existing actions instead of inventing a new upgrade system.
- Used hover and focus-visible tooltips so keyboard users can reveal explanations too.
- Did not use browser automation substitutes because repo policy forbids that when browser-use is missing.

Timeline:
- 2026-06-26T15:08:06.353Z: plan created.
- 2026-06-26T15:10Z: replaced Blackjack upgrade cards with compact board/tracks/nodes.
- 2026-06-26T15:11Z: verification passed except browser-use proof blocker.

Verification evidence:
- command: `npm run typecheck` passed.
- command: `npm run build` passed.
- command: `git diff --check -- src/ui/hud.ts src/style.css docs/plans/2026-06-26-blackjack-upgrade-grid-ui.md` passed.
- command: `curl -I --max-time 3 http://127.0.0.1:5174/` returned HTTP 200.
- source-audit: `rg -n "blackjack-upgrade-board|blackjack-upgrade-track|blackjack-upgrade-node|blackjack-upgrade-tooltip|blackjackBonusUpgradeList|<ul>" src/ui/hud.ts src/style.css` confirms new board/node/tooltip markup and no old `blackjackBonusUpgradeList`.
- browser: blocked because `browser-use` is unavailable in this thread and substitutes are disallowed.
- command: `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-grid-ui.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Compact Blackjack upgrade grid with hover/focus explanations. |
| What have I learned? | The problem was information density, not missing rules. |
| What have I done? | Reworked the panel UI and verified build/type/source audit. |

Open risks:
- Browser visual proof not captured because `browser-use` is not exposed.
