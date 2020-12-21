'use strict'

const Utils = require('./utils')

function speakNumbers(inp, target) {
  const spoken = Array(target)  // pre-allocate, do NOT use an object
  let last = null
  for (const [i, x] of inp.entries()) {
    if (last != null) {
      spoken[last] = i + 1
    }
    last = x
  }

  for (let i=inp.length+1; i <= target; i++) {
    const sl = spoken[last]
    spoken[last] = i
    last = (sl == null) ? 0 : i - sl
  }
  return last
}

function part1(inp, args) {
  return speakNumbers(inp, 2020)
}

function part2(inp, args) {
  return speakNumbers(inp, 30000000)
}

function main(...args) {
  const inp = Utils.readLines(args[0])[0].split(',').map(x => parseInt(x))
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
