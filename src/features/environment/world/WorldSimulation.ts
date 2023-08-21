import { store, RootState } from '../../../app/store';
import CellStates from '../../anatomy/CellStates';
import GridCell from '../../grid/GridCell';
import GridMap from '../../grid/GridMap';
import Organism from '../../organism/Organism';
import {
  EnvironmentManagerState,
  setWorldSimulationStats,
} from '../environmentManagerSlice';
import WorldRendering from './WorldRendering';

/*interface WorldSimulationInterface {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  gridMap: GridMap | null,
  storeState: RootState | null,
  setTicksDelay: (state: EnvironmentManagerState, value: number) => void;
  start: (state: EnvironmentManagerState) => void;
  stop: () => void;
  reset: () => void;
}*/

export const DEFAULT_TICKS_DELAY = 16.67;

const worldRendering = WorldRendering.getInstance();

class WorldSimulation /*implements WorldSimulationInterface*/ {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  //
  gridMap: GridMap | null;
  storeState: RootState | null;
  //
  organisms: Array<Organism>;
  walls: Array<GridCell>;
  largest_cell_count: number;
  total_mutability: number;

  private static instance: WorldSimulation;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    this.running = false;
    this.intervalId = null;
    this.timeElapsed = 0;
    this.ticksDelay = DEFAULT_TICKS_DELAY;
    this.ticksElapsed = 0;
    //
    this.gridMap = null;
    this.storeState = null;
    //
    this.organisms = [];
    this.walls = [];
    this.largest_cell_count = 0;
    this.total_mutability = 0;
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

  public init(storeState: RootState) {
    this.storeState = storeState;

    this.gridMap = new GridMap(
      worldRendering,
      worldRendering.numCols,
      worldRendering.numRows,
      storeState.worldEnvironment.cellSize,
    );

    //this.fossil_record = new FossilRecord(this);

    console.log('WorldSimulation, init, gridmap:', this.gridMap, 'storeState:', this.storeState);
  }

  private initDefaultOrganism() {
    if (this.gridMap === null || this.storeState === null) {
      return;
    }

    var center = this.gridMap.getCenter();
    var organism = new Organism(
      center[0],
      center[1],
      'world',
      this.storeState.environmentManager.hyperparams,
      WorldSimulation.instance,
    );

    console.log('WorldSimulation, initDefaultOrganism', organism);

    organism.anatomy.addDefaultCell(CellStates.mouth, 0, 0, false, this.storeState.environmentManager.hyperparams);
    organism.anatomy.addDefaultCell(CellStates.producer, 1, 1, false, this.storeState.environmentManager.hyperparams);
    organism.anatomy.addDefaultCell(CellStates.producer, -1, -1, true, this.storeState.environmentManager.hyperparams);

    this.addOrganism(organism);

    //fossil_record.addSpecies(org, null);
  }

  public addOrganism(organism: Organism) {
    if (this.gridMap === null) {
      return;
    }

    organism.updateGrid(this.gridMap);

    this.total_mutability += organism.mutability;
    this.organisms.push(organism);

    if (organism.anatomy.cells.length > this.largest_cell_count) {
      this.largest_cell_count = organism.anatomy.cells.length;
    }
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
    //console.log('WorldSimulation, SIMULATE', this.ticksDelay);
  }
}

export default WorldSimulation;
