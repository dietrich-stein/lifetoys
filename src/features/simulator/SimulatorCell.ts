interface SimulatorCellInterface {
  state: WorldCellState;
  org: Organism | null;
  col: number;
  row: number;
}

// A cell exists in a grid map.
class SimulatorCell implements SimulatorCellInterface {
  state: WorldCellState;
  org: Organism | null; // needed for anatomy cells inspecting sim grid
  col: number;
  row: number;

  constructor(state: WorldCellState, col: number, row: number) {
    this.state = state;
    this.org = null;
    this.col = col;
    this.row = row;
  }
}

export default SimulatorCell;
