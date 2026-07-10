---
name: td-performance-debug
description: Diagnose and fix progressive FPS drops, memory leaks, cache growth, DOM buildup, or animation churn in the Library Magic Bastion Arcanique tower-defense mini-game. Use when TD performance degrades over minutes, especially after x1/x2/x4 runs, wave 100 loops, money particles, damage popups, Web Animations API effects, enemy sprites, or HUD updates.
---

# TD Performance Debug

Use this skill before guessing at TD lag. Prove whether growth is in simulation state, DOM churn, Web Animations, CSS paint, or asset rendering. Do not "fix" TD FPS by capping user-visible combat effects unless the user explicitly asks for caps.

## Fast Triage

1. Run the simulation probe first. If it is bounded, stop blaming spawn rules.
2. Profile the browser with the same condition the user reported: usually TD wave 100, full skills, x2 or x4, base speed ON, debug tower health ON.
3. Before trusting FPS numbers, confirm the browser window is on the intended refresh-rate display. A clean 120 FPS run can look like a late drop if Chrome is moved to a 60 Hz monitor.
4. Track FPS, DOM node count, `document.getAnimations().length`, `.defense-actors` child count, and active counts for enemies, shots, lightning, money, damage popups, and impact bursts.
5. If nodes/animations are bounded but FPS drops, inspect render churn and CSS paint. The known bad pattern is repeated DOM/text/CSS rewrites, not necessarily leaked nodes.
6. Patch the smallest render churn source. Preserve visible behavior, especially enemy spawn/entry animation.
7. Add or update static guards in `tests/hudStatic.test.ts`.
8. Run `npx tsx tests/defenseRules.test.ts`, `npx tsx tests/hudStatic.test.ts`, `npm run typecheck`, and `npm run build`.

## Simulation Probe

Use this probe first. It should stay bounded even at wave 100:

```bash
npx tsx --eval "import { createInitialState } from './src/game/simulation/state.ts'; import { tickState } from './src/game/simulation/actions.ts'; const s=createInitialState(); s.books.defense.unlocked=true; s.openBookPanels=[{bookId:'defense',slot:0}]; s.resources.sigils=1_000_000_000; s.defense.wave=100; s.defense.speedMultiplier=1; s.defense.towerHealth=1_000_000; Object.assign(s.defenseSkills,{damage:999,damageMultiplier:999,attackSpeed:999,range:999,criticalChance:999,criticalMultiplier:999,superCriticalChance:999,superCriticalMultiplier:999,lightningDamage:999,lightningSpeed:999,lightningCount:999,iceDamage:999,iceSpeed:999,iceRange:999,iceSlow:999,health:999,healthRegen:999,moneyPerEnemy:999,goldMultiplier:999,xpGain:999,xpMultiplier:999}); let max={enemies:0,shots:0,proj:0,lightning:0,damage:0,money:0,wave:0,ids:0,spawned:0,kills:0}; let now=0; s.lastTick=0; for(let i=1;i<=60*60*8;i++){ now=i*1000/60; tickState(s, now); const d=s.defense; if(d.towerHealth<1000)d.towerHealth=1_000_000; max.enemies=Math.max(max.enemies,d.enemies.length); max.shots=Math.max(max.shots,d.shots.length); max.proj=Math.max(max.proj,d.enemyProjectiles.length); max.lightning=Math.max(max.lightning,d.lightningStrikes.length); max.damage=Math.max(max.damage,d.damagePopups.length); max.money=Math.max(max.money,d.moneyPopups.length); max.wave=Math.max(max.wave,d.wave); max.ids=Math.max(max.ids,d.nextEnemyId); max.spawned=Math.max(max.spawned,d.spawnedThisWave); max.kills=Math.max(max.kills,d.killsThisWave); } console.log(JSON.stringify({final:{wave:s.defense.wave,enemies:s.defense.enemies.length,shots:s.defense.shots.length,proj:s.defense.enemyProjectiles.length,lightning:s.defense.lightningStrikes.length,damage:s.defense.damagePopups.length,money:s.defense.moneyPopups.length,nextEnemyId:s.defense.nextEnemyId,spawned:s.defense.spawnedThisWave,kills:s.defense.killsThisWave},max},null,2));"
```

Good signs:
- `wave` stays at `100`.
- `enemies`, `shots`, `enemyProjectiles`, `lightningStrikes`, `damagePopups`, and `moneyPopups` stay bounded.
- `nextEnemyId` may grow; that is only a leak if it is used as a key in an unpruned `Map`, DOM node, or cache.

If this probe stays bounded but the browser drops to low FPS, the bug is rendering. Do not add more simulation caps as a reflex.

## State Suspects

Search the TD arrays and caps:

```bash
rg -n "enemies|shots|enemyProjectiles|lightningStrikes|damagePopups|moneyPopups|splice|filter|next.*Id" src/game/simulation/actions.ts src/game/simulation/state.ts
```

Fix state leaks in `src/game/simulation/actions.ts` by:
- Filtering expired timers every tick.
- Capping visual arrays with `splice`.
- Resetting per-wave counters only when a wave actually loops.
- Clamping final-wave loops to `DEFENSE_FINAL_WAVE`.

## UI Suspects

If simulation is bounded, inspect render churn:

```bash
rg -n "new Map|new Set|querySelectorAll|insertAdjacentHTML|appendChild|animate\\(|setTimeout|addEventListener|getAnimations" src/ui/hud.ts
```

Known fragile areas:
- `defenseEnemyHealthSnapshots`: delete IDs when enemies leave the DOM.
- `.defense-money-popup`, `.defense-impact-burst`, `.defense-damage-popup`: remove nodes whose IDs are no longer live.
- Web Animations API effects: cancel or cleanup finished animations.
- Hover animations: do not let TD combat rerenders replace hovered buttons.
- Money particles: keep visual coin count and active popups bounded if the user has already accepted that behavior; do not introduce new caps as a fake fix.

Known successful fixes from the 10-minute x2 wave-100 regression:
- Add temporary dev instrumentation around `updateDynamicDefensePanel` and expose `window.__libraryMagicHudPerf`. Break `renderHud` into sections such as `setup`, `controls`, `skills`, `hud`, `actors-setup`, `enemies`, `attacks`, and `money`. This prevents guessing when the total FPS drops.
- Draw TD damage numbers and short impact bursts on one `.defense-effects-canvas` instead of creating/removing `.defense-damage-popup` and `.defense-impact-burst` DOM nodes.
- Keep enemy spawn normal. Do not pool/reuse `.defense-enemy` nodes if that makes monsters appear strangely or keeps stale animation phase.
- Do not depth-sort enemies by repeatedly calling `actorsLayer.appendChild(enemyElement)`. That churns DOM and can restart CSS sprite animations. Prefer updating a per-enemy `z-index` from the enemy Y position.
- For simple one-shot effects, do not recycle by reparsing HTML through `<template>` or by `replaceChildren` every activation. Use direct DOM activation helpers instead:
  - `activateDefensePooledIconEffect`
  - `activateDefenseShotElement`
  - `activateDefenseEnemyProjectileElement`
  - `activateDefenseLightningStrikeElement`
  - `activateDefenseMoneyPopupElement`
  - `syncDefenseMoneyPopupElement`
- For hidden pooled TD effects, prefer a cheap `is-pooled-hidden` class over `getAnimations()` cancellation on every deactivation. CSS can pause/disable hidden animations; repeated `getAnimations({ subtree: true })` is a long-run spike source.
- Avoid layout reads in reward HUD effects. Do not use `offsetLeft`, `offsetTop`, or `offsetWidth` to position the TD money pulse; center it with CSS instead.
- Cache actor/canvas sizes by DOM element, not by short timers. Repeated `clientWidth`, `clientHeight`, and `getBoundingClientRect` sampling can create periodic frame spikes.
- Do not prune pooled wave DOM every cleanup pulse when the layer is tiny. Skip pruning unless `.defense-actors.childElementCount` is above a real threshold.
- Replace direct hot-path writes with conditional setters:
  - `setTextContentIfChanged(element, value)`
  - `setInnerHTMLIfChanged(element, value)`
  - `setAttributeIfChanged(element, name, value)`
  - `setStylePropertyIfChanged(element, property, value)`
- Avoid broad rerenders of skill docks while hovering. Static dock signatures must not include volatile money counters; dynamic card updates should patch existing nodes.
- Pre-bake glow/outline into sprites when runtime `filter: drop-shadow(...)` appears on many combat actors.

Do not repeat the bad fix:
- Do not cap lightning, impacts, money, or animations unless explicitly requested.
- Do not touch unrelated orbit/orb animations while investigating TD FPS.
- Do not leave pooled enemy nodes hidden in `.defense-actors` if that changes enemy arrival visuals.
- Do not add an invisible "cadence keeper" animation to force Chrome/ProMotion awake. If FPS clamps to exactly 60 while HUD section timings stay low, first verify the active display refresh rate and browser window placement.
- Do not treat a single isolated low sample as the same thing as progressive decay. Check recent 60s and 120s windows; the release-blocking failure is sustained degradation after several minutes.

For Web Animations API effects, use this pattern:

```ts
function cleanupFinishedAnimation(animation: Animation): void {
  animation.addEventListener('finish', () => animation.cancel(), { once: true });
}
```

Cancel older same-purpose animations before starting a new one on the same element:

```ts
element
  .getAnimations()
  .filter((animation) => animation.id === 'specific-td-animation-id')
  .forEach((animation) => animation.cancel());
```

## CSS Paint Suspects

If state and DOM are clean but FPS still drops, inspect expensive effects:

```bash
rg -n "filter:|drop-shadow|blur|box-shadow|animation:|will-change|mix-blend|backdrop-filter" src/style.css
```

Prefer:
- Fewer simultaneous `filter: drop-shadow(...)` chains.
- Fewer animated nodes for coins and impact bursts.
- Sprite-sheet `steps()` animations over DOM churn.
- Static CSS variables updated in place instead of rebuilding markup.

Prefer canvas for very short high-frequency combat overlays:
- Damage numbers.
- Fire/ice/lightning impact bursts.
- Tiny one-shot sparks attached to an attack.

Keep DOM for semantic HUD, persistent actors, controls, and sprites whose CSS animation is part of gameplay readability.

## Browser Profiling Recipe

Use the in-app browser or Playwright/Node REPL. If a single tool call cannot wait 10 minutes, keep the same page open and sample in several calls.

Profile setup:

```js
const debug = window.__libraryMagicDebug ?? { dispatch: gameStore.dispatch.bind(gameStore), snapshot: gameStore.snapshot };
debug.dispatch({ type: 'unlockAllBooks' });
debug.dispatch({ type: 'grantDebugResources' });
debug.dispatch({ type: 'maxAllSkills' });
debug.dispatch({ type: 'setDefenseDebugTowerHealth', enabled: true });
debug.dispatch({ type: 'setDefenseWave', wave: 100 });
debug.dispatch({ type: 'selectBook', bookId: 'defense' });
debug.snapshot.defense.speedMultiplier = 2;
debug.snapshot.defense.baseSpeedEnabled = true;
debug.snapshot.defense.paused = false;
debug.snapshot.defense.towerHealth = 10000;
window.__libraryMagicPerf?.reset?.();
window.__libraryMagicHudPerf?.reset?.();
```

Sample these values:

```js
const active = (selector) =>
  Array.from(document.querySelectorAll(selector)).filter((el) => !el.classList.contains('is-pooled-hidden')).length;

({
  fpsHud: document.querySelector('#frame-counter')?.textContent,
  nodes: document.querySelectorAll('*').length,
  animations: document.getAnimations().length,
  actors: document.querySelector('.defense-actors')?.children.length ?? 0,
  enemies: active('.defense-enemy'),
  shots: active('.defense-shot'),
  lightning: active('.defense-lightning-strike'),
  money: active('.defense-money-popup'),
  damageDom: active('.defense-damage-popup'),
  impactDom: active('.defense-impact-burst'),
  canvas: Boolean(document.querySelector('.defense-effects-canvas')),
  hudPerf: window.__libraryMagicHudPerf
    ? {
        maxTotalMs: window.__libraryMagicHudPerf.maxTotalMs,
        sectionMaxMs: window.__libraryMagicHudPerf.sectionMaxMs,
        slowFrames: window.__libraryMagicHudPerf.slowFrames?.slice(-6),
      }
    : null,
});
```

Good evidence for this exact regression:
- Browser stayed on a 120 Hz display for the whole run. If the counter clamps to exactly 60 with low HUD timings, move the browser back to the 120 Hz display before changing code.
- After about 10 minutes at x2, FPS does not collapse near 12 and recent 60s/120s windows remain stable.
- DOM nodes and `document.getAnimations().length` remain bounded.
- `damageDom` and `impactDom` stay at `0` when those effects are canvas-rendered.
- `window.__libraryMagicHudPerf.sectionMaxMs.money` and `.attacks` stay low after replacing template parsing with direct DOM activation.

Evidence from the 8h20 debugging run:
- False lead: a late "drop" to 60 FPS was caused by moving Chrome to a 60 Hz display, not by TD.
- Real hot paths: `money`, `attacks`, `actors-setup`, and occasional `enemies` spikes inside `updateDynamicDefensePanel`.
- Durable fix: direct DOM activation for pooled effects, no layout reads for money pulse, no animation scans on pooled deactivation, and no unconditional cleanup-prune scans.
- Final proof: 604s wave-100 run at x2/full skills/debug HP on a 120 Hz display; last 120s min 120 FPS, avg about 121 FPS, DOM and animation counts bounded.

## Tests To Add

Use `tests/defenseRules.test.ts` for simulation invariants:
- Final wave stays at 100.
- Effect arrays stay capped.
- Money popup active count stays capped.
- Expired projectiles/popups are filtered.

Use `tests/hudStatic.test.ts` for DOM/rendering guardrails:
- The open TD panel is patched, not rebuilt during combat.
- Removed live IDs delete DOM nodes and cache entries.
- Web Animations API combat effects call `cleanupFinishedAnimation`.
- Hidden pooled TD effects do not call `getAnimations()` on every deactivation.
- Pooled shots, enemy projectiles, lightning, and money popups use direct DOM activation helpers rather than `<template>` parsing.
- The money pulse does not read `offsetLeft`, `offsetTop`, or `offsetWidth`.
- Wave cleanup only prunes hidden pooled effects when the actor layer exceeds a real child-count threshold.
- Hot-path text/style/attribute writes use conditional setters.
- TD damage and impact overlays use `.defense-effects-canvas`.
- Enemy depth uses `z-index`, not DOM sorting with `appendChild`.
- Enemy nodes are not pooled if pooling causes odd spawn visuals.
- Static guards match the implementation. If a guard still expects old DOM damage popups or raw `style.setProperty`, update the guard to protect the new perf behavior instead of restoring the old code.

## Verification

Run:

```bash
npm run typecheck
npx tsx tests/defenseRules.test.ts
npx tsx tests/hudStatic.test.ts
npm run build
```

If browser tooling is available, leave TD open at x1 and x4 for several minutes and inspect:
- FPS trend.
- `.defense-actors` child count.
- `document.getAnimations().length`.
- Counts for `.defense-money-popup`, `.defense-impact-burst`, `.defense-damage-popup`, `.defense-enemy`, and `.defense-shot`.
