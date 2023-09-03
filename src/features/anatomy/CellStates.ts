import SimulatorCellState from '../simulator/SimulatorCellState';

export class EmptyState extends SimulatorCellState {
  constructor() {
    super('empty');
  }
}

export class FoodState extends SimulatorCellState {
  constructor() {
    super('food');
  }
}

export class WallState extends SimulatorCellState {
  constructor() {
    super('wall');
  }
}

export class BrainState extends SimulatorCellState {
  constructor() {
    super('brain');
  }
}

export class MouthState extends SimulatorCellState {
  constructor() {
    super('mouth');
  }
}

export class ProducerState extends SimulatorCellState {
  constructor() {
    super('producer');
  }
}

export class MoverState extends SimulatorCellState {
  constructor() {
    super('mover');
  }
}

export class KillerState extends SimulatorCellState {
  constructor() {
    super('killer');
  }
}

export class ArmorState extends SimulatorCellState {
  constructor() {
    super('armor');
  }
}

export class EyeState extends SimulatorCellState {
  slit_color: string;
  constructor() {
    super('eye');
    this.slit_color = 'black';
  }
}

abstract class CellStates {
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

  public static all: Array<AnyCellState> = [
    CellStates.empty,
    CellStates.food,
    CellStates.wall,
    CellStates.mouth,
    CellStates.brain,
    CellStates.producer,
    CellStates.mover,
    CellStates.killer,
    CellStates.armor,
    CellStates.eye,
  ];

  public static anatomy: Array<AnatomyCellState> = [
    CellStates.mouth,
    CellStates.brain,
    CellStates.producer,
    CellStates.mover,
    CellStates.killer,
    CellStates.armor,
    CellStates.eye,
  ];

  public static getRandomName(): string {
    return CellStates.all[Math.floor(Math.random() * CellStates.all.length)].name;
  }

  public static getRandomAnatomyCellState(): AnatomyCellState {
    return CellStates.anatomy[Math.floor(Math.random() * CellStates.anatomy.length)];
  }

  public static getAll(): Array<AnyCellState> {
    return CellStates.all;
  }

  public static getAnatomyCellStates(): Array<AnatomyCellState> {
    return CellStates.anatomy;
  }
};

export default CellStates;
