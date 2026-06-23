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
