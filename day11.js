'use strict'

const Utils = require('./utils')

function deepCopy(a) {
  return a.map(b => [...b])
}

const DIRS = [
  [ 0,  1], // right
  [ 0, -1], // left
  [-1,  0], // up
  [ 1,  0], // down
  [-1,  1], // top right
  [-1, -1], // top left
  [ 1,  1], // bottom left
  [ 1, -1]  // bottom right
]

function newState2(a, i, j) {
  if (a[i][j] === '.') {
    return ['.', false]
  }
  let empty = (a[i][j] === 'L')
  let crowded = 0

  for (const [x, y] of DIRS) {
    let iy = i + y
    let jx = j + x
    while ((iy >= 0) && (iy < a.length) &&
           (jx >= 0) && (jx < a[iy].length)) {
      if (a[iy][jx] === '#') {
        empty = false
        crowded++
        break
      }
      if (a[iy][jx] === 'L') {
        break
      }
      iy += y
      jx += x
    }
  }
  if (empty) {
    return ['#', true]
  }
  if ((a[i][j] === '#') && (crowded >= 5)) {
    return ['L', true]
  }
  return [a[i][j], false]
}

function newState(a, i, j) {
  if (a[i][j] === '.') {
    return ['.', false]
  }
  let empty = (a[i][j] === 'L')
  let crowded = 0

  for (const [x, y] of DIRS) {
    const iy = i + y
    const jx = j + x
    if ((iy >= 0) && (iy < a.length) &&
        (jx >= 0) && (jx < a[iy].length) &&
        (a[iy][jx] === '#')) {
      empty = false
      crowded++
    }
  }

  if (empty) {
    return ['#', true]
  }
  if ((a[i][j] === '#') && (crowded >= 4)) {
    return ['L', true]
  }
  return [a[i][j], false]
}

function part1(inp) {
  let last = inp
  let working = true
  let count = 0
  while (working) {
    const n = deepCopy(last)
    working = false
    count = 0
    for (let i=0; i<last.length; i++) {
      for (let j=0; j<last[i].length; j++) {
        const [res, changed] = newState(last, i, j)
        if (changed) {
          working = true
          n[i][j] = res
        }
        if (res === '#') {
          count++
        }
      }
    }
    last = deepCopy(n)
  }
  return count
}

function part2(inp) {
  let last = inp
  let working = true
  let count = 0
  while (working) {
    const n = deepCopy(last)
    working = false
    count = 0
    for (let i=0; i<last.length; i++) {
      for (let j=0; j<last[i].length; j++) {
        const [res, changed] = newState2(last, i, j)
        if (changed) {
          working = true
          n[i][j] = res
        }
        if (res === '#') {
          count++
        }
      }
    }
    last = n
  }
  return count
}

function main(...args) {
  const inp = Utils.readLines().map(l => l.split(''))
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require?.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
