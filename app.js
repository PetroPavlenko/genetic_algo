var Itaration = require('./iteration'),
  _ = require('lodash');

var f = x => -Math.pow(x * x - 4 * x + 15, 2) / 256,
  inArr = [2, 5, 3, 7, 4, 2, 8, 6],
  numLen = 8,
  iteration = new Itaration(numLen, f),
  a = inArr;
console.log(a);
var count = 0, maxNum = {};
while (
count < 10 &&
(maxNum = _.maxBy(_.entries(_.countBy(a)), a => a[1])) &&
maxNum[1] < numLen * 0.9
  ) {
  a = iteration.iterate(a);
  console.log(a);
  console.log('\n\n\n');
  ++count;
}

console.log(maxNum);
console.log('Num of iterations ' + count);
