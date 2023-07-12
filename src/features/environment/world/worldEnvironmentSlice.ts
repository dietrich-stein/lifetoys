import { RootState } from '../../../app/store';
import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Neighbors from '../../grid/Neighbors';

interface WorldEnvironmentColorSchemeInterface {
  [key: string]: string;
}

type WorldEnvironmentHyperParamsState = {
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

// Underscores are used for JSON-serializable objects
export interface WorldEnvironmentConfigState {
  fill_window: boolean;
  cell_size: number;
  num_cols: number;
  num_rows: number;
  num_random_orgs: number;
  clear_walls_on_reset: boolean;
  auto_reset: boolean;
  brush_size: number;
  color_scheme: WorldEnvironmentColorSchemeInterface;
  hyperparams: WorldEnvironmentHyperParamsState;
}

export interface WorldEnvironmentState {
  status: 'idle' | 'loading';
  canvasId: string | null;
  config: WorldEnvironmentConfigState;
}

const initialState: WorldEnvironmentState = {
  status: 'loading',
  canvasId: null,
  config: {
    fill_window: true,
    cell_size: 5,
    num_cols: 100,
    num_rows: 100,
    num_random_orgs: 100,
    clear_walls_on_reset: false,
    auto_reset: false,
    brush_size: 2,
    color_scheme: {
      empty: '#111111',
      food: '#15DE59',
      wall: '#808080',
      brain: '#FF00FF',
      mouth: '#FFAA00',
      producer: '#0000FF',
      mover: '#00FFFF',
      killer: '#FF0000',
      armor: '#6600CC',
      eye: '#EEEEEE',
      'eye-slit': '#000000',
    },
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
    }
  },
};

export const worldEnvironmentSlice = createSlice({
  name: 'worldEnvironment',
  initialState,
  reducers: {
    setWorldStatus: (
      state,
      action: PayloadAction<WorldEnvironmentState>
    ) => {
      state.status = action.payload.status;
      state.canvasId = action.payload.canvasId;
      //console.log('setWorldStatus, state:', state);
    },
  },
});

export const selectWorldEnvironment = (state: RootState) => state.worldEnvironment;

export const {
  setWorldStatus
} = worldEnvironmentSlice.actions;

export default worldEnvironmentSlice.reducer;
