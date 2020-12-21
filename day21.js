'use strict'

const Utils = require('./utils')

function intersect(a, b) {
  return new Set([...a].filter(x => b.has(x)))
}
function part1(inp, args) {
  const al = {}
  const w = {}
  for (const {words, allergens} of inp) {
    for (const word of words) {
      w[word] = (w[word] ?? 0) + 1
    }
    for (const allergy of allergens) {
      const as = al[allergy]
      if (!as) {
        al[allergy] = new Set(words)
      } else {
        al[allergy] = intersect(words, as)
      }
    }
  }
  const found = {}
  let changes = true
  while (changes) {
    changes = false
    const e = Object.entries(al).find(([k, s]) => s.size === 1)
    if (e) {
      changes = true
      delete al[e[0]]
      const word = [...e[1]][0]
      found[e[0]] = word
      delete w[word]
      for (const v of Object.values(al)) {
        v.delete(word)
      }
    }
  }
  const can = Object.entries(found)
    .sort(([ak, av], [bk, bv]) => ak.localeCompare(bk))
    .map(([k, v]) => v)
    .join(',')
  return [Object.values(w).reduce((t, x) => t + x, 0), can]
}

function main(inFile, trace, args) {
  const inp = Utils.parseFile(inFile, null, trace)
  return part1(inp, args)
}

module.exports = main
Utils.main(require.main, module, main)
