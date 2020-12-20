# 2020 Advent of Code answers

THIS REPO IS ALL SPOILERS.

For puzzle descriptions, and to play for yourself, see [https://adventofcode.com/](https://adventofcode.com/), and consider donating to [AoC++](https://adventofcode.com/2020/support).  I publish my answers because folks who have also solved the puzzles like to discuss different approaches.

I'll often use a new framework, a new process, etc. on these puzzles.  I tend to use a lot of [PEGjs](https://pegjs.org/) grammars, because I find those fun.  That project is currently undergoing [some changes](https://github.com/pegjs/pegjs/issues/639), and you'll note that I'm using an odd branch of the code that has an undocumented feature.  Rules that have multiple elements on the right hand side can return one or more results without needing a code block by prefixing those elements with `@`.  For example:

```pegjs
lines = (@line "\n")*
```

will return an array of the lines without newlines.  This comes up so often for me that it's worth using an odd fork to reduce the amount of code needed.


![Node.js CI](https://github.com/hildjj/AdventOfCode2020/workflows/Santa/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/hildjj/AdventOfCode2020/badge.svg?branch=master)](https://coveralls.io/github/hildjj/AdventOfCode2020?branch=master)
