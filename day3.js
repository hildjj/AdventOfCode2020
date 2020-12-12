'use strict'

const Utils = require('./utils')
const EOF = Symbol('EOF')
const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
]

/**
 * Is there a tree at [x,y]?  EOF if we're at the bottom.
 *
 * @param {number} x
 * @param {number} y
 * @returns {string|EOF}
 */
function isTree(trees, x, y) {
  if (y >= trees.length) {
    return EOF
  }
  return trees[y][x % trees[y].length]
}

function countSlope(trees, right, down) {
  let count = 0
  /** @type {string | EOF} */
  let t = ''
  for (let x = 0, y = 0; t !== EOF; x += right, y += down) {
    t = isTree(trees, x, y)
    if (t === '#') {
      count++
    }
  }
  return count
}

function part1(trees, args) {
  return countSlope(trees, 3, 1)
}

function part2(trees, args) {
  return slopes.reduce((t, [right, down]) => t * countSlope(trees, right, down), 1)
}

function main(...args) {
  const inp = Utils.readLines()
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
