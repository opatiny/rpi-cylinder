'use strict';

// stabilizing the cylinder using a PID algorithm, optimizing the ANGULAR SPEED.
// Based on https://www.npmjs.com/package/node-pid-controller

const debug = require('debug')('wc:speed-pid'); // wc for web control

// const cylinderPrototype = require('../../../preferences').cylinderPrototype;

// const maxRadius = cylinderPrototype.maxRadiusCenter;

const maxRadius = 40;

const getSpeed = require('./getSpeed');
const Controller = require('./pid-lib');

// parameters to optimize with test-and-trial
let controller = new Controller({
  kP: 0.05,
  kI: 0.01,
  kD: 0.01
});


/**
 * PID algorithm returning radiusCenter for a given target angular speed
 * @param {object} status
 * @returns {number} radiusCenter in mm
 */
function stable(status) {
  let radiusCenter;

  status.pid.currentSpeed = getSpeed(status.inclination, status.time);

  controller.setTarget(status.pid.targetSpeed);

  let correction = controller.update(status.pid.currentSpeed);
  debug(`correction\t${correction}`);

  radiusCenter = status.pid.previousRadius + correction;
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
