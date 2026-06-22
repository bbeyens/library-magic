# Snake mini game

Objective:
Ship a playable Livre du Serpent mini-game based on Grimoire de Mana; done when PRD/issues exist, first slice works in app, and build/browser proof pass.

Goal plan:
docs/plans/2026-06-22-snake-mini-game.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user-requested auto feature
- id / link: current Codex thread
- title: Livre du Serpent mini-game
- acceptance criteria:
  - `auto` order respected: grill-with-docs first, then autogoal.
  - Add a Snake mini-game based on the Grimoire de Mana overlay pattern.
  - The Livre du Serpent produces Ecailles as its unique resource and Mana as
    the shared resource.
  - The mini-game stays inside the opened book page and keeps simple gameplay.
  - The first delivered slice is verifiable in the browser game.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A: none requested.
- semantics: N/A.
- initial confidence score: N/A: concrete feature gates instead.
- improvement loop: N/A.
- final score / loop closure: final response includes `score confiance`.

Completion threshold:
- GitHub PRD issue exists for the Livre du Serpent mini-game.
- GitHub vertical slice issues exist and are labelled `ready-for-agent`.
- First slice is implemented: opening the Livre du Serpent shows a playable
  Snake board inside the book page, keyboard direction controls work, eating a
  rune/food grants Ecailles + Mana, and the upgrade panel remains available.
- TypeScript/build verification passes.
- Browser proof exercises the real `http://localhost:5173/` surface.

Verification surface:
- `gh issue` output for PRD and slice issues.
- `npm run typecheck`.
- `npm run build`.
- repo-approved browser tool if available; otherwise record blocker and use
  non-browser command proof without pretending it is browser-use.
- Source audit of changed simulation/HUD/CSS paths.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: latest `$auto` request plus existing `CONTEXT.md` glossary
  and current Grimoire de Mana implementation.
- Allowed edit scope: game state/actions, HUD, styles, small domain docs or
  plans, GitHub issues.
- Browser surface: `http://localhost:5173/`, Livre du Serpent overlay.
- Tracker sync: create PRD and vertical slice issues in GitHub Issues.
- Non-goals: no new Steam packaging work, no full multi-book automation system,
  no rewrite of the Phaser shelf, no PR unless separately requested.

Current verdict:
- verdict: valid feature request
- confidence: 86/100 before implementation
- next owner: task
- reason: current code has Grimoire de Mana and a placeholder/clicker-ish
  Serpent path; the requested mini-game can be delivered as a focused vertical
  slice.

Pre-solution issue challenge:
- reporter claim: user wants a Snake mini-game based on Grimoire de Mana.
- suggested diagnosis or fix: N/A: feature request, not a bug report.
- repro ladder:
  - tests / source-level repro: N/A: no bug claim.
  - repo-owned automated browser or integration proof: browser proof required
    for final feature interaction.
  - Browser plugin: must try repo-approved browser-use first.
  - screenshot / visual proof: useful if browser tool is available.
- reproduction verdict: N/A: feature request.
- validity verdict: valid.
- best long-term fix boundary: simulation state/actions own Snake rules; HUD
  owns the book-page interaction and visuals.
- harsh honest feedback: the existing `snakeStep` is just a clicker stub, not a
  Snake mini-game.
- hard-stop decision: no hard stop; implement the vertical slice.

Blocked condition:
- Stop if GitHub issue creation fails due credentials, or if no verification
  path can prove the browser surface at all.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-snake-mini-game.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Task source and acceptance criteria captured above. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | `get_goal` returned no active goal before this plan; create_goal next. |
| Source of truth read before edits | yes | Read `auto`, `grill-with-docs`, `domain-modeling`, `CONTEXT.md`, book definitions, simulation actions/state, HUD, styles. |
| Acceptance criteria captured | yes | Acceptance criteria listed under Task source. |
| Pre-solution issue challenge required | no | N/A: feature request, not bug report. |
| Reproduction verdict before implementation | no | N/A: feature request. |
| Repro escalation ladder selected | yes | Browser proof selected for final interaction; tests/typecheck/build selected for implementation proof. |
| Suggested fix reviewed against durable boundary | yes | Durable boundary: simulation owns rules, HUD owns book UI. |
| TDD decision before behavior change or bug fix | yes | Add focused pure simulation tests only if test harness exists; otherwise use typecheck/build plus source audit because repo has no test runner. |
| Browser proof decision for browser surface | yes | Required for final feature proof. |
| Browser pack selected | yes | Applied browser pack. |
| Browser route / app surface identified | yes | `http://localhost:5173/`, Livre du Serpent overlay. |
| Browser tool decision recorded | yes | Must try browser-use first; if unavailable in tools, record blocker/caveat. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation. Evidence: plan
      intake sections above.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. Evidence: N/A timed checkpoint.
- [x] Task source and acceptance criteria are captured.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason. Evidence: pre-solution challenge marked feature.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. Evidence: N/A for bug repro; browser proof still required for feature.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: N/A for feature.
- [x] Nearby implementation patterns are read before edits. Evidence:
      Grimoire de Mana HUD/action/style paths read.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: Snake rules live in
      `src/game/simulation/actions.ts` and `src/game/simulation/state.ts`; HUD
      only renders state and dispatches `snakeTurn`.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: reviewed
      uncommitted Snake diff against `HEAD` on `main` because this branch has
      no post-initial commits.
- [x] Verification evidence is recorded beside each relevant gate. Evidence:
      see Completion Gates and Verification evidence.
- [x] Browser pack: route, interaction path, and expected visible outcome are recorded before proof.
- [x] Browser pack: browser proof uses the repo-approved browser tool or records a blocker/waiver. Evidence: `browser-use` and Browser plugin were not exposed by tool search; fallback used Chrome Computer Use against `127.0.0.1:5173`.
- [x] Browser pack: console and network errors are checked or explicitly out of scope. Evidence: Computer Use cannot inspect console/network; build, curl, and visible browser interaction passed.
- [x] Browser pack: proof uses the real affected browser surface. Evidence: Chrome Computer Use interacted with `127.0.0.1:5173`, Livre du Serpent overlay.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | PRD #1 and slice issues #2-#4 exist; `npm run typecheck` passed; `npm run build` passed; simulation proof passed; Chrome Computer Use browser proof passed. |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: feature request, not a bug report; verdict recorded above. |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A for bug repro; feature verification used simulation proof plus real browser proof. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: no bug claim. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Temp-compiled simulation proof passed: food grants score/Ecailles/Mana, `snakeTurn` changes direction, wall collision soft-resets run. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; Vite emitted existing Phaser chunk-size warning only. |
| Browser surface changed | yes | Capture browser proof | Chrome Computer Use on `127.0.0.1:5173`: Livre du Serpent opened with 9x9 Snake board, upgrade tile visible, `Down` key moved snake, stats changed from `☉ 1205 ◆ 1186 ◇ 0 ✦ 1` to `☉ 1209 ◆ 1191 ◇ 1 ✦ 1`. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: repo has no lint/format script in `package.json`; `git diff --check` will be used for whitespace. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Standards/Spec review in main thread: no blocking findings; noted deterministic food placement as acceptable for first slice. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-snake-mini-game.md` | Passed: `[autogoal] complete: docs/plans/2026-06-22-snake-mini-game.md`. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Chrome Computer Use exercised the real route and keyboard interaction. |
| Browser console/network check | no | Record console/network state or N/A | N/A: `browser-use`/Browser plugin unavailable; Computer Use cannot inspect console/network. `curl` returned `200 text/html`; build passed. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Computer Use returned visual state for `Library Magic` on `127.0.0.1:5173` showing the Serpent board and updated stats after `Down`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read auto, grill-with-docs, domain docs, issue tracker docs, current plan, PRD #1, slice #2, and nearby Mana/Serpent implementation files | implementation |
| Implementation | complete | implemented simulation-owned Snake state/actions plus HUD/CSS board rendering and keyboard controls | verification |
| Verification | complete | typecheck, build, temp simulation proof, curl, and Chrome Computer Use browser proof passed | closeout |
| Closeout | complete | final plan check ready; scoped commit remains as delivery hygiene after mechanical check | final response |

Findings:
- Standards review: no documented-standard violations found in the Snake diff. TDD was considered; the repo has no test runner, so a temp-compiled simulation proof was used instead of adding fake ceremony.
- Spec review: #1/#2 requirements are covered by simulation state/actions, HUD rendering, keyboard controls, resource gains, soft reset, upgrade controls, typecheck/build, and browser proof.
- Residual polish: food placement is deterministic after each collection. That is acceptable for the first playable slice, but future tuning can randomize it.

Decisions and tradeoffs:
- User paused the Snake auto run because the step boundaries were not explicit
  enough. Repair owner is the auto goal template, not the Snake runtime code.
- Snake rules belong in simulation state/actions; the HUD only renders cells and
  dispatches direction input.
- Browser proof used Chrome Computer Use because `browser-use` and Browser
  plugin tools were not exposed in this session.
- Issue #2 remains open; no user instruction required closing GitHub issues.

Review fixes:
- No blocking review findings required code changes.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Temp simulation proof required wrong output path | 2 | Inspect `/tmp/library-magic-sim-test` before requiring compiled files | Resolved by requiring `/tmp/library-magic-sim-test/simulation/state.js` and `/tmp/library-magic-sim-test/simulation/actions.js`; proof passed. |

Timeline:
- 2026-06-22T15:59:44.601Z: plan created.
- 2026-06-22: user paused the auto run and requested a template repair for the
  missing visible `$auto` step boundaries.
- 2026-06-22: created `docs/plans/templates/auto.md` so future `$auto`
  autogoal plans must record each required step, including `grill-with-docs`,
  PRD, issues, implementation, browser/game proof, review, and final handoff.
- 2026-06-22: verified GitHub issues #1-#4 exist and carry `ready-for-agent`.
- 2026-06-22: `npm run typecheck` passed.
- 2026-06-22: `npm run build` passed with existing Phaser chunk-size warning.
- 2026-06-22: temp-compiled simulation proof passed for food rewards, direction
  turn, and wall collision soft reset.
- 2026-06-22: Chrome Computer Use browser proof passed on `127.0.0.1:5173`.
- 2026-06-22: Standards/Spec review found no blocking issues.
- 2026-06-22: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-snake-mini-game.md` passed.

Verification evidence:
- GitHub PRD: https://github.com/bbeyens/library-magic/issues/1.
- GitHub slice issues: https://github.com/bbeyens/library-magic/issues/2, https://github.com/bbeyens/library-magic/issues/3, https://github.com/bbeyens/library-magic/issues/4.
- `npm run typecheck` passed.
- `npm run build` passed.
- Temp simulation command passed: `snake simulation proof passed`.
- `curl -s -o /dev/null -w '%{http_code} %{content_type}\n' http://127.0.0.1:5173/` returned `200 text/html`.
- Browser proof: Chrome Computer Use on `127.0.0.1:5173`, Livre du Serpent page visible, Snake board visible, upgrade controls visible, `Down` input changed board/stats and resource counters.
- Review: Standards/Spec review in main thread; no blocking findings.
- Goal plan check: `[autogoal] complete: docs/plans/2026-06-22-snake-mini-game.md`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Scoped commit, then goal completion |
| What is the goal? | Ship playable Livre du Serpent mini-game with PRD/issues, first slice, build proof, and browser proof |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- None blocking. Console/network inspection was not available through current browser tooling; build, curl, simulation proof, and visible browser interaction passed.
