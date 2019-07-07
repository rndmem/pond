import {PointerAdapter} from './pointer-adapter'
import {Recorder} from '../recorder'

export class PointerRecorder {
  constructor(
    private readonly _adapter: PointerAdapter = new PointerAdapter()
  ) {}

  record(recorder: Recorder): void {
    this._adapter.toInput().forEach(input => recorder.record(input))
  }

  reset(): void {
    this._adapter.reset()
  }

  onEvent(
    canvasWH: WH,
    cam: Rect,
    event: PointerEvent,
    defaultOrigin: XY
  ): void {
    this._adapter.adapt(canvasWH, cam, event, defaultOrigin)

    event.preventDefault()
  }
}
