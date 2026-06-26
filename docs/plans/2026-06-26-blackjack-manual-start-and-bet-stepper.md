# blackjack-manual-start-and-bet-stepper

Objective:
Blackjack mise ajustable et auto-relance via upgrade; done when focused tests, typecheck/build, and source audit pass.

Goal plan:
docs/plans/2026-06-26-blackjack-manual-start-and-bet-stepper.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user prompt
- id / link: N/A
- title: Blackjack mise de base manuelle et auto-relance upgradee
- acceptance criteria:
  - La fleche gauche baisse la mise de base quand la mise est au-dessus du minimum.
  - La fleche droite augmente la mise de base quand le joueur peut payer l'upgrade.
  - `Lancer` reste manuel par defaut pour laisser modifier mise et bonus.
  - L'auto-relance apres une manche n'arrive que si une upgrade d'automatisation blackjack est debloquee.
  - Les controles restent scopes au blackjack; pas de changement des autres mini-jeux sans source claire.

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
- final score / loop closure: N/A

Completion threshold:
- Focused tests prove mise decrease/increase and manual-vs-auto-deal behavior; UI dispatches both bet directions; typecheck/build pass.

Verification surface:
- Tests: focused blackjack action tests through `applyAction`.
- Commands: `npm run typecheck`, `npm run build`, bundled blackjack tests via temporary esbuild transpilation if no TS runner exists.
- Source audit: `src/game/simulation/actions.ts`, `src/game/simulation/state.ts`, `src/ui/hud.ts`.
- Browser proof: repo asks for `@browser-use`; if unavailable, record blocker and do not substitute.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: simulation actions/state for behavior, HUD for controls.
- Allowed edit scope: blackjack simulation, HUD/CSS, focused tests, this plan.
- Browser surface: blackjack panel in local Vite app.
- Tracker sync: N/A.
- Non-goals: no commits, pushes, PRs, global redesign, or unrelated mini-game behavior without evidence.

Current verdict:
- verdict: complete
- confidence: 91/100
- next owner: task
- reason: mise stepper, manual default launch, and dedicated auto-relance upgrade implemented and verified by focused tests, typecheck, and build.

Pre-solution issue challenge:
- reporter claim: mise de base cannot go down; blackjack games auto-launch immediately and should be manual unless upgraded.
- suggested diagnosis or fix: Add explicit base bet state/actions and gate blackjack auto-deal by an automation upgrade.
- repro ladder:
  - tests / source-level repro: source audit confirms only `buyUpgrade` can increase base bet and `scheduleBlackjackAutoDeal` always auto-deals after result.
  - repo-owned automated browser or integration proof: N/A, no existing browser test.
  - Browser plugin: `@browser-use` not exposed in prior checks; will record blocker if still unavailable.
  - screenshot / visual proof: user screenshots show the stepper and actions in blackjack UI.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: blackjack state/actions and HUD, not global game engine.
- harsh honest feedback: A bet stepper with a dead left arrow is fake affordance. Either make it work or remove it; making it work is better.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if behavior cannot be represented in current save state/actions without a migration decision, or if verification tooling cannot run.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-manual-start-and-bet-stepper.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Acceptance criteria above capture the latest prompt. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | `get_goal` returned null; `create_goal` created current objective. |
| Source of truth read before edits | yes | Read state/actions/HUD references for blackjack bet and auto-deal. |
| Acceptance criteria captured | yes | See Task source. |
| Pre-solution issue challenge required | yes | Valid behavior issue from source audit. |
| Reproduction verdict before implementation | yes | valid. |
| Repro escalation ladder selected | yes | TDD source-level tests first; browser proof caveat if tool unavailable. |
| Suggested fix reviewed against durable boundary | yes | State/actions own behavior; HUD owns controls. |
| TDD decision before behavior change or bug fix | yes | Use focused tests through public `applyAction`. |
| Browser proof decision for browser surface | yes | Browser proof desired; `@browser-use` may be unavailable. |
| Browser pack selected | yes | `--with browser` used. |
| Browser route / app surface identified | yes | Local Vite blackjack panel. |
| Browser tool decision recorded | yes | Use `@browser-use` if exposed; do not substitute if unavailable. |

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
| Named verification threshold | yes | Run the named proof or record blocker | `blackjackActions ok`, `blackjackRules ok`, `npm run typecheck`, `npm run build`. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above; verdict valid. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit plus focused tests used; browser proof blocked because `@browser-use` is not exposed in this session and repo says not to substitute. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Source audit found dead left-stepper behavior and auto-deal coupled to generic `buyUpgrade`; focused tests now lock desired behavior. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackActions.test.mjs && node /tmp/library-magic-blackjackActions.test.mjs` passed. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | yes | Capture browser proof | Blocked: `@browser-use` unavailable after tool search; no Playwright/Puppeteer substitution per repo rule. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint/format script exists in `package.json`; `git diff --check` passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff reviewed for blackjack state/actions/HUD/tests; unrelated dirty workspace ignored. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `/Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-blackjack-manual-start-and-bet-stepper.md` | Ready to run after this plan update. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Blocked by missing `@browser-use`; CLI verification completed. |
| Browser console/network check | N/A | Record console/network state or N/A | Not checked because browser proof tool is unavailable and substitution is disallowed. |
| Browser final proof artifact | N/A | Record screenshot/trace/route proof or exact caveat | No artifact; exact caveat recorded above. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | plan created and source audited | implementation done |
| Implementation | complete | actions/state/HUD/tests updated | verification done |
| Verification | complete | focused tests, typecheck, build, diff check passed; browser-use unavailable | closeout done |
| Closeout | complete | plan updated and ready for checker | final response |

Findings:
- The base bet control needed explicit persisted `blackjack.baseBetLevel` plus increase/decrease actions.
- Generic blackjack `buyUpgrade` was also enabling `book.automation`, which made auto-relance happen as a side effect of mise upgrades.
- `@browser-use` is not exposed in this session, so visual/browser proof is blocked by repo tooling rules.

Decisions and tradeoffs:
- Split blackjack auto-relance into `buyBlackjackAutoDeal` instead of tying it to mise upgrade.
- Left/right bet arrows now select within unlocked mise levels; the right arrow buys the next mise level only when already at max selected level and affordable.
- Browser proof was not replaced with Playwright/Puppeteer because the repo explicitly forbids that substitution.

Timeline:
- 2026-06-26T15:32:13.925Z: plan created.
- 2026-06-26T15:36:00Z: added base bet level state/actions and focused action tests.
- 2026-06-26T15:43:00Z: separated blackjack auto-relance into a dedicated upgrade and updated HUD controls.
- 2026-06-26T15:48:00Z: ran focused tests, typecheck, build, and diff check.

Verification evidence:
- `npx esbuild tests/blackjackActions.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackActions.test.mjs && node /tmp/library-magic-blackjackActions.test.mjs` passed with `blackjackActions ok`.
- `npx esbuild tests/blackjackRules.test.ts --bundle --platform=node --format=esm --outfile=/tmp/library-magic-blackjackRules.test.mjs && node /tmp/library-magic-blackjackRules.test.mjs` passed with `blackjackRules ok`.
- `npm run typecheck` passed.
- `npm run build` passed.
- `git diff --check` passed.
- Browser proof blocked: `@browser-use` was not exposed after tool search; repo rules disallow substituting Playwright/Puppeteer.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Blackjack mise ajustable and manual launch by default; auto-relance only after dedicated upgrade |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Browser visual proof remains unrun because the approved `@browser-use` tool is unavailable in this session.
