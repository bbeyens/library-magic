---
description: Run the full pipeline from game-design to game-build to game-polish in one pass. Grilling stays interactive; after DESIGN_READY nothing pauses. Use when the user invokes game-full.
name: game-full
metadata:
  skiller:
    source: .agents/rules/game-full.mdc
---

# Game Full

Run the owning skills in order:

1. `game-design`: resolve decisions one question at a time and stop only at
   `DESIGN_READY|BLOCKED`.
2. `game-visual`: run only when the approved GDD requires generated
   construction sheets, image-to-3D sources, or runtime-facing targets. It must
   end at `VISUAL_READY|BLOCKED`.
3. `game-build`: implement the complete playable loop, register assets, and
   end at `PLAYABLE_READY|BLOCKED`.
4. `game-polish`: close target/reference-relative gaps and end at
   `POLISHED_READY|BLOCKED`.

After `DESIGN_READY`, continue without asking for routine approval. Pause only
for a provider's unavoidable human action, explicit user decision, unavailable
required tool, exhausted bounded generation loop, or failed acceptance gate.

The named GDD owns every decision, target, asset manifest, proof, waiver, and
status. Do not create parallel planning ledgers.

If the user requests a specific stage, run only that stage and its required
owners instead of widening to `game-full`.
