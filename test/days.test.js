'use strict'

const fs = require('fs')
const path = require('path')

const JEST_DAY = 'JEST_DAY'
// use JEST_DAY=14 to run day 14 only
let files
if (process.env[JEST_DAY]) {
  console.log('DAY:', process.env[JEST_DAY])
  const day = process.env[JEST_DAY].match(/\d+/g).pop()
  files = [`day${day}.tests`]
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
    const mod = require(path.join(__dirname, '..', `day${day}.js`))
    expect(mod()).toEqual(j)
  })
}
