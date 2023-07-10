import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { EditorEnvironmentState, setStatus } from './isEditorEnvironmentReadySlice';

export function EditorEnvironment() {
  const dispatch = useAppDispatch();
  const [statusState, setStatusState] = useState<EditorEnvironmentState>({ status: 'idle' });
  const statusValue: EditorEnvironmentState = statusState || 'loading';

  useEffect(() => {
    console.log('WE', statusValue);
    dispatch(setStatus(statusValue))
  }, []);

  return (
    <div>EditorEnvironment</div>
  );
}