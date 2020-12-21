'use strict'

const Utils = require('./utils')
const pegjs = require('pegjs')

function numsToList(nums, reverse) {
  if (reverse) {
    nums.reverse()
  }
  return nums.map(n => (typeof n === 'number') ? `r${n}` : `"${n}"`).join(' ')
}

function generateGrammar(rules, reverse = false) {
  let grammar = ''
  for (const [name, rule] of rules) {
    grammar += `r${name}`
    switch (rule[0]) {
      case 'char':  // ['char', 'a']
        grammar += ` = "${rule[1]}"`
        break
      case 'and' : // ['and', 1, 2]
        grammar +=  ' = ' + numsToList(rule.slice(1), reverse)
        break
      case 'or': // ['or', ['and', 1, 2], ['and', 2, 3]]
        for (let i=1; i<rule.length; i++) {
          if (i === 1) {
            grammar += '\n  = '
          } else {
            grammar += '\n  / '
          }
          grammar += numsToList(rule[i].slice(1), reverse)
        }
        break
    }
    grammar += '\n\n'
  }
  return grammar
}

function part1(inp, args) {
  const rules = inp[0].sort((a, b) => a[0] - b[0])
  const grammar = generateGrammar(rules)
  const {parse} = pegjs.generate(grammar)
  let count = 0
  for (const i of inp[1]) {
    try {
      parse(i)
      count++
    } catch {

    }
  }
  return count
}

function part2(inp, args) {
  // Stimpy: Wait I have an idea! I can set this space time doohickey to our
  // molecular wavelengths, switch it into reverse, and turn it up to full
  // blast... and we'll simply implode!

  // search backwards to avoid greedy r8 eating the start of r11
  // reverse all rules and the text
  const rules = inp[0]
    .sort((a, b) => a[0] - b[0])
    .filter(r => (r[0] != 8) && (r[0] != 11)) // remove rule 8 and 11
  rules.push([11, ['or', ['and', 42, 31], ['and', 42, 11, 31]]])
  const grammar = generateGrammar(rules, true) + 'r8 = r42+\n'
  const {parse} = pegjs.generate(grammar, {trace: false})
  let count = 0
  for (const i of inp[1]) {
    try {
      parse(i.split('').reverse().join(''))
      count++
    } catch (e) {
    }
  }
  return count
}

function main(...args) {
  const inp = Utils.parseFile(args[0])
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
