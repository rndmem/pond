import {EntityConfig} from '../../entity/EntityConfig'
import {LayerConfig} from '../../sprite/LayerConfig'
import {LayerParser} from '../../sprite/LayerParser'
import {SpriteParser} from '../../sprite/SpriteParser'
import {Text} from './Text'
import {WHConfig} from '../../math/WHConfig'
import {WHParser} from '../../math/WHParser'
import {XYConfig} from '../../math/XYConfig'

export interface TextPropsConfig extends EntityConfig {
  readonly text?: string
  readonly textLayer?: LayerConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}

export namespace TextParser {
  export function parseProps(config: TextPropsConfig): Text.Props {
    const props: Writable<Text.Props> = {}
    if (config.text !== undefined) props.text = config.text
    if (config.textLayer !== undefined)
      props.textLayer = LayerParser.parse(config.textLayer)
    if (config.textScale !== undefined)
      props.textScale = SpriteParser.parseScale(config.textScale)
    if (config.textMaxSize !== undefined)
      props.textMaxSize = WHParser.parse(config.textMaxSize)
    return props
  }
}
