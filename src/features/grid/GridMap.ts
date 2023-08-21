import GridCell from './GridCell';
import CellStates from '../anatomy/CellStates';
import Cell from '../anatomy/Cell';
import WorldRendering from '../environment/world/WorldRendering';

type SerializedCell = {
  c: number;
  r: number;
}

type SerializedGridMap = {
  cols: number;
  rows: number;
  food: Array<SerializedCell>;
  walls: Array<SerializedCell>;
};

interface GridMapInterface {
  rendering: WorldRendering;
  grid: Array<Array<GridCell>>;
  cols: number;
  rows: number;
  changeCell(c: number, r: number, state: AnyCellState, ownerCell: Cell | null): void
  resize: (cols: number, rows: number, cellSize: number) => void;
  fillGrid: (state: AnyCellState, ignore_walls: boolean) => void;
  cellAt: (col: number, row: number) => GridCell | null;
  setCellState: (col: number, row: number, state: AnyCellState) => void;
  setCellOwnerOrganism: (col: number, row: number, owner_cell: Cell) => void;
  isValidLoc: (col: number, row: number) => boolean;
  getCenter: () => Array<number>;
  xyToColRow: (x: number, y: number, cellSize: number) => Array<number>;
  serialize: () => SerializedGridMap;
  loadRaw: (grid: SerializedGridMap) => void;
}

class GridMap implements GridMapInterface {
  rendering: WorldRendering;
  grid: Array<Array<GridCell>>;
  cols: number;
  rows: number;

  constructor(rendering: WorldRendering, cols: number, rows: number, cellSize: number) {
    this.rendering = rendering;
    this.grid = [];
    this.cols = cols;
    this.rows = rows;
    this.resize(cols, rows, cellSize);
  }

  public changeCell(c: number, r: number, state: AnyCellState, ownerCell: Cell | null = null) {
    this.setCellState(c, r, state);
    const changedCell = this.cellAt(c, r);

    if (changedCell === null) {
      return;
    }

    this.rendering.addToRender(changedCell);

    if (ownerCell !== null) {
      this.setCellOwnerOrganism(c, r, ownerCell);
    }
  }

  setCellState(col: number, row: number, state: AnyCellState) {
    if (!this.isValidLoc(col, row)) {
      return;
    }

    this.grid[col][row].setState(state);
  }

  setCellOwnerOrganism(col: number, row: number, owner_cell: Cell) {
    if (!this.isValidLoc(col, row)) {
      return;
    }

    this.grid[col][row].owner_cell = owner_cell;

    if (owner_cell !== null) {
      this.grid[col][row].owner_org = owner_cell.org;
    } else {
      this.grid[col][row].owner_org = null;
    }
  }

  resize(cols: number, rows: number, cellSize: number) {
    this.grid = [];
    this.cols = cols;
    this.rows = rows;
    for (var c = 0; c < cols; c++) {
      var row = [];

      for (var r = 0; r < rows; r++) {
        var cell = new GridCell(
          CellStates.empty,
          c,
          r,
          c * cellSize,
          r * cellSize,
        );

        row.push(cell);
      }

      this.grid.push(row);
    }
  }

  fillGrid(state: AnyCellState, ignore_walls: boolean = false) {
    for (var col of this.grid) {
      for (var cell of col) {
        if (ignore_walls && cell.state === CellStates.wall) {
          continue;
        }

        cell.setState(state);
        cell.owner_org = null;
        cell.owner_cell = null;
      }
    }
  }

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
    let grid: SerializedGridMap = {
      cols: this.cols,
      rows: this.rows,
      food: [],
      walls: [],
    };

    for (let col of this.grid) {
      for (let cell of col) {
        if (
          cell.state === CellStates.wall ||
          cell.state === CellStates.food
        ) {
          // no need to store state
          let c: SerializedCell = {
            c: cell.col,
            r: cell.row,
          };

          if (cell.state === CellStates.food) {
            grid.food.push(c);
          } else {
            grid.walls.push(c);
          }
        }
      }
    }

    return grid;
  }

  loadRaw(grid: SerializedGridMap) {
    for (let f of grid.food) {
      this.setCellState(f.c, f.r, CellStates.food);
    }

    for (let w of grid.walls) {
      this.setCellState(w.c, w.r, CellStates.wall);
    }
  }
}

export default GridMap;
