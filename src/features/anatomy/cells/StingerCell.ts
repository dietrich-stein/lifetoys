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

  executeSpecialty(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    if (this.org.environment !== 'world' || simulation.map === null) {
      return;
    }

    var c = this.getRealX();
    var r = this.getRealY();

    for (var loc of this.hyperparams.vulnerableNeighbors) {
      var cell = simulation.map.cellAt(c + loc[0], r + loc[1]);

      if (cell !== null) {
        this.checkCell(renderer, simulation, ticks, cell);
      }
    }
  }

  checkCell(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number, neighborCell: SimulatorCell) {
    if (
      simulation.map === null ||
      neighborCell === null ||
      neighborCell.org === null ||
      neighborCell.org === this.org ||
      !neighborCell.org.living ||
      neighborCell.state === CellStates.armor
    ) {
      return;
    }

    neighborCell.org.harm(renderer, simulation, ticks);

    // Original codebase would only do this self-harm for isHarmDeadly when true
    // The original logic thereby ensured mutual death on stinger-to-stinger contact.
    // However, I feel that fights to the death are relatively rare in nature.
    // In any case, having a winner is probably better for evolution.
    // It gives space to optimize the stinger cell parameters with things like speed levels or a poison cell.
    // So, we keep this disabled for now and may bring it back with an option later like "isDeadlyHarmMutual".
    /*if (this.hyperparams.isHarmDeadly && neighborCell.state === CellStates.stinger) {
      this.org.harm(renderer, simulation, ticks);
    }*/
  }
}

export default StingerCell;
