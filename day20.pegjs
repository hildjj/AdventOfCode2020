tiles = tile+

tile = @title @lines "\n"
title = "Tile" s @num ":" s "\n"

lines = line+
line = c:[.#]+ "\n" { return c.map(s => (s === '#') ? 1 : 0 ) }


num = n:$[0-9]+ { return parseInt(n) }
s = [ \t]*
