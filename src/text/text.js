import * as drawable from '../drawables/drawable.js'
import * as entity from '../entities/entity.js'
import * as memFont from './mem-font.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from '../entities/entity-id.js'

const bounds = {x: 0, y: 0, w: 80, h: 80}

/**
 * @arg {XY} position
 * @arg {string} string
 * @return {entity.State}
 */
export function newState(position, string) {
  const drawables = []
  const measurement = measure(string)
  loop: for (const line of measurement) {
    for (const character of line) {
      if (character.y + (memFont.lineHeightPx + memFont.leadingPx) < bounds.y)
        continue

      const id = 'MEM_FONT_' + character.character.charCodeAt(0)
      const d = drawable.newState(
        /** @type {Record<string, string>} */ (AnimationID)[id],
        {x: character.x, y: character.y - bounds.y}
      )
      if (character.y >= bounds.y + bounds.h) break loop
      drawables.push(d)
    }
  }
  return entity.newState(EntityID.TEXT, drawables, position)
}

/**
 * @arg {string} string
 * @return {(XY & {character: string})[][]}
 */
function measure(string) {
  let i = 0
  let x = 0
  let y = 0
  /** @type {(XY & {character: string})[][]} */ const lines = [[]]
  let line = 0
  for (const character of string) {
    if (
      (x &&
        x + wordWidthPx(string.slice(i)) > bounds.w &&
        wordWidthPx(string.slice(i)) <= bounds.w) ||
      x + memFont.characterWidthPx(character) > bounds.w
    ) {
      x = 0
      y += memFont.lineHeightPx + memFont.leadingPx
      ++line
      lines[line] = []
      if (!/\s/.test(character)) {
        lines[line].push({
          x,
          y: y + memFont.characterYOffsetPx(character),
          character
        })
        x += incrementX(character, string[i + 1])
      }
    } else {
      lines[line].push({
        x,
        y: y + memFont.characterYOffsetPx(character),
        character
      })
      x += incrementX(character, string[i + 1])
    }
    ++i
  }
  return lines
}

/**
 * @arg {string} lhs
 * @arg {string} rhs
 * @return {number}
 */
function incrementX(lhs, rhs) {
  return memFont.characterWidthPx(lhs) + memFont.kerningPx(lhs, rhs)
}

/**
 * @arg {string} string
 * @return {number}
 */
function wordWidthPx(string) {
  let width = 0
  let i = 0
  for (const character of string) {
    if (/\s/.test(character)) return width
    width += incrementX(character, string[i + 1])
    ++i
  }
  return width
}
