lines = lines:(@line "\n")* { return lines }

line = container:bags "contain" s cont:contained "." { return [container, cont ]}

contained
  = first:numbags rest:( "," s @numbags)* { rest.unshift(first); return rest }
  / "no other bags" { return [] }

numbags = num:$[0-9]+ s b:bags { return [parseInt(num, 10), b] }

bags = w1:word s w2:word s bagses s { return `${w1} ${w2}`}
bagses = "bag" "s"?

word = w:$[a-z]+ { return w }
s = [ \t]*
