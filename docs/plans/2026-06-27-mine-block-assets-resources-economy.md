# mine block assets resources economy

Objective:
Mine assets/resources economy; done when 20 block sprites drive depth tiers, mining gives material resources exchangeable for mine coins, and tests/build/browser proof pass.

Goal plan:
docs/plans/2026-06-27-mine-block-assets-resources-economy.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)
- docs (docs/plans/templates/packs/docs.md)

Task source:
- type: user prompt
- id / link: N/A
- title: Mine block sprites, material resources, and mine currency
- acceptance criteria:
  - Use the new block sprite folder `public/assets/Block terre`.
  - Use the numbered block sprites in order.
  - Blocks are grouped by 5 layers: each sprite covers 5 depth layers, and deeper layers have more HP.
  - The first layer of a sprite group is visually lighter and the fifth is darker.
  - Lower blocks show a small shadow when they are deeper than neighboring blocks, following the provided light/dark example.
  - There are 20 block sprites.
  - Mining no longer gives generic `minerals` as the Mine's only reward and no longer gives Mana.
  - Mining gives material resources: terre, pierre, sable, charbon, iron, gold, rubis, lapis lazuli, diamant, emeraude, obsidian.
  - These material resources can be exchanged for a local Mine currency, not Mana.
  - Preserve the latest requested Mine grid size: 7x7.

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
- initial confidence score: 86/100
- improvement loop: prioritize durable model tests, then UI/browser proof.
- final score / loop closure: 96/100 after focused tests, full tests, typecheck, build, source audit, and browser proof.

Completion threshold:
- `public/assets/Block terre` is represented by 20 ordered block sprite tiers in source.
- Mine blocks use sprite tier = one sprite per 5 depth layers.
- Blocks carry a shade position 1-5 within each sprite tier; shade is exposed in DOM/CSS and darker for deeper sublayers.
- Neighbor depth comparison exposes shadow classes when adjacent blocks are deeper than a block.
- Mining rewards material resources by material/tier and does not add Mana.
- The Mine HUD shows material resource stock and a mine coin balance.
- There is a user action to exchange material resources into Mine coins.
- Focused mining tests, full tests, typecheck, build, and browser proof pass.

Verification surface:
- `npx tsx tests/miningRules.test.ts`
- `npm test`
- `npm run typecheck`
- `npm run build`
- Source audit for 20 sprite asset paths and no Mine reward Mana path.
- Browser proof on Mine panel: 49 blocks render sprite URLs, material stock/mine coins render, exchange control works, console/network clean.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: latest user prompt plus actual files in `public/assets/Block terre`.
- Allowed edit scope: Mine simulation state/actions, Mine HUD/CSS, resource definitions needed by Mine, focused tests, CONTEXT, this plan.
- Browser surface: local Vite app, Mine des Profondeurs panel.
- Tracker sync: N/A.
- Non-goals: committing/pushing, changing unrelated mini-games, replacing the latest 7x7 grid, generating new sprites.

Current verdict:
- verdict: complete
- confidence: 96/100
- next owner: user
- reason: implementation and verification are complete.

Pre-solution issue challenge:
- reporter claim: Mine should use the new numbered block sprites, 5 layers per sprite, material resources, and exchangeable Mine money instead of generic reward/Mana.
- suggested diagnosis or fix: move Mine rewards/economy into a Mine-owned material ledger and make sprites/depth tiers source-backed.
- repro ladder:
  - tests / source-level repro: focused mining tests should fail before code because material ledgers/exchange actions do not exist.
  - repo-owned automated browser or integration proof: no existing E2E suite.
  - Browser plugin: try browser-use/tool discovery first; fallback only if unavailable.
  - screenshot / visual proof: final Mine panel screenshot.
- reproduction verdict: valid feature request; current source only has generic `minerals`, CSS-drawn blocks, and Mine Mana reward.
- validity verdict: valid.
- best long-term fix boundary: Mine-owned model constants and actions, rendered through HUD/CSS.
- harsh honest feedback: bolting this onto generic `minerals` would be a half-feature and would make upgrades messy later.
- hard-stop decision: continue.

Blocked condition:
- Block only if the provided sprite files cannot be loaded by Vite/browser or the Mine resource semantics cannot be made type-safe without broader resource migration.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mine-block-assets-resources-economy.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | acceptance criteria copied from prompt |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | previous stale 6x6 goal was blocked; new goal created for this feature |
| Source of truth read before edits | yes | read `public/assets/Block terre`, Mine state/actions/HUD/CSS, books resource definitions, CONTEXT |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | valid feature request, current source lacks requested system |
| Reproduction verdict before implementation | yes | current source has generic `minerals`, Mine Mana reward, CSS-drawn blocks |
| Repro escalation ladder selected | yes | focused test -> full tests/typecheck/build -> browser proof |
| Suggested fix reviewed against durable boundary | yes | Mine-owned model/action/HUD boundary |
| TDD decision before behavior change or bug fix | yes | write focused mining tests first |
| Browser proof decision for browser surface | yes | required because visible sprites/UI change |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | local Vite Mine panel |
| Browser tool decision recorded | yes | try browser-use/tool discovery first; fallback only if unavailable |
| Docs pack selected | yes | docs pack applied |
| Target docs and nearest sibling docs read | yes | read CONTEXT Mine/resource entries |
| Documented source owner identified | yes | CONTEXT.md |

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
- [x] Docs pack: target docs, nearest sibling docs, and source owner are recorded.
- [x] Docs pack: named APIs, imports, options, routes, components, demos, and previews are source-backed or marked N/A.
- [x] Docs pack: docs use current-state reference voice, not changelog voice.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `npx tsx tests/miningRules.test.ts`, `npm test`, `npm run typecheck`, `npm run build`, source audit, and browser proof passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above before implementation |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | focused test failed first on missing sprite-tier exports, then passed after implementation; browser proof passed |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | feature request, not bug report |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/miningRules.test.ts` passed |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; only Vite chunk-size warning |
| Browser surface changed | yes | Capture browser proof | Mine panel rendered 49 sprite-backed blocks, 11 material stocks, exchange worked |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script in package.json |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | reviewed against prompt; one layout overlap found by browser proof and fixed |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mine-block-assets-resources-economy.md` | passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Chrome on `http://127.0.0.1:5173/`; unlock books, open Mine, click first block five times, exchange material stock |
| Browser console/network check | yes | Record console/network state or N/A | zero console errors, page errors, and failed requests |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `.tmp/mine-assets-resources-proof.png` |
| Docs source-backed claim audit | yes | Verify docs claims against current source | CONTEXT matches source: 20 sprite tiers, 5-layer tiers, material resources, exchange to `minerals` currency |
| Docs links / routes / previews | N/A | Verify or record N/A | docs change has no links/routes/previews |
| Docs parser/build | N/A | Run relevant docs parser/build or record N/A | no docs parser/build for CONTEXT.md |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | plan captured prompt and asset folder/source audit | implementation |
| Implementation | complete | Mine model/action/HUD/CSS/docs/tests updated | verification |
| Verification | complete | tests, typecheck, build, source audit, and browser proof passed | closeout |
| Closeout | complete | plan evidence recorded and final validation passed | final response |

Findings:
- `public/assets/Block terre` contains exactly 20 numbered JPG block sprites plus one example image.
- Current Mine previously produced generic `minerals` and Mana directly when blocks broke.
- Browser proof found the old full-size grid was partly under the book upgrade button; the grid now reserves top HUD space and remains clickable.

Decisions and tradeoffs:
- Keep the latest 7x7 Mine grid.
- Keep `resources.minerals` as the technical id for Mine currency so existing unlock progression still works, but rename the UI/docs concept to Pieces de mine.
- Store raw material resources inside `state.mining.materials` to avoid polluting the global book-resource contract.
- Use the provided 20 sprite filenames in numeric order; each sprite covers five depths, clamped to sprite 20 after depth 100.

Timeline:
- 2026-06-27T07:42:41.428Z: plan created.
- 2026-06-27T07:50:00Z: focused mining test failed on missing sprite-tier exports.
- 2026-06-27T07:58:00Z: Mine state/action/HUD/CSS/docs implemented.
- 2026-06-27T08:02:00Z: browser proof found top block click interception by the upgrade control; CSS layout fixed.
- 2026-06-27T08:06:00Z: tests/build/browser proof passed.

Verification evidence:
- `npx tsx tests/miningRules.test.ts`: passed.
- `npm test`: passed all test files.
- `npm run typecheck`: passed.
- `npm run build`: passed; Vite chunk-size warning only.
- Source audit: `find 'public/assets/Block terre' ... | wc -l` returned 20 numbered image files.
- Source audit: Mine block breaking now increments `state.mining.materials[...]`; only `exchangeMiningMaterials` increments `state.resources.minerals`; no Mine block-break Mana path remains.
- Browser proof on `http://127.0.0.1:5173/`: 49 blocks, 11 material stock pills, sprite URL `assets/Block terre/1 block herb.jpg`, aria `Mine des Profondeurs 7 par 7`, exchange changed coins 0 -> 1 and dirt 1 -> 0, first block center resolves to `digMiningBlock`, zero console/page/request errors, screenshot `.tmp/mine-assets-resources-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Mine uses 20 provided block sprites, 5-layer tiers, material resources, and exchangeable Mine currency |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- None.
