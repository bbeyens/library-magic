---
date: 2026-06-26
topic: cozy-magic-hub-animations
---

# Cozy Magic Hub Animations

## What We're Building

Add animation layers across the central library hub so the screen feels alive and more game-like. The art direction is Disney-style cozy magic: warm, readable, charming, and rewarding, not horror, noisy arcade, or dark occult.

The animations should support gameplay clarity first: resources moving, bars filling, seals breaking, books unlocking, and the forbidden grimoire reacting. Ambient animation is allowed, but it must stay subtle enough that the player can still read the shelf, books, locks, and ritual HUD.

## Why This Approach

We should build all three families: progression, ambient state, and reward moments. The order matters: progression and rewards make the game feel responsive, while ambient animation makes the hub feel alive after the core feedback works.

## Key Decisions

- Style: Disney cozy magic. Warm golds, soft blues, playful sparkles, gentle glows, tiny book/page motion.
- Priority 1: progression feedback. Resource particles from books to grimoire, bar fill pulses, lock-ready hints, seal readiness.
- Priority 2: reward moments. Seal break, book unlock reveal, new book glow, grimoire level-up ceremony.
- Priority 3: ambient life. Idle book breathing, candle glow, dust motes, sleepy locked-book shimmer, grimoire aura.
- Avoid: constant flashing, huge particle spam, dark horror effects, UI shaking everywhere, animations that cover book art.
- Performance: animation bursts should be capped; ambient loops should be lightweight Phaser tweens.

## Animation Backlog

1. Offering transfer polish: keep resource particles, add stronger arrival impact and bar-fill wave.
2. Seal ready state: when requirements are full, grimoire seal glows gold and small runes orbit the HUD seal.
3. Seal break ceremony: click "Briser le sceau" triggers chain snap, radial wave, gold dust, and next book unlock.
4. Book unlock reveal: target book bumps forward, lock pops/falls, page sparkle, cozy chime-like visual.
5. Locked book idle: slow lock shimmer and tiny warm glint on the next unlockable book only.
6. Unlocked book idle: soft breathing glow, tiny page flutter every few seconds.
7. Forbidden grimoire idle: blue aura breathing, intermittent rune flickers, subtle chain tension.
8. Library ambience: candle flicker, dust motes, occasional golden sparkle near shelves.
9. Resource gain feedback: when a mini-game grants resources, small particles fly toward the resource/menu area.

## Open Questions

- Should the next implementation batch target the ritual loop first, or make the whole shelf feel alive first?

## Next Steps

Implement in small batches:
1. Ritual loop animations: seal ready, seal break, book unlock reveal.
2. Shelf idle animations: locked/unlocked books and grimoire idle.
3. Ambience pass: candle, dust, sparkle polish.
