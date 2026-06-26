# blackjack-live-dealer-layout

Objective:
Rework active blackjack toward a live-casino table: generated croupiere visible, reserve/mise above cards without overlap, dealer/player cards separated, actions visible at bottom.

Goal plan:
docs/plans/2026-06-26-blackjack-live-dealer-layout.md

Task source:
- type: chat request
- id / link: N/A
- title: Live dealer blackjack layout
- acceptance criteria: Think like a live blackjack table, add/generated dealer, stop the overlapping/awkward active layout, keep reserve and active bet above the cards, keep actions visible.

First checkpoint:
- Requirements: use a live-casino style structure inspired by Unibet without copying branding; generate a croupier; fix active in-game layout intelligently.
- Scope: active blackjack UI, dealer asset, layout CSS, markup hook.
- Non-goals: no payout/gameplay math, no branded Unibet asset, no commit/push.
- Deliverables: generated dealer asset in repo, dealer stage in active table, explicit active grid rows, verification notes.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Croupiere asset exists under `public/assets/blackjack/dealer/`.
- Active blackjack markup includes a dealer stage.
- Active layout explicitly places reserve/mise above the card rows, dealer cards above player cards, and actions at the bottom.
- Touched files pass targeted bundling/checks, typecheck, and build.

Verification surface:
- Image generation output inspected and copied.
- `file public/assets/blackjack/dealer/cozy-croupiere-cutout.png`
- `rg` audit for dealer stage and active grid-row placement.
- `./node_modules/.bin/esbuild src/ui/hud.ts --bundle --platform=browser --format=esm --outfile=/tmp/library-magic-hud-check.mjs`
- `./node_modules/.bin/esbuild src/style.css --bundle '--external:/assets/*' --outfile=/tmp/library-magic-style-check.css`
- `curl -I http://127.0.0.1:5178/assets/blackjack/dealer/cozy-croupiere-cutout.png`
- `npm run typecheck`
- `npm run build`

Constraints:
- Preserve behavior outside scope.
- Avoid Unibet branding or copying exact proprietary visuals.
- Do not use Playwright/Puppeteer as a substitute for unavailable browser-use.
- Ignore unrelated dirty workspace changes unless they block verification.

Boundaries:
- Source of truth: `src/ui/hud.ts`, `src/style.css`, `public/assets/blackjack/dealer/`.
- Allowed edit scope: blackjack UI markup/CSS, dealer image asset, this plan.
- Browser surface: local Vite blackjack panel at `http://127.0.0.1:5178/`.
- Tracker sync: N/A.
- Non-goals: rules/economy changes, LibraryScene repair.

Current verdict:
- verdict: blocked on approved visual proof
- confidence: 82/100
- next owner: user/tooling
- reason: layout structure and cozy croupiere asset are in place; typecheck/build pass; final browser proof remains unavailable because browser-use is not exposed.

Pre-solution issue challenge:
- reporter claim: active blackjack layout needs to be rethought like a real/live blackjack table and should include a croupier.
- suggested diagnosis or fix: stop clamp-only tweaks; make an explicit active-table structure.
- repro ladder:
  - tests / source-level repro: screenshots showed repeated overlap and bad vertical hierarchy.
  - repo-owned automated browser or integration proof: unavailable.
  - Browser plugin: browser-use not exposed in this session.
  - screenshot / visual proof: user screenshots are the repro; no final screenshot captured.
- reproduction verdict: valid.
- validity verdict: valid.
- best long-term fix boundary: active blackjack layout and dealer asset, not game rules.
- harsh honest feedback: the previous fixes were moving symptoms around instead of defining the table structure.
- hard-stop decision: proceed with structural layout.

Blocked condition:
- Browser-use remains unavailable; stop short of claiming visual completion unless a repo-approved browser proof is available or the user accepts source/build evidence.
- Blocker recurrence: browser-use was unavailable during the implementation closeout, the previous goal continuation, and this continuation.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint lists live-casino layout, generated dealer, active layout fix |
| Timed checkpoint parsed | N/A: no duration | No duration requested |
| Active goal checked or created | yes | `create_goal` created this active goal |
| Source of truth read before edits | yes | Read blackjack panel markup and active CSS grid blocks |
| Acceptance criteria captured | yes | Task source and completion threshold |
| Pre-solution issue challenge required | yes | Valid issue from repeated screenshots |
| Reproduction verdict before implementation | yes | Valid from screenshots/source structure |
| Repro escalation ladder selected | yes | Source/image/targeted checks; browser-use blocker |
| Suggested fix reviewed against durable boundary | yes | Structural active layout, no gameplay changes |
| TDD decision before behavior change or bug fix | N/A: visual/layout asset work | No useful unit behavior to test |
| Browser proof decision for browser surface | yes | Attempt only browser-use; record blocker |
| Browser pack selected | yes | Browser pack applied |
| Browser route / app surface identified | yes | Local Vite blackjack panel |
| Browser tool decision recorded | yes | Browser-use unavailable; no substitute used |

Work Checklist:
- [x] First checkpoint complete: requirements, scope, non-goals, deliverables, verification, and success criteria captured.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded; evidence: N/A, no duration requested.
- [x] Task source and acceptance criteria are captured.
- [x] Reporter claim challenged with verdict; evidence: valid layout issue.
- [x] Repro escalation ladder followed; evidence: screenshots/source plus browser-use blocker.
- [x] Hard-stop rule followed; evidence: valid issue, structural fix applied.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary; evidence: blackjack UI/asset only.
- [x] Review/autoreview target selected; evidence: final diff/source audit against request.
- [x] Verification evidence recorded beside relevant gates.
- [x] Browser pack route, interaction path, and expected visible outcome recorded.
- [x] Browser pack uses repo-approved browser tool or records blocker; evidence: blocker recorded.
- [x] Browser pack console/network errors checked or out of scope; evidence: unavailable browser-use.
- [x] Browser pack proof uses real surface or records blocker; evidence: blocker recorded.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run targeted checks and record browser blocker | Typecheck, build, targeted JS/CSS bundle, and croupiere asset HTTP 200 passed; browser proof unavailable |
| Pre-solution issue challenge verdict | yes | Record validity and boundary | Valid, structural layout boundary |
| Repro escalation ladder | yes | Record screenshots/source/browser outcome | Screenshots/source valid; browser-use unavailable |
| Bug reproduced before fix | yes | Record repro | User screenshots show bad active layout |
| Targeted behavior verification | yes | Source/asset proof | `rg` shows dealer stage and explicit active rows |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run build | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof or blocker | Blocked: browser-use unavailable |
| Final lint/format | yes | Run diff check | `git diff --check` passed |
| Autoreview | yes | Review diff against newest request | Dealer stage plus structured grid rows added |
| Timed checkpoint | N/A: no duration | No action | No duration requested |
| Goal plan complete | yes | Run autogoal checker | Run after this update |
| Browser interaction proof | yes | Exercise route or record blocker | Blocked: browser-use unavailable |
| Browser console/network check | N/A: browser unavailable | Record reason | Browser-use unavailable |
| Browser final proof artifact | N/A: browser unavailable | Record caveat | No final screenshot |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Prompt, screenshots, HUD/CSS read | implementation |
| Implementation | complete | Dealer asset, dealer stage, active grid rows | verification |
| Verification | blocked | Typecheck/build/asset/source checks pass; browser proof missing | browser-use availability or user-provided screenshot |
| Closeout | blocked | Strict completion cannot be claimed without visual proof | final response |

Findings:
- Active layout needed explicit structure, not more vertical nudges.
- Generated croupiere PNG needed a transparent cutout before UI use.
- Typecheck and build are now green.

Decisions and tradeoffs:
- Use a live-casino structure without Unibet branding.
- Use the requested cozy manga/anime croupiere instead of the first semi-realistic male dealer.
- Keep `Reserve` and `Mise en jeu` as HUD above card rows.
- Add dealer as background scene layer behind the upper table, not as another card-row element.

Timeline:
- 2026-06-26T17:40Z: generated dealer concept image.
- 2026-06-26T17:42Z: plan created.
- 2026-06-26T17:43Z: copied and cut out first dealer asset.
- 2026-06-26T17:46Z: added dealer stage markup and active grid layout.
- 2026-06-26T17:54Z: generated and cut out cozy manga/anime croupiere asset.
- 2026-06-26T17:56Z: replaced active dealer-stage reference with cozy croupiere and verified typecheck/build.
- 2026-06-26T18:00Z: repeated audit passed typecheck/build/asset/source checks; browser-use still unavailable.

Verification evidence:
- Cozy croupiere generated and copied to `public/assets/blackjack/dealer/cozy-croupiere.png`; transparent cutout saved as `public/assets/blackjack/dealer/cozy-croupiere-cutout.png`.
- `file public/assets/blackjack/dealer/cozy-croupiere-cutout.png` -> PNG RGBA.
- `rg -n "blackjack-dealer-stage|cozy-croupiere-cutout|grid-row: 5|grid-row: 7|grid-row: 8|grid-row: 9" src/ui/hud.ts src/style.css` found expected references.
- `./node_modules/.bin/esbuild src/ui/hud.ts --bundle --platform=browser --format=esm --outfile=/tmp/library-magic-hud-check.mjs` passed.
- `./node_modules/.bin/esbuild src/style.css --bundle '--external:/assets/*' --outfile=/tmp/library-magic-style-check.css` passed.
- `curl -I http://127.0.0.1:5178/assets/blackjack/dealer/cozy-croupiere-cutout.png` returned `HTTP/1.1 200 OK`, `Content-Type: image/png`.
- `git diff --check -- src/ui/hud.ts src/style.css public/assets/blackjack/dealer/cozy-croupiere-cutout.png docs/plans/2026-06-26-blackjack-live-dealer-layout.md` passed.
- `npm run typecheck` passed.
- `npm run build` passed, with existing Vite chunk-size warning.
- Repeated `tool_search` for browser-use still returned no browser-use tool, only other tools such as node_repl/Figma/Linear. Per repo rule, no Playwright/Puppeteer/raw Chrome substitute was used.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Blocked closeout |
| Where am I going? | Mark goal blocked |
| What is the goal? | Live-casino active blackjack layout with dealer |
| What have I learned? | The active table needed explicit rows and a dealer layer |
| What have I done? | Generated/cut out cozy croupiere, added dealer stage, structured active grid, verified build |

Open risks:
- No final visual proof because browser-use is unavailable in this session.
- Goal should remain active until visual browser proof is available or user accepts source/build evidence.
