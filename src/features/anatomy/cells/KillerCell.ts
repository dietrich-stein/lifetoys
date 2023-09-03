import CellStates from '../CellStates';
import Cell from '../Cell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';
import WorldSimulation from '../../world/WorldSimulation';
import SimulatorCell from '../../simulator/SimulatorCell';
import WorldRenderer from '../../world/WorldRenderer';

class KillerCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number, hyperparams: HyperparamsState) {
    super(CellStates.killer, org, loc_col, loc_row, hyperparams);
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

  performFunction(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    if (this.org.environment !== 'world' || simulation.map === null) {
      return;
    }

    var c = this.getRealCol();
    var r = this.getRealRow();

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
      neighbor_cell.owner_org === null ||
      neighbor_cell.owner_org === this.org ||
      !neighbor_cell.owner_org.living ||
      neighbor_cell.state === CellStates.armor
    ) {
      return;
    }

    var is_hit = neighbor_cell.state === CellStates.killer; // has to be calculated before death

    neighbor_cell.owner_org.harm(renderer, simulation, ticks);

    const instaKill = this.hyperparams.instaKill;

    if (instaKill && is_hit) {
      this.org.harm(renderer, simulation, ticks);
    }
  }
}

export default KillerCell;
