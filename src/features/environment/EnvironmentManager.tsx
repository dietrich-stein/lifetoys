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
} from './environmentManagerSlice';
import { formatTime } from '../../utils/FormatTime';
import { DEFAULT_TICKS_DELAY } from './world/WorldSimulation';
//import WorldRendering from './world/WorldRendering';
import * as dg from '@dietrich-stein/dis-gui-lifetoys';

type EnvironmentManagerProps = {
  children?: React.ReactNode
};

export function EnvironmentManager(props: EnvironmentManagerProps) {
  const {
    children,
  } = props;
  const environmentManagerState = useAppSelector(selectEnvironmentManager);
  const dispatch = useAppDispatch();
  const {
    worldRenderingRunning,
    worldSimulationRunning,
  } = environmentManagerState;
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
      ...environmentManagerState,
      worldSimulationRunning: true,
    }));
    handleStartRenderingClick();
  };

  const handleStopSimulationClick = () => {
    dispatch(stopWorldSimulation({
      ...environmentManagerState,
      worldSimulationRunning: false,
    }));
    handleStopRenderingClick();
  };

  const handleResetSimulationClick = () => {
    dispatch(resetWorldRendering({
      ...environmentManagerState,
      worldRenderingRunning: false,
    }));
    dispatch(resetWorldSimulation({
      ...environmentManagerState,
      worldSimulationRunning: false,
      worldSimulationTicksDelay: DEFAULT_TICKS_DELAY,
    }));
    handleStartSimulationClick();
    handleStartRenderingClick();
  };

  const handleStartRenderingClick = () => {
    dispatch(startWorldRendering({
      ...environmentManagerState,
      worldRenderingRunning: true,
    }));
  };

  const handleStopRenderingClick = () => {
    dispatch(stopWorldRendering({
      ...environmentManagerState,
      worldRenderingRunning: false,
    }));
  };

  const handleSimulationTicksDelayChanged = (value: number) => {
    dispatch(setWorldSimulationTicksDelay({
      ...environmentManagerState,
      //...environmentManagerState,
      worldSimulationTicksDelay: value,
    }));
  };

  return (
    <>
      { children }
      <dg.GUI style={{ labelWidth: 120, controlWidth: 200 }}>
        <dg.Folder label='Simulation & Rendering' expanded={ true }>
          <dg.Button
            disabled={ !worldSimulationRunning }
            label='Reset All'
            onClick={ handleResetSimulationClick }
          />
          <dg.Button
            label={ worldSimulationRunning ? 'Pause Simulation' : 'Resume Simulation' }
            onClick={ worldSimulationRunning ? handleStopSimulationClick : handleStartSimulationClick }>
          </dg.Button>
          <dg.Number
            label='Simulation Tick Delay'
            value={ useAppSelector((state: RootState) => state.environmentManager.worldSimulationTicksDelay ) }
            min={ 0 }
            max={ 1000 }
            step={ 1 }
            onChange={ handleSimulationTicksDelayChanged }
          />
          <dg.Text
            label='Simulation Ticks'
            value={
              useAppSelector((state: RootState) => state.environmentManager.worldSimulationTicks )
            }
            readOnly={ true }
          />
          <dg.Text
            label='Simulation Time'
            value={
              formatTime(useAppSelector((state: RootState) => state.environmentManager.worldSimulationTime ))
            }
            readOnly={ true }
          />
          <dg.Button
            disabled={ !worldSimulationRunning }
            label={ worldRenderingRunning ? 'Pause Rendering' : 'Resume Rendering' }
            onClick={ worldRenderingRunning ? handleStopRenderingClick : handleStartRenderingClick }>
          </dg.Button>
          <dg.Text
              label='Rendering Stats'
              value={
                'FPS: ' + (worldRenderingRunning ? nowFps : 0) +
                ' AVG: ' + (worldRenderingRunning ? avgFps : 0) +
                ' MAX: ' + (worldRenderingRunning ? maxFps : 0)
              }
              readOnly={ true }
          />
          <dg.Text
            label='Rendering Time'
            value={ formatTime(useAppSelector((state: RootState) => state.environmentManager.worldRenderingTime )) }
            readOnly={ true }
          />
        </dg.Folder>
      </dg.GUI>
    </>
  );
}
