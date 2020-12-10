'use strict'

const Utils = require('./utils')
const mathjs = require('mathjs')

function main() {
  const inp = Utils.readLines('day10.txt').map(x => parseInt(x, 10))
  inp.sort((a, b) => a - b)
  const max = inp[inp.length - 1] + 3
  inp.push(max)
  inp.unshift(0) // winning move
  const len = inp.length
  const adjacent = mathjs.zeros(len, len)

  // create adacency matrix, A, which has a 1 in A[i,j] for each
  // directed edge i->j.
  for (const [i, val] of inp.entries()) {
    for (let j = i+1; j < len; j++) {
      if ((inp[j] - val) <= 3) {
        adjacent.set([i, j], 1)
      } else {
        break
      }
    }
  }

  // The (i,j)th entry of A^r is the number of different paths of
  // length r from v[i] to v[j].  Add up all of the paths of different lengths.
  let count = 0
  let cur = mathjs.matrix(adjacent)
  for (let i = 0; i < len; i++) {
    count += cur.get([0, len-1])
    cur = mathjs.multiply(cur, adjacent)
  }
  return [count]
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
