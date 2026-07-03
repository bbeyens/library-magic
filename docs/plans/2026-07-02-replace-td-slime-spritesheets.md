# replace td slime spritesheets

Objective:
Replace the TD green slime with the provided blue slime idle, walk, attack, and death spritesheets, preserve stable CSS animation, and show review sheets.

Goal plan:
docs/plans/2026-07-02-replace-td-slime-spritesheets.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: local chat request, 2026-07-02
- title: Replace TD green slime with the provided blue slime sheets.
- acceptance criteria:
  - Copy the four provided sheets into the runtime asset tree.
  - Use idle, walk, attack, and death sheets for the default TD slime.
  - Keep frame math stable with spritesheet background-position animation.
  - Preserve the existing TD gameplay and unrelated monsters.
  - Show review sheets/previews in the final handoff.
  - Verify with tests, build, and browser proof.

First checkpoint:
- Explicit prompt requirements captured:
  - Use animated-spritesheets workflow.
  - Replace the green TD slime.
  - Use these exact source files:
    - `/Users/zbeyens/Downloads/Slime_Enemy_Pixel_Monsters_Vol_1/Slime/spritesheets/blue/idle.png`
    - `/Users/zbeyens/Downloads/Slime_Enemy_Pixel_Monsters_Vol_1/Slime/spritesheets/blue/walk.png`
    - `/Users/zbeyens/Downloads/Slime_Enemy_Pixel_Monsters_Vol_1/Slime/spritesheets/blue/attack.png`
    - `/Users/zbeyens/Downloads/Slime_Enemy_Pixel_Monsters_Vol_1/Slime/spritesheets/blue/death.png`
  - Deliverable: game-ready swap plus visible preview sheets.
  - Verification surface: static style test, full test suite, build, browser proof on the TD book.
  - Non-goals: no TD balance rewrite, no change to bat, skeleton mage, or goblin king.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 86/100
- improvement loop: inspect sheet dimensions, wire CSS, verify in browser, adjust runtime size from 42px to 80px for layout L.
- final score / loop closure: 95/100

Completion threshold:
- The default TD slime uses the provided blue `idle.png`, `walk.png`, `attack.png`, and `death.png` sheets in-game.
- CSS frame counts match the source sheets: idle 8, walk 6, attack 12, death 10.
- Old green/generated slime walk reference is absent from the default slime CSS path.
- Runtime browser proof shows the TD panel with a blue slime using `/assets/td/enemies/blue-slime/walk.png`.
- Tests and build pass.

Verification surface:
- `npx tsx tests/hudStatic.test.ts`
- `npm test`
- `npm run build`
- `git diff --check -- src/style.css tests/hudStatic.test.ts public/assets/td/enemies/blue-slime docs/plans/2026-07-02-replace-td-slime-spritesheets.md`
- Browser proof at `http://127.0.0.1:5173/`: unlock all books, open TD book, inspect default slime computed styles.

Constraints:
- Preserve behavior outside scope.
- Prefer spritesheet CSS background-position over per-frame DOM churn.
- Do not create PRs, commits, pushes, or external comments unless requested.

Boundaries:
- Source of truth: provided blue slime source sheets plus existing TD CSS conventions.
- Allowed edit scope:
  - `public/assets/td/enemies/blue-slime/**`
  - `src/style.css`
  - `tests/hudStatic.test.ts`
  - this plan file
- Browser surface: TD book / Bastion Arcanique panel.
- Tracker sync: N/A.
- Non-goals: no economy change, no monster stat change, no changes to non-slime TD enemies.

Current verdict:
- verdict: complete
- confidence: 95/100
- next owner: user
- reason: assets are copied, CSS is wired, tests/build pass, and browser proof confirms runtime slime sheet, size, and animation.

Pre-solution issue challenge:
- reporter claim: the TD green slime should be replaced with the provided blue slime sheets.
- suggested diagnosis or fix: asset replacement and CSS animation wiring.
- repro ladder:
  - tests / source-level repro: static style test checks blue slime references and old generated walk path absence.
  - repo-owned automated browser or integration proof: browser proof inspects computed styles on the TD slime.
  - Browser plugin: unavailable in this session; tool search exposed Node/Playwright control, so that was used for proof.
  - screenshot / visual proof: browser screenshot captured during proof; contact sheet and GIF generated.
- reproduction verdict: N/A, feature request.
- validity verdict: valid.
- best long-term fix boundary: default slime CSS and runtime asset folder.
- harsh honest feedback: using the old 42px size made the new sheet look too tiny; the 80x80 source needed explicit size variables.
- hard-stop decision: proceed.

Blocked condition:
- None.

Completion rule:
- `update_goal(status: complete)` is allowed only after all completion gates below are done and
  `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-02-replace-td-slime-spritesheets.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint lists exact source sheets and desired swap |
| Timed checkpoint parsed | no | no timed request |
| Active goal checked or created | yes | goal created for the slime replacement |
| Source of truth read before edits | yes | source sheet dimensions inspected: idle 640x80, walk 480x80, attack 960x80, death 800x80 |
| Acceptance criteria captured | yes | Task source acceptance criteria |
| Pre-solution issue challenge required | no | feature request, recorded as N/A |
| Reproduction verdict before implementation | no | feature request |
| Repro escalation ladder selected | yes | source test and browser proof |
| Suggested fix reviewed against durable boundary | yes | CSS sprite wiring at default slime boundary |
| TDD decision before behavior change or bug fix | yes | static CSS regression test updated; full gameplay tests run |
| Browser proof decision for browser surface | yes | browser proof required |
| Browser pack selected | yes | browser pack |
| Browser route / app surface identified | yes | TD book at local dev server |
| Browser tool decision recorded | yes | browser-use unavailable; Node/Playwright fallback used |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope boundary, timing constraint, stop condition, deliverable, final handoff section, verification surface, and success criterion is copied into this plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless explicitly marked hard stop; when no better metric exists, initial and final confidence scores are recorded.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or suggested fixes, reporter claims are challenged before implementation with a recorded verdict: `valid`, `not reproduced`, `invalid`, `wont-fix`, `partially valid`, or `platform limitation`. N/A, feature request.
- [x] Repro escalation ladder followed for bug/behavior claims. N/A, feature request; browser proof still completed.
- [x] Hard-stop rule followed for bug/behavior claims. N/A, feature request.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice is recorded with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial implementation work, or marked N/A with reason.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run named proof | `npx tsx tests/hudStatic.test.ts`, `npm test`, `npm run build`, browser proof all passed |
| Pre-solution issue challenge verdict | no | Record N/A | feature request |
| Repro escalation ladder | no | Record N/A | feature request |
| Bug reproduced before fix | no | Record N/A | feature request |
| Targeted behavior verification | yes | Run focused test/proof | `hudStatic ok`; browser computed style confirms blue slime sheet |
| TypeScript or typed config changed | no | N/A | CSS/assets/test only |
| Build-sensitive behavior changed | yes | Run build | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | TD panel opened; slime uses blue walk sheet, 600% background, 80px size |
| Final lint/format | yes | Run diff whitespace check | `git diff --check` passed |
| Autoreview | yes | Compare diff to objective | complete: default slime only; other TD enemies preserved |
| Timed checkpoint | no | N/A | no timed request |
| Goal plan complete | yes | Run global check-complete script | pending final script run |
| Browser interaction proof | yes | Exercise target route/interaction | unlock all books, click TD book, inspect `.defense-enemy` |
| Browser console/network check | yes | Record console/network state | no console errors, no request failures |
| Browser final proof artifact | yes | Record screenshot/route proof | screenshot captured in browser proof output |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | source sheets inspected and copied | implementation |
| Implementation | complete | CSS and static test updated | verification |
| Verification | complete | tests, build, browser proof passed | closeout |
| Closeout | complete | plan filled and check-complete ready | final response |

Findings:
- Provided sheets are 80px high with frame counts: idle 8, walk 6, attack 12, death 10.
- The visible slime art is small inside each 80x80 frame, so the previous 42px large-layout slime size made it too small.
- Runtime layout L now uses an 80px slime box; S/M use 48/64px.

Decisions and tradeoffs:
- Kept the existing CSS spritesheet approach to avoid DOM churn and animation resets.
- Added `is-idle`, `is-attacking`, and `is-dying` blue slime sheet states while preserving special enemy classes.
- Used Node/Playwright browser proof because `browser-use` was not exposed in this session.

Timeline:
- 2026-07-02T10:51:06.866Z: plan created.
- Copied source sheets to `public/assets/td/enemies/blue-slime/`.
- Generated `blue-slime-contact.png` and `blue-slime-walk-preview.gif`.
- Wired `src/style.css` to the blue idle/walk/attack/death sheets.
- Updated `tests/hudStatic.test.ts` to guard the default slime asset references.
- Adjusted slime size variables to fit the new 80x80 sheets.
- Verified with tests, build, and browser proof.

Verification evidence:
- `npx tsx tests/hudStatic.test.ts`: passed, `hudStatic ok`.
- `npm test`: passed all listed tests.
- `npm run build`: passed.
- `git diff --check -- src/style.css tests/hudStatic.test.ts public/assets/td/enemies/blue-slime docs/plans/2026-07-02-replace-td-slime-spritesheets.md`: passed.
- Browser proof:
  - URL: `http://127.0.0.1:5173/`
  - actions: click unlock all books, click TD book.
  - result:
    - `panelFound: true`
    - `slimeFound: true`
    - `backgroundImage: http://127.0.0.1:5173/assets/td/enemies/blue-slime/walk.png`
    - `backgroundSize: 600% 100%`
    - `animationName: defense-enemy-walk`
    - `width: 80px`
    - `height: 80px`
    - `consoleErrors: []`
    - `requestFailures: []`

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run autogoal check and final response |
| What is the goal? | Replace default TD slime with provided blue slime sheets |
| What have I learned? | 80x80 source sheets need explicit runtime size |
| What have I done? | Copied assets, generated previews, wired CSS, updated test, verified |

Open risks:
- The current task only replaces the default TD slime. Other enemies are intentionally untouched.
