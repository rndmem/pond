import {Entity} from '../entity/Entity'
import {EntityType} from '../entity/EntityType'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {Image} from '../image/Image'
import {AtlasID} from '../atlas/AtlasID'
import {Atlas} from 'aseprite-atlas'
import {CollisionType} from '../collision/CollisionType'
import {XY} from '../math/XY'
import {Layer} from '../image/Layer'

export class Path extends Entity<Path.State> {
  constructor(atlas: Atlas, props?: Entity.SubProps<Path.State>) {
    super({
      type: EntityType.SCENERY_PATH,
      state: Path.State.STRAIGHT_NE,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [Path.State.STRAIGHT_NE]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_PATH_NE,
              layer: Layer.ABOVE_PLANE
            })
          ]
        }),
        [Path.State.STRAIGHT_NW]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_PATH_NE,
              layer: Layer.ABOVE_PLANE,
              scale: new XY(-1, 1)
            })
          ]
        }),
        [Path.State.CORNER_E]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_PATH_CORNER_E,
              layer: Layer.ABOVE_PLANE
            })
          ]
        }),
        [Path.State.CORNER_W]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_PATH_CORNER_E,
              layer: Layer.ABOVE_PLANE,
              scale: new XY(-1, 1)
            })
          ]
        }),
        [Path.State.CORNER_N]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_PATH_CORNER_N,
              layer: Layer.ABOVE_PLANE
            })
          ]
        }),
        [Path.State.CORNER_S]: new ImageRect({
          images: [
            new Image(atlas, {
              id: AtlasID.SCENERY_PATH_CORNER_N,
              layer: Layer.ABOVE_PLANE,
              scale: new XY(1, -1)
            })
          ]
        })
      },
      collisionType: CollisionType.TYPE_SCENERY,
      ...props
    })
  }
}

export namespace Path {
  export enum State {
    STRAIGHT_NE = '/',
    STRAIGHT_NW = '\\',
    CORNER_N = '^',
    CORNER_E = '>',
    CORNER_S = 'v',
    CORNER_W = '<'
  }
}