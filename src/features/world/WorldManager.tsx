import React from 'react';
import { useAppSelector, useAppDispatch, useStats } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  selectEnvironmentManager,
  startWorldRendering,
  stopWorldRendering,
  resetWorldRendering,
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
  setWorldSimulationTicksDelay,
  setWorldRenderingCellSize,
} from './WorldManagerSlice';
import { formatTime } from '../../utils/FormatTime';
import { DEFAULT_TICKS_DELAY } from './WorldSimulation';
import * as dg from '@dietrich-stein/dis-gui-lifetoys';

type WorldManagerProps = {
  children?: React.ReactNode
};

export function WorldManager(props: WorldManagerProps) {
  const {
    children,
  } = props;
  const worldManagerState = useAppSelector(selectEnvironmentManager);
  const dispatch = useAppDispatch();
  const {
    worldRenderingRunning,
    worldSimulationRunning,
  } = worldManagerState;
  const { avgFps, maxFps, nowFps } = useStats();
  /*
   * NOTE: We use non-react classes for `setInterval()` and
   * `requestAnimationFrame()` because this gets better performance with less
   * complexity than hooks or useEffect/useReducer approaches.
   */
  // Simulation
  //const worldSimulation = WorldSimulation.getInstance();
  // Rendering
  //const worldRendering = WorldRendering.getInstance();

  const handleStartSimulationClick = () => {
    dispatch(startWorldSimulation({
      ...worldManagerState,
      worldSimulationRunning: true,
    }));
    handleStartRenderingClick();
  };

  const handleStopSimulationClick = () => {
    dispatch(stopWorldSimulation({
      ...worldManagerState,
      worldSimulationRunning: false,
    }));
    handleStopRenderingClick();
  };

  const handleResetSimulationClick = () => {
    dispatch(resetWorldRendering({
      ...worldManagerState,
      worldRenderingRunning: false,
    }));
    dispatch(resetWorldSimulation({
      ...worldManagerState,
      worldSimulationRunning: false,
      worldSimulationTicksDelay: DEFAULT_TICKS_DELAY,
    }));
    handleStartSimulationClick();
    handleStartRenderingClick();
  };

  const handleStartRenderingClick = () => {
    dispatch(startWorldRendering({
      ...worldManagerState,
      worldRenderingRunning: true,
    }));
  };

  const handleStopRenderingClick = () => {
    dispatch(stopWorldRendering({
      ...worldManagerState,
      worldRenderingRunning: false,
    }));
  };

  const handleSimulationTicksDelayChanged = (value: number) => {
    dispatch(setWorldSimulationTicksDelay({
      ...worldManagerState,
      worldSimulationTicksDelay: value,
    }));
  };

  const handleRenderingCellSizeChanged = (value: number) => {
    dispatch(setWorldRenderingCellSize({
      ...worldManagerState,
      worldSimulationTicksDelay: value,
    }));
  };

  return (
    <>
      { children }
      {
        <dg.GUI style={{ labelWidth: 120, controlWidth: 200 }}>
          <dg.FolderWidget label='Simulation' expanded={ true }>
            <dg.ButtonWidget
              disabled={ !worldSimulationRunning }
              label='Reset All'
              onClick={ handleResetSimulationClick }
            />
            <dg.ButtonWidget
              label={ worldSimulationRunning ? 'Pause Simulation' : 'Resume Simulation' }
              onClick={ worldSimulationRunning ? handleStopSimulationClick : handleStartSimulationClick }>
            </dg.ButtonWidget>
            <dg.TextWidget
              label='Time'
              value={ formatTime(useAppSelector((state: RootState) => state.worldManager.worldSimulationTime)) }
              readOnly={ true }
            />
            <dg.TextWidget
              label='Ticks'
              value={
                useAppSelector((state: RootState) => state.worldManager.worldSimulationTicks ).toString()
              }
              readOnly={ true }
            />
            <dg.NumberWidget
              label='Delay'
              value={ useAppSelector(
                (state: RootState) => state.worldManager.worldSimulationTicksDelay,
              ) }
              min={ 0 }
              max={ 1000 }
              step={ 1 }
              onChange={ handleSimulationTicksDelayChanged }
            />
          </dg.FolderWidget>
          <dg.FolderWidget label='Rendering' expanded={ true }>
            <dg.ButtonWidget
              disabled={ !worldSimulationRunning }
              label={ worldRenderingRunning ? 'Pause Rendering' : 'Resume Rendering' }
              onClick={ worldRenderingRunning ? handleStopRenderingClick : handleStartRenderingClick }>
            </dg.ButtonWidget>
            <dg.TextWidget
              label='Time'
              value={ formatTime(useAppSelector((state: RootState) => state.worldManager.worldRenderingTime )) }
              readOnly={ true }
            />
            <dg.TextWidget
                label='Stats'
                value={
                  'FPS: ' + (worldRenderingRunning ? nowFps : 0) +
                  ' AVG: ' + (worldRenderingRunning ? avgFps : 0) +
                  ' MAX: ' + (worldRenderingRunning ? maxFps : 0)
                }
                readOnly={ true }
            />
            <dg.NumberWidget
              label='Cell Size'
              value={ useAppSelector(
                (state: RootState) => state.world.cellSize,
              ) }
              min={ 5 }
              max={ 10 }
              step={ 1 }
              onChange={ handleRenderingCellSizeChanged }
            />
          </dg.FolderWidget>
        </dg.GUI>
      }
    </>
  );
}
