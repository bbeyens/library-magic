# mine td skill dock layout

Objective:
Mine des Profondeurs uses TD-style arena plus bottom skill dock; done when static guards, tests/build, and browser proof pass.

Goal plan:
docs/plans/2026-07-08-mine-td-skill-dock-layout.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user prompt
- id / link: N/A
- title: Port TD skill box layout to Mine des Profondeurs
- acceptance criteria: the dirt-block mining mini-game uses the same broad layout as TD: playable area above, skill dock directly below, TD-style skill cards/tabs, two-column grid, max 8 visible cards with internal scroll, and stable dynamic updates.

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
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: final handoff includes score confiance.

Completion threshold:
- Mine des Profondeurs renders as a TD-like panel: mining board/playfield above and a `.mining-skill-dock` directly below using shared `skillShopPanel` cards/tabs.
- Mining skills are available in TD-style cards and remain buyable with current `buyMiningSkill` action.
- Static guards prove the mining dock uses two columns, max 8 visible cards/internal scroll, tab cascade selector, and non-volatile rebuild signature.
- `npm test`, `npm run typecheck`, `npm run build`, and real browser proof pass or exact blockers are recorded.

Verification surface:
- Static guard: `npx tsx tests/hudStatic.test.ts`.
- Full tests: `npm test`.
- Type/build: `npm run typecheck`, `npm run build`.
- Browser proof: real Library Magic app with Mine des Profondeurs open.
- Source audit: `src/ui/hud.ts`, `src/style.css`, `tests/hudStatic.test.ts`.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `.agents/skills/td-skill-boxes/SKILL.md`, current TD/Gem/Snake skill dock implementations in `src/ui/hud.ts` and `src/style.css`.
- Allowed edit scope: mining UI/dock logic, shared skill-dock selectors where needed, static HUD guardrails, this plan.
- Browser surface: Library Magic Mine des Profondeurs panel.
- Tracker sync: N/A.
- Non-goals: no new mining economy, no new mining skill ids, no TD combat logic copy, no sprite generation.

Current verdict:
- verdict: implemented and verified
- confidence: 92/100
- next owner: user
- reason: Mine now uses the TD-style playfield plus dock structure, static/full checks pass, and Chrome proof shows the layout live.

Pre-solution issue challenge:
- reporter claim: user wants the dirt-block game layout like TD.
- suggested diagnosis or fix: embed a TD-style mining skill dock directly under the mining board and stop relying on the old separate upgrade panel for the primary layout.
- repro ladder:
  - tests / source-level repro: source read shows `miningPanel` lacks a `.mining-skill-dock` and mining upgrades live in `miningUpgradePanel`.
  - repo-owned automated browser or integration proof: static HUD guard will pin the TD dock invariants.
  - Browser plugin: required final surface proof; use browser-use first if exposed, otherwise record/use available real browser proof as caveat.
  - screenshot / visual proof: final browser proof required.
- reproduction verdict: N/A, feature request.
- validity verdict: valid.
- best long-term fix boundary: reuse generic skill shop model and TD dock CSS rather than building a new mining-only card system.
- harsh honest feedback: keeping a separate floating upgrade panel here would miss the ask; the dock belongs under the playfield.
- hard-stop decision: proceed.

Blocked condition:
- Stop if browser proof tooling is unavailable and no real local browser proof can be obtained, or if unrelated pre-existing dirty changes break global checks beyond scoped diagnosis.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-mine-td-skill-dock-layout.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User requested `$td-skill-boxes` and wanted the dirt-block game layout like TD. |
| Timed checkpoint parsed | N/A: no duration requested | no timed checkpoint. |
| Active goal checked or created | yes | `get_goal` returned none; `create_goal` started this objective. |
| Source of truth read before edits | yes | Read `td-skill-boxes` skill and source regions for TD/Gem/Snake docks, mining panel/upgrades, CSS dock styles, and HUD static tests. |
| Acceptance criteria captured | yes | See task source and completion threshold. |
| Pre-solution issue challenge required | N/A: feature request | Recorded valid feature request. |
| Reproduction verdict before implementation | N/A: feature request | Source confirms missing mining TD dock. |
| Repro escalation ladder selected | yes | Static guard, tests/type/build, browser proof. |
| Suggested fix reviewed against durable boundary | yes | Reuse generic skill shop and scoped `.mining-skill-dock` CSS. |
| TDD decision before behavior change or bug fix | yes | Add static guard in `tests/hudStatic.test.ts` first, then implement. |
| Browser proof decision for browser surface | yes | Required after layout change. |
| Browser pack selected | yes | Browser pack applied. |
| Browser route / app surface identified | yes | Local Library Magic app, Mine des Profondeurs panel. |
| Browser tool decision recorded | yes | Try browser-use discovery first; if unavailable, use real Chrome Computer Use with caveat. |

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
| Named verification threshold | yes | Run the named proof or record blocker | static guard, full tests, typecheck, build, and Chrome proof passed |
| Pre-solution issue challenge verdict | N/A: feature request | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | feature request, valid, proceed |
| Repro escalation ladder | N/A: feature request | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | static/browser proof still required |
| Bug reproduced before fix | N/A: feature request | Record failing test/repro or N/A with reason | no bug claim |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npx tsx tests/hudStatic.test.ts` red on missing `miningSkillDockSignature`, then green after implementation; rerun green after cleanup |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | Chrome at `http://127.0.0.1:5175/`: Mine panel shows iso playfield above `Mine Skills` dock with three cards and `Mine` tab below |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint/format script required by this repo gate; typecheck/build/test passed |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | filtered diff review of Mine HUD/CSS/test blocks completed; no blocking issue found |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no timed checkpoint |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-mine-td-skill-dock-layout.md` | passed |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Chrome opened the Mine panel on the real app and showed the TD-style layout |
| Browser console/network check | N/A | Record console/network state or N/A | browser-use/devtools console tooling was not exposed; visual/accessibility proof used instead |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Computer Use screenshot/accessibility tree showed Mine playfield, `Mine Skills`, `Pickaxe +`, `Splash`, `Auto Dig`, and `Mine` tab |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | done | created plan and read HUD/CSS/test surfaces | implementation |
| Implementation | done | mining panel now renders `.mining-playfield` plus `.mining-skill-dock`; mining uses shared `skillShopPanel` | verification |
| Verification | done | static, tests, typecheck, build, browser proof | closeout |
| Closeout | done | final administrative fields closed; autogoal rerun pending | final response |

Findings:
- Mining has `miningUpgradePanel` and three existing skills (`pickaxeForce`, `splashDamage`, `automation`) but no dock under the playfield.
- TD/Gem/Snake already share `skillShopPanel` and dock CSS selectors; mining should join that pattern.

Decisions and tradeoffs:
- Use one mining tab (`Mine`) because there are only three skills; keep tab chrome so the layout matches TD without fake categories.
- Use the shared `skillShopPanel` for the old detail upgrade panel too, instead of maintaining two unrelated mining skill layouts.

Timeline:
- 2026-07-08T14:29:16.581Z: plan created.
- 2026-07-08T14:43Z: static guard added first; it failed on missing `miningSkillDockSignature`.
- 2026-07-08T14:48Z: implemented Mine playfield + TD-style skill dock and static guard passed.
- 2026-07-08T14:54Z: `npm test`, `npm run typecheck`, and `npm run build` passed.
- 2026-07-08T14:57Z: Chrome proof showed Mine playfield above TD-style `Mine Skills` dock.
- 2026-07-08T14:59Z: autogoal check passed.

Verification evidence:
- `npx tsx tests/hudStatic.test.ts` failed before implementation on `miningSkillDockSignature should exist`.
- `npx tsx tests/hudStatic.test.ts` passed after implementation (`hudStatic ok`).
- `npm test` passed.
- `npm run typecheck` passed.
- `npm run build` passed; Vite emitted the existing large chunk warning only.
- Browser proof: `http://127.0.0.1:5175/` in Chrome displayed Mine des Profondeurs with the isometric playfield above the `Mine Skills` dock containing `Pickaxe +`, `Splash`, `Auto Dig`, plus the `Mine` tab.
- Browser caveat: `browser-use` was not exposed by tool discovery; Chrome Computer Use was used. Console/network inspection is N/A because browser-use/devtools console tools were not available in this session.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-mine-td-skill-dock-layout.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Autogoal check and final response |
| What is the goal? | Mine uses TD-style arena plus bottom skill dock |
| What have I learned? | See Findings |
| What have I done? | Added mining dock state/signatures, shared skill cards, `.mining-playfield`, `.mining-skill-dock`, static guard, and verification evidence |

Open risks:
- `src/ui/hud.ts` and `src/style.css` already contain unrelated dirty changes; ignore unrelated diffs and keep edits scoped.
- Console/network inspection was waived because the available browser tooling did not expose those channels; visual and accessibility proof were obtained in real Chrome.
