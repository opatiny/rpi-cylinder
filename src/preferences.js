'use strict';

var cylinderPrototype = 3;

module.exports = {
    Board:require('raspi-io').RaspiIO,
    servoPins:[0, 1, 2],
    cylinderPrototype: require('./prefs/cylinderPrototype' + cylinderPrototype)
};
