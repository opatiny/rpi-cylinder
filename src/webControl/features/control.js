'use strict';

// function that has parameter baseAngle and prefs and returns angleCenter, allows the control of the cylinder.

const debug = require('debug')('wc:control'); // wc for web control

/**
 * Keeping the mass on a line parallel to the ground, at a given radius from the center of the cylinder.
 * @param {number} baseAngle in degrees (angle so the center-mass segment is perpendicular to the ground)
 * @param {object} prefs preferences imported from the web page
 * @returns {number} angleCenter in degrees
 */
function control(baseAngle, prefs) {
  var angleCenter;
  if (prefs.radius < 0) {
    angleCenter = baseAngle - 90;
  } else {
    angleCenter = baseAngle + 90;
  }

  debug(`angleCenter\t${angleCenter}`);
  return angleCenter;
}

module.exports = control;
