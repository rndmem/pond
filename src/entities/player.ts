import * as animation from './animation'
import * as atlas from './atlas'
import * as entity from './entity'
import * as recorder from '../inputs/recorder'

export function nextStepState(
  state: entity.State,
  step: number,
  atlas: atlas.State,
  recorderState: recorder.ReadState
): void {
  scale(state, recorderState)
  position(state, recorderState, step)

  state.animationID = animationID(state, recorderState)
  const run =
    recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
    recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
  state.cel =
    Math.abs(Math.round(state.position.x / (run ? 6 : 2))) %
    atlas.animations[state.animationID].cels.length
}

function grounded(state: entity.State): boolean {
  return state.position.y >= -17
}

function animationID(
  state: entity.State,
  recorderState: recorder.ReadState
): animation.ID {
  if (!grounded(state)) {
    if (recorderState.up()) {
      return animation.ID.PLAYER_ASCEND
    }

    return animation.ID.PLAYER_DESCEND
  }

  if (
    recorderState.down(true) &&
    (state.animationID === animation.ID.PLAYER_CROUCH ||
      state.animationID === animation.ID.PLAYER_SIT)
  ) {
    return animation.ID.PLAYER_SIT
  }

  if (recorderState.down()) {
    if (
      state.animationID === animation.ID.PLAYER_CROUCH ||
      state.animationID === animation.ID.PLAYER_SIT
    ) {
      return state.animationID
    }
    return animation.ID.PLAYER_CROUCH
  }

  if (recorderState.left() || recorderState.right()) {
    const run =
      recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
      recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)

    if (run) return animation.ID.PLAYER_RUN
    return animation.ID.PLAYER_WALK
  }

  if (recorderState.up()) {
    if (state.animationID === animation.ID.PLAYER_SIT) {
      return animation.ID.PLAYER_CROUCH
    }
    return animation.ID.PLAYER_IDLE
  }

  if (
    state.animationID === animation.ID.PLAYER_CROUCH ||
    state.animationID === animation.ID.PLAYER_SIT
  ) {
    return state.animationID
  }

  return animation.ID.PLAYER_IDLE
}

function scale(state: entity.State, recorderState: recorder.ReadState): void {
  state.scale.x = recorderState.left()
    ? -1
    : recorderState.right()
      ? 1
      : state.scale.x
}

function position(
  state: entity.State,
  recorderState: recorder.ReadState,
  step: number
): void {
  if (grounded(state) && recorderState.down()) return
  const run =
    recorderState.combo(false, recorder.Mask.LEFT, recorder.Mask.LEFT) ||
    recorderState.combo(false, recorder.Mask.RIGHT, recorder.Mask.RIGHT)
  const speed = (run ? 0.048 : 0.016) * step
  state.position.x = Math.max(
    0,
    state.position.x -
      (recorderState.left() ? speed : 0) +
      (recorderState.right() ? speed : 0)
  )
  state.position.y = Math.min(
    -17,
    state.position.y -
      (recorderState.up() ? speed : 0) +
      (recorderState.down() ? speed : 0)
  )
}