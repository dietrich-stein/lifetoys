import {
  configureStore,
  ThunkAction,
  Action,
  isAnyOf,
} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import editorEnvironmentReducer, { initEditorEnvironment } from '../features/environment/editor/editorEnvironmentSlice';
import worldEnvironmentReducer, {
  initWorldEnvironment,
  setWorldNumCols,
  setWorldNumRows,
  setWorldCanvasWidth,
  setWorldCanvasHeight,
} from '../features/environment/world/worldEnvironmentSlice';
import environmentManagerReducer, {
  //initEnvironmentManager,
  startWorldSimulation,
  startWorldRendering,
} from '../features/environment/environmentManagerSlice';
import { startAppListening, listenerMiddleware } from './listenerMiddleware';
//import WorldSimulation from './WorldSimulation';
import WorldRendering from '../features/environment/world/WorldRendering';

const reducer = {
  counter: counterReducer,
  environmentManager: environmentManagerReducer,
  editorEnvironment: editorEnvironmentReducer,
  worldEnvironment: worldEnvironmentReducer,
};

export type RootState = ReturnType<typeof store.getState>;

function isHTMLDivElement(input: any): input is HTMLDivElement {
  return (input) && (input !== null) && (input.tagName === 'DIV');
}

function isHTMLCanvasElement(input: any): input is HTMLCanvasElement {
  return (input) && (input !== null) && (input.tagName === 'CANVAS');
}

const worldRendering = WorldRendering.getInstance();
//const worldSimulation = WorldSimulation.getInstance();

startAppListening({
  matcher: isAnyOf(
    initEditorEnvironment,
    initWorldEnvironment,
  ),
  effect: async (action, listenerApi) => {
    let state: RootState = listenerApi.getState();

    switch (action.type) {
      case 'editorEnvironment/initEditorEnvironment':
      case 'worldEnvironment/initWorldEnvironment':
        if (
          state.worldEnvironment.status === 'idle' &&
          state.editorEnvironment.status === 'idle'
        ) {
          listenerApi.cancelActiveListeners();

          // Effectively debounces the dispatches that follow it
          await listenerApi.delay(1000);

          //console.log('debounced?');

          // Keeping this around awhile because it shows how to combine states on an action
          /*listenerApi.dispatch(initEnvironmentManager({
            environmentManager: {
              ...state.environmentManager,
              ready: true,
              editorCanvasId: state.editorEnvironment.canvasId,
              editorCanvasContainerId: state.editorEnvironment.canvasContainerId,
              worldCanvasId: state.worldEnvironment.canvasId,
              worldCanvasContainerId: state.worldEnvironment.canvasContainerId,
            },
            worldEnvironment: {
              ...state.worldEnvironment,
            },
          }));*/

          if (
            //state.environmentManager.ready &&
            typeof state.editorEnvironment.canvasId === 'string' &&
            typeof state.editorEnvironment.canvasContainerId === 'string' &&
            typeof state.worldEnvironment.canvasId === 'string' &&
            typeof state.worldEnvironment.canvasContainerId === 'string'
          ) {
            let editorCanvasEl = document.getElementById(state.editorEnvironment.canvasId);
            let editorCanvasContainerEl = document.getElementById(state.editorEnvironment.canvasContainerId);
            let worldCanvasEl = document.getElementById(state.worldEnvironment.canvasId);
            let worldCanvasContainerEl = document.getElementById(state.worldEnvironment.canvasContainerId);

            if (
              isHTMLCanvasElement(editorCanvasEl) &&
              isHTMLDivElement(editorCanvasContainerEl) &&
              isHTMLCanvasElement(worldCanvasEl) &&
              isHTMLDivElement(worldCanvasContainerEl)
            ) {
              worldRendering.initWorldRendering(
                worldCanvasContainerEl,
                worldCanvasEl,
                state.worldEnvironment.cellSize,
              );

              // The previous action triggered a call to WorldRendering.init() giving us valid values for the following:
              //   canvasHeight, canvasWidth, numCols, numRows

              // Now we need to dispatch the store setter actions for those values
              listenerApi.dispatch(setWorldCanvasWidth(worldRendering.canvasWidth));
              listenerApi.dispatch(setWorldCanvasHeight(worldRendering.canvasHeight));
              listenerApi.dispatch(setWorldNumCols(worldRendering.numCols));
              listenerApi.dispatch(setWorldNumRows(worldRendering.numRows));

              listenerApi.dispatch(startWorldSimulation({ ...state.environmentManager, worldSimulationRunning: true }));
              listenerApi.dispatch(startWorldRendering({
                ...state.environmentManager,
                worldRenderingRunning: true,
              }));
            }
          }
          /**/
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
        //'environmentManager/init'
        //'editorEnvironment/setWorldStatus',
        //'editorEnvironment/setEditorStatus'
      ],

      // Ignore these field paths in all actions
      //ignoredActionPaths: ['meta.arg', 'payload.timestamp'],

      // Ignore these paths in the state
      /*ignoredPaths: [
        'environmentManager.editorCanvas',
        'environmentManager.worldCanvas',
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
