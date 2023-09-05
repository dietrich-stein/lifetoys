import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch, useStats } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  selectWorldManager,
  startWorldRenderer,
  stopWorldRenderer,
  resetWorldRenderer,
  startWorldSimulation,
  stopWorldSimulation,
  resetWorldSimulation,
  setWorldSimulationTicksDelay,
  setWorldRendererCellSize,
} from './WorldManagerSlice';
import { formatTime } from '../../utils/FormatTime';
import { DEFAULT_TICKS_DELAY } from './WorldSimulation';
import * as dg from '@dietrich-stein/dis-gui-lifetoys';
import WorldSimulation from './WorldSimulation';
import WorldRenderer from './WorldRenderer';

type WorldManagerProps = {
  children?: React.ReactNode
};

export function WorldManager(props: WorldManagerProps) {
  const {
    children,
  } = props;
  const worldManagerState = useAppSelector(selectWorldManager);
  const dispatch = useAppDispatch();
  const {
    worldRendererRunning,
    worldSimulationRunning,
    worldSimulationTotalLivingOrganisms,
  } = worldManagerState;
  const { avgFps, maxFps, nowFps } = useStats();
  /*
   * NOTE: We use non-react classes for `setInterval()` and
   * `requestAnimationFrame()` because this gets better performance with less
   * complexity than hooks or useEffect/useReducer approaches.
   */
  // Simulation
  const worldSimulation = WorldSimulation.getInstance();
  // Rendering
  const worldRenderer = WorldRenderer.getInstance();

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
    dispatch(resetWorldRenderer({
      ...worldManagerState,
      worldRendererRunning: false,
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
    dispatch(startWorldRenderer({
      ...worldManagerState,
      worldRendererRunning: true,
    }));
  };

  const handleStopRenderingClick = () => {
    dispatch(stopWorldRenderer({
      ...worldManagerState,
      worldRendererRunning: false,
    }));
  };

  const handleSimulationTicksDelayChanged = (value: number) => {
    dispatch(setWorldSimulationTicksDelay({
      ...worldManagerState,
      worldSimulationTicksDelay: value,
    }));
  };

  const handleRenderingCellSizeChanged = (value: number) => {
    dispatch(setWorldRendererCellSize({
      ...worldManagerState,
      worldRendererCellSize: value,
    }));
  };

  const handleRotateRightClick = () => {
    worldSimulation.organisms[0].rotateAnatomyRight(worldRenderer);
  };

  const handleRotateLeftClick = () => {
    worldSimulation.organisms[0].rotateAnatomyLeft(worldRenderer);
  };

  const handleMovementRightClick = () => {
    worldSimulation.organisms[0].rotateMovementRight(worldRenderer);
  };

  const handleMovementLeftClick = () => {
    worldSimulation.organisms[0].rotateMovementLeft(worldRenderer);
  };

  const handleLookRightClick = () => {
    worldSimulation.organisms[0].rotateLookRight(worldRenderer);
  };

  const handleLookLeftClick = () => {
    worldSimulation.organisms[0].rotateLookLeft(worldRenderer);
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
              label={ worldRendererRunning ? 'Pause Rendering' : 'Resume Rendering' }
              onClick={ worldRendererRunning ? handleStopRenderingClick : handleStartRenderingClick }>
            </dg.ButtonWidget>
            <dg.TextWidget
              label='Time'
              value={ formatTime(useAppSelector((state: RootState) => state.worldManager.worldRendererTime )) }
              readOnly={ true }
            />
            <dg.TextWidget
                label='Stats'
                value={
                  'FPS: ' + (worldRendererRunning ? nowFps : 0) +
                  ' AVG: ' + (worldRendererRunning ? avgFps : 0) +
                  ' MAX: ' + (worldRendererRunning ? maxFps : 0)
                }
                readOnly={ true }
            />
            <dg.NumberWidget
              label='Cell Size'
              value={ useAppSelector(
                (state: RootState) => state.worldManager.worldRendererCellSize,
              ) }
              min={ 1 }
              max={ 100 }
              step={ 1 }
              onChange={ handleRenderingCellSizeChanged }
            />
          </dg.FolderWidget>
          <dg.FolderWidget label='Debug' expanded={ true }>
            <dg.TextWidget
              label='Living Organisms'
              value={ worldSimulationTotalLivingOrganisms.toString() }
              readOnly={ true }
            />
            <dg.ButtonWidget
              disabled={
                (!worldSimulationRunning || worldSimulationTotalLivingOrganisms < 1)
              }
              label=' &laquo; Rotate Anatomy Left'
              onClick={ handleRotateLeftClick }
            />
            <dg.ButtonWidget
              disabled={
                (!worldSimulationRunning || worldSimulationTotalLivingOrganisms < 1)
              }
              label='Rotate Anatomy Right &raquo;'
              onClick={ handleRotateRightClick }
            />
            <br />
            <dg.ButtonWidget
              disabled={
                (!worldSimulationRunning || worldSimulationTotalLivingOrganisms < 1)
              }
              label=' &laquo; Rotate Movement Left'
              onClick={ handleMovementLeftClick }
            />
            <dg.ButtonWidget
              disabled={
                (!worldSimulationRunning || worldSimulationTotalLivingOrganisms < 1)
              }
              label='Rotate Movement Right &raquo;'
              onClick={ handleMovementRightClick }
            />
            <br />
            <dg.ButtonWidget
              disabled={
                (!worldSimulationRunning || worldSimulationTotalLivingOrganisms < 1)
              }
              label=' &laquo; Rotate Look Left'
              onClick={ handleLookLeftClick }
            />
            <dg.ButtonWidget
              disabled={
                (!worldSimulationRunning || worldSimulationTotalLivingOrganisms < 1)
              }
              label='Rotate Look Right &raquo;'
              onClick={ handleLookRightClick }
            />
          </dg.FolderWidget>
        </dg.GUI>
      }
    </>
  );
}
