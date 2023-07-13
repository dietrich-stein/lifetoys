import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import EngineSimulation from '../engine/EngineSimulation';
import EngineRendering from '../engine/EngineRendering';

// Optionality enables dispatch without including elements
export interface EnvironmentManagerState {
  ready: boolean;
  editorCanvasId: string | null;
  //editorCanvas?: any;//HTMLCanvasElement | null;
  editorCanvasContainerId: string | null;
  //editorCanvasContainer?: any;
  worldCanvasId: string | null;
  //worldCanvas?: any;//HTMLCanvasElement | null;
  worldCanvasContainerId: string | null;
  //worldCanvasContainer?: any;
}

const initialState: EnvironmentManagerState = {
  ready: false,
  editorCanvasId: null,
  //editorCanvas: null,
  editorCanvasContainerId: null,
  //editorCanvasContainer: null,
  worldCanvasId: null,
  //worldCanvas: null,
  worldCanvasContainerId: null,
  //worldCanvasContainer: null,
};

/*function isObject(input: any) :input is Record<string,any> {
  return (input !== null) && (typeof input === 'object');
}*/

function isHTMLDivElement(input: any): input is HTMLDivElement {
  return (input) && (input !== null) && (input.tagName === 'DIV');
}

function isHTMLCanvasElement(input: any): input is HTMLCanvasElement {
  return (input) && (input !== null) && (input.tagName === 'CANVAS');
}

export const environmentManagerSlice = createSlice({
  name: 'environmentManager',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<EnvironmentManagerState>) => {
      console.log('environmentManager.init', action.payload);
      state.ready = action.payload.ready;

      // Ensuring ready is how we know the DOM elements are mounted.
      if (
        state.ready &&
        typeof action.payload.editorCanvasId === 'string' &&
        typeof action.payload.editorCanvasContainerId === 'string' &&
        typeof action.payload.worldCanvasId === 'string' &&
        typeof action.payload.worldCanvasContainerId === 'string'
      ) {
        state.editorCanvasId = action.payload.editorCanvasId;
        state.editorCanvasContainerId = action.payload.editorCanvasContainerId;
        state.worldCanvasId = action.payload.worldCanvasId;
        state.worldCanvasContainerId = action.payload.worldCanvasContainerId;

        let editorCanvasEl = document.getElementById(state.editorCanvasId);// as HTMLCanvasElement | null;
        let editorCanvasContainerEl = document.getElementById(state.editorCanvasContainerId);
        let worldCanvasEl = document.getElementById(state.worldCanvasId);// as HTMLCanvasElement | null;
        let worldCanvasContainerEl = document.getElementById(state.worldCanvasContainerId);

        if (
          isHTMLCanvasElement(editorCanvasEl) &&
          isHTMLDivElement(editorCanvasContainerEl) &&
          isHTMLCanvasElement(worldCanvasEl) &&
          isHTMLDivElement(worldCanvasContainerEl)
        ) {
          //const engineSimulation = EngineSimulation.getInstance();
          const engineRendering = EngineRendering.getInstance();

          engineRendering.fillWindow(worldCanvasContainerEl, worldCanvasEl);

          // FIXME: Not using `any` in the interface results in errors like:
          // Type 'HTMLCanvasElement' is not assignable to type 'WritableDraft<HTMLCanvasElement>'.
          //state.editorCanvas = action.payload.editorCanvas;//editorCanvasEl;
          //state.worldCanvas = action.payload.editorCanvas;//worldCanvasEl;
          //state.editorCanvasContainer = editorCanvasEl.parentElement();
        }
      }
    },
  },
});

export const {
  init,
} = environmentManagerSlice.actions;

export default environmentManagerSlice.reducer;
