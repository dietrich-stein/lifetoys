import { RootState } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorldState {
  status: 'idle' | 'loading';
  canvasId: string | null;
  canvasContainerId: string | null;
}

const initialState: WorldState = {
  status: 'loading',
  canvasId: null,
  canvasContainerId: null,
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
    setWorldColors: (state, action: PayloadAction<WorldState>) => {
      console.log('World, setWorldColors, payload:', action.payload);
    },
  },
});

export const selectWorld = (state: RootState) => state.world;

export const {
  initWorld,
  setWorldColors,
} = worldSlice.actions;

export default worldSlice.reducer;
