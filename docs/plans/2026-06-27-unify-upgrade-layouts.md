# Unify Upgrade Layouts

## Goal

Make every non-Blackjack mini-game upgrade panel use the same track/node layout language as Blackjack, without changing upgrade rules, costs, or progression.

## Scope

- Reuse Blackjack upgrade panel structure for Mana, Serpent, Cibles, Mine, and generic book upgrades.
- Keep compact upgrade controls functional.
- Keep all existing data-action hooks and skill ids.

## Evidence

- `npm test`
- `npm run typecheck`
- `npm run build`
- Local browser inspection of multiple upgrade panels
