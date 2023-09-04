import { RootState } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorldColorSchemeInterface {
  [key: string]: string;
}

// Underscores are used for JSON-serializable objects
export interface WorldConfigState {
  fill_window: boolean;
  num_random_orgs: number;
  clear_walls_on_reset: boolean;
  auto_reset: boolean;
  brush_size: number;
  color_scheme: WorldColorSchemeInterface;
}

export interface WorldState {
  status: 'idle' | 'loading';
  canvasId: string | null;
  canvasContainerId: string | null;
  numCols: number;
  numRows: number;
  config: WorldConfigState;
}

const initialState: WorldState = {
  status: 'loading',
  canvasId: null,
  canvasContainerId: null,
  numCols: 5,
  numRows: 5,
  config: {
    fill_window: true,
    num_random_orgs: 100,
    clear_walls_on_reset: false,
    auto_reset: false,
    brush_size: 2,
    color_scheme: {
      empty: 'rgb(0, 0, 128)',
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

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    initWorld: (state, action: PayloadAction<WorldState>) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      state.canvasContainerId = action.payload.canvasContainerId;
    },
    setWorldNumCols: (state, action: PayloadAction<number>) => {
      state.numCols = action.payload;
    },
    setWorldNumRows: (state, action: PayloadAction<number>) => {
      state.numRows = action.payload;
    },
    setWorldColors: (state, action: PayloadAction<WorldState>) => {
      console.log('World, setWorldColors, payload:', action.payload);
    },
  },
});

export const selectWorld = (state: RootState) => state.world;

export const {
  initWorld,
  setWorldNumCols,
  setWorldNumRows,
  setWorldColors,
} = worldSlice.actions;

export default worldSlice.reducer;
