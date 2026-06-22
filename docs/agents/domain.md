# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

Use a single-context repo layout:

- `CONTEXT.md` at the repo root when domain language has been defined.
- `docs/adr/` for architectural decision records when decisions need to be recorded.

## Before exploring, read these

- `CONTEXT.md` at the repo root, if it exists.
- `docs/adr/`, if it exists, focusing on ADRs that touch the area being changed.

If these files don't exist, proceed silently. The domain-modeling workflow can create them later when terms or decisions actually get resolved.

## Use the glossary's vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept needed is missing from the glossary, either the language is being invented too early or there is a real gap to capture later.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly instead of silently overriding it.
