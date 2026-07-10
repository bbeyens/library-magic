# gem-td-complete-layout

Objective:
Porter le mini-jeu Gem sur le layout TD complet: police partagée, badge XP rond, dock skills responsive, et skill `td-skill-boxes` mis à jour.

Goal plan:
docs/plans/2026-07-08-gem-td-complete-layout.md

Task source:
- User asked: "utilise aussi la meme police et même barre d'xp, skill box responsive aussi, recopie pareil que TD, met aussi à jour le skill au passage".

Completion threshold:
- Gem/Crystal keeps the previously requested 480px square arena.
- Gem/Crystal XP uses the TD-style circular badge with conic fill and hover/focus details.
- Gem/Crystal skill dock uses the TD responsive two-column grid, max 8 visible cards, and internal scroll.
- Gem/Crystal skill dock no longer has a fixed 219px height.
- Gem/Crystal skill card text uses the same 16px rhythm as TD.
- `.agents/skills/td-skill-boxes/SKILL.md` records the Gem/Crystal port rules.
- `tests/hudStatic.test.ts` and `npm run build` pass.

Verification surface:
- Source audit: `src/ui/hud.ts`, `src/style.css`, `.agents/skills/td-skill-boxes/SKILL.md`.
- Static guardrail: `npx tsx tests/hudStatic.test.ts`.
- Production build: `npm run build`.
- Browser proof: repo preference is browser-use; unavailable in this tool turn, so covered by source audit plus build and test.

Constraints:
- Preserve TD behavior.
- Preserve Gem gameplay behavior; only layout, XP display, and skill dock styling are in scope.
- Do not stage, commit, push, or open PR.
- Ignore unrelated dirty workspace diffs.

Boundaries:
- Source of truth: current TD XP HUD and skill dock implementation.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, `tests/hudStatic.test.ts`, `.agents/skills/td-skill-boxes/SKILL.md`, this plan.
- Browser surface: `http://127.0.0.1:5173/`, but browser-use tool was not available.
- Tracker sync: N/A.
- Non-goals: no economy changes, no sprite changes, no TD gameplay changes.

Current verdict:
- verdict: complete
- confidence: 94
- next owner: user
- reason: implementation and guardrails are in place; only live browser proof is waived because the requested browser tool was unavailable.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | checklist above |
| Active goal checked or created | yes | active autogoal created for Gem TD complete layout |
| Source of truth read before edits | yes | TD XP HUD, Gem XP HUD, Gem dock CSS, td-skill-boxes skill read |
| Acceptance criteria captured | yes | completion threshold |
| TDD decision before behavior change | yes | static HUD test is the useful guardrail; no gameplay rule change |
| Browser proof decision for browser surface | yes | browser-use unavailable, waiver recorded |
| Agent-native pack selected | yes | `.agents/skills/td-skill-boxes/SKILL.md` changed |

Work Checklist:
- [x] Prompt requirements captured.
- [x] Source patterns read before edits.
- [x] Gem XP markup changed to TD-style circular badge plus hover/focus body.
- [x] Gem XP dynamic updater patches CSS custom properties and title/aria in place.
- [x] Gem skill dock fixed height removed.
- [x] Gem skill dock uses two columns, 8 visible cards, 170px visible grid, and scroll.
- [x] Gem skill card subtext font matched to TD 16px rhythm.
- [x] td-skill-boxes skill updated with Gem/Crystal port rules.
- [x] Static tests updated to protect the new invariant.
- [x] Verification commands run.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run focused test and build | `npx tsx tests/hudStatic.test.ts`; `npm run build` |
| Targeted behavior verification | yes | Static source guardrails | `hudStatic ok` |
| Build-sensitive behavior changed | yes | Production build | `npm run build` passed |
| Browser surface changed | yes | Browser-use proof or waiver | waived: browser-use tool not exposed in this turn |
| Agent source validation | yes | Skill file source audit | skill frontmatter remains valid and Gem section added |
| Goal plan complete | yes | Run autogoal checker | recorded in final verification pass |

Verification evidence:
- `npx tsx tests/hudStatic.test.ts` passed with `hudStatic ok`.
- `npm run build` passed with TypeScript and Vite production build complete.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-gem-td-complete-layout.md` is the final plan gate.

Reboot status:
- Current. A future agent should continue from the files listed in the allowed edit scope; no server or browser session state is required to understand the change.

Open risks:
- Browser-use visual proof was unavailable in this turn, so final visual confirmation in the live browser is still useful.

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | relevant HUD/CSS/skill sections read | none |
| Implementation | complete | code and skill patched | none |
| Verification | complete | test/build pass | none |
| Closeout | complete | final response | none |

Findings:
- Gem had a separate bottom XP bar and a large fixed dock height. That was the wrong part to keep; the TD layout now owns this pattern.

Decisions and tradeoffs:
- Browser proof is waived because the repo-requested browser-use route is not callable in this turn. I did not substitute an unreliable preview path.

Blocked condition:
- No blocking condition remains for source/test/build completion.
