import Organism from '../organism/Organism';
import MouthCell from './cells/MouthCell';
import BrainCell from './cells/BrainCell';
import ProducerCell from './cells/ProducerCell';
import MoverCell from './cells/MoverCell';
import KillerCell from './cells/KillerCell';
import ArmorCell from './cells/ArmorCell';
import EyeCell from './cells/EyeCell';
import { HyperparamsState } from '../world/WorldManagerSlice';

interface AnatomyCellClassesInterface {
  [key: string]:
    | typeof MouthCell
    | typeof BrainCell
    | typeof ProducerCell
    | typeof MoverCell
    | typeof KillerCell
    | typeof ArmorCell
    | typeof EyeCell;
}

abstract class AnatomyCellFactory {
  private static CellClasses: AnatomyCellClassesInterface = {
    'mouth': MouthCell,
    'brain': BrainCell,
    'producer': ProducerCell,
    'mover': MoverCell,
    'killer': KillerCell,
    'armor': ArmorCell,
    'eye': EyeCell,
  };

  public static createInherited(org: Organism, parentCell: AnatomyCellClass, hyperparams: HyperparamsState) {
    const cellClass = AnatomyCellFactory.CellClasses[parentCell.state.name];
    const newCell = new cellClass(parentCell.x, parentCell.y, org, hyperparams);

    newCell.initInherited(parentCell);

    return newCell;
  }

  public static createRandom(
    x: number,
    y: number,
    org: Organism,
    state: AnatomyCellState,
    hyperparams: HyperparamsState,
  ) {
    var cellClass = AnatomyCellFactory.CellClasses[state.name];
    var cell = new cellClass(x, y, org, hyperparams);

    cell.initRandom();

    return cell;
  }

  public static createDefault(
    x: number,
    y: number,
    org: Organism,
    state: AnatomyCellState,
    hyperparams: HyperparamsState,
  ) {
    var cellClass = AnatomyCellFactory.CellClasses[state.name];
    var cell = new cellClass(x, y, org, hyperparams);

    cell.initDefault();

    return cell;
  }
}

export default AnatomyCellFactory;
