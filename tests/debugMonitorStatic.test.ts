import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const mainSource = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const styleSource = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

for (const requiredDebugMonitorSource of [
  'installDebugMonitor(game);',
  'installHoverAutoClickHotkey();',
  "event.key !== 'F3'",
  "event.key.toLowerCase() !== 't'",
  'hoverAutoClickInterval = window.setInterval',
  'dispatchSyntheticClick(lastPointerPosition);',
  'id = \'debug-monitor\'',
  'performance as PerformanceWithMemory',
  'document.querySelectorAll(\'*\').length',
  'document.getAnimations().length',
  'state.defense.enemies.length',
  'state.defense.moneyPopups.length',
  'gameInstance.scene.getScenes(false)',
  'Object.keys(textureList).length',
]) {
  assert.equal(
    mainSource.includes(requiredDebugMonitorSource),
    true,
    `F3 debug monitor should expose live memory/cache/game counters: missing ${requiredDebugMonitorSource}`,
  );
}

for (const requiredDebugMonitorStyle of [
  '#debug-monitor',
  '#debug-monitor[hidden]',
  '.debug-monitor-grid',
  '.debug-monitor-label',
]) {
  assert.equal(
    styleSource.includes(requiredDebugMonitorStyle),
    true,
    `F3 debug monitor should have readable overlay styles: missing ${requiredDebugMonitorStyle}`,
  );
}

console.log('debugMonitorStatic ok');
