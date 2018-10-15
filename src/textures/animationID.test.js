import * as asepriteParser from '../parsers/asepriteParser.js'
import * as atlas from './atlas.js'
import * as util from '../util.js'
import {AnimationID} from './animationID.js'
import atlasJSON from '../assets/atlas.js'

/** @type {atlas.Atlas} */ const state = asepriteParser.parse(atlasJSON)
const ids = /** @type {AnimationID[]}*/ (util.values(AnimationID))

test.each(ids)('%# AnimationID %p is unique', (/** @type {AnimationID}*/ id) =>
  expect(
    ids.filter((/** @type {AnimationID}*/ val) => id === val)
  ).toHaveLength(1)
)

test.each(ids)('%# AnimationID %p has an Animation', (
  /** @type {AnimationID}*/ id
) => expect(state.animations).toHaveProperty(id))

test.each(
  /** @type {(keyof atlas.AnimationMap)[]}*/ (util.keys(state.animations))
)('%# animation ID %p has a AnimationID', (/** @type {string} */ id) =>
  expect(
    ids.filter((/** @type {AnimationID} */ val) => id === val)
  ).toHaveLength(1)
)