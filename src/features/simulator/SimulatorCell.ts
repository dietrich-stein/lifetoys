import Cell from '../anatomy/Cell';
import Organism from '../organism/Organism';

interface SimulatorCellInterface {
  state: AnyCellState;
  owner_org: Organism | null;
  owner_cell: Cell | null;
  col: number;
  row: number;
  x: number;
  y: number;
  setState: (state: AnyCellState) => void;
}

// A cell exists in a grid map.
class SimulatorCell implements SimulatorCellInterface {
  state: AnyCellState;
  owner_org: Organism | null;
  owner_cell: Cell | null;
  col: number;
  row: number;
  x: number;
  y: number;

  constructor(state: AnyCellState, col: number, row: number, x: number, y: number) {
    this.state = state;
    this.owner_org = null;
    this.owner_cell = null;
    this.col = col;
    this.row = row;
    this.x = x;
    this.y = y;
  }

  setState(state: AnyCellState) {
    this.state = state;
  }
}

export default SimulatorCell;
