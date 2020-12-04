'use strict'

const fs = require('fs')
const {parse} = require('./day4.peg')

const rules = {
  byr(f) {
    if (!f.match(/^\d{4}$/)) {
      return false
    }
    const v = parseInt(f, 10)
    return (1920 <= v) && (v <= 2002)
  },
  iyr(f) {
    if (!f.match(/^\d{4}$/)) {
      return false
    }
    const v = parseInt(f, 10)
    return (2010 <= v) && (v <= 2020)
  },
  eyr(f) {
    if (!f.match(/^\d{4}$/)) {
      return false
    }
    const v = parseInt(f, 10)
    return (2020 <= v) && (v <= 2030)
  },
  hgt(f) {
    const m = f.match(/^(\d+)(cm|in)$/)
    if (!m) {
      return false
    }
    const v = parseInt(m[1], 10)
    switch (m[2]) {
      case 'in':
        return (59 <= v) && (v <= 76)
      case 'cm':
        return (150 <= v) && (v <= 193)
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
    return !!f.match(/^\d{9}$/)
  }
}
const required = Object.keys(rules)

function main() {
  const inp = fs.readFileSync('day4.txt', 'utf-8')
  const res = parse(inp)
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
if (require?.main === module) {
  console.log(main())
}
