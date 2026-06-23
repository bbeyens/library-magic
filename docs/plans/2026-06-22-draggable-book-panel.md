# draggable book panel

Objective:
Make the opened book mini-game panel draggable like the reference video; done when drag works in-browser, stays bounded, and typecheck/build pass.

Goal plan:
docs/plans/2026-06-22-draggable-book-panel.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request with video reference
- id / link: /Users/zbeyens/Desktop/Screen Recording 2026-06-22 at 19.05.48.mov
- title: Draggable book mini-game panel
- acceptance criteria: Opened book panel can be moved like a floating window by click-drag; movement uses the panel's upper area; internal buttons still work; panel remains recoverable inside the game viewport; no unrelated behavior is intentionally changed.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested
- initial confidence score: N/A: no timed loop
- improvement loop: N/A: no timed loop
- final score / loop closure: N/A: no timed loop

Completion threshold:
- Dragging the visible `.book-overlay` by its top/header area changes its on-screen position during pointer movement.
- The panel is clamped so it cannot be dragged fully offscreen.
- Existing clickable controls inside the panel, including close/upgrade buttons and mini-game content, remain usable without accidental drag hijacking.
- `npm run typecheck` and `npm run build` pass.
- Browser proof exercises the real local app route.

Verification surface:
- Source audit: `src/ui/hud.ts` and `src/style.css` implement draggable panel behavior at the UI ownership boundary.
- Commands: `npm run typecheck`; `npm run build`.
- Browser proof: `http://127.0.0.1:5173/`, open a book panel and drag it.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: local TypeScript/CSS UI for opened book overlays.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, and this plan file if needed.
- Browser surface: `http://127.0.0.1:5173/`.
- Tracker sync: N/A: user did not ask for issue/PR updates.
- Non-goals: no redesign, no new mini-game, no persistence of panel position unless it falls out naturally.

Current verdict:
- verdict: valid feature request
- confidence: 0.86 before implementation
- next owner: task
- reason: video shows a desktop window being dragged; the analogous in-game behavior is a draggable floating book panel.

Pre-solution issue challenge:
- reporter claim: User wants to move the in-game surface like the reference window movement.
- suggested diagnosis or fix: Make the opened book panel draggable by pointer events.
- repro ladder:
  - tests / source-level repro: Source/UI owner is `src/ui/hud.ts`; behavior is not currently implemented.
  - repo-owned automated browser or integration proof: N/A: no existing automated browser suite found before edits.
  - Browser plugin: Required for final proof; browser-use unavailable in current tool list, Chrome UI proof acceptable fallback.
  - screenshot / visual proof: Video frames extracted to `/tmp/library-magic-move-ref/frame-*.png`.
- reproduction verdict: valid
- validity verdict: valid feature request
- best long-term fix boundary: UI overlay owner, not Phaser scene hitboxes.
- harsh honest feedback: Do not bind this to the whole overlay body or it will fight with mini-game clicking.
- hard-stop decision: proceed.

Blocked condition:
- Stop if the panel cannot be safely dragged without breaking mini-game clicks, or if browser verification cannot access the local app after implementation.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-draggable-book-panel.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Video request captured; panel drag acceptance criteria written before implementation |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | `get_goal` returned no active goal; `create_goal` created active goal for this plan |
| Source of truth read before edits | yes | Read `src/ui/hud.ts`, `src/style.css`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts` |
| Acceptance criteria captured | yes | Task source section has acceptance criteria |
| Pre-solution issue challenge required | yes | Valid feature request; proceed |
| Reproduction verdict before implementation | yes | Video frames show draggable window behavior |
| Repro escalation ladder selected | yes | Source audit plus browser proof |
| Suggested fix reviewed against durable boundary | yes | UI overlay owner, not Phaser |
| TDD decision before behavior change or bug fix | yes | Manual browser interaction is the right proof; unit tests would be brittle for pointer drag geometry |
| Browser proof decision for browser surface | yes | Required |
| Browser pack selected | yes | Applied `browser` pack |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/` |
| Browser tool decision recorded | yes | Try browser-use if available; otherwise Chrome UI proof fallback |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. N/A: no duration requested.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Verdict: valid feature request.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. Evidence: source audit plus extracted video frames; Chrome drag proof completed.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: proceed decision recorded.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: drag lives in HUD overlay owner.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: reviewed `src/ui/hud.ts` and `src/style.css` diff against newest prompt.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. Evidence: `browser-use` was not exposed; Computer Use Chrome drag proof used.
- [x] Browser pack: console and network errors are checked or explicitly out of scope. N/A: requested behavior is pointer movement; tool path did not expose console/network and `curl -I` proved route availability.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `npm run typecheck` pass; `npm run build` pass; Chrome drag moved panel and crystal click still produced `+1` / Mana 1 |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above: valid feature request, HUD overlay owner, proceed |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Video frames extracted; source owner identified; Chrome drag proof completed |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature request, not a bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Computer Use drag from `(858,176)` to `(630,250)` moved `.book-overlay`; click at `(764,468)` on crystal still produced `+1` / Mana 1 |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Real `http://127.0.0.1:5173/` Chrome proof completed |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: repo has no lint script required for this targeted TS/CSS change |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff keeps change to HUD/CSS plus plan; no commits/PRs; internal crystal click still works |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-draggable-book-panel.md` | `/Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs` passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Dragged panel in Chrome after implementation; screenshot state showed new position |
| Browser console/network check | no | Record console/network state or N/A | N/A: console/network not exposed by available browser tool; `curl -I` route check returned 200 |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Computer Use screenshots before and after drag in Chrome |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read source owner and video frames | implementation |
| Implementation | complete | Added draggable overlay behavior in `src/ui/hud.ts` and CSS support in `src/style.css` | verification |
| Verification | complete | typecheck/build/browser drag proof pass | closeout |
| Closeout | complete | evidence recorded; final checker ready | final response |

Findings:
- The reference video shows a foreground Chrome window being dragged over another window; the in-game analogue is a floating draggable book panel.
- The HUD is re-rendered from `src/ui/hud.ts`, so draggable position must be stored outside DOM nodes and reapplied on render.
- Dragging the whole overlay body would fight with mini-game clicks; the top/header area and move handle are the right drag surface.

Decisions and tradeoffs:
- Use module-level per-book panel positions rather than game simulation state. This keeps drag as presentation state and avoids polluting save/game logic.
- Keep clamp in HUD viewport with 8px padding so a panel cannot be lost offscreen.
- Use Computer Use Chrome proof because `browser-use` was not exposed in the available tools.

Timeline:
- 2026-06-22T17:09:23.382Z: plan created.
- 2026-06-22T17:10Z: active goal created.
- 2026-06-22T17:12Z: implemented panel drag state, pointer handlers, viewport clamp, and CSS drag positioning.
- 2026-06-22T17:14Z: `npm run typecheck` passed.
- 2026-06-22T17:14Z: `npm run build` passed.
- 2026-06-22T17:15Z: Chrome proof: dragged book panel from top/header area and clicked crystal after movement; Mana changed to 1 and `+1` appeared.
- 2026-06-22T17:16Z: autogoal checker passed.

Verification evidence:
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `curl -I http://127.0.0.1:5173/`: returned HTTP 200.
- Browser proof: Computer Use on Chrome, route `http://127.0.0.1:5173/`, drag from `(858,176)` to `(630,250)` visibly moved the panel; click at `(764,468)` on the moved panel's mana crystal produced `+1` and Mana 1.
- Goal plan checker: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-draggable-book-panel.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final checker and response |
| What is the goal? | Make opened book mini-game panels draggable like the reference video |
| What have I learned? | See Findings |
| What have I done? | Implemented and verified drag behavior |

Open risks:
- Browser console/network was not inspected because the available browser tool did not expose it; route loaded and interaction proof passed.
