# library hub book covers locks ritual menu

Objective:
Improve hub book covers, locks, and ritual menu; done when generated gameplay-specific covers are integrated, overlay icons/text labels are removed, lock UI replaces labels, and browser proof passes.

Goal plan:
docs/plans/2026-06-26-library-hub-book-covers-locks-ritual-menu.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user chat
- id / link: local Codex thread
- title: Book-cover-specific hub polish
- acceptance criteria: generate gameplay-specific book covers, remove front overlay icons that spoil the art, replace `SCEAU`/`SCELLE` text with a lock visual for locked books, and improve the Forbidden Grimoire offering menu.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: none
- semantics: N/A, no timed checkpoint requested
- initial confidence score: 86/100
- improvement loop: raise confidence through generated asset inspection, code audit for no overlay icons/text labels, typecheck/build, and browser screenshots.
- final score / loop closure: 95/100 after generated asset inspection, source audit, typecheck, build, and browser proof.

Completion threshold:
- A new generated hub plate exists where each visible game book cover contains its gameplay identity directly in the art.
- Phaser no longer overlays resource/game icons on top of book covers.
- Locked books use a stylized lock visual instead of `SCEAU`/`SCELLE` text labels.
- Forbidden Grimoire offering menu is cleaner, more legible, and better integrated with the right-side boss area.
- Browser proof shows the updated shelf, hover, locked state, and offering state with no console/network errors.

Verification surface:
- `npm run typecheck`
- `npm run build`
- source audit for removed `SCEAU`/`SCELLE` labels and removed book icon overlay
- generated image inspection under `public/assets/library/generated/forbidden-hub/`
- browser proof on local Vite route with screenshots and console/network checks

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/phaser/scenes/LibraryScene.ts`, `public/assets/library/generated/forbidden-hub/`, `public/assets/library/`, and this plan.
- Allowed edit scope: Phaser hub scene, generated hub art, lock asset, ritual menu visual code, and proof artifacts.
- Browser surface: local Vite app at `http://127.0.0.1:<available port>/`.
- Tracker sync: N/A, no external ticket.
- Non-goals: rebalance progression, redesign mini-game panels, deploy, commit, push, or edit unrelated dirty files.

Current verdict:
- verdict: complete
- confidence: 95/100
- next owner: user
- reason: new gameplay-specific hub plate is integrated, book icon overlays and text labels are removed, lock UI and improved offering menu are verified in browser.

Pre-solution issue challenge:
- reporter claim: current overlay icons spoil the generated books, text labels are ugly, and the grimoire offering panel is weak.
- suggested diagnosis or fix: make book identity part of generated cover art, replace text locks with lock visuals, and redraw the offering panel as a ritual UI.
- repro ladder:
  - tests / source-level repro: current `LibraryScene.ts` has `symbol` overlay images and `SCEAU`/`SCELLE` text labels.
  - repo-owned automated browser or integration proof: existing screenshot shows overlays hiding book art.
  - Browser plugin: repo prefers browser-use, but it is not exposed in this session; use system Chrome fallback if still unavailable.
  - screenshot / visual proof: user screenshot demonstrates the issue.
- reproduction verdict: valid visual/product issue.
- validity verdict: valid.
- best long-term fix boundary: keep generated art as the book identity and state overlays as small UI affordances only.
- harsh honest feedback: the icon medallions were a crutch. They made the generated art readable, but also made it look cheap.
- hard-stop decision: proceed.

Blocked condition:
Stop only if image generation credentials fail and no acceptable generated-art fallback can be produced, or if the app cannot be loaded locally for visual proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-library-hub-book-covers-locks-ritual-menu.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Copied explicit cover, icon removal, lock, and grimoire-menu requirements. |
| Timed checkpoint parsed | no | No timed checkpoint requested. |
| Active goal checked or created | yes | `get_goal` returned none; active goal created for this polish pass. |
| Source of truth read before edits | yes | Read `LibraryScene.ts`, current assets, Gemini skill references, and current screenshot context. |
| Acceptance criteria captured | yes | Captured in task source and completion threshold. |
| Pre-solution issue challenge required | yes | Visual/product issue challenged above. |
| Reproduction verdict before implementation | yes | Current source overlays icons/text labels; user screenshot confirms. |
| Repro escalation ladder selected | yes | Source audit plus browser visual proof. |
| Suggested fix reviewed against durable boundary | yes | Book identity belongs in generated cover art; lock/offering state belongs in Phaser UI. |
| TDD decision before behavior change or bug fix | no | Pure visual/asset/UI polish; static and browser proof are better than fake tests. |
| Browser proof decision for browser surface | yes | Required after Phaser hub visual changes. |
| Browser pack selected | yes | Plan created with browser pack. |
| Browser route / app surface identified | yes | Local Vite route on available port. |
| Browser tool decision recorded | yes | Try preferred browser-use if exposed; otherwise record blocker and use system Chrome fallback. |

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
| Named verification threshold | yes | Run the named proof or record blocker | `npm run typecheck`, `npm run build`, source audit, generated asset inspection, and browser proof passed. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Valid visual issue; the fix moved identity into generated covers and state into lock/menu UI. |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit found prior overlays/labels; user screenshot and browser proof covered the visual issue. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | Visual polish/product issue, not logic bug; screenshot and source state were enough. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Browser proof shows covers, locks, hover, offered state, and second-seal menu. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; only existing Vite chunk-size warning. |
| Browser surface changed | yes | Capture browser proof | Chrome proof captured final screenshots on `http://127.0.0.1:5177/`. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | No lint script exists in `package.json`; typecheck/build/source audit used. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Reviewed final screenshots: no front icon medallions, no `SCEAU`/`SCELLE`, locks are small, menu handles one and two resources. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-library-hub-book-covers-locks-ritual-menu.md` | Ready for final check-complete. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Used debug resources, clicked `Offrir`, clicked `Briser le sceau`, verified second seal menu. |
| Browser console/network check | yes | Record console/network state or N/A | Browser proof recorded `consoleMessages: []` and `failedRequests: []`. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | Screenshots: `docs/plans/2026-06-26-library-hub-book-covers-locks-initial.png`, `...-hover.png`, `...-offered.png`, `...-seal-broken.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Plan filled with user requirements and source/assets read. | implementation |
| Implementation | complete | Generated `forbidden-hub-gameplay-covers-1.jpg`, added `lock.svg`, removed book icon overlays/text labels, improved ritual menu. | verification |
| Verification | complete | Typecheck, build, source audit, and browser proof passed. | closeout |
| Closeout | complete | Evidence recorded; final response ready. | final response |

Findings:
- Existing `LibraryScene.ts` overlays resource icons as `symbol`, which makes the book art feel patched.
- Existing locked state writes `SCEAU`/`SCELLE`; this should become a small lock badge.
- Gemini cannot produce transparent cutouts, so the cleanest path is editing the full hub plate rather than separate transparent book sprites.

Decisions and tradeoffs:
- Use Gemini edit on the current hub plate to regenerate gameplay-specific book-cover art in-place.
- Remove front icon overlays entirely; the lock badge remains only for locked state.
- Create the lock as a controlled SVG/Phaser-readable UI asset instead of relying on Gemini transparency.

Timeline:
- 2026-06-26T17:37:19.105Z: plan created.
- 2026-06-26: generated gameplay-specific hub plate with Gemini 3.1 Flash Image.
- 2026-06-26: replaced text labels with lock badge and compacted ritual offering menu.
- 2026-06-26: browser proof captured with no console/network errors.

Verification evidence:
- Generated asset: `public/assets/library/generated/forbidden-hub/forbidden-hub-gameplay-covers-1.jpg`.
- Lock asset: `public/assets/library/lock.svg`.
- Source audit: `rg -n "SCEAU|SCELLE|symbol|costLabel|library-hub-plate.*4-4-2|library-hub-plate.*forbidden-hub-1" src/phaser/scenes/LibraryScene.ts public/assets/library/generated/forbidden-hub` returned no matches.
- `npm run typecheck` passed.
- `npm run build` passed; Vite emitted only the existing chunk-size warning.
- Browser proof used system Chrome because browser-use was not exposed in this session; console and failed request arrays were empty.
- Proof screenshots: `docs/plans/2026-06-26-library-hub-book-covers-locks-initial.png`, `docs/plans/2026-06-26-library-hub-book-covers-locks-hover.png`, `docs/plans/2026-06-26-library-hub-book-covers-locks-offered.png`, `docs/plans/2026-06-26-library-hub-book-covers-locks-seal-broken.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Better generated book covers, lock-based locked state, and improved offering menu |
| What have I learned? | Full-plate edit is better than separate transparent-ish book sprites because Gemini does not support transparent backgrounds. |
| What have I done? | Generated and integrated gameplay-specific covers, lock badge, compact ritual menu, and proof artifacts. |

Open risks:
- The generated plate places the bottom two books at shelf extremes rather than centered; hotspots were recalibrated to match the actual art.
