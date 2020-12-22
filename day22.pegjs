lines = @player "\n" @player

player = "Player" s num ":" s "\n" @cards

cards = (@num "\n")+

line = $[^\n]*
s = [ \t]*
num = n:$[0-9]+ { return parseInt(n) }
