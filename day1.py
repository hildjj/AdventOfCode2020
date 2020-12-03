# redone in python to show that itertools is massively better than
# js-combinatorics for combinations.

import itertools

f = open('day1.txt', 'r')
nums = map(lambda x: int(x), f.readlines())
for [x, y, z] in itertools.combinations(nums, 3):
  if x + y + z == 2020:
    print(x * y * z)
