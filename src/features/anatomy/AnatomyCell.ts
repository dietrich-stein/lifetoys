import Directions from '../organism/Directions';
import Organism from '../organism/Organism';
//import { store, RootState } from '../../app/store';
import { HyperparamsState } from '../world/WorldManagerSlice';
import WorldRenderer from '../world/WorldRenderer';
import WorldSimulation from '../world/WorldSimulation';
import Anatomy from './Anatomy';

interface AnatomyCellInterface {
  //store: RootState;
  hyperparams: HyperparamsState,
  state: AnatomyCellState;
  org: Organism;
  x: number;
  y: number;
  initRegular: () => void;
  initInherited: (parent: AnatomyCell) => void;
  initRandom: () => void;
  performFunction: (renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) => void;
  getRotatedSimulatorColRow: () => void;
  getRotatedAnatomyXY: (dir: number) => number[];
}

class AnatomyCell implements AnatomyCellInterface {
  //store: RootState;
  id: string;
  hyperparams: HyperparamsState;
  state: AnatomyCellState;
  org: Organism;
  x: number;
  y: number;

  constructor(
    x: number,
    y: number,
    state: AnatomyCellState,
    org: Organism,
    hyperparams: HyperparamsState,
  ) {
    //this.store = store.getState();
    this.id = Math.random().toString(36).slice(2, 7); // TODO: Eliminate when rotation is done.
    this.hyperparams = hyperparams;
    this.state = state;
    this.org = org;
    this.x = x;
    this.y = y;

    var distance = Math.max(
      Math.abs(x) * 2 + 2,
      Math.abs(y) * 2 + 2,
    );

    if (this.org.anatomy.birth_distance < distance) {
      this.org.anatomy.birth_distance = distance;
    }
  }

  initRegular() {
    // initialize to default values
  }

  initInherited(parent: AnatomyCell) {
    this.x = parent.x;
    this.y = parent.y;
  }

  initRandom() {
    // initialize values randomly
  }

  performFunction(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    // default behavior: none
  }

  getRotatedSimulatorColRow() {
    var rotatedXY = this.getRotatedAnatomyXY(this.org.anatomyDirection);

    return [
      this.org.startCellCol + rotatedXY[0],
      this.org.startCellRow + rotatedXY[1],
    ];
  }

  // We can't allow diagonal rotation because it has too much of an effect on anatomical utility.
  // For the current cell, gets the X and Y after rotation.
  getRotatedAnatomyXY(dir: number) {
    let x = this.x;
    let y = this.y;

    switch (dir) {
      case Directions.cardinals.n:
        break;

      case Directions.cardinals.e:
        x = x * -1;
        break;

      case Directions.cardinals.s:
        x = x * -1;
        y = y * -1;
        break;

      case Directions.cardinals.w:
        y = y * -1;
        break;
    }

    /*if (this.org.environment === 'editor') {
      console.log('rotatedXY', [x, y]);
    }*/

    return [x, y];
  }
}

export default AnatomyCell;
