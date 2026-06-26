---
date: 2026-06-26
topic: forbidden-grimoire-hub
---

# Forbidden Grimoire Hub

## What We're Building
The hub becomes a ritual room. The game books live on the left and center shelf, while the Forbidden Grimoire sits apart on a lectern at the right as the boss/final objective. The player feeds it resources through manual progressive offerings; when the current seal is full, the player clicks a final action to break the seal and reveal the next game book.

## Why This Approach
The current hub makes the books feel like the whole game. The new layout makes the Forbidden Grimoire the reason to play: mini-games produce resources, resources become offerings, offerings unlock more mini-games. This keeps the incremental loop readable and gives the hub an emotional focal point.

## Key Decisions
- Forbidden Grimoire on a right-side lectern: it must not look like one more shelf book.
- Manual progressive offering: the player clicks to deposit resources over time.
- Separate final seal break: when all offering bars are filled, the button becomes a bigger ritual action.
- Generated background art plus Phaser UI: images carry atmosphere; Phaser owns bars, labels, buttons, hover, and state.
- Sequential reveal: each seal level unlocks the next game book.

## Open Questions
- Exact final number of seal levels can follow the current book list for now.
- Later polish can add unique grimoire states per broken seal.

## Next Steps
Implement simulation state/actions, generate new hub art, wire Phaser ritual UI, verify in browser.
