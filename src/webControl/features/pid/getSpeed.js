'use strict';

// code that returns an angular speed based on accelerometer info (current and previous)

const debug = require('debug')('wc:pid/getSpeed'); // wc for web control

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

/**
 * Calculates the time difference in seconds between 2 hrtimes
 * @param {array} hrtime
 * @param {array} previousHrtime
 * @returns {number} time difference in seconds
 */
function getTimeDiff(hrtime, previousHrtime) {
  return (hrtime[0] - previousHrtime[0]) + (hrtime[1] - previousHrtime[1]) / 1e9;
}

module.exports = getSpeed;
