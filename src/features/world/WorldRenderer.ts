import { store, RootState } from '../../app/store';
import CellStates from '../simulator/SimulatorCellStates';
import SimulatorCell from '../simulator/SimulatorCell';
//import WorldSimulation from './WorldSimulation';
//import { useAppDispatch } from '../../../app/hooks';
import {
  WorldManagerState,
  setWorldRendererStats,
} from './WorldManagerSlice';
import SimulatorMap from '../simulator/SimulatorMap';

interface WorldRendererInterface {
  // State
  storeState: RootState | null;
  canvasContainerWidth: number;
  canvasContainerHeight: number;
  gridCols: number;
  gridRows: number;
  gridWidth: number;
  gridHeight: number;
  gridCellSize: number;
  gridBorderSize: number;
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
  cellsToRender: Set<SimulatorCell> | null;
  cellsToHighlight: Set<SimulatorCell> | null;
  cellsHighlighted: Set<SimulatorCell> | null;
  // Control
  init: (storeState: RootState, canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement) => void;
  start: (state: WorldManagerState) => void;
  stop: () => void;
  reset: (state: WorldManagerState, resetStats: boolean, map: SimulatorMap | null) => void;
  clear: () => void;
  // Cells
  addToRender: (cell: SimulatorCell) => void;
  renderCell: (cell: SimulatorCell) => void;
  renderChangedCells: () => void;
  initGrid: () => void; // cellSize: number, numCols: number, numRows: number, drawLines: boolean
  resizeWindow: () => void;
  resizeGrid: () => void; // cellSize: number, numCols: number, numRows: number
  //renderCellHighlight: (cell: SimulatorCell, color: string) => void;
  //renderHighlights: () => void;
  //highlightCell: (cell: SimulatorCell) => void;
  //highlightOrganism: (org: Organism) => void;
  //clearAllHighlights: (clear_to_highlight: boolean) => void; // = false
}

// Cannot because WorldSimulation does the same, circular loop
//const worldSimulation = WorldSimulation.getInstance();

class WorldRenderer implements WorldRendererInterface {
  // State
  storeState: RootState | null;
  gridCols: number;
  gridRows: number;
  gridWidth: number;
  gridHeight: number;
  gridCellSize: number;
  gridBorderSize: number;
  // Control
  running: boolean;
  animateId: number | null;
  timeStartedElapsed: number;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  // DOM
  canvasContainer: HTMLDivElement | null;
  canvasContainerWidth: number;
  canvasContainerHeight: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | undefined;
  // Cells
  cellsToRender: Set<SimulatorCell>;
  cellsToHighlight: Set<SimulatorCell>;
  cellsHighlighted: Set<SimulatorCell>;

  private static instance: WorldRenderer;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    // State
    this.storeState = null;
    this.gridCols = 0;
    this.gridRows = 0;
    this.gridWidth = 0;
    this.gridHeight = 0;
    this.gridCellSize = 0;
    this.gridBorderSize = 0;
    // Control
    this.running = false;
    this.animateId = null;
    this.timeStartedElapsed = 0;
    this.timeStartedLast = 0;
    this.timeStoppedElapsed = 0;
    this.timeStoppedLast = 0;
    // DOM
    this.canvasContainer = null;
    this.canvasContainerWidth = 0;
    this.canvasContainerHeight = 0;
    this.canvas = null;
    this.ctx = undefined;
    // Cells
    this.cellsToRender = new Set();
    this.cellsToHighlight = new Set();
    this.cellsHighlighted = new Set();
  }

  public static getInstance(): WorldRenderer {
    if (!WorldRenderer.instance) {
      WorldRenderer.instance = new WorldRenderer();
    }

    return WorldRenderer.instance;
  }

  drawGridLines() {
    if (this.gridBorderSize === 0 || this.ctx === undefined) {
      return;
    }

    const gridCellsWidth = this.gridCellSize * this.gridCols;
    const gridCellsHeight = this.gridCellSize * this.gridRows;
    const xRemain = this.gridWidth - (gridCellsWidth + 1);
    const yRemain = this.gridHeight - (gridCellsHeight + 1);
    const xShift = Math.floor(xRemain / 2);
    const yShift = Math.floor(yRemain / 2);

    this.clear();
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.translate(0.5, 0.5); // part 1 of 2, a fix for CSS causing blurry lines
    this.ctx.beginPath();

    let i, xLine, yLine, x1, x2, y1, y2;

    // Draw vertical lines in the top row of each grid cell
    for (i = 0; i < this.gridCols; i++) {
      xLine = i * this.gridCellSize;
      x1 = xShift + xLine;
      y1 = yShift + 0;
      x2 = xShift + xLine;
      y2 = yShift + gridCellsHeight;

      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
    }

    // Draw horizontal lines in the left column of each grid cell
    for (i = 0; i < this.gridRows; i++) {
      yLine = i * this.gridCellSize;
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
    if (this.storeState === null) {
      return;
    }

    this.gridHeight = this.canvasContainerHeight;
    this.gridWidth = this.canvasContainerWidth;

    this.gridCellSize = this.storeState.worldManager.worldRendererCellSize;

    this.gridCols = this.storeState.world.numCols;
    this.gridRows = this.storeState.world.numRows;

    /*
    // This are auto-adjusted cols and rows that adapt to the container.
    // We don't need them anymore (for now anyway) because we are decoupling the simulation.

    this.gridCols = Math.floor((this.gridWidth - this.gridBorderSize) / this.gridCellSize);
    while (
      this.gridCols > 0 &&
      ((this.gridCols * this.gridCellSize) + this.gridBorderSize) > this.gridWidth
    ) {
      this.gridCols -= 1;
    }

    this.gridRows = Math.floor((this.gridHeight - this.gridBorderSize) / this.gridCellSize);
    while (
      this.gridRows > 0 &&
      (this.gridRows * this.gridCellSize) + this.gridBorderSize > this.gridHeight) {
      this.gridRows -= 1;
    }
    */

    /*if (this.gridMap !== null) {
      this.gridMap.resize(this.gridCols, this.gridRows, this.gridCellSize);
    }*/
  }

  initGrid(drawLines: boolean = false) {
    this.resizeGrid();

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
    //console.log('WorldRenderer, init');
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

    this.renderChangedCells();
    //this.renderHighlights();
  }

  renderChangedCells() {
    //console.log('WorldRenderding, renderCells, cellsToRender.length =', this.cellsToRender.size);
    for (var cell of this.cellsToRender) {
      this.renderCell(cell);
    }

    this.cellsToRender.clear();
  }

  renderCell(cell: SimulatorCell) {
    if (typeof this.ctx === 'undefined' || this.storeState === null) {
      return;
    }

    const x = cell.col * this.gridCellSize;
    const y = cell.row * this.gridCellSize;
    const halfCell = Math.floor(this.gridCellSize / 2);

    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000000';
    this.ctx.fillStyle = cell.state.color;
    this.ctx.fillRect(x, y, this.gridCellSize, this.gridCellSize);

    if (this.gridCellSize >= 5) {
      this.ctx.translate(0.5, 0.5); // part 1 of 2, a fix for CSS causing blurry lines

      this.ctx.strokeStyle = '#000000';
      this.ctx.strokeRect(x, y, this.gridCellSize, this.gridCellSize);

      if (this.gridCellSize >= 12) {
        this.ctx.font = `${halfCell * 1.5}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillText(
          cell.state.name.charAt(0).toUpperCase(),
          x + halfCell + 1,
          y + Math.floor(halfCell * 1.15) + 1,
        );

        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.fillText(cell.state.name.charAt(0).toUpperCase(), x + halfCell, y + Math.floor(halfCell * 1.15));
      }

      this.ctx.translate(-0.5, -0.5); // part 1 of 2, a fix for CSS causing blurry lines
    }

    this.ctx.closePath();
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
      console.log('SimulatorCellState.render: abs_dir = ', abs_dir);
    }

    ctx.rotate((abs_dir * 45 * Math.PI) / 180);
    ctx.fillStyle = CellStates.eye.slit_color;
    ctx.fillRect(x, y, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    */
  }

  renderColorScheme(cells: SimulatorCell[][]) {
    if (this.storeState === null) {
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

    for (var col of cells) {
      for (var cell of col) {
        this.renderCell(cell);
      }
    }
  }

  public start(state: WorldManagerState) {
    if (this.running) {
      return;
    }

    //console.log('WorldRenderer, start, state:', state);

    const animate = (nowTime: DOMHighResTimeStamp) => {
      this.timeStartedElapsed = nowTime - this.timeStoppedElapsed;
      this.render();
      store.dispatch(setWorldRendererStats({
        ...state,
        worldRendererTime: this.timeStartedElapsed,
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

  public reset(state: WorldManagerState, resetStats: boolean = true, map: SimulatorMap | null = null) {
    if (this.storeState === null) {
      return;
    }

    const wasRunning = this.running;

    this.stop();

    if (resetStats) {
      this.timeStartedElapsed = 0;
      this.timeStartedLast = 0;
      this.timeStoppedElapsed = 0;
      this.timeStoppedLast = 0;
    }

    this.clear();
    this.storeState.worldManager = state;
    this.resizeGrid();

    if (map !== null) {
      for (var col of map.grid) {
        for (var cell of col) {
          this.renderCell(cell);
        }
      }
    }

    if (wasRunning) {
      this.start(state);
    }
  }

  clear() {
    if (this.ctx === undefined) {
      return;
    }

    this.ctx.fillStyle = '#0000FF';
    this.ctx.fillRect(0, 0, this.canvasContainerWidth, this.canvasContainerHeight);
  }

  addToRender(cell: SimulatorCell) {
    this.cellsToRender.add(cell);
  }
  /*
  renderCellHighlight: (cell: SimulatorCell, color: string) => void;
  renderHighlights: () => void;
  highlightCell: (cell: SimulatorCell) => void;
  highlightOrganism: (org: Organism) => void;
  clearAllHighlights: (clear_to_highlight: boolean = false) => void; // = false
  */
}

export default WorldRenderer;
