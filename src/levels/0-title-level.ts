import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Defaults} from './defaults'
import {FieldsLevel} from './1-fields-level'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {Limits} from '../math/limits'
import {NatureElsewhere} from '../entities/nature-elsewhere'
import {NumberUtil} from '../utils/number-util'
import {Palette, Tone} from '../images/palette'
import {Recorder} from '../inputs/recorder'
import {SettingsLevel} from './settings-level'
import {Store} from '../entities/store'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'

export class TitleLevel implements Level {
  private readonly _store: Store
  private readonly _logo: ImageGroup
  private readonly _footer: ImageGroup
  private readonly _cursor: Image
  private readonly _cursorReference: Image
  private _cursorState: Select = Select.START
  constructor(
    private readonly _atlas: Atlas.Definition,
    private readonly _recorder: Recorder
  ) {
    this._store = new Store(_atlas)
    let logo = NatureElsewhere.create(_atlas, 1, {x: 0, y: 6})
    const chars = Text.toImages(_atlas, 'episode 0                rndmem')
    Image.setPalette(Palette.GREYS + Tone.HALF, chars)
    Image.moveBy(
      {x: 0, y: Image.target(logo).y + Image.target(logo).h + 3},
      chars
    )
    logo = logo.concat(chars)

    const menuText = `
> start
  settings
  level editor
  exit
    `.trim()
    const menuChars = Text.toImages(_atlas, menuText)
    this._cursor = menuChars[0]
    this._cursorReference = menuChars[1]
    Image.moveBy(
      {
        x:
          Math.trunc(Image.target(logo).x + Image.target(logo).w / 2) -
          Math.trunc(Image.target(menuChars).w / 2 + 3),
        y: Image.target(logo).y + Image.target(logo).h + 6
      },
      menuChars
    )
    logo = logo.concat(menuChars)
    this._logo = new ImageGroup(logo)

    this._footer = new ImageGroup(
      Text.toImages(
        _atlas,
        `${process.env.date}  v${process.env.version} (${process.env.hash})`
      )
    )
    this._footer.setPalette(Palette.GREYS + Tone.HALF)

    this._store.addImages(
      Image.new(_atlas, AnimationID.PIXEL, {
        palette: Palette.YELLOWS,
        preScale: Limits.MAX_XY
      }),
      ...this._logo.images(),
      ...this._footer.images(),
      Image.new(_atlas, AnimationID.CLOUD_M, {
        palette: Palette.GREYS,
        layer: 3,
        position: {x: 105 + 10 - 40, y: 2}
      }),
      Image.new(_atlas, AnimationID.RAIN, {
        palette: Palette.BLUES,
        layer: 3,
        position: {x: 105 + 10 - 40 + 1, y: 2 + 6},
        preScale: {x: 1, y: 100},
        offsetRate: {x: 0, y: -0.004}
      }),

      Image.new(_atlas, AnimationID.CLOUD_S, {
        palette: Palette.GREYS,
        layer: 3,
        position: {x: 65 + 10 - 40, y: 22}
      }),
      Image.new(_atlas, AnimationID.RAIN, {
        palette: Palette.BLUES,
        layer: 3,
        position: {x: 65 + 10 - 40 + 1, y: 22 + 6},
        preScale: {x: 1, y: 100},
        offsetRate: {x: 0, y: -0.004}
      }),

      Image.new(_atlas, AnimationID.CLOUD_XL, {
        palette: Palette.GREYS,
        layer: 3,
        position: {x: 120 + 10 - 40, y: 36}
      }),
      Image.new(_atlas, AnimationID.RAIN, {
        palette: Palette.BLUES,
        layer: 3,
        position: {x: 120 + 10 - 40 + 1, y: 36 + 6},
        preScale: {x: 1, y: 100},
        offsetRate: {x: 0, y: -0.004}
      })
    )
  }

  scale(canvas: WH) {
    return Viewport.scale(canvas, Defaults.minScreenSize, 0)
  }

  update(then: number, now: number, cam: Rect): LevelUpdate {
    let nextLevel: Level | undefined = this
    this._logo.centerOn(cam)
    this._footer.moveTo({x: cam.x + 1, y: cam.y + cam.h - 5})
    if (this._recorder.down(true)) {
      this._cursorState = NumberUtil.wrap(
        this._cursorState + 1,
        Select.START,
        Select.END
      )
    }
    if (this._recorder.up(true)) {
      this._cursorState = NumberUtil.wrap(
        this._cursorState - 1,
        Select.START,
        Select.END
      )
    }
    if (this._recorder.action(true)) {
      switch (this._cursorState) {
        case Select.START:
          nextLevel = new FieldsLevel(this._atlas)
          break
        case Select.SETTINGS:
          nextLevel = new SettingsLevel(this._atlas)
          break
        case Select.EXIT:
          nextLevel = undefined
          break
      }
    }
    this._cursor.moveTo({
      x: this._cursor.target().x,
      y: this._cursorReference.target().y + this._cursorState * 5
    })
    return {nextLevel, ...this._store.update(now - then, cam)}
  }
}

enum Select {
  START,
  SETTINGS,
  LEVEL_EDITOR,
  EXIT,
  END
}