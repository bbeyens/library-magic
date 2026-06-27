# fix td no skill fast deaths

Objective:
Fix TD monsters dying too fast with no active skills.

Goal plan:
docs/plans/2026-06-27-fix-td-no-skill-fast-deaths.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user bug report
- id / link: local chat + attached screen recording
- title: TD no-skill enemies die too fast
- acceptance criteria: With TD skills at 0, baseline tower damage/speed stay baseline even if the defense book level is higher; wave-1 enemies do not die from one no-skill hit; focused test and browser proof pass.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 82/100
- improvement loop: one red/green behavior test plus browser proof
- final score / loop closure: pending

Completion threshold:
- A deterministic TD rules test fails before the fix because no-skill baseline damage/speed are inflated by book level.
- The fix makes TD no-skill damage and attack speed independent of book level.
- Focused TD test, typecheck, build, diff check, and browser proof pass.

Verification surface:
- `./node_modules/.bin/tsx tests/defenseRules.test.ts`
- `npm run typecheck`
- `npm run build`
- `git diff --check`
- Browser proof on `http://127.0.0.1:5173/`

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/game/simulation/actions.ts`, `src/game/simulation/state.ts`, `tests/defenseRules.test.ts`, attached screen recording.
- Allowed edit scope: TD simulation combat formulas and focused TD tests.
- Browser surface: TD panel in local Vite app.
- Tracker sync: N/A.
- Non-goals: redesign TD wave UI, rebalance all skills, remove existing TD skills.

Current verdict:
- verdict: valid
- confidence: 82/100
- next owner: task
- reason: Source shows book level inflates `defenseTowerDamage` and `defenseTowerAttackInterval` even when all TD skills are 0.

Pre-solution issue challenge:
- reporter claim: Monsters die too fast while no TD skill is active.
- suggested diagnosis or fix: Not supplied by user; source diagnosis points to hidden book-level combat scaling.
- repro ladder:
  - tests / source-level repro: focused `defenseRules` regression test failed before fix with `5 !== 1`
  - repo-owned automated browser or integration proof: N/A; focused simulation test is the owned regression coverage
  - Browser plugin: local browser proof after fix showed `▲ 1`, `⌁ 0.78s`, `◎ 30%`, five `1` damage popups, and no page errors
  - screenshot / visual proof: attached recording sampled into `/tmp/td-fast-deaths-frames/`
- reproduction verdict: valid from source audit and red test
- validity verdict: valid
- best long-term fix boundary: TD combat stat formulas
- harsh honest feedback: Hidden book-level combat scaling is a bad fit now that TD has explicit attack skills; it makes the HUD lie.
- hard-stop decision: proceed

Blocked condition:
- Stop only if the baseline behavior cannot be reproduced in `tickState` or local browser fails to load.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-fix-td-no-skill-fast-deaths.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User wants TD monsters not to die too fast with no active skills. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | Goal created for no-skill fast-death bug. |
| Source of truth read before edits | yes | Read TD combat formulas, tick path, spawn/health, and attached recording metadata/frames. |
| Acceptance criteria captured | yes | Captured above. |
| Pre-solution issue challenge required | yes | Bug claim validated against source. |
| Reproduction verdict before implementation | yes | Source audit valid; red test will lock it. |
| Repro escalation ladder selected | yes | Focused TD rules test first; browser proof after. |
| Suggested fix reviewed against durable boundary | yes | Durable boundary is combat formulas, not UI. |
| TDD decision before behavior change or bug fix | yes | Add red test before formula fix. |
| Browser proof decision for browser surface | yes | Required after fix because user reports visual gameplay. |
| Browser pack selected | yes | Browser pack applied. |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, TD panel. |
| Browser tool decision recorded | yes | Use available local browser/Playwright fallback because browser-use is not callable here. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Focused test, typecheck, build, diff check, and browser proof passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Claim valid; durable fix is TD combat formulas, not UI. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source-level red test reproduced; browser proof verified after fix. |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | `./node_modules/.bin/tsx tests/defenseRules.test.ts` failed with `5 !== 1` before formula fix. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `./node_modules/.bin/tsx tests/defenseRules.test.ts` passed. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed, with existing Vite chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | Browser reset-skills TD proof passed: `▲ 1`, `⌁ 0.78s`, `◎ 30%`, five `1` popups, no errors. |
| Final lint/format | yes | Run relevant lint/format command or record N/A | `git diff --check` passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed: book level no longer inflates no-skill TD damage/speed. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-fix-td-no-skill-fast-deaths.md` | Ready to rerun after this evidence update. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened TD panel after unlock/reset skills, started play, sampled shots and damage popups. |
| Browser console/network check | yes | Record console/network state or N/A | No page errors recorded. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-td-no-skill-proof.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read combat formulas, tick path, recording frames | implementation |
| Implementation | complete | Removed book-level scaling from no-skill damage/speed formulas | verification |
| Verification | complete | Focused test, typecheck, build, diff check, browser proof passed | closeout |
| Closeout | complete | Plan updated with evidence | final response |

Findings:
- The user report is valid.
- `defenseTowerDamage` and `defenseTowerAttackInterval` used `state.books.defense.level`, so a leveled book secretly made no-skill TD damage/speed stronger.
- The red test proved the bug: with all TD skills at 0 and defense book level 8, baseline damage was `5` instead of `1`.

Decisions and tradeoffs:
- Removed book-level combat scaling from damage and attack speed. Explicit TD skills now own those stats.
- Left book-level reward/wave progression alone because the complaint was about no-skill combat strength.

Timeline:
- 2026-06-27T10:31:26.095Z: plan created.
- 2026-06-27: video sampled; source audit found hidden book-level combat scaling.
- 2026-06-27: red test failed with `5 !== 1`; formula fixed; verification passed.

Verification evidence:
- Red before fix: `./node_modules/.bin/tsx tests/defenseRules.test.ts` failed with `5 !== 1`.
- Green after fix: `./node_modules/.bin/tsx tests/defenseRules.test.ts` -> `defenseRules ok`.
- `npm run typecheck` -> passed.
- `npm run build` -> passed, with existing Vite chunk-size warning.
- `git diff --check` -> passed.
- Browser proof on `http://127.0.0.1:5173/` after `k` unlock and `u` reset skills: text `▲ 1 ⌁ 0.78s ◎ 30%`, shot intervals around 0.78s, five damage popups all `1`, no page errors, screenshot `/tmp/library-magic-td-no-skill-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Fix TD monsters dying too fast with no active skills |
| What have I learned? | Book level was secretly boosting no-skill TD combat stats |
| What have I done? | Removed hidden scaling, added regression test, verified in browser |

Open risks:
- Broader TD balance may still need tuning once skills are bought; this fix only covers the no-skill baseline bug.
