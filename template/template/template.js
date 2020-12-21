'use strict'

const Utils = require('./utils')

function part1(inp, args) {
  return 0
}

function part2(inp, args) {
  return 0
}

function main(inFile, trace, args) {
  const inp = Utils.parseFile(inFile, null, trace)
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
