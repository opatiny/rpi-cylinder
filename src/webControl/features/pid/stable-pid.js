'use strict';

// stabilizing the cylinder using a PID algorithm, optimizing the SPEED.
// Based on https://www.npmjs.com/package/node-pid-controller

const debug = require('debug')('wc:stable-pid'); // wc for web control

let Controller = require('./pid-lib');

let controller = new Controller({
  kP: 0.25,
  kI: 0.01,
  kD: 0.01
});


function stable(info, radiusCenter) {
  debug('info', info.targetInclination, info.currentInclination, radiusCenter);
  controller.setTarget(info.targetInclination);
  let correction = controller.update(info.currentInclination);

  debug(info.radiusCenter, correction);

  info.radiusCenter += correction;

  return info.radiusCenter;
}

module.exports = stable;
