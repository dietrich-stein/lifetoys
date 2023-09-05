/// <reference types="react-scripts" />

//import CellStates from './src/features/anatomy/CellStates';

//declare module 'react-d3-library';
declare module '@dietrich-stein/dis-gui-lifetoys';
//declare module '@canvasjs/charts';

//type Perlin = import('./Utils/Perlin').default;
//type ControlPanel = import('./Interaction/ControlPanel').default;
type Organism = import('./src/features/organism/Organism').default;
type SimulatorCell = import('./src/features/simulator/SimulatorCell').default;
//type LoadController = import('./Interaction/LoadController').default;

// Cell States

//type CellStatesClass = import('./src/features/world/WorldCellStates').default;

type EmptyStateClass = import('./src/features/simulator/SimulatorCellStates').EmptyState;
type FoodStateClass = import('./src/features/simulator/SimulatorCellStates').FoodState;
type WallStateClass = import('./src/features/simulator/SimulatorCellStates').WallState;

type MouthStateClass = import('./src/features/simulator/SimulatorCellStates').MouthState;
type BrainStateClass = import('./src/features/simulator/SimulatorCellStates').BrainState;
type ProducerStateClass = import('./src/features/simulator/SimulatorCellStates').ProducerState;
type MoverStateClass = import('./src/features/simulator/SimulatorCellStates').MoverState;
type StingerStateClass = import('./src/features/simulator/SimulatorCellStates').StingerState;
type ArmorStateClass = import('./src/features/simulator/SimulatorCellStates').ArmorState;
type EyeStateClass = import('./src/features/simulator/SimulatorCellStates').EyeState;

type WorldCellState =
  | EmptyStateClass
  | FoodStateClass
  | WallStateClass
  | MouthStateClass
  | BrainStateClass
  | ProducerStateClass
  | MoverStateClass
  | StingerStateClass
  | ArmorStateClass
  | EyeStateClass;

type AnatomyCellState =
  | MouthStateClass
  | BrainStateClass
  | ProducerStateClass
  | MoverStateClass
  | StingerStateClass
  | ArmorStateClass
  | EyeStateClass;

// Cell Classes

type MouthCellClass = import('./src/features/anatomy/cells/MouthCell').default;
type BrainCellClass = import('./src/features/anatomy/cells/BrainCell').default;
type ProducerCellClass = import('./src/features/anatomy/cells/ProducerCell').default;
type MoverCellClass = import('./src/features/anatomy/cells/MoverCell').default;
type StingerCellClass = import('./src/features/anatomy/cells/StingerCell').default;
type ArmorCellClass = import('./src/features/anatomy/cells/ArmorCell').default;
type EyeCellClass = import('./src/features/anatomy/cells/EyeCell').default;

type AnatomyCellClass =
  | MouthCellClass
  | BrainCellClass
  | ProducerCellClass
  | MoverCellClass
  | StingerCellClass
  | ArmorCellClass
  | EyeCellClass;

// Metrics

type CellCountsType = {
  mouth: number,
  brain: number,
  producer: number,
  mover: number,
  stinger: number,
  armor: number,
  eye: number,
}

type AverageCellCountsType = Array<CellCountsType>;

type DirectionCoordinates = number[][]

type CardinalDirectionLabel =
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'
  | 'nw';

type CardinalLabelsType = Array<CardinalDirectionLabel>;

type CardinalDirectionsType = {
  n: number;
  ne: number;
  e: number;
  se: number;
  s: number;
  sw: number;
  w: number;
  nw: number;
}

type ScalarCoordinatesType = Array<Array<number>>;

type GrowthPlanStep = {
  state: AnatomyCellState | null, // null represents crossover/overlap
  direction: number,
};

type GrowthPlan = Array<GrowthPlanStep>;

/*interface ControllerInterface {
  // Common Properties
  mode: number;
  highlight_org: boolean;
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
