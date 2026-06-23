---
name: auto
description: Run the full end-to-end feature workflow in one go: grill-with-docs, then autogoal for the remaining delivery steps, then to-prd, to-issues, implement, game/browser playtest, and review. Use when the user asks for automatic feature execution, full workflow, e2e delivery, or says to run auto.
disable-model-invocation: true
---

# Auto

Run the whole feature workflow without ceremony.

## Core Rule

Pause for human questions only during `grill-with-docs`, unless there is a real blocker:

- missing GitHub repo or `gh` access needed to publish issues
- unsafe ambiguity that changes product intent
- credentials or permissions failure
- destructive action
- verification cannot be run

After the grill-with-docs phase, continue in one-shot execution. Do not ask for plan approval, issue approval, or implementation approval.

## Workflow

1. **Start with `grill-with-docs`.**
   - Read the repo docs and relevant code.
   - Ask only the questions that materially change the feature.
   - Keep grill-with-docs short. The output should be decisions, not a meeting transcript.

2. **Then start `autogoal` for all remaining steps.**
   - Create or continue one measurable goal only after the grill-with-docs decisions are known.
   - Use the project-owned `docs/plans/templates/auto.md` template for the goal plan.
   - Add the `browser` pack for games/UI, and add `agent-native` when the work changes skills, prompts, hooks, commands, or agent tooling.
   - Include the expected proof: PRD issue, sliced GitHub issues, implemented slice, browser/game proof when relevant, and review result.
   - If the work is truly micro, say so and downgrade to the smallest useful path. If the user explicitly invoked `auto`, still keep a lightweight goal for the remaining work.

3. **Run `to-prd`.**
   - Convert the agreed feature into a PRD.
   - Publish it to GitHub Issues using `docs/agents/issue-tracker.md`.
   - Use `gh`; if the repo has no remote, use `gh -R owner/repo` when known or stop as a real blocker.

4. **Run `to-issues`.**
   - Break the PRD into vertical slices.
   - Publish ready-for-agent issues using `docs/agents/triage-labels.md`.
   - Do not split into horizontal layer tickets.

5. **Run `implement` on the first useful slice.**
   - Prefer the highest-value or dependency-unblocking slice.
   - Use `tdd` inside implementation for domain logic, state machines, persistence, economy rules, save/load, combat, or scoring.
   - Skip TDD for pure visual polish unless behavior can be asserted cleanly.

6. **Verify in browser for games/UI.**
   - Use `@browser-use` first.
   - For games, use the game playtest workflow and capture proof that the feature actually works.

7. **Run `review`.**
   - Review against `main` unless the user supplied another fixed point.
   - Report findings first. Fix critical issues if they are clearly in scope.

8. **Close with evidence.**
   - List the PRD issue, slice issues, implemented issue, verification command/browser proof, and review result.
   - Include `score confiance` on `/100`.

## Default Invocation Shape

When the user says something like:

```text
/auto add feature X
```

Treat it as:

```text
grill-with-docs -> autogoal for remaining steps -> to-prd -> to-issues -> implement first slice -> browser/game playtest -> review
```

Keep moving until the feature has a verified slice shipped or a real blocker is proven.
