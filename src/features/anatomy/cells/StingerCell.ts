import CellStates from '../../simulator/SimulatorCellStates';
import AnatomyCell from '../AnatomyCell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';
import WorldSimulation from '../../world/WorldSimulation';
import SimulatorCell from '../../simulator/SimulatorCell';
import WorldRenderer from '../../world/WorldRenderer';

class StingerCell extends AnatomyCell {
  constructor(x: number, y: number, org: Organism, hyperparams: HyperparamsState) {
    super(x, y, CellStates.stinger, org, hyperparams);
  }

  initInherited(parent: AnatomyCell) {
    // deep copy parent values
    super.initInherited(parent);
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

    const ticksElapsed = simulation.ticksElapsed;

    var colrow = this.getRotatedSimulatorColRow();

    for (var loc of this.hyperparams.vulnerableNeighbors) {
      var neighborCell = simulation.map.cellAt(colrow[0] + loc[0], colrow[1] + loc[1]);

      if (neighborCell !== null) {
        this.checkCell(neighborCell, renderer, ticksElapsed);
      }
    }
  }

  checkCell(neighborCell: SimulatorCell, renderer: WorldRenderer, ticksElapsed: number) {
    if (
      neighborCell === null ||
      neighborCell.org === null ||
      neighborCell.org === this.org ||
      !neighborCell.org.living ||
      neighborCell.state === CellStates.armor
    ) {
      return;
    }

    neighborCell.org.harm(renderer, ticksElapsed);

    // Original codebase would only do this self-harm for isHarmDeadly when true
    // The original logic thereby ensured mutual death on stinger-to-stinger contact.
    // However, I feel that fights to the death are relatively rare in nature.
    // In any case, having a winner is probably better for evolution.
    // It gives space to optimize the stinger cell parameters with things like speed levels or a poison cell.
    // So, we keep this disabled for now and may bring it back with an option later like "isDeadlyHarmMutual".
    /*if (this.hyperparams.isHarmDeadly && neighborCell.state === CellStates.stinger) {
      this.org.harm(renderer, ticksElapsed);
    }*/
  }
}

export default StingerCell;
