import { RootState } from '../../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import WorldSimulation from './WorldSimulation';
//import WorldRendering from './WorldRendering';

interface WorldEnvironmentColorSchemeInterface {
  [key: string]: string;
}

// Underscores are used for JSON-serializable objects
export interface WorldEnvironmentConfigState {
  fill_window: boolean;
  num_random_orgs: number;
  clear_walls_on_reset: boolean;
  auto_reset: boolean;
  brush_size: number;
  color_scheme: WorldEnvironmentColorSchemeInterface;
}

export interface WorldEnvironmentState {
  status: 'idle' | 'loading';
  canvasId: string | null;
  canvasContainerId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  cellSize: number;
  numCols: number;
  numRows: number;
  config: WorldEnvironmentConfigState;
}

const initialState: WorldEnvironmentState = {
  status: 'loading',
  canvasId: null,
  canvasContainerId: null,
  canvasWidth: 0,
  canvasHeight: 0,
  cellSize: 5,
  numCols: 0,
  numRows: 0,
  config: {
    fill_window: true,
    num_random_orgs: 100,
    clear_walls_on_reset: false,
    auto_reset: false,
    brush_size: 2,
    color_scheme: {
      empty: '#111111',
      food: '#15DE59',
      wall: '#808080',
      brain: '#FF00FF',
      mouth: '#FFAA00',
      producer: '#0000FF',
      mover: '#00FFFF',
      killer: '#FF0000',
      armor: '#6600CC',
      eye: '#EEEEEE',
      'eye-slit': '#000000',
    },
  },
};
//const worldRendering = WorldRendering.getInstance();
//const worldSimulation = WorldSimulation.getInstance();

export const worldEnvironmentSlice = createSlice({
  name: 'worldEnvironment',
  initialState,
  reducers: {
    initWorldEnvironment: (state, action: PayloadAction<WorldEnvironmentState>) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      state.canvasContainerId = action.payload.canvasContainerId;
    },
    setWorldCellSize: (state, action: PayloadAction<number>) => {
      state.cellSize = action.payload;
    },
    setWorldNumCols: (state, action: PayloadAction<number>) => {
      state.numCols = action.payload;
    },
    setWorldNumRows: (state, action: PayloadAction<number>) => {
      state.numRows = action.payload;
    },
    setWorldCanvasWidth: (state, action: PayloadAction<number>) => {
      state.canvasWidth = action.payload;
    },
    setWorldCanvasHeight: (state, action: PayloadAction<number>) => {
      state.canvasHeight = action.payload;
    },
    setWorldColors: (state, action: PayloadAction<WorldEnvironmentState>) => {
      console.log('WorldEnvironment, setWorldColors, payload:', action.payload);
    },
  },
});

export const selectWorldEnvironment = (state: RootState) => state.worldEnvironment;

export const {
  initWorldEnvironment,
  setWorldCellSize,
  setWorldNumCols,
  setWorldNumRows,
  setWorldColors,
  setWorldCanvasWidth,
  setWorldCanvasHeight,
} = worldEnvironmentSlice.actions;

export default worldEnvironmentSlice.reducer;
