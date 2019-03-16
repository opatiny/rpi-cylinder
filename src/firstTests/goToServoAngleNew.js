// http://johnny-five.io/examples/servo-PCA9685/
// control of one servo, the code brings it to a given angle (degrees), the angle you give is directly transmitted to the servo

const five = require('johnny-five');
const delay = require('delay');

const {
    cylinderPrototype,
    Board
} = require('../preferences');


var board = new five.Board({
    io: new Board()
});

// Initialize the servo instance
const {
    servo1,
    servo2,
    servo3
} = require('../servoPins.js');
const servos = [servo1, servo2, servo3];

board.on('ready', async function () {
    console.log('Connected');

    const angles = [
        grab('--a1') || grab('--a'), // input angle of servo1 in degree
        grab('--a2') || grab('--a'), // input angle of servo2 in degree
        grab('--a3') || grab('--a') // input servoangle of servo3 in degree
    ]

    let isDefined = false;
    for (let angle of angles) {
        if (angle !== undefined) isDefined = true;
    }

    if (!isDefined) {
        console.log('No data to execute.');
    }

    for (let i = 0; i < angles.length; i++) {
        let angle = angles[i]
        if (angle !== undefined) {
            console.log(angle);
            servos[i].to(angle);
            console.log(`Servo ${i+1} input value of angle is ${angle} degrees.`);
        }

    }

});

function grab(flag) {
    let index = process.argv.indexOf(flag);
    return (index === -1) ? null : process.argv[index + 1];
}