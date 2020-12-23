'use strict'

const Utils = require('./utils')

function cupStr(cur, cups) {
  let s = ''
  for (let k=cups[cur]; k !== cur; k=cups[k]) {
    s += k
  }
  return s
}

// cups is array, index is a node name, value is the next node
const removed = new Array(3)
function turn(cur, cups) {
  let r = cur
  for (let i=0; i<3; i++) {
    r = cups[r]
    removed[i] = r
  }
  cups[cur] = cups[r]
  let dest = cur
  do {
    if (--dest <= 0) {
      dest = cups.length - 1
    }
  } while (removed.indexOf(dest) >= 0)

  ;[cups[removed[2]], cups[dest]] = [cups[dest], removed[0]]
  return cups[cur]
}

function part1(inp, args) {
  const smax = Math.max(...inp)
  const cups = new Array(smax+1) // starts at 1, 0 is undefined
  const head = inp[0]
  let last = head
  for (let i=1; i<inp.length; i++) {
    last = cups[last] = inp[i]
  }
  let cur = cups[last] = head
  for (const _ of Utils.range(100)) {
    cur = turn(cur, cups)
  }
  return cupStr(1, cups)
}

function part2(inp) {
  // console.log(inp.toString())
  const max = 1000000
  const smax = Math.max(...inp)
  const cups = new Array(max+1) // starts at 1, 0 is undefined
  const head = inp[0]
  let last = head
  for (let i=1; i<inp.length; i++) {
    last = cups[last] = inp[i]
  }
  for (let i=smax+1; i<=max; i++) {
    last = cups[last] = i
  }
  cups[last] = head

  let cur = head
  // range really doesn't like a large max.  look into that.
  for (let c=0; c<10000000; c++) {
    cur = turn(cur, cups)
  }
  const two = cups[1]
  const three = cups[two]
  return two * three
}

function main(inFile, trace, args) {
  const inp = Utils.readLines(inFile)[0].split('').map(x => parseInt(x))
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
