export const RUNNER_MAX_MULTISHOT_ORBS = 20;
export const RUNNER_MULTISHOT_ORB_REFLOW_MS = 260;

const RUNNER_MULTISHOT_ORB_CENTER_Y = 1.17;

export interface RunnerMultishotOrbPosition {
  x: number;
  y: number;
  z: number;
}

export function runnerMultishotOrbFormation(level: number): RunnerMultishotOrbPosition[] {
  const count = Math.min(RUNNER_MAX_MULTISHOT_ORBS, Math.max(0, Math.floor(level)));
  if (count === 0) return [];
  if (count === 1) return [{ x: 0.72, y: RUNNER_MULTISHOT_ORB_CENTER_Y, z: 0 }];

  const radiusX = 1.25 + Math.max(0, count - 5) * 0.05;
  const radiusZ = 0.95 + Math.max(0, count - 5) * 0.02;
  const rawPositions = Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
    return {
      x: Math.cos(angle) * radiusX,
      y: RUNNER_MULTISHOT_ORB_CENTER_Y
        + Math.sin(angle * 2) * 0.45
        + Math.cos(angle * 3) * 0.12,
      z: Math.sin(angle) * radiusZ,
    };
  });
  const centerX = rawPositions.reduce((sum, orb) => sum + orb.x, 0) / count;
  const centerZ = rawPositions.reduce((sum, orb) => sum + orb.z, 0) / count;

  return rawPositions.map((orb) => ({
    x: orb.x - centerX,
    y: orb.y,
    z: orb.z - centerZ,
  }));
}

export function runnerMultishotOrbReflow(
  current: readonly RunnerMultishotOrbPosition[],
  target: readonly RunnerMultishotOrbPosition[],
  progress: number,
): RunnerMultishotOrbPosition[] {
  const amount = Math.min(1, Math.max(0, progress));
  if (amount === 1) return target.map((orb) => ({ ...orb }));
  const spawn = { x: 0, y: RUNNER_MULTISHOT_ORB_CENTER_Y, z: 0 };
  return target.map((destination, index) => {
    const source = current[index] ?? spawn;
    return {
      x: source.x + (destination.x - source.x) * amount,
      y: source.y + (destination.y - source.y) * amount,
      z: source.z + (destination.z - source.z) * amount,
    };
  });
}
