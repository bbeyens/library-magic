# publish complete local work

Objective:
Publish every current local change and the two existing branch commits to GitHub; done when origin/main and origin/codex/all-minigames-project point to the same tested commit and the worktree is clean.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-07-10-publish-complete-local-work.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: direct user request
- id / link: N/A
- title: Push the complete current workspace
- acceptance criteria: all current modified and untracked project files committed; branch pushed; main fast-forwarded; remote refs verified; worktree clean

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: N/A

Completion threshold:
- Relevant tests and production build pass.
- One commit contains all current tracked and untracked workspace changes plus this publication plan.
- `origin/codex/all-minigames-project` and `origin/main` resolve to that commit.
- `git status --short` is empty after publication.

Verification surface:
- Repository test scripts and `npm run build`.
- `git diff --check` before commit.
- `git ls-remote origin refs/heads/main refs/heads/codex/all-minigames-project` after push.
- `git status --short --branch` after push.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- No force push, history rewrite, or dropped local file.
- Direct commit and push are explicitly requested; no PR is needed for a fast-forward publication.

Boundaries:
- Source of truth: current worktree plus commits on `codex/all-minigames-project`.
- Allowed edit scope: all current modified/untracked project files and this plan.
- Browser surface: N/A; publication state is verified through Git and GitHub refs.
- Tracker sync: GitHub repository `bbeyens/library-magic`.
- Non-goals: no squash, rebase, force push, branch deletion, PR, or release.

Output budget strategy:
- Use bounded status, diff-stat, test, and ref commands; do not print full asset or generated-file contents.

Current verdict:
- verdict: valid
- confidence: 100
- next owner: publication workflow
- reason: local branch, remote branch, main, and uncommitted workspace are demonstrably out of sync

Pre-solution issue challenge:
- reporter claim: the complete work was not pushed
- suggested diagnosis or fix: commit all local files and publish the branch to main
- repro ladder:
  - tests / source-level repro: `git status`, `git branch -vv`, and `git log` prove the mismatch
  - repo-owned automated browser or integration proof: N/A; this is repository state
  - Browser plugin: N/A; Git refs are authoritative
  - screenshot / visual proof: user screenshot agrees with Git state
- reproduction verdict: reproduced
- validity verdict: valid
- best long-term fix boundary: publish the current branch by fast-forwarding main after tests
- harsh honest feedback: the earlier push stopped at a feature branch and left newer edits uncommitted
- hard-stop decision: proceed; GitHub auth and fast-forward ancestry are available

Blocked condition:
- Stop only if tests fail without an in-scope repair, GitHub authentication fails, or main cannot be fast-forwarded without rewriting history.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-publish-complete-local-work.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | push completely means include all current local work and update main |
| Timed checkpoint parsed | N/A | no duration requested |
| Active goal checked or created | yes | no active goal found; goal creation follows this plan |
| Source of truth read before edits | yes | status, branches, log, remote, diff stat, and auth inspected |
| Acceptance criteria captured | yes | completion threshold above |
| Pre-solution issue challenge required | yes | mismatch reproduced from Git state |
| Reproduction verdict before implementation | yes | valid and reproduced |
| Repro escalation ladder selected | yes | Git refs are the authoritative surface |
| Suggested fix reviewed against durable boundary | yes | fast-forward main after branch commit and push |
| TDD decision before behavior change or bug fix | N/A | publication task; no new behavior change |
| Browser proof decision for browser surface | N/A | no browser behavior changed by publication |

Work Checklist:
- [ ] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [ ] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete.
- [ ] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [ ] Task source and acceptance criteria are captured.
- [ ] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason.
- [ ] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters.
- [ ] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path.
- [ ] Nearby implementation patterns are read before edits.
- [ ] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [ ] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason.
- [ ] Verification evidence is recorded beside each relevant gate.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | pending | Run the named proof or record blocker | pending |
| Pre-solution issue challenge verdict | pending | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | pending |
| Repro escalation ladder | pending | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | pending |
| Bug reproduced before fix | pending | Record failing test/repro or N/A with reason | pending |
| Targeted behavior verification | pending | Run focused test/proof for changed behavior or record N/A | pending |
| TypeScript or typed config changed | pending | Run relevant typecheck | pending |
| Build-sensitive behavior changed | pending | Run relevant build/check | pending |
| Browser surface changed | pending | Capture browser proof | pending |
| Final lint/format | pending | Run relevant lint/format command or record N/A | pending |
| Autoreview | pending | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | pending |
| Timed checkpoint | pending | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | pending |
| Goal plan complete | yes | Run `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-publish-complete-local-work.md` | pending |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Git status, refs, auth, diff stat inspected | verification |
| Implementation | complete | existing current worktree retained in full | verification |
| Verification | complete | `npm test` and retry of `npm run build` passed | commit and push |
| Closeout | pending | | final response |

Findings:
- `main` and `origin/main` are at `a5bf628`; the current branch and its remote are at `a6bae99`.
- Eight tracked files are modified and two files are untracked before plan creation.
- GitHub CLI is authenticated as `bbeyens`; origin uses SSH.

Decisions and tradeoffs:
- Include the complete worktree as explicitly requested, including `.claude/launch.json` and `tests/miningThreeCamera.test.ts`.
- Push the current branch first, then fast-forward `main` to the same commit; this keeps history linear and avoids a redundant PR.

Timeline:
- 2026-07-10T17:54:21.671Z: plan created.
- 2026-07-10: confirmed origin/main is an ancestor of the current branch and GitHub auth is valid.
- 2026-07-10: full `npm test` passed all 19 test files.
- 2026-07-10: first concurrent build hit transient `dist/assets` ENOTEMPTY; isolated retry passed.

Verification evidence:
- `git diff --check` -> pass.
- `npm test` -> pass, including Crystal, Snake, Mine, TD, Blackjack, and other game suites.
- `npm run build` retry -> pass; TypeScript and Vite production build succeeded.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Verified worktree, ready to commit |
| Where am I going? | Commit, branch push, main fast-forward, closeout |
| What is the goal? | Publish all current local work so branch and main share one tested remote commit |
| What have I learned? | See Findings |
| What have I done? | Audited scope and refs; passed full tests and production build |

Open risks:
- Tests may expose unrelated unfinished work that must be fixed before publication.
