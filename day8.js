'use strict'

const Utils = require('./utils')

function run(prog) {
  let acc = 0
  let pos = 0
  const seen = new Set()
  while (pos < prog.length) {
    if (seen.has(pos)) {
      return [acc, 'loop']
    }
    seen.add(pos)
    switch (prog[pos][0]) {
      // TODO: if this VM continues to evolve, move opcode definitions and
      // VM impl to a separate file.  Change opcodes to ints, and optimize
      // opcode lookup with an array or something.
      case 'nop':
        pos++
        break
      case 'acc':
        acc += prog[pos][1]
        pos++
        break
      case 'jmp':
        pos += prog[pos][1]
        break
      default:
        throw new Error(`unknown op: "${prog[pos[0]]}"`)
    }
  }
  return [acc, 'jmp']
}
function main() {
  const inp = Utils.parseFile()
  const [acc] = run(inp) // first run, with infloop

  // try changing every wrong op.
  let fixed = null
  for (let i=0; i<inp.length; i++) {
    const old = inp[i][0]
    switch (old) {
      case 'jmp':
        inp[i][0] = 'nop'
        break
      case 'nop':
        inp[i][0] = 'jmp'
        break
      case 'acc':
        continue
    }
    const [a, reason] = run(inp)
    if (reason !== 'loop') {
      fixed = [a, i, old]
      break
    }
    inp[i][0] = old
  }
  return [acc, fixed]
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
