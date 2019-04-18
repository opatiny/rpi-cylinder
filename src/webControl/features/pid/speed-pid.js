'use strict';

// stabilizing the cylinder using a PID algorithm, optimizing the ANGULAR SPEED.
// Based on https://www.npmjs.com/package/node-pid-controller

const debug = require('debug')('wc:speed-pid'); // wc for web control

// const cylinderPrototype = require('../../../preferences').cylinderPrototype;

// const maxRadius = cylinderPrototype.maxRadiusCenter;

const maxRadius = 40;

const getSpeed = require('./getSpeed');
const Controller = require('./pid-lib');

let controller = new Controller({
  kP: 0.25,
  kI: 0.01,
  kD: 0.01
});

/* pid must contain:
    - current speed
    - target speed
    - current radiusCenter

   code returns: new radiusCenter
*/

function stable(status) {
  status.pid.currentSpeed = getSpeed(status.acc.current, status.acc.previous);

  debug({ pid: status.pid });
  controller.setTarget(status.pid.targetSpeed);

  let correction = controller.update(status.pid.currentSpeed);
  debug(status.pid.previousRadius, correction);

  status.radiusCenter = status.pid.previousRadius + correction;

  if (status.radiusCenter > maxRadius) {
    status.radiusCenter = maxRadius;
  } else if (status.radiusCenter < -maxRadius) {
    status.radiusCenter = -maxRadius;
  }
}

module.exports = stable;
