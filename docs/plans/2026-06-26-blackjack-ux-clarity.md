# blackjack-ux-clarity

Objective:
Blackjack UX clarifie ressource, mise, bonus et etats disabled; done when plan gates, typecheck/build, and browser proof pass.

Goal plan:
docs/plans/2026-06-26-blackjack-ux-clarity.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user prompt
- id / link: N/A
- title: Clarifier l'UX/UI du blackjack
- acceptance criteria:
  - La ressource gagnee/misee a une icone explicite sur la table.
  - La mise actuelle et la prochaine augmentation sont distinguables.
  - Des fleches permettent d'augmenter la mise et les bonus depuis l'UI blackjack.
  - Les controles bonus/upgrade sont disabled quand le bonus n'est pas debloque, maxe, ou pas payable.
  - Le panneau reste lisible dans la taille montree par le screenshot.

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
- final score / loop closure: N/A, no duration requested.

Completion threshold:
- Done when the blackjack table renders explicit chip/resource information, current/next bet controls, bonus controls with visible disabled states, and no blackjack simulation rules are changed.

Verification surface:
- Source audit: `src/ui/hud.ts` and `src/style.css`.
- Commands: `npm run typecheck`, `npm run build`.
- Browser proof: repo requires `@browser-use`; if unavailable, record the blocker instead of substituting Playwright/Puppeteer.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/hud.ts` owns blackjack DOM, `src/style.css` owns table styling, existing simulation actions own behavior.
- Allowed edit scope: focused UI/CSS and plan file.
- Browser surface: local Vite app, blackjack book panel.
- Tracker sync: N/A, no ticket.
- Non-goals: no blackjack rules, payouts, card logic, saves, commits, pushes, PRs, or external comments.

Current verdict:
- verdict: complete_with_browser_tool_caveat
- confidence: 88/100
- next owner: task
- reason: Implementation, typecheck, build, and targeted tests passed; visual proof is caveated because `@browser-use` is unavailable.

Pre-solution issue challenge:
- reporter claim: Blackjack UI lacks precision around resource icon, bet/bonus increase arrows, and disabled states.
- suggested diagnosis or fix: Add compact controls in the blackjack table and tighten upgrade button states.
- repro ladder:
  - tests / source-level repro: source read confirms current table has Jetons/Mise pills and bonus action buttons, but no explicit chip icon control row or upgrade arrows on the table.
  - repo-owned automated browser or integration proof: N/A, no repo-owned automated browser proof exists for this UI.
  - Browser plugin: `@browser-use` searched via tool discovery; not exposed in this session.
  - screenshot / visual proof: user-provided screenshot shows compact blackjack table with ambiguous top controls.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: blackjack DOM/CSS, not simulation logic.
- harsh honest feedback: A betting UI without clear chip icon and upgrade affordance is gambling with the player's patience. Fix the table, not the rules.
- hard-stop decision: proceed; issue is valid from source and screenshot.

Blocked condition:
- Stop only if source owner cannot be identified, verification commands cannot run for repo/environment reasons, or browser proof is impossible because `@browser-use` is unavailable.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied or an unavailable proof tool is explicitly recorded, final evidence is recorded, and `/Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-ux-clarity.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User requirements copied into acceptance criteria before implementation. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | `get_goal` returned null; `create_goal` created active goal for this work. |
| Source of truth read before edits | yes | Read `src/ui/hud.ts`, `src/style.css`, `src/game/simulation/actions.ts`, and `src/game/content/books.ts`. |
| Acceptance criteria captured | yes | See Task source acceptance criteria. |
| Pre-solution issue challenge required | yes | Valid UI clarity issue; source and screenshot agree. |
| Reproduction verdict before implementation | yes | valid. |
| Repro escalation ladder selected | yes | Source audit + requested browser proof; `@browser-use` unavailable in tool discovery. |
| Suggested fix reviewed against durable boundary | yes | Use existing blackjack DOM/CSS and existing actions. |
| TDD decision before behavior change or bug fix | yes | N/A: visual UI clarity only, no simulation behavior change. |
| Browser proof decision for browser surface | yes | Required by plan; repo-approved `@browser-use` unavailable, blocker to record if still unavailable at verification. |
| Browser pack selected | yes | `--with browser` used. |
| Browser route / app surface identified | yes | Local Vite app, blackjack book panel. |
| Browser tool decision recorded | yes | Tried tool discovery for `browser-use`; unavailable. |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm run typecheck` pass; `npm run build` pass; blackjack rules/actions tests pass via esbuild temp transpilation; browser proof blocked because `@browser-use` unavailable. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above: valid, fix in blackjack DOM/CSS boundary. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit and user screenshot confirm issue; `@browser-use` searched and unavailable; no substitute per repo rule. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | UI clarity request, not a runtime bug with failing test. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx esbuild tests/blackjackRules.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackRules.test.mjs && node /tmp/library-magic-blackjackRules.test.mjs` pass; same for `blackjackActions.test.ts` pass. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` pass. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` pass. |
| Browser surface changed | yes | Capture browser proof | Blocked: repo requires `@browser-use`; tool discovery and install list do not expose it. Dev server started at `http://127.0.0.1:5175/`. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint/format script in `package.json`; typecheck/build run instead. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Final source audit: chip icon in stats, current vs next bet control, bonus arrows, locked/maxed/not-payable disabled states, no simulation rule edits. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `/Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-ux-clarity.md` | Pass: `[autogoal] complete`. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Blocked: `@browser-use` unavailable; no Playwright/Puppeteer substitute per repo instruction. |
| Browser console/network check | N/A | Record console/network state or N/A | N/A due same `@browser-use` blocker and no substitute allowed. |
| Browser final proof artifact | N/A | Record screenshot/trace/route proof or exact caveat | No artifact captured; caveat recorded. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source owner read and acceptance captured. | implementation |
| Implementation | complete | Updated `src/ui/hud.ts` and `src/style.css`. | verification |
| Verification | complete | Typecheck, build, and blackjack tests passed; browser proof blocked by missing `@browser-use`. | closeout |
| Closeout | complete | Plan evidence updated; final handoff next. | final response |

Findings:
- Existing blackjack DOM/CSS owned the requested UI surface; simulation rule changes were unnecessary.
- The repo-approved browser tool `@browser-use` is not exposed in this session and is not listed as installable.

Decisions and tradeoffs:
- Added a compact in-table control rail instead of hiding bet/bonus upgrades in the separate upgrade popover only.
- Kept existing simulation actions and only changed DOM/CSS affordances.
- Did not substitute Playwright/Puppeteer for `@browser-use` because the repo instruction explicitly forbids that.

Timeline:
- 2026-06-26T14:52:35.374Z: plan created.
- 2026-06-26T14:58:00Z: implemented blackjack stat icon, current stake label, main bet upgrade arrow, bonus upgrade/unlock arrows, and disabled locked states.
- 2026-06-26T15:01:00Z: `npm run typecheck` passed.
- 2026-06-26T15:02:00Z: `npm run build` passed.
- 2026-06-26T15:03:00Z: blackjack rules/actions tests passed after temporary esbuild transpilation to `/tmp`.
- 2026-06-26T15:04:00Z: Vite dev server started on `http://127.0.0.1:5175/`.
- 2026-06-26T15:05:00Z: autogoal checker passed.

Verification evidence:
- `npm run typecheck`: pass.
- `npm run build`: pass.
- `npx esbuild tests/blackjackRules.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackRules.test.mjs && node /tmp/library-magic-blackjackRules.test.mjs`: pass, `blackjackRules ok`.
- `npx esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackActions.test.mjs && node /tmp/library-magic-blackjackActions.test.mjs`: pass, `blackjackActions ok`.
- Source audit: `rg -n "blackjackControlRail|blackjackMainBetControl|blackjackBonusControl|blackjackStakeLabel|blackjackActiveStake|blackjack-lever|blackjack-stat-icon|blackjack-control-rail" src/ui/hud.ts src/style.css` finds the new UI pieces.
- `/Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-ux-clarity.md`: pass.
- Browser proof: blocked because `@browser-use` is unavailable and not installable in this session; dev server is running at `http://127.0.0.1:5175/`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Clarify blackjack resource/bet/bonus UI and disabled states. |
| What have I learned? | See Findings |
| What have I done? | See Timeline and Verification evidence |

Open risks:
- Visual/browser proof is not captured because `@browser-use` is unavailable. The code compiles and the dev server is running for manual inspection.
