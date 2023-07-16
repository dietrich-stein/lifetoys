import { RootState } from '../../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorEnvironmentState {
  status: 'idle' | 'loading';
  canvasId: string | null;
  canvasContainerId: string | null;
}

const initialState: EditorEnvironmentState = {
  status: 'loading',
  canvasId: null,
  canvasContainerId: null,
};

export const editorEnvironmentSlice = createSlice({
  name: 'editorEnvironment',
  initialState,
  reducers: {
    initEditorEnvironment: (state, action: PayloadAction<EditorEnvironmentState>) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      state.canvasContainerId = action.payload.canvasContainerId;
    },
  },
});

export const {
  initEditorEnvironment,
} = editorEnvironmentSlice.actions;

export const selectEditorEnvironment = (state: RootState) => state.editorEnvironment;

export default editorEnvironmentSlice.reducer;
