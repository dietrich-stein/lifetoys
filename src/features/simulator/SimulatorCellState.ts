
interface SimulatorCellStateInterface {
  name: string;
  color: null | string;
}

class SimulatorCellState implements SimulatorCellStateInterface {
  name: string;
  color: string;

  constructor(name: string) {
    this.name = name;
    this.color = 'transparent';
  }
}

export default SimulatorCellState;
