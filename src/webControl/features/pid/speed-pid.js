'use strict';

// stabilizing the cylinder using a PID algorithm, optimizing the SPEED.
// Based on https://www.npmjs.com/package/node-pid-controller

const debug = require('debug')('wc:speed-pid'); // wc for web control

const cylinderPrototype = require('../../../preferences.js').cylinderPrototype;

const maxRadius = cylinderPrototype.maxRadiusCenter;

let Controller = require('./pid-lib');

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

function stable(pid) {
  let radiusCenter;

  debug({ pid });
  controller.setTarget(pid.targetSpeed);
  let correction = controller.update(pid.currentSpeed);

  debug(pid.currentRadius, correction);

  radiusCenter = pid.radiusCenter + correction;

  if (radiusCenter > maxRadius) {
    radiusCenter = maxRadius;
  } else if (radiusCenter < -maxRadius) {
    radiusCenter = -maxRadius;
  }

  return pid.radiusCenter;
}

module.exports = stable;
