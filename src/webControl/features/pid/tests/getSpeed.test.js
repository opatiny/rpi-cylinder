'use strict';

// testing getSpeed

const getSpeed = require('../getSpeed');

let acc1 = {
  inclination: 0,
  time: [108928, 47043146]
};

let acc2 = {
  inclination: 10,
  time: [108931, 263604850]
};

console.log(getSpeed(acc2, acc1));
