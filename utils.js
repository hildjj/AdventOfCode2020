'use strict'
const fs = require('fs')
const path = require('path')

function getStack(_, stack) {
  return stack
}

class Utils {
  static readLines(filename) {
    if (!filename) {
      // s/.js$/.txt/ from the calling file.
      filename = this.adjacentFile('.txt')
    }
    return fs.readFileSync(filename, 'utf8')
      .split('\n')
      .filter(s => s.length)
  }

  static parseFile(filename, parser) {
    if (!filename) {
      filename = this.adjacentFile('.txt')
    }
    if (!parser) {
      parser = this.adjacentFile('.peg.js')
    }
    if (typeof parser !== 'function') {
      parser = require(parser).parse
    }
    const txt = fs.readFileSync(filename, 'utf8')
    return parser(txt)
  }

  static adjacentFile(ext) {
    // callsites()[2] would be idiomatic in tcl.
    // unfortunately, vm2 interposes a callsite, so.... let's cheat.
    for (const s of this.callsites()) {
      const p = path.parse(s.getFileName())
      if (p.name.match(/day\d+/)) {
        return path.join(p.dir, p.name + ext)
      }
    }
    throw new Error('Day callsite not found')
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

