import { store, RootState } from '../../app/store';
import CellStates from '../simulator/SimulatorCellStates';
import SimulatorCell from '../simulator/SimulatorCell';
import SimulatorMap from '../simulator/SimulatorMap';
import Organism from '../organism/Organism';
import {
  WorldManagerState,
  setWorldSimulationStats,
} from './WorldManagerSlice';
import WorldRenderer from './WorldRenderer';
import FossilRecord from '../stats/FossilRecord';
import Anatomy from '../anatomy/Anatomy';
import Directions from '../organism/Directions';

/*
interface WorldSimulationInterface {
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  map: SimulatorMap | null,
  storeState: RootState | null,
  setTicksDelay: (state: WorldManagerState, value: number) => void;
  start: (state: WorldManagerState) => void;
  stop: () => void;
  reset: () => void;
}
*/

export const DEFAULT_TICKS_DELAY = 16.67;

const worldRenderer = WorldRenderer.getInstance();

class WorldSimulation /*implements WorldSimulationInterface*/ {
  // Control
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  //
  map: SimulatorMap | null;
  storeState: RootState | null;
  fossilRecord: FossilRecord | null;
  fossilRecordRate: number;
  //
  organisms: Array<Organism>;
  walls: Array<SimulatorCell>;
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
    this.map = null;
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

    this.map = new SimulatorMap(
      worldRenderer.gridCols, // use like 100, not the grid
      worldRenderer.gridRows,
      worldRenderer.gridCellSize,
    );

    this.fossilRecord = new FossilRecord();

    /*console.log(
      'WorldSimulation, init',
      'storeState:', this.storeState,
      'fossilRecord:', this.fossilRecord,
    );*/
  }

  public start(state: WorldManagerState) {
    if (this.running || this.map === null) {
      return;
    }

    worldRenderer.renderColorScheme(this.map.grid);

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

    this.addCenteredOrganismByPlan([
      {
        state: CellStates.mouth,
        direction: Directions.noDirection, // -1
      },
      {
        state: CellStates.producer,
        direction: Directions.cardinals.se,
      },
      {
        state: null,
        direction: Directions.cardinals.nw,
      },
      {
        state: CellStates.producer,
        direction: Directions.cardinals.nw,
      },
    ]);

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
    if (this.map === null || this.fossilRecord === null || this.storeState === null) {
      return;
    }
    //console.log('WorldSimulation, SIMULATE', this.ticksDelay);

    var to_remove: Array<string> = [];

    for (var i in this.organisms) {
      var org = this.organisms[i];

      if (!org.living || !org.handleSimulationUpdate(worldRenderer, this, this.ticksElapsed)) {
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

  private addCenteredOrganismByPlan(plan: GrowthPlan) {
    if (this.map === null || this.storeState === null) {
      return;
    }

    var center = this.map.getCenter();
    var organism = new Organism(
      center[0],
      center[1],
      'world',
      this.storeState.worldManager.hyperparams,
      WorldSimulation.instance,
    );

    organism.anatomy.executeGrowthPlan(plan, this.storeState.worldManager.hyperparams);
    this.addOrganism(organism);

    //fossil_record.addSpecies(org, null);
  }

  public addOrganism(organism: Organism) {
    if (this.map === null) {
      return;
    }

    organism.updateSimulatorMap(worldRenderer, this.map);

    this.total_mutability += organism.mutability;
    this.organisms.push(organism);

    if (organism.anatomy.cells.length > this.largest_cell_count) {
      this.largest_cell_count = organism.anatomy.cells.length;
    }
  }

  private removeOrganisms(org_indeces: Array<string>): void {
    //let start_pop = this.organisms.length;

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
    if (this.map === null || this.storeState === null) {
      return;
    }

    var num_food = Math.max(Math.floor((
      this.map.cols *
      this.map.rows *
      this.storeState.worldManager.hyperparams.foodDropProb
    ) / 50000), 1);
    var prob = this.storeState.worldManager.hyperparams.foodDropProb;

    for (var i = 0; i < num_food; i++) {
      if (Math.random() <= prob) {
        var c = Math.floor(Math.random() * this.map.cols);
        var r = Math.floor(Math.random() * this.map.rows);
        var grid_cell = this.map.cellAt(c, r);

        if (grid_cell !== null && grid_cell.state === CellStates.empty) {
          const changed = this.map.changeCellState(c, r, CellStates.food);

          if (changed !== null) {
            worldRenderer.addToRender(changed);
          }
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
