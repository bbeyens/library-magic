# mana crystal click effects

Objective:
Ajouter les effets de clic du cristal mana; done when halo, counters, capped particles, build, and browser proof pass.

Goal plan:
docs/plans/2026-06-27-mana-crystal-click-effects.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: direct user request with video reference
- id / link: `/var/folders/v0/m9v03dm522qgkml9w0kr6m_m0000gn/T/TemporaryItems/NSIRD_screencaptureui_EXorjB/Screen Recording 2026-06-27 at 23.48.53.mov`
- title: "je veux ce genre d'effet..."
- acceptance criteria: rotating white lighting around the mana crystal; on click, falling mana orbs capped to 20 per second; above 20 mana/sec, falling mini crystals at one per 20 mana/sec with at most 50 alive; translucent box with total mana and "per second" under it; keep current crystal sprite and gameplay intact.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A: no duration requested
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Mana panel contains a translucent counter box with mana total and recent mana/sec.
- Crystal has a rotating white light effect around/behind it.
- Manual crystal clicks create falling mana-orb particles, capped at 20 small orbs per second.
- When recent mana/sec exceeds 20, mini-crystal particles fall at `floor(recentManaPerSecond / 20)`, capped to 50 concurrent mini crystals.
- Existing mana click, crystal idle sprite, and wand/click classes still work.
- `npm run build` passes and browser proof captures the effect surface.

Verification surface:
- Source audit of `src/ui/hud.ts` and `src/style.css`.
- `npm run build`.
- Browser proof on local Vite app: open mana panel, click crystal, inspect DOM particle/counter state, capture screenshot, check console/network.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: user video reference frames in `/tmp/library-magic-effect-reference/`, current mana panel implementation in `src/ui/hud.ts`, current visual owner in `src/style.css`.
- Allowed edit scope: `src/ui/hud.ts`, `src/style.css`, this plan.
- Browser surface: local Vite app, mana book panel.
- Tracker sync: N/A.
- Non-goals: changing mana economy, regenerating the crystal sprite, changing other mini-games, adding new image generation output.

Current verdict:
- verdict: valid
- confidence: 87/100
- next owner: task
- reason: this is a presentation-layer effect around an existing CSS/DOM mana panel; the requested caps can be enforced in HUD code without touching simulation math.

Pre-solution issue challenge:
- reporter claim: add a cookie-clicker-like click visual effect to the mana crystal.
- suggested diagnosis or fix: implement HUD-only particle spawning plus CSS halo/counter presentation.
- repro ladder:
  - tests / source-level repro: source audit and build.
  - repo-owned automated browser or integration proof: local browser proof with clicked mana panel.
  - Browser plugin: project asks for browser-use first, but tool is not exposed in this session; use Node REPL with local Chrome.
  - screenshot / visual proof: screenshot after synthetic click burst.
- reproduction verdict: N/A: feature/effect request.
- validity verdict: valid.
- best long-term fix boundary: `src/ui/hud.ts` for event/cap logic, `src/style.css` for presentation.
- harsh honest feedback: putting this in simulation would be the wrong layer; this is sparkle math, not game economy.
- hard-stop decision: proceed with HUD/CSS only.

Blocked condition:
- Stop only if the local app cannot render the mana panel for browser proof after a passing build.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mana-crystal-click-effects.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Captured halo, falling mana orbs, caps, mini crystals, and counter box requirements. |
| Timed checkpoint parsed | N/A: no duration requested | No duration in prompt. |
| Active goal checked or created | yes | `get_goal` returned none; goal created. |
| Source of truth read before edits | yes | Read video metadata/contact sheet, `manaPanel`, `showCrystalClickEffect`, current CSS owner, autogoal, Spriterrific. |
| Acceptance criteria captured | yes | See Completion threshold. |
| Pre-solution issue challenge required | yes | Feature request; boundary recorded above. |
| Reproduction verdict before implementation | N/A: feature/effect request | No bug reproduction needed. |
| Repro escalation ladder selected | yes | Source audit, build, browser proof. |
| Suggested fix reviewed against durable boundary | yes | HUD/CSS is the durable owner. |
| TDD decision before behavior change or bug fix | N/A: visual presentation effect | No deterministic gameplay rule change; browser proof is the meaningful test. |
| Browser proof decision for browser surface | yes | Required because visual surface changes. |
| Browser pack selected | yes | Browser pack applied. |
| Browser route / app surface identified | yes | Local Vite app mana book panel. |
| Browser tool decision recorded | yes | `browser-use` unavailable; use Node REPL + local Chrome fallback. |

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
| Named verification threshold | yes | Run the named proof or record blocker | Counter box, rotating light, small falling orbs, mini crystals, and caps were implemented; build/browser proof recorded below. |
| Pre-solution issue challenge verdict | yes | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Recorded above before implementation. |
| Repro escalation ladder | N/A: feature/effect request | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Source audit, build, browser proof, and screenshot were used. |
| Bug reproduced before fix | N/A: not a bug | Record failing test/repro or N/A with reason | Feature/effect request. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Browser proof after click burst: `fallingOrbs: 20`, `fallingCrystals: 2`, `manaPerSecondText: 51`, `lightAnimation: mana-crystal-light-spin`. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run build` includes `tsc` and passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed. |
| Browser surface changed | yes | Capture browser proof | Screenshot `/tmp/library-magic-mana-click-effects-capped.png` confirms counter box, halo, and particles on the mana panel. |
| Final lint/format | N/A: no separate lint command | Run relevant lint/format command or record N/A | `package.json` has build/test/typecheck; build passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | First proof found cap bug (`fallingOrbs: 30`); fixed with DOM pruning; second proof confirms caps. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-27-mana-crystal-click-effects.md` | First check found missing closeout evidence; plan updated and check rerun. |
| Browser interaction proof | yes | Exercise target route/interaction or record blocker | Opened mana panel, applied debug max mana skills for test gain, clicked crystal three times, inspected DOM state. |
| Browser console/network check | yes | Record console/network state or N/A | No failed requests; console only showed Vite connection logs and Phaser banner. |
| Browser final proof artifact | yes | Record screenshot/trace/route proof or exact caveat | `/tmp/library-magic-mana-click-effects-capped.png`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan; extracted video frames; read current HUD/CSS owner | implementation |
| Implementation | complete | added counter box, rotating light, falling particle layer, capped spawn logic | verification |
| Verification | complete | source audit, build, browser proof, cap proof | closeout |
| Closeout | complete | first goal-plan check reported missing closeout evidence; plan updated for final rerun | final response |

Findings:
- Video reference: central clickable object, white radial spinning burst behind it, soft falling light orbs, resource counter at top with per-second line.
- Current mana panel has a CSS-owned crystal, click shake/scale, radial sparks, and a floating gain system.
- Current mana economy click gain comes from simulation; HUD can use the actual gained amount already passed to `showCrystalClickEffect`.
- Existing dynamic text updates already handle `data-dynamic-value="mana"`.
- First browser proof showed `fallingOrbs: 30`, which violated the requested `20/sec` cap.

Decisions and tradeoffs:
- Keep effects HUD-only so simulation/economy remains untouched.
- Use DOM particles instead of generated assets: requested particles are simple glowing orbs/mini crystals around an existing sprite, not a new character/object spritesheet.
- Interpret "20/sec" as a visual spawn cap per one-second rolling window, based on recent clicked mana gains.
- Add DOM pruning after spawn as a hard visual cap, because event timing can otherwise exceed the intended particle count.

Timeline:
- 2026-06-27T21:59:41.536Z: plan created.
- 2026-06-27: extracted video reference frames and read current mana HUD/CSS code.
- 2026-06-27: implemented counter box, rotating light, falling orbs, and mini-crystal particles.
- 2026-06-27: build passed.
- 2026-06-27: first browser proof found too many small orbs; added DOM cap pruning.
- 2026-06-27: second browser proof confirmed small-orb and mini-crystal caps.

Verification evidence:
- `ffprobe` showed the reference video is `512x532`, duration about `6.13s`; frames extracted to `/tmp/library-magic-effect-reference/`.
- `rg -n "mana-counter-box|mana-fall-layer|mana-crystal-light|MANA_FALLING_ORB_CAP_PER_SECOND|MANA_FALLING_CRYSTAL_MAX_VISIBLE|spawnManaFallParticles|currentManaPerSecond|mana-per-second|mana-skyfall" src/ui/hud.ts src/style.css` found the new owners.
- `npm run build` passed after implementation and after cap fix.
- Browser proof after click burst: `manaPerSecondText: 51`, `fallingOrbs: 20`, `fallingCrystals: 2`, `expectedCrystalTarget: 2`, `counterVisible: true`, `lightAnimation: mana-crystal-light-spin`, no failed requests.
- Browser cap proof with test gain `2001/sec`: `fallingOrbs: 20`, `fallingCrystals: 50`.
- Screenshot proof: `/tmp/library-magic-mana-click-effects-capped.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Run goal-plan check, then final response |
| What is the goal? | Add the requested mana crystal lighting/click particle/counter effects. |
| What have I learned? | HUD/CSS owns this effect, and DOM pruning is needed to enforce visual particle caps under rapid events. |
| What have I done? | Implemented the effect, fixed the cap bug, verified build/browser/caps. |

Open risks:
- Visual taste may still need tuning, but the requested mechanics and caps are implemented and verified.
