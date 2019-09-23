import {Rect} from '../math/rect/Rect'
import {WH} from '../math/wh/WH'
import {XY} from '../math/xy/XY'

export namespace Viewport {
  /** @return The maximum scale possible. */
  export function scale(canvas: WH, minSize: WH, zoomOut: number): number {
    const x = canvas.w / minSize.w
    const y = canvas.h / minSize.h
    return Math.max(1, Math.floor(Math.min(x, y)) - zoomOut)
  }

  export function canvasWH(doc: Document): WH {
    const {clientWidth, clientHeight} = doc.documentElement
    return {w: clientWidth, h: clientHeight}
  }

  export function camWH({w, h}: WH, scale: number): WH {
    return {w: Math.ceil(w / scale), h: Math.ceil(h / scale)}
  }

  /** @arg {x, y} The viewport coordinates of the input in window pixels,
                  usually {x: ev.clientX, y: ev.clientY}.
      @arg {w, h} The viewport dimensions in window pixels (canvasWH).
      @arg cam The coordinates and dimensions of the camera the input was made
               through in level pixels.
      @return The fractional position in level coordinates. */
  export function toLevelXY({x, y}: XY, {w, h}: WH, cam: Rect): XY {
    return {
      x: cam.position.x + (x / w) * cam.size.w,
      y: cam.position.y + (y / h) * cam.size.h
    }
  }
}
