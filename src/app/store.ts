import {
  configureStore,
  ThunkAction,
  Action,
  isAnyOf,
} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import editorEnvironmentReducer, { setEditorStatus } from '../features/environment/editor/editorEnvironmentSlice';
import worldEnvironmentReducer, { setWorldStatus } from '../features/environment/world/worldEnvironmentSlice';
import environmentManagerReducer, {
  init,
  startWorldSimulation,
  startWorldRendering,
} from '../features/environment/environmentManagerSlice';
import { startAppListening, listenerMiddleware } from './listenerMiddleware';

const reducer = {
  counter: counterReducer,
  environmentManager: environmentManagerReducer,
  editorEnvironment: editorEnvironmentReducer,
  worldEnvironment: worldEnvironmentReducer,
};

export type RootState = ReturnType<typeof store.getState>;

startAppListening({
  matcher: isAnyOf(
    setWorldStatus,
    setEditorStatus,
  ),
  effect: async (action, listenerApi) => {
    let state: RootState = listenerApi.getState();

    switch (action.type) {
      case 'editorEnvironment/setEditorStatus':
      case 'worldEnvironment/setWorldStatus':
        if (
          state.worldEnvironment.status === 'idle' &&
          state.editorEnvironment.status === 'idle'
        ) {
          listenerApi.cancelActiveListeners();

          // Effectively debounces the dispatches that follow it
          await listenerApi.delay(250);

          listenerApi.dispatch(init({
            ...state.environmentManager,
            ready: true,
            editorCanvasId: state.editorEnvironment.canvasId,
            editorCanvasContainerId: state.editorEnvironment.canvasContainerId,
            worldCanvasId: state.worldEnvironment.canvasId,
            worldCanvasContainerId: state.worldEnvironment.canvasContainerId,
          }));

          listenerApi.dispatch(startWorldSimulation({
            ...state.environmentManager,
            worldSimulationRunning: true,
          }));

          listenerApi.dispatch(startWorldRendering({
            ...state.environmentManager,
            worldRenderingRunning: true,
          }));
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
