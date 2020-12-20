'use strict'

const Utils = require('./utils')

function part1(inp, args) {
  const reg = {}
  let mask = null
  for (const [inst, x, y0] of inp) {
    let y = y0
    switch (inst) {
      case 'mask':
        mask = x
        break
      case 'mem':
        for (const [i, b] of mask.entries()) {
          switch (b) {
            case 'X':
              break
            case '1':
              y = y | (1n << BigInt(i))
              break
            case '0':
              y = y & ~(1n << BigInt(i))
              break
          }
        }
        reg[x] = y
    }
  }
  return Object.values(reg).reduce((t, x) => t + x, 0n).toString()
}

function part2(inp, args) {
  const reg = {}
  let mask = null
  for (const [inst, x, y] of inp) {
    switch (inst) {
      case 'mask':
        mask = x
        break
      case 'mem':
        let tot = 0n
        const flips = []
        mask.forEach((f, i) => {
          switch (f) {
            case '0':
              tot += x & (1n << BigInt(i))
              break
            case '1':
              tot += 1n << BigInt(i)
              break
            case 'X':
              flips.push(BigInt(i))
              break
          }
        })
        for (const some of Utils.powerset(flips)) {
          let a = tot
          for (const s of some) {
            a += 1n << s
          }
          reg[a] = y
        }
        break
    }
  }
  return Object.values(reg).reduce((t, x) => t + x, 0n).toString()
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
