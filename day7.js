'use strict'

const Utils = require('./utils')

const TARGET = 'shiny gold'

function main(...args) {
  const inp = Utils.parseFile(args[0])

  const contained = {}
  const contains = {}
  for (const [outer, inner] of inp) {
    contains[outer] = inner
    for (const i of inner) {
      const c = contained[i[1]]
      if (!c) {
        contained[i[1]] = [outer]
      } else {
        c.push(outer)
      }
    }
  }

  let c = [TARGET]
  let count = 0
  const seen = new Set()
  do {
    const n = c.shift()
    // if we've seen this color already (this color can be in more than
    // one larger bag), don't count it again.
    if (!seen.has(n)) {
      count++
      seen.add(n)
      if (contained[n]) {
        c = c.concat(contained[n])
      }
    }
  } while (c.length)

  function addContained(color) {
    let count = 1
    for (const ac of contains[color]??[]) {
      count += ac[0] * addContained(ac[1])
    }
    return count
  }
  const ccount = addContained(TARGET)
  return [count - 1, ccount - 1] // remove the TARGET bag in both cases
}

module.exports = main
Utils.main(require.main, module, main)
