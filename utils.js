'use strict'
const fs = require('fs')
const path = require('path')

function getStack(_, stack) {
  return stack
}

class Utils {
  static readLines(filename) {
    if (!filename) {
      // this would be idiomatic in tcl.
      // s/.js$/.txt/ from the calling file.
      filename = path.parse(this.callsites()[1].getFileName()).name + '.txt'
    }
    return fs.readFileSync(filename, 'utf8')
      .split('\n')
      .filter(s => s.length)
  }
  static callsites() {
    const old = Error.prepareStackTrace
	  Error.prepareStackTrace = getStack
	  const stack = new Error().stack.slice(1) // i am never interesting
	  Error.prepareStackTrace = old
	  return stack
  }
}

module.exports = Utils

