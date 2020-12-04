'use strict'

const Utils = require('./utils')

function main() {
  const inp = Utils.readLines('./day2.txt')
    .map(s => s.match(/(\d+)-(\d+)\s+(\S):\s+(.*)/))

  const part1 = inp.filter(([_, min, max, char, pw]) => {
    const count = [...pw].filter(c => c === char).length
    return (count >= min) && (count <= max)
  })

  const part2 = inp.filter(([_, min, max, char, pw]) => {
    return (pw[min - 1] === char) ^ (pw[max - 1] === char)
  })

  return [part1.length, part2.length]
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
