import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EnvironmentManagerState {
  ready: boolean;
  editorCanvasId: string | null;
  editorCanvas?: any;//HTMLCanvasElement | null;
  worldCanvasId: string | null;
  worldCanvas?: any;//HTMLCanvasElement | null;
}

const initialState: EnvironmentManagerState = {
  ready: false,
  editorCanvasId: null,
  editorCanvas: null,
  worldCanvasId: null,
  worldCanvas: null,
};

export const environmentManagerSlice = createSlice({
  name: 'environmentManager',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.init', action.payload);
      state.ready = action.payload.ready;

      if (
        state.ready &&
        typeof action.payload.editorCanvasId === 'string' &&
        typeof action.payload.worldCanvasId === 'string'
      ) {
        state.editorCanvasId = action.payload.editorCanvasId;
        state.worldCanvasId = action.payload.worldCanvasId;

        let editorCanvasEl = document.getElementById(state.editorCanvasId) as HTMLCanvasElement | null;
        let worldCanvasEl = document.getElementById(state.worldCanvasId) as HTMLCanvasElement | null;

        if (editorCanvasEl !== null && worldCanvasEl !== null) {
          state.editorCanvas = editorCanvasEl;
          state.worldCanvas = worldCanvasEl;
          console.log('environmentManager.init', state.editorCanvas, state.worldCanvas);
        }
      }
    },
  },
});

export const {
  init,
} = environmentManagerSlice.actions;

export default environmentManagerSlice.reducer;
