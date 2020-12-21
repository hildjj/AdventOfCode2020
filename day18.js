'use strict'

const Utils = require('./utils')

function evalMath(e) {
  const left = (typeof e.left === 'number') ? e.left : evalMath(e.left)
  const right = (typeof e.right === 'number') ? e.right : evalMath(e.right)
  switch (e.op) {
    case '+': return left + right
    case '*': return left * right
  }
}

function part1(args) {
  const inp = Utils.parseFile(args[0])
  return inp.reduce((t, e) => t + evalMath(e), 0)
}

function part2(args) {
  const inp = Utils.parseFile(args[0], './day18p2.pegjs')
  return inp.reduce((t, e) => t + evalMath(e), 0)
}

function main(...args) {
  return [part1(args), part2(args)]
}

module.exports = main
Utils.main(require.main, module, main)
