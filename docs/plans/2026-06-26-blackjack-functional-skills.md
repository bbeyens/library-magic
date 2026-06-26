# Blackjack Functional Skills

Objective:
Implement purchasable and usable blackjack skills: player reroll, dealer reroll, dealer reveal, and higher Ace chance.

Goal plan:
docs/plans/2026-06-26-blackjack-functional-skills.md

Template:
docs/plans/templates/goal.md

First checkpoint:
- Scope: implement the four blackjack skills requested by the user.
- Deliverables: gameplay state, actions, HUD purchase UI, in-round skill buttons, and verification.
- Non-goals: no new art pipeline, no card-selection modal, no unrelated balance refactor.
- Stop condition: autonomous work stops only if the app cannot compile because of an unrelated repo breakage.
- Success criteria: each skill has a concrete gameplay effect and the project typechecks/builds.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: 86/100
- improvement loop: N/A
- final score / loop closure: pending

Completion threshold:
- Blackjack skills can be bought with chips.
- Player reroll replaces one player card during the player phase with per-hand charges.
- Dealer reroll replaces one dealer card during the player phase with per-hand charges.
- Dealer reveal exposes the hidden dealer card during the player phase.
- Ace chance passively increases only player draws.
- HUD exposes active in-round buttons and purchase levels/costs.

Verification surface:
- `npm run typecheck`
- `npx vite build --emptyOutDir=false`
- Browser/UI smoke check if a dev server can be reached.

Constraints:
- Keep changes scoped to blackjack simulation state/actions, HUD, and CSS if needed.
- Preserve existing blackjack animations and auto-redeal behavior.

Boundaries:
- Allowed files: `src/game/simulation/state.ts`, `src/game/simulation/actions.ts`, `src/ui/hud.ts`, `src/style.css`, this plan.

Blocked condition:
- Block only if local source files are missing or type/build failures are unrelated and prevent proof.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until final evidence is recorded.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint |
| Timed checkpoint parsed | N/A | no duration requested |
| Active goal checked or created | yes | create_goal called |
| Source of truth read before edits | yes | read state/actions/hud |
| TDD decision before behavior change or bug fix | yes | no local test runner found yet; use typecheck/build/browser proof |
| Browser proof decision for browser surface | yes | attempt after build |

Work Checklist:
- [x] First checkpoint complete: explicit prompt requirements, scope, stop conditions, deliverables, verification surface, and success criteria captured.
- [x] Objective, threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [x] Duration marked N/A.
- [x] Work phases are updated with evidence.
- [x] Decisions and tradeoffs are recorded.
- [x] Failed attempts and next different moves are recorded.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Implement four skills | complete: purchases, active actions, reveal, ace bias |
| Typecheck/build/test proof | yes | Run relevant checks | `npm run typecheck`; `npx vite build --emptyOutDir=false` |
| Browser proof | yes | Exercise blackjack UI or record blocker | smoke test saw 4 buy buttons, Jetons cost, Lv 1 after buy, 3 active skill actions, 4 cards |
| Autoreview | yes | Review final diff against request | scoped audit of blackjack sections |
| Timed checkpoint | N/A | no duration requested | N/A |
| Goal plan complete | yes | Audit plan manually | complete; repo check script missing |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | source files located | implementation |
| Implementation | complete | state/actions/HUD/CSS updated | verification |
| Verification | complete | typecheck, build, browser smoke | closeout |
| Closeout | in_progress | | final response |

Findings:
- Blackjack already has round state, card rendering, auto-redeal, and compact/detail skill panels.
- Existing skill list is currently preview-only and needs real purchase/action wiring.
- `browser-use` was not available via tool discovery; used local Chrome through Node/Playwright.
- The autogoal check-complete helper is not present at `.agents/skills/autogoal/scripts/check-complete.mjs`.

Decisions and tradeoffs:
- Use chips as the blackjack skill currency because blackjack already rewards chips.
- Reroll buttons target the last player card and the visible dealer card; no card-selection modal for this pass.
- Ace bias affects only player draws, not dealer draws.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Playwright bundled browser missing | 1 | Use installed Google Chrome executable | resolved |
| Wrong Phaser click coordinate opened defense | 1 | Use DOM book menu to select blackjack | resolved |
| Debug hotkey without page focus did not grant chips | 1 | Click page before pressing O | resolved |

Timeline:
- 2026-06-26: plan created.
- 2026-06-26: implemented blackjack skills and HUD controls.
- 2026-06-26: verified typecheck, build, and browser smoke test.

Verification evidence:
- `npm run typecheck` passed.
- `npx vite build --emptyOutDir=false` passed.
- Browser smoke at `http://127.0.0.1:5174/`: 4 `buyBlackjackSkill` buttons, Jetons costs, levels changed to 1 after purchases, 3 active skill buttons during a dealt hand, 4 blackjack cards rendered.
- Screenshot: `/tmp/library-magic-blackjack-functional-skills.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Functional blackjack skill system |
| What have I learned? | Existing list is preview-only |
| What have I done? | Implemented and verified functional blackjack skills |

Open risks:
- Balance values may need tuning after playtest.
- Card selection is intentionally simple for this pass; reroll targets are deterministic rather than user-picked.

Final score / loop closure:
- confidence score: 93/100
