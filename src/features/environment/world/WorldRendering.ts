import { store, RootState } from '../../../app/store';
import { useAppDispatch } from '../../../app/hooks';
import {
  EnvironmentManagerState,
  setWorldRenderingTime,
} from '../environmentManagerSlice';

interface WorldRenderingInterface {
  running: boolean;
  animateId: number | null;
  timeStartedLast: number;
  timeStoppedElapsed: number;
  timeStoppedLast: number;
  canvasWidth: number;
  canvasHeight: number;
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
    // Auto-start
    //if (this.running) {
      //let canvasContainerEl: HTMLElement | null;
      //let canvasEl: HTMLElement | null = this.store.environmentManager.editorCanvas as HTMLElement;

      //console.log('editorCanvasContainerId', this.store.environmentManager.editorCanvasContainerId);
      //console.log('worldCanvasContainerId', this.store.environmentManager.worldCanvasContainerId);

      //if (isHTMLCanvasElement(this.store.environmentManager.worldCanvas)) {
        //canvasContainerEl = this.store.environmentManager.worldCanvas.parentElement();
        //let editorCanvasEl = document.getElementById(state.editorCanvasId);// as HTMLCanvasElement | null;
        //let worldCanvasEl = document.getElementById(state.worldCanvasId);// as HTMLCanvasElement | null;
      //}

      //this.start();
    //}
  }

  public static getInstance(): WorldRendering {
    if (!WorldRendering.instance) {
      WorldRendering.instance = new WorldRendering();
    }

    return WorldRendering.instance;
  }

  public start(state: EnvironmentManagerState) {
    //const dispatch = useAppDispatch();
    if (this.running) {
      return;
    }

    const animate = (nowTime: DOMHighResTimeStamp) => {
      this.timeStartedElapsed = nowTime - this.timeStoppedElapsed;
      this.render();
      store.dispatch(setWorldRenderingTime({
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
    console.log('RENDER');
  }

  public fillWindow(canvasContainer: HTMLDivElement, canvas: HTMLCanvasElement) {
    const height = canvasContainer.clientHeight;
    const width = canvasContainer.clientWidth;

    this.fillShape(canvas, height, width);
  }

  public fillShape(canvas: HTMLCanvasElement, height: number, width: number) {
    this.canvasWidth = canvas.width = width;
    this.canvasHeight = canvas.height = height;
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
