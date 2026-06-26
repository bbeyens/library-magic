# blackjack upgrade ux real redesign

Objective:
Blackjack upgrade UX gets a real layout redesign; done when cost/actions/compact mode source audit, typecheck, build, and plan gate pass.

Goal plan:
docs/plans/2026-06-26-blackjack-upgrade-ux-real-redesign.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: user prompt
- id / link: chat
- title: Improve Blackjack upgrade UX for real
- acceptance criteria: cost visible just below each upgrade title; better layout/disposition; button to hide full upgrade; more substantial UX/UI improvement than a small tweak.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: no duration requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Done when Blackjack full upgrade panel has track cards with title, immediate cost line, primary action button, compact/hide control, readable node lanes, and hover/focus details as secondary support.

Verification surface:
- Source audit for redesigned classes/markup: cost line, action buttons, compact/hide control, node lanes.
- `npm run typecheck`, `npm run build`, scoped `git diff --check`.
- Browser proof via browser-use if exposed; record exact blocker otherwise.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: current Blackjack upgrade rules/actions plus HUD/CSS.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, this plan.
- Browser surface: Table du Blackjack upgrade panel.
- Tracker sync: N/A.
- Non-goals: no gameplay economy changes, no new bonus tracks, no PR/commit/push.

Current verdict:
- verdict: complete
- confidence: 89/100
- next owner: user
- reason: Cost/action hierarchy and compact control implemented; build/typecheck/source audit pass; browser-use unavailable.

Pre-solution issue challenge:
- reporter claim: Current node UI is better but still not incredible; cost placement, disposition, and hide/full upgrade control are missing.
- suggested diagnosis or fix: Redesign full panel hierarchy with visible cost/action rows and compact/hide control.
- repro ladder:
  - tests / source-level repro: current source has compact nodes but no dedicated cost line under title and no full-panel hide/compact button inside the content.
  - repo-owned automated browser or integration proof: N/A before implementation.
  - Browser plugin: check browser-use availability before closeout.
  - screenshot / visual proof: user reports current result still weak.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: HUD/CSS layout, not rules.
- harsh honest feedback: the prior version fixed information volume but not decision flow; cost and action affordance must be first-class.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if scoped HUD/CSS cannot typecheck/build; browser-use absence blocks visual proof only.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-ux-real-redesign.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Cost under title, better disposition, hide full upgrade, real UX/UI improvement. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Active goal created for this redesign. |
| Source of truth read before edits | yes | Current HUD/CSS and previous upgrade grid reviewed. |
| Acceptance criteria captured | yes | See task source and completion threshold. |
| Pre-solution issue challenge required | yes | Valid UI hierarchy issue. |
| Reproduction verdict before implementation | yes | Valid from current source and user feedback. |
| Repro escalation ladder selected | yes | Source audit, build/typecheck, browser-use if available. |
| Suggested fix reviewed against durable boundary | yes | HUD/CSS only. |
| TDD decision before behavior change or bug fix | yes | N/A: presentation-only; source/build audit is the proof. |
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
| Named verification threshold | yes | Run the named proof or record blocker | Typecheck, build, diff check, source audit passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid UI hierarchy issue; fixed in HUD/CSS. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit plus user screenshot/feedback; browser-use unavailable. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | UX redesign request, not gameplay bug. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Source audit confirms cost/action/hide/lane markup. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | blocked | Capture browser proof | `browser-use` not exposed; repo forbids Playwright/Puppeteer/DevTools substitutes. HTTP 200 checked. |
| Final lint/format | yes | Run relevant lint/format command or record N/A | Scoped `git diff --check` passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Final source audit matches cost-under-title, primary action, compact/hide, and lane layout. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-ux-real-redesign.md` | Passed with `[autogoal] complete`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Current HUD/CSS and event wiring read. | implementation |
| Implementation | complete | Added full panel header, compact button, track main/cost/action/lane layout. | verification |
| Verification | complete | Typecheck, build, diff check, source audit, HTTP 200 passed; browser-use unavailable. | closeout |
| Closeout | complete | Plan updated for checker. | final response |

Findings:
- The prior node grid improved density but still made the player infer the next decision from node hovers.
- The redesigned track layout makes decision order explicit: name, status, cost, action, progression lane.

Decisions and tradeoffs:
- Kept hover/focus tooltips as secondary detail, not the primary way to understand cost/action.
- Added `Compact` inside the full panel because the existing external compact arrow is too easy to miss.
- Preserved existing gameplay/economy actions; this is UI hierarchy work only.

Timeline:
- 2026-06-26T15:16:36.318Z: plan created.
- 2026-06-26T15:18Z: implemented cost/action/full-panel compact layout.
- 2026-06-26T15:19Z: verification passed except browser-use proof blocker.

Verification evidence:
- command: `npm run typecheck` passed.
- command: `npm run build` passed.
- command: `git diff --check -- src/ui/hud.ts src/style.css docs/plans/2026-06-26-blackjack-upgrade-ux-real-redesign.md` passed.
- command: `curl -I --max-time 3 http://127.0.0.1:5174/` returned HTTP 200.
- source-audit: `rg -n "blackjack-upgrade-cost|blackjack-upgrade-primary|blackjack-upgrade-hide|blackjack-upgrade-lane|disabled|Cout:" src/ui/hud.ts src/style.css` confirms cost/action/compact/lane/disabled affordances.
- browser: blocked because `browser-use` is unavailable in this thread and substitutes are disallowed.
- command: `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-upgrade-ux-real-redesign.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Real Blackjack upgrade UI redesign with explicit cost/action/hide flow. |
| What have I learned? | The previous design hid the decision path; cost and action must be first-class. |
| What have I done? | Reworked HUD markup/CSS and verified checks. |

Open risks:
- Browser visual proof not captured because `browser-use` is not exposed.
