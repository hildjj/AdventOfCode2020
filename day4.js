'use strict'

const Utils = require('./utils')

const lenRegexes = {}
function digits(str, len) {
  let r = lenRegexes[len]
  if (!r) {
    r = new RegExp(`^\\d{${len}}$`)
    lenRegexes[len] = r
  }
  return !!str.match(r)
}

function between(str, min, max) {
  const v = parseInt(str, 10)
  return (min <= v) && (v <= max)
}

const rules = {
  byr(f) {
    return digits(f, 4) && between(f, 1920, 2002)
  },
  iyr(f) {
    return digits(f, 4) && between(f, 2010, 2020)
  },
  eyr(f) {
    return digits(f, 4) && between(f, 2020, 2030)
  },
  hgt(f) {
    const m = f.match(/^(\d+)(cm|in)$/)
    if (!m) {
      return false
    }
    switch (m[2]) {
      case 'in':
        return between(m[1], 59, 76)
      case 'cm':
        return between(m[1], 150, 193)
    }
  },
  hcl(f) {
    return !!f.match(/^#[0-9a-f]{6}$/)
  },
  ecl(f) {
    switch (f) {
      case 'amb':
      case 'blu':
      case 'brn':
      case 'gry':
      case 'grn':
      case 'hzl':
      case 'oth':
        return true
    }
    return false
  },
  pid(f) {
    return digits(f, 9)
  }
}
const required = Object.keys(rules)

function main(...args) {
  const res = Utils.parseFile(args[0])
  let loose = 0
  let tight = 0
  for (const rec of res) {
    if (required.every(field => !!rec[field])) {
      loose++
      if (required.every(field => rules[field](rec[field]))) {
        tight++
      }
    }
  }

  return [res.length, loose, tight]
}

module.exports = main
Utils.main(require.main, module, main)
