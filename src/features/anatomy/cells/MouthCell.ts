import CellStates from '../CellStates';
import Cell from '../Cell';
import Organism from '../../organism/Organism';
import GridCell from '../../grid/GridCell';
import GridMap from '../../grid/GridMap';

class MouthCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number) {
    super(CellStates.mouth, org, loc_col, loc_row);
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

    const edibleNeighbors = this.store.engine.hyperparams.edibleNeighbors;

    for (var loc of edibleNeighbors) {
      var cell = grid_map.cellAt(real_c + loc[0], real_r + loc[1]);

      if (cell !== null) {
        this.eatNeighbor(grid_map, cell);
      }
    }
  }

  eatNeighbor(grid_map: GridMap, n_cell: GridCell) {
    if (n_cell === null) return;

    if (n_cell.state === CellStates.food) {
      //env.changeWorldCell(n_cell.col, n_cell.row, CellStates.empty, env.grid_map, null);
      this.org.food_collected++;
    }
  }
}

export default MouthCell;
