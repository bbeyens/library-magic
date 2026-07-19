---
description: Clarify domain concepts, boundaries, scenarios, and canonical terms inside the artifact owned by the current workflow.
name: domain-modeling
metadata:
  skiller:
    source: .agents/rules/domain-modeling.mdc
---

# Domain Modeling

- Challenge vague or overloaded terms and propose one precise canonical term.
- Test the model with concrete edge cases and conflicting scenarios.
- Check code only when the current task depends on existing behavior.
- Record resolved language in the artifact named by the invoking workflow.
- During `game-design`, unresolved language stays in the brainstorm and approved
  language moves into the GDD.
- Create no standalone glossary, `CONTEXT.md`, ADR, or extra documentation
  unless the user explicitly asks for one.
