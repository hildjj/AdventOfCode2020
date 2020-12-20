'use strict'

const Utils = require('./utils')

// a set of all of the valid numbers in any rule
function ruleSet(rules) {
  const set = new Set()

  for (const [[a1, a2], [b1, b2]] of rules) {
    for (let i = a1; i<= a2; i++) {
      set.add(i)
    }
    for (let i = b1; i<= b2; i++) {
      set.add(i)
    }
  }
  return set
}

function part1(inp, args) {
  const set = ruleSet(Object.values(inp.rules))

  let tot = 0
  for (const tix of inp.nearby) {
    for (const n of tix) {
      if (!set.has(n)) {
        tot += n
      }
    }
  }
  return tot
}

function part2(inp, args) {
  const set = ruleSet(Object.values(inp.rules))

  // remove any invalid nearby tix
  const near = inp.nearby.filter(tix => {
    for (const n of tix) {
      if (!set.has(n)) {
        return false
      }
    }
    return true
  })

  let len = inp.your.length
  const allRules = new Set(Object.keys(inp.rules))
  const colRules = new Array(len)

  // remove any rule from the ruleset that doesn't allow n
  function check(n, rules) {
    for (const ruleName of rules) { // make copy so we can modify it in the loop
      const [[a1, a2], [b1, b2]] = inp.rules[ruleName]
      if ( (n < a1 || n > a2) && (n < b1 || n > b2)) {
        rules.delete(ruleName)
      }
    }
  }
  for (const [i, n] of inp.your.entries()) {
    colRules[i] = new Set(allRules)
  }
  for (const tix of near) {
    for (const [i, n] of tix.entries()) {
      check(n, colRules[i])
    }
  }

  // there's at least one column that only has one choice.  Lock that rule
  // in on that column, and take it out of contention in the other columns,
  // until we've found all of the other columns.
  const found = {}
  while (len > 0) {
    let i = 0
    for (const c of colRules) {
      if (c.size === 1) {
        const val = [...c.values()][0]
        found[val] = i
        for (const d of colRules) {
          d.delete(val)
        }
        len--
        break
      }
      i++
    }
  }

  const tot = Object.entries(found).reduce((t, [k, v]) => {
    return k.startsWith('departure') ? t * inp.your[v] : t
  }, 1)

  return tot
}

function main(...args) {
  const inp = Utils.parseFile()
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
