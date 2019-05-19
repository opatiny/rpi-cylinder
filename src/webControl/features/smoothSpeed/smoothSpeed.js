'use strict';

const debug = require('debug')('wc:smoothSpeed'); // wc for web control

/**
 * Returns a speed (in deg/s) smoothed over a defined time span (in ms). Basically an average.
 * @param {object} status parameters used are logs and timeSpan (ms)
 * @returns {number} smoothSpeed, speed smoothed on a defined time span in [degrees/s],
 */
function smoothSpeed(status) {
  let angleDiffSum = status.logs.reduce(
    (sum, value) => sum + value.angleDiff,
    0
  );

  let timeDiff;
  if (status.logs.length > 1) {
    timeDiff =
      (status.logs[status.logs.length - 1].end - status.logs[0].end) / 1000; // converting epoch to seconds
  } else {
    timeDiff = 0;
  }
  debug(`timeDiff\t${timeDiff}`);

  let smoothSpeed = angleDiffSum / timeDiff;
  debug(`smoothSpeed\t${smoothSpeed}`);

  return smoothSpeed;
}

module.exports = smoothSpeed;
