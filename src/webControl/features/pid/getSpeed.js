'use strict';

// code that returns an angular speed based on accelerometer info (current and previous)

const debug = require('debug')('wc:pid/getSpeed'); // wc for web control

const getTimeDiff = require('./getTimeDiff');

/**
 * Computes the angular speed from angles and times
 * @param {object} angles in degrees
 * @param {object} times in the hrtime format
 * @returns {number} angular speed in degrees/second
 */
function getSpeed(angles, times) {
  let angleDiff = angles.current - angles.previous;
  let timeDiff = getTimeDiff(times.current, times.previous);
  debug(`timeDiff\t${timeDiff}`);

  return angleDiff / timeDiff;
}

module.exports = getSpeed;
