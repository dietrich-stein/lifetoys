import AnatomyCell from './AnatomyCell';
import CellFactory from './AnatomyCellFactory';
import SimulatorCellStates from '../simulator/SimulatorCellStates';
import SerializeHelper from '../../utils/SerializeHelper';
import Organism from '../organism/Organism';
import { HyperparamsState } from '../world/WorldManagerSlice';

type SerializedAnatomy = {};

interface AnatomyInterface {
  cells: Array<AnatomyCell>;
  org: Organism;
  birth_distance: number;
  has_mouth: boolean;
  has_brain: boolean;
  has_mover: boolean;
  has_eye: boolean;
  has_killer: boolean;
  has_producer: boolean;
  has_armor: boolean;
  mouth_count: number;
  brain_count: number;
  mover_count: number;
  eye_count: number;
  killer_count: number;
  producer_count: number;
  armor_count: number;
  clear: () => void;
  canAddCellAt: (x: number, y: number) => boolean;
  addDefaultCell: (
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean,
    hyperparams: HyperparamsState
  ) => AnatomyCell;
  addRandomizedCell: (
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean,
    hyperparams: HyperparamsState
  ) => AnatomyCell;
  addInheritCell: (parent_cell: AnatomyCell, check_types: boolean, hyperparams: HyperparamsState) => AnatomyCell;
  replaceCell: (
    x: number,
    y: number,
    state: AnatomyCellState,
    randomize: boolean,
    check_types: boolean,
    hyperparams: HyperparamsState
  ) => AnatomyCell;
  removeCell: (x: number, y: number, allow_center_removal: boolean, check_types: boolean) => boolean;
  getLocalCell: (x: number, y: number) => AnatomyCell | null;
  checkTypeChange: () => void;
  getRandomCell: () => AnatomyCell | null;
  getNeighborsOfCell: (x: number, y: number) => Array<AnatomyCell>;
  //isEqual: (anatomy: Anatomy) => boolean;
  serialize: () => SerializedAnatomy;
  loadRaw: (anatomy: Anatomy, hyperparams: HyperparamsState) => void;
}

class Anatomy implements AnatomyInterface {
  cells: Array<AnatomyCell>;
  org: Organism;
  birth_distance: number;
  has_mouth: boolean;
  has_brain: boolean;
  has_mover: boolean;
  has_eye: boolean;
  has_killer: boolean;
  has_producer: boolean;
  has_armor: boolean;
  mouth_count: number;
  brain_count: number;
  mover_count: number;
  eye_count: number;
  killer_count: number;
  producer_count: number;
  armor_count: number;

  constructor(ownerOrganism: Organism) {
    this.cells = [];
    this.org = ownerOrganism;
    this.birth_distance = 4;

    this.has_mouth = false;
    this.has_brain = false;
    this.has_mover = false;
    this.has_eye = false;
    this.has_killer = false;
    this.has_producer = false;
    this.has_armor = false;

    this.mouth_count = 0;
    this.brain_count = 0;
    this.mover_count = 0;
    this.eye_count = 0;
    this.killer_count = 0;
    this.producer_count = 0;
    this.armor_count = 0;
  }

  clear() {
    this.cells = [];

    this.has_mouth = false;
    this.has_brain = false;
    this.has_mover = false;
    this.has_eye = false;
    this.has_killer = false;
    this.has_producer = false;
    this.has_armor = false;

    this.mouth_count = 0;
    this.brain_count = 0;
    this.mover_count = 0;
    this.eye_count = 0;
    this.killer_count = 0;
    this.producer_count = 0;
    this.armor_count = 0;
  }

  canAddCellAt(x: number, y: number) {
    for (var cell of this.cells) {
      if (cell.x === x && cell.y === y) {
        return false;
      }
    }

    return true;
  }

  addDefaultCell(
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean = false,
    hyperparams: HyperparamsState,
  ) {
    var new_cell = CellFactory.createDefault(x, y, this.org, state, hyperparams);

    this.cells.push(new_cell);

    if (check_types) {
      this.checkTypeChange();
    }

    return new_cell;
  }

  addRandomizedCell(
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean = false,
    hyperparams: HyperparamsState,
  ) {
    var new_cell = CellFactory.createRandom(x, y, this.org, state, hyperparams);

    this.cells.push(new_cell);

    // randomize decisions for first brain cell
    if (
      state === SimulatorCellStates.brain &&
      this.has_brain &&
      this.org.brain !== null
    ) {
      this.org.brain.randomizeDecisions();
    }

    if (check_types) {
      this.checkTypeChange();
    }

    return new_cell;
  }

  addInheritCell(parent_cell: AnatomyCell, check_types: boolean = false, hyperparams: HyperparamsState) {
    var new_cell = CellFactory.createInherited(this.org, parent_cell, hyperparams);

    this.cells.push(new_cell);

    if (check_types) {
      this.checkTypeChange();
    }

    return new_cell;
  }

  replaceCell(
    x: number,
    y: number,
    state: AnatomyCellState,
    randomize: boolean = true,
    check_types: boolean = false,
    hyperparams: HyperparamsState,
  ) {
    // false because we don't want to check types until after the replacement
    this.removeCell(x, y, true, false);

    if (randomize) {
      return this.addRandomizedCell(x, y, state, check_types, hyperparams);
    } else {
      return this.addDefaultCell(x, y, state, check_types, hyperparams);
    }
  }

  removeCell(x: number, y: number, allow_center_removal: boolean = false, check_types: boolean = false) {
    if (x === 0 && y === 0 && !allow_center_removal) {
      return false;
    }

    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];

      if (cell.x === x && cell.y === y) {
        this.cells.splice(i, 1);
        break;
      }
    }

    if (check_types) {
      this.checkTypeChange();
    }

    return true;
  }

  getLocalCell(x: number, y: number) {
    for (var cell of this.cells) {
      if (cell.x === x && cell.y === y) {
        return cell;
      }
    }

    return null;
  }

  checkTypeChange() {
    this.has_mouth = false;
    this.has_brain = false;
    this.has_mover = false;
    this.has_eye = false;
    this.has_killer = false;
    this.has_producer = false;
    this.has_armor = false;
    for (var cell of this.cells) {
      // @todo: should be using a switch here
      if (cell.state === SimulatorCellStates.mouth) {
        this.has_mouth = true;
        this.mouth_count++;
      }

      if (cell.state === SimulatorCellStates.brain) {
        this.has_brain = true;
        this.brain_count++;
      }

      if (cell.state === SimulatorCellStates.mover) {
        this.has_mover = true;
        this.mover_count++;
      }

      if (cell.state === SimulatorCellStates.eye) {
        this.has_eye = true;
        this.eye_count++;
      }

      if (cell.state === SimulatorCellStates.killer) {
        this.has_killer = true;
        this.killer_count++;
      }

      if (cell.state === SimulatorCellStates.producer) {
        this.has_producer = true;
        this.producer_count++;
      }

      if (cell.state === SimulatorCellStates.armor) {
        this.has_eye = true;
        this.armor_count++;
      }
    }
  }

  getRandomCell() {
    if (this.cells.length === 0) {
      return null;
    }

    return this.cells[Math.floor(Math.random() * this.cells.length)];
  }

  getNeighborsOfCell(x: number, y: number) {
    var neighbors = [];

    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        var neighbor = this.getLocalCell(x + i, y + j);

        if (neighbor !== null) {
          neighbors.push(neighbor);
        }
      }
    }

    return neighbors;
  }

  /*isEqual(anatomy: Anatomy) {
    // currently unused helper func. inefficient, avoid usage in prod.
    if (this.cells.length !== anatomy.cells.length) return false;
    for (let i in this.cells) {
      let my_cell = this.cells[i];
      let their_cell = anatomy.cells[i];

      if (
        my_cell.col !== their_cell.x ||
        my_cell.row !== their_cell.y ||
        my_cell.state !== their_cell.state
      )
        return false;
    }

    return true;
  }*/

  serialize() {
    let anatomy = SerializeHelper.copyNonObjects(this) as Anatomy;

    anatomy.cells = [];
    for (let cell of this.cells) {
      let newCell = SerializeHelper.copyNonObjects(cell) as AnatomyCell;

      newCell.state = {
        name: cell.state.name,
        //slit_color: '',
        //color: '',
        //render: null, // cell.state.render
      } as any;
      anatomy.cells.push(newCell);
    }

    return anatomy;
  }

  loadRaw(anatomy: Anatomy, hyperparams: HyperparamsState) {
    this.clear();
    for (let cell of anatomy.cells) {
      this.addInheritCell(cell, false, hyperparams);
    }

    this.checkTypeChange();
  }
}

export default Anatomy;
