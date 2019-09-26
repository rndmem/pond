import {UpdaterParser} from '../../UpdaterParser'
import {FollowCamOrientation} from './FollowCamOrientation'
import {WHParser} from '../../../../math/wh/WHParser'
import {ObjectUtil} from '../../../../utils/ObjectUtil'
import {WH} from '../../../../math/wh/WH'

export interface FollowCamConfig {
  readonly positionRelativeToCam: FollowCamOrientation
  readonly camMargin?: Partial<WH>
}

export namespace FollowCamParser {
  export const parse: UpdaterParser = entity => {
    const orientation =
      'positionRelativeToCam' in entity
        ? entity['positionRelativeToCam']
        : undefined
    if (
      !orientation ||
      !ObjectUtil.assertValueOf(
        FollowCamOrientation,
        orientation,
        'FollowCamOrientation'
      )
    )
      throw new Error()
    const camMargin = WHParser.parse(
      'camMargin' in entity ? entity['camMargin'] : undefined
    )
    return {...entity, orientation, camMargin}
  }
}
