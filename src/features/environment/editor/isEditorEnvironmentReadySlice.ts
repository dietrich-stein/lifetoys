import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorEnvironmentState {
  status: 'idle' | 'loading';
}

const initialState: EditorEnvironmentState = {
  status: 'loading'
};

export const isEditorEnvironmentReadySlice = createSlice({
  name: 'isEditorEnvironmentReady',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<EditorEnvironmentState>) => {
      state.status = action.payload.status;
    },
  },
});

export const {
  setStatus
} = isEditorEnvironmentReadySlice.actions;

export default isEditorEnvironmentReadySlice.reducer;
