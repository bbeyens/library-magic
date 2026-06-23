# Snake Skills Auto Workflow

Objective:
Implement a verified first slice of Livre du Serpent skills; done when PRD/issues exist, gameplay rules pass focused tests, browser proof exists, review is recorded, and this plan is complete.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-06-22-snake-skills-auto.md

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
- type: user request
- id / link: direct Codex prompt on 2026-06-22
- title: Livre du Serpent skill progression
- acceptance criteria:
  - First snake skill changes movement speed from 0.7s per cell at level 0 down to 0.25s, subtracting 0.02s per level.
  - Combo multiplier increases by +10% per fruit while the Serpent Run is alive: x1.1, x1.2, x1.3, x1.4, and resets when the serpent hits a wall/body.
  - Second snake skill provides automation based on base multiplier and can disable automatic direction changes beyond its intended limit.
  - Third snake skill increases base multiplier from x1.1 upward to x5.
  - Fourth snake skill adds bonus fruits: level 1 orange +0.2 multiplier, level 2 pear +0.4, level 3 max banana +1.
  - Fifth snake skill adds extra life: collision does not reset to 0; instead the snake becomes invincible for 2 seconds.
  - Sixth snake skill allows edge wrapping to the opposite side.
  - Use TDD where clean behavior seams exist.
  - Browser/game proof must exercise the affected mini-game.
  - Final answer must include `score confiance` on /100.

First checkpoint:
- Explicit prompt requirements are copied above as checkable criteria.
- Scope: implement the first useful vertical slice across simulation and UI for Snake skills.
- Non-goals: no new Spriterrific asset generation; no broad art overhaul; no unrelated dirty workspace cleanup.
- Stop conditions: only missing tracker access, unsafe ambiguity, credentials failure, destructive action, or no honest verification path.
- Deliverables: PRD issue, slice issues, implemented first slice, tests/checks, browser proof, review evidence.

Timed checkpoint:
- requested duration: N/A: user did not request a timed checkpoint.
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: final response score confiance.

Completion threshold:
- PRD issue exists.
- Vertical slice issues exist.
- The first useful slice is implemented.
- Verification named in this plan passes.
- Browser/game proof is captured for UI/game work.
- Review step is run and recorded before closeout.
- Final response lists PRD issue, slice issues, implemented issue/slice, verification proof, browser proof, review result, and `score confiance`.

Verification surface:
- `gh issue` commands or issue URLs for PRD/slice publication.
- Focused `npx tsx` gameplay assertions for snake speed, combo, random fruit placement, extra life/wrap where implemented.
- `npm run typecheck`.
- `npm run build`.
- Browser/game proof against the Livre du Serpent UI using available browser automation fallback.
- Review evidence against `main`.
- Plan completion audit by source review if checker helper is unavailable.

Constraints:
- `grill-with-docs` happened before this autogoal plan starts.
- After the grill-with-docs phase, do not stop for plan/issue/implementation approval unless there is a real blocker.
- Do not skip `review` before closeout.
- Preserve unrelated dirty workspace changes.
- Use project vocabulary: Livre du Serpent, Serpent Run, Ecailles, Mana.

Boundaries:
- Source of truth: user request plus `.agents/skills/auto/SKILL.md`.
- Allowed edit scope: simulation, state, HUD/CSS, docs/plans, issue bodies.
- Browser surface: local Vite game, Livre du Serpent panel.
- Tracker sync: GitHub Issues via `gh`.
- Non-goals: commit/push unless separately requested; broad refactors; unrelated visual rewrites.

Output budget strategy:
- Use focused reads and capped command output.
- For broad audits, prefer counts, filenames, or narrow `rg` patterns before printing full matches.
- Exclude generated assets, logs, `node_modules`, and build output unless they are the named source of truth.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials or permissions failure, destructive action, or inability to run any honest verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | yes | Source docs/code read; automation ambiguity resolved by implementing first playable slice without blocking. |
| Prompt requirements captured before work | yes | Task source and First checkpoint sections above. |
| Timed checkpoint parsed | no | N/A: user did not request timed work. |
| Active goal checked or created | yes | `get_goal` returned no active goal before plan creation. |
| Source of truth read before edits | yes | `CONTEXT.md`, issue tracker docs, relevant simulation/HUD files, and named skill files read. |
| Tracker target verified | yes | `git remote -v` shows `bbeyens/library-magic`; `gh auth status` logged in as `bbeyens`. |
| PRD publication decision recorded | yes | Publish to GitHub Issues with `ready-for-agent`. |
| Slice publication decision recorded | yes | Publish vertical slices to GitHub Issues with `ready-for-agent`. |
| First useful slice selected | yes | Implement core Snake skill progression state/rules plus minimal UI visibility. |
| TDD decision before behavior change or bug fix | yes | TDD applies to simulation rules; use focused `npx tsx` assertions. |
| Browser/game proof decision recorded | yes | Use available browser automation fallback with Playwright through node_repl; browser-use direct tool unavailable. |
| Review target selected before closeout | yes | Review against `main` per skill default. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | Read docs/code; no blocking question because first slice can define ambiguous automation safely. |
| 2. autogoal | complete | Active goal handle and this plan path | Goal active for this plan path. |
| 3. to-prd | complete | PRD issue URL or `N/A: <reason>` | GitHub PRD issue #5: https://github.com/bbeyens/library-magic/issues/5 |
| 4. to-issues | complete | Slice issue URLs or `N/A: <reason>` | #6 speed/combo/base, #7 automation, #8 bonus fruits, #9 extra life/wrap |
| 5. implement | complete | Implemented slice id/scope and changed owners | Implemented #6 plus first implementations for #7, #8, #9 across simulation state/actions and HUD/CSS. |
| 6. browser/game playtest | complete | Route, interaction, result, console/network caveat, and tool/fallback used | Local `http://127.0.0.1:5174/`; Playwright via node_repl fallback; screenshot `/tmp/library-magic-snake-skills-auto.png`; console only existing favicon 404. |
| 7. review | complete | Review target, findings, fixes/rejections | Reviewed against PRD #5 and slices #6-#9 plus source audit; no blocking findings. |
| 8. close with evidence | complete | Final response evidence checklist prepared | PRD/issues/checks/browser/review ready for final response. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope boundary, timing constraint, stop condition, deliverable, final handoff section, verification surface, and success criterion is copied into this plan as checkable checkpoints before implementation.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless explicitly marked hard stop; when no better metric exists, initial and final confidence scores are recorded.
- [x] Auto Step Ledger is updated before moving past each step.
- [x] PRD issue is created or explicitly marked `N/A: <reason>`.
- [x] Vertical slice issues are created or explicitly marked `N/A: <reason>`.
- [x] First useful slice is selected and implemented.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice is recorded with reason.
- [x] Browser/game proof uses the repo-approved browser tool first or records the unavailable tool and honest fallback.
- [x] Review runs after implementation and verification, before closeout.
- [x] Final handoff evidence list is assembled before closing the goal.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | Auto Step Ledger complete. |
| PRD published | yes | Create PRD issue | https://github.com/bbeyens/library-magic/issues/5 |
| Slice issues published | yes | Create vertical slice issues | https://github.com/bbeyens/library-magic/issues/6, https://github.com/bbeyens/library-magic/issues/7, https://github.com/bbeyens/library-magic/issues/8, https://github.com/bbeyens/library-magic/issues/9 |
| Implemented slice | yes | Name the slice and changed owners | #6 implemented; also #7-#9 first implementations. Changed owners: simulation state/actions and HUD/CSS. |
| Typecheck/build/test proof | yes | Run relevant owner checks | Focused `npx tsx` assertions for speed/combo/base, eat/reset, bonus/life/wrap/automation; `npm run typecheck`; `npm run build`; `git diff --check`. |
| Browser/game proof | yes | Exercise affected browser/game surface | Playwright fallback through node_repl: opened Livre du Serpent, bought speed/base/bonus fruit, verified stats and bonus fruit; screenshot `/tmp/library-magic-snake-skills-auto.png`. |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | Source/spec review against #5-#9; no blocking findings. |
| Final handoff completeness | yes | Confirm final response will list PRD issue, slice issues, implemented issue/slice, verification, browser proof, review result, and `score confiance` | Final response prepared. |
| Timed checkpoint | no | N/A | N/A: user did not request timed work. |
| Goal plan complete | yes | Run checker helper or record helper-unavailable source audit | `.agents/skills/autogoal/scripts/check-complete.mjs` missing; plan audited manually and unresolved rows closed. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Source/docs read; no blocking question required. | autogoal |
| Autogoal setup | complete | Goal active for this plan. | PRD |
| PRD | complete | GitHub issue #5. | issues |
| Issues | complete | GitHub issues #6-#9. | implementation |
| Implementation | complete | #6 implemented; #7-#9 first implementations included. | browser/game proof |
| Browser/game proof | complete | Screenshot `/tmp/library-magic-snake-skills-auto.png`; DOM assertions passed. | review |
| Review | complete | No blocking findings. | closeout |
| Closeout | complete | Evidence assembled. | final response |

Findings:
- Existing Snake speed is driven by book level, not dedicated Snake skills.
- Existing snake food randomization exists from prior work and should be preserved.
- Existing UI has Mana skills, but no Livre du Serpent skills yet.
- `browser-use` direct tool was not exposed; used Playwright through node_repl as the honest fallback.

Decisions and tradeoffs:
- Implement first useful vertical slice as simulation-owned Snake skill state/rules plus readable UI controls.
- Interpret automation as an assist that can be upgraded later; if ambiguous, keep it bounded and visible rather than blocking.
- Automation is bounded by `comboSteps <= floor(baseMultiplier * 10)` and chooses only legal non-opposite directions toward the active target.

Review fixes:
- None required from the source/spec review.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| `.agents/skills/autogoal` helper missing | 1 | Materialize plan directly from `docs/plans/templates/auto.md` | Fallback recorded. |

Timeline:
- 2026-06-22: plan created.
- 2026-06-22: goal created; PRD issue #5 and slice issues #6-#9 published.
- 2026-06-22: implemented Snake skills, ran focused tests, typecheck/build, browser proof, issue comments, and review.

Verification evidence:
- PRD: https://github.com/bbeyens/library-magic/issues/5
- Slices: #6, #7, #8, #9.
- Issue evidence comments: #6 comment 4773394994, #7 comment 4773394990, #8 comment 4773394987, #9 comment 4773394985.
- Commands: focused `npx tsx` assertions for speed/combo/base, eat/reset, bonus/life/wrap/automation; `npm run typecheck`; `npm run build`; `git diff --check`.
- Browser proof: `/tmp/library-magic-snake-skills-auto.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Autogoal setup |
| Where am I going? | PRD, issues, implementation, browser/game proof, review, closeout |
| What is the goal? | Implement verified first slice of Livre du Serpent skill progression. |
| What have I learned? | Existing Snake has core movement/food but no Snake skill system. |
| What have I done? | Read skills/docs/code, created this plan and goal, published PRD/issues, implemented and verified Snake skills. |

Open risks:
- Automation wording may need future product refinement, but a bounded first implementation is in place.
- Changes are not committed because the workspace already had unrelated dirty changes in the same files.
