import CellStates from '../../simulator/SimulatorCellStates';
import AnatomyCell from '../AnatomyCell';
import Organism from '../../organism/Organism';
import SimulatorCell from '../../simulator/SimulatorCell';
import SimulatorMap from '../../simulator/SimulatorMap';
import { HyperparamsState } from '../../world/WorldManagerSlice';
import WorldRenderer from '../../world/WorldRenderer';
import WorldSimulation from '../../world/WorldSimulation';

class MouthCell extends AnatomyCell {
  constructor(x: number, y: number, org: Organism, hyperparams: HyperparamsState) {
    super(x, y, CellStates.mouth, org, hyperparams);
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

  performFunction(renderer: WorldRenderer, simulation: WorldSimulation) {
    if (this.org.environment !== 'world' || simulation.map === null) {
      return;
    }

    var colrow = this.getRotatedSimulatorColRow();

    const edibleNeighbors = this.hyperparams.edibleNeighbors;

    for (var loc of edibleNeighbors) {
      var cell = simulation.map.cellAt(colrow[0] + loc[0], colrow[1] + loc[1]);

      if (cell !== null) {
        this.eatNeighbor(renderer, simulation.map, cell);
      }
    }
  }

  eatNeighbor(renderer: WorldRenderer, map: SimulatorMap, cell: SimulatorCell) {
    if (cell === null) {
      return;
    }

    if (cell.state === CellStates.food) {
      const changed = map.changeCellStateAt(cell.col, cell.row, CellStates.empty);

      if (changed !== null) {
        renderer.addToRender(changed);
        this.org.food_collected++;
      }
    }
  }
}

export default MouthCell;
