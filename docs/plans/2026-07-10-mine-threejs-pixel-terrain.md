# mine threejs pixel terrain

Objective:
Convert Mine terrain to real Three.js 3D pixel-art blocks with raycast clicks, tracked by PRD/issues, verified by tests/build/browser, and reviewed.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
docs/plans/2026-07-10-mine-threejs-pixel-terrain.md

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
- type: user prompt plus reference image
- id / link: N/A
- title: Convert Mine terrain to true 3D pixel-art blocks
- acceptance criteria:
  - Mine terrain uses a real 3D renderer, not CSS-only faux 3D.
  - Visual result keeps the pixel-art/isometric block look from the provided reference.
  - Board remains 6x6 and supports 5 vertical block layers.
  - Every block is an individually clickable 3D object using raycasting.
  - Destroyed blocks reveal depth/occlusion naturally.
  - Colors/material themes remain easy to recolor later.
  - Existing Mine economy and 5-layer cycle behavior remain intact.
  - Browser proof shows the 3D scene renders and clicking one cube changes only that cube.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked `N/A: <reason>`.

Timed checkpoint:
- requested duration: none
- semantics: N/A
- initial confidence score: 86/100 because the logic is already 6x6/5-layer, but introducing Three.js into the HUD lifecycle needs careful cleanup and proof.
- improvement loop: raise confidence with static guards, build/tests, DOM/browser proof, and review.
- final score / loop closure: final response includes score confiance.

Completion threshold:
- PRD issue exists in GitHub with `ready-for-agent`.
- Vertical slice issues exist in GitHub with `ready-for-agent`.
- First useful slice implements a Three.js Mine terrain renderer with pixel-art orthographic isometric camera and raycast clicks.
- Static/source guards prove Three.js renderer hooks exist and old CSS block-stack renderer is not the main board renderer.
- `npm run build` and relevant/full tests pass.
- Browser proof captures 3D canvas rendering, nonblank pixels, 36 raycastable blocks, and one-click single-block mutation.
- Review against `main` is recorded.
- Final response lists PRD issue, slice issues, implemented issue/slice, verification proof, browser proof, review result, and `score confiance`.

Verification surface:
- `gh issue` commands or issue URLs for PRD/slice publication.
- Implementation verification commands, such as typecheck, build, tests, or
  source audit.
- Browser/game proof for UI/game work, using the repo-approved browser tool
  first and recording any fallback.
- Review evidence against `main` or the chosen fixed point.
- `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-mine-threejs-pixel-terrain.md`.

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
- Allowed edit scope: Mine HUD renderer/lifecycle, Mine CSS, Mine tests/static guards, dependency manifest, CONTEXT if needed, GitHub issue text, this plan.
- Browser surface: local Library Magic app, Mine des Profondeurs panel.
- Tracker sync: GitHub Issues unless project docs say otherwise.
- Non-goals: redesign Mine economy, replace all UI panels with WebGL, final recolor pack, realistic lighting, physics.

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
| grill-with-docs completed before autogoal | yes | Read user prompt/reference, repo docs, Mine source, HUD lifecycle; no question needed because product intent is explicit. |
| Prompt requirements captured before work | yes | Acceptance criteria above. |
| Timed checkpoint parsed | N/A: no duration requested | no timed checkpoint. |
| Active goal checked or created | yes | `get_goal` returned none; active goal created. |
| Source of truth read before edits | yes | Read auto prompt, docs/agents, plan template, Mine HUD/actions/state/CSS/package context. |
| Tracker target verified | yes | `gh auth status` and `gh repo view` verified `bbeyens/library-magic`. |
| PRD publication decision recorded | yes | Publish GitHub PRD issue with `ready-for-agent`. |
| Slice publication decision recorded | yes | Publish vertical slice issues with `ready-for-agent`. |
| First useful slice selected | yes | Implement Three.js renderer and raycast click integration first. |
| TDD decision before behavior change or bug fix | yes | Existing mining rules tests cover state; add static/browser-style guards for renderer. |
| Browser/game proof decision recorded | yes | Try browser-use discovery first; fallback recorded if unavailable. |
| Review target selected before closeout | yes | Review against `main`. |
| Browser pack selected | yes | Browser pack applies because this is game/UI work. |
| Browser route / app surface identified | yes | Local Library Magic app, Mine des Profondeurs panel. |
| Browser tool decision recorded | yes | Try browser-use first per repo rule; record fallback if unavailable. |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | complete | Source/docs read, material questions asked or explicit no-question reason | No question needed: user explicitly requested true 3D matching reference. |
| 2. autogoal | complete | Active goal handle and this plan path | Goal created; plan `docs/plans/2026-07-10-mine-threejs-pixel-terrain.md`. |
| 3. to-prd | complete | PRD issue URL or `N/A: <reason>` | #53 https://github.com/bbeyens/library-magic/issues/53 |
| 4. to-issues | complete | Slice issue URLs or `N/A: <reason>` | #54, #55, #56 |
| 5. implement | complete | Implemented slice id/scope and changed owners | Implemented #54 and #56 together: `src/ui/miningThreeTerrain.ts`, Mine HUD playfield/patching, Mine CSS, package deps, static guards. |
| 6. browser/game playtest | complete | Route, interaction, result, console/network caveat, and tool/fallback used | Browser-use unavailable in tool search; fallback used Codex bundled Playwright/Chrome. Mine panel rendered 1 3D canvas, 36 blocks, click changed only block 21 health 3 -> 2, zero warnings/errors. Screenshot `docs/plans/mine-threejs-click-proof.png`. |
| 7. review | complete | Review target, findings, fixes/rejections | Targeted review of touched Mine renderer/HUD/CSS/tests because repo has many unrelated dirty diffs. Fixed WebGL context churn by patching dynamic Mine DOM without recreating the canvas. |
| 8. close with evidence | complete | Final response evidence checklist prepared | Prepared PRD/slices, changed files, tests/build, browser proof, review result, and score confiance. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Objective, threshold, verification surface, constraints, boundaries, and
      blocked condition are concrete.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
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
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | Ledger complete; no grill questions needed because user intent was explicit. |
| PRD published | yes | Create PRD issue or record `N/A: <reason>` | #53 https://github.com/bbeyens/library-magic/issues/53 |
| Slice issues published | yes | Create vertical slice issues or record `N/A: <reason>` | #54, #55, #56 |
| Implemented slice | yes | Name the slice and changed owners | #54 and #56 implemented: Three.js renderer, HUD integration, stable 3D click dispatch. |
| Typecheck/build/test proof | yes | Run relevant owner checks or record `N/A: <reason>` | `npm run typecheck`, `npx tsx tests/hudStatic.test.ts`, `npx tsx tests/miningRules.test.ts && npx tsx tests/miningIsoGeometry.test.ts`, `npm run build`, `npm test` passed. |
| Browser/game proof | yes | Exercise affected browser/game surface or record blocker/waiver | Mine panel opened through dev store, 3D canvas rendered, one click changed only block 21 health 3 -> 2. |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | Targeted review of touched sections; fixed WebGL context churn caused by playfield HTML replacement. |
| Final handoff completeness | yes | Confirm final response will list PRD issue, slice issues, implemented issue/slice, verification, browser proof, review result, and `score confiance` | Final response checklist ready. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise `N/A: <reason>` | No timed checkpoint requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-mine-threejs-pixel-terrain.md` | `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-mine-threejs-pixel-terrain.md` passed. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Click at canvas center hit one block. |
| Browser console/network check | yes | Record console/network state or N/A | Zero warnings/errors/page errors in final browser proof. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `docs/plans/mine-threejs-click-proof.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | User intent explicit; repo docs/Mine source read before implementation. | autogoal complete |
| Autogoal setup | complete | Goal created and plan maintained. | PRD complete |
| PRD | complete | #53 published. | issues complete |
| Issues | complete | #54, #55, #56 published. | implementation complete |
| Implementation | complete | Three.js Mine terrain renderer plus stable HUD patching implemented. | browser proof complete |
| Browser/game proof | complete | 1 canvas, 36 blocks, click changed only block 21, no console warnings/errors. | review complete |
| Review | complete | Targeted touched-section review; fixed WebGL context churn. | closeout complete |
| Closeout | complete | Evidence ready for final response. | final response |

Findings:
- Existing Mine state already supports 6x6, `layersRemaining`, and terrain cycles.
- Current renderer is DOM/CSS isometric; it can be replaced in the Mine playfield with a Three.js canvas while preserving material bank and skill dock.
- Existing click handlers dispatch `digMiningBlock`; the 3D renderer should dispatch the same action from a raycast hit.
- `package.json` currently lacks Three.js, so this slice must add `three`.

Decisions and tradeoffs:
- Use Three.js with an orthographic camera for true 3D and isometric pixel-art composition.
- Use flat colored materials and nearest/pixel-friendly canvas CSS rather than realistic PBR lighting.
- Scope first slice to rendering/clicking the existing Mine model, not new progression balance.
- Keep existing Mine state and economy; only replace the visual/input surface.

Review fixes:
- Fixed WebGL context churn by making Mine refresh patch dynamic DOM values without replacing the Three.js canvas.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Timeline:
- 2026-07-10T12:35:56.349Z: plan created.
- 2026-07-10: grill-with-docs completed, active goal created, tracker verified.

Verification evidence:
- PRD: #53 https://github.com/bbeyens/library-magic/issues/53
- Slices: #54 https://github.com/bbeyens/library-magic/issues/54; #55 https://github.com/bbeyens/library-magic/issues/55; #56 https://github.com/bbeyens/library-magic/issues/56
- Implemented slice: #54 and #56 in one vertical slice because the first useful 3D terrain must both render and click.
- Commands passed: `npm run typecheck`; `npx tsx tests/hudStatic.test.ts`; `npx tsx tests/miningRules.test.ts && npx tsx tests/miningIsoGeometry.test.ts`; `npm run build`; `npm test`.
- Browser proof: browser-use unavailable in `tool_search`; fallback used bundled Playwright/Chrome on `http://127.0.0.1:5174/`. Mine panel rendered a 254x143 internal pixel canvas sized to 410.75x231.05 CSS px, 36 keyboard fallback blocks, 1 canvas, click at center changed only block 21 health 3 -> 2, zero warning/error/pageerror logs.
- Screenshot: `docs/plans/mine-threejs-click-proof.png`.
- Review: targeted touched-section review completed; no unresolved issue found after WebGL churn fix.
- Autogoal check: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-mine-threejs-pixel-terrain.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout complete |
| Where am I going? | Final response |
| What is the goal? | True 3D pixel-art Mine block terrain with raycast clicks |
| What have I learned? | True 3D works cleanly, but Mine refresh must not replace the canvas during ticks/clicks. |
| What have I done? | Published PRD/slices, implemented Three.js renderer, verified tests/build/browser proof, reviewed touched sections. |

Open risks:
- Browser-use was unavailable in this session, so browser proof used the recorded Playwright/Chrome fallback.
- Dirty workspace has many unrelated diffs; no commit/stage performed.
- Remaining visual tuning can still be done later, but the requested true 3D clickable block surface is verified.
