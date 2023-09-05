import SimulatorCellState from './SimulatorCellState';

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

export class StingerState extends SimulatorCellState {
  constructor() {
    super('stinger');
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

abstract class SimulatorCellStates {
  public static empty: EmptyState = new EmptyState();
  public static food: FoodState = new FoodState();
  public static wall: WallState = new WallState();
  public static mouth: MouthState = new MouthState();
  public static brain: BrainState = new BrainState();
  public static producer: ProducerState = new ProducerState();
  public static mover: MoverState = new MoverState();
  public static stinger: StingerState = new StingerState();
  public static armor: ArmorState = new ArmorState();
  public static eye: EyeState = new EyeState();

  public static all: Array<SimulatorCellState> = [
    SimulatorCellStates.empty,
    SimulatorCellStates.food,
    SimulatorCellStates.wall,
    SimulatorCellStates.mouth,
    SimulatorCellStates.brain,
    SimulatorCellStates.producer,
    SimulatorCellStates.mover,
    SimulatorCellStates.stinger,
    SimulatorCellStates.armor,
    SimulatorCellStates.eye,
  ];

  public static anatomy: Array<AnatomyCellState> = [
    SimulatorCellStates.mouth,
    SimulatorCellStates.brain,
    SimulatorCellStates.producer,
    SimulatorCellStates.mover,
    SimulatorCellStates.stinger,
    SimulatorCellStates.armor,
    SimulatorCellStates.eye,
  ];

  public static anatomyExceptBrain: Array<AnatomyCellState> = [
    SimulatorCellStates.mouth,
    SimulatorCellStates.producer,
    SimulatorCellStates.mover,
    SimulatorCellStates.stinger,
    SimulatorCellStates.armor,
    SimulatorCellStates.eye,
  ];

  public static getRandomName(): string {
    return SimulatorCellStates.all[Math.floor(Math.random() * SimulatorCellStates.all.length)].name;
  }

  public static getRandomAnatomyCellState(): AnatomyCellState {
    return SimulatorCellStates.anatomyExceptBrain[
      Math.floor(Math.random() * SimulatorCellStates.anatomy.length)
    ];
  }

  public static getAllCellStates(): Array<SimulatorCellStates> {
    return SimulatorCellStates.all;
  }

  public static getAnatomyCellStates(): Array<AnatomyCellState> {
    return SimulatorCellStates.anatomy;
  }
};

export default SimulatorCellStates;
