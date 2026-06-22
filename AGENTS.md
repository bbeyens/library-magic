## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues via the `gh` CLI; external PRs are not a triage request surface by default. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default Matt Pocock triage label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Use a single-context docs layout: root `CONTEXT.md` plus ADRs under `docs/adr/` when they exist. See `docs/agents/domain.md`.

### Long-running work

Use `autogoal` for any long-running or multi-step task with a verifiable outcome, including `implement` work that spans more than one narrow edit. A goal is the contract: what must be true, how it will be proven, and when to stop.

Do not use `autogoal` for tiny one-shot fixes. Do use it for feature work, debugging loops, migrations, browser-proof tasks, multi-issue execution, or anything likely to need "continue" later.

### E2E feature workflow

Default workflow for a serious feature:

```text
autogoal -> grill-with-docs -> to-prd -> to-issues -> implement -> game-playtest -> review
```

Use `auto` when the user wants that whole flow in one go. During `auto`, pause for human questions only in the `grill-with-docs` phase, unless there is a real blocker such as missing GitHub repo access, unsafe scope ambiguity, failing credentials, or destructive action.

For game or browser UI work, use `@browser-use` first for browser verification.

### Pixel-art sprites and game-ready animation

Use the `spriterrific` skill whenever the task asks for animated pixel-art
sprites, spritesheets, game-ready character/object animations, click/idle
sprite states, or generated game assets that should land in an engine.

Default to Spriterrific before CSS-only, canvas-only, or hand-drawn placeholder
animations when the requested result is a sprite asset. CSS/DOM effects are fine
as UI polish around the sprite, but they are not a substitute for the
Spriterrific pipeline in this case.

For clicker-style resources such as crystals, coins, gems, or orbs, create or
reuse a reference, run Spriterrific for at least `idle` and the clicked action
(`use` or the closest matching verb), export runtime spritesheets, verify matte
transparency, and wire the exported assets into the game.
