{
// from https://stackoverflow.com/a/24225307/8388
function leftAssociative(ls, r) {
  if (!ls.length) {
    return r
  }
  const last = ls.pop()
  return { left:leftAssociative(ls, last[1]), op:last[3], right:r }
}
}

lines = lines:(@expr "\n")* { return lines }

expr
  = ls:(s val s op)* s r:val { return leftAssociative(ls, r) }

val
  = group
  / num

op
  = "+"
  / "*"

group = "(" s @expr s ")"

num = n:$[0-9]+ { return parseInt(n, 10) }
s = [ \t]* { return undefined }
