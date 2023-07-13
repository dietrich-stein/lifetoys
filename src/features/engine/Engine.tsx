import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectEngine,
  startRendering,
  stopRendering,
  startSimulation,
  stopSimulation,
  resetSimulation,
} from './engineSlice';
import { formatTime } from '../../utils/FormatTime';
import EngineSimulation from '../../features/engine/EngineSimulation';
import EngineRendering from './EngineRendering';

type EngineProps = {
  children?: React.ReactNode;
};

export function Engine(props: EngineProps) {
  const {
    children,
  } = props;
  const engineState = useAppSelector(selectEngine);
  const dispatch = useAppDispatch();
  const {
    renderingRunning,
    simulationRunning,
  } = engineState;
  /*
   * NOTE: We use non-react classes for `setInterval()` and
   * `requestAnimationFrame()` because this gets better performance with less
   * complexity than hooks or useEffect/useReducer approaches.
   */
  // Simulation
  const engineSimulation = EngineSimulation.getInstance();
  const simulationTime = engineSimulation.getTimeElapsed();
  // Rendering
  const engineRendering = EngineRendering.getInstance();
  const renderingTime = engineRendering.getTimeElapsed();

  const handleStartSimulationClick = () => {
    dispatch(startSimulation({
      ...engineState,
      simulationRunning: true,
    }));
    handleStartRenderingClick();
  };

  const handleStopSimulationClick = () => {
    dispatch(stopSimulation({
      ...engineState,
      simulationRunning: false,
    }));
    handleStopRenderingClick();
  };

  const handleResetSimulationClick = () => {
    dispatch(stopRendering({
      ...engineState,
      //renderingStartTime: null,
      //renderingStopTime: 0,
      renderingRunning: false,
    }));
    dispatch(resetSimulation({
      ...engineState,
      simulationRunning: false,
    }));
    handleStartSimulationClick();
  };

  const handleStartRenderingClick = () => {
    dispatch(startRendering({
      ...engineState,
      renderingRunning: true,
    }));
  };

  const handleStopRenderingClick = () => {
    dispatch(stopRendering({
      ...engineState,
      renderingRunning: false,
    }));
  };

  return (
    <>
      <button disabled={ !simulationRunning } onClick={ handleResetSimulationClick }>
        { 'Reset Simulation' }
      </button>
      <hr />
      <div>Simulation Time: { formatTime(simulationTime) }</div>
      <button onClick={ simulationRunning ? handleStopSimulationClick : handleStartSimulationClick }>
        { simulationRunning ? 'Stop Simulation' : 'Start Simulation' }
      </button>
      <hr />
      <div>Rendering Time: { formatTime(renderingTime) }</div>
      <button
        disabled={ !simulationRunning }
        onClick={ renderingRunning ? handleStopRenderingClick : handleStartRenderingClick }
      >
        { renderingRunning ? 'Stop Rendering' : 'Start Rendering' }
      </button>
      <hr />
      { children }
    </>
  );
}
