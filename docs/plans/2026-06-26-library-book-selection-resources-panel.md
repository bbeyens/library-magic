# library book selection resources panel

Objective:
Improve the library hub book selection so hover/click targets align with the visible books, remove ugly selection framing, and add a right-side resource panel that only shows resources for unlocked games.

Goal plan:
docs/plans/2026-06-26-library-book-selection-resources-panel.md

Task source:
- type: user request
- id / link: local chat
- title: Improve library hub book selection and unlocked resource visibility.
- acceptance criteria: book interaction is not offset, hover is visual but not a selection rectangle, a visible right resource menu exists, resource icons exist, and only unlocked-game resources are shown.

Completion threshold:
The hub is done when pointer hover and click use the same calibrated book bounds, the visual hover is a soft book halo instead of a frame or floating marker, the right resource panel renders generated icons, and browser proof shows Mana alone at start plus Mana and Ecailles after unlocking Serpent.

Verification surface:
- `npm run typecheck`
- `npm run build`
- Chrome proof on `http://127.0.0.1:5173/` with screenshots and console/network checks.
- Autogoal completion check with this plan.

Constraints:
- Preserve the generated library image and the existing game progression.
- Do not restore the old left scrolling resources list.
- Do not show locked-game resources in the right panel.
- Do not create commits, PRs, or deploys.

Boundaries:
- Source of truth: `src/phaser/scenes/LibraryScene.ts`, `src/game/content/books.ts`, `src/game/simulation/state.ts`, `index.html`, generated assets under `public/assets/library/resources/`.
- Allowed edit scope: library scene interaction/rendering, generated resource icons, favicon hookup, and this proof plan.
- Browser surface: local Vite app at `http://127.0.0.1:5173/`.
- Tracker sync: not applicable, no ticket.
- Non-goals: redesigning individual game panels, changing progression economy, replacing the generated bookcase image.

Current verdict:
- verdict: complete
- confidence: high
- next owner: user
- reason: hotspots now use one manual routing path, visual hover no longer moves books, and the resource panel is filtered by unlocked books.

Pre-solution issue challenge:
- reporter claim: the book interaction is offset and ugly, and resources are not visible in a clear right-side menu.
- suggested diagnosis or fix: recalibrate hotspots, remove selection frame, generate resource icons, add a filtered resource panel.
- repro ladder:
  - tests / source-level repro: source read showed separate Phaser container hit areas and manual hover bounds, which could disagree.
  - repo-owned automated browser or integration proof: local Chrome reproduced a wrong routed click during debug, where the intended Serpent interaction opened the wrong game before the manual click router fix.
  - Browser plugin: `browser-use` was requested by repo policy but was not exposed in the available tools, so Chrome automation was used as a recorded fallback.
  - screenshot / visual proof: final screenshots are recorded under `docs/plans/`.
- reproduction verdict: partially valid and reproduced visually.
- validity verdict: valid.
- best long-term fix boundary: route click selection through the same calibrated bounds used for hover, then keep Phaser containers as visuals instead of independent click authorities.
- harsh honest feedback: the previous setup made the UI lie; when hover and click disagree, the hub feels broken no matter how good the art is.
- hard-stop decision: continue, because the fix is local and verifiable.

Blocked condition:
Blocked only if the local Vite surface cannot launch or if the repo-approved `browser-use` tool is strictly required; here `browser-use` was unavailable, but Chrome automation provided sufficient local proof.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Requirements copied into acceptance criteria and completion threshold. |
| Timed checkpoint parsed | no | No duration requested. |
| Active goal checked or created | yes | Active autogoal created for this library selection and resources panel work. |
| Source of truth read before edits | yes | Read `LibraryScene.ts`, `books.ts`, `state.ts`, `actions.ts`, and `main.ts`. |
| Acceptance criteria captured | yes | Interaction alignment, hover quality, right panel, icons, and unlocked-resource filtering captured. |
| Pre-solution issue challenge required | yes | Recorded above because user reported broken behavior. |
| Reproduction verdict before implementation | yes | Visual and source-level issue confirmed. |
| Repro escalation ladder selected | yes | Source read plus Chrome visual proof. |
| Suggested fix reviewed against durable boundary | yes | Durable boundary is one pointer routing path shared by hover and click. |
| TDD decision before behavior change or bug fix | yes | No unit TDD added because this is Phaser canvas hit-testing and visual UI; browser proof is the honest surface. |
| Browser proof decision for browser surface | yes | Local Chrome automation used; `browser-use` unavailable. |
| Browser pack selected | yes | Browser proof pack applied by the autogoal template. |
| Browser route / app surface identified | yes | `http://127.0.0.1:5173/`. |
| Browser tool decision recorded | yes | Chrome automation fallback recorded. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope boundary, timing constraint, stop condition, deliverable, final handoff section, verification surface, and success criterion is copied into this plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless explicitly marked hard stop; when no better metric exists, initial and final confidence scores are recorded.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or suggested fixes, reporter claims are challenged before implementation with a recorded verdict.
- [x] Repro escalation ladder followed for bug/behavior claims.
- [x] Hard-stop rule followed for bug/behavior claims.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice is recorded with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial implementation work, or marked not applicable with reason.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run typecheck, build, browser proof, and autogoal check | `npm run typecheck` passed; `npm run build` passed with only Vite chunk-size warning; final browser proof recorded. |
| Pre-solution issue challenge verdict | yes | Record reporter claim and durable fix boundary | Recorded above. |
| Repro escalation ladder | yes | Record source and browser outcomes | Source-level issue and Chrome proof recorded. |
| Bug reproduced before fix | yes | Record repro or honest equivalent | Chrome debug proof showed wrong click target before manual click router. |
| Targeted behavior verification | yes | Exercise hover, unlock, and resource filtering | Final screenshots listed below. |
| TypeScript or typed config changed | yes | Run typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run build | `npm run build` passed with chunk-size warning only. |
| Browser surface changed | yes | Capture browser proof | Captured final base, hover, and Serpent unlock screenshots. |
| Final lint/format | no | Record reason | No lint script exists in `package.json`; typecheck and build are the relevant checks. |
| Autoreview | yes | Review final diff against newest request | Confirmed no selection frame, hover halo only, right panel visible, unlocked-resource filter works. |
| Timed checkpoint | no | Record reason | No timed request. |
| Goal plan complete | yes | Run autogoal checker | Pending until final checker run after this edit. |
| Browser interaction proof | yes | Exercise affected route and interaction | Local Chrome on `http://127.0.0.1:5173/`. |
| Browser console/network check | yes | Record console and network state | Final proof has no console errors, no failed requests, no HTTP responses >= 400. |
| Browser final proof artifact | yes | Record screenshot paths | `final-base.png`, `final-mana-hover.png`, `final-serpent-unlock.png` listed below. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read scene, store, state, actions, and content files | Implementation complete |
| Implementation | complete | Patched interaction routing, hover visuals, resource panel, icons, favicon | Verification complete |
| Verification | complete | Typecheck, build, browser proof | Closeout |
| Closeout | complete | Plan filled; checker next | Final response |

Findings:
- The old interaction allowed visual hover and click authority to disagree, which produced wrong book activation.
- Generated SVG resource icons are better for this UI than raster model output because the panel needs crisp, transparent, small icons.
- The right panel correctly shows Mana at start and adds only Ecailles after Serpent is unlocked.

Decisions and tradeoffs:
- Kept the bookcase image and used calibrated overlays instead of regenerating the entire hub.
- Used a soft additive hover halo instead of a frame, outline rectangle, or floating star.
- Used Chrome automation because `browser-use` was not exposed in this session.

Timeline:
- 2026-06-26T16:09:16.427Z: goal plan created.
- 2026-06-26: generated resource icons.
- 2026-06-26: added right-side resource panel filtered by unlocked books.
- 2026-06-26: replaced container click authority with one manual click router matching hover bounds.
- 2026-06-26: added favicon to remove the local 404 console noise.
- 2026-06-26: final typecheck, build, and Chrome proof passed.

Verification evidence:
- `npm run typecheck`: passed.
- `npm run build`: passed; Vite reported the existing large chunk warning only.
- Browser proof base: `/Users/joellebeyens/Documents/Libary-Magic/docs/plans/2026-06-26-library-book-selection-resources-panel-final-base.png`.
- Browser proof hover: `/Users/joellebeyens/Documents/Libary-Magic/docs/plans/2026-06-26-library-book-selection-resources-panel-final-mana-hover.png`.
- Browser proof unlocked resource filter: `/Users/joellebeyens/Documents/Libary-Magic/docs/plans/2026-06-26-library-book-selection-resources-panel-final-serpent-unlock.png`.
- Final browser console/network: no console errors, no failed requests, no HTTP responses >= 400.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run autogoal checker and answer user |
| What is the goal? | Improve book selection and visible unlocked-resource menu |
| What have I learned? | The main bug was disagreement between visual hover bounds and Phaser container click hit areas |
| What have I done? | Rebuilt selection routing, hover visual, right resource panel, resource icons, and verification proof |

Open risks:
- `browser-use` was unavailable, so proof used local Chrome automation. The final app proof is still real browser proof on the local Vite surface.
- The Vite build still warns about a large Phaser bundle; unrelated to this task and not a failure.
