# arc typing letter stones

Objective:
Render each Arc Typing letter on a stone tile; done when source audit, typecheck/build, and browser proof pass.

Goal plan:
docs/plans/2026-06-26-arc-typing-letter-stones.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: "pour le mini jeu arc typing je veux que pour chaque lettre, y a une pierre"
- acceptance criteria: On the Arc Typing mini-game, every displayed word letter is visibly contained in its own rune-stone tile, using the supplied stone-rune reference as visual direction.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A, no timed checkpoint requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: record final score confiance in final response per repo instruction

Completion threshold:
- `src/ui/hud.ts` still renders one wrapper per letter.
- `src/style.css` renders each `.typing-word .typing-stone` as an individual stone/rune tile, with distinct typed, active, and mistake states.
- `npm run typecheck` and `npm run build` pass.
- Browser proof shows Arc Typing with each visible letter on a stone.

Verification surface:
- Source audit: `src/ui/hud.ts` typing letter rendering and `.typing-word .typing-stone` CSS.
- Commands: `npm run typecheck`, `npm run build`.
- Browser proof: local Vite app, Arc Typing panel screenshot.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/ui/hud.ts`, `src/style.css`, `CONTEXT.md` vocabulary for Arc Typing.
- Allowed edit scope: typing panel markup/CSS and this plan.
- Browser surface: local Vite app Arc Typing book panel.
- Tracker sync: N/A, no issue requested.
- Non-goals: no new gameplay mechanics, no new resource logic, no generated Spriterrific runtime spritesheet unless implementation proves it is needed.

Current verdict:
- verdict: valid feature request
- confidence: 82/100 before implementation
- next owner: task
- reason: The current UI renders letters as plain spans; making each span a stone tile is the durable UI owner.

Pre-solution issue challenge:
- reporter claim: Arc Typing letters should each have a stone.
- suggested diagnosis or fix: Style every rendered letter as an individual rune stone tile.
- repro ladder:
  - tests / source-level repro: source currently maps each letter to a plain `<span>`.
  - repo-owned automated browser or integration proof: use Vite browser proof after implementation.
  - Browser plugin: try browser-use first per project instruction; if unavailable, record waiver and use available browser automation.
  - screenshot / visual proof: capture final Arc Typing panel screenshot.
- reproduction verdict: valid by source audit
- validity verdict: valid
- best long-term fix boundary: typing panel CSS, with minimal markup metadata if needed
- harsh honest feedback: Generating a whole spritesheet for this would be overkill; the asked effect is a per-letter UI treatment.
- hard-stop decision: proceed

Blocked condition:
- Stop only if the app cannot be built or no callable/browser fallback can render the local app for visual proof after code verification.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-arc-typing-letter-stones.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Requirement copied into Task source and Completion threshold. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | `get_goal` returned null; created active goal for this plan. |
| Source of truth read before edits | yes | Read `src/ui/hud.ts` `typingPanel`, `src/style.css` typing styles, `CONTEXT.md` matches Arc Typing vocabulary from `rg`. |
| Acceptance criteria captured | yes | See Task source and Completion threshold. |
| Pre-solution issue challenge required | no | N/A: feature request, not a bug report, but source audit confirms current plain letters. |
| Reproduction verdict before implementation | yes | Valid by source audit: letters currently render as plain spans. |
| Repro escalation ladder selected | yes | Source audit, typecheck/build, browser screenshot proof. |
| Suggested fix reviewed against durable boundary | yes | Durable boundary is typing panel CSS/markup, not simulation state. |
| TDD decision before behavior change or bug fix | yes | N/A: visual-only UI polish; source audit plus browser proof is stronger than fake unit tests here. |
| Browser proof decision for browser surface | yes | Required; Arc Typing is a browser UI surface. |
| Browser pack selected | yes | Applied browser pack. |
| Browser route / app surface identified | yes | Local Vite app Arc Typing book panel. |
| Browser tool decision recorded | yes | Must try browser-use first; fallback only if unavailable. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Passed: source audit found one `.typing-stone` per typed letter, `npm run typecheck`, `npm run build`, browser proof screenshot. |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: feature request; source audit still recorded valid current gap. |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: not a bug report; source audit plus browser proof used. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: visual feature request, not a bug. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Source audit and browser proof: word `aether`, 6 letters, 6 `.typing-stone`, 1 active letter. |
| TypeScript or typed config changed | yes | Run relevant typecheck | Passed: `npm run typecheck`. |
| Build-sensitive behavior changed | yes | Run relevant build/check | Passed: `npm run build`; Vite emitted existing large chunk warning only. |
| Browser surface changed | yes | Capture browser proof | Passed: `http://127.0.0.1:5174/`, Arc Typing screenshot `/tmp/library-magic-arc-typing-stones-final-selector.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script in `package.json`. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Accepted: diff limited to `hud.ts`, `style.css`, and this plan; no simulation/resource changes. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-arc-typing-letter-stones.md` | Run after plan closure. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Used Chrome system via Playwright fallback: opened menu, selected Arc Typing, observed stones. |
| Browser console/network check | yes | Record console/network state or N/A | Console had Vite/Phaser logs and one generic 404 resource message; Playwright `requestfailed` list was empty. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Screenshot: `/tmp/library-magic-arc-typing-stones-final-selector.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Plan created; `typingPanel` and typing CSS read. | implementation |
| Implementation | complete | Added `typing-stone` class in `hud.ts`; restyled `.typing-word .typing-stone` as rune stones in CSS. | verification |
| Verification | complete | `npm run typecheck`, `npm run build`, browser proof screenshot. | closeout |
| Closeout | complete | Autoreview recorded; plan checker to run. | final response |

Findings:
- `typingPanel` maps each character in the current word to one `.typing-word span`, which is the right hook for one stone per letter.
- Existing `.typing-word span` styling is plain text only.
- Browser proof after implementation: `aether` rendered with 6 `.typing-stone` elements for 6 letters; boxes were stable at roughly 35x41 to 36x42 px and fit on one row.

Decisions and tradeoffs:
- Use CSS-rendered stone tiles instead of generating 26 separate Spriterrific sprites: this is faster, responsive, and keeps the exact current dynamic word rendering. The supplied Spriterrific/reference image informs the visual direction, but no generative sprite run is needed for this UI-level request.
- Resized stones after first screenshot because the first pass wrapped `AETHER`; smaller stable tiles support words up to the current 8-letter maximum better.

Timeline:
- 2026-06-26T08:59:17.357Z: plan created.
- 2026-06-26: requirements extracted; source owner identified as `typingPanel` plus typing CSS.
- 2026-06-26: implemented one `typing-stone` wrapper per rendered letter and rune-stone CSS states.
- 2026-06-26: ran `npm run typecheck` and `npm run build` successfully.
- 2026-06-26: captured browser proof at `/tmp/library-magic-arc-typing-stones-final-selector.png`.

Verification evidence:
- `npm run typecheck` passed.
- `npm run build` passed; Vite reported only the large bundle warning.
- Source audit: `src/ui/hud.ts` renders each word character as `<span class="typing-stone ...">`; `src/style.css` styles `.typing-word .typing-stone` as individual stone tiles.
- Browser proof: Chrome system via Playwright fallback at `http://127.0.0.1:5174/`; Arc Typing word `aether` had 6 letters and 6 `.typing-stone` nodes; screenshot `/tmp/library-magic-arc-typing-stones-final-selector.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Each Arc Typing letter is visibly rendered on a stone tile. |
| What have I learned? | `typingPanel` already creates one span per letter; CSS owns the stone treatment cleanly. |
| What have I done? | Implemented, verified, browser-tested, and recorded evidence. |

Open risks:
- Browser-use was unavailable; fallback used Chrome system via Playwright. One generic 404 resource console message remains unrelated to this change.
