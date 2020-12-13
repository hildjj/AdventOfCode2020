'use strict'
const Utils = require('../utils')

test('readLines', () => {
  const t = Utils.readLines()
  expect(t).toEqual(['1', '2'])
})

test('parseFile', () => {
  const t = Utils.parseFile()
  expect(t).toEqual(['1', '2'])
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
  expect([...Utils.combinations(Utils.range(3), 2)]).toEqual([[0, 1], [0, 2], [1, 2]])
})
