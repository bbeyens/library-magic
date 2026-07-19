---
description: Proactively persist hard-won game production lessons into the right game-* source rule as compact do/don't or recipe lines. Fires at the end of any game lane whenever something was learned the hard way; never wait for the user to ask.
name: game-memory
metadata:
  skiller:
    source: .agents/rules/game-memory.mdc
---

# Game Memory

Every game lane (`game-design`, `game-visual`, `game-build`, `game-polish`,
`world-builder`, `blender-mcp`, asset generators) ends with a memory pass:
if the session learned something the hard way, write it into the owning
skill BEFORE the final report. A lesson that stays in the conversation is
lost; a lesson in the skill makes the next session smooth.

## What qualifies

- A trick, pitfall, or tool behavior that cost more than one iteration to
  discover, or that would cost the next session real time to rediscover.
- A new fix/recipe/waiver type that let an asset or proof pass.
- NOT: one-off facts, session state, product decisions, or anything the GDD,
  catalog, or code already records — those stay in their own homes.

## Routing (edit the SOURCE `.agents/rules/*.mdc`, never a mirror)

| Lesson type | Destination |
|---|---|
| Mesh/material/scale/attach import recipe | `game-3d-asset-pipeline.mdc` → owning branch |
| 3D asset acceptance, sockets, grip, intersections | `game-3d-asset-pipeline.mdc` → owning branch/proof rule |
| Runtime proof capture, browser tooling, live tuning | `game-build.mdc` → do/don't section |
| Target generation, image prompts | `game-visual.mdc` |
| Polish-only techniques (authored 3D, Blender) | `game-polish.mdc` / `blender-mcp.mdc` |
| Grilling/design process traps | `game-design.mdc` |
| Sandbox/catalog intake behavior | `world-builder.mdc` |
| Provider API behavior (Tripo, Gemini…) | the generator skill's own reference files |
| User preference or cross-project fact | auto-memory, not a skill |

## Format rules

- COMPACT: one bullet per lesson, imperative voice, failure mode + fix in
  the same line ("X fails because Y — do Z"). No narrative, no session IDs.
- GENERIC: strip the asset/session specifics; keep the reusable mechanism.
  "Hand props" not a named asset from the current project.
- NO DUPLICATES: search the destination first; if a bullet already covers
  the mechanism, sharpen that bullet instead of appending a near-copy.
- Match the destination's existing structure (do/don't lists, recipe
  bullets); create a small titled section only when none fits.

## Closure integrity

- A screenshot file existing is not visual proof. Before saying `done`,
  `fixed`, `ACCEPT`, or `POLISHED_READY`, open the exact final capture produced
  after the last relevant change at original resolution and compare its actual
  pixels with the user's request and locked reference.
- Write an explicit `PASS` or `FIX` visual verdict that names what is visible
  and checks the likely failure modes for that surface. For attached 3D props,
  this always includes body/face intersections, occlusion, grip/contact,
  socket/pose, scale, silhouette, and camera-angle luck. Tests, diagnostics,
  bboxes, masks, asset loading, and catalog validation are supporting evidence;
  none can override a visible defect.
- If the user supplies a screenshot that contradicts an earlier acceptance,
  immediately downgrade the owning GDD/ledger to `FIX`, record the visible
  failure, and sharpen the owning skill before making another completion claim.
  Do not defend or preserve the stale `ACCEPT` verdict.

## After writing

1. Run `npx skiller@latest apply`.
2. Audit that the generated mirrors picked up the new lines.
3. Validate the changed skill source and generated mirror.
4. Mention in the final report which lessons were saved and where, without
   describing the underlying work as complete unless its final pixels passed.
