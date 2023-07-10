import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import isEditorEnvironmentReadyReducer from '../features/environment/editor/isEditorEnvironmentReadySlice';
import isWorldEnvironmentReadyReducer from '../features/environment/world/isWorldEnvironmentReadySlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    isEditorEnvironmentReady: isEditorEnvironmentReadyReducer, 
    isWorldEnvironmentReady: isWorldEnvironmentReadyReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
