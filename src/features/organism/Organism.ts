import { store, RootState } from '../../app/store';
import SimulatorCellStates from '../simulator/SimulatorCellStates';
import SimulatorNeighbors from '../simulator/SimulatorNeighbors';
import Directions from './Directions';
import Anatomy from '../anatomy/Anatomy';
import Brain from './perception/BrainController';
import SerializeHelper from '../../utils/SerializeHelper';
import Species from '../stats/Species';
import BrainController from './perception/BrainController';
import AnatomyCell from '../anatomy/AnatomyCell';
import SimulatorCell from '../simulator/SimulatorCell';
import WorldSimulation from '../world/WorldSimulation';
import WorldRenderer from '../world/WorldRenderer';
import { HyperparamsState } from '../world/WorldManagerSlice';

type Environment = 'editor' | 'world';

interface OrganismInterface {
  simulation: WorldSimulation;
  //hyperparams: HyperparamsState;
  startCellCol: number; // these track our origin coordinates in the simulator
  startCellRow: number;
  environment: Environment | null;
  lifetime: number;
  food_collected: number;
  living: boolean;
  anatomy: Anatomy;
  anatomyDirection: number; // 0  2  4  6 // n s e w
  movementDirection: number; // 0...7 // n ne e se s sw w nw
  lookDirection: number; // 0...7 // n ne e se s sw w nw
  can_rotate: boolean;
  move_count: number;
  rotationCount: number;
  move_range: number;
  ignore_brain_for: number;
  mutability: number;
  damage: number;
  species: Species | null;
  brain: BrainController | null;
  inheritFromParent: (parent: Organism, hyperparams: HyperparamsState) => void;
  //getAbsoluteDirection: () => number;
  foodNeeded: () => number;
  lifespan: () => number;
  maxHealth: () => number;
  reproduce: (renderer: WorldRenderer) => void;
  mutateCells: () => boolean;
  calcRandomChance: (prob: number) => boolean;
  attemptMove: (renderer: WorldRenderer) => boolean;
  attemptRandomRotateAnatomy: (renderer: WorldRenderer) => boolean;
  rotateAnatomyLeft: (renderer: WorldRenderer) => void;
  rotateAnatomyRight: (renderer: WorldRenderer) => void;
  rotateMovementLeft: (renderer: WorldRenderer) => void;
  rotateMovementRight: (renderer: WorldRenderer) => void;
  rotateLookLeft: (renderer: WorldRenderer) => void;
  rotateLookRight: (renderer: WorldRenderer) => void;
  rotateAnatomyCells: (renderer: WorldRenderer, dir: number) => void;
  //changeMovementDirection: (dir: number) => void;
  isStraightPath: (c1: number, r1: number, c2: number, r2: number, parent: Organism) => boolean;
  isPassableCell: (cell: SimulatorCell, parent: Organism) => boolean;
  isSimulationCellClear: (col: number, row: number, rotation: number) => boolean;
  harm: (renderer: WorldRenderer, ticksElapsed: number) => void;
  die: (renderer: WorldRenderer, ticksElapsed: number) => void;
  updateSimulatorMap: (renderer: WorldRenderer) => void;
  handleSimulationUpdate: (renderer: WorldRenderer, ticksElapsed: number) => boolean;
  getRotatedSimulatorCell: (
    anatomyCell: AnatomyCell,
    col: number,
    row: number,
    rotation: number
  ) => SimulatorCell | null;
  isNatural: () => boolean;
  serialize: () => any;
  loadRaw: (org: Organism) => void;
}

class Organism implements OrganismInterface {
  simulation: WorldSimulation;
  //hyperparams: HyperparamsState;
  startCellCol: number;
  startCellRow: number;
  environment: Environment;
  lifetime: number;
  food_collected: number;
  living: boolean;
  anatomy: Anatomy;
  anatomyDirection: number;
  movementDirection: number;
  lookDirection: number;
  rotationCount: number;
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
    simulation: WorldSimulation,
    hyperparams: HyperparamsState,
    parent?: Organism,
  ) {
    this.simulation = simulation;
    this.startCellCol = centerCol;
    this.startCellRow = centerRow;
    this.environment = environment;
    this.lifetime = 0;
    this.food_collected = 0;
    this.living = true;
    this.anatomy = new Anatomy(this);
    this.anatomyDirection = Directions.cardinals.n;
    this.movementDirection = Directions.cardinals.s;
    this.lookDirection = Directions.cardinals.e;
    this.rotationCount = 0;
    this.can_rotate = (this.environment === 'world') ? hyperparams.rotationEnabled : false;
    this.move_count = 0;
    this.move_range = 4;
    this.ignore_brain_for = 0;
    this.mutability = 5;
    this.damage = 0;
    this.brain = null;
    this.species = null;

    if (typeof parent !== 'undefined') {
      this.inheritFromParent(parent, hyperparams);
    }
  }

  inheritFromParent(parent: Organism, hyperparams: HyperparamsState) {
    // Copy evolved properties
    this.move_range = parent.move_range;
    this.mutability = parent.mutability;
    this.species = parent.species;

    // Copy anatomy plan and cell without executing growth plan
    this.anatomy.plan = parent.anatomy.plan;
    for (var cell of parent.anatomy.cells) {
      this.anatomy.addInheritedCell(cell, false, hyperparams);
    }

    this.anatomy.updateStats();

    // previously needed "parent.anatomy.has_mover && parent.anatomy.has_eye"
    if (parent.brain !== null) {
      this.brain = new BrainController(this);
      this.brain.copy(parent.brain);
    }
  }

  /*getAbsoluteDirection() {
    var dir = this.anatomyDirection + this.movementDirection;
    if (dir > 7) {
      dir -= Directions.scalars.length;
    }
    return dir;
  }*/

  // amount of food required before it can reproduce
  foodNeeded() {
    const extraMoverFoodCost = store.getState().worldManager.hyperparams.extraMoverFoodCost;

    return this.anatomy.hasMover
      ? this.anatomy.cells.length + (extraMoverFoodCost * 1)// this.anatomy.mover_count
      : this.anatomy.cells.length;
  }

  lifespan() {
    const lifespanMultiplier = store.getState().worldManager.hyperparams.lifespanMultiplier;

    return this.anatomy.cells.length * lifespanMultiplier;
  }

  maxHealth() {
    return this.anatomy.cells.length;
  }

  reproduce(renderer: WorldRenderer) {
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
      org.anatomyDirection = Directions.getRandomDirection();
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
    var new_c = this.startCellCol + direction_c * basemovement + direction_c * offset;
    var new_r = this.startCellRow + direction_r * basemovement + direction_r * offset;

    if (
      org.isSimulationCellClear(new_c, new_r, org.anatomyDirection) &&
      org.isStraightPath(new_c, new_r, this.startCellCol, this.startCellRow, this)
    ) {
      org.startCellCol = new_c;
      org.startCellRow = new_r;

      this.simulation.addOrganism(org);

      org.updateSimulatorMap(renderer);

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
    } = store.getState().worldManager.hyperparams;

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
        let randomState = SimulatorCellStates.getRandomAnatomyCellState();
        let growth_direction = SimulatorNeighbors.all[
          Math.floor(Math.random() * SimulatorNeighbors.all.length)
        ];
        let x = cellToBranch.x + growth_direction[0];
        let y = cellToBranch.y + growth_direction[1];

        if (this.anatomy.canAddCellAt(x, y)) {
          added = true;
          this.anatomy.addRandomCell(x, y, randomState, false, store.getState().worldManager.hyperparams);
        }
      }
    }

    // replace cell with random cell?
    // @todo: a way to define max # of cell type; or make this a param?!
    if (this.calcRandomChance(changeProb)) {
      let cellToReplace = this.anatomy.getRandomCell();

      if (cellToReplace !== null) {
        let randomState = SimulatorCellStates.getRandomAnatomyCellState();

        this.anatomy.replaceCell(
          cellToReplace.x,
          cellToReplace.y,
          randomState,
          false,
          true,
          store.getState().worldManager.hyperparams,
        );
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

  attemptMove(renderer: WorldRenderer) {
    /*if (this.environment === null || this.environment !== 'world' || this.simulation.map === null) {
      return false;
    }

    var direction = Directions.scalars[this.anatomyDirection]; //[this.movementDirection];
    var direction_c = direction[0];
    var direction_r = direction[1];
    var new_c = this.startCellCol + direction_c;
    var new_r = this.startCellRow + direction_r;

    if (this.isSimulationCellClear(new_c, new_r, this.anatomyDirection)) {
      // Erase old cell locations using empty state
      for (var cell of this.anatomy.cells) {
        var rotatedXY = cell.getRotatedAnatomyXY(this.anatomyDirection);
        var rotatedCol = this.startCellCol + rotatedXY[0];
        var rotatedRow = this.startCellRow + rotatedXY[1];
        var changed = this.simulation.map.changeCellStateAt(rotatedCol, rotatedRow, SimulatorCellStates.empty);

        if (changed !== null) {
          renderer.addToRender(changed);
        }
      }

      this.startCellCol = new_c;
      this.startCellRow = new_r;
      this.updateSimulatorMap(renderer);

      return true;
    }*/

    return false;
  }

  attemptRandomRotateAnatomy(renderer: WorldRenderer) {
    if (this.environment === null || this.environment !== 'world' || this.simulation.map === null) {
      return false;
    }

    debugger;
    /*if (!this.can_rotate) {
      //this.anatomyDirection = Directions.getRandomDirection(true);
      //this.movementDirection = Directions.getRandomDirection();
      this.move_count = 0;
      return true;
    }*/

    var randomRotation = Directions.getRandomDirection(true);

    if (this.isSimulationCellClear(this.startCellCol, this.startCellRow, randomRotation)) {
      for (var cell of this.anatomy.cells) {
        var rotatedXY = cell.getRotatedAnatomyXY(this.anatomyDirection);
        var rotatedCol = this.startCellCol + rotatedXY[0];
        var rotatedRow = this.startCellRow + rotatedXY[1];
        var changedCell = this.simulation.map.changeCellStateAt(rotatedCol, rotatedRow, SimulatorCellStates.empty);

        if (changedCell !== null) {
          renderer.addToRender(changedCell);
        }
      }

      this.anatomyDirection = randomRotation;
      this.updateSimulatorMap(renderer);
      this.move_count = 0;

      return true;
    }

    return false;
  }

  rotateAnatomyLeft(renderer: WorldRenderer) {
    this.rotateAnatomyCells(renderer, Directions.rotateLeft(this.anatomyDirection, true));
  }

  rotateAnatomyRight(renderer: WorldRenderer) {
    this.rotateAnatomyCells(renderer, Directions.rotateRight(this.anatomyDirection, true));
  }

  rotateMovementLeft(renderer: WorldRenderer) {
    this.move_count = 0;
    this.movementDirection = Directions.rotateLeft(this.movementDirection, false);

    // This will pick up the new direction to render things correctly
    this.updateSimulatorMap(renderer);
  }

  rotateMovementRight(renderer: WorldRenderer) {
    this.move_count = 0;
    this.movementDirection = Directions.rotateRight(this.movementDirection, false);

    // This will pick up the new direction to render things correctly
    this.updateSimulatorMap(renderer);
  }

  rotateLookLeft(renderer: WorldRenderer) {
    this.lookDirection = Directions.rotateLeft(this.lookDirection, false);

    // This will pick up the new direction to render things correctly
    this.updateSimulatorMap(renderer);
  }

  rotateLookRight(renderer: WorldRenderer) {
    this.lookDirection = Directions.rotateRight(this.lookDirection, false);

    // This will pick up the new direction to render things correctly
    this.updateSimulatorMap(renderer);
  }

  /*
  Currently, this is now capable of rotating organisms.
  However, it is dependent on the characteristic of organisms having a central cell.
  This enables us to simply flip the coordinates during rendering.
  With no central cell we would need a different scheme.

  CENTRAL ROTATE RIGHT ---------------------------------------------------------

  Akin to mirror-flipping visually, except, it really does move the cells now.
  Anatomical configuration is effectively undisturbed.

    N           W
  W-|-E  >>>  S-|-N
    S           E

  NON-CENTRAL ROTATE RIGHT -----------------------------------------------------

  More granularity, but seems potentially disruptive to potential anatomical relationships.

  -----------------         -----------------
  | 0 | 1 | 2 | 3 |         | B | 0 | 1 | 2 |
  -----------------         -----------------
  | B | 0 | 1 | 4 |         | A | 3 | 0 | 3 |
  -----------------   >>>   -----------------
  | A | 3 | 2 | 5 |         | 9 | 2 | 1 | 4 |
  -----------------         -----------------
  | 9 | 8 | 7 | 6 |         | 8 | 7 | 6 | 5 |
  -----------------         -----------------

  */
  rotateAnatomyCells(renderer: WorldRenderer, direction: number) {
    if (this.environment === null || this.simulation === null || this.simulation.map === null) {
      return false;
    }

    this.move_count = 0;

    /*if (this.environment === 'editor') {
      //console.log('rotateAnatomyCells:', getKeyByValue(Directions.cardinals, dir));
      const cols = this.simulation.map.cols;
      const rows = this.simulation.map.rows;

      var cells = Array.from(Array(cols), () => new Array(rows));

      for (var cell_cols of cells) {
        cell_cols.fill(0);
      }
      //console.log(cell_array);
    }*/

    // Before changing to the new anatomy direction we go through the existing ones and empty the simulator cells
    let oldRotatedXY;
    let oldRotatedCol;
    let oldRotatedRow;
    let newRotatedXY;
    let newRotatedCol;
    let newRotatedRow;
    let emptiedCell;

    for (var cell of this.anatomy.cells) {
      oldRotatedXY = cell.getRotatedAnatomyXY(this.anatomyDirection);
      oldRotatedCol = this.startCellCol + oldRotatedXY[0];
      oldRotatedRow = this.startCellRow + oldRotatedXY[1];

      newRotatedXY = cell.getRotatedAnatomyXY(direction);
      newRotatedCol = this.startCellCol + newRotatedXY[0];
      newRotatedRow = this.startCellRow + newRotatedXY[1];

      if (
        oldRotatedCol !== newRotatedCol ||
        oldRotatedRow !== newRotatedRow
      ) {
        emptiedCell = this.simulation.map.changeCellStateAt(oldRotatedCol, oldRotatedRow, SimulatorCellStates.empty);

        if (emptiedCell !== null) {
          this.simulation.map.changeCellOrganismAt(oldRotatedCol, oldRotatedRow, null);
          renderer.addToRender(emptiedCell);
        }
      }
    }

    this.anatomyDirection = direction;

    // This will pick up the new direction to render things correctly
    this.updateSimulatorMap(renderer);
  }

  /*changeMovementDirection(dir: number) {
    this.movementDirection = dir;
    this.move_count = 0;
  }*/

  // assumes either c1==c2 or r1==r2, returns true if there is a clear path from point 1 to 2
  isStraightPath(c1: number, r1: number, c2: number, r2: number, parent: Organism) {
    if (this.environment === null || this.simulation === null || this.simulation.map === null) {
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
        cell = this.simulation.map.cellAt(c1, i);

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
        cell = this.simulation.map.cellAt(i, r1);

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
      (cell.state === SimulatorCellStates.empty ||
        cell.org === this ||
        cell.org === parent ||
        cell.state === SimulatorCellStates.food)
    );
  }

  isSimulationCellClear(col: number, row: number, direction: number) {
    if (this.environment === null || this.simulation === null || this.simulation.map === null) {
      return false;
    }

    const foodBlocksReproduction = store.getState().worldManager.hyperparams.foodBlocksReproduction;

    // Check all anatomy cells
    for (var loccell of this.anatomy.cells) {

      var cell = this.getRotatedSimulatorCell(loccell, col, row, direction);

      if (cell === null) {
        return false;
      }

      if (
        // Same organism
        cell.org === this ||
        // Empty
        cell.state === SimulatorCellStates.empty ||
        // Elligible food
        (
          !foodBlocksReproduction &&
          cell.state === SimulatorCellStates.food
        )
      ) {
        continue;
      }

      return false;
    }

    return true;
  }

  harm(renderer: WorldRenderer, ticksElapsed: number) {
    this.damage++;

    if (this.damage >= this.maxHealth() || store.getState().worldManager.hyperparams.isHarmDeadly) {
      this.die(renderer, ticksElapsed);
    }
  }

  die(renderer: WorldRenderer, ticksElapsed: number) {
    if (
      this.environment === null ||
      this.simulation === null ||
      this.simulation.map === null
    ) {
      return;
    }

    for (var cell of this.anatomy.cells) {
      var rotatedXY = cell.getRotatedAnatomyXY(this.anatomyDirection);
      var rotatedCol = this.startCellCol + rotatedXY[0];
      var rotatedRow = this.startCellRow + rotatedXY[1];
      var changed = this.simulation.map.changeCellStateAt(rotatedCol, rotatedRow, SimulatorCellStates.food);

      if (changed !== null) {
        this.simulation.map.changeCellOrganismAt(rotatedCol, rotatedRow, null/*cell.org*/);
        renderer.addToRender(changed);
      }
    }

    if (this.simulation.fossilRecord !== null && this.species !== null) {
      this.simulation.fossilRecord.decreasePopulation(this.species, ticksElapsed);
    }

    this.living = false;
  }

  updateSimulatorMap(renderer: WorldRenderer) {
    if (this.environment === null || this.simulation === null || this.simulation.map === null) {
      return;
    }

    let rotatedXY;
    let rotatedCol;
    let rotatedRow;
    let changedCell;

    for (var cell of this.anatomy.cells) {
      rotatedXY = cell.getRotatedAnatomyXY(this.anatomyDirection);
      rotatedCol = this.startCellCol + rotatedXY[0];
      rotatedRow = this.startCellRow + rotatedXY[1];
      changedCell = this.simulation.map.changeCellStateAt(rotatedCol, rotatedRow, cell.state, cell.id);

      if (changedCell !== null) {
        this.simulation.map.changeCellOrganismAt(rotatedCol, rotatedRow, cell.org);
        renderer.addToRender(changedCell);
      }
    }
  }

  handleSimulationUpdate(renderer: WorldRenderer, ticksElapsed: number) {
    if (this.simulation.map === null || this.simulation.fossilRecord === null) {
      return false;
    }

    // Increment age of the organism
    this.lifetime++;

    // Die and return early if too old
    if (this.lifetime > this.lifespan()) {
      this.die(renderer, ticksElapsed);

      return this.living;
    }

    // Reproduce if enough food is collected
    if (this.food_collected >= this.foodNeeded()) {
      this.reproduce(renderer);
    }

    // Perform all cell functions and return early if dead
    for (var cell of this.anatomy.cells) {
      cell.performFunction(renderer, this.simulation, ticksElapsed);

      if (!this.living) {
        return this.living;
      }
    }

    // Random Rotation
    /*if (this.rotationCount === 0) {
      debugger;
      var isRotated = this.attemptRandomRotateAnatomy(renderer);

      if (isRotated) {
        this.rotationCount++;
      }
    }*/

    // Movement
    /*if (this.anatomy.has_mover) {
      this.move_count++;
      var changed_dir = false;

      // @todo: need a way to ignore other decisions besides movement ones
      if (
        this.anatomy.has_brain &&
        this.ignore_brain_for === 0 &&
        this.brain !== null
      ) {
        changed_dir = this.brain.decide(renderer);
      } else if (this.ignore_brain_for > 0) {
        this.ignore_brain_for--;
      }

      var moved = false;//this.attemptMove(renderer);
      // really "move_range" is "move_range_before_maybe_rotate_maybe_changedir"

      // If it
      if (
        (
          this.move_count > (this.move_range + this.anatomy.mover_count) &&
          !changed_dir
        ) ||
        !moved
      ) {
        var rotated = this.attemptRandomRotateAnatomy(renderer);

        if (!rotated) {
          this.rotateAnatomyCells(renderer, Directions.getRandomDirection());

          if (changed_dir) {
            this.ignore_brain_for =
              this.move_range + this.anatomy.mover_count + 1;
          }
        }
      }
    }*/

    return this.living;
  }

  getRotatedSimulatorCell(
    anatomyCell: AnatomyCell, // needed to know rotated XY
    col: number = this.startCellCol,
    row: number = this.startCellRow,
    direction: number,
  ) {
    if (this.environment === null || this.simulation === null || this.simulation.map === null) {
      return null;
    }

    var rotatedXY = anatomyCell.getRotatedAnatomyXY(direction);
    var rotatedCol = col + rotatedXY[0];
    var rotatedRow = row + rotatedXY[1];

    return this.simulation.map.cellAt(rotatedCol, rotatedRow);
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
    this.anatomy.loadRaw(org.anatomy, store.getState().worldManager.hyperparams);

    if (org.brain && org.brain !== null) {
      if (this.brain === null) {
        this.brain = new Brain(org);
      }

      this.brain.copy(org.brain);
    }
  }
}

export default Organism;
