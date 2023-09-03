import CellStates from '../CellStates';
import Cell from '../Cell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';
import WorldSimulation from '../../world/WorldSimulation';
import WorldRenderer from '../../world/WorldRenderer';

class ProducerCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number, hyperparams: HyperparamsState) {
    super(CellStates.producer, org, loc_col, loc_row, hyperparams);
    this.hyperparams = hyperparams;
    this.org.anatomy.has_producer = true;
  }

  initInherit(parent: Cell) {
    // deep copy parent values
    super.initInherit(parent);
  }

  initRandom() {
    // initialize values randomly
  }

  initDefault() {
    // initialize to default values
  }

  performFunction(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    if (this.org.environment !== 'world' || simulation.map === null) {
      return;
    }

    const {
      moversCanProduce,
      foodProdProb,
      growableNeighbors,
    } = this.hyperparams;

    if (
      this.org.anatomy.has_mover && !moversCanProduce) {
      return;
    }

    var prob = foodProdProb;
    var real_c = this.getRealCol();
    var real_r = this.getRealRow();

    if (Math.random() * 100 <= prob) {
      var loc = growableNeighbors[
        Math.floor(Math.random() * growableNeighbors.length)
      ];
      var loc_c = loc[0];
      var loc_r = loc[1];
      var cell = simulation.map.cellAt(real_c + loc_c, real_r + loc_r);

      if (cell !== null && cell.state === CellStates.empty) {
        const changed = simulation.map.changeCell(real_c + loc_c, real_r + loc_r, CellStates.food);

        if (changed !== null) {
          renderer.addToRender(changed);
        }

        return;
      }
    }
  }
}

export default ProducerCell;
