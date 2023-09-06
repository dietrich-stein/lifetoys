import { RootState } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorldState {
  status: 'idle' | 'loading';
  canvasId: string | null;
  canvasContainerId: string | null;
  numCols: number;
  numRows: number;
}

const initialState: WorldState = {
  status: 'loading',
  canvasId: null,
  canvasContainerId: null,
  numCols: 5,
  numRows: 5,
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
