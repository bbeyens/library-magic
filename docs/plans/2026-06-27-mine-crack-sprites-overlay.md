# mine crack sprites overlay

Objective:
Mine crack sprites overlay; done when 4x4 fissur.png maps damage bands and variants onto blocks, tests/build/browser proof pass.

Goal plan:
docs/plans/2026-06-27-mine-crack-sprites-overlay.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user prompt
- id / link: N/A
- title: Mine fissure sprites overlay
- acceptance criteria:
  - Use `public/assets/Block terre/fissur.png`.
  - The PNG has 4 rows for 4 visual variants.
  - It has 4 damage states/columns.
  - Column 1 applies for 5-25% damage.
  - Column 2 applies for 26-50% damage.
  - Column 3 applies for 51-75% damage.
  - Column 4 applies for 76-100% damage.
  - Do not apply fissures before 5% damage.
  - Variants should avoid every block looking identical.

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
- initial confidence score: 92/100
- improvement loop: TDD helper, then browser proof.
- final score / loop closure: 98/100 after tests, build, and browser proof.

Completion threshold:
- `fissur.png` is treated as a 4x4 spritesheet.
- Damage below 5% has no crack overlay.
- Damage bands map to columns 1-4: 5-25, 26-50, 51-75, 76-100.
- Four variants map to rows 1-4 using stable block identity.
- Mine block CSS renders cracks through an overlay without replacing the base block sprite.
- Focused mining test, full test suite, typecheck, build, and browser proof pass.

Verification surface:
- `npx tsx tests/miningRules.test.ts`
- `npm test`
- `npm run typecheck`
- `npm run build`
- Browser proof on Mine panel after damaging a block.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: latest user prompt plus actual `public/assets/Block terre/fissur.png` dimensions.
- Allowed edit scope: Mine state helper, Mine HUD/CSS, focused mining test, this plan.
- Browser surface: local Vite Mine panel.
- Tracker sync: N/A.
- Non-goals: new crack art generation, changing block sprites, changing Mine rewards/economy.

Current verdict:
- verdict: complete
- confidence: 98/100
- next owner: user
- reason: implementation and verification are complete.

Pre-solution issue challenge:
- reporter claim: newly added `fissur.png` should drive Mine block crack overlays.
- suggested diagnosis or fix: add a tested Mine helper for damage band/variant mapping and render it via CSS spritesheet positioning.
- repro ladder:
  - tests / source-level repro: focused mining test failed before helper existed.
  - repo-owned automated browser or integration proof: no existing E2E suite.
  - Browser plugin: browser-use not exposed; used Chrome via Node REPL fallback.
  - screenshot / visual proof: `.tmp/mine-crack-overlay-proof.png`.
- reproduction verdict: valid feature request.
- validity verdict: valid.
- best long-term fix boundary: Mine-owned helper plus HUD/CSS overlay.
- harsh honest feedback: hardcoding visual states directly in CSS would become a mess once crack thresholds change.
- hard-stop decision: continue.

Blocked condition:
- Block only if `fissur.png` cannot be loaded or its 4x4 layout is not usable as equal cells.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mine-crack-sprites-overlay.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | acceptance criteria copied from prompt |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | no active goal; created fissure overlay goal |
| Source of truth read before edits | yes | found `public/assets/Block terre/fissur.png`; file is 128x128 PNG |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | valid feature request |
| Reproduction verdict before implementation | yes | focused test failed on missing `miningBlockCrackOverlayForDamage` export |
| Repro escalation ladder selected | yes | focused test -> full tests/typecheck/build -> browser proof |
| Suggested fix reviewed against durable boundary | yes | Mine helper + HUD/CSS overlay |
| TDD decision before behavior change or bug fix | yes | added focused mapping test first |
| Browser proof decision for browser surface | yes | required for visual overlay |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | local Vite Mine panel |
| Browser tool decision recorded | yes | browser-use not exposed; Chrome via Node REPL fallback |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npx tsx tests/miningRules.test.ts`, `npm test`, `npm run typecheck`, `npm run build`, and browser proof passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | focused test failed before helper existed, then passed; browser proof passed |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature request, not bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/miningRules.test.ts` passed |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; Vite chunk-size warning only |
| Browser surface changed | yes | Capture browser proof | Mine panel first block after one hit used `fissur.png` overlay at column 2 row 1 |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script in package.json |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | reviewed against 4x4 spritesheet prompt |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mine-crack-sprites-overlay.md` | passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Chrome on `http://127.0.0.1:5173/`; unlock books, open Mine, click first block once |
| Browser console/network check | yes | Record console/network state or N/A | zero console errors, page errors, and failed requests |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `.tmp/mine-crack-overlay-proof.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | found `fissur.png`, 128x128 4x4 spritesheet | implementation |
| Implementation | complete | helper, HUD, CSS, focused test updated | verification |
| Verification | complete | tests, typecheck, build, browser proof passed | closeout |
| Closeout | complete | evidence recorded and final validation passed | final response |

Findings:
- `fissur.png` is 128x128 PNG, matching 4 rows x 4 columns of 32px cells.
- Browser proof after one hit on a 3 PV block shows 2 PV and column 2 overlay, matching 33% damage.

Decisions and tradeoffs:
- Interpreted the requested percentages as damage percent, not remaining health percent, because fissures should increase as the block is damaged.
- No crack overlay is rendered under 5% damage.
- Variant row is stable by `block.id % 4`, so adjacent blocks do not all share the same row.

Timeline:
- 2026-06-27T08:41:33.143Z: plan created.
- 2026-06-27T08:43:00Z: focused test failed before helper existed.
- 2026-06-27T08:48:00Z: mapping helper and CSS overlay implemented.
- 2026-06-27T08:52:00Z: tests, typecheck, build, and browser proof passed.

Verification evidence:
- `npx tsx tests/miningRules.test.ts`: passed.
- `npm test`: passed all test files.
- `npm run typecheck`: passed.
- `npm run build`: passed; Vite chunk-size warning only.
- Browser proof: 49 blocks; first block after one hit showed text `2`, `::after` opacity `1`, background image `fissur.png`, size `400% 400%`, position `33.3333% 0%`, inline crack x `1`, y `0`, zero console/page/request errors.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Mine crack overlay uses 4x4 `fissur.png` by damage band and variant |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- None.
