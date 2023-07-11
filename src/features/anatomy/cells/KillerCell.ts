import CellStates from '../CellStates';
import Cell from '../Cell';
import Hyperparams from '../../../Hyperparams';
import GridCell from '../../grid/GridCell';
import Organism from '../../organism/Organism';
//import { isWorldEnvironment } from '../../Utils/TypeHelpers';

class KillerCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number) {
    super(CellStates.killer, org, loc_col, loc_row);
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
    var c = this.getRealCol();
    var r = this.getRealRow();
    for (var loc of Hyperparams.killableNeighbors) {
      var cell = env.grid_map.cellAt(c + loc[0], r + loc[1]);
      if (cell !== null) {
        this.killNeighbor(cell);
      }
    }
  }

  killNeighbor(n_cell: GridCell) {
    if (
      n_cell == null ||
      n_cell.owner_org == null ||
      n_cell.owner_org == this.org ||
      !n_cell.owner_org.living ||
      n_cell.state == CellStates.armor
    ) {
      return;
    }
    var is_hit = n_cell.state == CellStates.killer; // has to be calculated before death
    n_cell.owner_org.harm();
    if (Hyperparams.instaKill && is_hit) {
      this.org.harm();
    }
  }
}

export default KillerCell;
