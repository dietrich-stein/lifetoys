import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import WorldSimulation, { DEFAULT_TICKS_DELAY } from './WorldSimulation';
import WorldRendering from './WorldRendering';
import Neighbors from '../grid/Neighbors';
import { RootState } from '../../app/store';

export type HyperparamsState = {
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

// Optionality enables dispatch without including elements
export interface WorldManagerState {
  // Rendering
  worldRenderingRunning: boolean;
  worldRenderingTime: number;
  // Simulation
  worldSimulationRunning: boolean;
  worldSimulationTicks: number;
  worldSimulationTicksDelay: number;
  worldSimulationTime: number;
  // Other
  hyperparams: HyperparamsState;
}

const initialState: WorldManagerState = {
  // Rendering
  worldRenderingRunning: false,
  worldRenderingTime: 0,
  // Simulation
  worldSimulationRunning: false,
  worldSimulationTicks: 0,
  worldSimulationTicksDelay: DEFAULT_TICKS_DELAY,
  worldSimulationTime: 0,
  // Other
  hyperparams: {
    lifespanMultiplier: 100,
    foodProdProb: 5,
    killableNeighbors: Neighbors.adjacent,
    edibleNeighbors: Neighbors.adjacent,
    growableNeighbors: Neighbors.adjacent,
    useGlobalMutability: true, // false
    globalMutability: 15, // 5
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
};
const worldRendering = WorldRendering.getInstance();
const worldSimulation = WorldSimulation.getInstance();

export const WorldManagerSlice = createSlice({
  name: 'worldManager',
  initialState,
  reducers: {
    // Rendering
    startWorldRendering: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice, startWorldRendering, payload:', action.payload);
      state.worldRenderingRunning = action.payload.worldRenderingRunning;
      worldRendering.start(action.payload);
    },
    stopWorldRendering: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.stopWorldRendering, payload:', action.payload);
      state.worldRenderingRunning = action.payload.worldRenderingRunning;

      worldRendering.stop();
    },
    setWorldRenderingStats: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.setWorldRenderingStats, payload:', action.payload);
      state.worldRenderingTime = action.payload.worldRenderingTime;
    },
    resetWorldRendering: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.resetWorldRendering, payload:', action.payload);
      state.worldRenderingRunning = action.payload.worldRenderingRunning;
      worldRendering.reset();
    },
    setWorldRenderingCellSize: (state, action: PayloadAction<WorldManagerState>) => {
      console.log('WorldManagerSlice.setWorldRenderingCellSize, payload:', action.payload, 'state:', state);
    },

    // Simulation
    startWorldSimulation: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice, startWorldSimulation, payload:', action.payload);
      state.worldSimulationRunning = action.payload.worldSimulationRunning;
      worldSimulation.start(action.payload);
    },
    stopWorldSimulation: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.stopWorldSimulation, payload:', action.payload);
      state.worldSimulationRunning = action.payload.worldSimulationRunning;
      worldSimulation.stop();
    },
    resetWorldSimulation: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.stopWorldSimulation, payload:', action.payload);
      state.worldSimulationTicksDelay = action.payload.worldSimulationTicksDelay;
      state.worldSimulationRunning = action.payload.worldSimulationRunning;
      worldSimulation.reset();
    },
    setWorldSimulationStats: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.setWorldSimulationStats, payload:', action.payload);
      state.worldSimulationTime = action.payload.worldSimulationTime;
      state.worldSimulationTicks = action.payload.worldSimulationTicks;
    },
    setWorldSimulationTicksDelay: (state, action: PayloadAction<WorldManagerState>) => {
      console.log('WorldManagerSlice.setWorldSimulationTicksDelay, payload:', action.payload);
      state.worldSimulationTicksDelay = action.payload.worldSimulationTicksDelay;
      worldSimulation.setTicksDelay(action.payload, action.payload.worldSimulationTicksDelay);
    },
  },
});

export const selectEnvironmentManager = (state: RootState) => state.worldManager;

export const {
  // Rendering
  startWorldRendering,
  stopWorldRendering,
  resetWorldRendering,
  setWorldRenderingStats,
  setWorldRenderingCellSize,
  // Simulation
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
  setWorldSimulationStats,
  setWorldSimulationTicksDelay,
} = WorldManagerSlice.actions;

export default WorldManagerSlice.reducer;
