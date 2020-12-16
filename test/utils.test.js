'use strict'
const Utils = require('../utils')
const path = require('path')

const INVALID_FILE = `_____DOES___NOT___EXIST:${process.pid}`
test('readLines', () => {
  const t = Utils.readLines()
  expect(t).toEqual(['1', '2'])
})

test('parseFile', () => {
  const t = Utils.parseFile()
  expect(t).toEqual(['1', '2'])
  const {parse} = require('./utils.test.peg')
  const u = Utils.parseFile(path.join(__dirname, 'utils.test.txt'), parse)
  expect(u).toEqual(['1', '2'])

  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const v = Utils.parseFile(null, INVALID_FILE)
  expect(v).toEqual(['1', '2'])
  expect(spy).toHaveBeenCalled()
  expect(spy.mock.calls).toEqual([[`No parser: "${INVALID_FILE}", falling back on readLines`]])
  spy.mockRestore()
})

test('mod', () => {
  expect(Utils.mod(4, 4)).toBe(0)
  expect(Utils.mod(-5, 4)).toBe(3)
  expect(Utils.mod(4n, 4n)).toBe(0n)
  expect(Utils.mod(-5n, 4n)).toBe(3n)
  expect(Utils.mod(-5n, -4n)).toBe(-1n)
  expect(() => Utils.mod(-5, 4n)).toThrow(/Cannot mix BigInt/)
  expect(() => Utils.mod(-5n, 4)).toThrow(/Cannot mix BigInt/)
  expect(() => Utils.mod(4, 0)).toThrow(/Division by zero/)
  expect(() => Utils.mod(4n, 0n)).toThrow(/Division by zero/)
  expect(() => Utils.mod(4n, '0')).toThrow(/Division by zero/)
})

test('divmod', () => {
  expect(Utils.divmod(4, 4)).toEqual([1, 0])
  expect(Utils.divmod(-5, 4)).toEqual([-2, 3])
  expect(Utils.divmod(4n, 4n)).toEqual([1n, 0n])
  expect(Utils.divmod(-5n, 4n)).toEqual([-2n, 3n])
  expect(Utils.divmod(-5n, -4n)).toEqual([1n, -1n])
  expect(() => Utils.divmod(-5, 4n)).toThrow(/Cannot mix BigInt/)
  expect(() => Utils.divmod(-5n, 4)).toThrow(/Cannot mix BigInt/)
  expect(() => Utils.divmod(4, 0)).toThrow(/Division by zero/)
  expect(() => Utils.divmod(4n, 0n)).toThrow(/Division by zero/)
})

test('itSome', () => {
  expect(Utils.itSome(Utils.range(3), i => i % 2)).toBe(true)
  expect(Utils.itSome([1, 3, 5], i => i % 2 === 0)).toBe(false)
  const t = {}
  expect(Utils.itSome([1, 3, 5], function (_, i) {
    return i < 3 && this == t
  }, t)).toBe(true)
})

test('range', () => {
  let seen = []
  for (const x of Utils.range(4)) {
    seen.push(x)
  }
  expect(seen).toEqual([0, 1, 2, 3])
  expect([...Utils.range(4, 0, -1)]).toEqual([4, 3, 2, 1])
})

test('pick', () => {
  expect([...Utils.pick(Utils.range(4), [1, 3])]).toEqual([1, 3])
  expect([...Utils.pick({a: 1, b: 2}, ['b'])]).toEqual([2])
})

test('combinations', () => {
  expect([...Utils.combinations(Utils.range(3), 5)]).toEqual([])
  expect([...Utils.combinations([0, 1, 2], 2)]).toEqual([[0, 1], [0, 2], [1, 2]])
})

test('trunc', () => {
  expect([...Utils.trunc(Utils.range(3), 0)]).toEqual([0, 1, 2])
  expect([...Utils.trunc(Utils.range(10), 3)]).toEqual([0, 1, 2, 3, 4, 5, 6])
  expect([...Utils.trunc(Utils.range(10), -3)]).toEqual([0, 1, 2])
})

test('take', () => {
  expect([...Utils.take(Utils.range(3), 0)]).toEqual([])
  expect([...Utils.take(Utils.range(3), 3)]).toEqual([0, 1, 2])
  expect([...Utils.take(Utils.range(3), 4)]).toEqual([0, 1, 2])
  expect([...Utils.take(Utils.range(10), 3)]).toEqual([0, 1, 2])
  expect([...Utils.take(Utils.range(10), -3)]).toEqual([0, 1, 2, 3, 4, 5, 6])
})

test('permutations', () => {
  expect([...Utils.permutations('ABCD', 2)].map(a => a.join('')))
    .toEqual(['AB', 'AC', 'AD', 'BA', 'BC', 'BD', 'CA', 'CB', 'CD', 'DA', 'DB', 'DC'])
  expect([...Utils.permutations([], 1)]).toEqual([])
  expect([...Utils.permutations([1, 2, 3], 0)]).toEqual([])
  expect([...Utils.permutations([1, 2, 3], 5)]).toEqual([])
  expect([...Utils.permutations([1, 2, 3], -5)]).toEqual([])
})

test('powerset', () => {
  expect([...Utils.powerset('ABC')].map(a => a.join('')))
    .toEqual(['', 'A', 'B', 'C', 'AB', 'AC', 'BC', 'ABC'])
})
