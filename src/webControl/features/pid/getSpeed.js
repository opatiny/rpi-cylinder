'use strict';

// code that returns an angular speed based on accelerometer info (current and previous)

function getSpeed(acc, previousAcc) {
  let angleDiff = acc.inclination - previousAcc.inclination;
  let timeDiff = getTimeDiff(acc.time, previousAcc.time);
  console.log(timeDiff);

  return angleDiff / timeDiff;
}

/**
 * CalculateS the time difference in seconds between 2 hrtimes
 * @param {array} hrtime
 * @param {array} previousHrtime
 * @returns {number} time difference in seconds
 */
function getTimeDiff(hrtime, previousHrtime) {
  return (hrtime[0] - previousHrtime[0]) + (hrtime[1] - previousHrtime[1]) / 1e9;
}

module.exports = getSpeed;
