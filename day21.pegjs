lines = (@line "\n")*

line = words:(@word s)* s allergens:allergens? { return {words, allergens}}

allergens = "(" s "contains" s f:word l:( "," s @word)* ")" { l.unshift(f); return l }
word = $[^ (),]+
s = [ \t]*
