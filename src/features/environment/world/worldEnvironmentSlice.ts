import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorldEnvironmentState {
  status: 'idle' | 'loading';
  canvasId: string | null;
}

const initialState: WorldEnvironmentState = {
  status: 'loading',
  canvasId: null
};

export const worldEnvironmentSlice = createSlice({
  name: 'worldEnvironment',
  initialState,
  reducers: {
    setWorldStatus: (
      state,
      action: PayloadAction<WorldEnvironmentState>
    ) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      //console.log('setWorldStatus, state:', state);
    },
  },
});

export const {
  setWorldStatus
} = worldEnvironmentSlice.actions;

export default worldEnvironmentSlice.reducer;
