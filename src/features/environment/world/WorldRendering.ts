import { store, RootState } from '../../../app/store';

interface WorldRenderingInterface {
  store: RootState;
  running: boolean;
  animateId: number | null;
  timeElapsed: number;
  canvasWidth: number;
  canvasHeight: number;
  setRunning: (value: boolean) => void;
  getTimeElapsed: () => number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

class WorldRendering implements WorldRenderingInterface {
  store: RootState;
  running: boolean;
  animateId: number | null;
  timeElapsed: number;
  canvasWidth: number;
  canvasHeight: number;
  private static instance: WorldRendering;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    this.store = store.getState();
    this.running = this.store.environmentManager.worldRenderingRunning;
    this.animateId = null;
    this.timeElapsed = 0;
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

  public setRunning(value: boolean) {
    this.running = value;
  }

  public getTimeElapsed() {
    return this.timeElapsed;
  }

  public start() {
    const animate = (time: DOMHighResTimeStamp) => {
      this.timeElapsed = time;
      this.render();
      this.animateId = requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    this.setRunning(true);
  }

  public stop() {
    if (this.animateId !== null) {
      cancelAnimationFrame(this.animateId);
    }

    this.setRunning(false);
  }

  public reset() {
    this.stop();
    this.timeElapsed = 0;
  }

  render() {
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
