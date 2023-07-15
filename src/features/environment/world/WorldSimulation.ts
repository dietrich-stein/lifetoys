import { store, RootState } from '../../../app/store';

interface WorldSimulationInterface {
  store: RootState;
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  setRunning: (value: boolean) => void;
  getTimeElapsed: () => number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

class WorldSimulation implements WorldSimulationInterface {
  store: RootState;
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  private static instance: WorldSimulation;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    this.store = store.getState();
    this.running = this.store.environmentManager.worldSimulationRunning;
    this.intervalId = null;
    this.timeElapsed = 0;

    if (this.running) {
      this.start();
    }
  }

  public static getInstance(): WorldSimulation {
    if (!WorldSimulation.instance) {
      WorldSimulation.instance = new WorldSimulation();
    }

    return WorldSimulation.instance;
  }

  public setRunning(value: boolean) {
    this.running = value;
  }

  public getTimeElapsed() {
    return this.timeElapsed;
  }

  public start() {
    const tickDuration = 1000 / 60; // ~16.67ms

    this.intervalId = setInterval(() => {
      this.timeElapsed += tickDuration;
    }, tickDuration);

    this.setRunning(true);
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.setRunning(false);
  }

  public reset() {
    this.stop();
    this.timeElapsed = 0;
  }
}

export default WorldSimulation;
