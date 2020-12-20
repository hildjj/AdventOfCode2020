'use strict'

const fs = require('fs')
const path = require('path')

// use JEST_DAY=14 to run day 14 only
const JEST_DAY = 'JEST_DAY'
let files
if (process.env[JEST_DAY]) {
  if (process.env[JEST_DAY] === '-1') {
    files = []
    test('Skipping Days', () => {})
  } else {
    const day = process.env[JEST_DAY].match(/\d+/g).pop()
    files = [`day${day}.tests`]
  }
} else {
  files = fs.readdirSync(__dirname).filter(f => f.match(/day\d+.tests/))
  files.sort((a, b) => a.match(/\d+/)[0] - b.match(/\d+/)[0])
}

for (const f of files) {
  test(f, () => {
    const data = fs.readFileSync(path.join(__dirname, f), 'utf-8')
    const j = JSON.parse(data)
    expect(j).toBeTruthy()
    const day = f.match(/\d+/)[0]
    const modname = path.join(__dirname, '..', `day${day}.js`)
    const mod = require(modname)
    if (typeof mod !== 'function') {
      throw new Error(`Invalid module: "${modname}"`)
    }
    expect(mod()).toEqual(j)
  })
}
