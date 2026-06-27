# Fix TD Drag Animation

Objective:
Fix TD animation instability after dragging book page; done when drag/release preserves stable TD animation cadence and checks/browser proof pass.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-27-fix-td-drag-animation.md

Primary template:
N/A: micro bug plan

Applied packs:
- browser

Completion threshold:
- TD animated tiles keep a deterministic animation phase before and after book-page drag/release.
- Existing tests, typecheck, build, and diff check pass.

Verification surface:
- Source audit of TD render and drag paths.
- Browser proof on local Vite route.
- `npm test`, `npm run typecheck`, `npm run build`, `git diff --check`.

Constraints:
- Do not change TD gameplay rules, enemy movement, tower attack, or map art.
- Preserve existing Tiled animation frames.
- Ignore unrelated dirty workspace diffs.

Boundaries:
- `src/ui/hud.ts`
- `src/style.css`
- `src/game/content/tdTiledMap.ts`
- optional focused browser/debug scripts

Output budget strategy:
- Use focused `rg` and `sed` slices only.
- Keep browser output to counts and screenshots.

Blocked condition:
- Stop only if the animation cannot be reproduced or inspected locally after source/browser attempts.

Start Gates:
| Gate | Applies | Evidence |
| --- | --- | --- |
| User symptom captured | yes | TD animation normal while dragging, random after pointer release |
| Context read | yes | `CONTEXT.md` read |

Work Checklist:
- [x] Build red-capable feedback loop for TD drag/release animation. Evidence: browser drag proof marks panel DOM before drag, drags, then verifies marker survived pointerup.
- [x] Identify the specific phase/reset cause. Evidence: `endPanelInteraction()` forced `lastRenderSignature = ''`, recreating panel DOM after drag even when state did not change.
- [x] Fix the smallest owner. Evidence: removed forced signature invalidation; normal signature comparison still rerenders if state actually changed.
- [x] Verify with browser proof. Evidence: Chrome proof returned `domPersisted: true` and `moved: true`.
- [x] Run required checks. Evidence: tests/typecheck/build/diff-check pass.

Completion Gates:
| Gate | Applies | Required action | Evidence |
| --- | --- | --- | --- |
| Tests | yes | Run checks | `npm test`, `npm run typecheck`, `npm run build`, `git diff --check` passed |
| Browser | yes | Inspect drag/release DOM persistence | Chrome proof: panel moved and DOM marker persisted after pointerup |
| Goal plan complete | yes | Update checklist and evidence | Complete |

Findings:
- `renderHud()` intentionally skips full rerender while `activePanelInteractionCount > 0` and only updates dynamic values.
- `endPanelInteraction()` then forced `lastRenderSignature = ''`, making `renderHud()` recreate the panel even if the only change was drag position already applied directly to styles.
- TD terrain animations are CSS animations inside the panel DOM, so recreating the panel after pointerup restarts the animated terrain.

Timeline:
- Read `CONTEXT.md`, TD HUD render, drag lifecycle, and Tiled map animation rendering.
- Removed the forced signature invalidation in `endPanelInteraction()`.
- Verified drag/release with Chrome: marker persisted and panel position changed.
- Ran full command checks.

Decisions and tradeoffs:
- Keep signature-based rerendering intact: if game state really changes during a drag, `renderHud()` still rerenders after release.
- Do not touch TD gameplay or map assets; the bug was lifecycle churn, not map animation data.

Review fixes:
- N/A: focused one-line lifecycle fix; source audit plus browser proof covered the changed behavior.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
| --- | --- | --- | --- |
| Repo-local checker path missing | 1 | Use global autogoal skill checker | Found `/Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs` |

Phase / pass table:
| Phase | Status | Evidence | Next |
| --- | --- | --- | --- |
| Repro/source audit | complete | Identified forced rerender in `endPanelInteraction()` | Fixed |
| Fix | complete | Removed forced `lastRenderSignature = ''` | Verified |
| Verification | complete | Browser proof and command checks passed | Complete goal |

Verification evidence:
- Browser: Chrome local at `http://127.0.0.1:5173/`; opened Mana panel, marked DOM, dragged from header, released; result `domPersisted: true`, `moved: true`.
- Command: `npm test` passed.
- Command: `npm run typecheck` passed.
- Command: `npm run build` passed with existing Vite large chunk warning.
- Command: `git diff --check` passed.

Reboot status:
| Where am I? | Where am I going? | What is the goal? | What learned? | What done? |
| --- | --- | --- | --- | --- |
| Fixed drag release rerender | Complete goal | Stable TD animation after drag release | Forced full rerender after drag was restarting animated DOM | Removed invalidation and verified |

Open risks:
- Did not visually open TD in browser because fresh headless state keeps later books locked through canvas selection; proof targets the shared drag/release DOM behavior that caused the TD animation reset.
