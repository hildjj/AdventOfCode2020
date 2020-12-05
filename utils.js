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
    // this would be idiomatic in tcl.
    // unfortunately, vm2 interposes a callsite, so.... let's cheat.
    const site = this
      .callsites()
      .find(s => path.parse(s.getFileName()).name.match(/day\d+/))
    const p = path.parse(site.getFileName())
    return path.join(p.dir, p.name + ext)
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

