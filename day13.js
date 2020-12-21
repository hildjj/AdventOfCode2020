'use strict'

const Utils = require('./utils')

// https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
// For `BigInt` only
function gcd(a, b) {
  // greatest common divisor of two numbers does not change if the larger
  // number is replaced by its difference with the smaller number
  // you keep subtracting until the difference is less than the small number,
  // which is the same as mod.

  // In the extended version, we also keep track of x and y, such that
  // ax + by = gcd(a, b)
  let [old_r, r] = [a, b]
  let [old_x, x] = [1n, 0n]
  let [old_y, y] = [0n, 1n]
  while (r !== 0n) {
    const [quot, rm] = Utils.divmod(old_r, r)
    ;[old_r, r] = [r, rm]
    ;[old_x, x] = [x, old_x - (quot * x)]
    ;[old_y, y] = [y, old_y - (quot * y)]
  }
  return [old_r, old_x, old_y]
}

// from https://math.stackexchange.com/a/3864593
function lcmp(a, ap, b, bp) {
  // the combined period of (A, B) is lcm(a, b)
  const [g, s] = gcd(a, b)
  const [pdm, pdr] = Utils.divmod(ap - bp, g)
  if (pdr) {
    throw new Error(`${a} and ${b} never sync`)
  }
  const combined_period = a * b / g  // lcm
  const combined_phase = Utils.mod(ap - (s * pdm * a), combined_period)
  return [combined_period, combined_phase]
}

function part1(inp, args) {
  const stamp = parseInt(inp[0], 10)
  const busses = inp[1].filter(x => x !== 'x').map(x => parseInt(x, 10))

  const i = busses.map(bus => [bus, (Math.ceil(stamp / bus) * bus) - stamp])
  i.sort((a, b) => a[1] - b[1])
  return i[0][0] * i[0][1]
}

function part2(inp, args) {
  const busses = inp[1]
    .map((x, i) => [x === 'x' ? x : BigInt(x, 10), BigInt(i)])
    .filter(([x, i]) => x !== 'x')
  
  let [a, ap] = busses.shift()
  ap = Utils.mod(-ap, a)

  // GCD of a list is gcd(gcd(1, 2), 3...)
  ;[a, ap] = busses.reduce(([l, lp], [b, bp]) => lcmp(l, lp, b, bp), [a, ap])

  return Utils.mod(-ap, a).toString()
}

function main(...args) {
  const inp = Utils.readLines(args[0])// 't.txt')
  inp[1] = inp[1].split(',')
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
Utils.main(require.main, module, main)
