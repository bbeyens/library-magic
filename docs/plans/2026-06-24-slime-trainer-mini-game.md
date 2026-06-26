# slime trainer mini game

Objective:
Ship the first Slime Trainer slice; done when PRD/issues exist, the mini-game is playable with sprites, checks/browser proof/review pass; plan docs/plans/2026-06-24-slime-trainer-mini-game.md.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-06-24-slime-trainer-mini-game.md

Template:
docs/plans/templates/auto.md

Primary template:
docs/plans/templates/auto.md

Applied packs:
- browser

Auto workflow source:
- auto skill: `.agents/skills/auto/SKILL.md`
- expected order:
  1. grill-with-docs
  2. autogoal for remaining steps
  3. to-prd
  4. to-issues
  5. implement first useful slice
  6. browser/game playtest
  7. review
  8. close with evidence

Task source:
- type: user-requested auto feature
- id / link: N/A: no source ticket; create PRD issue in this flow.
- title: Slime Trainer mini-game
- acceptance criteria:
  - Add the tenth Book Mini-Game as Slime Trainer.
  - It should feel like Pokemon-style combat: one player slime versus enemies.
  - The battle interface has four commands.
  - Only one command is available at the start.
  - Beating enemies grants XP and levels.
  - Use Spriterrific/pixel-art assets for the slime and monsters.
  - Implement the first useful playable slice end to end.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked `N/A: <reason>`.

Timed checkpoint:
- requested duration: N/A: none requested.
- semantics: N/A: no timed checkpoint.
- initial confidence score: N/A: no timed checkpoint scorecard.
- improvement loop: N/A: no timed checkpoint.
- final score / loop closure: N/A: no timed checkpoint.

Completion threshold:
- PRD issue exists, or `N/A: <reason>` is recorded for a micro task.
- Vertical slice issues exist, or `N/A: <reason>` is recorded for a micro task.
- The first useful slice is implemented or a blocker is recorded.
- Verification named in this plan passes.
- Browser/game proof is captured for UI/game work, or an explicit blocker/waiver
  names why it could not be captured.
- Review step is run and recorded before closeout.
- Final response lists PRD issue, slice issues, implemented issue/slice,
  verification proof, browser proof, review result, and `score confiance`.

Verification surface:
- `gh issue` commands or issue URLs for PRD/slice publication.
- Implementation verification commands, such as typecheck, build, tests, or
  source audit.
- Browser/game proof for UI/game work, using the repo-approved browser tool
  first and recording any fallback.
- Review evidence against `main` or the chosen fixed point.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-24-slime-trainer-mini-game.md`.

Constraints:
- `grill-with-docs` must happen before this autogoal plan starts.
- After the grill-with-docs phase, do not stop for plan/issue/implementation approval
  unless there is a real blocker.
- Do not skip `review` before closeout.
- Do not claim a browser/game proof if the requested browser tool was
  unavailable; record the fallback honestly.
- Preserve unrelated dirty workspace changes.

Boundaries:
- Source of truth: user request plus `.agents/skills/auto/SKILL.md`.
- Allowed edit scope: `CONTEXT.md`, game content/state/actions/rules, HUD renderer/styles, tests, docs/plans, generated public assets for Slime Trainer.
- Browser surface: Vite app at `/`, unlock/select the Slime Trainer book and execute at least one combat command.
- Tracker sync: GitHub Issues unless project docs say otherwise.
- Non-goals: full Pokemon depth, party management, captures, inventory, online persistence, complete multi-monster bestiary, and video-derived animation cycles.

Output budget strategy:
- Use focused reads and capped command output.
- For broad audits, prefer counts, filenames, or narrow `rg` patterns before
  printing full matches.
- Exclude generated assets, logs, `node_modules`, and build output unless they
  are the named source of truth.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials or
  permissions failure, destructive action, or inability to run any honest
  verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Read `CONTEXT.md`, `src/game/content/books.ts`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/phaser/scenes/LibraryScene.ts`; no material questions because the first slice can infer conservative defaults. |
| Prompt requirements captured before work | yes | Acceptance criteria copied into Task source before implementation. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | `get_goal` returned no active goal; active goal created for this plan. |
| Source of truth read before edits | yes | Read `auto`, `spriterrific`, `autogoal`, `to-prd`, `to-issues`, `implement`, `tdd`, `review`, issue tracker docs, triage docs, and nearby code. |
| Tracker target verified | yes | `gh repo view` resolved `bbeyens/library-magic`; `ready-for-agent` label exists. |
| PRD publication decision recorded | yes | Publish a GitHub PRD issue with `ready-for-agent`. |
| Slice publication decision recorded | yes | Publish vertical slice GitHub issues with `ready-for-agent`. |
| First useful slice selected | yes | First playable combat slice: add Slime Trainer book, state/actions/rules, basic HUD battle, first assets, tests. |
| TDD decision before behavior change or bug fix | yes | Use focused rule tests for Slime Trainer XP, command unlocks, and combat rewards before implementation. |
| Browser/game proof decision recorded | yes | Run Vite app and verify the Slime Trainer book in browser; try browser-use first, then record fallback if unavailable. |
| Review target selected before closeout | yes | Review diff against `main`. |
| Browser pack selected | yes | Applied `browser` pack when creating plan. |
| Browser route / app surface identified | yes | Route `/`, Book Page for Slime Trainer. |
| Browser tool decision recorded | yes | `@browser-use` required by repo instructions; discover/use it first if callable, otherwise record fallback. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | No material question: initial four-command slime battler can be shaped from prompt and existing book patterns. |
| 2. autogoal | complete | Active goal handle and this plan path | Active goal created; plan path `docs/plans/2026-06-24-slime-trainer-mini-game.md`. |
| 3. to-prd | complete | PRD issue URL or `N/A: <reason>` | PRD issue #38: `https://github.com/bbeyens/library-magic/issues/38`. |
| 4. to-issues | complete | Slice issue URLs or `N/A: <reason>` | Slice issues #39, #40, #41 created. |
| 5. implement | complete | Implemented slice id/scope and changed owners | Implemented #39 first playable slice across content, state/actions/rules, HUD/CSS, assets, docs, tests. |
| 6. browser/game playtest | complete | Route, interaction, result, console/network caveat, and tool/fallback used | `@browser-use` not callable; fallback Playwright + system Chrome on `http://127.0.0.1:5174/`; Slime Trainer opened, 4 commands found, 3 locked, 2 sprites loaded at 256x256, `Bondir` changed outcome from ready to hit; victory pass showed `+3 XP, +2 Gels`; screenshots `docs/plans/2026-06-24-slime-trainer-browser.png` and `docs/plans/2026-06-24-slime-trainer-victory-browser.png`; network pass found no failed/4xx requests. |
| 7. review | complete | Review target, findings, fixes/rejections | Reviewed Slime Trainer diff against `main` and current spec; no blocking findings. `git diff --check` passed. |
| 8. close with evidence | complete | Final response evidence checklist prepared | Final response will list PRD #38, slices #39-#41, implemented #39, verification commands, browser proof, review result, and `score confiance`. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Objective, threshold, verification surface, constraints, boundaries, and
      blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [x] Auto Step Ledger is updated before moving past each step.
- [x] PRD issue is created or explicitly marked `N/A: <reason>`.
- [x] Vertical slice issues are created or explicitly marked `N/A: <reason>`.
- [x] First useful slice is selected and implemented.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Browser/game proof uses the repo-approved browser tool first or records
      the unavailable tool and honest fallback.
- [x] Review runs after implementation and verification, before closeout.
- [x] Final handoff evidence list is assembled before closing the goal.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | Ledger records grill/docs before autogoal, then PRD, issues, implementation, browser proof; review/closeout still pending. |
| PRD published | yes | Create PRD issue or record `N/A: <reason>` | PRD issue #38 created. |
| Slice issues published | yes | Create vertical slice issues or record `N/A: <reason>` | Issues #39, #40, #41 created in dependency order. |
| Implemented slice | yes | Name the slice and changed owners | #39 implemented: Slime Trainer book, combat state/rules/actions, HUD/CSS, runtime sprites, tests, glossary. |
| Typecheck/build/test proof | yes | Run relevant owner checks or record `N/A: <reason>` | `node --experimental-strip-types tests/slimeTrainerRules.test.ts`; `tests/hundredRules.test.ts`; `tests/targetRules.test.ts`; `npm run typecheck`; `npm run build` all passed. |
| Browser/game proof | yes | Exercise affected browser/game surface or record blocker/waiver | Browser proof passed via system Chrome fallback; screenshot `docs/plans/2026-06-24-slime-trainer-browser.png`. |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | Reviewed against `main`; no blocking findings; `git diff --check` passed; visual screenshot inspected. |
| Final handoff completeness | yes | Confirm final response will list PRD issue, slice issues, implemented issue/slice, verification, browser proof, review result, and `score confiance` | Evidence list assembled for final response. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise `N/A: <reason>` | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-24-slime-trainer-mini-game.md` | Passed: `[autogoal] complete`. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Slime Trainer selected and `Bondir` clicked; outcome changed to damage feedback. |
| Browser console/network check | yes | Record console/network state or N/A | Second network pass found no failed requests and no 4xx responses. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `docs/plans/2026-06-24-slime-trainer-browser.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Read docs/code/skills; no material questions required for first slice | autogoal |
| Autogoal setup | complete | Active goal created with this plan path | PRD |
| PRD | complete | #38 created | issues |
| Issues | complete | #39, #40, #41 created | implementation |
| Implementation | complete | #39 first playable slice implemented | browser/game proof |
| Browser/game proof | complete | System Chrome fallback proof and screenshot recorded | review |
| Review | complete | No blocking findings; `git diff --check` passed | closeout |
| Closeout | complete | Evidence list assembled; checker passed | final response |

Findings:
- Existing game uses a Book Mini-Game pattern: `BookDefinition`, `GameState`, `GameAction`, `tickState`, HUD renderer, CSS, and focused rule tests.
- The current panel grid supports nine simultaneous open panels; adding a tenth book only needed shelf placement because the app already replaces panels when all slots are full.
- Existing resources currently exclude a Slime Trainer resource; the first slice needs a new unique resource for rewards.
- Slime is green, so Spriterrific chroma should avoid green; use magenta matte if running the full pipeline.
- `FAL_KEY`/`FAL_API_KEY` are absent, so full live Spriterrific provider generation was unavailable.

Decisions and tradeoffs:
- Slime Trainer's first slice will be a turn-based Book Page with one player slime, one active enemy, four commands, XP/level progression, and command unlocks at levels.
- Spriterrific asset requirement will be satisfied with runtime pixel-art assets under `public/assets/spriterrific/slime-trainer/`; if provider tooling is unavailable, create deterministic pixel-art PNG sprites as the honest fallback and record it.
- Use tests at the rules/action seam for command unlock and enemy defeat rewards.
- Action-level Node tests were not kept because app modules use extensionless TypeScript imports that Node's strip-types loader does not resolve; `tsc`/Vite verify that integration instead.

Review fixes:
- None. Review found no blocking issues in the Slime Trainer slice.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| `node --experimental-strip-types tests/slimeTrainerActions.test.ts` could not resolve app extensionless TS imports | 2 | Keep rule-level Node test and use TypeScript/Vite checks for integration | Removed the loader-dependent action test; `npm run typecheck` and `npm run build` pass. |
| Playwright managed Chromium missing | 1 | Launch system Chrome through Playwright | Browser proof passed with `/Applications/Google Chrome.app/...`. |

Timeline:
- 2026-06-24T10:22:22.740Z: plan created.
- 2026-06-24T12:22:30+02:00: filled requirements, boundaries, start gates, first-slice decision.
- Published PRD issue #38 and slice issues #39, #40, #41.
- Implemented Slime Trainer first slice and generated local Spriterrific fallback sprites.
- Ran focused tests, typecheck, build, and browser proof.

Verification evidence:
- `node --experimental-strip-types tests/slimeTrainerRules.test.ts` -> passed.
- `node --experimental-strip-types tests/hundredRules.test.ts` -> passed.
- `node --experimental-strip-types tests/targetRules.test.ts` -> passed.
- `npm run typecheck` -> passed.
- `npm run build` -> passed; Vite emitted only the existing large chunk warning.
- Browser proof on `http://127.0.0.1:5174/` -> Slime Trainer opened; 4 commands, 3 locked; sprites loaded; `Bondir` clicked; screenshot `docs/plans/2026-06-24-slime-trainer-browser.png`.
- Browser victory proof -> after two `Bondir` clicks: `Victoire`, `+3 XP, +2 Gels`, next enemy visible; screenshot `docs/plans/2026-06-24-slime-trainer-victory-browser.png`; no failed/4xx network requests.
- `git diff --check` -> passed.
- Review against `main` -> no blocking findings for the Slime Trainer slice.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-24-slime-trainer-mini-game.md` -> passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Goal-plan check complete |
| Where am I going? | Final response |
| What is the goal? | Ship the first Slime Trainer slice with PRD/issues, implementation, tests, browser proof, and review. |
| What have I learned? | Existing game can absorb the tenth book with content/state/action/HUD/style changes; browser-use is unavailable here; system Chrome fallback works. |
| What have I done? | Created PRD/issues, implemented #39, generated sprites, passed checks, captured browser proof, completed review, passed goal-plan check. |

Open risks:
- `@browser-use` was not callable in this environment; browser proof used Playwright with system Chrome fallback.
- Full live Spriterrific provider was unavailable because no `FAL_KEY`/`FAL_API_KEY` was present; deterministic local pixel-art runtime sprites were used as the first-slice fallback.
