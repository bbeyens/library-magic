import { applyAction, tickState, type GameAction } from './simulation/actions';
import { createInitialState, type GameState } from './simulation/state';

type Listener = (state: GameState) => void;

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
    tickState(this.state, now);
    this.emit();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const gameStore = new GameStore();
