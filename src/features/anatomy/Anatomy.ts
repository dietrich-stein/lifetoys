import AnatomyCell from './AnatomyCell';
import AnatomyCellFactory from './AnatomyCellFactory';
import SimulatorCellStates from '../simulator/SimulatorCellStates';
import SerializeHelper from '../../utils/SerializeHelper';
import Organism from '../organism/Organism';
import { HyperparamsState } from '../world/WorldManagerSlice';
import Directions from '../organism/Directions';

type SerializedAnatomy = {};

interface AnatomyInterface {
  cells: Array<AnatomyCell>;
  plan: GrowthPlan;
  org: Organism;
  birth_distance: number;
  hasMouth: boolean;
  hasMover: boolean;
  hasEye: boolean;
  hasStinger: boolean;
  hasProducer: boolean;
  hasArmor: boolean;
  //mouth_count: number;
  //mover_count: number;
  //eye_count: number;
  //stinger_count: number;
  //producer_count: number;
  //armor_count: number;
  clear: () => void;
  canAddCellAt: (x: number, y: number) => boolean;
  addCell: (
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean,
    hyperparams: HyperparamsState
  ) => AnatomyCell;
  addRandomCell: (
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean,
    hyperparams: HyperparamsState
  ) => AnatomyCell;
  addInheritedCell: (
    parent_cell: AnatomyCell,
    check_types: boolean,
    hyperparams: HyperparamsState
  ) => AnatomyCell;
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
  checkChangedCells: () => void;
  getRandomCell: () => AnatomyCell | null;
  getNeighborsOfCell: (x: number, y: number) => Array<AnatomyCell>;
  //isEqual: (anatomy: Anatomy) => boolean;
  executeGrowthPlan: (value: GrowthPlan, hyperparams: HyperparamsState) => void;
  //exportGrowthPlanFromCells: () => GrowthPlan;
  serialize: () => SerializedAnatomy;
  loadRaw: (anatomy: Anatomy, hyperparams: HyperparamsState) => void;
}

class Anatomy implements AnatomyInterface {
  cells: Array<AnatomyCell>;
  plan: GrowthPlan;
  org: Organism;
  birth_distance: number;
  hasMouth: boolean;
  hasMover: boolean;
  hasEye: boolean;
  hasStinger: boolean;
  hasProducer: boolean;
  hasArmor: boolean;
  //mouth_count: number;
  //brain_count: number;
  //mover_count: number;
  //eye_count: number;
  //stinger_count: number;
  //producer_count: number;
  //armor_count: number;

  constructor(ownerOrganism: Organism) {
    this.cells = [];
    this.plan = [];
    this.org = ownerOrganism;
    this.birth_distance = 4;

    this.hasMouth = false;
    this.hasMover = false;
    this.hasEye = false;
    this.hasStinger = false;
    this.hasProducer = false;
    this.hasArmor = false;

    /*this.mouth_count = 0;
    this.brain_count = 0;
    this.mover_count = 0;
    this.eye_count = 0;
    this.stinger_count = 0;
    this.producer_count = 0;
    this.armor_count = 0;*/
  }

  clear() {
    this.cells = [];

    this.hasMouth = false;
    this.hasMover = false;
    this.hasEye = false;
    this.hasStinger = false;
    this.hasProducer = false;
    this.hasArmor = false;

    /*this.mouth_count = 0;
    this.brain_count = 0;
    this.mover_count = 0;
    this.eye_count = 0;
    this.stinger_count = 0;
    this.producer_count = 0;
    this.armor_count = 0;*/
  }

  canAddCellAt(x: number, y: number) {
    for (var cell of this.cells) {
      if (cell.x === x && cell.y === y) {
        return false;
      }
    }

    return true;
  }

  addCell(
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean = false,
    hyperparams: HyperparamsState,
  ) {
    var new_cell = AnatomyCellFactory.createRegular(x, y, this.org, state, hyperparams);

    this.cells.push(new_cell);

    if (check_types) {
      this.checkChangedCells();
    }

    return new_cell;
  }

  addRandomCell(
    x: number,
    y: number,
    state: AnatomyCellState,
    check_types: boolean = false,
    hyperparams: HyperparamsState,
  ) {
    var new_cell = AnatomyCellFactory.createRandom(x, y, this.org, state, hyperparams);

    this.cells.push(new_cell);

    if (check_types) {
      this.checkChangedCells();
    }

    return new_cell;
  }

  addInheritedCell(parent: AnatomyCell, check_types: boolean = false, hyperparams: HyperparamsState) {
    var new_cell = AnatomyCellFactory.createInherited(this.org, parent, hyperparams);

    this.cells.push(new_cell);

    if (check_types) {
      this.checkChangedCells();
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
      return this.addRandomCell(x, y, state, check_types, hyperparams);
    } else {
      return this.addCell(x, y, state, check_types, hyperparams);
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
      this.checkChangedCells();
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

  checkChangedCells() {
    this.hasMouth = false;
    this.hasMover = false;
    this.hasEye = false;
    this.hasStinger = false;
    this.hasProducer = false;
    this.hasArmor = false;
    for (var cell of this.cells) {
      // @todo: should be using a switch here
      if (cell.state === SimulatorCellStates.mouth) {
        this.hasMouth = true;
        //this.mouth_count++;
      }

      if (cell.state === SimulatorCellStates.mover) {
        this.hasMover = true;
        //this.mover_count++;
      }

      if (cell.state === SimulatorCellStates.eye) {
        this.hasEye = true;
        //this.eye_count++;
      }

      if (cell.state === SimulatorCellStates.stinger) {
        this.hasStinger = true;
        //this.stinger_count++;
      }

      if (cell.state === SimulatorCellStates.producer) {
        this.hasProducer = true;
        //this.producer_count++;
      }

      if (cell.state === SimulatorCellStates.armor) {
        this.hasArmor = true;
        //this.armor_count++;
      }
    }
  }

  getRandomCell(exceptions: string[] = []) {
    if (
      this.cells.length === 0 ||
      (
        this.cells.length === 1 &&
        this.cells[0].state.name === 'brain'
      )
    ) {
      return null;
    }

    let filteredCells = this.cells;

    if (exceptions.length > 0) {
      filteredCells = this.cells.filter((cell) => {
        return cell.state.name !== 'brain';
      });
    }

    return filteredCells[Math.floor(Math.random() * filteredCells.length)];
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

  executeGrowthPlan(value: GrowthPlan, hyperparams: HyperparamsState) {
    this.plan = value;

    let offsetX = 0;
    let offsetY = 0;
    let direction;
    let debugSteps = [];

    for (let step of this.plan) {
      let x = 0;
      let y = 0;
      let stepDebug = '';

      if (step.direction > -1) {
        direction = Directions.scalars[step.direction];
        x = direction[0];
        y = direction[1];

        stepDebug += Directions.labels[step.direction];
      } else {
        stepDebug += 'origin';
      }

      offsetX += x;
      offsetY += y;

      if (step.state !== null) {
        this.addCell(offsetX, offsetY, step.state, false, hyperparams);
        stepDebug += ` (${step.state.name})`;
      }

      debugSteps.push(stepDebug);
    }

    //console.log('executeGrowthPlan', debugSteps.join(' > '));
  }

  // Origin cells may have a scalar of [0, 0] which is not in the cardinal set.
  //   - All this does is place the first cell without a move.
  //
  // Origin calls have no special abstractions or handling aside from allowance above.
  //
  // If the first item has [0, 0] scalar (n/a) the organism will have a central origin cell.
  //     This DOES NOT enforce an odd number of X and Y organism cells.
  //
  // If the first item has a [-1, 0] scalar (west) the organism will simply move before placing
  // a non-central origin
  //     This DOES NOT enforce and even number of X and Y organism cells.
  //
  // Concerns over symmetry and efficiency of body plan compression are out of scope for now.
  //
  // For now, as long as it is the first item (plan step), we typically have something like this
  // as a result of  a non-central origin step:
  //
  // {
  //   state: MouthState,
  //   direction: -1,
  // }
  //
  // Anatomy is a radial model from origin cell at [0, 0].
  // Growth plan is a procedural model that can also start at [0, 0].
  //
  // We have this function, exportGrowthPlanFromCells() to go from anatomy to plan.
  // We also need one for plan to organism.
  /*exportGrowthPlanFromCells() {
    let plan: GrowthPlan = [];

    for (let cell of this.cells) {
      let scalarDirection = [ cell.x, cell.y ];
      let direction = Directions.scalars.findIndex((value: number[]) => {
        return (
          value.length === 2 &&
          scalarDirection[0] === value[0] &&
          scalarDirection[1] === value[1]
        );
      });
      let debugDirection = (direction > -1) ? Directions.labels[direction] : '';
      let step: GrowthPlanStep = {
        state: cell.state,
        scalarDirection,
        direction,
        debugDirection,
      };

      plan.push(step);
    }

    console.log('plan:', plan);

    return plan;
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
      this.addInheritedCell(cell, false, hyperparams);
    }

    this.checkChangedCells();
  }
}

export default Anatomy;
