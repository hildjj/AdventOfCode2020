'use strict'

const Utils = require('./utils')

function part1(inp) {

}

function part2(inp) {

}

function main(part=1) {
  const inp = Utils.parseFile()
  return (part === 1) ? part1(inp) : part2(inp)
}

module.exports = main
if (require?.main === module) {
  const res = main(...process.argv.slice(2).map(x => {
    try {
      return parseInt(x, 10)
    } catch {
      return x
    }
  }))
  console.log(res)
}
