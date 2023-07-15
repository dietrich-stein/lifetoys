import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  selectEnvironmentManager,
  startWorldRendering,
  stopWorldRendering,
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
  resetWorldRendering,
} from './environmentManagerSlice';
import { formatTime } from '../../utils/FormatTime';
//import WorldSimulation from './world/WorldSimulation';
//import WorldRendering from './world/WorldRendering';
import * as dg from 'dis-gui-lifetoys';

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
  /*
   * NOTE: We use non-react classes for `setInterval()` and
   * `requestAnimationFrame()` because this gets better performance with less
   * complexity than hooks or useEffect/useReducer approaches.
   */
  // Simulation
  //const worldSimulation = WorldSimulation.getInstance();
  //const worldSimulationTime = worldSimulation.getTimeElapsed();
  // Rendering
  //const worldRendering = WorldRendering.getInstance();
  //const worldRenderingTime = worldRendering.getTimeElapsed();

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

  return (
    <>
      { children }
      <dg.GUI>
        <dg.Button
          disabled={ !worldSimulationRunning }
          label='Reset Simulation & Rendering'
          onClick={ handleResetSimulationClick }
        />
        <dg.Text
          label='Simulation Time'
          value={
            formatTime(useAppSelector((state: RootState) => state.environmentManager.worldSimulationTime ))
          }
        />
        <dg.Button
          label={ worldSimulationRunning ? 'Stop Simulation' : 'Start Simulation' }
          onClick={ worldSimulationRunning ? handleStopSimulationClick : handleStartSimulationClick }>
        </dg.Button>
        <dg.Text
          label='Rendering Time'
          value={ formatTime(useAppSelector((state: RootState) => state.environmentManager.worldRenderingTime )) }
        />
        <dg.Button
          disabled={ !worldSimulationRunning }
          label={ worldRenderingRunning ? 'Stop Rendering' : 'Start Rendering' }
          onClick={ worldRenderingRunning ? handleStopRenderingClick : handleStartRenderingClick }>
        </dg.Button>
      </dg.GUI>
    </>
  );
}
