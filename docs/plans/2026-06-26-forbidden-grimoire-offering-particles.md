# forbidden grimoire offering particles

Objective:
Add grimoire offering particles; done when offer click animates resource particles from source books to grimoire and checks/browser proof pass.

Goal plan:
docs/plans/2026-06-26-forbidden-grimoire-offering-particles.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user chat
- id / link: local Codex thread
- title: Forbidden grimoire offering particles
- acceptance criteria: clicking the forbidden grimoire offering button should animate many particles of each offered resource from that resource's source book to the forbidden grimoire, with a game-feel implementation rather than static UI-only feedback.

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
- improvement loop: add Phaser motion feedback, verify type/build/browser screenshots.
- final score / loop closure: 95/100. The animation now reads as resource streams traveling from source books to the forbidden grimoire, with one-resource and two-resource browser proof.

Completion threshold:
- `offerForbiddenGrimoire` visual feedback launches resource-specific particles from the matching source book toward the forbidden grimoire.
- Particle count scales enough to feel like a burst but is capped to avoid spam/perf issues.
- The existing offering progression, seal breaking, and HUD state remain functional.
- Typecheck, build, and browser proof pass.

Verification surface:
- `npm run typecheck`
- `npm run build`
- web-game Playwright client or recorded blocker/waiver
- browser screenshots before/during/after offering animation
- console/network check

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/phaser/scenes/LibraryScene.ts`, `src/game/simulation/actions.ts`, resource/book content.
- Allowed edit scope: Phaser library scene visuals plus goal/progress proof artifacts.
- Browser surface: local Vite app route.
- Tracker sync: N/A.
- Non-goals: rebalance economy, regenerate art, redesign the whole hub, change unlock costs.

Current verdict:
- verdict: in_progress
- confidence: 88/100
- next owner: task
- reason: visual gameplay feedback has a clear source and browser-verifiable outcome.

Pre-solution issue challenge:
- reporter claim: filling the forbidden grimoire resource bars lacks a game-feel animation.
- suggested diagnosis or fix: launch resource particles from the source book to the forbidden grimoire when offerings are sent.
- repro ladder:
  - tests / source-level repro: current `activateForbiddenRitual` only tweens the grimoire aura after dispatching the offer.
  - repo-owned automated browser or integration proof: browser proof will click debug resource hotkey and offering button.
  - Browser plugin: browser-use not exposed in this thread; use web-game client and Chrome fallback if needed.
  - screenshot / visual proof: capture during animation.
- reproduction verdict: valid feature gap.
- validity verdict: valid.
- best long-term fix boundary: Phaser scene owns this presentation; simulation state should stay pure.
- harsh honest feedback: the bar update is mechanically correct but visually dead; for a magic hub that feels cheap.
- hard-stop decision: proceed.

Blocked condition:
- Stop if local app cannot load or screenshots cannot capture the animation after source/browser fallback attempts.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-forbidden-grimoire-offering-particles.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User explicitly requested an animation when filling the bar: many particles of the resource leave the book and arrive in the forbidden grimoire, using a game-oriented skill/workflow. |
| Timed checkpoint parsed | no | No duration requested. |
| Active goal checked or created | yes | `get_goal` returned none; active goal created. |
| Source of truth read before edits | yes | Read `LibraryScene.ts`, `actions.ts`, state/store, forbidden grimoire content. |
| Acceptance criteria captured | yes | Captured above. |
| Pre-solution issue challenge required | yes | Visual/game-feel feature gap challenged above. |
| Reproduction verdict before implementation | yes | Valid feature gap: current offer only aura-tweens. |
| Repro escalation ladder selected | yes | Source audit plus browser visual proof. |
| Suggested fix reviewed against durable boundary | yes | Keep simulation pure; scene owns particles. |
| TDD decision before behavior change or bug fix | no | Visual feedback only; browser proof is more honest than fake unit tests. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Plan created with browser pack. |
| Browser route / app surface identified | yes | Local Vite route. |
| Browser tool decision recorded | yes | Try web-game client; browser-use unavailable, fallback to Chrome/Playwright if needed. |

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
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | Valid feature gap: previous offer action had aura pulse but no resource transfer particles. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Chrome proof clicked debug resource hotkey, offered one-resource seal, broke seal, then offered two-resource seal. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed with existing Vite chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | Screenshots saved under `docs/plans/2026-06-26-offering-particles-*.png`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | No lint/format script in `package.json`; typecheck/build used. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed `LibraryScene.ts` particle path and screenshots; no unrelated dirty files reverted. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-forbidden-grimoire-offering-particles.md` | Ready for final check after evidence recorded. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Local route `http://127.0.0.1:5177/`; offer button exercised for seal 1 and seal 2. |
| Browser console/network check | yes | Record console/network state or N/A | No console errors and no failed network requests in Chrome fallback proof. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `2026-06-26-offering-particles-mana-trail.png` and `2026-06-26-offering-particles-two-resources-clean.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read scene/simulation source and created plan | implementation |
| Implementation | complete | added resource transfer particles, trails, impacts, and ritual row pulse in `LibraryScene.ts` | verification |
| Verification | complete | typecheck/build/browser proof complete; web-game client blocker recorded | closeout |
| Closeout | complete | plan updated; ready for mechanical check | final response |

Findings:
- Current offer path dispatches `offerForbiddenGrimoire` then only pulses `grimoireAura`; there is no per-resource transfer feedback.
- Resource definitions already map resources to source books, which is the right ownership for particle origins.
- The bundled web-game Playwright client could not launch its default Chromium headless shell; system Chrome fallback worked and captured the real animation.

Decisions and tradeoffs:
- Keep particles as Phaser game objects and tweens instead of adding DOM/CSS; this preserves game-feel and avoids splitting the visual layer.
- Use resource SVG icons already loaded for the HUD instead of generating separate particle assets.
- Add glow trails behind particles because icon-only particles were too subtle in screenshots.

Timeline:
- 2026-06-26T18:26:50.126Z: plan created.
- Filled plan and created active goal before implementation.
- Implemented `animateForbiddenOfferingTransfer`, `pulseRitualRequirement`, and `flashForbiddenGrimoireImpact`.
- Ran `npm run typecheck`: pass.
- Ran `npm run build`: pass with Vite chunk-size warning.
- Ran web-game client: blocked by missing Playwright Chromium headless shell.
- Captured actual animation in system Chrome fallback.

Verification evidence:
- `npm run typecheck`: pass.
- `npm run build`: pass; Vite chunk-size warning remains.
- Web-game client attempt: blocked by missing `/Users/joellebeyens/Library/Caches/ms-playwright/chromium_headless_shell-1228/...`.
- Chrome fallback: canvas loaded at `http://127.0.0.1:5177/`, no console errors, no failed requests.
- Screenshots:
  - `docs/plans/2026-06-26-offering-particles-mana-trail.png`
  - `docs/plans/2026-06-26-offering-particles-two-resources-clean.png`
  - `docs/plans/2026-06-26-offering-particles-two-resources-after.png`

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Add game-feel resource particles from source books to the forbidden grimoire on offering. |
| What have I learned? | The effect needed visible trails to read clearly as motion in proof captures. |
| What have I done? | Implemented and verified the animation. |

Open risks:
- The proof uses system Chrome fallback because the web-game client Chromium install is missing.
