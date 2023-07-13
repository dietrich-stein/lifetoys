import {
  configureStore,
  ThunkAction,
  Action,
  isAnyOf,
} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import engineReducer, {
  startSimulation,
  stopSimulation,
  resetSimulation,
  startRendering,
  stopRendering,
} from '../features/engine/engineSlice';
import editorEnvironmentReducer, { setEditorStatus } from '../features/environment/editor/editorEnvironmentSlice';
import worldEnvironmentReducer, { setWorldStatus } from '../features/environment/world/worldEnvironmentSlice';
import environmentManagerReducer, { init } from '../features/environment/environmentManagerSlice';
//import { debounce } from 'lodash';
import { startAppListening, listenerMiddleware } from './listenerMiddleware';
import EngineSimulation from '../features/engine/EngineSimulation';
import EngineRendering from '../features/engine/EngineRendering';

const reducer = {
  counter: counterReducer,
  engine: engineReducer,
  environmentManager: environmentManagerReducer,
  editorEnvironment: editorEnvironmentReducer,
  worldEnvironment: worldEnvironmentReducer,
};

export type RootState = ReturnType<typeof store.getState>;

startAppListening({
  matcher: isAnyOf(
    setWorldStatus,
    setEditorStatus,
    startRendering,
    stopRendering,
    startSimulation,
    stopSimulation,
    resetSimulation,
  ),
  effect: async (action, listenerApi) => {
    let state: RootState = listenerApi.getState();

    //console.log(action.type);
    const engineSimulation = EngineSimulation.getInstance();
    const engineRendering = EngineRendering.getInstance();

    switch (action.type) {
      case 'engine/startRendering':
        engineRendering.start();
        break;

      case 'engine/stopRendering':
        engineRendering.stop();
        break;

      case 'engine/startSimulation':
        engineSimulation.start();
        break;

      case 'engine/stopSimulation':
        engineSimulation.stop();
        break;

      case 'engine/resetSimulation':
        engineSimulation.reset();
        break;

      case 'editorEnvironment/setEditorStatus':
      case 'worldEnvironment/setEditorStatus':
        if (
          state.worldEnvironment.status === 'idle' &&
          state.editorEnvironment.status === 'idle'
        ) {
          listenerApi.cancelActiveListeners();

          // Effectively debounces the dispatches that follow it
          await listenerApi.delay(250);

          listenerApi.dispatch(init({
            ready: true,
            editorCanvasId: state.editorEnvironment.canvasId,
            editorCanvasContainerId: state.editorEnvironment.canvasContainerId,
            worldCanvasId: state.worldEnvironment.canvasId,
            worldCanvasContainerId: state.worldEnvironment.canvasContainerId,
          }));

          // Refresh the state
          //state = listenerApi.getState();
          //if (
            //state.environmentManager.editorCanvas !== null &&
            //state.environmentManager.worldCanvas !== null
          //) {
            /*const simulationStopTimeValue = (state.engine.simulationStopTime !== null)
              ? state.engine.simulationStopTime
              : 0;

            listenerApi.dispatch(startSimulation({
              ...state.engine,
              simulationStartTime: simulationStopTimeValue,
              simulationStopTime: null,
            }));*/
          //}
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
