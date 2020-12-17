'use strict'

const Utils = require('./utils')
const chalk = require('chalk')
const util = require('util')

const {range} = Utils

class Pos {
  constructor(x=0, y=0, z=0) {
    this.x = x
    this.y = y
    this.z = z
  }
  add(i, j, k) {
    return new Pos(this.x + i, this.y + j, this.z + k)
  }
  is(i, j, k) {
    if (i instanceof Pos) {
      [i, j, k] = [i.x, i.y, i.z]
    }
    return ((i == null) || (this.x === i)) &&
      ((j == null) || (this.y === j)) &&
      ((k == null) || (this.z === k))
  }
  toString() {
    return `${this.x},${this.y},${this.z}`
  }
  [util.inspect.custom](depth, opts) {
    return '<' +
      opts.stylize(this.x, 'number') + ',' +
      opts.stylize(this.y, 'number') + ',' +
      opts.stylize(this.z, 'number') + '>'
  }
}

class Pos4 {
  constructor(x=0, y=0, z=0, w=0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }
  add(i, j, k, l) {
    return new Pos4(this.x + i, this.y + j, this.z + k, this.w + l)
  }
  is(i, j, k, l) {
    if (i instanceof Pos4) {
      [i, j, k, l] = [i.x, i.y, i.z, i.w]
    }
    return ((i == null) || (this.x === i)) &&
      ((j == null) || (this.y === j)) &&
      ((k == null) || (this.z === k)) &&
      ((l == null) || (this.w === l))
  }
  toString() {
    return `${this.x},${this.y},${this.z}.${this.w}`
  }
  [util.inspect.custom](depth, opts) {
    return '<' +
      opts.stylize(this.x, 'number') + ',' +
      opts.stylize(this.y, 'number') + ',' +
      opts.stylize(this.z, 'number') + ',' +
      opts.stylize(this.w, 'number') + '>'
  }
}

class Cell {
  constructor(sheet, pos, active=false) {
    this.sheet = new WeakRef(sheet)
    this.pos = pos
    this.active = active
  }
  *neighborPos() {
    for (const [i, j, k] of Utils.product([range(-1, 2)], 3)) {
      const p = this.pos.add(i, j, k)
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
  toString() {
    if (this.pos.is(0,0,0)) {
      return chalk.bgBlue(this.active ? '#' : '.')
    }
    if (this.pos.is(0,0)) {
      return chalk.bgRed(this.active ? '#' : '.')
    }
    return this.active ? '#' : '.'
  }
  [util.inspect.custom](depth, opts) {
    return `${util.inspect(this.pos, depth-1, opts.colors)}: ${this.toString()}`
  }
}

class Cell4 extends Cell{
  constructor(sheet, pos, active=false) {
    super(sheet, pos, active)
  }
  *neighborPos() {
    for (const [i, j, k, l] of Utils.product([range(-1, 2)], 4)) {
      const p = this.pos.add(i, j, k, l)
      if (!p.is(this.pos)) {
        yield p
      }
    }
  }
}

class Sheet {
  constructor(cells={}) {
    this.cells = cells
    this.min = {x: Infinity, y: Infinity, z: Infinity}
    this.max = {x: -Infinity, y: -Infinity, z: -Infinity}
    this.posType = Pos
    this.cellType = Cell
  }
  setBounds(cell) {
    if (cell.active) {
      for (const dir of ['x', 'y', 'z']) {
        this.min[dir] = Math.min(this.min[dir], cell.pos[dir])
        this.max[dir] = Math.max(this.max[dir], cell.pos[dir])
      }
    }
  }
  add(cell) {
    this.cells[cell.pos] = cell
    return cell
  }
  getCell(pos) {
    let c = this.cells[pos]
    if (!c) {
      c = this.add(new this.cellType(this, pos))
    }
    return c
  }
  getCellVal(pos) {
    return this.getCell(pos).active
  }
  setCell(pos, active) {
    let c = this.getCell(pos)
    if (!c) {
      c = this.add(new this.cellType(this, pos, active))
    } else {
      c.active = active
      this.setBounds(c)
    }
    return c
  }
  *allCells() {
    for (const pos of this.scanPos()) {
      yield this.getCell(pos)
    }
  }
  count() {
    return Utils.reduce((t, c) => c.active ? t + 1 : t, this.allCells(), 0)
  }
  *scanPos() {
    // don't try to use product for this, order matters too much
    for (const k of range(this.min.z-1, this.max.z+2)) {
      for (const i of range(this.min.x-1, this.max.x+2)) {
        for (const j of range(this.min.y-1, this.max.y+2)) {
          yield new this.posType(i, j, k)
        }
      }
    }
  }
  toString() {
    let str = ''
    let oldZ = Infinity
    let oldY = Infinity
    for (const p of this.scanPos()) {
      if (p.z !== oldZ) {
        oldZ = p.z
        str += `\nz=${p.z}`
      }
      if (p.x !== oldY) {
        oldY = p.x
        str += '\n'
      }
      const c = this.cells[p]
      str += c ? c.toString() : '.'
    }
    return str
  }
}

class Sheet4 extends Sheet {
  constructor(cells={}) {
    super(cells)
    this.min.w = Infinity
    this.max.w = -Infinity
  }
  setBounds(cell) {
    if (cell.active) {
      for (const dir of ['x', 'y', 'z', 'w']) {
        this.min[dir] = Math.min(this.min[dir], cell.pos[dir])
        this.max[dir] = Math.max(this.max[dir], cell.pos[dir])
      }
    }
  }
  add(cell) {
    this.cells[cell.pos] = cell
    return cell
  }
  getCell(pos) {
    let c = this.cells[pos]
    if (!c) {
      c = this.add(new Cell4(this, pos))
    }
    return c
  }
  getCellVal(pos) {
    return this.getCell(pos).active
  }
  setCell(pos, active) {
    let c = this.getCell(pos)
    if (!c) {
      c = this.add(new Cell4(this, pos, active))
    } else {
      c.active = active
      this.setBounds(c)
    }
    return c
  }
  *allCells() {
    for (const pos of this.scanPos()) {
      yield this.getCell(pos)
    }
  }
  count() {
    return Utils.reduce((t, c) => c.active ? t + 1 : t, this.allCells(), 0)
  }
  *scanPos() {
    // don't try to use product for this, order matters too much
    for (const k of range(this.min.z-1, this.max.z+2)) {
      for (const i of range(this.min.x-1, this.max.x+2)) {
        for (const j of range(this.min.y-1, this.max.y+2)) {
          for (const l of range(this.min.w-1, this.max.w+2)) {
            yield new Pos4(i, j, k, l)
          }
        }
      }
    }
  }
  toString() {
    let str = ''
    let oldZ = Infinity
    let oldY = Infinity
    for (const p of this.scanPos()) {
      if (p.z !== oldZ) {
        oldZ = p.z
        str += `\nz=${p.z}`
      }
      if (p.x !== oldY) {
        oldY = p.x
        str += '\n'
      }
      const c = this.cells[p]
      str += c ? c.toString() : '.'
    }
    return str
  }
}

function part1(inp, args) {
  let sheet = new Sheet()

  for (const i of range(inp.length)) {
    for (const j of range(inp[i].length)) {
      sheet.setCell(new Pos(i, j), inp[i][j])
    }
  }

  for (const cycle of range(6)) {
    const newSheet = new Sheet()
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

function part2(inp, args) {
  let sheet = new Sheet4()

  for (const i of range(inp.length)) {
    for (const j of range(inp[i].length)) {
      sheet.setCell(new Pos4(i, j), inp[i][j])
    }
  }

  for (const cycle of range(6)) {
    const newSheet = new Sheet4()
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

function main(...args) {
  const inp = Utils.readLines().map(a => a.split('').map(c => c === '#'))

  return [part1(inp, args), part2(inp, args)]
}

module.exports = main
if (require.main === module) {
  const res = main(...process.argv.slice(2))
  console.log(res)
}
