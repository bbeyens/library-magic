# GameBlocks usage

## Mining attack range indicator

- Reference: `modules/world/visual-effects/GroundClickIndicator.js`
- Status: adapted, not copied directly
- Purpose: keep the disk-and-ring feedback model while following the live pointer over the mining board.
- Adaptation: the original transient world-space marker became a persistent DOM circle because this range is measured in native screen pixels. Its displayed radius is derived from the Three.js camera projection so a 16 px block step remains accurate after canvas scaling.
