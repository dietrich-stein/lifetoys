import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import WorldSimulation, { DEFAULT_TICKS_DELAY } from './WorldSimulation';
import WorldRenderer from './WorldRenderer';
import Neighbors from '../simulator/SimulatorNeighbors';
import { RootState } from '../../app/store';

export type HyperparamsState = {
  lifespanMultiplier: number;
  foodProdProb: number;
  vulnerableNeighbors: DirectionCoordinates;
  edibleNeighbors: DirectionCoordinates;
  growableNeighbors: DirectionCoordinates;
  useGlobalMutability: boolean;
  globalMutability: number;
  addProb: number;
  changeProb: number;
  removeProb: number;
  rotationEnabled: boolean;
  foodBlocksReproduction: boolean;
  moversCanProduce: boolean;
  isHarmDeadly: boolean;
  lookRange: number;
  seeThroughSelf: boolean;
  foodDropProb: number;
  extraMoverFoodCost: number;
};

// Optionality enables dispatch without including elements
export interface WorldManagerState {
  // Rendering
  worldRendererRunning: boolean;
  worldRendererTime: number;
  worldRendererCellSize: number;
  // Simulation
  worldSimulationRunning: boolean;
  worldSimulationTicks: number;
  worldSimulationTicksDelay: number;
  worldSimulationTime: number;
  worldSimulationTotalLivingOrganisms: number;
  // Other
  hyperparams: HyperparamsState;
}

const initialState: WorldManagerState = {
  // Rendering
  worldRendererRunning: false,
  worldRendererTime: 0,
  worldRendererCellSize: 100,
  // Simulation
  worldSimulationRunning: false,
  worldSimulationTicks: 0,
  worldSimulationTicksDelay: DEFAULT_TICKS_DELAY,
  worldSimulationTime: 0,
  worldSimulationTotalLivingOrganisms: 0,
  // Other
  hyperparams: {
    lifespanMultiplier: 100,
    foodProdProb: 5,
    vulnerableNeighbors: Neighbors.adjacent,
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
    isHarmDeadly: false,
    lookRange: 20,
    seeThroughSelf: false,
    foodDropProb: 0,
    extraMoverFoodCost: 0,
  },
};
const worldRenderer = WorldRenderer.getInstance();
const worldSimulation = WorldSimulation.getInstance();

export const WorldManagerSlice = createSlice({
  name: 'worldManager',
  initialState,
  reducers: {
    // Rendering
    startWorldRenderer: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice, startWorldRenderer, payload:', action.payload);
      state.worldRendererRunning = action.payload.worldRendererRunning;
      worldRenderer.start(action.payload);
    },
    stopWorldRenderer: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.stopWorldRenderer, payload:', action.payload);
      state.worldRendererRunning = action.payload.worldRendererRunning;

      worldRenderer.stop();
    },
    setWorldRendererStats: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.setWorldRendererStats, payload:', action.payload);
      state.worldRendererTime = action.payload.worldRendererTime;
    },
    resetWorldRenderer: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.resetWorldRenderer, payload:', action.payload);
      state.worldRendererRunning = action.payload.worldRendererRunning;
      worldRenderer.reset(action.payload);
    },
    setWorldRendererCellSize: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.setWorldRendererCellSize, payload:', action.payload, 'state:', state);
      state.worldRendererCellSize = action.payload.worldRendererCellSize;
      worldRenderer.reset(action.payload, false, worldSimulation.map);
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
      /*console.log(
        'WorldManagerSlice.setWorldSimulationStats',
        'living:', action.payload.worldSimulationTotalLivingOrganisms,
      );*/

      state.worldSimulationTime = action.payload.worldSimulationTime;
      state.worldSimulationTicks = action.payload.worldSimulationTicks;
      state.worldSimulationTotalLivingOrganisms = action.payload.worldSimulationTotalLivingOrganisms;
    },
    setWorldSimulationTicksDelay: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.setWorldSimulationTicksDelay, payload:', action.payload);
      state.worldSimulationTicksDelay = action.payload.worldSimulationTicksDelay;
      worldSimulation.setTicksDelay(action.payload, action.payload.worldSimulationTicksDelay);
    },
  },
});

export const selectWorldManager = (state: RootState) => state.worldManager;

export const {
  // Rendering
  startWorldRenderer,
  stopWorldRenderer,
  resetWorldRenderer,
  setWorldRendererStats,
  setWorldRendererCellSize,
  // Simulation
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
  setWorldSimulationStats,
  setWorldSimulationTicksDelay,
} = WorldManagerSlice.actions;

export default WorldManagerSlice.reducer;
