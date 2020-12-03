'use strict'
const req = require('esm')(module)
const {Combination} = req('js-combinatorics')
const Utils = require('./utils')

const inp = Utils.readLines('day1.txt')
  .map(x => parseInt(x, 10))
  .sort()

for (const [x, y] of Combination.of(inp, 2)) {
  if (x + y === 2020) {
    console.log(x * y)
    break
  }
}

for (const [x, y, z] of Combination.of(inp, 3)) {
  if (x + y + z === 2020) {
    console.log(x * y * z)
    break
  }
}
