# floating gain perf

Objective:
Reduce lag caused by simultaneous `+1`, `+10`, `+15` floating reward popups across mini-games.

Goal plan:
docs/plans/2026-06-26-floating-gain-perf.md

Task source:
- type: user request
- id / link: chat
- title: Fix lag when multiple mini-games show floating reward numbers
- acceptance criteria:
  - Floating reward popups are capped or aggregated.
  - Visual reward feedback remains visible.
  - Browser proof shows no frame spikes under a reward burst.
  - Typecheck, build, and diff check pass.

Completion threshold:
Done when a browser burst proof through the real app path keeps `.floating-gain` nodes bounded, reports no frames over 16.8ms, and the CSS-only stress path also reports no slow frames.

Verification surface:
- Chrome headless burst proof using real `.mana-orb` clicks.
- Chrome headless CSS stress proof with many `.floating-gain` nodes.
- Screenshot proof: `/tmp/library-magic-floating-gain-after.png`.
- `npm run typecheck`
- `npm run build`
- `git diff --check`

Constraints:
- Preserve reward feedback on all mini-games.
- Do not change reward amounts or game economy.
- Do not rewrite unrelated panels.
- Ignore unrelated dirty workspace diffs.

Boundaries:
- Source of truth: `showFloatingGain()` in `src/ui/hud.ts` and `.floating-gain` CSS in `src/style.css`.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, this plan file.
- Browser surface: local app at `http://127.0.0.1:5173/`.
- Tracker sync: none requested.

Blocked condition:
Blocked only if the local browser app cannot load, reward popups cannot be triggered through the UI after three attempts, or the performance harness cannot read frame timing.

Current verdict:
- verdict: complete
- confidence: 96/100
- next owner: task
- reason: real app burst proof stayed at 120.3 fps with 0 frames over 16.8ms and max 6 `.floating-gain` nodes.

Pre-solution issue challenge:
- reporter claim: lag gets worse when `+1`, `+10`, `+15` reward numbers appear across mini-games.
- suggested diagnosis or fix: too many floating text nodes with expensive text-shadow/filter animation are created at once.
- repro ladder:
  - source-level repro: `showFloatingGain()` is called by Mana, Snake, Typing, TD, Blackjack, Hundred, Targets, Mine, and Slime Trainer.
  - browser proof: baseline burst created many `.floating-gain` elements and produced a 491.8ms worst frame.
  - minimised repro: direct `.floating-gain` burst isolated CSS/DOM cost; real `.mana-orb` burst tested the app path.
- reproduction verdict: valid. Baseline stress showed `maxFloatingGainNodes: 210`, `worstFrameMs: 491.8`, and `framesOver16_8ms: 5`.
- best long-term fix boundary: aggregate and cap transient reward effects, then remove expensive CSS paint work.
- hard-stop decision: proceed.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-floating-gain-perf.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | user reported lag from floating reward numbers |
| Active goal checked or created | yes | goal created |
| Source of truth read before edits | yes | `showFloatingGain()`, transient reward calls, `.floating-gain` CSS |
| Acceptance criteria captured | yes | see task source |
| Pre-solution issue challenge required | yes | perf regression report |
| Repro escalation ladder selected | yes | browser burst proof |
| TDD decision before behavior change or bug fix | yes | browser perf proof is the correct regression loop; no unit seam for frame spikes |
| Browser proof decision for browser surface | yes | required and completed |

Work Checklist:
- [x] Prompt requirements captured.
- [x] Baseline browser burst metrics captured.
- [x] Shared popup call sites audited.
- [x] Floating gains aggregated by target selector.
- [x] Visible floating gain nodes capped.
- [x] Expensive blur/filter animation removed from floating gains.
- [x] Browser proof captured after fix.
- [x] Verification commands run.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run browser burst proof and checks | passed |
| Pre-solution issue challenge verdict | yes | Record verdict | valid perf bug |
| Targeted behavior verification | yes | Browser proof | real app burst and CSS stress proof passed |
| TypeScript or typed config changed | yes | Run typecheck | `npm run typecheck` passed |
| Build-sensitive behavior changed | yes | Run build | `npm run build` passed with only existing large-chunk warning |
| Browser surface changed | yes | Capture browser proof | `/tmp/library-magic-floating-gain-after.png` |
| Final lint/format | yes | Run diff check | `git diff --check` passed |
| Debug cleanup | yes | Search debug traces | no `[DEBUG-...]` instrumentation added |
| Goal plan complete | yes | Run checker | first run found only closeout wording gaps; final run passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | reward popup call sites and CSS inspected | implementation |
| Repro | complete | baseline burst proof showed slow frame | implementation |
| Implementation | complete | aggregation/cap and cheaper CSS applied | verification |
| Verification | complete | browser proof and commands passed | closeout |
| Closeout | complete | checker wording gaps fixed and final checker passed | final response |

Findings:
- `showFloatingGain()` is shared by all mini-games that show reward numbers.
- The old implementation appended one DOM node per reward immediately.
- The old CSS animated `filter: blur()` with heavy text shadows, which is expensive when many reward numbers overlap.
- Baseline burst proof: `fps: 98.1`, `worstFrameMs: 491.8`, `framesOver16_8ms: 5`, `framesOver20ms: 1`, `maxFloatingGainNodes: 210`.

Decisions and tradeoffs:
- Aggregate rewards per target selector over 80ms so bursts become one visible number per mini-game area.
- Cap visible `.floating-gain` nodes at 18 to prevent runaway transient DOM.
- Keep the popup style readable but remove animated blur/filter.
- Keep mana sparks unchanged because the measured real path remained stable.

Verification evidence:
- Real app burst after fix: `clicks: 200`, `fps: 120.3`, `worstFrameMs: 9.4`, `framesOver16_8ms: 0`, `framesOver20ms: 0`, `maxFloatingGainNodes: 6`, `remainingFloatingGainNodes: 0`.
- CSS stress after fix: `fps: 120.2`, `worstFrameMs: 9.3`, `framesOver16_8ms: 0`, `framesOver20ms: 0`, `maxFloatingGainNodes: 110`.
- Screenshot: `/tmp/library-magic-floating-gain-after.png`.
- `npm run typecheck` passed.
- `npm run build` passed with only the existing Vite large-chunk warning.
- `git diff --check` passed.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-floating-gain-perf.md` passed after plan wording cleanup.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run autogoal checker and final response |
| What is the goal? | Remove lag spikes from floating reward numbers |
| What have I learned? | Popup DOM bursts plus blur/filter were the bad combination |
| What have I done? | Aggregated/capped popups and made the CSS cheaper |

Open risks:
- Headless Chrome is not the exact visible browser path, but the repro did show a severe baseline spike and the same harness is clean after the fix.
- If later all mini-games produce rewards every frame, the next target should be mini-game reward cadence, not popup rendering.
