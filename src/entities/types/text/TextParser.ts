import {Atlas} from '../../../atlas/Atlas'
import {Entity} from '../../../entity/Entity'
import {EntityType} from '../../../entity/EntityType'
import {Limits} from '../../../math/Limits'
import {Image} from '../../../image/Image'
import {Layer} from '../../../image/Layer'
import {XY} from '../../../math/XY'
import {TextLayout} from '../../../text/TextLayout'
import {Rect} from '../../../math/Rect'
import {XYParser, XYConfig} from '../../../math/XYParser'
import {ImageParser, LayerKeyConfig} from '../../../image/ImageParser'
import {Text} from './Text'
import {MEM_FONT_PREFIX, AtlasID} from '../../../atlas/AtlasID'
import {EntityConfig} from '../../../entity/EntityParser'
import {WHConfig} from '../../../math/WHParser'

export interface TextConfig extends EntityConfig {
  readonly type: EntityType.UI_TEXT
  readonly text?: string
  readonly textLayer: LayerKeyConfig
  readonly textScale?: XYConfig
  readonly textMaxSize?: WHConfig
}

export namespace TextParser {
  export function parse(text: Entity, atlas: Atlas): Text {
    if (!Entity.assert<Text>(text, EntityType.UI_TEXT)) throw new Error()

    const textImages = toImages(
      atlas,
      text.text,
      text.textLayer,
      XYParser.parse(text.textScale),
      {
        position: Entity.imageRect(text).bounds.position,
        size: {
          w:
            text.textMaxSize && text.textMaxSize.w
              ? text.textMaxSize.w
              : Limits.maxShort,
          h:
            text.textMaxSize && text.textMaxSize.h
              ? text.textMaxSize.h
              : Limits.maxShort
        }
      },
      Entity.imageRect(text).imageID
    )

    // Images are added dynamically but ImageRect expects a static configuration
    // determined at parse time. Recalculate the bounds.
    Entity.imageRect(text).images.push(...textImages)
    const union = Rect.unionAll(
      Entity.imageRect(text).images.map(image => image.bounds)
    )
    if (union) {
      Entity.imageRect(text).bounds.position.x = union.position.x
      Entity.imageRect(text).bounds.position.y = union.position.y
      Entity.imageRect(text).bounds.size.w = union.size.w
      Entity.imageRect(text).bounds.size.h = union.size.h
    }
    Entity.invalidateBounds(text)
    return text
  }

  /** @arg y The vertical scroll offset in pixels. */
  function toImages(
    atlas: Atlas,
    string: string,
    layer: Layer.Key,
    scale: XY,
    bounds: Rect,
    imageID?: AtlasID,
    y: number = 0
  ): readonly Image[] {
    const images = []
    const {positions} = TextLayout.layout(string, bounds.size.w, scale)
    for (let i = 0; i < positions.length; ++i) {
      const position = positions[i]
      if (!position) continue
      if (TextLayout.nextLine(position.y, scale).y < y) continue
      if (position.y > y + bounds.size.h) break

      const char = newCharacterImage(
        string.charCodeAt(i),
        {
          x: bounds.position.x + position.x,
          y: bounds.position.y + position.y - y
        },
        layer,
        scale,
        imageID,
        atlas
      )
      images.push(char)
    }
    return images
  }
}

function newCharacterImage(
  char: number,
  position: XY,
  layer: Layer.Key,
  scale: XY,
  imageID: Maybe<AtlasID>,
  atlas: Atlas
): Image {
  const id = MEM_FONT_PREFIX + char.toString().padStart(3, '0')
  return ImageParser.parse(
    {
      id,
      bounds: {position},
      layer,
      scale,
      imageID,
      alphaComposition: 'SOURCE_MASK'
    },
    atlas
  )
}
