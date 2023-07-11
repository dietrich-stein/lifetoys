/// <reference types="react-scripts" />

//declare module 'dat.gui';
//declare module '@canvasjs/charts';
//declare module 'svelte-grid/build/helper/index.mjs';
//declare module 'svelte-grid';
//declare module 'svelte-fa';
//declare module 'svrollbar';

//type GUI = import('./dat.gui').GUI;

//type WorldEnvironment = import('./Environments/World/WorldEnvironment').default;
//type EditorEnvironment = import('./Environments/Editor/EditorEnvironment.tsx').default;

/*interface AppContextInterface {
  world_environment: WorldEnvironment | null;
  editor_environment: EditorEnvironment | null;
}*/

//type WorldRenderer = import('./Environments/World/WorldRenderer').default;
//type EditorRenderer = import('./Environments/Editor/EditorRenderer').default;

//type Perlin = import('./Utils/Perlin').default;
//type ControlPanel = import('./Interaction/ControlPanel').default;
type Organism = import('./Organism/Organism').default;
type GridCell = import('./Grid/GridCell').default;
//type LoadController = import('./Interaction/LoadController').default;

type CellStates = import('./Anatomy/CellStates').default;
type EmptyState = import('./Anatomy/CellStates').EmptyState;
type FoodState = import('./Anatomy/CellStates').FoodState;
type WallState = import('./Anatomy/CellStates').WallState;
type MouthState = import('./Anatomy/CellStates').MouthState;
type BrainState = import('./Anatomy/CellStates').BrainState;
type ProducerState = import('./Anatomy/CellStates').ProducerState;
type MoverState = import('./Anatomy/CellStates').MoverState;
type KillerState = import('./Anatomy/CellStates').KillerState;
type ArmorState = import('./Anatomy/CellStates').ArmorState;
type EyeState = import('./Anatomy/CellStates').EyeState;

type MouthCellClassType = import('./Anatomy/Cells/MouthCell').default;
type BrainCellClassType = import('./Anatomy/Cells/BrainCell').default;
type ProducerCellClassType = import('./Anatomy/Cells/ProducerCell').default;
type MoverCellClassType = import('./Anatomy/Cells/MoverCell').default;
type KillerCellClassType = import('./Anatomy/Cells/KillerCell').default;
type ArmorCellClassType = import('./Anatomy/Cells/ArmorCell').default;
type EyeCellClassType = import('./Anatomy/Cells/EyeCell').default;

type AnyEnvironmentType =
  | WorldEnvironment
  | EditorEnvironment;

type AnyRendererType =
  | WorldRenderer
  | EditorRenderer;

type AllCellStatesType =
  | EmptyState
  | FoodState
  | WallState
  | MouthState
  | BrainState
  | ProducerState
  | MoverState
  | KillerState
  | ArmorState
  | EyeState;

type LivingCellStatesType =
  | MouthState
  | BrainState
  | ProducerState
  | MoverState
  | KillerState
  | ArmorState
  | EyeState;

type AnatomyCellStatesType =
  | CellStates.mouth
  | CellStates.brain
  | CellStates.producer
  | CellStates.mover
  | CellStates.killer
  | CellStates.armor
  | CellStates.eye;

type AnatomyCellClassType =
  | MouthCellClassType
  | BrainCellClassType
  | ProducerCellClassType
  | MoverCellClassType
  | KillerCellClassType
  | ArmorCellClassType
  | EyeCellClassType;

type CellCountsType = {
  mouth: number;
  brain: number;
  producer: number;
  mover: number;
  killer: number;
  armor: number;
  eye: number;
}

type AverageCellCountsType = Array<CellCountsType>;

/*interface EnvironmentControllerInterface {
  // Common Properties
  mode: number;
  highlight_org: boolean;
  env: AnyEnvironmentType | null;
  control_panel: ControlPanel | null;
  canvas: HTMLCanvasElement | null;
  mouse_x: number;
  mouse_y: number;
  mouse_c: number;
  mouse_r: number;
  left_click: boolean;
  middle_click: boolean;
  right_click: boolean;
  cur_cell: GridCell | null;
  cur_org: Organism | null;
  start_x: number;
  start_y: number;

  // World Controller Properties
  org_to_clone?: Organism | null;
  scale?: number;
  perlin?: Perlin;

  // Editor Controller Properties
  edit_cell_type?: AnatomyCellStatesType | null;
  load_controller?: LoadController;

  // Common Functions
  mouseMove: () => void;
  mouseDown: () => void;
  mouseUp: () => void;
  setControlPanel: (panel: ControlPanel) => void;
  defineEvents: () => void;
  updateMouseLocation: (offsetX: number, offsetY: number) => void;

  // World Controller Functions
  defineZoomControls?: () => void;
  resetView?: () => void;
  randomizeWalls?: (thickness: number) => void;
  performModeAction?: () => void;
  dragScreen?: () => void;
  dropOrganism?: (organism: Organism, col: number, row: number) => boolean;
  dropCellType?: (col: number, row: number, state: AllCellStatesType, killBlocking: boolean, ignoreState: AnatomyCellStatesType | null) => void;
  findNearOrganism?: () => Organism | null;
  killNearOrganisms?: () => void;

  // Editor Controller Functions
  getCurLocalCell?: () => Cell | null
  editOrganism?: () => void;
  updateDetails?: () => void;
  defineCellTypeSelection?: () => void;
  defineEditorDetails?: () => void;
  defineSaveLoad?: () => void;
  loadOrg?: (org: any) => void;
  clearDetailsPanel?: () => void;
  refreshDetailsPanel?: () => void;
  setDetailsPanel?: () => void;
  setEditorPanel?: () => void;
  setBrainPanelVisibility?: () => boolean;
  setBrainDetails?: () => void;
  setMoveRangeVisibility?: () => boolean;
  setBrainEditorValues?: (decision: string) => void;
  setRandomizePanel?: () => void;
}*/

interface EnvironmentRendererProps {
  // Common Properties
  cell_size: number;
  canvasId: string; //canvas: HTMLCanvasElement | null;
  //ctx: CanvasRenderingContext2D | undefined;
  cells_to_render: Set<GridCell>;
  cells_to_highlight: Set<GridCell>;
  highlighted_cells: Set<GridCell>;

  // World Renderer Properties
  fill_window?: boolean;
  num_cols?: number | null;
  num_rows?: number | null;
  //canvas_container?: HTMLElement | null;
  height?: number;
  width?: number;

  // Editor Renderer Properties
  /*
  // Common Functions
  addToRender: (cell: GridCell) => void;
  renderCell: (cell: GridCell) => void;
  renderCells: () => void;
  renderFullGrid: (grid: GridCell[][]) => void;
  renderCellHighlight: (cell: GridCell, color: string) => void;
  renderHighlights: () => void;
  highlightCell: (cell: GridCell) => void;
  highlightOrganism: (org: Organism) => void;
  clearAllHighlights: (clear_to_highlight: boolean = false) => void;

  // World Renderer Functions
  fillWindow?: () => void;
  fillShape?: (height: number, width: number) => void;
  clear?: () => void;

  // Editor Renderer Functions
  renderOrganism?: (org: Organism) => void;*/
}