import CellStates from '../CellStates';
import Cell from '../Cell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../environment/environmentManagerSlice';

class ArmorCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number, hyperparams: HyperparamsState) {
    super(CellStates.armor, org, loc_col, loc_row, hyperparams);
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
}

export default ArmorCell;
