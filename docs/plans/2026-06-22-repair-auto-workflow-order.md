# Repair auto workflow order

Objective:
Repair auto workflow order; done when local auto/project instructions start with
grill-with-docs before autogoal and source audit passes.

Goal plan:
docs/plans/2026-06-22-repair-auto-workflow-order.md

Template:
docs/plans/templates/goal-repair.md

Primary template:
docs/plans/templates/goal-repair.md

Applied packs:
- none

Expected behavior:
- `auto` must run `grill-with-docs` as the very first workflow step.
- `autogoal` must start only after `grill-with-docs`, carrying all remaining
  delivery steps.
- The repair must update the `auto` skill and any local project instruction that
  would otherwise reintroduce the old order.

Observed miss:
- `.agents/skills/auto/SKILL.md` described and executed
  `autogoal -> grill-with-docs -> ...`.
- `AGENTS.md` also documented the same wrong default workflow.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A: no duration requested.
- semantics: N/A: no timed checkpoint requested.
- initial confidence score: N/A: source-audit repair, not timed confidence loop.
- improvement loop: N/A: complete after audit and autoreview.
- final score / loop closure: N/A: report `score confiance` in final response.

Completion threshold:
- Source audit shows no local `auto`/project workflow line still ordering
  `autogoal` before `grill-with-docs`.
- `.agents/skills/auto/SKILL.md` description, numbered workflow, and default
  invocation shape all order `grill-with-docs` before `autogoal`.
- `AGENTS.md` default E2E workflow matches the repaired order.
- Goal completion check passes.

Verification surface:
- `rg` audit over `.agents/skills/auto/SKILL.md` and `AGENTS.md`.
- `git diff --check`.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-repair-auto-workflow-order.md`.

Constraints:
- Repair one expectation narrowly.
- Patch source-of-truth files, not generated skill mirrors.
- Do not weaken evidence safety or completion gates just to reduce annoyance.
- Do not broaden the repair to unrelated skills/templates.

Boundaries:
- Source of truth: latest `autogoal repair <expectation>` request.
- Allowed edit scope: `.agents/skills/auto/SKILL.md`, `AGENTS.md`, and this
  goal plan.
- Derived skill scope: `auto`; `autogoal` lifecycle rules are not changed.
- Non-goals: do not rewrite unrelated skills, do not change runtime game code,
  do not change GitHub repository configuration.

Blocked condition:
- Stop if another local source-of-truth with higher priority requires
  `autogoal` before `grill-with-docs`, because that would need a user decision.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Expected behavior, observed miss, boundaries, non-goals, verification surface, and completion threshold recorded above. |
| Timed checkpoint parsed | no | N/A: no duration requested. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation. Evidence: sections
      above.
- [x] Expected behavior and observed miss are concrete. Evidence: sections
      above.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. Evidence: N/A rows in timed
      checkpoint.
- [x] Source of truth for the missed rule is identified. Evidence:
      `.agents/skills/auto/SKILL.md` owns the `auto` workflow; `AGENTS.md`
      mirrors the project default.
- [x] Root cause is recorded before repair. Evidence: old `auto` skill and
      `AGENTS.md` both encoded the wrong sequence.
- [x] Repair updates the canonical surface. Evidence:
      `.agents/skills/auto/SKILL.md` patched.
- [x] Generated or downstream copies are refreshed only when applicable.
      Evidence: no generated `auto` mirrors found; `AGENTS.md` project default
      patched to stay in sync.
- [x] Final evidence proves the missed expectation is now satisfied. Evidence:
      see Verification evidence.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Root cause recorded | yes | Explain why the miss happened | Old `auto` workflow and `AGENTS.md` both put `autogoal` before `grill-with-docs`, so future auto runs inherited the wrong order. |
| Canonical source repaired | yes | Patch the real source of truth | `.agents/skills/auto/SKILL.md` patched to start with `grill-with-docs`, then `autogoal` for remaining steps. |
| Verification proof | yes | Run named proof or record blocker | See Verification evidence. |
| Autoreview | yes | Review repair against expected behavior, observed miss, and newest user request | Manual autoreview: repair is narrow, preserves evidence gates, does not change `autogoal` lifecycle, and syncs the only contradictory local project instruction found. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-repair-auto-workflow-order.md` | Passed: `[autogoal] complete: docs/plans/2026-06-22-repair-auto-workflow-order.md`. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | read `auto`, `grill-with-docs`, `autogoal`, and current project instruction references | repair |
| Repair | complete | patched `.agents/skills/auto/SKILL.md` and `AGENTS.md` | verification |
| Verification | complete | wrong-order audit returned no matches; good-order audit found repaired lines; `git diff --check` passed | closeout |
| Closeout | complete | final response prepared with repaired owner, verification, and score confiance | final response |

Timeline:
- 2026-06-22T15:54:35.321Z: repair plan created.
- 2026-06-22: patched `auto` skill to start with `grill-with-docs`.
- 2026-06-22: patched `AGENTS.md` default workflow to match the repaired order.
- 2026-06-22: verified no `autogoal -> grill-with-docs` or `Start with
  autogoal` matches remain in `.agents/skills/auto/SKILL.md` or `AGENTS.md`.
- 2026-06-22: verified repaired order appears in the `auto` description,
  numbered workflow, default invocation shape, and `AGENTS.md`.
- 2026-06-22: `git diff --check -- .agents/skills/auto/SKILL.md AGENTS.md docs/plans/2026-06-22-repair-auto-workflow-order.md` passed.
- 2026-06-22: `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-repair-auto-workflow-order.md` passed.

Verification evidence:
- `rg -n 'autogoal\s*->\s*grill-with-docs|Start with `autogoal`' .agents/skills/auto/SKILL.md AGENTS.md; test $? -eq 1` passed with no matches.
- `rg -n 'Start with `grill-with-docs`|Then start `autogoal`|grill-with-docs\s*->\s*autogoal|grill-with-docs, then autogoal' .agents/skills/auto/SKILL.md AGENTS.md` found the repaired lines.
- `git diff --check -- .agents/skills/auto/SKILL.md AGENTS.md docs/plans/2026-06-22-repair-auto-workflow-order.md` passed.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-22-repair-auto-workflow-order.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Verification complete |
| Where am I going? | Closeout |
| What is the goal? | Repair auto workflow order so `grill-with-docs` precedes `autogoal`. |
| What have I learned? | The miss existed in both `.agents/skills/auto/SKILL.md` and `AGENTS.md`. |
| What have I done? | See Timeline |

Open risks:
- Low: project `.agents/skills/auto/SKILL.md` is the active local `auto` skill;
  no generated `auto` mirrors were found in `.codex/skills` or `.claude/skills`.
