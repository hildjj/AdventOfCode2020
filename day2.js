'use strict'

const Utils = require('./utils')

const inp = Utils.readLines('./day2.txt')
  .map(s => s.match(/(\d+)-(\d+)\s+(\S):\s+(.*)/))

const matches = inp.filter(([_, min, max, char, pw]) => {
  // const count = [...pw].filter(c => c === char).length
  // return (count >= min) && (count <= max)
  return (pw[min - 1] === char) ^ (pw[max - 1] === char)
})

console.log(matches.length)
