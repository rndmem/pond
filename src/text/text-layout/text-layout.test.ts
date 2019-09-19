import {lineHeight} from '../../assets/mem-font.json'
import {TextLayout} from './text-layout'
import {XY} from '../../math/xy/xy'

describe('layout()', () =>
  test.each(<readonly [string, number, TextLayout][]>[
    ['', Number.MAX_VALUE, {positions: [], cursor: {x: 0, y: 0 * lineHeight}}],
    [
      ' ',
      Number.MAX_VALUE,
      {positions: [undefined], cursor: {x: 4, y: 0 * lineHeight}}
    ],
    [
      '\n',
      Number.MAX_VALUE,
      {positions: [undefined], cursor: {x: 0, y: 1 * lineHeight}}
    ],
    [
      'abc def ghi jkl mno',
      Number.MAX_VALUE,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 8, y: 0 * lineHeight},
          undefined,
          {x: 15, y: 0 * lineHeight},
          {x: 19, y: 0 * lineHeight},
          {x: 23, y: 0 * lineHeight},
          undefined,
          {x: 29, y: 1 + 0 * lineHeight},
          {x: 33, y: 0 * lineHeight},
          {x: 37, y: 0 * lineHeight},
          undefined,
          {x: 42, y: 1 + 0 * lineHeight},
          {x: 46, y: 0 * lineHeight},
          {x: 50, y: 0 * lineHeight},
          undefined,
          {x: 56, y: 0 * lineHeight},
          {x: 60, y: 0 * lineHeight},
          {x: 64, y: 0 * lineHeight}
        ],
        cursor: {x: 67, y: 0 * lineHeight}
      }
    ],

    [
      'abc def ghi jkl mno',
      10,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          undefined,
          {x: 0, y: 2 * lineHeight},
          {x: 4, y: 2 * lineHeight},
          {x: 8, y: 2 * lineHeight},
          undefined,
          {x: 0, y: 1 + 3 * lineHeight},
          {x: 4, y: 3 * lineHeight},
          {x: 8, y: 3 * lineHeight},
          undefined,
          {x: 0, y: 1 + 4 * lineHeight},
          {x: 4, y: 4 * lineHeight},
          {x: 8, y: 4 * lineHeight},
          undefined,
          {x: 0, y: 5 * lineHeight},
          {x: 4, y: 5 * lineHeight},
          {x: 0, y: 6 * lineHeight}
        ],
        cursor: {x: 3, y: 6 * lineHeight}
      }
    ],
    [
      'abc def ghi jkl mno',
      20,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 8, y: 0 * lineHeight},
          undefined,
          {x: 0, y: 1 * lineHeight},
          {x: 4, y: 1 * lineHeight},
          {x: 8, y: 1 * lineHeight},
          undefined,
          {x: 0, y: 1 + 2 * lineHeight},
          {x: 4, y: 2 * lineHeight},
          {x: 8, y: 2 * lineHeight},
          undefined,
          {x: 0, y: 1 + 3 * lineHeight},
          {x: 4, y: 3 * lineHeight},
          {x: 8, y: 3 * lineHeight},
          undefined,
          {x: 0, y: 4 * lineHeight},
          {x: 4, y: 4 * lineHeight},
          {x: 8, y: 4 * lineHeight}
        ],
        cursor: {x: 11, y: 4 * lineHeight}
      }
    ],
    [
      'abc def ghi jkl mno',
      21,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 8, y: 0 * lineHeight},
          undefined,
          {x: 0, y: 1 * lineHeight},
          {x: 4, y: 1 * lineHeight},
          {x: 8, y: 1 * lineHeight},
          undefined,
          {x: 0, y: 1 + 2 * lineHeight},
          {x: 4, y: 2 * lineHeight},
          {x: 8, y: 2 * lineHeight},
          undefined,
          {x: 0, y: 1 + 3 * lineHeight},
          {x: 4, y: 3 * lineHeight},
          {x: 8, y: 3 * lineHeight},
          undefined,
          {x: 0, y: 4 * lineHeight},
          {x: 4, y: 4 * lineHeight},
          {x: 8, y: 4 * lineHeight}
        ],
        cursor: {x: 11, y: 4 * lineHeight}
      }
    ],

    [
      'a  b',
      4,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          undefined,
          undefined,
          {x: 0, y: 2 * lineHeight}
        ],
        cursor: {x: 3, y: 2 * lineHeight}
      }
    ],
    [
      'a  b ',
      4,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          undefined,
          undefined,
          {x: 0, y: 2 * lineHeight},
          undefined
        ],
        cursor: {x: 0, y: 3 * lineHeight}
      }
    ]
  ])('%#) %p %p => %p', (string, width, expected) =>
    expect(
      TextLayout.layout(string, width, {x: 1, y: 1 + 0 * lineHeight})
    ).toStrictEqual(expected)
  ))

describe('layoutWord()', () =>
  test.each(<readonly [XY, number, string, number, TextLayout][]>[
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      ' ',
      0,
      {positions: [], cursor: {x: 0, y: 0 * lineHeight}}
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      '',
      0,
      {positions: [], cursor: {x: 0, y: 0 * lineHeight}}
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      '\n',
      0,
      {positions: [], cursor: {x: 0, y: 0 * lineHeight}}
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'a',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}],
        cursor: {x: 3, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      '.',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}],
        cursor: {x: 1, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'a ',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}],
        cursor: {x: 3, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'a\n',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}],
        cursor: {x: 3, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'a a',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}],
        cursor: {x: 3, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'a.',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}, {x: 4, y: 0 * lineHeight}],
        cursor: {x: 5, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'aa',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}, {x: 4, y: 0 * lineHeight}],
        cursor: {x: 7, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'aa\n',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}, {x: 4, y: 0 * lineHeight}],
        cursor: {x: 7, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'aa aa',
      0,
      {
        positions: [{x: 0, y: 0 * lineHeight}, {x: 4, y: 0 * lineHeight}],
        cursor: {x: 7, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'g',
      0,
      {
        positions: [{x: 0, y: 1 + 0 * lineHeight}],
        cursor: {x: 3, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 8, y: 0 * lineHeight},
          {x: 12, y: 0 * lineHeight},
          {x: 16, y: 0 * lineHeight},
          {x: 20, y: 0 * lineHeight},
          {x: 23, y: 1 + 0 * lineHeight},
          {x: 27, y: 0 * lineHeight}
        ],
        cursor: {x: 30, y: 0 * lineHeight}
      }
    ],

    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'abcdefgh',
      1,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 8, y: 0 * lineHeight},
          {x: 12, y: 0 * lineHeight},
          {x: 16, y: 0 * lineHeight},
          {x: 19, y: 1 + 0 * lineHeight},
          {x: 23, y: 0 * lineHeight}
        ],
        cursor: {x: 26, y: 0 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      Number.MAX_VALUE,
      'abcdefgh',
      8,
      {positions: [], cursor: {x: 0, y: 0 * lineHeight}}
    ],

    [
      {x: 0, y: 0 * lineHeight},
      0,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 0, y: 5 * lineHeight},
          {x: 0, y: 1 + 6 * lineHeight},
          {x: 0, y: 7 * lineHeight}
        ],
        cursor: {x: 3, y: 7 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      1,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 0, y: 5 * lineHeight},
          {x: 0, y: 1 + 6 * lineHeight},
          {x: 0, y: 7 * lineHeight}
        ],
        cursor: {x: 3, y: 7 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      3,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 0, y: 5 * lineHeight},
          {x: 0, y: 1 + 6 * lineHeight},
          {x: 0, y: 7 * lineHeight}
        ],
        cursor: {x: 3, y: 7 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 0, y: 5 * lineHeight},
          {x: 0, y: 1 + 6 * lineHeight},
          {x: 0, y: 7 * lineHeight}
        ],
        cursor: {x: 3, y: 7 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      6,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 0, y: 5 * lineHeight},
          {x: 0, y: 1 + 6 * lineHeight},
          {x: 0, y: 7 * lineHeight}
        ],
        cursor: {x: 3, y: 7 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      7,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 4, y: 4 * lineHeight},
          {x: 0, y: 1 + 5 * lineHeight},
          {x: 4, y: 5 * lineHeight}
        ],
        cursor: {x: 7, y: 5 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      8,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 4, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 4, y: 2 * lineHeight},
          {x: 0, y: 1 + 3 * lineHeight},
          {x: 4, y: 3 * lineHeight}
        ],
        cursor: {x: 7, y: 3 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      9,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 4, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 4, y: 2 * lineHeight},
          {x: 0, y: 1 + 3 * lineHeight},
          {x: 4, y: 3 * lineHeight}
        ],
        cursor: {x: 7, y: 3 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      10,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 4, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 4, y: 2 * lineHeight},
          {x: 0, y: 1 + 3 * lineHeight},
          {x: 4, y: 3 * lineHeight}
        ],
        cursor: {x: 7, y: 3 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      11,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 4, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 4, y: 2 * lineHeight},
          {x: 7, y: 1 + 2 * lineHeight},
          {x: 0, y: 3 * lineHeight}
        ],
        cursor: {x: 3, y: 3 * lineHeight}
      }
    ],
    [
      {x: 0, y: 0 * lineHeight},
      12,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 0 * lineHeight},
          {x: 4, y: 0 * lineHeight},
          {x: 8, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 4, y: 1 * lineHeight},
          {x: 8, y: 1 * lineHeight},
          {x: 0, y: 1 + 2 * lineHeight},
          {x: 4, y: 2 * lineHeight}
        ],
        cursor: {x: 7, y: 2 * lineHeight}
      }
    ],

    [
      {x: 1, y: 0 * lineHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 1, y: 0 * lineHeight},
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 0, y: 5 * lineHeight},
          {x: 0, y: 1 + 6 * lineHeight},
          {x: 0, y: 7 * lineHeight}
        ],
        cursor: {x: 3, y: 7 * lineHeight}
      }
    ],
    [
      {x: 2, y: 0 * lineHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 1 * lineHeight},
          {x: 0, y: 2 * lineHeight},
          {x: 0, y: 3 * lineHeight},
          {x: 0, y: 4 * lineHeight},
          {x: 0, y: 5 * lineHeight},
          {x: 0, y: 6 * lineHeight},
          {x: 0, y: 1 + 7 * lineHeight},
          {x: 0, y: 8 * lineHeight}
        ],
        cursor: {x: 3, y: 8 * lineHeight}
      }
    ],

    [
      {x: 2, y: 1 + 0 * lineHeight},
      5,
      'abcdefgh',
      0,
      {
        positions: [
          {x: 0, y: 1 + 1 * lineHeight},
          {x: 0, y: 1 + 2 * lineHeight},
          {x: 0, y: 1 + 3 * lineHeight},
          {x: 0, y: 1 + 4 * lineHeight},
          {x: 0, y: 1 + 5 * lineHeight},
          {x: 0, y: 1 + 6 * lineHeight},
          {x: 0, y: 1 + 1 + 7 * lineHeight},
          {x: 0, y: 1 + 8 * lineHeight}
        ],
        cursor: {x: 3, y: 1 + 8 * lineHeight}
      }
    ]
  ])('%#) %p %p %p %p => %p', (cursor, width, string, index, expected) =>
    expect(
      TextLayout.layoutWord(cursor, width, string, index, {
        x: 1,
        y: 1 + 0 * lineHeight
      })
    ).toStrictEqual(expected)
  ))