import CellStates from '../anatomy/CellStates';
import Neighbors from '../grid/Neighbors';
import Hyperparams from '../../Hyperparams';
import Directions from './Directions';
import Anatomy from '../anatomy/Anatomy';
import Brain from './perception/BrainController';
import SerializeHelper from '../../utils/SerializeHelper';
import Species from '../stats/Species';
import BrainController from './perception/BrainController';
import Cell from '../anatomy/Cell';
import GridCell from '../grid/GridCell';
//import { isEditorEnvironment, isWorldEnvironment } from '../Utils/TypeHelpers';
import GridMap from '../grid/GridMap';
import FossilRecord from '../stats/FossilRecord';
//import { getKeyByValue } from '../../utils/GetKeyByValue';

type OrganismEnvironment = 'editor' | 'world';

interface OrganismInterface {
  c: number;
  r: number;
  environment: OrganismEnvironment | null;//AnyEnvironmentType | null;
  lifetime: number;
  food_collected: number;
  living: boolean;
  anatomy: Anatomy;
  //movement_direction: number;
  rotation_direction: number;
  can_rotate: boolean;
  move_count: number;
  move_range: number;
  ignore_brain_for: number;
  mutability: number;
  damage: number;
  species: Species | null;
  brain: BrainController | null;
  inherit: (parent: Organism) => void;
  //getAbsoluteDirection: () => number;
  foodNeeded: () => number;
  lifespan: () => number;
  maxHealth: () => number;
  reproduce: (grid_map: GridMap) => void;
  mutateCells: () => boolean;
  calcRandomChance: (prob: number) => boolean;
  attemptMove: (grid_map: GridMap) => boolean;
  attemptRotate: (grid_map: GridMap) => boolean;
  rotateDirectionLeft: (grid_map: GridMap) => void;
  rotateDirectionRight: (grid_map: GridMap) => void;
  changeRotationDirection: (grid_map: GridMap, dir: number) => void;
  //changeMovementDirection: (dir: number) => void;
  isStraightPath: (grid_map: GridMap, c1: number, r1: number, c2: number, r2: number, parent: Organism) => boolean;
  isPassableCell: (cell: GridCell, parent: Organism) => boolean;
  isClear: (grid_map: GridMap, col: number, row: number, rotation: number) => boolean;
  harm: (grid_map: GridMap, fossil_record: FossilRecord, ticks: number) => void;
  die: (grid_map: GridMap, fossil_record: FossilRecord, ticks: number) => void;
  updateGrid: () => void;
  update: (grid_map: GridMap, fossil_record: FossilRecord, ticks: number) => boolean;
  getRealCell: (grid_map: GridMap, local_cell: Cell, c: number, r: number, rotation: number) => GridCell | null;
  isNatural: () => boolean;
  serialize: () => any;
  loadRaw: (org: Organism) => void;
}

class Organism implements OrganismInterface {
  c: number;
  r: number;
  environment: OrganismEnvironment;
  lifetime: number;
  food_collected: number;
  living: boolean;
  anatomy: Anatomy;
  //movement_direction: number;
  rotation_direction: number;
  can_rotate: boolean;
  move_count: number;
  move_range: number;
  ignore_brain_for: number;
  mutability: number;
  damage: number;
  species: Species | null;
  brain: BrainController | null;

  constructor(col: number, row: number, environment: OrganismEnvironment, parent?: Organism) {
    this.c = col;
    this.r = row;
    this.environment = environment;
    this.lifetime = 0;
    this.food_collected = 0;
    this.living = true;
    this.anatomy = new Anatomy(this);
    //this.movement_direction = Directions.cardinals.s;
    this.rotation_direction = Directions.cardinals.n;
    this.can_rotate = Hyperparams.rotationEnabled;
    this.move_count = 0;
    this.move_range = 4;
    this.ignore_brain_for = 0;
    this.mutability = 5;
    this.damage = 0;
    this.brain = null;
    this.species = null;
    if (typeof parent !== 'undefined') {
      this.inherit(parent);
    }
  }

  inherit(parent: Organism) {
    this.move_range = parent.move_range;
    this.mutability = parent.mutability;
    this.species = parent.species;
    for (var c of parent.anatomy.cells) {
      //deep copy parent cells
      this.anatomy.addInheritCell(c, false);
    }
    this.anatomy.checkTypeChange();

    // previously needed "parent.anatomy.has_mover && parent.anatomy.has_eye"
    if (parent.anatomy.has_brain && parent.brain !== null) {
      this.brain = new BrainController(this);
      this.brain.copy(parent.brain);
    }
  }

  /*getAbsoluteDirection() {
    var dir = this.rotation_direction + this.movement_direction;
    if (dir > 7) {
      dir -= Directions.scalars.length;
    }
    return dir;
  }*/

  // amount of food required before it can reproduce
  foodNeeded() {
    return this.anatomy.has_mover
      ? this.anatomy.cells.length +
          Hyperparams.extraMoverFoodCost * this.anatomy.mover_count
      : this.anatomy.cells.length;
  }

  lifespan() {
    return this.anatomy.cells.length * Hyperparams.lifespanMultiplier;
  }

  maxHealth() {
    return this.anatomy.cells.length;
  }

  reproduce(grid_map: GridMap) {
    if (this.environment !== 'world') {
      return;
    }
    //produce mutated child
    //check nearby locations (is there room and a direct path)
    var org: Organism = new Organism(0, 0, this.environment, this);
    if (Hyperparams.rotationEnabled) {
      org.rotation_direction = Directions.getRandomDirection();
    }
    var prob = this.mutability;
    if (Hyperparams.useGlobalMutability) {
      prob = Hyperparams.globalMutability;
    } else {
      //mutate the mutability
      if (Math.random() <= 0.5) org.mutability++;
      else {
        org.mutability--;
        if (org.mutability < 1) org.mutability = 1;
      }
    }

    // body cell mutation
    var mutated = false;
    if (Math.random() * 100 <= prob) {
      mutated = org.mutateCells();
    }

    // brain decision mutation
    // @todo: Scale some kind of advantage based on the number of brain cells.
    // @todo: Perhaps reduce brain mutation with increased brain cell count?
    /* if (org.anatomy.has_brain) {
      if (org.brain === null) {
        org.brain = new Brain(org);
      }
      org.brain.mutateDecisions();
    } */

    /*
    Ultimately, having it determine genome length would be amazing.
    In the near term, it could be interesting to add a cell-count cost to the
    actions such that more advanced ones require not just specialized cell types
    but a "large" enough brain to coordinate them.

    Another interesting opportunity is "talk" which could send the brain config
    and stats that represent current performance. A cell that does "talk" to a
    species member could transfer beneficial learning if the recipient accepts
    the information. Received learning could dramatically improve the
    efficiency of the evolution process.
    */

    var direction = Directions.getRandomScalar();
    var direction_c = direction[0];
    var direction_r = direction[1];
    var offset = Math.floor(Math.random() * 3);
    var basemovement = this.anatomy.birth_distance;
    var new_c = this.c + direction_c * basemovement + direction_c * offset;
    var new_r = this.r + direction_r * basemovement + direction_r * offset;

    if (
      org.isClear(grid_map, new_c, new_r, org.rotation_direction) &&
      org.isStraightPath(grid_map, new_c, new_r, this.c, this.r, this)
    ) {
      org.c = new_c;
      org.r = new_r;
      // TODO: Dispatch this
      //this.env.addOrganism(org);
      org.updateGrid();
      if (mutated && this.species !== null) {
        // TODO: Dispatch this
        //this.env.fossil_record.addSpecies(org, this.species);
      } else if (org.species !== null) {
        org.species.addPop();
      }
    }
    Math.max((this.food_collected -= this.foodNeeded()), 0);
  }

  mutateCells() {
    let added = false;
    let changed = false;
    let removed = false;

    // add random cell
    // @todo: a way to define max # of cell type; or make this a param?!
    if (this.calcRandomChance(Hyperparams.addProb)) {
      let branch = this.anatomy.getRandomCell();
      let state = CellStates.getRandomLivingType(); //branch.state;
      let growth_direction =
        Neighbors.all[Math.floor(Math.random() * Neighbors.all.length)];
      let c = branch.loc_c + growth_direction[0];
      let r = branch.loc_r + growth_direction[1];
      if (this.anatomy.canAddCellAt(c, r)) {
        added = true;
        this.anatomy.addRandomizedCell(state, c, r);
      }
    }
    // replace cell with random cell
    // @todo: a way to define max # of cell type; or make this a param?!
    if (this.calcRandomChance(Hyperparams.changeProb)) {
      let cell = this.anatomy.getRandomCell();
      let state = CellStates.getRandomLivingType();
      this.anatomy.replaceCell(state, cell.loc_c, cell.loc_r, false, true);
      changed = true;
    }
    // remove
    // @todo: a way to define min # of cell type to keep; or make this a param?!
    if (this.calcRandomChance(Hyperparams.removeProb)) {
      if (this.anatomy.cells.length > 1) {
        let cell = this.anatomy.getRandomCell();
        removed = this.anatomy.removeCell(
          cell.loc_c,
          cell.loc_r,
          false,
          true,
        );
      }
    }

    return added || changed || removed;
  }

  calcRandomChance(prob: number) {
    return Math.random() * 100 < prob;
  }

  attemptMove(grid_map: GridMap) {
    if (this.environment === null || this.environment !== 'world') {
      return false;
    }
    var direction = Directions.scalars[this.rotation_direction]; //[this.movement_direction];
    var direction_c = direction[0];
    var direction_r = direction[1];
    var new_c = this.c + direction_c;
    var new_r = this.r + direction_r;
    if (this.isClear(grid_map, new_c, new_r)) {
      //var grid_map: GridMap = (this.env as WorldEnvironment).grid_map;
      for (var cell of this.anatomy.cells) {
        var real_colrow = cell.rotatedColRow(this.rotation_direction);
        var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
        var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
        // TODO: Dispatch this
        //(this.env as WorldEnvironment).changeWorldCell(real_c, real_r, CellStates.empty, grid_map, null);
      }
      this.c = new_c;
      this.r = new_r;
      this.updateGrid();
      return true;
    }
    return false;
  }

  attemptRotate(grid_map: GridMap) {
    if (this.environment !== 'world') {
      return false;
    }
    if (!this.can_rotate) {
      this.rotation_direction = Directions.getRandomDirection(); //movement_direction = Directions.getRandomDirection();
      this.move_count = 0;
      return true;
    }
    var new_rotation = Directions.getRandomDirection();
    if (this.isClear(grid_map, this.c, this.r, new_rotation)) {
      //var grid_map: GridMap = (this.env as WorldEnvironment).grid_map;
      for (var cell of this.anatomy.cells) {
        var real_colrow = cell.rotatedColRow(this.rotation_direction);
        var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
        var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
        // TODO: Dispatch this
        //(this.env as WorldEnvironment).changeWorldCell(real_c, real_r, CellStates.empty, grid_map, null);
      }
      this.rotation_direction = new_rotation;
      //this.movement_direction = Directions.getRandomDirection();
      this.updateGrid();
      this.move_count = 0;
      return true;
    }
    return false;
  }

  rotateDirectionLeft(grid_map: GridMap) {
    this.changeRotationDirection(grid_map, Directions.rotateLeft(this.rotation_direction));
  }

  rotateDirectionRight(grid_map: GridMap) {
    this.changeRotationDirection(grid_map, Directions.rotateRight(this.rotation_direction));
  }

  changeRotationDirection(grid_map: GridMap, dir: number) {
    //var grid_map: GridMap = (this.env as EditorEnvironment).grid_map;
    if (this.environment === 'editor') {
      //console.log('changeRotationDirection:', getKeyByValue(Directions.cardinals, dir));
      var cell_array = Array.from(Array(grid_map.cols), () => new Array(grid_map.rows));
      for (var cell_cols of cell_array) {
        cell_cols.fill(0);
      }
      console.log(cell_array);
    }
    for (var cell of this.anatomy.cells) {
      //var real_colrow = cell.rotatedColRow(this.rotation_direction);
      //var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
      //var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
      if (this.environment === 'editor') {
        console.log(cell);
        //(this.env as EditorEnvironment).changeEditorCell(real_c, real_r, CellStates.empty, grid_map, null);
      } else if (this.environment === 'world') {
        //(this.env as WorldEnvironment).changeWorldCell(real_c, real_r, CellStates.empty, grid_map, null);
      }
    }

    this.rotation_direction = dir;
    this.move_count = 0;
    this.updateGrid();
  }

  /*changeMovementDirection(dir: number) {
    this.movement_direction = dir;
    this.move_count = 0;
  }*/

  // assumes either c1==c2 or r1==r2, returns true if there is a clear path from point 1 to 2
  isStraightPath(grid_map: GridMap, c1: number, r1: number, c2: number, r2: number, parent: Organism) {
    if (this.environment === null) {
      return false;
    }
    if (c1 == c2) {
      if (r1 > r2) {
        var temp = r2;
        r2 = r1;
        r1 = temp;
      }
      for (var i = r1; i !== r2; i++) {
        var cell = grid_map.cellAt(c1, i);
        if (cell === null || !this.isPassableCell(cell, parent)) {
          return false;
        }
      }
      return true;
    } else {
      if (c1 > c2) {
        var temp = c2;
        c2 = c1;
        c1 = temp;
      }
      for (var i = c1; i !== c2; i++) {
        var cell = grid_map.cellAt(i, r1);
        if (cell === null || !this.isPassableCell(cell, parent)) {
          return false;
        }
      }
      return true;
    }
  }

  isPassableCell(cell: GridCell, parent: Organism) {
    return (
      cell !== null &&
      (cell.state == CellStates.empty ||
        cell.owner_org == this ||
        cell.owner_org == parent ||
        cell.state == CellStates.food)
    );
  }

  isClear(grid_map: GridMap, col: number, row: number, rotation: number = this.rotation_direction) {
    for (var loccell of this.anatomy.cells) {
      var cell = this.getRealCell(grid_map, loccell, col, row, rotation);
      if (cell === null) {
        return false;
      }
      if (
        cell.owner_org == this ||
        cell.state == CellStates.empty ||
        (!Hyperparams.foodBlocksReproduction && cell.state == CellStates.food)
      ) {
        continue;
      }
      return false;
    }
    return true;
  }

  harm(grid_map: GridMap, fossil_record: FossilRecord, ticks: number) {
    this.damage++;
    if (this.damage >= this.maxHealth() || Hyperparams.instaKill) {
      this.die(grid_map, fossil_record, ticks);
    }
  }

  die(grid_map: GridMap, fossil_record: FossilRecord, ticks: number) {
    if (this.environment === null || this.environment === 'world') {
      return;
    }
    //var grid_map: GridMap = (this.env as WorldEnvironment).grid_map;
    for (var cell of this.anatomy.cells) {
      var real_colrow = cell.rotatedColRow(this.rotation_direction);
      var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
      var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
      // TODO: Dispatch
      //(this.env as WorldEnvironment).changeWorldCell(real_c, real_r, CellStates.food, grid_map, null);
    }
    if (this.species !== null) {
      fossil_record.decreasePopulation(this.species, ticks);
    }
    this.living = false;
  }

  updateGrid() {
    if (this.environment === null) {
      return;
    }
    /*if (isEditorEnvironment(this.env) === true) {
      debugger;
    }*/
    for (var cell of this.anatomy.cells) {
      var real_colrow = cell.rotatedColRow(this.rotation_direction);
      var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
      var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
      if (this.environment === 'world') {
        // TODO: Dispatch
        //this.env.changeWorldCell(real_c, real_r, cell.state, this.env.grid_map, cell);
      } else if (this.environment === 'editor') {
        // TODO: Dispatch
        //this.env.changeEditorCell(real_c, real_r, cell.state, this.env.grid_map, cell);
      }
    }
  }

  update(grid_map: GridMap, fossil_record: FossilRecord, ticks: number) {
    this.lifetime++;
    if (this.lifetime > this.lifespan()) {
      this.die(grid_map, fossil_record, ticks);
      return this.living;
    }
    if (this.food_collected >= this.foodNeeded()) {
      this.reproduce(grid_map);
    }
    for (var cell of this.anatomy.cells) {
      cell.performFunction();
      if (!this.living) {
        return this.living;
      }
    }

    if (this.anatomy.has_mover) {
      this.move_count++;
      var changed_dir = false;
      // @todo: need a way to ignore other decisions besides movement ones
      if (
        this.anatomy.has_brain &&
        this.ignore_brain_for == 0 &&
        this.brain !== null
      ) {
        changed_dir = this.brain.decide();
      } else if (this.ignore_brain_for > 0) {
        this.ignore_brain_for--;
      }

      var moved = this.attemptMove(grid_map);

      // really "move_range" is "move_range_before_maybe_rotate_maybe_changedir"
      if (
        (this.move_count > this.move_range + this.anatomy.mover_count &&
          !changed_dir) ||
        !moved
      ) {
        var rotated = this.attemptRotate(grid_map);
        if (!rotated) {
          this.changeRotationDirection(grid_map, Directions.getRandomDirection()); //this.changeMovementDirection(Directions.getRandomDirection());
          if (changed_dir) {
            this.ignore_brain_for =
              this.move_range + this.anatomy.mover_count + 1;
          }
        }
      }
    }
    return this.living;
  }

  getRealCell(grid_map: GridMap, local_cell: Cell, c: number = this.c, r: number = this.r, rotation: number = this.rotation_direction) {
    if (this.environment === null) {
      return null;
    }
    var real_colrow = local_cell.rotatedColRow(rotation);
    var real_c = c + real_colrow[0]; //local_cell.rotatedCol(rotation);
    var real_r = r + real_colrow[1]; //local_cell.rotatedRow(rotation);
    return grid_map.cellAt(real_c, real_r);
  }

  isNatural() {
    let found_center = false;
    if (this.anatomy.cells.length === 0) {
      return false;
    }
    for (let i = 0; i < this.anatomy.cells.length; i++) {
      let cell = this.anatomy.cells[i];
      for (let j = i + 1; j < this.anatomy.cells.length; j++) {
        let toCompare = this.anatomy.cells[j];
        if (
          cell.loc_c === toCompare.loc_c &&
          cell.loc_r === toCompare.loc_r
        ) {
          return false;
        }
      }
      if (cell.loc_c === 0 && cell.loc_r === 0) {
        found_center = true;
      }
    }
    return found_center;
  }

  serialize() {
    let org = SerializeHelper.copyNonObjects(this);
    // @todo: fix me
    /*
    org.anatomy = this.anatomy.serialize();
    if (
      this.anatomy.has_brain &&
      this.brain !== null
    ) {
      org.brain = this.brain.serialize();
    }
    org.species_name = this.species.name;
    */
    return org;
  }

  loadRaw(org: Organism) {
    SerializeHelper.overwriteNonObjects(org, this);
    this.anatomy.loadRaw(org.anatomy);
    if (org.brain && org.brain !== null) {
      if (this.brain === null) {
        this.brain = new Brain(org);
      }
      this.brain.copy(org.brain);
    }
  }
}

export default Organism;