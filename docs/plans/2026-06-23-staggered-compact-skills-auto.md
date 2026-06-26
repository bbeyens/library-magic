# Staggered Compact Skills Auto Workflow

Objective:
Compact skill tiles use a top-anchored staggered wrap layout; done when PRD/issues, browser proof across widths, review, and plan closure exist.

Flow mode:
one-shot execution.

Goal plan:
docs/plans/2026-06-23-staggered-compact-skills-auto.md

Primary template:
docs/plans/templates/auto.md

Applied packs:
- browser

Task source:
- type: user request
- title: Stagger compact skill tiles when wrapping
- acceptance criteria:
  - The first skill row always starts at the top of the Book Page header area.
  - When there is not enough horizontal space, later skills wrap to a second row.
  - Wrapped rows are slightly offset for a designed/staggered look, not strict aligned columns.
  - The compact skills should not shift the whole group downward.
  - Do not copy the example colors; the screenshot is only placement guidance.
  - Existing 46px compact tile sizing and visible level badges are preserved.
  - Browser proof verifies Mana and Serpent at medium and wide panel widths.
  - Final response includes PRD issue, slice issue, verification, browser proof, review result, and `score confiance`.

First checkpoint:
- Requirements copied above.
- Scope: compact skill tile CSS layout inside Book Pages.
- Non-goals: new skill types, new colors, changing Book Page content, committing/pushing unless separately asked.
- Stop conditions: missing GitHub access, unsafe ambiguity, destructive action, or no honest browser verification path.

Completion threshold:
- PRD issue exists.
- Vertical slice issue exists.
- Red-capable browser assertion captures current non-staggered rows.
- Implementation produces top-anchored staggered wrapped rows.
- Browser proof covers Mana/Serpent medium widths and wide widths.
- `npm run typecheck`, `npm run build`, and `git diff --check` pass.
- Review is recorded.
- Plan has no unresolved checklist or gate rows.

Verification surface:
- GitHub issue URLs.
- Browser DOM measurements for row counts, top anchoring, and second-row offset.
- Screenshots for visual review.
- `npm run typecheck`.
- `npm run build`.
- `git diff --check`.

Constraints:
- Preserve unrelated dirty workspace changes.
- Preserve existing compact tile colors and current 46px tile size.
- Preserve visible badges.
- Use Book Page vocabulary.

Boundaries:
- Allowed edit scope: `src/style.css` and this plan.
- Tracker sync: GitHub Issues.
- Browser surface: local Vite app.

Output budget strategy:
- Use focused CSS reads and browser metric JSON.
- Save screenshots to `/tmp` instead of streaming many images.
- Avoid broad repo searches.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials/permissions failure, destructive action, or no honest browser verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Read `CONTEXT.md`, issue tracker docs, required skills, and compact skill CSS. |
| Prompt requirements captured before work | yes | Task source and first checkpoint sections. |
| Active goal checked or created | yes | `get_goal` returned no active goal before this plan. |
| Tracker target verified | yes | `gh auth status` succeeded as `bbeyens`; GitHub remote is `bbeyens/library-magic`; `ready-for-agent` label exists. |
| TDD decision before behavior change | yes | TDD applies as browser red/green layout assertion. |
| Browser/game proof decision recorded | yes | UI layout requires browser proof with screenshots. |
| Review target selected | yes | Review against current request/created issue and relevant CSS diff only. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, questions asked or explicit no-question reason | Existing compact skill CSS found; no blocker question. |
| 2. autogoal | complete | Active goal handle and plan path | Goal active for this plan path. |
| 3. to-prd | complete | PRD issue URL | https://github.com/bbeyens/library-magic/issues/20 |
| 4. to-issues | complete | Slice issue URLs | https://github.com/bbeyens/library-magic/issues/21 |
| 5. implement | complete | Implemented slice/scope | `src/style.css` adds row offset variables, per-game wrapped-row offsets, and constrained-width breakpoints. |
| 6. browser/game playtest | complete | Browser route, interaction, screenshot, caveat | `http://127.0.0.1:5174/`; Mana 430px = 3+2 with 23px offset; Serpent 430px = 4+3 with 23px offset; Serpent wide = 7 on one row. |
| 7. review | complete | Review target and result | Reviewed CSS diff against issue #21; no blocking findings after browser proof. |
| 8. close with evidence | complete | Final response checklist | Evidence assembled in this plan and issue #21 comment. |

Work Checklist:
- [x] First checkpoint complete.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Active goal created.
- [x] PRD issue is created.
- [x] Vertical slice issue is created.
- [x] Red browser proof captures strict-column/non-staggered wrap.
- [x] Implementation adds top-anchored staggered wrapped rows.
- [x] Green browser proof passes for Mana medium and Serpent medium.
- [x] Wide browser proof stays on one top row.
- [x] Typecheck/build/diff-check pass.
- [x] Review runs before closeout.
- [x] Final handoff evidence is assembled.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Record every step in ledger | Complete in Auto Step Ledger. |
| PRD published | yes | Create PRD issue | https://github.com/bbeyens/library-magic/issues/20 |
| Slice issues published | yes | Create vertical slice issue | https://github.com/bbeyens/library-magic/issues/21 |
| Implemented slice | yes | Name changed owners | `src/style.css` compact skill row offset and breakpoints. |
| Typecheck/build/test proof | yes | Run focused browser checks and commands | `npm run typecheck`, `npm run build`, and `git diff --check` passed. |
| Browser/game proof | yes | Exercise compact skill layout across widths | Chrome proof at `http://127.0.0.1:5174/` with screenshots in `/tmp`. |
| Review | yes | Review against spec/request | No blocking findings after visual and metric proof. |
| Final handoff completeness | yes | Prepare evidence list and score confiance | Ready for final response. |
| Goal plan complete | yes | Run checker if available or audit plan manually | `check-complete.mjs` passed; strict grep found no open rows. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Source/docs read. | autogoal |
| Autogoal setup | complete | Goal active for this plan. | PRD |
| PRD | complete | GitHub issue #20. | issues |
| Issues | complete | GitHub issue #21. | implementation |
| Implementation | complete | `src/style.css` updated for staggered wrapped compact skills. | browser/game proof |
| Browser/game proof | complete | Mana 430px 3+2 offset 23px; Serpent 430px 4+3 offset 23px; Serpent wide one row. | review |
| Review | complete | CSS diff reviewed against request and #21; no blocking findings. | closeout |
| Closeout | complete | Plan evidence assembled; issue comment prepared. | final response |

Findings:
- Current compact skill layout uses flex wrap with uniform row starts.
- Existing `--mini-skill-columns` avoids orphan rows but still makes strict columns.
- User wants staggered row starts while keeping the first row anchored at the top.

Decisions and tradeoffs:
- Keep 46px tile size and 7px gap.
- Use CSS variables and nth-child row offsets instead of changing generated HTML.
- Apply stagger only when a Book Page is in the constrained width ranges where wrapping happens.
- Do not change colors from the current game style.

Review fixes:
- Lowered the Serpent constrained-width breakpoint after browser proof showed a wide resized panel still forced 4+3 rows.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Timeline:
- 2026-06-23: plan created.
- 2026-06-23: goal created; PRD #20 and slice #21 published.
- 2026-06-23: red browser proof captured strict column wrapping with zero row offset.
- 2026-06-23: implemented staggered offsets and constrained-width breakpoints in `src/style.css`.
- 2026-06-23: green browser proof captured Mana 430px 3+2 with 23px offset, Serpent 430px 4+3 with 23px offset, and Serpent wide on one top row.
- 2026-06-23: `npm run typecheck`, `npm run build`, and `git diff --check` passed.
- 2026-06-23: `check-complete.mjs` passed for this plan.

Verification evidence:
- PRD: https://github.com/bbeyens/library-magic/issues/20
- Slice: https://github.com/bbeyens/library-magic/issues/21
- Red proof: `/tmp/library-magic-mana-stagger-red.png`, `/tmp/library-magic-serpent-stagger-red.png`; measured second-row offset was `0`.
- Green proof: `/tmp/library-magic-mana-stagger-green.png`, `/tmp/library-magic-serpent-stagger-green.png`, `/tmp/library-magic-serpent-stagger-wide-green.png`.
- Green metrics: Mana 430px rows `[3,2]`, `secondRowOffset: 23`, `firstRowTopDelta: 0`; Serpent 430px rows `[4,3]`, `secondRowOffset: 23`, `firstRowTopDelta: 0`; Serpent wide rows `[7]`.
- Commands: `npm run typecheck`; `npm run build`; `git diff --check`.
- Goal checker: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-staggered-compact-skills-auto.md`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Make compact skills wrap in top-anchored staggered rows. |
| What have I learned? | Existing layout wrapped in strict columns; constrained breakpoints must not force rows when resized wide. |
| What have I done? | Created PRD #20, slice #21, implemented CSS, verified browser metrics/screenshots, and ran checks. |

Open risks:
- No active risk found in verified widths; very narrow panels still use the existing full-width second-row fallback under 360px.
