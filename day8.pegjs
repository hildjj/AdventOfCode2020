lines = lines:(@line "\n")* { return lines }

line = op:op s n:operand { return [op, n] }

op
  = "nop"
  / "acc"
  / "jmp"

operand = o:$([+-] [0-9]+) { return parseInt(o, 10) }

s = [ \t]+ { return }
