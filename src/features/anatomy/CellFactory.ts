import Organism from '../organism/Organism';
import MouthCell from './cells/MouthCell';
import BrainCell from './cells/BrainCell';
import ProducerCell from './cells/ProducerCell';
import MoverCell from './cells/MoverCell';
import KillerCell from './cells/KillerCell';
import ArmorCell from './cells/ArmorCell';
import EyeCell from './cells/EyeCell';
/*import {
  MouthState,
  BrainState,
  ProducerState,
  MoverState,
  KillerState,
  ArmorState,
  EyeState,
} from './CellStates';*/
import { HyperparamsState } from '../environment/environmentManagerSlice';

interface CellClassesInterface {
  [key: string]:
    | typeof MouthCell
    | typeof BrainCell
    | typeof ProducerCell
    | typeof MoverCell
    | typeof KillerCell
    | typeof ArmorCell
    | typeof EyeCell;
}

abstract class CellFactory {
  private static CellClasses: CellClassesInterface = {
    'mouth': MouthCell,
    'brain': BrainCell,
    'producer': ProducerCell,
    'mover': MoverCell,
    'killer': KillerCell,
    'armor': ArmorCell,
    'eye': EyeCell,
  };

  public static createInherited(org: Organism, to_copy: AnyAnatomyCellClass, hyperparams: HyperparamsState) {
    var cellClass = CellFactory.CellClasses[to_copy.state.name];
    var cell = new cellClass(org, to_copy.loc_c, to_copy.loc_r, hyperparams);

    cell.initInherit(to_copy);

    return cell;
  }

  public static createRandom(
    org: Organism,
    state: AnyCellState,
    loc_col: number,
    loc_row: number,
    hyperparams: HyperparamsState,
  ) {
    var cellClass = CellFactory.CellClasses[state.name];
    var cell = new cellClass(org, loc_col, loc_row, hyperparams);

    cell.initRandom();

    return cell;
  }

  public static createDefault(
    org: Organism,
    state: AnyCellState,
    loc_col: number,
    loc_row: number,
    hyperparams: HyperparamsState,
  ) {
    var cellClass = CellFactory.CellClasses[state.name];
    var cell = new cellClass(org, loc_col, loc_row, hyperparams);

    cell.initDefault();

    return cell;
  }
}

export default CellFactory;
