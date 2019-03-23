declare global {
  interface XY {
    readonly x: number
    readonly y: number
  }
}

export namespace XY {
  export function add(lhs: XY, rhs: XY | number): XY {
    if (typeof rhs === 'number') return {x: lhs.x + rhs, y: lhs.x + rhs}
    return {x: lhs.x + rhs.x, y: lhs.y + rhs.y}
  }

  export function sub(lhs: XY, rhs: XY): XY {
    return {x: lhs.x - rhs.x, y: lhs.y - rhs.y}
  }

  export function mul(lhs: XY, rhs: XY | number): XY {
    if (typeof rhs === 'number') return {x: lhs.x * rhs, y: lhs.x * rhs}
    return {x: lhs.x * rhs.x, y: lhs.y * rhs.y}
  }

  export function div(lhs: XY, rhs: XY): XY {
    return {x: lhs.x / rhs.x, y: lhs.y / rhs.y}
  }

  export function equal(lhs: XY, rhs: XY): boolean {
    return lhs.x === rhs.x && lhs.y === rhs.y
  }

  export function min(lhs: XY, rhs: XY): XY {
    return {x: Math.min(lhs.x, rhs.x), y: Math.min(lhs.y, rhs.y)}
  }

  export function max(lhs: XY, rhs: XY): XY {
    return {x: Math.max(lhs.x, rhs.x), y: Math.max(lhs.y, rhs.y)}
  }
}
