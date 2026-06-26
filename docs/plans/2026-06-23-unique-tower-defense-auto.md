# Unique Tower Defense Book Auto

Objective:
Add the fifth Library Magic book mini-game: a single-tower tower defense book page that keeps the existing mini-game panel layout.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-06-23-unique-tower-defense-auto.md

Template:
docs/plans/templates/auto.md

Applied packs:
- browser

Task source:
- type: user request
- title: "je veux faire le 5e jeu, un tower defense avec une seule tour unique, le layout reste toujours fidèle avec qu'on a des autres mini jeu"
- reference video: `/var/folders/v0/m9v03dm522qgkml9w0kr6m_m0000gn/T/TemporaryItems/NSIRD_screencaptureui_7zSSoC/Screen Recording 2026-06-23 at 23.39.52.mov`

First checkpoint:
- Scope: create the fifth book mini-game.
- Mini-game: tower defense.
- Tower rule: exactly one unique tower, centered in the play field.
- Layout rule: stay faithful to the existing Library Magic mini-games, especially Grimoire de Mana and Livre du Serpent.
- Reference video signals: single-tower defense loop only; do not copy its full-screen layout.
- Deliverables: PRD issue, vertical slice issues, implemented first slice, game/browser proof, review.
- Verification surface: focused simulation assertions, typecheck/build, browser/game screenshot and DOM assertions.
- Stop conditions: missing GitHub access, unsafe product ambiguity, destructive action, or no honest verification path.

Completion threshold:
- PRD issue exists.
- Vertical slice issues exist.
- First useful slice is implemented: new tower defense book visible in the library and playable inside a book panel.
- Focused behavior assertion passes.
- Typecheck and build pass.
- Browser/game proof is captured.
- Review against `main` is recorded.
- `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-unique-tower-defense-auto.md` passes, or missing checker is recorded with equivalent manual closure.

Blocked condition:
- Stop only if GitHub issue publication fails, the game cannot be built, no browser proof can be captured with any available tool, or a destructive/unrelated workspace action would be required.

Verification surface:
- GitHub issue URLs for PRD and slices.
- `npx tsx` focused assertions for simulation behavior.
- `npm run typecheck`.
- `npm run build`.
- Browser proof using repo-approved browser tool first; record fallback honestly.
- `git diff main...HEAD` review.

Constraints:
- Preserve unrelated dirty workspace changes.
- Do not convert the tower defense into a separate full-screen app or copy the reference video's screen layout.
- Keep the existing book panel size/drag/slot mechanics.
- Do not require generated sprite assets for this first slice.

Boundaries:
- Allowed edit scope: `CONTEXT.md`, `docs/plans/**`, `src/game/**`, `src/ui/**`, `src/phaser/**`, `src/style.css`, package test tooling only if needed.
- Browser surface: Vite app at localhost.
- Tracker sync: GitHub Issues via `gh`.
- Non-goals: multiple towers, free tower placement, sprite pipeline, full long-term balance pass.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Read `CONTEXT.md`, `.agents/skills/grill-with-docs/SKILL.md`, `.agents/skills/grilling/SKILL.md`, `.agents/skills/domain-modeling/SKILL.md`; no material question needed because code and video answer the product shape. |
| Prompt requirements captured before work | yes | See First checkpoint. |
| Timed checkpoint parsed | N/A: no duration requested | No timed checkpoint in prompt. |
| Active goal checked or created | yes | `create_goal` created active goal for this plan. |
| Source of truth read before edits | yes | Read `CONTEXT.md`, `AGENTS.md`, `docs/agents/*`, `src/game/simulation/*`, `src/game/content/books.ts`, `src/ui/hud.ts`, `src/phaser/scenes/LibraryScene.ts`, `src/style.css`, reference video frame. |
| Tracker target verified | yes | `gh repo view` resolved `bbeyens/library-magic`. |
| PRD publication decision recorded | yes | Publish PRD to GitHub Issues with `ready-for-agent`. |
| Slice publication decision recorded | yes | Publish vertical slices to GitHub Issues with `ready-for-agent`. |
| First useful slice selected | yes | Implement playable single-tower book page end to end. |
| TDD decision before behavior change or bug fix | yes | TDD applies to simulation rules through focused assertions. |
| Browser/game proof decision recorded | yes | Use browser tool first; fallback recorded if unavailable. |
| Review target selected before closeout | yes | Review against `main`. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | Docs/code/video read; no user question needed. |
| 2. autogoal | complete | Active goal handle and this plan path | Active goal created; plan path `docs/plans/2026-06-23-unique-tower-defense-auto.md`. |
| 3. to-prd | complete | PRD issue URL | https://github.com/bbeyens/library-magic/issues/22 |
| 4. to-issues | complete | Slice issue URLs | #23 playable Book Page, #24 upgrade hooks, #25 presentation polish |
| 5. implement | complete | Implemented slice id/scope and changed owners | Implemented #23: Bastion Arcanique book, Sceaux resource, single unique tower defense simulation, Phaser shelf position, DOM panel, CSS arena, glossary entries. |
| 6. browser/game playtest | complete | Route, interaction, result, console/network caveat, and tool/fallback used | Browser-use unavailable via tool_search; fallback Playwright against Chrome system on `http://127.0.0.1:5174/`; screenshot `/tmp/library-magic-defense-book-final.png`; assertions: one tower, active enemy, wave stats, no pageerror, no failed responses. Console caveat: one generic 404 console message. |
| 7. review | complete | Review target, findings, fixes/rejections | Reviewed working diff against `main`; fixed duplicate Jetons HUD row and missing Phaser positions for concurrent Blackjack/Hundred books; no remaining #23 blocker found. |
| 8. close with evidence | complete | Final response evidence checklist prepared | Final response will list PRD #22, slices #23/#24/#25, implemented #23, checks, browser proof, review result, and score confiance. |

Work Checklist:
- [x] First checkpoint complete.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] No duration requested; timed checkpoint is N/A.
- [x] Auto Step Ledger is updated before moving past each step.
- [x] PRD issue is created.
- [x] Vertical slice issues are created.
- [x] First useful slice is selected and implemented.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice is recorded with reason.
- [x] Browser/game proof uses the repo-approved browser tool first or records the unavailable tool and honest fallback.
- [x] Review runs after implementation and verification, before closeout.
- [x] Final handoff evidence list is assembled before closing the goal.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | Ledger complete: grill-with-docs, autogoal, PRD, issues, implementation, browser proof, review, closeout evidence. |
| PRD published | yes | Create PRD issue | https://github.com/bbeyens/library-magic/issues/22 |
| Slice issues published | yes | Create vertical slice issues | https://github.com/bbeyens/library-magic/issues/23, https://github.com/bbeyens/library-magic/issues/24, https://github.com/bbeyens/library-magic/issues/25 |
| Implemented slice | yes | Name the slice and changed owners | #23 implemented across `CONTEXT.md`, `src/game/content/books.ts`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/phaser/scenes/LibraryScene.ts`, `src/ui/hud.ts`, `src/style.css`. |
| Typecheck/build/test proof | yes | Run relevant owner checks | Focused `npx tsx` assertion passed with `{"sigils":12,"wave":3,"tower":"unique"}`; `npm run typecheck` passed; `npm run build` passed; `git diff --check` passed. |
| Browser/game proof | yes | Exercise affected browser/game surface or record blocker/waiver | Screenshot `/tmp/library-magic-defense-book-final.png`; DOM assertions passed: one tower, active enemy, wave stats; no pageerror and no failed responses. Browser-use unavailable; used Playwright with system Chrome fallback. |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | Reviewed against `main`; fixed duplicate Jetons HUD row and missing `blackjack`/`hundred` Phaser positions caused by concurrent dirty changes; no remaining #23 blocker. |
| Final handoff completeness | yes | Confirm final response lists PRD issue, slice issues, implemented issue/slice, verification, browser proof, review result, and `score confiance` | Prepared final handoff with required evidence. |
| Timed checkpoint | N/A: no duration requested | None | No duration in prompt. |
| Goal plan complete | yes | Run completion checker or record unavailable checker | Local `.agents` checker missing; global checker `/Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-23-unique-tower-defense-auto.md` passed. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Source/docs/video read, decisions recorded | autogoal |
| Autogoal setup | complete | plan created and active goal created | PRD |
| PRD | complete | https://github.com/bbeyens/library-magic/issues/22 | issues |
| Issues | complete | #23, #24, #25 created | implementation |
| Implementation | complete | #23 implemented | browser/game proof |
| Browser/game proof | complete | `/tmp/library-magic-defense-book-final.png`; DOM assertions passed | review |
| Review | complete | Diff reviewed against `main`; fixes applied | closeout |
| Closeout | complete | Evidence checklist ready | final response |

Findings:
- Existing architecture uses `BookDefinition`, `GameState`, `applyAction`/`tickState`, Phaser book hotspots, and DOM book panels.
- Existing mini-games render inside draggable/resizable `book-overlay` panels.
- Existing layout fidelity means same book-panel language as Snake and Grimoire de Mana, not fidelity to the reference video layout.

Decisions and tradeoffs:
- The fifth book will be a book mini-game, not a separate mode.
- The first slice uses CSS/DOM shapes in the same panel style as existing mini-games to keep scope focused.
- One unique tower is a hard gameplay rule.

Review fixes:
- Removed duplicate Jetons resource row/dynamic update introduced by concurrent HUD changes.
- Added missing Phaser shelf positions for concurrent `blackjack` and `hundred` books so the shelf no longer throws at runtime.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |
| Browser proof with bundled Playwright Chromium failed because browser executable was missing | 1 | Use system Chrome channel through Playwright | Resolved; browser proof passed. |
| Browser proof during HMR failed because page reloaded while edits were still propagating | 1 | Wait for stable dev server and rerun proof | Resolved; final browser proof passed. |
| Local `.agents` autogoal checker missing | 1 | Use installed global autogoal checker | Resolved; global checker passed. |

Timeline:
- 2026-06-23: plan created after grill-with-docs.
- 2026-06-23: user clarified that fidelity is to existing mini-games, not to the reference video layout.
- 2026-06-23: active goal created for this plan.
- 2026-06-23: PRD #22 and slices #23, #24, #25 created.
- 2026-06-23: implemented #23 playable Bastion Arcanique first slice.
- 2026-06-23: verified focused simulation, typecheck, build, diff check, and browser proof.
- 2026-06-23: reviewed against `main` and fixed review findings.

Verification evidence:
- PRD: https://github.com/bbeyens/library-magic/issues/22.
- Slices: https://github.com/bbeyens/library-magic/issues/23, https://github.com/bbeyens/library-magic/issues/24, https://github.com/bbeyens/library-magic/issues/25.
- Focused assertion: `npx tsx -e ...` passed with `{"sigils":12,"wave":3,"tower":"unique"}`.
- Typecheck: `npm run typecheck` passed.
- Build: `npm run build` passed; Vite chunk-size warning remains.
- Whitespace: `git diff --check` passed.
- Browser: `http://127.0.0.1:5174/`, screenshot `/tmp/library-magic-defense-book-final.png`; one unique tower, active enemy, wave stats, no pageerror, no failed responses; generic 404 console message remains as caveat.
- Review: working diff reviewed against `main`; duplicate Jetons row and missing concurrent book positions fixed.
- Goal plan checker: global autogoal checker passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Add the fifth book mini-game: a single-tower tower defense that keeps Library Magic panel layout |
| What have I learned? | See Findings and Review fixes |
| What have I done? | Created PRD/issues, implemented #23, verified, browser-proofed, reviewed |

Open risks:
- Workspace contains unrelated/concurrent dirty changes, including Blackjack/Hundred work and older plan files; no commit was created to avoid sweeping unrelated work into one commit.
- Browser proof used a system Chrome fallback because no `browser-use` callable tool was exposed and bundled Playwright Chromium was not installed.
- Vite build reports the existing large Phaser chunk warning.
