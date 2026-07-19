---
description: Fast testing policy for TypeScript logic, deterministic gameplay, rendered proof, performance, and regression boundaries.
name: tdd
metadata:
  skiller:
    source: .agents/rules/tdd.mdc
---

# TDD

- Use red/green tests for deterministic logic, state transitions, parsers,
  policies, asset contracts, and reproduced regressions.
- Keep the narrowest useful test loop running while editing.
- Use the repository's current `npm test` command as owner truth; do not silently
  replace or broaden it.
- Rendered behavior requires bounded browser proof in addition to automated
  assertions. A passing DOM, bbox, asset-load, or screenshot-production check
  does not prove the visible result.
- Visual acceptance requires opening the exact final capture at original
  resolution and recording `PASS` or `FIX` against the GDD target/reference.
- Performance claims require measured frame timing or resource evidence, not
  subjective smoothness.
- Do not add a permanent browser suite merely to test pure logic.
