'use strict'

const Utils = require('./utils')

function main() {
  const inp = Utils.parseFile()
  let max = -Infinity
  const all = [...Array(128)].map(() => [...Array(8)].map(() => -1))
  for (const [row, col] of inp) {
    const id = (row * 8) + col
    all[row][col] = id
    max = Math.max(max, id)
  }
  let id = null
  outer:
  for (const [r, row] of all.entries()) {
    for (const [c, col] of row.entries()) {
      if ((col === -1) &&                  // no ticket found
        all[r+1] && (all[r+1][c] >= 0) &&  // row after is filled
        all[r-1] && (all[r-1][c] >= 0)) {  // row before is filled
        id = (r * 8) + c
        break outer
      }
    }
  }
  return [max, id]
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
