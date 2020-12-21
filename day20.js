'use strict'

const Utils = require('./utils')
const range = Utils.range

const TOP = 0
const BOTTOM = 1
const LEFT = 2
const RIGHT = 3
const ALL_DIRS = [TOP, BOTTOM, LEFT, RIGHT]

function rot(ary, times) {
  // todo: optimize all of this
  for (const c of range(times)) {
    const newA = Array.apply(null, Array(ary[0].length)).map(() => [])
    const len = ary.length
    for (const j of range(len)) {
      for (const i of range(ary[j].length)) {
        newA[j][i] = ary[len-i-1][j]
      }
    }

    ary = newA
  }
  return ary
}
function flipH(ary) {
  return ary.map(r => [...r].reverse())
}
function flipV(ary) {
  return [...ary].reverse()
}

// there are 8 possible flops, each of which can be gotten to two ways:
// tl: 0, r2hv
// tr: 0h, r2v
// bl: 0v, r2h
// br: r2, 0hv
// lb: r1, r3hv
// lt: r1h, r3v
// rt: r3, r1hv
// rb: r1v, r3h
//
// note that opposite edges can never be adjacent, which is why there aren't 16

const FLOP_TYPES = {
  '0':   [TOP,    BOTTOM, LEFT,   RIGHT],
  '0h':  [TOP,    BOTTOM, RIGHT,  LEFT],
  '0v':  [BOTTOM, TOP,    LEFT,   RIGHT],
  'r2':  [BOTTOM, TOP,    RIGHT,  LEFT],
  'r1':  [LEFT,   RIGHT,  BOTTOM, TOP],
  'r1h': [LEFT,   RIGHT,  TOP,    BOTTOM],
  'r3':  [RIGHT,  LEFT,   TOP,    BOTTOM],
  'r1v': [RIGHT,  LEFT,   BOTTOM, TOP]
}

function flopArray(img, dir) {
  switch (dir) {
    case '0':
    case 'r2hv':
      return img
    case '0h':
    case 'r2v':
      return flipH(img)
    case '0v':
    case 'r2h':
      return flipV(img)
    case 'r2':
    case '0hv':
      return rot(img, 2)
    case 'r1':
    case 'r3hv':
      return rot(img, 1)
    case 'r1h':
    case 'r3v':
      return flipH(rot(img, 1))
    case 'r3':
    case 'r1hv':
      return rot(img, 3)
    case 'r1v':
    case 'r3h':
      return flipV(rot(img, 1))
  }
  throw new Error(`invalid flop: ${dir}`)
}

class Tile {
  constructor(name, img) {
    this.name = name
    this.img = img
    this.dirs = []
    this.edges = [-1, -1, -1, -1] // the names of the tiles we're next to

    // characterize each edge by both it's bits as well as it's reversed bits,
    // which happen on half of the flops.
    const top = [...img[0]]
    this.dirs.push(top.join(''))
    this.dirs.push(top.reverse().join(''))

    const bottom = [...img[img.length - 1]]
    this.dirs.push(bottom.join(''))
    this.dirs.push(bottom.reverse().join(''))

    const left = img.map(r => r[0])
    this.dirs.push(left.join(''))
    this.dirs.push(left.reverse().join(''))

    const right = img.map(r => r[r.length - 1])
    this.dirs.push(right.join(''))
    this.dirs.push(right.reverse().join(''))
  }

  str() {
    let s = ''
    for (const row of this.img) {
      s += row.map(x => x == '1' ? '#' : '.').join('') + '\n'
    }
    return s
  }
  cutEdges() {
    // cut down the size of the image by slicing off all four edges
    this.img.shift()
    this.img.pop()
    for (const row of this.img) {
      row.shift()
      row.pop()
    }
  }
  findDir(top, left) {
    for (const [name, dirs] of Object.entries(FLOP_TYPES)) {
      // flop types are distinct by two adjacent edges
      if ((top === this.edges[dirs[0]]) && (left === this.edges[dirs[2]])) {
        return [name, dirs]
      }
    }
    throw new Error('BAD DIR')
  }
  rotate(top, left) {
    // rotate the image until the given edges such that the top and left
    // edges are facing the correct neighbors
    const [name, dirs] = this.findDir(top, left)
    this.edges = [...Utils.pick(this.edges, dirs)]
    this.img = flopArray(this.img, name)
  }
}

class Deck {
  constructor() {
    this.list = {}
    this.edges = {}
  }
  addTile(name, img) {
    const t = new Tile(name, img)
    this.list[name] = t
    for (const sig of t.dirs) {
      const edge = this.edges[sig]
      if (!edge) {
        this.edges[sig] = [name]
      } else {
        this.edges[sig].push(name)
      }
    }
    return t
  }
  findCorners() {
    const corners = []
    for (const t of this) {
      let neighbors = 0
      for (const dir of ALL_DIRS) {
        const dirEdges = this.edges[t.dirs[dir*2]]
        const matches = dirEdges.filter(d => d !== t.name)
        if (matches.length == 1) {
          // On the edges, there won't be any matching edge that isn't us.
          // If there's a neighbor that way, there will be exactly one match.
          t.edges[dir] = matches[0]
          neighbors++
        } else if (matches.length !== 0) {
          throw new Error('Invalid puzzle')
        }
      }
      if (neighbors === 2) {
        corners.push(t.name)
      }
    }

    return corners
  }
  tile(name) {
    return this.list[name]
  }
  img(name) {
    return this.list[name].img
  }

  *[Symbol.iterator]() {
    yield *Object.values(this.list)
  }
}

function part1(inp, args) {
  const deck = new Deck()
  for (const [tile, img] of inp) {
    deck.addTile(tile, img)
  }
  return deck.findCorners().reduce((t, x) => t * x, 1)
}

function part2(inp, args) {
  const deck = new Deck()
  for (const [tile, img] of inp) {
    deck.addTile(tile, img)
  }
  const corners = deck.findCorners()

  // Starting at one of the corners (doesn't matter which), fit each piece
  // into the puzzle by selecting the piece that matches the needed top and
  // left, then flopping it around until it fits.
  let t = deck.tile(corners.shift())
  const img = [[]]
  let left = -1
  let row = img[0]
  let lastRow = Utils.forEver(-1)
  while (true) {
    t.rotate(lastRow.next().value, left)
    row.push(t.name)
    if (t.edges[RIGHT] === -1) {
      // end of row
      if (t.edges[BOTTOM] === -1) {
        // last row
        break
      }
      // go to the tile under the first one in the current row
      t = deck.tile(deck.tile(row[0]).edges[BOTTOM])
      lastRow = row[Symbol.iterator]()
      row = []
      img.push(row)
      left = -1
    } else {
      left = t.name
      t = deck.tile(t.edges[RIGHT])
    }
  }

  // cut down all of the edges of each tile
  for (const t of deck) {
    t.cutEdges()
  }

  const bigPicture = []
  for (const row of img) {
    for (const subrow of Utils.range(deck.img(row[0]).length)) {
      let cat = []
      for (const i of row) {
        cat = cat.concat(deck.img(i)[subrow])
      }
      bigPicture.push(cat)
    }
  }

  const SNAKE = `\
                  #
#    ##    ##    ###
 #  #  #  #  #  #`
  const SNAKE_COORDS = []
  for (const [j, row] of SNAKE.split('\n').entries()) {
    for (const [i, c] of row.split('').entries()) {
      if (c === '#') {
        // offsets from top-left of snake
        SNAKE_COORDS.push([i, j])
      }
    }
  }

  function findSnakes(img) {
    const allStars = new Set() // hey there.
    let inSnake = new Set()
    let anyFound = false

    // should cut this down by the size of the snake on the right and bottom
    // sides, but it's already fast enough
    for (const [j, row] of img.entries()) {
      for (const i of range(row.length)) {
        if (img[j][i]) {
          allStars.add(`${i},${j}`)
        }
        let found = true
        const thisSnake = new Set()
        for (const [x, y] of SNAKE_COORDS) {
          found = found && img[j+y]?.[i+x]
          if (!found) {
            break
          }
          thisSnake.add(`${i+x},${j+y}`)
        }
        if (found) {
          inSnake = new Set([...inSnake, ...thisSnake])
          anyFound = true
        }
      }
    }
    if (anyFound) {
      // allStars - inSnake
      return new Set([...allStars].filter(coord => !inSnake.has(coord))).size
    }
  }

  for (const flop of Object.keys(FLOP_TYPES)) {
    const c = findSnakes(flopArray(bigPicture, flop))
    if (c) {
      return c
    }
  }

  return null
}

function main(inFile, trace, args) {
  const inp = Utils.parseFile(inFile, null, trace)
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
