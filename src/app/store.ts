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
  setWorldNumCols,
  setWorldNumRows,
  setWorldCanvasWidth,
  setWorldCanvasHeight,
} from '../features/world/WorldSlice';
import worldManagerReducer, {
  startWorldSimulation,
  startWorldRendering,
} from '../features/world/WorldManagerSlice';
import { startAppListening, listenerMiddleware } from './listenerMiddleware';
import WorldRendering from '../features/world/WorldRendering';
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

const worldRendering = WorldRendering.getInstance();
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
              // Triggers a call to WorldRendering.init() giving us valid values needed after
              worldRendering.init(
                state,
                worldCanvasContainerEl,
                worldCanvasEl,
              );

              // Dispatch setter actions for canvasHeight, canvasWidth, numCols, numRows values
              listenerApi.dispatch(setWorldCanvasWidth(worldRendering.canvasWidth));
              listenerApi.dispatch(setWorldCanvasHeight(worldRendering.canvasHeight));
              listenerApi.dispatch(setWorldNumCols(worldRendering.numCols));
              listenerApi.dispatch(setWorldNumRows(worldRendering.numRows));

              worldSimulation.init(state);

              listenerApi.dispatch(startWorldSimulation({
                ...state.worldManager,
                worldSimulationRunning: true,
              }));

              listenerApi.dispatch(startWorldRendering({
                ...state.worldManager,
                worldRenderingRunning: true,
              }));
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
