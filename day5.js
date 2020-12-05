'use strict'

const Utils = require('./utils')

// LLLL RRRR
// LLRR
// LR

const COLS = {}
for (let i=0; i<8; i++) {
  const LR = i
    .toString(2)
    .padStart(3, 0)
    .replace(/[01]/g, (b) => (b === '0') ? 'L' : 'R')
  COLS[LR] = i
}
const ROWS = {}
for (let i=0; i<128; i++) {
  const FB = i
    .toString(2)
    .padStart(7, 0)
    .replace(/[01]/g, (b) => (b === '0') ? 'F' : 'B')
  ROWS[FB] = i
}

function main() {
  const inp = Utils.parseFile()
  let max = -Infinity
  const all = [...Array(128)].map(() => [...Array(8)].map(() => -1))
  for (const [fb, lr] of inp) {
    const id = (ROWS[fb] * 8) + COLS[lr]
    all[ROWS[fb]][COLS[lr]] = id
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
