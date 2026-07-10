# skill box visual refresh

Objective:
Refresh Library Magic skill boxes from Claude's HTML reference; done when scoped CSS/markup guards pass, build passes, and browser proof is captured or blocked.

Goal plan:
docs/plans/2026-07-05-skill-box-visual-refresh.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: /Users/zbeyens/Downloads/skill_box.html
- title: Change skill box visual style with Claude's reference
- acceptance criteria: Crystal/TD skill cards visually follow the red pixel-card reference: icon left, title/value middle, cost or Max right, colored tabs; existing dynamic update/hover rules preserved.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: no timed checkpoint requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Skill card renderer exposes an icon slot compatible with the reference.
- Docked Crystal and TD skill cards use the reference-inspired compact card style without changing skill logic.
- Skill dock still uses two columns and max 8 visible cards with internal scroll.
- Focused HUD static test and production build pass.
- Browser proof is attempted with repo-approved browser tooling; if unavailable, the blocker is recorded.

Verification surface:
- Source audit: src/ui/hud.ts, src/style.css, tests/hudStatic.test.ts.
- Commands: npx tsx tests/hudStatic.test.ts; npm run build.
- Browser: http://127.0.0.1:5173/ Crystal skill dock visual proof if browser-use is available.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: .agents/skills/td-skill-boxes/SKILL.md and /Users/zbeyens/Downloads/skill_box.html.
- Allowed edit scope: src/ui/hud.ts, src/style.css, tests/hudStatic.test.ts, this plan.
- Browser surface: http://127.0.0.1:5173/.
- Tracker sync: N/A, no issue requested.
- Non-goals: no economy changes, no new skill behavior, no commits/pushes.

Current verdict:
- verdict: valid feature request
- confidence: 0.82
- next owner: task
- reason: requested visual restyle has a concrete HTML reference and maps cleanly onto current skill dock classes.

Pre-solution issue challenge:
- reporter claim: current skill box look should be changed to match Claude's reference.
- suggested diagnosis or fix: apply reference-inspired styling to existing `.skill-shop-*` contract instead of replacing runtime logic.
- repro ladder:
  - tests / source-level repro: source read confirms existing skill dock classes are reusable.
  - repo-owned automated browser or integration proof: N/A, visual styling request.
  - Browser plugin: will attempt browser-use/tooling if available.
  - screenshot / visual proof: target after implementation if available.
- reproduction verdict: valid, visual feature request not a bug repro.
- validity verdict: valid.
- best long-term fix boundary: CSS plus minimal renderer icon slot, preserving dynamic patching.
- harsh honest feedback: replacing the whole dock from Claude's standalone HTML would be dumb; adapt the look to the existing game contract.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if the reference file cannot be read, the build cannot run due to external dependency failure, or browser proof tooling is unavailable after implementation.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-05-skill-box-visual-refresh.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User requested changing the skill box look with td-skill-boxes and /Users/zbeyens/Downloads/skill_box.html |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | get_goal returned no active goal; create_goal created active goal |
| Source of truth read before edits | yes | Read td-skill-boxes SKILL.md, skill_box.html, src/ui/hud.ts, src/style.css, tests/hudStatic.test.ts |
| Acceptance criteria captured | yes | See Task source and Completion threshold |
| Pre-solution issue challenge required | no | N/A: feature/style request, not bug claim |
| Reproduction verdict before implementation | no | N/A: feature/style request |
| Repro escalation ladder selected | no | N/A: feature/style request |
| Suggested fix reviewed against durable boundary | yes | Styling adapted to existing `.skill-shop-*` contract |
| TDD decision before behavior change or bug fix | no | N/A: visual styling with static HUD guard; no gameplay behavior change |
| Browser proof decision for browser surface | yes | Attempt browser-use/tooling after build |
| Browser pack selected | yes | Applied browser pack |
| Browser route / app surface identified | yes | http://127.0.0.1:5173/ |
| Browser tool decision recorded | yes | Use browser-use if exposed; otherwise record blocker |

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
| Named verification threshold | yes | Run the named proof or record blocker | npx tsx tests/hudStatic.test.ts passed; npx tsc --noEmit passed; npm run build passed; browser proof blocked because browser-use was not exposed and Computer Use cannot inspect com.openai.codex |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: feature/style request |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: feature/style request |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: no bug repro requested |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | npx tsx tests/hudStatic.test.ts passed |
| TypeScript or typed config changed | yes | Run relevant typecheck | npx tsc --noEmit passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | npm run build passed |
| Browser surface changed | yes | Capture browser proof | Blocked: browser-use not exposed after tool_search; Computer Use rejected com.openai.codex for safety |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script required for this focused CSS/TS change; typecheck/build passed |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Diff reviewed: renderer icon slot plus scoped dock styling, no gameplay logic/economy changes |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-05-skill-box-visual-refresh.md` | First run found only this row and Closeout still pending; rerun after closing plan |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Blocked: browser-use not exposed; Computer Use cannot inspect Codex app |
| Browser console/network check | no | Record console/network state or N/A | N/A: no browser session accessible through approved tooling |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Caveat: visual proof blocked by tooling access; source/test/build proof recorded |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read td-skill-boxes, skill_box.html, HUD renderer, dock CSS, HUD static test | implementation |
| Implementation | complete | Added card icon slot and reference-inspired scoped dock CSS for TD/Crystal | verification |
| Verification | complete | hudStatic, tsc, build passed; browser proof blocker recorded | closeout |
| Closeout | complete | Goal checker first run identified final bookkeeping only; rerun after this update | final response |

Findings:
- Claude reference uses a red pixel card, left icon square, central name/value, right cost/MAX pill, and colored bottom tabs.
- Existing HUD already has a generic SkillShopCard renderer and dynamic patching; changing the renderer/CSS is safer than replacing the dock.

Decisions and tradeoffs:
- Add a real icon span to `skillShopCard` using the tab icon, then style docked cards to match the reference. Risk: generic renderer affects non-docked skill panels too, so heavy styling stays scoped to `.defense-skill-dock` and `.mana-skill-dock`.
- Browser proof could not use browser-use because it was not exposed by tool_search. Computer Use was tried only after browser-use and rejected the Codex app for safety, so this is recorded as a blocker instead of substituting Playwright/Puppeteer.

Timeline:
- 2026-07-05T07:25:36.356Z: plan created.
- 2026-07-05: read td-skill-boxes, autogoal, skill_box.html, current HUD renderer/CSS/tests.
- 2026-07-05: created active goal for skill box visual refresh.
- 2026-07-05: added skill icon slot and per-skill icons in src/ui/hud.ts.
- 2026-07-05: restyled docked TD/Crystal skill cards and tabs in src/style.css using the Claude reference.
- 2026-07-05: updated tests/hudStatic.test.ts guardrails.
- 2026-07-05: npx tsx tests/hudStatic.test.ts passed.
- 2026-07-05: npx tsc --noEmit passed.
- 2026-07-05: npm run build passed.
- 2026-07-05: browser proof blocked; browser-use not exposed and Computer Use cannot inspect Codex app.

Verification evidence:
- command: `npx tsx tests/hudStatic.test.ts` in `/Users/zbeyens/Documents/Library magic` -> passed, `hudStatic ok`.
- command: `npx tsc --noEmit` in `/Users/zbeyens/Documents/Library magic` -> passed.
- command: `npm run build` in `/Users/zbeyens/Documents/Library magic` -> passed, Vite build completed with existing large chunk warning.
- browser: blocked; browser-use unavailable in tool_search results, Computer Use rejected app `com.openai.codex`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Refresh skill boxes from Claude's HTML reference without breaking dynamic dock behavior |
| What have I learned? | Existing `.skill-shop-*` contract can carry the reference look safely |
| What have I done? | Implemented style refresh, passed static HUD test/typecheck/build, recorded browser proof blocker |

Open risks:
- Browser visual proof was blocked by tool access, so live visual judgment should be checked in the open app.
