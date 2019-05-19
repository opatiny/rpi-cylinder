'use strict';

// code that allows the cylinder to remain balanced on a gentle slope (of max 3 degrees).
// The radius of the circle the mass is on (radiusCenter, --r) and if it goes 
// backwards (--d b) or forwards (--d f) are parameters.

const debug = require('debug')('wc:stable'); // wc for web control

/**
 * Basic stabilization function for the cylinder: doesn't work very well. 
 * The cylinder starts increasingly oscillating. The cylinder is supposed 
 * to stabilize around a specific angle (always the same).
 * @param {object} status global object with all the properties 
 *                        (uses inclination.current and inclination.previous)
 * @returns {number} angleCenter in degrees
 */
function basicStab(status) {
  var angleCenter;

  let inclinationDiff =
    status.inclination.current.toPrecision(3) -
    status.inclination.previous.toPrecision(3);
  debug(`inclinationDiff\t${inclinationDiff}`);

  // const maxInclinationDiff = 1.4; // we estimate what it could be to make the servos reaction proportional
  // const proportionalStep = inclinationDiff / 0.75;

  if (inclinationDiff < 0) {
    angleCenter = status.previousAngleCenter - 0.5;
  } else if (inclinationDiff === 0) {
    angleCenter = status.previousAngleCenter;
  } else {
    angleCenter = status.previousAngleCenter + 0.5;
  }
  debug(`angleCenter\t${angleCenter}`);

  return angleCenter;
}

module.exports = basicStab;
