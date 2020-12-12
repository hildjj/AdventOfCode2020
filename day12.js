'use strict'

const Utils = require('./utils')
const assert = require('assert')

function part1(inp) {
  let cur = 1 // East
  let x = 0
  let y = 0

  for (let [dir, dist] of inp) {
    if (dir === 'F') {
      dir = [
        'N',
        'E',
        'S',
        'W'
      ][cur]
    }
    switch (dir) {
      case 'N':
        y -= dist
        break
      case 'S':
        y += dist
        break
      case 'E':
        x += dist
        break
      case 'W':
        x -= dist
        break
      case 'L':
        cur = (cur - (dist / 90) + 12) % 4
        break
      case 'R':
        cur = (cur + (dist / 90) + 4) % 4
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
        wy -= dist
        break
      case 'S':
        wy += dist
        break
      case 'E':
        wx += dist
        break
      case 'W':
        wx -= dist
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

/**
 * Main entry point
 *
 * @param {string} [part=1]
 * @returns {any}
 */
function main(part='1') {
  const p = parseInt(part, 10)
  const inp = Utils.readLines().map(s => {
    const m = s.match(/([NSEWLRF])(\d+)/)
    if (!m) {
      throw new Error(s)
    }
    return [m[1], parseInt(m[2], 10)]
  })
  return (p === 1) ? part1(inp) : part2(inp)
}

module.exports = main
if (require?.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
