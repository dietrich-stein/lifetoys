import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectEnvironmentManager,
  startWorldRendering,
  stopWorldRendering,
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
} from './environmentManagerSlice';
import { formatTime } from '../../utils/FormatTime';
import WorldSimulation from './world/WorldSimulation';
import WorldRendering from './world/WorldRendering';

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
  const worldSimulation = WorldSimulation.getInstance();
  const worldSimulationTime = worldSimulation.getTimeElapsed();
  // Rendering
  const worldRendering = WorldRendering.getInstance();
  const worldRenderingTime = worldRendering.getTimeElapsed();

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
    dispatch(stopWorldRendering({
      ...environmentManagerState,
      worldRenderingRunning: false,
    }));
    dispatch(resetWorldSimulation({
      ...environmentManagerState,
      worldSimulationRunning: false,
    }));
    handleStartSimulationClick();
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
      <div>
        <button disabled={ !worldSimulationRunning } onClick={ handleResetSimulationClick }>
          { 'Reset Simulation' }
        </button>
        <hr />
        <div>Simulation Time: { formatTime(worldSimulationTime) }</div>
        <button onClick={ worldSimulationRunning ? handleStopSimulationClick : handleStartSimulationClick }>
          { worldSimulationRunning ? 'Stop Simulation' : 'Start Simulation' }
        </button>
        <hr />
        <div>Rendering Time: { formatTime(worldRenderingTime) }</div>
        <button
          disabled={ !worldSimulationRunning }
          onClick={ worldRenderingRunning ? handleStopRenderingClick : handleStartRenderingClick }
        >
          { worldRenderingRunning ? 'Stop Rendering' : 'Start Rendering' }
        </button>
        <hr />
      </div>
    </>
  );
}
