/// <reference types="react-scripts" />

//import CellStates from './src/features/anatomy/CellStates';

//declare module 'react-d3-library';
declare module '@dietrich-stein/dis-gui-lifetoys';
//declare module '@canvasjs/charts';

//type Perlin = import('./Utils/Perlin').default;
//type ControlPanel = import('./Interaction/ControlPanel').default;
type Organism = import('./src/features/organism/Organism').default;
type GridCell = import('./src/features/grid/GridCell').default;
//type LoadController = import('./Interaction/LoadController').default;

// Cell States

type CellStatesClass = import('./src/features/anatomy/CellStates').default;

type EmptyStateClass = import('./src/features/anatomy/CellStates').EmptyState;
type FoodStateClass = import('./src/features/anatomy/CellStates').FoodState;
type WallStateClass = import('./src/features/anatomy/CellStates').WallState;

type MouthStateClass = import('./src/features/anatomy/CellStates').MouthState;
type BrainStateClass = import('./src/features/anatomy/CellStates').BrainState;
type ProducerStateClass = import('./src/features/anatomy/CellStates').ProducerState;
type MoverStateClass = import('./src/features/anatomy/CellStates').MoverState;
type KillerStateClass = import('./src/features/anatomy/CellStates').KillerState;
type ArmorStateClass = import('./src/features/anatomy/CellStates').ArmorState;
type EyeStateClass = import('./src/features/anatomy/CellStates').EyeState;

type AnyCellState =
  | EmptyStateClass
  | FoodStateClass
  | WallStateClass
  | MouthStateClass
  | BrainStateClass
  | ProducerStateClass
  | MoverStateClass
  | KillerStateClass
  | ArmorStateClass
  | EyeStateClass;

type AnatomyCellState =
  | MouthStateClass
  | BrainStateClass
  | ProducerStateClass
  | MoverStateClass
  | KillerStateClass
  | ArmorStateClass
  | EyeStateClass;

/*type AnyAnatomyCellClassObject =
  | CellStates.mouth
  | CellStates.brain
  | CellStates.producer
  | CellStates.mover
  | CellStates.killer
  | CellStates.armor
  | CellStates.eye;*/

// Cell Classes

type MouthCellClass = import('./src/features/anatomy/cells/MouthCell').default;
type BrainCellClass = import('./src/features/anatomy/cells/BrainCell').default;
type ProducerCellClass = import('./src/features/anatomy/cells/ProducerCell').default;
type MoverCellClass = import('./src/features/anatomy/cells/MoverCell').default;
type KillerCellClass = import('./src/features/anatomy/cells/KillerCell').default;
type ArmorCellClass = import('./src/features/anatomy/cells/ArmorCell').default;
type EyeCellClass = import('./src/features/anatomy/cells/EyeCell').default;

type AnyAnatomyCellClass =
  | MouthCellClass
  | BrainCellClass
  | ProducerCellClass
  | MoverCellClass
  | KillerCellClass
  | ArmorCellClass
  | EyeCellClass;

// Metrics

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
  dropCellType?: (
    col: number, row: number, state: AllCellStatesType, killBlocking: boolean, ignoreState: AnatomyCellStatesType | null
  ) => void;
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

/*
  // Editor Renderer Functions
  renderOrganism?: (org: Organism) => void;
*/
