'use strict'
const fs = require('fs')
const path = require('path')

function getStack(_, stack) {
  return stack
}

/**
 * Utility functions
 */
class Utils {
  /**
   * Read file, parse lines.
   *
   * @static
   * @param {string?} filename - If null, figures out what day today is and
   *   finds the .txt file
   * @returns
   */
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
    const txt = fs.readFileSync(filename, 'utf8')

    if (!parser) {
      parser = this.adjacentFile('.peg.js')
    }
    if (typeof parser !== 'function') {
      try {
        parser = require(parser).parse
      } catch {
        console.error(`No parser: "${parser}", falling back on readLines`)
        return txt
          .split('\n')
          .filter(s => s.length)
      }
    }
    return parser(txt)
  }

  static adjacentFile(ext) {
    // callsites()[2] would be idiomatic in tcl.
    // unfortunately, vm2 interposes a callsite, so.... let's cheat.
    for (const s of this.callsites()) {
      const p = path.parse(s.getFileName())
      const m = p.name.match(/(day\d+)/)
      if (m) {
        return path.join(p.dir, m[1] + ext)
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

  static itSome(it, f) {
    for (const i of it) {
      if (!!f(i)) {
        return true
      }
    }
    return false
  }

  // BELOW lifted from https://github.com/aureooms/js-itertools,
  // removed need for weird runtime
  // ----------
  static *range(start, stop, step=1) {
    if (!stop) {
      [start, stop] = [0, start]
    }
    if (step < 0) {
      while (start > stop) {
        yield start
        start += step
      }
    } else {
      while (start < stop) {
        yield start
        start += step
      }
    }
  }

  static *pick(source, it) {
    for (const i of it) {
      yield source[i]
    }
  }

  static *combinations(iterable, r) {
    const pool = [...iterable]
    const length = pool.length

    if (r > length) {
      return
    }

    const indices = [...this.range(r)]
    yield [...this.pick(pool, indices)]

    while (true) {
      let i = r - 1
      while (true) {
        if (i < 0) {
          return
        }
    
        if (indices[i] !== i + length - r) {
          let pivot = ++indices[i]
          for (++i; i < r; ++i) {
            indices[i] = ++pivot
          }
          break
        }
        i--
      }
    
      yield [...this.pick(pool, indices)]
    }
  }
}

module.exports = Utils

