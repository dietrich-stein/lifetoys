import { cp } from 'fs';
import SimulatorCell from './SimulatorCell';
import SimulatorCellState from './SimulatorCellState';
import SimulatorCellStates from './SimulatorCellStates';

type SerializedSimulatorCell = {
  c: number;
  r: number;
}

type SerializedSimulatorMap = {
  cols: number;
  rows: number;
  food: Array<SerializedSimulatorCell>;
  walls: Array<SerializedSimulatorCell>;
};

interface SimulatorMapInterface {
  grid: Array<Array<SimulatorCell>>;
  cols: number;
  rows: number;
  changeCellState(c: number, r: number, state: SimulatorCellState): void;
  changeCellOrganism: (col: number, row: number, organism: Organism) => void;
  resizeGrid: (cols: number, rows: number, cellSize: number) => void;
  //fillGrid: (state: SimulatorCellState, ignore_walls: boolean) => void;
  cellAt: (col: number, row: number) => SimulatorCell | null;
  setCellState: (col: number, row: number, state: SimulatorCellState) => void;
  isValidLoc: (col: number, row: number) => boolean;
  getCenter: () => Array<number>;
  xyToColRow: (x: number, y: number, cellSize: number) => Array<number>;
  serialize: () => SerializedSimulatorMap;
  loadRaw: (grid: SerializedSimulatorMap) => void;
}

class SimulatorMap implements SimulatorMapInterface {
  grid: Array<Array<SimulatorCell>>;
  cols: number;
  rows: number;

  constructor(cols: number, rows: number, cellSize: number) {
    //console.log('SimulatorMap, constructor(), cols', cols, 'rows', rows, 'cellSize', cellSize);
    this.grid = [];
    this.cols = cols;
    this.rows = rows;

    for (var currentCol = 0; currentCol < this.cols; currentCol++) {
      var newRow = [];

      for (var currentRow = 0; currentRow < rows; currentRow++) {
        var newCell = new SimulatorCell(
          SimulatorCellStates.empty,
          currentCol,
          currentRow,
          `c${currentCol}-r${currentRow}`,
        );

        newRow.push(newCell);
      }

      this.grid.push(newRow);
    }
  }

  public changeCellState(c: number, r: number, state: SimulatorCellState) {
    this.setCellState(c, r, state);

    return this.cellAt(c, r);
  }

  setCellState(col: number, row: number, state: SimulatorCellState) {
    if (!this.isValidLoc(col, row)) {
      return;
    }

    this.grid[col][row].state = state;
  }

  changeCellOrganism(col: number, row: number, ownerOrganism: Organism) {
    if (!this.isValidLoc(col, row)) {
      return;
    }

    this.grid[col][row].org = (ownerOrganism !== null) ? ownerOrganism : null;
  }

  resizeGrid(cols: number, rows: number, cellSize: number) {
    console.log('SimulatorMap, resizeGrid(), cols', cols, 'rows', rows, 'cellSize', cellSize);
    /*
    this.grid = [];
    this.cols = cols;
    this.rows = rows;
    for (var c = 0; c < cols; c++) {
      var row = [];

      for (var r = 0; r < rows; r++) {
        var cell = new SimulatorCell(
          SimulatorCellStates.empty,
          c,
          r,
          c * cellSize,
          r * cellSize,
        );

        row.push(cell);
      }

      this.grid.push(row);
    }
    */
  }

  /*fillGrid(state: SimulatorCellState, ignore_walls: boolean = false) {
    for (var col of this.grid) {
      for (var cell of col) {
        if (ignore_walls && cell.state === SimulatorCellStates.wall) {
          continue;
        }

        cell.state = state;
        cell.org = null;
        //cell.owner_cell = null;
      }
    }
  }*/

  cellAt(col: number, row: number) {
    if (!this.isValidLoc(col, row)) {
      return null;
    }

    return this.grid[col][row];
  }

  isValidLoc(col: number, row: number) {
    return col < this.cols && row < this.rows && col >= 0 && row >= 0;
  }

  getCenter() {
    return [Math.floor(this.cols / 2), Math.floor(this.rows / 2)];
  }

  xyToColRow(x: number, y: number, cellSize: number) {
    var c = Math.floor(x / cellSize);
    var r = Math.floor(y / cellSize);

    if (c >= this.cols) {
      c = this.cols - 1;
    } else if (c < 0) {
      c = 0;
    }

    if (r >= this.rows) {
      r = this.rows - 1;
    } else if (r < 0) {
      r = 0;
    }

    return [c, r];
  }

  serialize() {
    // Rather than store every single cell, we will store non organism cells (food+walls)
    // and assume everything else is empty. Organism cells will be set when the organism
    // list is loaded. This reduces filesize and complexity.
    let grid: SerializedSimulatorMap = {
      cols: this.cols,
      rows: this.rows,
      food: [],
      walls: [],
    };

    for (let col of this.grid) {
      for (let cell of col) {
        if (
          cell.state === SimulatorCellStates.wall ||
          cell.state === SimulatorCellStates.food
        ) {
          // no need to store state
          let c: SerializedSimulatorCell = {
            c: cell.col,
            r: cell.row,
          };

          if (cell.state === SimulatorCellStates.food) {
            grid.food.push(c);
          } else {
            grid.walls.push(c);
          }
        }
      }
    }

    return grid;
  }

  loadRaw(grid: SerializedSimulatorMap) {
    for (let f of grid.food) {
      this.setCellState(f.c, f.r, SimulatorCellStates.food);
    }

    for (let w of grid.walls) {
      this.setCellState(w.c, w.r, SimulatorCellStates.wall);
    }
  }
}

export default SimulatorMap;
