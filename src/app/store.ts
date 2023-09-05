import {
  configureStore,
  ThunkAction,
  Action,
  isAnyOf,
} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import editorReducer, { initEditor } from '../features/editor/EditorSlice';
import worldReducer, {
  initWorld,
  //setWorldNumCols,
  //setWorldNumRows,
} from '../features/world/WorldSlice';
import worldManagerReducer, {
  startWorldSimulation,
  startWorldRenderer,
} from '../features/world/WorldManagerSlice';
import { startAppListening, listenerMiddleware } from './listenerMiddleware';
import WorldRenderer from '../features/world/WorldRenderer';
import WorldSimulation from '../features/world/WorldSimulation';

const reducer = {
  counter: counterReducer,
  worldManager: worldManagerReducer,
  world: worldReducer,
  editor: editorReducer,
};

export type RootState = ReturnType<typeof store.getState>;

function isHTMLDivElement(input: any): input is HTMLDivElement {
  return (input) && (input !== null) && (input.tagName === 'DIV');
}

function isHTMLCanvasElement(input: any): input is HTMLCanvasElement {
  return (input) && (input !== null) && (input.tagName === 'CANVAS');
}

const worldRenderer = WorldRenderer.getInstance();
const worldSimulation = WorldSimulation.getInstance();

startAppListening({
  matcher: isAnyOf(
    initEditor,
    initWorld,
  ),
  effect: async (action, listenerApi) => {
    let state: RootState = listenerApi.getState();

    switch (action.type) {
      case 'editor/initEditor':
      case 'world/initWorld':
        if (
          state.world.status === 'idle' &&
          state.editor.status === 'idle'
        ) {
          listenerApi.cancelActiveListeners();

          // Effectively debounces the dispatches that follow it
          await listenerApi.delay(1000);

          //console.log('store, startAppListening, effect');

          if (
            typeof state.editor.canvasId === 'string' &&
            typeof state.editor.canvasContainerId === 'string' &&
            typeof state.world.canvasId === 'string' &&
            typeof state.world.canvasContainerId === 'string'
          ) {
            let editorCanvasEl = document.getElementById(state.editor.canvasId);
            let editorCanvasContainerEl = document.getElementById(state.editor.canvasContainerId);
            let worldCanvasEl = document.getElementById(state.world.canvasId);
            let worldCanvasContainerEl = document.getElementById(state.world.canvasContainerId);

            if (
              isHTMLCanvasElement(editorCanvasEl) &&
              isHTMLDivElement(editorCanvasContainerEl) &&
              isHTMLCanvasElement(worldCanvasEl) &&
              isHTMLDivElement(worldCanvasContainerEl)
            ) {
              worldRenderer.init(state, worldCanvasContainerEl, worldCanvasEl);
              listenerApi.dispatch(startWorldRenderer({
                ...state.worldManager,
                worldRendererRunning: true,
              }));

              worldSimulation.init();
              listenerApi.dispatch(startWorldSimulation({
                ...state.worldManager,
                worldSimulationRunning: true,
              }));

              // Dispatch setter actions for canvasHeight, canvasWidth, numCols, numRows values
              //listenerApi.dispatch(setWorldNumCols(worldRenderer.numCols));
              //listenerApi.dispatch(setWorldNumRows(worldRenderer.numRows));
            }
          }
        }

        break;
    }
  },
});

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: [
        //'worldManager/init'
        //'editor/setWorldStatus',
        //'editor/setEditorStatus'
      ],

      // Ignore these field paths in all actions
      //ignoredActionPaths: ['meta.arg', 'payload.timestamp'],

      // Ignore these paths in the state
      /*ignoredPaths: [
        'worldManager.editorCanvas',
        'worldManager.worldCanvas',
      ],*/
    },
  }).prepend(listenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
