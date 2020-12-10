'use strict'

const Utils = require('./utils')
function main() {
  const inp = Utils.readLines().map(x => parseInt(x, 10))
  inp.sort((a, b) => a - b)
  const max = inp[inp.length - 1]
  const counts = [0, 0, 0]
  let last = 0
  for (const i of inp) {
    const diff = i - last
    if (diff > 3) {
      throw new Error(`${i}, ${diff}`)
    }
    counts[diff - 1]++
    last = i
  }

  return [max, counts, counts[0] * (counts[2] + 1) ]
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
