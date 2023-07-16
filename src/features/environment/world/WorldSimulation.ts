import { store } from '../../../app/store';
import {
  EnvironmentManagerState,
  setWorldSimulationStats,
} from '../environmentManagerSlice';

interface WorldSimulationInterface {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  setTicksDelay: (state: EnvironmentManagerState, value: number) => void;
  start: (state: EnvironmentManagerState) => void;
  stop: () => void;
  reset: () => void;
}

export const DEFAULT_TICKS_DELAY = 16.67;

class WorldSimulation implements WorldSimulationInterface {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  private static instance: WorldSimulation;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    this.running = false;
    this.intervalId = null;
    this.timeElapsed = 0;
    this.ticksDelay = DEFAULT_TICKS_DELAY;
    this.ticksElapsed = 0;
  }

  public static getInstance(): WorldSimulation {
    if (!WorldSimulation.instance) {
      WorldSimulation.instance = new WorldSimulation();
    }

    return WorldSimulation.instance;
  }

  public setTicksDelay(state: EnvironmentManagerState, value: number) {
    this.ticksDelay = value;

    if (this.running) {
      // Stop and start again for setInterval() to use the new value
      this.stop();
      this.start(state);
    }
  }

  private initDefaultOrganism() {
    console.log('initDefaultOrganism');
    //var center = grid_map.getCenter();
    //var org = new Organism(center[0], center[1], this);
    //org.anatomy.addDefaultCell(CellStates.mouth, 0, 0, false);
    //org.anatomy.addDefaultCell(CellStates.producer, 1, 1, false);
    //org.anatomy.addDefaultCell(CellStates.producer, -1, -1, true);
    //this.addOrganism(org);
    //fossil_record.addSpecies(org, null);
  }

  public start(state: EnvironmentManagerState) {
    if (this.running) {
      return;
    }

    this.intervalId = setInterval(() => {
      if (!this.running) { // not needed, but let's be certain
        return;
      }

      this.timeElapsed += this.ticksDelay;
      this.ticksElapsed += 1;
      this.simulate();
      store.dispatch(setWorldSimulationStats({
        ...state,
        worldSimulationTime: this.timeElapsed,
        worldSimulationTicks: this.ticksElapsed,
      }));
    }, this.ticksDelay);

    this.initDefaultOrganism();

    this.running = true;
  }

  public stop() {
    if (!this.running) {
      return;
    }

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.running = false;
  }

  public reset() {
    this.stop();
    this.timeElapsed = 0;
    this.ticksDelay = DEFAULT_TICKS_DELAY;
    this.ticksElapsed = 0;
  }

  private simulate() {
    //console.log('SIMULATE', this.ticksDelay);
  }
}

export default WorldSimulation;
