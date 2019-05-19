'use strict';

/**
 * Calculates the time difference in seconds between 2 hrtimes.
 *  hrtime is an array of two int.
 * @param {array} hrtime
 * @param {array} previousHrtime
 * @returns {number} time difference in seconds
 */
function getTimeDiff(hrtime, previousHrtime) {
  return hrtime[0] - previousHrtime[0] + (hrtime[1] - previousHrtime[1]) / 1e9;
}

module.exports = getTimeDiff;
