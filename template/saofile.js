const superb = require('superb')
const fs = require('fs')
const {spawn} = require('child_process')

const days = fs.readdirSync('.')
  .filter(f => f.match(/day\d+\.js/))
  .sort((a, b) => a.match(/\d+/)[0] - b.match(/\d+/)[0])
const d = (days.length == 0) ? 1 : parseInt(days[days.length-1].match(/\d+/)[0]) + 1

function spawnAsync(cmd, ...args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit'
    })
    child.on('error', reject)
    child.on('exit', code => {
      if (code === 0) {
        resolve()
      }
      reject(new Error(`Child died with: ${code}`))
    })
  })
}

module.exports = {
actions: [
    {
      type: 'add',
      files: '**'
    },
    {
      type: 'move',
      patterns: {
        'template.js': `day${d}.js`,
        'test/day.tests': `test/day${d}.tests`,
        'lines.pegjs': `day${d}.pegjs`,
        'input.txt': `day${d}.txt`
      }
    },
  ],
  async completed() {
    await spawnAsync('make')
    await spawnAsync('curl',
      '-b', '.cookies',
      '-o', `inputs/day${d}.txt`,
      `https://adventofcode.com/2020/day/${d}/input`)

    await spawnAsync('code', `day${d}.js`)
    await spawnAsync('code', `day${d}.pegjs`)
    await spawnAsync('code', `inputs/day${d}.txt`)
    await spawnAsync('code', `test/day${d}.tests`)
    await spawnAsync('npm', 'test')
  }
}
