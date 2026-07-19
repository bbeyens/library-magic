---
description: Sharpen a design through one-question-at-a-time grilling while recording decisions only in the artifact owned by the calling flow.
disable-model-invocation: true
name: grill-with-docs
metadata:
  skiller:
    source: .agents/rules/grill-with-docs.mdc
---

# Grill With Docs

Run `grilling` with the terminology discipline from `domain-modeling`.

During `game-design`:

- keep unresolved ideas and questions in the active brainstorm;
- move only approved decisions and canonical terms into the GDD;
- do not create `CONTEXT.md`, ADRs, glossaries, plans, or any other document.

Outside `game-design`, edit only the document explicitly named by the user.
