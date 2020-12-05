lines = lines:(@line "\n")* { return lines }

line = FB LR

FB = fb:$[FB]+ {
  return parseInt(
    fb.replaceAll('F', '0')
      .replaceAll('B', '1'),
    2)
}
LR = lr:$[LR]+ {
  return parseInt(
    lr.replaceAll('L', '0')
      .replaceAll('R', '1'),
    2)
}
