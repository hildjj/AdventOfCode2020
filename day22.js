'use strict'

const Utils = require('./utils')

function part1(inp, args) {
  const [p1, p2] = inp.map(x => [...x])
  while (p1.length && p2.length) {
    const p1c = p1.shift()
    const p2c = p2.shift()
    if (p1c > p2c) {
      p1.push(p1c)
      p1.push(p2c)
    } else {
      if (p1c === p2c) {
        throw new Error(`bad deck ${p1c} ${p2c}`)
      }
      p2.push(p2c)
      p2.push(p1c)
    }
  }
  const winner = p1.length ? p1 : p2
  return winner.reduce((t, x, i) => t + (x * (winner.length - i)), 0)
}

function play(p1, p2) {
  let winner = null
  const prev1 = new Set()
  const prev2 = new Set()
  while (p1.length && p2.length) {
    const str1 = p1.toString()
    if (prev1.has(str1)) {
      return 0
    }
    const str2 = p2.toString()
    if (prev2.has(str2)) {
      return 0
    }
    prev1.add(str1)
    prev2.add(str2)
    const c1 = p1.shift()
    const c2 = p2.shift()
    if ((p1.length >= c1) && (p2.length >= c2)) {
      winner = play(p1.slice(0, c1), p2.slice(0, c2))
    } else {
      winner = c1 > c2 ? 0 : 1
    }
    const w = winner ? p2 : p1
    w.push(winner ? c2 : c1)
    w.push(winner ? c1 : c2)
  }
  return winner
}

function part2(p, args) {
  const winner = play(p[0], p[1])
  const w = !winner ? p[0] : p[1]
  return w.reduce((t, x, i) => t + (x * (w.length - i)), 0)
}

function main(inFile, trace, args) {
  const inp = Utils.parseFile(inFile, null, trace)
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
