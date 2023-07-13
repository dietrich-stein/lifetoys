import { store, RootState } from '../../app/store';

interface EngineRenderingInterface {
  store: RootState;
  running: boolean;
  animateId: number | null;
  timeElapsed: number;
  setRunning: (value: boolean) => void;
  getTimeElapsed: () => number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

class EngineRendering implements EngineRenderingInterface {
  store: RootState;
  running: boolean;
  animateId: number | null;
  timeElapsed: number;
  private static instance: EngineRendering;

  // Private prevents direct construction calls with the `new` operator.
  private constructor() {
    this.store = store.getState();
    this.running = this.store.engine.renderingRunning;
    this.animateId = null;
    this.timeElapsed = 0;

    if (this.running) {
      this.start();
    }
  }

  public static getInstance(): EngineRendering {
    if (!EngineRendering.instance) {
      EngineRendering.instance = new EngineRendering();
    }

    return EngineRendering.instance;
  }

  public setRunning(value: boolean) {
    this.running = value;
  }

  public getTimeElapsed() {
    return this.timeElapsed;
  }

  public start() {
    console.log('START RENDERING');
    const animate = (time: DOMHighResTimeStamp) => {
      console.log(time);
      this.timeElapsed = time;
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
}

export default EngineRendering;
