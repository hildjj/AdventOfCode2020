'use strict'

const Utils = require('./utils')

function main() {
  const inp = Utils.parseFile()
  let tot = 0
  let atot = 0
  for (const group of inp) {
    let any = new Set()
    let all = new Set(group[0])
    for (const person of group) {
      const p = new Set(person)
      any = new Set([...any, ...p])
      all = new Set([...all].filter(x => p.has(x)))
    }
    tot += any.size
    atot += all.size
  }
  return [tot, atot]
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
