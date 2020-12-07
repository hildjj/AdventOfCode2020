'use strict'

const Utils = require('./utils')
function main() {
  const inp = Utils.parseFile()

  const contained = {}
  const contains = {}
  for (const [outer, inner] of inp) {
    for (const i of inner) {
      const c = contained[i[1]]
      if (!c) {
        contained[i[1]] = [outer]
      } else {
        c.push(outer)
      }
    }
    contains[outer] = inner
  }
  let c = contained['shiny gold']
  let count = 0
  const seen = new Set()
  while (c.length) {
    const n = c.shift()
    if (!seen.has(n)) {
      count++
      seen.add(n)
      if (contained[n]) {
        c = c.concat(contained[n])
      }
    }
  }
  function addContained(color) {
    let count = 1
    for (const ac of contains[color]??[]) {
      count += ac[0] * addContained(ac[1])
    }
    return count
  }
  const ccount = addContained('shiny gold')
  return [count, ccount - 1]
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
