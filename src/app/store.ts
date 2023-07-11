import {
  configureStore,
  ThunkAction,
  Action,
  createListenerMiddleware,
  isAnyOf
} from '@reduxjs/toolkit';
//import counterReducer from '../features/counter/counterSlice';
import editorEnvironmentReducer, { setEditorStatus } from '../features/environment/editor/editorEnvironmentSlice';
import worldEnvironmentReducer, { setWorldStatus } from '../features/environment/world/worldEnvironmentSlice';
import environmentManagerReducer, { init } from '../features/environment/environmentManagerSlice';
//import { debounce } from 'lodash';

const reducer = {
  //counter: counterReducer,
  environmentManager: environmentManagerReducer,
  editorEnvironment: editorEnvironmentReducer,
  worldEnvironment: worldEnvironmentReducer
};

export type RootState = ReturnType<typeof store.getState>;

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(setWorldStatus, setEditorStatus),
  effect: async (action, listenerApi) => {
    const state: any = listenerApi.getState();
    //console.log('state:', state);
    if (
      state.worldEnvironment.status === "idle" &&
      state.editorEnvironment.status === "idle"
    ) {
      listenerApi.cancelActiveListeners();
      await listenerApi.delay(250);
      listenerApi.dispatch(init({
        ready: true,
        editorCanvasId: state.worldEnvironment.canvasId,
        worldCanvasId: state.editorEnvironment.canvasId
      }));
    }
  },
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
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
        ignoredPaths: [
          'environmentManager.editorCanvas',
          'environmentManager.worldCanvas'
        ],
      },
    }).prepend(listenerMiddleware.middleware)
});

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
