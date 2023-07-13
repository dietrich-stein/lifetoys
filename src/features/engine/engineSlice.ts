import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Neighbors from '../grid/Neighbors';

type HyperparamsState = {
  lifespanMultiplier: number;
  foodProdProb: number;
  killableNeighbors: number[][];
  edibleNeighbors: number[][];
  growableNeighbors: number[][];
  useGlobalMutability: boolean;
  globalMutability: number;
  addProb: number;
  changeProb: number;
  removeProb: number;
  rotationEnabled: boolean;
  foodBlocksReproduction: boolean;
  moversCanProduce: boolean;
  instaKill: boolean;
  lookRange: number;
  seeThroughSelf: boolean;
  foodDropProb: number;
  extraMoverFoodCost: number;
};

export interface EngineState {
  hyperparams: HyperparamsState;
  //renderingStartTime: number | null;
  //renderingStopTime: number | null;
  renderingRunning: boolean;
  simulationRunning: boolean;
}

const initialState: EngineState = {
  hyperparams: {
    lifespanMultiplier: 100,
    foodProdProb: 5,
    killableNeighbors: Neighbors.adjacent,
    edibleNeighbors: Neighbors.adjacent,
    growableNeighbors: Neighbors.adjacent,
    useGlobalMutability: false,
    globalMutability: 5,
    addProb: 33,
    changeProb: 33,
    removeProb: 33,
    rotationEnabled: true,
    foodBlocksReproduction: true,
    moversCanProduce: false,
    instaKill: false,
    lookRange: 20,
    seeThroughSelf: false,
    foodDropProb: 0,
    extraMoverFoodCost: 0,
  },
  //renderingStartTime: null,
  //renderingStopTime: 0,
  renderingRunning: false,
  simulationRunning: false,
};

export const engineSlice = createSlice({
  name: 'engine',
  initialState,
  reducers: {
    startRendering: (state, action: PayloadAction<EngineState>) => {
      //console.log('engine.startRendering, payload:', action.payload);
      //state.renderingStartTime = action.payload.renderingStartTime;
      //state.renderingStopTime = action.payload.renderingStopTime;
      state.renderingRunning = action.payload.renderingRunning;
    },
    stopRendering: (state, action: PayloadAction<EngineState>) => {
      //console.log('engine.stopRendering, payload:', action.payload);
      //state.renderingStartTime = action.payload.renderingStartTime;
      //state.renderingStopTime = action.payload.renderingStopTime;
      state.renderingRunning = action.payload.renderingRunning;
    },
    startSimulation: (state, action: PayloadAction<EngineState>) => {
      //console.log('engine.startSimulation, payload:', action.payload);
      state.simulationRunning = action.payload.simulationRunning;
    },
    stopSimulation: (state, action: PayloadAction<EngineState>) => {
      //console.log('engine.stopSimulation, payload:', action.payload);
      state.simulationRunning = action.payload.simulationRunning;
    },
    resetSimulation: (state, action: PayloadAction<EngineState>) => {
      //console.log('engine.stopSimulation, payload:', action.payload);
      state.simulationRunning = action.payload.simulationRunning;
    },
  },
});

export const selectEngine = (state: RootState) => state.engine;

export const {
  startRendering,
  stopRendering,
  startSimulation,
  stopSimulation,
  resetSimulation,
} = engineSlice.actions;

export default engineSlice.reducer;
