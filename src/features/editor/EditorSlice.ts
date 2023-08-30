import { RootState } from '../../app/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  status: 'idle' | 'loading';
  canvasId: string | null;
  canvasContainerId: string | null;
}

const initialState: EditorState = {
  status: 'loading',
  canvasId: null,
  canvasContainerId: null,
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    initEditor: (state, action: PayloadAction<EditorState>) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      state.canvasContainerId = action.payload.canvasContainerId;
    },
  },
});

export const {
  initEditor,
} = editorSlice.actions;

export const selectEditor = (state: RootState) => state.editor;

export default editorSlice.reducer;
