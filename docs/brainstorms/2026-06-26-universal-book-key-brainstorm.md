---
date: 2026-06-26
topic: universal-book-key
---

# Universal Book Key

## What We're Building

When a grimoire is filled, it no longer unlocks the next book automatically. It grants one universal book key instead. The key is shown in the top-right HUD with the other resources.

The player can spend one key to unlock any locked book they choose. Each locked book displays its own seal requirements, so the cost varies by target book instead of following a fixed linear seal order.

## Why This Approach

We considered gated freedom, full freedom, and branch-based progression. The chosen direction is full freedom: one key can target any locked book.

This is the clearest version of the fantasy. The player finishes a grimoire, earns a key, then makes a deliberate build choice. It is less controlled than a linear unlock chain, but that is the point: the choice should feel meaningful, not like a dressed-up next button.

## Key Decisions

- Filled grimoire reward: grant `+1` universal book key instead of unlocking the next book.
- HUD visibility: show the key count in the top-right resource HUD.
- Unlock interaction: clicking a locked book with at least one key shows that book's seal requirements.
- Cost model: every locked book owns its own unlock requirements.
- Progression model: any locked book can be unlocked if the player has one key and satisfies that book's resource requirements.
- Key consumption: spend one key only when the target book successfully unlocks.

## Open Questions

- Should books with impossible current requirements still be selectable, or should they be visibly disabled until the player can pay?
- Should the key be named `Cle de sceau`, `Cle de grimoire`, or something shorter like `Cle` in the HUD?
- Should the old sequential seal level be removed from UI copy entirely, or kept as flavor only?

## Next Steps

-> Plan implementation around store state, seal requirement lookup by book id, HUD rendering, and locked-book click behavior.
