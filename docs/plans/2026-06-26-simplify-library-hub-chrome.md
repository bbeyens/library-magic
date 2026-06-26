# simplify library hub chrome

Objective:
Simplify library hub chrome; done when left menu, bottom resources, selection frames, and bottom hint panel are removed, while hover feedback remains visible.

Goal plan:
docs/plans/2026-06-26-simplify-library-hub-chrome.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: N/A
- title: Remove noisy hub chrome and replace selection frame with hover-only effect
- acceptance criteria: no left scrolling menu, no bottom resource management bar, no selection rectangle around books, no bottom info box; books still clickable; hover has a visible visual effect.

First checkpoint:
- Scope: `LibraryScene`, `hud.ts`, and related CSS only.
- Non-goals: new image generation, progression/economy rewrite, mini-game panel redesign, commits/pushes.
- Deliverables: simplified hub UI, hover-only visual feedback, verification screenshots.
- Verification surface: source audit, `npm run typecheck`, `npm run build`, local Chrome smoke screenshots.
- Success criteria: `.book-menu-*` and `.resource-*` elements are gone; selection frame code is gone; hover proof shows visible spark/glow.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- `src/ui/hud.ts` no longer renders the left menu/drawer or resource bar.
- `src/style.css` has no `book-menu` / `resource-panel` / `resource-row` rules.
- `src/phaser/scenes/LibraryScene.ts` has no selection rectangle or bottom hint panel; hover uses a visible magic spark/glow.
- `npm run typecheck` and `npm run build` pass.
- Screenshot proof exists for base and hover states.

Verification surface:
- `npm run typecheck`
- `npm run build`
- `rg -n "book-menu|resource-panel|resource-row" src/style.css src/ui/hud.ts`
- `rg -n "selection|hintPanel|hintTitle|hintBody" src/phaser/scenes/LibraryScene.ts`
- local Chrome smoke screenshots under `docs/plans/`

Constraints:
- Preserve book click/unlock behavior.
- Do not alter generated art or mini-game gameplay.
- Do not claim browser-use proof because browser-use is not exposed in this session.

Boundaries:
- Source of truth: `src/phaser/scenes/LibraryScene.ts`, `src/ui/hud.ts`, `src/style.css`.
- Allowed edit scope: hub chrome and hover feedback only.
- Browser surface: `http://127.0.0.1:5173/` or active Vite fallback `5174`.
- Tracker sync: N/A.
- Non-goals: release, deploy, PR, game economy changes.

Current verdict:
- verdict: implemented
- confidence: 91/100
- next owner: user review
- reason: requested chrome removed, hover visible, checks pass; only browser-use remains unavailable.

Pre-solution issue challenge:
- reporter claim: left scrolling menu, bottom resources, selection frame, and bottom chrome are visually bad.
- suggested diagnosis or fix: remove those UI layers and use hover-only feedback.
- repro ladder:
  - tests / source-level repro: source contained rendered menu/drawer/resource panel plus Phaser selection rectangle and hint panel.
  - repo-owned automated browser or integration proof: N/A.
  - Browser plugin: blocked; browser-use not exposed in this session.
  - screenshot / visual proof: local Chrome screenshots recorded.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: remove chrome at HUD/LibraryScene ownership boundaries.
- harsh honest feedback: the generated image is strong enough now; extra UI boxes were just making it look cheaper.
- hard-stop decision: proceed.

Blocked condition:
- Stop only if typecheck/build fails without autonomous fix, or if browser-use proof is required as a hard gate.

Completion rule:
- Do not call `update_goal(status: complete)` until verification evidence is recorded and `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-simplify-library-hub-chrome.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint and acceptance criteria above |
| Timed checkpoint parsed | N/A | No duration requested |
| Active goal checked or created | yes | `get_goal` returned none; goal created |
| Source of truth read before edits | yes | Read `LibraryScene.ts`, `hud.ts`, `style.css` |
| Acceptance criteria captured | yes | Task source above |
| Pre-solution issue challenge required | yes | Recorded above |
| Reproduction verdict before implementation | yes | Source confirmed chrome/frame existed |
| Repro escalation ladder selected | yes | Source audit plus visual smoke |
| Suggested fix reviewed against durable boundary | yes | HUD/Phaser owner boundary selected |
| TDD decision before behavior change or bug fix | N/A | Pure visual polish; no gameplay rule change |
| Browser proof decision for browser surface | yes | browser-use blocked; local Chrome smoke used as caveated proof |
| Browser pack selected | yes | Browser pack applied |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/` |
| Browser tool decision recorded | yes | browser-use unavailable |

Work Checklist:
- [x] First checkpoint complete.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded; N/A.
- [x] Task source and acceptance criteria are captured.
- [x] Reporter claims challenged and recorded.
- [x] Repro escalation ladder followed.
- [x] Hard-stop rule followed.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary.
- [x] Review/autoreview target selected.
- [x] Verification evidence is recorded.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded.
- [x] Browser pack: browser proof uses repo-approved tool or records blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run named proof | typecheck/build/source audit/screenshots passed |
| Pre-solution issue challenge verdict | yes | Record verdict | valid |
| Repro escalation ladder | yes | Record outcomes | source audit plus local Chrome screenshots |
| Bug reproduced before fix | N/A | Visual polish request | N/A |
| Targeted behavior verification | yes | Verify visual DOM/chrome absence | local Chrome: menuElements 0, resourceElements 0 |
| TypeScript or typed config changed | yes | Run typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run build | `npm run build` passed |
| Browser surface changed | yes | Capture browser proof | local Chrome screenshots recorded |
| Final lint/format | N/A | No lint script in package | N/A |
| Autoreview | yes | Review output against request | Done; reinforced hover after first proof was too subtle |
| Timed checkpoint | N/A | No duration requested | N/A |
| Goal plan complete | yes | Run checker | `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-simplify-library-hub-chrome.md` passed |
| Browser interaction proof | yes | Exercise hover | hover spark screenshot recorded |
| Browser console/network check | yes | Record console/network state | status 200, no failed responses; recurring unattributed 404 console message caveat |
| Browser final proof artifact | yes | Record screenshots | base and hover screenshots recorded |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Source read | implementation |
| Implementation | complete | HUD/CSS/LibraryScene updated | verification |
| Verification | complete | typecheck/build/screenshots | closeout |
| Closeout | complete | plan updated | final response |

Findings:
- The left drawer and resource bar were entirely removable from HUD rendering without touching mini-game panels.
- The selection frame and hint panel were separate Phaser chrome and could be removed cleanly.
- Because the books are baked into the generated image, the hover effect must be an overlay/spark, not a transform of the book art itself.

Decisions and tradeoffs:
- Removed the bottom hint panel too, because the user asked for just hover visual feedback and fewer UI boxes.
- Kept small cost labels and lock marks on books so purchase progression remains understandable.
- Used deterministic pointer hover bounds instead of relying only on Phaser container pointerover.

Timeline:
- 2026-06-26T15:37:55.473Z: plan created.
- 2026-06-26: removed HUD menu/resource rendering and CSS.
- 2026-06-26: removed selection rectangle and bottom hint panel.
- 2026-06-26: added hover spark/glow and deterministic hover bounds after first hover proof was too subtle.

Verification evidence:
- command: `npm run typecheck` in `/Users/joellebeyens/Documents/Libary-Magic` passed.
- command: `npm run build` in `/Users/joellebeyens/Documents/Libary-Magic` passed with existing Vite chunk-size warning.
- source-audit: `rg -n "book-menu|resource-panel|resource-row" src/style.css src/ui/hud.ts` returned no matches.
- source-audit: `rg -n "selection|hintPanel|hintTitle|hintBody" src/phaser/scenes/LibraryScene.ts` returned no relevant matches.
- browser: local Chrome route returned 200; `.book-menu-toggle`, `.book-menu-drawer`, `.resource-panel`, `.resource-row` count was 0.
- artifact: `/Users/joellebeyens/Documents/Libary-Magic/docs/plans/2026-06-26-simplify-library-hub-chrome-proof-final.png`.
- artifact: `/Users/joellebeyens/Documents/Libary-Magic/docs/plans/2026-06-26-simplify-library-hub-chrome-hover-proof-final-spark.png`.
- caveat: browser-use was unavailable; console still reports an unattributed 404 message but no failed responses were captured.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Remove noisy hub chrome and keep hover-only visual feedback |
| What have I learned? | Hover needed deterministic bounds and visible overlay because the book art is baked into one image |
| What have I done? | Removed menu/resource/frame/hint UI, added hover spark/glow, verified |

Open risks:
- Browser-use proof remains unavailable in this session.
- Existing chunk-size warning remains unrelated to this visual request.
