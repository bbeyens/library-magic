# New Game Definition Of Done

- The project installs with `npm install`.
- `npm run dev` starts a local Vite server.
- The fast test/typecheck lane completes; build is release-only.
- The first screen is the game, not a landing page.
- The player can interact within 5 seconds.
- A compact game design brief exists: player promise, primary verb, objective, pressure, reward, fail/retry, and non-goals.
- A level/encounter plan exists for the first playable space, track, arena, wave, hole, table, or puzzle.
- There is a clear objective, score, timer, health, level target, or fail condition.
- The core loop is proven through deterministic procedural input intents, not
  only described in text.
- The first playable minute includes at least one meaningful decision and one feedback/reward event.
- Keyboard/mouse input works on desktop.
- Touch or pointer input works if mobile is in scope.
- The camera frames the playable area at desktop and mobile sizes.
- HUD text is readable and does not cover critical gameplay.
- A bounded browser console spot check has no blocking errors when the visible
  runtime changed.
- A screenshot proves the canvas rendered.
- A representative screenshot proves the canvas is not blank; pixel automation
  is optional.
- Final report names design brief, level/encounter plan, controls, verification evidence, and remaining risks.
