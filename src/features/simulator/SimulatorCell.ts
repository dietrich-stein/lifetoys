//import AnatomyCell from '../anatomy/AnatomyCell';
//import Organism from '../organism/Organism';
//import Directions from '../organism/Directions';
//import { HyperparamsState } from '../world/WorldManagerSlice';
//import WorldRenderer from '../world/WorldRenderer';
//import WorldSimulation from '../world/WorldSimulation';
//import { store, RootState } from '../../app/store';

interface SimulatorCellInterface {
  //store: RootState;
  //hyperparams: HyperparamsState,
  state: WorldCellState;
  org: Organism | null;
  col: number;
  row: number;
  x: number;
  y: number;
  setState: (state: WorldCellState) => void;
}

// A cell exists in a grid map.
class SimulatorCell implements SimulatorCellInterface {
  state: WorldCellState;
  org: Organism | null; // needed for anatomy cells inspecting sim grid
  col: number;
  row: number;
  x: number;
  y: number;

  constructor(state: WorldCellState, col: number, row: number, x: number, y: number) {
    this.state = state;
    this.org = null;
    this.col = col;
    this.row = row;
    this.x = x;
    this.y = y;
  }

  setState(state: WorldCellState) {
    this.state = state;
  }
}

export default SimulatorCell;
