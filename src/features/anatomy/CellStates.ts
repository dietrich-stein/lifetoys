import GridCellState from '../grid/GridCellState';

export class EmptyState extends GridCellState {
  constructor() {
    super('empty');
  }
}

export class FoodState extends GridCellState {
  constructor() {
    super('food');
  }
}

export class WallState extends GridCellState {
  constructor() {
    super('wall');
  }
}

export class BrainState extends GridCellState {
  constructor() {
    super('brain');
  }
}

export class MouthState extends GridCellState {
  constructor() {
    super('mouth');
  }
}

export class ProducerState extends GridCellState {
  constructor() {
    super('producer');
  }
}

export class MoverState extends GridCellState {
  constructor() {
    super('mover');
  }
}

export class KillerState extends GridCellState {
  constructor() {
    super('killer');
  }
}

export class ArmorState extends GridCellState {
  constructor() {
    super('armor');
  }
}

export class EyeState extends GridCellState {
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

  public static all: Array<AllCellStatesType> = [
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

  public static living: Array<LivingCellStatesType> = [
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

  public static getRandomLivingType(): LivingCellStatesType {
    return CellStates.living[Math.floor(Math.random() * CellStates.living.length)];
  }

  public static getAll(): Array<AllCellStatesType> {
    return CellStates.all;
  }

  public static getLiving(): Array<LivingCellStatesType> {
    return CellStates.living;
  }
};

export default CellStates;
