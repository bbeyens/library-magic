# polish td hud chrome

Objective:
Polish TD HUD chrome; done when TD stats/wave/speed/header/range visuals match browser comments and checks pass; plan docs/plans/2026-06-27-polish-td-hud-chrome.md.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-27-polish-td-hud-chrome.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser

Completion threshold:
- TD damage/speed/range text appears on the left tree edge vertically with no boxed chips.
- TD speed control appears near the close button with no boxed chip.
- Shared upgrade and compact buttons use about 70% opacity at the outside and 30% at the center.
- TD wave UI has no outer box and no visible "Vague N" label, only the progress rail/markers.
- TD top health bar is removed or hidden from normal full-health display.
- TD range circle is fully visible in browser proof.
- `npm run typecheck`, `npm run build`, `./node_modules/.bin/tsx tests/defenseRules.test.ts`, and `git diff --check` pass.

Verification surface:
- Browser proof at `http://127.0.0.1:5173/`, TD panel open.
- Source audit of `src/ui/hud.ts` and `src/style.css`.
- Commands listed in completion threshold.

Constraints:
- Preserve TD gameplay rules.
- Preserve the shared mini-game panel controls except requested opacity treatment.
- Ignore unrelated dirty workspace files.

Boundaries:
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, this plan.
- Non-goal: rebalance TD stats, enemy behavior, map assets, or upgrade logic.

Output budget strategy:
- Use focused CSS/markup reads and browser screenshot proof.

Blocked condition:
- Stop only if the local app cannot be opened for browser proof and command checks still pass.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Four browser comments copied into completion threshold. |
| Active goal checked or created | yes | Active goal created for this plan. |
| Source of truth read before edits | yes | Read TD panel markup and CSS for mini stats, wave, health, range, panel buttons. |
| Browser proof decision | yes | Required because request is visual layout. |

Work Checklist:
- [x] First checkpoint complete with explicit prompt requirements.
- [x] Objective, threshold, verification, constraints, boundaries, blocked condition are concrete.
- [x] Move TD stats to left edge as text-only vertical HUD. Evidence: browser proof `.defense-mini-stats` at x=636, width=61, 3 vertical stat rects, no border/background.
- [x] Move TD speed near close button as text-only control. Evidence: browser proof speed `x1` at x=1191 near close x=1222, no border/background.
- [x] Apply shared upgrade button opacity treatment. Evidence: computed backgrounds include center `rgba(..., 0.3)` and outer `rgba(..., 0.7)` for both buttons.
- [x] Simplify TD wave rail and remove wave label/box. Evidence: browser proof wave text is `1234`, no `Vague`, wrapper border/background none.
- [x] Remove the confusing TD top bar from normal display. Evidence: browser proof `defenseHealthCount: 0`.
- [x] Ensure range circle is not clipped in browser proof. Evidence: `rangeInside: true`.
- [x] Record command and browser evidence. Evidence: see Verification evidence.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run commands and browser proof | Passed. |
| TypeScript changed | yes | `npm run typecheck` | Passed. |
| Build-sensitive UI changed | yes | `npm run build` | Passed. |
| Focused TD rules check | yes | `./node_modules/.bin/tsx tests/defenseRules.test.ts` | Passed. |
| Final lint/format | yes | `git diff --check` | Passed. |
| Browser final proof artifact | yes | Screenshot and DOM measurements | Passed: `/tmp/library-magic-td-hud-polish-proof-final.png`. |
| Autoreview | yes | Review final diff against latest prompt | Passed: changes are scoped to requested TD HUD chrome and shared upgrade buttons. |
| Goal plan complete | yes | `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-polish-td-hud-chrome.md` | Passed after final closeout update. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | CSS/markup reads complete | Implementation |
| Implementation | complete | Updated TD markup/CSS and shared upgrade button backgrounds | Verification |
| Verification | complete | Commands and browser proof passed | Closeout |
| Closeout | complete | Plan checker passed after final closeout update | Final response |

Findings:
- TD mini stat boxes share styles with `.defense-speed-toggle`.
- TD wave currently includes a boxed wrapper and visible `Vague N` text.
- The top bar is `.defense-health`; when health is not full it becomes a large top bar.
- Shared panel buttons are `.book-upgrade-tile` and `.upgrade-compact-tile`.
- A later `.defense-mini-stats` CSS block overrode the first left-column placement; it was corrected.

Timeline:
- 2026-06-27: plan created, requirements captured, source read.
- 2026-06-27: implemented TD HUD chrome changes and shared button opacity.
- 2026-06-27: fixed duplicate `.defense-mini-stats` override after browser proof.

Decisions and tradeoffs:
- Keep TD info as edge text to protect playfield, per game-ui guidance.

Review fixes:
- Accepted: first browser proof showed stats still horizontal because a later CSS block overrode placement. Fixed by replacing that block with left-column sizing.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None | 0 | N/A | N/A |

Verification evidence:
- `npm run typecheck` -> passed.
- `npm run build` -> passed.
- `./node_modules/.bin/tsx tests/defenseRules.test.ts` -> passed, `defenseRules ok`.
- `git diff --check` -> passed.
- Browser proof -> `/tmp/library-magic-td-hud-polish-proof-final.png`; no page errors; no TD health bar; no visible wave label; stats/speed/wave have no boxes; range is inside arena.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-polish-td-hud-chrome.md` -> passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Plan checker and final response |
| What is the goal? | Match the four browser comments |
| What have I learned? | TD chrome needed text-only edge HUD and a simpler wave rail |
| What have I done? | Implemented, verified, and captured browser proof |

Open risks:
- Exact "0%/100%" range definition is already tuned elsewhere; this pass only prevents visible clipping.
