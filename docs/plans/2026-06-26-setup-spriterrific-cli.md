# setup spriterrific cli

Objective:
Set up Spriterrific CLI; done when uv, spriterrific --help, ffmpeg, and project FAL_KEY .env are verified.

Goal plan:
docs/plans/2026-06-26-setup-spriterrific-cli.md

Template:
docs/plans/templates/task.md

Primary template:
docs/plans/templates/task.md

Applied packs:
- none

Task source:
- type: direct user request
- id / link: N/A
- title: Install and configure Spriterrific locally
- acceptance criteria: detect OS; use official/system package sources; install uv; install Spriterrific with `uv tool install spriterrific` or pipx; verify `spriterrific --help`; install ffmpeg; create project `.env` containing user-provided `FAL_KEY`; do not invent or echo the key.

First checkpoint:
- Requirements captured: detect OS first; prefer Homebrew on macOS; use official installers/sources only; do not install from untrusted sources; do not pipe scripts except the official uv installer; ask before unsure commands; install uv; install Spriterrific; verify CLI help; install ffmpeg; create `.env`; add user-provided `FAL_KEY` without inventing one; final handoff includes evidence and score confiance.

Timed checkpoint:
- requested duration: N/A
- semantics: N/A
- initial confidence score: N/A
- improvement loop: N/A
- final score / loop closure: final score confiance in final response

Completion threshold:
- macOS and package manager are identified.
- `uv --version` succeeds.
- `uv tool install spriterrific` succeeds or reports an equivalent already-installed state.
- `spriterrific --help` succeeds.
- `ffmpeg -version` succeeds.
- Project `.env` exists and contains a `FAL_KEY=` row using the user-provided value, without echoing it in logs/final response.

Verification surface:
- Commands: `uname -a`, `sw_vers`, `command -v brew`, `uv --version`, `spriterrific --help`, `ffmpeg -version`.
- Source audit: `.env` existence and key-name presence without printing secret value.

Constraints:
- Preserve behavior outside setup scope.
- Use Homebrew for macOS packages when possible.
- Do not use untrusted installers or non-official script pipes.
- Do not invent, guess, or print the fal.ai API key.
- Do not create PRs, commits, pushes, or external comments.

Boundaries:
- Source of truth: user request, Spriterrific skill, autogoal skill, local command evidence.
- Allowed edit scope: `docs/plans/2026-06-26-setup-spriterrific-cli.md`, project `.env`, optional `.gitignore` only if needed to keep `.env` untracked.
- Browser surface: N/A.
- Tracker sync: N/A.
- Non-goals: generating sprites, running provider workflows, committing/pushing, exposing the API key.

Current verdict:
- verdict: complete
- confidence: 98/100
- next owner: user
- reason: `uv`, `spriterrific`, `ffmpeg`, and project `.env` were installed/configured and verified.

Pre-solution issue challenge:
- reporter claim: N/A: setup request, not a bug report.
- suggested diagnosis or fix: N/A.
- repro ladder:
- tests / source-level repro: N/A.
- repo-owned automated browser or integration proof: N/A.
- Browser plugin: N/A.
- screenshot / visual proof: N/A.
- reproduction verdict: N/A.
- validity verdict: valid setup request.
- best long-term fix boundary: machine-level CLI setup plus project-local secret file.
- harsh honest feedback: N/A.
- hard-stop decision: proceed unless official install commands fail or secret handling is unsafe.

Blocked condition:
- Stop if Homebrew cannot install packages, PyPI cannot provide `spriterrific`, `spriterrific --help` cannot run after a reinstall attempt, or writing `.env` would require exposing/guessing a missing secret.

Completion rule:
- Do not call `update_goal(status: complete)` while required checklist items remain unchecked.
- Do not call `update_goal(status: complete)` until every completion threshold is satisfied, final evidence is recorded, and `node .agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-setup-spriterrific-cli.md` passes.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | First checkpoint section lists every explicit user requirement. |
| Timed checkpoint parsed | no | N/A: no duration requested. |
| Active goal checked or created | yes | `get_goal` returned none; `create_goal` created this setup goal. |
| Source of truth read before edits | yes | Read autogoal and Spriterrific skills; inspected OS/package manager state. |
| Acceptance criteria captured | yes | Task source and Completion threshold sections. |
| Pre-solution issue challenge required | no | N/A: setup request, not bug/behavior report. |
| Reproduction verdict before implementation | no | N/A: not a bug/behavior report. |
| Repro escalation ladder selected | no | N/A: not a bug/behavior report. |
| Suggested fix reviewed against durable boundary | yes | Boundary is machine-level CLI setup plus project `.env`; no app code. |
| TDD decision before behavior change or bug fix | no | N/A: installation/configuration, no behavior code change. |
| Browser proof decision for browser surface | no | N/A: no browser surface. |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation. Evidence: First checkpoint and Completion threshold sections.
- [x] Short objective plus threshold, verification surface, constraints, boundaries, and blocked condition are concrete. Evidence: filled sections above.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded. N/A: no duration requested.
- [x] Task source and acceptance criteria are captured. Evidence: Task source section.
- [x] For public tracker bug reports, behavior claims, technical diagnoses, or
      suggested fixes, reporter claims are challenged before implementation
      with a recorded verdict: `valid`, `not reproduced`, `invalid`,
      `wont-fix`, `partially valid`, or `platform limitation`. Feature, docs,
      support, or cleanup requests with no bug claim may mark reproduction
      `N/A` with reason. N/A: setup request.
- [x] Repro escalation ladder followed for bug/behavior claims: focused
      test/source-level repro first when applicable; existing repo-owned
      automated browser or integration proof next when available and useful as
      executable coverage; the repo-approved Browser tool next when tests or
      automation cannot reproduce or cannot model the surface honestly;
      screenshot or explicit visual-proof waiver when visual/native state
      matters. N/A: setup request.
- [x] Hard-stop rule followed for bug/behavior claims: no code when the issue
      is not reproduced, invalid, or won't-fix; partial validity pivots to the
      best long-term fix and records what was wrong or incomplete in the
      issue's proposed path. N/A: setup request.
- [x] Nearby implementation patterns are read before edits. Evidence: Spriterrific setup request does not require app code; read relevant skills and project plan conventions.
- [x] Implementation fixes the right ownership boundary, or the narrower choice
      is recorded with reason. Evidence: install tooling globally via Homebrew/uv tool; secret project-local `.env`.
- [x] Review/autoreview target selected from actual diff state for non-trivial
      implementation work, or marked N/A with reason. Evidence: reviewed final command outputs, `.env` secret handling, and scoped `git status`.
- [x] Verification evidence is recorded beside each relevant gate.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Named verification threshold | yes | Run the named proof or record blocker | `uv --version` -> 0.11.24; `spriterrific --help` -> command list printed; `ffmpeg -version` -> 8.1.2; `.env` audit -> `FAL_KEY` non-empty. |
| Pre-solution issue challenge verdict | no | Record reporter claim, suggested fix, repro verdict, validity verdict, durable boundary, and hard-stop/pivot decision before implementation | N/A: setup request. |
| Repro escalation ladder | no | For bug/behavior claims, record test/source-level, automated browser/integration, Browser, and screenshot/visual-proof outcomes or N/A/blocker reasons before `not reproduced` | N/A: setup request. |
| Bug reproduced before fix | no | Record failing test/repro or N/A with reason | N/A: setup request. |
| Targeted behavior verification | yes | Run focused test/proof for changed behavior or record N/A | `spriterrific --version` -> 0.12.2; `uv tool list` shows `spriterrific v0.12.2`; `.env` key-name audit passed. |
| TypeScript or typed config changed | no | Run relevant typecheck | N/A: no TypeScript/config behavior changes. |
| Build-sensitive behavior changed | no | Run relevant build/check | N/A: no app/build behavior changed. |
| Browser surface changed | no | Capture browser proof | N/A: no browser surface. |
| Final lint/format | no | Run relevant lint/format command or record N/A | N/A: no code formatting surface. |
| Autoreview | yes | Review final diff/output against objective, acceptance criteria, constraints, and newest user request | Accepted: OS detected first; Homebrew used for `uv`/`ffmpeg`; Spriterrific installed via `uv tool install`; key not printed in final evidence; `.env` ignored by Git. |
| Timed checkpoint | no | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | N/A: no duration requested. |
| Goal plan complete | yes | Run `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-setup-spriterrific-cli.md` | Passed after closing final bookkeeping rows. |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | OS/package-manager detected; autogoal and Spriterrific skills read; requirements captured. | implementation |
| Implementation | complete | `brew install uv ffmpeg`; `uv tool install spriterrific`; `.env` created with mode `-rw-------`. | verification |
| Verification | complete | `uv --version`; `spriterrific --help`; `ffmpeg -version`; `spriterrific --version`; `uv tool list`; `.env` key audit. | closeout |
| Closeout | complete | plan updated with evidence; first completion check identified only closeout bookkeeping rows | final response |

Findings:
- macOS 26.5.1 on Apple Silicon.
- Homebrew exists at `/opt/homebrew/bin/brew`.
- `uv`, `spriterrific`, and `ffmpeg` were not initially found on PATH.

Decisions and tradeoffs:
- Use Homebrew for `uv` and `ffmpeg` because the user asked to prefer the system package manager and this is macOS.
- Use `uv tool install spriterrific` for the CLI because it matches the requested install method.
- Do not print the FAL key in plan, logs, or final handoff.

Timeline:
- 2026-06-26T13:50:01.410Z: plan created.
- 2026-06-26T13:50:00Z: detected macOS/Homebrew and missing `uv`, `spriterrific`, `ffmpeg`.
- 2026-06-26T13:50:04Z: active goal created.

Verification evidence:
- `brew install uv ffmpeg` exited 0; installed `uv` 0.11.24 and `ffmpeg` 8.1.2 from Homebrew core.
- `uv tool install spriterrific` exited 0; installed `spriterrific` 0.12.2 with Python 3.11.15.
- `uv --version` exited 0: `uv 0.11.24 (Homebrew 2026-06-23 aarch64-apple-darwin)`.
- `spriterrific --help` exited 0 and showed the expected CLI command groups.
- `ffmpeg -version` exited 0: `ffmpeg version 8.1.2`.
- `spriterrific --version` exited 0: `spriterrific 0.12.2`.
- `uv tool list` exited 0 and listed `spriterrific v0.12.2`.
- `.env` was created with permissions `-rw-------`; `rg -q '^FAL_KEY=.+$' .env` passed without printing the secret.
- `node /Users/joellebeyens/.agents/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-06-26-setup-spriterrific-cli.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Verification complete |
| Where am I going? | Mechanical goal-plan check, goal completion, final response |
| What is the goal? | Set up Spriterrific CLI and FAL key locally |
| What have I learned? | macOS/Homebrew available; requested tools missing initially |
| What have I done? | Installed `uv`, `ffmpeg`, and `spriterrific`; created `.env`; verified the setup |

Open risks:
- Homebrew warned that two unrelated third-party taps are untrusted and ignored; no action taken because installs came from Homebrew core.
- The fal.ai key was not tested against fal.ai network APIs; only local presence/configuration was verified.
