'use strict';

// testing absolute angle function

const updateAbsoluteAngle = require('../absoluteAngle');

let status = {
  angleCenter: 0,
  radiusCenter: 0,
  inclination: {
    current: -170,
    previous: 170
  },
  absoluteAngle: {
    current: 0,
    previous: 0
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

updateAbsoluteAngle(status);

// result should be 20
console.log(status.absoluteAngle);
