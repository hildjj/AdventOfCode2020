'use strict'

const pegjs = require('pegjs')
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
   * @callback mainCallback
   * @param {string} [inputFile] - The input file to parse, or the default
   * @param {boolean} trace - Do parser tracing?
   * @param {Object} params - The command line, as `{args, params, flags}`
   * @returns {boolean} - Does this item match?
   */

  /**
   * Wrapper for main, so that it only gets called if the module hasn't been
   * required (e.g. when jest tests are being run).  Prints the return from
   * mainFunc.
   *
   * @static
   * @param {NodeJS.Module} rmain - The main module currently executing.
   *   Pass in `require.main`
   * @param {NodeJS.Module} mod - The module in the file that is calling in.
   *   Pass in `module`
   * @param {mainCallback} mainFunc - The function to call if rmain == mod
   * @example
   * Utils.main(require.main, module, main)
   */
  static main(rmain, mod, mainFunc) {
    if (rmain === mod) {
      const args = process.argv.slice(2)
      const [params, flags] = args.reduce((t, v) => {
        t[v.startsWith('--') ? 1 : 0].push(v)
        return t
      }, [[], []])
      const inputFile = params[0]
      const trace = flags.indexOf('--trace') >= 0
      const res = mainFunc(inputFile, trace, { args, params, flags })
      console.log(res)
    }
  }

  /**
   * Read file, parse lines.
   *
   * @static
   * @param {string} [filename=null] - If null, figures out what day today is
   *   and finds the .txt file
   * @returns {Array<string>}
   */
  static readLines(filename) {
    if (!filename) {
      // s/.js$/.txt/ from the calling file.
      filename = this._adjacentFile('.txt', 'inputs')
    }
    return fs.readFileSync(filename, 'utf8')
      .split('\n')
      .filter(s => s.length)
  }

  /**
   * @static
   * @param {string} [filename] - If null, figures out what day today is
   *   and finds the .txt file
   * @param {string|function} [parser] - If a string, the name of the parser
   *   file to require.  If a function, the pre-required parser.  If null,
   *   find the parser with the matching name. If no parser found, split
   *   like `readLines`.
   * @param {boolean} [trace=false] - turn on parser tracing?
   * @returns {any} - the output of the parser
   */
  static parseFile(filename, parser, trace=false) {
    if (!filename) {
      filename = this._adjacentFile('.txt', 'inputs')
    }
    const txt = fs.readFileSync(filename, 'utf8')

    // @type {function}
    let parserFunc = null
    if (typeof parser === 'function') {
      parserFunc = parser
    } else {
      const parserFile = parser ?? this._adjacentFile('.pegjs')
      const parserText = fs.readFileSync(parserFile, 'utf8')
      // @ts-ignore: TS2339, PegJS team can't get out of their own way.
      parserFunc = pegjs.generate(parserText, {trace}).parse
    }
    return parserFunc(txt)
  }

  /**
   * @private
   */
  static _adjacentFile(ext, ...dir) {
    // idiomatic tcl
    // @ts-ignore: TS2339, tsc can't see the hidden call of `getStack`
    const p = path.parse(this.callsites()[2].getFileName())
    return path.join(p.dir, ...dir, p.name + ext)
  }

  static callsites() {
    const old = Error.prepareStackTrace
    Error.prepareStackTrace = getStack
    const stack = new Error().stack.slice(1) // i am never interesting
    Error.prepareStackTrace = old
    return stack
  }

  /**
   * Modulo, minus the JS bug with negative numbers.
   * `-5 % 4` should be `3`, not `-1`.
   *
   * @static
   * @param {number|BigInt} x
   * @param {number|BigInt} y
   * @returns {number|BigInt} x mod y
   */
  static mod(x, y) {
    // == works with either 0 or 0n.
    if (y == 0) {
      throw new Error('Division by zero')
    }
    // @ts-ignore: TS2365.  tsc can't see that x and y are always the same type
    return ((x % y) + y) % y
  }

  /**
   * Integer result of x / y, plus the modulo (unsigned) remainder.
   *
   * @static
   * @param {number|BigInt} x
   * @param {number|BigInt} y
   * @returns {[number|BigInt, number|BigInt]} - the quotient and remainder
   */
  static divmod(x, y) {
    // @ts-ignore: TS2362.  x and y are the same time.  We're fine.
    let q = x / y
    const r = this.mod(x, y)
    if (typeof x === 'bigint') {
      // not only does Math.floor not work for BigInt, it's not needed because
      // `/` does the right thing in the first place.

      // except for numbers of opposite sign
      if ((q < 0n) && (r > 0n)) {
        // There was a remainder.  JS rounded toward zero, but python
        // rounds down.
        q--
      }
      return [ q, r ]
    }
    return [ Math.floor(q), r ]
  }

  /**
   * @callback itSomeCallback
   * @param {any} item - The item of the iterator to check
   * @param {number} index - The index of the item in the iterator
   * @returns {boolean} - Does this item match?
   */
  /**
   * Tests whether at least one element generated by the iterator passes the
   * test implemented by the provided function
   *
   * @static
   * @param {IterableIterator<any>} it - the iterator.
   *   It may not be fully consumed.
   * @param {itSomeCallback} f
   * @param {any} [thisArg] - what is `this` in the function `f`?
   * @returns
   */
  static itSome(it, f, thisArg) {
    let count = 0
    for (const i of it) {
      if (!!f.call(thisArg, i, count++)) {
        return true
      }
    }
    return false
  }

  /**
   * Is the given thing iterable?
   *
   * @static
   * @param {any} g - the thing to check
   * @returns {boolean} - true if `g` looks like an iterable
   */
  static isIterable(g) {
    return g &&
      (typeof g === 'object') &&
      (g[Symbol.iterator])
  }

  /**
   * Cross product.  Translated from the python docs.
   *
   * @static
   * @param {Array<Iterable>} iterables - iterables to cross together
   * @param {number} [repeat=1] - number of times to repeat the iterables
   * @yields {Array} one of the combinations of the iterables
   */
  static *product(iterables, repeat = 1) {
    const pools = this.ncycle(this.map(this.list, iterables), repeat)
    let result = [[]]
    for (const pool of pools) {
      const r2 = []
      for (const x of result) {
        for (const y of pool) {
          r2.push(x.concat(y))
        }
        result = r2
      }
    }
    yield *result
  }

  /**
   * Yields all possible subsets of the input, including the input itself
   * and the empty set.
   *
   * @static
   * @param {Iterable} iterable - input
   * @yields {Array}
   */
  static *powerset(iterable) {
    const pool = [...iterable]
    for (const len of this.range(pool.length + 1)) {
      yield* this.combinations(pool, len)
    }
  }

  /**
   * Yield the same value for ever.  And ever.
   * Value of VALUES! and Loop of LOOPS!
   *
   * @static
   * @param {any} [val=0] - the value to yield
   * @yields {any} val
   */
  static *forEver(val = 0) {
    while (true) {
      yield val
    }
  }

  /**
   * @callback filterCallback
   * @param {any} item - The item of the iterator to filter
   * @param {number} index - The index of the item in the iterator
   * @param {Iterable} iterable - The iterable being filtered
   * @returns {boolean} - if true, this item is retained
   */

  /**
   * Filter the iterable by a function.  If the function returns true,
   * the given value is yielded.  This should be a pretty big win over
   * `[...iterable].filter(fn)`.
   *
   * @static
   * @param {Iterable} iterable - the iterable to filter
   * @param {filterCallback} fn - function called for every item in iterable
   * @param {any} [thisArg] - `this` in the filterCallback
   * @yields {any} - iterable values that match
   */
  static *filter(iterable, fn, thisArg) {
    let count = 0
    for (const val of iterable) {
      if (fn.call(thisArg, val, count++, iterable)) {
        yield val
      }
    }
  }

  // BELOW lifted from https://github.com/aureooms/js-itertools,
  // removed need for weird runtime
  // ----------

  /**
   * Like Python's range(), generate a series of numbers.
   *
   * @static
   * @param {number} start - the starting point
   * @param {number} [stop] - the ending point, which isn't reached
   * @param {number} [step=1] - how much to add each time, may be negative
   * @yields {number} - each number in the range
   */
  static *range(start, stop, step=1) {
    if (stop == null) {
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

  /**
   * Pick some properties or array values out of `source`.
   *
   * @static
   * @param {Object|Array<any>|Iterable<any>} source - thing to select from
   * @param {Iterable<number|string>} it - the indexes or property names
   * @yields {any} - the selected property
   */
  static *pick(source, it) {
    if (this.isIterable(source)) {
      // TODO: this is slower than it should be, but `it` might be out
      // of order, and so might `source`.
      source = [...source]
    }
    for (const i of it) {
      yield source[i]
    }
  }

  /**
   * Combinations of a series, r at a time
   *
   * @static
   * @param {Iterable} iterable - the series to iterate.
   * @param {number} r - How many of the series to use in each combination?
   * @yields {Array<any>} - each combination
   */
  static *combinations(iterable, r) {
    const pool = Array.isArray(iterable) ? iterable : [...iterable]
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

  /**
   * Yields all elements of the iterable except the last <code>n</code> ones.
   * If <code>n</code> is negative, behaves like
   * <code>{@link take}(iterable, -n)</code>.
   *
   * @static
   * @param {Iterable} iterable - input
   * @param {number} n - number of elements to exclude at the end
   * @yields {any} - the front of the input
   */
  static *trunc(iterable, n) {
    if (n < 0) {
      yield* this.take(iterable, -n)
      return
    }

    if (n === 0) {
      yield* iterable
      return
    }

    // buffer up n entries, then serve old ones as we go
    const buffer = new Array(n)
    let cur = 0
    let left = n
    for (const value of iterable) {
      if (left > 0) {
        left--
      } else {
        yield buffer[cur]
      }
      buffer[cur] = value
      cur = (cur + 1) % n
    }
  }

  /**
   * Yields the first <code>n</code> elements of the input iterable. If
   * <code>n</code> is negative, behaves like
   * <code>{@link trunc}(iterable, -n)</code>.
   *
   * @static
   * @param {Iterable} iterable - The input iterable.
   * @param {Number} n - The number of elements to include in the output.
   * @yields {any}
   */
  static *take(iterable, n) {
    if (n == 0) {
      return
    }

    if (n < 0) {
      yield* this.trunc(iterable, -n)
      return
    }

    for (const val of iterable) {
      yield val
      if (--n <= 0) {
        return
      }
    }
  }

  /**
   * Yields all permutations of each possible choice of <code>r</code> elements
   * of the input iterable.
   *
   * @static
   * @param {Iterable} iterable - The input iterable.
   * @param {Number} r - The size of the permutations to generate.
   * @yields {Array}
   */
  static *permutations(iterable, r) {
    const pool = [...iterable]
    const length = pool.length

    if (r > length || r <= 0 || length === 0) {
      return
    }

    const indices = [...this.range(length)]
    const cycles = [...this.range(length, length - r, -1)]

    yield [...this.pick(pool, this.take(indices, r))]

    while (true) {
      let i = r

      while (i--) {
        --cycles[i]

        if (cycles[i] === 0) {
          // Could be costly
          indices.push(indices.splice(i, 1)[0])

          cycles[i] = length - i
        } else {
          const j = cycles[i];
          [indices[i], indices[length - j]] = [indices[length - j], indices[i]]
          yield [...this.pick(pool, this.take(indices, r))]
          break
        }
      }

      if (i === -1) {
        return
      }
    }
  }

  /**
   * Cycle an iteable n times.
   * @static
   * @param {Iterable} iterable - The input iterable
   * @param {Number} n - The number of times to cycle through the input iterable
   * @yields {Any} - a value from the iterable
   */
  static *ncycle(iterable, n) {
    if (n <= 0) {
      // nothing
    } else if (n === 1) {
      yield *iterable
    } else {
      const buffer = []
      for (const item of iterable) {
        yield item
        buffer.push(item)
      }

      if (buffer.length === 0) {
        return
      }

      while (--n > 0) {
        yield* buffer
      }
    }
  }

  /**
   * @callback mapCallback
   * @param {any} item - The item of the iterator to map
   * @param {number} index - The index of the item in the iterator
   * @returns {any} - the mapped value
   */

  /**
   * Map a function across all of the items in an iterable.
   *
   * @static
   * @param {mapCallback} callable - the mapping function
   * @param {Iterable} iterable - source to map from
   * @param {any} [thisArg] - "this" inside of the callable
   */
  static *map(callable, iterable, thisArg) {
    let c = 0
    for (const item of iterable) {
      yield callable.call(thisArg, item, c++)
    }
  }

  /**
   * Convert an iterable into a list.  This is the same as `[...iterable]`
   * but slightly easier to call as a map function.
   *
   * @static
   * @param {Iterable} iterable - the iterable to convert
   * @returns {Array}
   */
  static list(iterable) {
    return Array.from(iterable)
  }

  /**
   * @callback reduceCallback
   * @param {any} accumulator - the value previously returned from the
   *   callback, starting with the initializer
   * @param {any} item - the item of the iterator to process
   * @param {number} index - the index of the item in the iterator
   * @returns {any} - the next value of the accumulator
   */

  /**
   * @private
   */
  static _reduce(callback, iterable, initializer, count = 0) {
    for (const item of iterable) {
      initializer = callback(initializer, item, count++)
    }

    return initializer
  }

  /**
   * Repeatedly execute a reducer callback for each item in the iterable,
   * resulting in a single output value.
   *
   * @static
   * @throws {TypeError} - iterable is empty and there is no initializer
   * @param {reduceCallback} callback - function to call for each
   *   item in the iterable
   * @param {Iterable} iterable - series to pull from
   * @param {any} [initializer] - initial value.  If none is provided, use the
   *   first item in the iterable (like `Array.prototype.reduce()`).
   * @return {any} - the result of the last call to the callback on the
   *   last item
   */
  static reduce(callback, iterable, initializer) {
    if (initializer === undefined) {
      // no initializer?  Use the first item in the iterable
      const iterator = iterable[Symbol.iterator]()
      const first = iterator.next()

      if (first.done) {
        throw new TypeError('Empty iterable and no initializer')
      }

      return this._reduce(callback, iterator, first.value, 1)
    }

    return this._reduce(callback, iterable, initializer)
  }
}

module.exports = Utils

