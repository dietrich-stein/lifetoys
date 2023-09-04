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
  initInherited: (parent: AnatomyCell) => void;
  initRandom: () => void;
  initDefault: () => void;
  performFunction: (renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) => void;

  getRealX: () => void;
  getRealY: () => void;
  getRotatedXY: (dir: number) => number[];

  //getRealCell: () => GridCell | null;
  //rotatedCol: (dir: number) => number;
  //rotatedRow: (dir: number) => number;
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

  initInherited(parent: AnatomyCell) {
    this.x = parent.x;
    this.y = parent.y;
  }

  initRandom() {
    // initialize values randomly
  }

  initDefault() {
    // initialize to default values
  }

  performFunction(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    // default behavior: none
  }

  // @TODO: Consolidate as "getRealColRow()"
  getRealX() {
    var real_colrow = this.getRotatedXY(this.org.rotation_direction);

    return this.org.c + real_colrow[0]; //this.rotatedCol(this.org.rotation_direction);
  }

  getRealY() {
    var real_colrow = this.getRotatedXY(this.org.rotation_direction);

    return this.org.r + real_colrow[1]; //this.rotatedRow(this.org.rotation_direction);
  }

  /*getRealCell() {
    var real_c = this.getRealCol();
    var real_r = this.getRealRow();
    if (this.org !== null && this.org.environment !== null) {
      return this.org.env.grid_map.cellAt(real_c, real_r);
    } else {
      return null;
    }
  }*/

  // We can't allow diagonal rotation.
  // It has too much of an affect on anatomy.
  // Instead, east-having directions will use east coords.
  // And, west-having directions will use west-coords.
  // However, eyes will still show the actual direction in the editor.
  getRotatedXY(dir: number) {
    let x = this.x;
    let y = this.y;

    switch (dir) {
      case Directions.cardinals.n:
        x = this.x;
        y = this.y;
        break;

      //case Directions.cardinals.ne:
        //c = this.row * -1;
        //r = this.row;
        //break;

      case Directions.cardinals.ne:
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
