'use strict'

const Utils = require('./utils')
function main() {
  const inp = Utils.readLines()
  return inp
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
