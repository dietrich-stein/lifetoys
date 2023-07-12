import React, {
  useEffect,
} from 'react';
import { selectWorldEnvironment, setWorldStatus } from './worldEnvironmentSlice';
//import { Diff } from 'utility-types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
//import { EnvironmentCanvasProps, EnvironmentCanvas } from '../EnvironmentCanvas';

interface InjectedProps {
  //count: number;
  // FIXME: Figure out why these base props are required and do it differently.
  canvasId: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function withWorldCanvasEffects<T extends InjectedProps>(
  Component: React.ComponentType<T>,
) {
  return (hocProps: T) => {
  //return (hocProps: Omit<T, "count">) => {
    const dispatch = useAppDispatch();
    //const [count, setCount] = useState(0);
    const worldEnvironmentState = useAppSelector(selectWorldEnvironment);

    useEffect(() => {
      //if (
        //'canvasRef' in hocProps &&
        //typeof hocProps.canvasRef === 'object' &&
        //'canvasId' in hocProps &&
        //typeof hocProps.canvasId === 'string'
      //) {
      const canvasRef = hocProps.canvasRef;// as React.RefObject<HTMLCanvasElement>;
      const canvasId = hocProps.canvasId;// as string | null;

      if (canvasRef.current) {
        dispatch(setWorldStatus({
          ...worldEnvironmentState,
          status: 'idle',
          canvasId,
        }));
      }
      //}
    });

    return (
      <Component
        { ...(hocProps as T) }
        //count={count}
      />
    );
  };
}
