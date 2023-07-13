import { RootState } from '../../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorldEnvironmentColorSchemeInterface {
  [key: string]: string;
}

// Underscores are used for JSON-serializable objects
export interface WorldEnvironmentConfigState {
  fill_window: boolean;
  cell_size: number;
  num_cols: number;
  num_rows: number;
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
  config: WorldEnvironmentConfigState;
}

const initialState: WorldEnvironmentState = {
  status: 'loading',
  canvasId: null,
  canvasContainerId: null,
  config: {
    fill_window: true,
    cell_size: 5,
    num_cols: 100,
    num_rows: 100,
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

export const worldEnvironmentSlice = createSlice({
  name: 'worldEnvironment',
  initialState,
  reducers: {
    setWorldStatus: (
      state, action: PayloadAction<WorldEnvironmentState>,
    ) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      state.canvasContainerId = action.payload.canvasContainerId;
    },
    setWorldColors: (
      state, action: PayloadAction<WorldEnvironmentState>,
    ) => {
      //
    },
  },
});

export const selectWorldEnvironment = (state: RootState) => state.worldEnvironment;

export const {
  setWorldStatus,
  setWorldColors,
} = worldEnvironmentSlice.actions;

export default worldEnvironmentSlice.reducer;
