lines = lines:(@line "\n")* { return lines }

line = fb:$FB+ lr:$LR+ { return [fb, lr ] }

FB = $[FB]
LR = $[LR]
