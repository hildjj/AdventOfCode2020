'use strict'

const Utils = require('./utils')
const mathjs = require('mathjs')

function part1(inp) {
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

  return counts[0] * counts[2]
}

function part2(inp) {
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
  return count
}

function main(...args) {
  const inp = Utils.readLines().map(x => parseInt(x, 10))
  inp.sort((a, b) => a - b)
  const max = inp[inp.length - 1]
  inp.push(max + 3)
  inp.unshift(0)

  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require?.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
