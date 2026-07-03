---
name: hud-counter-popups
description: "Implement stable animated HUD counters, resource popups, damage numbers, money pulses, floating gains, and hover-safe UI updates in Library Magic. Use when adding or fixing animated counters/popups that must not reset during game ticks, combat updates, hover, damage, rewards, or resource changes."
---

# HUD Counter Popups

Use this skill when a Library Magic mini-game needs an animated counter or popup that can survive frequent state updates. The job is not just to show a number; the job is to preserve animation identity while the game keeps ticking.

## Philosophy: Stable Identity Before Animation

Mental model and framework: approach every counter or popup by thinking about three identities before touching CSS. Understand these first, then consider the visual treatment:

1. State identity: the event has a stable id and lifetime.
2. DOM identity: the rendered node keeps the same `data-*` id until the event expires.
3. Animation identity: CSS or Web Animations start only when a new event/node appears, not every render.

If any one of those identities changes during a passive tick, the animation resets. That is usually the bug.

Before implementing, ask:

- What state event creates the visual effect?
- What DOM node should stay alive while the effect is animating?
- Which values are structural, and which values are only dynamic text/style?

Core principle: animated HUD work is identity management first, visual polish second. This unlocks richer effects because the animation timeline is stable. A pretty popup that restarts every tick is broken.

## Workflow

1. Define the state event.
   - Use stable ids for popups: `id`, `amount`, `x/y` or anchor target, `timer`, and optional `kind`/`combo`.
   - For counters, store the actual resource value in game state and keep previous displayed values in HUD-local tracking maps.
   - Merge events only when it is intentional, like combining nearby money pickups. Do not merge damage numbers by accident.

2. Separate structure from dynamic values.
   - Full render should depend on layout/structure: open panels, selected book, panel size, tab, unlocked skills, level structure.
   - Dynamic patch should handle volatile values: health, money, score, wave progress, enemies, projectiles, damage popups, resource totals.
   - If the panel is already open and the structure signature is unchanged, patch in place before `rootElement.innerHTML`.

3. Render with stable selectors.
   - Counters use `data-dynamic-value="resource-id"` and update text only when it changed.
   - Popups use `data-popup-id`, `data-money-popup-id`, or a domain-specific stable id.
   - Insert new popup nodes only if their id is not already in the DOM.
   - Remove popup nodes only when their id no longer exists in state.
   - Update text/style on existing nodes in place; do not replace the popup node.

4. Keep hover separate from passive updates.
   - Hover/press animations should trigger from pointer events or a deliberate one-shot class.
   - Passive resource, damage, or combat ticks must not rebuild hovered buttons.
   - A `pointerout` catch-up render should call normal `renderHud(snapshot)`, not forced full render, so patch guards can run.

5. Add a focused guard before coding too broadly.
   - If a browser-level test is not available, add a static guard that catches the risky pattern: a patch guard must appear before `rootElement.innerHTML`.
   - Prefer one tight behavior guard over a broad snapshot test.

## Implementation Pattern

Use this shape for dynamic popup layers:

```ts
const livePopupIds = new Set<string>();
for (const popup of state.someGame.popups) {
  const popupId = String(popup.id);
  livePopupIds.add(popupId);
  const existing = layer.querySelector<HTMLElement>(`.some-popup[data-popup-id="${popupId}"]`);
  if (!existing) {
    layer.insertAdjacentHTML('beforeend', somePopupMarkup(popup));
  } else {
    existing.querySelector('b')?.replaceChildren(document.createTextNode(String(popup.amount)));
    existing.style.setProperty('--popup-heat', popup.heat.toFixed(3));
  }
}

layer.querySelectorAll<HTMLElement>('.some-popup').forEach((element) => {
  const popupId = element.dataset.popupId;
  if (!popupId || !livePopupIds.has(popupId)) {
    element.remove();
  }
});
```

Use this shape for full-render avoidance:

```ts
const signature = createHudSignature(state);
const structureSignature = createHudStructureSignature(state);

if (!options.forceFull && shouldPatchOpenMiniGamePanel(state, structureSignature)) {
  lastRenderSignature = signature;
  updateDynamicHudValues(state);
  runHudTransientEffects(state);
  return;
}

rootElement.innerHTML = fullHudMarkup(state);
lastRenderStructureSignature = structureSignature;
```

## CSS Rules

- Put one-shot popup animation on the inserted popup element.
- Do not animate a counter by rebuilding the counter node.
- Prefer Web Animations API for counter shake/pulse when the same element remains in place.
- Use CSS custom properties for variable motion: `--money-x`, `--money-y`, `--damage-x`, `--damage-y`, `--popup-heat`.
- Use `pointer-events: none` on visual popup nodes.

## Variation Guidance

Variation is required. Do not let every counter converge on the same generic popup template; adapt the behavior to the context-specific effect. Different resources should feel diverse, but the identity rules stay the same.

- Damage numbers: keep every hit separate unless the design explicitly asks for stacking.
- Resource gains: merge nearby/rapid gains when readability matters more than exact individual hits.
- Persistent counters: patch text in place and animate only the delta pulse.
- Skill buttons: patch labels/costs in place; rebuild only when tab, level, lock state, or layout structure changes.
- Sprite-backed popups: preserve DOM identity here, then use `spritesheet-implementation` for frame math.
- Customize motion by domain: damage can punch upward, money can arc or stack, healing can soften, poison can tick in place.
- Avoid repetition: if two mini-games use the same popup pattern, make sure that is a deliberate shared language, not a copy-paste habit.

## Verification

Run the smallest useful proof:

```bash
npx tsx tests/hudStatic.test.ts
npm test
npm run build
```

For a browser proof, use a `MutationObserver` on `#hud-root` while the mini-game is actively producing events:

- `overlayRemoved` or target panel removed should stay `0`.
- hovered button/tab removed should stay `0`.
- new popup ids may be added.
- expired popup ids may be removed.
- the same popup id should never be removed and re-added during its lifetime.

Good proof example:

```text
overlayRemoved=0
hoverTargetRemoved=0
damagePopupAdds>0
readdedDamagePopupIds=[]
```

## Anti-Patterns to Avoid

NEVER treat animation reset as harmless polish. It is a state/DOM identity bug.

- Wrong way: call `rootElement.innerHTML = ...` on every combat/resource tick.
  Why bad: it destroys active popup and hover nodes.
  Better: patch the open mini-game panel when structure is unchanged.

- Wrong way: use `dock.innerHTML = ...` because a cost, health, cooldown, or reward preview changed.
  Why bad: this resets hovered skill buttons.
  Better: update value, delta, title, disabled state, and cost in place.

- Wrong way: key popup DOM by `amount`, `timer`, `position`, or text content.
  Why bad: these values change during the animation lifetime.
  Better: key by stable event id only.

- Common pitfall: force a full render from hover cleanup.
  Why bad: pointer churn can restart unrelated animations.
  Better: call normal render and let patch guards decide.

- Common mistake: reuse one popup element for overlapping hits.
  Why bad: later hits overwrite earlier animations.
  Better: create one stable event per hit unless merged stacking is the intended design.

- Warning: a still screenshot is incorrect proof for animation stability.
  Why bad: this class of bug appears only while time is moving.
  Better: use a MutationObserver or a real browser recording.

## When Sprites Are Involved

If the popup or counter uses animated pixel-art sprites, also use `spritesheet-implementation` for frame math and sprite centering. This skill owns DOM/state animation stability; spritesheet-implementation owns frame sampling.
