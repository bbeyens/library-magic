# rune typing mini game

Objective:
Ship first Rune Typing slice; done when PRD/issues exist, typing gameplay is implemented, checks/browser/review pass.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-06-22-rune-typing-mini-game.md

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
- type: user request with auto workflow
- id / link: current thread
- title: Rune Typing first playable slice
- acceptance criteria:
  - Use `$auto` workflow: grill-with-docs first, then autogoal, PRD, issues,
    implementation, browser/game proof, review, closeout evidence.
  - Build the Arc Typing / Rune Typing mini-game.
  - Gameplay: player types the displayed word.
  - Word list: around 100 English fantasy words.
  - Reward: only Runes when a full word is completed.
  - Mistake behavior: wrong key keeps the current word but lowers combo/reward.
  - Mistake recovery: combo penalty persists until 3 perfect words are typed.
  - UI: inspired by Grimoire de Mana; direct keyboard input, no visible input.
  - First slice: no upgrades.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked `N/A: <reason>`.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested
- initial confidence score: N/A: concrete feature gates exist
- improvement loop: N/A: no timed loop
- final score / loop closure: N/A: no timed loop

Completion threshold:
- PRD issue exists in GitHub Issues.
- Vertical slice issues exist in GitHub Issues.
- First useful slice implements a playable Arc Typing book page with direct
  keyboard typing, around 100 English fantasy words, Rune-only rewards, mistake
  penalty, and 3-perfect-word recovery.
- Typecheck/build and focused behavior proof pass.
- Browser/game proof exercises the real `http://127.0.0.1:5173/` surface or
  records an honest blocker/fallback.
- Review step is run and recorded before closeout.
- Final response lists PRD issue, slice issues, implemented issue/slice,
  verification proof, browser proof, review result, and `score confiance`.

Verification surface:
- `gh issue` commands or issue URLs for PRD/slice publication.
- Implementation verification commands, such as typecheck, build, tests, or
  source audit.
- Focused simulation proof for typing reward/penalty/recovery.
- Browser/game proof for UI/game work, using `@browser-use`/Browser tool first
  when exposed and recording any fallback.
- Review evidence against `main` or the chosen fixed point.
- `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-rune-typing-mini-game.md`.

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
- Allowed edit scope: `CONTEXT.md`, GitHub Issues, `docs/plans/**`, and first
  slice app code under `src/game/**`, `src/ui/**`, and `src/style.css`.
- Browser surface: `http://127.0.0.1:5173/`, Arc Typing book page.
- Tracker sync: GitHub Issues unless project docs say otherwise.
- Non-goals: no Arc Typing upgrades in the first slice; no Mana reward from
  Arc Typing; no visible text input; no generated sprite/art pipeline unless
  existing UI needs minor CSS polish.

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
| grill-with-docs completed before autogoal | yes | User answered six grill decisions before this plan: mistake penalty C, recovery B, English fantasy words, Runes-only reward B, direct keyboard UI A, no upgrades C |
| Prompt requirements captured before work | yes | Task source and acceptance criteria above |
| Timed checkpoint parsed | no | N/A: no duration requested |
| Active goal checked or created | yes | `get_goal` returned no active goal before plan setup |
| Source of truth read before edits | yes | `CONTEXT.md`, `.agents/skills/auto/SKILL.md`, grill/domain skills, issue tracker docs, current book/simulation/HUD code read |
| Tracker target verified | yes | `git remote -v` shows `git@github.com:bbeyens/library-magic.git`; `gh auth status` logged in as `bbeyens` |
| PRD publication decision recorded | yes | Create GitHub PRD issue via `gh issue create --label ready-for-agent` |
| Slice publication decision recorded | yes | Create vertical GitHub issues in dependency order with `ready-for-agent` |
| First useful slice selected | yes | Implement playable Rune Typing loop before upgrades |
| TDD decision before behavior change or bug fix | yes | Use focused simulation proof for typing word completion, mistake penalty, and 3-perfect recovery; no full test framework exists |
| Browser/game proof decision recorded | yes | Use browser-use/browser tool first if exposed; fallback to Computer Use or honest waiver |
| Review target selected before closeout | yes | Review against `main`/merge-base or note dirty-workspace limitation |
| Browser pack selected | yes | Applied pack: browser |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`, Arc Typing book page |
| Browser tool decision recorded | yes | Try tool discovery for browser-use before fallback |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | Six decisions recorded: penalty C, recovery B, English fantasy words, Runes-only, direct keyboard, no upgrades |
| 2. autogoal | complete | Active goal handle and this plan path | Active goal created for this plan; path: `docs/plans/2026-06-22-rune-typing-mini-game.md` |
| 3. to-prd | complete | PRD issue URL or `N/A: <reason>` | #10 `PRD: Arc Typing Rune Typing mini-game` https://github.com/bbeyens/library-magic/issues/10 |
| 4. to-issues | complete | Slice issue URLs or `N/A: <reason>` | #11 playable slice, #12 upgrades, #13 tuning |
| 5. implement | complete | Implemented slice id/scope and changed owners | Implemented #11 in `src/game/content/runeWords.ts`, `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`, `CONTEXT.md` |
| 6. browser/game playtest | complete | Route, interaction, result, console/network caveat, and tool/fallback used | `@browser-use` unavailable; Computer Use blocked Codex in-app browser, fallback Chrome at `127.0.0.1:5173`: debug resources, unlocked Arc Typing, typed `aether`, Runes 1998->1999, next word `altar`; console/network not available through fallback |
| 7. review | complete | Review target, findings, fixes/rejections | Manual focused review of changed Rune Typing owners after checks; no blocking findings; fixed keyboard conflict so only selected book handles typing/snake controls |
| 8. close with evidence | in_progress | Final response evidence checklist prepared | Pending final response after autogoal completion check |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation. Evidence: Task
      source, completion threshold, boundaries, non-goals, verification surface.
- [x] Objective, threshold, verification surface, constraints, boundaries, and
      blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. N/A: no duration requested.
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
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | complete: ledger evidence above |
| PRD published | yes | Create PRD issue or record `N/A: <reason>` | complete: #10 |
| Slice issues published | yes | Create vertical slice issues or record `N/A: <reason>` | complete: #11, #12, #13 |
| Implemented slice | yes | Name the slice and changed owners | complete: #11 playable Rune Typing |
| Typecheck/build/test proof | yes | Run relevant owner checks or record `N/A: <reason>` | complete: focused proof, `npm run typecheck`, `npm run build` |
| Browser/game proof | yes | Exercise affected browser/game surface or record blocker/waiver | complete with fallback: Chrome `127.0.0.1:5173` |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | complete: no blocking findings |
| Final handoff completeness | yes | Confirm final response will list PRD issue, slice issues, implemented issue/slice, verification, browser proof, review result, and `score confiance` | prepared |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise `N/A: <reason>` | N/A: no duration requested |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-rune-typing-mini-game.md` | complete: first check reported missing closeout fields; fields were added before final rerun |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | complete: Chrome fallback, typed `aether`, observed `altar` next |
| Browser console/network check | no | Record console/network state or N/A | N/A: Computer Use fallback has no console/network access |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | complete: Computer Use state output recorded in thread |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | Six user decisions before autogoal | autogoal |
| Autogoal setup | complete | active goal created and plan maintained | PRD |
| PRD | complete | #10 | issues |
| Issues | complete | #11, #12, #13 | implementation |
| Implementation | complete | #11 playable Rune Typing | browser/game proof |
| Browser/game proof | complete | Chrome fallback route proof | review |
| Review | complete | no blocking findings | closeout |
| Closeout | complete | final evidence recorded; check-complete rerun next | final response |

Findings:
- No blocking review findings.
- Caveat: `@browser-use` was unavailable and Computer Use cannot inspect Codex in-app browser or Chrome console/network, so browser proof used Chrome visual/accessibility state only.

Decisions and tradeoffs:
- None yet.

Review fixes:
- None yet.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Timeline:
- 2026-06-22T22:09:55.035Z: plan created.
- PRD published: #10 https://github.com/bbeyens/library-magic/issues/10
- Slice issues published: #11 https://github.com/bbeyens/library-magic/issues/11, #12 https://github.com/bbeyens/library-magic/issues/12, #13 https://github.com/bbeyens/library-magic/issues/13
- Implemented Rune Typing state/action/UI: 100 words, Rune-only rewards, wrong-key penalty, three-perfect-word recovery, no first-slice upgrades.
- Verification passed: word count `100`; focused simulation proof `rune typing proof passed { words: 100, runes: 5, mana: 0, penalty: 0 }`; `npm run typecheck`; `npm run build`.
- Browser proof passed with fallback: Chrome at `127.0.0.1:5173`, debug resources, unlocked Arc Typing, typed `aether`, observed Rune count increase and next word `altar`.
- Review complete: no blocking findings; fixed keyboard conflict so typing and snake controls only target the selected book.

Verification evidence:
- GitHub PRD issue: #10 `PRD: Arc Typing Rune Typing mini-game`.
- GitHub slice issues: #11 playable Rune Typing, #12 upgrades, #13 tuning.
- Word list proof: `node --input-type=module -e "import { runeWords } from './src/game/content/runeWords.ts'; console.log(runeWords.length);"` returned `100`.
- Focused simulation proof: bundled `/tmp/rune-typing-proof.ts` with esbuild and ran Node; output `rune typing proof passed { words: 100, runes: 5, mana: 0, penalty: 0 }`.
- Static checks: `npm run typecheck` passed.
- Build check: `npm run build` passed; Vite emitted only the existing large chunk warning.
- Browser/game proof: `@browser-use` was unavailable; Computer Use could not access Codex in-app browser, so Chrome fallback was used on `127.0.0.1:5173`. Arc Typing opened without title/upgrade buttons, typing `aether` increased Runes by 1 and advanced to `altar`.
- Review proof: focused manual review of Rune Typing state/action/HUD/CSS owners found no blocking issue; keyboard conflict with Snake was fixed.
- Dirty workspace note: unrelated existing changes remain uncommitted and were not reverted or staged.

Reboot status:
- Current as of closeout: implementation and verification are complete; no resume action is needed for #11 unless the user wants polish or the next slice.

Open risks:
- None blocking.
- Console/network inspection was not available through the Computer Use Chrome fallback.
- The workspace has unrelated dirty files, so no commit was created to avoid bundling changes outside this task.

Verification evidence:
- Pending.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Autogoal setup |
| Where am I going? | PRD, issues, implementation, browser/game proof, review, closeout |
| What is the goal? | TODO: Fill from Objective |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Pending.
