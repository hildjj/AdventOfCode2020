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
  const inp = Utils.parseFile()
  return inp.reduce((t, e) => t + evalMath(e), 0)
}

function part2(args) {
  const inp = Utils.parseFile(null, './day18p2.peg')
  return inp.reduce((t, e) => t + evalMath(e), 0)
}

function main(...args) {
  return [part1(args), part2(args)]
}

module.exports = main
if (require.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
