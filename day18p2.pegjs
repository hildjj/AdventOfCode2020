{
// from https://stackoverflow.com/a/24225307/8388
function leftAssociative(ls, right) {
  if (!ls.length) {
    return right
  }
  const last = ls.pop()
  return { left:leftAssociative(ls, last[0]), op:last[1], right }
}
}

lines = (@expr "\n")*

expr
  = ls:(s @sub s @"*")* s r:sub { return leftAssociative(ls, r) }

sub
  = ls:(s @val s @"+")* s r:val { return leftAssociative(ls, r) }

val
  = group
  / num

op
  = "+"
  / "*"

group = "(" @expr s ")"

num = n:$[0-9]+ { return parseInt(n, 10) }
s = [ \t]* { return undefined }
