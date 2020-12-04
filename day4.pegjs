
file = records:(@record "\n")* { return records }

record = fields:(@field s)* { return Object.fromEntries(fields)}

field = n:name ":" v:val { return [n, v] }

name = $[a-z]+

val = $[^ \n]+

s
  = " "
  / "\n"
