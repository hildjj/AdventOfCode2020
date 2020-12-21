'use strict'

const Utils = require('./utils')

function main(...args) {
  const orig = Utils.readLines(args[0]).map(s => parseInt(s, 10))
  const inp = [...orig]
  const q = inp.splice(0, 25)
  let res = null

  for (const i of inp) {
    const comb = Utils.combinations(q, 2)
    if (!Utils.itSome(comb, ([x, y]) => (x + y) === i)) {
      res = i
      break
    }
    q.shift()
    q.push(i)
  }

  const cand = []
  let tot = 0
  for (const i of orig) {
    cand.push(i)
    tot += i
    while (tot > res) {
      tot -= cand.shift()
    }
    if (tot === res) {
      break
    }
  }
  const min = Math.min.apply(null, cand)
  const max = Math.max.apply(null, cand)
  return [res, min + max]
}

module.exports = main
Utils.main(require.main, module, main)
