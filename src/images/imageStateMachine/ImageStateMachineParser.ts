import {
  EntityStateParser,
  EntityStateConfig
} from '../../entities/entityState/EntityStateParser'
import {ImageStateMachine} from './ImageStateMachine'
import {Atlas} from '../../atlas/atlas/Atlas'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {
  ImageStateMapParser,
  ImageStateMapConfig
} from '../imageStateMap/ImageStateMapParser'
import {EntityState} from '../../entities/entityState/EntityState'

export type ImageStateMachineConfig = Maybe<
  Readonly<{state?: EntityStateConfig; map?: ImageStateMapConfig}>
>

export namespace ImageStateMachineParser {
  export function parse(
    config: ImageStateMachineConfig,
    atlas: Atlas
  ): ImageStateMachine {
    if (!config)
      return {
        state: EntityState.HIDDEN,
        map: ImageStateMapParser.parse(undefined, atlas)
      }
    const state = EntityStateParser.parse(config.state)
    const map = ImageStateMapParser.parse(config.map, atlas)
    ObjectUtil.assertKeyOf(map, state, 'ImageStateMachine')
    return {state, map}
  }
}
