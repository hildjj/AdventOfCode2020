'use strict'

const Utils = require('./utils')
function main() {
  const inp = Utils.parseFile()
  return inp
}

module.exports = main
if (require?.main === module) {
  console.log(...main())
}
