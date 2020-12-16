notes = rules:rules "\n" your:yourtix "\n" nearby:nearby { return { rules:Object.fromEntries(rules), your, nearby} }

rules = (@rule "\n")+
rule = n:$name ":" s r1:range s "or" s r2:range { return [n, [r1, r2]] }

yourtix = "your ticket:\n" @numlist "\n"

nearby = "nearby tickets:\n" n:(@numlist "\n")+ { return n }

name = $[^:]+
range = n1:num "-" n2:num { return [n1, n2] }
numlist = first:num rest:("," @num)* { rest.unshift(first); return rest }
num = n:$[0-9]+ { return parseInt(n) }
s = [ \t]*
