'use strict'

const Utils = require('./utils')

function gcd(a, b) {
  let [old_r, r] = [a, b]
  let [old_s, s] = [1n, 0n]
  let [old_t, t] = [0n, 1n]
  while (r) {
    const [quot, rm] = Utils.divmod(old_r, r);
    [old_r, r] = [r, rm];
    [old_s, s] = [s, old_s - quot * s];
    [old_t, t] = [t, old_t - quot * t];
  }
  return [old_r, old_s, old_t]
}

// from https://math.stackexchange.com/a/3864593
function lcmp(a, ap, b, bp) {
  const [g, s, t] = gcd(a, b)
  const pd = ap - bp
  const [pdm, pdr] = Utils.divmod(pd, g)
  if (pdr) {
    throw new Error(`Never ${a} ${b}`)
  }
  const cp = a / g * b
  const cph = Utils.mod(ap - s * pdm * a, cp)
  return [cp, cph]
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
  for (const [b, bp] of busses) {
    [a, ap] = lcmp(a, ap, b, bp)
  }
  return Utils.mod(-ap, a).toString()
}

function main(...args) {
  const inp = Utils.readLines()// 't.txt')
  inp[1] = inp[1].split(',')
  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
