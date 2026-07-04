---
name: td-skill-boxes
description: Implement or port the Bastion Arcanique tower-defense skill box layout to another Library Magic mini-game. Use when adding a tabbed skill dock, two-column upgrade cards, S/M/L responsive skill cards, locked/unaffordable/max states, scroll-limited skill grids, or stable hover/buy animations based on the current TD mini-game UI.
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
  - `updateDynamicDefenseSkillCards`
  - `installOneShotHoverAnimations`
- `src/style.css`
  - generic `.skill-shop-*` styles
  - dock overrides under `.defense-skill-dock`
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

The current TD CSS variables are the baseline:

```css
--td-skill-visible-card-limit: 8;
--td-skill-visible-card-rows: 4;
--td-skill-visible-card-height: 30px;
--td-skill-visible-card-gap: 5px;
--td-skill-visible-grid-height: 142px;
```

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
- Trigger hover bounce only on pointer enter/focus, not on every render.
- Do not rebuild skill cards while only values/costs change.
- Patch dynamic card text/cost in place through `updateDynamicDefenseSkillCards`-style logic.
- Rebuild the dock only when the skill tab, card list, lock state, max state, or affordability state changes.
- Keep disabled, locked, and unaffordable cards non-reactive.

If a hover animation restarts during combat/resource ticks, the dock is being rebuilt too often. Fix the render signature before tweaking CSS.

## Porting Workflow

1. Add the target mini-game skill ids and rule helpers in the simulation layer.
2. Build one `...SkillShopTabs(state)` function that returns tabs with card definitions.
3. Reuse the generic `skillShopCard` renderer if possible. If not, keep the same class names and card contract.
4. Add a `...SkillDockSignature(state)` that excludes volatile values such as current damage, current resource totals, timers, or animation counters.
5. Add `refresh...SkillDock` and `updateDynamic...SkillCards` so value changes update in place.
6. Add scoped CSS overrides, for example `.snake-skill-dock .skill-shop-card`, instead of changing global `.skill-shop-card` behavior blindly.
7. Add static tests for:
   - two-column grid
   - max 8 visible cards and internal scroll
   - locked cards showing no price/delta text
   - no volatile values in the dock rebuild signature
   - target mini-game tabs and labels.
8. Run the narrow HUD test, then `npm run build`.

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
- Locked card still shows a price: make `costHtml` empty when locked.
- S size is unreadable: hide delta/cost and use `data-compact-title`.
- More than 8 cards stretch the panel: put overflow on `.skill-shop-card-grid`.

