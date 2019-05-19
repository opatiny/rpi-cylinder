'use strict';

// converting angle between -180 and 180 degrees to angle between -Infinity and Infinity degrees

const debug = require('debug')('wc:absoluteAngle'); // wc for web control

/**
 * Modifies status.absoluteAngle.current: absolute inclination of the cylinder
 * in degrees. Instead of an "oscillating" value between -180 and 180 degrees,
 * the value goes from -Infinity to Infinity.
 * @param {object} status
 */
function updateAbsoluteAngle(status) {
  let angleDiff = status.inclination.current - status.inclination.previous;
  debug(`angleDiff\t${angleDiff}`);

  if (angleDiff > 100) {
    status.absoluteAngle.current += angleDiff - 360;
  } else if (angleDiff < -100) {
    status.absoluteAngle.current += angleDiff + 360;
  } else {
    status.absoluteAngle.current += angleDiff;
  }

  debug(`status.absoluteAngle\t${status.absoluteAngle}`);
}

module.exports = updateAbsoluteAngle;
