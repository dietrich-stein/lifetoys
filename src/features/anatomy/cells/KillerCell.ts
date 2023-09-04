import CellStates from '../../simulator/SimulatorCellStates';
import AnatomyCell from '../AnatomyCell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';
import WorldSimulation from '../../world/WorldSimulation';
import SimulatorCell from '../../simulator/SimulatorCell';
import WorldRenderer from '../../world/WorldRenderer';

class KillerCell extends AnatomyCell {
  constructor(x: number, y: number, org: Organism, hyperparams: HyperparamsState) {
    super(x, y, CellStates.killer, org, hyperparams);
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

    var c = this.getRealX();
    var r = this.getRealY();

    const killableNeighbors = this.hyperparams.killableNeighbors;

    for (var loc of killableNeighbors) {
      var cell = simulation.map.cellAt(c + loc[0], r + loc[1]);

      if (cell !== null) {
        this.killNeighbor(renderer, simulation, ticks, cell);
      }
    }
  }

  killNeighbor(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number, neighbor_cell: SimulatorCell) {
    if (
      simulation.map === null ||
      simulation.fossilRecord === null ||
      neighbor_cell === null ||
      neighbor_cell.org === null ||
      neighbor_cell.org === this.org ||
      !neighbor_cell.org.living ||
      neighbor_cell.state === CellStates.armor
    ) {
      return;
    }

    var is_hit = neighbor_cell.state === CellStates.killer; // has to be calculated before death

    neighbor_cell.org.harm(renderer, simulation, ticks);

    const instaKill = this.hyperparams.instaKill;

    if (instaKill && is_hit) {
      this.org.harm(renderer, simulation, ticks);
    }
  }
}

export default KillerCell;
