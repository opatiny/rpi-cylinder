'use strict';

// converting angle between -180 and 180 degrees to angle between -Infinity and Infinity degrees

const debug = require('debug')('wc:pid/getSpeed'); // wc for web control

function updateAbsoluteAngle(status) {
  let angleDiff = status.inclination.current - status.inclination.previous;
  console.log(angleDiff);

  if (angleDiff > 100) {
    status.absoluteAngle += (angleDiff - 360);
  } else if (angleDiff < -100) {
    status.absoluteAngle += (angleDiff + 360);
  } else {
    status.absoluteAngle += angleDiff;
  }

  debug(status.absoluteAngle);
}

module.exports = updateAbsoluteAngle;
