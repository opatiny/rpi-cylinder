'use strict';

// testing speed-pid

const speedPID = require('../speed-pid');

let status = {
  angleCenter: 0,
  radiusCenter: 0,
  absoluteAngle: {
    current: -450,
    previous: -450
  },
  time: {
    current: [108931, 263604850],
    previous: [108928, 47043146]
  },
  pid: {
    currentSpeed: 0,
    targetSpeed: 0,
    previousRadius: 0,
  },
};

console.log(speedPID(status));
