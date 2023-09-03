import { store, RootState } from '../../app/store';
import CellStates from '../anatomy/CellStates';
import GridMap from '../grid/GridMap';
//import { useAppDispatch } from '../../../app/hooks';
import {
  WorldManagerState,
  setWorldRenderingStats,
} from './WorldManagerSlice';

interface WorldRenderingInterface {
  // State
  storeState: RootState | null;
  canvasContainerWidth: number;
  canvasContainerHeight: number;
  gridOptions: any;
  gridMap: GridMap | null;
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  borderSize: number;
  numCols: number;
  numRows: number;
  // Control
  running: boolean;
  animateId: number | null;
  timeStartedElapsed: number;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  // DOM
  canvasContainer: HTMLDivElement | null;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | undefined;
  // Cells
  cellsToRender: Set<GridCell> | null;
  cellsToHighlight: Set<GridCell> | null;
  cellsHighlighted: Set<GridCell> | null;
  // Control
  init: (storeState: RootState, canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement) => void;
  start: (state: WorldManagerState) => void;
  stop: () => void;
  reset: () => void;
  clear: () => void;
  // Cells
  addToRender: (cell: GridCell) => void;
  renderCell: (cell: GridCell) => void;
  renderCells: () => void;
  renderFullGrid: (grid: GridCell[][]) => void;
  initGrid: (drawLines: boolean) => void;
  resizeWindow: () => void;
  //renderCellHighlight: (cell: GridCell, color: string) => void;
  //renderHighlights: () => void;
  //highlightCell: (cell: GridCell) => void;
  //highlightOrganism: (org: Organism) => void;
  //clearAllHighlights: (clear_to_highlight: boolean) => void; // = false
}

class WorldRendering implements WorldRenderingInterface {
  // State
  storeState: RootState | null;
  canvasContainerWidth: number;
  canvasContainerHeight: number;
  gridOptions: any;
  gridMap: GridMap | null;
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
  borderSize: number;
  numCols: number;
  numRows: number;
  // Control
  running: boolean;
  animateId: number | null;
  timeStartedElapsed: number;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  // DOM
  canvasContainer: HTMLDivElement | null;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | undefined;
  // Cells
  cellsToRender: Set<GridCell>;
  cellsToHighlight: Set<GridCell>;
  cellsHighlighted: Set<GridCell>;

  private static instance: WorldRendering;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    // State
    this.storeState = null;
    this.gridOptions = {
      param: {
        stroke: '#000000',
        strokeWidth: 1,
        selectable: false,
      },
    };
    this.gridMap = null;
    this.gridWidth = 0;
    this.gridHeight = 0;
    this.canvasContainerWidth = 0;
    this.canvasContainerHeight = 0;
    this.cellSize = 5; // this.storeState.world.cellSize
    this.borderSize = 0;
    this.numCols = 0;
    this.numRows = 0;
    // Control
    this.running = false;
    this.animateId = null;
    this.timeStartedElapsed = 0;
    this.timeStartedLast = 0;
    this.timeStoppedElapsed = 0;
    this.timeStoppedLast = 0;
    // DOM
    this.canvasContainer = null;
    this.canvas = null;
    this.ctx = undefined;
    // Cells
    this.cellsToRender = new Set();
    this.cellsToHighlight = new Set();
    this.cellsHighlighted = new Set();
  }

  public static getInstance(): WorldRendering {
    if (!WorldRendering.instance) {
      WorldRendering.instance = new WorldRendering();
    }

    return WorldRendering.instance;
  }

  drawGridLines() {
    if (this.borderSize === 0 || this.ctx === undefined) {
      return;
    }

    const gridCellsWidth = this.cellSize * this.numCols;
    const gridCellsHeight = this.cellSize * this.numRows;
    const xRemain = this.gridWidth - (gridCellsWidth + 1);
    const yRemain = this.gridHeight - (gridCellsHeight + 1);
    const xShift = Math.floor(xRemain / 2);
    const yShift = Math.floor(yRemain / 2);

    this.clear();
    this.ctx.lineWidth = this.gridOptions.param.strokeWidth;
    this.ctx.fillStyle = this.gridOptions.param.stroke;
    this.ctx.translate(0.5, 0.5); // part 1 of 2, a fix for CSS causing blurry lines
    this.ctx.beginPath();

    let i, xLine, yLine, x1, x2, y1, y2;

    // Draw vertical lines in the top row of each grid cell
    for (i = 0; i < this.numCols; i++) {
      xLine = i * this.cellSize;
      x1 = xShift + xLine;
      y1 = yShift + 0;
      x2 = xShift + xLine;
      y2 = yShift + gridCellsHeight;

      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
    }

    // Draw horizontal lines in the left column of each grid cell
    for (i = 0; i < this.numRows; i++) {
      yLine = i * this.cellSize;
      x1 = xShift + 0;
      y1 = yShift + yLine;
      x2 = xShift + gridCellsWidth;
      y2 = yShift + yLine;

      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
    }

    // Draw a right-side border
    this.ctx.moveTo(xShift + gridCellsWidth, yShift + 0);
    this.ctx.lineTo(xShift + gridCellsWidth, yShift + gridCellsHeight);

    // Draw a bottom-side border
    this.ctx.moveTo(xShift + 0, yShift + gridCellsHeight);
    this.ctx.lineTo(xShift + gridCellsWidth, yShift + gridCellsHeight);

    this.ctx.stroke();
    this.ctx.translate(-0.5, -0.5); // part 2 of 2, see above
  }

  resizeGrid() {
    this.gridHeight = this.canvasContainerHeight;
    this.gridWidth = this.canvasContainerWidth;

    //const minBorderSize = 0;
    //const borderSize = Math.max(minBorderSize, this.borderSize);
    // Adjust cell size in case too small
    //const minCellSize = (borderSize > 0) ? 2 : 1;
    //let tempCellSize = Math.max(minCellSize, this.cellSize - 1);

    // Adjust cell size in case too large
    this.cellSize = Math.min(
      Math.min(this.gridWidth - 1, this.gridHeight - 1),
      this.cellSize, //tempCellSize,
    );

    this.numCols = Math.floor((this.gridWidth - this.borderSize) / this.cellSize);
    while (this.numCols > 0 && ((this.numCols * this.cellSize) + this.borderSize) > this.gridWidth) {
      this.numCols -= 1;
    }

    this.numRows = Math.floor((this.gridHeight - this.borderSize) / this.cellSize);
    while (this.numRows > 0 && (this.numRows * this.cellSize) + this.borderSize > this.gridHeight) {
      this.numRows -= 1;
    }

    if (this.gridMap !== null) {
      this.gridMap.resize(this.numCols, this.numRows, this.cellSize);
    }
  }

  initGrid(drawLines: boolean = true) {
    this.resizeGrid();

    this.gridMap = new GridMap(
      this,
      this.numCols,
      this.numRows,
      this.cellSize,
    );

    if (drawLines){
      this.drawGridLines();
    }
  }

  public resizeWindow() {
    if (this.canvasContainer === null || this.canvas === null) {
      return;
    }

    this.canvasContainerHeight = this.canvasContainer.clientHeight;
    this.canvasContainerWidth = this.canvasContainer.clientWidth;

    this.canvas.height = this.canvasContainerHeight;
    this.canvas.width = this.canvasContainerWidth;
  }

  handleResize() {
    console.log('handleResize');
    this.resizeWindow();
    this.resizeGrid();
  }

  public init(storeState: RootState, canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement) {
    console.log('WorldRendering, init');
    this.storeState = storeState;

    this.canvasContainer = canvasContainer;
    this.canvasContainerWidth = this.canvasContainer.clientWidth;
    this.canvasContainerHeight = this.canvasContainer.clientHeight;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    this.resizeWindow();
    this.initGrid();

    if (this.canvasContainer === null) {
      return;
    }

    window.addEventListener('resize', this.handleResize.bind(this), false);
  }

  private render() {
    // In case just turned off rendering
    if (!this.running) { // || headless
      this.cellsToRender.clear();

      return;
    }

    this.renderCells();
    //this.renderHighlights();
  }

  renderCells() {
    //console.log('WorldRenderding, renderCells, cellsToRender.length =', this.cellsToRender.size);
    for (var cell of this.cellsToRender) {
      this.renderCell(cell);
    }

    this.cellsToRender.clear();
  }

  renderCell(cell: GridCell) {
    if (typeof this.ctx === 'undefined' || this.storeState === null) {
      return;
    }

    //this.ctx.fillStyle = Math.floor(Math.random()*16777215).toString(16);
    this.ctx.fillStyle = cell.state.color;
    this.ctx.fillRect(cell.x, cell.y, this.cellSize, this.cellSize);

    /*
    // Render the eye slit?
    if (
      cell.owner_cell === null ||
      (
        cell.owner_cell.state !== CellStates.eye //&&
        //cell.owner_cell.state !== CellStates.mouth
      )
    ) {
      return;
    }

    ctx.fillStyle = this.color;
    ctx.fillRect(cell.x, cell.y, size, size);
    if (size === 1) {
      return;
    }

    var half = size / 2;
    var x = -size / 8;
    var y = -half;
    var h = size / 2 + size / 4;
    var w = size / 4;

    ctx.translate(cell.x + half, cell.y + half);
    var abs_dir = cell.owner_cell.org.rotation_direction; //cell.owner_cell.org.getAbsoluteDirection();

    if (cell.owner_cell.org.environment === 'editor') {
      console.log('GridCellState.render: abs_dir = ', abs_dir);
    }

    ctx.rotate((abs_dir * 45 * Math.PI) / 180);
    ctx.fillStyle = CellStates.eye.slit_color;
    ctx.fillRect(x, y, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    */
  }

  renderColorScheme() {
    if (this.storeState === null || this.gridMap === null) {
      return;
    }

    for (var state of CellStates.all) {
      state.color = this.storeState.world.config.color_scheme[state.name];
    }

    CellStates.eye.slit_color = this.storeState.world.config.color_scheme['eye-slit'];

    // Update any legends or editor palettes
    //for (var cell_type in this.storeState.world.config.color_scheme) {
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

    this.renderFullGrid(this.gridMap.grid);
  }

  renderFullGrid(grid: GridCell[][]) {
    for (var col of grid) {
      for (var cell of col) {
        this.renderCell(cell);
      }
    }
  }

  public start(state: WorldManagerState) {
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

  clear() {
    if (this.ctx === undefined) {
      return;
    }

    this.ctx.fillStyle = '#0000FF';
    this.ctx.fillRect(0, 0, this.canvasContainerWidth, this.canvasContainerHeight);
  }

  addToRender(cell: GridCell) {
    this.cellsToRender.add(cell);
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
