# autonomous skill selection rule

Objective:
Add autonomous skill-selection rule to `AGENTS.md`; done when the file contains a verified rule requiring Codex to choose relevant skills without user prompting.

Goal plan:
docs/plans/2026-06-26-autonomous-skill-selection-rule.md

Template:
docs/plans/templates/docs.md

Primary template:
docs/plans/templates/docs.md

Applied packs:
- agent-native (docs/plans/templates/packs/agent-native.md)

Docs source:
- type: user request
- id / link: N/A: no ticket
- title: autonomous skill selection rule
- acceptance criteria: `AGENTS.md` states that Codex must infer and use relevant skills from task context without waiting for the user to name them; verify with `rg`.

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
- initial confidence score: N/A: small docs edit with direct source audit
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- `AGENTS.md` contains one explicit rule under `Agent skills` requiring autonomous skill selection from task context.
- The rule preserves specific skill triggers such as `tdd`, `spriterrific`, `autogoal`, and `agent-native-reviewer`.

Verification surface:
- `rg -n` source audit against `AGENTS.md`.
- Final review against the newest user request and existing skill rules.

Constraints:
- Follow nearest existing docs style.
- Write current-state docs only. No changelog voice.
- Keep examples repo-backed and copy-pasteable.
- Do not invent APIs, routes, demos, imports, components, transforms, or options.

Boundaries:
- Source of truth: `AGENTS.md`.
- Allowed edit scope: `AGENTS.md` and this plan.
- Browser surface: N/A: no browser behavior.
- Non-goals: do not edit installed skill bodies; do not change unrelated dirty files; do not commit or push.

Blocked condition:
- Stop only if `AGENTS.md` cannot be written or verification cannot read the file.

Completion rule:
- Do not call `update_goal(status: complete)` until required checks are closed and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-autonomous-skill-selection-rule.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User wants a project rule so Codex estimates relevant skills without being asked which skill to use. |
| Timed checkpoint parsed | N/A: no duration requested | Timed checkpoint section resolved. |
| Active goal checked or created | yes | `get_goal` returned no active goal; goal created for this docs change. |
| Target docs read | yes | Read `AGENTS.md` before editing. |
| Nearest sibling docs read | N/A: single project instruction file change | The target section already contains skill-routing policy. |
| Documented source code read | N/A: no code behavior documented | This documents agent workflow behavior. |
| Agent-native pack selected | yes | Agent-native pack applied because project agent instructions changed. |
| Canonical agent source identified | yes | Canonical source is project `AGENTS.md`. |
| Validation command selected | yes | Verify with `rg -n "autonomously select|without waiting" AGENTS.md`. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Target docs and nearest sibling docs were read before writing. Evidence: `AGENTS.md` read; sibling docs N/A for one-file project instruction update.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. Evidence: N/A, no duration.
- [x] Documented behavior or API was verified against current source. Evidence: current `AGENTS.md` skill section read.
- [x] Fastest success path appears before deeper mechanics or API reference. Evidence: rule is placed directly under `Agent skills`.
- [x] Named APIs, imports, routes, options, and examples are exact and current. Evidence: N/A, no API/import/route examples.
- [x] Links and anchors target real pages or are marked N/A. Evidence: N/A, no links added.
- [x] Agent-native pack: canonical source and generated/downstream copies are identified. Evidence: `AGENTS.md` is canonical; no generated downstream copy.
- [x] Agent-native pack: skill frontmatter and routing descriptions are checked when skills change. Evidence: N/A, no skill body/frontmatter changed.
- [x] Agent-native pack: validator or install check is run where available. Evidence: source audit with `rg` selected; no install validator for project instruction text.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Docs source-backed claim audit | yes | Verify docs claims against current source | `rg -n "autonomously select|before asking the user to name one|multiple skills" AGENTS.md` returned lines 3-4. |
| Docs links / routes / previews | N/A: no links/routes/previews added | Verify or record N/A | No links or routes changed. |
| Docs parser/build | N/A: markdown instruction file only | Run relevant docs parser/build or record N/A | Source audit is the relevant validation. |
| Autoreview | yes | Review final docs against objective, constraints, source truth, and newest user request | Passed: rule is explicit, placed under `Agent skills`, and preserves asking only when skill choice materially changes the outcome. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No timed checkpoint. |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-autonomous-skill-selection-rule.md` | Passed: `[autogoal] complete: docs/plans/2026-06-26-autonomous-skill-selection-rule.md`. |
| Agent source validation | yes | Run relevant agent/skill validation command | `rg` source audit passed against `AGENTS.md`; no skill body/frontmatter changed. |
| Generated/downstream sync | N/A: no generated/downstream copy | Refresh or mark N/A with reason | Project `AGENTS.md` is the source. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read `AGENTS.md`; created plan; active goal created. | writing |
| Writing | complete | Added autonomous skill-selection rule under `Agent skills`. | verification |
| Verification | complete | `rg` found the new rule at `AGENTS.md:3-4`; diff review shows only the intended `AGENTS.md` addition plus this plan. | closeout |
| Closeout | complete | Plan updated; final mechanical check selected. | final response |

Findings:
- The existing `Agent skills` section already contains specific skill triggers; the missing rule is the general default that Codex should infer skills itself.

Timeline:
- 2026-06-26T13:58:46.692Z: plan created.
- 2026-06-26T14:00: added autonomous skill-selection rule to `AGENTS.md`.
- 2026-06-26T14:01: verified with `rg -n "autonomously select|before asking the user to name one|multiple skills" AGENTS.md`.
- 2026-06-26T14:02: autogoal checker passed.

Verification evidence:
- `rg -n "autonomously select|before asking the user to name one|multiple skills" AGENTS.md` returned lines 3-4.
- `git diff -- AGENTS.md docs/plans/2026-06-26-autonomous-skill-selection-rule.md` shows the intended `AGENTS.md` addition and this plan.
- `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-autonomous-skill-selection-rule.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Add an autonomous skill-selection rule to `AGENTS.md`. |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Risk: wording must not override specific skill rules; it should make autonomous selection the default before asking the user.
