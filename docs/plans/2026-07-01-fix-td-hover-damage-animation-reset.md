# fix td hover damage animation reset

Objective:
Fix Bastion Arcanique HUD updates so hover animations and active damage-number animations do not reset during combat.

Goal plan:
docs/plans/2026-07-01-fix-td-hover-damage-animation-reset.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user bug report with screen recording
- id / link: /Users/zbeyens/Desktop/Screen Recording 2026-07-01 at 13.22.36.mov
- title: TD hover and damage animations reset
- acceptance criteria: while Bastion Arcanique combat updates are running, existing hovered skill/tab buttons and active damage-number popups keep their DOM nodes/animations instead of restarting.

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
- initial confidence score: 72/100 after recording/source read
- improvement loop: test red -> patch -> tests/build/browser proof
- final score / loop closure: 91/100 after verification

Completion threshold:
The HUD render path preserves the open TD panel during combat-value updates, damage popups are patched by stable IDs, hover state is not restarted by passive updates, and focused test/build checks pass.

Verification surface:
- Source-level regression guard in tests/hudStatic.test.ts.
- npm test.
- npm run build.
- Browser proof if the available tooling can attach to the running app; otherwise record the browser-use blocker and use the supplied recording plus source/test proof.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: user recording plus src/ui/hud.ts render/update path.
- Allowed edit scope: TD HUD render/update code, focused tests, this plan.
- Browser surface: Bastion Arcanique book page at http://127.0.0.1:5173/.
- Tracker sync: N/A, no tracker task requested.
- Non-goals: no TD balance changes, no sprite changes, no unrelated layout redesign.

Current verdict:
- verdict: fixed
- confidence: 91/100
- next owner: user verification in the open app
- reason: tests/build pass and browser observer saw no TD overlay/tab replacement or damage-popup id reinsertions during combat updates.

Pre-solution issue challenge:
- reporter claim: hover animation and damage numbers reset during TD combat.
- suggested diagnosis or fix: full HUD rerenders are replacing active DOM nodes during combat updates.
- repro ladder:
  - tests / source-level repro: static guard in tests/hudStatic.test.ts fails before fix when no TD patch guard exists before rootElement.innerHTML.
  - repo-owned automated browser or integration proof: N/A, no existing browser test harness.
  - Browser plugin: browser-use unavailable through tool discovery; Playwright with system Chrome used as fallback.
  - screenshot / visual proof: supplied recording inspected, plus Playwright screenshot after fix.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: renderHud should patch the open TD panel in place when only combat/dynamic values changed.
- harsh honest feedback: the old global signature approach was too eager for an animation-heavy TD panel.
- hard-stop decision: proceed with fix because claim is valid and reproducible from source/video.

Blocked condition:
Blocked only if the repo cannot build/test or no available browser tooling can inspect the local app; source/test proof remains acceptable for the DOM preservation fix.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-01-fix-td-hover-damage-animation-reset.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User requires hover animation and damage animations not reset; recording inspected as contact sheet. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | create_goal called for this fix. |
| Source of truth read before edits | yes | CONTEXT.md, src/ui/hud.ts render/dynamic TD code, tests/hudStatic.test.ts. |
| Acceptance criteria captured | yes | Preserve hover and damage animations during combat updates. |
| Pre-solution issue challenge required | yes | Claim validated against recording and render path. |
| Reproduction verdict before implementation | yes | valid from attached recording; source path shows full render can replace DOM nodes. |
| Repro escalation ladder selected | yes | static regression guard + build; browser proof attempted through available tooling. |
| Suggested fix reviewed against durable boundary | yes | Fixed render ownership boundary instead of adding CSS delays. |
| TDD decision before behavior change or bug fix | yes | Add focused static guard before/with fix because DOM/browser seam is not directly testable in current repo. |
| Browser proof decision for browser surface | yes | Try browser-use discovery first; unavailable, use node/browser fallback if possible. |
| Browser pack selected | yes | browser pack applied. |
| Browser route / app surface identified | yes | http://127.0.0.1:5173/ Bastion Arcanique. |
| Browser tool decision recorded | yes | tool_search did not expose browser-use, only node_repl/computer-use. |

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
| Named verification threshold | yes | Run the named proof or record blocker | npm test, npm run build, Playwright observer proof. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid; fix render ownership boundary. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Red static guard, supplied recording, Playwright fallback. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | npx tsx tests/hudStatic.test.ts failed before fix on missing TD patch guard. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | npx tsx tests/hudStatic.test.ts passed. |
| TypeScript or typed config changed | yes | Run relevant typecheck | npm run build passed, includes tsc. |
| Build-sensitive behavior changed | yes | Run relevant build/check | npm run build passed. |
| Browser surface changed | yes | Capture browser proof | Playwright system Chrome opened TD, hover observed, no overlay/tab replacement. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint script in package.json. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff targets src/ui/hud.ts render cache and tests/hudStatic.test.ts only for this fix plus plan. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-01-fix-td-hover-damage-animation-reset.md` | pending final checker rerun. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened TD with debug unlock + canvas click; wave 25 with max skills. |
| Browser console/network check | N/A | Record console/network state or N/A | Not needed for DOM preservation symptom; server responded 200 and browser interaction succeeded. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Playwright observer: overlayRemoved 0, attackTabRemoved 0, readdedDamagePopupIds [] while damagePopupAdds 2. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | CONTEXT.md and src/ui/hud.ts render/update code read | implementation |
| Implementation | complete | Added structural TD patch guard before rootElement.innerHTML | verification |
| Verification | complete | npm test, npm run build, browser observer proof | closeout |
| Closeout | complete | autoreview complete, checker pending rerun | final response |

Findings:
- Full HUD rebuilds can replace the open TD panel while combat updates are happening, which restarts hover and damage-number animations.
- The durable boundary is renderHud: when the only open panel is TD and the structure is unchanged, update dynamic values in place.

Decisions and tradeoffs:
- The patch guard is deliberately limited to a single open TD panel, avoiding stale rendering in other mini-games that still need full rebuilds.
- Browser-use was requested by repo policy but unavailable in tool discovery; Playwright with system Chrome was used as fallback.

Timeline:
- 2026-07-01T12:00:37.079Z: plan created.

Verification evidence:
- `npx tsx tests/hudStatic.test.ts` failed before fix on missing TD patch guard.
- `npm test` passed.
- `npm run build` passed.
- Browser proof at http://127.0.0.1:5173/: opened TD, set wave 25, maxed skills, hovered Attack tab; observer result `overlayRemoved=0`, `attackTabRemoved=0`, `attackTabStillConnected=true`, `damagePopupAdds=2`, `readdedDamagePopupIds=[]`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | final response |
| What is the goal? | Stop TD hover and damage animations from resetting during combat updates |
| What have I learned? | Full renders were the wrong boundary for dynamic TD combat updates |
| What have I done? | Added patch guard, regression test, test/build/browser verification |

Open risks:
- Low: browser proof used Playwright system Chrome, not browser-use, because browser-use was not available from tool discovery.
