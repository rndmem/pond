import {Atlas} from 'aseprite-atlas'
import {Level} from './Level'
import {LevelAdvance} from './LevelAdvance'
import {LevelConfigMap} from './levelConfigs/LevelConfigMap'
import {LevelParser} from './LevelParser'
import {ShaderLayout} from '../renderer/ShaderLayout'
import {Store} from '../store/Store'
import {UpdateState} from '../updaters/UpdateState'

export interface LevelStateMachine {
  prevLevel?: Level
  level?: Level
  readonly store: Store
}

export namespace LevelStateMachine {
  export function make(layout: ShaderLayout, atlas: Atlas): LevelStateMachine {
    if (!LevelConfigMap.uiTitle) throw new Error('Missing level.')
    const level = LevelParser.parse(LevelConfigMap.uiTitle, atlas)
    return {level, store: Store.make(layout)}
  }

  export function update(machine: LevelStateMachine, state: UpdateState): void {
    Store.update(machine.store, state)
    updateLevel(machine)
  }
}

function updateLevel(machine: LevelStateMachine): void {
  if (!machine.level) return
  if (machine.level.advance === LevelAdvance.UNCHANGED) return

  if (machine.level.advance === LevelAdvance.PREV) {
    const {level} = machine
    machine.level = machine.prevLevel
    machine.prevLevel = level
    if (machine.level) machine.level.advance = LevelAdvance.UNCHANGED
    return
  }

  const config =
    machine.level.nextLevel && LevelConfigMap[machine.level.nextLevel]
  machine.prevLevel = machine.level
  machine.level = config
    ? LevelParser.parse(config, machine.level.atlas)
    : undefined
}
