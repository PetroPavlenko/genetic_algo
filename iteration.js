"use strict";
var _ = require('lodash');


var rndSmart = (from, to) => {
  return Math.round(Math.random() * to) + from;
};

var rnd = () => {
  return Math.round(Math.random() * 100);
};

String.prototype.replaceAt = function(index, character) {
  return this.substr(0, index - 1) + character +
    this.substr(index);
};

module.exports = class {

  constructor(numLen, f) {
    this.f = f;
    this.numLen = numLen;
  }

  iterate(a) {
    this.aLen = a.length;
    var rndArr = [],
      voutes = [],
      bits = [],
      swappedBits = [],
      i = 0;

    /**
     * [{
     *   end: Number,   0 - 100
     *   a: Number      appropriate el from a (Array) form arr 0 - 100
     * }]
     */
    var probArr = this.getProbArr(a);
    // generate random
    for (i = 0; i < this.aLen; ++i) {
      rndArr.push(rnd());
    }
    // voting
    voutes = rndArr.reduce((ans, el) => {
      for (i = 1; i < probArr.length; ++i) {
        if (el > probArr[i - 1].end && el < probArr[i].end) {
          return ans.concat([probArr[i].a])
        }
      }
      return ans.concat([_.last(probArr).a])
    }, []);

    //swap bits
    bits = voutes.map(x => this.numToBit(x));
    for (i = 0; i < this.aLen; i += 2) {
      swappedBits = swappedBits.concat(this.swap(bits[i], bits[i + 1]))
    }

    //mutate and logs
    var log = [];
    for (i = 0; i < this.aLen; ++i) {
      if (this.checkMutate()) {
        swappedBits[i] = this.mutate(swappedBits[i]);
        log.push({mutate: true, swappedBit: swappedBits[i]});
      }
      else {
        log.push({mutate: false, swappedBit: swappedBits[i]});
      }
    }
    console.log(log);
    return swappedBits.map(x => parseInt(x, 2));
  }

  mutate(str) {
    var i = rndSmart(0, str.length / 2); // TODO may change
    return str.replaceAt(i, parseInt(str[i]) ^ 1);
  }

  checkMutate() {
    return Math.random() > 0.875
  }

  getProbArr(a) {
    var a1 = a.map(this.f);
    var min = _.min(a1);
    a1 = a.map(x => x - min);
    var sum2 = _.sum(a1);
    a1 = a1.map(x => x / sum2 * 100);
    return a1.reduce((arr, el, i) => {
      if (el === 0) {
        return arr;
      }
      return arr.concat([{
        end: el + _.last(arr).end,
        a: a[i]
      }])
    }, [{end: 0}]);
  }


  swap(a, b) {
    var pLen = this.numLen / 2;
    return [
      a.substr(0, pLen) + b.substr(pLen, pLen),
      b.substr(0, pLen) + a.substr(pLen, pLen)
    ];
  }

  numToBit(num) {
    var binStr = num.toString(2);

    for (var i = 0; i < this.numLen; ++i) {
      if (!binStr[i]) {
        binStr = '0' + binStr;
      }
    }
    return binStr
  }
};

