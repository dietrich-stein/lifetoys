import { store, RootState } from '../../../app/store';
import { useAppDispatch } from '../../../app/hooks';
import {
  EnvironmentManagerState,
  setWorldSimulationTime,
} from '../environmentManagerSlice';

interface WorldSimulationInterface {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  setRunning: (value: boolean) => void;
  start: (state: EnvironmentManagerState) => void;
  stop: () => void;
  reset: () => void;
}

class WorldSimulation implements WorldSimulationInterface {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  private static instance: WorldSimulation;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    this.running = false;//this.store.environmentManager.worldSimulationRunning;
    this.intervalId = null;
    this.timeElapsed = 0;//this.store.environmentManager.worldSimulationTime;
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

  public start(state: EnvironmentManagerState) {
    if (this.running) {
      return;
    }

    const tickDuration = 1000 / 60; // ~16.67ms
    //const dispatch = useAppDispatch();

    this.intervalId = setInterval(() => {
      this.timeElapsed += tickDuration;
      this.simulate();
      store.dispatch(setWorldSimulationTime({
        ...state,
        worldSimulationTime: this.timeElapsed,
      }));
    }, tickDuration);

    this.setRunning(true);
  }

  public stop() {
    if (!this.running) {
      return;
    }

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.setRunning(false);
  }

  public reset() {
    this.stop();
    this.timeElapsed = 0;
  }

  private simulate() {
    console.log('SIMULATE');
  }
}

export default WorldSimulation;
