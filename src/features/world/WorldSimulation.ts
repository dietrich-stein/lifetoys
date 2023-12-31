import { store } from '../../app/store';
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
import Directions from '../organism/Directions';
import { HyperparamsState } from './WorldManagerSlice';

export const DEFAULT_TICKS_DELAY = 16.67;

const worldRenderer = WorldRenderer.getInstance();

class WorldSimulation {
  // Control
  running: boolean;
  intervalId: ReturnType<typeof setInterval> | null;
  timeElapsed: number;
  ticksDelay: number;
  ticksElapsed: number;
  //
  map: SimulatorMap | null;
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

  public setTicksDelay(worldManagerState: WorldManagerState, value: number) {
    this.ticksDelay = value;

    if (this.running) {
      // Stop and start again for setInterval() to use the new value
      this.stop();
      this.start(worldManagerState); //state);
    }
  }

  public init(worldManagerState: WorldManagerState) {
    this.map = new SimulatorMap(
      worldRenderer.gridCols,
      worldRenderer.gridRows,
      worldRenderer.gridCellSize,
    );

    this.addCenteredOrganismByPlan([
      {
        state: CellStates.brain,
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
        state: CellStates.mouth,
        direction: Directions.cardinals.nw,
      },
    ], worldManagerState.hyperparams);

    this.fossilRecord = new FossilRecord();

    /*console.log(
      'WorldSimulation, init',
      'fossilRecord:', this.fossilRecord,
    );*/
  }

  public start(worldManagerState: WorldManagerState) {
    if (this.running || this.map === null) {
      return;
    }

    this.intervalId = setInterval(() => {
      if (!this.running) { // not needed, but let's be certain
        return;
      }

      this.timeElapsed += this.ticksDelay;
      this.ticksElapsed += 1;
      this.simulate(worldManagerState);
      store.dispatch(setWorldSimulationStats({
        ...worldManagerState,
        worldSimulationTime: this.timeElapsed,
        worldSimulationTicks: this.ticksElapsed,
        worldSimulationTotalLivingOrganisms: this.organisms.length,
      }));
    }, this.ticksDelay);

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

  private simulate(worldManagerState: WorldManagerState) {
    if (this.map === null || this.fossilRecord === null /*|| this.storeState === null*/) {
      return;
    }
    //console.log('WorldSimulation, SIMULATE', this.ticksDelay);

    var orgsToRemove: Array<string> = [];

    for (var i in this.organisms) {
      var org = this.organisms[i];

      if (!org.living || !org.handleSimulationUpdate(worldRenderer, this.ticksElapsed)) {
        orgsToRemove.push(i);
      }
    }

    if (orgsToRemove.length > 0) {
      this.removeOrganisms(orgsToRemove);
    }

    // Right after removal all are living
    store.dispatch(setWorldSimulationStats({
      ...worldManagerState, //...selectWorldManager(store.getState()),
      worldSimulationTotalLivingOrganisms: this.organisms.length,
    }));

    if (worldManagerState.hyperparams.foodDropProb > 0) {
      this.generateFood();
    }

    if (this.ticksElapsed % this.fossilRecordRate === 0) {
      this.fossilRecord.updateData(this.organisms.length, this.averageMutability(), this.ticksElapsed);
    }
  }

  private addCenteredOrganismByPlan(plan: GrowthPlan, hyperparams: HyperparamsState) {
    if (this.map === null /*|| this.storeState === null*/) {
      return;
    }

    var center = this.map.getCenter();
    var organism = new Organism(
      center[0],
      center[1],
      'world',
      WorldSimulation.instance,
      hyperparams,
    );

    organism.anatomy.executeGrowthPlan(plan, hyperparams);
    this.addOrganism(organism);

    //fossil_record.addSpecies(org, null);
  }

  public addOrganism(organism: Organism) {
    if (this.map === null) {
      return;
    }

    organism.updateSimulatorMap(worldRenderer);

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
    if (this.map === null /*|| this.storeState === null*/) {
      return;
    }

    const prob = store.getState().worldManager.hyperparams.foodDropProb;

    var num_food = Math.max(Math.floor((this.map.cols * this.map.rows * prob) / 50000), 1);

    for (var i = 0; i < num_food; i++) {
      if (Math.random() <= prob) {
        var c = Math.floor(Math.random() * this.map.cols);
        var r = Math.floor(Math.random() * this.map.rows);
        var grid_cell = this.map.cellAt(c, r);

        if (grid_cell !== null && grid_cell.state === CellStates.empty) {
          const changed = this.map.changeCellStateAt(c, r, CellStates.food);

          if (changed !== null) {
            worldRenderer.addToRender(changed);
          }
        }
      }
    }
  }

  private averageMutability(): number {
    if (this.organisms.length < 1 /*|| this.storeState === null*/) {
      return 0;
    }

    if (store.getState().worldManager.hyperparams.useGlobalMutability) {
      return store.getState().worldManager.hyperparams.globalMutability;
    }

    return this.total_mutability / this.organisms.length;
  }
}

export default WorldSimulation;
