import { store, RootState } from '../../../app/store';
import CellStates from '../../anatomy/CellStates';
import GridMap from '../../grid/GridMap';
//import { useAppDispatch } from '../../../app/hooks';
import {
  EnvironmentManagerState,
  setWorldRenderingStats,
} from '../environmentManagerSlice';

interface WorldRenderingInterface {
  // Control
  running: boolean;
  animateId: number | null;
  timeStartedElapsed: number;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  // Settings
  storeState: RootState | null;
  canvasContainer: HTMLDivElement | null;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | undefined;
  canvasWidth: number;
  canvasHeight: number;
  numCols: number;
  numRows: number;
  cellSize: number;
  // Cells
  cells_to_render: Set<GridCell> | null;
  cells_to_highlight: Set<GridCell> | null;
  highlighted_cells: Set<GridCell> | null;
  // Control
  init: (storeState: RootState, canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement, cellSize: number) => void;
  start: (state: EnvironmentManagerState) => void;
  stop: () => void;
  reset: () => void;
  fillWindow: () => void;
  fillShape: (height: number, width: number) => void;
  clear: () => void;
  // Cells
  addToRender: (cell: GridCell) => void;
  renderCell: (cell: GridCell) => void;
  renderCells: () => void;
  renderFullGrid: (grid: GridCell[][]) => void;
  //renderCellHighlight: (cell: GridCell, color: string) => void;
  //renderHighlights: () => void;
  //highlightCell: (cell: GridCell) => void;
  //highlightOrganism: (org: Organism) => void;
  //clearAllHighlights: (clear_to_highlight: boolean) => void; // = false
}

class WorldRendering implements WorldRenderingInterface {
  // Control
  running: boolean;
  animateId: number | null;
  timeStartedElapsed: number;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  // Settings
  storeState: RootState | null;
  canvasContainer: HTMLDivElement | null;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | undefined;
  canvasWidth: number;
  canvasHeight: number;
  numCols: number;
  numRows: number;
  cellSize: number;
  // Cells
  cells_to_render: Set<GridCell>; // cellsRenderable
  cells_to_highlight: Set<GridCell>; // cellsHighlightable
  highlighted_cells: Set<GridCell>; // cellsHighlighted

  private static instance: WorldRendering;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    // Control
    this.running = false;
    this.animateId = null;
    this.timeStartedElapsed = 0;
    this.timeStartedLast = 0;
    this.timeStoppedElapsed = 0;
    this.timeStoppedLast = 0;
    // Settings
    this.storeState = null;
    this.canvasContainer = null;
    this.canvas = null;
    this.ctx = undefined;
    this.canvasHeight = 0;
    this.canvasWidth = 0;
    this.numCols = 0;
    this.numRows = 0;
    this.cellSize = 0; // worldEnvironment.config.cell_size
    // Cells
    this.cells_to_render = new Set();
    this.cells_to_highlight = new Set();
    this.highlighted_cells = new Set();
  }

  public static getInstance(): WorldRendering {
    if (!WorldRendering.instance) {
      WorldRendering.instance = new WorldRendering();
    }

    return WorldRendering.instance;
  }

  public init(storeState: RootState, canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement, cellSize: number) {
    console.log('WorldRendering, init');
    this.storeState = storeState;
    this.cellSize = cellSize;
    this.canvasContainer = canvasContainer;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    this.fillWindow();
  }

  private render() {
    // In case just turned off rendering
    if (!this.running) { // || headless
      this.cells_to_render.clear();

      return;
    }

    this.renderCells();
    //this.renderHighlights();

    //console.log('WorldRendering, RENDER');
  }

  renderCells() {
    for (var cell of this.cells_to_render) {
      this.renderCell(cell);
    }

    this.cells_to_render.clear();
  }

  renderCell(cell: GridCell) {
    if (typeof this.ctx === 'undefined') {
      return;
    }

    cell.state.render(this.ctx, cell, this.cellSize);
  }

  renderColorScheme(gridMap: GridMap) {
    if (this.storeState === null) {
      return;
    }

    for (var state of CellStates.all) {
      state.color = this.storeState.worldEnvironment.config.color_scheme[state.name];
    }

    CellStates.eye.slit_color = this.storeState.worldEnvironment.config.color_scheme['eye-slit'];

    // Update any legends or editor palettes
    //for (var cell_type in this.storeState.worldEnvironment.config.color_scheme) {
      /*
      $('#' + cell_type + '.cell-type ').css(
        'background-color',
        WorldConfig.color_scheme[cell_type],
      );
      $('#' + cell_type + '.cell-legend-type').css(
        'background-color',
        WorldConfig.color_scheme[cell_type],
      );
      */
    //}

    this.renderFullGrid(gridMap.grid);
  }

  renderFullGrid(grid: GridCell[][]) {
    for (var col of grid) {
      for (var cell of col) {
        this.renderCell(cell);
      }
    }
  }

  public start(state: EnvironmentManagerState) {
    if (this.running) {
      return;
    }

    console.log('WorldRendering, start, state:', state);

    const animate = (nowTime: DOMHighResTimeStamp) => {
      this.timeStartedElapsed = nowTime - this.timeStoppedElapsed;
      this.render();
      store.dispatch(setWorldRenderingStats({
        ...state,
        worldRenderingTime: this.timeStartedElapsed,
      }));
      this.animateId = requestAnimationFrame(animate);
    };
    const startTime = performance.now();

    this.timeStoppedElapsed = this.timeStoppedElapsed + (startTime - this.timeStoppedLast);
    this.timeStoppedLast = 0;

    this.timeStartedLast = startTime;

    requestAnimationFrame(animate);

    this.running = true;
  }

  public stop() {
    if (!this.running) {
      return;
    }

    if (this.animateId !== null) {
      cancelAnimationFrame(this.animateId);
    }

    const stopTime = performance.now();

    this.timeStartedLast = 0;
    this.timeStoppedLast = stopTime;
    this.running = false;
  }

  // Intended only for use in combination with WorldSimulation.reset()
  public reset() {
    this.stop();
    this.timeStartedElapsed = 0;
    this.timeStartedLast = 0;
    this.timeStoppedElapsed = 0;
    this.timeStoppedLast = 0;
  }

  public fillWindow() {
    if (this.canvasContainer === null) {
      return;
    }

    const height = this.canvasContainer.clientHeight;
    const width = this.canvasContainer.clientWidth;

    this.fillShape(height, width);
  }

  public fillShape(height: number, width: number) {
    if (this.canvas === null) {
      return;
    }

    this.canvasWidth = this.canvas.width = width;
    this.canvasHeight = this.canvas.height = height;

    this.numCols = (this.cellSize > 0) ? Math.ceil(this.canvasWidth / this.cellSize) : 0;
    this.numRows = (this.cellSize > 0) ? Math.ceil(this.canvasHeight / this.cellSize) : 0;
  }

  public clear() {
    if (this.ctx === undefined) {
      return;
    }

    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  addToRender(cell: GridCell) {
    this.cells_to_render.add(cell);
  }
  /*
  renderFullGrid: (grid: GridCell[][]) => void;
  renderCellHighlight: (cell: GridCell, color: string) => void;
  renderHighlights: () => void;
  highlightCell: (cell: GridCell) => void;
  highlightOrganism: (org: Organism) => void;
  clearAllHighlights: (clear_to_highlight: boolean = false) => void; // = false
  */
}

export default WorldRendering;
