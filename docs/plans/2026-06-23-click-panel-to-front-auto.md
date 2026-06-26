# Click Panel To Front Auto Workflow

Objective:
Clicking any visible Book Page brings that Book Page to the front; done when GitHub PRD/issues exist, a focused failing-then-passing behavior proof exists, browser proof shows an overlapped rear panel comes forward on click, review is recorded, and this plan is closed.

Flow mode:
one-shot execution.

Goal plan:
docs/plans/2026-06-23-click-panel-to-front-auto.md

Primary template:
docs/plans/templates/auto.md

Applied packs:
- browser

Auto workflow source:
- auto skill: `.agents/skills/auto/SKILL.md`
- expected order: grill-with-docs -> autogoal -> to-prd -> to-issues -> implement -> browser/game playtest -> review -> close with evidence

Task source:
- type: user request
- title: Click a rear Book Page to bring it to front
- acceptance criteria:
  - When multiple Book Pages overlap, clicking a Book Page behind another one makes it the front Book Page.
  - The behavior should feel like desktop windows or folders.
  - Existing Book Page drag, resize, close, upgrades, and mini-game controls still work.
  - The solution should use the existing focused/selected Book Page concept where possible.
  - Use TDD where the behavior is cleanly assertable.
  - Browser/game proof must demonstrate a rear panel becoming front after click.
  - Final answer includes PRD issue, slice issue, verification, browser proof, review result, and `score confiance`.

First checkpoint:
- Requirements copied above.
- Scope: Book Page focus/front interaction and related HUD event handling.
- Non-goals: adding new mini-games, changing unlock order, redesigning the panel/window system, committing/pushing unless separately asked.
- Stop conditions: missing GitHub access, unsafe ambiguity, destructive action, or no honest browser verification path.

Completion threshold:
- PRD issue exists.
- Vertical slice issue exists.
- Implementation makes panel click update the focused/front Book Page.
- Focused behavior proof fails before the fix and passes after.
- Browser proof shows an overlapped rear panel becomes top/front after click.
- `npm run typecheck`, `npm run build`, and `git diff --check` pass.
- Review is recorded.
- Plan has no unresolved checklist or gate rows.

Verification surface:
- `gh issue` URLs.
- Focused `npx tsx` or DOM/browser assertions for behavior.
- `npm run typecheck`.
- `npm run build`.
- `git diff --check`.
- Browser proof via available automation fallback if direct browser-use is unavailable.

Constraints:
- Preserve unrelated dirty workspace changes.
- Keep project vocabulary: Book Page, Book Mini-Game.
- Keep existing drag/resize behavior.
- Keep existing mini-game controls clickable.

Boundaries:
- Allowed edit scope: `src/ui/hud.ts`, `src/game/simulation/actions.ts` only if a state-level action is needed, `src/style.css` only if z-index styling needs adjustment, and this plan.
- Tracker sync: GitHub Issues.
- Browser surface: local Vite app.

Output budget strategy:
- Use focused reads around HUD event handling and panel z-index.
- Cap command output and avoid generated/build artifacts.
- Use screenshots as files instead of streaming large visual artifacts repeatedly.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials/permissions failure, destructive action, or no honest verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Read `CONTEXT.md`, issue tracker docs, required skill files, and HUD/panel code; no material user question needed. |
| Prompt requirements captured before work | yes | Task source and first checkpoint sections. |
| Active goal checked or created | yes | `get_goal` returned no active goal before this plan. |
| Tracker target verified | yes | `gh auth status` succeeded as `bbeyens`; GitHub remote is `bbeyens/library-magic`; `ready-for-agent` label exists. |
| TDD decision before behavior change | yes | TDD applies at the user-facing DOM/HUD interaction seam. |
| Browser/game proof decision recorded | yes | UI behavior requires browser proof; use available browser automation fallback if `browser-use` is not callable. |
| Review target selected | yes | Review against current request/created issue and relevant dirty diff only. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, questions asked or explicit no-question reason | Existing focused Book Page concept found; no blocker question. |
| 2. autogoal | complete | Active goal handle and plan path | Goal active for this plan path. |
| 3. to-prd | complete | PRD issue URL | https://github.com/bbeyens/library-magic/issues/18 |
| 4. to-issues | complete | Slice issue URLs | https://github.com/bbeyens/library-magic/issues/19 |
| 5. implement | complete | Implemented slice/scope | `src/ui/hud.ts` focuses a Book Page when its body is clicked and focuses the owning Book Page before in-panel controls run. |
| 6. browser/game playtest | complete | Browser route, interaction, screenshot, caveat | `http://127.0.0.1:5174/`; forced overlap in browser, clicked rear Mana page, Mana became focused/front; screenshot `/tmp/library-magic-panel-front-green.png`; direct browser-use unavailable, used Chrome/Playwright fallback. |
| 7. review | complete | Review target and result | Manual request-focused review found no blocking issue; verified a rear Mana control still focuses and fires its action. |
| 8. close with evidence | complete | Final response checklist | Evidence assembled below. |

Work Checklist:
- [x] First checkpoint complete.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Active goal created.
- [x] PRD issue is created.
- [x] Vertical slice issue is created.
- [x] Red proof captures current broken behavior.
- [x] Implementation makes clicked rear panels focus/front.
- [x] Green proof passes.
- [x] Browser proof shows rear panel moves to front.
- [x] Typecheck/build/diff-check pass.
- [x] Review runs before closeout.
- [x] Final handoff evidence is assembled.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Record every step in ledger | Ledger complete through closeout. |
| PRD published | yes | Create PRD issue | https://github.com/bbeyens/library-magic/issues/18 |
| Slice issues published | yes | Create vertical slice issue | https://github.com/bbeyens/library-magic/issues/19 |
| Implemented slice | yes | Name changed owners | `src/ui/hud.ts` |
| Typecheck/build/test proof | yes | Run focused tests and checks | Red browser proof failed before fix; green browser proof passed after fix; `npm run typecheck`, `npm run build`, and `git diff --check` passed. |
| Browser/game proof | yes | Exercise overlapped rear Book Page click | Forced overlap in browser; before click `serpent` focused with z-index 5; after click `mana` focused with z-index 5 and `serpent` dropped to 4. |
| Review | yes | Review against spec/request | No blocking findings; rear Mana orb control still focuses page and fires visual action. |
| Final handoff completeness | yes | Prepare evidence list and score confiance | Ready for final response. |
| Goal plan complete | yes | Run checker if available or audit plan manually | Manual audit complete; no unresolved checklist/gate rows remain. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Source/docs read. | autogoal |
| Autogoal setup | complete | Goal active for this plan. | PRD |
| PRD | complete | GitHub issue #18. | issues |
| Issues | complete | GitHub issue #19. | implementation |
| Implementation | complete | `src/ui/hud.ts` focus handlers added. | browser/game proof |
| Browser/game proof | complete | Screenshot `/tmp/library-magic-panel-front-green.png`; DOM assertions passed. | review |
| Review | complete | No blocking findings; in-panel control proof passed. | closeout |
| Closeout | complete | Evidence assembled. | final response |

Findings:
- `selectedBook` already controls `.book-overlay.is-focused`.
- `.book-overlay.is-focused` has a higher z-index than normal panels.
- Panel clicks currently stop propagation inside the HUD layer and do not dispatch `selectBook`.
- `selectBook` already opens an unlocked Book Page and updates `selectedBook`.

Decisions and tradeoffs:
- Reuse `selectBook`/`selectedBook` for fronting instead of adding a separate z-order stack.
- Bring a panel forward on pointer down so it feels immediate before click-up.
- Do not front when clicking close/resize/upgrade buttons if that would break the button action; if practical, allow focus first without blocking controls.

Review fixes:
- No code fixes were required after review.
- Verified a rear Mana orb click still triggers the Mana click visual effect and floating gain after focusing the page.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Timeline:
- 2026-06-23: plan created.
- 2026-06-23: goal created; PRD #18 and slice #19 published.
- 2026-06-23: red browser proof captured current failure: clicking non-focused Mana did not focus it.
- 2026-06-23: implementation added Book Page focus-on-click behavior in `src/ui/hud.ts`.
- 2026-06-23: green browser proof captured rear Mana page becoming front.

Verification evidence:
- PRD: https://github.com/bbeyens/library-magic/issues/18
- Slice: https://github.com/bbeyens/library-magic/issues/19
- Red browser proof before fix: clicking a non-focused Mana Book Page left `serpent` focused.
- Green browser proof after fix: with Mana and Serpent overlapped, before click `serpent` focused/z-index 5; after clicking visible Mana, `mana` focused/z-index 5 and `serpent` z-index 4.
- Control proof: clicking the rear Mana orb focused Mana and still produced `is-clicked` plus one `.floating-gain`.
- Screenshot: `/tmp/library-magic-panel-front-green.png`.
- `npm run typecheck` passed.
- `npm run build` passed; Vite emitted the existing large-bundle warning only.
- `git diff --check` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Clicking a rear Book Page brings it to the front. |
| What have I learned? | Focus/front is already represented by `selectedBook` and `.is-focused`; click handlers needed to route panel interaction into that existing concept. |
| What have I done? | Created PRD/issues, implemented focus-on-click, verified red/green browser behavior, checked controls, built, and reviewed. |

Open risks:
- Browser proof used forced CSS overlap because the default 4-panel grid does not overlap; this isolates the z-order behavior without depending on drag automation.
