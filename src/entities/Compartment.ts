import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityCollider} from '../collision/EntityCollider'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {Input} from '../inputs/Input'
import {JSONValue} from '../utils/JSON'
import {Layer} from '../sprite/Layer'
import {Rect} from '../math/Rect'
import {Sprite} from '../sprite/Sprite'
import {SpriteRect} from '../spriteStateMachine/SpriteRect'
import {UpdateState} from '../updaters/UpdateState'
import {SpriteStateMap} from '../spriteStateMachine/SpriteStateMachine'
import {UpdateStatus} from '../updaters/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export class Compartment extends Entity<
  Compartment.Variant,
  Compartment.State
> {
  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<Compartment.Variant, Compartment.State>
  ) {
    super({
      ...defaults,
      collisionBodies: defaults.collisionBodies.map(Rect.copy),
      map: variantMap(atlas),
      ...props
    })
  }

  update(state: UpdateState): UpdateStatus {
    let status = super.update(state)
    const collision = EntityCollider.collidesEntity(state.level.cursor, this)
    if (collision.length) status |= this.collides(collision, state)
    return status
  }

  collides(entities: readonly Entity[], state: UpdateState): UpdateStatus {
    let status = super.collides(entities, state)

    const triggered = Input.activeTriggered(state.inputs.pick)
    if (!triggered) return status

    const nextState =
      this.state === Compartment.State.CLOSED
        ? Compartment.State.OPENED
        : Compartment.State.CLOSED

    status |= this.transition(nextState) | UpdateStatus.TERMINATE
    return status
  }

  transition(state: Compartment.State): UpdateStatus {
    const status = super.transition(state)
    if (status & UpdateStatus.UPDATED) {
      const open = state === Compartment.State.OPENED
      this.sprites[SpriteIndex.DRAWER].moveTo(
        new XY(
          this.origin.x + (open ? -1 : 0) * (drawerProtrusion + drawerWidth),
          this.origin.y
        )
      )
    }
    return status
  }

  invalidateBounds(): void {
    this._bounds.size.w = unitSize.w
    this._bounds.size.h = unitSize.h
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
  }
}

export namespace Compartment {
  export enum Variant {
    EGG = 'egg'
  }

  export enum State {
    CLOSED = 'closed',
    OPENED = 'opened' // How to gracefully animate between states? They're identical states except for the animation position.
  }
}

function variantMap(atlas: Atlas): SpriteStateMap<Compartment.State> {
  const rect = new SpriteRect({sprites: variantSprites(atlas)})
  return {[Compartment.State.CLOSED]: rect, [Compartment.State.OPENED]: rect}
}

function variantSprites(atlas: Atlas): Sprite[] {
  const sprites = []
  sprites[SpriteIndex.DRAWER] = Sprite.withAtlasSize(atlas, {
    id: AtlasID.EGG_COMPARTMENT_DRAWER,
    x: drawerProtrusion,
    layer: Layer.UI_HI
  })
  sprites[SpriteIndex.UNIT] = Sprite.withAtlasSize(atlas, {
    id: AtlasID.EGG_COMPARTMENT_UNIT,
    layer: Layer.UI_HIHI
  })
  return sprites
}

enum SpriteIndex {
  UNIT,
  DRAWER
}

const drawerProtrusion: number = -2
const drawerWidth: number = 49
const unitSize: Readonly<WH> = Object.freeze(new WH(17, 17))

const defaults = Object.freeze({
  type: EntityType.COMPARTMENT,
  variant: Compartment.Variant.EGG,
  state: Compartment.State.CLOSED,
  collisionType: CollisionType.TYPE_UI,
  collisionPredicate: CollisionPredicate.BODIES,
  collisionBodies: Object.freeze([
    Object.freeze(Rect.make(0, 0, unitSize.w, unitSize.h))
  ])
})
