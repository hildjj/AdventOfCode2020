lines = (@line "\n")*

line = dir+

dir
  = "e"  { return [1,  0] }
  / "se" { return [0,  1] }
  / "sw" { return [-1, 1] }
  / "w"  { return [-1, 0] }
  / "nw" { return [0, -1] }
  / "ne" { return [1, -1] }
