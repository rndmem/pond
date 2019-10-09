import {Assert} from '../utils/Assert'
import {AtlasID} from '../atlas/AtlasID'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {EntityCollider} from '../collision/EntityCollider'
import {EntityConfig} from './EntityParser'
import {EntityID} from './EntityID'
import {EntityType} from './EntityType'
import {FloatXY, XY} from '../math/XY'
import {Image} from '../image/Image'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {ImageStateMachine} from '../imageStateMachine/ImageStateMachine'
import {JSONValue, JSONObject} from '../utils/JSON'
import {Layer} from '../image/Layer'
import {Level} from '../levels/Level'
import {ReadonlyRect, Rect} from '../math/Rect'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {ObjectUtil} from '../utils/ObjectUtil'

export abstract class Entity<
  Variant extends string = string,
  State extends string = string
> {
  /** A globally unique identifier for quick equality checks. It should be used
      for no other purpose. The value is transient and should not be preserved
      on entity serialization. */
  private readonly _spawnID: symbol = Symbol()

  private readonly _id: EntityID

  private readonly _type: EntityType
  /** Variants allow multiple forms of the same type. For example, two different
      representations of an apple tree. All variants must support all states.
      States are expected to change during execution but variants generally do
      not. */
  private readonly _variant: Variant

  /** The local coordinate system or minimal union of the entity and all of its
      children given in level coordinates with origin at (x, y). All images,
      collisions, and children are always in bounds and are also specified in
      level coordinates, not coordinates relative the local entity origin. This
      local coordinate system is necessary for calculating absolute translations
      (moveTo), and quick cached collision and layout checks such as determining
      if the entity is on screen. All of these states must be kept in sync. */
  private readonly _bounds: Rect

  private readonly _velocity: XY

  private readonly _velocityFraction: FloatXY

  private readonly _machine: ImageStateMachine<State | Entity.BaseState>

  private readonly _updatePredicate: UpdatePredicate
  private readonly _collisionType: CollisionType

  private _collisionPredicate: CollisionPredicate

  /** Collision bodies in level coordinates. Check for bounds intersection
      before testing each body. Images should not be considered directly for
      collision tests. */
  private readonly _collisionBodies: readonly Rect[]

  /** Operations are shallow by default (do not recurse children) unless
      specified otherwise. That is, only translation and animation are
      recursive. */
  private readonly _children: Entity[]

  constructor(props: Entity.Props<Variant, State>) {
    this._id = props.id || entityDefaults.id
    this._type = props.type
    this._variant = props.variant
    this._bounds = Rect.make(0, 0, 0, 0)
    this._velocity = props.velocity || entityDefaults.velocity.copy()
    this._velocityFraction = {x: 0, y: 0}
    this._machine = new ImageStateMachine({state: props.state, map: props.map})
    this._updatePredicate =
      props.updatePredicate || entityDefaults.updatePredicate
    this._collisionType =
      props.collisionType === undefined
        ? entityDefaults.collisionType
        : props.collisionType
    this._collisionPredicate =
      props.collisionPredicate || entityDefaults.collisionPredicate
    this._collisionBodies = props.collisionBodies || [
      ...entityDefaults.collisionBodies.map(rect =>
        Rect.make(rect.position.x, rect.position.y, rect.size.w, rect.size.h)
      )
    ]
    this._children = props.children || []
    this.setImageID(props.imageID)

    // Calculate the bounds of the entity's images, collision bodies, and all
    // children. Children themselves are not invalidated by this call.
    this.invalidateBounds()

    if (props.position) this.moveTo(props.position)
    if (props.scale) this.scaleTo(props.scale)

    Assert.assert(
      this.variants().includes(props.variant),
      `Unknown variant "${props.variant}".`
    )
  }

  get spawnID(): symbol {
    return this._spawnID
  }

  /** See Entity.spawnID. */
  equal(entity: Readonly<Entity>): boolean {
    return this.spawnID === entity.spawnID
  }

  get id(): EntityID {
    return this._id
  }

  get type(): EntityType {
    return this._type
  }

  get variant(): Variant {
    return this._variant
  }

  variants(): readonly Variant[] {
    if ('Variant' in this.constructor)
      return <Variant[]>Object.values(this.constructor['Variant'])
    return [this.variant]
  }

  get bounds(): ReadonlyRect {
    return this._bounds
  }

  /** This is a shallow invalidation. If a child changes state, or is added, the
      parents' bounds should be updated. */
  invalidateBounds(): void {
    const bounds = Rect.unionAll([
      this.imageBounds(),
      ...this.collisionBodies,
      ...this.children.map(child => child.bounds)
    ])
    if (bounds) {
      this._bounds.position.x = bounds.position.x
      this._bounds.position.y = bounds.position.y
      this._bounds.size.w = bounds.size.w
      this._bounds.size.h = bounds.size.h
    }
  }

  get velocity(): XY {
    return this._velocity
  }

  get updatePredicate(): UpdatePredicate {
    return this._updatePredicate
  }

  get collisionType(): CollisionType {
    return this._collisionType
  }

  get collisionPredicate(): CollisionPredicate {
    return this._collisionPredicate
  }

  set collisionPredicate(predicate: CollisionPredicate) {
    this._collisionPredicate = predicate
  }

  get collisionBodies(): readonly ReadonlyRect[] {
    return this._collisionBodies
  }

  get children(): readonly Entity[] {
    return this._children
  }

  addChildren(...entities: readonly Entity[]): void {
    this._children.push(...entities)
    this.invalidateBounds()
  }

  removeChild(child: Readonly<Entity>): void {
    const index = this.children.findIndex(entity => child.equal(entity))
    if (index === -1) return
    this._children.splice(index, 1)
    this.invalidateBounds()
  }

  replaceChild(child: Readonly<Entity>, entity: Entity): void {
    const index = this.children.findIndex(entity => child.equal(entity))
    if (index === -1) return
    this._children[index] = entity
    this.invalidateBounds()
  }

  addImages(...images: readonly Image[]): void {
    this._machine.addImages(...images)
    this.invalidateBounds()
  }

  /** The image bounds for the current entity (children and collision rectangles
      are not considered). */
  imageBounds(): ReadonlyRect {
    return this._machine.bounds()
  }

  moveTo(to: Readonly<XY>): UpdateStatus {
    return this.moveBy(to.sub(this.bounds.position))
  }

  /** Recursively move the entity, its images, its collision bodies, and all of
      its children. */
  moveBy(by: Readonly<XY>): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    if (!by.x && !by.y) return status
    this._bounds.position.x += by.x
    this._bounds.position.y += by.y
    status |= this._machine.moveBy(by)
    Rect.moveAllBy(this._collisionBodies, by)
    for (const child of this.children) child.moveBy(by)
    return status | UpdateStatus.UPDATED
  }

  scale(): Readonly<XY> {
    return this._machine.getScale()
  }

  scaleTo(to: Readonly<XY>): UpdateStatus {
    Assert.assert(to.x && to.y, `Scale must be nonzero (x=${to.x}, y=${to.y}).`)
    if (this.scale().equal(to)) return UpdateStatus.UNCHANGED
    const collisionScale = to.div(this.scale())
    const status = this._machine.scaleTo(to)
    if (status & UpdateStatus.UPDATED) {
      for (const body of this._collisionBodies) {
        body.size.w *= Math.abs(collisionScale.x)
        body.size.h *= Math.abs(collisionScale.y)
      }
    }
    this.invalidateBounds()
    return status
  }

  imageID(): Maybe<AtlasID> {
    return this._machine.getImageID()
  }

  setImageID(id?: AtlasID): UpdateStatus {
    return this._machine.setImageID(id)
  }

  images(): readonly Readonly<Image>[] {
    return this._machine.images()
  }

  replaceImages(state: State, ...images: readonly Image[]): UpdateStatus {
    return this._machine.replaceImages(state, ...images)
  }

  moveImagesBy(by: Readonly<XY>): UpdateStatus {
    const status = this._machine.moveBy(by)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  moveImagesTo(to: Readonly<XY>): UpdateStatus {
    const status = this._machine.moveTo(to)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  /** See ImageRect._origin. */
  origin(): Readonly<XY> {
    return this._machine.origin()
  }

  /** Recursively animate the entity and its children. Only visible entities are
      animated so its possible for a composition entity's children to be fully,
      *partly*, or not animated together. */
  animate(state: UpdateState): Readonly<Image>[] {
    if (!Rect.intersects(state.level.cam.bounds, this.bounds)) return []
    const visible = this._machine.intersects(state.level.cam.bounds)
    for (const image of visible) image.animate(state.time, state.level.atlas)
    for (const child of this.children) visible.push(...child.animate(state))
    return visible
  }

  resetAnimation(): void {
    this._machine.resetAnimation()
  }

  /** Returns whether the current entity is in the viewport or should always be
      updated. Children are not considered. */
  active(viewport: ReadonlyRect): boolean {
    return (
      this.updatePredicate === UpdatePredicate.ALWAYS ||
      Rect.intersects(this.bounds, viewport)
    )
  }

  state(): State | Entity.BaseState {
    return this._machine.state
  }

  states(): (State | Entity.BaseState)[] {
    return this._machine.getStates()
  }

  transition(state: State | Entity.BaseState): UpdateStatus {
    const status = this._machine.setState(state)
    if (status & UpdateStatus.UPDATED) this.invalidateBounds()
    return status
  }

  /** See UpdatePredicate. Actually this is going to go ahead and go into children so updte the docs */
  update(state: UpdateState, skipChildren = false): UpdateStatus {
    if (!this.active(state.level.cam.bounds)) return UpdateStatus.UNCHANGED

    let status = this._updatePosition(state)

    if (skipChildren) return status

    for (const child of this.children) {
      status |= child.update(state)
      if (UpdateStatus.terminate(status)) return status
    }

    return status
  }

  findByID(id: EntityID): Maybe<Entity> {
    return this.find(entity => entity.id === id)
  }

  findBySpawnID(spawnID: Symbol): Maybe<Entity> {
    return this.find(entity => entity.spawnID === spawnID)
  }

  find(predicate: (entity: Entity) => boolean): Maybe<Entity> {
    if (predicate(this)) return this
    for (const child of this.children) {
      const descendant = child.find(predicate)
      if (descendant) return descendant
    }
    return
  }

  /** Raise or lower an entity's images and its descendants' images for all
      states. */
  elevate(offset: Layer): void {
    this._machine.elevate(offset)
    for (const child of this.children) child.elevate(offset)
  }

  abstract toJSON(): JSONValue

  protected _toJSON(
    subDefaults: Omit<
      DeepImmutable<Entity.SubProps<Variant, State | Entity.BaseState>>,
      'children' | 'map'
    >
  ): JSONObject {
    const defaults: typeof entityDefaults & typeof subDefaults = {
      ...entityDefaults,
      state: Entity.BaseState.HIDDEN,
      ...ObjectUtil.definedEntry(subDefaults, 'id'),
      ...ObjectUtil.definedEntry(subDefaults, 'type'),
      ...(<Variant>ObjectUtil.definedEntry(subDefaults, 'variant')),
      ...ObjectUtil.definedEntry(subDefaults, 'position'),
      ...ObjectUtil.definedEntry(subDefaults, 'velocity'),
      ...ObjectUtil.definedEntry(subDefaults, 'imageID'),
      ...ObjectUtil.definedEntry(subDefaults, 'scale'),
      ...ObjectUtil.definedEntry(subDefaults, 'state'),
      ...ObjectUtil.definedEntry(subDefaults, 'updatePredicate'),
      ...ObjectUtil.definedEntry(subDefaults, 'collisionType'),
      ...ObjectUtil.definedEntry(subDefaults, 'collisionPredicate'),
      ...ObjectUtil.definedEntry(subDefaults, 'collisionBodies')
    }
    const diff: Writable<EntityConfig> = {type: this.type}
    if (this.id !== defaults.id) diff.id = this.id
    if (this.variant !== defaults.variant) diff.variant = this.variant
    if (!this.bounds.position.equal(defaults.position))
      diff.position = {x: this.bounds.position.x, y: this.bounds.position.y}
    if (!this.velocity.equal(defaults.velocity))
      diff.velocity = {x: this.velocity.x, y: this.velocity.y}
    if (this.imageID() && this.imageID() !== defaults.imageID)
      diff.imageID = this.imageID()
    if (!this.scale().equal(defaults.scale)) diff.scale = this.scale()
    if (this.state() !== defaults.state) diff.state = this.state()
    if (this.updatePredicate !== defaults.updatePredicate)
      diff.updatePredicate = this.updatePredicate
    if (this.collisionType !== defaults.collisionType)
      diff.collisionType = this.collisionType
    if (this.collisionPredicate !== defaults.collisionPredicate)
      diff.collisionPredicate = this.collisionPredicate
    if (
      this.collisionBodies.some(
        (body, i) => !Rect.equal(body, defaults.collisionBodies[i])
      )
    )
      diff.collisionBodies = this.collisionBodies
    return <JSONObject>(<unknown>diff)
  }

  private _updatePosition(state: UpdateState): UpdateStatus {
    // [todo] level bounds checking
    const from: Readonly<XY> = this.bounds.position.copy()

    const diagonal = this.velocity.x && this.velocity.y

    this._velocityFraction.x += this.velocity.x * state.time
    this._velocityFraction.y += this.velocity.y * state.time

    if (diagonal) {
      // When moving diagonally, synchronize / group integer boundary changes
      // across directions to minimize pixel changes per frame and avoid jarring.
      const max = Math.max(
        Math.abs(this._velocityFraction.x),
        Math.abs(this._velocityFraction.y)
      )
      this._velocityFraction.x = max * Math.sign(this.velocity.x)
      this._velocityFraction.y = max * Math.sign(this.velocity.y)
    }

    const translate: Readonly<XY> = XY.trunc(
      this._velocityFraction.x / 10_000,
      this._velocityFraction.y / 10_000
    )
    this._velocityFraction.x -= translate.x * 10_000
    this._velocityFraction.y -= translate.y * 10_000

    const to: Readonly<XY> = this.bounds.position.add(translate)
    let status = this.moveTo(to)
    if (!(status & UpdateStatus.UPDATED)) return UpdateStatus.UNCHANGED

    const entities = Level.activeParentsWithPlayer(state.level)

    let collidesWith = EntityCollider.collidesEntities(this, entities)
    if (
      !collidesWith.some(
        collision => collision.collisionType & CollisionType.OBSTACLE
      )
    )
      return status

    if (diagonal && collidesWith.length) {
      status |= this.moveTo(new XY(to.x, from.y))
      collidesWith = EntityCollider.collidesEntities(this, entities)
      if (
        collidesWith.some(
          collision => collision.collisionType & CollisionType.OBSTACLE
        )
      ) {
        status |= this.moveTo(new XY(from.x, to.y))
        collidesWith = EntityCollider.collidesEntities(this, entities)
      }
    }

    if (
      collidesWith.some(
        collision => collision.collisionType & CollisionType.OBSTACLE
      )
    )
      status |= this.moveTo(new XY(from.x, from.y))

    return status
  }
}

export namespace Entity {
  export enum BaseState {
    HIDDEN = 'hidden'
  }

  export interface Props<
    Variant extends string = string,
    State extends string = string
  > {
    /** Defaults to EntityID.UNDEFINED. */
    readonly id?: EntityID
    readonly type: EntityType
    readonly variant: Variant
    /** Defaults to (0, 0). */
    readonly position?: Readonly<XY>
    readonly scale?: XY
    readonly imageID?: AtlasID
    readonly velocity?: XY
    /** Defaults to {}. */
    readonly state: State | BaseState
    readonly map: Record<State | BaseState, ImageRect>
    /** Defaults to BehaviorPredicate.NEVER. */
    readonly updatePredicate?: UpdatePredicate
    /** Defaults to CollisionPredicate.NEVER. */
    readonly collisionType?: CollisionType
    readonly collisionPredicate?: CollisionPredicate
    /** Defaults to []. In local coordinates (converted to level by parser). */
    readonly collisionBodies?: Rect[]
    /** Defaults to []. */
    readonly children?: Entity[]
  }

  export interface SubProps<
    Variant extends string = string,
    State extends string = string
  >
    extends Optional<
      Entity.Props<Variant, State>,
      | 'type'
      | 'variant'
      | 'state'
      | 'map'
      | 'updatePredicate'
      | 'collisionType'
      | 'collisionPredicate'
      | 'collisionBodies'
    > {}

  export function findAnyBySpawnID(
    entities: readonly Entity[],
    spawnID: Symbol
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = entity.findBySpawnID(spawnID)
      if (found) return found
    }
    return
  }

  export function findAnyByID(
    entities: readonly Entity[],
    id: EntityID
  ): Maybe<Entity> {
    for (const entity of entities) {
      const found = entity.findByID(id)
      if (found) return found
    }
    return
  }
}

const entityDefaults: DeepImmutable<Omit<
  Required<Entity.Props>,
  'type' | 'variant' | 'map' | 'imageID' | 'children'
>> = Object.freeze({
  id: EntityID.ANONYMOUS,
  state: Entity.BaseState.HIDDEN,
  position: Object.freeze(new XY(0, 0)),
  velocity: Object.freeze(new XY(0, 0)),
  updatePredicate: UpdatePredicate.INTERSECTS_VIEWPORT,
  collisionType: CollisionType.INERT,
  collisionPredicate: CollisionPredicate.NEVER,
  collisionBodies: Object.freeze([]),
  imageID: undefined,
  scale: Object.freeze(new XY(1, 1))
})
