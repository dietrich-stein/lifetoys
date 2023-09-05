import WorldCellStates from '../../simulator/SimulatorCellStates';
import AnatomyCell from '../AnatomyCell';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';
import WorldSimulation from '../../world/WorldSimulation';
import WorldRenderer from '../../world/WorldRenderer';

class ProducerCell extends AnatomyCell {
  constructor(x: number, y: number, org: Organism, hyperparams: HyperparamsState) {
    super(x, y, WorldCellStates.producer, org, hyperparams);
    this.hyperparams = hyperparams;
    this.org.anatomy.has_producer = true;
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

    const {
      moversCanProduce,
      foodProdProb,
      growableNeighbors,
    } = this.hyperparams;

    if (
      this.org.anatomy.has_mover && !moversCanProduce) {
      return;
    }

    var prob = foodProdProb;
    var colrow = this.getRotatedSimulatorColRow();

    if (Math.random() * 100 <= prob) {
      var loc = growableNeighbors[
        Math.floor(Math.random() * growableNeighbors.length)
      ];
      var col = loc[0];
      var row = loc[1];
      var cell = simulation.map.cellAt(colrow[0] + col, colrow[1] + row);

      if (cell !== null && cell.state === WorldCellStates.empty) {
        const changed = simulation.map.changeCellState(colrow[0] + col, colrow[1] + row, WorldCellStates.food);

        if (changed !== null) {
          renderer.addToRender(changed);
        }

        return;
      }
    }
  }
}

export default ProducerCell;
