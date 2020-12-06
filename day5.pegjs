lines = lines:(@line "\n")* { return lines }

line = VER HOR

VER = fb:FB+ { return fb.reduce((t, d) => (t << 1) + d, 0) }
FB = F / B

HOR = lr:LR+ { return lr.reduce((t, d) => (t << 1) + d, 0) }
LR = L / R

F = "F" { return 0 }
B = "B" { return 1 }
L = "L" { return 0 }
R = "R" { return 1 }
