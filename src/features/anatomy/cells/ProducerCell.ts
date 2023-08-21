import CellStates from '../CellStates';
import Cell from '../Cell';
import Organism from '../../organism/Organism';
import GridMap from '../../grid/GridMap';
import FossilRecord from '../../stats/FossilRecord';
import { HyperparamsState } from '../../environment/environmentManagerSlice';

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

  performFunction(gridMap: GridMap, fossil_record: FossilRecord, ticks: number) {
    if (this.org.environment !== 'world') {
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
      var cell = gridMap.cellAt(real_c + loc_c, real_r + loc_r);

      if (cell !== null && cell.state === CellStates.empty) {
        gridMap.changeCell(real_c + loc_c, real_r + loc_r, CellStates.food);

        return;
      }
    }
  }
}

export default ProducerCell;
