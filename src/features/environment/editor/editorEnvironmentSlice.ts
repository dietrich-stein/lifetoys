import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorEnvironmentState {
  status: 'idle' | 'loading';
  canvasId: string | null;
}

const initialState: EditorEnvironmentState = {
  status: 'loading',
  canvasId: null
};

export const editorEnvironmentSlice = createSlice({
  name: 'editorEnvironment',
  initialState,
  reducers: {
    setEditorStatus: (state, action: PayloadAction<EditorEnvironmentState>) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      //console.log('setEditorStatus, state:', state);
    },
  },
});

export const {
  setEditorStatus
} = editorEnvironmentSlice.actions;

export default editorEnvironmentSlice.reducer;
