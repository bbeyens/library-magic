# td skill shop layout

Objective:
Refaire le layout des skills TD en shop a cartes/tabs reutilisable; termine quand TD utilise le nouveau composant, build et preuve navigateur passent.

Goal plan:
docs/plans/2026-06-28-td-skill-shop-layout.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request
- id / link: chat with screenshots
- title: TD skill shop layout
- acceptance criteria: TD detailed skills use a bottom/tabbed card shop inspired by the screenshots; implementation is reusable for other mini-games later; only TD is changed now; build and browser proof pass.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A, no duration requested
- initial confidence score: 82/100
- improvement loop: one implementation and verification loop unless build/browser proof fails
- final score / loop closure: 93/100 after build and browser proof

Completion threshold:
Done when `defenseUpgradePanel` renders through a reusable skill-shop card/tab helper, TD has Attack/Defense/Utility tabs with screenshot-like cards and cost pods, non-TD panels remain on their existing layout, `npm run build` passes, and browser proof can see the TD skill shop.

Verification surface:
- Source audit of `src/ui/hud.ts` and `src/style.css`.
- `npm run build`.
- Browser proof rendering the TD detailed upgrade panel and inspecting the new skill-shop/tabs/cards.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: current TD skill data in `defenseSkillTrack` and TD panel rendering in `src/ui/hud.ts`.
- Allowed edit scope: TD detailed upgrade panel layout, reusable helper types/functions, CSS for the new shop.
- Browser surface: defense book detailed upgrade panel.
- Tracker sync: N/A.
- Non-goals: no TD combat/economy changes, no migration of other mini-game skill panels yet.

Current verdict:
- verdict: valid UI redesign request
- confidence: 82/100
- next owner: task
- reason: existing TD detailed panel is row/node based; user wants a card shop layout with tabs like screenshots.

Pre-solution issue challenge:
- reporter claim: TD skills should use a mobile-game card/tabs shop layout and be reusable for other mini-games later.
- suggested diagnosis or fix: introduce a generic skill-shop renderer and feed TD categories into it.
- repro ladder:
  - tests / source-level repro: source read found `defenseUpgradePanel` custom rows and `defenseSkillTrack` data already suitable for card transformation.
  - repo-owned automated browser or integration proof: build and browser proof after patch.
  - Browser plugin: direct browser-use unavailable; use available node_repl browser automation.
  - screenshot / visual proof: DOM proof plus optional screenshot if browser renders cleanly.
- reproduction verdict: valid from source and screenshots.
- validity verdict: valid.
- best long-term fix boundary: generic skill-shop renderer plus TD-only data mapping.
- harsh honest feedback: copying the screenshot chrome literally would be dumb; the useful part is the card/tabs purchase grammar.
- hard-stop decision: continue.

Blocked condition:
Not blocked. Initial browser proof imported the wrong Vite module instance; final proof imported the exact loaded `store.ts?t=...` module and passed.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-28-td-skill-shop-layout.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | acceptance criteria copied above |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `create_goal` returned active goal |
| Source of truth read before edits | yes | inspected TD panel functions and CSS |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | source confirms existing row layout |
| Reproduction verdict before implementation | yes | valid UI redesign request |
| Repro escalation ladder selected | yes | source audit, build, browser proof |
| Suggested fix reviewed against durable boundary | yes | generic helper plus TD data only |
| TDD decision before behavior change or bug fix | yes | N/A visual/layout work; browser proof selected |
| Browser proof decision for browser surface | yes | render TD detailed upgrade panel |
| Browser pack selected | yes | generated browser pack applied |
| Browser route / app surface identified | yes | defense book upgrade panel |
| Browser tool decision recorded | yes | node_repl browser automation because browser-use is not exposed |

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
| Named verification threshold | complete | Run the named proof or record blocker | `npm run build`; browser proof on TD panel |
| Pre-solution issue challenge verdict | complete | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | complete | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source audit, build, browser proof |
| Bug reproduced before fix | complete | Record failing test/repro or N/A with reason | N/A visual feature request, not a bug |
| Targeted behavior verification | complete | Run focused test/proof for changed behavior or record N/A | TD shop opens and tab switch works |
| TypeScript or typed config changed | complete | Run relevant typecheck | `npm run build` includes `tsc` |
| Build-sensitive behavior changed | complete | Run relevant build/check | `npm run build` passed |
| Browser surface changed | complete | Capture browser proof | `/tmp/td-skill-shop-proof-final.png` |
| Final lint/format | complete | Run relevant lint/format command or record N/A | N/A no lint script run; build/typecheck passed |
| Autoreview | complete | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | final source and screenshot reviewed |
| Timed checkpoint | complete | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-28-td-skill-shop-layout.md` | first run caught two closeout bookkeeping gaps; fixed before final run |
| Browser interaction proof | complete | Exercise target route/interaction or record blocker | opened defense panel, clicked upgrade tile, switched Defense tab |
| Browser console/network check | complete | Record console/network state or N/A | no page errors, no failed requests; only Vite/Phaser startup logs |
| Browser final proof artifact | complete | Record screenshot/trace/route proof or exact caveat | `/tmp/td-skill-shop-proof-final.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan and inspected TD HUD/CSS | implementation |
| Implementation | complete | `skillShopPanel`, TD tabs/cards, CSS shop chrome | verification |
| Verification | complete | build plus browser proof | closeout |
| Closeout | complete | check-complete bookkeeping gaps fixed | final response |

Findings:
- Existing TD detailed skill UI was row/node based; its data mapped cleanly to a reusable card/tab renderer.
- Browser proof needs to import the exact Vite-loaded store module URL with timestamp, otherwise it creates a duplicate store and HUD does not render the selected panel.

Decisions and tradeoffs:
- Built reusable `skillShopPanel`/`SkillShopTab`/`SkillShopCard` helpers but only wired TD now, matching the request.
- Kept non-TD skill panels unchanged.
- Used Chrome via Playwright because `browser-use` was not exposed and bundled Playwright Chromium was missing.

Timeline:
- 2026-06-28T16:16:31.683Z: plan created.
- 2026-06-28T16:36:00Z: source audit confirmed reusable TD shop boundary.
- 2026-06-28T16:40:00Z: implemented generic skill shop renderer and TD Attack/Defense/Loot tabs.
- 2026-06-28T16:44:00Z: build passed after removing unused old TD row helpers.
- 2026-06-28T16:49:00Z: browser proof first failed due duplicate Vite store import; exact timestamped module import fixed it.
- 2026-06-28T16:53:00Z: adjusted card height and typography after screenshot showed cramped cards.
- 2026-06-28T16:56:00Z: final build and browser proof passed.

Verification evidence:
- Source audit: `src/ui/hud.ts` contains `skillShopPanel`, `SkillShopTab`, `SkillShopCard`, `defenseSkillShopTabs`, and `setDefenseSkillShopTab`.
- Source audit: `src/style.css` contains `.upgrade-panel.is-skill-shop`, `.skill-shop-card`, `.skill-shop-tabs`, and responsive rules.
- Build: `npm run build` passed with `tsc && vite build`; Vite reported only the existing chunk-size warning.
- Browser proof: Chrome/Playwright opened `http://127.0.0.1:5174/`, imported `/src/game/store.ts?t=1782600062454`, unlocked resources, selected TD, clicked upgrade tile, saw `.upgrade-panel.is-skill-shop`.
- Browser proof data: Attack tab had 7 cards (`Damage`, `Attack Speed`, `Damage / Meter`, `Critical Chance`, `Critical Multiplier`, `Super Crit Chance`, `Super Crit Multiplier`).
- Browser proof data: switched to Defense tab, selected tab was `defense`, visible cards were `Health`, `Health Regen`, `Resistance`, with `clippedCards: 0`.
- Browser console/network: no page errors and no failed requests; only Vite and Phaser startup logs.
- Screenshot proof: `/tmp/td-skill-shop-proof-final.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | TD uses reusable bottom skill shop layout |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- The current renderer is intentionally generic, but other mini-games still need mapping functions before they can use it.
