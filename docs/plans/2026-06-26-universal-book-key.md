# Universal Book Key

Objective:
Universal book keys replace automatic next-book unlock; done when tests and checks prove chosen locked book unlocks by spending one key.

Goal plan:
docs/plans/2026-06-26-universal-book-key.md

Template:
docs/plans/templates/task.md, manually materialized because `.agents/skills/autogoal/scripts` is unavailable in this repo.

Task source:
- type: user request
- id / link: N/A
- title: Universal book key unlock choice
- acceptance criteria:
  - Filling a grimoire grants one key instead of auto-unlocking the next book.
  - Key count is visible in the top-right HUD with resources.
  - Player can choose any locked book to unlock.
  - Seal requirements vary by chosen book.
  - One key is consumed only on successful unlock.
  - Final handoff includes score confiance `/100`.

First checkpoint:
- Explicit scope: progression unlock logic, key state, HUD key display, locked-book click/ritual behavior.
- Non-goals: rebalance all book costs, redesign every HUD resource, commit/push/deploy.
- Timing/duration: no timed checkpoint requested.
- Stop condition: stop when focused tests plus build/type verification pass, or report exact blocker.
- Deliverables: code changes, focused verification, concise French handoff.
- Verification surface: focused store tests, typecheck/build, source audit, autoreview.
- Success criteria: automatic sequential unlock is gone; book choice consumes one key and target-specific resources.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 82/100, because source ownership still needs inspection.
- improvement loop: raise confidence by adding failing tests first, implementing store/UI, then running checks.
- final score / loop closure: pending

Completion threshold:
- Focused tests cover key earning and chosen-book unlock behavior.
- App checks pass with no TypeScript/build regression.
- HUD and library scene source show key display and target-specific seal requirements.

Verification surface:
- `npm test` or focused equivalent.
- `npm run build` or project type/build command.
- Source audit with `rg` for automatic next-book unlock removal and key usage.

Constraints:
- Preserve behavior outside unlock progression.
- Keep book-specific resource economy intact.
- Do not create PRs, commits, pushes, or external comments.
- Ignore unrelated dirty workspace changes.

Boundaries:
- Source of truth: `src/game/content/books.ts`, `src/game/content/forbiddenGrimoire.ts`, game store, `src/phaser/scenes/LibraryScene.ts`, HUD code.
- Allowed edit scope: progression store/content/UI/tests/docs touched by this feature.
- Browser surface: Phaser library scene; browser proof only if feasible after build.
- Tracker sync: N/A.
- Non-goals: production deploy, broad visual redesign, new mini-game content.

Current verdict:
- verdict: in_progress
- confidence: 82/100
- next owner: task
- reason: accepted product decision B, implementation pending.

Pre-solution issue challenge:
- reporter claim: N/A feature request
- suggested diagnosis or fix: N/A
- repro ladder:
  - tests / source-level repro: store tests first
  - repo-owned automated browser or integration proof: use if available
  - Browser plugin: N/A unless browser-specific failure appears
  - screenshot / visual proof: N/A unless UI layout risk remains
- reproduction verdict: N/A feature request
- validity verdict: valid
- best long-term fix boundary: store/content owns rules; Phaser scene renders and dispatches.
- harsh honest feedback: full freedom can break balance, but it is the chosen product direction.
- hard-stop decision: proceed.

Blocked condition:
- Stop if the repo cannot run any focused test/build command and source audit cannot prove behavior.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until completion threshold is satisfied and final evidence is recorded.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint and acceptance criteria above |
| Timed checkpoint parsed | N/A: no duration requested | Timed checkpoint section marks N/A |
| Active goal checked or created | yes | `create_goal` succeeded for this plan |
| Source of truth read before edits | yes | `CONTEXT.md`, `books.ts`, `forbiddenGrimoire.ts`, `state.ts`, `actions.ts`, `LibraryScene.ts`, `hud.ts`, existing progression tests |
| Acceptance criteria captured | yes | Task source section |
| Pre-solution issue challenge required | N/A: feature request | Pre-solution section marks N/A |
| Reproduction verdict before implementation | N/A: feature request | Validity verdict recorded |
| Repro escalation ladder selected | yes | Store tests selected first |
| Suggested fix reviewed against durable boundary | yes | Store/content owns rules; scene renders/dispatches |
| TDD decision before behavior change or bug fix | yes | TDD selected for store behavior |
| Browser proof decision for browser surface | yes | Browser proof only if feasible after build; source/build otherwise |

Work Checklist:
- [x] First checkpoint complete.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as N/A.
- [x] Task source and acceptance criteria are captured.
- [x] Feature request marked N/A for bug reproduction.
- [x] Repro escalation ladder selected for behavior coverage.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary.
- [x] Review/autoreview target selected from actual diff state.
- [x] Verification evidence is recorded beside each relevant gate.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run tests/checks or record blocker | Full test bundle loop, `npm run typecheck`, and `npm run build` passed |
| Pre-solution issue challenge verdict | N/A: feature request | Record N/A | Pre-solution section |
| Repro escalation ladder | N/A: feature request | Record N/A | Pre-solution section |
| Bug reproduced before fix | N/A: feature request | Record N/A | Feature implementation |
| Targeted behavior verification | yes | Run focused tests | Bundled `forbiddenGrimoire.test.ts` and `bookProgression.test.ts` passed |
| TypeScript or typed config changed | yes | Run relevant typecheck/build | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof or record why source/build is enough | `browser-use` was searched and unavailable; repo rule forbids substituting Playwright/Puppeteer/raw Chrome |
| Final lint/format | yes | Run relevant lint/format or record N/A | `git diff --check -- <touched files>` passed |
| Autoreview | yes | Review final diff against objective | Source audit confirms keys in state/action, selected-book seal lookup, Phaser key badge, locked-book selection, and tests |
| Timed checkpoint | N/A: no duration requested | N/A | N/A |
| Goal plan complete | yes | Manual closeout because checker script unavailable | `.agents/skills/autogoal/scripts/check-complete.mjs` is unavailable in this repo; all materialized gates above are closed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | `CONTEXT.md`, source, tests read | implementation |
| Implementation | complete | key state/actions, selected seal UI, HUD key badge, tests patched | verification |
| Verification | complete | focused tests, full tests, typecheck, build, diff-check passed; browser-use unavailable | closeout |
| Closeout | complete | plan updated | final response |

Findings:
- Current direct `unlockBook` action now requires a key as well as the book's own costs.
- Clicking a locked book now selects that book's grimoire seal instead of shaking only the lock.
- `chargeMana` now converts full mana grimoire charge into universal book keys.

Decisions and tradeoffs:
- Full freedom is accepted even though it reduces balance control.
- The key is earned from filling the mana grimoire charge because that is the only existing "filled grimoire" charge mechanic in the source.

Timeline:
- 2026-06-26: plan created.
- 2026-06-26: added failing store tests for key gain and chosen-book unlock.
- 2026-06-26: implemented universal keys, selected-book seals, Phaser key badge, and locked-book selection.
- 2026-06-26: full tests, typecheck, build, and diff-check passed.

Verification evidence:
- command: `./node_modules/.bin/esbuild tests/forbiddenGrimoire.test.ts --bundle --platform=node --format=esm --outfile=/tmp/forbiddenGrimoire.test.mjs >/dev/null && /Users/joellebeyens/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /tmp/forbiddenGrimoire.test.mjs` passed with `forbiddenGrimoire ok`.
- command: `./node_modules/.bin/esbuild tests/bookProgression.test.ts --bundle --platform=node --format=esm --outfile=/tmp/bookProgression.test.mjs >/dev/null && /Users/joellebeyens/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /tmp/bookProgression.test.mjs` passed with `bookProgression ok`.
- command: bundled loop over `tests/*.test.ts` passed all 9 tests.
- command: `npm run typecheck` passed.
- command: `npm run build` passed.
- command: `git diff --check -- <touched files>` passed.
- tool audit: `tool_search` for `browser-use` did not expose a browser-use tool; no substitute used because repo rules forbid it.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Universal key unlock choice |
| What have I learned? | Product decision B: full freedom; key source is mana grimoire charge |
| What have I done? | Implemented universal key unlock flow, tests, and verification |

Open risks:
- Browser interaction proof is blocked because `browser-use` is unavailable and repo rules forbid substitutes.
