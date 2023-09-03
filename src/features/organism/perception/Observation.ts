import SimulatorCell from '../../simulator/SimulatorCell';

class Observation {
  cell: SimulatorCell;
  distance: number;
  direction: number;

  constructor(cell: SimulatorCell, distance: number, direction: number) {
    this.cell = cell;
    this.distance = distance;
    this.direction = direction;
  }
}

export default Observation;
