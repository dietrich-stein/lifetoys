import WorldCellState from './SimulatorCellState';

export class EmptyState extends WorldCellState {
  constructor() {
    super('empty');
  }
}

export class FoodState extends WorldCellState {
  constructor() {
    super('food');
  }
}

export class WallState extends WorldCellState {
  constructor() {
    super('wall');
  }
}

export class BrainState extends WorldCellState {
  constructor() {
    super('brain');
  }
}

export class MouthState extends WorldCellState {
  constructor() {
    super('mouth');
  }
}

export class ProducerState extends WorldCellState {
  constructor() {
    super('producer');
  }
}

export class MoverState extends WorldCellState {
  constructor() {
    super('mover');
  }
}

export class KillerState extends WorldCellState {
  constructor() {
    super('killer');
  }
}

export class ArmorState extends WorldCellState {
  constructor() {
    super('armor');
  }
}

export class EyeState extends WorldCellState {
  slit_color: string;
  constructor() {
    super('eye');
    this.slit_color = 'black';
  }
}

abstract class SimulatorCellStates {
  public static empty: EmptyState = new EmptyState();
  public static food: FoodState = new FoodState();
  public static wall: WallState = new WallState();
  public static mouth: MouthState = new MouthState();
  public static brain: BrainState = new BrainState();
  public static producer: ProducerState = new ProducerState();
  public static mover: MoverState = new MoverState();
  public static killer: KillerState = new KillerState();
  public static armor: ArmorState = new ArmorState();
  public static eye: EyeState = new EyeState();

  public static all: Array<WorldCellState> = [
    SimulatorCellStates.empty,
    SimulatorCellStates.food,
    SimulatorCellStates.wall,
    SimulatorCellStates.mouth,
    SimulatorCellStates.brain,
    SimulatorCellStates.producer,
    SimulatorCellStates.mover,
    SimulatorCellStates.killer,
    SimulatorCellStates.armor,
    SimulatorCellStates.eye,
  ];

  public static anatomy: Array<AnatomyCellState> = [
    SimulatorCellStates.mouth,
    SimulatorCellStates.brain,
    SimulatorCellStates.producer,
    SimulatorCellStates.mover,
    SimulatorCellStates.killer,
    SimulatorCellStates.armor,
    SimulatorCellStates.eye,
  ];

  public static getRandomName(): string {
    return SimulatorCellStates.all[Math.floor(Math.random() * SimulatorCellStates.all.length)].name;
  }

  public static getRandomAnatomyCellState(): AnatomyCellState {
    return SimulatorCellStates.anatomy[Math.floor(Math.random() * SimulatorCellStates.anatomy.length)];
  }

  public static getAllCellStates(): Array<SimulatorCellStates> {
    return SimulatorCellStates.all;
  }

  public static getAnatomyCellStates(): Array<AnatomyCellState> {
    return SimulatorCellStates.anatomy;
  }
};

export default SimulatorCellStates;
