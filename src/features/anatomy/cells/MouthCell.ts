import CellStates from '../CellStates';
import Cell from '../Cell';
import Organism from '../../organism/Organism';
import GridCell from '../../grid/GridCell';
import GridMap from '../../grid/GridMap';
import { HyperparamsState } from '../../world/WorldManagerSlice';

class MouthCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number, hyperparams: HyperparamsState) {
    super(CellStates.mouth, org, loc_col, loc_row, hyperparams);
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

  performFunction(grid_map: GridMap) {
    if (this.org.environment !== 'world') {
      return;
    }

    var real_c = this.getRealCol();
    var real_r = this.getRealRow();

    const edibleNeighbors = this.hyperparams.edibleNeighbors;

    for (var loc of edibleNeighbors) {
      var cell = grid_map.cellAt(real_c + loc[0], real_r + loc[1]);

      if (cell !== null) {
        this.eatNeighbor(grid_map, cell);
      }
    }
  }

  eatNeighbor(gridMap: GridMap, cell: GridCell) {
    if (cell === null) {
      return;
    }

    if (cell.state === CellStates.food) {
      gridMap.changeCell(cell.col, cell.row, CellStates.empty);
      this.org.food_collected++;
    }
  }
}

export default MouthCell;
