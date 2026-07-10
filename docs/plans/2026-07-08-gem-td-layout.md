# gem-td-layout

Objective:
Porter le mini-jeu Gem au format TD: aire de jeu Gem 480x480 et box skill de 480px directement en dessous.

Completion threshold:
- Le panneau Gem n'est plus un carré global qui compresse le dock.
- L'arène `.mana-crystal-arena` utilise une surface carrée de 480px quand le viewport le permet.
- Le dock `.mana-skill-dock` reste sous l'arène et prend la même largeur que le jeu.
- Le rendu réutilise les patterns de skill dock TD déjà en place.

Verification surface:
- `src/style.css`
- `tests/hudStatic.test.ts`
- `npx tsx tests/hudStatic.test.ts`
- `npm run build`

Constraints:
- Ne pas toucher au gameplay Gem.
- Ne pas modifier le layout TD.
- Ignorer les diffs locaux non liés.

Boundaries:
- Changement CSS scoped à `data-book-id="mana"` et aux règles partagées déjà utilisées par les docks.
- Test statique mis à jour uniquement pour verrouiller le nouveau contrat 480px + dock.

Blocked condition:
- Aucun blocker restant.

Work Checklist:
- [x] Besoin utilisateur copié en critères vérifiables.
- [x] Source Gem et dock TD lues avant édition.
- [x] Layout Gem changé en colonne arène 480px + dock.
- [x] Garde-fou statique mis à jour.
- [x] Test HUD statique passé.
- [x] Build passé.
- [x] Browser proof évalué: outil browser direct non exposé dans cette session; source/build/test utilisés.

Start Gates:
| Gate | Applies | Evidence |
|------|---------|----------|
| Prompt requirements captured | yes | 480x480 Gem arena plus skill box below |
| Source of truth read | yes | TD dock and Gem panel CSS/HUD owners inspected |
| TDD decision | yes | visual CSS port; static HUD guard used instead of fake behavior test |
| Browser route identified | yes | `http://127.0.0.1:5173/` |

Completion Gates:
| Gate | Applies | Required action | Evidence |
|------|---------|-----------------|----------|
| Targeted behavior verification | yes | Run HUD static test | `npx tsx tests/hudStatic.test.ts` -> `hudStatic ok` |
| Build-sensitive behavior changed | yes | Run build | `npm run build` -> passed |
| Browser surface changed | yes | Use browser proof or record blocker | Browser-use tool not exposed; source/build/static proof recorded |
| Autoreview | yes | Check diff against request | Scope limited to Gem layout CSS and HUD static assertions |
| Goal plan complete | yes | Run autogoal completion check | `check-complete.mjs` passed |

Phase / pass table:
| Phase | Status | Evidence | Next |
|-------|--------|----------|------|
| Intake and source read | complete | Gem/TD CSS and HUD source inspected | done |
| Implementation | complete | `src/style.css` updated | done |
| Verification | complete | HUD static test and build passed | done |
| Closeout | complete | final response next | done |

Findings:
- Gem was still sized like a square whole panel, so the dock was forced into the same square instead of sitting under a 480px game area.
- A later generic `.book-page-body` rule overrode the first Gem-specific body rule; an after-the-generic override is required.

Decisions and tradeoffs:
- Keep this as CSS/layout work only; no gameplay or Gem skill data changes.
- Keep the dock height behavior already used by Gem, only align width and position with the TD format.

Timeline:
- 2026-07-08: created plan, read relevant CSS/HUD code, implemented layout, updated static guard, ran verification.

Verification evidence:
- `npx tsx tests/hudStatic.test.ts` passed with `hudStatic ok`.
- `npm run build` passed.
- `node /Users/zbeyens/.codex/skills/autogoal/scripts/check-complete.mjs docs/plans/2026-07-08-gem-td-layout.md` passed.

Reboot status:
| Question | Answer |
|----------|--------|
| Where am I? | Closeout |
| Where am I going? | Final answer |
| What is the goal? | Gem uses a 480px square game area with a TD-style skill box below |
| What have I learned? | Existing square panel sizing was the issue; body override order mattered |
| What have I done? | CSS layout and HUD static guard updated |

Open risks:
- Live browser visual proof was not captured because the browser-use tool was not exposed in this session.
