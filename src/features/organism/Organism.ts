import CellStates from '../simulator/SimulatorCellStates';
import Neighbors from '../simulator/SimulatorNeighbors';
import Directions from './Directions';
import Anatomy from '../anatomy/Anatomy';
import Brain from './perception/BrainController';
import SerializeHelper from '../../utils/SerializeHelper';
import Species from '../stats/Species';
import BrainController from './perception/BrainController';
import AnatomyCell from '../anatomy/AnatomyCell';
import SimulatorCell from '../simulator/SimulatorCell';
import SimulatorMap from '../simulator/SimulatorMap';
import { HyperparamsState } from '../world/WorldManagerSlice';
import WorldSimulation from '../world/WorldSimulation';
import WorldRenderer from '../world/WorldRenderer';

type Environment = 'editor' | 'world';

interface OrganismInterface {
  simulation: WorldSimulation;
  hyperparams: HyperparamsState;
  c: number;
  r: number;
  environment: Environment | null;
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
  inheritFromParent: (parent: Organism) => void;
  //getAbsoluteDirection: () => number;
  foodNeeded: () => number;
  lifespan: () => number;
  maxHealth: () => number;
  reproduce: (renderer: WorldRenderer, map: SimulatorMap) => void;
  mutateCells: () => boolean;
  calcRandomChance: (prob: number) => boolean;
  attemptMove: (renderer: WorldRenderer, map: SimulatorMap) => boolean;
  attemptRotate: (renderer: WorldRenderer, map: SimulatorMap) => boolean;
  rotateDirectionLeft: (renderer: WorldRenderer, map: SimulatorMap) => void;
  rotateDirectionRight: (renderer: WorldRenderer, map: SimulatorMap) => void;
  changeRotationDirection: (renderer: WorldRenderer, map: SimulatorMap, dir: number) => void;
  //changeMovementDirection: (dir: number) => void;
  isStraightPath: (map: SimulatorMap, c1: number, r1: number, c2: number, r2: number, parent: Organism) => boolean;
  isPassableCell: (cell: SimulatorCell, parent: Organism) => boolean;
  isClear: (map: SimulatorMap, col: number, row: number, rotation: number) => boolean;
  harm: (renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) => void;
  die: (renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) => void;
  updateMap: (renderer: WorldRenderer, map: SimulatorMap) => void;
  update: (renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) => boolean;
  getRealCell: (
    map: SimulatorMap,
    local_cell: AnatomyCell,
    c: number,
    r: number,
    rotation: number
  ) => SimulatorCell | null;
  isNatural: () => boolean;
  serialize: () => any;
  loadRaw: (org: Organism) => void;
}

class Organism implements OrganismInterface {
  simulation: WorldSimulation;
  hyperparams: HyperparamsState;
  c: number;
  r: number;
  environment: Environment;
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

  constructor(
    centerCol: number,
    centerRow: number,
    environment: Environment,
    hyperparams: HyperparamsState,
    simulation: WorldSimulation,
    parent?: Organism,
  ) {
    //this.store = store.getState();
    this.simulation = simulation;
    this.hyperparams = hyperparams;
    this.c = centerCol;
    this.r = centerRow;
    this.environment = environment;
    this.lifetime = 0;
    this.food_collected = 0;
    this.living = true;
    this.anatomy = new Anatomy(this);
    //this.movement_direction = Directions.cardinals.s;
    this.rotation_direction = Directions.cardinals.n;

    this.can_rotate = (this.environment === 'world')
      ? this.hyperparams.rotationEnabled //this.store.worldManager.
      : false;
    this.move_count = 0;
    this.move_range = 4;
    this.ignore_brain_for = 0;
    this.mutability = 5;
    this.damage = 0;
    this.brain = null;
    this.species = null;

    if (typeof parent !== 'undefined') {
      this.inheritFromParent(parent);
    }
  }

  inheritFromParent(parent: Organism) {
    // Copy evolved properties
    this.move_range = parent.move_range;
    this.mutability = parent.mutability;
    this.species = parent.species;

    // Copy anatomy plan and cell without executing growth plan
    this.anatomy.plan = parent.anatomy.plan;
    for (var cell of parent.anatomy.cells) {
      this.anatomy.addInheritedCell(cell, false, this.hyperparams);
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
    const extraMoverFoodCost = this.hyperparams.extraMoverFoodCost;

    return this.anatomy.has_mover
      ? this.anatomy.cells.length +
          extraMoverFoodCost * this.anatomy.mover_count
      : this.anatomy.cells.length;
  }

  lifespan() {
    const lifespanMultiplier = this.hyperparams.lifespanMultiplier;

    return this.anatomy.cells.length * lifespanMultiplier;
  }

  maxHealth() {
    return this.anatomy.cells.length;
  }

  reproduce(renderer: WorldRenderer, map: SimulatorMap) {
    if (this.environment !== 'world') {
      return;
    }

    /*const {
      rotationEnabled,
      useGlobalMutability,
      globalMutability,
    } = this.hyperparams;

    //produce mutated child
    //check nearby locations (is there room and a direct path)
    var org: Organism = new Organism(0, 0, this.environment, this.hyperparams, this.simulation, this);

    if (rotationEnabled) {
      org.rotation_direction = Directions.getRandomDirection();
    }

    var prob = this.mutability;

    if (useGlobalMutability) {
      prob = globalMutability;
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
      //console.log('Organism, reproduce, calling mutateCells()...');
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
    // Ultimately, having it determine genome length would be amazing.
    // In the near term, it could be interesting to add a cell-count cost to the
    // actions such that more advanced ones require not just specialized cell types
    // but a "large" enough brain to coordinate them.

    // Another interesting opportunity is "talk" which could send the brain config
    // and stats that represent current performance. A cell that does "talk" to a
    // species member could transfer beneficial learning if the recipient accepts
    // the information. Received learning could dramatically improve the
    // efficiency of the evolution process.

    var direction = Directions.getRandomScalar();
    var direction_c = direction[0];
    var direction_r = direction[1];
    var offset = Math.floor(Math.random() * 3);
    var basemovement = this.anatomy.birth_distance;
    var new_c = this.c + direction_c * basemovement + direction_c * offset;
    var new_r = this.r + direction_r * basemovement + direction_r * offset;

    if (
      org.isClear(map, new_c, new_r, org.rotation_direction) &&
      org.isStraightPath(map, new_c, new_r, this.c, this.r, this)
    ) {
      org.c = new_c;
      org.r = new_r;

      this.simulation.addOrganism(org);

      org.updateMap(renderer, map);

      if (mutated && this.species !== null) {
        // TODO: Dispatch this
        //this.env.fossil_record.addSpecies(org, this.species);
      } else if (org.species !== null) {
        org.species.addPop();
      }
    }

    Math.max((this.food_collected -= this.foodNeeded()), 0);
    */
  }

  mutateCells() {
    const {
      addProb,
      changeProb,
      removeProb,
    } = this.hyperparams;

    let added = false;
    let changed = false;
    let removed = false;

    if (this.anatomy.cells.length === 0) {
      return false;
    }

    // add random cell?
    // @todo: a way to define max # of cell type; or make this a param?!
    if (this.calcRandomChance(addProb)) {
      let cellToBranch = this.anatomy.getRandomCell();

      if (cellToBranch !== null) {
        let randomState = CellStates.getRandomAnatomyCellState();
        let growth_direction = Neighbors.all[
          Math.floor(Math.random() * Neighbors.all.length)
        ];
        let x = cellToBranch.x + growth_direction[0];
        let y = cellToBranch.y + growth_direction[1];

        if (this.anatomy.canAddCellAt(x, y)) {
          added = true;
          this.anatomy.addRandomCell(x, y, randomState, false, this.hyperparams);
        }
      }
    }

    // replace cell with random cell?
    // @todo: a way to define max # of cell type; or make this a param?!
    if (this.calcRandomChance(changeProb)) {
      let cellToReplace = this.anatomy.getRandomCell();

      if (cellToReplace !== null) {
        let randomState = CellStates.getRandomAnatomyCellState();

        this.anatomy.replaceCell(cellToReplace.x, cellToReplace.y, randomState, false, true, this.hyperparams);
        changed = true;
      }
    }

    // remove? (if not last cell)
    // @todo: a way to define min # of cell type to keep; or make this a param?!
    if (this.anatomy.cells.length > 1 && this.calcRandomChance(removeProb)) {
      let cellToRemove = this.anatomy.getRandomCell();

      if (cellToRemove !== null) {
        removed = this.anatomy.removeCell(
          cellToRemove.x,
          cellToRemove.y,
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

  attemptMove(renderer: WorldRenderer, map: SimulatorMap) {
    if (this.environment === null || this.environment !== 'world') {
      return false;
    }

    var direction = Directions.scalars[this.rotation_direction]; //[this.movement_direction];
    var direction_c = direction[0];
    var direction_r = direction[1];
    var new_c = this.c + direction_c;
    var new_r = this.r + direction_r;

    if (this.isClear(map, new_c, new_r)) {
      // Erase old cell locations using empty state
      for (var cell of this.anatomy.cells) {
        var real_colrow = cell.getRotatedXY(this.rotation_direction);
        var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
        var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
        var changed = map.changeCellState(real_c, real_r, CellStates.empty);

        if (changed !== null) {
          renderer.addToRender(changed);
        }
      }

      this.c = new_c;
      this.r = new_r;
      this.updateMap(renderer, map);

      return true;
    }

    return false;
  }

  attemptRotate(renderer: WorldRenderer, map: SimulatorMap) {
    if (this.environment !== 'world') {
      return false;
    }

    if (!this.can_rotate) {
      this.rotation_direction = Directions.getRandomDirection(); //movement_direction = Directions.getRandomDirection();
      this.move_count = 0;

      return true;
    }

    var new_rotation = Directions.getRandomDirection();

    if (this.isClear(map, this.c, this.r, new_rotation)) {
      for (var cell of this.anatomy.cells) {
        var real_colrow = cell.getRotatedXY(this.rotation_direction);
        var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
        var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
        var changed = map.changeCellState(real_c, real_r, CellStates.empty);

        if (changed !== null) {
          renderer.addToRender(changed);
        }
      }

      this.rotation_direction = new_rotation;
      //this.movement_direction = Directions.getRandomDirection();
      this.updateMap(renderer, map);
      this.move_count = 0;

      return true;
    }

    return false;
  }

  rotateDirectionLeft(renderer: WorldRenderer, map: SimulatorMap) {
    this.changeRotationDirection(renderer, map, Directions.rotateLeft(this.rotation_direction));
  }

  rotateDirectionRight(renderer: WorldRenderer, map: SimulatorMap) {
    this.changeRotationDirection(renderer, map, Directions.rotateRight(this.rotation_direction));
  }

  changeRotationDirection(renderer: WorldRenderer, map: SimulatorMap, dir: number) {
    if (this.environment === 'editor') {
      //console.log('changeRotationDirection:', getKeyByValue(Directions.cardinals, dir));
      var cell_array = Array.from(Array(map.cols), () => new Array(map.rows));

      for (var cell_cols of cell_array) {
        cell_cols.fill(0);
      }

      //console.log(cell_array);
    }

    for (var cell of this.anatomy.cells) {
      var real_colrow = cell.getRotatedXY(this.rotation_direction);
      var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
      var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);

      if (this.environment === 'editor') {
        //console.log(cell);
        //(this.env as Editor).changeEditorCell(real_c, real_r, CellStates.empty, map, null);
      } else if (this.environment === 'world') {
        var changed = map.changeCellState(real_c, real_r, CellStates.empty);

        if (changed !== null) {
          renderer.addToRender(changed);
        }
      }
    }

    this.rotation_direction = dir;
    this.move_count = 0;
    this.updateMap(renderer, map);
  }

  /*changeMovementDirection(dir: number) {
    this.movement_direction = dir;
    this.move_count = 0;
  }*/

  // assumes either c1==c2 or r1==r2, returns true if there is a clear path from point 1 to 2
  isStraightPath(map: SimulatorMap, c1: number, r1: number, c2: number, r2: number, parent: Organism) {
    if (this.environment === null) {
      return false;
    }

    let i: number, temp: number;
    let cell: SimulatorCell | null;

    if (c1 === c2) {
      if (r1 > r2) {
        temp = r2;

        r2 = r1;
        r1 = temp;
      }

      for (i = r1; i !== r2; i++) {
        cell = map.cellAt(c1, i);

        if (cell === null || !this.isPassableCell(cell, parent)) {
          return false;
        }
      }

      return true;
    } else {
      if (c1 > c2) {
        temp = c2;

        c2 = c1;
        c1 = temp;
      }

      for (i = c1; i !== c2; i++) {
        cell = map.cellAt(i, r1);

        if (cell === null || !this.isPassableCell(cell, parent)) {
          return false;
        }
      }

      return true;
    }
  }

  isPassableCell(cell: SimulatorCell, parent: Organism) {
    return (
      cell !== null &&
      (cell.state === CellStates.empty ||
        cell.org === this ||
        cell.org === parent ||
        cell.state === CellStates.food)
    );
  }

  isClear(map: SimulatorMap, col: number, row: number, rotation: number = this.rotation_direction) {
    const foodBlocksReproduction = this.hyperparams.foodBlocksReproduction;

    for (var loccell of this.anatomy.cells) {
      var cell = this.getRealCell(map, loccell, col, row, rotation);

      if (cell === null) {
        return false;
      }

      if (
        cell.org === this ||
        cell.state === CellStates.empty ||
        (!foodBlocksReproduction && cell.state === CellStates.food)
      ) {
        continue;
      }

      return false;
    }

    return true;
  }

  harm(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    const instaKill = this.hyperparams.instaKill;

    this.damage++;

    if (this.damage >= this.maxHealth() || instaKill) {
      this.die(renderer, simulation, ticks);
    }
  }

  die(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    if (this.environment === null || this.environment === 'world' || simulation.map === null) {
      return;
    }

    for (var cell of this.anatomy.cells) {
      var real_colrow = cell.getRotatedXY(this.rotation_direction);
      var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
      var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);
      var changed = simulation.map.changeCellState(real_c, real_r, CellStates.food);

      if (changed !== null) {
        //map.changeCellOrganism(real_c, real_r, cell.org);
        renderer.addToRender(changed);
      }
    }

    if (simulation.fossilRecord !== null && this.species !== null) {
      simulation.fossilRecord.decreasePopulation(this.species, ticks);
    }

    this.living = false;
  }

  updateMap(renderer: WorldRenderer, map: SimulatorMap) {
    if (this.environment === null) {
      return;
    }

    for (var cell of this.anatomy.cells) {
      var real_colrow = cell.getRotatedXY(this.rotation_direction);
      var real_c = this.c + real_colrow[0]; //cell.rotatedCol(this.rotation_direction);
      var real_r = this.r + real_colrow[1]; //cell.rotatedRow(this.rotation_direction);

      if (this.environment === 'world') {
        const changed = map.changeCellState(real_c, real_r, cell.state);

        if (changed !== null) {
          map.changeCellOrganism(real_c, real_r, cell.org);

          renderer.addToRender(changed);
        }
      } else if (this.environment === 'editor') {
        //this.env.changeEditorCell(real_c, real_r, cell.state, this.env.map, cell);
      }
    }
  }

  update(renderer: WorldRenderer, simulation: WorldSimulation, ticks: number) {
    if (simulation.map === null || simulation.fossilRecord === null) {
      return false;
    }

    this.lifetime++;

    if (this.lifetime > this.lifespan()) {
      this.die(renderer, simulation, ticks);

      return this.living;
    }

    if (this.food_collected >= this.foodNeeded()) {
      this.reproduce(renderer, simulation.map);
    }

    for (var cell of this.anatomy.cells) {
      cell.performFunction(renderer, simulation, ticks);

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
        this.ignore_brain_for === 0 &&
        this.brain !== null
      ) {
        changed_dir = this.brain.decide(renderer, simulation.map);
      } else if (this.ignore_brain_for > 0) {
        this.ignore_brain_for--;
      }

      var moved = this.attemptMove(renderer, simulation.map);

      // really "move_range" is "move_range_before_maybe_rotate_maybe_changedir"
      if (
        (
          this.move_count > this.move_range + this.anatomy.mover_count &&
          !changed_dir
        ) ||
        !moved
      ) {
        var rotated = this.attemptRotate(renderer, simulation.map);

        if (!rotated) {
          this.changeRotationDirection(renderer, simulation.map, Directions.getRandomDirection());

          if (changed_dir) {
            this.ignore_brain_for =
              this.move_range + this.anatomy.mover_count + 1;
          }
        }
      }
    }

    return this.living;
  }

  getRealCell(
    map: SimulatorMap,
    local_cell: AnatomyCell,
    c: number = this.c,
    r: number = this.r,
    rotation: number = this.rotation_direction,
  ) {
    if (this.environment === null) {
      return null;
    }

    var real_colrow = local_cell.getRotatedXY(rotation);
    var real_c = c + real_colrow[0]; //local_cell.rotatedCol(rotation);
    var real_r = r + real_colrow[1]; //local_cell.rotatedRow(rotation);

    return map.cellAt(real_c, real_r);
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
          cell.x === toCompare.x &&
          cell.y === toCompare.y
        ) {
          return false;
        }
      }

      if (cell.x === 0 && cell.y === 0) {
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
    this.anatomy.loadRaw(org.anatomy, this.hyperparams);

    if (org.brain && org.brain !== null) {
      if (this.brain === null) {
        this.brain = new Brain(org);
      }

      this.brain.copy(org.brain);
    }
  }
}

export default Organism;
