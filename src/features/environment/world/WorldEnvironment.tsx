import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { WorldEnvironmentState, setStatus } from './isWorldEnvironmentReadySlice';

export function WorldEnvironment() {
  const dispatch = useAppDispatch();
  const [statusState, setStatusState] = useState<WorldEnvironmentState>({ status: 'idle' });
  const statusValue: WorldEnvironmentState = statusState || 'loading';

  useEffect(() => {
    console.log('EE', statusValue);
    dispatch(setStatus(statusValue))
  }, []);

  return (
    <div>WorldEnvironment</div>
  );
}