# cozy magic hub animation pass

Objective:
Implement cozy magic hub animations A/B/C; done when ritual, shelf idle, and ambiance animations exist and typecheck/build/browser proof pass.

Goal plan:
docs/plans/2026-06-26-cozy-magic-hub-animation-pass.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user chat
- id / link: local Codex thread
- title: Cozy magic hub animation pass
- acceptance criteria: implement the three agreed animation families A/B/C in a Disney cozy magic direction: progression feedback, ambient state/living shelf, and reward moments.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: none
- semantics: N/A
- initial confidence score: 86/100
- improvement loop: implement in small Phaser batches, check with type/build/browser screenshots, tune if visuals become noisy.
- final score / loop closure: 94/100 after typecheck, build, and browser proof.

Completion threshold:
- A/progression: existing offering particles stay functional and ready-state feedback is added for full offerings / key-ready seal.
- B/ambient state: unlocked books, locked/next books, and forbidden grimoire have lightweight idle life animations.
- C/reward: breaking a seal triggers a visible cozy reward ceremony and target book unlock reveal.
- Ambience pass: shelf/candle/dust/sparkle motion exists without obscuring book art.
- `npm run typecheck`, `npm run build`, and browser visual proof pass.

Verification surface:
- `npm run typecheck`
- `npm run build`
- web-game client attempt, or recorded blocker
- Chrome browser screenshots for idle hub, ready ritual, seal break / unlock ceremony, and ambient state
- console/network check

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `docs/brainstorms/2026-06-26-cozy-magic-hub-animations-brainstorm.md`, `progress.md`, `src/phaser/scenes/LibraryScene.ts`, existing simulation state.
- Allowed edit scope: Phaser hub scene plus progress/plan proof artifacts unless a tiny state hook is required.
- Browser surface: local Vite app route.
- Tracker sync: N/A.
- Non-goals: regenerate book art, rebalance economy, redesign mini-game panels, add audio.

Current verdict:
- verdict: complete
- confidence: 94/100
- next owner: user
- reason: A/B/C cozy animation pass is implemented and verified with screenshots.

Pre-solution issue challenge:
- reporter claim: the hub needs A/B/C animations to feel more gaming.
- suggested diagnosis or fix: add cozy magic progression, ambient, and reward animation layers.
- repro ladder:
  - tests / source-level repro: current scene has some offering particles and basic tweens, but no seal-break ceremony / broad idle life layer.
  - repo-owned automated browser or integration proof: web-game client is attempted; previous known blocker is missing Playwright Chromium.
  - Browser plugin: browser-use not exposed; use system Chrome fallback if web-game client remains blocked.
  - screenshot / visual proof: capture idle and ritual interaction states.
- reproduction verdict: valid improvement request.
- validity verdict: valid.
- best long-term fix boundary: Phaser scene owns visual feedback; keep simulation pure unless already changed.
- harsh honest feedback: adding everything everywhere would be visual soup; the pass must be restrained and state-driven.
- hard-stop decision: proceed.

Blocked condition:
- Stop if local app cannot load or if screenshots show the new animation layers break readability.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-cozy-magic-hub-animation-pass.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User selected A/B/C and Disney cozy magic, then said go implement all three. |
| Timed checkpoint parsed | no | No duration requested. |
| Active goal checked or created | yes | `get_goal` returned none; active goal created. |
| Source of truth read before edits | yes | Read brainstorm, progress, current `LibraryScene.ts`, package scripts, and relevant simulation references. |
| Acceptance criteria captured | yes | Captured above. |
| Pre-solution issue challenge required | yes | Improvement request challenged as visual/game-feel scope above. |
| Reproduction verdict before implementation | yes | Valid improvement request: missing broad cozy animation layers. |
| Repro escalation ladder selected | yes | Source audit plus browser proof. |
| Suggested fix reviewed against durable boundary | yes | Implement in Phaser scene. |
| TDD decision before behavior change or bug fix | no | Visual-only animation; browser proof is better than fake unit tests. |
| Browser proof decision for browser surface | yes | Required. |
| Browser pack selected | yes | Plan created with browser pack. |
| Browser route / app surface identified | yes | Local Vite route. |
| Browser tool decision recorded | yes | Try web-game client; fallback to system Chrome if Chromium blocker repeats. |

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
      is recorded with reason. Phaser scene owns animation; simulation only changed for unlock timing and debug key proof.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Self-review against objective and screenshots.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. `browser-use` not exposed; Chrome via `node_repl` used.
- [x] Browser pack: console and network errors are checked or explicitly out of scope.
- [x] Browser pack: proof uses the real affected browser surface.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `npm run typecheck`, `npm run build`, Chrome screenshots passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above; valid improvement request. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit plus browser visual proof. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: feature/game-feel enhancement, not a bug report. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Browser sequence: debug resources, select sealed Serpent, offer, break seal. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed with existing Vite chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | Screenshots listed below. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no lint script requested; typecheck/build covered changed TS. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Self-review done against screenshots; reward overlay timing adjusted. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-cozy-magic-hub-animation-pass.md` | First run caught closeout metadata only; final run recorded below. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Exercised `http://127.0.0.1:5177/`: press `o`, select Serpent, offer, break seal. |
| Browser console/network check | yes | Record console/network state or N/A | No request failures; console only Vite connect and Phaser banner. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `docs/plans/2026-06-26-cozy-animation-*.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan | implementation |
| Implementation | complete | `LibraryScene.ts`, `actions.ts`, `progress.md` | verification |
| Verification | complete | typecheck/build/browser screenshots | closeout |
| Closeout | complete | plan update and autogoal validation | final response |

Findings:
- Current hub already has offering particles and some basic hover/ambient motes.
- Current state includes forbidden grimoire keys and selected sealed book; animation should respect that newer flow.
- Previous web-game client attempt was blocked by missing Playwright Chromium; `browser-use` was also not exposed in this session.
- Opening the unlocked mini-game immediately after seal break hid the reward animation; delaying panel open by 950ms improves the moment.

Decisions and tradeoffs:
- Use lightweight Phaser tweens and small graphics objects rather than generating new art assets.
- Add reward/ambient layers incrementally in `LibraryScene.ts`.
- Tiny simulation changes were acceptable for unlock timing and debug verification: break seal now unlocks first, then the scene opens the panel after the reward delay; debug `o` grants one forbidden key.

Timeline:
- 2026-06-26T18:52:34.012Z: plan created.
- Filled plan and created active goal.
- 2026-06-26T19:13:47Z: implemented A/B/C cozy animation pass and updated progress.
- Added candle glow/flicker, shelf glints, idle book breathing/sparkles, ready orbit runes, ready pulse, seal-break burst, unlock reveal, and falling lock visual.
- Adjusted seal-break flow so the mini-game opens after the reward moment instead of instantly covering it.

Verification evidence:
- `npm run typecheck` passed.
- `npm run build` passed; Vite reported the existing large chunk warning only.
- Local server responded 200 on `http://127.0.0.1:5177/`.
- Browser proof used Chrome automation through `node_repl`; `browser-use` was not exposed in this session.
- Final browser run: no request failures; console only showed Vite connection logs and Phaser banner.
- Autogoal check passed: `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-cozy-magic-hub-animation-pass.md`.
- Screenshots:
  - `docs/plans/2026-06-26-cozy-animation-idle.png`
  - `docs/plans/2026-06-26-cozy-animation-selected-seal.png`
  - `docs/plans/2026-06-26-cozy-animation-ready-ritual.png`
  - `docs/plans/2026-06-26-cozy-animation-seal-break.png`
  - `docs/plans/2026-06-26-cozy-animation-unlocked.png`

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Implement A/B/C cozy magic hub animations with browser proof |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Fine-tuning animation density remains subjective; screenshots look readable and cozy, but exact taste may need one more art-direction pass.
- `browser-use` was unavailable; Chrome proof is equivalent for the local canvas surface but not the repo-preferred tool.
