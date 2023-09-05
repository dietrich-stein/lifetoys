import CellStates from '../../simulator/SimulatorCellStates';
import AnatomyCell from '../AnatomyCell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';

class BrainCell extends AnatomyCell {
  constructor(x: number, y: number, org: Organism, hyperparams: HyperparamsState) {
    super(x, y, CellStates.brain, org, hyperparams);

    if (org.brain !== null) {
      org.brain.randomizeDecisions();
    }
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

export default BrainCell;
