# forbidden grimoire ritual hud redesign

Objective:
Redesign forbidden grimoire ritual HUD; done when the panel reads as a polished ritual/seal UI and typecheck/build/browser proof pass.

Goal plan:
docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-redesign.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user chat
- id / link: local Codex thread
- title: Forbidden Grimoire ritual HUD redesign
- acceptance criteria: current grimoire HUD is still visually bad; redesign it into a polished ritual/seal UI while keeping the underlying offering progression behavior.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: none
- semantics: N/A
- initial confidence score: 88/100
- improvement loop: improve visual hierarchy, reduce debug-panel feel, prove in browser.
- final score / loop closure: 94/100. The HUD is now a compact ritual plaque with distinct empty, ready, and next-seal states; remaining visual taste risk is limited to final art direction preference.

Completion threshold:
- Grimoire HUD no longer looks like a generic rectangular debug panel.
- HUD is styled as a ritual/seal interface anchored to the forbidden grimoire area.
- Resource rows remain readable for one and two-resource seals.
- `Offrir` / `Briser le sceau` remains functional.
- Typecheck, build, source audit, and browser proof pass.

Verification surface:
- `npm run typecheck`
- `npm run build`
- browser screenshots for base, ready-to-break, and second-seal states
- console/network check

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/phaser/scenes/LibraryScene.ts` and proof screenshots.
- Allowed edit scope: ritual HUD visuals/interactions in `LibraryScene.ts`, plan/proof artifacts.
- Browser surface: local Vite route.
- Tracker sync: N/A.
- Non-goals: regenerate hub art, rebalance economy, redesign mini-game panels.

Current verdict:
- verdict: complete
- confidence: 94/100
- next owner: user
- reason: HUD visual refactor implemented and verified with typecheck, build, and browser screenshots.

Pre-solution issue challenge:
- reporter claim: grimoire HUD is still very bad.
- suggested diagnosis or fix: replace generic panel composition with a ritual/seal UI.
- repro ladder:
  - tests / source-level repro: current `drawForbiddenRitualPanel` is a plain rectangle with rows and button.
  - repo-owned automated browser or integration proof: screenshot shows generic boxed panel.
  - Browser plugin: browser-use not exposed; use system Chrome fallback with note.
  - screenshot / visual proof: user screenshot shows issue.
- reproduction verdict: valid visual issue.
- validity verdict: valid.
- best long-term fix boundary: keep logic in simulation; redesign only Phaser ritual HUD presentation.
- harsh honest feedback: the current HUD is functional but has the vibe of an admin table, which is wrong for a forbidden grimoire.
- hard-stop decision: proceed.

Blocked condition:
Stop if local app cannot load for visual proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-redesign.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User wants the grimoire HUD improved because it is still visually bad. |
| Timed checkpoint parsed | no | No duration requested. |
| Active goal checked or created | yes | `get_goal` returned none; active goal created. |
| Source of truth read before edits | yes | Read `LibraryScene.ts` ritual HUD code and screenshot. |
| Acceptance criteria captured | yes | Captured above. |
| Pre-solution issue challenge required | yes | Visual issue challenged above. |
| Reproduction verdict before implementation | yes | Current panel is rectangular/debug-like. |
| Repro escalation ladder selected | yes | Source audit plus browser proof. |
| Suggested fix reviewed against durable boundary | yes | Phaser presentation only. |
| TDD decision before behavior change or bug fix | no | Visual-only change; browser proof is the right test. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Plan created with browser pack. |
| Browser route / app surface identified | yes | Local Vite route. |
| Browser tool decision recorded | yes | Use system Chrome fallback if browser-use unavailable. |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm run typecheck`, `npm run build`, browser screenshots passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above before implementation. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit plus browser visual proof. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | User screenshot and source audit reproduced generic debug-panel look. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Browser clicked debug resource hotkey and ritual button through empty, ready, and second-seal states. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed with existing Vite chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | Screenshots saved under `docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-*.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | No lint/format script in `package.json`; typecheck/build used. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed `LibraryScene.ts` diff and screenshots; no unrelated workspace diffs reverted. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-redesign.md` | First run found closeout status/evidence omissions; corrected before final run. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Chrome fallback exercised route at `http://127.0.0.1:5177/`, debug hotkey `o`, and ritual button. |
| Browser console/network check | yes | Record console/network state or N/A | No console errors and no failed network requests. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-base-v2.png`, `...-ready.png`, `...-second-seal.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan and read `LibraryScene.ts` ritual HUD code | implementation |
| Implementation | complete | replaced generic ritual panel with drawn ritual frame, seal badge, engraved resource rows, and custom button frame | verification |
| Verification | complete | typecheck, build, browser screenshots, console/network checks | closeout |
| Closeout | complete | plan updated; final check ready to rerun | final response |

Findings:
- Original HUD read as a rectangular debug/admin panel rather than a forbidden-grimoire ritual.
- A separate invisible click hitbox plus drawn graphics gives the ritual button a less web-UI feel while preserving behavior.

Decisions and tradeoffs:
- Kept the underlying offering progression intact and changed only the Phaser presentation layer.
- Browser-use was not exposed in this thread; used Chrome/Playwright fallback and recorded the waiver.

Timeline:
- 2026-06-26T18:08:08.363Z: plan created.
- Implemented compact ritual plaque, seal state colors, engraved offering rows, and custom ritual button frame in `src/phaser/scenes/LibraryScene.ts`.
- Ran `npm run typecheck`: pass.
- Ran `npm run build`: pass, with Vite chunk-size warning.
- Captured browser screenshots for empty, ready-to-break, and second-seal states.

Verification evidence:
- `npm run typecheck`: pass.
- `npm run build`: pass; Vite reported a chunk-size warning.
- Browser proof at `http://127.0.0.1:5177/`: canvas loaded, no console errors, no failed network requests.
- Screenshots:
  - `docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-base-v2.png`
  - `docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-ready.png`
  - `docs/plans/2026-06-26-forbidden-grimoire-ritual-hud-second-seal.png`

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Replace the weak forbidden-grimoire HUD with a polished ritual/seal UI. |
| What have I learned? | The HUD needed a compositional redesign, not a color tweak. |
| What have I done? | Implemented and verified the redesigned ritual HUD. |

Open risks:
- Visual taste remains subjective, but the current version is materially less debug-like and has proven one-row and two-row states.
