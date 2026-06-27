# TD Three Row Layout

Objective:
Update TD HUD and upgrade layout; done when arena stat blocks are gone, TD upgrades render as 3 rows Attack/Defense/Utility, checks and browser proof pass.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-27-td-three-row-layout.md

Primary template:
focused task

Applied packs:
- browser

Completion threshold:
- The TD arena no longer renders the top stat blocks such as `◆ 164`.
- The TD detailed upgrade panel has exactly three category rows: Attaque, Defense, Utility.
- The three rows use compact icon nodes similar to the Blackjack layout.
- Focused checks, build, and browser proof pass.

Verification surface:
- Source audit for TD HUD markup.
- `npm run typecheck`, `npm run build`, `git diff --check`.
- Browser proof on `http://127.0.0.1:5173`.

Constraints:
- Keep current TD gameplay rules unchanged.
- Preserve unrelated dirty workspace changes.
- Do not alter the TD map art.

Boundaries:
- `src/ui/hud.ts`
- `src/style.css`

Output budget strategy:
- Use focused `rg`/`sed` reads only.
- Browser proof as compact JSON plus screenshot path.

Blocked condition:
- Stop only if the local browser app cannot render the TD panel after checks pass.

Start Gates:
| Gate | Applies | Evidence |
| --- | --- | --- |
| User requirements captured | yes | Remove selected TD stat blocks; 3 upgrade rows: Attaque, Defense, Utility |
| Current source inspected | yes | Read TD upgrade panel and TD arena markup/CSS |

Work Checklist:
- [x] Remove TD arena stat block markup.
- [x] Replace TD detailed upgrade panel with 3 grouped rows.
- [x] Add CSS for the 3-row layout and compact nodes.
- [x] Verify with checks and browser proof.

Completion Gates:
| Gate | Applies | Required action | Evidence |
| --- | --- | --- | --- |
| Checks | yes | Run typecheck/build/diff check | `npm run typecheck`, `npm run build`, and `git diff --check` passed |
| Browser | yes | Open TD and detailed upgrade panel | Browser proof on `http://127.0.0.1:5173`: `defenseStatsCount=0`, `rowCount=3`, rows `Attaque`, `Défense`, `Utility`; all nodes fit inside rows |
| Goal plan complete | yes | Update evidence and pass checker | `check-complete.mjs` rerun after this evidence update |

Phase / pass table:
| Phase | Status | Evidence | Next |
| --- | --- | --- | --- |
| Implementation | complete | TD HUD/CSS edited | Verify |
| Verification | complete | Checks and browser proof passed | Close goal |

Findings:
- The selected `◆ 164` block is part of `.defense-stats`.
- Existing TD upgrades render as many standard tracks under category labels; user wants exactly 3 rows.

Timeline:
- Plan created.
- Removed `.defense-stats` markup from `defensePanel`.
- Replaced detailed TD upgrade list with three category rows.
- Added compact row/node CSS and adjusted node sizing so all Attack row nodes fit.

Decisions and tradeoffs:
- `Utility` includes range, ricochet count/chance, and money upgrades; attack remains direct damage/cadence/crit and defense remains survival.
- Kept compact mode unchanged because the user asked for the full TD layout.

Review fixes:
- Initial browser proof showed the last attack node clipped; accepted and reduced TD upgrade node size from 44px to 38px.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
| --- | --- | --- | --- |

Verification evidence:
- `npm run typecheck` passed.
- `npm run build` passed.
- `git diff --check` passed.
- Browser proof screenshot: `/tmp/library-magic-td-three-row-layout-proof-final.png`.
- Browser DOM proof: `defenseStatsCount=0`, `rowCount=3`, `categoryLabelCount=0`, rows `Attaque`, `Défense`, `Utility`, and all nodes inside their row bounds.
- `check-complete.mjs docs/plans/2026-06-27-td-three-row-layout.md` is the final mechanical gate for this completed evidence set.

Reboot status:
| Where am I? | Where am I going? | What is the goal? | What learned? | What done? |
| --- | --- | --- | --- | --- |
| Completed | Done | TD has 3-row upgrade layout and no top stat blocks | Browser proof confirms row count and removed stat blocks | Implementation verified |

Open risks:
- Workspace already has unrelated dirty files.
