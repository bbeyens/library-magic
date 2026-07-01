# wire crystal idle into game

Objective:
Brancher l'idle du cristal dans le jeu; done when CSS uses the idle spritesheet, build passes, and browser proof shows it rendered.

Goal plan:
docs/plans/2026-06-27-wire-crystal-idle-into-game.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request
- id / link: N/A
- title: "ok met le dans le jeu"
- acceptance criteria: replace the in-game mana crystal static render with the generated idle spritesheet animation while preserving the existing crystal identity and click/wand behavior.

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
- `.mana-sprite` uses `public/assets/Crystal/idle-experiment/idle-spritesheet.png` as an 8-frame CSS spritesheet.
- Existing click and wand-hit interactions still animate the crystal without forcing the old static PNG.
- `npm run build` passes.
- Browser proof shows the mana crystal surface renders with the new spritesheet loaded.

Verification surface:
- Source audit of `src/style.css` for the spritesheet URL, background sizing, and keyframes.
- `npm run build`.
- Browser screenshot/DOM proof on the local Vite app.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `public/assets/Crystal/idle-experiment/idle-spritesheet.png` and `idle-animation.json`.
- Allowed edit scope: `src/style.css` and this plan; no sprite regeneration.
- Browser surface: local app mana crystal / mana book panel.
- Tracker sync: N/A.
- Non-goals: changing gameplay math, replacing the crystal with a new design, modifying unrelated mini-game UI, or creating another asset pipeline output.

Current verdict:
- verdict: valid
- confidence: 90/100
- next owner: task
- reason: the generated idle spritesheet is already in `public/assets`, and the active crystal is rendered through CSS background properties.

Pre-solution issue challenge:
- reporter claim: put the idle crystal sprite into the game.
- suggested diagnosis or fix: wire the existing `.mana-sprite` CSS to the generated 8-frame spritesheet.
- repro ladder:
  - tests / source-level repro: source audit plus build.
  - repo-owned automated browser or integration proof: local Vite browser proof.
  - Browser plugin: browser-use requested by project docs, but no browser-use tool is exposed here; use available browser automation fallback if needed.
  - screenshot / visual proof: capture screenshot of the mana crystal surface.
- reproduction verdict: N/A: feature integration request.
- validity verdict: valid.
- best long-term fix boundary: CSS owner of the mana crystal sprite presentation.
- harsh honest feedback: regenerating the art again would be busywork; the right move is wiring the asset we already accepted.
- hard-stop decision: proceed with CSS integration only.

Blocked condition:
- Stop if the dev app cannot render locally after a passing build and there is no available browser proof path.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-wire-crystal-idle-into-game.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User asked to put the preview idle sprite into the game. |
| Timed checkpoint parsed | N/A: no duration requested | No timed checkpoint in prompt. |
| Active goal checked or created | yes | `get_goal` returned none; goal created for this integration. |
| Source of truth read before edits | yes | Read `idle-animation.json`, `src/style.css` mana crystal owner, Spriterrific and autogoal rules. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | yes | Feature request; boundary recorded above. |
| Reproduction verdict before implementation | N/A: feature integration request | Not a bug repro. |
| Repro escalation ladder selected | yes | Source audit, build, browser proof. |
| Suggested fix reviewed against durable boundary | yes | CSS owner is the durable boundary. |
| TDD decision before behavior change or bug fix | N/A: visual asset wiring | CSS visual change; no game logic or state machine. |
| Browser proof decision for browser surface | yes | Browser proof required because the visible game surface changes. |
| Browser pack selected | yes | Browser pack applied by plan helper. |
| Browser route / app surface identified | yes | Local Vite app, mana crystal surface. |
| Browser tool decision recorded | yes | Project asks for browser-use first, but no such tool is exposed; use available fallback automation. |

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
| Named verification threshold | yes | Run the named proof or record blocker | `.mana-sprite` uses `/assets/Crystal/idle-experiment/idle-spritesheet.png`; build passed; browser proof shows loaded asset and animation. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above before CSS edit. |
| Repro escalation ladder | N/A: feature integration request | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit, build, and browser proof used for feature verification. |
| Bug reproduced before fix | N/A: not a bug | Record failing test/repro or N/A with reason | Visual integration request. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Browser proof: `backgroundImage` points to the idle spritesheet, `backgroundPosition` is `28.5714% 0%` after delay, asset returns HTTP 200. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: CSS-only runtime change. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | yes | Capture browser proof | Screenshot `/tmp/library-magic-crystal-idle-wired-fixed.png`; visual inspection shows the crystal rendered in the mana panel. |
| Final lint/format | N/A: CSS-only small edit | Run relevant lint/format command or record N/A | Existing project has no separate CSS formatter/lint command in `package.json`; build passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed `src/style.css` diff; fixed first broken percent animation that rendered only the aura; click proof keeps spritesheet active. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-wire-crystal-idle-into-game.md` | First check found missing closeout evidence; plan updated and check rerun. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Clicked `.mana-orb`; class became `mana-orb is-click-charged is-clicked-a`, sprite background remained the idle spritesheet. |
| Browser console/network check | yes | Record console/network state or N/A | No failed requests; console only showed Vite connection logs and Phaser banner. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-crystal-idle-wired-fixed.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan; read CSS owner and asset metadata | implementation |
| Implementation | complete | wired `.mana-sprite` to `idle-spritesheet.png` and explicit 8-frame keyframes | verification |
| Verification | complete | source audit, build, browser proof, click interaction proof | closeout |
| Closeout | complete | first goal-plan check reported missing closeout evidence; plan updated for final rerun | final response |

Findings:
- `.mana-sprite` currently uses `/assets/Crystal/Crystal.png` with `background-size: contain` and no animation.
- Click and wand-hit selectors redundantly force the same static PNG and disable sprite animation.
- Generated idle sheet metadata says 8 frames at `128x128`, `fps: 8`, one horizontal row.
- First attempted `background-position: -800% 0` with `background-size: 800% 100%`; browser screenshot showed the aura without the crystal because CSS background-position percentages are relative to the container/image delta, not raw frame widths.

Decisions and tradeoffs:
- Use CSS spritesheet animation instead of JS: the existing crystal is already CSS-owned and this avoids gameplay changes.
- Keep click/wand hit transforms; only let them share the idle spritesheet instead of resetting to the static PNG.
- Use explicit 8-frame percentage positions (`0%` through `100%`) instead of negative percentage movement, because that maps correctly to a one-row spritesheet under CSS background sizing.

Timeline:
- 2026-06-27T21:49:16.700Z: plan created.
- 2026-06-27: read Spriterrific/autogoal rules and located the mana crystal CSS owner.
- 2026-06-27: wired `.mana-sprite` to the idle spritesheet.
- 2026-06-27: first browser proof revealed the negative percentage keyframe rendered the crystal out of view.
- 2026-06-27: corrected keyframes to explicit 8-frame positions.
- 2026-06-27: verified build, browser render, and click interaction.

Verification evidence:
- `rg -n "idle-experiment/idle-spritesheet|crystal-sprite-idle|Crystal/Crystal.png|is-clicked-a \\.mana-sprite|is-wand-hit-a \\.mana-sprite" src/style.css` found the new spritesheet/keyframe and no old static override selectors.
- `sips -g pixelWidth -g pixelHeight public/assets/Crystal/idle-experiment/idle-spritesheet.png public/assets/Crystal/idle-experiment/idle-preview.gif` returned `1024x128` and `512x512`.
- `npm run build` passed.
- Browser proof on `http://127.0.0.1:5173/`, after dispatching `selectBook` for `mana`: `.mana-sprite` computed CSS used the idle spritesheet, `background-size: 800% 100%`, `animation-name: crystal-sprite-idle`, asset status `200`, no failed requests.
- Browser proof after 260 ms: `background-position: 28.5714% 0%`, proving frame advancement.
- Screenshot proof: `/tmp/library-magic-crystal-idle-wired-fixed.png`.
- Click proof: clicking `.mana-orb` added `is-clicked-a` while `.mana-sprite` kept the idle spritesheet and `crystal-sprite-idle`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run goal-plan check, then final response |
| What is the goal? | Wire the generated idle spritesheet into the visible mana crystal. |
| What have I learned? | The surface is CSS-owned, the generated idle sheet is 8 horizontal frames, and explicit background-position stops are required for correct CSS frame stepping. |
| What have I done? | Wired the sprite, fixed the first animation bug, and verified build/browser/click behavior. |

Open risks:
- The idle motion is subtle by design; DOM proof confirms frame advancement, and the screenshot confirms visible render.
