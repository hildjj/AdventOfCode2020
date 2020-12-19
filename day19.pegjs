file = @rules "\n" @data

rules = (@num ":" s @def "\n")+
def
  = char
  / n1:numlist s "|" s n2:numlist { return ['or', n1, n2]}
  / numlist

char = '"' c:$[a-zA-Z0-9]+ '"' { return ['char', c]}
numlist = f:num l:(s @num)* { l.unshift(f); l.unshift('and'); return l }
data = (@line "\n")*

line = $[ab]+
num = n:$[0-9]+ { return parseInt(n) }
s = [ \t]* { return undefined }
