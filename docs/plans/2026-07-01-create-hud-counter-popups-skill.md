# create hud counter popups skill

Objective:
Create a repo-local hud-counter-popups skill for stable animated counters/popups in Library Magic.

Goal plan:
docs/plans/2026-07-01-create-hud-counter-popups-skill.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- agent-native (docs/plans/templates/packs/agent-native.md)

Task source:
- type: user request
- id / link: current Codex thread
- title: Create reusable skill for the counter/popup pattern just implemented
- acceptance criteria: skill exists under `.agents/skills`, captures stable DOM/state identity, includes verification guidance, and validates successfully.

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
- improvement loop: initialize skill, write SKILL.md, validate, improve quality score
- final score / loop closure: 97/100 skill quality analysis

Completion threshold:
`.agents/skills/hud-counter-popups` exists with valid SKILL.md and agents/openai.yaml, official skill validation passes, and the skill captures the TD counter/popup anti-reset pattern.

Verification surface:
- `python3 /Users/zbeyens/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/hud-counter-popups`
- `python3 .agents/skills/skill-creator-plus/scripts/analyze_skill.py .agents/skills/hud-counter-popups`
- Manual review of SKILL.md and agents/openai.yaml.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: the TD hover/damage animation reset fix and user request to reuse that pattern later.
- Allowed edit scope: `.agents/skills/hud-counter-popups`, plan file, user-local PyYAML installation needed for validator.
- Browser surface: N/A, no runtime UI change.
- Tracker sync: N/A, no issue requested.
- Non-goals: no changes to game behavior, no global Codex skill install, no PR/commit/push.

Current verdict:
- verdict: complete
- confidence: 97/100
- next owner: user
- reason: skill validates and quality analysis reports excellent.

Pre-solution issue challenge:
- reporter claim: future counter/popup implementations should reuse the pattern from the TD fix.
- suggested diagnosis or fix: create a repo-local skill documenting stable ids, DOM patching, and MutationObserver proof.
- repro ladder:
  - tests / source-level repro: N/A, this is skill creation rather than bug reproduction.
  - repo-owned automated browser or integration proof: N/A, no runtime UI change.
  - Browser plugin: N/A.
  - screenshot / visual proof: N/A.
- reproduction verdict: N/A
- validity verdict: valid skill extraction request
- best long-term fix boundary: repo-local `.agents/skills/hud-counter-popups`.
- harsh honest feedback: without a skill, this exact DOM reset bug is easy to recreate in the next mini-game.
- hard-stop decision: proceed.

Blocked condition:
Blocked only if the skill validator cannot run or the skill cannot be created under `.agents/skills`.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-01-create-hud-counter-popups-skill.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User asked for a skill to reuse the counter/popup pattern just implemented. |
| Timed checkpoint parsed | N/A | No duration requested. |
| Active goal checked or created | yes | create_goal called for this skill creation. |
| Source of truth read before edits | yes | skill-creator, skill-creator-plus, existing repo skills, and recent TD pattern. |
| Acceptance criteria captured | yes | Valid repo-local skill with stable counter/popup workflow. |
| Pre-solution issue challenge required | N/A | Feature/skill extraction request, not a bug report. |
| Reproduction verdict before implementation | N/A | No behavior bug to reproduce. |
| Repro escalation ladder selected | N/A | Skill artifact validation selected instead. |
| Suggested fix reviewed against durable boundary | yes | Repo-local `.agents/skills` is the correct boundary. |
| TDD decision before behavior change or bug fix | N/A | No runtime behavior change. |
| Browser proof decision for browser surface | N/A | No browser surface changed. |
| Agent-native pack selected | yes | Skill files under `.agents/**` changed. |
| Canonical agent source identified | yes | `.agents/skills/hud-counter-popups/SKILL.md`. |
| Validation command selected | yes | Official quick_validate plus skill-creator-plus analyzer. |

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
- [x] Agent-native pack: canonical source and generated/downstream copies are identified.
- [x] Agent-native pack: skill frontmatter and routing descriptions are checked when skills change.
- [x] Agent-native pack: validator or install check is run where available.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | Official quick_validate passed; analyzer score 97/100. |
| Pre-solution issue challenge verdict | N/A | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Skill extraction request, not bug report. |
| Repro escalation ladder | N/A | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | No behavior bug. |
| Bug reproduced before fix | N/A | Record failing test/repro or N/A with reason | No runtime bug in this request. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Skill artifact validated. |
| TypeScript or typed config changed | N/A | Run relevant typecheck | No TS/config code changed by this task. |
| Build-sensitive behavior changed | N/A | Run relevant build/check | No runtime build surface changed. |
| Browser surface changed | N/A | Capture browser proof | No browser surface changed. |
| Final lint/format | N/A | Run relevant lint/format command or record N/A | Skill validator is the applicable check. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | SKILL.md and openai.yaml reviewed; no extra resources needed. |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-01-create-hud-counter-popups-skill.md` | pending final checker rerun. |
| Agent source validation | yes | Run relevant agent/skill validation command | `Skill is valid!`; analyzer 97/100. |
| Generated/downstream sync | yes | Refresh or mark N/A with reason | agents/openai.yaml generated and corrected for `$hud-counter-popups`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | skill-creator and skill-creator-plus read | implementation |
| Implementation | complete | `.agents/skills/hud-counter-popups` created | verification |
| Verification | complete | quick_validate passed, analyzer 97/100 | closeout |
| Closeout | complete | manual review done | final response |

Findings:
- PyYAML was missing from the system Python, so `python3 -m pip install --user PyYAML` was needed to run the official validator.
- The generated default prompt initially lost `$hud` due shell expansion; corrected in agents/openai.yaml.

Decisions and tradeoffs:
- No scripts/references/assets were added because this skill is a compact implementation workflow; extra files would be clutter.
- The skill stays repo-local under `.agents/skills` instead of global `~/.codex/skills`.

Timeline:
- 2026-07-01T12:39:54.236Z: plan created.

Verification evidence:
- `python3 /Users/zbeyens/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/hud-counter-popups` -> Skill is valid.
- `python3 .agents/skills/skill-creator-plus/scripts/analyze_skill.py .agents/skills/hud-counter-popups` -> overall score 97/100.
- Files present: SKILL.md and agents/openai.yaml.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | final response |
| What is the goal? | Create validated repo-local skill for stable HUD counters/popups |
| What have I learned? | See Findings |
| What have I done? | Created and validated the skill |

Open risks:
- Low: this is a repo-local skill, so a running Codex session may need restart/reload before auto-discovery notices it.
