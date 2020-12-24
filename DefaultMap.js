'use strict'

class DefaultMap {
  constructor(defaultVal=0) {
    this.items = {}
    this.def = defaultVal
    this.fn = (typeof this.def === 'function')
    this.size = 0
  }
  get(index) {
    let v = this.items[index]
    if (v == null) {
      if (this.fn) {
        v = this.def.call(this, index)
      } else {
        v = this.def
      }
      // no need to store the default
    }
    return v
  }
  set(index, val) {
    const v = this.items[index]
    if (v == null) {
      if (val === this.def) {
        return val
      }
      this.size++
    } else {
      if (val === this.def) {
        delete this.items[index]
        this.size--
        return val
      }
    }
    return this.items[index] = val
  }
  *[Symbol.iterator]() {
    yield* Object.entries(this.items)
  }
}
module.exports = DefaultMap
