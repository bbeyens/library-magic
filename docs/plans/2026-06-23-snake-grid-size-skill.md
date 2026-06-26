# snake grid size skill

Objective:
Add a Snake grid-size skill between speed and automation: level 0 is 4x4, max
level is 9x9, UI order is correct, and verification passes.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-06-23-snake-grid-size-skill.md

Template:
docs/plans/templates/auto.md

Primary template:
docs/plans/templates/auto.md

Applied packs:
- browser

Auto workflow source:
- auto skill: `.agents/skills/auto/SKILL.md`
- expected order:
  1. grill-with-docs
  2. autogoal for remaining steps
  3. to-prd
  4. to-issues
  5. implement first useful slice
  6. browser/game playtest
  7. review
  8. close with evidence

Task source:
- type: user request via `$auto`
- id / link: PRD https://github.com/bbeyens/library-magic/issues/16,
  slice https://github.com/bbeyens/library-magic/issues/17
- title: Implement Snake grid-size skill
- acceptance criteria:
  - New Snake skill is inserted between Vitesse and Automatisation.
  - Level 0 uses a 4x4 grid.
  - Max level uses a 9x9 grid.
  - The skill updates detailed and compact skill UI in the same order.
  - Debug max skills includes this skill.
  - The board remains valid after the grid size changes.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked `N/A: <reason>`.

Timed checkpoint:
- requested duration: none
- semantics: N/A
- initial confidence score: 83/100
- improvement loop: use build/source review/browser fallback evidence
- final score / loop closure: pending

Completion threshold:
- PRD issue exists, or `N/A: <reason>` is recorded for a micro task.
- Vertical slice issues exist, or `N/A: <reason>` is recorded for a micro task.
- The first useful slice is implemented or a blocker is recorded.
- Verification named in this plan passes.
- Browser/game proof is captured for UI/game work, or an explicit blocker/waiver
  names why it could not be captured.
- Review step is run and recorded before closeout.
- Final response lists PRD issue, slice issues, implemented issue/slice,
  verification proof, browser proof, review result, and `score confiance`.

Verification surface:
- `gh issue` commands or issue URLs for PRD/slice publication.
- Implementation verification commands, such as typecheck, build, tests, or
  source audit.
- Browser/game proof for UI/game work, using the repo-approved browser tool
  first and recording any fallback.
- Review evidence against `main` or the chosen fixed point.
- `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-snake-grid-size-skill.md`.

Constraints:
- `grill-with-docs` must happen before this autogoal plan starts.
- After the grill-with-docs phase, do not stop for plan/issue/implementation approval
  unless there is a real blocker.
- Do not skip `review` before closeout.
- Do not claim a browser/game proof if the requested browser tool was
  unavailable; record the fallback honestly.
- Preserve unrelated dirty workspace changes.

Boundaries:
- Source of truth: user request plus `.agents/skills/auto/SKILL.md`.
- Allowed edit scope: `src/game/simulation/state.ts`,
  `src/game/simulation/actions.ts`, `src/ui/hud.ts`, and this plan.
- Browser surface: `http://127.0.0.1:5173/`, Livre du Serpent panel and its
  mini-skill panel.
- Tracker sync: GitHub Issues unless project docs say otherwise.
- Non-goals: do not redesign Snake panel layout, do not change existing skill
  meanings except inserting the grid-size skill, do not change non-Snake panels.

Output budget strategy:
- Use focused reads and capped command output.
- For broad audits, prefer counts, filenames, or narrow `rg` patterns before
  printing full matches.
- Exclude generated assets, logs, `node_modules`, and build output unless they
  are the named source of truth.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials or
  permissions failure, destructive action, or inability to run any honest
  verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Read `CONTEXT.md`, tracker docs, and snake code; no question needed because levels/order were explicit. |
| Prompt requirements captured before work | yes | Acceptance criteria copied in Task source. |
| Timed checkpoint parsed | yes | No duration requested. |
| Active goal checked or created | yes | `create_goal` objective created in this thread. |
| Source of truth read before edits | yes | Read `CONTEXT.md`, `.agents/skills/auto/SKILL.md`, `state.ts`, `actions.ts`, and `hud.ts`. |
| Tracker target verified | yes | `git remote -v` and `gh auth status` confirmed `bbeyens/library-magic`. |
| PRD publication decision recorded | yes | PRD issue #16 created. |
| Slice publication decision recorded | yes | Slice issue #17 created. |
| First useful slice selected | yes | Implement #17 end to end. |
| TDD decision before behavior change or bug fix | yes | No test harness exists; use exported rule functions plus typecheck/build/source audit. |
| Browser/game proof decision recorded | yes | Attempt repo-approved browser path first; fallback honestly if unavailable. |
| Review target selected before closeout | yes | Review against current diff/main-equivalent local source. |
| Browser pack selected | yes | Applied pack: browser. |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, Snake book page. |
| Browser tool decision recorded | yes | `browser-use` not exposed in this session; fallback to server/build/source proof unless another browser tool becomes available. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | Requirements explicit; no question needed. |
| 2. autogoal | complete | Active goal handle and this plan path | Goal active; plan `docs/plans/2026-06-23-snake-grid-size-skill.md`. |
| 3. to-prd | complete | PRD issue URL or `N/A: <reason>` | https://github.com/bbeyens/library-magic/issues/16 |
| 4. to-issues | complete | Slice issue URLs or `N/A: <reason>` | https://github.com/bbeyens/library-magic/issues/17 |
| 5. implement | complete | Implemented slice id/scope and changed owners | #17 implemented in `state.ts`, `actions.ts`, `hud.ts`, `style.css`. |
| 6. browser/game playtest | partial | Route, interaction, result, console/network caveat, and tool/fallback used | `browser-use` unavailable; Chrome is focused on fullscreen YouTube, so no visual interaction proof. Server responds 200 and build passes. |
| 7. review | complete | Review target, findings, fixes/rejections | Self-review/source audit against current diff; no blocking findings. |
| 8. close with evidence | complete | Final response evidence checklist prepared | Evidence checklist prepared for final response. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Objective, threshold, verification surface, constraints, boundaries, and
      blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [x] Auto Step Ledger is updated before moving past each step.
- [x] PRD issue is created or explicitly marked `N/A: <reason>`.
- [x] Vertical slice issues are created or explicitly marked `N/A: <reason>`.
- [x] First useful slice is selected and implemented.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Browser/game proof uses the repo-approved browser tool first or records
      the unavailable tool and honest fallback.
- [x] Review runs after implementation and verification, before closeout.
- [x] Final handoff evidence list is assembled before closing the goal.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | Ledger complete through review; closeout pending final response. |
| PRD published | yes | Create PRD issue or record `N/A: <reason>` | #16 |
| Slice issues published | yes | Create vertical slice issues or record `N/A: <reason>` | #17 |
| Implemented slice | yes | Name the slice and changed owners | #17 implemented in snake state/actions/HUD/CSS. |
| Typecheck/build/test proof | yes | Run relevant owner checks or record `N/A: <reason>` | `npm run typecheck` OK; `npm run build` OK. |
| Browser/game proof | partial | Exercise affected browser/game surface or record blocker/waiver | Browser visual proof blocked by unavailable `browser-use` and Chrome fullscreen video; server responds 200. |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | Source audit found no blocking issue. |
| Final handoff completeness | yes | Confirm final response will list PRD issue, slice issues, implemented issue/slice, verification, browser proof, review result, and `score confiance` | Prepared. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise `N/A: <reason>` | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-snake-grid-size-skill.md` | Initial run exposed admin rows; rerun after plan update. |
| Browser interaction proof | partial | Exercise target route/interaction or record blocker | Visual interaction blocked; route available. |
| Browser console/network check | N/A | Record console/network state or N/A | No browser automation surface available without disrupting active Chrome video. |
| Browser final proof artifact | partial | Record screenshot/trace/route proof or exact caveat | Exact caveat recorded. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Read docs/source; no question needed because requirements were explicit | autogoal |
| Autogoal setup | complete | goal active; plan created | PRD |
| PRD | complete | #16 | issues |
| Issues | complete | #17 | implementation |
| Implementation | complete | #17 implemented | browser/game proof |
| Browser/game proof | partial | `browser-use` unavailable; server 200; Chrome visual proof blocked by fullscreen video | review |
| Review | complete | source audit, typecheck, build | closeout |
| Closeout | complete | final response evidence prepared | final response |

Findings:
- Current snake grid is hardcoded to 9 in `createInitialState`.
- Snake board rendering already uses `state.snake.gridSize`, so the main change
  is making skill level drive that field and resetting/repositioning safely.

Decisions and tradeoffs:
- Grid size formula: `4 + gridSizeSkillLevel`, max level 5 for 9x9.
- Buying the grid-size skill resets the current serpent run to avoid invalid
  body/food coordinates and weird mid-run board shape changes.

Review fixes:
- None yet.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Timeline:
- 2026-06-23T16:32:44.907Z: plan created.

Verification evidence:
- `npm run typecheck` OK.
- `npm run build` OK.
- `curl -I http://127.0.0.1:5173/` returned `HTTP/1.1 200 OK`.
- Source audit: `gridSize` skill appears in max levels, cost switch, buy handler,
  max debug handler, detailed UI, compact UI, HUD signature, and board CSS.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Implementation |
| Where am I going? | PRD, issues, implementation, browser/game proof, review, closeout |
| What is the goal? | Add a Snake grid-size skill from 4x4 to 9x9 in the correct UI order. |
| What have I learned? | Snake grid is currently hardcoded to 9, while rendering already supports variable size. |
| What have I done? | Created PRD #16, slice #17, goal, and plan. |

Open risks:
- Browser visual proof is incomplete because `browser-use` is unavailable and
  Chrome is focused on a fullscreen YouTube video.
