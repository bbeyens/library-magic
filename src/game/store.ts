import { applyAction, tickState, type GameAction } from './simulation/actions';
import { createInitialState, type GameState } from './simulation/state';

type Listener = (state: GameState) => void;

type GameStorePerfSample = {
  at: number;
  totalMs: number;
  tickMs: number;
  emitMs: number;
  listeners: number;
  listenerMs: Array<{ name: string; durationMs: number }>;
};

type GameStorePerfStats = {
  frames: number;
  last: GameStorePerfSample;
  maxTotalMs: number;
  maxTickMs: number;
  maxEmitMs: number;
  slowFrames: GameStorePerfSample[];
  reset: () => void;
};

type WindowWithLibraryMagicPerf = Window & {
  __libraryMagicPerf?: GameStorePerfStats;
};

function createGameStorePerfStats(): GameStorePerfStats {
  const emptySample = { at: 0, totalMs: 0, tickMs: 0, emitMs: 0, listeners: 0, listenerMs: [] };
  return {
    frames: 0,
    last: emptySample,
    maxTotalMs: 0,
    maxTickMs: 0,
    maxEmitMs: 0,
    slowFrames: [],
    reset() {
      this.frames = 0;
      this.last = emptySample;
      this.maxTotalMs = 0;
      this.maxTickMs = 0;
      this.maxEmitMs = 0;
      this.slowFrames = [];
    },
  };
}

function gameStorePerfStats(): GameStorePerfStats | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return null;
  }

  const targetWindow = window as WindowWithLibraryMagicPerf;
  if (!targetWindow.__libraryMagicPerf) {
    targetWindow.__libraryMagicPerf = createGameStorePerfStats();
  }
  return targetWindow.__libraryMagicPerf;
}

function recordGameStorePerf(sample: GameStorePerfSample): void {
  const stats = gameStorePerfStats();
  if (!stats) {
    return;
  }

  stats.frames += 1;
  stats.last = sample;
  stats.maxTotalMs = Math.max(stats.maxTotalMs, sample.totalMs);
  stats.maxTickMs = Math.max(stats.maxTickMs, sample.tickMs);
  stats.maxEmitMs = Math.max(stats.maxEmitMs, sample.emitMs);
  if (sample.totalMs >= 12 || sample.emitMs >= 10 || sample.tickMs >= 6) {
    stats.slowFrames.push(sample);
    if (stats.slowFrames.length > 20) {
      stats.slowFrames.shift();
    }
  }
}

export class GameStore {
  private readonly state = createInitialState();
  private readonly listeners = new Set<Listener>();

  get snapshot(): GameState {
    return this.state;
  }

  dispatch(action: GameAction): void {
    applyAction(this.state, action);
    this.emit();
  }

  tick(now: number): void {
    const start = performance.now();
    tickState(this.state, now);
    const afterTick = performance.now();
    const listenerMs = this.emit();
    const afterEmit = performance.now();
    recordGameStorePerf({
      at: now,
      totalMs: afterEmit - start,
      tickMs: afterTick - start,
      emitMs: afterEmit - afterTick,
      listeners: listenerMs.length,
      listenerMs,
    });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private emit(): Array<{ name: string; durationMs: number }> {
    const perfEnabled = import.meta.env.DEV && typeof performance !== 'undefined';
    const listenerMs: Array<{ name: string; durationMs: number }> = [];
    for (const listener of this.listeners) {
      const start = perfEnabled ? performance.now() : 0;
      listener(this.state);
      if (perfEnabled) {
        listenerMs.push({
          name: listener.name || 'anonymous',
          durationMs: performance.now() - start,
        });
      }
    }
    return listenerMs;
  }
}

export const gameStore = new GameStore();
