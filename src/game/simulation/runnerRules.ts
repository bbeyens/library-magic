/**
 * Balance for the Runner mini-game (replaces the old target gallery).
 *
 * Lives absorb enemy contact while attacks determine the number of projectiles in
 * each volley. Keeping those values separate prevents health upgrades from silently
 * multiplying both coverage and damage output.
 *
 * Coins are internal to this mini-game: they are only spendable in its own shop,
 * which is reachable from the Runner home menu between runs.
 */

export type RunnerUpgradeId =
  | 'baseDamage'
  | 'startUnits'
  | 'baseFireRate'
  | 'lateralSpeed'
  | 'attackRange'
  | 'multishot'
  | 'homing'
  | 'projectileSpeed'
  | 'gateQuality'
  | 'coinFlat'
  | 'coinGain';

/** What a gate grants once its hit points are shot away. */
export type RunnerGateKind = 'unit' | 'damage' | 'fireRate' | 'speed';

export const RUNNER_UPGRADE_IDS: readonly RunnerUpgradeId[] = [
  'baseDamage',
  'startUnits',
  'baseFireRate',
  'lateralSpeed',
  'attackRange',
  'multishot',
  'homing',
  'projectileSpeed',
  'gateQuality',
  'coinFlat',
  'coinGain',
];

/** Every permanent Runner skill can also be offered as a run-only portal boost. */
export const RUNNER_BOOST_UPGRADE_IDS: readonly RunnerUpgradeId[] = RUNNER_UPGRADE_IDS;

export const RUNNER_GATE_KINDS: readonly RunnerGateKind[] = ['unit', 'damage', 'fireRate', 'speed'];

// ---------------------------------------------------------------------------
// World layout (lane space, in world units; +z runs away from the camera)
// ---------------------------------------------------------------------------

/** The squad may slide between -X and +X. */
export const RUNNER_LANE_HALF_WIDTH = 2.4;
/** How far ahead of the squad enemies and gates are placed. */
export const RUNNER_SPAWN_AHEAD = 44;
/** Monsters render into the fog first, then become targetable once their silhouette is readable. */
export const RUNNER_ENEMY_TARGETABLE_AHEAD = RUNNER_SPAWN_AHEAD - 4;
/** Small forward collision margin compensating for the Runner camera perspective. */
export const RUNNER_PROJECTILE_HIT_LOOKAHEAD = 0.75;
/** Anything this far behind the squad is recycled. */
export const RUNNER_DESPAWN_BEHIND = 6;

export const RUNNER_BULLET_SPEED = 34;
export const RUNNER_PROJECTILE_LAUNCH_OFFSET = 1.25;
export const RUNNER_ENEMY_SPEED = 1.6;
/** Enemies spawn at 65% of the former frequency, leaving more readable gaps. */
export const RUNNER_ENEMY_SPAWN_FREQUENCY_MULTIPLIER = 0.65;
export const RUNNER_BASE_SPEED = 6;

/** Lives are capped so defensive gates cannot grow health without limit. */
export const RUNNER_MAX_UNITS = 60;
/** How wide a bullet / body counts as, for collisions. */
export const RUNNER_HIT_RADIUS = 0.55;
/** Gates are wide panels, so they are easier to hit than a lone enemy. */
export const RUNNER_GATE_HALF_WIDTH = 0.95;

export const RUNNER_BASE_ATTACKS = 1;
/** Permanent multishot stops at 5; run portals may push the formation up to 20. */
export const RUNNER_MAX_TEMPORARY_MULTISHOT = 20;
export const RUNNER_MAX_ATTACKS = RUNNER_BASE_ATTACKS + RUNNER_MAX_TEMPORARY_MULTISHOT;
/** Shared simulation and renderer budget for all projectiles currently in flight. */
export const RUNNER_MAX_ACTIVE_PROJECTILES = 64;
/** Short hit effects are retained only long enough for the renderer to consume them. */
export const RUNNER_IMPACT_LIFETIME_MS = 460;
/** Bounds both the simulation event ledger and the renderer's instanced burst pool. */
export const RUNNER_MAX_ACTIVE_IMPACTS = 24;
/** Death feedback stays bounded even when a large volley kills a whole pack. */
export const RUNNER_MAX_ACTIVE_DEFEAT_EFFECTS = 16;
export const RUNNER_DEFEAT_EFFECT_LIFETIME_MS = 1_250;

/** Coins per kill step up one tier every this many metres. */
export const RUNNER_COIN_TIER_DISTANCE = 120;
export const RUNNER_BOSS_INTERVAL = 100;
export const RUNNER_CHECKPOINT_INTERVAL = 500;
export const RUNNER_BOOST_PORTAL_INTERVAL = 50;
/** World X is mirrored by the Runner camera, so positive X is the visible left side. */
export const RUNNER_BOOST_PORTAL_LEFT_X = RUNNER_LANE_HALF_WIDTH * 0.52;
export const RUNNER_BOOST_PORTAL_RIGHT_X = -RUNNER_BOOST_PORTAL_LEFT_X;
/** No choice is awarded in this central strip, preventing one overlap from taking both. */
export const RUNNER_BOOST_PORTAL_CENTER_DEAD_ZONE = 0.24;
export const RUNNER_BOSS_HEALTH_MULTIPLIER = 5;
export const RUNNER_BOSS_REWARD_MULTIPLIER = 10;

// ---------------------------------------------------------------------------
// Permanent upgrades (bought with coins from the Runner home menu)
// ---------------------------------------------------------------------------

export function runnerUpgradeMaxLevel(id: RunnerUpgradeId): number {
  switch (id) {
    case 'baseDamage':
      return 20;
    case 'startUnits':
      return 15;
    case 'baseFireRate':
      return 15;
    case 'lateralSpeed':
      return 15;
    case 'attackRange':
      return 15;
    case 'multishot':
      return 5;
    case 'homing':
      return 10;
    case 'projectileSpeed':
      return 15;
    case 'gateQuality':
      return 10;
    case 'coinFlat':
      return 15;
    case 'coinGain':
      return 15;
  }
}

export function runnerUpgradeCost(id: RunnerUpgradeId, level: number): number {
  const safeLevel = Math.max(0, level);
  const base = runnerUpgradeBaseCost(id);
  return Math.ceil(base * Math.pow(1.55, safeLevel));
}

function runnerUpgradeBaseCost(id: RunnerUpgradeId): number {
  switch (id) {
    case 'baseDamage':
      return 1;
    case 'startUnits':
      return 2;
    case 'baseFireRate':
      return 3;
    case 'lateralSpeed':
      return 2;
    case 'attackRange':
      return 3;
    case 'multishot':
      return 8;
    case 'homing':
      return 6;
    case 'projectileSpeed':
      return 3;
    case 'gateQuality':
      return 4;
    case 'coinFlat':
      return 3;
    case 'coinGain':
      return 3;
  }
}

/** Damage each bullet deals, before gate bonuses. */
export function runnerBaseDamage(level: number): number {
  return roundToHundredth(1 + Math.max(0, level) * 0.5);
}

/**
 * Units the squad starts a run with. Starts at 3, not 1: since a unit IS a hit point, a
 * lone starting unit dies to the first enemy it fails to line up with, which cut opening
 * runs to ~5 seconds instead of the intended few tens of seconds.
 */
export function runnerStartUnits(level: number): number {
  return 3 + Math.max(0, level);
}

/** Volleys per second, before gate bonuses. */
export function runnerBaseFireRate(level: number): number {
  return roundToHundredth(3 + Math.max(0, level) * 0.4);
}

/** Maximum sideways travel in lane units per second. */
export function runnerLateralSpeed(level: number): number {
  return roundToHundredth(4.8 + Math.max(0, level) * 0.35);
}

/** Maximum world-space distance travelled by a projectile after it is fired. */
export function runnerAttackRange(level: number): number {
  return roundToHundredth(12 + Math.max(0, level) * 2);
}

/** Extra projectiles added to every volley, capped for rendering stability. */
export function runnerMultishotProjectiles(level: number): number {
  return Math.min(RUNNER_MAX_TEMPORARY_MULTISHOT, Math.max(0, Math.floor(level)));
}

/** Projectiles fired by one volley, independent from the number of remaining lives. */
export function runnerAttackCount(multishotLevel: number): number {
  return Math.min(RUNNER_MAX_ATTACKS, RUNNER_BASE_ATTACKS + runnerMultishotProjectiles(multishotLevel));
}

/** Lateral tracking speed of a guided projectile; level zero disables homing. */
export function runnerHomingStrength(level: number): number {
  const safeLevel = Math.max(0, level);
  return safeLevel <= 0 ? 0 : roundToHundredth(1.8 + safeLevel * 0.55);
}

/** Projectile travel speed in world units per second. */
export function runnerProjectileSpeed(level: number): number {
  return roundToHundredth(RUNNER_BULLET_SPEED + Math.max(0, level) * 2);
}

/**
 * Chance that a gate rolls one notch better than its base value — a "+1" coming out
 * as a "+2". Capped so gates never become a sure thing.
 */
export function runnerGateUpgradeChance(level: number): number {
  return roundToHundredth(Math.min(0.95, Math.max(0, level) * 0.06));
}

export function runnerCoinMultiplier(level: number): number {
  return roundToHundredth(1 + Math.max(0, level) * 0.15);
}

/** Flat coins added to every kill's base value, before the coinGain multiplier. */
export function runnerCoinFlatBonus(level: number): number {
  return roundToHundredth(Math.max(0, level) * 0.5);
}

// ---------------------------------------------------------------------------
// Run scaling (everything below keys off distance travelled)
// ---------------------------------------------------------------------------

export function runnerEnemyHealth(distance: number): number {
  const scaledHealth = 5 * Math.pow(2, Math.max(0, distance) / 100);
  return Math.min(Number.MAX_SAFE_INTEGER, Math.round(scaledHealth));
}

export function runnerBossHealth(distance: number): number {
  return Math.min(Number.MAX_SAFE_INTEGER, runnerEnemyHealth(distance) * RUNNER_BOSS_HEALTH_MULTIPLIER);
}

export function runnerNextBossDistance(distance: number): number {
  return (Math.floor(Math.max(0, distance) / RUNNER_BOSS_INTERVAL) + 1) * RUNNER_BOSS_INTERVAL;
}

export function runnerNextBoostPortalDistance(distance: number): number {
  return (
    Math.floor(Math.max(0, distance) / RUNNER_BOOST_PORTAL_INTERVAL) + 1
  ) * RUNNER_BOOST_PORTAL_INTERVAL;
}

export function runnerEffectiveUpgradeLevel(
  permanent: Readonly<Record<RunnerUpgradeId, number>>,
  temporary: Readonly<Record<RunnerUpgradeId, number>>,
  id: RunnerUpgradeId,
): number {
  return Math.max(0, permanent[id] + temporary[id]);
}

export function runnerAvailableCheckpoints(bestDistance: number): number[] {
  const unlockedCount = Math.floor(Math.max(0, bestDistance) / RUNNER_CHECKPOINT_INTERVAL);
  return Array.from({ length: unlockedCount + 1 }, (_, index) => index * RUNNER_CHECKPOINT_INTERVAL);
}

export function runnerCheckpointUnlocked(distance: number, bestDistance: number): boolean {
  return (
    Number.isFinite(distance) &&
    distance >= 0 &&
    distance % RUNNER_CHECKPOINT_INTERVAL === 0 &&
    distance <= Math.floor(Math.max(0, bestDistance) / RUNNER_CHECKPOINT_INTERVAL) * RUNNER_CHECKPOINT_INTERVAL
  );
}

/** Enemies come thicker the further you get, but never faster than this floor. */
export function runnerEnemySpawnInterval(distance: number): number {
  const previousInterval = Math.max(0.22, 0.95 - Math.max(0, distance) / 1400);
  return roundToHundredth(previousInterval / RUNNER_ENEMY_SPAWN_FREQUENCY_MULTIPLIER);
}

/** Metres between two consecutive gates. */
export function runnerGateSpacing(gateIndex: number): number {
  return 28 + Math.min(14, Math.max(0, gateIndex) * 1.5);
}

/**
 * Bullets needed to crack the Nth gate of a run. Escalates hard, so late gates are a
 * genuine gamble: cracking one costs DPS you may need for the enemies behind it.
 */
export function runnerGateShotsRequired(gateIndex: number): number {
  return Math.round(6 * Math.pow(1.32, Math.max(0, gateIndex)));
}

/** Coins scale by distance tier, so kills far down the lane are worth more. */
export function runnerCoinTier(distance: number): number {
  return Math.floor(Math.max(0, distance) / RUNNER_COIN_TIER_DISTANCE);
}

/**
 * Fractional on purpose: coins accumulate as a float across the run and are only rounded
 * when banked. Flooring per kill would silently erase the coinGain bonus at tier 0, where
 * `floor(1 x 1.75)` is still just 1 — making the upgrade feel dead exactly when it is bought.
 */
export function runnerCoinsPerKill(distance: number, coinGainLevel: number, coinFlatLevel = 0): number {
  const tier = runnerCoinTier(distance);
  const base = 1 + tier * 0.5 + runnerCoinFlatBonus(coinFlatLevel);
  return Math.max(1, base * runnerCoinMultiplier(coinGainLevel));
}

function roundToHundredth(value: number): number {
  return Math.round(value * 100) / 100;
}
