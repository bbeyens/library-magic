import assert from 'node:assert/strict';
import {
  slimeTrainerAvailableCommands,
  slimeTrainerCommandDamage,
  slimeTrainerEnemyAttackDamage,
  slimeTrainerEnemyForVictoryCount,
  slimeTrainerResourceReward,
  slimeTrainerXpReward,
  slimeTrainerXpToNextLevel,
} from '../src/game/simulation/slimeTrainerRules.ts';

assert.deepEqual(
  slimeTrainerAvailableCommands(1).map((command) => command.id),
  ['bounce'],
);

assert.deepEqual(
  slimeTrainerAvailableCommands(4).map((command) => command.id),
  ['bounce', 'shell', 'bubble'],
);

assert.deepEqual(
  slimeTrainerAvailableCommands(6).map((command) => command.id),
  ['bounce', 'shell', 'bubble', 'split'],
);

assert.equal(slimeTrainerXpToNextLevel(1), 5);
assert.equal(slimeTrainerXpToNextLevel(4), 14);

assert.equal(slimeTrainerCommandDamage('bounce', 1), 2);
assert.equal(slimeTrainerCommandDamage('bubble', 5), 8);

const firstEnemy = slimeTrainerEnemyForVictoryCount(0, 1);
assert.equal(firstEnemy.name, 'Mousse-Pique');
assert.equal(firstEnemy.maxHealth, 4);
assert.equal(slimeTrainerXpReward(firstEnemy, 1), 3);
assert.equal(slimeTrainerResourceReward(firstEnemy, 1), 2);
assert.equal(slimeTrainerEnemyAttackDamage(firstEnemy, 1), 1);

const laterEnemy = slimeTrainerEnemyForVictoryCount(5, 6);
assert.ok(laterEnemy.maxHealth > firstEnemy.maxHealth);
assert.ok(slimeTrainerXpReward(laterEnemy, 6) > slimeTrainerXpReward(firstEnemy, 1));
assert.ok(slimeTrainerEnemyAttackDamage(laterEnemy, 6) > slimeTrainerEnemyAttackDamage(firstEnemy, 1));

console.log('slimeTrainerRules ok');
