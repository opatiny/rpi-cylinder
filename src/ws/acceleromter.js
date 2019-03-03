var five = require('johnny-five');
var Board = require('../preferences').Board;


var defaultCallback = function () {
    var result = {
        x: this.x,
        y: this.y,
        z: this.z,
        pitch: this.pitch,
        roll: this.roll,
        acceleration: this.acceleration,
        inclination: this.inclination,
        orientation: this.orientation
    };
    console.log(result);
};

module.exports = function accelerometer(callback = defaultCallback) {
    var board = new five.Board({
        io: new Board()
    });

    board.on('ready', function () {

        var accelerometer = new five.Accelerometer({
            controller: 'MPU6050',
            sensitivity: 16384 // optional
        });

        accelerometer.on('change', callback);
    });
};

