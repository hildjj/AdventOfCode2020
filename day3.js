'use strict'

const Utils = require('./utils')

const trees = Utils.readLines('day3.txt')
const EOF = Symbol('EOF')
const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
]

function isTree(x, y) {
  if (y >= trees.length) {
    return EOF
  }
  return trees[y][x % trees[y].length]
}

function countSlope(right, down) {
  let count = 0
  let t = ''
  for (let x = 0, y = 0; t !== EOF; x += right, y += down) {
    t = isTree(x, y)
    if (t === '#') {
      count++
    }
  }
  return count
}

console.log(countSlope(3, 1))
console.log(slopes.reduce((t, [right, down]) => t * countSlope(right, down), 1))
