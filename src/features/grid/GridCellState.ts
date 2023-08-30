import CellStates from '../anatomy/CellStates';
import GridCell from './GridCell';

interface GridCellStateInterface {
  name: string;
  color: null | string;
}

class GridCellState implements GridCellStateInterface {
  name: string;
  color: string;

  constructor(name: string) {
    this.name = name;
    this.color = 'transparent';
  }
}

export default GridCellState;
