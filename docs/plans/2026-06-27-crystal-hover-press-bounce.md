# crystal hover press bounce

Objective:
Ajouter le rebond hover/press du cristal; done when CSS has 1.15 hover waves, held shrink waves, build passes, and browser proof passes.

Goal plan:
docs/plans/2026-06-27-crystal-hover-press-bounce.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: "je veux une reactivite du crystal lorsqu'on hover..."
- acceptance criteria: when mouse hovers the mana crystal, the visible crystal grows to 115% with three shrinking bounce waves; when mouse is held down on the crystal, it stays smaller with an inverse shrink/grow/shrink wave; existing idle spritesheet and click effects remain.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- `.mana-orb:hover .mana-sprite` keeps the idle spritesheet animation and adds a 3-wave hover transform animation ending at `scale(1.15)`.
- `.mana-orb:active .mana-sprite` keeps the idle spritesheet animation and adds a held press transform animation ending smaller than normal.
- `npm run build` passes.
- Browser proof verifies computed hover/active animation names and transform scale behavior on the real mana panel.

Verification surface:
- Source audit of `src/style.css`.
- `npm run build`.
- Browser proof on local Vite app: open mana panel, hover and hold the crystal, inspect computed styles and capture screenshot.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: current mana crystal CSS in `src/style.css`.
- Allowed edit scope: `src/style.css` and this plan.
- Browser surface: local Vite app mana panel.
- Tracker sync: N/A.
- Non-goals: changing gameplay, click gain, particle spawn rates, sprite asset files, or other mini-games.

Current verdict:
- verdict: valid
- confidence: 92/100
- next owner: task
- reason: the crystal hover/press behavior is pure CSS on the existing `.mana-sprite`.

Pre-solution issue challenge:
- reporter claim: add reactive hover and held-click bounce animations to the mana crystal.
- suggested diagnosis or fix: add second CSS transform animations while preserving the existing spritesheet animation.
- repro ladder:
  - tests / source-level repro: source audit and build.
  - repo-owned automated browser or integration proof: local browser proof.
  - Browser plugin: project asks for browser-use first, but no browser-use tool is exposed; use Node REPL + local Chrome fallback.
  - screenshot / visual proof: screenshot of hovered/held mana panel.
- reproduction verdict: N/A: feature/effect request.
- validity verdict: valid.
- best long-term fix boundary: CSS owner of mana crystal interaction states.
- harsh honest feedback: adding JS for this would be needless; CSS can do the whole thing cleanly.
- hard-stop decision: proceed with CSS-only implementation.

Blocked condition:
- Stop only if the local app cannot render the mana panel for browser proof after a passing build.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-crystal-hover-press-bounce.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Hover grow 15%, three decreasing waves; held press shrink with inverse waves. |
| Timed checkpoint parsed | N/A: no duration requested | No duration in prompt. |
| Active goal checked or created | yes | `get_goal` returned none; goal created. |
| Source of truth read before edits | yes | Read current `.mana-orb` and `.mana-sprite` CSS plus autogoal rules. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | yes | Feature request; boundary recorded above. |
| Reproduction verdict before implementation | N/A: feature/effect request | No bug reproduction needed. |
| Repro escalation ladder selected | yes | Source audit, build, browser proof. |
| Suggested fix reviewed against durable boundary | yes | CSS-only interaction state. |
| TDD decision before behavior change or bug fix | N/A: visual CSS effect | No game logic change. |
| Browser proof decision for browser surface | yes | Browser proof required because hover/active visual surface changes. |
| Browser pack selected | yes | Browser pack applied. |
| Browser route / app surface identified | yes | Local Vite app mana panel. |
| Browser tool decision recorded | yes | Use Node REPL + local Chrome fallback because browser-use is not exposed. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path.
- [x] Nearby implementation patterns are read before edits.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Hover keeps `crystal-sprite-idle` and adds `crystal-hover-bounce`; active keeps `crystal-sprite-idle` and adds `crystal-press-bounce`; build/browser proof passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above before implementation. |
| Repro escalation ladder | N/A: feature/effect request | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit, build, browser proof, and screenshot were used. |
| Bug reproduced before fix | N/A: not a bug | Record failing test/repro or N/A with reason | Feature/effect request. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Browser proof: hover computed `scale: 1.15`, active computed `scale: 0.88`, animation names include idle plus the relevant bounce. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: CSS-only change. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | yes | Capture browser proof | Screenshot `/tmp/library-magic-crystal-press-bounce.png`. |
| Final lint/format | N/A: no separate lint command | Run relevant lint/format command or record N/A | `package.json` has build/test/typecheck; build passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | CSS preserves spritesheet animation while adding transform-only hover/press waves; no gameplay files changed. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-crystal-hover-press-bounce.md` | First check found missing closeout evidence; plan updated and check rerun. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened mana panel, moved mouse over `.mana-orb`, held mouse down, inspected `.mana-sprite` computed styles. |
| Browser console/network check | yes | Record console/network state or N/A | No failed requests; console only showed Vite connection logs and Phaser banner. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-crystal-press-bounce.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan; read current CSS owner | implementation |
| Implementation | complete | added hover and press transform animations to `src/style.css` | verification |
| Verification | complete | source audit, build, browser hover/press proof | closeout |
| Closeout | complete | first goal-plan check reported missing closeout evidence; plan updated for final rerun | final response |

Findings:
- `.mana-sprite` already uses `animation: crystal-sprite-idle ...`, so hover/press must add a second animation instead of replacing animation wholesale.
- Existing click charge uses `.mana-orb.is-click-charged .mana-sprite { transform: scale(var(--crystal-click-scale)); }`; hover/active selectors should appear later and win for direct pointer feedback.
- Browser proof confirms multiple animations are active simultaneously: idle plus hover, then idle plus press.

Decisions and tradeoffs:
- CSS-only implementation: use multiple animations on `.mana-sprite`, one for spritesheet frames and one for transform bounce.
- Press target scale is `0.88`: visibly held/shrunken without making the crystal feel crushed.
- Hover target scale is exactly `1.15` after the 3-wave bounce.

Timeline:
- 2026-06-27T22:11:05.271Z: plan created.
- 2026-06-28: read current mana crystal CSS and captured hover/press requirements.
- 2026-06-28: implemented hover and active bounce keyframes.
- 2026-06-28: verified source audit, build, and browser hover/press behavior.

Verification evidence:
- `rg -n "crystal-hover-bounce|crystal-press-bounce|mana-orb:hover|mana-orb:active \\.mana-sprite|scale\\(1\\.15\\)|scale\\(0\\.88\\)" src/style.css` found the new selectors/keyframes.
- `npm run build` passed.
- Browser proof on `http://127.0.0.1:5173/`: hover computed `animationName: "crystal-sprite-idle, crystal-hover-bounce"`, `transform: matrix(1.15, 0, 0, 1.15, 0, 0)`.
- Browser proof while mouse held down: active computed `animationName: "crystal-sprite-idle, crystal-press-bounce"`, `transform: matrix(0.88, 0, 0, 0.88, 0, 0)`.
- Screenshot proof: `/tmp/library-magic-crystal-press-bounce.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run goal-plan check, then final response |
| What is the goal? | Add hover and held-press bounce responsiveness to the mana crystal. |
| What have I learned? | Multiple CSS animations preserve the sprite frame loop while adding transform bounce. |
| What have I done? | Implemented and verified hover grow and held-press shrink waves. |

Open risks:
- Very rapid click effects may still add class-based shake on the outer orb, but direct pointer state now wins on the crystal sprite transform.
