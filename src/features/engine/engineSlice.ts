import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface EngineState {
  renderingStartTime: number | null;
  renderingStopTime: number | null;
  simulationStartTime: number | null;
  simulationStopTime: number | null;
}

const initialState: EngineState = {
  renderingStartTime: 0,
  renderingStopTime: 0,
  simulationStartTime: 0,
  simulationStopTime: 0,
};

export const engineSlice = createSlice({
  name: 'engine',
  initialState,
  reducers: {
    startRendering: (
      state,
      action: PayloadAction<EngineState>
    ) => {
      //console.log('engine.startRendering, payload:', action.payload);
      state.renderingStartTime = action.payload.renderingStartTime;
      state.renderingStopTime = action.payload.renderingStopTime;
    },
    stopRendering: (
      state,
      action: PayloadAction<EngineState>
    ) => {
      //console.log('engine.stopRendering, payload:', action.payload);
      state.renderingStartTime = action.payload.renderingStartTime;
      state.renderingStopTime = action.payload.renderingStopTime;
    },
    startSimulation: (
      state,
      action: PayloadAction<EngineState>
    ) => {
      //console.log('engine.startSimulation, payload:', action.payload);
      state.simulationStartTime = action.payload.simulationStartTime;
      state.simulationStopTime = action.payload.simulationStopTime;
    },
    stopSimulation: (
      state,
      action: PayloadAction<EngineState>
    ) => {
      //console.log('engine.stopSimulation, payload:', action.payload);
      state.simulationStartTime = action.payload.simulationStartTime;
      state.simulationStopTime = action.payload.simulationStopTime;
    },
  },
});

export const selectEngine = (state: RootState) => state.engine;

export const {
  startRendering,
  stopRendering,
  startSimulation,
  stopSimulation,
} = engineSlice.actions;

export default engineSlice.reducer;
