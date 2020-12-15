lines = lines:(@line "\n")* { return lines }

line
  = mem
  / mask

mem = "mem" "[" addr:$[0-9]+ "]" s "=" s val:$[0-9]+ { return ["mem", BigInt(addr), BigInt(val)] }
mask = "mask" s "=" s m:[10X]+ { return ["mask", m.reverse()] }

s = [ \t]*
