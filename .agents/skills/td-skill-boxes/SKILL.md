---
name: td-skill-boxes
description: Implement or port the Bastion Arcanique tower-defense skill box layout to another Library Magic mini-game. Use when adding a tabbed skill dock, two-column upgrade cards, S/M/L responsive skill cards, locked/unaffordable/max states, scroll-limited skill grids, stable hover/buy animations, or dynamic skill-card updates that must not reset gameplay animations.
---

# TD Skill Boxes

Use this skill to reuse the current TD skill dock pattern on another mini-game without rebuilding the same card layout from scratch.

## Source Of Truth

Start by reading the current implementation:

- `src/ui/hud.ts`
  - `interface SkillShopCard`
  - `defenseSkillShop`
  - `defenseSkillShopTabs`
  - `skillShopCard`
  - `defenseSkillShopCard`
  - `refreshDefenseSkillDock`
  - `defenseSkillDockSignature`
  - `defenseSkillCardDynamicSignature`
  - `updateDynamicDefenseSkillCards`
  - `refreshManaSkillDock`
  - `manaSkillDockSignature`
  - `manaSkillCardDynamicSignature`
  - `updateDynamicManaSkillCards`
  - `isManaSkillCardActionableSnapshot`
  - `isManaSkillButtonActionable`
  - `manaPanel`
  - `manaXpProgress`
  - `manaXpLevel`
  - `setTextContentIfChanged`
  - `setInnerHTMLIfChanged`
  - `setAttributeIfChanged`
  - `clearOneShotHoverTarget`
  - `installOneShotHoverAnimations`
- `src/style.css`
  - generic `.skill-shop-*` styles
  - dock overrides under `.defense-skill-dock`
  - Gem dock overrides under `.mana-skill-dock`
  - TD/Gem XP badge styles under `.defense-hud-xp`, `.defense-xp-badge`, `.mana-xp-bar`, and `.mana-xp-badge`
  - small-size rules under `.panel-size-small .defense-skill-dock`
- `tests/hudStatic.test.ts`
  - use this file for guardrails when adding static UI behavior.

Do not copy stale assumptions from memory. Inspect these files first.

## Layout Rules

Use the TD shape unless the target mini-game already has a stronger local convention:

- Dock goes directly under the mini-game panel content, not floating over the game area.
- Tabs stay at the bottom of the dock.
- Skill grid uses two columns.
- Show at most 8 skill cards at once: 4 rows x 2 columns.
- Extra skills scroll inside the skill grid, not by growing the panel.
- The dock height should fit its content and not overlap the game panel.
- Do not put cards inside cards.
- Keep costs visually light: in the TD dock, the price is just a blue number/resource display, not a boxed button.
- Tab buttons use the shared game font, centered text, and the TD button chrome. Do not leave local tab rules that align text like a card row.
- Tab labels are centered with `grid-template-columns: 1fr`, `justify-items: center`, `place-items: center`, and a 24px label in the current TD/Gem dock style.

The effective current TD dock variables are the baseline:

```css
--td-skill-visible-card-limit: 8;
--td-skill-visible-card-rows: 4;
--td-skill-visible-card-height: 36px;
--td-skill-visible-card-gap: 6px;
--td-skill-visible-grid-height: 170px;
```

Older default blocks may still declare `30px`, `5px`, or `142px`; do not cargo-cult those if later scoped TD rules override them.

## Gem / Crystal Port

When porting this pattern to the Gem/Crystal mini-game, copy the full TD chrome, not only the card colors:

- The playable arena is a square `480px` target (`width` and `height`), with the skill dock directly below it.
- The skill dock stays `480px` wide with the arena and uses the same two-column, max-8-visible-card grid.
- The dock height is content-driven. Do not reintroduce fixed values like `--mana-skill-dock-height: 219px`.
- Use the same game font treatment as TD through the shared skill-card styles.
- Use the TD XP HUD pattern: a visible circular badge with a conic XP fill, a masked center, and the XP details/track shown only on hover or focus.
- Patch the Gem XP badge and skill cards dynamically in place. XP gains, gem particles, or resource ticks must not rebuild the dock.

For the Gem XP badge, copy the TD badge structure precisely:

- `.mana-xp-bar` mirrors `.defense-hud-xp`: absolute top-left circular shell, transparent background, no box chrome.
- `.mana-xp-badge` mirrors `.defense-xp-badge`: same clamp size, padding, border, conic gradient, box shadows, and 19px level number.
- The badge must have a `::before` inner disk (`inset: 7px`) so the yellow progress reads as an annular ring, not as a pie slice.
- `manaXpProgress` should keep smooth decimal progress, e.g. `Number(((current / required) * 100).toFixed(2))`; do not floor it.
- The hover/focus body must show the level and the XP text/track. Use a separate dynamic value for the detail level if the visible badge already owns `data-dynamic-value="mana-xp-level"`.

For Gem tabs, do not trust older local overrides:

- Old Gem CSS may still declare `grid-template-columns: auto minmax(0, 1fr)` or `font-size: 9px` for `.mana-skill-dock .skill-shop-tab`. Override it later in the cascade or remove it.
- The final effective selector should include `.mana-skill-dock .skill-shop-tab` beside `.defense-skill-dock .skill-shop-tab` for centered layout.
- The final effective selector should include `.mana-skill-dock .skill-shop-tab strong` beside TD's tab label selector for 24px centered labels.

## Card Contract

Use a card model equivalent to `SkillShopCard`:

```ts
{
  action: string;
  skillId: string;
  title: string;
  value: string;
  delta: string;
  detail: string;
  level: number;
  maxLevel: number;
  costHtml: string;
  costText: string;
  isMaxed: boolean;
  isDisabled: boolean;
  isLocked: boolean;
  isUnaffordable: boolean;
}
```

Render states exactly:

- `isLocked`: disabled, dark, no price, no green delta, no locked text.
- `isUnaffordable`: disabled, dark, not reactive to hover/click.
- `isMaxed`: show `Max`, green max styling, no buy action.
- Buyable: has `data-action`, cost visible, hover/press animation enabled.

Locked skills must not show helper text like `locked`, and they must not show price or green delta.

Actionability is a contract, not just styling:

- A card is actionable only when it is not disabled, locked, unaffordable, or maxed.
- Inactive cards must not dispatch buys, start research, run press feedback, run hover bounce, or catch pointer clicks.
- Do not rely on `disabled` alone. Keep a helper equivalent to `isManaSkillButtonActionable` for click guards and a snapshot helper equivalent to `isManaSkillCardActionableSnapshot` for dynamic card patches.
- When a card becomes inactive, remove `data-action`, set `disabled`, clear one-shot hover state, and make the dock CSS non-interactive for that inactive state.

## Responsive Rules

For S size:

- Reduce title/value text.
- Use compact titles via `data-compact-title`.
- Hide green delta text.
- Hide skill cost.
- Keep the card one-line when possible.

For M/L:

- Show title, value, green delta, and cost.
- Keep text inside the card. Prefer smaller text and nowrap on values over expanding layout.

## Animation Rules

Hover and press animation bugs have already happened here. Preserve these rules:

- Install hover listeners once, globally.
- Trigger hover bounce only on pointer enter/focus, not on every render, and only for actionable cards.
- The hover animation may bounce once, but the card must stay at its hover scale while the pointer remains over it.
- Press/click uses the smaller pressed bounce and then returns to the correct hover or idle scale.
- Do not rebuild skill cards while only values/costs change.
- Patch dynamic card text/cost in place through `updateDynamicDefenseSkillCards`-style logic.
- Rebuild the dock only when the tab, card identity/order, structural lock state, max state, or layout mode changes.
- Keep disabled, locked, and unaffordable cards non-reactive.
- For Crystal/Gem, include `:not(.is-maxed)` in hover, focus, active, and one-shot hover selectors too. Maxed cards looked disabled but still bounced before; don't repeat that.
- Tab changes should cascade cards in with the shared `is-tab-entering` class and `defense-skill-tab-enter` keyframes.
- Track the previous selected tab with `last...SkillDockTab`. Pass `animateCardCascade` only when the selected tab actually changes, not on resource ticks or forced value updates.
- Add the target dock to the tab-entering CSS selector, e.g. `.mana-skill-dock .skill-shop-card.is-tab-entering`.

If a hover animation restarts during combat/resource ticks, the dock is being rebuilt too often. Fix the render signature before tweaking CSS.

## Inactive Card Guard

The Crystal dock had a real bug where cards that could not be bought still played hover/press reactions. Fix this with three independent guards every time you port the dock:

1. Hover guard: `installOneShotHoverAnimations` must query only actionable cards, for example `.mana-skill-dock .skill-shop-card:not(:disabled):not(.is-unaffordable):not(.is-locked):not(.is-maxed)`.
2. Click guard: the dock click handler must call an actionability helper before dispatching. Do not dispatch just because `data-action="buyManaSkill"` exists.
3. CSS guard: inactive scoped cards must be visually dark and non-interactive. For Crystal, the final rule should include `.mana-skill-dock .skill-shop-card.is-unaffordable`, `.is-locked`, and `.is-maxed` with `pointer-events: none`.

This is deliberately redundant. If one layer regresses, the other two prevent bounce/press bugs from coming back.

## Dynamic Update Contract

Use two signatures, not one:

- `...SkillDockSignature(state)` controls full dock rebuilds. It may include the selected tab and skill levels. It must exclude volatile values: current resource totals, timers, combat ticks, active enemies, projectiles, animation counters, DPS readouts, and current damage popup counts.
- `...SkillCardDynamicSignature(state)` controls cheap in-place card updates. It may include the dock signature plus the floored purchase resource if affordability or displayed cost can change without a structural rebuild.

The dynamic updater must patch existing card nodes in place:

- Use conditional setters equivalent to `setTextContentIfChanged`, `setInnerHTMLIfChanged`, `setAttributeIfChanged`, and `setStylePropertyIfChanged`.
- Do not use `dock.innerHTML`, `replaceChildren`, or card recreation in the dynamic update path.
- Update `disabled`, `is-locked`, `is-unaffordable`, `is-maxed`, `data-action`, `aria-label`, `title`, `[data-skill-card-value]`, `[data-skill-card-delta]`, and `[data-skill-card-buy]` without replacing the card.
- Bind the dynamic click handler once per card, for example with a `data-...ClickBound` flag.
- Call `clearOneShotHoverTarget(card)` when a card becomes disabled, locked, maxed, or unaffordable.
- Recompute `canAct` from the fresh snapshot in the dynamic updater. If `canAct` is false, remove the buy action and keep the card inert even if the old DOM node previously had an action.

This is the part that keeps TD purchases from resetting monster, orb, projectile, hover, and counter animations. If a resource tick rebuilds the dock, that's the bug.

## Performance Rules

The skill dock shares a panel with live combat, so it must behave like HUD chrome, not like a mini-game renderer:

- Full dock rebuilds belong in `refresh...SkillDock`, and only after a structural signature change or an explicit forced purchase/tab change.
- Resource and combat ticks should call `updateDynamic...SkillCards` and exit quickly when the dynamic signature is unchanged.
- Never solve visual freshness by rerendering the whole dock every frame. It will look fine for 30 seconds, then it will waste frame budget and reset one-shot animations.
- Keep skill card DOM stable during hover/focus/press. Stable DOM beats clever CSS here.
- Do not copy TD combat canvas, orb, enemy, projectile, or pooling code into another mini-game just because this skill mentions TD. This skill only owns the skill dock pattern.

## Porting Workflow

1. Add the target mini-game skill ids and rule helpers in the simulation layer.
2. Build one `...SkillShopTabs(state)` function that returns tabs with card definitions.
3. Reuse the generic `skillShopCard` renderer if possible. If not, keep the same class names and card contract.
4. Add a `...SkillDockSignature(state)` that excludes volatile values such as current damage, current resource totals, timers, or animation counters.
5. Add `refresh...SkillDock` and `updateDynamic...SkillCards` so value changes update in place.
6. Add a separate `...SkillCardDynamicSignature(state)` when affordability or resource display needs to change without rebuilding the dock.
7. Add `last...SkillDockTab` and pass `animateCardCascade` when a real tab change occurs.
8. Add actionability helpers and use them in every click path before dispatching purchases or timed research.
9. Add scoped CSS overrides, for example `.snake-skill-dock .skill-shop-card`, instead of changing global `.skill-shop-card` behavior blindly.
10. Add scoped inactive rules for locked, unaffordable, maxed, and disabled cards. If that dock can use `pointer-events: none` without breaking keyboard behavior, use it.
11. Add static tests for:
   - two-column grid
   - max 8 visible cards and internal scroll
   - locked cards showing no price/delta text
   - no volatile values in the dock rebuild signature
   - a dynamic card signature that can update affordability in place
   - dynamic updates using conditional setters instead of replacing card nodes
   - disabled/unaffordable/max cards clearing one-shot hover state
   - target mini-game tabs and labels.
   - tab labels centered in the final effective selector, especially for Gem
   - tab cascade selectors on the target dock
   - XP badge ring using the inner `::before` mask, not a full pie slice
   - smooth XP progress with two decimals, not floored integer progress
   - actionability helpers guarding the dock click handler before dispatch
   - hover selectors excluding disabled, locked, unaffordable, and maxed cards
   - inactive scoped CSS using `pointer-events: none` where appropriate
12. Run the narrow HUD test, then `npm run build`.

## Naming And Tabs

Keep tab labels short. The TD precedent is:

- `Attack`
- `Element`
- `Other`

Short skill labels work best in this card style. Prefer names like `Damage +`, `Gold +`, `Gold x`, `Health +` over longer explanatory labels.

## Common Failure Modes

- Skill grid overlaps the mini-game: dock is positioned/flexed wrong; fix layout, not card size first.
- Too much empty dock space: make the dock responsive to the number of visible cards.
- Cards jump or hover restarts: the dock is being rebuilt on volatile state.
- Cards become buyable but stay disabled: the dynamic updater is not toggling `data-action`, `disabled`, and affordability classes in place.
- Purchases reset unrelated TD animations: the purchase path is forcing a broad render or replacing stable nodes outside the dock.
- Hover animation loops while the pointer is still on the card: the card node is being recreated, or the hover class is being retriggered every update.
- A locked/unaffordable/maxed card still bounces: the hover selector, click guard, or scoped `pointer-events: none` rule is missing. Fix all three, not just the one visible symptom.
- Locked card still shows a price: make `costHtml` empty when locked.
- S size is unreadable: hide delta/cost and use `data-compact-title`.
- More than 8 cards stretch the panel: put overflow on `.skill-shop-card-grid`.
- Static tests fail after a legitimate implementation change: update the guardrail to protect the current invariant, not stale text from an older dock.
- XP badge looks like a yellow pizza slice: the inner `::before` mask is missing.
- XP badge progress jumps in chunks: progress is floored instead of kept as decimal percent.
- Gem tab text is left aligned: an older `.mana-skill-dock .skill-shop-tab` grid rule is still winning.
- Gem tab text is tiny: the old 9px local strong rule is still winning.
- Tab card cascade does not play: `animateCardCascade` is not passed, or the target dock is missing from `.skill-shop-card.is-tab-entering`.
