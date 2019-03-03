'use strict';

var cylinderPrototype = 3;

module.exports = {
    Board:require('raspi-io'),
    servoPins:[0, 1, 2],
    cylinderPrototype: require('./prefs/cylinderPrototype' + cylinderPrototype)
};
