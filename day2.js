'use strict'

const Utils = require('./utils')

function main(...args) {
  const inp = Utils.readLines(args[0])
    .map(s => s.match(/(\d+)-(\d+)\s+(\S):\s+(.*)/))

  const part1 = inp.filter(([_, min, max, char, pw]) => {
    const count = [...pw].filter(c => c === char).length
    return (count >= parseInt(min, 10)) && (count <= parseInt(max, 10))
  })

  const part2 = inp.filter(([_, min, max, char, pw]) => {
    const a = pw[parseInt(min, 10) - 1] === char
    const b = pw[parseInt(max, 10) - 1] === char
    return a != b // ^
  })

  return [part1.length, part2.length]
}

module.exports = main
Utils.main(require.main, module, main)
