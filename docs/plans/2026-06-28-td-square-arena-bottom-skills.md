# td square arena bottom skills

Objective:
Restore TD square arena with bottom skills; done when arena is 1:1 above persistent dock and browser proof passes; plan docs/plans/2026-06-28-td-square-arena-bottom-skills.md.

Goal plan:
docs/plans/2026-06-28-td-square-arena-bottom-skills.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user correction
- id / link: chat
- title: TD square arena above bottom skills
- acceptance criteria: TD game/play area remains square; the skills interface stays below the square play area; the shop remains persistent without top-left skill buttons; build and browser proof pass.

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
- initial confidence score: 88/100
- improvement loop: one CSS/layout correction and browser proof with measured rects
- final score / loop closure: 95/100 after build and browser rect proof

Completion threshold:
- Browser proof shows `.defense-arena` width equals height within 1px.
- `.defense-skill-dock` is below the square arena, fills the same TD panel width, and touches the bottom of the TD overlay.
- TD still has no top-left skill buttons and the skill shop is persistent.
- `npm run build` passes.

Verification surface:
- Source audit of `src/style.css` and `src/ui/hud.ts`.
- `npm run build`.
- Browser proof at `http://127.0.0.1:5174/` with measured DOM rects and screenshot.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: TD overlay CSS around `.book-overlay[data-book-id="defense"]`, `.defense-panel`, `.defense-arena`, `.defense-skill-dock`, plus existing TD HUD markup.
- Allowed edit scope: CSS/layout for TD panel, minimal HUD code only if needed.
- Browser surface: defense book panel.
- Tracker sync: N/A.
- Non-goals: no combat/economy changes, no sprite changes, no changes to other mini-games.

Current verdict:
- verdict: valid regression correction
- confidence: 88/100
- next owner: task
- reason: previous fix changed TD overlay to 4/5 and let the arena become rectangular.

Pre-solution issue challenge:
- reporter claim: the game is no longer square; the play area should be square with the skill interface below it.
- suggested diagnosis or fix: set the TD overlay dimensions from a square arena size plus a dock height, then grid rows as square arena + dock.
- repro ladder:
  - tests / source-level repro: current CSS has `aspect-ratio: 4 / 5` for defense overlay and `grid-template-rows: minmax(0, 1fr) var(--defense-shop-height)`, which can make the arena rectangular.
  - repo-owned automated browser or integration proof: browser proof will measure arena width/height.
  - Browser plugin: browser-use unavailable; use Chrome/Playwright through node_repl.
  - screenshot / visual proof: final screenshot artifact.
- reproduction verdict: valid from source and previous proof: arena was 552 x 418.7.
- validity verdict: valid.
- best long-term fix boundary: TD-specific layout CSS with a computed square arena size and bottom dock.
- harsh honest feedback: the prior 4/5 overlay fixed the dock but broke the main invariant; square playfield is the actual owner here.
- hard-stop decision: continue.

Blocked condition:
- Blocked only if browser proof cannot render the TD panel or a square arena cannot fit with the requested bottom dock in the available viewport.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-28-td-square-arena-bottom-skills.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | copied user correction and acceptance criteria above |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `create_goal` created active goal |
| Source of truth read before edits | yes | read current TD HUD/CSS in previous step and source verdict above |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | regression correction with source repro |
| Reproduction verdict before implementation | yes | valid from CSS and prior measured browser proof |
| Repro escalation ladder selected | yes | source audit, build, browser rect proof, screenshot |
| Suggested fix reviewed against durable boundary | yes | TD layout CSS owner |
| TDD decision before behavior change or bug fix | yes | N/A visual layout; browser rect proof is targeted |
| Browser proof decision for browser surface | yes | required |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | `http://127.0.0.1:5174/`, defense book panel |
| Browser tool decision recorded | yes | browser-use unavailable; Chrome/Playwright via node_repl |

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
| Named verification threshold | complete | Run the named proof or record blocker | `npm run build` and browser rect proof passed |
| Pre-solution issue challenge verdict | complete | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | complete | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source audit, build, browser rect proof, screenshot |
| Bug reproduced before fix | complete | Record failing test/repro or N/A with reason | valid regression from previous measured proof: arena was 552 x 418.7 |
| Targeted behavior verification | complete | Run focused test/proof for changed behavior or record N/A | browser proof measured arena 385 x 385 with dock below |
| TypeScript or typed config changed | complete | Run relevant typecheck | `npm run build` includes `tsc` |
| Build-sensitive behavior changed | complete | Run relevant build/check | `npm run build` passed |
| Browser surface changed | complete | Capture browser proof | `/tmp/td-square-arena-bottom-skills-proof.png` |
| Final lint/format | complete | Run relevant lint/format command or record N/A | N/A no lint command run; build/typecheck passed |
| Autoreview | complete | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | final measured proof matches square arena + bottom interface |
| Timed checkpoint | complete | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-28-td-square-arena-bottom-skills.md` | first run caught closeout status; fixed before final run |
| Browser interaction proof | complete | Exercise target route/interaction or record blocker | selected TD via Vite store import; shop remained persistent |
| Browser console/network check | complete | Record console/network state or N/A | no failed requests, no page errors; only Vite/Phaser startup logs |
| Browser final proof artifact | complete | Record screenshot/trace/route proof or exact caveat | `/tmp/td-square-arena-bottom-skills-proof.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan and identified rectangular arena regression | implementation |
| Implementation | complete | CSS square/dock layout plus HUD post-render square sync | verification |
| Verification | complete | build and browser rect proof passed | closeout |
| Closeout | complete | check-complete closeout status fixed | final response |

Findings:
- Current TD overlay uses `aspect-ratio: 4 / 5`, introduced by the previous dock change.
- Previous browser proof measured arena at 552 x 418.6875, confirming the user-reported non-square play area.
- CSS-only sizing was insufficient because the TD panel keeps inline resized dimensions; a post-render sync is needed to bind arena size to actual panel width.
- Final browser proof measured the TD arena at 385 x 385 with the skills dock directly below it.

Decisions and tradeoffs:
- Keep the taller overall TD overlay because the user wants a square play area plus skill UI below; make only the arena square.
- Use CSS `--defense-arena-size` so width/height and dock rows share one source of truth.
- Replaced the pure CSS size assumption with `syncDefenseSquarePanel()` after render; this respects the existing draggable/resizable panel system instead of fighting its inline sizing.
- Kept the dock compact under the square playfield rather than stretching the arena vertically. The square playfield is the stricter requirement.

Timeline:
- 2026-06-28T18:11:42.793Z: plan created.
- 2026-06-28T18:12:23Z: goal created.
- 2026-06-28T18:13:00Z: source/current browser evidence identified the rectangular arena regression.
- 2026-06-28T18:17:00Z: added measured square sync and CSS variables for arena/shop rows.
- 2026-06-28T18:20:00Z: `npm run build` passed.
- 2026-06-28T18:21:00Z: browser proof passed with arena 385 x 385 and dock below.

Verification evidence:
- Source audit: `src/style.css` uses `--defense-arena-px` and `--defense-shop-px` for TD overlay width/height and grid rows; `.defense-arena` is `aspect-ratio: 1 / 1`.
- Source audit: `src/ui/hud.ts` calls `syncDefenseSquarePanel()` after panel rendering/drag setup and sets measured `--defense-arena-px` / `--defense-shop-px`.
- Build: `npm run build` passed with `tsc && vite build`; only the existing chunk-size warning remained.
- Browser proof: Chrome/Playwright opened `http://127.0.0.1:5174/`, selected defense, and measured `.defense-arena` at 385 x 385.
- Browser proof data: `arenaIsSquare: true`, `squareDiffPx: 0`, `arenaFillsOverlayWidth: true`, `dockBelowArena: true`, `dockFillsArenaWidth: true`, `dockTouchesOverlayBottom: true`.
- Browser proof data: `persistentShop: true`, `topLeftSkillButtons: 0`, `floatingUpgradePanels: 0`, `cards: 7`.
- Browser console/network: no page errors and no failed requests; only Vite and Phaser startup logs.
- Screenshot proof: `/tmp/td-square-arena-bottom-skills-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Square TD play area with skills dock below |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- The bottom shop is necessarily more compact under a square arena at the current panel size; if a denser shop is needed, the next step is increasing TD panel width/placement, not stretching the arena.
