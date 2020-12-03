import itertools
import turtle

turtle.setup(500,500,-1,0)

# you can comment this out to keep state inbetween runs
turtle.reset()

turtle.forward(100)
turtle.left(30)
turtle.forward(100)
turtle.left(30)

f = open('day1.txt', 'r')
nums = map(lambda x: int(x), f.readlines())
for [x, y, z] in itertools.combinations(nums, 3):
  if x + y + z == 2020:
    print(x * y * z)
