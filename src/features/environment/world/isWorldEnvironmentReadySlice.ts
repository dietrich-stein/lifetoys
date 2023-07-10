import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorldEnvironmentState {
  status: 'idle' | 'loading';
}

const initialState: WorldEnvironmentState = {
  status: 'loading'
};

export const isWorldEnvironmentReadySlice = createSlice({
  name: 'isWorldEnvironmentReady',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setStatus: (state, action: PayloadAction<WorldEnvironmentState>) => {
      state.status = action.payload.status;
    },
  },
});

export const { 
  setStatus
} = isWorldEnvironmentReadySlice.actions;

export default isWorldEnvironmentReadySlice.reducer;
