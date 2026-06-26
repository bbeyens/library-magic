# Ninth Target Mini-Game

Objective:
Add a target-clicking Book Mini-Game with spawn speed, simultaneous target count, attack damage, and automation upgrades; done when focused tests, build, browser proof, and this plan pass.

Goal plan:
docs/plans/2026-06-23-ninth-target-mini-game.md

Template:
docs/plans/templates/task.md + docs/plans/templates/packs/browser.md

Task source:
- type: user prompt
- id / link: N/A
- title: 9e jeu de cibles a cliquer
- acceptance criteria:
  - A Book Mini-Game exists where targets appear and the player clicks them.
  - Upgrades make targets appear faster.
  - Upgrades allow more targets on screen at once.
  - Upgrades increase attack damage.
  - Automation can attack targets over time.

First checkpoint:
- Explicit requirements captured:
  - scope: implement the target-clicking Book Mini-Game in the current Library Magic app.
  - gameplay: visible targets appear inside the Book Page and can be clicked.
  - upgrades: spawn speed, simultaneous target count, attack damage, and automation.
  - verification: focused behavior tests, TypeScript/build, and browser proof of the real UI.
  - final handoff: summarize files changed, verification, and score confiance /100.
- Non-goals: commits, pushes, PRs, external tracker writes, sprite generation.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 82/100
- improvement loop: add focused tests first, implement minimal game rules/UI, verify in browser.
- final score / loop closure: pending

Completion threshold:
- Source has a new target-clicking Book Mini-Game with click attack, spawn acceleration upgrade, max-target upgrade, damage upgrade, and automation upgrade.
- Focused tests prove target rules.
- `npm run build` succeeds.
- Browser proof shows the new Book Page rendered, target click reward works, and automation/upgrade controls are visible.

Verification surface:
- `node --experimental-strip-types tests/targetRules.test.ts`
- `npm run build`
- Browser proof on local Vite route.
- Source audit of changed files.

Constraints:
- Preserve behavior outside scope.
- Prefer simulation-owned rules over HUD-only gameplay logic.
- Do not create PRs, commits, pushes, or external comments unless requested.
- Ignore unrelated dirty workspace diffs.

Boundaries:
- Source of truth: `src/game/content/books.ts`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/game/simulation/targetRules.ts`, `src/ui/hud.ts`, `src/style.css`.
- Allowed edit scope: files above, focused tests, this plan.
- Browser surface: local Vite game route.
- Tracker sync: N/A.
- Non-goals: repository cleanup, old plan repair, new generated assets.

Current verdict:
- verdict: in_progress
- confidence: 82/100
- next owner: task
- reason: Existing mini-game architecture is clear; exact "9e" count is inconsistent with source state, so the durable move is adding the requested target page.

Pre-solution issue challenge:
- reporter claim: New game should have targets to click plus the four upgrade directions.
- suggested diagnosis or fix: Add a Book Mini-Game rather than overloading an existing one.
- repro ladder:
  - tests / source-level repro: N/A, feature request.
  - repo-owned automated browser or integration proof: browser proof after implementation.
  - Browser plugin: use repo-approved browser tool first if callable.
  - screenshot / visual proof: final browser screenshot or exact route proof.
- reproduction verdict: N/A, feature request.
- validity verdict: valid
- best long-term fix boundary: simulation rules own target spawning/rewards; HUD renders and dispatches actions.
- harsh honest feedback: The source state shifted during the task; the mine exists as the 8th game, so the target game belongs after it as the 9th.
- hard-stop decision: No hard stop.

Blocked condition:
- Stop if TypeScript cannot represent the current dirty source state without overwriting unrelated changes, or if the app cannot launch for browser proof after build passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint and acceptance criteria above. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Active goal created for this plan. |
| Source of truth read before edits | yes | Read `CONTEXT.md`, `books.ts`, `state.ts`, `actions.ts`, `hud.ts`, `style.css`, `LibraryScene.ts`. |
| Acceptance criteria captured | yes | Task source above. |
| Pre-solution issue challenge required | yes | Recorded above. |
| Reproduction verdict before implementation | N/A | Feature request. |
| Repro escalation ladder selected | N/A | Feature request; browser proof selected for final behavior. |
| Suggested fix reviewed against durable boundary | yes | Simulation rules plus HUD render. |
| TDD decision before behavior change or bug fix | yes | Focused target rules test first. |
| Browser proof decision for browser surface | yes | Required after implementation. |
| Browser pack selected | yes | UI/game surface changed. |
| Browser route / app surface identified | yes | Local Vite route. |
| Browser tool decision recorded | yes | `tool_search` found no `browser-use` tool; used available Chrome automation via `node_repl` and recorded the waiver. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope boundary, timing constraint, stop condition, deliverable, final handoff section, verification surface, and success criterion is copied into this plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless explicitly marked hard stop; N/A, no duration.
- [x] Task source and acceptance criteria are captured.
- [x] Feature request has reproduction marked N/A with reason.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary: target rules in simulation, state/actions in game layer, HUD only renders and dispatches.
- [x] Review/autoreview target selected from actual diff state: target rules/state/actions/content/HUD/CSS plus mine ordering impact.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses a recorded waiver because `browser-use` was unavailable in exposed tools.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run focused test, build, browser proof | `targetRules ok`; `npm run build` passed; browser proof passed on `http://127.0.0.1:5177/`. |
| Pre-solution issue challenge verdict | yes | Record verdict before implementation | valid feature request; see above |
| Repro escalation ladder | N/A | Feature request | N/A |
| Bug reproduced before fix | N/A | Feature request | N/A |
| Targeted behavior verification | yes | Run focused target rules test | `node --experimental-strip-types tests/targetRules.test.ts` passed. |
| TypeScript or typed config changed | yes | Run relevant typecheck/build | `npm run build` passed after final edits. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; Vite chunk-size warning only. |
| Browser surface changed | yes | Capture browser proof | Chrome proof: target page opened, one target spawned, click changed Marques `0` -> `2`, four upgrade controls visible. |
| Final lint/format | N/A | No lint script exists unless discovered later | N/A: `package.json` has no lint script. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Passed: confirmed mine remains 8th and targets are 9th, no duplicate target HUD functions, requested upgrades represented. |
| Timed checkpoint | N/A | No duration requested | N/A |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-ninth-target-mini-game.md` | Passed: `[autogoal] complete`. |
| Browser interaction proof | yes | Exercise target page click and visible controls | `http://127.0.0.1:5177/`; target count `1`; Marques `0` -> `2`; controls `Apparition`, `Cibles max`, `Degats`, `Automatisation` present. |
| Browser console/network check | yes | Record console/network state or caveat | Initial console saw one generic 404; follow-up response/request audit found no failed app URL. No page errors. |
| Browser final proof artifact | yes | Record screenshot/route proof or exact caveat | `/tmp/library-magic-target-visible.png` shows target visible; `/tmp/library-magic-target-mini-game.png` shows post-click reward state. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source files and templates read. | implementation |
| Implementation | complete | Added target rules/state/actions/content/HUD/CSS and kept mine before targets. | verification |
| Verification | complete | Focused tests, build, browser proof passed. | closeout |
| Closeout | complete | Plan evidence recorded and checker passed. | final response |

Findings:
- Source has an existing `mine` game as the 8th Book Mini-Game; target game is now ordered after it as the 9th.
- Mini-game rules already live in simulation actions and state; the HUD renders specific panels and dispatches typed actions.
- `browser-use` was not callable in this environment despite tool discovery; Chrome automation via `node_repl` supplied the browser proof.

Decisions and tradeoffs:
- Add the requested target game after the existing mine game, making it the 9th source Book Mini-Game.
- Use a small deterministic rules module for spawn/damage/automation math, matching the existing `hundredRules.ts` pattern.

Timeline:
- 2026-06-23: plan created and prompt requirements captured.
- 2026-06-23: red target rules test failed because `targetRules.ts` did not exist.
- 2026-06-23: target rules implemented and focused test passed.
- 2026-06-23: added target state/actions/content/HUD/CSS, reordered mine before targets, and verified build/browser.

Verification evidence:
- `node --experimental-strip-types tests/targetRules.test.ts`: passed with `targetRules ok`.
- `node --experimental-strip-types tests/hundredRules.test.ts`: passed with `hundredRules ok`.
- `npm run build`: passed after final edits; Vite emitted only the existing large chunk warning.
- Browser proof on `http://127.0.0.1:5177/`: target page opened, target spawned, click reward changed Marques `0` -> `2`, and all four upgrade controls were visible.
- Screenshots: `/tmp/library-magic-target-visible.png`, `/tmp/library-magic-target-mini-game.png`.
- Source audit: `rg -n "function targetUpgradePanel|function targetPanel|export \\{ targetAttackDamage" src/ui/hud.ts src/game/simulation/actions.ts` found one HUD definition each.
- Goal checker: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-ninth-target-mini-game.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Goal checker, final response |
| What is the goal? | Add the target-clicking Book Mini-Game with requested upgrades. |
| What have I learned? | Mine is the 8th game; target game is correctly the 9th and belongs at the simulation/HUD boundary. |
| What have I done? | Added target rules, state, actions, book content, UI, CSS, tests, and browser proof. |

Open risks:
- Existing unrelated dirty diffs remain in the workspace; final build/browser proof was captured against current local state.
