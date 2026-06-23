# {{TITLE}}

Objective:
TODO: Write the short create_goal objective, under 240 characters. Put the full
auto contract in the sections below.

Flow mode:
one-shot execution after the grill-with-docs phase.

Goal plan:
{{PLAN_PATH}}

Template:
{{TEMPLATE_PATH}}

Primary template:
{{TEMPLATE_PATH}}

Applied packs:
- TODO: Usually `browser` for games/UI; add `agent-native` when skills,
  prompts, hooks, commands, or agent tooling change.

Auto workflow source:
- auto skill: `.agents/skills/auto/SKILL.md`
- expected order:
  1. grill-with-docs
  2. autogoal for remaining steps
  3. to-prd
  4. to-issues
  5. implement first useful slice
  6. browser/game playtest
  7. review
  8. close with evidence

Task source:
- type: pending
- id / link: pending
- title: pending
- acceptance criteria: pending

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked `N/A: <reason>`.

Timed checkpoint:
- requested duration: pending
- semantics: pending
- initial confidence score: pending
- improvement loop: pending
- final score / loop closure: pending

Completion threshold:
- PRD issue exists, or `N/A: <reason>` is recorded for a micro task.
- Vertical slice issues exist, or `N/A: <reason>` is recorded for a micro task.
- The first useful slice is implemented or a blocker is recorded.
- Verification named in this plan passes.
- Browser/game proof is captured for UI/game work, or an explicit blocker/waiver
  names why it could not be captured.
- Review step is run and recorded before closeout.
- Final response lists PRD issue, slice issues, implemented issue/slice,
  verification proof, browser proof, review result, and `score confiance`.

Verification surface:
- `gh issue` commands or issue URLs for PRD/slice publication.
- Implementation verification commands, such as typecheck, build, tests, or
  source audit.
- Browser/game proof for UI/game work, using the repo-approved browser tool
  first and recording any fallback.
- Review evidence against `main` or the chosen fixed point.
- `node .agents/skills/autogoal/scripts/check-complete.mjs {{PLAN_PATH}}`.

Constraints:
- `grill-with-docs` must happen before this autogoal plan starts.
- After the grill-with-docs phase, do not stop for plan/issue/implementation approval
  unless there is a real blocker.
- Do not skip `review` before closeout.
- Do not claim a browser/game proof if the requested browser tool was
  unavailable; record the fallback honestly.
- Preserve unrelated dirty workspace changes.

Boundaries:
- Source of truth: user request plus `.agents/skills/auto/SKILL.md`.
- Allowed edit scope: pending.
- Browser surface: pending or `N/A: <reason>`.
- Tracker sync: GitHub Issues unless project docs say otherwise.
- Non-goals: pending.

Output budget strategy:
- Use focused reads and capped command output.
- For broad audits, prefer counts, filenames, or narrow `rg` patterns before
  printing full matches.
- Exclude generated assets, logs, `node_modules`, and build output unless they
  are the named source of truth.

Blocked condition:
- Stop only for missing tracker access, unsafe ambiguity, credentials or
  permissions failure, destructive action, or inability to run any honest
  verification path.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| grill-with-docs completed before autogoal | pending | pending |
| Prompt requirements captured before work | pending | pending |
| Timed checkpoint parsed | pending | pending |
| Active goal checked or created | pending | pending |
| Source of truth read before edits | pending | pending |
| Tracker target verified | pending | pending |
| PRD publication decision recorded | pending | pending |
| Slice publication decision recorded | pending | pending |
| First useful slice selected | pending | pending |
| TDD decision before behavior change or bug fix | pending | pending |
| Browser/game proof decision recorded | pending | pending |
| Review target selected before closeout | pending | pending |

Auto Step Ledger:
| Step | Status | Required evidence | Actual evidence |
|------|--------|-------------------|-----------------|
| 1. grill-with-docs | pending | Source/docs read, material questions asked or explicit no-question reason | pending |
| 2. autogoal | pending | Active goal handle and this plan path | pending |
| 3. to-prd | pending | PRD issue URL or `N/A: <reason>` | pending |
| 4. to-issues | pending | Slice issue URLs or `N/A: <reason>` | pending |
| 5. implement | pending | Implemented slice id/scope and changed owners | pending |
| 6. browser/game playtest | pending | Route, interaction, result, console/network caveat, and tool/fallback used | pending |
| 7. review | pending | Review target, findings, fixes/rejections | pending |
| 8. close with evidence | pending | Final response evidence checklist prepared | pending |

Work Checklist:
- [ ] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [ ] Objective, threshold, verification surface, constraints, boundaries, and
      blocked condition are concrete.
- [ ] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [ ] Auto Step Ledger is updated before moving past each step.
- [ ] PRD issue is created or explicitly marked `N/A: <reason>`.
- [ ] Vertical slice issues are created or explicitly marked `N/A: <reason>`.
- [ ] First useful slice is selected and implemented.
- [ ] Nearby implementation patterns are read before edits.
- [ ] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [ ] Browser/game proof uses the repo-approved browser tool first or records
      the unavailable tool and honest fallback.
- [ ] Review runs after implementation and verification, before closeout.
- [ ] Final handoff evidence list is assembled before closing the goal.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Auto workflow order | yes | Prove `grill-with-docs` happened before autogoal and every later step has ledger evidence | pending |
| PRD published | pending | Create PRD issue or record `N/A: <reason>` | pending |
| Slice issues published | pending | Create vertical slice issues or record `N/A: <reason>` | pending |
| Implemented slice | pending | Name the slice and changed owners | pending |
| Typecheck/build/test proof | pending | Run relevant owner checks or record `N/A: <reason>` | pending |
| Browser/game proof | pending | Exercise affected browser/game surface or record blocker/waiver | pending |
| Review | yes | Run review against chosen fixed point; record findings and fixes/rejections | pending |
| Final handoff completeness | yes | Confirm final response will list PRD issue, slice issues, implemented issue/slice, verification, browser proof, review result, and `score confiance` | pending |
| Timed checkpoint | pending | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise `N/A: <reason>` | pending |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs {{PLAN_PATH}}` | pending |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| grill-with-docs | complete | TODO: record evidence from before autogoal | autogoal |
| Autogoal setup | in_progress | created plan | PRD |
| PRD | pending | | issues |
| Issues | pending | | implementation |
| Implementation | pending | | browser/game proof |
| Browser/game proof | pending | | review |
| Review | pending | | closeout |
| Closeout | pending | | final response |

Findings:
- None yet.

Decisions and tradeoffs:
- None yet.

Review fixes:
- None yet.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| None yet | 0 | | |

Timeline:
- {{CREATED_AT}}: plan created.

Verification evidence:
- Pending.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Autogoal setup |
| Where am I going? | PRD, issues, implementation, browser/game proof, review, closeout |
| What is the goal? | TODO: Fill from Objective |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Pending.
