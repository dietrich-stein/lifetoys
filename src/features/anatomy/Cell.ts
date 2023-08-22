//import GridCell from '../grid/GridCell';
import GridMap from '../grid/GridMap';
import Directions from '../organism/Directions';
import Organism from '../organism/Organism';
import FossilRecord from '../stats/FossilRecord';
//import { store, RootState } from '../../app/store';
import { HyperparamsState } from '../world/WorldManagerSlice';

interface CellInterface {
  //store: RootState;
  hyperparams: HyperparamsState,
  state: AnyCellState;
  org: Organism;
  loc_c: number;
  loc_r: number;
  initInherit: (parent: Cell) => void;
  initRandom: () => void;
  initDefault: () => void;
  performFunction: (gridMap: GridMap, fossilRecord: FossilRecord, ticks: number) => void;
  getRealCol: () => void;
  getRealRow: () => void;

  //getRealCell: () => GridCell | null;
  //rotatedCol: (dir: number) => number;
  //rotatedRow: (dir: number) => number;

  rotatedColRow: (dir: number) => number[];
}

class Cell implements CellInterface {
  //store: RootState;
  hyperparams: HyperparamsState;
  state: AnyCellState;
  org: Organism;
  loc_c: number;
  loc_r: number;

  constructor(state: AnyCellState, org: Organism, loc_col: number, loc_row: number, hyperparams: HyperparamsState) {
    //this.store = store.getState();
    this.hyperparams = hyperparams;
    this.state = state;
    this.org = org;
    this.loc_c = loc_col;
    this.loc_r = loc_row;

    var distance = Math.max(
      Math.abs(loc_row) * 2 + 2,
      Math.abs(loc_col) * 2 + 2,
    );

    if (this.org.anatomy.birth_distance < distance) {
      this.org.anatomy.birth_distance = distance;
    }
  }

  initInherit(parent: Cell) {
    // deep copy parent values
    this.loc_c = parent.loc_c;
    this.loc_r = parent.loc_r;
  }

  initRandom() {
    // initialize values randomly
  }

  initDefault() {
    // initialize to default values
  }

  performFunction(gridMap: GridMap, fossilRecord: FossilRecord, ticks: number) {
    // default behavior: none
  }

  // @TODO: Consolidate as "getRealColRow()"
  getRealCol() {
    var real_colrow = this.rotatedColRow(this.org.rotation_direction);

    return this.org.c + real_colrow[0]; //this.rotatedCol(this.org.rotation_direction);
  }

  getRealRow() {
    var real_colrow = this.rotatedColRow(this.org.rotation_direction);

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
  rotatedColRow(dir: number) {
    let c = this.loc_c;
    let r = this.loc_r;

    switch (dir) {
      case Directions.cardinals.n:
        c = this.loc_c;
        r = this.loc_r;
        break;

      /*case Directions.cardinals.ne:
        c = this.loc_r * -1;
        r = this.loc_r;
        break;*/

      case Directions.cardinals.ne:
      case Directions.cardinals.se:
      case Directions.cardinals.e:
        /*
        c = this.loc_r * -1;
        r = this.loc_c * -1;
        */
        c = this.loc_r * -1;
        r = this.loc_c * -1;
        break;

      /*case Directions.cardinals.se:
        c = Math.abs(this.loc_r);
        r = Math.abs(this.loc_r);
        break;*/

      case Directions.cardinals.s:
        c = this.loc_c * -1;
        r = this.loc_r * -1;
        break;

      /*case Directions.cardinals.sw:
        c = this.loc_r;
        r = this.loc_r * -1;
        break;*/

      case Directions.cardinals.sw:
      case Directions.cardinals.nw:
      case Directions.cardinals.w:
        c = this.loc_r;
        r = this.loc_c;
        break;

      /*case Directions.cardinals.nw:
        c = this.loc_r;
        r = this.loc_r;
        break;*/
    }

    if (this.org.environment === 'editor') {
      console.log('rotatedColRow', [c, r]);
    }

    return [c, r];
  }
}

export default Cell;
