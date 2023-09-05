import CellStates from '../../simulator/SimulatorCellStates';
import AnatomyCell from '../AnatomyCell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';

class ArmorCell extends AnatomyCell {
  constructor(x: number, y: number, org: Organism, hyperparams: HyperparamsState) {
    super(x, y, CellStates.armor, org, hyperparams);
  }

  initInherited(parent: AnatomyCell) {
    super.initInherited(parent);
  }

  initRandom() {
    // initialize values randomly
  }

  initDefault() {
    // initialize to default values
  }
}

export default ArmorCell;
