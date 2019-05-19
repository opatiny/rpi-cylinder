'use strict';

// stabilizing the cylinder using a PID algorithm, optimizing the ANGULAR SPEED.
// Based on https://www.npmjs.com/package/node-pid-controller

const debug = require('debug')('wc:speed-pid'); // wc for web control

const getSmoothSpeed = require('../smoothSpeed/smoothSpeed');
const cylinderPrototype = require('../../../preferences').cylinderPrototype;

const maxRadius = cylinderPrototype.maxRadiusCenter;

const getSpeed = require('./getSpeed');
const Controller = require('./pid-lib');

// parameters to optimize with test-and-trial
let controller = new Controller({
  kP: 0.05,
  kI: 0.2,
  kD: 0.05
  // dt: 0.1 // in seconds
});

/**
 * PID algorithm returning radiusCenter for a given target angular speed in [degree/s].
 * @param {object} status pid property is used
 * @returns {number} radiusCenter in [mm]
 */
function stable(status) {
  let radiusCenter;

  if (status.smooth) {
    status.pid.currentSpeed = getSmoothSpeed(status);
  } else {
    status.pid.currentSpeed = getSpeed(status.absoluteAngle, status.hrtime);
  }
  debug(`currentSpeed\t${status.pid.currentSpeed}`);

  // hack to make the PID work
  if (
    isNaN(status.pid.currentSpeed) |
    (Math.abs(status.pid.currentSpeed) === Infinity)
  ) {
    status.pid.currentSpeed = 0;
  }

  controller.setTarget(status.pid.targetSpeed);

  let correction = controller.update(status.pid.currentSpeed);
  console.log({ correction });

  radiusCenter = correction;
  debug(`radiusCenter\t${radiusCenter}`);

  if (radiusCenter > maxRadius) {
    radiusCenter = maxRadius;
  } else if (radiusCenter < -maxRadius) {
    radiusCenter = -maxRadius;
  }

  debug(radiusCenter);

  return radiusCenter;
}

module.exports = stable;
