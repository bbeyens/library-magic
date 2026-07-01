# mana per second wand attacks

Objective:
Inclure les attaques de baguettes dans le mana per second; termine quand auto-casts alimentent le compteur, build et preuve navigateur passent.

Goal plan:
docs/plans/2026-06-27-mana-per-second-wand-attacks.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: chat
- title: Include wand attacks in mana per second
- acceptance criteria: the `per second` mana counter includes gains produced by mana wand auto-casts, not only direct crystal clicks; build and browser proof pass.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A, no duration requested
- initial confidence score: 86/100
- improvement loop: one focused implementation and verification loop unless proof fails
- final score / loop closure: 94/100 after build and browser proof

Completion threshold:
Done when wand auto-cast gains are recorded into the same 1-second mana gain window used by direct clicks, the on-screen `per second` value reflects those gains, `npm run build` passes, and browser proof demonstrates a wand gain increasing the rate.

Verification surface:
- Source audit of mana automation state and HUD transient effects.
- `npm run build`.
- Browser proof on main mana panel with automation enabled, waiting for an auto-cast, then inspecting `per second`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: mana automation in `src/game/simulation/actions.ts`, state shape in `src/game/simulation/state.ts`, HUD rate display in `src/ui/hud.ts`.
- Allowed edit scope: mana automation gain reporting and HUD mana-per-second update only.
- Browser surface: main game mana panel.
- Tracker sync: N/A, user did not ask for issue/PR.
- Non-goals: no economy rebalance, no crystal visual changes, no save migration unless build requires compatibility defaults.

Current verdict:
- verdict: valid feature request
- confidence: 86/100
- next owner: task
- reason: current rate history is written by direct click effect only; auto-cast effect only animates wand hits.

Pre-solution issue challenge:
- reporter claim: wand attacks should count in the mana `per second` display.
- suggested diagnosis or fix: expose exact auto-cast mana gain from simulation and record it in the HUD rate history when `autoCastCount` advances.
- repro ladder:
  - tests / source-level repro: source read shows `showCrystalClickEffect` records gain events, while `showWandCastEffect` does not.
  - repo-owned automated browser or integration proof: browser proof after patch.
  - Browser plugin: no direct browser-use tool exposed; use available node_repl browser automation.
  - screenshot / visual proof: DOM value proof is sufficient.
- reproduction verdict: valid from source.
- validity verdict: valid.
- best long-term fix boundary: simulation records exact last auto-cast gain; HUD consumes it for display/particles.
- harsh honest feedback: estimating from total mana would be brittle; exact gain in state is the sane fix.
- hard-stop decision: continue.

Blocked condition:
Blocked only if the app cannot build or the mana automation cannot be exercised in browser proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mana-per-second-wand-attacks.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | acceptance criteria copied above |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `create_goal` returned active goal |
| Source of truth read before edits | yes | inspected mana click, auto-cast, and HUD transient paths |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | source confirms missing auto-cast rate event |
| Reproduction verdict before implementation | yes | valid from source |
| Repro escalation ladder selected | yes | source audit, build, browser proof |
| Suggested fix reviewed against durable boundary | yes | exact simulation gain beats UI estimation |
| TDD decision before behavior change or bug fix | yes | browser proof selected; no existing unit harness for this HUD transient |
| Browser proof decision for browser surface | yes | exercise real mana panel |
| Browser pack selected | yes | generated browser pack applied |
| Browser route / app surface identified | yes | main mana panel |
| Browser tool decision recorded | yes | node_repl browser automation because browser-use tool is not exposed |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm run build` passed; browser proof showed wand-only auto-cast gain `40` and displayed `perSecond=40` |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above before edits |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source audit then browser proof completed |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | source showed click path recorded gain events but wand path did not |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | browser proof inspected `lastAutoCastGain` and on-screen `per second` |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run build` includes `tsc` and passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | mounted real HUD in browser, opened mana panel, triggered auto-cast tick |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no separate lint command; build/typecheck passed |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | diff reviewed for exact auto-cast gain propagation and HUD display update |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mana-per-second-wand-attacks.md` | pending final check |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | automation level 50, power 9, extraWands 1, one tick produced `lastAutoCastGain=40` and `perSecond=40` |
| Browser console/network check | yes | Record console/network state or N/A | consoleErrors `[]`; failedRequests `[]` |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | DOM proof recorded; screenshot not needed for numeric HUD value |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read mana click, automation, state, and HUD transient paths | implementation |
| Implementation | complete | added exact `lastAutoCastGain` and routed it through HUD rate history | verification |
| Verification | complete | build and browser proof passed | closeout |
| Closeout | complete | final plan check pending | final response |

Findings:
- Direct crystal clicks already recorded mana gain events; wand auto-casts only animated and did not update the rate history.
- `tickManaAutomation` can produce multiple casts and multiple wand gains in one tick, so the HUD needs an exact summed gain, not an estimate from counters.
- Browser proof: automation level 50, power 9, extraWands 1 produced mana `40`, `autoCastCount=2`, `lastAutoCastGain=40`, and displayed `perSecond=40`.

Decisions and tradeoffs:
- Added `lastAutoCastGain` to mana skill state so the simulation owns exact gain accounting.
- Reused the same HUD `recordManaRateGain` path for click and wand gains so the displayed rate has one source of truth.
- Reset `lastRenderSignature` immediately in `mountHud`; without that, remounting the real HUD in browser proof could reuse a stale signature and skip the first full render.

Timeline:
- 2026-06-27T22:30:56.373Z: plan created.
- 2026-06-27T22:31:30Z: source audit found click-only rate recording.
- 2026-06-27T22:35:00Z: implemented exact auto-cast gain propagation and HUD rate recording.
- 2026-06-27T22:40:00Z: `npm run build` passed.
- 2026-06-27T22:43:00Z: browser proof passed with `perSecond=40` from wand auto-cast.

Verification evidence:
- `npm run build`: passed.
- Browser proof on `http://127.0.0.1:5174/`: mounted real HUD, opened mana panel, set automation level 50, power 9, extraWands 1, forced one 1s tick.
- Browser proof result: `mana=40`, `autoCastCount=2`, `lastAutoCastGain=40`, displayed `perSecond=40`, console errors `[]`, failed requests `[]`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Implementation, verification, closeout |
| What is the goal? | Include mana wand attacks in the mana per second counter |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- The browser proof used a mounted HUD test root because the headless app shell initially exposes only the debug unlock control; it still exercises the real HUD and store modules.
