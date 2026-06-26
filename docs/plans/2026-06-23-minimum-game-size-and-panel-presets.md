# Minimum Game Size And Panel Presets

Objective:
Set 1280x720 game minimum and 3 panel presets; done when browser proof and checks pass; plan docs/plans/2026-06-23-minimum-game-size-and-panel-presets.md.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-23-minimum-game-size-and-panel-presets.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser

Task source:
- type: user request
- title: Minimum game size and panel preset sizes
- acceptance criteria:
  - The game surface has a minimum size of 1280x720.
  - The Phaser game config and library world use 1280x720 instead of 960x540.
  - Book panels use three preset sizes instead of free mouse resizing.
  - A single visible panel button cycles between the three preset sizes.
  - Preset sizes preserve the current page aspect ratio.
  - Dragging panels still works.
  - Browser proof verifies the shell minimum size and the three preset panel widths.

First checkpoint:
- Requirements copied above.
- Scope: game shell size, Phaser world size, panel size behavior, panel size button.
- Non-goals: skill layout redesign, gameplay rules, commits, pushes, external tracker updates.
- Stop conditions: impossible browser proof, unsafe ambiguity around destructive changes, or failing credentials for required local commands.

Timed checkpoint:
- N/A: no duration requested.

Completion threshold:
- Source uses 1280x720 as the game/world minimum.
- Each Book Page panel can cycle through exactly three preset widths using a visible button: `S=245`, `M=370`, `L=496` before viewport clamp.
- Browser proof shows the game shell is at least 1280x720 and panel button clicks produce three distinct preset widths.
- `npm run typecheck`, `npm run build`, and `git diff --check` pass.

Verification surface:
- Source audit with `rg` for 960/540 and 1280/720 ownership.
- Browser proof on the local Vite app.
- Screenshot artifact saved under `/tmp`.
- Commands: `npm run typecheck`, `npm run build`, `git diff --check`.

Constraints:
- Preserve unrelated dirty workspace changes.
- Preserve Book Page aspect ratio.
- Preserve panel dragging.
- Do not change skill progression or gameplay rules.
- Do not commit or push unless separately asked.

Boundaries:
- Source of truth: `src/main.ts`, `src/phaser/scenes/LibraryScene.ts`, `src/ui/hud.ts`, `src/style.css`.
- Allowed edit scope: the files above and this plan.
- Browser surface: local Vite game route.
- Tracker sync: N/A, user did not ask for issue updates.
- Non-goals: new docs, new skills, new assets, color changes.

Current verdict:
- verdict: valid feature request
- confidence: 0.84 before implementation
- next owner: implementation
- reason: existing app has 960x540 base and free resize handle, so both requested changes are in clear local owners.

Pre-solution issue challenge:
- reporter claim: N/A, not a bug report.
- suggested diagnosis or fix: N/A, feature request.
- repro ladder:
  - tests / source-level repro: source audit shows 960x540 owners.
  - repo-owned automated browser or integration proof: browser proof will verify shell and panel sizes.
  - Browser plugin: node_repl Playwright fallback because browser-use is not exposed in this toolset.
  - screenshot / visual proof: required for final panel proof.
- reproduction verdict: N/A, feature request.
- validity verdict: valid.
- best long-term fix boundary: change size constants and panel sizing owner, not per-panel hacks.
- harsh honest feedback: free-resize and preset-size controls should not coexist as competing primary controls.
- hard-stop decision: proceed.

Blocked condition:
- Stop if the local app cannot be launched or if browser automation cannot inspect rendered sizes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Task source and first checkpoint sections. |
| Timed checkpoint parsed | N/A: no duration requested | Timed checkpoint row. |
| Active goal checked or created | yes | Goal created for this plan. |
| Source of truth read before edits | yes | Read `src/main.ts`, `src/phaser/scenes/LibraryScene.ts`, `src/ui/hud.ts`, and `src/style.css`. |
| Acceptance criteria captured | yes | Task source acceptance criteria. |
| Pre-solution issue challenge required | N/A: feature request | Pre-solution section records N/A. |
| Reproduction verdict before implementation | N/A: feature request | Source audit still found current 960x540 state. |
| Repro escalation ladder selected | yes | Source audit plus browser proof. |
| Suggested fix reviewed against durable boundary | yes | Owner is size constants and panel size behavior. |
| TDD decision before behavior change or bug fix | yes | TDD as browser red/green metric proof rather than fake unit tests. |
| Browser proof decision for browser surface | yes | Browser proof required. |
| Browser pack selected | yes | Applied browser pack. |
| Browser route / app surface identified | yes | Local Vite game route. |
| Browser tool decision recorded | yes | Use node_repl Playwright fallback. |

Work Checklist:
- [x] First checkpoint complete.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Duration recorded as N/A.
- [x] Task source and acceptance criteria are captured.
- [x] Bug report challenge is N/A with reason.
- [x] Repro escalation ladder is selected for source/browser proof.
- [x] Hard-stop rule is N/A for feature request.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation updates 1280x720 source owners.
- [x] Implementation replaces free resize with a preset-size cycle button.
- [x] Browser proof verifies shell minimum size and three panel widths.
- [x] Typecheck/build/diff-check pass.
- [x] Autoreview runs against newest request.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser proof records route, interaction, console state, and screenshot artifact.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Verify source, browser, and command thresholds | Source audit, browser proof, typecheck, build, and diff-check passed. |
| Pre-solution issue challenge verdict | N/A: feature request | No bug claim to challenge | Feature request accepted. |
| Repro escalation ladder | yes | Source audit and browser proof | Source audit found 1280x720 owners; browser proof exercised preset button. |
| Bug reproduced before fix | N/A: feature request | No failing bug repro needed | Feature request. |
| Targeted behavior verification | yes | Browser click through three panel presets | `S -> M -> L -> S` measured as `245 -> 370 -> 494 -> 245` at 1280x720; large clamps by available height. |
| TypeScript or typed config changed | yes | Run `npm run typecheck` | Passed. |
| Build-sensitive behavior changed | yes | Run `npm run build` | Passed; existing large chunk warning only. |
| Browser surface changed | yes | Capture browser proof | `/tmp/library-magic-1280-panel-presets.png`. |
| Final lint/format | yes | Run `git diff --check` | Passed. |
| Autoreview | yes | Review final diff/output against newest request | Diff matches 1280x720 and three preset button request; free resize UI removed. |
| Timed checkpoint | N/A: no duration requested | No timed loop | No duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-minimum-game-size-and-panel-presets.md` | Passed. |
| Browser interaction proof | yes | Exercise panel size button | Button cycled `S -> M -> L -> S`; widths recorded. |
| Browser console/network check | yes | Record console/network state | No page errors; no failed requests; no bad HTTP responses found. Vite/Phaser dev logs present. |
| Browser final proof artifact | yes | Record screenshot path | `/tmp/library-magic-1280-panel-presets.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source files and skills read. | implementation |
| Implementation | complete | `src/main.ts`, `src/phaser/scenes/LibraryScene.ts`, `src/ui/hud.ts`, and `src/style.css` updated. | verification |
| Verification | complete | Browser proof and commands passed. | closeout |
| Closeout | complete | Plan evidence assembled; checker is the final mechanical gate. | final response |

Findings:
- Current Phaser config is 960x540 in `src/main.ts`.
- Current library scene world is 960x540 in `src/phaser/scenes/LibraryScene.ts`.
- Current CSS body minimum width is 960px.
- Current panels have free mouse resize via `.book-panel-resize`.
- The remaining `960` match is a panel container-query breakpoint, not the game/world size.

Decisions and tradeoffs:
- Use three fixed width presets on the existing Book Page aspect ratio.
- Use one visible cycle button instead of a menu because the user asked for a button.
- Keep panel dragging because it is orthogonal to size presets.
- Presets are `S=245`, `M=370`, `L=496`; `L` clamps to 494px in a 1280x720 shell because the panel must fit available height.

Review fixes:
- Fixed initial `S` mismatch: default render now uses the real `S` preset width instead of the old auto width.
- Fixed old resize minimum clamp: returning to `S` now clamps to `245`, not the old `280`.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Initial `S` label used old auto panel width | 1 | Apply preset size on initial render | Resolved. |
| Returning to `S` clamped to old 280px minimum | 1 | Use smallest preset as clamp minimum | Resolved. |

Timeline:
- 2026-06-23: goal and plan created.
- 2026-06-23: source owners read and requirements captured.
- 2026-06-23: game config, library scene world, and shell minimum updated to 1280x720.
- 2026-06-23: free resize button replaced with preset size cycle button.
- 2026-06-23: browser proof captured shell `1280x720`, canvas attrs `1280x720`, and panel cycle `245 -> 370 -> 494 -> 245`.
- 2026-06-23: `npm run typecheck`, `git diff --check`, and `npm run build` passed.
- 2026-06-23: autogoal checker passed.

Verification evidence:
- Source audit: `src/main.ts` and `src/phaser/scenes/LibraryScene.ts` use `width: 1280`, `height: 720`; `src/style.css` uses `min-width: 1280px`, `min-height: 720px`.
- Source audit: no `book-panel-resize` or `.is-resizing` matches remain in the edited owners.
- Browser proof at `http://127.0.0.1:5173/`: shell measured `1280x720`; canvas attributes measured `1280x720`.
- Browser proof: panel button cycled `S -> M -> L -> S`; measured panel widths were `245 -> 370 -> 494 -> 245`.
- Browser proof: no page errors, no failed requests, and no bad HTTP responses; Vite and Phaser dev console logs present.
- Screenshot: `/tmp/library-magic-1280-panel-presets.png`.
- Command: `npm run typecheck` passed.
- Command: `git diff --check` passed.
- Command: `npm run build` passed with existing large chunk warning.
- Goal checker: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-minimum-game-size-and-panel-presets.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Make the game minimum 1280x720 and panels use 3 preset sizes via a button. |
| What have I learned? | Large preset must clamp slightly at 720px height to keep the panel inside the shell. |
| What have I done? | Implemented 1280x720 owners, preset size button, browser proof, and checks. |

Open risks:
- Large preset is requested as 496px and renders as 494px at 1280x720 due height clamp; this is acceptable because it preserves fit and aspect ratio.
