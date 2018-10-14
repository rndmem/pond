import * as animation from './animation.js'
import * as entity from './entity.js'
import * as util from '../util.js'

/**
 * @arg {XY} position
 * @arg {animation.ID} animationID
 * @return {ReadonlyArray<entity.State>}
 */
export function newCloud(animationID, position) {
  return [
    new entity.State(
      entity.Type.CLOUD,
      position,
      animationID,
      entity.DrawOrder.CLOUDS
    )
  ]
}

/**
 * @arg {XY} position
 * @arg {XY} scale
 * @return {ReadonlyArray<entity.State>}
 */
export function newBackground(position, scale) {
  return [
    new entity.State(
      entity.Type.BACKGROUND,
      position,
      animation.ID.PALETTE_PALE,
      entity.DrawOrder.BACKGROUND,
      {x: 0, y: 0},
      scale
    )
  ]
}

/**
 * @arg {XY} position
 * @return {ReadonlyArray<entity.State>}
 */
export function newPlayer(position) {
  const animationID = animation.ID.PLAYER_IDLE
  const drawOrder = entity.DrawOrder.PLAYER
  return [
    new entity.State(entity.Type.PLAYER, position, animationID, drawOrder)
  ]
}

/**
 * @arg {animation.ID} animationID
 * @arg {XY} position
 * @arg {number} speed
 * @return {ReadonlyArray<entity.State>}
 */
export function newRainCloud(animationID, {x, y}, speed) {
  /** @type {entity.State[]} */ const entities = []
  const drawOrder = entity.DrawOrder.CLOUDS
  util.range(0, (-27 - y) / 16).forEach(i =>
    entities.push(
      new entity.State(
        entity.Type.CLOUD,
        {
          // Round now to prevent rain from being an extra pixel off due to
          // truncation later.
          x: x + Math.round((i + 1) / 2),
          y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
        },
        animation.ID.RAIN,
        drawOrder,
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 0, y: -0.012},
        {x: speed, y: 0}
      )
    )
  )
  entities.push(
    new entity.State(
      entity.Type.CLOUD,
      {x: x + 1, y: -12},
      animation.ID.WATER_M,
      drawOrder,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      {x: speed, y: 0}
    )
  )
  entities.push(
    new entity.State(
      entity.Type.CLOUD,
      {x, y},
      animationID,
      drawOrder,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      {
        x: speed,
        y: 0
      }
    )
  )
  return entities
}

/**
 * @arg {animation.ID} animationID
 * @arg {XY} position
 * @arg {XY} scale
 * @return {ReadonlyArray<entity.State>}
 */
export function newGrass(animationID, position, scale = {x: 1, y: 1}) {
  const drawOrder =
    animationID >= animation.ID.GRASS_XS && animationID <= animation.ID.GRASS_L
      ? entity.DrawOrder.FAR_BACKGROUND_SCENERY
      : entity.DrawOrder.FOREGROUND_SCENERY
  return [
    new entity.State(
      entity.Type.GRASS,
      position,
      animationID,
      drawOrder,
      {x: 0, y: 0},
      scale
    )
  ]
}

/**
 * @arg {XY} position
 * @return {ReadonlyArray<entity.State>}
 */
export function newHill(position) {
  return [
    new entity.State(
      entity.Type.GRASS,
      position,
      animation.ID.HILL,
      entity.DrawOrder.FAR_BACKGROUND_SCENERY
    )
  ]
}

/**
 * @arg {XY} position
 * @return {ReadonlyArray<entity.State>}
 */
export function newTree(position) {
  const animationID = animation.ID.TREE
  const drawOrder = entity.DrawOrder.NEAR_BACKGROUND_SCENERY
  return [new entity.State(entity.Type.TREE, position, animationID, drawOrder)]
}

/**
 * @arg {XY} position
 * @arg {XY} speed
 * @return {ReadonlyArray<entity.State>}
 */
export function newSuperBall(position, speed) {
  const animationID = animation.ID.PALETTE_GOLD
  return [
    new entity.State(
      entity.Type.SUPER_BALL,
      position,
      animationID,
      entity.DrawOrder.SUPER_BALL,
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 0, y: 0},
      speed
    )
  ]
}
