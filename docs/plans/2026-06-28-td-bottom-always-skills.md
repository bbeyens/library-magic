# td bottom always skills

Objective:
TD skills always fill bottom; done when shop is persistent without top-left skill buttons and browser proof passes; plan docs/plans/2026-06-28-td-bottom-always-skills.md.

Goal plan:
docs/plans/2026-06-28-td-bottom-always-skills.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- browser (docs/plans/templates/packs/browser.md)

Task source:
- type: user request with screenshot
- id / link: chat
- title: TD bottom persistent skills shop
- acceptance criteria: TD has a layout like the screenshot; the skill shop fills the whole bottom area of the TD panel; the skill shop is visible without pressing a button; the top-left skill buttons are removed for TD; only TD is changed; build and browser proof pass.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: no duration requested
- initial confidence score: 86/100
- improvement loop: one implementation and browser verification loop, with visual correction if the screenshot proof shows obvious layout damage
- final score / loop closure: 94/100 after build, DOM proof, tab proof, and screenshot review

Completion threshold:
- TD `defensePanel` renders the skill shop persistently as a bottom dock.
- TD no longer renders the top-left upgrade/compact skill buttons.
- The dock fills the bottom width of the TD panel and does not require clicking the old upgrade button.
- `npm run build` passes.
- Browser proof opens TD and sees the persistent `.skill-shop-card` / `.skill-shop-tab` layout with no top-left skill buttons.

Verification surface:
- Source audit of `src/ui/hud.ts` and `src/style.css`.
- `npm run build`.
- Browser proof at `http://127.0.0.1:5174/` using Chrome/Playwright because browser-use is not exposed.
- Screenshot proof of TD panel.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `bookOverlay`, `defensePanel`, `defenseUpgradePanel`, and skill-shop CSS in `src/ui/hud.ts` and `src/style.css`.
- Allowed edit scope: TD panel layout, TD skill shop renderer options/classes, and related CSS.
- Browser surface: TD book panel after selecting/unlocking the defense book.
- Tracker sync: N/A.
- Non-goals: no TD combat/economy changes; no migration of other mini-game panels; no sprite/asset changes.

Current verdict:
- verdict: valid UI correction request
- confidence: 86/100
- next owner: task
- reason: current shop is a floating upgrade panel opened by top-left buttons; user wants it persistent and docked.

Pre-solution issue challenge:
- reporter claim: the current layout still behaves like an opened overlay and should instead be always visible in the bottom area, with no skill buttons at top-left.
- suggested diagnosis or fix: render the TD skill shop inside `defensePanel` as a docked lower section and disable generic upgrade controls for defense only.
- repro ladder:
  - tests / source-level repro: source read confirms `bookOverlay` renders top-left `.book-upgrade-tile` / `.upgrade-compact-tile` for defense and `defenseUpgradePanel` is only rendered through `openUpgradePanel`.
  - repo-owned automated browser or integration proof: build and browser proof after patch.
  - Browser plugin: browser-use not exposed; use Chrome/Playwright through node_repl.
  - screenshot / visual proof: final screenshot artifact.
- reproduction verdict: valid from source and previous browser proof.
- validity verdict: valid.
- best long-term fix boundary: keep generic `skillShopPanel`, but allow a docked variant and wire only TD to it.
- harsh honest feedback: the old top-left button made sense for optional overlays, but for TD it is now just extra chrome.
- hard-stop decision: continue.

Blocked condition:
- Blocked only if the app cannot build or browser proof cannot render the TD book panel after using the same Vite module import technique proven in the previous task.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-28-td-bottom-always-skills.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | copied screenshot/request criteria above |
| Timed checkpoint parsed | yes | no duration requested |
| Active goal checked or created | yes | `create_goal` created active goal |
| Source of truth read before edits | yes | read `bookOverlay`, `defensePanel`, `defenseUpgradePanel`, skill-shop CSS |
| Acceptance criteria captured | yes | see Task source |
| Pre-solution issue challenge required | yes | UI correction request, source repro recorded |
| Reproduction verdict before implementation | yes | valid from source |
| Repro escalation ladder selected | yes | source audit, build, browser proof, screenshot |
| Suggested fix reviewed against durable boundary | yes | generic dockable skill shop, TD-only wiring |
| TDD decision before behavior change or bug fix | yes | N/A visual layout; browser proof is the honest check |
| Browser proof decision for browser surface | yes | required |
| Browser pack selected | yes | browser pack applied |
| Browser route / app surface identified | yes | `http://127.0.0.1:5174/`, defense book panel |
| Browser tool decision recorded | yes | browser-use unavailable; use Chrome/Playwright through node_repl |

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
| Named verification threshold | complete | Run the named proof or record blocker | `npm run build` and browser proof passed |
| Pre-solution issue challenge verdict | complete | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | recorded above |
| Repro escalation ladder | complete | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | source read, build, browser proof, screenshot |
| Bug reproduced before fix | complete | Record failing test/repro or N/A with reason | N/A visual correction request, not a runtime bug |
| Targeted behavior verification | complete | Run focused test/proof for changed behavior or record N/A | browser proof found persistent shop, no top-left skill buttons, tab switch OK |
| TypeScript or typed config changed | complete | Run relevant typecheck | `npm run build` includes `tsc` |
| Build-sensitive behavior changed | complete | Run relevant build/check | `npm run build` passed |
| Browser surface changed | complete | Capture browser proof | `/tmp/td-bottom-always-skills-proof.png` |
| Final lint/format | complete | Run relevant lint/format command or record N/A | N/A no lint command run; build/typecheck passed |
| Autoreview | complete | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | screenshot reviewed against latest request |
| Timed checkpoint | complete | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-28-td-bottom-always-skills.md` | first run caught closeout status; fixed before final run |
| Browser interaction proof | complete | Exercise target route/interaction or record blocker | selected TD via Vite store import, shop was already visible without clicking upgrade button, clicked Utility tab by DOM event |
| Browser console/network check | complete | Record console/network state or N/A | no failed requests, no page errors; only Vite/Phaser startup logs |
| Browser final proof artifact | complete | Record screenshot/trace/route proof or exact caveat | `/tmp/td-bottom-always-skills-proof.png` |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | created plan, read HUD/CSS owners | implementation |
| Implementation | complete | docked skill shop option, TD controls removed, persistent `defense-skill-dock` added | verification |
| Verification | complete | build and browser proof passed | closeout |
| Closeout | complete | check-complete closeout status fixed | final response |

Findings:
- Current `bookOverlay` renders skill controls for every book except typing.
- Current TD shop only appears when `openUpgradePanel === 'defense'`.
- Existing `skillShopPanel` can be kept reusable; it needs a docked variant/class and optional compact button.
- Final browser proof: TD overlay rendered at 552x690, arena 552x418.7, dock 552x271.3, dock filled overlay width and touched bottom.
- Final browser proof: no `.book-upgrade-tile` or `.upgrade-compact-tile` inside the TD overlay.

Decisions and tradeoffs:
- Keep `skillShopPanel` generic instead of hardcoding TD-only markup. Add options for docked mode and compact button visibility.
- Remove top-left skill controls for TD only by making `hasUpgradeControls` false for `defense`.
- Let the TD overlay become taller than a square (`aspect-ratio: 4 / 5`) so the arena and dock can coexist instead of crushing the playfield.

Timeline:
- 2026-06-28T17:42:25.401Z: plan created.
- 2026-06-28T17:42:46Z: active goal created.
- 2026-06-28T17:44:00Z: source read confirms current button/open-panel wiring.
- 2026-06-28T17:49:00Z: implemented docked skill shop option and persistent TD dock.
- 2026-06-28T17:50:00Z: `npm run build` passed.
- 2026-06-28T17:57:00Z: browser proof passed; screenshot reviewed.

Verification evidence:
- Source audit: `src/ui/hud.ts` sets `hasUpgradeControls` false for `defense`, renders `defenseSkillShop(... { docked: true, showCompactButton: false })` inside `defensePanel`, and keeps the generic `skillShopPanel` reusable through `SkillShopPanelOptions`.
- Source audit: `src/style.css` defines `.upgrade-panel.is-skill-shop.is-docked`, `.defense-skill-dock`, and a taller TD overlay with a bottom dock.
- Build: `npm run build` passed with `tsc && vite build`; only the existing chunk-size warning remained.
- Browser proof: Chrome/Playwright opened `http://127.0.0.1:5174/`, selected defense, and saw persistent shop without clicking an upgrade button.
- Browser proof data: `persistentShop: true`, `topLeftSkillButtons: 0`, `floatingUpgradePanels: 0`, `dockFillsOverlayWidth: true`, `dockTouchesOverlayBottom: true`, `dockBelowArena: true`.
- Browser proof data: Attack tab had 7 cards; Utility tab switch worked and showed `Range`, `Ricochet Count`, `Ricochet Chance`, `Gold / Enemy`, `Gold / Wave`.
- Browser console/network: no page errors and no failed requests; only Vite and Phaser startup logs.
- Screenshot proof: `/tmp/td-bottom-always-skills-proof.png`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Persistent bottom TD skill shop with no top-left skill buttons |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Card text can still be tuned visually if the user wants denser or larger cards, but the requested persistent bottom layout is proven.
