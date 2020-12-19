'use strict'

const Utils = require('./utils')
const chalk = require('chalk')
const util = require('util')

const {range} = Utils

// just caching these gave me 4s back.
const UNITS = {}
function units(dim) {
  let u = UNITS[dim]
  if (!u) {
    u = [...Utils.product([range(-1, 2)], dim)]
    UNITS[dim] = u
  }
  return u
}
class Pos {
  constructor(...coords) {
    this.coords = coords
  }
  get x() {
    return this.coords[0]
  }
  get y() {
    return this.coords[1]
  }
  get z() {
    return this.coords[2]
  }
  get w() {
    return this.coords[3]
  }
  dim() {
    return this.coords.length
  }
  isOrigin() {
    return this.coords.every(c => c === 0)
  }
  add(...adds) {
    return new Pos(...this.coords.map((c, i) => c + adds[i]))
  }
  is(...coords) {
    if (coords[0] instanceof Pos) {
      coords = coords[0].coords
    }
    return coords.reduce((t, c, i) => t && ((c == null) || (this.coords[i] === c)), true)
  }
  toString() {
    return this.coords.join(',')
  }
  [util.inspect.custom](depth, opts) {
    return '<' + this.coords.map(c => opts.stylize(c, 'number')).join(',') + '>'
  }
}

class Cell {
  constructor(sheet, pos, active=false) {
    this.sheet = new WeakRef(sheet)
    this.pos = pos
    this.active = active
  }
  *neighborPos() {
    for (const coords of units(this.pos.dim())) {
      const p = this.pos.add(...coords)
      if (!p.is(this.pos)) {
        yield p
      }
    }
  }
  *neighborActives() {
    for (const np of this.neighborPos()) {
      yield this.sheet.deref().getCellVal(np)
    }
  }
  countNeighbors() {
    return Utils.reduce(
      (t, x) => x ? t + 1 : t,
      this.neighborActives(),
      0)
  }
  static activeStr(pos, active) {
    const ch = active ? '#' : '.'
    if (pos.isOrigin()) {
      return chalk.bgBlue(ch)
    }
    if (pos.is(0,0)) {
      return chalk.bgRed(ch)
    }
    return ch
  }
  toString() {
    return Cell.activeStr(this.pos, this.active)
  }
  [util.inspect.custom](depth, opts) {
    return `${util.inspect(this.pos, depth-1, opts.colors)}: ${this.toString()}`
  }
}

class Sheet {
  constructor(dim=3) {
    this.cells = {}
    this.dim = dim
    this.min = new Array(dim).fill(Infinity)
    this.max = new Array(dim).fill(-Infinity)
  }
  add(cell) {
    this.cells[cell.pos] = cell
    return cell
  }
  getCell(pos) {
    let c = this.cells[pos]
    if (!c) {
      c = this.add(new Cell(this, pos))
    }
    return c
  }
  getCellVal(pos) {
    let c = this.cells[pos]
    return c ? c.active : false
  }
  setCell(pos, active) {
    let c = this.getCell(pos)
    if (!c && active) {
      c = this.add(new Cell(this, pos, active))
    } else {
      if (active) {
        c.active = active
        for (const dir of range(c.pos.dim())) {
          this.min[dir] = Math.min(this.min[dir], c.pos.coords[dir])
          this.max[dir] = Math.max(this.max[dir], c.pos.coords[dir])
        }
      } else {
        delete this.cells[c.pos]
      }
    }
  }
  *allCells() {
    for (const pos of this.scanPos()) {
      yield this.getCell(pos)
    }
  }
  count() {
    return Utils.reduce((t, c) => c.active ? t + 1 : t, this.allCells(), 0)
  }
  scanPos() {
    const ranges = this.min.map((min, i) => range(min-1, this.max[i] + 2)).reverse()
    return Utils.map((coords) => new Pos(...coords.reverse()), Utils.product(ranges))
  }
  toString() {
    let str = ''
    let oldZ = Infinity
    let oldY = Infinity
    let oldW = null
    for (const p of this.scanPos()) {
      if ((p.z !== oldZ) || (p.w !== oldW)) {
        oldZ = p.z
        oldW = p.w
        str += `\nz=${p.z}`
        if (oldW != null) {
          str += `, w=${p.w}`
        }
      }
      if (p.y !== oldY) {
        oldY = p.y
        str += '\n'
      }
      const c = this.cells[p]
      str += c ? c.toString() : Cell.activeStr(p, false)
    }
    return str
  }
}

function life(sheet, times=6) {
  for (const cycle of range(times)) {
    const newSheet = new Sheet(sheet.dim)
    for (const c of sheet.allCells()) {
      const count = c.countNeighbors()
      if (c.active) {
        newSheet.setCell(c.pos, (count === 2) || (count === 3))
      } else {
        newSheet.setCell(c.pos, count === 3)
      }
    }
    sheet = newSheet
  }

  return sheet.count()
}

function part1(inp, args) {
  let sheet = new Sheet(3)

  for (const i of range(inp.length)) {
    for (const j of range(inp[i].length)) {
      sheet.setCell(new Pos(i, j, 0), inp[i][j])
    }
  }
  return life(sheet)
}

function part2(inp, args) {
  let sheet = new Sheet(4)

  for (const i of range(inp.length)) {
    for (const j of range(inp[i].length)) {
      sheet.setCell(new Pos(i, j, 0, 0), inp[i][j])
    }
  }
  return life(sheet)
}

function main(...args) {
  const inp = Utils.readLines().map(a => a.split('').map(c => c === '#'))

  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
