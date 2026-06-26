# TD Path Terrain

Objective:
Update Bastion Arcanique terrain to match the new reference better: grass base plus orange dirt paths filling the whole panel.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-06-24-td-path-terrain.md

Primary template:
micro visual task

Applied packs:
- browser

Completion threshold:
- Bastion panel includes visible grass terrain plus orange dirt path layout inspired by the provided screenshot.
- Terrain still fills the whole panel.
- Gameplay, tower count, and enemies are not redesigned.
- Typecheck/build/diff-check pass.
- Browser screenshot proves path terrain is visible.

Verification surface:
- Source audit for `.defense-terrain` / `.defense-path`.
- `npm run typecheck`.
- `npm run build`.
- Browser screenshot on preview.

Constraints:
- Preserve unrelated dirty workspace changes.
- Do not add camp/tree/rock objects in this slice.
- Do not change simulation/gameplay.

Boundaries:
- Allowed edits: `src/ui/hud.ts`, `src/style.css`, this plan.

Output budget strategy:
- Focused reads of Bastion panel and CSS only.

Blocked condition:
- Stop only if CSS/DOM cannot render the path layer or browser proof cannot run with available fallback.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt captured | yes | User wants terrain closer to new screenshot: grass plus orange dirt paths. |
| Active goal checked | yes | `get_goal` returned no active goal. |
| Source context read | yes | Read current Bastion panel markup and CSS. |

Work Checklist:
- [x] Skill analysis complete.
- [x] Prompt requirements copied.
- [x] Terrain path markup added.
- [x] CSS renders grass/path full-panel terrain.
- [x] Verification recorded.
- [x] Review/source audit recorded.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Path terrain | yes | Add visible path layout | `.defense-path.is-vertical`, `.is-horizontal`, and `.is-clearing` render visible orange dirt/cobble routes |
| Full panel | yes | Browser assertion/screenshot | preview assertion: arena 355x497, terrain 355x497 |
| Typecheck/build | yes | Run checks | `npm run typecheck`, `npm run build`, `git diff --check` passed |
| Browser proof | yes | Capture screenshot | `/tmp/library-magic-td-path-terrain-final.png` |
| Review | yes | Source audit | `src/ui/hud.ts` has terrain nodes; `src/style.css` uses `field-grass.png` and `field-01.png` |
| Goal plan complete | yes | Run checker | `check-complete.mjs` passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| setup | complete | plan created | edit |
| edit | complete | terrain DOM layer and grass/path CSS added | verify |
| verify | complete | checks and preview proof passed | review |
| review | complete | scoped source audit recorded | close |
| close | complete | `check-complete.mjs` passed | final |

Findings:
- Current terrain is a uniform green-hue tile background; it lacks the reference's orange dirt routes.

Timeline:
- 2026-06-24: plan created.
- 2026-06-24: added path terrain and verified in browser.

Decisions and tradeoffs:
- Use DOM/CSS path layers over the tile background instead of generating a bitmap; this is easier to tune responsively inside the panel.
- Use `FieldsTile_38.png` as `field-grass.png`; the previous hue-rotated orange tiles produced blue-green artifacts that did not match the reference.

Review fixes:
- None yet.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Verification evidence:
- `npm run typecheck` passed.
- `npm run build` passed; Vite emitted the existing chunk-size warning only.
- `git diff --check` passed.
- Preview browser proof passed on `http://127.0.0.1:4173/`: arena fills overlay, terrain fills arena, path uses `field-01.png`, grass uses `field-grass.png`.
- Screenshot: `/tmp/library-magic-td-path-terrain-final.png`.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-24-td-path-terrain.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Verification complete |
| Where am I going? | Close goal |
| What is the goal? | Grass plus orange dirt path terrain for Bastion |
| What have I learned? | `FieldsTile_38.png` is the clean grass tile; hue-rotating orange path tiles creates blue artifacts |
| What have I done? | Added terrain layer, path CSS, grass tile asset, checks, and browser proof |

Open risks:
- Reference also includes props; this slice intentionally does terrain only.
