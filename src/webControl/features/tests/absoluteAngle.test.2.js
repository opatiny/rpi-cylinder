'use strict';

// testing absolute angle function

const updateAbsoluteAngle = require('../absoluteAngle');

let status = {
  angleCenter: 0,
  radiusCenter: 0,
  inclination: {
    current: -175,
    previous: 170
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
  absoluteAngle: 0
};

updateAbsoluteAngle(status);

// result should be 370
console.log(status.absoluteAngle);
