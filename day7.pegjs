lines = lines:(@line "\n")* { return lines }

line = container:bags s "contain" s cont:contained "." { return [container, cont ]}

contained
  = first:numbags rest:( "," s @numbags)* { rest.unshift(first); return rest }
  / "no other bags" { return [] }

numbags = num:$[0-9]+ s b:bags { return [parseInt(num, 10), b] }

bags = @color s bagses
bagses = "bag" "s"?

// I think it's better to assume colors are one are more words that aren't "bag"
// or "bags" than to assume colors are always two words.
// color = w1:word s w2:word { return `${w1} ${w2}` }
color = first:word rest:(s @word)* { rest.unshift(first); return rest.join(' ') }
word = w:$[a-z]+ !{ return w.match(/bags?/) } { return w }
s = $[ \t]*
