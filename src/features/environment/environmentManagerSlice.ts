import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import WorldSimulation, { DEFAULT_TICKS_DELAY } from './world/WorldSimulation';
import WorldRendering from './world/WorldRendering';
import Neighbors from '../grid/Neighbors';
import { RootState } from '../../app/store';

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

// Optionality enables dispatch without including elements
export interface EnvironmentManagerState {
  ready: boolean;
  editorCanvasId: string | null;
  editorCanvasContainerId: string | null;
  worldCanvasId: string | null;
  worldCanvasContainerId: string | null;
  hyperparams: HyperparamsState;
  worldRenderingRunning: boolean;
  worldRenderingTime: number;
  worldSimulationRunning: boolean;
  worldSimulationTicks: number;
  worldSimulationTicksDelay: number;
  worldSimulationTime: number;
}

const initialState: EnvironmentManagerState = {
  ready: false,
  editorCanvasId: null,
  editorCanvasContainerId: null,
  worldCanvasId: null,
  worldCanvasContainerId: null,
  worldRenderingRunning: false,
  worldRenderingTime: 0,
  worldSimulationRunning: false,
  worldSimulationTicks: 0,
  worldSimulationTicksDelay: DEFAULT_TICKS_DELAY,
  worldSimulationTime: 0,
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
};

function isHTMLDivElement(input: any): input is HTMLDivElement {
  return (input) && (input !== null) && (input.tagName === 'DIV');
}

function isHTMLCanvasElement(input: any): input is HTMLCanvasElement {
  return (input) && (input !== null) && (input.tagName === 'CANVAS');
}

const worldRendering = WorldRendering.getInstance();
const worldSimulation = WorldSimulation.getInstance();

export const environmentManagerSlice = createSlice({
  name: 'environmentManager',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<EnvironmentManagerState>) => {
      console.log('environmentManager.init', action.payload);
      state.ready = action.payload.ready;

      // Ensuring ready is how we know the DOM elements are mounted.
      if (
        state.ready &&
        typeof action.payload.editorCanvasId === 'string' &&
        typeof action.payload.editorCanvasContainerId === 'string' &&
        typeof action.payload.worldCanvasId === 'string' &&
        typeof action.payload.worldCanvasContainerId === 'string'
      ) {
        state.editorCanvasId = action.payload.editorCanvasId;
        state.editorCanvasContainerId = action.payload.editorCanvasContainerId;
        state.worldCanvasId = action.payload.worldCanvasId;
        state.worldCanvasContainerId = action.payload.worldCanvasContainerId;

        let editorCanvasEl = document.getElementById(state.editorCanvasId);// as HTMLCanvasElement | null;
        let editorCanvasContainerEl = document.getElementById(state.editorCanvasContainerId);
        let worldCanvasEl = document.getElementById(state.worldCanvasId);// as HTMLCanvasElement | null;
        let worldCanvasContainerEl = document.getElementById(state.worldCanvasContainerId);

        if (
          isHTMLCanvasElement(editorCanvasEl) &&
          isHTMLDivElement(editorCanvasContainerEl) &&
          isHTMLCanvasElement(worldCanvasEl) &&
          isHTMLDivElement(worldCanvasContainerEl)
        ) {
          //const engineSimulation = EngineSimulation.getInstance();
          //const engineRendering = WorldRendering.getInstance();
          worldRendering.init();
          worldRendering.fillWindow(worldCanvasContainerEl, worldCanvasEl);
        }
      }
    },

    // Rendering

    startWorldRendering: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.startWorldRendering, payload:', action.payload);
      state.worldRenderingRunning = action.payload.worldRenderingRunning;

      worldRendering.start(action.payload);
    },
    stopWorldRendering: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.stopWorldRendering, payload:', action.payload);
      state.worldRenderingRunning = action.payload.worldRenderingRunning;

      worldRendering.stop();
    },
    setWorldRenderingStats: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.setWorldRenderingStats, payload:', action.payload);
      state.worldRenderingTime = action.payload.worldRenderingTime;
    },
    resetWorldRendering: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.resetWorldRendering, payload:', action.payload);
      state.worldRenderingRunning = action.payload.worldRenderingRunning;
      worldRendering.reset();
    },

    // Simulation

    startWorldSimulation: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.startWorldSimulation, payload:', action.payload);
      state.worldSimulationRunning = action.payload.worldSimulationRunning;
      worldSimulation.start(action.payload);
    },
    stopWorldSimulation: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.stopWorldSimulation, payload:', action.payload);
      state.worldSimulationRunning = action.payload.worldSimulationRunning;
      worldSimulation.stop();
    },
    resetWorldSimulation: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.stopWorldSimulation, payload:', action.payload);
      state.worldSimulationTicksDelay = action.payload.worldSimulationTicksDelay;
      state.worldSimulationRunning = action.payload.worldSimulationRunning;
      worldSimulation.reset();
    },
    setWorldSimulationStats: (state, action: PayloadAction<EnvironmentManagerState>) => {
      //console.log('environmentManager.setWorldSimulationStats, payload:', action.payload);
      state.worldSimulationTime = action.payload.worldSimulationTime;
      state.worldSimulationTicks = action.payload.worldSimulationTicks;
    },
    setWorldSimulationTicksDelay: (state, action: PayloadAction<EnvironmentManagerState>) => {
      state.worldSimulationTicksDelay = action.payload.worldSimulationTicksDelay;
      worldSimulation.setTicksDelay(action.payload, action.payload.worldSimulationTicksDelay);
    },
  },
});

export const selectEnvironmentManager = (state: RootState) => state.environmentManager;

export const {
  init,
  startWorldRendering,
  stopWorldRendering,
  resetWorldRendering,
  setWorldRenderingStats,
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
  setWorldSimulationStats,
  setWorldSimulationTicksDelay,
} = environmentManagerSlice.actions;

export default environmentManagerSlice.reducer;
