'use strict'

const Utils = require('./utils')

function part1(inp, args) {
  return 0
}

function part2(inp, args) {
  return 0
}

function main(...args) {
  const inp = Utils.parseFile()
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
