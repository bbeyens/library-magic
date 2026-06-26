# install vgd skills

Objective:
Install all Codex-compatible VGD skills into this workspace; done when all 21 source skill folders exist under `.agents/skills` with `SKILL.md` files and verification passes.

Goal plan:
docs/plans/2026-06-26-install-vgd-skills.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- agent-native (docs/plans/templates/packs/agent-native.md)

Task source:
- type: user request
- id / link: N/A: no ticket
- title: install all skills from VGD skills package
- acceptance criteria: copy every folder from `/Users/joellebeyens/Documents/Documents/BJM/TomMoraneINDPNT/Incremental/vgd-skills-main/.agents/skills` into `/Users/joellebeyens/Documents/Libary-Magic/.agents/skills`; verify counts, names, and `SKILL.md` files; provide score confiance.

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
- initial confidence score: N/A: direct install with concrete count proof
- improvement loop: N/A: no timed loop
- final score / loop closure: N/A: no timed loop

Completion threshold:
- All 21 source directories in the VGD `.agents/skills` folder are present in the workspace `.agents/skills` folder.
- Every installed VGD skill has a `SKILL.md`.
- No pre-existing non-VGD skill directories are removed.

Verification surface:
- Source audit commands comparing source and destination skill names.
- Count of source and destination VGD `SKILL.md` files.
- Targeted review of changed agent-native files.

Constraints:
- Preserve behavior outside scope.
- Prefer the durable ownership boundary over caller-by-caller patches.
- Do not create PRs, commits, pushes, or external comments unless requested or required.

Boundaries:
- Source of truth: `/Users/joellebeyens/Documents/Documents/BJM/TomMoraneINDPNT/Incremental/vgd-skills-main/.agents/skills`
- Allowed edit scope: `/Users/joellebeyens/Documents/Libary-Magic/.agents/skills/**` and this goal plan.
- Browser surface: N/A: no browser behavior changed.
- Tracker sync: N/A: no ticket.
- Non-goals: do not install Claude-only `.claude/skills` copies; do not modify unrelated dirty files; do not commit or push.

Current verdict:
- verdict: complete
- confidence: 98/100
- next owner: user
- reason: 21 VGD Codex skill folders copied into workspace `.agents/skills`; name, `SKILL.md`, and recursive diff audits passed.

Pre-solution issue challenge:
- reporter claim: user wants all skills installed from the provided VGD package.
- suggested diagnosis or fix: install Codex-compatible `.agents/skills` into the current workspace.
- repro ladder:
  - tests / source-level repro: source has 21 skill directories, each with `SKILL.md`.
  - repo-owned automated browser or integration proof: N/A: no browser surface.
  - Browser plugin: N/A: no browser surface.
  - screenshot / visual proof: N/A: filesystem install.
- reproduction verdict: valid
- validity verdict: valid
- best long-term fix boundary: workspace-local `.agents/skills` install because Codex reads this project root.
- harsh honest feedback: installing `.claude/skills` for this Codex task would be noise.
- hard-stop decision: proceed with `.agents/skills` only.

Blocked condition:
- Stop if source skill directories disappear, destination write fails, or a same-name destination skill would be overwritten.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-install-vgd-skills.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | User requested all skills from VGD package; plan captures source, destination, non-goals, final score confidence, and verification threshold. |
| Timed checkpoint parsed | N/A: no duration requested | recorded in Timed checkpoint section |
| Active goal checked or created | yes | `get_goal` returned no active goal before plan creation |
| Source of truth read before edits | yes | read `README.md`, `CHANGELOG.md`, and enumerated VGD `.agents/skills` |
| Acceptance criteria captured | yes | acceptance criteria recorded in Task source |
| Pre-solution issue challenge required | no | install request, not a bug report |
| Reproduction verdict before implementation | N/A: no bug claim | source directory proof used instead |
| Repro escalation ladder selected | N/A: no bug claim | filesystem source audit is the relevant proof |
| Suggested fix reviewed against durable boundary | yes | install workspace-local Codex `.agents/skills`, not Claude copies |
| TDD decision before behavior change or bug fix | N/A: no behavior code changed | filesystem install only |
| Browser proof decision for browser surface | N/A: no browser surface | no browser behavior changed |
| Agent-native pack selected | yes | `agent-native` pack applied because skills change |
| Canonical agent source identified | yes | source is VGD `.agents/skills` |
| Validation command selected | yes | compare names and count destination `SKILL.md` files |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation. Evidence: plan sections filled from user request and source README.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete. Evidence: objective, completion threshold, verification surface, boundaries, and blocked condition filled.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. Evidence: N/A, no duration requested.
- [x] Task source and acceptance criteria are captured. Evidence: Task source section.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason. Evidence: N/A, not a bug report.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. Evidence: N/A, not a bug report.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. Evidence: N/A, not a bug report.
- [x] Nearby implementation patterns are read before edits. Evidence: existing `.agents/skills` directory enumerated.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: installed Codex `.agents/skills` into current workspace, not Claude `.claude/skills`.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: target is filesystem install under `.agents/skills`; agent-native review is frontmatter/routing plus install parity.
- [x] Verification evidence is recorded beside each relevant gate. Evidence: source/destination name comparison empty, missing `SKILL.md` audit empty, recursive `diff -qr` returned `diff-ok`, counts returned `source_dirs=21` and `installed_skill_md=21`.
- [x] Agent-native pack: canonical source and generated/downstream copies are identified. Evidence: source `.agents/skills`, destination workspace `.agents/skills`; no generated downstream copy.
- [x] Agent-native pack: skill frontmatter and routing descriptions are checked when skills change. Evidence: every installed VGD `SKILL.md` has `name:` and `description:` frontmatter; descriptions route the skill by game-dev/media task.
- [x] Agent-native pack: validator or install check is run where available. Evidence: install checks used count, name parity, `SKILL.md` presence, and recursive diff; no repo validator references `skills-lock.json` or local VGD skill installs.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `source_dirs=21`, `installed_skill_md=21`, no name diff output, no missing `SKILL.md` output, recursive `diff -qr` returned `diff-ok`. |
| Pre-solution issue challenge verdict | N/A: not a bug claim | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | Request validated as installation work; no bug reproduction needed. |
| Repro escalation ladder | N/A: not a bug claim | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | Filesystem source audit selected; no browser or screenshot surface. |
| Bug reproduced before fix | N/A: not a bug claim | Record failing test/repro or N/A with reason | No bug fix. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | Installed skill discovery surface verified by `.agents/skills/<name>/SKILL.md` count and frontmatter audit. |
| TypeScript or typed config changed | N/A: no TS/config changed | Run relevant typecheck | Filesystem skill install only. |
| Build-sensitive behavior changed | N/A: no build-sensitive app code changed | Run relevant build/check | App build not affected by adding skill folders. |
| Browser surface changed | N/A: no browser surface changed | Capture browser proof | No browser behavior. |
| Final lint/format | N/A: copied upstream skill files verbatim | Run relevant lint/format command or record N/A | `diff -qr` proves installed copies match source exactly. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Review result: objective met; unrelated `docs/plans/2026-06-26-setup-spriterrific-cli.md` ignored; `skills-lock.json` not updated because no local script references it and hash semantics do not match local files. |
| Timed checkpoint | N/A: no duration requested | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | No timed checkpoint. |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-install-vgd-skills.md` | Passed: `[autogoal] complete: docs/plans/2026-06-26-install-vgd-skills.md`. |
| Agent source validation | yes | Run relevant agent/skill validation command | Frontmatter audit found no installed VGD skill missing `name:` or `description:`; install parity checks passed. |
| Generated/downstream sync | N/A: no generated/downstream copy | Refresh or mark N/A with reason | Source and destination are direct folders; no generator involved. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Read VGD README/CHANGELOG and enumerated 21 Codex source skills. | implementation |
| Implementation | complete | Copied all 21 source folders into workspace `.agents/skills` with no overwrite conflicts. | verification |
| Verification | complete | Name parity, `SKILL.md` count, recursive diff, and frontmatter audits passed. | closeout |
| Closeout | complete | Goal plan filled; final mechanical check selected. | final response |

Findings:
- VGD source contains 21 Codex-compatible skill directories under `.agents/skills`.
- README summary is slightly looser than the filesystem count; the install follows the filesystem source of truth.
- Existing `skills-lock.json` appears to track Matt Pocock skills only and is not referenced by local scripts; updating it for VGD would invent lock semantics.

Decisions and tradeoffs:
- Installed `.agents/skills` only, not `.claude/skills`, because this is a Codex workspace task.
- Used exact recursive copies and `diff -qr` verification instead of reformatting or normalizing the upstream skill folders.

Timeline:
- 2026-06-26T13:54:10.532Z: plan created.
- 2026-06-26T14:00: installed 21 VGD Codex skill directories into `.agents/skills`.
- 2026-06-26T14:01: verified no source/destination name differences, no missing installed `SKILL.md`, recursive `diff -qr` returned `diff-ok`, and counts returned `source_dirs=21`, `installed_skill_md=21`.
- 2026-06-26T14:02: checked frontmatter/routing: all installed VGD `SKILL.md` files have `name:` and `description:`.
- 2026-06-26T14:03: autogoal checker passed with `[autogoal] complete: docs/plans/2026-06-26-install-vgd-skills.md`.

Verification evidence:
- Command: `comm -3 <source skill names> <installed VGD skill names>` produced no output.
- Command: missing `SKILL.md` audit produced no output.
- Command: recursive `diff -qr` over each VGD source/destination skill returned `diff-ok`.
- Command: count audit returned `source_dirs=21` and `installed_skill_md=21`.
- Command: frontmatter audit produced no missing `name:` or `description:` output.
- Command: `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-install-vgd-skills.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final response |
| What is the goal? | Install all 21 VGD Codex-compatible skills into this workspace and verify they are present. |
| What have I learned? | See Findings |
| What have I done? | See Timeline |

Open risks:
- Newly installed skills may require a Codex restart before appearing in the skill picker.
