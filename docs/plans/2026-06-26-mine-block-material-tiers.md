# mine block material tiers

Objective:
Mine des Profondeurs: afficher des blocs pixel-art par type de matiere, avec un changement de type toutes les 10 couches.

Goal plan:
docs/plans/2026-06-26-mine-block-material-tiers.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user prompt
- id / link: N/A
- title: Cases de mine par materiau
- acceptance criteria: grille de blocs type Minecraft, ordre sable/terre/pierre/charbon/fer/etc., changement de type toutes les 10 couches.

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
- initial confidence score: 84/100
- improvement loop: N/A
- final score / loop closure: 96/100 after tests, build, and browser proof

Completion threshold:
- MiningBlock has a deterministic material tier derived from depth.
- Depths 1-10, 11-20, 21-30, 31-40, 41-50 map to sand, dirt, stone, coal, iron.
- The mine HUD exposes material-specific DOM data/classes/labels and renders pixel-art block textures.
- Typecheck, tests, build, and browser proof pass.

Verification surface:
- `npm test`
- `npm run typecheck`
- `npm run build`
- Browser proof on the Mine des Profondeurs panel: 15 blocks visible; material changes after digging past layers 10 and 20.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: user prompt plus existing Mine des Profondeurs implementation.
- Allowed edit scope: mining state/actions, HUD rendering, CSS, focused tests, glossary docs if needed.
- Browser surface: Mine des Profondeurs book panel.
- Tracker sync: N/A.
- Non-goals: new mining economy, new automation rules, external assets, commits/pushes.

Current verdict:
- verdict: complete
- confidence: 96/100
- next owner: user
- reason: implementation and proof are complete.

Pre-solution issue challenge:
- reporter claim: current mine cases should look like block textures and vary by Minecraft-ish rarity every 10 layers.
- suggested diagnosis or fix: current blocks are generic dirt-colored buttons with no material tier.
- repro ladder:
  - tests / source-level repro: focused test for material tier boundaries.
  - repo-owned automated browser or integration proof: N/A, no existing E2E suite.
  - Browser plugin: use repo-approved browser tool if callable; otherwise record blocker and use closest available browser proof.
  - screenshot / visual proof: capture or record DOM/CSS evidence from browser proof.
- reproduction verdict: valid by source audit.
- validity verdict: valid.
- best long-term fix boundary: put the material rule in simulation state, then let HUD/CSS render it.
- harsh honest feedback: CSS-only depth coloring would be a half-fix; the block needs a real material identity.
- hard-stop decision: continue.

Blocked condition:
- Block only if the app cannot build or no browser proof path is available after source-level verification.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-mine-block-material-tiers.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | user requested Minecraft-like block cases, material order, and 10-layer changes |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `create_goal` active |
| Source of truth read before edits | yes | prompt, state/actions/HUD/CSS read |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | valid feature request |
| Reproduction verdict before implementation | yes | valid by source audit |
| Repro escalation ladder selected | yes | test + browser proof |
| Suggested fix reviewed against durable boundary | yes | material in simulation state |
| TDD decision before behavior change or bug fix | yes | add focused test first |
| Browser proof decision for browser surface | yes | proof Mine panel |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | local Vite app Mine book |
| Browser tool decision recorded | yes | try browser-use first, fallback only if unavailable |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm test`, `npm run typecheck`, `npm run build`, browser proof passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | valid feature request; fixed in mining state plus HUD/CSS |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | test added first; browser-use unavailable; Node REPL with local Chrome used |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature request, not a bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `tests/miningRules.test.ts` covers 10-layer tiers and block mutation |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | local app at `http://127.0.0.1:5174/` showed 15 blocks and material transitions |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script in package.json |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | diff reviewed; material identity is in simulation, visual classes in HUD/CSS |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-mine-block-material-tiers.md` | first run exposed missing plan evidence; final run to follow |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | opened Mine via app store, clicked block to depth 11 and 21 |
| Browser console/network check | yes | Record console/network state or N/A | zero console errors, page errors, and failed requests |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `.tmp/mine-material-proof.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | prompt and nearby mine files read | implementation |
| Implementation | complete | state/actions/HUD/CSS/docs/test updated | verification |
| Verification | complete | tests, typecheck, build, browser proof passed | closeout |
| Closeout | complete | diff reviewed and plan evidence recorded | final response |

Findings:
- Existing Mine blocks only had depth/PV and generic dirt-style rendering.
- A material tier belongs in simulation state, because the material is gameplay-facing and drives the HUD.
- Browser-use was not callable in this session; Node REPL with local Chrome provided the browser proof.

Decisions and tradeoffs:
- Use 10-layer material buckets: Sable, Terre, Pierre, Charbon, Fer, then Cuivre, Or, Redstone, Lapis, Diamant, Emeraude, Obsidienne.
- Keep the visual implementation CSS-only for now; no external texture asset pipeline needed.
- Preserve mining rewards, automation, splash, and HP scaling.

Timeline:
- 2026-06-26T22:41:54.067Z: plan created.
- 2026-06-26T22:44:00Z: prompt requirements captured; source audit found generic dirt-only rendering.
- 2026-06-26T22:47:00Z: added failing mining material test, then implemented material tiers in state/actions.
- 2026-06-26T22:50:00Z: added HUD material labels/classes and pixel-art CSS textures.
- 2026-06-26T22:54:00Z: `npm test`, `npm run typecheck`, and `npm run build` passed.
- 2026-06-26T22:57:00Z: browser proof passed on `http://127.0.0.1:5174/`; 15 blocks visible, sand -> dirt at depth 11, dirt -> stone at depth 21.

Verification evidence:
- `npx tsx tests/miningRules.test.ts` first failed because `miningBlockMaterialForDepth` did not exist, then passed after implementation.
- `npm test`: all test files passed, including `miningRules ok`.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser proof with local Chrome: blockCount 15; initial first block `data-material="sand"`; after digging, depth 11 `data-material="dirt"`; depth 21 `data-material="stone"`; no console/page/request errors; screenshot `.tmp/mine-material-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | Mine blocks render as pixel-art material tiers and change every 10 layers |
| What have I learned? | Existing mine state needed a material identity, not only color styling |
| What have I done? | Implemented tiers, HUD rendering, CSS textures, docs, tests, build and browser proof |

Open risks:
- None known. Visual taste can still be tuned if the desired texture should be closer to a specific Minecraft block.
