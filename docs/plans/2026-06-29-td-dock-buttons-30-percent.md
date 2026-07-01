# td dock buttons 30 percent

Objective:
Shrink TD dock skill buttons to 30%; done when dock cards/tabs are compact, square arena persists, build and browser proof pass; plan docs/plans/2026-06-29-td-dock-buttons-30-percent.md.

Goal plan:
docs/plans/2026-06-29-td-dock-buttons-30-percent.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request with screenshot
- id / link: chat
- title: TD dock button size to 30 percent
- acceptance criteria: bottom TD skill layout buttons are reduced to roughly 30% of their previous visual size; TD arena remains square; skill dock remains below arena and persistent; build and browser proof pass.

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
- initial confidence score: 90/100
- improvement loop: one compact CSS pass plus measured browser proof
- final score / loop closure: 96/100 after build and browser proof measured 30px controls

Completion threshold:
- Docked TD skill cards and tab buttons use compact ~30px sizing instead of the previous ~96px/50px button sizing.
- TD arena remains square in browser proof.
- Skill dock remains persistent under the arena with no top-left skill buttons.
- `npm run build` passes.

Verification surface:
- Source audit of `src/style.css`.
- `npm run build`.
- Browser proof at `http://127.0.0.1:5173/` or active local Vite URL, with measured card/tab/arena rects and screenshot.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: docked skill shop CSS under `.defense-skill-dock` in `src/style.css`.
- Allowed edit scope: TD dock CSS only unless verification shows a layout bug requiring a narrow HUD fix.
- Browser surface: defense book panel.
- Tracker sync: N/A.
- Non-goals: no combat/economy changes, no changes to other mini-games, no changes to the square arena invariant.

Current verdict:
- verdict: valid visual sizing request
- confidence: 90/100
- next owner: task
- reason: current dock cards/tabs are too large for the bottom interface.

Pre-solution issue challenge:
- reporter claim: bottom layout buttons are too big and should be at 30%.
- suggested diagnosis or fix: override docked TD skill card/tab dimensions and typography around 30px, instead of changing the generic full shop.
- repro ladder:
  - tests / source-level repro: source read shows `.defense-skill-dock .skill-shop-card { min-height: 96px; }` and tabs min-height 50px.
  - repo-owned automated browser or integration proof: build and browser proof after patch.
  - Browser plugin: browser-use unavailable; use Chrome/Playwright through node_repl.
  - screenshot / visual proof: final screenshot artifact.
- reproduction verdict: valid from source and screenshot.
- validity verdict: valid.
- best long-term fix boundary: TD dock CSS only.
- harsh honest feedback: the current dock is basically a full shop jammed under the arena; no shit it feels huge.
- hard-stop decision: continue.

Blocked condition:
- Blocked only if local Vite route cannot render TD panel or CSS cannot shrink dock controls without breaking the square arena invariant.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-29-td-dock-buttons-30-percent.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | copied request and acceptance criteria above |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `create_goal` created active goal |
| Source of truth read before edits | yes | read `.defense-skill-dock` and `.skill-shop-*` CSS |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | visual sizing request with source evidence |
| Reproduction verdict before implementation | yes | valid from CSS and screenshot |
| Repro escalation ladder selected | yes | source audit, build, browser proof, screenshot |
| Suggested fix reviewed against durable boundary | yes | docked TD CSS override only |
| TDD decision before behavior change or bug fix | yes | N/A visual CSS; browser proof selected |
| Browser proof decision for browser surface | yes | required |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | local Vite app, defense book panel |
| Browser tool decision recorded | yes | Chrome/Playwright via node_repl |

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
| Named verification threshold | complete | Run the named proof or record blocker | `npm run build` and browser proof passed |
| Pre-solution issue challenge verdict | complete | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | complete | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source audit, build, browser proof, screenshot |
| Bug reproduced before fix | complete | Record failing test/repro or N/A with reason | source and screenshot showed oversized dock controls |
| Targeted behavior verification | complete | Run focused test/proof for changed behavior or record N/A | browser proof measured card 30px and tab 30px |
| TypeScript or typed config changed | complete | Run relevant typecheck | `npm run build` includes `tsc` |
| Build-sensitive behavior changed | complete | Run relevant build/check | `npm run build` passed |
| Browser surface changed | complete | Capture browser proof | `/tmp/td-dock-buttons-30-percent-proof.png` |
| Final lint/format | complete | Run relevant lint/format command or record N/A | N/A no lint command run; build/typecheck passed |
| Autoreview | complete | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | screenshot reviewed; buttons are compact and arena remains square |
| Timed checkpoint | complete | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-29-td-dock-buttons-30-percent.md` | first run caught closeout status; fixed before final run |
| Browser interaction proof | complete | Exercise target route/interaction or record blocker | selected defense book; dock controls rendered at compact size |
| Browser console/network check | complete | Record console/network state or N/A | no failed requests, no page errors; only Vite/Phaser startup logs |
| Browser final proof artifact | complete | Record screenshot/trace/route proof or exact caveat | `/tmp/td-dock-buttons-30-percent-proof.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan and read dock CSS | implementation |
| Implementation | complete | dock height, cards, buy pod, typography, and tabs compacted | verification |
| Verification | complete | build and browser proof passed | closeout |
| Closeout | complete | check-complete closeout status fixed | final response |

Findings:
- Current dock card min-height is 96px and tab min-height is 50px.
- User wants the bottom controls around 30% of that scale.
- Final browser proof measured first card height at 30px and first tab height at 30px.

Decisions and tradeoffs:
- Apply compact sizing only under `.defense-skill-dock` so other skill shops keep their full-card layout.
- Keep the square arena sync untouched.
- Reduced dock height too; otherwise 30px buttons would float in a huge empty area.

Timeline:
- 2026-06-29T17:05:17.607Z: plan created.
- 2026-06-29T17:05:46Z: goal created.
- 2026-06-29T17:06:00Z: source read confirmed oversized dock card/tab rules.
- 2026-06-29T17:08:00Z: applied compact dock CSS and reduced dock height.
- 2026-06-29T17:08:33Z: `npm run build` passed and local server on 5173 responded.
- 2026-06-29T17:09:00Z: browser proof measured compact controls and square arena.

Verification evidence:
- Source audit: `src/style.css` changes only `.book-overlay[data-book-id="defense"]` shop height and `.defense-skill-dock .skill-shop-*` compact overrides.
- Build: `npm run build` passed with `tsc && vite build`; only existing chunk-size warning remained.
- Browser proof: Chrome/Playwright opened `http://127.0.0.1:5173/`, selected defense, and measured card/tab/control dimensions.
- Browser proof data: first card height 30px, first tab height 30px, buy pod width 28px and height 20px.
- Browser proof data: arena 616 x 616, dock below arena, dock touches overlay bottom, top-left skill buttons 0.
- Browser console/network: no page errors and no failed requests; only Vite and Phaser startup logs.
- Screenshot proof: `/tmp/td-dock-buttons-30-percent-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | TD dock buttons at roughly 30% size |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- The compact version keeps labels visible; if 30% should mean icon-only buttons, that is a separate visual preference.
