import { store } from '../../app/store';
import SimulatorCellStates from '../simulator/SimulatorCellStates';
import SimulatorCell from '../simulator/SimulatorCell';
import {
  ColorSchemeInterface,
  WorldManagerState,
  setWorldRendererStats,
} from './WorldManagerSlice';
import { SimulatorMapGrid } from '../simulator/SimulatorMap';
import Directions from '../organism/Directions';

interface WorldRendererInterface {
  // Grid
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
  cellsToRender: Set<SimulatorCell> | null;
  cellsToHighlight: Set<SimulatorCell> | null;
  cellsHighlighted: Set<SimulatorCell> | null;
  // Control
  init: (
    cols: number,
    rows: number,
    cellSize: number,
    canvasContainer: HTMLDivElement,
    canvas: HTMLCanvasElement,
    colorScheme: ColorSchemeInterface,
  ) => void;
  start: (worldManagerState: WorldManagerState, grid: SimulatorMapGrid) => void;
  stop: () => void;
  reset: (
    cols: number,
    rows: number,
    cellSize: number,
    worldManagerState: WorldManagerState,
    grid: SimulatorMapGrid, resetStats: boolean
  ) => void;
  // Cells, Grid, Rendering
  addToRender: (cell: SimulatorCell) => void;
  renderCell: (cell: SimulatorCell) => void;
  renderChangedCells: () => void;
  renderSolidColor: () => void;
  resizeWindow: () => void;

  //renderCellHighlight: (cell: SimulatorCell, color: string) => void;
  //renderHighlights: () => void;
  //highlightCell: (cell: SimulatorCell) => void;
  //highlightOrganism: (org: Organism) => void;
  //clearAllHighlights: (clear_to_highlight: boolean) => void; // = false
}

// Cannot because WorldSimulation does the same, circular loop
//const worldSimulation = WorldSimulation.getInstance();

class WorldRenderer implements WorldRendererInterface {
  // Grid
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
    // Grid
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

  /*resizeGrid(cols: number, rows: number, cellSize: number) {
    this.gridHeight = this.canvasContainerHeight;
    this.gridWidth = this.canvasContainerWidth;

    this.gridCols = cols;
    this.gridRows = rows;
    this.gridCellSize = cellSize;

    if (this.gridMap !== null) {
      this.gridMap.resize(this.gridCols, this.gridRows, this.gridCellSize);
    }*/
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
  }*/

  /*initGrid(cols: number, rows: number, cellSize: number) {
    //this.resizeGrid(cols, rows, cellSize);
    this.gridHeight = this.canvasContainerHeight;
    this.gridWidth = this.canvasContainerWidth;

    this.gridCols = cols;
    this.gridRows = rows;
    this.gridCellSize = cellSize;
  }*/

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
    this.gridHeight = this.canvasContainerHeight;
    this.gridWidth = this.canvasContainerWidth;
  }

  public init(
    cols: number,
    rows: number,
    cellSize: number,
    canvasContainer: HTMLDivElement,
    canvas: HTMLCanvasElement,
    colorScheme: ColorSchemeInterface,
  ) {
    //console.log('WorldRenderer, init');
    this.gridCols = cols;
    this.gridRows = rows;
    this.gridCellSize = cellSize;
    this.canvasContainer = canvasContainer;
    this.canvasContainerWidth = this.canvasContainer.clientWidth;
    this.canvasContainerHeight = this.canvasContainer.clientHeight;
    this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    // Calling resizeWindow() here updates the "canvasContainerHeight" and
    // "canvasContainerWidth" vars based on the container size. Then, it
    // sets the canvas.width and canvas.height attributes to match.
    this.resizeWindow();

    // We can now sync the local convenience vars to the container
    this.gridHeight = this.canvasContainerHeight;
    this.gridWidth = this.canvasContainerWidth;

    window.addEventListener('resize', this.handleResize.bind(this), false);

    this.applyColorScheme(colorScheme);
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

  drawTriangle(
    direction: number,
    offsetX: number,
    offsetY: number,
    color: string = '#FFFFFF',
    smaller: boolean = false,
  ) {
    if (typeof this.ctx === 'undefined') {
      return;
    }

    // Base sizes
    const halfCell = Math.floor(this.gridCellSize / 2);
    const quarterCell = (smaller)
      ? Math.floor(this.gridCellSize / 8)
      : Math.floor(this.gridCellSize / 4);
    //const eighthCell = Math.floor(this.gridCellSize / 8);
    // Actual sizes
    const sizeLateralMinus = halfCell - quarterCell;//eighthCell;
    const sizeLateralPlus = halfCell + quarterCell;//eighthCell;
    const sizeFromSideMinus = this.gridCellSize - quarterCell;//eighthCell;
    const sizeFromSidePlus = quarterCell;//eighthCell;
    const sizeFromCorner = (smaller) ? quarterCell : halfCell;//this.gridCellSize - quarterCell;
    //const sizeFromCornerPlus = halfCell;//quarterCell;

    let startX;
    let startY;
    let middleX;
    let middleY;
    let lastX;
    let lastY;

    switch (direction) {
      case Directions.cardinals.n:
        // left
        startX = sizeLateralMinus;
        startY = sizeFromSidePlus;
        // top
        middleX = halfCell;
        middleY = 0;
        // right
        lastX = sizeLateralPlus;
        lastY = sizeFromSidePlus;
        break;

      case Directions.cardinals.ne:
        // top-right
        startX = this.gridCellSize;
        startY = 0;
        //
        middleX = this.gridCellSize - sizeFromCorner;
        middleY = 0;
        // bottom
        lastX = this.gridCellSize;
        lastY = sizeFromCorner;
        break;

      case Directions.cardinals.e:
        // right
        startX = this.gridCellSize;
        startY = halfCell;
        // top
        middleX = sizeFromSideMinus;
        middleY = sizeLateralMinus;
        // bottom
        lastX = sizeFromSideMinus;
        lastY = sizeLateralPlus;
        break;

      case Directions.cardinals.se:
        // bottom-right
        startX = this.gridCellSize;
        startY = this.gridCellSize;
        // top
        middleX = this.gridCellSize;
        middleY = this.gridCellSize - sizeFromCorner;
        // left
        lastX = this.gridCellSize - sizeFromCorner;
        lastY = this.gridCellSize;
        break;

      case Directions.cardinals.s:
        // left
        startX = sizeLateralMinus;
        startY = sizeFromSideMinus;
        // bottom
        middleX = halfCell;
        middleY = this.gridCellSize;
        // right
        lastX = sizeLateralPlus;
        lastY = sizeFromSideMinus;
        break;

      case Directions.cardinals.sw:
        // bottom-left
        startX = 0;
        startY = this.gridCellSize;
        // right
        middleX = sizeFromCorner;
        middleY = this.gridCellSize;
        // top
        lastX = 0;
        lastY = this.gridCellSize - sizeFromCorner;
        break;

      case Directions.cardinals.w:
        // left
        startX = 0;
        startY = halfCell;
        // top
        middleX = sizeFromSidePlus;
        middleY = sizeLateralMinus;
        // bottom
        lastX = sizeFromSidePlus;
        lastY = sizeLateralPlus;
        break;

      case Directions.cardinals.nw:
        // top-left
        startX = 0;
        startY = 0;
        // right
        middleX = sizeFromCorner;
        middleY = 0;
        // bottom
        lastX = 0;
        lastY = sizeFromCorner;
        break;
    }

    if (
      startX === undefined ||
      startY === undefined ||
      middleX === undefined ||
      middleY === undefined ||
      lastX === undefined ||
      lastY === undefined
    ) {
      return;
    }

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX + startX, offsetY + startY);
    this.ctx.lineTo(offsetX + middleX, offsetY + middleY);
    this.ctx.lineTo(offsetX + lastX, offsetY + lastY);
    this.ctx.fill();
  }

  renderCellsByMapGrid(grid: SimulatorMapGrid) {
    for (var col of grid) {
      for (var cell of col) {
        this.renderCell(cell);
      }
    }
  }

  renderCell(cell: SimulatorCell) {
    if (typeof this.ctx === 'undefined') {
      return;
    }

    const x = cell.col * this.gridCellSize;
    const y = cell.row * this.gridCellSize;
    const halfCell = Math.floor(this.gridCellSize / 2);

    this.ctx.beginPath(); // only use when lifting with moveTo()
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.strokeStyle = '#000000';

    if (cell.state.name === 'food') {
      //this.ctx.beginPath();
      this.ctx.fillStyle = SimulatorCellStates.empty.color;
      this.ctx.fillRect(x, y, this.gridCellSize, this.gridCellSize);

      //this.ctx.beginPath();
      this.ctx.fillStyle = cell.state.color;
      this.ctx.arc(x + halfCell, y + halfCell, Math.floor(halfCell * 0.75), 0, 2 * Math.PI);
      this.ctx.fill();
    } else {
      this.ctx.fillStyle = cell.state.color;
      this.ctx.fillRect(x, y, this.gridCellSize, this.gridCellSize);
    }

    if (this.gridCellSize >= 5) {
      this.ctx.translate(0.5, 0.5); // part 1 of 2, a fix for CSS causing blurry lines

      this.ctx.strokeStyle = '#000000';
      this.ctx.strokeRect(x, y, this.gridCellSize, this.gridCellSize);

      if (this.gridCellSize >= 12) {
        // Big first-letter of cell centered inside
        this.ctx.font = `${halfCell * 1.5}px serif`;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillText(
          cell.state.name.charAt(0).toUpperCase(),
          x + halfCell + 1,
          y + Math.floor(halfCell * 1.15) + 1,
        );
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.fillText(
          cell.state.name.charAt(0).toUpperCase(),
          x + halfCell,
          y + Math.floor(halfCell * 1.15),
        );

        // Print simulator grid cell col/row via cell.id
        if (cell.id.length > 0) {
          this.ctx.font = `${this.gridCellSize * 0.15}px serif`; // 1/16th
          this.ctx.textAlign = 'left';
          this.ctx.textBaseline = 'bottom';
          this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          this.ctx.fillText(
            cell.id,
            x + 0,
            y + this.gridCellSize,
          );
        }

        if (cell.org !== null) {
          // Draw the rotation direction triangle
          this.drawTriangle(cell.org.anatomyDirection, x, y);

          // Draw the movement direction triangle
          this.drawTriangle(cell.org.movementDirection, x, y, '#FF0000', true);

          // Draw the look direction triangle
          this.drawTriangle(cell.org.lookDirection, x, y, '#FF00FF', true);
        }
      }

      this.ctx.translate(-0.5, -0.5); // part 1 of 2, a fix for CSS causing blurry lines
    }

    this.ctx.closePath(); // only use when need to draw line from end to start for stroke

    /*
    // Render the eye slit?
    if (
      cell.owner_cell === null ||
      (
        cell.owner_cell.state !== SimulatorCellStates.eye //&&
        //cell.owner_cell.state !== SimulatorCellStates.mouth
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
    var abs_dir = cell.owner_cell.org.rotationDirection; //cell.owner_cell.org.getAbsoluteDirection();

    if (cell.owner_cell.org.environment === 'editor') {
      console.log('SimulatorCellState.render: abs_dir = ', abs_dir);
    }

    ctx.rotate((abs_dir * 45 * Math.PI) / 180);
    ctx.fillStyle = SimulatorCellStates.eye.slit_color;
    ctx.fillRect(x, y, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    */
  }

  renderSolidColor(color: string = 'rgba(255,255,255,1)') {
    if (this.ctx === undefined) {
      return;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvasContainerWidth, this.canvasContainerHeight);
  }

  applyColorScheme(colorScheme: ColorSchemeInterface) {
    for (var state of SimulatorCellStates.all) {
      state.color = colorScheme[state.name];
    }

    SimulatorCellStates.eye.slit_color = colorScheme['eye-slit'];

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
  }

  public start(worldManagerState: WorldManagerState, grid: SimulatorMapGrid) {
    if (this.running) {
      return;
    }

    //console.log('WorldRenderer, start, state:', state);
    this.renderCellsByMapGrid(grid);

    const animate = (nowTime: DOMHighResTimeStamp) => {
      this.timeStartedElapsed = nowTime - this.timeStoppedElapsed;
      this.render();
      store.dispatch(setWorldRendererStats({
        ...worldManagerState,
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

  // In addition to manual control, also called in event handler for GUI widget inputs
  public reset(
    cols: number,
    rows: number,
    cellSize: number,
    worldManagerState: WorldManagerState,
    grid: SimulatorMapGrid,
    resetStats: boolean = true,
  ) {
    const wasRunning = this.running;

    this.stop();

    if (resetStats) {
      this.timeStartedElapsed = 0;
      this.timeStartedLast = 0;
      this.timeStoppedElapsed = 0;
      this.timeStoppedLast = 0;
    }

    this.gridCols = cols;
    this.gridRows = rows;
    this.gridCellSize = cellSize;

    this.renderSolidColor();
    this.renderCellsByMapGrid(grid);

    if (wasRunning) {
      this.start(worldManagerState, grid);
    }
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
