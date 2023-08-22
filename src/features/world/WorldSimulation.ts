import { store, RootState } from '../../app/store';
import CellStates from '../anatomy/CellStates';
import GridCell from '../grid/GridCell';
import GridMap from '../grid/GridMap';
import Organism from '../organism/Organism';
import {
  WorldManagerState,
  setWorldSimulationStats,
} from './WorldManagerSlice';
import WorldRendering from './WorldRendering';
import FossilRecord from '../stats/FossilRecord';

/*interface WorldSimulationInterface {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  gridMap: GridMap | null,
  storeState: RootState | null,
  setTicksDelay: (state: WorldManagerState, value: number) => void;
  start: (state: WorldManagerState) => void;
  stop: () => void;
  reset: () => void;
}*/

export const DEFAULT_TICKS_DELAY = 16.67;

const worldRendering = WorldRendering.getInstance();

class WorldSimulation /*implements WorldSimulationInterface*/ {
  // Control
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  //
  gridMap: GridMap | null;
  storeState: RootState | null;
  fossilRecord: FossilRecord | null;
  fossilRecordRate: number;
  //
  organisms: Array<Organism>;
  walls: Array<GridCell>;
  largest_cell_count: number;
  total_mutability: number;

  private static instance: WorldSimulation;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    // Control
    this.running = false;
    this.intervalId = null;
    this.timeElapsed = 0;
    this.ticksDelay = DEFAULT_TICKS_DELAY;
    this.ticksElapsed = 0;
    //
    this.gridMap = null;
    this.storeState = null;
    this.fossilRecord = null;
    this.fossilRecordRate = 100;
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

  public setTicksDelay(state: WorldManagerState, value: number) {
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
      storeState.world.cellSize,
    );

    this.fossilRecord = new FossilRecord();

    console.log(
      'WorldSimulation, init, gridmap:', this.gridMap,
      'storeState:', this.storeState,
      'fossilRecord:', this.fossilRecord,
    );
  }

  public start(state: WorldManagerState) {
    if (this.running || this.gridMap === null) {
      return;
    }

    worldRendering.renderColorScheme(this.gridMap);

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

    this.addDefaultOrganism();

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
    if (this.gridMap === null || this.fossilRecord === null || this.storeState === null) {
      return;
    }
    //console.log('WorldSimulation, SIMULATE', this.ticksDelay);

    var to_remove: Array<string> = [];

    for (var i in this.organisms) {
      var org = this.organisms[i];

      if (!org.living || !org.update(this.gridMap, this.fossilRecord, this.ticksElapsed)) {
        to_remove.push(i);
      }
    }

    this.removeOrganisms(to_remove);

    if (this.storeState.worldManager.hyperparams.foodDropProb > 0) {
      this.generateFood();
    }

    if (this.ticksElapsed % this.fossilRecordRate === 0) {
      this.fossilRecord.updateData(this.organisms.length, this.averageMutability(), this.ticksElapsed);
    }
  }

  private addDefaultOrganism() {
    if (this.gridMap === null || this.storeState === null) {
      return;
    }

    var center = this.gridMap.getCenter();
    var organism = new Organism(
      center[0],
      center[1],
      'world',
      this.storeState.worldManager.hyperparams,
      WorldSimulation.instance,
    );

    console.log('WorldSimulation, addDefaultOrganism', organism);

    organism.anatomy.addDefaultCell(CellStates.mouth, 0, 0, false, this.storeState.worldManager.hyperparams);
    organism.anatomy.addDefaultCell(CellStates.producer, 1, 1, false, this.storeState.worldManager.hyperparams);
    organism.anatomy.addDefaultCell(CellStates.producer, -1, -1, true, this.storeState.worldManager.hyperparams);

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

  private removeOrganisms(org_indeces: Array<string>): void {
    let start_pop = this.organisms.length;

    for (var i of org_indeces.reverse()) {
      this.total_mutability -= this.organisms[parseInt(i)].mutability;
      this.organisms.splice(parseInt(i), 1);
    }

    /*if (this.organisms.length === 0 && start_pop > 0) {
      if (auto_reset) {
        auto_reset_count++;
        this.resetEnvironment(false);
      } else {
        // @todo: sveltefix
        //$('.pause-button')[0].click();
      }
    }*/
  }

  private generateFood(): void {
    if (this.gridMap === null || this.storeState === null) {
      return;
    }

    var num_food = Math.max(Math.floor((
      this.gridMap.cols *
      this.gridMap.rows *
      this.storeState.worldManager.hyperparams.foodDropProb
    ) / 50000), 1);
    var prob = this.storeState.worldManager.hyperparams.foodDropProb;

    for (var i = 0; i < num_food; i++) {
      if (Math.random() <= prob) {
        var c = Math.floor(Math.random() * this.gridMap.cols);
        var r = Math.floor(Math.random() * this.gridMap.rows);
        var grid_cell = this.gridMap.cellAt(c, r);

        if (grid_cell !== null && grid_cell.state === CellStates.empty) {
          this.gridMap.changeCell(c, r, CellStates.food);
        }
      }
    }
  }

  private averageMutability(): number {
    if (this.organisms.length < 1 || this.storeState === null) {
      return 0;
    }

    if (this.storeState.worldManager.hyperparams.useGlobalMutability) {
      return this.storeState.worldManager.hyperparams.globalMutability;
    }

    return this.total_mutability / this.organisms.length;
  }
}

export default WorldSimulation;
