'use strict'

const Utils = require('./utils')

const MOD = 20201227

// if this ever needs to be faster, see:
// https://en.wikipedia.org/wiki/Modular_arithmetic
function transform(val, loopSize) {
  let cur = 1
  for (let i = 0; i < loopSize; i++) {
    cur = (val * cur) % MOD
  }
  return cur
}

function findKey(target, subject) {
  let val = 1
  let i = 1
  while (true) {
    val = (val * subject) % MOD
    if (val === target) {
      break
    }
    i++
  }
  return i
}

function part1(inp, args) {
  const one = findKey(inp[0], 7)
  return transform(inp[1], one)
}

function part2(inp, args) {
  return 0
}

function main(inFile, trace, args) {
  const inp = Utils.readLines(inFile, null, trace).map(x => parseInt(x))
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
