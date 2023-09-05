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

  // @TODO: Consolidate as "getRealColRow()"
  getRotatedSimulatorColRow() {
    var rotatedXY = this.getRotatedAnatomyXY(this.org.anatomyDirection);

    return [
      this.org.col + rotatedXY[0],
      this.org.row + rotatedXY[1],
    ];
  }

  // We can't allow diagonal rotation because it has too much of an effect on anatomical utility.

  // ??? Instead, east-having directions will use east coords.
  // ??? And, west-having directions will use west-coords.
  // ??? However, eyes will still show the actual direction in the editor.

  // For the current cell, gets the X and Y after rotation.
  getRotatedAnatomyXY(dir: number) {
    let x = this.x;
    let y = this.y;

    switch (dir) {
      // No rotation for north because default
      case Directions.cardinals.n:
        x = this.x;
        y = this.y;
        break;

      //case Directions.cardinals.ne:
        //c = this.row * -1;
        //r = this.row;
        //break;

      //case Directions.cardinals.ne:
      case Directions.cardinals.se:
      case Directions.cardinals.e:
        //x = this.row * -1;
        //r = this.col * -1;
        x = this.y * -1;
        y = this.x * -1;
        break;

      //case Directions.cardinals.se:
        //c = Math.abs(this.y);
        //r = Math.abs(this.y);
        //break;

      case Directions.cardinals.s:
        x = this.x * -1;
        y = this.y * -1;
        break;

      //case Directions.cardinals.sw:
        //x = this.y;
        //r = this.y * -1;
        //break;

      case Directions.cardinals.sw:
      case Directions.cardinals.nw:
      case Directions.cardinals.w:
        x = this.y;
        y = this.x;
        break;

      //case Directions.cardinals.nw:
        //x = this.y;
        //y = this.y;
        //break;
    }

    if (this.org.environment === 'editor') {
      console.log('rotatedXY', [x, y]);
    }

    return [x, y];
  }
}

export default AnatomyCell;
