# add goblin king td monster

Objective:
Add Goblin King TD monster; done when gameplay/tests/assets prove HP x10, speed x0.25, requested sprite rows wired.

Goal plan:
docs/plans/2026-07-01-add-goblin-king-td-monster.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: N/A: chat request
- title: Add Goblin King monster to Bastion Arcanique
- acceptance criteria: Use `/Users/zbeyens/Downloads/Goblin King Sprite Sheet.png`; add a TD monster with 10x slime HP and 0.25x slime speed; wire row 1 idle, row 2 walk, row 8 death, rows 10-11 attack; preserve existing TD behavior.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no timed work requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- New Goblin King TD enemy can spawn in Bastion Arcanique.
- Goblin King max health is exactly `slimeMaxHealth * 10`.
- Goblin King movement speed is exactly `slimeSpeed * 0.25`.
- Runtime CSS uses the provided sheet with row 1 idle, row 2 walk, row 8 death, rows 10-11 attack.
- Asset/contact sheet previews exist for visual inspection.
- Focused TD tests, full tests, typecheck/build pass.

Verification surface:
- `npx tsx tests/defenseRules.test.ts`
- `npm test`
- `npm run build`
- source audit of TD spawn/health/speed constants and CSS rows
- artifact preview contact sheet built from the supplied Goblin King sheet
- browser proof if local browser tooling is available; otherwise record blocker/waiver.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: user-provided sprite sheet plus existing Bastion Arcanique TD simulation/rendering.
- Allowed edit scope: TD simulation/actions, TD CSS/HUD rendering, public TD enemy asset files, focused tests, this plan.
- Browser surface: local app route `http://127.0.0.1:5173/`, Bastion Arcanique book page.
- Tracker sync: N/A: no issue/PR requested.
- Non-goals: no unrelated TD balance redesign, no generated replacement art, no GitHub push/commit.

Current verdict:
- verdict: complete, final goal checker ready
- confidence: 91/100
- next owner: user review
- reason: Gameplay, asset, source audit, tests, and build are complete; browser-use proof was waived because the tool was unavailable.

Pre-solution issue challenge:
- reporter claim: Feature request, not bug report.
- suggested diagnosis or fix: Add new TD enemy kind and wire supplied sprite rows.
- repro ladder:
  - tests / source-level repro: TDD required for health/speed/spawn behavior.
  - repo-owned automated browser or integration proof: N/A before implementation.
  - Browser plugin: use if callable at verification stage.
  - screenshot / visual proof: contact sheet artifact required by animated-spritesheets.
- reproduction verdict: N/A: feature request.
- validity verdict: valid.
- best long-term fix boundary: TD enemy model/rendering, not ad hoc DOM-only hack.
- harsh honest feedback: Hardcoding another one-off enemy is acceptable only if it follows the existing enemy-kind pattern and stays testable.
- hard-stop decision: proceed.

Blocked condition:
- Stop if the supplied sheet cannot be read or if frame row geometry cannot be inferred well enough to crop/wire animation rows.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-01-add-goblin-king-td-monster.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Acceptance criteria copied from user request: sheet path, HP x10, speed x0.25, rows 1/2/8/10-11 |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | `get_goal` returned none; `create_goal` started this objective |
| Source of truth read before edits | yes | `CONTEXT.md`; TD simulation/rendering files; Pillow audit of `/Users/zbeyens/Downloads/Goblin King Sprite Sheet.png` |
| Acceptance criteria captured | yes | Task source acceptance criteria copied above |
| Pre-solution issue challenge required | no | N/A: feature request, not bug report |
| Reproduction verdict before implementation | no | N/A: feature request |
| Repro escalation ladder selected | yes | TDD/source tests for gameplay; contact sheet/browser proof for visual surface |
| Suggested fix reviewed against durable boundary | yes | Use TD enemy kind/rendering boundary |
| TDD decision before behavior change or bug fix | yes | TDD required for health/speed/spawn behavior |
| Browser proof decision for browser surface | yes | Try browser verification after build if callable; otherwise record blocker |
| Browser pack selected | yes | Applied pack `browser` |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, Bastion Arcanique |
| Browser tool decision recorded | yes | Use available browser tooling if exposed; otherwise source/build/artifact proof |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation. Evidence: Task source, Completion threshold, Verification surface, Boundaries.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete. Evidence: sections filled.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. Evidence: N/A, no duration requested.
- [x] Task source and acceptance criteria are captured. Evidence: Task source.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason. Evidence: N/A feature request.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. Evidence: TDD red/green used for gameplay; visual contact sheet created.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: N/A feature request.
- [x] Nearby implementation patterns are read before edits. Evidence: existing `slime`, `bat`, and `skeletonMage` patterns read.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: `DefenseEnemy.kind`, TD spawn/move/death logic, HUD class, CSS spritesheet rows.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: self-review target is TD model/render/assets/tests; unrelated dirty files ignored.
- [x] Verification evidence is recorded beside each relevant gate. Evidence: Verification evidence section.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof. Evidence: local Bastion Arcanique route and expected Goblin King visual recorded.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. Evidence: waiver, `browser-use` not exposed after tool search.
- [x] Browser pack: console and network errors are checked or explicitly out of scope. Evidence: out of scope due browser-use blocker; build/test/source proof used.
- [x] Browser pack: proof uses the real affected browser surface. Evidence: N/A due browser-use blocker; source surface is Bastion Arcanique.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `npx tsx tests/defenseRules.test.ts`; `npx tsx tests/hudStatic.test.ts`; `npm test`; `npm run build`; source audit with `rg`; Pillow asset audit |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: feature request |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: feature request; gameplay still covered by TDD red/green |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature request; red test showed `slime` before implementation where `goblinKing` was expected |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/hudStatic.test.ts && npx tsx tests/defenseRules.test.ts` passed |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run build` passed (`tsc && vite build`) |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Waiver: repo-approved `browser-use` was not exposed after tool search; contact sheet plus build/source tests used |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint/format script in `package.json` |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Self-review: explicit requirements met; unrelated dirty files ignored |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-01-add-goblin-king-td-monster.md` | passed: `[autogoal] complete: docs/plans/2026-07-01-add-goblin-king-td-monster.md` |
| Browser interaction proof | no | Exercise target route/interaction or record blocker | Blocker/waiver: `browser-use` unavailable in this tool session |
| Browser console/network check | no | Record console/network state or N/A | N/A: browser-use unavailable; `npm run build` has no compile-time asset error |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `public/assets/td/enemies/goblin-king/goblin-king-contact.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | plan filled; source files and sheet inspected | implementation |
| Implementation | complete | Goblin King kind, spawn, HP, speed, rendering, assets, tests added | verification |
| Verification | complete | focused tests, full tests, build, source audit passed | closeout |
| Closeout | complete | final checker passed | final response |

Findings:
- Supplied Goblin King sheet is `1024x704 RGBA`, a `16 x 11` grid of `64px` cells.
- Row 1 has 4 idle frames; row 2 has 6 walk frames; row 8 has 11 death frames; rows 10-11 have 13 combined attack frames.
- Existing TD owner boundary supports enemy `kind` branches for health, speed, movement, death duration, HUD class, and CSS animation.

Decisions and tradeoffs:
- Spawn rule chosen: Goblin King appears from wave 5 on every 5th spawned enemy, before bat/skeleton modulo rules. User did not specify spawn cadence; this keeps it rare and readable.
- Runtime asset keeps the full supplied sheet with white background converted to transparency; CSS uses row percentages instead of separate strips.
- Browser proof waived because the repo-approved `browser-use` tool was not exposed after tool search; static artifact plus source/build/tests cover the change.

Timeline:
- 2026-07-01T11:23:19.847Z: plan created.
- 2026-07-01: read `animated-spritesheets`, `autogoal`, and `tdd` skills.
- 2026-07-01: added red defenseRules tests for Goblin King spawn HP and speed.
- 2026-07-01: generated transparent runtime sheet and contact sheet from supplied Goblin King PNG.
- 2026-07-01: implemented Goblin King gameplay and CSS/HUD rendering.
- 2026-07-01: ran focused tests, full tests, build, and source audit.

Verification evidence:
- Red test: `npx tsx tests/defenseRules.test.ts` initially failed because spawned kind was `slime`, expected `goblinKing`.
- Green focused tests: `npx tsx tests/hudStatic.test.ts && npx tsx tests/defenseRules.test.ts` passed.
- Full tests: `npm test` passed.
- Build/typecheck: `npm run build` passed.
- Source audit: `rg -n "goblinKing|GOBLIN_KING|is-goblin-king|goblin-row|defense-goblin-king" src/game/simulation src/ui/hud.ts src/style.css tests public/assets/td/enemies/goblin-king -g '*.ts' -g '*.css' -g '*.png'`.
- Asset audit: Pillow reported `public/assets/td/enemies/goblin-king/goblin-king.png (1024, 704) RGBA` and `public/assets/td/enemies/goblin-king/goblin-king-contact.png (2208, 1098) RGBA`.
- Goal checker: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-01-add-goblin-king-td-monster.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Add Goblin King TD monster with HP x10, speed x0.25, requested sprite rows wired |
| What have I learned? | See Findings |
| What have I done? | Added model/render/assets/tests and verified |

Open risks:
- Browser interaction was not exercised because `browser-use` was unavailable in this tool session.
- Spawn cadence was inferred because the user did not specify wave/cadence.
