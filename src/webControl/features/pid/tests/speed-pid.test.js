'use strict';

// testing getSpeed

const speedPID = require('../speed-pid');

let acc1 = {
  inclination: 0,
  time: [108928, 47043146]
};

let acc2 = {
  inclination: 10,
  time: [108931, 263604850]
};

let status = {
  angleCenter: 0,
  radiusCenter: 0,
  acc: {
    current: acc2,
    previous: acc1
  },
  pid: {
    currentSpeed: 0,
    targetSpeed: 0,
    previousRadius: 0,
  },
};

speedPID(status);

console.log(status.radiusCenter);
