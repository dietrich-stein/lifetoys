import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectEngine,
  startRendering,
  stopRendering,
  startSimulation,
  stopSimulation,
} from './engineSlice';
import { formatTime } from '../../utils/FormatTime';

type EngineProps = {
  children?: React.ReactNode;
};

const useAnimate = () => {
  const [animateTime, setAnimateTime] = React.useState(performance.now());

  useEffect(() => {
    let animateId: number;

    const animate = (time: DOMHighResTimeStamp) => {
      setAnimateTime(time);
      animateId = requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animateId);
  }, []);

  return animateTime;
};

const useInterval = () => {
  const tickMs = 1000 / 60; // 16.67
  const [intervalTime, setIntervalTime] = React.useState(performance.now());

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    intervalId = setInterval(() => {
      setIntervalTime(intervalTime => intervalTime + tickMs);
    }, tickMs);

    return () => clearInterval(intervalId);
  });

  return intervalTime;
};

export function Engine(props: EngineProps) {
  const {
    children,
  } = props;
  const engineState = useAppSelector(selectEngine);
  const dispatch = useAppDispatch();
  const {
    renderingStartTime,
    renderingStopTime,
    simulationStartTime,
    simulationStopTime,
  } = engineState;
  // Simulation
  const simulationStopped = simulationStopTime !== null;
  const intervalTime = useInterval();
  const simulationStartTimeValue = (simulationStartTime !== null) ? simulationStartTime : 0;
  const simulationTime = simulationStopped ? simulationStopTime : intervalTime - simulationStartTimeValue;
  // Rendering
  const renderingStopped = renderingStopTime !== null;
  const animateTime = useAnimate();
  const renderingStartTimeValue = (renderingStartTime !== null) ? renderingStartTime : 0;
  const renderingTime = renderingStopped ? renderingStopTime : animateTime - renderingStartTimeValue;

  const handleStartSimulationClick = () => {
    const simulationStopTimeValue = (simulationStopTime !== null) ? simulationStopTime : 0;

    dispatch(startSimulation({
      ...engineState,
      simulationStartTime: performance.now() - simulationStopTimeValue,
      simulationStopTime: null,
    }));
    handleStartRenderingClick();
  };

  const handleStopSimulationClick = () => {
    dispatch(stopSimulation({
      ...engineState,
      simulationStartTime: null,
      simulationStopTime: simulationTime,
    }));
    handleStopRenderingClick();
  };

  const handleStartRenderingClick = () => {
    const renderingStopTimeValue = (renderingStopTime !== null) ? renderingStopTime : 0;

    dispatch(startRendering({
      ...engineState,
      renderingStartTime: performance.now() - renderingStopTimeValue,
      renderingStopTime: null,
    }));
  };

  const handleStopRenderingClick = () => {
    dispatch(stopRendering({
      ...engineState,
      renderingStartTime: null,
      renderingStopTime: renderingTime,
    }));
  };

  return (
    <>
      <div>Simulation Time: { formatTime(simulationTime) }</div>
      <button onClick={ simulationStopped ? handleStartSimulationClick : handleStopSimulationClick }>
        { simulationStopped ? 'Start Simulation' : 'Stop Simulation' }
      </button>
      <hr />
      <div>Rendering Time: { formatTime(renderingTime) }</div>
      <button
        disabled={ simulationStopped }
        onClick={ renderingStopped ? handleStartRenderingClick : handleStopRenderingClick }
      >
        { renderingStopped ? 'Start Rendering' : 'Stop Rendering' }
      </button>
      <hr />
      { children }
    </>
  );
}
