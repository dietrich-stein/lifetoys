import CellStates from '../CellStates';
import Cell from '../Cell';
import Organism from '../../organism/Organism';
import GridMap from '../../grid/GridMap';
import FossilRecord from '../../stats/FossilRecord';

class ProducerCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number) {
    super(CellStates.producer, org, loc_col, loc_row);
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

  performFunction(grid_map: GridMap, fossil_record: FossilRecord, ticks: number) {
    if (this.org.environment !== 'world') {
      return;
    }

    const {
      moversCanProduce,
      foodProdProb,
      growableNeighbors,
    } = this.store.environmentManager.hyperparams;

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
      var cell = grid_map.cellAt(real_c + loc_c, real_r + loc_r);

      if (cell !== null && cell.state === CellStates.empty) {
        // TODO: dispatch
        //env.changeWorldCell(real_c + loc_c, real_r + loc_r, CellStates.food, env.grid_map, null);
        return;
      }
    }
  }
}

export default ProducerCell;
