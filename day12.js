'use strict'

const Utils = require('./utils')
const assert = require('assert')

const DIRS = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0]
}
const DIRKEYS = Object.keys(DIRS)

function part1(inp) {
  let cur = 1 // East
  let x = 0
  let y = 0

  for (let [dir, dist] of inp) {
    if (dir === 'F') {
      dir = DIRKEYS[cur]
    }
    switch (dir) {
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        x += DIRS[dir][0] * dist
        y += DIRS[dir][1] * dist
        break
      case 'L':
        cur = (cur - (dist / 90) + 4) % 4
        break
      case 'R':
        cur = (cur + (dist / 90)) % 4
        break
    }
  }

  return Math.abs(x) + Math.abs(y)
}

function part2(inp) {
  let x = 0
  let y = 0
  let wx = 10
  let wy = -1

  for (const [dir, dist] of inp) {
    switch (dir) {
      case 'F':
        x += wx * dist
        y += wy * dist
        break
      case 'N':
      case 'S':
      case 'E':
      case 'W':
        wx += DIRS[dir][0] * dist
        wy += DIRS[dir][1] * dist
        break
      case 'L':
        switch (dist) {
          case 90:
            [wx, wy] = [wy, -wx]
            break
          case 180:
            [wx, wy] = [-wx, -wy]
            break
          case 270:
            [wx, wy] = [-wy, wx]
            break
          default:
            throw new Error(dist)
        }
        break
      case 'R':
        switch (dist) {
          case 90:
            [wx, wy] = [-wy, wx]
            break
          case 180:
            [wx, wy] = [-wx, -wy]
            break
          case 270:
            [wx, wy] = [wy, -wx]
            break
          default:
            throw new Error(dist)
        }
        break
    }
  }
  return Math.abs(x) + Math.abs(y)
}


function main(...args) {
  const inp = Utils.readLines().map(s => {
    const m = s.match(/([NSEWLRF])(\d+)/)
    if (!m) {
      throw new Error(s)
    }
    return [m[1], parseInt(m[2], 10)]
  })
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require?.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
