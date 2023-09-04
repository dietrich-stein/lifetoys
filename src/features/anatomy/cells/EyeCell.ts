import CellStates from '../../simulator/SimulatorCellStates';
import AnatomyCell from '../AnatomyCell';
import Directions from '../../organism/Directions';
import Observation from '../../organism/perception/Observation';
import Organism from '../../organism/Organism';
import { HyperparamsState } from '../../world/WorldManagerSlice';
import WorldSimulation from '../../world/WorldSimulation';
import WorldRenderer from '../../world/WorldRenderer';
import SimulatorMap from '../../simulator/SimulatorMap';

class EyeCell extends AnatomyCell {
  direction: number;

  constructor(x: number, y: number, org: Organism, hyperparams: HyperparamsState) {
    super(x, y, CellStates.eye, org, hyperparams);
    this.org.anatomy.has_eye = true;
    this.direction = Directions.cardinals.n;
  }

  initInherited(parent: any) {
    // deep copy parent values
    super.initInherited(parent);
    this.direction = parent.direction;
  }

  initRandom() {
    // initialize values randomly
    this.direction = Directions.getRandomDirection();
  }

  initDefault() {
    // initialize to default values
    this.direction = Directions.cardinals.n;
  }

  performFunction(renderer: WorldRenderer, simulation: WorldSimulation) {
    if (simulation.map === null) {
      return;
    }

    // @todo: decide if there should be some eye-benefit without a brain
    if (this.org.anatomy.has_brain && this.org.brain !== null) {
      var obs = this.look(simulation.map);

      if (obs !== null) {
        this.org.brain.observe(obs);
      }
    }
  }

  look(map: SimulatorMap) {
    var env = this.org.environment;

    if (env === null) {
      return null;
    }

    var lookDirection = this.org.rotation_direction;//this.org.getAbsoluteDirection();
    var addCol = 0;
    var addRow = 0;

    switch (lookDirection) {
      case Directions.cardinals.n:
        addRow = -1;
        break;

      case Directions.cardinals.ne:
        addRow = -1;
        addCol = 1;
        break;

      case Directions.cardinals.e:
        addCol = 1;
        break;

      case Directions.cardinals.se:
        addRow = 1;
        addCol = 1;
        break;

      case Directions.cardinals.s:
        addRow = 1;
        break;

      case Directions.cardinals.sw:
        addRow = 1;
        addCol = -1;
        break;

      case Directions.cardinals.w:
        addCol = -1;
        break;

      case Directions.cardinals.nw:
        addRow = -1;
        addCol = -1;
        break;
    }

    var start_col = this.getRealX();
    var start_row = this.getRealY();
    var col = start_col;
    var row = start_row;
    var simulatorCell = null;

    const {
      lookRange,
      seeThroughSelf,
    } = this.hyperparams;

    for (var i = 0; i < lookRange; i++) {
      col += addCol;
      row += addRow;
      simulatorCell = map.cellAt(col, row);

      if (simulatorCell === null) {
        continue;
        // @todo: if this break before to force the final return then why?
        // a null cell is kinda pointless isn't it?
        // it would need last_cell for that purpose to be effective
      }

      if (simulatorCell.org === this.org && seeThroughSelf) {
        continue;
      }

      if (simulatorCell.state !== CellStates.empty) {
        var distance = Math.abs(start_col - col) + Math.abs(start_row - row);

        return new Observation(simulatorCell, distance, lookDirection);
      }
    }

    return null; //return new Observation(cell, Hyperparams.lookRange, lookDirection);
  }
}

export default EyeCell;
