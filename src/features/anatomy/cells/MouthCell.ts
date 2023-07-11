import CellStates from '../CellStates';
import Cell from '../Cell';
import Hyperparams from '../../../Hyperparams';
import Organism from '../../organism/Organism';
import GridCell from '../../grid/GridCell';
//import { isWorldEnvironment } from '../../Utils/TypeHelpers';

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

  performFunction() {
    var env = this.org.env;
    /*if (env === null || !isWorldEnvironment(env)) {
      return;
    }*/
    var real_c = this.getRealCol();
    var real_r = this.getRealRow();
    for (var loc of Hyperparams.edibleNeighbors) {
      var cell = env.grid_map.cellAt(real_c + loc[0], real_r + loc[1]);
      if (cell !== null) {
        this.eatNeighbor(cell, env);
      }
    }
  }

  eatNeighbor(n_cell: GridCell, env: AnyEnvironmentType) {
    if (n_cell == null) return;
    if (n_cell.state == CellStates.food) {
      env.changeWorldCell(n_cell.col, n_cell.row, CellStates.empty, env.grid_map, null);
      this.org.food_collected++;
    }
  }
}

export default MouthCell;
