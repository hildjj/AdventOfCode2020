'use strict'
const fs = require('fs')

class Utils {
  static readLines(filename) {
    return fs.readFileSync(filename, 'utf8')
      .split('\n')
      .filter(s => s.length)
  }
}

module.exports = Utils
