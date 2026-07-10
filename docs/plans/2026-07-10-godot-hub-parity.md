# godot hub parity

Objective:
Port the Library Magic hub composition into Godot; done when the scene uses positioned book hotspots, mana/resource HUD, forbidden grimoire panel, and Godot headless verification passes.

Goal plan:
docs/plans/2026-07-10-godot-hub-parity.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: user prompt
- id / link: local Codex thread
- title: Continue until the Godot hub matches the existing hub direction
- acceptance criteria: replace the generic grid with Phaser-positioned book hotspots; preserve background hub image; show mana/key HUD; show selected book panel; show forbidden grimoire requirements; verify with Godot 4.7 headless and repo checks

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
- initial confidence score: 78/100; main uncertainty is visual parity without an automated screenshot capture
- improvement loop: port Phaser hub positions, rebuild scene nodes cleanly, verify Godot scene load and repo checks
- final score / loop closure: 91/100 after Godot import, headless scene run, typecheck, and tests

Completion threshold:
- `godot/scenes/Main.tscn` is a clean fullscreen hub scene, not the Inspector-mutated grid layout.
- `godot/scripts/Main.gd` renders book hotspots at Phaser-derived hub coordinates.
- Hub includes background image, mana/key badges, selected book panel, resource badges, and forbidden grimoire requirement panel.
- Godot 4.7 loads/imports/runs the scene headlessly without errors.
- TypeScript repo checks still pass.

Verification surface:
- Godot CLI import and headless scene run.
- `npm run typecheck`.
- `npm test`.
- Source audit against `src/phaser/scenes/LibraryScene.ts` book positions and ritual panel behavior.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `src/phaser/scenes/LibraryScene.ts`, `src/game/content/books.ts`, `src/game/content/forbiddenGrimoire.ts`, and existing Godot files.
- Allowed edit scope: `godot/scenes/Main.tscn`, `godot/scripts/Main.gd`, `godot/scripts/state/GameState.gd`, and this plan.
- Browser surface: N/A; native Godot surface.
- Tracker sync: N/A.
- Non-goals: full mini-game parity, particle/tween parity, save system, macOS export packaging.

Current verdict:
- verdict: completed
- confidence: 91/100
- next owner: task
- reason: Godot hub composition now has positioned book hotspots and core hub panels; capped because final visible state was not screenshot-captured in this run

Pre-solution issue challenge:
- reporter claim: current Godot scene is not close enough to the existing hub
- suggested diagnosis or fix: replace the generic UI grid with a composition based on Phaser hub positions
- repro ladder:
  - tests / source-level repro: source audit confirmed the previous `Main.tscn` had hidden `RootMargin`, odd background offsets, and grid-style UI
  - repo-owned automated browser or integration proof: N/A for native Godot
  - Browser plugin: N/A for native Godot
  - screenshot / visual proof: user screenshot showed prototype grid; final run verified by Godot headless, not screenshot
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: rebuild the Godot hub scene/script, not tweak one Inspector field
- harsh honest feedback: the previous skeleton was useful plumbing but visually nowhere near the hub; shipping that as "imported" would be bullshit
- hard-stop decision: continue implementation

Blocked condition:
- Stop only if Godot CLI fails to load the scene or a user-visible screenshot is required before more changes.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-godot-hub-parity.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | captured user request to continue until hub parity |
| Timed checkpoint parsed | N/A | no duration requested |
| Active goal checked or created | yes | `get_goal` returned null, then goal was created |
| Source of truth read before edits | yes | read Phaser hub scene, book content, forbidden grimoire content, existing Godot scene/script |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | user supplied visual behavior complaint |
| Reproduction verdict before implementation | yes | valid; screenshot and source audit confirmed prototype-grid mismatch |
| Repro escalation ladder selected | yes | source audit plus Godot CLI proof; browser N/A |
| Suggested fix reviewed against durable boundary | yes | scene/script rebuild is correct owner |
| TDD decision before behavior change or bug fix | N/A | visual/native scene composition; no clean unit-test surface |
| Browser proof decision for browser surface | N/A | native Godot, not browser |

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

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Godot import and headless scene run passed |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | yes | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source audit plus user screenshot; browser N/A |
| Bug reproduced before fix | yes | Record failing test/repro or N/A with reason | visual mismatch valid from screenshot and source state |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Godot headless scene run passed |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm test` passed; Godot import passed |
| Browser surface changed | N/A | Capture browser proof | native Godot surface |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | no lint script configured |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | final scene/script now owns hub composition; no unrelated dirty diffs intentionally changed |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-godot-hub-parity.md` | checker passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | read source hub and Godot files | implementation |
| Implementation | completed | rewrote `Main.gd`, `Main.tscn`, and added `keys` state | verification |
| Verification | completed | Godot import, Godot scene run, typecheck, tests | closeout |
| Closeout | completed | plan evidence recorded | final response |

Findings:
- Phaser hub uses fixed 1280x720 world coordinates; book positions are concentrated at x/y centers such as mana 193/213 and serpent 380/213 after scaling.
- The previous Godot scene had a generic grid and had been mutated by the editor with hidden `RootMargin` and odd background offsets.
- A script-owned Godot composition is more stable for this porting stage than manual Inspector layout.

Decisions and tradeoffs:
- Rebuilt the Godot hub as a fullscreen scene with programmatic hotspots based on Phaser coordinates.
- Kept particle/tween parity out of scope for this pass; static composition and interactions matter first.
- Used ASCII labels in new GDScript to keep file encoding simple.

Timeline:
- 2026-07-10T10:29:13.815Z: plan created.

Verification evidence:
- `'/Users/zbeyens/Downloads/Godot.app/Contents/MacOS/Godot' --headless --path godot --import` passed.
- `'/Users/zbeyens/Downloads/Godot.app/Contents/MacOS/Godot' --headless --path godot --scene res://scenes/Main.tscn --quit-after 5` passed.
- `npm run typecheck` passed.
- `npm test` passed.
- ASCII audit passed for edited Godot files and this plan.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-godot-hub-parity.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Port the hub composition into Godot |
| What have I learned? | See Findings |
| What have I done? | Rebuilt the Godot hub scene and verified it |

Open risks:
- Final visual parity still needs the user to view the native Godot window; this run used headless verification.
- This pass ports the hub shell, not mini-game pages.
