'use strict';

// stabilizing the cylinder using a PID algorithm, optimizing the ANGLE.
// Based on https://www.npmjs.com/package/node-pid-controller

const debug = require('debug')('wc:speed-pid');

const cylinderPrototype = require('../../../preferences').cylinderPrototype;

const maxRadius = cylinderPrototype.maxRadiusCenter;

const Controller = require('./pid-lib');

// parameters to optimize with test-and-trial
let controller = new Controller({
  kP: 0.25,
  kI: 0.005,
  kD: 0.4
});

/**
 * PID algorithm returning radiusCenter for a given target angle.
 * radiusCenter is limited by maxRadius (src/prefs/).
 * @param {object} status pid property is used
 * @returns {number} radiusCenter in [mm]
 */
function anglePID(status) {
  let radiusCenter;

  // hack to make the PID work
  if (
    isNaN(status.pid.currentAngle) |
    (Math.abs(status.pid.currentAngle) === Infinity)
  ) {
    status.pid.currentAngle = 0;
  }

  controller.setTarget(status.pid.targetAngle);

  radiusCenter = controller.update(status.pid.currentAngle);
  debug(`radiusCenter\t${radiusCenter}`);

  if (radiusCenter > maxRadius) {
    radiusCenter = maxRadius;
  } else if (radiusCenter < -maxRadius) {
    radiusCenter = -maxRadius;
  }
  debug(radiusCenter);

  return radiusCenter;
}

module.exports = anglePID;
