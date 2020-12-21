'use strict'
const Utils = require('./utils')

function part1(inp) {
  for (const [x, y] of Utils.combinations(inp, 2)) {
    if (x + y === 2020) {
      return x * y
    }
  }

}

function part2(inp) {
  for (const [x, y, z] of Utils.combinations(inp, 3)) {
    if (x + y + z === 2020) {
      return x * y * z
    }
  }
}

function main(...args) {
  const inp = Utils.readLines(args[0])
    .map(x => parseInt(x, 10))
    .sort()

  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
