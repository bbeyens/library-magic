# publish all minigames

Objective:
Publish the complete Library Magic workspace; done when all non-temporary project files are committed, pushed, and represented by a draft PR; plan docs/plans/2026-07-10-publish-all-minigames.md.

Flow mode:
one-shot execution

Goal plan:
docs/plans/2026-07-10-publish-all-minigames.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- docs (docs/plans/templates/packs/docs.md)

Task source:
- type: direct user request
- id / link: N/A
- title: Push the complete project, including every mini-game
- acceptance criteria: every tracked and untracked project file for all mini-games, assets, docs, skills, scripts, and Godot is committed and pushed; generated `tmp/` diagnostics and secrets are excluded; checks and draft PR are recorded.

First checkpoint:
- Before implementation or broad exploration, copy every explicit prompt
  requirement into this plan as checkable checkpoints: scope, non-goals,
  timing/duration, stop conditions, deliverables, final handoff sections,
  verification surface, and success criteria.
- Do not continue into implementation until this extraction is complete or
  explicitly marked N/A with reason.

Timed checkpoint:
- requested duration: none
- semantics: N/A
- initial confidence score: 88/100
- improvement loop: audit scope and file sizes, exclude temporary output, run full checks, inspect staged coverage, push, and verify PR.
- final score / loop closure: final response includes score confiance.

Completion threshold:
- All non-temporary changes reported by Git are staged and committed on one `codex/` branch.
- The branch is pushed to `origin` with tracking and a draft PR against `main` is open.
- `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check` pass or an exact external blocker is recorded.
- Final workspace audit reports no forgotten project files; only ignored/generated output may remain outside the commit.

Verification surface:
- Git scope audit: status, staged file list/count, largest-file audit, secret-name audit, and final clean status.
- Commands: `npm run typecheck`, `npm test`, `npm run build`, and `git diff --check`.
- GitHub: pushed branch, commit SHA, and draft PR URL.

Constraints:
- Include all mini-games and their shared project files.
- Do not publish generated `tmp/`, dependency folders, build output, or credentials.
- Preserve the current working tree content; do not rewrite or revert earlier work.

Boundaries:
- Source of truth: user request, current Git working tree, `AGENTS.md`, package scripts, and GitHub remote `bbeyens/library-magic`.
- Allowed edit scope: the complete repository except temporary/generated/private files; this publication plan and `.gitignore` may be updated to make that boundary durable.
- Browser surface: N/A for publication; prior UI proof artifacts are included and full build/tests own verification.
- Tracker sync: draft GitHub PR against `main`.
- Non-goals: merging the PR, rewriting features, or publishing `tmp/` diagnostic output.

Current verdict:
- verdict: complete
- confidence: 98/100
- next owner: user review of draft PR #58
- reason: every non-temporary project file is committed and pushed; full checks, scope audit, branch tracking, and PR proof pass.

Pre-solution issue challenge:
- reporter claim: N/A, this is a publication request rather than a bug report.
- suggested diagnosis or fix: publish the complete current project in one branch and PR.
- repro ladder:
  - tests / source-level repro: N/A; use full verification suite.
  - repo-owned automated browser or integration proof: N/A; publication does not alter behavior beyond existing workspace state.
  - Browser plugin: N/A; no new browser behavior is implemented in this task.
  - screenshot / visual proof: existing proof artifacts are included where prior mini-game tasks created them.
- reproduction verdict: N/A, no bug claim.
- validity verdict: valid.
- best long-term fix boundary: one comprehensive branch from the current workspace.
- harsh honest feedback: publishing `tmp/` would add disposable multi-megabyte frames and is not part of the project.
- hard-stop decision: proceed unless credentials, remote limits, or failing checks cannot be resolved.

Blocked condition:
- Stop only if GitHub rejects the push/PR, a file exceeds remote limits, credentials fail, or verification reveals a failure that cannot be resolved without changing user-owned behavior.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-publish-all-minigames.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | Whole project and every mini-game requested; generated/private exclusions recorded. |
| Timed checkpoint parsed | N/A: no duration requested | No timed requirement. |
| Active goal checked or created | yes | Goal `019f41dc-55e9-7191-b974-050bf461d370` created from this filled plan. |
| Source of truth read before edits | yes | User request, Git status, remote/auth state, skills, package scripts, and file-size/secret audits read. |
| Acceptance criteria captured | yes | Task source and completion threshold above. |
| Pre-solution issue challenge required | N/A: publication request | No behavior claim to reproduce. |
| Reproduction verdict before implementation | N/A: publication request | No bug claim. |
| Repro escalation ladder selected | N/A: publication request | Full suite and Git audits are the verification surface. |
| Suggested fix reviewed against durable boundary | yes | One comprehensive branch; `tmp/` excluded as generated output. |
| TDD decision before behavior change or bug fix | N/A: no behavior edit | This task only publishes existing workspace state. |
| Browser proof decision for browser surface | N/A: no new browser behavior | Existing browser proofs are artifacts; tests/build own this task. |
| Docs pack selected | yes | Existing and new plan/docs are part of the publication scope. |
| Target docs and nearest sibling docs read | yes | Current publication plan plus existing mini-game plan inventory were audited through Git status. |
| Documented source owner identified | yes | Current repository source and package scripts are authoritative. |

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
- [x] Nearby implementation patterns are read before edits. N/A: no feature implementation; Git/PR workflow and package scripts are the owners.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason.
- [x] Verification evidence is recorded beside each relevant gate.
- [x] Docs pack: target docs, nearest sibling docs, and source owner are recorded.
- [x] Docs pack: named APIs, imports, options, routes, components, demos, and previews are source-backed or marked N/A. N/A: this task adds only a publication ledger; existing docs are published as authored by their owning tasks.
- [x] Docs pack: docs use current-state reference voice, not changelog voice. Publication ledger is operational evidence; existing docs are unchanged.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | All named checks passed; commit `e28e064`, tracked remote branch, and draft PR #58 prove publication. |
| Pre-solution issue challenge verdict | N/A: publication request | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | No bug claim; request is valid and whole-workspace scope is explicit. |
| Repro escalation ladder | N/A: publication request | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | No behavior diagnosis performed. |
| Bug reproduced before fix | N/A: publication request | Record failing test/repro or N/A with reason | No fix requested. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `npm test` passed all 18 test files across the mini-games. |
| TypeScript or typed config changed | yes | Run relevant typecheck | `npm run typecheck` passed. |
| Build-sensitive behavior changed | yes | Run relevant build/check | `npm run build` passed; only Vite's existing bundle-size warning remained. |
| Browser surface changed | N/A: publication-only task | Capture browser proof | Existing proof artifacts are included; no new UI edit was made in this task. |
| Final lint/format | N/A: no lint script | Run relevant lint/format command or record N/A | `git diff --check` passed. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Staged audit confirms 673 files, zero unstaged files, zero untracked project files, no secret-like names, and `tmp/` excluded. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No timed checkpoint. |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-publish-all-minigames.md` | Passed after recording PR #58 and all final evidence. |
| Docs source-backed claim audit | yes | Verify docs claims against current source | Publication plan claims are backed by Git/package command evidence; existing feature docs remain owned by their prior tasks. |
| Docs links / routes / previews | N/A: no new links/routes | Verify or record N/A | No new product route or external docs link added. |
| Docs parser/build | N/A: no docs parser | Run relevant docs parser/build or record N/A | Main `npm run build` passed. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | scope, remote/auth, size, secret, and temporary-output audits complete | implementation |
| Implementation | complete | branch created; `tmp/` ignored; Godot export refreshed; all 673 project files staged | commit and push |
| Verification | complete | typecheck, 18 tests, build, diff check, Godot export, staged coverage, push, branch tracking, and PR proof passed; Godot CLI unavailable | closeout |
| Closeout | complete | draft PR #58 open; final plan checker is the last mechanical audit | final response |

Findings:
- Git scope includes all mini-games, shared TypeScript/CSS/HUD, assets, skills, docs, scripts, and a Godot port.
- No untracked secret-like filenames were found.
- `tmp/` contains disposable screenshots, extracted frames, and diagnostics, including individual files up to 7.3 MB.
- After exclusion, Git reports 135 changed status entries and 615 untracked project file paths; largest project artifact is 3.1 MB, well below GitHub's per-file limit.
- `npm run godot:export` passed; the Godot editor CLI is not installed on this machine, so native project launch cannot be checked here.

Decisions and tradeoffs:
- Exclude `tmp/` and add it to `.gitignore` -> it is generated diagnostic output, not project source -> avoids repository bloat while preserving every mini-game deliverable.

Timeline:
- 2026-07-10T14:10:30.878Z: plan created.
- 2026-07-10: audited Git scope, GitHub auth/remote, untracked file sizes, secret-like names, and `tmp/` contents; active goal created.
- 2026-07-10: created `codex/all-minigames-project`; typecheck, all tests, build, diff check, and Godot export passed.
- 2026-07-10: staged 673 files covering every project change; zero unstaged and zero untracked project files remain; normalized whitespace in four generated/report files.
- 2026-07-10: committed `e28e064`, pushed `codex/all-minigames-project`, and opened draft PR #58 against `main`.
- 2026-07-10: final autogoal checker passed.

Error attempts:
| Error / failed attempt | Count | Next different move | Resolution |
|------------------------|-------|---------------------|------------|
| Repo-local autogoal helper missing | 1 | Use the installed global autogoal helper | Plan created successfully. |
| `godot` CLI unavailable | 1 | Use project export script and record native-run caveat | Export passed; native launch remains unverified. |

Verification evidence:
- `npm run typecheck` -> passed.
- `npm test` -> all 18 test files passed.
- `npm run build` -> passed with bundle-size warning only.
- `git diff --check` -> passed.
- `npm run godot:export` -> passed.
- Scope audit -> no secret-like untracked files, no `tmp/` status entries, largest project file 3.1 MB.
- Staged coverage -> 673 files, zero unstaged files, zero untracked non-ignored files; `git diff --cached --check` passed.
- Git commit -> `e28e064` with 673 files, 27,234 insertions, and 2,309 deletions.
- GitHub branch -> `origin/codex/all-minigames-project` tracks the local branch.
- Draft PR -> https://github.com/bbeyens/library-magic/pull/58 against `main`.
- Goal audit -> global `check-complete.mjs` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Publication complete; final mechanical goal audit |
| Where am I going? | Final response and user review of PR #58 |
| What is the goal? | Publish every non-temporary project file for all mini-games in one GitHub PR. |
| What have I learned? | `tmp/` is generated diagnostics; all other untracked groups are project deliverables. |
| What have I done? | Committed and pushed all 673 project files, opened draft PR #58, and preserved generated/private exclusions. |

Open risks:
- Native Godot launch remains unverified because the `godot` CLI/editor is not installed.
- Vite reports a non-blocking bundle-size warning for the main JavaScript chunk.
