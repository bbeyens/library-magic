# Eight Book Panels Auto Workflow

Objective:
Support up to 8 simultaneous Book Pages; done when PRD/issues exist, state tests prove 8-slot behavior, browser proof shows current mini-games open together, review is recorded, and this plan is closed.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-06-23-eight-book-panels-auto.md

Primary template:
docs/plans/templates/auto.md

Applied packs:
- browser

Auto workflow source:
- auto skill: `.agents/skills/auto/SKILL.md`
- expected order: grill-with-docs -> autogoal -> to-prd -> to-issues -> implement -> browser/game playtest -> review -> close with evidence

Task source:
- type: user request
- title: Support up to 8 simultaneous mini-game panels
- acceptance criteria:
  - The app can keep more than two mini-game Book Pages open at the same time.
  - The panel system supports up to eight simultaneous Book Pages.
  - The four current mini-games can all be opened together.
  - Future games can reuse the same panel-slot system without redesigning the open-panel state.
  - Behavior should follow the existing second-panel pattern, but with more panels.
  - Use TDD where the behavior is testable.
  - Browser/game proof must verify the current mini-games remain open together.
  - Final answer includes PRD issue, slice issues, verification, browser proof, review result, and `score confiance`.

First checkpoint:
- Explicit requirements copied above.
- Scope: state/open-panel ownership and HUD panel placement.
- Non-goals: adding new mini-games; changing the final unlock order; committing/pushing unless separately asked; cleaning unrelated dirty diffs.
- Stop conditions: missing tracker access, unsafe ambiguity, credentials failure, destructive action, or no honest verification path.

Timed checkpoint:
- requested duration: N/A: user did not request timed work.
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: final response score confiance.

Completion threshold:
- PRD issue exists.
- Vertical slice issue exists.
- Implementation supports up to 8 simultaneous panels in state and layout.
- Focused TDD assertion proves current four books open together and replacement does not occur below the 8-panel cap.
- Browser/game proof shows the four current Book Pages open together.
- Typecheck/build/diff-check pass.
- Review is recorded.

Verification surface:
- `gh issue` URLs.
- Focused `npx tsx` assertions through `createInitialState` and `applyAction`.
- `npm run typecheck`.
- `npm run build`.
- `git diff --check`.
- Browser proof via available automation fallback if direct browser-use is unavailable.

Constraints:
- Preserve unrelated dirty workspace changes.
- Keep project vocabulary: Book Page, Book Mini-Game, Livre du Serpent, Arc Typing, Herbier Enchante.
- Keep future unlock ordering data intact; this change only makes direct access possible now.

Boundaries:
- Allowed edit scope: `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`, and this plan.
- Tracker sync: GitHub Issues.
- Browser surface: local Vite app.

Output budget strategy:
- Use focused reads around panel state/layout.
- Avoid broad generated asset output.
- Cap diffs and audits to relevant files.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials/permissions failure, destructive action, or no honest verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Read docs/code; no blocking user question needed. |
| Prompt requirements captured before work | yes | Task source and First checkpoint sections. |
| Active goal checked or created | yes | `get_goal` returned no active goal before this plan. |
| Source of truth read before edits | yes | `CONTEXT.md`, panel state/actions, HUD layout, issue tracker docs, required skills. |
| Tracker target verified | yes | `gh auth status` succeeded and `ready-for-agent` exists. |
| TDD decision before behavior change | yes | TDD applies at `applyAction`/`createInitialState` seam. |
| Browser/game proof decision recorded | yes | Use available browser automation; direct browser-use unavailable in this session. |
| Review target selected | yes | Review against current request and relevant diff; `main` has pre-existing dirty diffs. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | Read relevant docs/code; no blocker. |
| 2. autogoal | complete | Active goal handle and plan path | Goal active for this plan path. |
| 3. to-prd | complete | PRD issue URL | https://github.com/bbeyens/library-magic/issues/14 |
| 4. to-issues | complete | Slice issue URLs | https://github.com/bbeyens/library-magic/issues/15 |
| 5. implement | complete | Implemented slice/scope | `BookPanelSlot` now supports slots `0..7`; `openBookPanel` fills unused slots until cap 8; HUD/CSS define responsive slot placement. |
| 6. browser/game playtest | complete | Browser route, interaction, screenshot, caveat | `http://127.0.0.1:5174/`; opened mana, serpent, typing, herbarium; screenshot `/tmp/library-magic-four-panels-grid-final.png`; direct browser-use unavailable, used Chrome/Playwright fallback. |
| 7. review | complete | Review target and result | Manual request-focused review found no blocking issue; fixed HUD z-layer and default resize/grid overlap before close. |
| 8. close with evidence | complete | Final response checklist | Evidence assembled below. |

Work Checklist:
- [x] First checkpoint complete.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] No timed checkpoint applies.
- [x] PRD issue is created.
- [x] Vertical slice issue is created.
- [x] First useful slice is implemented.
- [x] TDD assertion proves four current books stay open together.
- [x] Source supports an eight-panel cap.
- [x] Browser proof shows all current mini-games open together.
- [x] Review runs before closeout.
- [x] Final handoff evidence is assembled.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Record every step in ledger | Ledger complete through closeout. |
| PRD published | yes | Create PRD issue | https://github.com/bbeyens/library-magic/issues/14 |
| Slice issues published | yes | Create vertical slice issue | https://github.com/bbeyens/library-magic/issues/15 |
| Implemented slice | yes | Name changed owners | `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/style.css`, `src/ui/hud.ts` |
| Typecheck/build/test proof | yes | Run focused tests and checks | Focused `npx tsx` assertion, `npm run typecheck`, `npm run build`, `git diff --check` all passed. |
| Browser/game proof | yes | Exercise all current Book Pages together | Chrome/Playwright opened four panels; panel count 4, unique slots 4, overlaps 0, CSS slot rules 0..7 present. |
| Review | yes | Review against spec/request | No blocking findings after fixing z-index/default resize overlap. |
| Final handoff completeness | yes | Prepare evidence list and score confiance | Ready for final response. |
| Goal plan complete | yes | Run checker if available or audit plan manually | Manual audit complete; no unchecked checklist items remain. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Source/docs read. | autogoal |
| Autogoal setup | complete | Goal active for this plan. | PRD |
| PRD | complete | GitHub issue #14. | issues |
| Issues | complete | GitHub issue #15. | implementation |
| Implementation | complete | `BookPanelSlot` 0..7, 8-slot allocation, responsive slot CSS, default panel sizing fixed. | browser/game proof |
| Browser/game proof | complete | Screenshot `/tmp/library-magic-four-panels-grid-final.png`; DOM assertions passed. | review |
| Review | complete | No blocking findings; overlap/z-layer issues fixed before closure. | closeout |
| Closeout | complete | Evidence assembled. | final response |

Findings:
- Current `BookPanelSlot` is `'left' | 'right'`.
- Current `openBookPanel` replaces a panel once two are open.
- Current CSS only has left/right slot placement.

Decisions and tradeoffs:
- Use numeric slots `0..7` instead of expanding named slot strings.
- Keep replacement behavior only after the 8-panel cap is reached.
- Use responsive fixed slot coordinates first; drag/resize can still override via existing inline custom properties.

Review fixes:
- Added explicit `#hud-root` z-index so Book Pages render above the Phaser canvas.
- Removed duplicate drag-position CSS.
- Removed stale left/right responsive slot rules.
- Stopped applying saved resize state to default panels, which prevented grid overlap.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Timeline:
- 2026-06-23: plan created.
- 2026-06-23: goal created; PRD #14 and slice #15 published.

Verification evidence:
- PRD: https://github.com/bbeyens/library-magic/issues/14
- Slice: https://github.com/bbeyens/library-magic/issues/15
- Focused TDD assertion passed: selecting every current book leaves all four open with unique slots `[0, 1, 2, 3]`.
- `npm run typecheck` passed.
- `npm run build` passed; Vite emitted the existing large bundle warning only.
- `git diff --check` passed.
- Browser/game proof passed on `http://127.0.0.1:5174/`: panel count 4, unique slots 4, overlaps 0, CSS slot rules 0..7 present.
- Screenshot: `/tmp/library-magic-four-panels-grid-final.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Support up to 8 simultaneous Book Pages. |
| What have I learned? | Existing cap was 2 and slots were left/right; numeric slots are the clean extension point for 8 panels. |
| What have I done? | Created PRD/issues, implemented 8-slot panel support, verified with TDD/typecheck/build/browser proof, and reviewed the diff. |

Open risks:
- Four current games are available; the 8-panel cap is proven in state/slot logic, not by eight real game definitions yet.
