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

export interface ColorSchemeInterface {
  [key: string]: string;
}

export interface WorldManagerConfigState {
  fill_window: boolean;
  num_random_orgs: number;
  clear_walls_on_reset: boolean;
  auto_reset: boolean;
  brush_size: number;
  color_scheme: ColorSchemeInterface;
}

// Optionality enables dispatch without including elements
export interface WorldManagerState {
  // Other
  config: WorldManagerConfigState;
  hyperparams: HyperparamsState;
  // Rendering
  worldRendererRunning: boolean;
  worldRendererTime: number;
  worldRendererCellSize: number;
  worldRendererCols: number;
  worldRendererRows: number;
  // Simulation
  worldSimulationRunning: boolean;
  worldSimulationTicks: number;
  worldSimulationTicksDelay: number;
  worldSimulationTime: number;
  worldSimulationTotalLivingOrganisms: number;
}

const initialState: WorldManagerState = {
  // Other
  config: {
    fill_window: true,
    num_random_orgs: 100,
    clear_walls_on_reset: false,
    auto_reset: false,
    brush_size: 2,
    color_scheme: {
      empty: 'rgb(0, 0, 128)',
      food: '#15DE59',
      wall: '#808080',
      brain: '#FF00FF',
      mouth: '#FFAA00',
      producer: '#0000FF',
      mover: '#00FFFF',
      stinger: '#FF0000',
      armor: '#6600CC',
      eye: '#EEEEEE',
      'eye-slit': '#000000',
    },
  },
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
  // Rendering
  worldRendererRunning: false,
  worldRendererTime: 0,
  worldRendererCellSize: 100,
  worldRendererCols: 5,
  worldRendererRows: 5,
  // Simulation
  worldSimulationRunning: false,
  worldSimulationTicks: 0,
  worldSimulationTicksDelay: DEFAULT_TICKS_DELAY,
  worldSimulationTime: 0,
  worldSimulationTotalLivingOrganisms: 0,
};
const worldRenderer = WorldRenderer.getInstance();
const worldSimulation = WorldSimulation.getInstance();

export const WorldManagerSlice = createSlice({
  name: 'worldManager',
  initialState,
  reducers: {
    // Rendering
    startWorldRenderer: (state, action: PayloadAction<WorldManagerState>) => {
      console.log('WorldManagerSlice, startWorldRenderer(), payload:', action.payload);
      state.worldRendererRunning = action.payload.worldRendererRunning;

      if (worldSimulation.map !== null) {
        worldRenderer.start(action.payload, worldSimulation.map.grid);
      }
    },
    stopWorldRenderer: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.stopWorldRenderer(), payload:', action.payload);
      state.worldRendererRunning = action.payload.worldRendererRunning;

      worldRenderer.stop();
    },
    setWorldRendererStats: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.setWorldRendererStats(), payload:', action.payload);
      state.worldRendererTime = action.payload.worldRendererTime;
    },
    resetWorldRenderer: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.resetWorldRenderer(), payload:', action.payload);
      state.worldRendererRunning = action.payload.worldRendererRunning;

      if (worldSimulation.map !== null) {
        worldRenderer.reset(
          state.worldRendererCols,
          state.worldRendererRows,
          state.worldRendererCellSize,
          action.payload,
          worldSimulation.map.grid,
          false,
        );
      }
    },
    setWorldRendererCellSize: (state, action: PayloadAction<WorldManagerState>) => {
      //console.log('WorldManagerSlice.setWorldRendererCellSize, payload:', action.payload, 'state:', state);
      state.worldRendererCellSize = action.payload.worldRendererCellSize;

      if (worldSimulation.map !== null) {
        worldRenderer.reset(
          state.worldRendererCols,
          state.worldRendererRows,
          state.worldRendererCellSize,
          action.payload,
          worldSimulation.map.grid,
          false,
        );
      }
    },
    setWorldRendererCols: (state, action: PayloadAction<number>) => {
      state.worldRendererCols = action.payload;
    },
    setWorldRendererRows: (state, action: PayloadAction<number>) => {
      state.worldRendererRows = action.payload;
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
  setWorldRendererCols,
  setWorldRendererRows,
  // Simulation
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
  setWorldSimulationStats,
  setWorldSimulationTicksDelay,
} = WorldManagerSlice.actions;

export default WorldManagerSlice.reducer;
