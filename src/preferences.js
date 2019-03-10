'use strict';

var cylinderPrototype = 3;

let RaspiIO = require('raspi-io').RaspiIO;

module.exports = {
  Board: RaspiIO,
  servoPins: [0, 1, 2],
  cylinderPrototype: require('./prefs/cylinderPrototype' + cylinderPrototype)
};
