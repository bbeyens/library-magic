# Library Magic

Library Magic is an incremental game about a magical library. Each unlocked book contains a focused mini-game that feeds shared progression through Mana and book-specific resources.

## Language

### Core Loop

**Mana**:
The shared resource used across the whole library. Mana unlocks books and powers upgrades, while individual books can also generate their own resources.
_Avoid_: Energy, crystals

**Book Mini-Game**:
A focused game contained inside a book page. It is part of the library, not a separate game mode or external screen.
_Avoid_: Screen, app, mode

**Book Page**:
The opened view of a book mini-game. It is the place where the player interacts with that book's activity and upgrades.
_Avoid_: Modal, popup, screen

**Unlock**:
The act of opening access to a new book by paying its required resources. Unlocking is distinct from selecting or upgrading a book.
_Avoid_: Buy book, open screen

**Unique Resource**:
A resource produced by one specific book and used to gate later books or local upgrades. Unique resources sit beside Mana; they do not replace it.
_Avoid_: Currency, points

### Books

**Grimoire de Mana**:
The first book mini-game. It generates Mana directly through a focused mana interaction and introduces the library loop.
_Avoid_: Mana crystal, crystal book

**Livre du Serpent**:
The snake-themed book mini-game. It generates Ecailles and Mana through a simple snake interaction.
_Avoid_: Snake screen, snake app

**Arc Typing**:
The typing-themed book mini-game. It is expected to generate Runes through short glyph typing.
_Avoid_: Typing mode, keyboard app

**Rune Typing**:
The active Arc Typing interaction where the player types displayed English fantasy words directly from the keyboard. Completing a word grants Runes; wrong keys keep the same word but suppress combo/reward until three perfect words are completed.
_Avoid_: Text input, typing form, Mana typing

**Herbier Enchante**:
The herbarium-themed book mini-game. It is expected to generate Spores through slow, gentle production.
_Avoid_: Farm mode, garden screen

**Bastion Arcanique**:
The tower-defense book mini-game. It uses one unique tower inside a Book Page to repel waves and generate Sceaux.
_Avoid_: Tower mode, defense screen, tower placement game

**Table du Blackjack**:
The blackjack-themed book mini-game. It produces Jetons through short card hands where the player deals, hits, stands, and resolves against the dealer.
_Avoid_: Casino mode, card app

**Calcul du Cent**:
The number-draw Book Mini-Game. It produces Fragments by reaching 100 without exceeding the current target band.
_Avoid_: Number mode, math app

**Galerie des Cibles**:
The target-clicking Book Mini-Game. It produces Marques by clicking targets, improving damage, and later automating shots.
_Avoid_: Target mode, aim trainer

**Mine des Profondeurs**:
The digging Book Mini-Game. It breaks Blocs de mine in a 6x6 isometric terrain. Each cell renders as an independent five-layer tile model with visible top and side depth, so broken front blocks reveal the blocks behind them. When every block in the terrain has been destroyed, the next Terrain de mine cycle starts with the same dimensions and a later depth band.
_Avoid_: Mining mode, digging app

**Slime Trainer**:
The creature-battle Book Mini-Game. It produces Gels by training one slime against monsters through four command slots that unlock as the slime gains levels.
_Avoid_: Pokemon clone, battle screen, pet app

### Resources

**Ecailles**:
The unique resource produced by the Livre du Serpent.
_Avoid_: Scales, snake points

**Runes**:
The unique resource produced by Arc Typing.
_Avoid_: Glyph points, typing points

**Spores**:
The unique resource produced by Herbier Enchante.
_Avoid_: Seeds, plant points

**Sceaux**:
The unique resource produced by Bastion Arcanique.
_Avoid_: Tokens, tower points, defense coins

**Jetons**:
The unique resource produced by Table du Blackjack.
_Avoid_: Money, cash, coins

**Fragments**:
The unique resource produced by Calcul du Cent.
_Avoid_: Points, numbers

**Marques**:
The unique resource produced by Galerie des Cibles.
_Avoid_: Target points, score

**Pieces de mine**:
The local Mine currency produced by exchanging Mine material resources. It is stored under the legacy `minerals` resource id for progression compatibility.
_Avoid_: Mana, raw ore loot, crystals

**Gels**:
The unique resource produced by Slime Trainer.
_Avoid_: Slime points, slime coins, XP

**Bloc de mine**:
A diggable cell inside Mine des Profondeurs. Each block is an independent isometric tile with up to five visible layers, hit points, a numbered sprite/depth tier, a light-to-dark shade position inside its terrain band, and a material such as Terre, Pierre, Sable, Charbon, Fer, Or, Rubis, Lapis, Diamant, Emeraude, or Obsidienne.
_Avoid_: Tile, square, rock

**Materiau de mine**:
The material resource produced when a Bloc de mine breaks. Material resources are Terre, Pierre, Sable, Charbon, Fer, Or, Rubis, Lapis lazuli, Diamant, Emeraude, and Obsidienne; they are exchanged into Pieces de mine instead of Mana.
_Avoid_: Mana reward, color only

**Profondeur**:
The escalating layer of a Bloc de mine. Greater Profondeur means the next visible layer has more hit points, moves through sprite tiers every five layers, and may cast small neighbor shadows when it is lower than adjacent blocks.
_Avoid_: Stage, wave, level

**Terrain de mine**:
A full 6x6 set of five-layer Blocs de mine. Destroying all five layers across all 36 blocks advances to the next Terrain de mine cycle while preserving the same tile dimensions for later recolors.
_Avoid_: One slab, background board, whole floor

### Progression

**Upgrade**:
A local improvement bought for a specific book. Upgrades make that book stronger without changing what the book fundamentally is.
_Avoid_: Global upgrade, perk

**Puissance**:
The main upgrade track for a book. Puissance represents the book becoming stronger at its core activity.
_Avoid_: Power, level only

**Automatisation**:
The upgrade effect that lets an unlocked book keep producing over time. Automatisation is still tied to a book; it is not a global idle engine.
_Avoid_: Idle mode, auto-play

**Resonance**:
The later upgrade effect that represents extra output from a more developed book. Resonance should feel like a bonus from mastery, not a separate resource.
_Avoid_: Combo, prestige

**Pinned Book**:
A book kept active in the pinned zone while the player focuses elsewhere. Pinned books prove the late-game direction where several books can matter at once.
_Avoid_: Favorite, shortcut

**Serpent Run**:
A single active attempt inside the Livre du Serpent. It can reset without being a hard failure for the whole library.
_Avoid_: Death, game over
