# godot import bootstrap

Objective:
Bootstrap a Godot import for Library Magic; done when `godot/` has a runnable project skeleton, exported data/assets, and verification evidence.

Goal plan:
docs/plans/2026-07-10-godot-import-bootstrap.md

Template:
docs/plans/templates/major-task.md

Primary template:
docs/plans/templates/major-task.md

Applied packs:
- docs (docs/plans/templates/packs/docs.md)

Major source:
- type: user request
- id / link: local Codex thread
- title: Import Library Magic into Godot
- decision to make: create the first concrete Godot import slice autonomously
- decision criteria: preserve current TS game rules as source of truth, create usable Godot project files, import only runtime assets, and verify generated artifacts

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
- initial confidence score: 72/100 before implementation; main risks are no Godot editor/CLI in PATH and broad source game scope
- improvement loop: bootstrap project, export data, copy curated runtime assets, add runnable Godot scene/scripts, verify statically
- final score / loop closure: 88/100 after static bootstrap verification and full repo tests; capped because Godot editor/CLI is not installed in PATH

Completion threshold:
- `godot/project.godot` is configured as Library Magic with Mobile renderer and a main scene.
- `godot/scenes/Main.tscn` and GDScript scripts exist for a first playable hub slice.
- `godot/data/` contains exported JSON from current TypeScript content.
- `godot/assets/` contains curated runtime assets, not Spriterrific logs/review/source junk.
- Verification commands prove files exist, JSON parses, and TypeScript exporter runs.

Verification surface:
- Source audit of existing repo layout and Godot project.
- Command evidence for data export and JSON parsing.
- Static audit of Godot project, scene, scripts, and imported assets.

Constraints:
- Start from repo evidence before external claims.
- Separate measured evidence, source evidence, inference, and recommendation.
- This goal explicitly includes implementation of the first import bootstrap.
- Ignore unrelated dirty workspace diffs.
- Do not overwrite unrelated existing Godot/editor metadata beyond the project bootstrap surface.

Boundaries:
- Source of truth: current Vite/TypeScript project, especially `src/game/content`, `src/game/simulation`, `public/assets`, and `CONTEXT.md`.
- Allowed edit scope: `godot/`, `scripts/export-godot-data.ts`, `package.json` script entry if needed, and this plan.
- External sources: not needed for this first local import slice.
- Browser surface: N/A; this is a Godot bootstrap and no Godot binary is available in PATH.
- Non-goals: full parity for every mini-game, Steam/macOS export signing, and converting Phaser rendering code automatically.

Blocked condition:
- Stop if Godot editor/CLI execution is required and no Godot binary is installed or discoverable.
- Stop if source assets/data needed for the first hub slice are missing.

Completion rule:
- Do not call `update_goal(status: complete)` until evidence is recorded and `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-godot-import-bootstrap.md` passes. The repo-local `.agents/skills/autogoal` path referenced by project instructions is absent.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured before work | yes | user asked to take control and import; plan captures autonomous bootstrap, dirty workspace behavior, Godot limitation, deliverables, verification, score confiance |
| Timed checkpoint parsed | N/A | user gave no duration |
| Active goal checked or created | yes | `get_goal` returned null; created active goal for Godot import bootstrap |
| Source of truth read before analysis | yes | read `package.json`, `src/game/content/books.ts`, `src/game/content/forbiddenGrimoire.ts`, `src/game/content/runeWords.ts`, `src/game/simulation/state.ts`, `src/game/store.ts`, `src/phaser/scenes/LibraryScene.ts`, `CONTEXT.md`, `godot/project.godot` |
| Decision criteria stated | yes | see Major source and Completion threshold |
| Existing repo patterns / prior decisions checked | yes | current code separates content/simulation from Phaser/UI, enabling data-first migration |
| External research decision recorded | yes | no external research needed for local bootstrap; renderer choice already established as Mobile |
| Docs pack selected | yes | plan itself is the docs artifact for this migration bootstrap |
| Target docs and nearest sibling docs read | yes | read `CONTEXT.md` and `docs/plans/2026-06-21-library-magic-v1.md` |
| Documented source owner identified | yes | source owner is current TypeScript game content/simulation plus runtime assets |

Work Checklist:
- [x] First checkpoint complete: every explicit prompt requirement, scope
      boundary, timing constraint, stop condition, deliverable, final handoff
      section, verification surface, and success criterion is copied into this
      plan as checkable checkpoints before implementation.
- [x] Current state is mapped before proposing a new architecture, migration, benchmark, or plan.
- [x] If a duration was requested, it is recorded as minimum active work unless
      explicitly marked hard stop; when no better metric exists, initial and
      final confidence scores are recorded.
- [x] Existing repo patterns and prior decisions are recorded before external research.
- [x] Options, recommendation, tradeoffs, blast radius, and rejection reasons are recorded.
- [x] Facts, inference, and recommendation are separated.
- [x] Review or pressure passes are completed, or marked N/A with reason.
- [x] Docs pack: target docs, nearest sibling docs, and source owner are recorded.
- [x] Docs pack: named APIs, imports, options, routes, components, demos, and previews are source-backed or marked N/A.
- [x] Docs pack: docs use current-state reference voice, not changelog voice.

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Decision criteria satisfied | yes | Map evidence to each criterion | `godot/project.godot` main scene and Mobile renderer present; exported data parsed; 460 curated asset files copied |
| Source audit complete | yes | Record repo evidence and external evidence | audited Vite/TS/Phaser source, content files, existing Godot skeleton, and runtime assets; external research N/A |
| Review / pressure pass | yes | Record review lens or N/A | corrected asset export after audit found `.DS_Store`, PSD, and TXT files in first copy |
| Autoreview | yes | Review final artifact against objective, criteria, constraints, and newest user request | final scope matches import bootstrap; no unrelated dirty diffs touched intentionally |
| Timed checkpoint | N/A | If duration was requested, keep improving until elapsed, then finish the current loop cleanly; otherwise N/A | no duration requested |
| Goal plan complete | yes | Run `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-10-godot-import-bootstrap.md` | ready for final checker run |
| Docs source-backed claim audit | yes | Verify docs claims against current source | plan claims backed by source reads and command outputs in Verification evidence |
| Docs links / routes / previews | N/A | Verify or record N/A | no docs links, routes, or previews added |
| Docs parser/build | N/A | Run relevant docs parser/build or record N/A | plan markdown only; no docs parser configured |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | completed | read repo layout, Godot project, source content, context docs | implementation |
| Current-state map | completed | Vite/Phaser app with separated content/simulation, minimal Godot project already present | implementation |
| Options and recommendation | completed | data-first bootstrap, not automatic Phaser conversion | review |
| Review / pressure pass | completed | asset audit found unwanted generated/source files; exporter now filters and cleans target | closeout |
| Closeout | completed | verification evidence recorded; final checker ready | final response |

Findings:
- Current game is Vite + TypeScript + Phaser; `package.json` exposes `dev`, `build`, `test`, and `typecheck`.
- Content/simulation code is mostly separable from rendering: `src/game/content/*`, `src/game/simulation/*`.
- Rendering is split between Phaser scene code and DOM HUD; those should be rebuilt in Godot, not converted.
- Existing `godot/project.godot` is minimal, uses renderer `mobile`, and has no main scene yet.
- Godot is not discoverable in `PATH` or `/Applications`, so editor/CLI execution is not currently available.

Decisions and tradeoffs:
- Import bootstrap will keep TypeScript content as source of truth and export JSON for Godot.
- Curated runtime assets will be copied into `godot/assets`; Spriterrific logs, review files, and generation sources stay out.
- First playable slice is the library hub + mana click + book buttons, not full mini-game parity.

Timeline:
- 2026-07-10T08:44:24.576Z: plan created.

Verification evidence:
- `npm run godot:export` passed and generated `godot/data` plus curated `godot/assets`.
- JSON parse audit passed: `books.json` has 10 rows, `forbidden_grimoire_seals.json` has 9 rows, `rune_words.json` has 100 rows, `migration_manifest.json` has 7 top-level keys.
- `npm run typecheck` passed.
- `npm test` passed all repo tests.
- Asset audit after filtered export: 460 files; extensions are `gif 10`, `jpg 6`, `json 15`, `png 379`, `svg 46`, `tmj 2`, `ttf 2`.
- Negative asset audit passed: no `.DS_Store`, `.psd`, or `.txt` under `godot/assets`.
- Project audit passed: `godot/project.godot` has `config/name="Library Magic"`, `run/main_scene="res://scenes/Main.tscn"`, viewport `1280x720`, and `renderer/rendering_method="mobile"`.
- ASCII audit passed for added/edited bootstrap files with `rg -n "[^\\x00-\\x7F]" godot scripts/export-godot-data.ts docs/plans/2026-07-10-godot-import-bootstrap.md package.json`.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final checker and response |
| What is the goal? | Bootstrap a Godot import for Library Magic with project skeleton, data/assets, and verification |
| What have I learned? | See Findings |
| What have I done? | Created goal and plan; inspected source and existing Godot skeleton; added exporter, Godot main scene, GDScript state, curated assets, and verification evidence |

Open risks:
- Godot editor cannot be launched from current environment until installed or exposed in PATH.
- This bootstrap proves migration shape, not full game parity.
