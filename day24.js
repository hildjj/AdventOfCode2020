'use strict'

const Utils = require('./utils')
const DefaultMap = require('./DefaultMap')

function load(inp) {
  const tiles = new DefaultMap(false)
  for (const line of inp) {
    let q = 0
    let r = 0
    for (const [x, y] of line) {
      q += x
      r += y
    }
    const idx = [q, r].toString()
    tiles.set(idx, !tiles.get(idx))
  }
  return tiles
}

function part1(inp, args) {
  const tiles = load(inp)
  return tiles.size
}

// see: https://www.redblobgames.com/grids/hexagons/#map-storage
const NEIGHBORS = [
  [1,  0], // e
  [0,  1], // se
  [-1, 1], // sw
  [-1, 0], // w
  [0, -1], // nw
  [1, -1]  // ne
]

function part2(inp, args) {
  let tiles = load(inp)

  // DefaultMap only has black tiles in it
  for (let day=0; day<100; day++) {
    const newTiles = new DefaultMap(false)
    const checked = new Set()
    for (const [k, v] of tiles) {
      // for each black tile, compute that tile, and everything it touches
      // that is white.  checked keeps track of if we've checked a white
      // hex before, which yields a 30% perf win
      const [q, r] = k.split(',').map(x => parseInt(x))
      let bcount = 0
      for (const [x, y] of NEIGHBORS) {
        const idx = [q+x, r+y].toString()
        const n = tiles.get(idx)
        if (n) {
          bcount++
        } else {
          // only white tiles.  Black ones will be caught by outer loop
          if (checked.has(idx)) {
            continue
          }
          checked.add(idx)
          let wcount = 0
          for (const [wx, wy] of NEIGHBORS) {
            if (tiles.get([q+x+wx, r+y+wy])) {
              wcount++
            }
          }
          if (wcount === 2) {
            newTiles.set(idx, true)
          }
        }
      }
      newTiles.set(k, (bcount !== 0) && (bcount < 3))
    }
    tiles = newTiles
  }
  return tiles.size
}

function main(inFile, trace, args) {
  const inp = Utils.parseFile(inFile, null, trace)
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
