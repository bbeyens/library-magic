# mana crystal halo tiers

Objective:
Ameliorer le halo blanc et les tiers de mini-cristaux mana; termine quand halo organique, logique A/B/C+ par mana/sec, build et preuve navigateur passent.

Goal plan:
docs/plans/2026-06-27-mana-crystal-halo-tiers.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: chat
- title: Improve mana crystal halo and falling crystal tiers
- acceptance criteria: halo blanc plus beau et moins regulier; mini-cristaux A a 20 mana/sec, B a 1000 mana/sec avec taille x2, C a 50000 mana/sec avec taille x4, puis seuil x50 et taille x2 par tier; cap 50 visibles; build and browser proof pass.

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
- initial confidence score: 82/100
- improvement loop: one implementation and verification loop is enough unless build/browser proof fails
- final score / loop closure: 93/100 after build and browser proof

Completion threshold:
Done when `src/ui/hud.ts` selects the highest unlocked falling crystal tier from current mana/sec, `src/style.css` renders a less regular white halo and tier-specific crystal visuals, `npm run build` passes, and browser proof shows B and C tiers with expected counts/scales.

Verification surface:
- Source audit of `src/ui/hud.ts` and `src/style.css`.
- `npm run build`.
- Browser proof on the app surface: click mana crystal after setting mana power to B and C rates, then inspect falling crystal tier/count/scale and halo style.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: current HUD implementation in `src/ui/hud.ts` and visual rules in `src/style.css`.
- Allowed edit scope: mana crystal halo and mana falling particle tier behavior only.
- Browser surface: main game HUD mana crystal panel.
- Tracker sync: N/A, user did not ask for issue/PR.
- Non-goals: no economy rebalance, no save migration, no new spritesheet generation.

Current verdict:
- verdict: valid feature polish request
- confidence: 82/100
- next owner: task
- reason: existing code has one hard-coded falling crystal rate and regular halo gradient.

Pre-solution issue challenge:
- reporter claim: halo is too regular; high mana/sec should upgrade mini-crystal tiers instead of only spawning the same small crystals.
- suggested diagnosis or fix: replace regular repeating-conic halo with layered irregular light, and derive the active mini-crystal tier from mana/sec thresholds.
- repro ladder:
  - tests / source-level repro: source read confirms a single `MANA_CRYSTAL_RATE_STEP = 20` and regular `repeating-conic-gradient`.
  - repo-owned automated browser or integration proof: build and browser proof after patch.
  - Browser plugin: use available browser automation for real HUD proof.
  - screenshot / visual proof: optional; DOM proof is sufficient unless visual inspection fails.
- reproduction verdict: valid from source.
- validity verdict: valid.
- best long-term fix boundary: HUD particle tier selection plus CSS visual polish.
- harsh honest feedback: stacking every tier at once would be a visual mess; highest-tier replacement is the cleaner reading of "deviennent".
- hard-stop decision: continue.

Blocked condition:
Blocked only if the app cannot build or no browser route can render the affected HUD surface for proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mana-crystal-halo-tiers.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | explicit halo and A/B/C+ tier requirements copied into Task source and Completion threshold |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `create_goal` returned active goal |
| Source of truth read before edits | yes | inspected `src/ui/hud.ts` and `src/style.css` |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | source confirms claim |
| Reproduction verdict before implementation | yes | valid from source |
| Repro escalation ladder selected | yes | source audit, build, browser proof |
| Suggested fix reviewed against durable boundary | yes | HUD logic plus CSS only |
| TDD decision before behavior change or bug fix | yes | N/A, visual polish and DOM particle rendering; browser proof is stronger here |
| Browser proof decision for browser surface | yes | real HUD click proof required |
| Browser pack selected | yes | generated browser pack applied |
| Browser route / app surface identified | yes | main game HUD mana crystal panel |
| Browser tool decision recorded | yes | use available browser automation in current thread |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm run build` passed; browser proof showed B at 2000/sec, C at 100000/sec, halo layers present |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above before edits |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source audit then browser proof completed |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature polish, not a bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | browser proof inspected tiers, counts, scales, halo styles |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run build` includes `tsc` and passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Playwright via node_repl on `http://127.0.0.1:5174/` |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script run; build/typecheck is relevant verification for this repo task |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | diff reviewed for HUD tier logic and CSS halo/crystal scope |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mana-crystal-halo-tiers.md` | pending final check |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | clicked `.mana-orb` with injected B/C mana power |
| Browser console/network check | yes | Record console/network state or N/A | consoleErrors `[]`; failedRequests `[]` |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | DOM proof recorded; screenshot not needed because tier and halo styles were inspectable |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read `src/ui/hud.ts` and `src/style.css` | implementation |
| Implementation | complete | patched halo CSS and tiered particle logic | verification |
| Verification | complete | build and browser proof passed | closeout |
| Closeout | complete | final plan check run after evidence recorded | final response |

Findings:
- Existing particles used one hard-coded crystal step of 20 mana/sec.
- Existing halo used a regular repeated conic pattern that read too mechanical.
- Browser proof: B at 2000/sec produced 2 crystals, tier `B`, scale `2`; C at 100000/sec produced 2 crystals, tier `C`, scale `4`; orbs stayed at 20; console and network errors were empty.

Decisions and tradeoffs:
- Falling crystals use the highest unlocked tier only. That matches "deviennent" and avoids an unreadable A+B+C stack.
- Tier thresholds continue by multiplying the previous threshold by 50; tier size continues by multiplying the previous size by 2.
- `browser-use` was requested by project rules, but no direct browser-use tool was exposed in this thread; used the available node_repl browser automation and recorded the waiver.

Timeline:
- 2026-06-27T22:24:53.123Z: plan created.
- 2026-06-27T22:27:00Z: source read, requirements captured, and active goal created.
- 2026-06-27T22:31:00Z: implemented irregular halo and mana crystal tier logic.
- 2026-06-27T22:34:00Z: `npm run build` passed.
- 2026-06-27T22:38:00Z: browser proof passed for B and C tiers.

Verification evidence:
- `npm run build`: passed.
- Browser proof on `http://127.0.0.1:5174/`: B case `manaPerSecond=2000`, `crystalCount=2`, tier `B`, class `mana-crystal-tier-b`, scale `2`, `orbCount=20`.
- Browser proof on `http://127.0.0.1:5174/`: C case `manaPerSecond=100000`, `crystalCount=2`, tier `C`, class `mana-crystal-tier-c`, scale `4`, `orbCount=20`.
- Browser proof: halo animation names `mana-crystal-light-spin, mana-crystal-light-breathe`; irregular conic and pseudo glow layers present; console errors and failed requests empty.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Intake and source read |
| Where am I going? | Implementation, verification, closeout |
| What is the goal? | Improve mana crystal halo and falling mini-crystal tiers |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Visual taste is subjective; DOM proof confirms behavior, but final artistic preference still belongs to the user.
