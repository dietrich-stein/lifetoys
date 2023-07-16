import { store, RootState } from '../../../app/store';
import { useAppDispatch } from '../../../app/hooks';
import {
  EnvironmentManagerState,
  setWorldRenderingStats,
} from '../environmentManagerSlice';

interface WorldRenderingInterface {
  running: boolean;
  animateId: number | null;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  canvasWidth: number;
  canvasHeight: number;
  numCols: number;
  numRows: number;
  initWorldRendering: (canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement, cellSize: number) => void;
  start: (state: EnvironmentManagerState) => void;
  stop: () => void;
  reset: () => void;
}

class WorldRendering implements WorldRenderingInterface {
  running: boolean;
  animateId: number | null;
  timeStartedElapsed: number;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  canvasWidth: number;
  canvasHeight: number;
  numCols: number;
  numRows: number;
  private static instance: WorldRendering;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    this.running = false;
    this.animateId = null;
    this.timeStartedElapsed = 0;
    this.timeStartedLast = 0;
    this.timeStoppedElapsed = 0;
    this.timeStoppedLast = 0;
    this.canvasHeight = 0;
    this.canvasWidth = 0;
    this.numCols = 0;
    this.numRows = 0;
  }

  public static getInstance(): WorldRendering {
    if (!WorldRendering.instance) {
      WorldRendering.instance = new WorldRendering();
    }

    return WorldRendering.instance;
  }

  public initWorldRendering(canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement, cellSize: number) {
    console.log('initWorldRendering');
    this.fillWindow(canvasContainer, canvas, cellSize);
  }

  public start(state: EnvironmentManagerState) {
    //const dispatch = useAppDispatch();
    if (this.running) {
      return;
    }

    const animate = (nowTime: DOMHighResTimeStamp) => {
      this.timeStartedElapsed = nowTime - this.timeStoppedElapsed;
      this.render();
      store.dispatch(setWorldRenderingStats({
        ...state,
        worldRenderingTime: this.timeStartedElapsed,
      }));
      this.animateId = requestAnimationFrame(animate);
    };
    const startTime = performance.now();

    this.timeStoppedElapsed = this.timeStoppedElapsed + (startTime - this.timeStoppedLast);
    this.timeStoppedLast = 0;

    this.timeStartedLast = startTime;

    requestAnimationFrame(animate);

    this.running = true;
  }

  public stop() {
    if (!this.running) {
      return;
    }

    if (this.animateId !== null) {
      cancelAnimationFrame(this.animateId);
    }

    const stopTime = performance.now();

    this.timeStartedLast = 0;
    this.timeStoppedLast = stopTime;
    this.running = false;
  }

  // Intended only for use in combination with WorldSimulation.reset()
  public reset() {
    this.stop();
    this.timeStartedElapsed = 0;
    this.timeStartedLast = 0;
    this.timeStoppedElapsed = 0;
    this.timeStoppedLast = 0;
  }

  private render() {
    //this.world_env.render();
    //console.log('RENDER');
  }

  public fillWindow(canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement, cellSize: number) {
    const height = canvasContainer.clientHeight;
    const width = canvasContainer.clientWidth;

    this.fillShape(canvas, height, width, cellSize);
  }

  public fillShape(canvas: HTMLCanvasElement, height: number, width: number, cellSize: number) {
    this.canvasWidth = canvas.width = width;
    this.canvasHeight = canvas.height = height;

    //const storeState: RootState = store.getState();
    //const cellSize = storeState.worldEnvironment.config.cell_size;

    this.numCols = (cellSize > 0) ? Math.ceil(this.canvasWidth / cellSize) : 0;
    this.numRows = (cellSize > 0) ? Math.ceil(this.canvasHeight / cellSize) : 0;
  }

  public clear(canvas: HTMLCanvasElement) {
    const canvasContext = canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}

export default WorldRendering;
